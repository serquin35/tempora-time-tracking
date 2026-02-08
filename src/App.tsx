import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { TimeTrackingProvider } from "@/hooks/use-time-tracking"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/layout/Layout"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Toaster } from "sonner"

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
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"))
const Help = lazy(() => import("@/pages/Help"))
const HelpCategory = lazy(() => import("@/pages/HelpCategory"))
const HelpArticle = lazy(() => import("@/pages/HelpArticle"))
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword"))

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
    // Si no hay usuario pero estamos en un flujo de recuperación, 
    // no redirigimos para que el AuthListener en App.tsx pueda actuar
    if (window.location.hash.includes('type=recovery')) {
      return <LoadingFallback />
    }
    return <Navigate to="/login" />
  }

  return (
    <TimeTrackingProvider>
      <Layout>{children}</Layout>
    </TimeTrackingProvider>
  )
}

function AuthListener() {
  const navigate = useNavigate()

  useEffect(() => {
    // Escuchar eventos de recuperación de contraseña de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && window.location.pathname !== '/update-password') {
        navigate('/update-password', { replace: true })
      }
    })

    // Caso de borde: Si entramos con el hash pero el evento no se dispara a tiempo
    if (window.location.hash.includes('type=recovery') && window.location.pathname !== '/update-password') {
      navigate('/update-password', { replace: true })
    }

    return () => subscription.unsubscribe()
  }, [navigate])

  return null
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <AuthListener />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* ... routes ... */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
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
              <Route path="/team" element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="/help" element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } />
              <Route path="/help/:category" element={
                <ProtectedRoute>
                  <HelpCategory />
                </ProtectedRoute>
              } />
              <Route path="/help/:category/:articleId" element={
                <ProtectedRoute>
                  <HelpArticle />
                </ProtectedRoute>
              } />
              {/* Public Demo Route */}
              <Route path="/demo" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-right" expand={true} richColors />
      </AuthProvider>
    </ThemeProvider>
  )
}
