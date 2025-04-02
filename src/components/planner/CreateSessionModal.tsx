import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePlannerStore, StudyCategory } from "../../store/plannerStore";
import { useTaskStore } from "../../store/taskStore";
import { format, addHours } from "date-fns";

interface CreateSessionModalProps {
  onClose: () => void;
  categories: StudyCategory[];
  initialDate?: Date;
  editSessionId?: string;
}

export const CreateSessionModal = ({
  onClose,
  categories,
  initialDate = new Date(),
  editSessionId,
}: CreateSessionModalProps) => {
  const { addSession, updateSession, sessions, suggestStudyTimes } =
    usePlannerStore();
  const { tasks } = useTaskStore();

  // Filter for incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed);

  // If editing, get the session data
  const existingSession = editSessionId
    ? sessions.find((session) => session.id === editSessionId)
    : null;

  // Set default time to next hour
  const defaultStartTime = format(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      initialDate.getDate(),
      initialDate.getHours() + 1,
      0
    ),
    "yyyy-MM-dd'T'HH:mm"
  );

  const defaultEndTime = format(
    addHours(new Date(defaultStartTime), 1),
    "yyyy-MM-dd'T'HH:mm"
  );

  // Form state
  const [formData, setFormData] = useState({
    title: existingSession?.title || "",
    description: existingSession?.description || "",
    startTime: existingSession?.startTime
      ? format(new Date(existingSession.startTime), "yyyy-MM-dd'T'HH:mm")
      : defaultStartTime,
    endTime: existingSession?.endTime
      ? format(new Date(existingSession.endTime), "yyyy-MM-dd'T'HH:mm")
      : defaultEndTime,
    category: existingSession?.category || categories[0]?.id || "",
    priority: existingSession?.priority || "medium",
    associatedTaskIds: existingSession?.associatedTaskIds || [],
    pomodoroCount: existingSession?.pomodoroCount || 2,
  });

  // For form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // For suggested times
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedTimes, setSuggestedTimes] = useState<
    { startTime: string; endTime: string }[]
  >([]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any errors for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle task selection
  const handleTaskChange = (taskId: string) => {
    setFormData((prev) => {
      const taskIds = prev.associatedTaskIds.includes(taskId)
        ? prev.associatedTaskIds.filter((id) => id !== taskId)
        : [...prev.associatedTaskIds, taskId];

      // If a high priority task is selected, suggest setting the session priority to high
      if (!prev.associatedTaskIds.includes(taskId)) {
        const selectedTask = tasks.find((task) => task.id === taskId);
        if (
          selectedTask &&
          selectedTask.priority === "high" &&
          prev.priority !== "high"
        ) {
          return {
            ...prev,
            associatedTaskIds: taskIds,
            priority: "high",
          };
        }
      }

      return {
        ...prev,
        associatedTaskIds: taskIds,
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      validationErrors.title = "Title is required";
    }

    if (!formData.startTime) {
      validationErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      validationErrors.endTime = "End time is required";
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      validationErrors.endTime = "End time must be after start time";
    }

    if (!formData.category) {
      validationErrors.category = "Category is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create or update session
    if (existingSession) {
      updateSession(existingSession.id, {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        category: formData.category,
        priority: formData.priority as "low" | "medium" | "high",
        associatedTaskIds: formData.associatedTaskIds,
        pomodoroCount: Number(formData.pomodoroCount),
      });
    } else {
      addSession({
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        category: formData.category,
        priority: formData.priority as "low" | "medium" | "high",
        isCompleted: false,
        associatedTaskIds: formData.associatedTaskIds,
        pomodoroCount: Number(formData.pomodoroCount),
        completedPomodoros: 0,
      });
    }

    onClose();
  };

  // Get suggested times for creating a session
  const handleSuggestTimes = () => {
    const durationMs =
      new Date(formData.endTime).getTime() -
      new Date(formData.startTime).getTime();
    const durationMinutes = durationMs / (1000 * 60);

    const suggestions = suggestStudyTimes(durationMinutes);
    setSuggestedTimes(suggestions);
    setShowSuggestions(true);
  };

  // Apply a suggested time
  const applySuggestedTime = (suggestion: {
    startTime: string;
    endTime: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      startTime: format(new Date(suggestion.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(suggestion.endTime), "yyyy-MM-dd'T'HH:mm"),
    }));
    setShowSuggestions(false);
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
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {existingSession ? "Edit Study Session" : "Create Study Session"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Session Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.title
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="What will you study?"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Add details about what you plan to study"
            />
          </div>

          {/* Time section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Session Time*
              </label>
              <button
                type="button"
                onClick={handleSuggestTimes}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Suggest times
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm text-gray-500 dark:text-gray-400 mb-1"
                >
                  Start
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.startTime
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.startTime}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm text-gray-500 dark:text-gray-400 mb-1"
                >
                  End
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.endTime
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Suggested times */}
            {showSuggestions && suggestedTimes.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suggested Times:
                </h4>
                <div className="space-y-2">
                  {suggestedTimes.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-sm"
                    >
                      <span className="text-gray-600 dark:text-gray-300">
                        {format(
                          new Date(suggestion.startTime),
                          "MMM d, h:mm a"
                        )}{" "}
                        - {format(new Date(suggestion.endTime), "h:mm a")}
                      </span>
                      <button
                        type="button"
                        onClick={() => applySuggestedTime(suggestion)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Hide suggestions
                </button>
              </div>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.category
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.category}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Pomodoro Count */}
          <div className="mb-4">
            <label
              htmlFor="pomodoroCount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Number of Pomodoro Sessions
            </label>
            <input
              type="number"
              id="pomodoroCount"
              name="pomodoroCount"
              value={formData.pomodoroCount}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Plan how many Pomodoro sessions (25 min each) you'll need
            </p>
          </div>

          {/* Associated Tasks */}
          {incompleteTasks.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Associated Tasks
              </label>
              <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={formData.associatedTaskIds.includes(task.id)}
                      onChange={() => handleTaskChange(task.id)}
                      className="h-4 w-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      {task.title}
                      {task.priority === "high" && (
                        <span className="ml-2 inline-block px-1 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                          High Priority
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Link tasks to this study session for better organization
              </p>
            </div>
          )}

          {/* Submit buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {existingSession ? "Update Session" : "Create Session"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
