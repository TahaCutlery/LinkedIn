import Head from "next/head";
import Link from "next/link";
import UserLayout from "@/layout/UserLayout";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <UserLayout>
      <Head>
        <title>LinkedIn - Welcome to Your Professional Community</title>
        <meta name="description" content="Connect with professionals, discover job opportunities, and grow your career." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.homeContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              <span>The #1 Professional Network</span>
            </div>
            <h1 className={styles.heroTitle}>
              Welcome to your <span className={styles.goldText}>professional</span> community
            </h1>
            <p className={styles.heroSubtitle}>
              Discover new opportunities, build meaningful connections, and elevate your career with millions of professionals worldwide.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/auth" className={styles.primaryBtn}>
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.avatarBox}>IN</div>
                <div className={styles.profileMeta}>
                  <span className={styles.profileName}>Professional Hub</span>
                  <span className={styles.profileRole}>Grow & Connect</span>
                </div>
              </div>
              <div className={styles.cardStats}>
                <div>
                  <div className={styles.statNumber}>1B+</div>
                  <div className={styles.statLabel}>Members</div>
                </div>
                <div>
                  <div className={styles.statNumber}>60M+</div>
                  <div className={styles.statLabel}>Companies</div>
                </div>
                <div>
                  <div className={styles.statNumber}>100k+</div>
                  <div className={styles.statLabel}>Jobs Daily</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything you need to succeed</h2>
            <p className={styles.sectionSubtitle}>Empowering professionals with tools to grow and lead.</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Connect with People</h3>
              <p className={styles.featureDesc}>
                Build your professional network, message industry peers, and stay in touch with colleagues.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Find the Right Job</h3>
              <p className={styles.featureDesc}>
                Explore open roles tailored to your skills, get job alerts, and apply with ease.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Learn New Skills</h3>
              <p className={styles.featureDesc}>
                Access expert courses, industry insights, and certificates to keep your knowledge up to date.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Join Discussions</h3>
              <p className={styles.featureDesc}>
                Share your ideas, publish articles, and join meaningful conversations with thought leaders.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>Ready to take the next step in your career?</h2>
            <p className={styles.ctaDesc}>Join millions of professionals today and unlock new opportunities.</p>
          </div>
          <Link href="/auth" className={styles.ctaBtn}>
            Join Now
          </Link>
        </section>
      </div>
    </UserLayout>
  );
}

