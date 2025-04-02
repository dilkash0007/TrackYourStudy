import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarEvent } from "../../store/calendarStore";
import { CalendarEventItem } from "./CalendarEventItem";
import {
  getMonthDays,
  getWeekdayLabels,
  isSameDay,
  isToday,
  formatISODate,
} from "../../utils/calendarHelpers";

interface MonthViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  firstDayOfWeek: 0 | 1 | 6;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const MonthView = ({
  selectedDate,
  events,
  firstDayOfWeek,
  onDateClick,
  onEventClick,
}: MonthViewProps) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Get all days for the current month view
  const days = getMonthDays(year, month, firstDayOfWeek);

  // Get weekday labels
  const weekdayLabels = getWeekdayLabels(firstDayOfWeek);

  // Get events for a specific day
  const getEventsForDay = useCallback(
    (day: Date) => {
      return events.filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // For all-day events, check if the day is between start and end dates
        if (event.allDay) {
          return (
            day >= new Date(eventStart.setHours(0, 0, 0, 0)) &&
            day <= new Date(eventEnd.setHours(23, 59, 59, 999))
          );
        }

        // For non-all-day events, check if the event happens on this day
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);

        return eventStart <= dayEnd && eventEnd >= dayStart;
      });
    },
    [events]
  );

  // Determine if a day is in the current month
  const isCurrentMonth = (day: Date) => day.getMonth() === month;

  // Determine class for a day cell
  const getDayClass = (day: Date) => {
    let classes =
      "h-28 sm:h-36 p-1 border border-gray-200 dark:border-gray-700 overflow-hidden";

    if (isToday(day)) {
      classes += " bg-indigo-50 dark:bg-indigo-900/20";
    } else if (!isCurrentMonth(day)) {
      classes +=
        " bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500";
    }

    if (isSameDay(day, selectedDate)) {
      classes += " ring-2 ring-indigo-500 dark:ring-indigo-400 z-10 relative";
    }

    return classes;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center border-b border-gray-200 dark:border-gray-700">
        {weekdayLabels.map((weekday, index) => (
          <div
            key={index}
            className="py-2 font-semibold text-sm text-gray-600 dark:text-gray-300"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        <AnimatePresence>
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const formattedDate = formatISODate(day);

            return (
              <motion.div
                key={formattedDate}
                onClick={() => onDateClick(day)}
                className={getDayClass(day)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.01 }}
              >
                {/* Date Number */}
                <div className="flex justify-between items-center">
                  <span
                    className={`
                      text-sm inline-flex h-6 w-6 items-center justify-center rounded-full
                      ${
                        isToday(day)
                          ? "bg-indigo-600 text-white font-semibold"
                          : ""
                      }
                    `}
                  >
                    {day.getDate()}
                  </span>

                  {/* Indicators for many events */}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                      +{dayEvents.length - 2}
                    </span>
                  )}
                </div>

                {/* Events List (limited to 3 visible) */}
                <div className="mt-1 space-y-1 max-h-[calc(100%-2rem)] overflow-hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <CalendarEventItem
                      key={event.id}
                      event={event}
                      compact
                      onClick={onEventClick}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
