import { StudySession } from "../../store/plannerStore";
import { format, parseISO, isToday, isPast, isFuture } from "date-fns";
import { ClockIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ListViewSessionsProps {
  sessions: StudySession[];
  onSessionClick: (sessionId: string) => void;
  categories: { id: string; name: string; color: string }[];
}

export const ListViewSessions = ({
  sessions,
  onSessionClick,
  categories,
}: ListViewSessionsProps) => {
  // Group sessions by day
  const sessionsByDay = sessions.reduce((acc, session) => {
    const date = format(parseISO(session.startTime), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);

  // Sort days
  const sortedDays = Object.keys(sessionsByDay).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Get category name and color
  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return {
      name: category?.name || "Uncategorized",
      color: category?.color || "#718096",
    };
  };

  // Format duration
  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Get session status class
  const getSessionStatusClass = (session: StudySession) => {
    if (session.isCompleted) {
      return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20";
    }

    const startTime = parseISO(session.startTime);
    const endTime = parseISO(session.endTime);
    const now = new Date();

    if (isPast(endTime)) {
      return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"; // Missed session
    } else if (startTime <= now && now <= endTime) {
      return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"; // Current session
    } else {
      return "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"; // Future session
    }
  };

  return (
    <div className="space-y-6">
      {sortedDays.map((day) => (
        <div
          key={day}
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3">
            <h3 className="font-medium">
              {isToday(new Date(day))
                ? "Today"
                : format(new Date(day), "EEEE, MMMM d")}
            </h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessionsByDay[day]
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              .map((session) => {
                const { name: categoryName, color: categoryColor } =
                  getCategoryInfo(session.category);

                return (
                  <div
                    key={session.id}
                    onClick={() => onSessionClick(session.id)}
                    className={`px-4 py-3 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${getSessionStatusClass(
                      session
                    )}`}
                  >
                    {/* Time */}
                    <div className="w-28 flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {format(parseISO(session.startTime), "h:mm a")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDuration(session.startTime, session.endTime)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {session.title}
                        </h4>
                        {session.isCompleted && (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        )}
                      </div>

                      <div className="mt-1 flex items-center space-x-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: categoryColor }}
                        ></span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {categoryName}
                        </span>

                        {session.pomodoroCount > 0 && (
                          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {session.completedPomodoros}/{session.pomodoroCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="ml-4">
                      {session.priority !== "low" && (
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full 
                          ${
                            session.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : session.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {session.priority.charAt(0).toUpperCase() +
                            session.priority.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {sortedDays.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500 dark:text-gray-400">
            No study sessions found for the selected period.
          </p>
        </div>
      )}
    </div>
  );
};
