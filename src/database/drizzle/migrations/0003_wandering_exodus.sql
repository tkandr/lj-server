ALTER TABLE "user_to_quest_tasks" ALTER COLUMN "started_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_to_quest_tasks" ALTER COLUMN "started_at" SET NOT NULL;