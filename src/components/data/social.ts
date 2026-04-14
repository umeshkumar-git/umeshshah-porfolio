// src/data/social.ts
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SocialLink = {
	id: string;
	icon: LucideIcon;
	href: string;
	label: string;
	ariaLabel: string;
	openInNew: boolean;
	primary?: boolean;
};

export const SOCIAL_LINKS: SocialLink[] = [
	{
		id: "github",
		icon: Github,
		href: "https://github.com/umeshkumar-git",
		label: "GitHub",
		ariaLabel: "View GitHub profile",
		openInNew: true,
		primary: true,
	},
	{
		id: "linkedin",
		icon: Linkedin,
		href: "https://linkedin.com/in/umeshshah",
		label: "LinkedIn",
		ariaLabel: "Connect on LinkedIn",
		openInNew: true,
		primary: true,
	},
	{
		id: "email",
		icon: Mail,
		href: "mailto:umesh@email.com",
		label: "Email",
		ariaLabel: "Send an email",
		openInNew: false,
		primary: false,
	},
	{
		id: "resume",
		icon: FileText,
		href: "/resume.pdf",
		label: "Resume",
		ariaLabel: "Download resume PDF",
		openInNew: true,
		primary: false,
	},
];
