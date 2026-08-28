import "dotenv/config";
import postgres from "postgres";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema, logger: true });
//# sourceMappingURL=db.js.map