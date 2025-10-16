import { useEffect, useRef, useState } from 'react';
import styles from './EventsPreview.module.css';

/**
 * EventsPreview Component - Shotgun widget integration
 * 
 * @component
 * @description
 * Displays Shotgun.live events widget for The Boombox Miami.
 * Lazy-loads when in viewport for performance.
 * 
 * @example
 * <EventsPreview />
 */
const EventsPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);

  // Lazy load when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load Shotgun widget script when iframe is visible
  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://shotgun.live/widget.js"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://shotgun.live/widget.js';
        script.async = true;
        document.body.appendChild(script);
      }
      
      setIsLoaded(true);
    }
  }, [isVisible, isLoaded]);

  // Determine if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section ref={sectionRef} className={styles.eventsSection}>
      <div className={styles.container}>
        {/* Section Header */}
        {/* Shotgun Widget */}
        {isVisible && (
            <div style={{
                paddingTop: "20px",
                paddingBottom: "0px",
                marginBottom: "0px"
            }}>
                <div className={styles.shotgunWidget}>
                    <iframe
                    ref={iframeRef}
                    src="https://shotgun.live/venues/the-boombox-miami?embedded=1&ui=dark"
                    allow="payment"
                    className={styles.shotgunIframe}
                    title="The Boombox Miami Events on Shotgun"
                    loading="lazy"
                    style={{
                        width: '100%',
                        maxWidth: '100%',
                        minWidth: '100%',
                        height: isMobile ? '700px' : '900px',
                        maxHeight: isMobile ? '80vh' : 'calc(100vh - 200px)',
                        border: '0',
                        display: 'block',
                        padding: '0',
                        margin: '0'
                    }}
                    />
                </div>
            </div>
        )}

        {!isVisible && (
          <div className={styles.loadingState}>
            <div className={styles.loader}></div>
            <p>Loading events...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPreview;