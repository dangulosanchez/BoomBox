import React from 'react';
import styles from './AboutSection.module.css';

/**
 * AboutSection - Two-column about section with content and image
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.content - Content (can be JSX with multiple paragraphs)
 * @param {Array<{number: string, label: string}>} [props.stats] - Optional stats to display
 * @param {string} [props.image] - Optional image URL
 * @param {string} [props.imageAlt] - Alt text for image
 * 
 * @example
 * <AboutSection
 *   title="About The Box"
 *   content={<div><p>Content here...</p></div>}
 *   stats={[
 *     { number: '500+', label: 'Events' },
 *     { number: '10+', label: 'Years' }
 *   ]}
 *   image="/images/building.jpeg"
 * />
 */
const AboutSection = ({ 
  title, 
  content, 
  stats, 
  image, 
  imageAlt = 'About The Boombox'
}) => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Content Column */}
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.accentLine}></div>
            <div className={styles.body}>{content}</div>
            
            {/* Stats Row (Optional) */}
            {stats && stats.length > 0 && (
              <div className={styles.statsRow}>
                {stats.map((stat, idx) => (
                  <div key={idx} className={styles.statItem}>
                    <div className={styles.statNumber}>{stat.number}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Image Column (Optional) */}
          {image && (
            <div className={styles.imageContainer}>
              <div className={styles.imageFrame}>
                <img 
                  src={image} 
                  alt={imageAlt} 
                  className={styles.image} 
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;