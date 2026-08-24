import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import { getAllUsersProfile, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction'
import UserCard from '@/components/userCard/UserCard'
import UserLayout from '@/layout/UserLayout'
import { BASE_URL } from '@/config'
import styles from '@/styles/Dashboard.module.css'

const Connections = () => {
    const dispatch = useDispatch();
    const { user, connectionRequests = [], allUsersProfile = {}, profileFetched } = useSelector((state) => state.auth || {});
    const [sendingRequestId, setSendingRequestId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(getMyConnectionRequest({ token }));
        dispatch(getAllUsersProfile());
    }, []);

    const profiles = allUsersProfile.profiles || [];
    const acceptedConnections = connectionRequests.filter((connection) => connection.status_accepted === true);
    const otherRequests = connectionRequests.filter((connection) => connection.status_accepted !== true);
    const requestedUserIds = new Set(connectionRequests.map((connection) => connection.connection_id?._id));
    const suggestions = profiles.filter((profile) => {
        const profileUserId = profile.user_id?._id;
        return profileUserId && profileUserId !== user?._id && !requestedUserIds.has(profileUserId);
    });

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

    const handleSendRequest = async (userId) => {
        setSendingRequestId(userId);
        const token = localStorage.getItem("token");
        const result = await dispatch(sendConnectionRequest({ user_id: userId, token }));
        if (sendConnectionRequest.fulfilled.match(result)) {
            dispatch(getMyConnectionRequest({ token }));
        }
        setSendingRequestId(null);
    };

    const renderAvatar = (connectionUser, className) => connectionUser?.profilePicture ? (
        <img
            src={`${BASE_URL}/${connectionUser.profilePicture}`}
            alt={connectionUser.name || 'User'}
            className={className}
        />
    ) : (
        <div className={styles.connectionAvatarInitial}>{getInitial(connectionUser?.name)}</div>
    );

    const renderConnectionCard = (connection) => {
        const connectionUser = connection.connection_id;
        return (
            <article className={styles.connectionCard} key={connection._id}>
                {renderAvatar(connectionUser, styles.connectionAvatar)}
                <div className={styles.connectionDetails}>
                    <h3>{connectionUser?.name || 'Professional Member'}</h3>
                    <p>@{connectionUser?.username || 'member'}</p>
                    <span>{connectionUser?.email || 'LinkedIn member'}</span>
                </div>
                <span className={styles.connectionStatus}>
                    {connection.status_accepted === true ? 'Connected' : 'Pending'}
                </span>
            </article>
        );
    };


    return (
        <UserLayout>
            <Head>
                <title>My Connections | LinkedIn</title>
                <meta
                    name="description"
                    content="Manage your professional connections, explore recommended members, and expand your career network on LinkedIn."
                />
            </Head>
            <div className={styles.dashboardBg}>
                <div className={styles.container}>
                    {(!profileFetched && connectionRequests.length === 0 && profiles.length === 0) ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner} />
                            <p className={styles.loadingText}>Loading your Connections...</p>
                        </div>
                    ) : (
                        <div className={styles.connectionsLayout}>
                            <UserCard />
                            <main className={styles.connectionsMain}>
                                <header className={styles.connectionsHero}>
                                    <div>
                                        <span className={styles.eyebrow}>Your network</span>
                                        <h1>Connections</h1>
                                        <p>Keep up with the people shaping your professional world.</p>
                                    </div>
                                    <div className={styles.connectionCount}>
                                        <strong>{acceptedConnections.length}</strong>
                                        <span>accepted</span>
                                    </div>
                                </header>

                                <section className={styles.connectionSection}>
                                    <div className={styles.sectionHeading}>
                                        <div>
                                            <span className={styles.sectionKicker}>Your network</span>
                                            <h2>Accepted connections</h2>
                                        </div>
                                        <span className={styles.sectionCount}>{acceptedConnections.length}</span>
                                    </div>
                                    <div className={styles.connectionList}>
                                        {acceptedConnections.length > 0 ? acceptedConnections.map(renderConnectionCard) : (
                                            <p className={styles.emptyConnections}>Accepted connections will appear here.</p>
                                        )}
                                    </div>
                                </section>

                                <section className={styles.connectionSection}>
                                    <div className={styles.sectionHeading}>
                                        <div>
                                            <span className={styles.sectionKicker}>In progress</span>
                                            <h2>Connection requests</h2>
                                        </div>
                                        <span className={styles.sectionCount}>{otherRequests.length}</span>
                                    </div>
                                    <div className={styles.connectionList}>
                                        {otherRequests.length > 0 ? otherRequests.map(renderConnectionCard) : (
                                            <p className={styles.emptyConnections}>No open connection requests.</p>
                                        )}
                                    </div>
                                </section>

                                <section className={styles.connectionSection}>
                                    <div className={styles.sectionHeading}>
                                        <div>
                                            <span className={styles.sectionKicker}>Discover people</span>
                                            <h2>People you may know</h2>
                                        </div>
                                        <span className={styles.sectionCount}>{suggestions.length}</span>
                                    </div>
                                    <div className={styles.suggestionGrid}>
                                        {suggestions.length > 0 ? suggestions.map((profile) => {
                                            const suggestedUser = profile.user_id;
                                            return (
                                                <article className={styles.suggestionCard} key={suggestedUser._id}>
                                                    {renderAvatar(suggestedUser, styles.suggestionAvatar)}
                                                    <div className={styles.suggestionDetails}>
                                                        <h3>{suggestedUser.name || 'Professional Member'}</h3>
                                                        <p>@{suggestedUser.username || 'member'}</p>
                                                        <span>{profile.past_work?.[0]?.position || 'Open to connecting'}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className={styles.connectionAction}
                                                        disabled={sendingRequestId === suggestedUser._id}
                                                        onClick={() => handleSendRequest(suggestedUser._id)}
                                                    >
                                                        {sendingRequestId === suggestedUser._id ? 'Sending...' : '+ Connect'}
                                                    </button>
                                                </article>
                                            );
                                        }) : (
                                            <p className={styles.emptyConnections}>You have reached everyone in your network.</p>
                                        )}
                                    </div>
                                </section>
                            </main>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    )
}

export default Connections