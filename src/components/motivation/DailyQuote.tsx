import { useEffect, useState } from "react";
import {
  useMotivationStore,
  Quote,
  fetchRandomQuote,
} from "../../store/motivationStore";
import { motion } from "framer-motion";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export const DailyQuote = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const motivationStore = useMotivationStore();
  const currentQuote = motivationStore?.currentQuote;
  const savedQuotes = motivationStore?.savedQuotes || [];
  const fetchNewQuote = motivationStore?.fetchNewQuote;
  const saveQuote = motivationStore?.saveQuote;
  const removeFromSaved = motivationStore?.removeFromSaved;

  useEffect(() => {
    // Get a quote when component mounts
    const getQuoteFromAPI = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try fetching from API
        const quote = await fetchRandomQuote();

        if (quote && motivationStore) {
          motivationStore.setState({ currentQuote: quote });
          setIsLoading(false);
        } else if (typeof fetchNewQuote === "function") {
          // Fall back to built-in quotes if API returns null
          fetchNewQuote();
          setIsLoading(false);
        } else {
          // If no fetch function exists, create a fallback quote
          if (motivationStore) {
            motivationStore.setState({
              currentQuote: {
                id: "fallback-1",
                text: "The beautiful thing about learning is that no one can take it away from you.",
                author: "B.B. King",
                isFavorite: false,
              },
            });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setError("Failed to fetch quote. Try again later.");

        if (typeof fetchNewQuote === "function") {
          fetchNewQuote();
        }
        setIsLoading(false);
      }
    };

    if (!currentQuote) {
      getQuoteFromAPI();
    } else {
      setIsLoading(false);
    }

    // Set up a timer to refresh the quote daily
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const dailyTimer = setTimeout(() => {
      getQuoteFromAPI();
    }, timeUntilMidnight);

    return () => clearTimeout(dailyTimer);
  }, [currentQuote, fetchNewQuote, motivationStore]);

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-red-500 dark:text-red-400">{error}</div>
        <button
          onClick={() => typeof fetchNewQuote === "function" && fetchNewQuote()}
          className="mt-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentQuote) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-gray-500 dark:text-gray-400">
          No quote available at the moment.
        </div>
        <button
          onClick={() => typeof fetchNewQuote === "function" && fetchNewQuote()}
          className="mt-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full text-sm transition-colors"
        >
          Get Quote
        </button>
      </div>
    );
  }

  const isQuoteSaved = savedQuotes.some((q) => q.id === currentQuote.id);

  const handleSaveToggle = () => {
    if (!currentQuote) return;

    if (isQuoteSaved && typeof removeFromSaved === "function") {
      removeFromSaved(currentQuote.id);
    } else if (typeof saveQuote === "function") {
      saveQuote(currentQuote);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
          Daily Inspiration
        </h2>
        <button
          onClick={handleSaveToggle}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
        >
          {isQuoteSaved ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <blockquote className="text-xl text-gray-800 dark:text-gray-200 font-serif italic mb-3">
        "{currentQuote.text}"
      </blockquote>

      <p className="text-right text-gray-600 dark:text-gray-400">
        — {currentQuote.author}
      </p>

      {typeof fetchNewQuote === "function" && (
        <button
          onClick={fetchNewQuote}
          className="mt-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full text-sm transition-colors"
        >
          New Quote
        </button>
      )}
    </motion.div>
  );
};
