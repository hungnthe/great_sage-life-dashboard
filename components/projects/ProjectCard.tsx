'use client';

import { BaseCard } from '@/components/shared/BaseCard';
import { StatusIndicator, PROJECT_STATUS_COLORS } from '@/components/shared/StatusIndicator';
import type { Project } from '@/types';
import { formatDate } from '@/lib/utils/formatting';
import { Calendar, Target } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

/**
 * ProjectCard - Display project with progress and status
 */
export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  // Calculate progress based on completed hours vs target hours
  const calculateProgress = () => {
    return project.targetHours > 0 
      ? Math.min(100, Math.round((project.completedHours / project.targetHours) * 100))
      : 0;
  };

  const progress = calculateProgress();
  
  // Get status label in Vietnamese
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'ACTIVE': 'hoạt động',
      'ON_HOLD': 'tạm dừng',
      'COMPLETED': 'hoàn thành',
      'ARCHIVED': 'lưu trữ'
    };
    return labels[status] || status;
  };

  // Determine due date color
  const getDueDateColor = () => {
    if (!project.endDate) return 'text-gray-500';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(project.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    if (endDate < today && project.status === 'ACTIVE') return 'text-red-600 font-semibold';
    if (endDate.getTime() === today.getTime()) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <BaseCard 
      onClick={handleClick} 
      hoverable={true}
      className="transition-all duration-200 hover:shadow-lg border-l-4 border-l-purple-500"
    >
      <div className="space-y-4">
        {/* Header: Title */}
        <div>
          <h3 className="font-semibold text-xl text-gray-900 leading-tight">
            {project.name}
          </h3>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-base text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        {project.status === 'ACTIVE' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tiến độ</span>
              <span className="font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target size={14} />
              <span>{project.completedHours}h / {project.targetHours}h</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Target size={14} />
            <span className="font-medium">Dự án đang {getStatusLabel(project.status)}</span>
          </div>
        )}

        {/* Footer: Status and Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <StatusIndicator 
              status={project.status}
              colorMap={PROJECT_STATUS_COLORS}
              size="sm"
            />
          </div>
          
          {project.endDate && (
            <div className={`flex items-center gap-1 text-sm ${getDueDateColor()}`}>
              <Calendar size={16} />
              <span>Kết thúc: {formatDate(project.endDate, 'relative')}</span>
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
