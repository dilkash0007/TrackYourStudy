import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { usePomodoroStore } from "../../store/pomodoroStore";
import { useTaskStore, Task } from "../../store/taskStore";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TaskSelectionProps {
  onClose: () => void;
}

export const TaskSelection = ({ onClose }: TaskSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get available tasks and selected task ID - cached with useMemo
  const tasks = useMemo(() => {
    const allTasks = useTaskStore.getState().tasks || [];
    return allTasks.filter((task) => task.status !== "Completed");
  }, []);

  const pomodoroState = usePomodoroStore();
  const selectedTaskId = pomodoroState.selectedTaskId;

  // Use a function to select task
  const selectTask = (taskId?: string) => {
    const store = usePomodoroStore.getState();
    if (store && typeof store.selectTask === "function") {
      store.selectTask(taskId);
    }
  };

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    return searchQuery
      ? tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            task.subject?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tasks;
  }, [searchQuery, tasks]);

  // Sort tasks by priority (higher first) and due date (earlier first)
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const priorityOrder = { Urgent: 3, High: 2, Medium: 1, Low: 0 };
      const priorityDiff =
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder];

      if (priorityDiff !== 0) return priorityDiff;

      // If same priority, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [filteredTasks]);

  // Handle task selection
  const handleSelectTask = (taskId: string) => {
    selectTask(taskId);
    onClose();
  };

  // Handle clearing task selection
  const handleClearSelection = () => {
    selectTask(undefined);
    onClose();
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get status and priority colors
  const getStatusColor = (status: string) => {
    const colors = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "In Progress":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[status as keyof typeof colors] || colors["Pending"];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[priority as keyof typeof colors] || colors["Medium"];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Select a Task
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Search tasks..."
          />
        </div>

        {/* Task List */}
        <div className="max-h-96 overflow-y-auto pr-1">
          {sortedTasks.length > 0 ? (
            <div className="space-y-2">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleSelectTask(task.id)}
                  className={`cursor-pointer rounded-md border p-3 transition-colors ${
                    selectedTaskId === task.id
                      ? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {task.subject}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {tasks.length === 0
                  ? "You don't have any active tasks. Create a task first."
                  : "No tasks match your search criteria."}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            onClick={handleClearSelection}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Clear Selection
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
