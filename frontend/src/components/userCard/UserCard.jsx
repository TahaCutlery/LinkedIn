import React, { useEffect, useState } from 'react';
import styles from "@/styles/Dashboard.module.css";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getMyConnectionRequest } from '@/config/redux/action/authAction';

const UserCard = () => {
    const { user, profile, connectionRequests = [], connections = [] } = useSelector((state) => state.auth || {});
    const dispatch = useDispatch();
    const router = useRouter();
    const [avatarError, setAvatarError] = useState(false);

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (token) {
            dispatch(getUser({ token }));
            dispatch(getMyConnectionRequest({ token }));
        }
    }, [dispatch]);

    const activePath = router.pathname;

    return (
        <aside className={styles.profileCard + ' ' + styles.glassCard}>
            {/* Golden Cover Header Banner */}
            <div className={styles.profileCardBanner}>
                <div className={styles.bannerBadge}>Pro</div>
            </div>

            {/* Avatar & Online Badge */}
            <div className={styles.profileCardAvatarWrapper}>
                <Link href="/dashboard/myProfile">
                    {user?.profilePicture && !avatarError ? (
                        <img
                            src={`${BASE_URL}/${user.profilePicture}`}
                            alt={user?.name || 'Profile Picture'}
                            className={styles.profileCardAvatarImg}
                            onError={() => setAvatarError(true)}
                        />
                    ) : (
                        <div className={styles.profileCardAvatarInitial}>
                            {getInitial(user?.name)}
                        </div>
                    )}
                </Link>
                <span className={styles.onlineBadge} title="Active now" />
            </div>

            {/* Profile Info */}
            <div className={styles.profileCardInfo}>
                <Link href="/dashboard/myProfile" className={styles.profileCardNameLink}>
                    <h3 className={styles.profileCardName}>{user?.name || 'User Name'}</h3>
                </Link>
                <span className={styles.profileCardHandle}>@{user?.username || 'member'}</span>
                {profile?.current_post ? (
                    <span className={styles.profileCardRole}>{profile.current_post}</span>
                ) : (
                    <p className={styles.profileCardBio}>
                        {profile?.bio || 'Professional building career connections on LinkedIn.'}
                    </p>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className={styles.profileCardStats}>
                <Link href="/dashboard/myConnections" className={styles.statBox}>
                    <span className={styles.statCount}>{connections?.length || 0}</span>
                    <span className={styles.statTitle}>Connections</span>
                </Link>
                <div className={styles.statDivider} />
                <Link href="/dashboard/requests" className={styles.statBox}>
                    <span className={styles.statCount}>{connectionRequests?.length || 0}</span>
                    <span className={styles.statTitle}>Requests</span>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className={styles.profileCardNav}>
                <Link
                    href="/dashboard/myProfile"
                    className={`${styles.cardNavLink} ${activePath === '/dashboard/myProfile' ? styles.cardNavLinkActive : ''}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>My Profile</span>
                </Link>

                <Link
                    href="/dashboard/myConnections"
                    className={`${styles.cardNavLink} ${activePath === '/dashboard/myConnections' ? styles.cardNavLinkActive : ''}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>My Connections</span>
                </Link>

                <Link
                    href="/dashboard/myPosts"
                    className={`${styles.cardNavLink} ${activePath === '/dashboard/myPosts' ? styles.cardNavLinkActive : ''}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>My Posts</span>
                </Link>

                <Link
                    href="/dashboard/requests"
                    className={`${styles.cardNavLink} ${activePath === '/dashboard/requests' ? styles.cardNavLinkActive : ''}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span>Requests</span>
                    <span className={styles.navCountBadge}>{connectionRequests?.length || 0}</span>
                </Link>
            </nav>
        </aside>
    );
};

export default UserCard;