DROP INDEX IF EXISTS "address_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "users" ("address");