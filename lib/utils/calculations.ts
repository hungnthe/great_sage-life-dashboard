import type { Task, Project, StudyItem, StudyLog, HabitLog } from '@/types';

/**
 * Calculate project progress percentage
 * Property 14: Project progress calculation
 * 
 * @param tasks - Array of tasks belonging to the project
 * @returns Progress percentage (0-100) and task counts
 */
export function calculateProjectProgress(tasks: Task[]): {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
} {
  const totalTasks = tasks.length;
  
  if (totalTasks === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      progressPercentage: 0,
    };
  }
  
  // Only count tasks with status DONE as completed
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  return {
    totalTasks,
    completedTasks,
    progressPercentage,
  };
}

/**
 * Calculate total target hours per week from active study items
 * Property 15: Total target hours calculation
 * 
 * @param studyItems - Array of study items
 * @returns Total target hours per week
 */
export function calculateTotalHours(studyItems: StudyItem[]): number {
  return studyItems
    .filter((item) => item.status === 'ACTIVE')
    .reduce((total, item) => {
      return total + (item.targetHoursPerWeek || 0);
    }, 0);
}

/**
 * Calculate total study hours from logs
 * Property 16: Study hours aggregation
 * 
 * @param studyLogs - Array of study logs
 * @returns Total duration hours
 */
export function aggregateStudyHours(studyLogs: StudyLog[]): number {
  return studyLogs.reduce((total, log) => {
    return total + log.durationHours;
  }, 0);
}

/**
 * Calculate study hours for a specific time period
 * 
 * @param studyLogs - Array of study logs
 * @param startDate - Start date of period
 * @param endDate - End date of period
 * @returns Total hours in the period
 */
export function calculateStudyHoursInPeriod(
  studyLogs: StudyLog[],
  startDate: Date,
  endDate: Date
): number {
  const logsInPeriod = studyLogs.filter((log) => {
    const logDate = new Date(log.studyDate);
    return logDate >= startDate && logDate <= endDate;
  });
  
  return aggregateStudyHours(logsInPeriod);
}

/**
 * Calculate current streak for a habit
 * Property 17: Habit streak calculation
 * 
 * @param habitLogs - Array of habit logs sorted by date (most recent first)
 * @returns Current streak count
 */
export function calculateStreak(habitLogs: HabitLog[]): number {
  if (habitLogs.length === 0) return 0;
  
  // Sort logs by date descending (most recent first)
  const sortedLogs = [...habitLogs].sort((a, b) => {
    return new Date(b.logDate).getTime() - new Date(a.logDate).getTime();
  });
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check each day backwards from today
  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].logDate);
    logDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - streak);
    
    if (logDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (logDate.getTime() < expectedDate.getTime()) {
      // Gap in streak, stop counting
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate longest streak for a habit
 * 
 * @param habitLogs - Array of habit logs
 * @returns Longest streak count
 */
export function calculateLongestStreak(habitLogs: HabitLog[]): number {
  if (habitLogs.length === 0) return 0;
  
  // Sort logs by date ascending
  const sortedLogs = [...habitLogs].sort((a, b) => {
    return new Date(a.logDate).getTime() - new Date(b.logDate).getTime();
  });
  
  let longestStreak = 0;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const prevDate = new Date(sortedLogs[i - 1].logDate);
    const currDate = new Date(sortedLogs[i].logDate);
    
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (dayDiff === 1) {
      // Consecutive day
      currentStreak++;
    } else if (dayDiff > 1) {
      // Gap in streak
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
    // If dayDiff === 0, same day, don't increment
  }
  
  return Math.max(longestStreak, currentStreak);
}

/**
 * Calculate habit completion rate for a period
 * Property 18: Habit completion rate
 * 
 * @param habitLogs - Array of habit logs
 * @param totalHabits - Total number of habits to track
 * @param days - Number of days in the period
 * @returns Completion rate as percentage (0-100)
 */
export function calculateCompletionRate(
  habitLogs: HabitLog[],
  totalHabits: number,
  days: number
): number {
  if (totalHabits === 0 || days === 0) return 0;
  
  const expectedLogs = totalHabits * days;
  const actualLogs = habitLogs.length;
  
  return Math.round((actualLogs / expectedLogs) * 100);
}

/**
 * Get start and end of current week (Sunday to Saturday)
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}
