import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HeroBlock } from "./HeroBlock";

// ============================================================
// HeroBlock Stories
// Two-column OS identity split:
//   Left   avatar (if provided) + giant name + scroll hint
//   Right  role pill (~/role) + blockquote tagline + CTA buttons
// A subtle vertical divider separates the columns.
// ============================================================

const meta: Meta<typeof HeroBlock> = {
  title: "Blocks/HeroBlock",
  component: HeroBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "os-dark" },
    docs: {
      description: {
        component:
          "Full-viewport hero rendered as a two-column OS identity split. " +
          "Left column: avatar (optional) + large name + scroll hint. " +
          "Right column: role pill with `~/` path prefix, blockquote-bordered tagline, and CTA buttons. " +
          "A grid overlay and ambient blobs provide depth without gimmickry.",
      },
    },
  },
  argTypes: {
    name:         { control: "text",   description: "Full name  first word plain, rest rendered in gradient" },
    role:         { control: "text",   description: "Job title shown in the ~/role pill with blinking green dot" },
    tagline:      { control: "text",   description: "Short description shown with left blockquote border (right column)" },
    ctaPrimary:   { control: "object", description: "Primary CTA button { label, href }" },
    ctaSecondary: { control: "object", description: "Secondary outline CTA { label, href }" },
    avatarUrl:    { control: "text",   description: "Optional avatar URL  renders in top-left with conic glow ring" },
  },
};

export default meta;
type Story = StoryObj<typeof HeroBlock>;

export const Default: Story = {
  args: {
    name:         "John Doe",
    role:         "Full-Stack Developer",
    tagline:      "I build fast, accessible, beautiful web experiences with clean architecture.",
    ctaPrimary:   { label: "View Projects", href: "#projects" },
    ctaSecondary: { label: "Download CV",   href: "/cv.pdf" },
  },
};

export const WithAvatar: Story = {
  name: "With Avatar",
  args: {
    name:         "Jane Dev",
    role:         "Frontend Engineer",
    tagline:      "Turning design systems into delightful interfaces  one component at a time.",
    ctaPrimary:   { label: "See My Work",  href: "#projects" },
    ctaSecondary: { label: "Contact Me",   href: "#contact" },
    avatarUrl:    "https://i.pravatar.cc/200",
  },
};

export const StudentPortfolio: Story = {
  name: "Student Portfolio",
  args: {
    name:         "Alex Tan",
    role:         "Computer Science Student",
    tagline:      "Passionate about AI, open source and clean code. Building in public.",
    ctaPrimary:   { label: "My Projects",  href: "#projects" },
    ctaSecondary: { label: "Get in Touch", href: "#contact" },
  },
};

export const LongNameWithAvatar: Story = {
  name: "Long Name + Avatar",
  args: {
    name:         "Aloysius Hon Yong Lin",
    role:         "Full-Stack Developer & CS Student",
    tagline:      "Building developer tools and portfolio systems with a block-based engine.",
    ctaPrimary:   { label: "View Work",    href: "#projects" },
    ctaSecondary: { label: "Contact",      href: "#contact" },
    avatarUrl:    "https://i.pravatar.cc/200?img=3",
  },
};
