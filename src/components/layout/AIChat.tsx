import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_PROMPTS = [
  "What is the $1M Mission?",
  "Who is MD Joy Hossen?",
  "Tell me about ELITE TEAM 07",
  "What is Elite Soft Drink?"
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { 
      role: "ai", 
      content: "Welcome to the ELITE GROUP Command Center. I am your Executive AI Strategist. MD Joy Hossen and the leadership team have chartered this channel for high-level briefings, mission milestones, and portfolio updates. How may I assist your strategic inquiry today?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener("open-ai-chat", handleOpen);
    return () => window.removeEventListener("open-ai-chat", handleOpen);
  }, []);

  const handleSendPrompt = async (textToSend?: string) => {
    const messageContent = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageContent || isLoading) return;

    if (textToSend === undefined) {
      setInput("");
    }

    const newMessages = [...messages, { role: "user" as const, content: messageContent }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.text || "Command directive acknowledged. The ELITE GROUP ecosystem is operating at peak performance.";
      setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [
        ...prev, 
        { 
          role: "ai", 
          content: "ELITE STRATEGIST: Communication uplink verified. MD Joy Hossen and ELITE TEAM 07 remain resolute on our $1K to $1M trajectory. We are building excellence through our luxury ventures and global brand network. Please feel free to ask about our Roadmap, Brands, or Leadership team." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="w-16 h-16 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] gold-glow p-0 flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Open AI Strategist Command Center"
          >
            <MessageSquare className="w-8 h-8 text-black" />
          </Button>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "72px" : "620px",
              width: "420px"
            }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden flex flex-col max-w-[calc(100vw-32px)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-primary/20 flex items-center justify-between bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 gold-glow">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-wide gold-gradient">ELITE STRATEGIST</h3>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">Official AI Command</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" 
                  onClick={() => setIsMinimized(!isMinimized)}
                  aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/60 scrollbar-thin scrollbar-thumb-primary/20"
                >
                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user" 
                        ? "bg-primary text-primary-foreground font-medium ml-4 shadow-lg" 
                        : "bg-[#161616] border border-primary/20 text-neutral-200 mr-4 shadow-md"
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                          {m.role === "user" ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-primary" />}
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {m.role === "user" ? "Commander" : "Elite Strategist"}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#161616] border border-primary/20 p-3.5 rounded-2xl flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs italic text-primary/80">Synthesizing strategic intelligence...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-2 border-t border-primary/10 bg-black/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPrompt(prompt)}
                      disabled={isLoading}
                      className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-medium disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3.5 border-t border-primary/15 bg-black/90">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendPrompt();
                    }}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Ask the AI Strategist about ELITE GROUP..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-neutral-900/80 border border-primary/25 rounded-xl py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      className={`absolute right-1 w-9 h-9 rounded-lg transition-all ${
                        input.trim() ? "gold-glow opacity-100" : "opacity-30"
                      }`}
                      aria-label="Send query"
                    >
                      <Send className="w-4 h-4 text-black" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
