// Helper functions for calendar operations and date manipulation

/**
 * Get days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get days for a month grid, including padding days from previous/next month
 * @param year Full year (e.g., 2023)
 * @param month Month index (0-11)
 * @param firstDayOfWeek First day of week (0 = Sunday, 1 = Monday, 6 = Saturday)
 */
export function getMonthDays(
  year: number,
  month: number,
  firstDayOfWeek: 0 | 1 | 6 = 0
): Date[] {
  const result: Date[] = [];

  // Days in current month
  const daysInMonth = getDaysInMonth(year, month);

  // First day of the month
  const firstDay = new Date(year, month, 1);
  let firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Adjust firstDayIndex based on firstDayOfWeek preference
  firstDayIndex = (7 + firstDayIndex - firstDayOfWeek) % 7;

  // Get days from previous month to fill the first row
  const prevMonthDays = firstDayIndex;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  // Add days from previous month
  for (let i = 0; i < prevMonthDays; i++) {
    const prevDay = daysInPrevMonth - prevMonthDays + i + 1;
    result.push(new Date(prevMonthYear, prevMonth, prevDay));
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    result.push(new Date(year, month, i));
  }

  // Calculate days needed from next month to complete the grid (6 rows x 7 days = 42 cells)
  const nextMonthDays = 42 - result.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;

  // Add days from next month
  for (let i = 1; i <= nextMonthDays; i++) {
    result.push(new Date(nextMonthYear, nextMonth, i));
  }

  return result;
}

/**
 * Get week days for a given date
 * @param date Date to get week for
 * @param firstDayOfWeek First day of week (0 = Sunday, 1 = Monday, 6 = Saturday)
 */
export function getWeekDays(date: Date, firstDayOfWeek: 0 | 1 | 6 = 0): Date[] {
  const result: Date[] = [];
  const day = date.getDay();

  // Calculate the difference to the first day of week
  let diff = day - firstDayOfWeek;
  if (diff < 0) diff += 7;

  // Get the first day of the week
  const firstDay = new Date(date);
  firstDay.setDate(date.getDate() - diff);

  // Add 7 days starting from first day of week
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(firstDay);
    newDate.setDate(firstDay.getDate() + i);
    result.push(newDate);
  }

  return result;
}

/**
 * Get day hours (typically from 0 to 23, or a subset based on working hours)
 */
export function getDayHours(
  startHour: number = 0,
  endHour: number = 23
): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result: Date[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const date = new Date(today);
    date.setHours(hour);
    result.push(date);
  }

  return result;
}

/**
 * Get a range of dates between start and end
 */
export function getDateRange(start: Date, end: Date): Date[] {
  const result: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format time as 12-hour or 24-hour (e.g., "9:00 AM" or "09:00")
 */
export function formatTime(date: Date, use24Hour: boolean = false): string {
  if (use24Hour) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

/**
 * Format date in a friendly way (e.g., "Today", "Tomorrow", "Monday", or "May 5")
 */
export function formatFriendlyDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dateWithoutTime = new Date(date);
  dateWithoutTime.setHours(0, 0, 0, 0);

  if (dateWithoutTime.getTime() === today.getTime()) {
    return "Today";
  } else if (dateWithoutTime.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else if (
    dateWithoutTime <= new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)
  ) {
    // Within a week, show day name
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    // Otherwise show month and day
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

/**
 * Generate readable time range (e.g., "9:00 AM - 10:30 AM")
 */
export function formatTimeRange(
  startDate: Date,
  endDate: Date,
  use24Hour: boolean = false
): string {
  return `${formatTime(startDate, use24Hour)} - ${formatTime(
    endDate,
    use24Hour
  )}`;
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Get calendar header labels based on first day of week
 */
export function getWeekdayLabels(firstDayOfWeek: 0 | 1 | 6 = 0): string[] {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Reorder based on firstDayOfWeek
  const reordered = [
    ...shortWeekdays.slice(firstDayOfWeek),
    ...shortWeekdays.slice(0, firstDayOfWeek),
  ];

  return reordered;
}

/**
 * Calculate event position and height for time-grid views
 */
export function calculateEventPosition(
  startDate: Date,
  endDate: Date,
  startHour: number,
  hourHeight: number
): { top: number; height: number } {
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

  // Calculate relative to start hour
  const startPosition = Math.max(
    0,
    ((startMinutes - startHour * 60) / 60) * hourHeight
  );

  // Calculate height based on duration
  const duration = Math.max(30, endMinutes - startMinutes); // Minimum 30 min height
  const height = (duration / 60) * hourHeight;

  return { top: startPosition, height };
}
