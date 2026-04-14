// src/components/Navbar.tsx
import { useState, useEffect, useCallback, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

// ─── Types ────────────────────────────────────────────────────────────────────
type NavLink = {
	label: string;
	href: string;
	sectionId: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
	{ label: "Home", href: "#home", sectionId: "home" },
	{ label: "Work", href: "#work", sectionId: "work" },
	{ label: "Experience", href: "#career", sectionId: "career" },
	{ label: "Contact", href: "#contact", sectionId: "contact" },
];

// ─── Smooth scroll via GSAP (works with ScrollSmoother) ──────────────────────
const scrollToSection = (sectionId: string) => {
	const target = document.getElementById(sectionId);
	if (!target) return;
	gsap.to(window, {
		duration: 1,
		scrollTo: { y: target, offsetY: 80 },
		ease: "power3.inOut",
	});
};

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar = memo(() => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [activeId, setActiveId] = useState("home");
	const [menuOpen, setMenuOpen] = useState(false);
	const scrolledRef = useRef(false); // guard against redundant setState
	const menuRef = useRef<HTMLDivElement>(null);

	// ── Scroll detection (guarded + passive) ───────────────────────────────────
	useEffect(() => {
		const handleScroll = () => {
			const shouldBeScrolled = window.scrollY > 20;
			// Only update state when value actually changes
			if (shouldBeScrolled !== scrolledRef.current) {
				scrolledRef.current = shouldBeScrolled;
				setIsScrolled(shouldBeScrolled);
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// ── Active section via IntersectionObserver ────────────────────────────────
	useEffect(() => {
		const observers: IntersectionObserver[] = [];

		NAV_LINKS.forEach(({ sectionId }) => {
			const el = document.getElementById(sectionId);
			if (!el) return;

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) setActiveId(sectionId);
				},
				{ threshold: 0.4, rootMargin: "-80px 0px 0px 0px" }
			);

			observer.observe(el);
			observers.push(observer);
		});

		return () => observers.forEach((o) => o.disconnect());
	}, []);

	// ── Close mobile menu on outside click ────────────────────────────────────
	useEffect(() => {
		if (!menuOpen) return;
		const handleClick = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [menuOpen]);

	// ── Lock body scroll when mobile menu is open ─────────────────────────────
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	// ── Nav link click handler ─────────────────────────────────────────────────
	const handleNavClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
			e.preventDefault();
			setMenuOpen(false);
			scrollToSection(sectionId);
		},
		[]
	);

	return (
		<>
			<nav
				className={`
          fixed top-0 left-0 right-0 z-[100]
          transition-all duration-300 ease-in-out
          ${
				isScrolled
					? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4"
					: "bg-transparent py-6"
			}
        `}
				aria-label="Main navigation"
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6">
					{/* ── Logo ── */}
					<a
						href="#home"
						onClick={(e) => handleNavClick(e, "home")}
						aria-label="Back to top"
						className="group text-xl font-black tracking-tighter text-white"
					>
						UMESH
						<span className="text-purple-500 transition-all duration-300 group-hover:text-purple-300">
							.
						</span>
					</a>

					{/* ── Desktop Links ── */}
					<ul
						className="hidden md:flex items-center gap-8"
						role="list"
					>
						{NAV_LINKS.map(({ label, href, sectionId }) => (
							<li key={sectionId}>
								<a
									href={href}
									onClick={(e) =>
										handleNavClick(e, sectionId)
									}
									aria-current={
										activeId === sectionId
											? "page"
											: undefined
									}
									className={`
                    relative text-sm font-medium tracking-wide
                    transition-colors duration-200
                    after:absolute after:bottom-[-4px] after:left-0
                    after:h-[1px] after:bg-purple-500
                    after:transition-all after:duration-300
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-purple-500 focus-visible:rounded-sm
                    ${
						activeId === sectionId
							? "text-white after:w-full"
							: "text-white/50 hover:text-white after:w-0 hover:after:w-full"
					}
                  `}
								>
									{label}
								</a>
							</li>
						))}
					</ul>

					{/* ── Desktop CTA ── */}
					<div className="hidden md:flex items-center gap-4">
						<a
							href="#contact"
							onClick={(e) => handleNavClick(e, "contact")}
							className="
                relative overflow-hidden rounded-full
                border border-purple-500/50
                px-5 py-2 text-sm font-semibold text-white
                transition-all duration-300
                hover:border-purple-400 hover:bg-purple-500/10
                hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-purple-500
              "
						>
							Let's Talk
						</a>
					</div>

					{/* ── Mobile Hamburger ── */}
					<button
						className="flex md:hidden flex-col items-center justify-center
                       w-10 h-10 gap-1.5 rounded-lg
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-purple-500"
						onClick={() => setMenuOpen((prev) => !prev)}
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						aria-controls="mobile-menu"
					>
						<span
							className={`block h-[1.5px] w-5 bg-white transition-all duration-300
                ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
						/>
						<span
							className={`block h-[1.5px] w-5 bg-white transition-all duration-300
                ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
						/>
						<span
							className={`block h-[1.5px] w-5 bg-white transition-all duration-300
                ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
						/>
					</button>
				</div>
			</nav>

			{/* ── Mobile Menu Overlay ── */}
			<div
				id="mobile-menu"
				ref={menuRef}
				role="dialog"
				aria-modal="true"
				aria-label="Navigation menu"
				className={`
          fixed inset-0 z-[99] flex flex-col items-center justify-center
          bg-black/95 backdrop-blur-lg
          transition-all duration-300 ease-in-out
          md:hidden
          ${
				menuOpen
					? "opacity-100 pointer-events-auto"
					: "opacity-0 pointer-events-none"
			}
        `}
			>
				<ul className="flex flex-col items-center gap-8" role="list">
					{NAV_LINKS.map(({ label, href, sectionId }) => (
						<li key={sectionId}>
							<a
								href={href}
								onClick={(e) => handleNavClick(e, sectionId)}
								aria-current={
									activeId === sectionId ? "page" : undefined
								}
								className={`
                  text-3xl font-black tracking-tighter
                  transition-colors duration-200
                  ${
						activeId === sectionId
							? "text-white"
							: "text-white/40 hover:text-white"
					}
                `}
							>
								{label}
								{activeId === sectionId && (
									<span className="text-purple-500">.</span>
								)}
							</a>
						</li>
					))}
				</ul>

				{/* Mobile CTA */}
				<a
					href="#contact"
					onClick={(e) => handleNavClick(e, "contact")}
					className="
            mt-12 rounded-full border border-purple-500/50
            px-8 py-3 text-sm font-semibold text-white
            transition-all duration-300
            hover:bg-purple-500/10
            hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]
          "
				>
					Let's Talk
				</a>
			</div>
		</>
	);
});

Navbar.displayName = "Navbar";
export default Navbar;
