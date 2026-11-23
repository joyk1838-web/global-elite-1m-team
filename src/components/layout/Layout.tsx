import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence, useScroll, useSpring, MotionConfig } from "framer-motion";
import { ChatProvider } from "../../context/ChatContext";
import { ExecutiveChatModal } from "../chat/ExecutiveChatModal";

export default function Layout() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <MotionConfig reducedMotion="user">
      <ChatProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          {/* Luminous Top Scroll Progress Hairline */}
          <motion.div
            style={{ scaleX }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary to-[#f3df9b] shadow-[0_0_12px_rgba(226,190,83,0.45)] origin-left z-[60] pointer-events-none"
          />
          <Navbar />
          <main className="flex-grow pt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={
                  isHome
                    ? "w-full"
                    : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
                }
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <ExecutiveChatModal />
        </div>
      </ChatProvider>
    </MotionConfig>
  );
}
