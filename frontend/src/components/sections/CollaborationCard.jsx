/**
 * ============================================
 * COLLABORATION CARD COMPONENT
 * ============================================
 * 
 * Reusable card component for displaying collaboration opportunities
 * on the Collaborate page. Features dynamic sections based on card type.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.icon - Emoji icon for the card
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {string} props.description - Main description text
 * @param {Array} props.howItWorks - Optional "How It Works" list items
 * @param {Array} props.whatYouGet - Optional "What You Get" list items
 * @param {Array} props.eventTypes - Optional "Event Types" list items
 * @param {Array} props.perfectFor - "Perfect For" list items
 * @param {string} props.ctaText - CTA button text
 * @param {string} props.ctaLink - CTA button link
 * @param {Array} props.additionalInfo - Additional info items
 */

import { Link } from 'react-router-dom';
import styles from './CollaborationCard.module.css';

const CollaborationCard = ({
  icon,
  title,
  subtitle,
  description,
  howItWorks,
  whatYouGet,
  eventTypes,
  perfectFor,
  ctaText,
  ctaLink,
  additionalInfo
}) => {
  return (
    <article className={styles.card}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.icon}>{icon}</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <p className={styles.description}>{description}</p>

        {/* How It Works Section (Event Collaborations) */}
        {howItWorks && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>How It Works:</h4>
            <ul className={styles.list}>
              {howItWorks.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What You Get Section (Rehearsal Space) */}
        {whatYouGet && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>What You Get:</h4>
            <ul className={styles.list}>
              {whatYouGet.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Event Types Section (Vendor & Community) */}
        {eventTypes && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Event Types:</h4>
            <ul className={styles.list}>
              {eventTypes.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Perfect For Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Perfect For:</h4>
          <ul className={styles.checkList}>
            {perfectFor.map((item, index) => (
              <li key={index} className={styles.checkItem}>
                <span className={styles.checkmark}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <Link to={ctaLink} className={styles.ctaButton}>
          {ctaText}
        </Link>
        
        {additionalInfo && (
          <div className={styles.additionalInfo}>
            {additionalInfo.map((info, index) => (
              <span key={index} className={styles.infoItem}>
                {info}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default CollaborationCard;