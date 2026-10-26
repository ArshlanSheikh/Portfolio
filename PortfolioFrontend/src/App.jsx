import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import About from './pages/About/About.jsx';
import AdminConsole from './pages/Admin/AdminConsole.jsx';
import AuthLogin from './pages/Admin/AuthLogin.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Home from './pages/Home/Home.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import styles from './App.module.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="globalLoader">
        <div className="globalSpinner" />
        <p>Verifying admin session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

function NotFound() {
  return (
    <main className={styles.notFound}>
      <span>404</span>
      <h1>This page isn’t here.</h1>
      <p>The link may be broken or the page may have been removed.</p>
      <a href="/" className="button buttonPrimary">Return home</a>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Home />} />
          <Route path="/services" element={<Home />} />
          <Route path="/experience" element={<Home />} />
          <Route path="/education" element={<Home />} />
          <Route path="/certifications" element={<Home />} />
          <Route path="/blog" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Login routes */}
        <Route path="/admin/login" element={<AuthLogin />} />
        <Route path="/auth/login" element={<Navigate to="/admin/login" replace />} />

        {/* Protected Admin Console Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminConsole view="dashboard" />} />
          <Route path="dashboard" element={<AdminConsole view="dashboard" />} />
          <Route path="profile" element={<AdminConsole view="profile" />} />
          <Route path="projects" element={<AdminConsole view="projects" />} />
          <Route path="skills" element={<AdminConsole view="skills" />} />
          <Route path="experience" element={<AdminConsole view="experience" />} />
          <Route path="services" element={<AdminConsole view="services" />} />
          <Route path="education" element={<AdminConsole view="education" />} />
          <Route path="certifications" element={<AdminConsole view="certifications" />} />
          <Route path="achievements" element={<AdminConsole view="achievements" />} />
          <Route path="testimonials" element={<AdminConsole view="testimonials" />} />
          <Route path="blog" element={<AdminConsole view="blog" />} />
          <Route path="inquiries" element={<AdminConsole view="inquiries" />} />
          <Route path="media" element={<AdminConsole view="media" />} />
          <Route path="settings" element={<AdminConsole view="settings" />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
