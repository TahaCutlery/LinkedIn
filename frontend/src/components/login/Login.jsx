import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '@/config/redux/action/authAction';
import styles from './Login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth || {});
  const { isLoading, isError, message, loggedIn } = authState;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(loggedIn && token){
      router.push('/dashboard');
    }
  }, [loggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Please enter your email');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    dispatch(userLogin({ email, password }));
  };

  const getErrorMessage = () => {
    if (validationError) return validationError;
    if (isError && message) {
      if (typeof message === 'string' && !message.trim().startsWith('<')) {
        return message;
      }
      if (typeof message === 'object' && message.message) {
        return message.message;
      }
      return 'Invalid credentials or user not found. Please try again.';
    }
    return null;
  };

  const displayError = getErrorMessage();

  return (
    <div className={styles.loginContainer}>
      {/* Header Bar */}
      <header className={styles.loginHeader}>
        <Link href="/" className={styles.brandLogo} aria-label="LinkedIn Home">
          <span className={styles.brandText}>Linked</span>
          <span className={styles.brandInBox}>in</span>
        </Link>
        <div className={styles.headerNavLinks}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>New to LinkedIn?</span>
          <button 
            type="button" 
            className={styles.joinNowBtn}
            onClick={onSwitchToSignup}
          >
            Join now
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className={styles.mainContent}>
        <div className={styles.card}>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>Stay updated on your professional world</p>

          {displayError && (
            <div className={styles.errorBanner}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className={`${styles.input} ${validationError && !email ? styles.inputError : ''}`}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${styles.input} ${styles.inputHasIcon} ${validationError && !password ? styles.inputError : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
              <Link href="#forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner} />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className={styles.footerSignupPrompt}>
            New to LinkedIn?
            <button
              type="button"
              className={styles.toggleAuthBtn}
              onClick={onSwitchToSignup}
            >
              Join now
            </button>
          </p>
        </div>
      </main>

      {/* Footer Links */}
      <footer className={styles.loginFooter}>
        <Link href="#agreement" className={styles.footerLink}>User Agreement</Link>
        <Link href="#privacy" className={styles.footerLink}>Privacy Policy</Link>
        <Link href="#community" className={styles.footerLink}>Community Guidelines</Link>
        <Link href="#cookie" className={styles.footerLink}>Cookie Policy</Link>
        <Link href="#copyright" className={styles.footerLink}>Copyright Policy</Link>
        <span className={styles.copyright}>LinkedIn Corporation © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Login;
