import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userRegister } from '@/config/redux/action/authAction';
import styles from './Signup.module.css';
import { useRouter } from 'next/router';

const Signup = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth || {});
  const { isLoading, isError, message } = authState;

  useEffect(() => {
    if (localStorage.getItem("token"))
    {
        router.push("/dashboard")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!username.trim()) {
      setValidationError('Please choose a username.');
      return;
    }
    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }
    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    try {
      dispatch(userRegister({ name, username, email, password }));
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
    } catch (err) {
      console.log('Registration failed:', err);
    }
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
      return 'Registration failed. Please try again with a different email or username.';
    }
    return null;
  };

  const displayError = getErrorMessage();

  return (
    <div className={styles.signupContainer}>
      {/* Header Bar */}
      <header className={styles.signupHeader}>
        <a href="/" className={styles.brandLogo} aria-label="LinkedIn Home">
          <span className={styles.brandText}>Linked</span>
          <span className={styles.brandInBox}>in</span>
        </a>
        <div className={styles.headerNavLinks}>
          <span style={{ fontSize: '0.9rem', color: '#6b6152' }}>Already on LinkedIn?</span>
          <button 
            type="button" 
            className={styles.signInBtn}
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Signup Card */}
      <main className={styles.mainContent}>
        <div className={styles.card}>
          <h1 className={styles.title}>Make the most of your professional life</h1>
          <p className={styles.subtitle}>Join millions of professionals worldwide</p>

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
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className={`${styles.input} ${validationError && !name ? styles.inputError : ''}`}
                    autoComplete="name"
                    autoFocus
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. sarahjenkins"
                    className={`${styles.input} ${validationError && !username ? styles.inputError : ''}`}
                    autoComplete="username"
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className={`${styles.input} ${validationError && !email ? styles.inputError : ''}`}
                  autoComplete="email"
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
                  placeholder="Create a strong password"
                  className={`${styles.input} ${styles.inputHasIcon} ${validationError && !password ? styles.inputError : ''}`}
                  autoComplete="new-password"
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

            <p className={styles.disclaimerText}>
              By clicking Agree & Join, you agree to the LinkedIn{' '}
              <a href="#user-agreement" className={styles.disclaimerLink}>User Agreement</a>,{' '}
              <a href="#privacy-policy" className={styles.disclaimerLink}>Privacy Policy</a>, and{' '}
              <a href="#cookie-policy" className={styles.disclaimerLink}>Cookie Policy</a>.
            </p>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner} />
              ) : (
                'Agree & Join'
              )}
            </button>
          </form>

          <p className={styles.footerLoginPrompt}>
            Already on LinkedIn?
            <button
              type="button"
              className={styles.toggleAuthBtn}
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </main>

      {/* Footer Links */}
      <footer className={styles.signupFooter}>
        <a href="#agreement" className={styles.footerLink}>User Agreement</a>
        <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
        <a href="#community" className={styles.footerLink}>Community Guidelines</a>
        <a href="#cookie" className={styles.footerLink}>Cookie Policy</a>
        <a href="#copyright" className={styles.footerLink}>Copyright Policy</a>
        <span className={styles.copyright}>LinkedIn Corporation © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Signup;