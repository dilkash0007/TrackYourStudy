import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarEvent } from "../../store/calendarStore";
import { CalendarEventItem } from "./CalendarEventItem";
import {
  getWeekDays,
  getDayHours,
  formatTime,
  isToday,
  isSameDay,
  calculateEventPosition,
} from "../../utils/calendarHelpers";

interface WeekViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  firstDayOfWeek: 0 | 1 | 6;
  workingHours: { start: number; end: number };
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

export const WeekView = ({
  selectedDate,
  events,
  firstDayOfWeek,
  workingHours,
  onEventClick,
  onTimeSlotClick,
}: WeekViewProps) => {
  // Get days for the current week
  const weekDays = useMemo(
    () => getWeekDays(selectedDate, firstDayOfWeek),
    [selectedDate, firstDayOfWeek]
  );

  // Get hours for the time grid
  const hours = useMemo(
    () => getDayHours(workingHours.start, workingHours.end),
    [workingHours]
  );

  // Hour cell height in pixels
  const hourHeight = 60;

  // Get all-day events for the current week
  const allDayEvents = useMemo(() => {
    return events.filter((event) => event.allDay);
  }, [events]);

  // Filter time-based events for each day
  const getTimeEventsForDay = useCallback(
    (date: Date) => {
      return events.filter((event) => {
        if (event.allDay) return false;

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return eventStart <= dayEnd && eventEnd >= dayStart;
      });
    },
    [events]
  );

  // Get events for the all-day row
  const getAllDayEventsForDay = useCallback(
    (date: Date) => {
      return allDayEvents.filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const dayDate = new Date(date);

        // Set times to compare just the dates
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(0, 0, 0, 0);
        dayDate.setHours(0, 0, 0, 0);

        return dayDate >= eventStart && dayDate <= eventEnd;
      });
    },
    [allDayEvents]
  );

  // Calculate position for time-based events
  const getEventStyle = useCallback(
    (event: CalendarEvent) => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      const { top, height } = calculateEventPosition(
        startDate,
        endDate,
        workingHours.start,
        hourHeight
      );

      return {
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: event.color,
      };
    },
    [workingHours.start, hourHeight]
  );

  // Get time slots for a specific hour and day
  const handleTimeSlotClick = useCallback(
    (day: Date, hour: number) => {
      const date = new Date(day);
      date.setHours(hour, 0, 0, 0);
      onTimeSlotClick(date);
    },
    [onTimeSlotClick]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* All-day events row */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-8 text-sm">
          <div className="border-r border-gray-200 dark:border-gray-700 p-2 text-gray-500 dark:text-gray-400">
            All-day
          </div>

          {weekDays.map((day, index) => (
            <div
              key={day.toISOString()}
              className={`p-2 border-r border-gray-200 dark:border-gray-700 min-h-[60px] ${
                isToday(day) ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
              } ${
                isSameDay(day, selectedDate)
                  ? "bg-indigo-100 dark:bg-indigo-900/30"
                  : ""
              }`}
            >
              <div className="space-y-1">
                {getAllDayEventsForDay(day).map((event) => (
                  <CalendarEventItem
                    key={event.id}
                    event={event}
                    compact
                    onClick={onEventClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="grid grid-cols-8 relative"
          style={{ minHeight: `${hours.length * hourHeight}px` }}
        >
          {/* Time labels column */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            {hours.map((hour) => (
              <div
                key={hour.getHours()}
                className="text-xs text-right pr-2 sticky left-0 font-medium text-gray-500 dark:text-gray-400"
                style={{ height: `${hourHeight}px` }}
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Day columns with time slots */}
          {weekDays.map((day) => {
            const timeEvents = getTimeEventsForDay(day);

            return (
              <div
                key={day.toISOString()}
                className="border-r border-gray-200 dark:border-gray-700 relative"
              >
                {/* Time slots */}
                {hours.map((hour) => (
                  <div
                    key={hour.getHours()}
                    className={`border-b border-gray-100 dark:border-gray-800 
                      ${
                        isToday(day)
                          ? "bg-indigo-50/30 dark:bg-indigo-900/10"
                          : ""
                      }
                      ${
                        isSameDay(day, selectedDate)
                          ? "bg-indigo-100/30 dark:bg-indigo-900/20"
                          : ""
                      }
                    `}
                    style={{ height: `${hourHeight}px` }}
                    onClick={() => handleTimeSlotClick(day, hour.getHours())}
                  ></div>
                ))}

                {/* Events */}
                {timeEvents.map((event) => {
                  const eventStyle = getEventStyle(event);

                  return (
                    <motion.div
                      key={event.id}
                      className="absolute left-0 right-0 mx-1 overflow-hidden rounded-sm"
                      style={eventStyle}
                      initial={{ opacity: 0, scaleY: 0.8 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.8 }}
                      onClick={() => onEventClick(event)}
                    >
                      <CalendarEventItem event={event} onClick={onEventClick} />
                    </motion.div>
                  );
                })}

                {/* Current time indicator */}
                {isToday(day) && (
                  <div
                    className="absolute left-0 right-0 z-10 border-t-2 border-red-500"
                    style={{
                      top: `${
                        ((new Date().getHours() - workingHours.start) * 60 +
                          new Date().getMinutes()) *
                        (hourHeight / 60)
                      }px`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
