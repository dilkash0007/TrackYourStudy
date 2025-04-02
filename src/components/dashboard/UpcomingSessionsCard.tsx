import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
}

interface UpcomingSessionsCardProps {
  sessions: StudySession[];
}

export const UpcomingSessionsCard = ({
  sessions,
}: UpcomingSessionsCardProps) => {
  // Format date to display day and time
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  // Format duration to display hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming Study Sessions
        </h3>
        <CalendarIcon className="h-5 w-5 text-indigo-500" />
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No upcoming study sessions scheduled.
          </p>
          <Link
            to="/calendar"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Schedule Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="mr-4 flex-shrink-0 self-start">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session.title}
                </h4>
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs px-2 py-0.5 rounded-full">
                    {session.subject}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    {formatDate(session.date)} •{" "}
                    {formatDuration(session.duration)}
                  </div>
                  {session.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                      {session.location}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div className="mt-4 text-center">
            <Link
              to="/calendar"
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              View All in Calendar →
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};
