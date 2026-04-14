// src/components/SocialIcons.tsx
import React, { memo, useEffect, useRef } from "react";
import { FiGithub, FiLinkedin, FiFileText } from "react-icons/fi";
import { IconType } from "react-icons";
import gsap from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────
type SocialLink = {
	id: string;
	icon: IconType;
	href: string;
	label: string;
	tooltip: string;
	openInNew: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SOCIAL_LINKS: SocialLink[] = [
	{
		id: "github",
		icon: FiGithub,
		href: "https://github.com/umeshkumar-git",
		label: "GitHub",
		tooltip: "View my repositories",
		openInNew: true,
	},
	{
		id: "linkedin",
		icon: FiLinkedin,
		href: "https://linkedin.com/in/umeshshah",
		label: "LinkedIn",
		tooltip: "Connect on LinkedIn",
		openInNew: true,
	},
	{
		id: "resume",
		icon: FiFileText,
		href: "/resume.pdf",
		label: "Resume",
		tooltip: "Download resume",
		openInNew: true,
	},
];

// ─── Component ────────────────────────────────────────────────────────────────
const SocialIcons: React.FC = memo(() => {
	const containerRef = useRef<HTMLDivElement>(null);

	// ── Entrance animation — stagger up from bottom ───────────────────────────
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
				delay: 1.2, // after loading screen fades
			}
		);
	}, []);

	return (
		<div
			ref={containerRef}
			className="fixed left-6 bottom-0 z-[90] hidden lg:flex flex-col items-center gap-1"
			aria-label="Social links"
			role="list"
		>
			{SOCIAL_LINKS.map((link) => {
				const Icon = link.icon;
				return <SocialItem key={link.id} link={link} Icon={Icon} />;
			})}

			{/* Vertical connecting line */}
			<div
				className="mt-3 w-px h-20 bg-gradient-to-b from-white/20 to-transparent"
				aria-hidden="true"
			/>
		</div>
	);
});

SocialIcons.displayName = "SocialIcons";

// ─── SocialItem ───────────────────────────────────────────────────────────────
const SocialItem = memo(
	({ link, Icon }: { link: SocialLink; Icon: SocialLink["icon"] }) => {
		const [showTip, setShowTip] = React.useState(false);

		return (
			<div
				data-social-item
				role="listitem"
				className="relative flex items-center"
				style={{ opacity: 0 }}
			>
				{/* Styled tooltip */}
				{showTip && (
					<div
						aria-hidden="true"
						className="absolute left-12 whitespace-nowrap
                     rounded-md bg-zinc-800 border border-white/10
                     px-3 py-1.5 text-xs text-white/80 font-medium
                     shadow-lg pointer-events-none
                     animate-in fade-in slide-in-from-left-2 duration-150"
					>
						{link.tooltip}
						<div
							className="absolute -left-1 top-1/2 -translate-y-1/2
                          w-2 h-2 bg-zinc-800 border-l border-b
                          border-white/10 rotate-45"
						/>
					</div>
				)}

				<a
					href={link.href}
					target={link.openInNew ? "_blank" : undefined}
					rel={link.openInNew ? "noopener noreferrer" : undefined}
					aria-label={link.label}
					onMouseEnter={() => setShowTip(true)}
					onMouseLeave={() => setShowTip(false)}
					onFocus={() => setShowTip(true)}
					onBlur={() => setShowTip(false)}
					className="
          group relative flex items-center justify-center
          w-9 h-9 rounded-lg
          text-white/30 transition-all duration-200
          hover:text-white hover:bg-white/5
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-purple-500 focus-visible:rounded-lg
        "
				>
					<Icon
						size={18}
						className="transition-colors duration-200"
					/>

					{/* Purple dot indicator on hover */}
					<span
						className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5
                     rounded-full bg-purple-500
                     opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100
                     transition-all duration-200"
						aria-hidden="true"
					/>
				</a>
			</div>
		);
	}
);

SocialItem.displayName = "SocialItem";

export default SocialIcons;
