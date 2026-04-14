// src/components/TechStackFallback.tsx  ✅ Fixed filename
import { useEffect, useState } from "react";

// ─── Component ────────────────────────────────────────────────────────────────
const TechStackFallback = () => {
	// ✅ Timeout detection — if loading > 8s, show a soft warning
	const [isSlowLoad, setIsSlowLoad] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsSlowLoad(true), 8000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			// ✅ Exact match to TechStack canvas dimensions — zero CLS
			className="relative flex flex-col items-center justify-center
                 w-full h-[60vh] min-h-[400px]"
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label="Loading 3D Tech Stack"
		>
			{/* Background glow — visual continuity with loaded state */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0
                   flex items-center justify-center"
			>
				<div
					className="h-48 w-48 rounded-full
                        bg-purple-500/5 blur-[60px]
                        animate-pulse"
				/>
			</div>

			<div className="relative z-10 flex flex-col items-center gap-5">
				{/* ── Spinner — purple-accented, matches design system ── */}
				<div className="relative flex items-center justify-center">
					{/* Outer slow ring */}
					<div
						className="absolute w-16 h-16 rounded-full
                       border border-purple-500/20
                       animate-spin"
						style={{ animationDuration: "3s" }}
						aria-hidden="true"
					/>
					{/* Inner fast ring — offset creates depth */}
					<div
						className="w-10 h-10 rounded-full
                       border-2 border-white/10
                       border-t-purple-500/70
                       animate-spin"
						style={{ animationDuration: "0.9s" }}
						aria-hidden="true"
					/>
				</div>

				{/* ── Label — matches section eyebrow style ── */}
				<div className="flex flex-col items-center gap-1.5">
					<p
						className="text-purple-400 text-[10px] font-semibold
                        tracking-[0.3em] uppercase"
					>
						{isSlowLoad ? "Still loading…" : "Loading Tech Stack"}
					</p>

					{/* Slow load hint — soft, not alarming */}
					{isSlowLoad && (
						<p
							className="text-white/20 text-[10px] font-mono
                          tracking-wide text-center max-w-[200px]"
						>
							3D assets loading — this may take a moment
						</p>
					)}
				</div>

				{/* ── Animated loading dots — signals activity ── */}
				<LoadingDots />
			</div>
		</div>
	);
};

// ─── Animated dots — pure CSS, zero JS per frame ─────────────────────────────
const LoadingDots = () => (
	<div className="flex items-center gap-1.5" aria-hidden="true">
		{[0, 1, 2].map((i) => (
			<div
				key={i}
				className="w-1 h-1 rounded-full bg-purple-500/40 animate-bounce"
				style={{
					animationDelay: `${i * 0.15}s`,
					animationDuration: "0.9s",
				}}
			/>
		))}
	</div>
);

TechStackFallback.displayName = "TechStackFallback";
export default TechStackFallback;
