import { MigrationInterface, QueryRunner } from "typeorm";

export class AgeRangeBuckets1783547022142 implements MigrationInterface {
    name = 'AgeRangeBuckets1783547022142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_victims" ("id" varchar PRIMARY KEY NOT NULL, "caseId" varchar NOT NULL, "alias" varchar, "ageRange" varchar CHECK( "ageRange" IN ('under_18','18_40','over_40') ) NOT NULL, "sex" varchar CHECK( "sex" IN ('female','male','other') ) NOT NULL, "contactPhone" varchar, "relationshipToPerpetrator" varchar CHECK( "relationshipToPerpetrator" IN ('family_member','intimate_partner','acquaintance','stranger','authority_figure','other') ) NOT NULL, "perpetratorKnown" boolean NOT NULL, "cohabitingWithPerpetrator" boolean NOT NULL, "vulnerabilityFactors" text, "safetyRisk" varchar CHECK( "safetyRisk" IN ('low','medium','high') ) NOT NULL, CONSTRAINT "REL_3bf4b3b353327d5754723ffce1" UNIQUE ("caseId"), CONSTRAINT "FK_3bf4b3b353327d5754723ffce16" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_victims"("id", "caseId", "alias", "ageRange", "sex", "contactPhone", "relationshipToPerpetrator", "perpetratorKnown", "cohabitingWithPerpetrator", "vulnerabilityFactors", "safetyRisk") SELECT "id", "caseId", "alias", CASE "ageRange" WHEN 'under_12' THEN 'under_18' WHEN '12_17' THEN 'under_18' WHEN '18_25' THEN '18_40' WHEN '26_40' THEN '18_40' WHEN '41_60' THEN 'over_40' WHEN 'over_60' THEN 'over_40' ELSE "ageRange" END, "sex", "contactPhone", "relationshipToPerpetrator", "perpetratorKnown", "cohabitingWithPerpetrator", "vulnerabilityFactors", "safetyRisk" FROM "victims"`);
        await queryRunner.query(`DROP TABLE "victims"`);
        await queryRunner.query(`ALTER TABLE "temporary_victims" RENAME TO "victims"`);
    }

    // Reverse remap is lossy: the old 6-bucket scheme can't be recovered from
    // the new 3-bucket one, so each new bucket maps to one representative old value.
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "victims" RENAME TO "temporary_victims"`);
        await queryRunner.query(`CREATE TABLE "victims" ("id" varchar PRIMARY KEY NOT NULL, "caseId" varchar NOT NULL, "alias" varchar, "ageRange" varchar CHECK( "ageRange" IN ('under_12','12_17','18_25','26_40','41_60','over_60') ) NOT NULL, "sex" varchar CHECK( "sex" IN ('female','male','other') ) NOT NULL, "contactPhone" varchar, "relationshipToPerpetrator" varchar CHECK( "relationshipToPerpetrator" IN ('family_member','intimate_partner','acquaintance','stranger','authority_figure','other') ) NOT NULL, "perpetratorKnown" boolean NOT NULL, "cohabitingWithPerpetrator" boolean NOT NULL, "vulnerabilityFactors" text, "safetyRisk" varchar CHECK( "safetyRisk" IN ('low','medium','high') ) NOT NULL, CONSTRAINT "REL_3bf4b3b353327d5754723ffce1" UNIQUE ("caseId"), CONSTRAINT "FK_3bf4b3b353327d5754723ffce16" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "victims"("id", "caseId", "alias", "ageRange", "sex", "contactPhone", "relationshipToPerpetrator", "perpetratorKnown", "cohabitingWithPerpetrator", "vulnerabilityFactors", "safetyRisk") SELECT "id", "caseId", "alias", CASE "ageRange" WHEN 'under_18' THEN '12_17' WHEN '18_40' THEN '18_25' WHEN 'over_40' THEN '41_60' ELSE "ageRange" END, "sex", "contactPhone", "relationshipToPerpetrator", "perpetratorKnown", "cohabitingWithPerpetrator", "vulnerabilityFactors", "safetyRisk" FROM "temporary_victims"`);
        await queryRunner.query(`DROP TABLE "temporary_victims"`);
    }

}
