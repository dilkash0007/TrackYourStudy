import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Motivational quotes for the loading screen
const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "You are never too old to set another goal or to dream a new dream.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "The secret of getting ahead is getting started.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
];

const LoadingScreen = () => {
  const [quote, setQuote] = useState("");

  // Select a random quote when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full px-4"
      >
        {/* Loading title */}
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          TrackYouStudy
        </h1>

        {/* Animation container */}
        <div className="relative h-40 mb-8 flex items-center justify-center">
          {/* Book animation */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-24 bg-white rounded-r-md shadow-lg origin-left"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo-600 rounded-l-sm"></div>
            <div className="flex flex-col h-full justify-center items-center p-2">
              <div className="w-full h-1 bg-gray-300 mb-1"></div>
              <div className="w-full h-1 bg-gray-300 mb-1"></div>
              <div className="w-full h-1 bg-gray-300 mb-1"></div>
              <div className="w-full h-1 bg-gray-300"></div>
            </div>
          </motion.div>

          {/* Floating icons */}
          <motion.div
            initial={{ y: 0, opacity: 0.5 }}
            animate={{ y: -15, opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute top-0 right-10 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ y: 0, opacity: 0.5 }}
            animate={{ y: -20, opacity: 1 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="absolute bottom-5 right-20 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ y: 0, opacity: 0.5 }}
            animate={{ y: -12, opacity: 1 }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute top-10 left-10 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
            </svg>
          </motion.div>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-500 border-b-indigo-600 border-l-blue-500 rounded-full"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center text-white font-bold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Motivational quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 shadow-lg"
        >
          <p className="text-white text-center text-lg italic">"{quote}"</p>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 text-center text-white text-sm"
        >
          Loading your study journey...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
