import { sql } from 'drizzle-orm';
import { crudPolicy } from './drizzle-orm-neon';
import { pgTable, text, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/neon';

// This is a multi-tenant app.
export const tenants = pgTable('tenants', {
  id: uuid().primaryKey(),
  name: text(),
}, (table) => [
  crudPolicy({
    role: authenticatedRole,
    read: sql`(select auth.session()->>'tenant_id' = ${table.id}::text)`,
    modify: sql`(select auth.session()->>'tenant_id' = ${table.id}::text)`,
  })
]);

export const users = pgTable('users', {
  tenantId: uuid().notNull().references(() => tenants.id),
  id: uuid().primaryKey(),
  name: text(),
  email: text(),
  settings: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
}, (table) => [
  crudPolicy({
    role: authenticatedRole,
    read: sql`(select auth.user_id() = ${table.id}::text)`,
    modify: sql`(select auth.user_id() = ${table.id}::text)`,
  })
]);