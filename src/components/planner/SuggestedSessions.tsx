import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  LightBulbIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { StudySession } from "../../store/plannerStore";

interface SuggestedSessionsProps {
  suggestedSessions: StudySession[];
  onAddToPlanner: (sessionId: string) => void;
  categories: { id: string; name: string; color: string }[];
}

export const SuggestedSessions = ({
  suggestedSessions,
  onAddToPlanner,
  categories,
}: SuggestedSessionsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Toggle suggestion expansion
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return {
      name: category?.name || "Uncategorized",
      color: category?.color || "#718096",
    };
  };

  // Format time
  const formatTime = (timeString: string) => {
    return format(parseISO(timeString), "h:mm a");
  };

  // Calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Suggested Study Sessions
        </h2>
      </div>

      {suggestedSessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No suggested sessions available. Complete your tasks and study
            preferences for personalized suggestions.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {suggestedSessions.map((session, index) => {
            const { name: categoryName, color: categoryColor } =
              getCategoryInfo(session.categoryId);
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={session.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Suggestion header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: categoryColor }}
                        ></span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {session.title}
                        </h3>
                      </div>

                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>
                          {formatTime(session.startTime)} -{" "}
                          {formatTime(session.endTime)}
                          <span className="mx-1">·</span>
                          {calculateDuration(
                            session.startTime,
                            session.endTime
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToPlanner(session.id);
                      }}
                      className="flex items-center px-2 py-1 text-xs rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add
                    </button>
                  </div>

                  {/* Suggestion reason */}
                  <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md text-gray-600 dark:text-gray-400">
                    <strong>Why suggested:</strong>{" "}
                    {session.suggestedReason ||
                      "Based on your study patterns and available time slots."}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                  >
                    {session.description && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {session.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {categoryName}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          Priority
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">
                          {session.priority}
                        </p>
                      </div>

                      {session.associatedTaskIds &&
                        session.associatedTaskIds.length > 0 && (
                          <div className="col-span-2 mt-1">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Related Tasks
                            </h4>
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                                {session.associatedTaskIds.map((taskId, i) => (
                                  <li key={i} className="text-xs">
                                    Task ID: {taskId.substring(0, 8)}...
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              This session will help you progress on related
                              tasks and assignments.
                            </p>
                          </div>
                        )}

                      {session.pomodoroCount > 0 && (
                        <div className="col-span-2 mt-1">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">
                            Suggested Pomodoros
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {session.pomodoroCount} × 25-minute sessions
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
