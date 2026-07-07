import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterDataIsActive1783259949246 implements MigrationInterface {
    name = 'MasterDataIsActive1783259949246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_regions" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "municipality" varchar NOT NULL, "village" varchar, "isActive" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_regions"("id", "name", "municipality", "village") SELECT "id", "name", "municipality", "village" FROM "regions"`);
        await queryRunner.query(`DROP TABLE "regions"`);
        await queryRunner.query(`ALTER TABLE "temporary_regions" RENAME TO "regions"`);
        await queryRunner.query(`CREATE TABLE "temporary_referral_structures" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar CHECK( "type" IN ('police','gendarmerie','social_services','health_center') ) NOT NULL, "name" varchar NOT NULL, "regionId" varchar NOT NULL, "contactPhone" varchar, "contactEmail" varchar, "isActive" boolean NOT NULL DEFAULT (1), CONSTRAINT "FK_415e6c033a2acc007bda6be4737" FOREIGN KEY ("regionId") REFERENCES "regions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_referral_structures"("id", "type", "name", "regionId", "contactPhone", "contactEmail") SELECT "id", "type", "name", "regionId", "contactPhone", "contactEmail" FROM "referral_structures"`);
        await queryRunner.query(`DROP TABLE "referral_structures"`);
        await queryRunner.query(`ALTER TABLE "temporary_referral_structures" RENAME TO "referral_structures"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_structures" RENAME TO "temporary_referral_structures"`);
        await queryRunner.query(`CREATE TABLE "referral_structures" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar CHECK( "type" IN ('police','gendarmerie','social_services','health_center') ) NOT NULL, "name" varchar NOT NULL, "regionId" varchar NOT NULL, "contactPhone" varchar, "contactEmail" varchar, CONSTRAINT "FK_415e6c033a2acc007bda6be4737" FOREIGN KEY ("regionId") REFERENCES "regions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "referral_structures"("id", "type", "name", "regionId", "contactPhone", "contactEmail") SELECT "id", "type", "name", "regionId", "contactPhone", "contactEmail" FROM "temporary_referral_structures"`);
        await queryRunner.query(`DROP TABLE "temporary_referral_structures"`);
        await queryRunner.query(`ALTER TABLE "regions" RENAME TO "temporary_regions"`);
        await queryRunner.query(`CREATE TABLE "regions" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "municipality" varchar NOT NULL, "village" varchar)`);
        await queryRunner.query(`INSERT INTO "regions"("id", "name", "municipality", "village") SELECT "id", "name", "municipality", "village" FROM "temporary_regions"`);
        await queryRunner.query(`DROP TABLE "temporary_regions"`);
    }

}
