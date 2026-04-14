"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ChatBot.module.scss";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

let msgCounter = 0;
function newMsg(role: Message["role"], content: string): Message {
  return { id: `msg-${Date.now()}-${msgCounter++}`, role, content };
}

const INITIAL_CONTENT =
  "👋 Hi! I'm an AI assistant for this portfolio. Ask me anything about Aloysius — his skills, projects, background, or how to get in touch!";

export interface ChatBotProps {
  /** When false the widget is completely hidden. Pass `false` when no API key is configured. Defaults to true. */
  readonly enabled?: boolean;
}

/** Inner widget — all hooks live here, never called conditionally. */
function ChatBotWidget(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([newMsg("assistant", INITIAL_CONTENT)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      setHasUnread(false);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = newMsg("user", trimmed);
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (res.ok) {
        const reply = newMsg("assistant", data.message ?? "Sorry, I couldn't generate a response.");
        setMessages((prev) => [...prev, reply]);
        if (!isOpenRef.current) setHasUnread(true);
      } else {
        const err = newMsg("assistant", `⚠️ ${data.error ?? "Something went wrong. Please try again."}`);
        setMessages((prev) => [...prev, err]);
      }
    } catch {
      const err = newMsg("assistant", "⚠️ Network error. Please check your connection and try again.");
      setMessages((prev) => [...prev, err]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([newMsg("assistant", INITIAL_CONTENT)]);
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        className={`${styles.fab} ${isOpen ? styles["fab--active"] : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Open AI chat"}
        title={isOpen ? "Close chat" : "Chat with AI"}
      >
        {isOpen ? (
          <span className={styles.fab__icon}>✕</span>
        ) : (
          <>
            <span className={styles.fab__icon}>💬</span>
            {hasUnread && <span className={styles.fab__badge} />}
          </>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <dialog open className={styles.window} aria-label="AI Chat">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.header__left}>
              <span className={styles.header__avatar} aria-hidden="true">🤖</span>
              <div>
                <p className={styles.header__name}>Portfolio AI</p>
                <p className={styles.header__status}>
                  <span className={styles.header__dot} aria-hidden="true" />
                  {" Online"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className={styles.header__clear}
              title="Clear conversation"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.role === "user" ? styles["message--user"] : styles["message--assistant"]
                }`}
              >
                {msg.role === "assistant" && (
                  <span className={styles.message__avatar} aria-hidden="true">🤖</span>
                )}
                <div className={styles.message__bubble}>
                  <p className={styles.message__text}>{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className={`${styles.message} ${styles["message--assistant"]}`}>
                <span className={styles.message__avatar} aria-hidden="true">🤖</span>
                <div className={`${styles.message__bubble} ${styles["message__bubble--typing"]}`}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about skills, projects…"
              disabled={isLoading}
              maxLength={500}
            />
            <button
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? <span className={styles.sendBtn__spinner} /> : "➤"}
            </button>
          </div>

          {/* Footer hint */}
          <p className={styles.footer}>Powered by OpenRouter · openai/gpt-oss-120b</p>
        </dialog>
      )}
    </>
  );
}

/** Renders the floating chat widget only when `enabled` is true (default).
 *  Set `enabled={false}` when no OpenRouter API key is configured.
 *  The server page reads `process.env.OPENROUTER_API_KEY` and passes the result here. */
export function ChatBot({ enabled = true }: ChatBotProps): React.ReactElement | null {
  return enabled ? <ChatBotWidget /> : null;
}
