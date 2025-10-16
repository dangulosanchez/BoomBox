import { useEffect, useState } from 'react';
import Button from './Button';
import styles from './StickyMobileCTA.module.css';

/**
 * StickyMobileCTA Component - Mobile-only sticky bottom CTA bar
 * 
 * @component
 * @description
 * Shows a sticky CTA bar at bottom of mobile screen after scrolling past hero.
 * Hides when user reaches events section to avoid redundancy.
 * Desktop: Hidden entirely.
 * 
 * @param {Object} props
 * @param {string} [props.eventName="Next Event"] - Featured event name
 * @param {string} [props.ctaText="View Events"] - CTA button text
 * @param {boolean} [props.scrollToEvents=true] - Scroll to events section instead of external link
 * @param {string} [props.externalUrl] - Optional external URL (if scrollToEvents is false)
 * 
 * @example
 * // Scroll to events section (default)
 * <StickyMobileCTA eventName="This Weekend" />
 * 
 * @example
 * // Link to external URL
 * <StickyMobileCTA 
 *   eventName="This Weekend"
 *   scrollToEvents={false}
 *   externalUrl="https://shotgun.live/..."
 * />
 */
const StickyMobileCTA = ({ 
  eventName = "Next Event",
  ctaText = "View Events",
  scrollToEvents = true,
  externalUrl = "https://shotgun.live/en/venues/the-boombox-miami"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // Approx hero height
      
      // Get events section position
      const eventsSection = document.querySelector('[data-section="events"]');
      const eventsTop = eventsSection?.offsetTop || Infinity;
      
      // Show after scrolling past hero, hide when reaching events
      const shouldShow = scrollY > heroHeight && scrollY < (eventsTop - 100);
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to events section smoothly
  const handleClick = (e) => {
    if (scrollToEvents) {
      e.preventDefault();
      const eventsSection = document.querySelector('[data-section="events"]');
      if (eventsSection) {
        eventsSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
    // If not scrollToEvents, button acts as normal link
  };

  // Only render on mobile (CSS hides on desktop, but good practice to check)
  if (typeof window !== 'undefined' && window.innerWidth >= 992) {
    return null;
  }

  return (
    <div 
      className={`${styles.stickyBar} ${isVisible ? styles.visible : ''}`}
      role="complementary"
      aria-label="Quick event access"
    >
      <div className={styles.content}>
        <div className={styles.eventInfo}>
          <span className={styles.eventName}>{eventName}</span>
        </div>
        
        <Button
          as="a"
          href={scrollToEvents ? "#events" : externalUrl}
          target={scrollToEvents ? undefined : "_blank"}
          rel={scrollToEvents ? undefined : "noopener noreferrer"}
          onClick={handleClick}
          variant="primary"
          size="sm"
          className={styles.ctaButton}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;