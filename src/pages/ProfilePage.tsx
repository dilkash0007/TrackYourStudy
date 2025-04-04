import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tab } from "@headlessui/react";
import { useUserStore } from "../store/userStore";
import { useTaskStore } from "../store/taskStore";
import { usePlannerStore } from "../store/plannerStore";
import { usePomodoroStore } from "../store/pomodoroStore";
import { useDashboardStore, getUnifiedAppStats } from "../store/dashboardStore";
import { ProfileSection } from "../components/profile/ProfileSection";
import { AppearanceSection } from "../components/profile/AppearanceSection";
import { NotificationsSection } from "../components/profile/NotificationsSection";
import { PomodoroSettings } from "../components/profile/PomodoroSettings";
import { GoalsSection } from "../components/profile/GoalsSection";
import { SecuritySection } from "../components/profile/SecuritySection";
import { DataSection } from "../components/profile/DataSection";
import {
  UserIcon,
  PaintBrushIcon,
  BellIcon,
  ClockIcon,
  FlagIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  TrophyIcon,
  SparklesIcon,
  FireIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  getAllAvatars,
  getRandomAvatar,
  getAvatarPath,
} from "../utils/avatarUtils";
import { resetAllStorage } from "../utils/resetStorage";
import { Navigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useNotification } from "../hooks/useNotification";
import NotificationsButton from "../components/common/NotificationsButton";
import ThemeSelector from "../components/common/ThemeSelector";
import { SettingsSection } from "../components/profile/SettingsSection";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ProfilePage = () => {
  // Get authentication state and user details from the store
  const {
    isAuthenticated,
    name,
    email,
    avatar,
    educationLevel,
    institution,
    studyField,
    bio,
  } = useUserStore();
  const { showNotification } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Ref to track initialization
  const initialized = useRef(false);

  // Get the unified stats directly
  const unifiedStats = getUnifiedAppStats();

  // State for stats (initialized directly from unified stats)
  const [stats, setStats] = useState({
    completedTasks: unifiedStats.completedTasks || 0,
    totalStudyHours: unifiedStats.totalHours || 0,
    currentStreak: unifiedStats.currentStreak || 0,
  });

  useEffect(() => {
    // Log user details for debugging
    console.log("User profile data:", {
      name,
      email,
      educationLevel,
      institution,
      studyField,
      bio,
    });

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [name, email, educationLevel, institution, studyField, bio]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const avatars = getAllAvatars();

  // Tab configuration
  const tabs = [
    { name: "Profile", icon: UserIcon, color: "from-blue-500 to-indigo-600" },
    {
      name: "Appearance",
      icon: PaintBrushIcon,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Notifications",
      icon: BellIcon,
      color: "from-amber-500 to-orange-500",
    },
    { name: "Pomodoro", icon: ClockIcon, color: "from-red-500 to-rose-600" },
    { name: "Goals", icon: FlagIcon, color: "from-emerald-500 to-teal-600" },
    {
      name: "Security",
      icon: ShieldCheckIcon,
      color: "from-violet-500 to-purple-600",
    },
    {
      name: "Data",
      icon: DocumentDuplicateIcon,
      color: "from-sky-500 to-cyan-600",
    },
  ];

  const renderTabPanel = (index: number) => {
    switch (index) {
      case 0:
        return <ProfileSection />;
      case 1:
        return <AppearanceSection />;
      case 2:
        return <NotificationsSection />;
      case 3:
        return <PomodoroSettings />;
      case 4:
        return <GoalsSection />;
      case 5:
        return <SecuritySection />;
      case 6:
        return <DataSection onResetStorage={resetAllStorage} />;
      default:
        return <div>Tab content not available</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-1.5 py-8 mb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Card */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
              {/* Level Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
              >
                <div className="flex items-center space-x-1">
                  <SparklesIcon className="h-4 w-4 text-yellow-200" />
                  <span className="text-xs font-medium text-white">
                    Level {Math.max(1, Math.floor(stats.totalStudyHours / 10))}{" "}
                    Scholar
                  </span>
                </div>
              </motion.div>

              {/* Profile Picture */}
              <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg">
                    <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden relative">
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
                          // Try to load a default avatar as another fallback
                          setTimeout(() => {
                            const defaultAvatar = getAvatarPath(1);
                            if (avatar !== defaultAvatar) {
                              setAvatar(defaultAvatar);
                            }
                          }, 1000);
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-indigo-500/10"
                        animate={{
                          boxShadow: [
                            "0px 0px 0px rgba(100,100,255,0.0)",
                            "0px 0px 20px rgba(100,100,255,0.3)",
                            "0px 0px 0px rgba(100,100,255,0.0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 px-6 pb-6">
              <div className="text-center">
                <motion.h2
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {name || "Your Name"}
                </motion.h2>
                <motion.p
                  className="text-gray-500 dark:text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {email || "your.email@example.com"}
                </motion.p>
                <motion.div
                  className="mt-3 text-gray-600 dark:text-gray-300 text-sm text-center max-w-xs mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Student passionate about learning and tracking study progress
                  with TrackYouStudy
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                className="mt-6 grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  whileHover={{ y: -5, backgroundColor: "#f0f8ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <ClockIcon className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.totalStudyHours}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Study Hours
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  whileHover={{ y: -5, backgroundColor: "#f0f8ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <BookOpenIcon className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.completedTasks}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tasks Done
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  whileHover={{ y: -5, backgroundColor: "#f0f8ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <FireIcon className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.currentStreak}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Day Streak
                  </p>
                </motion.div>
              </motion.div>

              {/* Random Avatar Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={randomizeAvatar}
                className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Random Avatar
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Settings tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:w-2/3"
        >
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex flex-wrap rounded-xl bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm p-1 shadow-lg">
              {tabs.map((tab, idx) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      "w-full sm:w-auto px-4 py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 mx-1 my-1",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                      selected
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )
                  }
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </motion.div>
                </Tab>
              ))}
            </Tab.List>
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tab.Panels className="p-4">
                    {tabs.map((_, idx) => (
                      <Tab.Panel
                        key={idx}
                        className="rounded-xl focus:outline-none"
                      >
                        {renderTabPanel(idx)}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tab.Group>
        </motion.div>
      </div>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Choose Your Avatar
                </h3>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {avatars.map((avatarUrl, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAvatar(avatarUrl);
                      setShowAvatarSelector(false);
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      avatar === avatarUrl
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar ${index + 1}`}
                      className="w-full aspect-square rounded-lg object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=Avatar${
                          index + 1
                        }&background=0D8ABC&color=fff`;
                      }}
                    />
                  </motion.button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
