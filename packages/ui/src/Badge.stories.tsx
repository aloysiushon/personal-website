import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

// ============================================================
// Badge Stories
// ============================================================

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Text displayed inside the badge" },
    color: {
      control: "select",
      options: ["violet", "blue", "green", "pink", "gray"],
      description: "Color variant of the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Violet: Story = {
  args: { label: "TypeScript", color: "violet" },
};

export const Blue: Story = {
  args: { label: "React", color: "blue" },
};

export const Green: Story = {
  args: { label: "Node.js", color: "green" },
};

export const Pink: Story = {
  args: { label: "Figma", color: "pink" },
};

export const Gray: Story = {
  args: { label: "Git", color: "gray" },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge label="TypeScript" color="violet" />
      <Badge label="React"      color="blue" />
      <Badge label="Node.js"    color="green" />
      <Badge label="Figma"      color="pink" />
      <Badge label="Git"        color="gray" />
    </div>
  ),
  name: "All Colors",
};
