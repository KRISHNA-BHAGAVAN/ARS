/**
 * Safely formats a number to a fixed number of decimal places
 * Handles null, undefined, string numbers, and actual numbers
 * 
 * @param {*} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {string} defaultValue - Value to return if formatting fails (default: 'N/A')
 * @returns {string} - Formatted number or default value
 */
export const formatNumber = (value, decimals = 2, defaultValue = 'N/A') => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  try {
    // If it's already a number
    if (typeof value === 'number') {
      return value.toFixed(decimals);
    }
    
    // Try to convert to number
    const num = parseFloat(value);
    if (isNaN(num)) {
      return defaultValue;
    }
    
    return num.toFixed(decimals);
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Safely compares a number against thresholds
 * 
 * @param {*} value - The value to compare
 * @param {Object} options - Comparison options
 * @returns {*} - The result based on thresholds
 */
export const compareValue = (value, options) => {
  const { 
    thresholds = [],
    defaultResult = null
  } = options;
  
  // If value is null/undefined, return default
  if (value === null || value === undefined) {
    return defaultResult;
  }
  
  // Convert to number if it's not already
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  
  // If conversion failed, return default
  if (isNaN(numValue)) {
    return defaultResult;
  }
  
  // Check against thresholds
  for (const { threshold, result } of thresholds) {
    if (numValue >= threshold) {
      return result;
    }
  }
  
  return defaultResult;
};