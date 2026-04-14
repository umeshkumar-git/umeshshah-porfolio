import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

interface LoadingScreenProps {
	name: string;
	onComplete: () => void;
}

const LoadingScreen = ({ name, onComplete }: LoadingScreenProps) => {
	const { progress } = useProgress();
	const [isFinished, setIsFinished] = useState(false);

	useEffect(() => {
		// When 3D assets are 100% loaded
		if (progress === 100) {
			const timer = setTimeout(() => {
				setIsFinished(true);
				// Animate the loader out
				gsap.to(".loader-container", {
					opacity: 0,
					duration: 1,
					ease: "power2.inOut",
					onComplete: onComplete,
				});
			}, 500); // Small buffer for smoothness
			return () => clearTimeout(timer);
		}
	}, [progress, onComplete]);

	return (
		<div className="loader-container fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000]">
			<div className="relative flex flex-col items-center">
				{/* Brand Name */}
				<h2 className="mb-4 text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
					Initializing Portfolio
				</h2>
				<h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
					{name}
					<span className="text-[#a855f7]">.</span>
				</h1>

				{/* Progress Bar Container */}
				<div className="mt-12 h-[2px] w-64 overflow-hidden bg-white/10 rounded-full">
					<div
						className="h-full bg-[#a855f7] transition-all duration-300 ease-out"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Progress Percentage */}
				<span className="mt-4 font-mono text-[10px] text-white/30 tabular-nums">
					{Math.round(progress)}%
				</span>
			</div>

			{/* Background Decorative Gradient */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#a855f7]/10 blur-[120px] rounded-full pointer-events-none" />
		</div>
	);
};

export default LoadingScreen;
