CREATE TABLE IF NOT EXISTS "tenants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"tenantId" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"settings" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "tenants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.session()->>'tenant_id' = "tenants"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "tenants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.session()->>'tenant_id' = "tenants"."id"::text)) WITH CHECK ((select auth.session()->>'tenant_id' = "tenants"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "tenants" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.session()->>'tenant_id' = "tenants"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "tenants" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.session()->>'tenant_id' = "tenants"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "users"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "users"."id"::text)) WITH CHECK ((select auth.user_id() = "users"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "users"."id"::text));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "users"."id"::text));