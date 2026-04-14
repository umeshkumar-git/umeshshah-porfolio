import { PropsWithChildren, useMemo, useState, useEffect } from "react";
import "./styles/Landing.css";
import { personalDetails } from "../data/personalDetails";

/**
 * Splits a full name into display lines.
 * "Umesh Shah"       → { first: "Umesh", last: "Shah" }
 * "Umesh Kumar Shah" → { first: "Umesh Kumar", last: "Shah" }
 * Single name        → { first: "Umesh", last: "" }
 */
function splitName(fullName: string): { first: string; last: string } {
	const parts = fullName.trim().split(/\s+/);
	if (parts.length === 1) return { first: parts[0], last: "" };
	const last = parts[parts.length - 1];
	const first = parts.slice(0, -1).join(" ");
	return { first, last };
}

const ROLES = ["Software Engineer", "Full-Stack Developer", "React & Three.js"];

const Landing = ({ children }: PropsWithChildren) => {
	// Fix: Add proper dependency (even though static, makes intent clear)
	const { first, last } = useMemo(
		() => splitName(personalDetails.name),
		[personalDetails.name]
	);

	// Track current visible role for screen readers
	const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
		}, 1330); // Match CSS: 4s ÷ 3 roles
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="landing-section" id="landingDiv">
			<div className="landing-container">
				{/* ── Intro ── */}
				<div className="landing-intro">
					<p className="landing-greeting" aria-label="Greeting">
						Hello, I&apos;m
					</p>
					<h1
						className="landing-name"
						aria-label={`${first} ${last}`}
					>
						<span className="landing-name-first">
							{first.toUpperCase()}
						</span>
						{last && (
							<>
								<br />
								<span className="landing-name-last">
									{last.toUpperCase()}
								</span>
							</>
						)}
					</h1>
				</div>

				{/* ── Role cycling ── */}
				<div className="landing-info" aria-label="Current role">
					{/*
            CSS animates opacity/translateY. JavaScript syncs screen reader
            announcements so accessibility matches visual animation.
            aria-hidden hides non-visible roles properly.
          */}
					<h2
						className="landing-role-cycle"
						aria-live="polite"
						aria-atomic="true"
					>
						{ROLES.map((role, i) => (
							<span
								key={role}
								className="landing-role-item"
								style={
									{ "--role-index": i } as React.CSSProperties
								}
								aria-hidden={i !== currentRoleIndex}
								role="status"
							>
								{role}
							</span>
						))}
					</h2>

					{/* Visually hidden text for screen reader: explicit current role */}
					<span className="sr-only" aria-live="assertive">
						Current role: {ROLES[currentRoleIndex]}
					</span>
				</div>
			</div>

			{/* Slot for scroll indicator, canvas, etc. */}
			{children}
		</div>
	);
};

export default Landing;
