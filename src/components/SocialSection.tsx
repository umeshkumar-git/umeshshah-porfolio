// src/components/SocialSection.tsx
import { memo, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
// ✅ Removed Twitter — not valuable for dev portfolio recruiter flow
// ✅ Added Resume — highest recruiter value
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
type SocialLink = {
  id: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  href: string;
  label: string;
  ariaLabel: string;
  primary?: boolean; // primary links get stronger visual weight
};

// ─── Single source of truth for social links ──────────────────────────────────
// ⚠️  These URLs must match SocialIcons.tsx exactly
// TODO: Extract to src/data/social.ts and import in both components
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id:        "github",
    icon:      Github,
    href:      "https://github.com/umeshkumar-git",
    label:     "GitHub",
    ariaLabel: "View GitHub profile",
    primary:   true,
  },
  {
    id:        "linkedin",
    icon:      Linkedin,
    href:      "https://linkedin.com/in/umeshshah", // ✅ Unified URL
    label:     "LinkedIn",
    ariaLabel: "Connect on LinkedIn",
    primary:   true,
  },
  {
    id:        "email",
    icon:      Mail,
    href:      "mailto:umesh@email.com",
    label:     "Email",
    ariaLabel: "Send an email",
    primary:   false,
  },
  {
    id:        "resume",
    icon:      FileText,
    href:      "/resume.pdf",
    label:     "Resume",
    ariaLabel: "Download resume PDF",
    primary:   false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SocialSection = memo(() => {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !linksRef.current) return;

    const ctx = gsap.context(() => {
      // ✅ Scoped selector via linksRef — not global
      const links = linksRef.current!.querySelectorAll("[data-social-link]");

      gsap.fromTo(
        links,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true, // ✅ Fire once — don't replay on re-scroll
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Separate primary and secondary for visual hierarchy
  const primaryLinks   = SOCIAL_LINKS.filter((l) => l.primary);
  const secondaryLinks = SOCIAL_LINKS.filter((l) => !l.primary);

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center gap-6 py-16 px-6"
      aria-label="Social media and contact links"
      role="navigation"
    >
      {/* Label */}
      <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase font-mono">
        Find me online
      </p>

      {/* ── Primary links (GitHub + LinkedIn) — full pill with label ── */}
      <div
        ref={linksRef}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        {/* Primary row */}
        <div className="flex items-center gap-3">
          {primaryLinks.map(({ id, icon: Icon, href, label, ariaLabel }) => (
            
              key={id}
              data-social-link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              style={{ opacity: 0 }} // GSAP animates in
              className="
                flex items-center gap-2.5 px-5 py-2.5 rounded-full
                border border-white/10 bg-white/3
                text-white/50 text-sm font-medium
                transition-all duration-200
                hover:text-white hover:border-purple-500/40
                hover:bg-purple-500/8
                hover:shadow-[0_0_16px_rgba(168,85,247,0.15)]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-purple-500
              "
            >
              <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>

        {/* Divider between primary and secondary — desktop only */}
        <div
          aria-hidden="true"
          className="hidden sm:block w-px h-6 bg-white/10"
        />

        {/* Secondary row (Email + Resume) — icon only with tooltip via title */}
        <div className="flex items-center gap-2">
          {secondaryLinks.map(({ id, icon: Icon, href, label, ariaLabel }) => {
            const isMailto = href.startsWith("mailto");
            return (
              
                key={id}
                data-social-link
                href={href}
                target={isMailto ? undefined : "_blank"}
                rel={isMailto ? undefined : "noopener noreferrer"}
                aria-label={ariaLabel}
                title={label}
                style={{ opacity: 0 }} // GSAP animates in
                className="
                  flex items-center justify-center
                  w-10 h-10 rounded-full
                  border border-white/10 bg-white/3
                  text-white/40
                  transition-all duration-200
                  hover:text-white hover:border-purple-500/40
                  hover:bg-purple-500/8
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-purple-500
                "
              >
                <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Transition hint to Contact section */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-white/15 text-[10px] tracking-[0.2em] uppercase font-mono">
          or drop a message below
        </p>
        <div
          aria-hidden="true"
          className="w-px h-10 bg-gradient-to-b from-white/15 to-transparent"
        />
      </div>
    </div>
  );
});

SocialSection.displayName = "SocialSection";
export default SocialSection;