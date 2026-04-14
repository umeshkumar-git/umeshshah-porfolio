import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		// Keep these here so Vite ignores them during pre-bundling
		exclude: ["troika-three-text", "webgl-sdf-generator"],
	},
});
