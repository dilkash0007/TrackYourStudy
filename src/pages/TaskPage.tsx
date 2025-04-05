import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, useTaskStore } from "../store/taskStore";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskFilterBar } from "../components/tasks/TaskFilterBar";
import {
  PlusIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  ClipboardDocumentCheckIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Add the TaskItem component definition at the top of the file, outside the TaskPage component
const TaskItem = ({
  task,
  onComplete,
  onEdit,
  onDelete,
}: {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) => {
  // Helper function to check status and priority case-insensitively
  const matchStatus = (status: string): boolean =>
    task.status.toLowerCase() === status.toLowerCase();

  const matchPriority = (priority: string): boolean =>
    task.priority.toLowerCase() === priority.toLowerCase();

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div className="flex-1">
        <div className="flex items-center mb-2 flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              matchStatus("Completed")
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                : matchStatus("In Progress")
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
            }`}
          >
            {task.status}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              matchPriority("High")
                ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                : matchPriority("Medium")
                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300"
            }`}
          >
            {task.priority}
          </span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {task.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2 line-clamp-2">
          {task.description}
        </p>
        {task.dueDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex items-center mt-4 md:mt-0 gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onComplete(task)}
          className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800/50 shadow-sm"
        >
          <CheckIcon className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800/50 shadow-sm"
        >
          <PencilIcon className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/50 shadow-sm"
        >
          <TrashIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Add a priority mapping helper for form values
const priorityMapping: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const TaskPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    tags: "",
    status: "Pending",
    category: "Homework",
    estimatedTime: 0,
    actualTime: 0,
  });

  const filteredTasks = useTaskStore((state) => state.filteredTasks);
  const allTasks = useTaskStore((state) => state.tasks);
  const applyFilters = useTaskStore((state) => state.applyFilters);

  console.log("All tasks in store:", allTasks);
  console.log("Filtered tasks:", filteredTasks);

  // Fix: Ensure we have tasks to display even if filtering isn't working
  const tasksToDisplay = filteredTasks.length > 0 ? filteredTasks : allTasks;

  // Task statistics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = allTasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const inProgressTasks = allTasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  // Calculate completion rate as a percentage
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate total estimated and actual time
  const totalEstimatedTime = allTasks.reduce(
    (total, task) => total + task.estimatedTime,
    0
  );
  const totalActualTime = allTasks.reduce(
    (total, task) => total + task.actualTime,
    0
  );

  // Get overdue tasks
  const today = new Date();
  const overdueTasks = allTasks.filter((task) => {
    if (task.status === "Completed") return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  }).length;

  // Fix the tabToStatusMap to match exact case from the taskStore
  const tabToStatusMap: Record<string, string | null> = {
    all: null,
    completed: "Completed",
    pending: "Pending",
    "in-progress": "In Progress",
  };

  // Force initial filtering when component mounts
  useEffect(() => {
    console.log("Applying filters on mount");
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    // Log whenever filteredTasks changes
    console.log("Filtered tasks updated:", filteredTasks);
  }, [filteredTasks]);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(undefined);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const resetFilters = () => {
    setActiveFilters([]);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    const addTask = useTaskStore.getState().addTask;
    const updateTask = useTaskStore.getState().updateTask;

    // Process tags: split string by commas and trim whitespace
    const processedTags = taskForm.tags
      ? taskForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    // Format due date
    const dueDate = taskForm.dueDate ? new Date(taskForm.dueDate) : new Date();

    // Map priority to proper case format
    const mappedPriority =
      priorityMapping[taskForm.priority.toLowerCase()] || "Medium";

    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        priority: mappedPriority as any,
        dueDate: dueDate.toISOString(),
        tags: processedTags,
      });
    } else {
      // Create new task
      addTask({
        title: taskForm.title,
        description: taskForm.description,
        subject: "General",
        priority: mappedPriority as any,
        dueDate: dueDate.toISOString(),
        status: "Pending",
        category: "Homework",
        notes: "",
        pomodoroSessions: 0,
        estimatedTime: taskForm.estimatedTime,
        actualTime: 0,
        tags: processedTags,
      });
    }

    // Close modal and reset form
    setShowAddTaskModal(false);
    setEditingTask(null);
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      tags: "",
      status: "Pending",
      category: "Homework",
      estimatedTime: 0,
      actualTime: 0,
    });
  };

  const toggleTaskCompletion = (task: Task) => {
    const setTaskStatus = useTaskStore.getState().setTaskStatus;
    setTaskStatus(
      task.id,
      task.status === "Completed" ? "Pending" : "Completed"
    );
  };

  const handleDeleteTask = (task: Task) => {
    setEditingTask(task);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTask = () => {
    if (editingTask) {
      const deleteTask = useTaskStore.getState().deleteTask;
      deleteTask(editingTask.id);
      setShowDeleteConfirm(false);
      setEditingTask(null);
    }
  };

  const tabs = [
    { key: "all", name: "All", icon: DocumentIcon, count: totalTasks },
    {
      key: "completed",
      name: "Completed",
      icon: CheckCircleIcon,
      count: completedTasks,
    },
    { key: "pending", name: "Pending", icon: ClockIcon, count: pendingTasks },
    {
      key: "in-progress",
      name: "In Progress",
      icon: ChartBarIcon,
      count: inProgressTasks,
    },
  ];

  // Add a debug function to see what's happening with the tasks
  const handleTabClick = (tabKey: string) => {
    console.log(`Clicking tab: ${tabKey}`);
    console.log("Current tasks:", allTasks);
    console.log(
      "Tasks with status",
      tabToStatusMap[tabKey],
      ":",
      allTasks.filter(
        (task) =>
          tabToStatusMap[tabKey] === null ||
          task.status === tabToStatusMap[tabKey]
      ).length
    );
    setActiveTab(tabKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-1.5 py-6"
    >
      {/* Header Section with gradient background */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Tasks Manager
            </h1>
            <p className="text-blue-100">
              Organize your tasks and boost productivity
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAddTaskModal(true)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-1.5 px-3 rounded-full text-sm flex items-center shadow-md"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Add Task
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-1.5 px-3 rounded-full text-sm flex items-center shadow-md"
              >
                <FunnelIcon className="w-4 h-4 mr-1" /> Filter
                {activeFilters.length > 0 && (
                  <span className="ml-1 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </motion.button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 p-3 border border-gray-100 dark:border-gray-700">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </h3>
                      <div className="space-y-1">
                        {["all", "pending", "completed", "in-progress"].map(
                          (status) => (
                            <label key={status} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={activeFilters.includes(status)}
                                onChange={() => toggleFilter(status)}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                              />
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {status === "all" ? "All" : status}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </h3>
                      <div className="space-y-1">
                        {["high", "medium", "low"].map((priority) => (
                          <label key={priority} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.includes(priority)}
                              onChange={() => toggleFilter(priority)}
                              className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {priority}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <button
                        onClick={resetFilters}
                        className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilterMenu(false)}
                        className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Overview with glass effect cards */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-blue-100 text-sm mb-1">Total Tasks</span>
              <span className="text-white text-2xl font-bold">
                {totalTasks}
              </span>
              <span className="text-blue-100 text-xs">
                {totalTasks} this week
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-green-100 text-sm mb-1">Completed</span>
              <span className="text-white text-2xl font-bold">
                {completedTasks}
              </span>
              <span className="text-green-100 text-xs">
                {completionRate}% success rate
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-orange-100 text-sm mb-1">Pending</span>
              <span className="text-white text-2xl font-bold">
                {pendingTasks}
              </span>
              <span className="text-orange-100 text-xs">
                {overdueTasks} overdue
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-purple-100 text-sm mb-1">In Progress</span>
              <span className="text-white text-2xl font-bold">
                {inProgressTasks}
              </span>
              <span className="text-purple-100 text-xs">
                Focus on these first
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Task Search */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-3 mb-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks by title, description, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Task Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mb-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
          <nav className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`inline-flex items-center whitespace-nowrap py-3 px-4 text-sm font-medium ${
                  activeTab === tab.key
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => handleTabClick(tab.key)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 text-xs rounded-full px-2 py-0.5 
                    ${
                      activeTab === tab.key
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {tasksToDisplay.length > 0 ? (
            tasksToDisplay.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TaskItem
                  task={task}
                  onComplete={toggleTaskCompletion}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center"
            >
              <DocumentIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-base">
                {activeTab === "all"
                  ? "You don't have any tasks yet. Add a new task to get started."
                  : activeTab === "completed"
                  ? "You haven't completed any tasks yet."
                  : activeTab === "pending"
                  ? "You don't have any pending tasks."
                  : "You don't have any tasks in progress."}
              </p>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="w-4 h-4 mr-1" /> Add New Task
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-lg w-full shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, dueDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={taskForm.tags}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. math, homework, project"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTaskModal(false);
                      setEditingTask(null);
                      resetTaskForm();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {editingTask ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Delete Task
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTask}
                  className="px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
