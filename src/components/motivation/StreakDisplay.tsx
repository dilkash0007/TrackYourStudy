import React from "react";
import { motion } from "framer-motion";
import { FireIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useMotivationStore } from "../../store/motivationStore";

export const StreakDisplay: React.FC = () => {
  const { currentStreak = 0, longestStreak = 0 } = useMotivationStore() || {};

  // Generate message based on streak length
  const getStreakMessage = () => {
    if (currentStreak >= 30)
      return "You're unstoppable! A true master of consistency!";
    if (currentStreak >= 14)
      return "Incredible discipline! You're building lasting habits!";
    if (currentStreak >= 7) return "Excellent commitment! Keep this momentum!";
    if (currentStreak >= 3) return "You're building a great habit!";
    return "Every day counts toward your success!";
  };

  // Calculate next milestone
  const getNextMilestone = () => {
    if (currentStreak >= 30)
      return { target: 30, progress: 100, label: "All milestones achieved!" };
    if (currentStreak >= 14)
      return {
        target: 30,
        progress: (currentStreak / 30) * 100,
        label: `${currentStreak}/30 days`,
      };
    if (currentStreak >= 7)
      return {
        target: 14,
        progress: (currentStreak / 14) * 100,
        label: `${currentStreak}/14 days`,
      };
    return {
      target: 7,
      progress: (currentStreak / 7) * 100,
      label: `${currentStreak}/7 days`,
    };
  };

  const nextMilestone = getNextMilestone();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg p-6 text-white mb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <FireIcon className="h-12 w-12 mr-4 text-amber-200" />
          <div>
            <h2 className="text-2xl font-bold">Study Streak</h2>
            <p className="text-white text-opacity-90">{getStreakMessage()}</p>
          </div>
        </div>

        <div className="flex space-x-6 md:space-x-12">
          <div className="text-center">
            <p className="text-5xl font-bold mb-1">{currentStreak}</p>
            <p className="text-white text-opacity-80 font-medium">
              Current Days
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold mb-1">{longestStreak}</p>
            <p className="text-white text-opacity-80 font-medium">Record</p>
          </div>
        </div>
      </div>

      {/* Streak Progress Toward Next Milestone */}
      <div className="mt-6">
        {/* Progress bar towards next milestone */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">
            Progress to next milestone
          </span>
          <span className="text-sm font-medium text-white">
            {nextMilestone.label}
          </span>
        </div>

        <div className="w-full bg-amber-700 rounded-full h-2.5">
          <div
            className="bg-amber-200 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${Math.min(100, nextMilestone.progress)}%` }}
          ></div>
        </div>

        {/* Milestone badges */}
        <div className="flex justify-between mt-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${
                currentStreak >= 1
                  ? "bg-amber-200 text-amber-700"
                  : "bg-amber-700 text-amber-400"
              }`}
            >
              <span className="font-bold">1</span>
            </div>
            <span className="text-xs mt-1 text-white">Start</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${
                currentStreak >= 7
                  ? "bg-amber-200 text-amber-700"
                  : "bg-amber-700 text-amber-400"
              }`}
            >
              <span className="font-bold">7</span>
            </div>
            <span className="text-xs mt-1 text-white">Week</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${
                currentStreak >= 14
                  ? "bg-amber-200 text-amber-700"
                  : "bg-amber-700 text-amber-400"
              }`}
            >
              <span className="font-bold">14</span>
            </div>
            <span className="text-xs mt-1 text-white">2 Weeks</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${
                currentStreak >= 30
                  ? "bg-amber-200 text-amber-700"
                  : "bg-amber-700 text-amber-400"
              }`}
            >
              <span className="font-bold">30</span>
            </div>
            <span className="text-xs mt-1 text-white">Month</span>
          </div>
        </div>

        {/* Streak Benefits */}
        <div className="mt-6 bg-amber-600 bg-opacity-40 rounded-md p-3">
          <div className="flex items-center mb-2">
            <SparklesIcon className="h-5 w-5 mr-2 text-amber-200" />
            <h3 className="font-semibold">Streak Benefits</h3>
          </div>
          <p className="text-sm text-white text-opacity-90">
            {currentStreak >= 7
              ? "Your 7+ day streak unlocks special badges and rewards! Keep going to discover more benefits."
              : "Reach a 7-day streak to unlock special badges and rewards!"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
