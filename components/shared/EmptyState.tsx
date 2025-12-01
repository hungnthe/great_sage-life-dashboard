import type { EmptyStateProps } from '@/types';

/**
 * EmptyState - Display empty state with icon, title, description and optional CTA
 * 
 * Property 31: Empty state display
 * Requirements: 1.5, 3.5, 5.5, 7.5, 9.5, 11.5, 13.5, 15.5, 17.5
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-gray-400">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
