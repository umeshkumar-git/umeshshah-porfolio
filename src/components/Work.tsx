// ─── src/components/Work.tsx ──────────────────────────────────────────────────
// Fixed: project data now comes from personalDetails instead of hardcoded array.

import { useState, useCallback, useEffect, useRef, memo } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Work.css";
import { personalDetails } from "../data/personalDetails";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = personalDetails.projects;

const ProjectSlide = memo(
	({
		project,
		index,
		isActive,
	}: {
		project: (typeof PROJECTS)[0];
		index: number;
		isActive: boolean;
	}) => (
		<div
			className={`absolute inset-0 flex flex-col md:flex-row gap-8 md:gap-12 items-center transition-opacity duration-100 ${
				isActive
					? "opacity-100 pointer-events-auto"
					: "opacity-0 pointer-events-none"
			}`}
			aria-hidden={!isActive}
		>
			{/* Info */}
			<div className="flex flex-col gap-5 md:w-2/5 shrink-0">
				<div className="flex items-center gap-3">
					<span className="font-mono text-4xl font-bold text-white/10 select-none">
						{String(index + 1).padStart(2, "0")}
					</span>
					<div className="h-px flex-1 bg-white/10" />
					<span className="text-xs text-white/30 tracking-widest uppercase">
						{project.year}
					</span>
				</div>

				<div className="flex flex-col gap-2">
					<p className="text-purple-400 text-xs tracking-[0.2em] uppercase font-semibold">
						{project.category}
					</p>
					<h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
						{project.title}
					</h3>
				</div>

				<p className="text-white/45 text-sm leading-relaxed">
					{project.description}
				</p>

				<div className="flex flex-wrap gap-2">
					{project.tools.map((tool) => (
						<span
							key={tool}
							className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10"
						>
							{tool}
						</span>
					))}
				</div>

				<div className="flex items-center gap-4 mt-1">
					<a
						href={project.github}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
					>
						<FaGithub size={15} /> Code
					</a>
					{project.live && (
						<a
							href={project.live}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
						>
							<ExternalLink size={15} /> Live demo
						</a>
					)}
				</div>
			</div>

			{/* Image */}
			<div className="md:flex-1 w-full rounded-2xl overflow-hidden border border-white/8 bg-white/3 aspect-video relative group">
				<img
					src={project.image}
					alt={`${project.title} screenshot`}
					className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
					loading="lazy"
					onError={(e) => {
						(e.target as HTMLImageElement).style.display = "none";
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
			</div>
		</div>
	)
);

ProjectSlide.displayName = "ProjectSlide";

const Work = memo(() => {
	const [current, setCurrent] = useState(0);
	const [animating, setAnimating] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const touchStartX = useRef(0);
	const total = PROJECTS.length;

	const navigate = useCallback(
		(next: number) => {
			if (animating) return;
			setAnimating(true);
			const el = contentRef.current;
			if (!el) {
				setCurrent(next);
				setAnimating(false);
				return;
			}
			gsap.timeline({ onComplete: () => setAnimating(false) })
				.to(el, {
					opacity: 0,
					y: 10,
					duration: 0.18,
					ease: "power2.in",
				})
				.call(() => setCurrent(next))
				.to(el, {
					opacity: 1,
					y: 0,
					duration: 0.28,
					ease: "power2.out",
				});
		},
		[animating]
	);

	const prev = useCallback(
		() => navigate(current === 0 ? total - 1 : current - 1),
		[current, total, navigate]
	);
	const next = useCallback(
		() => navigate(current === total - 1 ? 0 : current + 1),
		[current, total, navigate]
	);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				"[data-work-header]",
				{ y: 30, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.6,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "[data-work-header]",
						start: "top 85%",
					},
				}
			);
			gsap.fromTo(
				"[data-work-carousel]",
				{ y: 40, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.6,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "[data-work-carousel]",
						start: "top 85%",
					},
				}
			);
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="work"
			className="py-24 px-6 md:px-16 max-w-6xl mx-auto"
		>
			<div data-work-header className="mb-14">
				<p className="text-purple-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
					Portfolio
				</p>
				<div className="flex items-end justify-between gap-4 flex-wrap">
					<h2 className="text-3xl md:text-5xl font-bold text-white">
						My Work
					</h2>
					<span
						className="font-mono text-sm text-white/30"
						aria-live="polite"
					>
						{String(current + 1).padStart(2, "0")} /{" "}
						{String(total).padStart(2, "0")}
					</span>
				</div>
			</div>

			<div
				data-work-carousel
				role="region"
				aria-label="Project carousel"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "ArrowLeft") prev();
					if (e.key === "ArrowRight") next();
				}}
				onTouchStart={(e) => {
					touchStartX.current = e.touches[0].clientX;
				}}
				onTouchEnd={(e) => {
					const diff =
						touchStartX.current - e.changedTouches[0].clientX;
					if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
				}}
				className="relative outline-none"
			>
				<div
					ref={contentRef}
					className="relative"
					style={{ minHeight: "clamp(360px, 50vw, 500px)" }}
				>
					{PROJECTS.map((project, i) => (
						<ProjectSlide
							key={project.id}
							project={project}
							index={i}
							isActive={i === current}
						/>
					))}
				</div>

				<div className="flex items-center justify-between mt-8">
					<div className="flex items-center gap-2" role="tablist">
						{PROJECTS.map((p, i) => (
							<button
								key={p.id}
								role="tab"
								aria-selected={i === current}
								aria-label={`Go to ${p.title}`}
								onClick={() => navigate(i)}
								className={`rounded-full transition-all duration-300 ${
									i === current
										? "w-6 h-1.5 bg-purple-400"
										: "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
								}`}
							/>
						))}
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={prev}
							disabled={animating}
							aria-label="Previous project"
							className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30 transition-all"
						>
							<ArrowLeft size={16} />
						</button>
						<button
							onClick={next}
							disabled={animating}
							aria-label="Next project"
							className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30 transition-all"
						>
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
});

Work.displayName = "Work";
export default Work;
