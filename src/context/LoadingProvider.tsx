import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from "react";
import Loading from "../components/Loading";

// ─── Constants ────────────────────────────────────────────────────────────────

const EXIT_DURATION_MS = 800; // must match Loading component CSS/GSAP duration
const SAFETY_TIMEOUT_MS = 5000; // max time before force-dismiss
const MIN_DISPLAY_MS = 1200; // minimum screen time — prevents flash on fast loads

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoadingContextType {
	isLoading: boolean;
	isExiting: boolean; // exposed — consumers can start entrance on this
	progress: number;
	setProgress: (percent: number) => void;
	dismiss: () => void; // replaces ambiguous setIsLoading(false)
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const LoadingContext = createContext<LoadingContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const LoadingProvider = ({ children }: PropsWithChildren) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isExiting, setIsExiting] = useState(false);
	const [progress, setProgressRaw] = useState(0);

	// Track refs for timeout cleanup
	const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const mountTimeRef = useRef<number>(Date.now());
	const dismissedRef = useRef(false); // guard against double-dismiss

	// ── Clears all pending timers ─────────────────────────────────────────
	const clearTimers = useCallback(() => {
		if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
		if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
	}, []);

	// ── Core dismiss — handles minimum display time + exit animation ──────
	const dismiss = useCallback(() => {
		if (dismissedRef.current) return; // idempotent
		dismissedRef.current = true;

		clearTimers();

		const elapsed = Date.now() - mountTimeRef.current;
		const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

		// Wait for minimum display time, then play exit animation
		exitTimerRef.current = setTimeout(() => {
			setIsExiting(true);

			// After exit animation completes, unmount loading screen
			exitTimerRef.current = setTimeout(() => {
				setIsLoading(false);
			}, EXIT_DURATION_MS);
		}, remaining);
	}, [clearTimers]);

	// ── Stable setProgress — clamped to 0–100 ────────────────────────────
	const setProgress = useCallback(
		(percent: number) => {
			const clamped = Math.min(100, Math.max(0, percent));
			setProgressRaw(clamped);
			// Auto-dismiss when progress reaches 100
			if (clamped >= 100) dismiss();
		},
		[dismiss]
	);

	// ── Safety timeout — force dismiss if consumers stall ────────────────
	useEffect(() => {
		safetyTimerRef.current = setTimeout(() => {
			if (!dismissedRef.current) {
				console.warn(
					`[LoadingProvider] Safety timeout hit after ${SAFETY_TIMEOUT_MS}ms.` +
						" Check that all consumers call setProgress(100) or dismiss()."
				);
				dismiss();
			}
		}, SAFETY_TIMEOUT_MS);

		return () => clearTimers();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	// ^ intentionally empty — runs once on mount only

	// ── Memoized context value ────────────────────────────────────────────
	const value = useMemo<LoadingContextType>(
		() => ({
			isLoading,
			isExiting,
			progress,
			setProgress,
			dismiss,
		}),
		[isLoading, isExiting, progress, setProgress, dismiss]
	);

	// ── Opacity logic — correct sequencing ───────────────────────────────
	// Hidden:  isLoading=true,  isExiting=false  → opacity 0, visibility hidden
	// Exiting: isLoading=true,  isExiting=true   → opacity 1, visibility visible
	//          (loading screen plays exit over the revealed content)
	// Done:    isLoading=false, isExiting=false  → opacity 1, visibility visible
	const contentVisible = isExiting || !isLoading;

	return (
		<LoadingContext.Provider value={value}>
			{/* Loading screen — unmounts after isLoading becomes false */}
			{isLoading && <Loading percent={progress} isExiting={isExiting} />}

			{/* Main content — preloads in background, reveals on exit */}
			<main
				style={{
					opacity: contentVisible ? 1 : 0,
					visibility: contentVisible ? "visible" : "hidden",
					transition: `opacity ${EXIT_DURATION_MS}ms ease-in-out`,
				}}
				aria-hidden={!contentVisible}
			>
				{children}
			</main>
		</LoadingContext.Provider>
	);
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useLoading = (): LoadingContextType => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error(
			"useLoading must be used within a <LoadingProvider>. " +
				"Wrap your app root with <LoadingProvider>."
		);
	}
	return context;
};
