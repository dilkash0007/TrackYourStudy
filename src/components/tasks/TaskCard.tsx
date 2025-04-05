import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, TaskStatus, useTaskStore } from "../../store/taskStore";
import { useNotifications } from "../../context/NotificationContext";
import {
  CheckIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const statusColors = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "In Progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const priorityColors = {
  Low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");

  const { setTaskStatus, deleteTask, duplicateTask, addTaskNote } =
    useTaskStore();
  const { addNotification } = useNotifications();

  const handleStatusChange = (status: TaskStatus) => {
    setTaskStatus(task.id, status);

    // Notify of completion
    if (status === "Completed") {
      addNotification({
        title: "Task Completed",
        message: `You've completed "${task.title}"!`,
        type: "success",
        taskId: task.id,
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    addNotification({
      title: "Task Deleted",
      message: `Task "${task.title}" has been deleted.`,
      type: "info",
      taskId: task.id,
    });
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
    addNotification({
      title: "Task Duplicated",
      message: `Task "${task.title}" has been duplicated.`,
      type: "info",
      taskId: task.id,
    });
  };

  const handleAddNote = () => {
    if (note.trim()) {
      addTaskNote(task.id, note);
      setNote("");
    }
  };

  // Format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (task.completedAt) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${
        isOverdue() ? "border-red-300 dark:border-red-700" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                statusColors[task.status]
              }`}
            >
              {task.status}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>

            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {task.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h3>

          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-4 w-4" />
            <span
              className={isOverdue() ? "text-red-500 dark:text-red-400" : ""}
            >
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              {task.description}
            </div>

            <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Subject:</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {task.subject}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Created on:</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(task.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Estimated time:
                </p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {task.estimatedTime} min
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Actual time:</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {task.actualTime} min
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Pomodoro sessions:
                </p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {task.pomodoroSessions}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Completion:</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {task.status === "Completed"
                    ? `Completed on ${formatDate(task.completedAt!)}`
                    : "Not completed yet"}
                </p>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Tags:
                </p>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {task.notes && (
              <div className="mb-3">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Notes:
                </p>
                <div className="rounded-md bg-gray-50 p-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {task.notes.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3">
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Add a note:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Add a quick note..."
                />
                <button
                  onClick={handleAddNote}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange("Pending")}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    task.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-700 hover:bg-yellow-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Pending
                </button>

                <button
                  onClick={() => handleStatusChange("In Progress")}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    task.status === "In Progress"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  In Progress
                </button>

                <button
                  onClick={() => handleStatusChange("Completed")}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-green-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <CheckIcon className="-ml-0.5 mr-1 h-4 w-4" />
                  Completed
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(task)}
                  className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
                >
                  <PencilIcon className="-ml-0.5 mr-1 h-4 w-4" />
                  Edit
                </button>

                <button
                  onClick={handleDuplicate}
                  className="inline-flex items-center rounded-md bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
                >
                  <DocumentDuplicateIcon className="-ml-0.5 mr-1 h-4 w-4" />
                  Duplicate
                </button>

                <button
                  onClick={handleDelete}
                  className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                >
                  <TrashIcon className="-ml-0.5 mr-1 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
