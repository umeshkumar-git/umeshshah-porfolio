import { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
// ⚠️  Update these with your real current work — specificity = credibility

interface NowItem {
  emoji: string;
  title: string;
  description: string;
  link?: { label: string; href: string };
}

const NOW_ITEMS: NowItem[] = [
  {
    emoji: "🚀",
    title: "Building in public",
    description:
      "Developing a SaaS dashboard with React, TypeScript, and Supabase — focusing on real-time data and role-based access control.",
    link: { label: "View repo", href: "https://github.com/umeshshah" },
  },
  {
    emoji: "🤖",
    title: "AI-powered UI experiments",
    description:
      "Integrating OpenAI's API into a React component library to generate dynamic UI layouts from natural language prompts.",
  },
  {
    emoji: "📐",
    title: "Deepening system design",
    description:
      "Working through distributed systems patterns — currently studying event-driven architecture and message queues (Kafka, RabbitMQ).",
  },
  {
    emoji: "🎯",
    title: "Open to opportunities",
    description:
      "Actively looking for frontend / full-stack roles where I can ship fast and work on products people love.",
    link: { label: "Let's talk", href: "#contact" },
  },
];

// ─── Sub-component ────────────────────────────────────────────────────────────

const NowCard = memo(({ item, index }: { item: NowItem; index: number }) => (
  <div
    data-now-card
    className="group relative flex gap-4 p-5 rounded-2xl
               border border-white/8 bg-white/3
               hover:border-purple-500/30 hover:bg-white/5
               transition-all duration-300"
    style={{ willChange: "opacity, transform" }}
  >
    {/* Index line — left accent */}
    <div
      className="absolute left-0 top-4 bottom-4 w-px
                 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />

    {/* Emoji */}
    <span
      className="text-2xl leading-none mt-0.5 select-none"
      aria-hidden="true"
    >
      {item.emoji}
    </span>

    {/* Content */}
    <div className="flex flex-col gap-1.5">
      <h3 className="text-white font-semibold text-base leading-snug">
        {item.title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed">
        {item.description}
      </p>
      {item.link && (
        
          href={item.link.href}
          target={item.link.href.startsWith("http") ? "_blank" : undefined}
          rel={
            item.link.href.startsWith("http")
              ? "noopener noreferrer"
              : undefined
          }
          className="inline-flex items-center gap-1 text-purple-400
                     text-xs font-medium mt-1 w-fit
                     hover:text-purple-300 transition-colors duration-200
                     underline underline-offset-4 decoration-purple-400/40"
        >
          {item.link.label}
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>

    {/* Card number — subtle */}
    <span
      className="absolute top-4 right-4 text-xs text-white/10
                 font-mono select-none"
      aria-hidden="true"
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  </div>
));

NowCard.displayName = "NowCard";

// ─── Main Component ───────────────────────────────────────────────────────────

const Now = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(
        "[data-now-header]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-now-header]",
            start: "top 85%",
          },
        }
      );

      // Cards stagger
      gsap.fromTo(
        "[data-now-card]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-now-card]",
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
      id="now"
      className="py-24 px-6 md:px-16 max-w-3xl mx-auto"
      aria-labelledby="now-heading"
    >
      {/* ── Header ── */}
      <div data-now-header className="mb-12">
        <p className="text-purple-400 text-xs font-semibold tracking-[0.2em]
                      uppercase mb-3">
          Currently
        </p>
        <h2
          id="now-heading"
          className="text-3xl md:text-4xl font-bold text-white"
        >
          What I&apos;m doing now
        </h2>
        <p className="text-white/40 text-sm mt-3">
          Updated{" "}
          <time dateTime="2025-01">January 2025</time>
          {" "}· inspired by{" "}
          
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 underline underline-offset-4
                       hover:text-white/70 transition-colors"
          >
            nownownow.com
          </a>
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="flex flex-col gap-4">
        {NOW_ITEMS.map((item, i) => (
          <NowCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
});

Now.displayName = "Now";

export default Now;