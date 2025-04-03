import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/TrackYourStudy/",
  server: {
    hmr: {
      // Force WebSocket protocol to be ws:// rather than wss://
      protocol: "ws",
      // Match server port and host
      host: "localhost",
      // Ensure client port matches server port
      clientPort: 5173,
    },
  },
});
