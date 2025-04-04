import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  BoltIcon,
  CalendarIcon,
  MusicalNoteIcon,
  FireIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Import stores
import { useUserStore } from "../store/userStore";
import { usePlannerStore } from "../store/plannerStore";
import { useTaskStore } from "../store/taskStore";
import { usePomodoroStore } from "../store/pomodoroStore";
import { useHomeStore } from "../store/homeStore";
import { useDashboardStore, getUnifiedAppStats } from "../store/dashboardStore";

// Import types
import { Task } from "../types/task";
import { StudySession } from "../types/planner";
import { TaskCard } from "../components/tasks/TaskCard";
import { PieChart } from "../components/charts/PieChart";
import { LineChart } from "../components/charts/LineChart";
import { SessionCard } from "../components/planner/SessionCard";
import { PomodoroTimer } from "../components/pomodoro/PomodoroTimer";
import { StreakCalendar } from "../components/stats/StreakCalendar";
import { LoginPrompt } from "../components/ui/LoginPrompt";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Get user data from store
  const { name, isAuthenticated } = useUserStore();

  // Login prompt state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState(
    "Please login or create an account to continue."
  );

  // Function to handle features that require authentication
  const handleAuthRequired = (feature: string) => {
    if (!isAuthenticated) {
      setLoginPromptMessage(
        `Please login or create an account to use the ${feature} feature.`
      );
      setShowLoginPrompt(true);
      return true;
    }
    return false;
  };

  // Ref to track initialization
  const initialized = useRef(false);

  // Get the unified stats once
  const unifiedStats = getUnifiedAppStats();

  // State for home sections - initialized directly with unified stats
  const [stats, setStats] = useState({
    tasks: {
      completed: unifiedStats.taskStats.completed || 0,
      pending: unifiedStats.taskStats.pending || 0,
      overdue: unifiedStats.taskStats.overdue || 0,
    },
    sessions: {
      completed: unifiedStats.sessionStats.completedSessions || 0,
      upcoming: unifiedStats.sessionStats.pendingSessions || 0,
      totalHours: unifiedStats.totalHours || 0,
    },
    pomodoro: {
      todayMinutes: unifiedStats.pomodoroStats.todayFocusTime || 0,
      weeklyMinutes:
        unifiedStats.pomodoroStats.weeklyFocusTime?.reduce(
          (a, b) => a + b,
          0
        ) || 0,
      completedToday: unifiedStats.pomodoroStats.completedToday || 0,
      focusScore: unifiedStats.pomodoroStats.focusScore || 0,
    },
    streak: {
      current: unifiedStats.currentStreak || 0,
      longest: unifiedStats.streakData.longestStreak || 0,
      thisWeek: 0,
      thisMonth: 0,
    },
  });

  // Get data from home store
  const {
    quotes,
    studyTips,
    musicPlaylists,
    getRandomQuote,
    getRandomStudyTip,
  } = useHomeStore();

  // Get planner store for upcoming sessions
  const plannerStore = usePlannerStore.getState();
  const upcomingSessions = plannerStore.getUpcomingSessions
    ? plannerStore.getUpcomingSessions()
    : [];

  // Get task store for upcoming tasks
  const taskStore = useTaskStore.getState();
  const upcomingTasks = taskStore.getUpcomingTasks
    ? taskStore.getUpcomingTasks()
    : [];

  // UI state
  const [currentQuote, setCurrentQuote] = useState(
    quotes && quotes.length > 0
      ? quotes[0]
      : { text: "Study hard!", author: "TrackYouStudy" }
  );

  const [currentTip, setCurrentTip] = useState(
    studyTips && studyTips.length > 0
      ? studyTips[0]
      : {
          text: "Break your study sessions into smaller chunks for better retention.",
          category: "Focus",
        }
  );

  const [playlists, setPlaylists] = useState(musicPlaylists || []);

  // Initialize once - just for the quote and tip
  useEffect(() => {
    if (!initialized.current) {
      // Get random quote and tip
      if (
        typeof getRandomQuote === "function" &&
        typeof getRandomStudyTip === "function"
      ) {
        refreshQuote();
        refreshTip();
      }

      initialized.current = true;
    }
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format date to display day of week and date
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Refresh quote
  const refreshQuote = () => {
    if (typeof getRandomQuote === "function") {
      setCurrentQuote(getRandomQuote());
    }
  };

  // Refresh tip
  const refreshTip = () => {
    if (typeof getRandomStudyTip === "function") {
      setCurrentTip(getRandomStudyTip());
    }
  };

  // Task data for the chart
  const taskChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [stats.tasks.completed, stats.tasks.pending],
        backgroundColor: ["#4ade80", "#f97316"],
        borderWidth: 0,
      },
    ],
  };

  // Session data for the chart
  const sessionChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "This Week",
        data: [2, 5, 3, 4, 6, 3, 1],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        tension: 0.3,
      },
      {
        label: "Last Week",
        data: [3, 2, 4, 2, 5, 1, 2],
        borderColor: "#e879f9",
        backgroundColor: "rgba(232, 121, 249, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // Handle task card click
  const handleTaskCardClick = (taskId: string) => {
    if (!handleAuthRequired("Tasks")) {
      navigate("/tasks");
    }
  };

  // Handle session card click
  const handleSessionCardClick = (sessionId: string) => {
    if (!handleAuthRequired("Planner")) {
      navigate("/planner");
    }
  };

  // Handle pomodoro start
  const handlePomodoroStart = () => {
    if (!handleAuthRequired("Pomodoro")) {
      navigate("/pomodoro");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-1.5 py-6"
    >
      {/* Login prompt component */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message={loginPromptMessage}
      />

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
              {getGreeting()}, {name || "Student"}!
            </h1>
            <p className="text-blue-100">{formatDate()}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full shadow-md"
          >
            <p className="text-white font-medium flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-400 rounded-full mr-2 text-xs font-bold">
                {stats.streak.current}
              </span>
              Day Streak 🔥
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Quote Card with new design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 md:p-4 text-white mb-6 shadow-lg"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start">
          <div className="pr-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-lg md:text-xl font-medium mb-2">
                "{currentQuote.text}"
              </p>
              <p className="text-sm md:text-base text-white text-opacity-80">
                — {currentQuote.author}
              </p>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            onClick={refreshQuote}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all flex-shrink-0"
          >
            <ArrowPathIcon className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards with glass effect */}
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
              <span className="text-blue-100 text-sm mb-1">Study Hours</span>
              <span className="text-white text-2xl font-bold">
                {stats.sessions.totalHours}
              </span>
              <span className="text-blue-100 text-xs">
                {stats.sessions.upcoming} this week
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
              <span className="text-green-100 text-sm mb-1">Tasks Done</span>
              <span className="text-white text-2xl font-bold">
                {stats.tasks.completed}
              </span>
              <span className="text-green-100 text-xs">
                {stats.tasks.pending} pending
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
              <span className="text-orange-100 text-sm mb-1">Streak</span>
              <span className="text-white text-2xl font-bold">
                {stats.streak.current}
              </span>
              <span className="text-orange-100 text-xs">days</span>
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
              <span className="text-purple-100 text-sm mb-1">Focus Score</span>
              <span className="text-white text-2xl font-bold">
                {stats.pomodoro.focusScore || 0}
              </span>
              <span className="text-purple-100 text-xs">
                {stats.pomodoro.focusScore >= 80 ? "Excellent!" : "Good!"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col items-center text-center cursor-pointer"
                onClick={() => {
                  if (!handleAuthRequired("Tasks")) {
                    navigate("/tasks");
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Tasks</h3>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col items-center text-center cursor-pointer"
                onClick={() => {
                  if (!handleAuthRequired("Planner")) {
                    navigate("/planner");
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium">Planner</h3>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col items-center text-center cursor-pointer"
                onClick={() => {
                  if (!handleAuthRequired("Pomodoro")) {
                    navigate("/pomodoro");
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2">
                  <ClockIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-medium">Pomodoro</h3>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col items-center text-center cursor-pointer"
                onClick={() => {
                  if (!handleAuthRequired("Dashboard")) {
                    navigate("/dashboard");
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                  <ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium">Stats</h3>
              </motion.div>
            </div>
          </motion.div>

          {/* Today's Study Tip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-amber-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-amber-800 dark:text-white">
                Today's Study Tip
              </h2>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                onClick={refreshTip}
                className="p-1.5 rounded-full bg-amber-200/50 dark:bg-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              </motion.button>
            </div>
            <div className="flex items-start space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-amber-200 dark:bg-amber-900/30 p-2 rounded-full flex-shrink-0"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {currentTip.text}
                </p>
                <span className="inline-block px-2 py-1 text-xs bg-amber-200/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded">
                  {currentTip.category}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Music Widget */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-violet-100 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-3 text-violet-800 dark:text-white">
              Focus Music
            </h2>
            <div className="space-y-2">
              {playlists.slice(0, 3).map((playlist, index) => (
                <motion.a
                  key={index}
                  whileHover={{ x: 5 }}
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-white/60 dark:bg-gray-700/50 rounded-lg hover:bg-white dark:hover:bg-gray-600/50 transition-colors"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-violet-200 dark:bg-violet-800/50 rounded-full flex items-center justify-center mr-2">
                    <MusicalNoteIcon className="w-4 h-4 md:w-5 md:h-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {playlist.category}
                    </p>
                  </div>
                </motion.a>
              ))}
              <Link
                to="/music"
                className="text-xs md:text-sm text-violet-600 dark:text-violet-400 flex items-center hover:underline mt-1"
              >
                View all playlists <ArrowRightIcon className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Welcome Card with glass effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl p-3 text-white shadow-lg"
          >
            <h2 className="text-lg font-bold mb-2">Welcome to TrackYouStudy</h2>
            <p className="text-sm text-white text-opacity-90 mb-3">
              Track your progress, manage your tasks, and boost your
              productivity.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            >
              Your Profile <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-blue-800 dark:text-white">
                Upcoming Tasks
              </h2>
              <Link
                to="/tasks"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>

            {upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {upcomingTasks.slice(0, 3).map((task, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 3 }}
                    className="p-2 bg-white/60 dark:bg-gray-700/50 rounded-lg border-l-4 border-blue-500"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {task.title}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          task.priority === "high"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            : task.priority === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        }`}
                      >
                        {task.priority && typeof task.priority === "string"
                          ? task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)
                          : "Normal"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
                No upcoming tasks. Create a new task to get started.
              </p>
            )}

            <Link
              to="/tasks/new"
              className="mt-3 block w-full bg-blue-200/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-center py-1.5 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            >
              Create New Task
            </Link>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-purple-800 dark:text-white">
                Study Sessions
              </h2>
              <Link
                to="/planner"
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                View all
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-2">
                {upcomingSessions.slice(0, 3).map((session, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 3 }}
                    className="p-2 bg-white/60 dark:bg-gray-700/50 rounded-lg border-l-4 border-purple-500"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {session.title}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(session.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {session.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
                No upcoming sessions. Plan a study session to get started.
              </p>
            )}

            <Link
              to="/planner/new"
              className="mt-3 block w-full bg-purple-200/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-center py-1.5 rounded-md text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
            >
              Schedule Session
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Call to action if not authenticated */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800"
        >
          <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
            Sign in to get the full experience
          </h3>
          <p className="text-indigo-700 dark:text-indigo-300 mb-4">
            Create an account to track your progress, set goals, and become more
            productive in your studies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 font-medium rounded-md"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export { HomePage };
