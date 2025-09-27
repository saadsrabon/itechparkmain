import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { HeroPage } from './pages/HeroPage.tsx'
import { ServicesPage } from './pages/ServicesPage.tsx'
import { TeamPage } from './pages/TeamPage.tsx'
import { BlogPage } from './pages/BlogPage.tsx'
import { ContactPage } from './pages/ContactPage.tsx'
import { SuccessPage } from './pages/SuccessPage.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import './theme.css'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { ToastProvider } from './components/ToastProvider'
import Login from './pages/Login'
import { useState } from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="brand">
          Itech Admin
          {!collapsed && <div><small className="muted">Admin Panel</small></div>}
        </div>
        <nav style={{ display: 'grid', gap: 4 }}>
          <NavLink to="/hero" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="Hero Section">
            <span className="nav-icon">🏠</span>
            {!collapsed && <span>Hero</span>}
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="Services">
            <span className="nav-icon">⚙️</span>
            {!collapsed && <span>Services</span>}
          </NavLink>
          <NavLink to="/team" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="Team Members">
            <span className="nav-icon">👥</span>
            {!collapsed && <span>Team</span>}
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="Blog Posts">
            <span className="nav-icon">📝</span>
            {!collapsed && <span>Blogs</span>}
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="Contact Messages">
            <span className="nav-icon">📧</span>
            {!collapsed && <span>Contacts</span>}
          </NavLink>
          <NavLink to="/success" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="Success Stories">
            <span className="nav-icon">⭐</span>
            {!collapsed && <span>Success</span>}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `navlink${isActive ? ' active' : ''}`} title="About Us">
            <span className="nav-icon">ℹ️</span>
            {!collapsed && <span>About</span>}
          </NavLink>
        </nav>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="header">
          <div className="header-title">
            <button className="icon-btn" onClick={() => setCollapsed((v) => !v)}>{collapsed ? '☰' : '☷'}</button>
            <h3 style={{ margin: 0 }}>Dashboard</h3>
            {!collapsed && <span className="muted">Welcome, {user?.name}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="muted">{user?.name} ({user?.role})</div>
            <button onClick={logout} className="icon-btn">Logout</button>
          </div>
        </header>
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
        <footer style={{ 
          borderTop: '1px solid var(--border)', 
          padding: '16px 24px', 
          background: 'var(--panel)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: 'var(--muted)'
        }}>
          <div>
            Itech Park Admin Dashboard
          </div>
          <div>
            Developed by{' '}
            <a 
              href="https://www.facebook.com/saadsrabon/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#0ea5e9', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              SaadSrabon
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Navigate to="/hero" replace />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hero"
        element={
          <ProtectedRoute>
            <Layout>
              <HeroPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Layout>
              <ServicesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Layout>
              <TeamPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <Layout>
              <BlogPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <Layout>
              <ContactPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Layout>
              <SuccessPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <Layout>
              <AboutPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
