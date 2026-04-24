// ─── src/components/Navbar.tsx ────────────────────────────────────────────────
// Fixed: removed react-router-dom (not used in this single-page app).
// Uses plain anchor links to scroll to sections instead.

import { useState, useEffect } from "react";
import "./styles/Navbar.css";
import { personalDetails } from "../data/personalDetails";

const NAV_LINKS = [
	{ label: "About", href: "#about" },
	{ label: "Work", href: "#work" },
	{ label: "Skills", href: "#whatido" },
	{ label: "Career", href: "#career" },
	{ label: "Contact", href: "#contact" },
];

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
			<a href="#" className="navbar-logo" aria-label="Back to top">
				U
			</a>

			<nav className="navbar-links" aria-label="Main navigation">
				{NAV_LINKS.map(({ label, href }) => (
					<a key={href} href={href} className="navbar-link">
						{label}
					</a>
				))}
			</nav>

			<a
				href={personalDetails.social.resume}
				download
				className="navbar-resume"
			>
				Resume ↓
			</a>

			<button
				className={`navbar-hamburger ${menuOpen ? "is-open" : ""}`}
				onClick={() => setMenuOpen((v) => !v)}
				aria-label={menuOpen ? "Close menu" : "Open menu"}
			>
				<span />
				<span />
				<span />
			</button>

			{menuOpen && (
				<nav className="navbar-mobile">
					{NAV_LINKS.map(({ label, href }) => (
						<a
							key={href}
							href={href}
							className="navbar-mobile-link"
							onClick={() => setMenuOpen(false)}
						>
							{label}
						</a>
					))}
					<a
						href={personalDetails.social.resume}
						download
						className="navbar-mobile-link"
					>
						Resume ↓
					</a>
				</nav>
			)}
		</header>
	);
};

export default Navbar;
