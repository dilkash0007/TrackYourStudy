import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Motivation data
export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  progress: number;
  unlockedAt: string | null;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string | null;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tracks: number;
  link: string;
  category: "focus" | "lofi" | "energetic" | "classical" | "nature";
}

export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockRequirement: string;
  unlockedAt: string | null;
}

export interface MotivationStore {
  // Daily Quotes
  currentQuote: Quote | null;
  savedQuotes: Quote[];
  fetchNewQuote: () => void;
  saveQuote: (quote: Quote) => void;
  removeFromSaved: (quoteId: string) => void;

  // Achievements
  achievements: Achievement[];
  updateAchievementProgress: (id: string, progress: number) => void;
  unlockAchievement: (id: string) => void;

  // Streaks & Badges
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  badges: Badge[];
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockBadge: (id: string) => void;
  testAddStreakDay: () => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoalProgress: (id: string, currentValue: number) => void;
  completeGoal: (id: string) => void;
  removeGoal: (id: string) => void;

  // Music
  playlists: MusicPlaylist[];

  // Rewards
  rewards: Reward[];
  unlockReward: (id: string) => void;

  // User preferences
  notifications: boolean;
  toggleNotifications: () => void;

  // Leaderboard position (mock)
  leaderboardPosition: number;

  // Theme preference
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

// Helper function to fetch a random quote from an API
export const fetchRandomQuote = async (): Promise<Quote | null> => {
  try {
    // For production, this would be a real API call
    // For now, we'll return a random quote from our local quotes
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex];
  } catch (error) {
    console.error("Error fetching random quote:", error);
    return null;
  }
};

// Sample quotes for initial state
const sampleQuotes: Quote[] = [];

// Sample achievements for initial state
const sampleAchievements: Achievement[] = [];

// Sample badges for initial state
const sampleBadges: Badge[] = [
  {
    id: "1",
    name: "Newcomer",
    icon: "star",
    description: "Join TrackYouStudy",
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Week Warrior",
    icon: "calendar",
    description: "Complete a 7-day streak",
    unlockedAt: null,
  },
  {
    id: "3",
    name: "Focus Master",
    icon: "target",
    description: "Complete 10 Pomodoro sessions",
    unlockedAt: null,
  },
];

// Sample playlists for initial state
const samplePlaylists: MusicPlaylist[] = [
  {
    id: "1",
    name: "Deep Focus",
    description: "Instrumental concentration music",
    imageUrl: "/playlist-focus.jpg",
    tracks: 15,
    link: "https://open.spotify.com/playlist/37i9dQZF1DX3PFzdbtx1Us",
    category: "focus",
  },
  {
    id: "2",
    name: "Lo-Fi Beats",
    description: "Chill beats to study to",
    imageUrl: "/playlist-lofi.jpg",
    tracks: 20,
    link: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn",
    category: "lofi",
  },
  {
    id: "3",
    name: "Study Energy",
    description: "Upbeat music to keep you motivated",
    imageUrl: "/playlist-energy.jpg",
    tracks: 12,
    link: "https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6",
    category: "energetic",
  },
];

// Sample rewards for initial state
const sampleRewards: Reward[] = [];

// Sample goals for initial state
const sampleGoals: Goal[] = [];

// Collection of local quotes to use instead of the API
const localQuotes: Quote[] = [
  {
    id: "local-1",
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    isFavorite: false,
  },
  {
    id: "local-2",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    isFavorite: false,
  },
  {
    id: "local-3",
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    isFavorite: false,
  },
  {
    id: "local-4",
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    isFavorite: false,
  },
  {
    id: "local-5",
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    isFavorite: false,
  },
  {
    id: "local-6",
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    isFavorite: false,
  },
  {
    id: "local-7",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    isFavorite: false,
  },
  {
    id: "local-8",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    isFavorite: false,
  },
  {
    id: "local-9",
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle",
    isFavorite: false,
  },
  {
    id: "local-10",
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    isFavorite: false,
  },
  {
    id: "local-11",
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    isFavorite: false,
  },
  {
    id: "local-12",
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    isFavorite: false,
  },
  {
    id: "local-13",
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
    isFavorite: false,
  },
  {
    id: "local-14",
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    isFavorite: false,
  },
  {
    id: "local-15",
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams",
    isFavorite: false,
  },
];

