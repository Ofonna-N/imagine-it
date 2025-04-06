import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/react-router/vite";

export default defineConfig(({ command }) => ({
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths(), vercelPreset()],
  define: {
    "process.env": process.env,
  },
}));
