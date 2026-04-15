ALTER TABLE "organization_memberships" ADD COLUMN "approved_at" timestamp with time zone;
UPDATE "organization_memberships"
SET "approved_at" = COALESCE("approved_at", "created_at");