// Create the store with persistence
export const useMotivationStore = create<MotivationStore>()(
  persist(
    (set, get) => ({
      // Initial states
      currentQuote: null,
      savedQuotes: [],
      achievements: [],
      currentStreak: 1, // Start with streak of 1 for new users
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0], // Set today as last active date
      badges: sampleBadges,
      goals: [], // Initialize with empty goals
      playlists: samplePlaylists,
      rewards: [],
      notifications: true,
      leaderboardPosition: 42, // Mock data
      theme: "system",

      // Quote functions
      fetchNewQuote: () => {
        try {
          const quotes = localQuotes;
          if (quotes && quotes.length > 0) {
            const randomQuote =
              quotes[Math.floor(Math.random() * quotes.length)];
            set({ currentQuote: randomQuote });
          } else {
            // Fallback quote if no quotes are available
            set({
              currentQuote: {
                id: "fallback",
                text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
                author: "Malcolm X",
                isFavorite: false,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching new quote:", error);
          // Set a fallback quote
          set({
            currentQuote: {
              id: "error-fallback",
              text: "The best preparation for tomorrow is doing your best today.",
              author: "H. Jackson Brown Jr.",
              isFavorite: false,
            },
          });
        }
      },

      saveQuote: (quote) => {
        try {
          if (!quote) return;

          const savedQuotes = get().savedQuotes || [];
          if (!savedQuotes.some((q) => q.id === quote.id)) {
            set({
              savedQuotes: [...savedQuotes, { ...quote, isFavorite: true }],
            });
          }
        } catch (error) {
          console.error("Error saving quote:", error);
        }
      },

      removeFromSaved: (quoteId) => {
        try {
          if (!quoteId) return;

          const savedQuotes = get().savedQuotes || [];
          set({
            savedQuotes: savedQuotes.filter((q) => q.id !== quoteId),
          });
        } catch (error) {
          console.error("Error removing quote from saved:", error);
        }
      },

      // Achievement functions
      updateAchievementProgress: (id, progress) => {
        try {
          if (!id) return;

          const achievements = get().achievements || [];
          const updatedAchievements = achievements.map((a) =>
            a.id === id ? { ...a, progress: Math.min(progress, 100) } : a
          );

          // Auto-unlock if progress reaches 100%
          if (progress >= 100) {
            const achievement = updatedAchievements.find((a) => a.id === id);
            if (achievement && !achievement.unlockedAt) {
              achievement.unlockedAt = new Date().toISOString();
            }
          }

          set({ achievements: updatedAchievements });
        } catch (error) {
          console.error("Error updating achievement progress:", error);
        }
      },

      unlockAchievement: (id) => {
        try {
          if (!id) return;

          const achievements = get().achievements || [];
          set({
            achievements: achievements.map((a) =>
              a.id === id
                ? { ...a, progress: 100, unlockedAt: new Date().toISOString() }
                : a
            ),
          });
        } catch (error) {
          console.error("Error unlocking achievement:", error);
        }
      },

      // Streak functions
      incrementStreak: () => {
        try {
          const today = new Date().toISOString().split("T")[0];
          const {
            lastActiveDate,
            currentStreak = 1,
            longestStreak = 1,
          } = get();

          // If this is the first visit or there's no last active date, set it to today
          if (!lastActiveDate) {
            set({
              lastActiveDate: today,
              currentStreak: 1,
              longestStreak: 1,
            });
            return;
          }

          // Skip if already visited today
          if (lastActiveDate === today) {
            return;
          }

          // Check if last visit was yesterday
          const lastActive = new Date(lastActiveDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          // Increment streak if visited yesterday, otherwise reset to 1
          let newStreak;
          if (lastActiveDate === yesterdayStr) {
            newStreak = currentStreak + 1;
          } else {
            newStreak = 1; // Reset streak if not consecutive
          }

          // Update longest streak if needed
          const newLongestStreak = Math.max(newStreak, longestStreak);

          set({
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: today,
          });

          // Check if any streak-based badges should be unlocked
          if (newStreak >= 7) {
            const weekWarriorBadge = get().badges?.find((b) => b.id === "2");
            if (weekWarriorBadge && !weekWarriorBadge.unlockedAt) {
              get().unlockBadge("2");
            }
          }
        } catch (error) {
          console.error("Error incrementing streak:", error);
        }
      },

      resetStreak: () => {
        try {
          set({
            currentStreak: 0,
            lastActiveDate: null,
          });
        } catch (error) {
          console.error("Error resetting streak:", error);
        }
      },

      unlockBadge: (id) => {
        try {
          if (!id) return;

          const badges = get().badges || [];
          set({
            badges: badges.map((b) =>
              b.id === id ? { ...b, unlockedAt: new Date().toISOString() } : b
            ),
          });
        } catch (error) {
          console.error("Error unlocking badge:", error);
        }
      },

      // Goal functions
      addGoal: (goal) => {
        try {
          if (!goal || !goal.title) return;

          const newGoal = {
            ...goal,
            id: Date.now().toString(),
            completed: false,
          };
          const currentGoals = get().goals || [];
          set({ goals: [...currentGoals, newGoal] });
        } catch (error) {
          console.error("Error adding goal:", error);
        }
      },

      updateGoalProgress: (id, currentValue) => {
        try {
          if (!id) return;

          const goals = get().goals || [];
          const updatedGoals = goals.map((g) => {
            if (g.id === id) {
              const completed = currentValue >= g.targetValue;
              return { ...g, currentValue, completed };
            }
            return g;
          });
          set({ goals: updatedGoals });
        } catch (error) {
          console.error("Error updating goal progress:", error);
        }
      },

      completeGoal: (id) => {
        try {
          if (!id) return;

          const goals = get().goals || [];
          const updatedGoals = goals.map((g) =>
            g.id === id
              ? { ...g, completed: true, currentValue: g.targetValue }
              : g
          );
          set({ goals: updatedGoals });
        } catch (error) {
          console.error("Error completing goal:", error);
        }
      },

      removeGoal: (id) => {
        try {
          if (!id) return;

          const goals = get().goals || [];
          set({ goals: goals.filter((g) => g.id !== id) });
        } catch (error) {
          console.error("Error removing goal:", error);
        }
      },

      // Reward functions
      unlockReward: (id) => {
        try {
          if (!id) return;

          const rewards = get().rewards || [];
          const updatedRewards = rewards.map((r) =>
            r.id === id ? { ...r, unlockedAt: new Date().toISOString() } : r
          );
          set({ rewards: updatedRewards });
        } catch (error) {
          console.error("Error unlocking reward:", error);
        }
      },

      // Preference functions
      toggleNotifications: () => {
        try {
          set({ notifications: !get().notifications });
        } catch (error) {
          console.error("Error toggling notifications:", error);
        }
      },

      setTheme: (theme) => {
        try {
          if (!theme) return;
          set({ theme });
        } catch (error) {
          console.error("Error setting theme:", error);
        }
      },

      testAddStreakDay: () => {
        try {
          const { currentStreak = 0, longestStreak = 0 } = get();
          const newStreak = currentStreak + 1;
          const newLongestStreak = Math.max(newStreak, longestStreak);

          set({
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: new Date().toISOString().split("T")[0],
          });

          // Check if any streak-based badges should be unlocked
          if (newStreak >= 7) {
            const weekWarriorBadge = get().badges?.find((b) => b.id === "2");
            if (weekWarriorBadge && !weekWarriorBadge.unlockedAt) {
              get().unlockBadge("2");
            }
          }
        } catch (error) {
          console.error("Error in testAddStreakDay:", error);
        }
      },
    }),
    {
      name: "motivation-storage",
    }
  )
);
