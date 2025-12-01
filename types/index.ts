// Core Types for Great Sage System

// ============================================
// User Types
// ============================================
export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Task Types
// ============================================
export type TaskType = 'DAILY' | 'MAIN' | 'OTHER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  userId: number;
  projectId: number | null;
  title: string;
  description: string | null;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Project Types
// ============================================
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';

export interface Project {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface ProjectWithStats extends Project {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

// ============================================
// Study Item Types
// ============================================
export type StudyItemType = 'SUBJECT' | 'COURSE' | 'SELF';
export type StudyItemStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED';

export interface StudyItem {
  id: number;
  userId: number;
  type: StudyItemType;
  platform: string | null;
  url: string | null;
  status: StudyItemStatus;
  targetHoursPerWeek: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Study Schedule Types
// ============================================
export interface StudySchedule {
  id: number;
  userId: number;
  studyItemId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  studyItem?: StudyItem;
}

// ============================================
// Study Log Types
// ============================================
export interface StudyLog {
  id: number;
  userId: number;
  studyItemId: number;
  studyDate: Date;
  durationHours: number;
  topic: string | null;
  note: string | null;
  createdAt: Date;
  studyItem?: StudyItem;
}

// ============================================
// Habit Types
// ============================================
export interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  targetValue: number | null;
  unit: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitLog {
  id: number;
  userId: number;
  habitId: number;
  logDate: Date;
  value: number | null;
  note: string | null;
  createdAt: Date;
  habit?: Habit;
}

export interface HabitWithStreak extends Habit {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
}

// ============================================
// Quick Note Types
// ============================================
export interface QuickNote {
  id: number;
  userId: number;
  title: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Bookmark Types
// ============================================
export type BookmarkSourceType = 'YOUTUBE' | 'SPOTIFY' | 'ARTICLE' | 'TUTORIAL' | 'OTHER';

export interface Bookmark {
  id: number;
  userId: number;
  title: string;
  url: string;
  sourceType: BookmarkSourceType;
  category: string | null;
  note: string | null;
  createdAt: Date;
}

// ============================================
// Dashboard Types
// ============================================
export interface DashboardStats {
  tasksCompletedThisWeek: number;
  studyHoursThisWeek: number;
  habitCompletionRate: number;
  activeProjectsCount: number;
  todayTasks: Task[];
  todayHabits: HabitWithStreak[];
  upcomingStudySessions: StudySchedule[];
}

// ============================================
// Component Props Types
// ============================================
export interface BaseCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export interface BadgeProps {
  label: string;
  variant: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray' | 'orange';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface StatusIndicatorProps {
  status: string;
  colorMap: Record<string, string>;
  size?: 'sm' | 'md' | 'lg';
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
}

export interface FilterControlsProps {
  searchPlaceholder: string;
  onSearchChange: (query: string) => void;
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: string) => void;
  onClearFilters: () => void;
}
