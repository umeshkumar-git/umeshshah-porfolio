import { lazy, PropsWithChildren, Suspense, useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackFallback from "./TechStackFallback";
import { TechStackErrorBoundary } from "./TechStackErrorBoundary";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { initSplitText } from "./utils/splitText"; // renamed for clarity

// ─── Lazy Imports ─────────────────────────────────────────────────────────────
// Only TechStack needs lazy — it carries Three.js / R3F bundle weight
const TechStack = lazy(() => import("./TechStack"));

// ─── Component ───────────────────────────────────────────────────────────────

const MainContainer = ({ children }: PropsWithChildren) => {
	const isDesktop = useIsDesktop(); // clean hook, matchMedia-based, no resize spam

	// SplitText init: runs once on mount, not on every resize
	// If your SplitText truly needs resize, debounce inside the utility itself
	useEffect(() => {
		initSplitText();
	}, []);

	return (
		// Renamed: layout-root vs container-main to avoid duplicate class confusion
		<div className="layout-root">
			{/* ── Fixed / Overlay Layer ── */}
			<Cursor />
			<Navbar />
			<SocialIcons />

			{/* ── Desktop: 3D canvas renders behind smooth scroll content ── */}
			{isDesktop && (
				<div className="canvas-layer" aria-hidden="true">
					{children}
				</div>
			)}

			{/* ── Smooth Scroll Wrapper ── */}
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<div className="sections-root">
						<Landing>
							{/* Mobile: canvas goes inside landing (no fixed layer) */}
							{!isDesktop && children}
						</Landing>

						<About />
						<WhatIDo />
						<Career />
						<Work />

						{/* TechStack: desktop only, lazy + error-bounded */}
						{isDesktop ? (
							<TechStackErrorBoundary>
								<Suspense fallback={<TechStackFallback />}>
									<TechStack />
								</Suspense>
							</TechStackErrorBoundary>
						) : (
							// Mobile fallback: static tech list instead of hiding entirely
							<MobileTechFallback />
						)}

						<Contact />
					</div>
				</div>
			</div>
		</div>
	);
};

// ─── Mobile Tech Fallback ────────────────────────────────────────────────────
// Shows recruiters your stack even without 3D — never hide your skills

const TECH_LIST = [
	"React",
	"TypeScript",
	"Three.js",
	"Node.js",
	"GSAP",
	"Tailwind CSS",
];

const MobileTechFallback = () => (
	<section className="py-20 px-6 text-center">
		<h2 className="text-2xl font-bold text-white mb-8 tracking-wide uppercase">
			Tech Stack
		</h2>
		<div className="flex flex-wrap justify-center gap-3">
			{TECH_LIST.map((tech) => (
				<span
					key={tech}
					className="px-4 py-2 rounded-full border border-white/20
                     text-white/60 text-sm tracking-wide"
				>
					{tech}
				</span>
			))}
		</div>
	</section>
);

export default MainContainer;
