import type { PageSchema } from "@personal-website/engine";

// ============================================================
// PORTFOLIO JSON SCHEMA
// This is the single source of truth for the entire website.
// Every section is a block — nothing is hardcoded.
// ============================================================

export const portfolioSchema: PageSchema = {
  id: "portfolio",
  title: "Aloysius Hon — Full Stack Developer",
  blocks: [
    {
      id: "block-navbar",
      type: "navbar",
      layout: { x: 0, y: 0, w: 12, h: 1 },
      props: {
        name: "Aloysius",
        links: [
          { label: "About", href: "#about" },
          { label: "Skills", href: "#skills" },
          { label: "Projects", href: "#projects" },
          { label: "Contact", href: "#contact" },
        ],
      },
    },
    {
      id: "block-hero",
      type: "hero",
      layout: { x: 0, y: 1, w: 12, h: 6 },
      props: {
        name: "Aloysius Hon",
        role: "Frontend Developer & CS Student",
        tagline:
          "I build clean, fast, and scalable web experiences. Passionate about open source, developer tooling, and turning ideas into reality.",
        ctaPrimary: { label: "View My Work", href: "#projects" },
        ctaSecondary: { label: "Get In Touch", href: "#contact" },
      },
    },
    {
      id: "block-about",
      type: "about",
      layout: { x: 0, y: 7, w: 12, h: 4 },
      props: {
        bio: "I'm a Computer Science student with a deep love for building things on the web. From backend APIs to polished UIs, I enjoy the full spectrum of software development. When I'm not coding, you'll find me exploring new tech, contributing to open source, or making terrible puns.",
        highlights: [
          "Open Source Enthusiast",
          "Problem Solver",
          "Clean Code Advocate",
          "Continuous Learner",
        ],
      },
    },
    {
      id: "block-skills",
      type: "skills",
      layout: { x: 0, y: 11, w: 12, h: 4 },
      props: {
        categories: [
          {
            category: "Frontend",
            color: "violet",
            skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
          },
          {
            category: "Backend",
            color: "blue",
            skills: ["Node.js", "Express", "PostgreSQL", "Redis", "REST APIs"],
          },
          {
            category: "Tools & DevOps",
            color: "green",
            skills: ["Git", "Docker", "Vercel", "GitHub Actions", "VS Code"],
          },
          {
            category: "Languages",
            color: "pink",
            skills: ["TypeScript", "Python", "SQL", "Bash"],
          },
          {
            category: "Architecture",
            color: "gray",
            skills: ["Monorepo", "Block Engine", "Component-Driven", "API Design"],
          },
        ],
      },
    },
    {
      id: "block-projects",
      type: "projects",
      layout: { x: 0, y: 15, w: 12, h: 6 },
      props: {
        projects: [
          {
            title: "Block-Based Portfolio Engine",
            description:
              "A Webflow-inspired, schema-driven portfolio builder. Every section is a block registered in a central engine. Built with TypeScript, Next.js, and a custom render engine.",
            tags: ["Next.js", "TypeScript", "Block Engine", "Monorepo"],
            emoji: "🧱",
            liveUrl: "#",
            repoUrl: "https://github.com/alexchen/portfolio-engine",
          },
          {
            title: "DevLink — Developer Networking Platform",
            description:
              "A platform for developers to share projects, connect with teams, and discover open source opportunities. Real-time chat powered by WebSockets.",
            tags: ["React", "Node.js", "PostgreSQL", "WebSockets"],
            emoji: "🔗",
            liveUrl: "#",
            repoUrl: "https://github.com/alexchen/devlink",
          },
          {
            title: "AutoReceipt — AI Expense Tracker",
            description:
              "Snap a photo of your receipt and let AI categorize your expenses automatically. Built with OpenAI Vision API and a clean mobile-first UI.",
            tags: ["React Native", "Python", "OpenAI", "FastAPI"],
            emoji: "🧾",
            repoUrl: "https://github.com/alexchen/autoreceipt",
          },
          {
            title: "CLI Toolkit",
            description:
              "A collection of developer productivity scripts and CLI tools for automating repetitive tasks — project scaffolding, git workflows, and more.",
            tags: ["Python", "Bash", "Node.js", "Open Source"],
            emoji: "⚡",
            repoUrl: "https://github.com/alexchen/cli-toolkit",
          },
        ],
      },
    },
    {
      id: "block-contact",
      type: "contact",
      layout: { x: 0, y: 21, w: 12, h: 3 },
      props: {
        email: "alex.chen@example.com",
        github: "https://github.com/alexchen",
        linkedin: "https://linkedin.com/in/alexchen",
      },
    },
    {
      id: "block-footer",
      type: "footer",
      layout: { x: 0, y: 24, w: 12, h: 1 },
      props: {
        name: "Aloysius Hon",
        year: 2026,
      },
    },
  ],
};
