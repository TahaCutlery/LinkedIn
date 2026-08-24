import Link from 'next/link';
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        {/* Top 4-Column Grid */}
        <div className={styles.footerGrid}>
          {/* Column 1: Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogo} aria-label="LinkedIn Home">
              <span className={styles.brandText}>Linked</span>
              <span className={styles.brandInBox}>in</span>
            </Link>
            <p className={styles.brandTagline}>
              Connecting professionals worldwide to help them discover opportunities, build connections, and achieve career success.
            </p>
            <div className={styles.badgeRow}>
              <div className={styles.goldBadge}>
                <span>✨ Premium Experience</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className={styles.colTitle}>General</h4>
            <ul className={styles.linkList}>
              <li><Link href="/auth" className={styles.footerLink}>Sign In</Link></li>
              <li><Link href="/auth" className={styles.footerLink}>Join LinkedIn</Link></li>
              <li><Link href="#help" className={styles.footerLink}>Help Center</Link></li>
              <li><Link href="#careers" className={styles.footerLink}>Careers</Link></li>
              <li><Link href="#advertising" className={styles.footerLink}>Advertising</Link></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <h4 className={styles.colTitle}>Solutions</h4>
            <ul className={styles.linkList}>
              <li><Link href="#talent" className={styles.footerLink}>Talent Solutions</Link></li>
              <li><Link href="#marketing" className={styles.footerLink}>Marketing Solutions</Link></li>
              <li><Link href="#sales" className={styles.footerLink}>Sales Solutions</Link></li>
              <li><Link href="#learning" className={styles.footerLink}>Learning Platform</Link></li>
              <li><Link href="#business" className={styles.footerLink}>Business Services</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Policy */}
          <div>
            <h4 className={styles.colTitle}>Legal & Privacy</h4>
            <ul className={styles.linkList}>
              <li><Link href="#agreement" className={styles.footerLink}>User Agreement</Link></li>
              <li><Link href="#privacy" className={styles.footerLink}>Privacy Policy</Link></li>
              <li><Link href="#community" className={styles.footerLink}>Community Guidelines</Link></li>
              <li><Link href="#cookie" className={styles.footerLink}>Cookie Policy</Link></li>
              <li><Link href="#copyright" className={styles.footerLink}>Copyright Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className={styles.bottomDivider} />

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomLinks}>
            <Link href="#accessibility" className={styles.footerLink}>Accessibility</Link>
            <Link href="#guest-controls" className={styles.footerLink}>Guest Controls</Link>
            <Link href="#language" className={styles.footerLink}>Language: English</Link>
          </div>
          <span className={styles.copyright}>
            LinkedIn Corporation © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;