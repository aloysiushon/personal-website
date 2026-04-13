import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectsBlock } from "./ProjectsBlock";

// ============================================================
// ProjectsBlock Stories
// ============================================================

const meta: Meta<typeof ProjectsBlock> = {
  title: "Blocks/ProjectsBlock",
  component: ProjectsBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    projects: { control: "object", description: "Array of Project objects" },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectsBlock>;

const sampleProjects = [
  {
    title:       "Block Engine",
    description: "A JSON-driven UI rendering engine that converts block schemas into live React components.",
    tags:        ["TypeScript", "React", "Monorepo"],
    emoji:       "⚙️",
    liveUrl:     "https://example.com",
    repoUrl:     "https://github.com",
  },
  {
    title:       "Portfolio Builder",
    description: "A drag-and-drop personal website builder inspired by Webflow and Framer.",
    tags:        ["Next.js", "TailwindCSS", "DnD"],
    emoji:       "🎨",
    liveUrl:     "https://example.com",
  },
  {
    title:       "AI Study Planner",
    description: "AI-powered study planner that generates personalised revision schedules.",
    tags:        ["Python", "FastAPI", "OpenAI"],
    emoji:       "🤖",
    repoUrl:     "https://github.com",
  },
];

export const Default: Story = {
  args: { projects: sampleProjects },
};

export const SingleProject: Story = {
  args: {
    projects: [sampleProjects[0]],
  },
  name: "Single Project",
};

export const NoLinks: Story = {
  args: {
    projects: sampleProjects.map(({ liveUrl: _l, repoUrl: _r, ...rest }) => rest),
  },
  name: "Projects Without Links",
};

export const ManyProjects: Story = {
  args: {
    projects: [
      ...sampleProjects,
      {
        title:       "E-Commerce Store",
        description: "Full-stack e-commerce app with cart, checkout, and Stripe integration.",
        tags:        ["React", "Node.js", "Stripe"],
        emoji:       "🛒",
        liveUrl:     "https://example.com",
      },
      {
        title:       "Real-time Chat",
        description: "WebSocket-based chat application with rooms and message history.",
        tags:        ["Socket.io", "Express", "Redis"],
        emoji:       "💬",
        repoUrl:     "https://github.com",
      },
    ],
  },
  name: "Many Projects (5)",
};
