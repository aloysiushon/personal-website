import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FooterBlock } from "./FooterBlock";

// ============================================================
// FooterBlock Stories
// ============================================================

const meta: Meta<typeof FooterBlock> = {
  title: "Blocks/FooterBlock",
  component: FooterBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    name: { control: "text",   description: "Author name displayed in the footer" },
    year: { control: "number", description: "Copyright year (defaults to current year)" },
  },
};

export default meta;
type Story = StoryObj<typeof FooterBlock>;

export const Default: Story = {
  args: {
    name: "John Doe",
  },
};

export const WithCustomYear: Story = {
  args: {
    name: "Jane Dev",
    year: 2025,
  },
  name: "With Custom Year",
};

export const ShortName: Story = {
  args: {
    name: "JD",
    year: 2026,
  },
  name: "Short Name",
};
