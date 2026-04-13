import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SkillsBlock } from "./SkillsBlock";

// ============================================================
// SkillsBlock Stories
// ============================================================

const meta: Meta<typeof SkillsBlock> = {
  title: "Blocks/SkillsBlock",
  component: SkillsBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    categories: { control: "object", description: "Array of SkillCategory objects" },
  },
};

export default meta;
type Story = StoryObj<typeof SkillsBlock>;

export const Default: Story = {
  args: {
    categories: [
      { category: "Frontend",  color: "violet", icon: "🖥️", skills: ["React", "TypeScript", "Next.js", "TailwindCSS"] },
      { category: "Backend",   color: "blue",   icon: "⚙️", skills: ["Node.js", "Express", "FastAPI", "PostgreSQL"] },
      { category: "DevOps",    color: "green",  icon: "🚀", skills: ["Docker", "GitHub Actions", "Vercel", "AWS"] },
      { category: "Design",    color: "pink",   icon: "🎨", skills: ["Figma", "Storybook", "Design Systems"] },
      { category: "Tools",     color: "gray",   icon: "🛠️", skills: ["Git", "VS Code", "pnpm", "Turborepo"] },
    ],
  },
};

export const SingleCategory: Story = {
  args: {
    categories: [
      { category: "JavaScript Ecosystem", color: "violet", skills: ["JavaScript", "TypeScript", "React", "Vue", "Node.js"] },
    ],
  },
  name: "Single Category",
};

export const AllColors: Story = {
  args: {
    categories: [
      { category: "Violet Category", color: "violet", skills: ["React", "TypeScript"] },
      { category: "Blue Category",   color: "blue",   skills: ["Node.js", "Express"] },
      { category: "Green Category",  color: "green",  skills: ["Docker", "CI/CD"] },
      { category: "Pink Category",   color: "pink",   skills: ["Figma", "Design"] },
      { category: "Gray Category",   color: "gray",   skills: ["Git", "Bash"] },
    ],
  },
  name: "All Color Variants",
};
