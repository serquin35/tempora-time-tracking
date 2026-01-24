import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/layout/Layout"
import { Loader2 } from "lucide-react"

// Lazy Loading Pages
const Login = lazy(() => import("@/pages/Login"))
const Register = lazy(() => import("@/pages/Register"))
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const History = lazy(() => import("@/pages/History"))
const Profile = lazy(() => import("@/pages/Profile"))
const Reports = lazy(() => import("@/pages/Reports"))
const Projects = lazy(() => import("@/pages/Projects"))
const Team = lazy(() => import("@/pages/Team"))
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"))
const FocusMode = lazy(() => import("@/pages/FocusMode"))
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"))

function LoadingFallback() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background text-foreground">
      <div className="relative">
        <div className="h-16 w-16 bg-lime-400 rounded-2xl flex items-center justify-center animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
        <div className="absolute inset-0 bg-lime-400/20 rounded-2xl blur-xl animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold animate-pulse">tempora</p>
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingFallback />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              } />
              <Route path="/focus" element={
                <ProtectedRoute>
                  <FocusMode />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              } />
              {/* Public Demo Route */}
              <Route path="/demo" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
