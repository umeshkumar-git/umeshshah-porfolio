import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import profileImage from "../assets/profile.png";
import { SOCIAL_LINKS, HERO_CONFIG } from "../config/contact";

interface HeroElement extends HTMLElement {
	x?: number;
	y?: number;
}

export default function Hero() {
	const sectionRef = useRef < HTMLDivElement > null;
	const profileRef = useRef < HeroElement > null;
	const rafIdRef = (useRef < number) | (null > null);
	const prefersReducedMotion = useMemo(
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		[]
	);

	useEffect(() => {
		if (prefersReducedMotion) return; // Skip animations for accessibility

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

			tl.fromTo(
				"[data-hero='avatar']",
				{ scale: 0.6, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.6 }
			)
				.fromTo(
					"[data-hero='title']",
					{ y: 60, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.7 },
					"-=0.3"
				)
				.fromTo(
					"[data-hero='subtitle']",
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5 },
					"-=0.3"
				)
				.fromTo(
					"[data-hero='socials']",
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5 },
					"-=0.2"
				)
				.fromTo(
					"[data-hero='cta']",
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5 },
					"-=0.2"
				);

			// Blob pulse animation
			gsap.to("[data-hero='blob']", {
				scale: 1.15,
				opacity: 0.4,
				duration: 4,
				yoyo: true,
				repeat: -1,
				ease: "sine.inOut",
			});
		}, sectionRef);

		return () => {
			ctx.revert();
		};
	}, [prefersReducedMotion]);

	// Parallax effect with RAF throttling
	useEffect(() => {
		const profileEl = profileRef.current;
		if (!profileEl || prefersReducedMotion) return;

		const xTo = gsap.quickTo(profileEl, "x", {
			duration: 0.4,
			ease: "power2.out",
		});
		const yTo = gsap.quickTo(profileEl, "y", {
			duration: 0.4,
			ease: "power2.out",
		});

		const handleMouseMove = (e: MouseEvent) => {
			// Cancel previous RAF and schedule new one
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

			rafIdRef.current = requestAnimationFrame(() => {
				const xOffset = (e.clientX - window.innerWidth / 2) * 0.018;
				const yOffset = (e.clientY - window.innerHeight / 2) * 0.018;
				xTo(xOffset);
				yTo(yOffset);
			});
		};

		window.addEventListener("mousemove", handleMouseMove, {
			passive: true,
		});

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
		};
	}, [prefersReducedMotion]);

	return (
		<section
			ref={sectionRef}
			className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
			aria-label="Hero section"
		>
			{/* Animated gradient blob - decorative, hidden from a11y */}
			<div
				data-hero="blob"
				className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2
                   w-[560px] h-[560px] rounded-full
                   bg-purple-600 blur-[120px] opacity-30"
				aria-hidden="true"
			/>

			{/* Profile image with parallax */}
			<img
				ref={profileRef}
				data-hero="avatar"
				src={profileImage}
				alt="Umesh Shah — Frontend Developer specializing in React and Three.js"
				width={96}
				height={96}
				className="w-20 h-20 md:w-24 md:h-24 rounded-full
                   border-2 border-white/20 shadow-xl
                   mb-6 object-cover will-change-transform
                   transition-all duration-200 hover:border-white/40"
				loading="eager"
				decoding="async"
			/>

			{/* Name */}
			<h1
				data-hero="title"
				className="text-5xl md:text-7xl font-bold tracking-tight mb-3
                   bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
			>
				Umesh Shah
			</h1>

			{/* Role */}
			<p
				data-hero="subtitle"
				className="text-base md:text-lg text-gray-400 mb-6 tracking-wide"
			>
				Frontend Developer &nbsp;·&nbsp; React &nbsp;·&nbsp; Three.js
				&nbsp;·&nbsp; Creative UI
			</p>

			{/* Social icons */}
			<nav
				data-hero="socials"
				className="flex items-center gap-5 mb-8"
				aria-label="Social links"
			>
				{SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
					<a
						key={label}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit ${label}`}
						className="text-gray-400 hover:text-white transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
					>
						<Icon size={20} aria-hidden="true" />
					</a>
				))}
			</nav>

			{/* CTA Buttons */}
			<div
				data-hero="cta"
				className="flex gap-4 flex-wrap justify-center"
				role="group"
				aria-label="Call to action buttons"
			>
				<a
					href={HERO_CONFIG.resumeUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold
                     hover:bg-white/90 transition-all duration-200 shadow-md
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
				>
					View Resume
				</a>
				<a
					href={HERO_CONFIG.projectsLink}
					className="px-6 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold
                     hover:bg-white/10 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-white"
				>
					See Projects
				</a>
			</div>

			{/* Scroll indicator */}
			<div
				className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce"
				aria-hidden="true"
			>
				<ArrowDown size={18} />
			</div>
		</section>
	);
}
