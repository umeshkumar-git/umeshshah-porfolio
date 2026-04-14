import { memo, useEffect, useRef } from "react";
import { Code2, Boxes, Sparkles, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Capability {
	id: string;
	icon: React.ElementType;
	title: string;
	description: string;
	tags: string[];
	accent: string; // tailwind color class for icon + border
	featured?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// ⚠️ Reorder by strength — put your best skill first

const CAPABILITIES: Capability[] = [
	{
		id: "frontend",
		icon: Globe,
		title: "Frontend Engineering",
		description:
			"Building performant, accessible UIs with React and TypeScript. Specialise in 3D web experiences, scroll-driven animation, and design systems that scale.",
		tags: ["React", "TypeScript", "Three.js", "GSAP", "Tailwind"],
		accent: "text-purple-400 border-purple-500/20 group-hover:border-purple-500/50",
		featured: true,
	},
	{
		id: "3d",
		icon: Boxes,
		title: "3D & Creative UI",
		description:
			"Crafting interactive WebGL scenes with React Three Fiber. From particle systems to glass-morphism shaders — making interfaces recruiters screenshot.",
		tags: ["Three.js", "R3F", "GLSL", "Postprocessing", "Drei"],
		accent: "text-blue-400 border-blue-500/20 group-hover:border-blue-500/50",
		featured: true,
	},
	{
		id: "fullstack",
		icon: Code2,
		title: "Full-Stack Development",
		description:
			"End-to-end product delivery — REST APIs, auth systems, and database design. Shipped production apps handling real users and real data.",
		tags: ["Node.js", "MongoDB", "Express", "JWT", "REST"],
		accent: "text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50",
	},
	{
		id: "ai",
		icon: Sparkles,
		title: "AI Integration",
		description:
			"Wiring LLM APIs into real products — prompt engineering, streamed responses, and context-aware UI patterns. Building tools that feel intelligent.",
		tags: ["OpenAI API", "LangChain", "Prompt Engineering", "RAG"],
		accent: "text-orange-400 border-orange-500/20 group-hover:border-orange-500/50",
	},
];

// ─── Card ─────────────────────────────────────────────────────────────────────

const CapabilityCard = memo(
	({ cap, index }: { cap: Capability; index: number }) => {
		const { icon: Icon, title, description, tags, accent, featured } = cap;

		return (
			<article
				data-whatido-card
				className={[
					"group relative flex flex-col gap-4 p-6 rounded-2xl",
					"border bg-white/[0.02] backdrop-blur-sm",
					"transition-all duration-300",
					"hover:bg-white/[0.05]",
					accent,
				].join(" ")}
			>
				{/* Featured badge */}
				{featured && (
					<span
						className="absolute top-4 right-4
                         px-2 py-0.5 rounded-full
                         text-[9px] font-bold tracking-widest uppercase
                         bg-white/5 text-white/30 border border-white/10"
					>
						Core skill
					</span>
				)}

				{/* Icon */}
				<div
					className={`w-10 h-10 rounded-xl flex items-center justify-center
                       bg-white/5 border border-white/8
                       transition-colors duration-300 ${accent}`}
				>
					<Icon size={18} />
				</div>

				{/* Index */}
				<span
					className="absolute bottom-5 right-5 font-mono text-xs
                       text-white/10 select-none"
					aria-hidden="true"
				>
					{String(index + 1).padStart(2, "0")}
				</span>

				{/* Text */}
				<div className="flex flex-col gap-2">
					<h3 className="text-white font-semibold text-base leading-snug">
						{title}
					</h3>
					<p className="text-white/45 text-sm leading-relaxed">
						{description}
					</p>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1.5 mt-auto pt-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className="px-2.5 py-1 rounded-full text-[11px] font-medium
                       bg-white/5 text-white/40 border border-white/8
                       group-hover:border-white/15
                       transition-colors duration-300"
						>
							{tag}
						</span>
					))}
				</div>
			</article>
		);
	}
);

CapabilityCard.displayName = "CapabilityCard";

// ─── Main Component ───────────────────────────────────────────────────────────

const WhatIDo = memo(() => {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Header
			gsap.fromTo(
				"[data-whatido-header]",
				{ y: 30, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.6,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "[data-whatido-header]",
						start: "top 85%",
					},
				}
			);

			// Cards stagger
			gsap.fromTo(
				"[data-whatido-card]",
				{ y: 50, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.55,
					ease: "power3.out",
					stagger: 0.1,
					scrollTrigger: {
						trigger: "[data-whatido-card]",
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
			id="whatido"
			className="py-24 px-6 md:px-16 max-w-6xl mx-auto"
			aria-labelledby="whatido-heading"
		>
			{/* ── Header ── */}
			<div data-whatido-header className="mb-14">
				<p
					className="text-purple-400 text-xs font-semibold
                      tracking-[0.2em] uppercase mb-3"
				>
					Expertise
				</p>
				<h2
					id="whatido-heading"
					className="text-3xl md:text-5xl font-bold text-white"
				>
					What I bring
					<span className="text-white/20"> to the table</span>
				</h2>
				<p className="text-white/40 text-sm mt-4 max-w-lg leading-relaxed">
					I work across the full product surface — from 3D scenes and
					micro-animations to APIs and databases. Here&apos;s where
					I&apos;m strongest.
				</p>
			</div>

			{/* ── Grid ── */}
			{/*
        2-col on md, first two cards span full width to emphasise featured skills
        Adjust grid-cols to taste
      */}
			<div className="grid md:grid-cols-2 gap-4">
				{CAPABILITIES.map((cap, i) => (
					<CapabilityCard key={cap.id} cap={cap} index={i} />
				))}
			</div>
		</section>
	);
});

WhatIDo.displayName = "WhatIDo";

export default WhatIDo;
