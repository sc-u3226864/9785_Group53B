import type { Role } from "../../generated/prisma/client";

declare module "@auth/core/types" {
  interface User {
    role: Role;
  }
}
