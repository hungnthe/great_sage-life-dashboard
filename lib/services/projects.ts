import { PrismaClient } from '@prisma/client';
import type { Project, ProjectWithStats, ProjectStatus } from '@/types';
import { calculateProjectProgress } from '@/lib/utils/calculations';
import { getTasksByProjectId } from './tasks';

const prisma = new PrismaClient();

/**
 * Projects Service - CRUD operations for projects
 * Requirements: 5.1, 6.1, 6.2, 2.4
 */

/**
 * Get all projects for a user
 * Property 1: User data isolation
 */
export async function getProjectsByUserId(userId: number): Promise<Project[]> {
  const projects = await prisma.projects.findMany({
    where: {
      user_id: userId,
    },
    include: {
      tasks: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return projects.map(mapPrismaProjectToProject);
}

/**
 * Get project with statistics
 * Property 14: Project progress calculation
 */
export async function getProjectWithStats(projectId: number): Promise<ProjectWithStats | null> {
  const project = await prisma.projects.findUnique({
    where: {
      id: projectId,
    },
    include: {
      tasks: true,
    },
  });

  if (!project) return null;

  const tasks = project.tasks.map((task: any) => ({
    id: task.id,
    userId: task.user_id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    type: task.type,
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    completedAt: task.completed_at,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  }));

  const { totalTasks, completedTasks, progressPercentage } = calculateProjectProgress(tasks);

  return {
    ...mapPrismaProjectToProject(project),
    totalTasks,
    completedTasks,
    progressPercentage,
  };
}

/**
 * Get active projects count
 * Property 29: Active projects count
 */
export async function getActiveProjectsCount(userId: number): Promise<number> {
  const count = await prisma.projects.count({
    where: {
      user_id: userId,
      status: 'ACTIVE',
    },
  });

  return count;
}

/**
 * Get a single project by ID
 */
export async function getProjectById(projectId: number): Promise<Project | null> {
  const project = await prisma.projects.findUnique({
    where: {
      id: projectId,
    },
    include: {
      tasks: true,
    },
  });

  if (!project) return null;

  return mapPrismaProjectToProject(project);
}

/**
 * Create a new project
 */
export async function createProject(data: {
  userId: number;
  name: string;
  description?: string;
  startDate?: Date;
}): Promise<Project> {
  const project = await prisma.projects.create({
    data: {
      user_id: data.userId,
      name: data.name,
      description: data.description || null,
      start_date: data.startDate || null,
      status: 'ACTIVE',
    },
  });

  return mapPrismaProjectToProject(project);
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: number,
  data: {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: Date | null;
  }
): Promise<Project> {
  const project = await prisma.projects.update({
    where: {
      id: projectId,
    },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
      start_date: data.startDate,
    },
  });

  return mapPrismaProjectToProject(project);
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: number): Promise<void> {
  await prisma.projects.delete({
    where: {
      id: projectId,
    },
  });
}

/**
 * Get all projects with stats for a user
 */
export async function getProjectsWithStats(userId: number): Promise<ProjectWithStats[]> {
  const projects = await prisma.projects.findMany({
    where: {
      user_id: userId,
    },
    include: {
      tasks: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return projects.map((project) => {
    const tasks = project.tasks.map((task: any) => ({
      id: task.id,
      userId: task.user_id,
      projectId: task.project_id,
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    const { totalTasks, completedTasks, progressPercentage } = calculateProjectProgress(tasks);

    return {
      ...mapPrismaProjectToProject(project),
      totalTasks,
      completedTasks,
      progressPercentage,
    };
  });
}

/**
 * Map Prisma project to Project type
 */
function mapPrismaProjectToProject(prismaProject: any): Project {
  return {
    id: prismaProject.id,
    userId: prismaProject.user_id,
    name: prismaProject.name,
    description: prismaProject.description,
    status: prismaProject.status as ProjectStatus,
    startDate: prismaProject.start_date,
    createdAt: prismaProject.created_at,
    updatedAt: prismaProject.updated_at,
    tasks: prismaProject.tasks,
  };
}
