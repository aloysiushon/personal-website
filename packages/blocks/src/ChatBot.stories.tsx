import React from "react";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
// ChatBot lives in the web app — imported via relative path so Storybook/Vite resolves it.
// eslint-disable-next-line import/no-relative-packages
import { ChatBot } from "../../../apps/web/src/components/ChatBot";

// ============================================================
// ChatBot Stories
// ============================================================
// The ChatBot calls POST /api/chat at runtime.
// Each story stubs `globalThis.fetch` via `beforeEach` so the
// widget is fully interactive inside Storybook (no server needed).
// ============================================================

type Fetch = typeof globalThis.fetch;

/** Build a stubbed fetch that resolves with a canned AI reply. */
function stubFetch(reply: string, delayMs = 800): Fetch {
  return async () => {
    await new Promise((r) => setTimeout(r, delayMs));
    return new Response(JSON.stringify({ message: reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
}

/** Build a stubbed fetch that resolves with an error body. */
function stubFetchError(errorMsg: string, status = 500, delayMs = 600): Fetch {
  return async () => {
    await new Promise((r) => setTimeout(r, delayMs));
    return new Response(JSON.stringify({ error: errorMsg }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };
}

// ── Meta ─────────────────────────────────────────────────────
const meta: Meta<typeof ChatBot> = {
  title: "Web/ChatBot",
  component: ChatBot,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Floating AI chat widget powered by OpenRouter. Pass `enabled={false}` to hide it completely when no API key is configured.",
      },
    },
  },
  argTypes: {
    enabled: {
      control: "boolean",
      description:
        "Show the widget. Controlled by the server — set to `false` when `OPENROUTER_API_KEY` is not set.",
      defaultValue: true,
    },
  },
  decorators: [
    (Story: StoryFn) => (
      <div style={{ minHeight: "100vh", background: "#030712", position: "relative" }}>
        <div
          style={{
            padding: "2rem",
            color: "#94a3b8",
            fontFamily: "system-ui, sans-serif",
            fontSize: "14px",
          }}
        >
          <p>Look at the bottom-right corner for the chat button 💬</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatBot>;

// ── Stories ───────────────────────────────────────────────────

/** Default: widget visible and functional. Fetch is stubbed. */
export const Enabled: Story = {
  name: "Enabled (has API key)",
  args: { enabled: true },
  beforeEach() {
    const original = globalThis.fetch;
    globalThis.fetch = stubFetch(
      "Aloysius is a Frontend Developer & CS Student skilled in React, Next.js, and TypeScript. He has built projects like a Block-Based Portfolio Engine and DevLink. Feel free to ask more!"
    );
    return () => { globalThis.fetch = original; };
  },
  parameters: {
    docs: {
      description: {
        story:
          "Widget is enabled with a stubbed API call. Type any message and press **Enter** to see a response.",
      },
    },
  },
};

/** No API key — widget renders nothing. */
export const Disabled: Story = {
  name: "Disabled (no API key)",
  args: { enabled: false },
  parameters: {
    docs: {
      description: {
        story:
          "When `enabled={false}` the component renders `null`. This is the default when `OPENROUTER_API_KEY` is not present in the environment.",
      },
    },
  },
};

/** Slow network — shows the typing-dots indicator. */
export const SlowResponse: Story = {
  name: "Slow Response (typing indicator)",
  args: { enabled: true },
  beforeEach() {
    const original = globalThis.fetch;
    globalThis.fetch = stubFetch(
      "Great question! Aloysius has worked on DevLink (developer networking) and AutoReceipt (AI expense tracking). Would you like details?",
      2500
    );
    return () => { globalThis.fetch = original; };
  },
  parameters: {
    docs: {
      description: {
        story: "Simulates a 2.5 s delay to showcase the animated typing indicator.",
      },
    },
  },
};

/** API returns an error (e.g., 503 no key). */
export const ApiError: Story = {
  name: "API Error (503)",
  args: { enabled: true },
  beforeEach() {
    const original = globalThis.fetch;
    globalThis.fetch = stubFetchError("Chat is not available — no API key configured.", 503);
    return () => { globalThis.fetch = original; };
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the error bubble rendered when the API returns a non-OK response.",
      },
    },
  },
};

/** Network failure — fetch throws. */
export const NetworkError: Story = {
  name: "Network Error",
  args: { enabled: true },
  beforeEach() {
    const original = globalThis.fetch;
    globalThis.fetch = async () => {
      await new Promise((r) => setTimeout(r, 500));
      throw new Error("Failed to fetch");
    };
    return () => { globalThis.fetch = original; };
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the fallback message when the network request fails entirely.",
      },
    },
  },
};
