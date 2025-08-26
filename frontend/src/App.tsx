import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";
import MainLayout from "./shared/components/layout/MainLayout";
import { lazy } from "react";
import { ThemeProvider } from "./shared/context/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/lib/queryClient";
import "./App.css";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EventExplorerPage = lazy(() => import("./pages/EventExplorerPage"));
const RetentionPage = lazy(() => import("./pages/RetentionPage"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="events" element={<EventExplorerPage />} />
                <Route path="retention" element={<RetentionPage />} />
              </Route>
            </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
