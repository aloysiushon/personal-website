import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HeroBlock } from "./HeroBlock";

// ============================================================
// HeroBlock Stories
// ============================================================

const meta: Meta<typeof HeroBlock> = {
  title: "Blocks/HeroBlock",
  component: HeroBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    name:         { control: "text", description: "Your full name" },
    role:         { control: "text", description: "Job title / role" },
    tagline:      { control: "text", description: "Short tagline describing you" },
    ctaPrimary:   { control: "object", description: "Primary CTA button {label, href}" },
    ctaSecondary: { control: "object", description: "Secondary CTA button {label, href}" },
    avatarUrl:    { control: "text",   description: "Optional avatar image URL" },
  },
};

export default meta;
type Story = StoryObj<typeof HeroBlock>;

export const Default: Story = {
  args: {
    name:         "John Doe",
    role:         "Full-Stack Developer",
    tagline:      "I build fast, accessible, beautiful web experiences.",
    ctaPrimary:   { label: "View Projects", href: "#projects" },
    ctaSecondary: { label: "Download CV",   href: "/cv.pdf" },
  },
};

export const WithAvatar: Story = {
  args: {
    name:         "Jane Dev",
    role:         "Frontend Engineer",
    tagline:      "Turning design systems into delightful interfaces.",
    ctaPrimary:   { label: "See My Work",  href: "#projects" },
    ctaSecondary: { label: "Contact Me",   href: "#contact" },
    avatarUrl:    "https://i.pravatar.cc/200",
  },
  name: "With Avatar",
};

export const StudentPortfolio: Story = {
  args: {
    name:         "Alex Tan",
    role:         "Computer Science Student",
    tagline:      "Passionate about AI, open source & clean code.",
    ctaPrimary:   { label: "My Projects",  href: "#projects" },
    ctaSecondary: { label: "Get in Touch", href: "#contact" },
  },
  name: "Student Portfolio",
};
