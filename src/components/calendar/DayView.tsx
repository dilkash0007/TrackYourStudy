import { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarEvent } from "../../store/calendarStore";
import { CalendarEventItem } from "./CalendarEventItem";
import {
  getDayHours,
  formatTime,
  calculateEventPosition,
} from "../../utils/calendarHelpers";

interface DayViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  workingHours: { start: number; end: number };
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

export const DayView = ({
  selectedDate,
  events,
  workingHours,
  onEventClick,
  onTimeSlotClick,
}: DayViewProps) => {
  // Get hours for the day
  const hours = useMemo(
    () => getDayHours(workingHours.start, workingHours.end),
    [workingHours]
  );

  // Hour cell height in pixels
  const hourHeight = 60;

  // Filter events for the selected day
  const dayEvents = useMemo(() => {
    // Start and end of the day
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  }, [selectedDate, events]);

  // Get all day events
  const allDayEvents = useMemo(() => {
    return dayEvents.filter((event) => event.allDay);
  }, [dayEvents]);

  // Get time-based events
  const timeEvents = useMemo(() => {
    return dayEvents.filter((event) => !event.allDay);
  }, [dayEvents]);

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

  // Handle time slot click
  const handleTimeSlotClick = useCallback(
    (hour: number) => {
      const date = new Date(selectedDate);
      date.setHours(hour, 0, 0, 0);
      onTimeSlotClick(date);
    },
    [selectedDate, onTimeSlotClick]
  );

  // Format selected date for header
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full">
      {/* Day header with date */}
      <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {formattedDate}
        </h3>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-2">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All-day
            </span>
          </div>
          <div className="space-y-1">
            <AnimatePresence>
              {allDayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CalendarEventItem event={event} onClick={onEventClick} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex relative"
          style={{ minHeight: `${hours.length * hourHeight}px` }}
        >
          {/* Time labels column */}
          <div className="w-16 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
            {hours.map((hour) => (
              <div
                key={hour.getHours()}
                className="text-xs text-right pr-2 font-medium text-gray-500 dark:text-gray-400"
                style={{ height: `${hourHeight}px` }}
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Time slots and events */}
          <div className="flex-1 relative">
            {/* Time slots */}
            {hours.map((hour) => (
              <div
                key={hour.getHours()}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/10 transition-colors"
                style={{ height: `${hourHeight}px` }}
                onClick={() => handleTimeSlotClick(hour.getHours())}
              ></div>
            ))}

            {/* Current time indicator */}
            {new Date().toDateString() === selectedDate.toDateString() && (
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

            {/* Events */}
            <AnimatePresence>
              {timeEvents.map((event) => {
                const eventStyle = getEventStyle(event);

                return (
                  <motion.div
                    key={event.id}
                    className="absolute left-2 right-2 rounded-md overflow-hidden"
                    style={eventStyle}
                    initial={{ opacity: 0, scaleY: 0.8 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.8 }}
                  >
                    <CalendarEventItem event={event} onClick={onEventClick} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
