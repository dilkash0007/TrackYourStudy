import { motion } from "framer-motion";
import { LightBulbIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface StudyTip {
  id: string;
  content: string;
  category: string;
}

interface DailyTipCardProps {
  tip: StudyTip;
  onGetNewTip: () => void;
  quote: {
    text: string;
    author: string;
  };
}

export const DailyTipCard = ({
  tip,
  onGetNewTip,
  quote,
}: DailyTipCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
    >
      {/* Study Tip Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Study Tip of the Day
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={onGetNewTip}
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Get new tip"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <LightBulbIcon className="h-5 w-5 text-yellow-500" />
          </div>
        </div>

        <motion.div
          key={tip.id} // This ensures animation triggers when tip changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300">{tip.content}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {tip.category}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Motivational Quote Section */}
      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Daily Motivation
          </h4>
        </div>
        <motion.div
          key={quote.text} // Ensures animation triggers when quote changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <blockquote className="text-gray-700 dark:text-gray-300 italic">
            "{quote.text}"
          </blockquote>
          <p className="mt-2 text-right text-sm text-gray-600 dark:text-gray-400">
            — {quote.author}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
