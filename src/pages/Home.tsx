import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarIcon,
  RocketLaunchIcon,
  FireIcon,
  MusicalNoteIcon,
  LightBulbIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import { useUserStore } from "../store/userStore";
import { usePlannerStore } from "../store/plannerStore";
import { useTaskStore } from "../store/taskStore";
import { usePomodoroStore } from "../store/pomodoroStore";
import { useHomeStore } from "../store/homeStore";

export const Home = () => {
  const { userProfile, userGoals } = useUserStore();
  const { getSessionStats, getSuggestedSessions } = usePlannerStore();
  const { getTaskSummary, getUpcomingTasks } = useTaskStore();
  const { getPomodoroInsights } = usePomodoroStore();

  const {
    quotes,
    studyTips,
    musicPlaylists,
    preferences,
    currentQuote,
    currentTip,
    refreshDailyContent,
    getRandomQuote,
    getRandomTip,
  } = useHomeStore();

  // Progress stats
  const [stats, setStats] = useState({
    totalHours: 0,
    completedTasks: 0,
    streak: 0,
    focusScore: 0,
  });

  // Upcoming sessions & tasks
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  // Motivational content
  const [quote, setQuote] = useState(currentQuote || getRandomQuote());
  const [studyTip, setStudyTip] = useState(currentTip || getRandomTip());

  // Random playlists - prioritize favorites
  const [displayedPlaylists, setDisplayedPlaylists] = useState<any[]>([]);

  // Current date & time
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const currentHour = currentDate.getHours();

  // Greeting based on time of day
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  // Function to refresh motivational content
  const handleRefreshTip = () => {
    const newTip = getRandomTip();
    setStudyTip(newTip);
  };

  const handleRefreshQuote = () => {
    const newQuote = getRandomQuote();
    setQuote(newQuote);
  };

  // Load data on component mount
  useEffect(() => {
    // If we don't have current daily content, refresh it
    if (!currentQuote || !currentTip) {
      refreshDailyContent();
    }

    const sessionStats = getSessionStats();
    const taskSummary = getTaskSummary();
    const pomodoroInsights = getPomodoroInsights();

    setStats({
      totalHours: sessionStats.totalHours,
      completedTasks: taskSummary.completed,
      streak: sessionStats.currentStreak,
      focusScore: pomodoroInsights.focusScore,
    });

    setUpcomingSessions(getSuggestedSessions().slice(0, 2));
    setUpcomingTasks(getUpcomingTasks().slice(0, 3));

    // Get playlists - prioritize favorites
    const favorites = musicPlaylists.filter((p) => p.isFavorite);
    const nonFavorites = musicPlaylists.filter((p) => !p.isFavorite);

    // Randomly select from non-favorites if we need more
    let selectedPlaylists = [...favorites];
    while (selectedPlaylists.length < 3 && nonFavorites.length > 0) {
      const randomIndex = Math.floor(Math.random() * nonFavorites.length);
      selectedPlaylists.push(nonFavorites[randomIndex]);
      nonFavorites.splice(randomIndex, 1);
    }

    setDisplayedPlaylists(
      selectedPlaylists.slice(0, 3).map((p) => ({
        id: p.id,
        title: p.title,
        image: p.imageUrl,
      }))
    );
  }, [
    getSessionStats,
    getTaskSummary,
    getPomodoroInsights,
    getSuggestedSessions,
    getUpcomingTasks,
    refreshDailyContent,
    currentQuote,
    currentTip,
    getRandomQuote,
    getRandomTip,
    musicPlaylists,
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Quick actions
  const quickActions = [
    {
      title: "Dashboard",
      description: "View study insights and stats",
      icon: <ChartBarIcon className="h-8 w-8 text-indigo-500" />,
      link: "/dashboard",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-900",
      textColor: "text-indigo-700 dark:text-indigo-300",
    },
    {
      title: "Tasks",
      description: "Manage your to-do list",
      icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
      link: "/task-manager",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-900",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Pomodoro Timer",
      description: "Focus with timed sessions",
      icon: <ClockIcon className="h-8 w-8 text-red-500" />,
      link: "/pomodoro",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-900",
      textColor: "text-red-700 dark:text-red-300",
    },
    {
      title: "Study Planner",
      description: "Schedule study sessions",
      icon: <BookOpenIcon className="h-8 w-8 text-blue-500" />,
      link: "/planner",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
    },
  ];

  // Filter quick actions if user has preferences
  const filteredQuickActions =
    preferences.quickAccessSections.length > 0
      ? quickActions.filter((action) => {
          const path = action.link.replace("/", ""); // Remove leading slash
          return preferences.quickAccessSections.includes(path);
        })
      : quickActions;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      {preferences.showWelcomeHero && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {greeting}, {userProfile.username}!
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {formattedDate}
              </p>
            </div>

            {preferences.showMotivationalQuote && (
              <div className="py-2 px-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 relative group">
                <blockquote className="italic">"{quote.text}"</blockquote>
                <p className="text-right text-xs mt-1">— {quote.author}</p>
                <button
                  onClick={handleRefreshQuote}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300"
                  aria-label="Get new quote"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      {preferences.showQuickStats && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <div className="mb-2 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <ClockIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalHours.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Study Hours
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <div className="mb-2 p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tasks Done
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <div className="mb-2 p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <FireIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.streak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Day Streak
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <div className="mb-2 p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <AcademicCapIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.focusScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Focus Score
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Actions and Tips */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1 space-y-6"
        >
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {filteredQuickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`block p-4 rounded-lg border ${action.borderColor} ${action.bgColor} transition-transform hover:scale-102 transform hover:-translate-y-1`}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-white dark:bg-gray-800 rounded-lg">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${action.textColor}`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Study Tip */}
          {preferences.showStudyTips && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Today's Tip
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleRefreshTip}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label="Get new tip"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                  <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900">
                <p className="text-gray-800 dark:text-gray-200">
                  {studyTip.content}
                </p>
                <div className="mt-2">
                  <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">
                    {studyTip.category}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Music Widget */}
          {preferences.showMusicWidget && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Focus Music
                </h2>
                <MusicalNoteIcon className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="space-y-3">
                {displayedPlaylists.map((playlist) => (
                  <Link
                    key={playlist.id}
                    to="/dashboard"
                    className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <img
                      src={playlist.image}
                      alt={playlist.title}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {playlist.title}
                    </span>
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-2"
                >
                  View more playlists →
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 space-y-6"
        >
          {/* Welcome Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow text-white"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to TrackYouStudy
                </h2>
                <p className="mb-4">
                  Your personal study companion to boost productivity and track
                  progress.
                </p>
                {userGoals.length > 0 ? (
                  <div>
                    <p className="font-medium mb-2">Your top goal:</p>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span>{userGoals[0].title}</span>
                        <span>
                          {userGoals[0].currentValue}/{userGoals[0].targetValue}{" "}
                          {userGoals[0].unit}
                        </span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (userGoals[0].currentValue /
                                userGoals[0].targetValue) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/profile?tab=goals"
                    className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium"
                  >
                    Set your first goal
                  </Link>
                )}
              </div>
              <div className="hidden md:block">
                <SparklesIcon className="h-20 w-20 text-white/80" />
              </div>
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          {preferences.showUpcomingTasks && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upcoming Tasks
                </h2>
                <Link
                  to="/task-manager"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  View all →
                </Link>
              </div>

              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due:{" "}
                            {format(new Date(task.dueDate), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/task-manager/new"
                    className="block w-full text-center py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                  >
                    + Add new task
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-3">
                    No upcoming tasks. Start by adding one!
                  </p>
                  <Link
                    to="/task-manager/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    Add Task
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Suggested Study Sessions */}
          {preferences.showUpcomingSessions && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Suggested Study Sessions
                </h2>
                <Link
                  to="/planner"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  View all →
                </Link>
              </div>

              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {session.title}
                        </h3>
                        <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full">
                          {session.category}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>
                          {format(new Date(session.startTime), "MMM d, h:mm a")}
                          ({Math.round((session.duration / 60) * 10) / 10}{" "}
                          hours)
                        </span>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Link
                          to={`/planner?session=${session.id}`}
                          className="text-xs px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        >
                          View Details
                        </Link>
                        <Link
                          to="/pomodoro"
                          className="text-xs px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          Start Focus Timer
                        </Link>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/planner?create=session"
                    className="block w-full text-center py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                  >
                    + Schedule new study session
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-3">
                    No suggested sessions. Schedule your first one!
                  </p>
                  <Link
                    to="/planner?create=session"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    Schedule Session
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
