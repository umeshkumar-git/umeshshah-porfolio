import { memo } from "react";
import "./styles/Career.css";

const CAREER_DATA = [
	{
		id: 1,
		type: "education",
		title: "Bachelor of Engineering",
		institution: "Bangalore Technological Institute",
		date: "NOW",
		dateSort: 2026,
		description: "Computer Science and Engineering (2023–Present).",
		icon: "🎓",
	},
	{
		id: 2,
		type: "certification",
		title: "AI Agents Intensive",
		institution: "Kaggle / Google",
		date: "2025",
		dateSort: 2025,
		description:
			"Completed specialized training in developing and implementing AI agents.",
		icon: "🤖",
	},
	{
		id: 3,
		type: "certification",
		title: "Generative AI Mastermind",
		institution: "Outskill",
		date: "2026",
		dateSort: 2026,
		description:
			"Mastered Generative AI concepts and application development.",
		icon: "⚡",
	},
];

const CareerEntry = memo(({ entry, isLatest }) => (
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
));

CareerEntry.displayName = "CareerEntry";

const Career = memo(() => {
	const latestEntryId = CAREER_DATA[0]?.id;

	return (
		<section className="career-section section-container">
			<div className="career-container">
				<h2 className="career-title">
					Education <span>&</span>
					<br /> Certifications
				</h2>
				<div className="career-info">
					{CAREER_DATA.map((entry) => (
						<CareerEntry
							key={entry.id}
							entry={entry}
							isLatest={entry.id === latestEntryId}
						/>
					))}
				</div>
			</div>
		</section>
	);
});

Career.displayName = "Career";

export default Career;
