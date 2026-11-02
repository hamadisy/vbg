import 'reflect-metadata';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { ImportBraknaCsvModule } from './import-brakna-csv.module';
import { IRegionRepository, REGION_REPOSITORY } from '../../modules/regions/entity/region.repository.port';
import { Region } from '../../modules/regions/entity/region.entity';
import {
  IViolenceCategoryRepository,
  VIOLENCE_CATEGORY_REPOSITORY,
} from '../../modules/violence-categories/entity/violence-category.repository.port';
import {
  IReferralStructureRepository,
  REFERRAL_STRUCTURE_REPOSITORY,
} from '../../modules/referral-structures/entity/referral-structure.repository.port';
import { ReferralStructureType } from '../../modules/referral-structures/entity/enums/referral-structure-type.enum';
import { IUserRepository, USER_REPOSITORY } from '../../modules/users/entity/user.repository.port';
import { UsersService } from '../../modules/users/control/users.service';
import { Role } from '../../common/enums/role.enum';
import { ICaseRepository, CASE_REPOSITORY } from '../../modules/cases/entity/case.repository.port';
import { CaseStatus } from '../../modules/cases/entity/enums/case-status.enum';
import { AgeRange } from '../../modules/cases/entity/enums/age-range.enum';
import { Sex } from '../../modules/cases/entity/enums/sex.enum';
import { RelationshipToPerpetrator } from '../../modules/cases/entity/enums/relationship-to-perpetrator.enum';
import { VulnerabilityFactor } from '../../modules/cases/entity/enums/vulnerability-factor.enum';
import { SafetyRisk } from '../../modules/cases/entity/enums/safety-risk.enum';

// ---------------------------------------------------------------------------
// One-off import of scripts/DONNEES VBG BRAKNA 1 V.csv into the cases table.
// Run with: npm run import:brakna-csv   (from backend/)
//
// Decisions made after reviewing the CSV against the schema (see chat for
// full rationale) - re-running this script is safe, it skips rows already
// tagged with the IMPORT_TAG marker below:
//   - "Mariage Précoce"      -> violence category OTHER
//   - "Refus d'état Civil"   -> violence category CIVIL_DOCUMENT_CONFISCATION
//   - "Refus d'état Charge" / "Refus de Prise en Charge" -> CHILD_ABANDONMENT
//   - "Violence Physique Conjugale" / "Violence Physique (VP)" -> PHYSICAL
//   - "Viol"                -> RAPE
//   - Structure "Etat Civil" has no matching ReferralStructureType, so a new
//     referral_structures row named "Etat Civil" (type social_services) is
//     created per commune that needs one.
//   - Each distinct CSV "Relais" name becomes a real community_relay User,
//     scoped to the right commune, with the shared seed-user placeholder
//     password (see OperationalUsersSeeder) - rotate via the Users admin page.
//   - Risk level "élève" in the source file is a typo for "Élevé" (High) -
//     Low/Medium/High is the only risk scale that exists (safety-risk.enum.ts).
//   - "Relation Auteur" = "Inconnu" has no dedicated enum value, mapped to
//     RelationshipToPerpetrator.Other with perpetratorKnown=false.
//   - cohabitingWithPerpetrator (required, not in the CSV) defaults to true
//     only for "Conjoint" (spouse), false otherwise.
//   - Cases are inserted directly via the repository (bypassing CasesService)
//     so the SMS "new case" notification isn't fired 118 times for backfilled
//     historical data.
// ---------------------------------------------------------------------------

// Override with IMPORT_CSV_PATH if the CSV isn't at the default repo-relative
// location (e.g. a VPS deploy that only ships the backend/ folder).
const CSV_PATH =
  process.env.IMPORT_CSV_PATH ??
  path.join(__dirname, '..', '..', '..', '..', 'scripts', 'DONNEES VBG BRAKNA 1 V.csv');
const IMPORT_TAG = 'Imported from DONNEES VBG BRAKNA 1 V.csv';

