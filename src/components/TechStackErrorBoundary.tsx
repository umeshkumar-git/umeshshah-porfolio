// src/components/TechStackErrorBoundary.tsx
import { Component, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
	children: ReactNode;
	onError?: (error: Error, info: { componentStack: string }) => void;
}

interface State {
	hasError: boolean;
	errorMessage: string;
	retryKey: number; // increment to force children remount
}

// ─── Static fallback tech list (matches MobileTechFallback in MainContainer) ──
type TechCategory = { label: string; items: string[] };

const TECH_CATEGORIES: TechCategory[] = [
	{
		label: "Frontend",
		items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GSAP"],
	},
	{
		label: "3D / Graphics",
		items: ["Three.js", "React Three Fiber", "WebGL"],
	},
	{
		label: "Backend",
		items: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
	},
];

// ─── Error Boundary ───────────────────────────────────────────────────────────
export class TechStackErrorBoundary extends Component<Props, State> {
	static displayName = "TechStackErrorBoundary";

	state: State = {
		hasError: false,
		errorMessage: "",
		retryKey: 0,
	};

	// ✅ Capture error message for richer fallback
	static getDerivedStateFromError(error: Error): Partial<State> {
		return {
			hasError: true,
			errorMessage: error.message ?? "Unknown error",
		};
	}

	// ✅ Log errors — critical for production debugging
	componentDidCatch(error: Error, info: { componentStack: string }) {
		console.error("[TechStackErrorBoundary] 3D scene crashed:", error);
		console.error("Component stack:", info.componentStack);

		// Forward to parent error handler (e.g. Sentry) if provided
		this.props.onError?.(error, info);
	}

	// ✅ Reset mechanism — remounts children fresh
	handleRetry = () => {
		this.setState((prev) => ({
			hasError: false,
			errorMessage: "",
			retryKey: prev.retryKey + 1,
		}));
	};

	render() {
		if (this.state.hasError) {
			return <TechStackFallbackUI onRetry={this.handleRetry} />;
		}

		// ✅ retryKey forces full remount of children on retry
		return <div key={this.state.retryKey}>{this.props.children}</div>;
	}
}

// ─── Fallback UI ──────────────────────────────────────────────────────────────
// Matches TechStack section dimensions + design system
// Recruiter still sees full tech stack even when 3D fails

interface FallbackProps {
	onRetry: () => void;
}

function TechStackFallbackUI({ onRetry }: FallbackProps) {
	return (
		<section
			aria-label="Tech Stack — static fallback"
			// ✅ Matches TechStack canvas height exactly — no layout shift
			className="relative flex flex-col items-center justify-center
                 min-h-[400px] h-[60vh] w-full px-6 py-24"
		>
			{/* Background glow — visual continuity with 3D scene */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0
                   flex items-center justify-center"
			>
				<div
					className="h-64 w-64 rounded-full
                        bg-purple-500/5 blur-[80px]"
				/>
			</div>

			{/* ── Header ── */}
			<div className="relative z-10 mb-10 text-center">
				<p
					className="text-purple-400 text-xs font-semibold
                      tracking-[0.2em] uppercase mb-3"
				>
					What I work with
				</p>
				<h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
					Tech <span className="text-purple-500">Stack</span>
				</h2>
				{/* Subtle notice — doesn't alarm recruiter */}
				<p className="mt-3 text-white/25 text-xs font-mono">
					Interactive 3D view unavailable in this environment
				</p>
			</div>

			{/* ── Tech categories ── */}
			<div className="relative z-10 w-full max-w-xl space-y-6">
				{TECH_CATEGORIES.map(({ label, items }) => (
					<div key={label}>
						<p
							className="mb-3 text-[11px] font-semibold tracking-[0.25em]
                          uppercase text-purple-400/70"
						>
							{label}
						</p>
						<div className="flex flex-wrap gap-2">
							{items.map((tech) => (
								<span
									key={tech}
									className="rounded-full border border-purple-500/20
                             bg-purple-500/5 px-4 py-1.5
                             text-xs font-medium text-white/60
                             tracking-wide"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				))}
			</div>

			{/* ── Retry button ── */}
			<button
				onClick={onRetry}
				className="relative z-10 mt-10
                   flex items-center gap-2
                   rounded-full border border-white/10
                   px-5 py-2 text-xs font-medium text-white/40
                   transition-all duration-200
                   hover:border-purple-500/40 hover:text-white/70
                   hover:bg-purple-500/8
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-purple-500"
				aria-label="Retry loading 3D tech stack"
			>
				<span aria-hidden="true">↺</span>
				Try loading 3D view
			</button>
		</section>
	);
}
