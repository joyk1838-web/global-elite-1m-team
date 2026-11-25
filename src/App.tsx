import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

const Mission = lazy(() => import("./pages/Mission"));
const Vision = lazy(() => import("./pages/Vision"));
const Team = lazy(() => import("./pages/Team"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Admin = lazy(() => import("./pages/Admin"));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] uppercase text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
        Loading view...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mission" element={<Mission />} />
            <Route path="vision" element={<Vision />} />
            <Route path="team" element={<Team />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Navigate to="/dashboard" replace />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
