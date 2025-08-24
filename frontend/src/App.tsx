import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./shared/components/layout/MainLayout";
import { lazy } from "react";
import { ThemeProvider } from "./shared/context/ThemeProvider";
import "./App.css";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EventExplorerPage = lazy(() => import("./pages/EventExplorerPage"));

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventExplorerPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
