import type { BadgeProps } from '@/types';

/**
 * Badge - Display type/status with colors and icons
 * 
 * Property 8: Type indicator distinctness
 * Requirements: 4.1, 4.2, 4.3, 8.1, 8.2, 8.3
 */

const VARIANT_STYLES: Record<BadgeProps['variant'], string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  red: 'bg-red-100 text-red-700 border-red-300',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  gray: 'bg-gray-100 text-gray-700 border-gray-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
};

const SIZE_STYLES: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function Badge({
  label,
  variant,
  icon,
  size = 'md',
}: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantStyle} ${sizeStyle}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
