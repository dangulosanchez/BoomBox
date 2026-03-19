import { Link } from 'react-router-dom';
import styles from './CollaborationCard.module.css';

const CollaborationCard = ({
  title,
  subtitle,
  description,
  howItWorks,
  whatYouGet,
  eventTypes,
  perfectFor,
  ctaText,
  ctaLink,
  additionalInfo,
  onCtaClick,   // if provided, fires instead of navigating
}) => {
  return (
    <article className={styles.card}>
      {/* XP-style window title bar */}
      <div className={styles.titleBar}>
        <span className={styles.titleBarIcon} aria-hidden="true">◈</span>
        <span className={styles.titleBarText}>{title}</span>
      </div>

      <div className={styles.cardHeader}>
        <span className={styles.cardLabel}>{subtitle}</span>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.description}>{description}</p>

        {howItWorks && (
          <div className={styles.section}>
            <h4 className={styles.sectionLabel}>How it works</h4>
            <ol className={styles.numberedList}>
              {howItWorks.map((item, index) => (
                <li key={index} className={styles.numberedItem}>
                  <span className={styles.stepNum}>{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {whatYouGet && (
          <div className={styles.section}>
            <h4 className={styles.sectionLabel}>What you get</h4>
            <ul className={styles.list}>
              {whatYouGet.map((item, index) => (
                <li key={index} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {eventTypes && (
          <div className={styles.section}>
            <h4 className={styles.sectionLabel}>Event types</h4>
            <ul className={styles.list}>
              {eventTypes.map((item, index) => (
                <li key={index} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>Perfect for</h4>
          <ul className={styles.tagList}>
            {perfectFor.map((item, index) => (
              <li key={index} className={styles.tag}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {additionalInfo && (
          <div className={styles.additionalInfo}>
            {additionalInfo.map((info, index) => (
              <span key={index} className={styles.infoItem}>{info}</span>
            ))}
          </div>
        )}
        {onCtaClick ? (
          <button type="button" className={styles.ctaButton} onClick={onCtaClick}>
            <span>{ctaText}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ) : (
          <Link to={ctaLink} className={styles.ctaButton}>
            <span>{ctaText}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
};

export default CollaborationCard;
