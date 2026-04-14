import { memo } from "react";

interface HoverLinksProps {
	text: string;
	href?: string;
	disableCursor?: boolean;
	external?: boolean;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	ariaLabel?: string;
}

const HoverLinks = memo(
	({
		text,
		href,
		disableCursor = false,
		external = false,
		onClick,
		className = "",
		disabled = false,
		ariaLabel,
	}: HoverLinksProps) => {
		const Tag = href ? "a" : "div";

		const anchorProps = href
			? {
					href: disabled ? undefined : href,
					...(external && {
						target: "_blank",
						rel: "noopener noreferrer",
					}),
			  }
			: {};

		const baseClasses = `hover-link group relative inline-flex overflow-hidden cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm transition-opacity duration-200 ${className}`;
		const disabledClasses = disabled
			? "opacity-50 cursor-not-allowed pointer-events-none"
			: "";

		return (
			<Tag
				{...anchorProps}
				onClick={disabled ? undefined : onClick}
				data-cursor={disableCursor ? "disable" : undefined}
				aria-label={ariaLabel}
				aria-disabled={disabled}
				className={`${baseClasses} ${disabledClasses}`}
			>
				<span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-full will-change-transform">
					{text}
				</span>

				<span
					aria-hidden="true"
					className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 will-change-transform"
				>
					{text}
				</span>
			</Tag>
		);
	}
);

HoverLinks.displayName = "HoverLinks";

export default HoverLinks;
