import type {
  Task,
  TaskPriority,
  Project,
  ProjectStatus,
  StudyItem,
  StudyItemStatus,
  StudySchedule,
} from '@/types';

// Priority order mapping (higher number = higher priority)
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

// Project status order
const PROJECT_STATUS_ORDER: Record<ProjectStatus, number> = {
  ACTIVE: 1,
  ON_HOLD: 2,
  COMPLETED: 3,
  ARCHIVED: 4,
};

// Study item status order
const STUDY_STATUS_ORDER: Record<StudyItemStatus, number> = {
  ACTIVE: 1,
  COMPLETED: 2,
  DROPPED: 3,
};

/**
 * Sort tasks by priority (URGENT > HIGH > MEDIUM > LOW) and then by due date (earliest first)
 * Property 3: Priority-based task sorting
 */
export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // First, sort by priority (descending)
    const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // If priorities are equal, sort by due date (ascending, nulls last)
    if (a.dueDate === null && b.dueDate === null) return 0;
    if (a.dueDate === null) return 1;
    if (b.dueDate === null) return -1;
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

/**
 * Sort projects by status (ACTIVE > ON_HOLD > COMPLETED > ARCHIVED)
 * Property 4: Status-based project sorting
 */
export function sortByStatus(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    return PROJECT_STATUS_ORDER[a.status] - PROJECT_STATUS_ORDER[b.status];
  });
}

/**
 * Sort study items by status (ACTIVE > COMPLETED > DROPPED)
 * Property 5: Status-based study item sorting
 */
export function sortStudyItemsByStatus(items: StudyItem[]): StudyItem[] {
  return [...items].sort((a, b) => {
    return STUDY_STATUS_ORDER[a.status] - STUDY_STATUS_ORDER[b.status];
  });
}

/**
 * Sort items by date (descending - most recent first)
 * Property 6: Date-based sorting
 */
export function sortByDate<T extends { createdAt?: Date; updatedAt?: Date }>(
  items: T[],
  dateField: 'createdAt' | 'updatedAt' = 'createdAt'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = a[dateField] ? new Date(a[dateField] as Date).getTime() : 0;
    const dateB = b[dateField] ? new Date(b[dateField] as Date).getTime() : 0;
    return dateB - dateA; // Descending order
  });
}

/**
 * Sort study schedules by start time within a day
 * Property 7: Time-based schedule sorting
 */
export function sortByTime(schedules: StudySchedule[]): StudySchedule[] {
  return [...schedules].sort((a, b) => {
    // Compare start times (HH:mm format)
    return a.startTime.localeCompare(b.startTime);
  });
}

/**
 * Group study schedules by day of week and sort by time within each day
 */
export function groupAndSortSchedulesByDay(
  schedules: StudySchedule[]
): Record<number, StudySchedule[]> {
  const grouped: Record<number, StudySchedule[]> = {};
  
  // Initialize all days (0-6)
  for (let i = 0; i < 7; i++) {
    grouped[i] = [];
  }
  
  // Group by day
  schedules.forEach((schedule) => {
    grouped[schedule.dayOfWeek].push(schedule);
  });
  
  // Sort each day's schedules by time
  Object.keys(grouped).forEach((day) => {
    grouped[Number(day)] = sortByTime(grouped[Number(day)]);
  });
  
  return grouped;
}
