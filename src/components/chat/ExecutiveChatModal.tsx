import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, RotateCcw, MessageSquare } from "lucide-react";
import { useExecutiveChat } from "../../context/ChatContext";
import { useSiteConfig } from "../../context/SiteContext";
import { ParticleSculpture } from "../motion/ParticleSculpture";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  animateReveal?: boolean;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SUGGESTED_PROMPTS = [
  "Outline the $1K to $1M scaling strategy",
  "Overview of Elite Soft Drink & Elite Funder",
  "How is ELITE TEAM 07 preparing for 2030?",
];

function renderFormattedText(raw: string) {
  const parts = raw.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-zinc-50">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part.replace(/\*\*/g, "")}</span>;
  });
}

function StreamingText({
  text,
  animate,
  onProgress,
}: {
  text: string;
  animate?: boolean;
  onProgress?: () => void;
}) {
  const [visibleLength, setVisibleLength] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) {
      setVisibleLength(text.length);
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisibleLength(text.length);
      return;
    }

    setVisibleLength(0);
    let current = 0;
    const step = Math.max(2, Math.ceil(text.length / 42));
    const timer = window.setInterval(() => {
      current = Math.min(text.length, current + step);
      setVisibleLength(current);
      onProgress?.();
      if (current >= text.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [text, animate, onProgress]);

  const rendered = text.slice(0, visibleLength);
  const isTyping = visibleLength < text.length;

  return (
    <span className="whitespace-pre-wrap">
      {renderFormattedText(rendered)}
      {isTyping && (
        <span
          className="inline-block w-[2px] h-[1em] align-middle bg-primary ml-1 animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export function ExecutiveChatModal() {
  const { isOpen, pendingPrompt, openChat, closeChat, clearPendingPrompt } = useExecutiveChat();
  const { config } = useSiteConfig();

  const initialGreeting: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content: `Welcome to ${config.companyName || "ELITE GROUP"}. Ask about our $1K to $1M trajectory, core ventures, leadership board, or 2030 expansion roadmap.`,
    animateReveal: false,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", handleKeyDown);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(timer);
    };
  }, [isOpen, closeChat]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = updatedHistory
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      const replyText =
        data?.text ||
        "Command acknowledged. ELITE GROUP operations continue toward the 2030 global milestone.";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: replyText,
          animateReveal: true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: "assistant",
          content:
            "Unable to reach the advisory endpoint right now. Please try again in a moment.",
          animateReveal: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && pendingPrompt) {
      const prompt = pendingPrompt;
      clearPendingPrompt();
      sendMessage(prompt);
    }
  }, [isOpen, pendingPrompt]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([{ ...initialGreeting, id: `welcome-${Date.now()}` }]);
    setInput("");
  };

  return (
    <>
      {/* Sleek Bottom-Right Floating Launcher (Respects 15% mobile cap & zero arrival popups) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            onClick={() => openChat()}
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            aria-label="Open Executive AI Strategist Chat"
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-[#111114]/95 backdrop-blur-xl border border-primary/40 text-zinc-100 shadow-[0_12px_40px_-10px_rgba(212,175,55,0.3)] hover:border-primary transition-colors cursor-pointer"
          >
            <span className="w-7 h-7 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
              <MessageSquare className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
              Ask Strategist
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Kinetic Executive Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeChat}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-over Panel */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="ELITE GROUP AI Strategist"
              initial={{ opacity: 0, x: 56 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 48 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative z-10 w-full max-w-md h-full bg-[#0b0b0e] border-l border-white/10 flex flex-col shadow-2xl"
            >
              {/* Header with live morphing particle orb */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#09090b]/90">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl border border-primary/30 bg-black/60 overflow-hidden shrink-0">
                    <ParticleSculpture
                      shape={isLoading ? "constellation" : "sphere"}
                      interactive={false}
                      density={140}
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading text-base font-semibold text-zinc-100 truncate">
                      Executive Strategist
                    </h2>
                    <p className="text-xs text-zinc-400 truncate">
                      {isLoading ? "Synthesizing briefing..." : `${config.companyName || "ELITE GROUP"} Advisory`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset conversation"
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={closeChat}
                    aria-label="Close chat"
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary/15 border border-primary/35 text-zinc-100 rounded-br-sm"
                            : "bg-[#121217] border border-white/10 text-zinc-200 rounded-bl-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <StreamingText
                            text={msg.content}
                            animate={msg.animateReveal}
                            onProgress={scrollToBottom}
                          />
                        ) : (
                          <span className="whitespace-pre-wrap">{msg.content}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Kinetic Equalizer Thinking Indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl rounded-bl-sm bg-[#121217] border border-primary/25">
                        <div className="flex items-center gap-1 h-4" aria-hidden="true">
                          {[0, 1, 2, 3].map((bar) => (
                            <motion.span
                              key={bar}
                              className="w-[3px] h-4 rounded-full bg-primary origin-bottom"
                              animate={{ scaleY: [0.35, 1, 0.35] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: bar * 0.13,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-zinc-400">Drafting response</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggested Quick Prompts when conversation just started */}
                {messages.length <= 1 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.35, ease: EASE_OUT_EXPO }}
                    className="pt-2 space-y-2"
                  >
                    <p className="text-xs text-zinc-500 font-medium">Suggested briefings</p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="text-left px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-primary/10 border border-white/10 hover:border-primary/35 text-xs text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={scrollEndRef} />
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-white/10 bg-[#09090b]/95"
              >
                <div className="flex items-center gap-2 rounded-xl bg-[#121217] border border-white/10 focus-within:border-primary/50 px-3.5 py-2 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about strategy, ventures, or 2030 goals..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
