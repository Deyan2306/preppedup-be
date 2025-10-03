CREATE TYPE "public"."membership_plan" AS ENUM('basic', 'pro', 'max');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"name" varchar(50) NOT NULL,
	"surname" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"nationality" varchar(50) NOT NULL,
	"squat" integer DEFAULT 0 NOT NULL,
	"bench" integer DEFAULT 0 NOT NULL,
	"deadlift" integer DEFAULT 0 NOT NULL,
	"membership_plan" "membership_plan" DEFAULT 'basic' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
