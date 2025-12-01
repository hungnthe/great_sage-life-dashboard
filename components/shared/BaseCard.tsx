import type { BaseCardProps } from '@/types';

/**
 * BaseCard - Reusable card component
 * 
 * A foundational card component that follows SOLID principles:
 * - Reusable: Can be used across all modules
 * - Independent: No dependencies on specific context
 * - Extensible: Can be customized via className and children
 * - Encapsulated: All styling logic contained within
 * 
 * Requirements: 19.1, 19.2
 */
export function BaseCard({
  children,
  onClick,
  className = '',
  hoverable = true,
}: BaseCardProps) {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4';
  
  const hoverStyles = hoverable
    ? 'transition-all duration-200 hover:shadow-md hover:border-gray-300'
    : '';
  
  const clickableStyles = onClick
    ? 'cursor-pointer active:scale-[0.98]'
    : '';
  
  const combinedStyles = `${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`.trim();
  
  return (
    <div
      className={combinedStyles}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
