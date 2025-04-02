import {
  format,
  isSameDay,
  parseISO,
  isWithinInterval,
  addMinutes,
} from "date-fns";
import { StudySession, StudyCategory } from "../../store/plannerStore";

interface WeeklyCalendarProps {
  weekDays: Date[];
  sessions: StudySession[];
  onSessionClick: (session: StudySession) => void;
  categories: StudyCategory[];
}

export const WeeklyCalendar = ({
  weekDays,
  sessions,
  onSessionClick,
  categories,
}: WeeklyCalendarProps) => {
  // Hours for the day (9 AM to 9 PM)
  const hours = Array.from({ length: 13 }, (_, i) => i + 9);

  // Get category color
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#6B7280"; // Default gray
  };

  // Calculate session position and height
  const getSessionStyle = (session: StudySession) => {
    const startTime = parseISO(session.startTime);
    const endTime = parseISO(session.endTime);

    // Calculate position from top (based on start time)
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const topPosition = ((startHour - 9) * 60 + startMinute) * 1.5; // 1.5px per minute

    // Calculate height (based on duration)
    const durationMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const height = durationMinutes * 1.5; // 1.5px per minute

    return {
      top: `${topPosition}px`,
      height: `${height}px`,
      backgroundColor: getCategoryColor(session.category),
    };
  };

  // Check if a session is currently happening
  const isSessionNow = (session: StudySession): boolean => {
    const now = new Date();
    const startTime = parseISO(session.startTime);
    const endTime = parseISO(session.endTime);

    return isWithinInterval(now, { start: startTime, end: endTime });
  };

  // Check if a session is in the future
  const isSessionFuture = (session: StudySession): boolean => {
    const now = new Date();
    const startTime = parseISO(session.startTime);

    return startTime > now;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={`py-3 text-center font-medium ${
              isSameDay(day, new Date())
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <div>{format(day, "EEE")}</div>
            <div className="text-lg">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative">
        {/* Time indicators */}
        <div className="absolute top-0 left-0 w-16 h-full border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 z-10">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[90px] border-t border-gray-200 dark:border-gray-700 relative"
            >
              <span className="absolute -top-3 left-2 text-xs text-gray-500 dark:text-gray-400">
                {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? "PM" : "AM"}
              </span>
            </div>
          ))}
        </div>

        {/* Grid and events */}
        <div className="ml-16 grid grid-cols-7" style={{ minHeight: "1170px" }}>
          {/* Grid columns for each day */}
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className="relative border-r border-gray-200 dark:border-gray-700"
            >
              {/* Hour grid lines */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[90px] border-t border-gray-200 dark:border-gray-700"
                ></div>
              ))}

              {/* Sessions for this day */}
              {sessions
                .filter((session) =>
                  isSameDay(parseISO(session.startTime), day)
                )
                .map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onSessionClick(session)}
                    className={`absolute left-1 right-1 rounded-md shadow-sm p-2 cursor-pointer z-20 text-white transition-opacity overflow-hidden ${
                      session.isCompleted
                        ? "opacity-60"
                        : "opacity-90 hover:opacity-100"
                    }`}
                    style={getSessionStyle(session)}
                  >
                    <div className="text-sm font-medium truncate">
                      {session.title}
                    </div>
                    <div className="text-xs truncate">
                      {format(parseISO(session.startTime), "h:mm a")} -{" "}
                      {format(parseISO(session.endTime), "h:mm a")}
                    </div>
                    {isSessionNow(session) && !session.isCompleted && (
                      <div className="absolute bottom-1 right-1">
                        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}

          {/* Current time indicator */}
          <div className="absolute left-16 right-0 z-30">
            <div
              className="border-t-2 border-red-500 dark:border-red-400 relative"
              style={{
                top: `${
                  ((new Date().getHours() - 9) * 60 + new Date().getMinutes()) *
                  1.5
                }px`,
              }}
            >
              <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500 dark:bg-red-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
