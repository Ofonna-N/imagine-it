import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/react-router/vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig(({ command }) => ({
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths(), vercelPreset(), devtoolsJson()],
  define: {
    "process.env": process.env,
  },
}));
