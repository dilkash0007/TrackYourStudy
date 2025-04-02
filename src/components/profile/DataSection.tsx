import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const DataSection = () => {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
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
        // In a real implementation, this would gather all user data
        const userData = {
          profile: {
            /* user profile data */
          },
          goals: [
            /* user goals */
          ],
          sessions: [
            /* study sessions */
          ],
          tasks: [
            /* tasks */
          ],
          preferences: {
            /* preferences */
          },
        };

        // Create a JSON blob and trigger download
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `trackyoustudy_data_${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
        // In a real implementation, this would validate and process the imported data
        const importedData = JSON.parse(event.target?.result as string);
        console.log("Data to import:", importedData);

        // Simulate successful import
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Data successfully imported",
          });
          setImportLoading(false);
        }, 1500);
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Export, import, or delete your data from TrackYouStudy.
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

      {/* Data Export */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
      >
        <div className="flex items-center mb-4">
          <ArrowDownTrayIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Export Your Data
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Download a copy of all your data including profile, study sessions,
          tasks, and preferences.
        </p>

        <button
          onClick={handleExportData}
          disabled={exportLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            exportLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {exportLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export Data
            </>
          )}
        </button>
      </motion.div>

      {/* Data Import */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
      >
        <div className="flex items-center mb-4">
          <ArrowUpTrayIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Import Data
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Restore your data from a previously exported file. This will merge
          with your existing data.
        </p>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              importLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            }`}
          >
            {importLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                Select File
              </>
            )}
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={importLoading}
              className="sr-only"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Only .json files exported from TrackYouStudy are supported
          </p>
        </div>
      </motion.div>

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
