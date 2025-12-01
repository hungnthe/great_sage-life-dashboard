import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format time in 24-hour or 12-hour format
 * Property 27: Time formatting
 * 
 * @param time - Time string in HH:mm format
 * @param use24Hour - Whether to use 24-hour format (default: true)
 * @returns Formatted time string
 */
export function formatTime(time: string, use24Hour: boolean = true): string {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  
  if (use24Hour) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format date in various styles
 * 
 * @param date - Date to format
 * @param style - Format style ('short', 'medium', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  style: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (style === 'relative') {
    if (isToday(dateObj)) return 'Hôm nay';
    if (isTomorrow(dateObj)) return 'Ngày mai';
    if (isYesterday(dateObj)) return 'Hôm qua';
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
  }
  
  switch (style) {
    case 'short':
      return format(dateObj, 'dd/MM/yyyy');
    case 'medium':
      return format(dateObj, 'dd MMM yyyy', { locale: vi });
    case 'long':
      return format(dateObj, 'dd MMMM yyyy', { locale: vi });
    default:
      return format(dateObj, 'dd/MM/yyyy');
  }
}

/**
 * Format duration in hours
 * 
 * @param hours - Duration in hours
 * @returns Formatted duration string
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} phút`;
  }
  
  if (hours === 1) {
    return '1 giờ';
  }
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours} giờ`;
  }
  
  return `${wholeHours} giờ ${minutes} phút`;
}

/**
 * Truncate text to a maximum length
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format number with decimal places
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Format percentage
 * 
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get day name from day of week number
 * 
 * @param dayOfWeek - Day of week (0-6, Sunday-Saturday)
 * @param short - Whether to use short name (default: false)
 * @returns Day name
 */
export function getDayName(dayOfWeek: number, short: boolean = false): string {
  const days = short
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  
  return days[dayOfWeek] || '';
}

/**
 * Format date range
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = format(startDate, 'dd/MM/yyyy');
  const end = format(endDate, 'dd/MM/yyyy');
  return `${start} - ${end}`;
}
