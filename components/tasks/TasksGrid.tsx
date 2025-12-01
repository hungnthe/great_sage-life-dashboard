'use client';

import { TaskCard } from './TaskCard';
import type { Task } from '@/types';

interface TasksGridProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onStatusChange?: (taskId: number, newStatus: Task['status']) => void;
}

/**
 * TasksGrid - Responsive grid layout for tasks
 * Requirements: 21.1, 21.2, 21.3
 */
export function TasksGrid({ tasks, onTaskClick, onStatusChange }: TasksGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={onTaskClick}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
