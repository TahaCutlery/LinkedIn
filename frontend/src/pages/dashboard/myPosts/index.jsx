import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import UserCard from '@/components/userCard/UserCard'
import UserLayout from '@/layout/UserLayout'
import { getAllPost } from '@/config/redux/action/postAction'
import { BASE_URL } from '@/config'
import styles from '@/styles/Dashboard.module.css'

const MyPosts = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth || {})
    const { posts = [], isLoading } = useSelector((state) => state.post || {})
    const [currentDate] = React.useState(() => Date.now())

    useEffect(() => {
        dispatch(getAllPost())
    }, [dispatch])

    const myPosts = posts.filter((post) => (
        String(post.user_id?._id || post.user_id) === String(user?._id)
    ))

    const howOldIsPost = (createdAt) => {
        const days = Math.floor((currentDate - new Date(createdAt)) / (1000 * 60 * 60 * 24))
        if (days < 1) return 'Today'
        if (days < 7) return `${days}d ago`
        if (days < 30) return `${Math.floor(days / 7)}w ago`
        if (days < 365) return `${Math.floor(days / 30)}mo ago`
        return `${Math.floor(days / 365)}y ago`
    }

    return (
        <UserLayout>
            <Head>
                <title>My Posts & Activity | LinkedIn</title>
                <meta
                    name="description"
                    content="Track and manage your published posts, articles, and media updates on LinkedIn."
                />
            </Head>
            <div className={styles.dashboardBg}>
                <div className={styles.container}>
                    {isLoading && posts.length === 0 ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner} />
                            <p className={styles.loadingText}>Loading your posts...</p>
                        </div>
                    ) : (
                        <div className={styles.myPostsLayout}>
                            <UserCard />
                            <main className={styles.myPostsMain}>
                                <header className={styles.myPostsHero}>
                                    <div>
                                        <span className={styles.eyebrow}>Your activity</span>
                                        <h1>My Posts</h1>
                                        <p>Your ideas, updates, and conversations in one place.</p>
                                    </div>
                                    <div className={styles.connectionCount}>
                                        <strong>{myPosts.length}</strong>
                                        <span>{myPosts.length === 1 ? 'post' : 'posts'}</span>
                                    </div>
                                </header>

                                {myPosts.length > 0 ? (
                                    <div className={styles.myPostsList}>
                                        {[...myPosts].reverse().map((post) => (
                                            <article className={styles.postCard + ' ' + styles.glassCard} key={post._id}>
                                                <div className={styles.postHeader}>
                                                    <div className={styles.postAuthorInfo}>
                                                        {user?.profilePicture ? (
                                                            <img
                                                                src={`${BASE_URL}/${user.profilePicture}`}
                                                                alt={user.name || 'Your profile'}
                                                                className={styles.postAuthorAvatar}
                                                            />
                                                        ) : (
                                                            <div className={styles.postAuthorInitial}>
                                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                        )}
                                                        <div className={styles.postAuthorText}>
                                                            <h2 className={styles.postAuthorName}>{user?.name || 'Your post'}</h2>
                                                            <span className={styles.postAuthorHandle}>
                                                                @{user?.username || 'member'} · {howOldIsPost(post.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={styles.myPostLabel}>Your post</span>
                                                </div>

                                                {post.body && <p className={styles.postBody}>{post.body}</p>}
                                                {post.media && (
                                                    <div className={styles.postMediaWrapper}>
                                                        <img
                                                            src={`${BASE_URL}/${post.media}`}
                                                            alt="Post attachment"
                                                            className={styles.postMediaImg}
                                                        />
                                                    </div>
                                                )}

                                                <div className={styles.postStatsRow}>
                                                    <span className={styles.likeBadge}>
                                                        <span className={styles.likeBadgeIcon}>👍</span>
                                                        <span>{post.likes?.length || 0} likes</span>
                                                    </span>
                                                    <span>Published to your network</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <section className={styles.myPostsEmpty + ' ' + styles.glassCard}>
                                        <div className={styles.emptyFeedIcon}>✦</div>
                                        <h2 className={styles.emptyFeedTitle}>Your story starts here</h2>
                                        <p className={styles.emptyFeedDesc}>
                                            Share an idea, milestone, or useful insight with your network from the dashboard.
                                        </p>
                                    </section>
                                )}
                            </main>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    )
}

export default MyPosts