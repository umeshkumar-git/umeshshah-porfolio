import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
	const cursorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const cursor = cursorRef.current;
		if (!cursor) return;

		let hover = false;
		const mousePos = { x: 0, y: 0 };
		const cursorPos = { x: 0, y: 0 };
		let animationFrameId: number | null = null;
		let isVisible = true;

		// Handle mouse movement
		const handleMouseMove = (e: MouseEvent) => {
			mousePos.x = e.clientX;
			mousePos.y = e.clientY;

			// Show cursor if hidden
			if (!isVisible) {
				isVisible = true;
				cursor.style.opacity = "1";
			}
		};

		// Handle page visibility
		const handleVisibilityChange = () => {
			if (document.hidden) {
				if (animationFrameId) cancelAnimationFrame(animationFrameId);
				isVisible = false;
				cursor.style.opacity = "0";
			} else {
				isVisible = true;
				cursor.style.opacity = "1";
				startAnimationLoop();
			}
		};

		// Animation loop with RAF cancellation
		const startAnimationLoop = () => {
			const loop = () => {
				if (!hover && isVisible) {
					const delay = 6;
					cursorPos.x += (mousePos.x - cursorPos.x) / delay;
					cursorPos.y += (mousePos.y - cursorPos.y) / delay;

					// Direct transform is faster than GSAP for continuous animation
					cursor.style.transform = `translate(${Math.round(
						cursorPos.x
					)}px, ${Math.round(cursorPos.y)}px)`;
				}
				animationFrameId = requestAnimationFrame(loop);
			};
			animationFrameId = requestAnimationFrame(loop);
		};

		// Setup hover handlers for data-cursor elements
		const handleMouseOverCursor = (e: MouseEvent) => {
			const target = e.currentTarget as HTMLElement;
			const rect = target.getBoundingClientRect();
			const cursorType = target.dataset.cursor;

			if (cursorType === "icons") {
				cursor.classList.add("cursor-icons");
				gsap.to(cursor, {
					x: rect.left,
					y: rect.top,
					duration: 0.15,
					overwrite: "auto",
				});
				cursor.style.setProperty("--cursorH", `${rect.height}px`);
				hover = true;
			} else if (cursorType === "disable") {
				cursor.classList.add("cursor-disable");
				hover = true;
			}
		};

		const handleMouseOutCursor = () => {
			cursor.classList.remove("cursor-disable", "cursor-icons");
			hover = false;
		};

		// Attach event listeners
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("visibilitychange", handleVisibilityChange);

		const cursorElements = document.querySelectorAll("[data-cursor]");
		cursorElements.forEach((element) => {
			element.addEventListener("mouseover", handleMouseOverCursor);
			element.addEventListener("mouseout", handleMouseOutCursor);
		});

		// Start animation loop
		startAnimationLoop();

		// Cleanup function
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange
			);
			cursorElements.forEach((element) => {
				element.removeEventListener("mouseover", handleMouseOverCursor);
				element.removeEventListener("mouseout", handleMouseOutCursor);
			});
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
