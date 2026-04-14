import { Github, Linkedin, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export interface HeroConfig {
  resumeUrl: string;
  projectsLink: string;
}

/**
 * Social media links - externalized for easy maintenance
 * Update here instead of in component
 */
export const SOCIAL_LINKS: SocialLink[] = [
