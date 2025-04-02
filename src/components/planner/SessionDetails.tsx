import { motion } from "framer-motion";
import {
  XMarkIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { StudySession } from "../../store/plannerStore";
import { useTaskStore } from "../../store/taskStore";
import { usePomodoroStore } from "../../store/pomodoroStore";
import { useState } from "react";

interface SessionDetailsProps {
  session: StudySession;
  onClose: () => void;
  onComplete: (sessionId: string) => void;
  categoryName: string;
  categoryColor: string;
}

export const SessionDetails = ({
  session,
  onClose,
  onComplete,
  categoryName,
  categoryColor,
}: SessionDetailsProps) => {
  const { tasks } = useTaskStore();
  const { startSession } = usePomodoroStore();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Get associated tasks
  const associatedTasks = tasks.filter((task) =>
    session.associatedTaskIds.includes(task.id)
  );

  // Format times for display
  const startTime = format(
    parseISO(session.startTime),
    "EEE, MMM d, yyyy h:mm a"
  );
  const endTime = format(parseISO(session.endTime), "h:mm a");

  // Calculate duration in minutes and hours
  const durationMs =
    new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
  const durationMinutes = Math.round(durationMs / (1000 * 60));
  const durationHours = durationMinutes / 60;

  // Start a pomodoro session for this study session
  const handleStartPomodoro = () => {
    startSession("Study Session", 25, session.id);
    // Could update the completed pomodoros count here
    onClose();
  };

  // Handle completion of the session
  const handleCompleteSession = () => {
    onComplete(session.id);
  };

  // Priority badge color
  const getPriorityColor = () => {
    switch (session.priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ backgroundColor: `${categoryColor}20` }} // Light version of category color
        >
          <div>
            <span className="px-2 py-1 text-xs rounded-full bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 text-gray-800 dark:text-gray-200">
              {categoryName}
            </span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
              {session.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Time and Duration */}
          <div className="mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <ClockIcon className="h-5 w-5 mr-2" />
              <div>
                <div>
                  {startTime} - {endTime}
                </div>
                <div className="text-sm">
                  Duration:{" "}
                  {durationHours < 1
                    ? `${durationMinutes} minutes`
                    : `${durationHours.toFixed(1)} hours`}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}
              >
                {session.priority.charAt(0).toUpperCase() +
                  session.priority.slice(1)}{" "}
                Priority
              </span>

              {session.isCompleted && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {session.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {session.description}
              </p>
            </div>
          )}

          {/* Pomodoro Progress */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pomodoro Progress
            </h3>
            <div className="flex items-center mb-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (session.completedPomodoros / session.pomodoroCount) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.completedPomodoros}/{session.pomodoroCount}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {session.completedPomodoros === session.pomodoroCount
                ? "All planned Pomodoro sessions completed!"
                : `${
                    session.pomodoroCount - session.completedPomodoros
                  } more Pomodoro sessions to complete`}
            </p>
          </div>

          {/* Associated Tasks */}
          {associatedTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Associated Tasks
              </h3>
              <ul className="space-y-2">
                {associatedTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`p-2 rounded-md text-sm ${
                      task.completed
                        ? "bg-gray-100 dark:bg-gray-700 line-through text-gray-500 dark:text-gray-400"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {task.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes (if any) */}
          {session.notesContent && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Notes
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-gray-600 dark:text-gray-400">
                {session.notesContent}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap justify-between items-center">
            <div className="flex space-x-2 mb-2 sm:mb-0">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>

              <button
                onClick={onClose}
                className="flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="flex space-x-2">
              {!session.isCompleted && (
                <>
                  <button
                    onClick={handleStartPomodoro}
                    className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Start Pomodoro
                  </button>

                  <button
                    onClick={handleCompleteSession}
                    className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark Complete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete confirmation */}
        {showConfirmDelete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this study session? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Delete the session (would need to pass this from props)
                    // deleteSession(session.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
