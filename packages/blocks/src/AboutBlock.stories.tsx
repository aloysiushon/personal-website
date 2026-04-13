import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AboutBlock } from "./AboutBlock";

// ============================================================
// AboutBlock Stories
// ============================================================

const meta: Meta<typeof AboutBlock> = {
  title: "Blocks/AboutBlock",
  component: AboutBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    bio:        { control: "text",   description: "Bio paragraph text" },
    highlights: { control: "object", description: "Array of highlight badge labels" },
    imageSide:  { control: "select", options: ["left", "right"], description: "Which side the decorative image appears on" },
  },
};

export default meta;
type Story = StoryObj<typeof AboutBlock>;

const bio =
  "I'm a developer who loves building clean, performant, and user-centric web applications. " +
  "With 3+ years of experience across the full stack, I focus on writing maintainable code and " +
  "collaborating closely with designers to bring great ideas to life.";

export const Default: Story = {
  args: {
    bio,
    highlights: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    imageSide:  "right",
  },
};

export const ImageLeft: Story = {
  args: {
    bio,
    highlights: ["Python", "FastAPI", "Docker", "AWS", "CI/CD"],
    imageSide:  "left",
  },
  name: "Image on Left",
};

export const MinimalHighlights: Story = {
  args: {
    bio:        "Student developer building cool stuff and learning every day.",
    highlights: ["JavaScript", "HTML/CSS"],
    imageSide:  "right",
  },
  name: "Minimal Highlights",
};
