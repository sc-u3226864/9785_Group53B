//https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/seeding
//https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d

import "dotenv/config";                            // must come first so env vars are loaded
import prisma from "../app/lib/prisma";
import { auth } from "../app/lib/auth";

async function main() {
  const email = process.env.SEED_CONVENER_EMAIL!.toLowerCase();
  await prisma.user.upsert({                       //upsert allows us to run the seed script multiple times without creating duplicates
    where: { email },
    update: {},  //if user already exists do nothing
    create: { email, name: "Convener", role: "CONVENER" }, //if user doesn't exist create new user with email, name and role
  });
  await auth.api.requestPasswordReset({            // prints the set-password link in the terminal > needs to be copied and stored somewhere for the initial run
    body: { email, redirectTo: `${process.env.BETTER_AUTH_URL}/set-password` }, //https://better-auth.com/docs/authentication/email-password#api-method-request-password-reset
  });
}

main().finally(() => prisma.$disconnect()); //if the script fails or succeeds disconnect from the database to avoid hanging the process