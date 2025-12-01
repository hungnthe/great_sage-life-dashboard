import { PrismaClient } from '@prisma/client';
import type { Task, TaskType, TaskStatus, TaskPriority } from '@/types';
import { getCurrentWeekRange } from '@/lib/utils/calculations';

const prisma = new PrismaClient();

/**
 * Tasks Service - CRUD operations for tasks
 * Requirements: 3.1, 2.1
 */

/**
 * Get all tasks for a user
 * Property 1: User data isolation
 */
export async function getTasksByUserId(userId: number): Promise<Task[]> {
  // Use raw query to get new fields not in Prisma client
  const tasks: any[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY 
    CASE priority 
      WHEN 'URGENT' THEN 1 
      WHEN 'HIGH' THEN 2 
      WHEN 'MEDIUM' THEN 3 
      WHEN 'LOW' THEN 4 
    END, 
    due_date ASC`
  );

  return tasks.map(mapPrismaTaskToTask);
}

/**
 * Get today's tasks for a user
 */
export async function getTodayTasks(userId: number): Promise<Task[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await prisma.tasks.findMany({
    where: {
      user_id: userId,
      due_date: {
        gte: today,
        lt: tomorrow,
      },
      status: {
        not: 'DONE',
      },
    },
    orderBy: [
      { priority: 'desc' },
    ],
  });

  return tasks.map(mapPrismaTaskToTask);
}

/**
 * Get tasks completed this week
 * Property 28: Tasks completed this week
 */
export async function getTasksCompletedThisWeek(userId: number): Promise<number> {
  const { start, end } = getCurrentWeekRange();

  const count = await prisma.tasks.count({
    where: {
      user_id: userId,
      status: 'DONE',
      completed_at: {
        gte: start,
        lte: end,
      },
    },
  });

  return count;
}

/**
 * Get a single task by ID
 */
export async function getTaskById(taskId: number): Promise<Task | null> {
  // Use raw query to get new fields not in Prisma client
  const tasks: any[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM tasks WHERE id = ${taskId}`
  );

  if (!tasks || tasks.length === 0) return null;

  return mapPrismaTaskToTask(tasks[0]);
}

/**
 * Create a new task
 */
export async function createTask(data: {
  userId: number;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate?: Date;
  projectId?: number;
}): Promise<Task> {
  const task = await prisma.tasks.create({
    data: {
      user_id: data.userId,
      title: data.title,
      description: data.description || null,
      type: data.type,
      priority: data.priority,
      due_date: data.dueDate || null,
      project_id: data.projectId || null,
      status: 'TODO',
    },
  });

  return mapPrismaTaskToTask(task);
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: number,
  status: TaskStatus
): Promise<Task> {
  const task = await prisma.tasks.update({
    where: {
      id: taskId,
    },
    data: {
      status,
      completed_at: status === 'DONE' ? new Date() : null,
    },
  });

  return mapPrismaTaskToTask(task);
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: number,
  data: {
    title?: string;
    description?: string;
    type?: TaskType;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
    projectId?: number | null;
    result?: string | null;
    requestedBy?: string | null;
  }
): Promise<Task> {
  // Use raw SQL for fields not yet in Prisma client
  if (data.result !== undefined || data.requestedBy !== undefined) {
    const updates: string[] = [];

    if (data.title !== undefined) {
      const escaped = data.title ? `'${data.title.replace(/'/g, "''")}'` : 'NULL';
      updates.push(`title = ${escaped}`);
    }
    if (data.description !== undefined) {
      const escaped = data.description ? `'${data.description.replace(/'/g, "''")}'` : 'NULL';
      updates.push(`description = ${escaped}`);
    }
    if (data.type !== undefined) {
      updates.push(`type = '${data.type}'`);
    }
    if (data.status !== undefined) {
      updates.push(`status = '${data.status}'`);
      const completedAt = data.status === 'DONE' ? `'${new Date().toISOString().slice(0, 19).replace('T', ' ')}'` : 'NULL';
      updates.push(`completed_at = ${completedAt}`);
    }
    if (data.priority !== undefined) {
      updates.push(`priority = '${data.priority}'`);
    }
    if (data.dueDate !== undefined) {
      const dueDate = data.dueDate ? `'${new Date(data.dueDate).toISOString().slice(0, 19).replace('T', ' ')}'` : 'NULL';
      updates.push(`due_date = ${dueDate}`);
    }
    if (data.projectId !== undefined) {
      updates.push(`project_id = ${data.projectId || 'NULL'}`);
    }
    if (data.result !== undefined) {
      const escaped = data.result ? `'${data.result.replace(/'/g, "''")}'` : 'NULL';
      updates.push(`result = ${escaped}`);
    }
    if (data.requestedBy !== undefined) {
      const escaped = data.requestedBy ? `'${data.requestedBy.replace(/'/g, "''")}'` : 'NULL';
      updates.push(`requested_by = ${escaped}`);
    }

    if (updates.length > 0) {
      await prisma.$executeRawUnsafe(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ${taskId}`
      );
    }

    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
    });

    return mapPrismaTaskToTask(task);
  }

  // Fallback to regular update if no new fields
  const updateData: any = {};
  
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.status !== undefined) {
    updateData.status = data.status;
    updateData.completed_at = data.status === 'DONE' ? new Date() : null;
  }
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
  if (data.projectId !== undefined) updateData.project_id = data.projectId;

  const task = await prisma.tasks.update({
    where: {
      id: taskId,
    },
    data: updateData,
  });

  return mapPrismaTaskToTask(task);
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: number): Promise<void> {
  await prisma.tasks.delete({
    where: {
      id: taskId,
    },
  });
}

/**
 * Get tasks by project ID
 */
export async function getTasksByProjectId(projectId: number): Promise<Task[]> {
  const tasks = await prisma.tasks.findMany({
    where: {
      project_id: projectId,
    },
    orderBy: [
      { priority: 'desc' },
      { due_date: 'asc' },
    ],
  });

  return tasks.map(mapPrismaTaskToTask);
}

/**
 * Map Prisma task to Task type
 */
function mapPrismaTaskToTask(prismaTask: any): Task {
  return {
    id: prismaTask.id,
    userId: prismaTask.user_id,
    projectId: prismaTask.project_id,
    title: prismaTask.title,
    description: prismaTask.description,
    type: prismaTask.type as TaskType,
    status: prismaTask.status as TaskStatus,
    priority: prismaTask.priority as TaskPriority,
    dueDate: prismaTask.due_date,
    completedAt: prismaTask.completed_at,
    result: prismaTask.result || null,
    requestedBy: prismaTask.requested_by || null,
    createdAt: prismaTask.created_at,
    updatedAt: prismaTask.updated_at,
  };
}
