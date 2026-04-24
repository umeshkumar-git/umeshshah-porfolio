// ─── src/components/Career.tsx ────────────────────────────────────────────────
// Fixed: data now pulled from personalDetails instead of hardcoded inline.

import { memo } from "react";
import "./styles/Career.css";
import { personalDetails } from "../data/personalDetails";

const CareerEntry = memo(
	({
		entry,
		isLatest,
	}: {
		entry: (typeof personalDetails.career)[0];
		isLatest: boolean;
	}) => (
		<div
			className={`career-info-box ${
				isLatest ? "career-info-box--active" : ""
			}`}
		>
			<div className="career-timeline">
				<div className="career-dot" />
				{isLatest && <div className="career-dot--pulse" />}
			</div>
			<div className="career-info-in">
				<div className="career-role">
					<span className="career-icon">{entry.icon}</span>
					<div>
						<h4>{entry.title}</h4>
						<h5>{entry.institution}</h5>
					</div>
				</div>
				<h3 className="career-date">{entry.date}</h3>
			</div>
			<p className="career-description">{entry.description}</p>
		</div>
	)
);

CareerEntry.displayName = "CareerEntry";

const Career = memo(() => (
	<section id="career" className="career-section section-container">
		<div className="career-container">
			<h2 className="career-title">
				Education <span>&</span>
				<br /> Certifications
			</h2>
			<div className="career-info">
				{personalDetails.career.map((entry, i) => (
					<CareerEntry
						key={entry.id}
						entry={entry}
						isLatest={i === 0}
					/>
				))}
			</div>
		</div>
	</section>
));

Career.displayName = "Career";
export default Career;
