import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition"
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
            className="w-full py-2 px-4 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 font-medium rounded-md shadow-sm transition"
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-md"
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
};
