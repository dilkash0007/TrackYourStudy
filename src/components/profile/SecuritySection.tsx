import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";

export const SecuritySection = () => {
  const securitySettings = useUserStore((state) => state.securitySettings);
  const updateSecuritySettings = useUserStore(
    (state) => state.updateSecuritySettings
  );

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Handle toggle for boolean security settings
  const handleToggle = (setting: keyof typeof securitySettings) => {
    if (typeof securitySettings[setting] === "boolean") {
      updateSecuritySettings({
        [setting]: !securitySettings[setting],
      });
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Clear previous errors when user types
    if (passwordError) {
      setPasswordError(null);
    }
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  // Simulate password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setPasswordError(null);
    setPasswordSuccess(false);

    // Basic validation
    if (passwordData.currentPassword.length < 6) {
      setPasswordError("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Simulate successful password change
    setPasswordSuccess(true);

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Close form after short delay
    setTimeout(() => {
      setShowPasswordForm(false);
      setPasswordSuccess(false);
    }, 2000);
  };

  // Handle data retention selection
  const handleDataRetentionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateSecuritySettings({
      dataRetention: e.target.value as
        | "30days"
        | "90days"
        | "1year"
        | "forever",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Security & Privacy
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account security and data privacy preferences.
        </p>
      </div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
      >
        <div className="flex items-center mb-4">
          <KeyIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Password
          </h3>
        </div>

        {!showPasswordForm ? (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              It's a good practice to change your password regularly to ensure
              your account stays secure.
            </p>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LockClosedIcon className="h-4 w-4 mr-2" />
              Change Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword}>
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />
                  {passwordError}
                </p>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  Password successfully changed!
                </p>
              </div>
            )}

            <div className="space-y-4 mb-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FingerPrintIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Two-Factor Authentication
            </h3>
          </div>
          <button
            onClick={() => handleToggle("twoFactorEnabled")}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              securitySettings.twoFactorEnabled
                ? "bg-indigo-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            role="switch"
            aria-checked={securitySettings.twoFactorEnabled}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                securitySettings.twoFactorEnabled
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Add an extra layer of security to your account by requiring a
          verification code in addition to your password.
        </p>
      </motion.div>

      {/* Data Privacy Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5"
      >
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Data Privacy
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="dataRetention"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Data Retention Period
            </label>
            <select
              id="dataRetention"
              value={securitySettings.dataRetention}
              onChange={handleDataRetentionChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="30days">30 Days</option>
              <option value="90days">90 Days</option>
              <option value="1year">1 Year</option>
              <option value="forever">Keep Forever</option>
            </select>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose how long we should keep your study data and activity logs.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Analytics Tracking
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow anonymous usage data collection to improve the app
                  experience.
                </p>
              </div>
              <button
                onClick={() => handleToggle("analyticsEnabled")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  securitySettings.analyticsEnabled
                    ? "bg-indigo-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                role="switch"
                aria-checked={securitySettings.analyticsEnabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    securitySettings.analyticsEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Social Sharing
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Make your achievements and profile visible to other users in
                  leaderboards.
                </p>
              </div>
              <button
                onClick={() => handleToggle("socialSharingEnabled")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  securitySettings.socialSharingEnabled
                    ? "bg-indigo-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                role="switch"
                aria-checked={securitySettings.socialSharingEnabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    securitySettings.socialSharingEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