interface CsvRow {
  id: string;
  typeDeViolence: string;
  dateIncident: string;
  region: string;
  aliasVictime: string;
  trancheAge: string;
  sexe: string;
  telephone: string;
  relationAuteur: string;
  facteursVulnerabilite: string;
  niveauDeRisque: string;
  description: string;
  structureReference: string;
  relais: string;
}

function parseCsv(filePath: string): CsvRow[] {
  // The source file is cp1252/latin1-encoded (confirmed by byte inspection),
  // not UTF-8 - reading it as utf8 corrupts every accented character.
  const raw = fs.readFileSync(filePath).toString('latin1');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const [, ...dataLines] = lines; // drop header
  return dataLines.map((line) => {
    const f = line.split(';');
    return {
      id: f[0],
      typeDeViolence: f[1],
      dateIncident: f[2],
      region: f[3],
      aliasVictime: f[4],
      trancheAge: f[5],
      sexe: f[6],
      telephone: f[7],
      relationAuteur: f[8],
      facteursVulnerabilite: f[9],
      niveauDeRisque: f[10],
      description: f[11],
      structureReference: f[12],
      relais: f[13],
    };
  });
}

// CSV "Region" is inconsistent: for Brakna-proper rows it only names the
// region, and the actual commune has to be read off the Relais suffix; other
// rows name the commune directly. Mapped onto the communes that already
// exist in `regions` (spellings there differ slightly from the CSV, e.g.
// "Ould Birome" -> "o Birom", "El Vorea" -> "El vorh" - reusing the existing
// rows rather than creating near-duplicate regions).
function resolveMunicipality(row: CsvRow): string {
  if (row.region === 'Brakna') {
    if (row.relais.includes('Babab')) return 'Bababe';
    if (row.relais.includes('Bogh')) return 'Boghé';
    throw new Error(`Row ${row.id}: can't resolve commune for Region=Brakna, Relais="${row.relais}"`);
  }
  if (row.region === 'Dar el Avia') return 'Dar el Avia';
  if (row.region === 'Dar el Barka') return 'Dar el Barka';
  if (row.region === 'Ould Birome') return 'o Birom';
  if (row.region === 'El Vorea') return 'El vorh';
  throw new Error(`Row ${row.id}: unrecognized Region "${row.region}"`);
}

function resolveViolenceCategoryCode(type: string): string {
  if (type === 'Viol') return 'RAPE';
  if (type.includes('Mariage')) return 'OTHER';
  if (type.includes('Physique')) return 'PHYSICAL'; // covers "Conjugale" and "(VP)"
  if (type.includes('Civil')) return 'CIVIL_DOCUMENT_CONFISCATION';
  if (type.includes('Charge')) return 'CHILD_ABANDONMENT'; // "Refus d'état Charge" + "Refus de Prise en Charge"
  throw new Error(`Unmapped "Type de violence": "${type}"`);
}

function resolveAgeRange(v: string): AgeRange {
  return v.includes('Moins de 18') ? AgeRange.Under18 : AgeRange.From18To40;
}

function resolveSex(v: string): Sex {
  if (v === 'Féminin') return Sex.Female;
  if (v === 'Masculin') return Sex.Male;
  throw new Error(`Unmapped "Sexe": "${v}"`);
}

function resolveRisk(v: string): SafetyRisk {
  const upper = v.toUpperCase();
  if (upper.includes('FAIBLE')) return SafetyRisk.Low;
  if (upper.includes('MOYEN')) return SafetyRisk.Medium;
  return SafetyRisk.High; // covers the "élève" typo for "Élevé"
}

function resolveVulnerabilityFactors(v: string): VulnerabilityFactor[] | undefined {
  if (v === 'Aucun' || v.trim() === '') return undefined;
  return [VulnerabilityFactor.DisplacedRefugee]; // only other value in this file is "Déplacé(e) ou réfugié(e)"
}

