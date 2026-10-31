// ------ REFERENCES
/** [1]
 * Description: this resource helped with seeding a convener, and understanding how seeding works
 * Reference: Prisma. (n.d.). Seeding (Prisma ORM v7). Prisma Documentation. https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/seeding
 */
/** [2]
 * Description: prompt that helped with setting up the file and resources
 * Reference: Anthropic. (2026). Claude [Large language model]. https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d
 */
/** [3]
 * Description: better auth password request called for initial convener password setup
 * Reference: Better Auth. (n.d.). Email & password: API method request password reset. https://better-auth.com/docs/authentication/email-password#api-method-request-password-reset
 */

import "dotenv/config";                            // must come first so env vars are loaded
import prisma from "../app/lib/prisma";
import { auth } from "../app/lib/auth";

async function main() { //[1] [2]
  const email = process.env.SEED_CONVENER_EMAIL!.toLowerCase();
  await prisma.user.upsert({                       //upsert allows us to run the seed script multiple times without creating duplicates
    where: { email },
    update: {},  //if user already exists do nothing
    create: { email, name: "Convener", role: "CONVENER" }, //if user doesn't exist create new user with email, name and role
  });
  await auth.api.requestPasswordReset({            // prints the set-password link in the terminal > needs to be copied and stored somewhere for the initial run
    body: { email, redirectTo: `${process.env.BETTER_AUTH_URL}/set-password` }, //[3]
  });
}

main().finally(() => prisma.$disconnect()); //if the script fails or succeeds disconnect from the database to avoid hanging the process