// Helper functions for Pomodoro timer

// Sound URLs - you can replace these with actual sound file URLs
const SOUND_URLS = {
  start: "https://cdn.freesound.org/previews/435/435278_8704207-lq.mp3", // Soft bell
  complete: "https://cdn.freesound.org/previews/320/320181_5648900-lq.mp3", // Achievement sound
  "break-end": "https://cdn.freesound.org/previews/352/352661_1299594-lq.mp3", // Alert sound
};

const BACKGROUND_SOUND_URLS = {
  whitenoise: "https://cdn.freesound.org/previews/353/353926_5450487-lq.mp3",
  rain: "https://cdn.freesound.org/previews/467/467087_6882240-lq.mp3",
  coffee: "https://cdn.freesound.org/previews/386/386738_7255994-lq.mp3",
  forest: "https://cdn.freesound.org/previews/369/369920_4929747-lq.mp3",
};

// Audio elements
let backgroundAudio: HTMLAudioElement | null = null;

/**
 * Play a sound effect
 */
export function playSound(type: "start" | "complete" | "break-end"): void {
  const audioUrl = SOUND_URLS[type];
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });
  }
}

/**
 * Play background ambient sound
 */
export function playBackgroundSound(
  type: "whitenoise" | "rain" | "coffee" | "forest" | "none"
): void {
  // Stop any existing background audio first
  stopBackgroundSound();

  if (type === "none") return;

  const audioUrl = BACKGROUND_SOUND_URLS[type];
  if (audioUrl) {
    backgroundAudio = new Audio(audioUrl);
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.2;
    backgroundAudio.play().catch((error) => {
      console.error("Failed to play background sound:", error);
    });
  }
}

/**
 * Pause the background sound
 */
export function pauseBackgroundSound(): void {
  if (backgroundAudio) {
    backgroundAudio.pause();
  }
}

/**
 * Resume the background sound
 */
export function resumeBackgroundSound(): void {
  if (backgroundAudio) {
    backgroundAudio.play().catch((error) => {
      console.error("Failed to resume background sound:", error);
    });
  }
}

/**
 * Stop and clean up the background sound
 */
export function stopBackgroundSound(): void {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    backgroundAudio = null;
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Send a notification
 */
export function sendNotification(title: string, body: string): void {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "/logo.png", // Replace with your app's logo
    });

    // Close the notification after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}

/**
 * Format time in seconds to mm:ss format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format time in minutes to human readable format (Xh Ym)
 */
export const formatMinutesToHuman = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }

  return `${mins}m`;
};

/**
 * Get today's focus time from localStorage
 */
export const getTodayFocusTime = (): number => {
  try {
    const storageKey = "pomodoro-storage";
    let storageData;

    try {
      storageData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (e) {
      console.error("Error parsing pomodoro storage data:", e);
      return 0;
    }

    const today = new Date().toISOString().split("T")[0];

    // Return focus time for today, default to 0 if not found
    if (storageData.dailyStats && storageData.dailyStats[today]) {
      return storageData.dailyStats[today].focusTime || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error getting today's focus time:", error);
    return 0;
  }
};

/**
 * Manually trigger a storage update event to refresh components
 */
export const triggerStorageUpdate = (): void => {
  try {
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Error triggering storage update:", error);
  }
};
