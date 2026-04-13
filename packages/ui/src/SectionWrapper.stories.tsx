import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SectionWrapper } from "./SectionWrapper";
import styles from "./SectionWrapper.stories.module.scss";

// ============================================================
// SectionWrapper Stories
// ============================================================

const meta: Meta<typeof SectionWrapper> = {
  title: "UI/SectionWrapper",
  component: SectionWrapper,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    id:        { control: "text", description: "Section ID used as anchor link" },
    className: { control: "text", description: "Extra Tailwind classes" },
  },
};

export default meta;
type Story = StoryObj<typeof SectionWrapper>;

export const Default: Story = {
  render: () => (
    <SectionWrapper id="demo-section">
      <div className={styles.demoContent}>
        <h2>Section Title</h2>
        <p>
          This is content inside the SectionWrapper. It receives consistent padding and max-width.
        </p>
      </div>
    </SectionWrapper>
  ),
};

export const WithCustomBackground: Story = {
  render: () => (
    <SectionWrapper id="custom-section">
      <div className={styles.customCard}>
        <p className={styles.label}>
          Custom className prop demonstration
        </p>
        <p className={styles.description}>
          The <code>className</code> prop is forwarded onto the{" "}
          <code>&lt;section&gt;</code> element, allowing extra
          CSS classes to be applied alongside the default styles.
        </p>
      </div>
    </SectionWrapper>
  ),
  name: "With Custom Class",
};

export const NarrowContent: Story = {
  render: () => (
    <SectionWrapper id="narrow-section">
      <div className={styles.narrowContent}>
        <h2>Narrow Content</h2>
        <p>
          SectionWrapper provides outer padding/max-width; inner layout is controlled by children.
        </p>
      </div>
    </SectionWrapper>
  ),
  name: "Narrow Content",
};
