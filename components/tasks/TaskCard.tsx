'use client';

import { BaseCard } from '@/components/shared/BaseCard';
import { Badge } from '@/components/shared/Badge';
import { StatusIndicator, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@/components/shared/StatusIndicator';
import type { Task } from '@/types';
import { formatDate } from '@/lib/utils/formatting';
import { Calendar, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  onStatusChange?: (taskId: number, newStatus: Task['status']) => void;
}

/**
 * TaskCard - Display task with priority, status, due date
 * Requirements: 3.2, 4.1, 4.2, 4.3, 4.4, 4.5
 * Property 2: Required fields rendering
 */
export function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  const handleStatusChange = (e: React.MouseEvent, newStatus: Task['status']) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  // Determine due date color
  const getDueDateColor = () => {
    if (!task.dueDate) return 'text-gray-500';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today) return 'text-red-600 font-semibold';
    if (dueDate.getTime() === today.getTime()) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  const getTypeVariant = (type: Task['type']): 'blue' | 'green' | 'purple' => {
    switch (type) {
      case 'DAILY': return 'blue';
      case 'MAIN': return 'green';
      case 'OTHER': return 'purple';
    }
  };

  return (
    <BaseCard 
      onClick={handleClick} 
      hoverable={true}
      className="transition-all duration-200 hover:shadow-lg border-l-4 border-l-cyan-500"
    >
      <div className="space-y-4">
        {/* Header: Title and Type Badge */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-xl text-gray-900 flex-1 leading-tight">
            {task.title}
          </h3>
          <Badge 
            label={task.type} 
            variant={getTypeVariant(task.type)}
            size="sm"
          />
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-base text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer: Status, Priority, Due Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <StatusIndicator 
              status={task.status}
              colorMap={TASK_STATUS_COLORS}
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <StatusIndicator 
              status={task.priority}
              colorMap={TASK_PRIORITY_COLORS}
              size="sm"
            />
            
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-sm ${getDueDateColor()}`}>
                <Calendar size={16} />
                <span>{formatDate(task.dueDate, 'relative')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {onStatusChange && task.status !== 'DONE' && (
          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={(e) => handleStatusChange(e, 'DONE')}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
            >
              <Clock size={16} />
              Đánh dấu hoàn thành
            </button>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
