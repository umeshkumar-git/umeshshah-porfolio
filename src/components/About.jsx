// ─── src/components/About.tsx ─────────────────────────────────────────────────
// Fixed: was importing from "../constants" which doesn't match this project.
// Now reads from personalDetails like the rest of the app.

import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";
import { personalDetails } from "../data/personalDetails";

gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
	const sectionRef = useRef < HTMLElement > null;

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				"[data-about-text]",
				{ y: 40, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "[data-about-text]",
						start: "top 85%",
					},
				}
			);
			gsap.fromTo(
				"[data-about-image]",
				{ scale: 0.95, opacity: 0 },
				{
					scale: 1,
					opacity: 1,
					duration: 0.9,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "[data-about-image]",
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
			id="about"
			className="about-section"
			aria-labelledby="about-heading"
		>
			<div className="about-container">
				{/* Photo */}
				<div data-about-image className="about-image-wrap">
					<img
						src="/profile.jpg"
						alt="Umesh Kumar Shah"
						className="about-photo"
					/>
					<div className="about-image-glow" aria-hidden="true" />
				</div>

				{/* Text */}
				<div data-about-text className="about-text">
					<p className="about-label">About me</p>
					<h2 id="about-heading" className="about-heading">
						Full Stack Developer
						<span className="about-heading-dim">
							{" "}
							based in Bengaluru
						</span>
					</h2>
					<p className="about-body">{personalDetails.about}</p>

					<div className="about-stats">
						<div className="about-stat">
							<span className="about-stat-value">3+</span>
							<span className="about-stat-label">
								Projects shipped
							</span>
						</div>
						<div className="about-stat">
							<span className="about-stat-value">
								{personalDetails.cgpa}
							</span>
							<span className="about-stat-label">CGPA</span>
						</div>
						<div className="about-stat">
							<span className="about-stat-value">2+</span>
							<span className="about-stat-label">
								Certifications
							</span>
						</div>
					</div>

					<a
						href={personalDetails.social.resume}
						download
						className="about-resume-btn"
					>
						Download Resume ↓
					</a>
				</div>
			</div>
		</section>
	);
});

About.displayName = "About";
export default About;
