import { memo, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    id:    "github",
    icon:  Github,
    href:  "https://github.com/umeshkumar-git",
    label: "GitHub",
    color: "hover:text-white hover:border-white/40",
  },
  {
    id:    "linkedin",
    icon:  Linkedin,
    href:  "https://www.linkedin.com/in/numesh-kumar-shah/",
    label: "LinkedIn",
    color: "hover:text-blue-400 hover:border-blue-400/40",
  },
  {
    id:    "email",
    icon:  Mail,
    href:  "mailto:umesh@email.com",
    label: "Email",
    color: "hover:text-purple-400 hover:border-purple-400/40",
  },
  {
    id:    "twitter",
    icon:  Twitter,
    href:  "https://twitter.com/umeshshah",
    label: "Twitter",
    color: "hover:text-sky-400 hover:border-sky-400/40",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const SocialSection = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-social-link]",
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
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center gap-6 py-16 px-6"
      aria-label="Social media links"
    >
      {/* Label */}
      <p className="text-white/30 text-xs tracking-[0.25em] uppercase">
        Find me online
      </p>

      {/* Links */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {SOCIAL_LINKS.map(({ id, icon: Icon, href, label, color }) => (
          {/* THE FIX: Added the opening <a tag right here 👇 */}
          <a
            key={id}
            data-social-link
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            aria-label={label}
            className={[
              "flex items-center gap-2.5 px-5 py-2.5 rounded-full",
              "border border-white/10 bg-white/3",
              "text-white/40 text-sm font-medium",
              "transition-all duration-200",
              color,
            ].join(" ")}
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
      </div>

      {/* Divider line — signals transition to Contact section */}
      <div
        aria-hidden="true"
        className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mt-2"
      />
    </div>
  );
});

SocialSection.displayName = "SocialSection";

export default SocialSection;