CREATE TABLE IF NOT EXISTS "quest_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"reward" integer NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"logo_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_quest_tasks" (
	"user_id" integer NOT NULL,
	"quest_task_id" integer NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_quests" (
	"user_id" integer NOT NULL,
	"quest_id" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "user_to_quests_user_id_quest_id_pk" PRIMARY KEY("user_id","quest_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login" timestamp with time zone,
	"address" char(42) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_idx" ON "users" ("address");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quest_tasks" ADD CONSTRAINT "quest_tasks_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_quest_tasks" ADD CONSTRAINT "user_to_quest_tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_quest_tasks" ADD CONSTRAINT "user_to_quest_tasks_quest_task_id_quest_tasks_id_fk" FOREIGN KEY ("quest_task_id") REFERENCES "quest_tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_quests" ADD CONSTRAINT "user_to_quests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_quests" ADD CONSTRAINT "user_to_quests_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
