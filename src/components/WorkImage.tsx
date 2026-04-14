import { useState, useRef, useEffect, useCallback, memo } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkImageProps {
	image: string;
	alt: string; // required — no silent empty alts
	video?: string;
	link?: string;
	title?: string; // shown in overlay alongside arrow
}

// ─── Media state machine ──────────────────────────────────────────────────────
// 4 explicit states instead of 2 booleans
type VideoState = "idle" | "loading" | "ready" | "error";

// ─── Component ───────────────────────────────────────────────────────────────

const WorkImage = memo(({ image, alt, video, link, title }: WorkImageProps) => {
	const [hovered, setHovered] = useState(false);
	const [videoState, setVideoState] = useState<VideoState>("idle");
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// ── Video play/pause — ref-driven, no re-render on every frame ──────────
	useEffect(() => {
		const vid = videoRef.current;
		if (!vid || !video) return;

		if (hovered) {
			setVideoState("loading");
			vid.play()
				.then(() => setVideoState("ready"))
				.catch(() => setVideoState("error"));
		} else {
			vid.pause();
			vid.currentTime = 0;
			// Small delay before resetting state — prevents flash if user
			// quickly re-hovers
			const t = setTimeout(() => setVideoState("idle"), 300);
			return () => clearTimeout(t);
		}
	}, [hovered, video]);

	const handleMouseEnter = useCallback(() => setHovered(true), []);
	const handleMouseLeave = useCallback(() => setHovered(false), []);

	// ── Derived display flags ────────────────────────────────────────────────
	const showVideo = hovered && videoState === "ready";
	const showSpinner = hovered && videoState === "loading";
	const Wrapper = link ? "a" : "div";
	const wrapperProps = link
		? {
				href: link,
				target: "_blank" as const,
				rel: "noopener noreferrer",
				"aria-label": `${title ?? alt} — open project`,
		  }
		: {};

	return (
		<div
			ref={containerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className="relative w-full rounded-2xl overflow-hidden
				   border border-white/8 bg-white/3 aspect-video
				   group cursor-pointer"
		>
			<Wrapper {...wrapperProps} className="block w-full h-full relative">
				{/* ── Static image (always rendered, hides under video) ── */}
				<img
					src={image}
					alt={alt}
					loading="lazy"
					decoding="async"
					className={[
						"absolute inset-0 w-full h-full object-cover object-top",
						"transition-opacity duration-400",
						showVideo ? "opacity-0" : "opacity-100",
					].join(" ")}
					onError={(e) => {
						// Replace broken image with a gradient placeholder
						const el = e.target as HTMLImageElement;
						el.style.display = "none";
					}}
				/>

				{/* ── Video preview (preload none — only loads on hover) ── */}
				{video && (
					<video
						ref={videoRef}
						src={video}
						muted
						playsInline
						loop
						preload="none" // critical — prevents eager network load
						onLoadedData={() => {}} // ready state handled in play() .then()
						className={[
							"absolute inset-0 w-full h-full object-cover object-top",
							"transition-opacity duration-400",
							showVideo ? "opacity-100" : "opacity-0",
						].join(" ")}
					/>
				)}

				{/* ── Spinner — shown while video buffers ── */}
				{showSpinner && (
					<div
						className="absolute inset-0 flex items-center justify-center
							bg-black/40 backdrop-blur-sm z-10"
					>
						<Loader2
							size={24}
							className="text-white/60 animate-spin"
							aria-label="Loading video preview"
						/>
					</div>
				)}

				{/* ── Hover overlay — only if link exists ── */}
				{link && (
					<div
						aria-hidden="true"
						className={[
							"absolute inset-0 z-20",
							"flex items-end justify-between p-5",
							"bg-gradient-to-t from-black/70 via-black/20 to-transparent",
							"transition-opacity duration-300",
							hovered ? "opacity-100" : "opacity-0",
						].join(" ")}
					>
						{title && (
							<span className="text-white text-sm font-medium">
								{title}
							</span>
						)}
						<span
							className="flex items-center gap-1.5
							   px-3 py-1.5 rounded-full
							   bg-white text-black text-xs font-semibold
							   ml-auto"
						>
							View
							<ArrowUpRight size={13} />
						</span>
					</div>
				)}

				{/* ── Error state ── */}
				{videoState === "error" && hovered && (
					<div
						className="absolute bottom-3 right-3 z-20
							px-2 py-1 rounded text-[10px]
							bg-red-500/20 text-red-300 border border-red-500/20"
					>
						Preview unavailable
					</div>
				)}
			</Wrapper>
		</div>
	);
});

WorkImage.displayName = "WorkImage";

export default WorkImage;
