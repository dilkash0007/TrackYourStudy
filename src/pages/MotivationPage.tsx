import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useMotivationStore } from "../store/motivationStore";
import { DailyQuote } from "../components/motivation/DailyQuote";
import { StreakDisplay } from "../components/motivation/StreakDisplay";
import { useTaskStore } from "../store/taskStore";
import { usePomodoroStore } from "../store/pomodoroStore";
import { usePlannerStore } from "../store/plannerStore";

// Heroicons
import {
  TrophyIcon,
  FireIcon,
  CalendarIcon,
  MusicalNoteIcon,
  BellAlertIcon,
  ListBulletIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const MotivationPage = () => {
  const motivationStore = useMotivationStore();
  const {
    currentStreak = 1,
    longestStreak = 1,
    badges = [],
    achievements = [],
    goals = [],
    playlists = [],
    rewards = [],
    leaderboardPosition = 0,
    incrementStreak,
  } = motivationStore || {};

  // Get data from other stores
  const taskStore = useTaskStore();
  const pomodoroStore = usePomodoroStore();
  const plannerStore = usePlannerStore();

  const tasks = taskStore?.tasks || [];
  const sessions = pomodoroStore?.sessions || [];
  const studySessions = plannerStore?.sessions || [];

  // Increment streak when user visits this page
  useEffect(() => {
    if (typeof incrementStreak === "function") {
      try {
        incrementStreak();
      } catch (error) {
        console.error("Error incrementing streak:", error);
      }
    }
  }, [incrementStreak]);

  // Calculate task stats
  const taskStats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task) => !task.completed);
    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      completedTasks,
      totalTasks,
      pendingTasks,
      taskCompletionRate,
    };
  }, [tasks]);

  // Calculate study hour stats
  const studyStats = useMemo(() => {
    // Calculate from pomodoro sessions
    const pomodoroHours = sessions.reduce((total, session) => {
      return total + (session.duration || 0) / 60;
    }, 0);

    // Calculate from study planner sessions
    const plannerHours = studySessions.reduce((total, session) => {
      try {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        const durationHours =
          (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        return total + durationHours;
      } catch (e) {
        return total;
      }
    }, 0);

    const totalStudyHours = pomodoroHours + plannerHours;

    return {
      totalStudyHours,
      pomodoroHours,
      plannerHours,
    };
  }, [sessions, studySessions]);

  // Get completed Pomodoro sessions for today
  const today = new Date().toISOString().split("T")[0];
  const todaysSessions = sessions.filter(
    (session) =>
      session.endTime &&
      new Date(session.endTime).toISOString().split("T")[0] === today
  );

  // Filter for unlocked badges
  const unlockedBadges = badges
    ? badges.filter((badge) => badge.unlockedAt)
    : [];

  // Filter for active goals
  const activeGoals = goals ? goals.filter((goal) => !goal.completed) : [];

  // For development testing only
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
      >
        Your Motivation Hub
      </motion.h1>

      {/* Dev Tools - only visible in development mode */}
      {isDev && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dev Tools
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => motivationStore?.testAddStreakDay?.()}
              className="px-3 py-1 bg-amber-500 text-white text-xs rounded hover:bg-amber-600"
            >
              Add Streak Day
            </button>
            <button
              onClick={() => motivationStore?.resetStreak?.()}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Reset Streak
            </button>
          </div>
        </div>
      )}

      {/* Streak Display Component */}
      <StreakDisplay />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Quote Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <DailyQuote />
        </div>

        {/* Study Hours Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <ClockIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Study Hours</h2>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-4xl font-bold">
                {studyStats.totalStudyHours.toFixed(1)}
              </p>
              <p className="text-white text-opacity-80">Total Hours</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">
                {studyStats.pomodoroHours.toFixed(1)}
              </p>
              <p className="text-white text-opacity-80">Pomodoro Hours</p>
            </div>
          </div>

          <p className="mt-4 text-white text-opacity-90">
            You've studied for {studyStats.totalStudyHours.toFixed(1)} hours
            total. Keep it up!
          </p>
        </motion.div>

        {/* Task Completion Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <ListBulletIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Task Completion</h2>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-4xl font-bold">{taskStats.completedTasks}</p>
              <p className="text-white text-opacity-80">Completed Tasks</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">
                {taskStats.taskCompletionRate}%
              </p>
              <p className="text-white text-opacity-80">Completion Rate</p>
            </div>
          </div>

          <p className="mt-4 text-white text-opacity-90">
            {taskStats.pendingTasks.length > 0
              ? `You have ${taskStats.pendingTasks.length} tasks remaining. Keep going!`
              : "All tasks completed! Great job!"}
          </p>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Achievements
            </h2>
          </div>

          <div className="space-y-4">
            {achievements &&
              achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                  ${
                    achievement.unlockedAt
                      ? "bg-yellow-100 dark:bg-yellow-900"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                  >
                    {achievement.icon === "trophy" && (
                      <TrophyIcon
                        className={`h-5 w-5 ${
                          achievement.unlockedAt
                            ? "text-yellow-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    )}
                    {achievement.icon === "fire" && (
                      <FireIcon
                        className={`h-5 w-5 ${
                          achievement.unlockedAt
                            ? "text-yellow-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    )}
                    {achievement.icon === "calendar" && (
                      <CalendarIcon
                        className={`h-5 w-5 ${
                          achievement.unlockedAt
                            ? "text-yellow-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="w-16 text-right">
                    <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs">
                      {achievement.progress}%
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <button className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
            View All Achievements
          </button>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🏆</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Badges
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {badges &&
              badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-3 rounded-lg
                  ${
                    badge.unlockedAt
                      ? "bg-indigo-50 dark:bg-indigo-900/30"
                      : "bg-gray-100 dark:bg-gray-700 opacity-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-2">
                    {badge.icon === "star" && (
                      <span className="text-2xl">⭐</span>
                    )}
                    {badge.icon === "calendar" && (
                      <span className="text-2xl">📅</span>
                    )}
                    {badge.icon === "target" && (
                      <span className="text-2xl">🎯</span>
                    )}
                  </div>
                  <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
                    {badge.name}
                  </p>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {badge.description}
                  </p>
                </div>
              ))}
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            You've unlocked {unlockedBadges.length} of{" "}
            {badges ? badges.length : 0} badges
          </p>
        </motion.div>

        {/* Tasks Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <ListBulletIcon className="h-6 w-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tasks Overview
            </h2>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Task Completion
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {taskStats.taskCompletionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${taskStats.taskCompletionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {taskStats.pendingTasks.length}
              </span>{" "}
              tasks remaining for today
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {taskStats.completedTasks}
              </span>{" "}
              tasks completed so far
            </p>
          </div>

          {taskStats.pendingTasks.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Next Up:
              </h3>
              <div className="space-y-2">
                {taskStats.pendingTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Pomodoro Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <ClockIcon className="h-6 w-6 mr-2 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Focus Time
            </h2>
          </div>

          <div className="mb-6">
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {todaysSessions.length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Pomodoro sessions today
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Today's Progress
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.min(todaysSessions.length, 8)}/8
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.min((todaysSessions.length / 8) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {todaysSessions.length > 0
              ? `Great work today! You've completed ${todaysSessions.length} focus sessions.`
              : "You haven't started any focus sessions today. Time to begin!"}
          </p>
        </motion.div>

        {/* Leaderboard Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <ArrowTrendingUpIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Leaderboard</h2>
          </div>

          <div className="text-center py-4">
            <p className="text-4xl font-bold">{leaderboardPosition || 0}</p>
            <p className="text-white text-opacity-90">Your Current Rank</p>
          </div>

          <p className="mt-2 text-white text-opacity-90">
            You're in the top{" "}
            {Math.round(((leaderboardPosition || 0) / 100) * 100)}% of all
            students! Keep studying to climb higher!
          </p>
        </motion.div>

        {/* Study Playlists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <MusicalNoteIcon className="h-6 w-6 mr-2 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Study Playlists
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlists &&
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-3 flex items-center justify-center">
                    <MusicalNoteIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {playlist.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {playlist.tracks} tracks
                  </p>
                  <a
                    href={playlist.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    Listen Now
                  </a>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Goal Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-6 w-6 mr-2 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Study Goals
            </h2>
          </div>

          {activeGoals && activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-1 rounded-full">
                      {new Date(goal.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            (goal.currentValue / goal.targetValue) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You don't have any active goals yet
              </p>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                Set Your First Goal
              </button>
            </div>
          )}
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🎁</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Rewards
            </h2>
          </div>

          <div className="space-y-4">
            {rewards &&
              rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-3 rounded-lg border ${
                    reward.unlockedAt
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {reward.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reward.description}
                      </p>
                    </div>

                    <div>
                      {reward.unlockedAt ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {!reward.unlockedAt && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      <span className="font-medium">Unlock by:</span>{" "}
                      {reward.unlockRequirement}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </motion.div>

        {/* Reminders & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="col-span-1 md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <BellAlertIcon className="h-6 w-6 mr-2 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Study Reminders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Daily Reminder
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Receive a notification each day to keep your study streak alive
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Enabled
                </span>
              </label>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Streak Alert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get alerted when you're about to break your study streak
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Enabled
                </span>
              </label>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Goal Reminders
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Receive updates on your progress toward study goals
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Enabled
                </span>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { MotivationPage };
