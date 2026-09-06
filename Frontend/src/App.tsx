import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StudentProvider } from "./contexts/StudentContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HavenLandingPage } from "./pages/HavenLandingPage";
import { OriginalLandingPage } from "./pages/OriginalLandingPage";
import { AuthoritySelection } from "./pages/AuthoritySelection";
import { AuthorityPlaceholderDashboard } from "./pages/AuthorityPlaceholderDashboard";
import { AdminLogin } from "./pages/AdminLogin";
import { PersonalCare } from "./pages/PersonalCare";
import { Resources } from "./pages/Resources";
import { SelfCare } from "./pages/SelfCare";
import { Compensation } from "./pages/Compensation";
import { BookSession } from "./pages/BookSession";
import { ScreeningTests } from "./pages/ScreeningTests";
import { Results } from "./pages/Results";
import { StudentRequests } from "./pages/StudentRequests";
import { Alerts } from "./pages/Alerts";
import { Journal } from "./pages/Journal";
import { Community } from "./components/Community";
import NotFound from "./pages/NotFound";

// Lazy load AdminDashboard to prevent it from breaking the entire app
const AdminDashboard = lazy(() => {
  console.log('🔄 Attempting to load AdminDashboard...');
  return import("./pages/AdminDashboard")
    .then(module => {
      console.log('✅ AdminDashboard module loaded:', module);
      if (!module.AdminDashboard) {
        console.error('❌ AdminDashboard export not found. Available exports:', Object.keys(module));
        throw new Error(`AdminDashboard export not found. Available exports: ${Object.keys(module).join(', ')}`);
      }
      console.log('✅ AdminDashboard component found');
      return {
        default: module.AdminDashboard
      };
    })
    .catch(err => {
      console.error('❌ Failed to load AdminDashboard:', err);
      console.error('Error name:', err?.name);
      console.error('Error message:', err?.message);
      console.error('Error stack:', err?.stack);
      // Return a component that shows the actual error for debugging
      const errorMessage = err?.message || 'Unknown error';
      const errorName = err?.name || 'Error';
      return {
        default: () => (
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-2xl font-bold text-red-500">Error loading dashboard</h1>
              <p className="text-muted-foreground">Please check the browser console for details.</p>
              <div className="text-sm text-left font-mono bg-gray-800 p-4 rounded space-y-2">
                <p className="text-red-400"><strong>Error:</strong> {errorName}</p>
                <p className="text-yellow-400"><strong>Message:</strong> {errorMessage}</p>
                {err?.stack && (
                  <details className="text-xs text-gray-400 mt-2">
                    <summary className="cursor-pointer">Stack trace</summary>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-64 mt-2">
                      {err.stack}
                    </pre>
                  </details>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      };
    });
});

const AdminDashboardView = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  }>
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  </Suspense>
);

const queryClient = new QueryClient();

const App = () => {
  console.log('🟢 App component rendering...');
  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <StudentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HavenLandingPage />} />
              <Route path="/mindcare" element={<OriginalLandingPage />} />
              {/* Temporary auth bypass: login links open dashboards directly. */}
              <Route path="/student-login" element={<Navigate to="/student-dashboard" replace />} />
              <Route path="/authority-selection" element={<AuthoritySelection />} />
              <Route path="/admin-login" element={<Navigate to="/authority-selection" replace />} />
              <Route path="/admin-login/:authorityRole" element={<AdminLogin />} />
              <Route path="/dashboard/counsellor" element={<AdminDashboardView />} />
              <Route path="/dashboard/district" element={<AuthorityPlaceholderDashboard role="district" />} />
              <Route path="/dashboard/state" element={<AuthorityPlaceholderDashboard role="state" />} />
              <Route path="/dashboard/national" element={<AuthorityPlaceholderDashboard role="national" />} />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute>
                    <PersonalCare />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard/self-care"
                element={
                  <ProtectedRoute>
                    <SelfCare />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard/journal"
                element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard/compensation"
                element={
                  <ProtectedRoute>
                    <Compensation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard/booking"
                element={
                  <ProtectedRoute>
                    <BookSession />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading Admin Dashboard...</p>
                      </div>
                    </div>
                  }>
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route path="/admin-dashboard/resources" element={<Resources />} />
              <Route path="/admin-dashboard/results" element={<Results />} />
              <Route path="/admin-dashboard/requests" element={<StudentRequests />} />
              <Route
                path="/admin-dashboard/community"
                element={
                  <ProtectedRoute>
                    <Community onToggle={() => window.history.back()} />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StudentProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
