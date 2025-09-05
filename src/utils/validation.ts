/**
 * Validation utility functions
*/

/**
 * Validate email format using regex
 * @param email - Email string to validate
 * @returns boolean
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Sanitize email input
 * @param email - Raw email input
 * @returns string - Sanitized email
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};