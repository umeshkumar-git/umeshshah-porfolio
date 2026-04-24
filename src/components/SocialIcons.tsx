// ─── src/components/SocialIcons.tsx ──────────────────────────────────────────
// Fixed: links now read from personalDetails instead of being hardcoded.

import { memo, useEffect, useRef, useState } from "react";
import { FiGithub, FiLinkedin, FiFileText } from "react-icons/fi";
import type { IconType } from "react-icons";
import gsap from "gsap";
import "./styles/SocialIcons.css";
import { personalDetails } from "../data/personalDetails";

type SocialLink = {
	id: string;
	icon: IconType;
	href: string;
	label: string;
	tooltip: string;
	download?: boolean;
};

const SOCIAL_LINKS: SocialLink[] = [
	{
		id: "github",
		icon: FiGithub,
		href: personalDetails.social.github,
		label: "GitHub",
		tooltip: "View my repositories",
	},
	{
		id: "linkedin",
		icon: FiLinkedin,
		href: personalDetails.social.linkedin,
		label: "LinkedIn",
		tooltip: "Connect on LinkedIn",
	},
	{
		id: "resume",
		icon: FiFileText,
		href: personalDetails.social.resume,
		label: "Resume",
		tooltip: "Download resume",
		download: true,
	},
];

const SocialIcons = memo(() => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		const items =
			containerRef.current.querySelectorAll("[data-social-item]");
		gsap.fromTo(
			items,
			{ opacity: 0, x: -12 },
			{
				opacity: 1,
				x: 0,
				duration: 0.5,
				ease: "power3.out",
				stagger: 0.08,
				delay: 1.2,
			}
		);
	}, []);

	return (
		<div
			ref={containerRef}
			className="social-sidebar-container"
			aria-label="Social links"
			role="list"
		>
			{SOCIAL_LINKS.map((link) => (
				<SocialItem key={link.id} link={link} />
			))}
			<div className="social-divider" aria-hidden="true" />
		</div>
	);
});

SocialIcons.displayName = "SocialIcons";

const SocialItem = memo(({ link }: { link: SocialLink }) => {
	const [showTip, setShowTip] = useState(false);
	const Icon = link.icon;

	return (
		<div
			data-social-item
			role="listitem"
			className="social-item-wrap"
			style={{ opacity: 0 }}
		>
			{showTip && (
				<span className="social-tooltip" aria-hidden="true">
					{link.tooltip}
				</span>
			)}
			<a
				href={link.href}
				target={link.download ? undefined : "_blank"}
				rel={link.download ? undefined : "noopener noreferrer"}
				download={link.download || undefined}
				aria-label={link.label}
				className="social-btn"
				onMouseEnter={() => setShowTip(true)}
				onMouseLeave={() => setShowTip(false)}
			>
				<Icon size={18} />
			</a>
		</div>
	);
});

SocialItem.displayName = "SocialItem";
export default SocialIcons;
