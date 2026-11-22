import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Mission from "./pages/Mission";
import Vision from "./pages/Vision";
import Team from "./pages/Team";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
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
    </Router>
  );
}
