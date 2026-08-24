import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import UserLayout from '@/layout/UserLayout';
import { downloadProfile, getUser, updateProfilePicture, updateUser, updateUserProfile } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from '@/styles/Dashboard.module.css';
import UserCard from '@/components/userCard/UserCard';

const emptyWork = { company: '', position: '', years: '' };
const emptyEducation = { school: '', degree: '', field_of_study: '' };

const MyProfile = () => {
    const dispatch = useDispatch();
    const { user, profile, message } = useSelector((state) => state.auth || {});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState(null);

    const getFormData = () => ({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        bio: profile?.bio || '',
        current_post: profile?.current_post || '',
        past_work: profile?.past_work || [],
        education: profile?.education || [],
    });

    const [form, setForm] = useState(getFormData);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            dispatch(getUser({ token }));
        }
    }, [dispatch]);

    const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const updateArrayField = (field, index, key, value) =>
        updateField(
            field,
            form[field].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
        );

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

    const handleSave = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem('token');
        const results = await Promise.all([
            dispatch(updateUser({ token, name: form.name, username: form.username, email: form.email })),
            dispatch(
                updateUserProfile({
                    token,
                    bio: form.bio,
                    current_post: form.current_post,
                    past_work: form.past_work,
                    education: form.education,
                })
            ),
            selectedPicture
                ? dispatch(updateProfilePicture({ token, profile_picture: selectedPicture }))
                : Promise.resolve(null),
        ]);

        if (results.every((result) => !result || result.meta?.requestStatus === 'fulfilled')) {
            await dispatch(getUser({ token }));
            setSelectedPicture(null);
            setIsEditing(false);
        }
        setIsSaving(false);
    };

    const handleDownloadCV = async () => {
        if (!user?._id) return;
        const result = await dispatch(downloadProfile({ user_id: user._id }));
        if (result.meta?.requestStatus === 'fulfilled' && result.payload?.outputPath) {
            window.open(`${BASE_URL}/${result.payload.outputPath}`, '_blank');
        }
    };

    const renderAvatar = () =>
        user?.profilePicture ? (
            <img
                src={`${BASE_URL}/${user.profilePicture}`}
                alt={user?.name || 'Profile'}
                className={styles.profileHeroAvatar}
                style={{
                    width: '96px',
                    height: '96px',
                    border: '4px solid #ffffff',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 6px 20px rgba(184, 134, 11, 0.25)',
                }}
            />
        ) : (
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
                {getInitial(user?.name)}
            </div>
        );

    return (
        <UserLayout>
            <Head>
                <title>{user?.name ? `${user.name} | My Profile | LinkedIn` : 'My Profile | LinkedIn'}</title>
                <meta
                    name="description"
                    content="Manage and update your professional profile, current role, career experience, and education details on LinkedIn."
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
                                                {user?.name || 'Your profile'}
                                            </h1>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--gold-dark)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>
                                                @{user?.username || 'member'} · {profile?.current_post || 'Add your current position'}
                                            </p>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>
                                                ✉️ {user?.email || 'Add your email address'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.profileHeroActions} style={{ paddingTop: '1rem' }}>
                                        {isEditing && (
                                            <label className={styles.pictureButton} style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}>
                                                📷 Change photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(event) => setSelectedPicture(event.target.files?.[0] || null)}
                                                />
                                            </label>
                                        )}
                                        <button
                                            type="button"
                                            className={styles.profileEditButton}
                                            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                                            onClick={() => {
                                                if (!isEditing) setForm(getFormData());
                                                setIsEditing((editing) => !editing);
                                            }}
                                        >
                                            {isEditing ? 'Cancel' : '✏️ Edit profile'}
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.profileEditButton}
                                            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                                            onClick={handleDownloadCV}
                                        >
                                            📄 Download CV
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* EDIT FORM OR VIEW DETAILS */}
                            {isEditing ? (
                                <form className={styles.profileEditForm} onSubmit={handleSave} style={{ marginTop: '1.25rem' }}>
                                    <section className={styles.profileSection}>
                                        <div className={styles.profileSectionHeading}>
                                            <span className={styles.sectionKicker}>Account</span>
                                            <h2>Personal details</h2>
                                        </div>
                                        <div className={styles.profileFormGrid}>
                                            <label>
                                                Full name
                                                <input
                                                    value={form.name}
                                                    onChange={(event) => updateField('name', event.target.value)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                Username
                                                <input
                                                    value={form.username}
                                                    onChange={(event) => updateField('username', event.target.value)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                Email
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(event) => updateField('email', event.target.value)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                Current position
                                                <input
                                                    value={form.current_post}
                                                    onChange={(event) => updateField('current_post', event.target.value)}
                                                    placeholder="Product designer"
                                                />
                                            </label>
                                        </div>
                                        <label className={styles.profileWideField}>
                                            Bio
                                            <textarea
                                                value={form.bio}
                                                onChange={(event) => updateField('bio', event.target.value)}
                                                rows="4"
                                                placeholder="Tell your network what you do and care about."
                                            />
                                        </label>
                                    </section>

                                    <section className={styles.profileSection}>
                                        <div className={styles.profileSectionHeading}>
                                            <span className={styles.sectionKicker}>Experience</span>
                                            <h2>Work history</h2>
                                        </div>
                                        {form.past_work.map((work, index) => (
                                            <div className={styles.profileArrayRow} key={`work-${index}`}>
                                                <input
                                                    value={work.company || ''}
                                                    placeholder="Company"
                                                    onChange={(event) => updateArrayField('past_work', index, 'company', event.target.value)}
                                                />
                                                <input
                                                    value={work.position || ''}
                                                    placeholder="Position"
                                                    onChange={(event) => updateArrayField('past_work', index, 'position', event.target.value)}
                                                />
                                                <input
                                                    value={work.years || ''}
                                                    placeholder="Years"
                                                    onChange={(event) => updateArrayField('past_work', index, 'years', event.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.removeRowButton}
                                                    onClick={() => updateField('past_work', form.past_work.filter((_, itemIndex) => itemIndex !== index))}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className={styles.addRowButton}
                                            onClick={() => updateField('past_work', [...form.past_work, { ...emptyWork }])}
                                        >
                                            + Add experience
                                        </button>
                                    </section>

                                    <section className={styles.profileSection}>
                                        <div className={styles.profileSectionHeading}>
                                            <span className={styles.sectionKicker}>Learning</span>
                                            <h2>Education</h2>
                                        </div>
                                        {form.education.map((education, index) => (
                                            <div className={styles.profileArrayRow} key={`education-${index}`}>
                                                <input
                                                    value={education.school || ''}
                                                    placeholder="School"
                                                    onChange={(event) => updateArrayField('education', index, 'school', event.target.value)}
                                                />
                                                <input
                                                    value={education.degree || ''}
                                                    placeholder="Degree"
                                                    onChange={(event) => updateArrayField('education', index, 'degree', event.target.value)}
                                                />
                                                <input
                                                    value={education.field_of_study || ''}
                                                    placeholder="Field of study"
                                                    onChange={(event) => updateArrayField('education', index, 'field_of_study', event.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.removeRowButton}
                                                    onClick={() => updateField('education', form.education.filter((_, itemIndex) => itemIndex !== index))}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className={styles.addRowButton}
                                            onClick={() => updateField('education', [...form.education, { ...emptyEducation }])}
                                        >
                                            + Add education
                                        </button>
                                    </section>

                                    <div className={styles.profileSaveBar}>
                                        <span>{message || 'Your changes stay private until you save.'}</span>
                                        <button type="submit" className={styles.profileSaveButton} disabled={isSaving}>
                                            {isSaving ? 'Saving...' : 'Save profile'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className={styles.profileDetailsGrid} style={{ gap: '1.25rem', marginTop: '1.25rem' }}>
                                    <section className={styles.profileSection}>
                                        <div className={styles.profileSectionHeading}>
                                            <span className={styles.sectionKicker}>About</span>
                                            <h2>About me</h2>
                                        </div>
                                        <p className={styles.profileBioText}>
                                            {profile?.bio || 'Add a short introduction so people know what you bring to the table.'}
                                        </p>
                                    </section>

                                    <section className={styles.profileSection}>
                                        <div className={styles.profileSectionHeading}>
                                            <span className={styles.sectionKicker}>Experience</span>
                                            <h2>Work history</h2>
                                        </div>
                                        {profile?.past_work?.length ? (
                                            profile.past_work.map((work, index) => (
                                                <div className={styles.profileTimelineItem} key={`view-work-${index}`}>
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

                                    <section className={styles.profileSection}>
                                        <div className={styles.profileSectionHeading}>
                                            <span className={styles.sectionKicker}>Learning</span>
                                            <h2>Education</h2>
                                        </div>
                                        {profile?.education?.length ? (
                                            profile.education.map((education, index) => (
                                                <div className={styles.profileTimelineItem} key={`view-education-${index}`}>
                                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                                                        🎓 {education.degree || 'Education'}
                                                    </strong>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {education.school || 'School'}
                                                        {education.field_of_study ? ` · ${education.field_of_study}` : ''}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.profileBioText}>No education added yet.</p>
                                        )}
                                    </section>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default MyProfile;
