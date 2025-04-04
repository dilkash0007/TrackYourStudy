import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DataSectionProps {
  onResetStorage?: () => void;
}

export const DataSection = ({ onResetStorage }: DataSectionProps) => {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { isDark } = useTheme();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Function to handle data export
  const handleExportData = () => {
    setExportLoading(true);
    setMessage(null);

    // Simulate export process
    setTimeout(() => {
      try {
        // Get all data from localStorage
        const data: Record<string, any> = {};
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("-storage")) {
            try {
              data[key] = JSON.parse(localStorage.getItem(key) || "{}");
            } catch (e) {
              data[key] = localStorage.getItem(key);
            }
          }
        });

        // Create a blob and download it
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `trackyoustudy-data-${
          new Date().toISOString().split("T")[0]
        }.json`;
        a.click();
        URL.revokeObjectURL(url);

        setMessage({
          type: "success",
          text: "Data successfully exported",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to export data. Please try again.",
        });
      } finally {
        setExportLoading(false);
      }
    }, 1500);
  };

  // Function to handle file selection for import
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setMessage(null);

    // Simulate file reading and import process
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Store each key in localStorage
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });

        setMessage({
          type: "success",
          text: "Data successfully imported",
        });
        setImportLoading(false);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to import data. Invalid file format.",
        });
        setImportLoading(false);
      }
    };

    reader.onerror = () => {
      setMessage({
        type: "error",
        text: "Failed to read file. Please try again.",
      });
      setImportLoading(false);
    };

    reader.readAsText(file);
  };

  // Function to handle account deletion confirmation
  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (deleteText.toLowerCase() !== "delete my account") {
      setMessage({
        type: "error",
        text: 'Please type "delete my account" to confirm',
      });
      return;
    }

    // In a real implementation, this would send a request to delete the account
    setMessage({
      type: "success",
      text: "Account deletion request submitted. You will receive a confirmation email.",
    });

    setDeleteText("");
    setShowConfirmDelete(false);
  };

  const handleResetStorage = () => {
    setResetLoading(true);
    try {
      if (onResetStorage) {
        onResetStorage();
        setShowResetConfirm(false);
        alert("All data has been cleared. The page will reload now.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
      alert("Failed to reset data. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Data Management
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your application data including export, import, and reset
          options.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <p
            className={`text-sm flex items-center ${
              message.type === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircleIcon className="h-4 w-4 mr-1.5" />
            ) : (
              <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />
            )}
            {message.text}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2 text-blue-500" />
            Export Data
          </h4>
          <p className="mt-1 mb-3 text-sm text-gray-500 dark:text-gray-400">
            Download all your data as a JSON file for backup.
          </p>
          <button
            onClick={handleExportData}
            disabled={exportLoading}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            {exportLoading ? "Exporting..." : "Export Data"}
          </button>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
            <ArrowUpTrayIcon className="w-5 h-5 mr-2 text-green-500" />
            Import Data
          </h4>
          <p className="mt-1 mb-3 text-sm text-gray-500 dark:text-gray-400">
            Restore your data from a previous export.
          </p>
          <label className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors cursor-pointer">
            {importLoading ? "Importing..." : "Import Data"}
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
              disabled={importLoading}
            />
          </label>
        </motion.div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Danger Zone
        </h3>

        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-600 dark:text-red-400">
                Reset Application Data
              </h4>
              <p className="mt-1 mb-3 text-sm text-gray-600 dark:text-gray-400">
                This will delete all your tasks, sessions, settings and
                preferences. This action cannot be undone.
              </p>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex items-center"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Reset All Data
                </button>
              ) : (
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={handleResetStorage}
                    disabled={resetLoading}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    {resetLoading ? "Resetting..." : "Confirm Reset"}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5"
      >
        <div className="flex items-center mb-4">
          <TrashIcon className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Delete Account
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>

        {!showConfirmDelete ? (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Account
          </button>
        ) : (
          <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-medium">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label
                  htmlFor="delete-confirm"
                  className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1"
                >
                  Type "delete my account" to confirm
                </label>
                <input
                  type="text"
                  id="delete-confirm"
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  placeholder="delete my account"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmDelete(false);
                    setDeleteText("");
                    setMessage(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Confirm Deletion
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
