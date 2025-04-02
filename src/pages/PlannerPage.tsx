import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  usePlannerStore,
  StudySession,
  StudyCategory,
} from "../store/plannerStore";
import { useTaskStore } from "../store/taskStore";
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  isSameDay,
  addWeeks,
  subWeeks,
  isWithinInterval,
} from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  PlusIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  DocumentIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon,
  LightBulbIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CreateSessionModal } from "../components/planner/CreateSessionModal";
import { SessionDetails } from "../components/planner/SessionDetails";
import { WeeklyCalendar } from "../components/planner/WeeklyCalendar";
import { GoalProgress } from "../components/planner/GoalProgress";
import { Filters } from "../components/planner/Filters";
import { SuggestedSessions } from "../components/planner/SuggestedSessions";
import { PlannerStatistics } from "../components/planner/PlannerStatistics";
import { GoalProgressList } from "../components/planner/GoalProgressList";
import { CreateGoalModal } from "../components/planner/CreateGoalModal";
import { ListViewSessions } from "../components/planner/ListViewSessions";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PlannerPage = () => {
  const {
    sessions,
    categories,
    goals,
    getSessions,
    getSuggestedSessions,
    completeSession,
    syncWithTasks,
    activeFilters,
    updateFilters,
    resetFilters,
    getTotalStudyHours,
    getCompletionRate,
    getCurrentStreak,
    addSession,
    updateSession,
    deleteSession,
    addSessionFromSuggestion,
  } = usePlannerStore();

  const { tasks } = useTaskStore();

  // State for modals and UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(
    null
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [viewMode, setViewMode] = useState<"week" | "list">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateGoal, setShowCreateGoal] = useState(false);

  // Calculate week dates
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: currentWeekEnd,
  });

  // Filter sessions for the current week
  const [currentWeekSessions, setCurrentWeekSessions] = useState<
    StudySession[]
  >([]);

  useEffect(() => {
    // Sync with tasks on mount
    const plannerStore = usePlannerStore.getState();
    if (plannerStore && typeof plannerStore.syncWithTasks === "function") {
      plannerStore.syncWithTasks();
    }
  }, []);

  // Separate effect for filtering sessions to avoid dependency issues
  useEffect(() => {
    let isMounted = true;
    const plannerStore = usePlannerStore.getState();
    if (!plannerStore) return;

    // Filter sessions for current week
    try {
      const startStr = currentWeekStart.toISOString();
      const endStr = currentWeekEnd.toISOString();

      if (typeof plannerStore.getSessions === "function") {
        const weekSessions = plannerStore.getSessions(startStr, endStr);

        // Apply additional filters
        let filteredSessions = weekSessions;

        if (activeFilters.categories.length > 0) {
          filteredSessions = filteredSessions.filter((session) =>
            activeFilters.categories.includes(session.category)
          );
        }

        if (activeFilters.priority.length > 0) {
          filteredSessions = filteredSessions.filter((session) =>
            activeFilters.priority.includes(session.priority)
          );
        }

        if (!activeFilters.showCompleted) {
          filteredSessions = filteredSessions.filter(
            (session) => !session.isCompleted
          );
        }

        if (isMounted) {
          setCurrentWeekSessions(filteredSessions);
        }
      }
    } catch (error) {
      console.error("Error filtering sessions:", error);
      if (isMounted) {
        setCurrentWeekSessions([]);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [currentWeekStart, currentWeekEnd, activeFilters, sessions]);

  // Get session suggestions
  const [suggestions, setSuggestions] = useState<Partial<StudySession>[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Create a local function to avoid dependency on getSuggestedSessions
    const fetchSuggestions = () => {
      try {
        const store = usePlannerStore.getState();
        if (store && typeof store.getSuggestedSessions === "function") {
          const sessionSuggestions = store.getSuggestedSessions();
          if (isMounted) {
            setSuggestions(sessionSuggestions);
          }
        }
      } catch (error) {
        console.error("Error fetching session suggestions:", error);
        if (isMounted) {
          setSuggestions([]);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate stats
  const calculateStats = () => {
    try {
      // Get the store state directly
      const plannerStore = usePlannerStore.getState();
      if (!plannerStore) {
        return {
          totalStudyHours: 0,
          completionRate: 0,
          currentStreak: 0,
          totalSessions: 0,
        };
      }

      // Safely get study hours for the current month
      let totalStudyHours = 0;
      try {
        const startDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString();
        const endDate = new Date().toISOString();
        if (typeof plannerStore.getTotalStudyHours === "function") {
          totalStudyHours =
            plannerStore.getTotalStudyHours(startDate, endDate) || 0;
        }
      } catch (error) {
        console.error("Error getting total study hours:", error);
      }

      // Calculate completion rate for the current month
      let completionRate = 0;
      try {
        const startDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString();
        const endDate = new Date().toISOString();
        if (typeof plannerStore.getCompletionRate === "function") {
          completionRate =
            plannerStore.getCompletionRate(startDate, endDate) || 0;
        }
      } catch (error) {
        console.error("Error getting completion rate:", error);
      }

      // Calculate completion rate for current week sessions
      const completedSessions = currentWeekSessions.filter(
        (s) => s.isCompleted
      ).length;
      const weekCompletionRate =
        currentWeekSessions.length > 0
          ? Math.round((completedSessions / currentWeekSessions.length) * 100)
          : 0;

      // Get current streak
      let currentStreak = 0;
      try {
        if (typeof plannerStore.getCurrentStreak === "function") {
          currentStreak = plannerStore.getCurrentStreak() || 0;
        }
      } catch (error) {
        console.error("Error getting current streak:", error);
      }

      // Calculate total study hours for the current week
      const weekStudyHours = currentWeekSessions.reduce((total, session) => {
        if (!session.startTime || !session.endTime) return total;

        try {
          const startTime = new Date(session.startTime);
          const endTime = new Date(session.endTime);
          const durationHours =
            (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + durationHours;
        } catch (e) {
          console.error("Error calculating duration for session", e);
          return total;
        }
      }, 0);

      return {
        totalStudyHours: totalStudyHours,
        weekStudyHours: weekStudyHours,
        completionRate: completionRate,
        weekCompletionRate: weekCompletionRate,
        currentStreak: currentStreak,
        totalSessions: currentWeekSessions.length,
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        totalStudyHours: 0,
        weekStudyHours: 0,
        completionRate: 0,
        weekCompletionRate: 0,
        currentStreak: 0,
        totalSessions: 0,
      };
    }
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up any pending operations or state
      setSelectedSession(null);
      setShowCreateModal(false);
      setShowFilterMenu(false);
      setShowCreateGoal(false);
    };
  }, []);

  const stats = calculateStats();

  // Navigate to previous/next week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  // Handle session click
  const handleSessionClick = (session: StudySession) => {
    setSelectedSession(session);
  };

  // Handle close detail view
  const handleCloseDetail = () => {
    setSelectedSession(null);
  };

  // Handle session completion
  const handleCompleteSession = (sessionId: string) => {
    if (typeof completeSession === "function") {
      completeSession(sessionId);
    }
    setSelectedSession(null);
  };

  // Helper to get category color
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#9333ea"; // Default purple if not found
  };

  // Toggle a filter
  const toggleFilter = (categoryId: string) => {
    updateFilters({
      ...activeFilters,
      categories: activeFilters.categories.includes(categoryId)
        ? activeFilters.categories.filter((id) => id !== categoryId)
        : [...activeFilters.categories, categoryId],
    });
  };

  // Clear all filters
  const clearFilters = () => {
    updateFilters({
      ...activeFilters,
      categories: [],
    });
  };

  // Get category information for a session
  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category?.name || "Uncategorized",
      color: category?.color || "#718096",
    };
  };

  // Mock data for charts
  const chartData = {
    labels: ["Math", "Science", "English", "History"],
    datasets: [
      {
        data: [12, 8, 6, 4],
        backgroundColor: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"],
      },
    ],
  };

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [2, 3, 1, 4, 2, 0, 1],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3 md:p-6 mx-auto max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            Study Planner
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Plan and track your study sessions
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-xs md:text-sm flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" /> New Session
          </button>
          <DatePicker
            selected={currentDate}
            onChange={(date) => setCurrentDate(date)}
            customInput={
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-xs md:text-sm flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                {format(currentDate, "MMM dd, yyyy")}
              </button>
            }
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-1 md:mb-2">
            <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2" />
            <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
              Total Hours
            </span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalStudyHours.toFixed(1)}
          </p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {stats.weekStudyHours.toFixed(1)} this week
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-1 md:mb-2">
            <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2" />
            <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
              Completion
            </span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completionRate.toFixed(0)}%
          </p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            This month
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-1 md:mb-2">
            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-500 mr-2" />
            <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
              Streak
            </span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {stats.currentStreak} days
          </p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Keep it going!
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-1 md:mb-2">
            <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 mr-2" />
            <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
              Weekly Goal
            </span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {stats.weekCompletionRate}%
          </p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {stats.weekStudyHours.toFixed(1)}/{stats.weekStudyHours.toFixed(1)}{" "}
            hours
          </p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Calendar and Sessions */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Calendar View */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-6 shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-white">
              Calendar
            </h2>
            <div className="overflow-x-auto">
              <div className="custom-calendar-container">
                <Calendar
                  value={currentDate}
                  onChange={(date) => setCurrentDate(date)}
                  tileClassName={({ date }) => {
                    try {
                      const hasSession = currentWeekSessions.some((session) => {
                        // Skip sessions without valid date
                        if (!session.date) return false;

                        try {
                          const sessionDate = new Date(session.date);
                          // Check if sessionDate is valid
                          if (isNaN(sessionDate.getTime())) return false;

                          const sessionDateStr = format(
                            sessionDate,
                            "yyyy-MM-dd"
                          );
                          const tileDate = format(date, "yyyy-MM-dd");
                          return sessionDateStr === tileDate;
                        } catch (err) {
                          console.error("Error formatting session date:", err);
                          return false;
                        }
                      });

                      return `calendar-tile ${hasSession ? "has-session" : ""}`;
                    } catch (err) {
                      console.error("Error in tileClassName:", err);
                      return "calendar-tile";
                    }
                  }}
                  className="w-full text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Session List for Selected Date */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-6 shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                Sessions for {format(currentDate, "MMMM d, yyyy")}
              </h2>
            </div>

            {currentWeekSessions.length > 0 ? (
              <div className="space-y-2 md:space-y-3">
                {currentWeekSessions.map((session, index) => (
                  <motion.div
                    key={index}
                    className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500 relative"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-2 md:mb-0">
                        <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-white">
                          {session.title}
                        </h3>
                        <div className="flex flex-wrap items-center mt-1 gap-2">
                          <span className="text-xs flex items-center text-gray-500 dark:text-gray-400">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {format(new Date(session.startTime), "h:mm a")} -
                            {format(new Date(session.endTime), "h:mm a")}
                          </span>
                          <span className="text-xs flex items-center text-gray-500 dark:text-gray-400">
                            <BookOpenIcon className="w-3 h-3 mr-1" />
                            {session.subject}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30 text-purple-800 dark:text-purple-300">
                            {session.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSessionClick(session)}
                          className={`p-1.5 rounded-md ${
                            session.isCompleted
                              ? "bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedSession(null)}
                          className="p-1.5 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-400 rounded-md"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-1.5 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 text-red-600 dark:text-red-400 rounded-md"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <DocumentIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  No sessions scheduled for this date
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 inline-flex items-center text-purple-600 dark:text-purple-400 text-xs md:text-sm font-medium hover:underline"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Study Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Suggestions and Stats */}
        <div className="space-y-4 md:space-y-6">
          {/* Suggested Study Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-6 shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-white">
              Suggested Study Sessions
            </h2>
            {suggestions.length > 0 ? (
              <div className="space-y-2 md:space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="p-2.5 md:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-md mr-3">
                        <LightBulbIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-white mb-1">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {suggestion.duration} mins • {suggestion.subject}
                          </span>
                          <button
                            onClick={() => addSessionFromSuggestion(suggestion)}
                            className="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 dark:hover:bg-opacity-50 text-blue-600 dark:text-blue-400 py-1 px-2 rounded"
                          >
                            Add Session
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
                No suggestions available for your tasks
              </p>
            )}
          </div>

          {/* Study Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-6 shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-white">
              Study Distribution
            </h2>
            <div className="h-48 md:h-60">
              {chartData.labels.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.datasets[0].data.map((value, index) => ({
                        name: chartData.labels[index],
                        value,
                        color: chartData.datasets[0].backgroundColor[index],
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.datasets[0].data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartData.datasets[0].backgroundColor[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value} hours`,
                        chartData.labels[
                          chartData.datasets[0].data.indexOf(value)
                        ],
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No study data available yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-6 shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-white">
              Weekly Progress
            </h2>
            <div className="h-48 md:h-60">
              {weeklyData.labels.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData.datasets[0].data.map((value, index) => ({
                      name: weeklyData.labels[index],
                      hours: value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value) => [`${value} hours`, "Study Time"]}
                    />
                    <Bar dataKey="hours" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No weekly data available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          categories={categories}
        />
      )}

      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          onClose={handleCloseDetail}
          onComplete={handleCompleteSession}
          categoryName={
            categories.find((c) => c.id === selectedSession.category)?.name ||
            "Unknown"
          }
          categoryColor={getCategoryColor(selectedSession.category)}
        />
      )}

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <CreateGoalModal onClose={() => setShowCreateGoal(false)} />
      )}
    </motion.div>
  );
};

export { PlannerPage };
