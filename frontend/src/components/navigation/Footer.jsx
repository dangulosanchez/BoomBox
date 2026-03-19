import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.footerNav}>
          <Link to="/story" className={styles.footerLink}>Our Story</Link>
          {/* <Link to="/showcasing" className={styles.footerLink}>Showcasing</Link> */}
          {/* <Link to="/gallery" className={styles.footerLink}>Gallery</Link> */}
          {/* <Link to="/blog" className={styles.footerLink}>Blog</Link> */}
          <Link to="/collaborate" className={styles.footerLink}>Collaborations</Link>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} The Boombox Miami. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;