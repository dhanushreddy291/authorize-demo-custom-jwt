import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { tenants, users } from "./db/schema";
import { SignJWT, JWK } from "jose";

type Bindings = {
  DATABASE_AUTHENTICATED_URL: string;
  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

async function createJWT(privateKey: JWK) {
  // This example demonstrates JWT token creation and signing. When integrating with your application, ensure that the tenant_id and user_id are dynamically adjusted based on the user's session.
  const jwt = await new SignJWT({
    tenant_id: "f330c503-5e9c-46a7-8393-2995aeb03675", // As an example, the tenant id is being hardcoded here
  })
    .setProtectedHeader({ alg: "RS256", kid: "my-key-id" })
    .setSubject("2e7e25e8-5445-40bd-8f89-dc19bba64faa") // As an example, the user id is being hardcoded here
    .setExpirationTime("1h")
    .setIssuedAt()
    .sign(privateKey);

  return jwt;
}

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/token", async (c) => {
  const privateKeyJwk: JWK = JSON.parse(c.env.PRIVATE_KEY);

  const jwt = await createJWT(privateKeyJwk);
  return c.json(jwt);
});

app.get("/.well-known/jwks.json", async (c) => {
  const publicKeyJwk: JWK = JSON.parse(c.env.PUBLIC_KEY);

  const jwks = {
    keys: [publicKeyJwk],
  };
  return c.json(jwks);
});

app.get("/api/users", async (c) => {
  const privateKeyJwk: JWK = JSON.parse(c.env.PRIVATE_KEY);
  const authToken = await createJWT(privateKeyJwk);

  const db = drizzle(neon(c.env.DATABASE_AUTHENTICATED_URL, {
    authToken,
  }));

  return c.json({
    users: await db.select().from(users),
  });
});

app.get("/api/tenants", async (c) => {
  const privateKeyJwk: JWK = JSON.parse(c.env.PRIVATE_KEY);
  const authToken = await createJWT(privateKeyJwk);

  const db = drizzle(neon(c.env.DATABASE_AUTHENTICATED_URL, {
    authToken,
  }));

  return c.json({
    tenants: await db.select().from(tenants),
  });
});

export default app;
