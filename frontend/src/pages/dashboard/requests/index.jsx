import { acceptConnectionRequest, rejectConnectionRequest, requestedUsers } from '@/config/redux/action/authAction';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import UserCard from '@/components/userCard/UserCard';
import UserLayout from '@/layout/UserLayout';
import styles from '@/styles/Dashboard.module.css';

const Requests = () => {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.auth || {});
    const connections = userState.connections || [];
    const requestedUsersList = connections.filter((connection) => connection.status_accepted === false);
    const acceptedUsersList = connections.filter((connection) => connection.status_accepted === true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(requestedUsers({ token }));
    }, [dispatch])

    const handleReject = async (connection_id) => {
        const token = localStorage.getItem("token");
        await dispatch(rejectConnectionRequest({ token, connection_id }));
        dispatch(requestedUsers({ token }));
    }

    const handleAccept =  async (connection_id) => {
        const token = localStorage.getItem("token");
        await dispatch(acceptConnectionRequest({ token, connection_id }));
        dispatch(requestedUsers({ token }));
    }

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

    const renderConnection = (connection, status) => {
        const connectionUser = connection?.user_id || {};
        return (
            <article className={styles.requestCard} key={connection._id}>
                <div className={styles.requestAvatar}>{getInitial(connectionUser.name)}</div>
                <div className={styles.requestDetails}>
                    <h3>{connectionUser.name || 'Professional Member'}</h3>
                    <p>@{connectionUser.username || 'member'}</p>
                    <span>{status === 'pending' ? 'Would like to connect with you.' : `Your connection request was ${status}.`}</span>
                </div>
                {status === 'pending' ? (
                    <div className={styles.requestActions}>
                        <button type="button" className={styles.acceptButton} onClick={() => handleAccept(connection._id)}>Accept</button>
                        <button type="button" className={styles.rejectButton} onClick={() => handleReject(connection._id)}>Reject</button>
                    </div>
                ) : (
                    <span className={`${styles.requestStatus} ${status === 'accepted' ? styles.acceptedStatus : styles.rejectedStatus}`}>
                        {status}
                    </span>
                )}
            </article>
        );
    };

    const renderSection = (title, kicker, list, status, emptyMessage) => (
        <section className={styles.requestSection}>
            <div className={styles.sectionHeading}>
                <div>
                    <span className={styles.sectionKicker}>{kicker}</span>
                    <h2>{title}</h2>
                </div>
                <span className={styles.sectionCount}>{list.length}</span>
            </div>
            <div className={styles.requestList}>
                {list.length > 0 ? list.map((connection) => renderConnection(connection, status)) : (
                    <p className={styles.emptyRequests}>{emptyMessage}</p>
                )}
            </div>
        </section>
    );

    return (
        <UserLayout>
            <Head>
                <title>Connection Requests | LinkedIn</title>
                <meta
                    name="description"
                    content="Review pending connection requests, accept new introductions, and manage your network invites on LinkedIn."
                />
            </Head>
            <div className={styles.dashboardBg}>
                <div className={styles.container}>
                    <div className={styles.requestsLayout}>
                        <UserCard />
                        <main className={styles.requestsMain}>
                            <header className={styles.requestsHero}>
                                <div>
                                    <span className={styles.eyebrow}>Stay in the loop</span>
                                    <h1>Connection requests</h1>
                                    <p>Manage new introductions and keep track of your network.</p>
                                </div>
                                <div className={styles.connectionCount}>
                                    <strong>{requestedUsersList.length}</strong>
                                    <span>to review</span>
                                </div>
                            </header>

                            {renderSection('Pending requests', 'Needs your attention', requestedUsersList, 'pending', 'You are all caught up.')}
                            {renderSection('Accepted connections', 'Growing your network', acceptedUsersList, 'accepted', 'Accepted connections will appear here.')}
                            {/* {renderSection('Past decisions', 'Your history', rejectedUsersList, 'rejected', 'No rejected requests to show.')} */}
                        </main>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default Requests;