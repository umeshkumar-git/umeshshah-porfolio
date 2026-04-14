import { useEffect, useRef, memo, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
	onComplete?: () => void;
	name?: string;
	duration?: number; // total timeline duration (ms)
}

const LoadingScreen = memo(
	({
		onComplete,
		name = "UMESH SHAH",
		duration = 3000,
	}: LoadingScreenProps) => {
		const overlayRef = useRef<HTMLDivElement>(null);
		const textRef = useRef<HTMLHeadingElement>(null);
		const barRef = useRef<HTMLDivElement>(null);
		const [isVisible, setIsVisible] = useState(true);
		const [canSkip, setCanSkip] = useState(false);

		useEffect(() => {
			const ctx = gsap.context(() => {
				const tl = gsap.timeline({
					onComplete: () => {
						setIsVisible(false);
						onComplete?.();
					},
				});

				// Allow skip after 1s of animation
				tl.call(() => setCanSkip(true), [], 1);

				// 1. Name slides in
				tl.fromTo(
					textRef.current,
					{ y: 40, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
				)
					// 2. Progress bar fills (slightly delayed)
					.fromTo(
						barRef.current,
						{ scaleX: 0 },
						{
							scaleX: 1,
							duration: 1,
							ease: "power2.inOut",
							transformOrigin: "left",
						},
						"-=0.2" // overlap by 200ms
					)
					// 3. Hold for a moment
					.to({}, { duration: 0.6 })
					// 4. Name fades out
					.to(textRef.current, {
						y: -30,
						opacity: 0,
						duration: 0.4,
						ease: "power2.in",
					})
					// 5. Overlay slides up
					.to(overlayRef.current, {
						yPercent: -100,
						duration: 0.8,
						ease: "power4.inOut",
					});
			}, overlayRef);

			return () => ctx.revert();
		}, [onComplete]);

		const handleSkip = () => {
			if (canSkip) {
				// Kill animation and jump to end
				gsap.globalTimeline.getChildren().forEach((tl) => {
					if (tl instanceof gsap.Timeline) tl.kill();
				});
				setIsVisible(false);
				onComplete?.();
			}
		};

		if (!isVisible) return null;

		return (
			<div
				ref={overlayRef}
				aria-label="Loading screen. Press skip to continue."
				role="status"
				className="
					fixed inset-0 z-[9999]
					flex flex-col items-center justify-center gap-8
					bg-black
				"
			>
				{/* Name */}
				<h1
					ref={textRef}
					className="
						text-5xl md:text-7xl font-bold tracking-widest
						text-white select-none
					"
				>
					{name}
				</h1>

				{/* Progress bar */}
				<div className="w-48 h-px bg-white/20 overflow-hidden rounded-full">
					<div ref={barRef} className="h-full bg-white origin-left" />
				</div>

				{/* Skip button */}
				{canSkip && (
					<button
						onClick={handleSkip}
						className={`
							mt-4 px-4 py-2 text-xs uppercase tracking-widest
							text-white/60 hover:text-white
							border border-white/30 hover:border-white/60
							rounded transition-all duration-300
							focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
						`}
						aria-label="Skip loading screen"
					>
						Skip
					</button>
				)}
			</div>
		);
	}
);

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;
