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

// Shared rich dataset (7 categories → carousel navigation clearly visible)
const manyCategories = [
  { category: "Frontend",        color: "violet" as const, icon: "🖥️", skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "SCSS"] },
  { category: "Backend",         color: "blue"   as const, icon: "⚙️", skills: ["Node.js", "Express", "FastAPI", "PostgreSQL", "Redis"] },
  { category: "DevOps",          color: "green"  as const, icon: "🚀", skills: ["Docker", "GitHub Actions", "Vercel", "AWS", "Terraform"] },
  { category: "Design",          color: "pink"   as const, icon: "🎨", skills: ["Figma", "Storybook", "Design Systems", "Framer"] },
  { category: "Testing",         color: "gray"   as const, icon: "🧪", skills: ["Jest", "Playwright", "Testing Library", "Vitest"] },
  { category: "Mobile",          color: "blue"   as const, icon: "📱", skills: ["React Native", "Expo", "Swift (basics)"] },
  { category: "Tools",           color: "gray"   as const, icon: "🛠️", skills: ["Git", "VS Code", "pnpm", "Turborepo", "Linear"] },
];

/** Default — 7 categories so the carousel nav buttons are active on both desktop (shows 3) and mobile (shows 1). */
export const Default: Story = {
  args: { categories: manyCategories },
};

/** Desktop viewport — 3 cards visible at once, navigate with arrows or dots. */
export const Desktop: Story = {
  args: { categories: manyCategories },
  parameters: {
    viewport: { defaultViewport: "desktop" },
    chromatic: { viewports: [1280] },
  },
  name: "Desktop (3 visible)",
};

/** Mobile viewport — 1 card visible at once, swipe through with arrows. */
export const Mobile: Story = {
  args: { categories: manyCategories },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: { viewports: [375] },
  },
  name: "Mobile (1 visible)",
};

/** Single category — only one card, nav buttons should be disabled / hidden. */
export const SingleCategory: Story = {
  args: {
    categories: [
      { category: "JavaScript Ecosystem", color: "violet" as const, skills: ["JavaScript", "TypeScript", "React", "Vue", "Node.js"] },
    ],
  },
  name: "Single Category (no nav)",
};

/** All five colour variants visible at once. */
export const AllColors: Story = {
  args: {
    categories: [
      { category: "Violet", color: "violet" as const, skills: ["React", "TypeScript"] },
      { category: "Blue",   color: "blue"   as const, skills: ["Node.js", "Express"] },
      { category: "Green",  color: "green"  as const, skills: ["Docker", "CI/CD"] },
      { category: "Pink",   color: "pink"   as const, skills: ["Figma", "Design"] },
      { category: "Gray",   color: "gray"   as const, skills: ["Git", "Bash"] },
    ],
  },
  name: "All Color Variants",
};
