import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from "../../store/userStore";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LoginPromptProps {
  message?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({
  message = "Please login or create an account to continue.",
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const uiPreferences = useUserStore((state) => state.uiPreferences);
  const reducedMotion = uiPreferences?.reducedMotion || false;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          type: reducedMotion ? "tween" : "spring",
          stiffness: 300,
          damping: 30,
          duration: reducedMotion ? 0.2 : undefined,
        }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close dialog"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h3
            id="login-prompt-title"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
          >
            Login Required
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-white font-medium rounded-md shadow-sm transition"
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
            className="w-full py-2 px-4 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 font-medium rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-md focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
};
