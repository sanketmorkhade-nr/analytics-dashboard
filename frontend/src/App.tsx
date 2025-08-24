import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./shared/components/layout/MainLayout";
import { lazy } from "react";
import "./App.css";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EventExplorerPage = lazy(() => import("./pages/EventExplorerPage"));

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventExplorerPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
