import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';
import { reset } from '@/config/redux/reducer/authReducer';
import { BASE_URL } from '@/config';
import { getUser, getMyConnectionRequest } from '@/config/redux/action/authAction';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth || {});
  const [isAuth, setIsAuth] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const user = authState.user;
  const connectionRequests = authState.connectionRequests || [];

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuth(!!token);
    setImgError(false);
  }, [authState.loggedIn, router.pathname, user]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (isAuth && token) {
      dispatch(getUser({ token }));
      dispatch(getMyConnectionRequest({ token }));
    }
  }, [isAuth, dispatch]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setIsAuth(false);
    setShowDropdown(false);
    dispatch(reset());
    router.push('/');
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className={styles.navbarWrapper}>
      <div className={styles.navbarContainer}>
        {/* Left: Brand Logo & Search */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.brandLogo} aria-label="LinkedIn Home">
            <span className={styles.brandText}>Linked</span>
            <span className={styles.brandInBox}>in</span>
          </Link>

          {isAuth && (
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search professionals, posts..."
                className={styles.searchInput}
              />
            </div>
          )}
        </div>

        {/* Center: Navigation Items (when authenticated) */}
        {isAuth && (
          <div className={styles.centerNavItems}>
            <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.navItemActive : ''}`}>
              <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Feed</span>
            </Link>

            <Link href="/dashboard/myConnections" className={`${styles.navItem} ${isActive('/dashboard/myConnections') ? styles.navItemActive : ''}`}>
              <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>My Network</span>
            </Link>

            <Link href="/dashboard/myPosts" className={`${styles.navItem} ${isActive('/dashboard/myPosts') ? styles.navItemActive : ''}`}>
              <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>My Posts</span>
            </Link>

            <Link href="/dashboard/requests" className={`${styles.navItem} ${isActive('/dashboard/requests') ? styles.navItemActive : ''}`}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {connectionRequests.length > 0 && (
                  <span className={styles.navNotificationDot} />
                )}
              </div>
              <span>Requests</span>
            </Link>
          </div>
        )}

        {/* Right Section: Auth Avatar Dropdown / Join & Sign In */}
        <div className={styles.rightSection}>
          {isAuth ? (
            <div className={styles.profileDropdownWrapper} ref={dropdownRef}>
              <div 
                className={styles.avatarClickable}
                onClick={() => setShowDropdown(!showDropdown)}
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                {user?.profilePicture && !imgError ? (
                  <img
                    src={`${BASE_URL}/${user.profilePicture}`}
                    alt={user?.name || 'User Avatar'}
                    className={styles.userAvatarImg}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={styles.userAvatarInitial}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className={styles.userTriggerText}>
                  <span className={styles.userName}>{user?.name || 'Me'}</span>
                  <span className={styles.userRoleSub}>@{user?.username || 'member'}</span>
                </div>
                <svg 
                  className={`${styles.dropdownChevron} ${showDropdown ? styles.dropdownChevronOpen : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Redesigned Dropdown Menu */}
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    {user?.profilePicture && !imgError ? (
                      <img
                        src={`${BASE_URL}/${user.profilePicture}`}
                        alt={user?.name || 'User Avatar'}
                        className={styles.dropdownAvatarImg}
                      />
                    ) : (
                      <div className={styles.dropdownAvatarInitial}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className={styles.dropdownMeta}>
                      <span className={styles.dropdownName}>{user?.name || 'User'}</span>
                      <span className={styles.dropdownUsername}>@{user?.username || 'member'}</span>
                    </div>
                  </div>

                  <div className={styles.dropdownViewProfileWrap}>
                    <Link 
                      href="/dashboard/myProfile"
                      className={styles.viewProfileBtn}
                      onClick={() => setShowDropdown(false)}
                    >
                      View Profile
                    </Link>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <div className={styles.dropdownSectionLabel}>Account & Links</div>

                  <Link 
                    href="/dashboard" 
                    className={`${styles.dropdownItem} ${isActive('/dashboard') ? styles.dropdownItemActive : ''}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Feed Stream</span>
                  </Link>

                  <Link 
                    href="/dashboard/myConnections" 
                    className={`${styles.dropdownItem} ${isActive('/dashboard/myConnections') ? styles.dropdownItemActive : ''}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>My Connections</span>
                  </Link>

                  <Link 
                    href="/dashboard/myPosts" 
                    className={`${styles.dropdownItem} ${isActive('/dashboard/myPosts') ? styles.dropdownItemActive : ''}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>My Posts</span>
                  </Link>

                  <Link 
                    href="/dashboard/requests" 
                    className={`${styles.dropdownItem} ${isActive('/dashboard/requests') ? styles.dropdownItemActive : ''}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span>Connection Requests</span>
                    {connectionRequests.length > 0 && (
                      <span className={styles.dropdownBadge}>{connectionRequests.length}</span>
                    )}
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button 
                    type="button" 
                    className={`${styles.dropdownItem} ${styles.dropdownSignout}`} 
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span className={styles.authPromptText}>New to LinkedIn?</span>
              <Link href="/auth" className={styles.joinBtn}>
                Join now
              </Link>
              <Link href="/auth" className={styles.signInBtn}>
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
