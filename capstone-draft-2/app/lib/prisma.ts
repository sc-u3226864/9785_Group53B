// ------ REFERENCES
/** [1]
 * Description: followed instructions for a global prisma client so there's a shared connection across the app and it doesn't generate multiple database connections
 * Reference: Prisma. (n.d.). How to use Prisma ORM and Prisma Postgres with Better Auth and Next.js: Set up a global Prisma client. Prisma Documentation. https://www.prisma.io/docs/guides/authentication/better-auth/nextjs#24-set-up-a-global-prisma-client
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as { //[1]
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;