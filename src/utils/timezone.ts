/**
 * Timezone utility functions using Luxon
 * Handles conversion between local time and UTC for database storage
 */
import { DateTime } from 'luxon';

/**
 * Convert local datetime string (from datetime-local input) to UTC ISO string
 * @param localDateTime - String in format "YYYY-MM-DDTHH:mm" (local time)
 * @returns ISO string in UTC
 */
export const localToUTC = (localDateTime: string): string => {
  if (!localDateTime) return '';
  
  try {
    // Parse the local datetime string and convert to UTC
    // DateTime.fromISO will interpret the string in the system's local timezone
    const localDate = DateTime.fromISO(localDateTime, { zone: 'local' });
    
    if (!localDate.isValid) {
      console.error('Invalid date:', localDate.invalidExplanation);
      return '';
    }
    
    // Convert to UTC and return as ISO string
    return localDate.toUTC().toISO();
  } catch (error) {
    console.error('Error converting local to UTC:', error);
    return '';
  }
};

/**
 * Convert UTC ISO string to local datetime string for datetime-local input
 * @param utcDateTime - ISO string in UTC
 * @returns String in format "YYYY-MM-DDTHH:mm" (local time)
 */
export const utcToLocal = (utcDateTime: string): string => {
  if (!utcDateTime) return '';
  
  try {
    // Parse UTC datetime and convert to local timezone
    const utcDate = DateTime.fromISO(utcDateTime, { zone: 'utc' });
    
    if (!utcDate.isValid) {
      console.error('Invalid date:', utcDate.invalidExplanation);
      return '';
    }
    
    // Convert to local timezone and format for datetime-local input
    const localDate = utcDate.toLocal();
    
    // Return in datetime-local format: YYYY-MM-DDTHH:mm
    return localDate.toFormat("yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Error converting UTC to local:', error);
    return '';
  }
};

/**
 * Format UTC datetime to local time string for display
 * @param utcDateTime - ISO string in UTC
 * @param format - Luxon format string or Intl.DateTimeFormatOptions
 * @returns Formatted local time string
 */
export const formatLocalTime = (
  utcDateTime: string,
  format?: string | Intl.DateTimeFormatOptions
): string => {
  if (!utcDateTime) return '';
  
  try {
    const utcDate = DateTime.fromISO(utcDateTime, { zone: 'utc' });
    
    if (!utcDate.isValid) {
      console.error('Invalid date:', utcDate.invalidExplanation);
      return '';
    }
    
    const localDate = utcDate.toLocal();
    
    // If format is a string, use Luxon's toFormat
    if (typeof format === 'string') {
      return localDate.toFormat(format);
    }
    
    // If format is Intl options, use toLocaleString
    if (format && typeof format === 'object') {
      return localDate.toLocaleString(format);
    }
    
    // Default format
    return localDate.toLocaleString({
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Get user's timezone
 * @returns Timezone string (e.g., "America/New_York")
 */
export const getUserTimezone = (): string => {
  return DateTime.now().zoneName || Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get timezone offset in minutes
 * @returns Offset in minutes from UTC
 */
export const getTimezoneOffset = (): number => {
  return DateTime.now().offset;
};

/**
 * Get current local time in ISO format
 * @returns ISO string in local timezone
 */
export const getCurrentLocalTime = (): string => {
  return DateTime.now().toISO();
};

/**
 * Get current UTC time in ISO format
 * @returns ISO string in UTC
 */
export const getCurrentUTCTime = (): string => {
  return DateTime.utc().toISO() || '';
};

/**
 * Format datetime with timezone abbreviation
 * @param utcDateTime - ISO string in UTC
 * @returns Formatted string with timezone (e.g., "Nov 13, 2025, 2:30 PM EST")
 */
export const formatWithTimezone = (utcDateTime: string): string => {
  if (!utcDateTime) return '';
  
  try {
    const utcDate = DateTime.fromISO(utcDateTime, { zone: 'utc' });
    
    if (!utcDate.isValid) {
      return '';
    }
    
    const localDate = utcDate.toLocal();
    
    return localDate.toLocaleString({
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch (error) {
    console.error('Error formatting with timezone:', error);
    return '';
  }
};
