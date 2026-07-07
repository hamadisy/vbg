import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationRecipients1783262739852 implements MigrationInterface {
    name = 'NotificationRecipients1783262739852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_recipients" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "phone" varchar NOT NULL, "regionId" varchar, "violenceCategoryId" varchar, "isActive" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "temporary_notification_recipients" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "phone" varchar NOT NULL, "regionId" varchar, "violenceCategoryId" varchar, "isActive" boolean NOT NULL DEFAULT (1), CONSTRAINT "FK_a25acbda047a2a4f6dc1c3dce39" FOREIGN KEY ("regionId") REFERENCES "regions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ba831835061b84e017bb9259678" FOREIGN KEY ("violenceCategoryId") REFERENCES "violence_categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_notification_recipients"("id", "name", "phone", "regionId", "violenceCategoryId", "isActive") SELECT "id", "name", "phone", "regionId", "violenceCategoryId", "isActive" FROM "notification_recipients"`);
        await queryRunner.query(`DROP TABLE "notification_recipients"`);
        await queryRunner.query(`ALTER TABLE "temporary_notification_recipients" RENAME TO "notification_recipients"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_recipients" RENAME TO "temporary_notification_recipients"`);
        await queryRunner.query(`CREATE TABLE "notification_recipients" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "phone" varchar NOT NULL, "regionId" varchar, "violenceCategoryId" varchar, "isActive" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "notification_recipients"("id", "name", "phone", "regionId", "violenceCategoryId", "isActive") SELECT "id", "name", "phone", "regionId", "violenceCategoryId", "isActive" FROM "temporary_notification_recipients"`);
        await queryRunner.query(`DROP TABLE "temporary_notification_recipients"`);
        await queryRunner.query(`DROP TABLE "notification_recipients"`);
    }

}
