import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";

interface ChatContextType {
  isOpen: boolean;
  pendingPrompt: string | null;
  openChat: (initialPrompt?: string) => void;
  closeChat: () => void;
  clearPendingPrompt: () => void;
}

const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  pendingPrompt: null,
  openChat: () => {},
  closeChat: () => {},
  clearPendingPrompt: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const openChat = useCallback((initialPrompt?: string) => {
    if (initialPrompt && initialPrompt.trim()) {
      setPendingPrompt(initialPrompt.trim());
    }
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{ isOpen, pendingPrompt, openChat, closeChat, clearPendingPrompt }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useExecutiveChat() {
  return useContext(ChatContext);
}
