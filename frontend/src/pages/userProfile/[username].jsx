import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { clientServer, BASE_URL } from '@/config';
import UserLayout from '@/layout/UserLayout';
import { getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';
import { getAllPost } from '@/config/redux/action/postAction';
import UserCard from '@/components/userCard/UserCard';
import styles from '@/styles/Dashboard.module.css';

const UserProfile = ({ profile }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, connectionRequests = [] } = useSelector((state) => state.auth || {});
  const postState = useSelector((state) => state.post || {});
  const posts = postState.posts || [];
  
  const [avatarError, setAvatarError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      dispatch(getMyConnectionRequest({ token }));
      dispatch(getAllPost());
    }
  }, [dispatch]);

  const targetUser = profile?.user_id || {};
  const isOwnProfile = user?._id && targetUser?._id && user._id === targetUser._id;

  const userPosts = posts.filter(
    (post) => (post?.user_id?._id || post?.user_id) === targetUser?._id
  );

  const existingRequest = connectionRequests.find((req) => {
    const connId = req?.connection_id?._id || req?.connection_id;
    return connId === targetUser?._id;
  });

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

  const howOldIsPost = (createdAt) => {
    if (!createdAt) return '';
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate - postDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff < 1) {
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      return `${hoursDiff}h ago`;
    }
    return `${daysDiff}d ago`;
  };

  const handleConnect = async () => {
    if (!targetUser?._id) return;
    setIsSending(true);
    const token = localStorage.getItem('token');
    if (token) {
      await dispatch(sendConnectionRequest({ user_id: targetUser._id, token }));
      await dispatch(getMyConnectionRequest({ token }));
    }
    setIsSending(false);
  };

  const renderAvatar = () => {
    if (targetUser?.profilePicture && !avatarError) {
      return (
        <img
          src={`${BASE_URL}/${targetUser.profilePicture}`}
          alt={targetUser?.name || 'User Profile'}
          className={styles.profileHeroAvatar}
          style={{
            width: '96px',
            height: '96px',
            border: '4px solid #ffffff',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 6px 20px rgba(184, 134, 11, 0.25)',
          }}
          onError={() => setAvatarError(true)}
        />
      );
    }
    return (
      <div
        className={styles.profileHeroInitial}
        style={{
          width: '96px',
          height: '96px',
          fontSize: '2.2rem',
          border: '4px solid #ffffff',
          borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(184, 134, 11, 0.25)',
        }}
      >
        {getInitial(targetUser?.name)}
      </div>
    );
  };

  const renderActionButton = () => {
    if (isOwnProfile) {
      return (
        <Link
          href="/dashboard/myProfile"
          className={styles.profileEditButton}
          style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
        >
          Edit Profile
        </Link>
      );
    }

    if (existingRequest) {
      return (
        <button
          type="button"
          className={styles.connectBtn}
          disabled
          style={{
            opacity: 0.85,
            cursor: 'default',
            padding: '0.55rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: '700',
          }}
        >
          {existingRequest.status_accepted ? '✓ Connected' : '⏳ Request send'}
        </button>
      );
    }

    return (
      <button
        type="button"
        className={styles.profileEditButton}
        onClick={handleConnect}
        disabled={isSending}
        style={{
          padding: '0.55rem 1.25rem',
          fontSize: '0.85rem',
          cursor: isSending ? 'wait' : 'pointer',
        }}
      >
        {isSending ? 'Sending...' : '+ Connect'}
      </button>
    );
  };

  if (!profile || !profile.user_id) {
    return (
      <UserLayout>
        <Head>
          <title>User Profile Not Found | LinkedIn</title>
          <meta name="description" content="The requested member profile could not be found on LinkedIn." />
        </Head>
        <div className={styles.dashboardBg}>
          <div className={styles.container} style={{ maxWidth: '1240px' }}>
            <div className={styles.connectionsLayout} style={{ gridTemplateColumns: '250px minmax(0, 1fr)', gap: '1.75rem' }}>
              <UserCard />
              <main className={styles.profilePage} style={{ maxWidth: '100%', width: '100%', margin: 0 }}>
                <div className={styles.profileSection} style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                  <h2 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                    User Profile Not Found
                  </h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    The requested profile could not be found or does not exist.
                  </p>
                  <button
                    type="button"
                    className={styles.profileEditButton}
                    onClick={() => router.push('/dashboard')}
                    style={{ padding: '0.55rem 1.25rem' }}
                  >
                    Back to Feed
                  </button>
                </div>
              </main>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Head>
        <title>
          {targetUser?.name ? `${targetUser.name} (@${targetUser.username}) | LinkedIn` : 'Member Profile | LinkedIn'}
        </title>
        <meta
          name="description"
          content={`View ${targetUser?.name || 'this member'}'s professional profile, work history, education, and recent activity on LinkedIn.`}
        />
      </Head>
      <div className={styles.dashboardBg}>
        <div className={styles.container} style={{ maxWidth: '1240px' }}>
          <div className={styles.connectionsLayout} style={{ gridTemplateColumns: '250px minmax(0, 1fr)', gap: '1.75rem' }}>
            <UserCard />

            <main className={styles.profilePage} style={{ maxWidth: '100%', width: '100%', margin: 0 }}>
              {/* HERO SECTION */}
              <section className={styles.profileHero} style={{ width: '100%' }}>
                <div className={styles.profileHeroBanner} style={{ height: '140px' }} />
                <div
                  className={styles.profileHeroContent}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '0 1.75rem 1.5rem',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1', minWidth: '280px' }}>
                    <div className={styles.profileHeroAvatarWrap} style={{ marginTop: '-52px', flexShrink: 0 }}>
                      {renderAvatar()}
                    </div>
                    <div className={styles.profileHeroIdentity} style={{ paddingTop: '0.6rem' }}>
                      <span className={styles.eyebrow}>Professional Profile</span>
                      <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.2rem 0 0.3rem', color: 'var(--text-dark)' }}>
                        {targetUser?.name || 'Member Profile'}
                      </h1>
                      <p style={{ fontSize: '0.95rem', color: 'var(--gold-dark)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>
                        @{targetUser?.username || 'member'}
                        {profile?.current_post ? ` · ${profile.current_post}` : ''}
                      </p>
                      {targetUser?.email && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>
                          ✉️ {targetUser.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.profileHeroActions} style={{ paddingTop: '1rem' }}>
                    {renderActionButton()}
                  </div>
                </div>
              </section>

              {/* DETAILS GRID */}
              <div className={styles.profileDetailsGrid} style={{ gap: '1.25rem' }}>
                {/* ABOUT SECTION */}
                <section className={styles.profileSection}>
                  <div className={styles.profileSectionHeading}>
                    <span className={styles.sectionKicker}>About</span>
                    <h2>About me</h2>
                  </div>
                  <p className={styles.profileBioText}>
                    {profile?.bio || 'This user has not added a bio yet.'}
                  </p>
                </section>

                {/* WORK HISTORY SECTION */}
                <section className={styles.profileSection}>
                  <div className={styles.profileSectionHeading}>
                    <span className={styles.sectionKicker}>Experience</span>
                    <h2>Work history</h2>
                  </div>
                  {profile?.past_work?.length > 0 ? (
                    profile.past_work.map((work, index) => (
                      <div className={styles.profileTimelineItem} key={`work-${index}`}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                          💼 {work.position || 'Position'}
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {work.company || 'Company'}
                          {work.years ? ` · ${work.years}` : ''}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className={styles.profileBioText}>No work history added yet.</p>
                  )}
                </section>

                {/* EDUCATION SECTION */}
                <section className={styles.profileSection}>
                  <div className={styles.profileSectionHeading}>
                    <span className={styles.sectionKicker}>Learning</span>
                    <h2>Education</h2>
                  </div>
                  {profile?.education?.length > 0 ? (
                    profile.education.map((edu, index) => (
                      <div className={styles.profileTimelineItem} key={`edu-${index}`}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                          🎓 {edu.degree || 'Education'}
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {edu.school || 'School'}
                          {edu.field_of_study ? ` · ${edu.field_of_study}` : ''}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className={styles.profileBioText}>No education added yet.</p>
                  )}
                </section>

                {/* USER POSTS / ACTIVITY SECTION */}
                {userPosts.length > 0 && (
                  <section className={styles.profileSection}>
                    <div className={styles.profileSectionHeading}>
                      <span className={styles.sectionKicker}>Activity</span>
                      <h2>Recent posts ({userPosts.length})</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {userPosts.map((post) => (
                        <article key={post._id} className={styles.postCard + ' ' + styles.glassCard}>
                          <div className={styles.postHeader}>
                            <div className={styles.postAuthorInfo}>
                              {targetUser?.profilePicture ? (
                                <img
                                  src={`${BASE_URL}/${targetUser.profilePicture}`}
                                  alt={targetUser.name}
                                  className={styles.postAuthorAvatar}
                                />
                              ) : (
                                <div className={styles.postAuthorInitial}>
                                  {getInitial(targetUser?.name)}
                                </div>
                              )}
                              <div className={styles.postAuthorText}>
                                <h4 className={styles.postAuthorName}>{targetUser?.name}</h4>
                                <span className={styles.postAuthorHandle}>
                                  @{targetUser?.username} • {howOldIsPost(post?.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {post?.body && <p className={styles.postBody}>{post.body}</p>}

                          {post?.media && (
                            <div className={styles.postMediaWrapper}>
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                alt="Post Attachment"
                                className={styles.postMediaImg}
                              />
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  try {
    const res = await clientServer.get('/user/userProfile', {
      params: {
        username: context.query.username,
      },
    });
    const profile = res.data?.profile || null;
    return { props: { profile } };
  } catch (err) {
    return { props: { profile: null } };
  }
}

export default UserProfile;