import { motion } from "framer-motion";
import { useState } from "react";
import {
  MusicalNoteIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tracks: number;
}

interface FocusMusicCardProps {
  playlists: Playlist[];
  onPlaylistSelect: (playlistId: string) => void;
  currentlyPlaying?: {
    isPlaying: boolean;
    currentTrack: {
      title: string;
      artist: string;
      duration: number;
      currentTime: number;
    };
  };
}

export const FocusMusicCard = ({
  playlists,
  onPlaylistSelect,
  currentlyPlaying,
}: FocusMusicCardProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    playlists.length > 0 ? playlists[0].id : null
  );

  // Handle playlist selection
  const handlePlaylistSelect = (id: string) => {
    setSelectedPlaylistId(id);
    onPlaylistSelect(id);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
          Focus Music
        </h3>
        <MusicalNoteIcon className="h-5 w-5 text-indigo-500" />
      </div>

      {/* Player Section */}
      {currentlyPlaying && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentlyPlaying.currentTrack.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentlyPlaying.currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(currentlyPlaying.currentTrack.currentTime)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                /
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(currentlyPlaying.currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-3">
            <div
              className="bg-indigo-500 h-1.5 rounded-full"
              style={{
                width: `${
                  (currentlyPlaying.currentTrack.currentTime /
                    currentlyPlaying.currentTrack.duration) *
                  100
                }%`,
              }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Previous track"
            >
              <BackwardIcon className="h-5 w-5" />
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label={currentlyPlaying.isPlaying ? "Pause" : "Play"}
            >
              {currentlyPlaying.isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Next track"
            >
              <ForwardIcon className="h-5 w-5" />
            </button>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Volume"
            >
              <SpeakerWaveIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Playlist Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Playlists
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {playlists.map((playlist) => (
            <motion.button
              key={playlist.id}
              onClick={() => handlePlaylistSelect(playlist.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col rounded-md overflow-hidden border ${
                selectedPlaylistId === playlist.id
                  ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-900"
                  : "border-gray-200 dark:border-gray-700"
              } transition-colors focus:outline-none`}
            >
              <img
                src={playlist.thumbnailUrl}
                alt={playlist.title}
                className="w-full h-20 object-cover"
              />
              <div className="p-2 text-left">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {playlist.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {playlist.tracks} tracks
                </p>
              </div>
              {selectedPlaylistId === playlist.id && (
                <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1">
                  {currentlyPlaying?.isPlaying ? (
                    <PauseIcon className="h-3 w-3" />
                  ) : (
                    <PlayIcon className="h-3 w-3" />
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
