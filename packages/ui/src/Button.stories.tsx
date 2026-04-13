import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

// ============================================================
// Button Stories
// ============================================================

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    label:   { control: "text",    description: "Button label text" },
    href:    { control: "text",    description: "If provided, renders an <a> tag" },
    variant: { control: "select",  options: ["primary", "outline", "ghost"] },
    size:    { control: "select",  options: ["sm", "md", "lg"] },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { label: "Get Started", variant: "primary", size: "md" },
};

export const Outline: Story = {
  args: { label: "View Projects", variant: "outline", size: "md" },
};

export const Ghost: Story = {
  args: { label: "Learn More", variant: "ghost", size: "md" },
};

export const Small: Story = {
  args: { label: "Small Button", variant: "primary", size: "sm" },
};

export const Large: Story = {
  args: { label: "Large Button", variant: "primary", size: "lg" },
};

export const AsLink: Story = {
  args: {
    label:   "View on GitHub",
    href:    "https://github.com",
    variant: "outline",
    size:    "md",
  },
  name: "As Link (<a>)",
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button label="Primary" variant="primary" size="md" />
      <Button label="Outline" variant="outline" size="md" />
      <Button label="Ghost"   variant="ghost"   size="md" />
    </div>
  ),
  name: "All Variants",
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button label="Small"  variant="primary" size="sm" />
      <Button label="Medium" variant="primary" size="md" />
      <Button label="Large"  variant="primary" size="lg" />
    </div>
  ),
  name: "All Sizes",
};
