import "dotenv/config";
import postgres from "postgres";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/postgres-js";


const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, {schema, logger:true})