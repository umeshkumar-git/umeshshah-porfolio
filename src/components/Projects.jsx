import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, ExternalLink, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  title: string;
  description: string;
  longDesc: string;
  tech: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  gradient: string; // card accent gradient
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// ⚠️ Replace with your real projects — be specific about impact & scale

const PROJECTS: Project[] = [
  {
    title: "3D Developer Portfolio",
    description: "Interactive 3D portfolio with custom WebGL scenes",
    longDesc:
      "Built with React Three Fiber and GSAP. Features real-time 3D rendering, scroll-driven animations, and a custom cursor system. Scored 95+ on Lighthouse.",
    tech: ["React", "Three.js", "R3F", "GSAP", "TypeScript"],
    github: "https://github.com/umeshshah/portfolio",
    live: "https://umeshshah.dev",
    featured: true,
    gradient: "from-purple-500/20 via-transparent to-transparent",
  },
  {
    title: "AI UI Generator",
    description: "Generate React component layouts from natural language",
    longDesc:
      "Integrates OpenAI API to parse user prompts and output live-rendered React components. Built a custom sandboxed renderer to safely eval generated JSX.",
    tech: ["React", "TypeScript", "OpenAI API", "Node.js"],
    github: "https://github.com/umeshshah/ai-ui-gen",
    featured: true,
    gradient: "from-blue-500/20 via-transparent to-transparent",
  },
  {
    title: "Student Management System",
    description: "Full-stack CRUD platform for academic records",
    longDesc:
      "Role-based access for admins, teachers, and students. REST API with JWT auth, MongoDB aggregation pipelines for report generation, deployed on Railway.",
    tech: ["React", "Node.js", "MongoDB", "Express", "JWT"],
    github: "https://github.com/umeshshah/student-system",
    gradient: "from-emerald-500/15 via-transparent to-transparent",
  },
  {
    title: "Real-time Chat App",
    description: "WebSocket-based messaging with rooms and presence",
    longDesc:
      "Socket.io rooms, typing indicators, and read receipts. Redis pub/sub for horizontal scaling. Handles 500+ concurrent connections in load testing.",
    tech: ["React", "Socket.io", "Redis", "Node.js"],
    github: "https://github.com/umeshshah/chat-app",
    gradient: "from-orange-500/15 via-transparent to-transparent",
  },
];

// ─── ProjectCard ──────────────────────────────────────────────────────────────

const ProjectCard = memo(({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle card tilt on mousemove
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect  = card.getBoundingClientRect();
      const xPct  = (e.clientX - rect.left) / rect.width  - 0.5;
      const yPct  = (e.clientY - rect.top)  / rect.height - 0.5;

      gsap.to(card, {
        rotateX: -yPct * 6,
        rotateY:  xPct * 6,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      data-project-card
      style={{ willChange: "transform" }}
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "border border-white/8 bg-zinc-900/60 backdrop-blur-sm",
        "hover:border-white/20 transition-colors duration-300",
        project.featured ? "md:col-span-1" : "",
      ].join(" ")}
    >
      {/* Gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    pointer-events-none`}
      />

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold
                           tracking-widest uppercase
                           bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Featured
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="relative z-10 flex flex-col gap-3 p-6 flex-1">
        {/* Index */}
        <span className="text-xs font-mono text-white/20 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-white leading-snug">
          {project.title}
        </h3>

        {/* Short desc */}
        <p className="text-white/50 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Long desc — revealed on hover */}
        <p className="text-white/35 text-xs leading-relaxed
                      max-h-0 overflow-hidden opacity-0
                      group-hover:max-h-24 group-hover:opacity-100
                      transition-all duration-500 ease-in-out">
          {project.longDesc}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium
                         bg-white/5 text-white/50 border border-white/8
                         group-hover:border-white/15 transition-colors duration-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Card footer — links */}
      <div className="relative z-10 flex items-center gap-4
                      px-6 py-4 border-t border-white/5">
        {project.github && (
          
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} GitHub repository`}
            className="flex items-center gap-1.5 text-xs text-white/40
                       hover:text-white transition-colors duration-200"
          >
            <Github size={14} />
            Code
          </a>
        )}
        {project.live && (
          
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            className="flex items-center gap-1.5 text-xs text-white/40
                       hover:text-white transition-colors duration-200"
          >
            <ExternalLink size={14} />
            Live
          </a>
        )}
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

// ─── Main Component ───────────────────────────────────────────────────────────

const Projects = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-projects-header]",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: "[data-projects-header]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-project-card]",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-project-card]", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 px-6 md:px-16 max-w-6xl mx-auto"
      aria-labelledby="projects-heading"
    >
      {/* ── Header ── */}
      <div data-projects-header className="mb-14">
        <p className="text-purple-400 text-xs font-semibold tracking-[0.2em]
                      uppercase mb-3">
          Selected Work
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2
            id="projects-heading"
            className="text-3xl md:text-5xl font-bold text-white"
          >
            Things I&apos;ve built
          </h2>
          
            href="https://github.com/umeshshah"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/40
                       hover:text-white transition-colors duration-200 group"
          >
            More on GitHub
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </a>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid md:grid-cols-2 gap-5">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
});

Projects.displayName = "Projects";

export default Projects;