import type { StatusIndicatorProps } from '@/types';

/**
 * StatusIndicator - Display status with color mapping
 * 
 * Property 9: Status color distinctness
 * Property 10: Priority color distinctness
 * Requirements: 4.4, 8.4
 */

const SIZE_STYLES: Record<NonNullable<StatusIndicatorProps['size']>, string> = {
  sm: 'text-sm px-3 py-1',
  md: 'text-base px-4 py-1.5',
  lg: 'text-lg px-5 py-2',
};

export function StatusIndicator({
  status,
  colorMap,
  size = 'md',
}: StatusIndicatorProps) {
  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  const sizeStyle = SIZE_STYLES[size];
  
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeStyle}`}
    >
      {status}
    </span>
  );
}

// Predefined color maps for common status types
export const TASK_STATUS_COLORS: Record<string, string> = {
  TODO: 'bg-slate-200 text-slate-800 border-slate-400 font-semibold',
  IN_PROGRESS: 'bg-amber-200 text-amber-900 border-amber-400 font-semibold',
  DONE: 'bg-emerald-200 text-emerald-900 border-emerald-400 font-semibold',
  CANCELLED: 'bg-rose-200 text-rose-900 border-rose-400 font-semibold',
};

export const TASK_PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-sky-200 text-sky-800 border-sky-400 font-semibold',
  MEDIUM: 'bg-indigo-200 text-indigo-900 border-indigo-400 font-semibold',
  HIGH: 'bg-orange-200 text-orange-900 border-orange-400 font-semibold',
  URGENT: 'bg-red-200 text-red-900 border-red-400 font-semibold',
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-300',
  ON_HOLD: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  COMPLETED: 'bg-gray-100 text-gray-700 border-gray-300',
  ARCHIVED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export const STUDY_STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-300',
  COMPLETED: 'bg-gray-100 text-gray-700 border-gray-300',
  DROPPED: 'bg-red-100 text-red-700 border-red-300',
};
