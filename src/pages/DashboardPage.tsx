import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useDashboardStore, getUnifiedAppStats } from "../store/dashboardStore";
import { useUserStore } from "../store/userStore";
import { usePlannerStore } from "../store/plannerStore";
import { useTaskStore } from "../store/taskStore";
import { usePomodoroStore } from "../store/pomodoroStore";
import {
  StatsOverviewCard,
  SubjectBreakdownChart,
  WeeklyProgressChart,
  QuickAccessCard,
  UpcomingSessionsCard,
  DailyTipCard,
  GoalTrackingCard,
  LeaderboardCard,
  FocusMusicCard,
} from "../components/dashboard";

export const DashboardPage = () => {
  // Ref to track initialization
  const initialized = useRef(false);

  // Get unified stats directly
  const unifiedStats = getUnifiedAppStats();

  // Get userStore for profile data
  const userStore = useUserStore();
  const userProfileId = userStore.userProfile?.id;
  const userProfileUsername = userStore.userProfile?.username;
  const userProfilePicture = userStore.userProfile?.profilePicture;
  const userGoals = userStore.userGoals || [];

  // Current date for greeting
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");

  // Greeting based on time of day
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  // State for stats - initialize directly from unifiedStats
  const [stats, setStats] = useState({
    totalHours: unifiedStats.totalHours || 0,
    completedTasks: unifiedStats.completedTasks || 0,
    currentStreak: unifiedStats.currentStreak || 0,
    focusScore: unifiedStats.pomodoroStats.focusScore || 0,
  });

  // Get planner data
  const plannerStore = usePlannerStore.getState();

  // Get subject data
  const [subjectData, setSubjectData] = useState<Record<string, number>>({});
  useEffect(() => {
    const subjects: Record<string, number> = {};
    const categoryBreakdown = plannerStore.getCategoryBreakdown(
      "2000-01-01",
      new Date().toISOString()
    );

    categoryBreakdown.forEach((item) => {
      subjects[item.category] = item.hours;
    });

    setSubjectData(subjects);
  }, []);

  // Get focus data
  const [focusData, setFocusData] = useState(
    unifiedStats.pomodoroStats.weeklyFocusData || {
      currentWeek: [0, 0, 0, 0, 0, 0, 0],
      previousWeek: [0, 0, 0, 0, 0, 0, 0],
    }
  );

  // Get upcoming sessions
  const upcomingSessions = plannerStore.getUpcomingSessions
    ? plannerStore.getUpcomingSessions().map((s) => ({
        id: s.id,
        title: s.title,
        subject: s.category,
        date: new Date(s.startTime),
        duration: s.duration || 0,
        location: s.location || "",
      }))
    : [];

  // Get user data (with error handling)
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [musicPlaylists, setMusicPlaylists] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Add missing study tip and quote states
  const [studyTip, setStudyTip] = useState({
    id: "1",
    content:
      "Use the Pomodoro technique: Study for 25 minutes, then take a 5-minute break to maintain focus and productivity.",
    category: "Focus & Productivity",
  });

  const [quote, setQuote] = useState({
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
  });

  // Function to get new study tip
  const getNewTip = () => {
    // In a real app, this would fetch from an API or local database
    const tips = [
      {
        id: "2",
        content:
          "Create a dedicated study space free from distractions to improve concentration.",
        category: "Environment",
      },
      {
        id: "3",
        content:
          "Use active recall instead of passive reading. Quiz yourself on material to strengthen memory.",
        category: "Memory & Retention",
      },
      {
        id: "4",
        content:
          "Teach what you learn to someone else (or pretend to). It helps identify gaps in your understanding.",
        category: "Learning Techniques",
      },
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setStudyTip(randomTip);
  };

  // Function for playlist selection
  const handlePlaylistSelect = (playlistId: string) => {
    // In a real app, this would trigger the music player
  };

  useEffect(() => {
    if (!initialized.current) {
      try {
        if (typeof userStore.getNotes === "function") {
          setRecentNotes(userStore.getNotes().slice(0, 3));
        }

        if (typeof userStore.getPlaylists === "function") {
          setMusicPlaylists(userStore.getPlaylists());
        }

        if (typeof userStore.getLeaderboard === "function") {
          setLeaderboard(userStore.getLeaderboard());
        }

        initialized.current = true;
      } catch (error) {
        // Handle error silently
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-1.5 py-6"
    >
      {/* Header section with gradient background */}
      <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {greeting}, {userProfileUsername || "Student"}!
            </h1>
            <p className="text-purple-100">{formattedDate}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full shadow-md"
          >
            <p className="text-white font-medium flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-400 rounded-full mr-2 text-xs font-bold">
                {stats.currentStreak}
              </span>
              Day Streak 🔥
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats overview with glass effect cards */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-blue-100 text-sm mb-1">Total Hours</span>
              <span className="text-white text-2xl font-bold">
                {stats.totalHours}
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
              <span className="text-green-100 text-sm mb-1">
                Completed Tasks
              </span>
              <span className="text-white text-2xl font-bold">
                {stats.completedTasks}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-purple-100 text-sm mb-1">
                Current Streak
              </span>
              <span className="text-white text-2xl font-bold">
                {stats.currentStreak}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-orange-100 text-sm mb-1">Focus Score</span>
              <span className="text-white text-2xl font-bold">
                {stats.focusScore}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main dashboard grid with improved styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Charts section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Weekly Progress
            </h2>
            <WeeklyProgressChart
              dailyData={focusData.currentWeek}
              previousWeekData={focusData.previousWeek}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Subject Breakdown
            </h2>
            <SubjectBreakdownChart subjectData={subjectData} />
          </div>
        </motion.div>

        {/* Sidebar cards with glass effect */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-indigo-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-indigo-800 dark:text-white mb-3">
              Quick Access
            </h2>
            <QuickAccessCard recentNotes={recentNotes} />
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-white mb-3">
              Upcoming Sessions
            </h2>
            <UpcomingSessionsCard sessions={upcomingSessions} />
          </div>
        </motion.div>
      </div>

      {/* Bottom section with more engaging design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-amber-100 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-amber-800 dark:text-white mb-3">
            Daily Wisdom
          </h2>
          <DailyTipCard tip={studyTip} onGetNewTip={getNewTip} quote={quote} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-emerald-100 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-emerald-800 dark:text-white mb-3">
            Goal Tracking
          </h2>
          <GoalTrackingCard goals={userGoals} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-pink-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-pink-800 dark:text-white mb-3">
              Leaderboard
            </h2>
            <LeaderboardCard
              entries={leaderboard}
              currentUserId={userProfileId}
            />
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl shadow-lg border border-violet-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-violet-800 dark:text-white mb-3">
              Focus Music
            </h2>
            <FocusMusicCard
              playlists={musicPlaylists}
              onPlaylistSelect={handlePlaylistSelect}
              currentlyPlaying={{
                isPlaying: true,
                currentTrack: {
                  title: "Deep Focus - Track 03",
                  artist: "Study Music",
                  duration: 240,
                  currentTime: 75,
                },
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
