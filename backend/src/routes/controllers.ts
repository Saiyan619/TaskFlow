import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { taskTable } from "../db/schema";
import z from "zod";
const idSchema = z.string().uuid();
const updateTaskSchema = z.object({
    title: z.string().min(1).max(256).optional(),
    description: z.string().nullable().optional(),
    status: z.enum(["TODO", "IN-PROGRESS", "COMPLETED"]).optional(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    dueDate: z.coerce.date().nullable().optional(),
}).refine((task) => Object.keys(task).length > 0, {
    message: "At least one task field is required",
});

export const createTask = async(req: Request, res: Response) => {
    try {
        console.log(req.body);
    const [task] = await db.insert(taskTable).values({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
    }).returning();
    res.status(201).json(task)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({message: error.message});
    }

}

export const getAllTasks = async(req: Request, res: Response) => {
    try {
        const tasks = await db.select().from(taskTable);
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to fetch tasks"});
    }
}

export const getTaskById = async(req: Request, res: Response) => {
    try {
        const result = idSchema.safeParse(req.params.id);
        if (!result.success) {
            res.status(400).json({message: "Invalid task ID"});
            return;
        }
        const id = result.data;
        const [task] = await db.select().from(taskTable).where(eq(taskTable.id, id));

        if (!task) {
            res.status(404).json({message: "Task not found"});
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to fetch task"});
    }
}

export const updateTask = async(req: Request, res: Response) => {
    try {
        const idResult = idSchema.safeParse(req.params.id);
        if (!idResult.success) {
            res.status(400).json({message: "Invalid task ID"});
            return;
        }

        const taskResult = updateTaskSchema.safeParse(req.body);
        if (!taskResult.success) {
            res.status(400).json({message: taskResult.error.issues[0]?.message ?? "Invalid task data"});
            return;
        }

        const [task] = await db
            .update(taskTable)
            .set(taskResult.data)
            .where(eq(taskTable.id, idResult.data))
            .returning();

        if (!task) {
            res.status(404).json({message: "Task not found"});
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to update task"});
    }
}

export const deleteTask = async(req: Request, res: Response) => {
    try {
        const idResult = idSchema.safeParse(req.params.id);
        if (!idResult.success) {
            res.status(400).json({message: "Invalid task ID"});
            return;
        }

        const [task] = await db
            .delete(taskTable)
            .where(eq(taskTable.id, idResult.data))
            .returning({id: taskTable.id});

        if (!task) {
            res.status(404).json({message: "Task not found"});
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to delete task"});
    }
}