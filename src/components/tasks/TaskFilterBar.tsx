import { useState, useEffect } from "react";
import {
  TaskStatus,
  TaskPriority,
  TaskCategory,
  useTaskStore,
} from "../../store/taskStore";
import {
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const TaskFilterBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const activeFilters = useTaskStore((state) => state.activeFilters);
  const setActiveFilter = useTaskStore((state) => state.setActiveFilter);
  const tasks = useTaskStore((state) => state.tasks);

  // Extract unique subjects from tasks
  const subjects = [...new Set(tasks.map((task) => task.subject))];

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveFilter({ search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setActiveFilter]);

  const handleStatusChange = (status: TaskStatus | "All") => {
    setActiveFilter({ status });
  };

  const handlePriorityChange = (priority: TaskPriority | "All") => {
    setActiveFilter({ priority });
  };

  const handleCategoryChange = (category: TaskCategory | "All") => {
    setActiveFilter({ category });
  };

  const handleSubjectChange = (subject: string | "All") => {
    setActiveFilter({ subject });
  };

  const handleSortChange = (
    sortBy: "dueDate" | "priority" | "subject" | "status"
  ) => {
    if (activeFilters.sortBy === sortBy) {
      // Toggle sort order if clicking the same sort option
      setActiveFilter({
        sortOrder: activeFilters.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      // Set new sort option with default ascending order
      setActiveFilter({
        sortBy,
        sortOrder: "asc",
      });
    }
  };

  const getSortIcon = (sortField: string) => {
    if (activeFilters.sortBy !== sortField) return null;

    return activeFilters.sortOrder === "asc" ? (
      <ArrowUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Search tasks..."
          />
        </div>

        {/* Quick Filters and Expand Button */}
        <div className="flex flex-wrap items-center space-x-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange("All")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeFilters.status === "All"
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusChange("Pending")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeFilters.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange("In Progress")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeFilters.status === "In Progress"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange("Completed")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeFilters.status === "Completed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              Completed
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <FunnelIcon className="-ml-0.5 mr-1 h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Expanded Filter Options */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 md:grid-cols-2 lg:grid-cols-4">
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              value={activeFilters.priority}
              onChange={(e) =>
                handlePriorityChange(e.target.value as TaskPriority | "All")
              }
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={activeFilters.category}
              onChange={(e) =>
                handleCategoryChange(e.target.value as TaskCategory | "All")
              }
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="All">All Categories</option>
              <option value="Homework">Homework</option>
              <option value="Exam">Exam</option>
              <option value="Project">Project</option>
              <option value="Reading">Reading</option>
              <option value="Research">Research</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <select
              value={activeFilters.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="All">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <button
                onClick={() => handleSortChange("dueDate")}
                className={`inline-flex items-center rounded-md px-3 py-1 text-sm ${
                  activeFilters.sortBy === "dueDate"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                Due Date
                {getSortIcon("dueDate")}
              </button>
              <button
                onClick={() => handleSortChange("priority")}
                className={`inline-flex items-center rounded-md px-3 py-1 text-sm ${
                  activeFilters.sortBy === "priority"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                Priority
                {getSortIcon("priority")}
              </button>
              <button
                onClick={() => handleSortChange("subject")}
                className={`inline-flex items-center rounded-md px-3 py-1 text-sm ${
                  activeFilters.sortBy === "subject"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                Subject
                {getSortIcon("subject")}
              </button>
              <button
                onClick={() => handleSortChange("status")}
                className={`inline-flex items-center rounded-md px-3 py-1 text-sm ${
                  activeFilters.sortBy === "status"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                Status
                {getSortIcon("status")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
