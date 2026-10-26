import { useState, useEffect } from 'react';
import { ArrowLeft, LockKeyhole, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './AuthLogin.module.css';

function AuthLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(
        err.message || 'Invalid email or password. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@portfolio.local');
    setPassword('admin123456');
    setErrorMessage('');
  };

  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/">
        <ArrowLeft size={15} /> Back to portfolio
      </Link>
      <section className={styles.panel}>
        <span className={styles.icon}>
          <LockKeyhole size={20} />
        </span>
        <p className={styles.eyebrow}>ADMINISTRATION</p>
        <h1>Sign in</h1>
        <p className={styles.copy}>
          Enter your administrator credentials to manage your portfolio CMS.
        </p>

        {errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="admin@portfolio.local"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className={styles.spinner} /> Signing in...
              </>
            ) : (
              'Sign in to Dashboard'
            )}
          </button>
        </form>

        <div className={styles.demoBox}>
          <p className={styles.demoTitle}>Default Setup Credentials</p>
          <code>admin@portfolio.local / admin123456</code>
          <button
            type="button"
            className={styles.fillBtn}
            onClick={handleFillDemo}
          >
            Fill Demo Credentials
          </button>
        </div>
      </section>
    </main>
  );
}

export default AuthLogin;