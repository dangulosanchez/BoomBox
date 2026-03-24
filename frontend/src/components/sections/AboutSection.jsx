import CyberLunaWindow from '../base/CyberLunaWindow';
import styles from './AboutSection.module.css';

/**
 * AboutSection - Two-column about section with content and image
 *
 * @param {string}  props.title       - Section title (shown inside window body)
 * @param {ReactNode} props.content   - Body content JSX
 * @param {Array}   [props.stats]     - Optional stats array
 * @param {string}  [props.image]     - Optional image URL
 * @param {string}  [props.imageAlt]  - Alt text for image
 * @param {string}  [props.windowTitle] - When provided, wraps content in a static XP window
 */
const AboutSection = ({
  title,
  content,
  stats,
  image,
  imageAlt = 'About The Boombox',
  windowTitle,
}) => {
  const contentInner = (
    <>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.accentLine}></div>
      <div className={styles.body}>{content}</div>

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
    </>
  );

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Content Column */}
          <div className={styles.content}>
            {windowTitle ? (
              <CyberLunaWindow isStatic title={windowTitle} bodyClassName={styles.windowBody}>
                {contentInner}
              </CyberLunaWindow>
            ) : (
              contentInner
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
