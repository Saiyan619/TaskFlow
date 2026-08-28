import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
export const statusEnum = pgEnum("statusEnum", ["TODO", "IN-PROGRESS", "COMPLETED"]);
export const priorityEnum = pgEnum("priorityEnum", ["HIGH", "MEDIUM", "LOW"]);
export const taskTable = pgTable("task", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    status: statusEnum("status").default("TODO").notNull(),
    priority: priorityEnum("priority").default("MEDIUM").notNull(),
    dueDate: timestamp("dueDate", { mode: 'date' }),
    createdAt: timestamp("createdAt").defaultNow().notNull()
});
//# sourceMappingURL=schema.js.map