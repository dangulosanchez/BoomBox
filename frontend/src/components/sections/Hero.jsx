import React from 'react';
import styles from './Hero.module.css';

/**
 * Hero Component - Full-screen hero section with background image
 * 
 * @component
 * @example
 * <Hero
 *   title="THE BOOMBOX"
 *   subtitle="Miami's Underground Music Scene"
 *   tagline="For locals, by locals"
 *   backgroundImage="/images/building.jpeg"
 *   height="100vh"
 * />
 * 
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {string} [props.tagline] - Optional tagline text
 * @param {string} props.backgroundImage - Path to background image
 * @param {('60vh'|'100vh')} [props.height='100vh'] - Section height
 * @param {React.ReactNode} [props.logo] - Optional logo element
 * @param {React.ReactNode} [props.children] - Optional additional content (CTAs, etc.)
 * @param {boolean} [props.overlay=true] - Show dark overlay on background
 * 
 * @accessibility
 * - Uses semantic HTML (section, h1)
 * - Background image is decorative (CSS)
 * - Text has sufficient contrast against overlay
 * - Responsive text sizing
 */
const Hero = ({ 
  title,
  subtitle,
  tagline,
  backgroundImage,
  height = '100vh',
  logo,
  children,
  overlay = true
}) => {
  return (
    <section 
      className={`${styles.hero} ${height === '60vh' ? styles.heightMedium : styles.heightFull}`}
      style={{ 
        '--hero-bg-image': `url(${backgroundImage})` 
      }}
    >
      {/* Background Image Container */}
      <div className={styles.imageContainer}>
        <div 
          className={styles.backgroundImage}
          role="img"
          aria-label="Hero background"
        />
        {overlay && <div className={styles.overlay} />}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {logo && (
          <div className={styles.logoContainer}>
            {logo}
          </div>
        )}
        
        {title && (
          <h1 className={styles.title}>
            {title}
          </h1>
        )}
        
        {subtitle && (
          <h2 className={styles.subtitle}>
            {subtitle}
          </h2>
        )}
        
        {tagline && (
          <p className={styles.tagline}>
            {tagline}
          </p>
        )}

        {children && (
          <div className={styles.actions}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;