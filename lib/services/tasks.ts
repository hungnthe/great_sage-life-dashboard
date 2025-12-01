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
  const tasks = await prisma.tasks.findMany({
    where: {
      user_id: userId,
    },
    orderBy: [
      { priority: 'desc' },
      { due_date: 'asc' },
    ],
  });

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
  const task = await prisma.tasks.findUnique({
    where: {
      id: taskId,
    },
    include: {
      projects: true,
    },
  });

  if (!task) return null;

  return mapPrismaTaskToTask(task);
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
  }
): Promise<Task> {
  const task = await prisma.tasks.update({
    where: {
      id: taskId,
    },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.status,
      priority: data.priority,
      due_date: data.dueDate,
      project_id: data.projectId,
      completed_at: data.status === 'DONE' ? new Date() : undefined,
    },
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
    createdAt: prismaTask.created_at,
    updatedAt: prismaTask.updated_at,
  };
}
