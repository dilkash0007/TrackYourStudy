import { motion } from "framer-motion";
import {
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  rankChange?: number;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const LeaderboardCard = ({
  entries,
  currentUserId,
}: LeaderboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Leaderboard
        </h3>
        <TrophyIcon className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.id === currentUserId;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className={`flex items-center p-3 rounded-lg ${
                isCurrentUser
                  ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              } transition-colors`}
            >
              <div className="flex-shrink-0 mr-3 text-sm font-semibold w-6 text-center">
                {entry.rank <= 3 ? (
                  <span
                    className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                      entry.rank === 1
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : entry.rank === 2
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}
                  >
                    {entry.rank}
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.rank}
                  </span>
                )}
              </div>
              <div className="flex-shrink-0 mr-3">
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="h-8 w-8 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p
                    className={`text-sm font-medium truncate ${
                      isCurrentUser
                        ? "text-indigo-800 dark:text-indigo-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {entry.username}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-xs text-indigo-600 dark:text-indigo-400">
                        (You)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <span
                  className={`text-sm font-semibold mr-2 ${
                    isCurrentUser
                      ? "text-indigo-800 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {entry.score}
                </span>
                {entry.rankChange !== undefined && (
                  <div
                    className={`flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
                      entry.rankChange > 0
                        ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200"
                        : entry.rankChange < 0
                        ? "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200"
                        : "text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {entry.rankChange > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                    ) : entry.rankChange < 0 ? (
                      <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                    ) : (
                      <MinusIcon className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(entry.rankChange)}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/motivation"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Full Leaderboard
        </Link>
      </div>
    </motion.div>
  );
};
