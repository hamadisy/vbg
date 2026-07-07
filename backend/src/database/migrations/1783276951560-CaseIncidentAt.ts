import { MigrationInterface, QueryRunner } from "typeorm";

export class CaseIncidentAt1783276951560 implements MigrationInterface {
    name = 'CaseIncidentAt1783276951560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_cases" ("id" varchar PRIMARY KEY NOT NULL, "createdById" varchar NOT NULL, "regionId" varchar NOT NULL, "violenceCategoryId" varchar NOT NULL, "description" text NOT NULL, "measuresTaken" text, "referralStructureId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('new','acknowledged','in_process','closed') ) NOT NULL DEFAULT ('new'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "incidentAt" datetime, CONSTRAINT "FK_00b4ebfa92b9649e37ded959fe5" FOREIGN KEY ("referralStructureId") REFERENCES "referral_structures" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_59ebf9508efd5426a6538742eb1" FOREIGN KEY ("violenceCategoryId") REFERENCES "violence_categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_82b9ac19a37c72a61144e8e31e0" FOREIGN KEY ("regionId") REFERENCES "regions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5983985ad937d07488a0445cf04" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cases"("id", "createdById", "regionId", "violenceCategoryId", "description", "measuresTaken", "referralStructureId", "status", "createdAt", "updatedAt") SELECT "id", "createdById", "regionId", "violenceCategoryId", "description", "measuresTaken", "referralStructureId", "status", "createdAt", "updatedAt" FROM "cases"`);
        await queryRunner.query(`DROP TABLE "cases"`);
        await queryRunner.query(`ALTER TABLE "temporary_cases" RENAME TO "cases"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cases" RENAME TO "temporary_cases"`);
        await queryRunner.query(`CREATE TABLE "cases" ("id" varchar PRIMARY KEY NOT NULL, "createdById" varchar NOT NULL, "regionId" varchar NOT NULL, "violenceCategoryId" varchar NOT NULL, "description" text NOT NULL, "measuresTaken" text, "referralStructureId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('new','acknowledged','in_process','closed') ) NOT NULL DEFAULT ('new'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_00b4ebfa92b9649e37ded959fe5" FOREIGN KEY ("referralStructureId") REFERENCES "referral_structures" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_59ebf9508efd5426a6538742eb1" FOREIGN KEY ("violenceCategoryId") REFERENCES "violence_categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_82b9ac19a37c72a61144e8e31e0" FOREIGN KEY ("regionId") REFERENCES "regions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5983985ad937d07488a0445cf04" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cases"("id", "createdById", "regionId", "violenceCategoryId", "description", "measuresTaken", "referralStructureId", "status", "createdAt", "updatedAt") SELECT "id", "createdById", "regionId", "violenceCategoryId", "description", "measuresTaken", "referralStructureId", "status", "createdAt", "updatedAt" FROM "temporary_cases"`);
        await queryRunner.query(`DROP TABLE "temporary_cases"`);
    }

}
