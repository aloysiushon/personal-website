import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavbarBlock } from "./NavbarBlock";

// ============================================================
// NavbarBlock Stories
// ============================================================

const meta: Meta<typeof NavbarBlock> = {
  title: "Blocks/NavbarBlock",
  component: NavbarBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    name:  { control: "text", description: "Brand name displayed in the navbar" },
    links: { control: "object", description: "Array of navigation links" },
  },
};

export default meta;
type Story = StoryObj<typeof NavbarBlock>;

const defaultLinks = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills" },
  { label: "Contact",  href: "#contact" },
];

export const Default: Story = {
  args: {
    name:  "John Doe",
    links: defaultLinks,
  },
};

export const ShortName: Story = {
  args: {
    name:  "JD",
    links: defaultLinks,
  },
  name: "Short Brand Name",
};

export const MinimalLinks: Story = {
  args: {
    name:  "Jane Dev",
    links: [
      { label: "Work",    href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
  },
  name: "Minimal Links",
};

export const ManyLinks: Story = {
  args: {
    name:  "Portfolio",
    links: [
      { label: "Home",       href: "#hero" },
      { label: "About",      href: "#about" },
      { label: "Experience", href: "#experience" },
      { label: "Projects",   href: "#projects" },
      { label: "Skills",     href: "#skills" },
      { label: "Blog",       href: "#blog" },
      { label: "Contact",    href: "#contact" },
    ],
  },
  name: "Many Links",
};
