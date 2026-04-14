import { useEffect, useRef } from "react";

const GLOW_SIZE = 200;
const GLOW_OFFSET = GLOW_SIZE / 2;
const GLOW_COLOR = "rgba(37, 99, 235, 0.4)";

function CursorGlow() {
	const glowRef = useRef < HTMLDivElement > null;
	const posRef = useRef({ x: 0, y: 0 });
	let animationFrameId: number | null = null;

	useEffect(() => {
		const glow = glowRef.current;
		if (!glow) return;

		const handleMouseMove = (e: MouseEvent) => {
			posRef.current = { x: e.clientX, y: e.clientY };
		};

		// Use RAF for smooth updates instead of state
		const updateGlowPosition = () => {
			const { x, y } = posRef.current;
			glow.style.transform = `translate(${x - GLOW_OFFSET}px, ${
				y - GLOW_OFFSET
			}px)`;
			animationFrameId = requestAnimationFrame(updateGlowPosition);
		};

		window.addEventListener("mousemove", handleMouseMove, {
			passive: true,
		});
		animationFrameId = requestAnimationFrame(updateGlowPosition);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div
			ref={glowRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: `${GLOW_SIZE}px`,
				height: `${GLOW_SIZE}px`,
				borderRadius: "50%",
				background: `radial-gradient(circle, ${GLOW_COLOR} 0%, transparent 70%)`,
				pointerEvents: "none",
				zIndex: 0,
				willChange: "transform",
				contain: "layout style paint",
			}}
		/>
	);
}

export default CursorGlow;
