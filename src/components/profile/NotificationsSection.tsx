import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  TrophyIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export const NotificationsSection = () => {
  const notificationPreferences = useUserStore(
    (state) => state.notificationPreferences
  );
  const updateNotificationPreferences = useUserStore(
    (state) => state.updateNotificationPreferences
  );

  // Toggle handler for notification preferences
  const handleToggle = (preference: keyof typeof notificationPreferences) => {
    updateNotificationPreferences({
      [preference]: !notificationPreferences[preference],
    });
  };

  // Notification options configuration
  const notificationOptions = [
    {
      id: "emailNotifications",
      title: "Email Notifications",
      description: "Receive important updates via email",
      icon: EnvelopeIcon,
      value: notificationPreferences.emailNotifications,
    },
    {
      id: "pushNotifications",
      title: "Push Notifications",
      description: "Allow browser notifications for alerts",
      icon: DevicePhoneMobileIcon,
      value: notificationPreferences.pushNotifications,
    },
    {
      id: "studyReminders",
      title: "Study Reminders",
      description: "Get notified about upcoming study sessions",
      icon: BellIcon,
      value: notificationPreferences.studyReminders,
    },
    {
      id: "goalAlerts",
      title: "Goal Alerts",
      description: "Receive notifications about goal progress",
      icon: ExclamationCircleIcon,
      value: notificationPreferences.goalAlerts,
    },
    {
      id: "achievementAlerts",
      title: "Achievement Alerts",
      description: "Celebrate when you earn new achievements",
      icon: TrophyIcon,
      value: notificationPreferences.achievementAlerts,
    },
    {
      id: "breakReminders",
      title: "Break Reminders",
      description: "Be reminded to take breaks during study sessions",
      icon: ClockIcon,
      value: notificationPreferences.breakReminders,
    },
    {
      id: "dailySummaries",
      title: "Daily Summaries",
      description: "Receive a summary of your daily study activity",
      icon: ArrowPathIcon,
      value: notificationPreferences.dailySummaries,
    },
    {
      id: "soundAlerts",
      title: "Sound Alerts",
      description: "Play sounds for notifications and alerts",
      icon: SpeakerWaveIcon,
      value: notificationPreferences.soundAlerts,
    },
    {
      id: "vibration",
      title: "Vibration",
      description: "Enable vibration for notifications (mobile devices)",
      icon: DevicePhoneMobileIcon,
      value: notificationPreferences.vibration,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Notification Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Control how and when you receive notifications and reminders.
        </p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/20 mr-4">
                <option.icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleToggle(option.id as keyof typeof notificationPreferences)
              }
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                option.value ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
              role="switch"
              aria-checked={option.value}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  option.value ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start">
          <div className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-800 mr-4">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Notification Permissions
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              To receive notifications in your browser, you need to allow
              notifications in your browser settings.
            </p>
            {typeof Notification !== "undefined" &&
              Notification.permission !== "granted" && (
                <button
                  onClick={async () => {
                    try {
                      await Notification.requestPermission();
                    } catch (error) {
                      console.error(
                        "Error requesting notification permission:",
                        error
                      );
                    }
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700"
                >
                  Enable Notifications
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
