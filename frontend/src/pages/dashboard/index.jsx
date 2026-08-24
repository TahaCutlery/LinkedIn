import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getAllUsersProfile, getMyConnectionRequest, getUser, requestedUsers, sendConnectionRequest } from '@/config/redux/action/authAction';
import { createComment, createPost, deletePost, getAllPost, getCommentsOfThePost, incrementLikes } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/UserLayout';
import styles from '@/styles/Dashboard.module.css';
import { BASE_URL } from '@/config';
import UserCard from '@/components/userCard/UserCard';


const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth || {});
  const postState = useSelector((state) => state.post || {});

  const user = authState.user;
  const profile = authState.profile;
  const posts = postState.posts || [];
  const allProfiles = authState.allUsersProfile.profiles || [];
  const myConnectionRequest = authState.connectionRequests || [];
  const connections = authState.connections || [];
  const [avatarError, setAvatarError] = useState(false);
  const [comment, setComment] = useState("");
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [likeCountsByPost, setLikeCountsByPost] = useState({});
  const [media, setMedia] = useState();
  const [postText, setPostText] = useState("");
  const [likedByPost, setLikedByPost] = useState({});

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }
    dispatch(getAllPost());
    dispatch(getUser({ token }));
    dispatch(getAllUsersProfile());
    dispatch(getMyConnectionRequest({ token }));
    dispatch(requestedUsers({ token }));
  }, []);

  const handleCreateComment = async (post_id) => {
    const token = localStorage.getItem("token");
    await dispatch(createComment({ post_id, token, comment }));
    setComment("");
    const result = await dispatch(getCommentsOfThePost({ post_id }));
    if (getCommentsOfThePost.fulfilled.match(result)) {
      setCommentsByPost((currentComments) => ({
        ...currentComments,
        [post_id]: result.payload?.comments || [],
      }));
    }
  };

  const handlePostLikes = async (post_id) => {
    const token = localStorage.getItem("token");
    const result = await dispatch(incrementLikes({ post_id, token }));
    if (incrementLikes.fulfilled.match(result)) {
      const post = posts.find((currentPost) => currentPost._id === post_id);
      const wasLiked = likedByPost[post_id] ?? post?.likes?.some((likeId) => (
        String(likeId?._id || likeId) === String(user?._id)
      ));
      setLikedByPost((currentLikes) => ({
        ...currentLikes,
        [post_id]: !wasLiked,
      }));
      setLikeCountsByPost((currentCounts) => ({
        ...currentCounts,
        [post_id]: result.payload?.likes?.length ?? 0,
      }));
    }
  }

  const handleSendConnectionRequest = async (user_id) => {
    const token = localStorage.getItem("token");
    await dispatch(sendConnectionRequest({ user_id, token }));
    dispatch(getMyConnectionRequest({ token }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await dispatch(createPost({ token, body: postText, media }));
    setPostText("");
    setMedia("");
    dispatch(getAllPost());
  }

  const handlePostDelete = async (post_id) => {
    const token = localStorage.getItem("token");
    await dispatch(deletePost({ post_id, token }));
    dispatch(getAllPost());
  }

  const howOldIsPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate - postDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff < 1) {
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      return `${hoursDiff}h ago`;
    }
    else if (daysDiff < 7) {
      return `${daysDiff}d ago`;
    }
    else if (daysDiff < 30) {
      return `${daysDiff / 7}w ago`;
    }
    else if (daysDiff < 365) {
      return `${daysDiff / 30}m ago`;
    }
    else {
      return `${daysDiff / 365}y ago`;
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const renderConnectionButton = (postOrUser) => {
    if (!postOrUser) return null;

    let targetUserId = null;
    let isPostDeleteObj = false;

    if (postOrUser._id && postOrUser.user_id) {
      targetUserId = typeof postOrUser.user_id === 'string' ? postOrUser.user_id : postOrUser.user_id?._id;
      isPostDeleteObj = true;
    } else if (postOrUser._id) {
      targetUserId = postOrUser._id;
    } else if (typeof postOrUser === 'string') {
      targetUserId = postOrUser;
    }

    if (!targetUserId) return null;

    if (isPostDeleteObj && user?._id === targetUserId) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePostDelete(postOrUser._id);
          }}
          type="button"
          className={styles.connectBtn}
          style={{ color: "#dc2626", borderColor: "#dc2626" }}
        >
          Delete
        </button>
      );
    }

    if (user?._id === targetUserId) {
      return null;
    }

    const existingRequest = myConnectionRequest.find((request) => {
      const connId = request?.connection_id;
      const reqUserId = typeof connId === 'object' ? connId?._id : connId;
      return reqUserId === targetUserId;
    });

    if (existingRequest) {
      return (
        <button
          type="button"
          className={styles.connectBtn}
          disabled
          style={{ opacity: 0.85, cursor: "default" }}
          onClick={(e) => e.stopPropagation()}
        >
          {existingRequest.status_accepted ? "Accepted" : "Request send"}
        </button>
      );
    }

    return (
      <button
        type="button"
        className={styles.connectBtn}
        onClick={(e) => {
          e.stopPropagation();
          handleSendConnectionRequest(targetUserId);
        }}
      >
        + Connect
      </button>
    );
  };

  return (
    <UserLayout>
      <Head>
        <title>Feed | LinkedIn</title>
        <meta
          name="description"
          content="Stay up to date with your network's latest posts, share updates, engage with professional content, and build connections on LinkedIn."
        />
      </Head>
      <div className={styles.dashboardBg}>
        <div className={styles.container}>
          {!authState.profileFetched && postState.isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner} />
              <p className={styles.loadingText}>Loading your professional feed...</p>
            </div>
          ) : (
            <div className={styles.dashboardGrid}>
              {/* LEFT COLUMN: User Profile Card */}
              <UserCard user={user} profile={profile} />

              {/* CENTER COLUMN: Create Post & Feed Stream */}
              <main className={styles.centerCol}>
                {/* Create Post Box */}
                <form onSubmit={handleCreatePost}>
                  <div className={styles.createPostCard + ' ' + styles.glassCard}>
                    <div className={styles.createPostTop}>
                      {user?.profilePicture && !avatarError ? (
                        <img
                          src={`${BASE_URL}/${user.profilePicture}`}
                          alt={user?.name}
                          className={styles.createPostAvatar}
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <div className={styles.createPostAvatarInitial}>
                          {getInitial(user?.name)}
                        </div>
                      )}

                      <textarea
                        rows="2"
                        onChange={(e) => setPostText(e.target.value)}
                        value={postText}
                        className={styles.createPostInput}
                        placeholder="Start a post, share an update or insight..."
                      />
                    </div>

                    {media && (
                      <div className={styles.mediaPreviewContainer}>
                        <div className={styles.mediaPreviewContent}>
                          {media.type?.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(media)}
                              alt="Attachment Preview"
                              className={styles.mediaPreviewImg}
                            />
                          ) : (
                            <div className={styles.mediaPreviewFileIcon}>
                              📁 <span>{media.name}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            className={styles.removeMediaBtn}
                            onClick={() => setMedia(null)}
                            title="Remove attachment"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    <div className={styles.createPostActions}>
                      <div className={styles.createPostMediaOptions}>
                        <label htmlFor='media' className={styles.actionBtn}>
                          <svg className={styles.actionIconPhoto} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>Media</span>
                        </label>
                        <input
                          id='media'
                          type="file"
                          name='media'
                          accept="image/*,video/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setMedia(e.target.files[0]);
                            }
                          }}
                          hidden
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.submitPostBtn}
                        disabled={!postText.trim() && !media}
                      >
                        <span>Post</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
                {/* Feed Stream */}

                {postState.posts && postState.posts.length > 0 ? (
                  [...postState.posts].reverse().map((post) => {
                    return (<article key={post._id} className={styles.postCard + ' ' + styles.glassCard}>
                      <div className={styles.postHeader}>
                        <div className={styles.postAuthorInfo}>
                          {post?.user_id?.profilePicture ? (
                            <img
                              src={`${BASE_URL}/${post?.user_id?.profilePicture}`}
                              alt={post?.user_id?.name || 'Author'}
                              className={styles.postAuthorAvatar}
                            />
                          ) : (
                            <div className={styles.postAuthorInitial}>
                              {getInitial(post?.user_id?.name || post?.name)}
                            </div>
                          )}
                          <div className={styles.postAuthorText}>
                            <h4 className={styles.postAuthorName}>
                              {post?.user_id?.name || post?.name || 'Professional Member'}
                            </h4>
                            <span className={styles.postAuthorHandle}>
                              @{post?.user_id?.username || 'member'} • {howOldIsPost(post?.createdAt)}
                            </span>
                          </div>
                        </div>

                        {renderConnectionButton(post)}
                      </div>

                      {/* Post Body Text */}
                      {post?.body && <p className={styles.postBody}>{post.body}</p>}

                      {/* Post Image Media */}
                      {post?.media && (
                        <div className={styles.postMediaWrapper}>
                          <img
                            src={`${BASE_URL}/${post.media}`}
                            alt="Post Attachment"
                            className={styles.postMediaImg}
                          />
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className={styles.postStatsRow}>
                        <span className={styles.likeBadge}>
                          <span className={styles.likeBadgeIcon}>👍</span>
                          <span>{likeCountsByPost[post._id] ?? post?.likes?.length ?? 0} likes</span>
                        </span>
                        <span>{commentsByPost[post._id]?.length || 0} comments</span>
                      </div>

                      {/* Post Action Buttons */}
                      <div className={styles.postActionBar}>
                        <button type="button" className={styles.postActionBtn} onClick={() => handlePostLikes(post._id)}>
                          {(
                            likedByPost[post._id] ?? post?.likes?.some((likeId) => (
                              String(likeId?._id || likeId) === String(user?._id)
                            ))
                          ) ?
                            <svg fill="#d4af37" width="18" height="18" viewBox="0 0 24 24" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                            </svg>
                            :
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                            </svg>
                          }
                          <span>{(
                            likedByPost[post._id] ?? post?.likes?.some((likeId) => (
                              String(likeId?._id || likeId) === String(user?._id)
                            ))
                          ) ? 'Unlike' : 'Like'}</span>
                        </button>

                        <button type="button" className={styles.postActionBtn} onClick={async () => {
                          if (openCommentPostId === post._id) {
                            setOpenCommentPostId(null);
                            return;
                          }

                          const result = await dispatch(getCommentsOfThePost({ post_id: post._id }));
                          if (getCommentsOfThePost.fulfilled.match(result)) {
                            setCommentsByPost((currentComments) => ({
                              ...currentComments,
                              [post._id]: result.payload?.comments || [],
                            }));
                            setOpenCommentPostId(post._id);
                          }
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>Comment</span>
                        </button>
                      </div>
                      {openCommentPostId === post._id && (
                        <div className={styles.commentsContainer}>
                          <div className={styles.commentInputWrapper}>
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className={styles.commentInput}
                              placeholder="Write a comment..."
                            />
                            <button
                              type="button"
                              className={styles.commentSubmitBtn}
                              onClick={() => {
                                handleCreateComment(post._id);
                              }}
                            >
                              Post
                            </button>
                          </div>

                          {(commentsByPost[post._id] || []).map((commentItem, index) => (
                            <div className={styles.commentWrapper} key={commentItem._id || index}>
                              <div className={styles.commentAvatar}>
                                {commentItem?.user_id?.profilePicture ? (
                                  <img
                                    src={`${BASE_URL}/${commentItem.user_id.profilePicture}`}
                                    alt={commentItem?.user_id?.name || 'User'}
                                    className={styles.commentAvatarImg}
                                  />
                                ) : (
                                  <div className={styles.commentAvatarInitial}>
                                    {getInitial(commentItem?.user_id?.name || commentItem?.user_id?.username || 'U')}
                                  </div>
                                )}
                              </div>
                              <div className={styles.commentContent}>
                                <h4 className={styles.commentAuthorName}>
                                  {commentItem?.user_id?.username || commentItem?.user_id?.name || 'User'}
                                </h4>
                                <p className={styles.commentBody}>{commentItem?.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>)
                  })
                ) : (
                  <div className={styles.emptyFeedCard + ' ' + styles.glassCard}>
                    <div className={styles.emptyFeedIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <h3 className={styles.emptyFeedTitle}>Welcome to your Feed!</h3>
                    <p className={styles.emptyFeedDesc}>
                      No posts available right now. Be the first to share an update with your network!
                    </p>
                  </div>
                )}
              </main>

              {/* RIGHT COLUMN: LinkedIn News & Recommendations */}
              <aside className={styles.rightCol}>



                {/* Recommendations Card */}
                <div className={styles.glassCard}>
                  <div className={styles.widgetHeader}>
                    <h4 className={styles.widgetTitle}>Add to your feed</h4>
                  </div>

                  <div className={styles.recommendationsList}>
                    {
                      allProfiles.map((profile, index) => {
                        if (profile.user_id._id === user._id) {
                          return null;
                        }
                        return (
                          <div className={styles.recommendUser} style={{ cursor: "pointer" }} key={index} onClick={() => {
                            const url = `/userProfile/${profile.user_id.username}`;
                            router.push(url, url, { shallow: true });
                          }}>
                            <img src={`${BASE_URL}/${profile.user_id.profilePicture}`} alt="" className={styles.recommendAvatar} />
                            <div className={styles.recommendDetails}>
                              <span className={styles.recommendName}>{profile.user_id.name}</span>
                              <span className={styles.recommendRole}>{profile.past_work[0]?.position || "Position"}</span>
                            </div>
                            <div onClick={(e) => { e.stopPropagation() }}>
                              {renderConnectionButton(profile.user_id)}
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;