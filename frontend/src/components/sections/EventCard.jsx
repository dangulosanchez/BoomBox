import XPButton from '../base/XPButton';
import styles from './EventCard.module.css';

/**
 * EventCard Component - Individual event card
 * 
 * @component
 * @param {Object} props
 * @param {string} props.date - Event date (e.g., "Oct 25")
 * @param {string} props.title - Event title
 * @param {string} props.artist - Artist or description
 * @param {string} props.price - Ticket price
 * @param {string} [props.urgency] - Urgency message (e.g., "Limited capacity")
 * @param {string} [props.image] - Optional event image
 * @param {string} props.ticketUrl - URL to ticket purchase
 * 
 * @example
 * <EventCard
 *   date="Oct 25"
 *   title="Bassline Fridays"
 *   artist="DJ TechLow"
 *   price="$20"
 *   urgency="Limited capacity"
 *   ticketUrl="https://shotgun.live/..."
 * />
 */
const EventCard = ({ 
  date, 
  title, 
  artist, 
  price, 
  urgency, 
  image,
  ticketUrl 
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.dateBadge}>
        <span className={styles.dateText}>{date}</span>
      </div>

      {image && (
        <div className={styles.imageContainer}>
          <img 
            src={image} 
            alt={`${title} event`}
            className={styles.image}
            loading="lazy"
          />
        </div>
      )}

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.artist}>{artist}</p>
        
        <div className={styles.meta}>
          <span className={styles.price}>{price}</span>
          {urgency && (
            <>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.urgency}>{urgency}</span>
            </>
          )}
        </div>

        <div className={styles.cta}>
          <XPButton
            as="a"
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Tickets
          </XPButton>
        </div>
      </div>
    </article>
  );
};

export default EventCard;