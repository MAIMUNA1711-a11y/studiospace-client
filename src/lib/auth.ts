import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set in .env.local");

// Dev-e hot reload hole bar bar notun connection na khulte global-e rakhi
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
const client = globalForMongo._mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

const db = client.db(process.env.MONGODB_DB_NAME ?? "studiospace");
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

// Vercel-er alada alada domain (production alias, preview) ke trust kori
const trustedOrigins = new Set<string>([baseURL.replace(/\/+$/, "")]);

[
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
].forEach((host) => {
  if (host) trustedOrigins.add(`https://${host}`);
});

(process.env.EXTRA_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean)
  .forEach((o) => trustedOrigins.add(o));

const googleConfigured =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [...trustedOrigins], // Dynamic trusted origins add kora holo
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // register korle login page-e pathabo
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {},
  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        }),
      },
    }),
    nextCookies(),
  ],
});