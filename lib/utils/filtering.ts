/**
 * Filtering utilities for Great Sage System
 * Implements Property 1, 19, 20, 21, 22
 */

/**
 * Filter items by user ID
 * Property 1: User data isolation
 */
export function filterByUserId<T extends { userId: number }>(
  items: T[],
  userId: number
): T[] {
  return items.filter((item) => item.userId === userId);
}

/**
 * Filter items by search query (case-insensitive)
 * Property 19: Search filtering
 * 
 * @param items - Array of items to filter
 * @param query - Search query string
 * @param searchFields - Fields to search in
 */
export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query || query.trim() === '') return items;
  
  const lowerQuery = query.toLowerCase().trim();
  
  return items.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Filter items by a single field value
 * Property 20: Single-field filtering
 * 
 * @param items - Array of items to filter
 * @param field - Field name to filter by
 * @param value - Value to match (or 'ALL' to skip filtering)
 */
export function filterByField<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  value: string | number
): T[] {
  if (value === 'ALL' || value === '') return items;
  
  return items.filter((item) => item[field] === value);
}

/**
 * Combine multiple filters using AND logic
 * Property 21: Multi-filter combination
 * 
 * @param items - Array of items to filter
 * @param filters - Object with field names as keys and filter values
 */
export function combineFilters<T extends Record<string, any>>(
  items: T[],
  filters: Partial<Record<keyof T, any>>
): T[] {
  let result = items;
  
  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== 'ALL' && value !== '') {
      result = filterByField(result, field as keyof T, value);
    }
  });
  
  return result;
}

/**
 * Apply search and multiple field filters together
 * Property 21: Multi-filter combination
 * 
 * @param items - Array of items to filter
 * @param searchQuery - Search query string
 * @param searchFields - Fields to search in
 * @param fieldFilters - Object with field filters
 */
export function applyFilters<T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
  fieldFilters: Partial<Record<keyof T, any>>
): T[] {
  // First apply search filter
  let result = filterBySearch(items, searchQuery, searchFields);
  
  // Then apply field filters
  result = combineFilters(result, fieldFilters);
  
  return result;
}

/**
 * Clear all filters and return original items
 * Property 22: Filter reset
 */
export function clearFilters<T>(items: T[]): T[] {
  return [...items];
}
