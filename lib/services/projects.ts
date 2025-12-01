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
  // Use raw SQL to get all fields including new ones
  const projects = await prisma.$queryRaw<any[]>`
    SELECT * FROM projects WHERE user_id = ${userId} ORDER BY created_at DESC
  `;

  return projects.map((project) => {
    const completedHours = calculateCompletedHours(project.start_date, project.end_date);
    
    return {
      id: Number(project.id),
      userId: Number(project.user_id),
      name: project.name,
      description: project.description,
      status: project.status as ProjectStatus,
      startDate: project.start_date,
      endDate: project.end_date || null,
      targetHours: Number(project.target_hours) || 0,
      completedHours: completedHours,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  });
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
    result: task.result || null,
    requestedBy: task.requested_by || null,
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
  // Use raw SQL to get all fields including new ones
  const projects = await prisma.$queryRaw<any[]>`
    SELECT * FROM projects WHERE id = ${projectId}
  `;

  if (!projects || projects.length === 0) return null;

  const project = projects[0];

  // Calculate completed hours based on time elapsed
  const completedHours = calculateCompletedHours(project.start_date, project.end_date);

  return {
    id: Number(project.id),
    userId: Number(project.user_id),
    name: project.name,
    description: project.description,
    status: project.status as ProjectStatus,
    startDate: project.start_date,
    endDate: project.end_date || null,
    targetHours: Number(project.target_hours) || 0,
    completedHours: completedHours,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

/**
 * Calculate completed hours based on time elapsed from start_date to now
 * Assumes 8 working hours per day
 */
function calculateCompletedHours(startDate: Date | null, endDate: Date | null): number {
  if (!startDate) return 0;

  const now = new Date();
  const start = new Date(startDate);

  // If project hasn't started yet
  if (now < start) return 0;

  // Calculate days elapsed
  let endPoint = now;
  
  // If there's an end date and we've passed it, use end date as endpoint
  if (endDate) {
    const end = new Date(endDate);
    if (now > end) {
      endPoint = end;
    }
  }

  const daysElapsed = (endPoint.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const hoursElapsed = daysElapsed * 8; // 8 working hours per day

  return Math.max(0, Math.round(hoursElapsed * 10) / 10); // Round to 1 decimal place
}

/**
 * Create a new project
 */
export async function createProject(data: {
  userId: number;
  name: string;
  description?: string;
  targetHours?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<Project> {
  // Format dates for MySQL DATE columns
  const startDateStr = data.startDate ? formatDateForMySQL(data.startDate) : null;
  const endDateStr = data.endDate ? formatDateForMySQL(data.endDate) : null;

  // Use raw SQL to insert with all fields
  await prisma.$executeRawUnsafe(
    `INSERT INTO projects (user_id, name, description, status, start_date, end_date, target_hours, completed_hours, created_at, updated_at)
     VALUES (?, ?, ?, 'ACTIVE', ?, ?, ?, 0, NOW(), NOW())`,
    data.userId,
    data.name,
    data.description || null,
    startDateStr,
    endDateStr,
    data.targetHours || 0
  );

  // Get the newly created project
  const projects = await prisma.$queryRaw<any[]>`
    SELECT * FROM projects WHERE user_id = ${data.userId} ORDER BY id DESC LIMIT 1
  `;

  const project = projects[0];
  const completedHours = calculateCompletedHours(project.start_date, project.end_date);

  return {
    id: Number(project.id),
    userId: Number(project.user_id),
    name: project.name,
    description: project.description,
    status: project.status as ProjectStatus,
    startDate: project.start_date,
    endDate: project.end_date || null,
    targetHours: Number(project.target_hours) || 0,
    completedHours: completedHours,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
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
    targetHours?: number;
    completedHours?: number;
    startDate?: Date | null;
    endDate?: Date | null;
  }
): Promise<Project> {
  // Build SET clause dynamically
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    values.push(data.status);
  }
  if (data.startDate !== undefined) {
    updates.push('start_date = ?');
    // Convert Date to YYYY-MM-DD format for MySQL DATE column
    values.push(data.startDate ? formatDateForMySQL(data.startDate) : null);
  }
  if (data.endDate !== undefined) {
    updates.push('end_date = ?');
    // Convert Date to YYYY-MM-DD format for MySQL DATE column
    values.push(data.endDate ? formatDateForMySQL(data.endDate) : null);
  }
  if (data.targetHours !== undefined) {
    updates.push('target_hours = ?');
    values.push(data.targetHours);
  }
  if (data.completedHours !== undefined) {
    updates.push('completed_hours = ?');
    values.push(data.completedHours);
  }

  // Always update updated_at
  updates.push('updated_at = NOW()');
  values.push(projectId);

  const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
  
  await prisma.$executeRawUnsafe(query, ...values);

  // Fetch and return updated project
  return getProjectById(projectId) as Promise<Project>;
}

/**
 * Format Date object to YYYY-MM-DD string for MySQL DATE column
 */
function formatDateForMySQL(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
      result: task.result || null,
      requestedBy: task.requested_by || null,
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
    // These fields will be null/0 until database is updated and prisma generate is run
    endDate: prismaProject.end_date || null,
    targetHours: Number(prismaProject.target_hours) || 0,
    completedHours: Number(prismaProject.completed_hours) || 0,
    createdAt: prismaProject.created_at,
    updatedAt: prismaProject.updated_at,
    tasks: prismaProject.tasks,
  };
}