function resolveRelationship(v: string): {
  relationship: RelationshipToPerpetrator;
  perpetratorKnown: boolean;
  cohabitingWithPerpetrator: boolean;
} {
  if (v === 'Famille') {
    return {
      relationship: RelationshipToPerpetrator.FamilyMember,
      perpetratorKnown: true,
      cohabitingWithPerpetrator: false,
    };
  }
  if (v === 'Conjoint') {
    return {
      relationship: RelationshipToPerpetrator.IntimatePartner,
      perpetratorKnown: true,
      cohabitingWithPerpetrator: true,
    };
  }
  // "Inconnu" - no dedicated enum value for "unknown relationship".
  return {
    relationship: RelationshipToPerpetrator.Other,
    perpetratorKnown: false,
    cohabitingWithPerpetrator: false,
  };
}

function parseDate(ddmmyyyy: string): Date {
  const [d, m, y] = ddmmyyyy.split('/').map((n) => parseInt(n, 10));
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function slugify(s: string): string {
  return stripAccents(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// "Relais commune" is reused as a generic label across three different
// communes in the CSV - treated as three distinct relay users, disambiguated
// by commune, since a User can only be scoped to one region.
function resolveRelayIdentity(relaisRaw: string, municipality: string): { username: string; fullName: string } {
  const label = relaisRaw.trim();
  if (label === 'Relais commune') {
    return {
      username: `relais-commune-${slugify(municipality)}`,
      fullName: `Relais commune (${municipality})`,
    };
  }
  return { username: `relais-${slugify(label.replace(/^Relais\s*/, ''))}`, fullName: label };
}

async function bootstrap() {
  const logger = new Logger('ImportBraknaCsv');
  const app = await NestFactory.createApplicationContext(ImportBraknaCsvModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const dataSource = app.get(DataSource);
    const regionRepo = app.get<IRegionRepository>(REGION_REPOSITORY);
    const categoryRepo = app.get<IViolenceCategoryRepository>(VIOLENCE_CATEGORY_REPOSITORY);
    const structureRepo = app.get<IReferralStructureRepository>(REFERRAL_STRUCTURE_REPOSITORY);
    const userRepo = app.get<IUserRepository>(USER_REPOSITORY);
    const usersService = app.get(UsersService);
    const caseRepo = app.get<ICaseRepository>(CASE_REPOSITORY);
    const configService = app.get(ConfigService);

    // Idempotency guard: skip rows whose tagged measuresTaken already exists.
    const alreadyImported = (await dataSource.query(
      `SELECT measuresTaken FROM cases WHERE measuresTaken LIKE ?`,
      [`${IMPORT_TAG}%`],
    )) as { measuresTaken: string }[];
    const importedRowIds = new Set(
      alreadyImported.map((r) => r.measuresTaken.match(/row (\d+)/)?.[1]).filter(Boolean),
    );
    if (importedRowIds.size > 0) {
      logger.log(`${importedRowIds.size} rows already imported previously - they will be skipped.`);
    }

    logger.log(`Reading CSV from: ${CSV_PATH}`);
    const rows = parseCsv(CSV_PATH);
    logger.log(`Parsed ${rows.length} rows from CSV.`);

    // --- Resolve/create regions (all expected to already exist) ------------
    const allRegions = await regionRepo.findAllFiltered(true);
    const regionByKey = new Map<string, Region>(allRegions.map((r) => [`Brakna|${r.municipality}`, r]));

    const neededMunicipalities = new Set(rows.map((r) => resolveMunicipality(r)));
    for (const municipality of neededMunicipalities) {
      if (!regionByKey.has(`Brakna|${municipality}`)) {
        throw new Error(`Region "Brakna / ${municipality}" not found - expected it to already be seeded.`);
      }
    }

    // --- Resolve violence categories (all expected to already exist) -------
    const neededCodes = new Set(rows.map((r) => resolveViolenceCategoryCode(r.typeDeViolence)));
    const categoryByCode = new Map<string, string>(); // code -> id
    for (const code of neededCodes) {
      const found = await categoryRepo.findByCode(code);
      if (!found) throw new Error(`Violence category "${code}" not found - expected it to already be seeded.`);
      categoryByCode.set(code, found.id);
    }

    // --- Ensure referral structures (Police / Etat Civil) per commune ------
    const structureIdByKey = new Map<string, string>(); // "municipality|Police|Etat Civil" -> structureId
    for (const municipality of neededMunicipalities) {
      const region = regionByKey.get(`Brakna|${municipality}`)!;
      const existing = await structureRepo.findByRegion(region.id);

      let police = existing.find((s) => s.type === ReferralStructureType.Police && s.name === 'Police');
      if (!police) {
        police = await structureRepo.create({ type: ReferralStructureType.Police, name: 'Police', regionId: region.id });
        logger.log(`Created referral structure "Police" for Brakna / ${municipality}`);
      }
      structureIdByKey.set(`${municipality}|Police`, police.id);

      let etatCivil = existing.find((s) => s.name === 'Etat Civil');
      if (!etatCivil) {
        etatCivil = await structureRepo.create({
          type: ReferralStructureType.SocialServices,
          name: 'Etat Civil',
          regionId: region.id,
          translations: [{ locale: 'fr', label: 'Etat Civil' }],
        });
        logger.log(`Created referral structure "Etat Civil" for Brakna / ${municipality}`);
      }
      structureIdByKey.set(`${municipality}|Etat Civil`, etatCivil.id);
    }

    // --- Ensure one community_relay User per distinct (commune, relais) ----
    const seedUserPassword = configService.get<string>('app.seedUser.password')!;
    const relayIdByKey = new Map<string, string>(); // "municipality|relaisRaw" -> userId
    const relayKeys = new Set(rows.map((r) => `${resolveMunicipality(r)}|${r.relais}`));
    for (const key of relayKeys) {
      const [municipality, relaisRaw] = key.split('|');
      const region = regionByKey.get(`Brakna|${municipality}`)!;
      const { username, fullName } = resolveRelayIdentity(relaisRaw, municipality);

      let user = await userRepo.findByUsername(username);
      if (!user) {
        user = await usersService.create({
          fullName,
          username,
          password: seedUserPassword,
          role: Role.CommunityRelay,
          regionId: region.id,
          language: 'fr',
        });
        logger.log(`Created community relay user "${username}" (${fullName}) for Brakna / ${municipality}`);
      }
      relayIdByKey.set(key, user.id);
    }

    // --- Insert cases --------------------------------------------------------
    let created = 0;
    let skipped = 0;
    for (const row of rows) {
      if (importedRowIds.has(row.id)) {
        skipped++;
        continue;
      }

      const municipality = resolveMunicipality(row);
      const categoryCode = resolveViolenceCategoryCode(row.typeDeViolence);
      const { relationship, perpetratorKnown, cohabitingWithPerpetrator } = resolveRelationship(
        row.relationAuteur,
      );

      const createdCase = await caseRepo.create({
        createdById: relayIdByKey.get(`${municipality}|${row.relais}`)!,
        regionId: regionByKey.get(`Brakna|${municipality}`)!.id,
        violenceCategoryId: categoryByCode.get(categoryCode)!,
        incidentAt: parseDate(row.dateIncident),
        description: row.description,
        measuresTaken: `${IMPORT_TAG} (row ${row.id})`,
        referralStructureId: structureIdByKey.get(`${municipality}|${row.structureReference}`)!,
        status: CaseStatus.New,
        victim: {
          alias: row.aliasVictime || undefined,
          ageRange: resolveAgeRange(row.trancheAge),
          sex: resolveSex(row.sexe),
          contactPhone: row.telephone || undefined,
          relationshipToPerpetrator: relationship,
          perpetratorKnown,
          cohabitingWithPerpetrator,
          vulnerabilityFactors: resolveVulnerabilityFactors(row.facteursVulnerabilite),
          safetyRisk: resolveRisk(row.niveauDeRisque),
        },
      });
      // @CreateDateColumn always stamps "now" on insert - this is a historical
      // backfill, so the report date should read as the incident date instead.
      await dataSource.query('UPDATE cases SET createdAt = incidentAt WHERE id = ?', [createdCase.id]);
      created++;
    }

    logger.log(`Done. Created ${created} cases, skipped ${skipped} already-imported rows.`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
