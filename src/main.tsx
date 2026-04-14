import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// ─── Performance mark ─────────────────────────────────────────────────────────
// Visible in DevTools → Performance tab → Timings track
// Lets you measure real JS-to-first-paint time
performance.mark("app-init");

// ─── Root guard ───────────────────────────────────────────────────────────────

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error(
		"[main.tsx] Root element #root not found.\n" +
			"Check that index.html contains <div id='root'></div>."
	);
}

// ─── WebGL availability check ─────────────────────────────────────────────────
// Canvas + Scene will silently fail without WebGL.
// Warn early so the error is obvious in console, not buried in R3F internals.

function checkWebGL(): boolean {
	try {
		const canvas = document.createElement("canvas");
		const context =
			canvas.getContext("webgl2") ??
			canvas.getContext("webgl") ??
			canvas.getContext("experimental-webgl");
		return !!context;
	} catch {
		return false;
	}
}

if (!checkWebGL()) {
	console.warn(
		"[main.tsx] WebGL is not available in this browser.\n" +
			"The 3D scene will not render. " +
			"All other portfolio sections will work normally."
	);
	// Don't throw — portfolio content still works without 3D.
	// Scene.tsx should handle this gracefully via ErrorBoundary in App.tsx.
}

// ─── Mount ────────────────────────────────────────────────────────────────────

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);

// ─── Measure mount time ───────────────────────────────────────────────────────
// Log in dev only — shows in console and DevTools Performance tab
if (import.meta.env.DEV) {
	performance.mark("app-mounted");
	performance.measure("React mount time", "app-init", "app-mounted");

	const [measure] = performance.getEntriesByName("React mount time");
	console.info(
		`%c⚡ React mounted in ${measure.duration.toFixed(1)}ms`,
		"color: #a855f7; font-weight: bold;"
	);
}
