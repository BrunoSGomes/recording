CREATE TYPE "public"."planInterval" AS ENUM('MONTH', 'YEAR');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('INACTIVE', 'ACTIVE');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Plan" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"amount" numeric NOT NULL,
	"currency" varchar(3) NOT NULL,
	"interval" "planInterval" NOT NULL,
	"trialPeriod" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Subscription" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"userId" varchar(36) NOT NULL,
	"planId" varchar(36) NOT NULL,
	"status" "status" DEFAULT 'INACTIVE' NOT NULL,
	"startDate" timestamp DEFAULT now() NOT NULL,
	"endDate" timestamp,
	"autoRenew" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_Plan_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
