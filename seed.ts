
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { tenants, users } from "./src/db/schema";
import { config } from "dotenv";
import { v4 as uuidv4 } from 'uuid';

config({ path: ".dev.vars" });

// biome-ignore lint/style/noNonNullAssertion: error from neon client is helpful enough to fix
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
	// Create a tenant
	const tenantId = "f330c503-5e9c-46a7-8393-2995aeb03675";
	await db.insert(tenants).values([
		{
			id: tenantId
		}
	]);

	// Create some users
	await db.insert(users).values([
		{
			tenantId: tenantId,
			id: "2e7e25e8-5445-40bd-8f89-dc19bba64faa", // Using same id as the subject in index.ts. This would be shown on hitting /api/users and remaining users are not shown
			name: "Laszlo Cravensworth",
			email: "lazlo@cravensworth.com",
		},
		{
			tenantId: tenantId,
			id: uuidv4(),
			name: "Nadja Antipaxos",
			email: "nadja@antipaxos.com",
		},
		{
			tenantId: tenantId,
			id: uuidv4(),
			name: "Colin Robinson",
			email: "colin@robinson.com"
		},
	]);
}

async function main() {
	try {
		await seed();
		console.log("Seeding completed");
	} catch (error) {
		console.error("Error during seeding:", error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}
main();
