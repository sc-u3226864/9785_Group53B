// ------ REFERENCES
/** [1]
 * Description:
 * Reference: Better Auth. (n.d.). Next.js integration: Create a client. https://better-auth.com/docs/integrations/next#create-a-client
 */

import { auth } from "../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth); //[1]