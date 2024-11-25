import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/server/db";

// import { LibsqlDialect } from "@libsql/kysely-libsql";

// const dialect = new LibsqlDialect({
//   url: process.env.DATABASE_URL!,
//   authToken: process.env.DATABASE_TOKEN!,
// });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    },
  },
});
