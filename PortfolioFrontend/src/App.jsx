import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import About from './pages/About/About.jsx'
import AdminConsole from './pages/Admin/AdminConsole.jsx'
import AuthLogin from './pages/Admin/AuthLogin.jsx'
import Contact from './pages/Contact/Contact.jsx'
import Home from './pages/Home/Home.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import styles from './App.module.css'

function ProtectedRoute({ children }) {
  const { status } = useAuth()

  if (status === 'unauthenticated') return <Navigate to="/auth/login" replace />

  return (
    <>
      {status === 'unconfigured' && (
        <div className={styles.previewNotice} role="status">
          Admin preview: authentication is not connected. Do not use this interface with sensitive data.
        </div>
      )}
      {children}
    </>
  )
}

function NotFound() {
  return <main className={styles.notFound}><span>404</span><h1>This page isn’t here.</h1><a href="/">Return home</a></main>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/auth/login" element={<AuthLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminConsole view="dashboard" />} />
          <Route path="projects" element={<AdminConsole view="projects" />} />
          <Route path="experience" element={<AdminConsole view="experience" />} />
          <Route path="skills" element={<AdminConsole view="skills" />} />
          <Route path="education" element={<AdminConsole view="education" />} />
          <Route path="certifications" element={<AdminConsole view="certifications" />} />
          <Route path="achievements" element={<AdminConsole view="achievements" />} />
          <Route path="inquiries" element={<AdminConsole view="inquiries" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
