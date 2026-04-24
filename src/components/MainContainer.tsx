// ─── src/components/MainContainer.tsx ────────────────────────────────────────
// Fixed: removed unused scrollRef prop warning, clean import list.

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
import { initSplitText } from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const TECH_LIST = [
	"React",
	"TypeScript",
	"Three.js",
	"Node.js",
	"GSAP",
	"Tailwind CSS",
];

interface MainContainerProps extends PropsWithChildren {
	scrollRef?: React.RefObject<number>;
}

const MainContainer = ({ children }: MainContainerProps) => {
	const isDesktop = useIsDesktop();

	useEffect(() => {
		initSplitText();
	}, []);

	return (
		<div className="layout-root">
			<Cursor />
			<Navbar />
			<SocialIcons />

			{isDesktop && (
				<div className="canvas-layer" aria-hidden="true">
					{children}
				</div>
			)}

			<div id="smooth-wrapper">
				<div id="smooth-content">
					<div className="sections-root">
						<Landing>{!isDesktop && children}</Landing>

						<About />
						<WhatIDo />
						<Career />
						<Work />

						{isDesktop ? (
							<TechStackErrorBoundary>
								<Suspense fallback={<TechStackFallback />}>
									<TechStack />
								</Suspense>
							</TechStackErrorBoundary>
						) : (
							<MobileTechFallback />
						)}

						<Contact />
					</div>
				</div>
			</div>
		</div>
	);
};

const MobileTechFallback = () => (
	<section className="py-20 px-6 text-center">
		<h2 className="text-2xl font-bold text-white mb-8 tracking-wide uppercase">
			Tech Stack
		</h2>
		<div className="flex flex-wrap justify-center gap-3">
			{TECH_LIST.map((tech) => (
				<span
					key={tech}
					className="px-4 py-2 rounded-full border border-white/20 text-white/60 text-sm tracking-wide"
				>
					{tech}
				</span>
			))}
		</div>
	</section>
);

export default MainContainer;
