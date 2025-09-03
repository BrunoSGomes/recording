import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756781781974 implements MigrationInterface {
    name = 'Migration1756781781974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Plan_interval_enum" AS ENUM('Day', 'Week', 'Month', 'Year')`);
        await queryRunner.query(`CREATE TABLE "Plan" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying(255), "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "interval" "public"."Plan_interval_enum" NOT NULL, "trialPeriod" integer, CONSTRAINT "PK_2239586f507efc3115f2ebf769b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Subscription_status_enum" AS ENUM('Active', 'Inactive')`);
        await queryRunner.query(`CREATE TABLE "Subscription" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" character varying NOT NULL, "planId" uuid NOT NULL, "status" "public"."Subscription_status_enum" NOT NULL DEFAULT 'Inactive', "startDate" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP, "autoRenew" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_eb0d69496fa84cd24da9fc78edd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Subscription" ADD CONSTRAINT "FK_9cbb1f303cffaca2ca4b782191f" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Subscription" DROP CONSTRAINT "FK_9cbb1f303cffaca2ca4b782191f"`);
        await queryRunner.query(`DROP TABLE "Subscription"`);
        await queryRunner.query(`DROP TYPE "public"."Subscription_status_enum"`);
        await queryRunner.query(`DROP TABLE "Plan"`);
        await queryRunner.query(`DROP TYPE "public"."Plan_interval_enum"`);
    }

}
