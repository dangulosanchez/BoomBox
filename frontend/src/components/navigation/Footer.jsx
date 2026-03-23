import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import content from '../../data/content.json';

const { footer } = content.global;

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.footerNav}>
          <Link to="/story" className={styles.footerLink}>{footer.links.our_story}</Link>
          {/* <Link to="/showcasing" className={styles.footerLink}>Showcasing</Link> */}
          {/* <Link to="/gallery" className={styles.footerLink}>Gallery</Link> */}
          {/* <Link to="/blog" className={styles.footerLink}>Blog</Link> */}
          <Link to="/collaborate" className={styles.footerLink}>{footer.links.collaborations}</Link>
        </nav>
        <p className={styles.copyright}>
          {footer.copyright.replace('{year}', new Date().getFullYear())}
        </p>
      </div>
    </footer>
  );
};

export default Footer;