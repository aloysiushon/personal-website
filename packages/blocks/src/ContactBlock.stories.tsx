import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContactBlock } from "./ContactBlock";

// ============================================================
// ContactBlock Stories
// ============================================================

const meta: Meta<typeof ContactBlock> = {
  title: "Blocks/ContactBlock",
  component: ContactBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    email:    { control: "text", description: "Email address" },
    github:   { control: "text", description: "GitHub profile URL (optional)" },
    linkedin: { control: "text", description: "LinkedIn profile URL (optional)" },
    twitter:  { control: "text", description: "Twitter/X profile URL (optional)" },
  },
};

export default meta;
type Story = StoryObj<typeof ContactBlock>;

export const Default: Story = {
  args: {
    email:    "john.doe@example.com",
    github:   "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter:  "https://twitter.com/johndoe",
  },
};

export const EmailOnly: Story = {
  args: {
    email: "hello@example.com",
  },
  name: "Email Only",
};

export const EmailAndGitHub: Story = {
  args: {
    email:  "dev@example.com",
    github: "https://github.com/devuser",
  },
  name: "Email + GitHub",
};

export const AllSocialLinks: Story = {
  args: {
    email:    "fullstack@example.com",
    github:   "https://github.com/fullstack",
    linkedin: "https://linkedin.com/in/fullstack",
    twitter:  "https://twitter.com/fullstack",
  },
  name: "All Social Links",
};
