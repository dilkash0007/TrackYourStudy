import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Define types for the homepage data
export interface Quote {
  text: string;
  author: string;
}

export interface StudyTip {
  text: string;
  category: string;
}

export interface MusicPlaylist {
  name: string;
  category: string;
  url: string;
}

export interface PageSection {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface HomePagePreferences {
  showQuoteCard: boolean;
  showProgressOverview: boolean;
  showUpcomingTasks: boolean;
  showUpcomingSessions: boolean;
  showStudyTip: boolean;
  showFocusMusic: boolean;
  sectionsOrder: string[];
}

// Interface for the entire store
interface HomeStore {
  // Data
  quotes: Quote[];
  studyTips: StudyTip[];
  musicPlaylists: MusicPlaylist[];
  pageSections: PageSection[];
  preferences: HomePagePreferences;

  // Actions
  addQuote: (quote: Quote) => void;
  removeQuote: (index: number) => void;

  addStudyTip: (tip: StudyTip) => void;
  removeStudyTip: (index: number) => void;

  addMusicPlaylist: (playlist: MusicPlaylist) => void;
  removeMusicPlaylist: (index: number) => void;

  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
  updateSectionsOrder: (orderedIds: string[]) => void;

  updatePreferences: (preferences: Partial<HomePagePreferences>) => void;

  getRandomQuote: () => Quote;
  getRandomStudyTip: () => StudyTip;
}

// Default data creation functions
const createDefaultQuotes = (): Quote[] => [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams",
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    author: "Pelé",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "The more I read, the more I acquire, the more certain I am that I know nothing.",
    author: "Voltaire",
  },
  {
    text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    author: "Richard Feynman",
  },
];

const createDefaultStudyTips = (): StudyTip[] => [
  {
    text: "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break.",
    category: "Time Management",
  },
  {
    text: "Review your notes within 24 hours of taking them to improve retention.",
    category: "Memory",
  },
  {
    text: "Create mind maps to visualize connections between concepts.",
    category: "Study Techniques",
  },
  {
    text: "Study in a dedicated space with minimal distractions.",
    category: "Environment",
  },
  {
    text: "Explain concepts out loud as if teaching someone else.",
    category: "Understanding",
  },
  {
    text: "Break large tasks into smaller, manageable chunks.",
    category: "Productivity",
  },
  {
    text: "Use spaced repetition to review material over increasing intervals.",
    category: "Memory",
  },
  {
    text: "Start with the most difficult subjects when your energy is highest.",
    category: "Planning",
  },
  {
    text: "Stay hydrated and eat brain-healthy foods while studying.",
    category: "Health",
  },
  {
    text: "Take brief movement breaks to keep your mind fresh.",
    category: "Focus",
  },
  {
    text: "Use practice tests to identify knowledge gaps.",
    category: "Preparation",
  },
  {
    text: "Set specific, measurable goals for each study session.",
    category: "Goals",
  },
];

const createDefaultMusicPlaylists = (): MusicPlaylist[] => [
  {
    name: "Lo-Fi Focus Beats",
    category: "Lo-Fi",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn",
  },
  {
    name: "Deep Focus",
    category: "Instrumental",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3PFzdbtx1Us",
  },
  {
    name: "Classical Study",
    category: "Classical",
    url: "https://open.spotify.com/playlist/1mXFM7PJaKg9g6gX5HMbM9",
  },
  {
    name: "Nature Sounds",
    category: "Ambient",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX4aYBWMcxS1o",
  },
  {
    name: "Focus Flow",
    category: "Electronic",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
  },
];

const createDefaultPageSections = (): PageSection[] => [
  { id: "quoteCard", title: "Inspirational Quote", visible: true, order: 1 },
  {
    id: "progressOverview",
    title: "Progress Overview",
    visible: true,
    order: 2,
  },
  { id: "quickActions", title: "Quick Actions", visible: true, order: 3 },
  { id: "upcomingTasks", title: "Upcoming Tasks", visible: true, order: 4 },
  {
    id: "upcomingSessions",
    title: "Upcoming Sessions",
    visible: true,
    order: 5,
  },
  { id: "studyTip", title: "Daily Study Tip", visible: true, order: 6 },
  { id: "focusMusic", title: "Focus Music", visible: true, order: 7 },
];

const createDefaultPreferences = (): HomePagePreferences => ({
  showQuoteCard: true,
  showProgressOverview: true,
  showUpcomingTasks: true,
  showUpcomingSessions: true,
  showStudyTip: true,
  showFocusMusic: true,
  sectionsOrder: [
    "quoteCard",
    "progressOverview",
    "quickActions",
    "upcomingTasks",
    "upcomingSessions",
    "studyTip",
    "focusMusic",
  ],
});

// Create the store
export const useHomeStore = create<HomeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      quotes: createDefaultQuotes(),
      studyTips: createDefaultStudyTips(),
      musicPlaylists: createDefaultMusicPlaylists(),
      pageSections: createDefaultPageSections(),
      preferences: createDefaultPreferences(),

      // Actions
      addQuote: (quote: Quote) =>
        set((state) => ({
          quotes: [...state.quotes, quote],
        })),

      removeQuote: (index: number) =>
        set((state) => ({
          quotes: state.quotes.filter((_, i) => i !== index),
        })),

      addStudyTip: (tip: StudyTip) =>
        set((state) => ({
          studyTips: [...state.studyTips, tip],
        })),

      removeStudyTip: (index: number) =>
        set((state) => ({
          studyTips: state.studyTips.filter((_, i) => i !== index),
        })),

      addMusicPlaylist: (playlist: MusicPlaylist) =>
        set((state) => ({
          musicPlaylists: [...state.musicPlaylists, playlist],
        })),

      removeMusicPlaylist: (index: number) =>
        set((state) => ({
          musicPlaylists: state.musicPlaylists.filter((_, i) => i !== index),
        })),

      updateSectionVisibility: (sectionId: string, visible: boolean) =>
        set((state) => ({
          pageSections: state.pageSections.map((section) =>
            section.id === sectionId ? { ...section, visible } : section
          ),
        })),

      updateSectionsOrder: (orderedIds: string[]) =>
        set((state) => ({
          pageSections: state.pageSections
            .map((section) => ({
              ...section,
              order: orderedIds.indexOf(section.id),
            }))
            .sort((a, b) => a.order - b.order),
        })),

      updatePreferences: (preferences: Partial<HomePagePreferences>) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

      getRandomQuote: () => {
        const { quotes } = get();
        return quotes[Math.floor(Math.random() * quotes.length)];
      },

      getRandomStudyTip: () => {
        const { studyTips } = get();
        return studyTips[Math.floor(Math.random() * studyTips.length)];
      },
    }),
    {
      name: "homepage-storage",
      partialize: (state) => ({
        quotes: state.quotes,
        studyTips: state.studyTips,
        musicPlaylists: state.musicPlaylists,
        pageSections: state.pageSections,
        preferences: state.preferences,
      }),
    }
  )
);
