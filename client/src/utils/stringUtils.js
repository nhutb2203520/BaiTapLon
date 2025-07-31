/**
 * Utility functions for string manipulation
 */

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
export function capitalizeWords(str) {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Capitalize only the first letter of the string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
export function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - The string to convert
 * @returns {string} - The title case string
 */
export function toTitleCase(str) {
  if (!str) return '';
  
  const articles = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'near', 'of', 'on', 'onto', 'to', 'with'];
  
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !articles.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

/**
 * Truncate string with ellipsis
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} - The truncated string
 */
export function truncate(str, length = 50) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

/**
 * Remove extra whitespace and trim
 * @param {string} str - The string to clean
 * @returns {string} - The cleaned string
 */
export function cleanString(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}