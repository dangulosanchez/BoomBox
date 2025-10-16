import styles from './PressBar.module.css';

/**
 * PressBar Component - Press mentions and notable artists
 * 
 * @component
 * @description
 * Displays press features and notable artists in a minimal, confident way.
 * Shows authority without being boastful - "quiet confidence"
 * 
 * @example
 * <PressBar />
 */
const PressBar = () => {
  // TODO: Replace with actual press logos/links when available
  const pressMentions = [
    { name: 'Miami New Times', url: 'https://www.miaminewtimes.com/music/miami-venue-the-boombox-reopens-23713817/' }
  ];

  // TODO: Add more notable artists as they perform
  const notableArtists = [
    'RXK Nephew',
    'Jensen Interceptor',
    'DJ Seinfeld',
    'Mall Grab',
    'INVT'
  ];

  return (
    <section className={styles.pressBar}>
      <div className={styles.container}>
        {/* Press Mentions */}
        <div className={styles.pressSection}>
          <p className={styles.label}>As seen in:</p>
          <div className={styles.pressList}>
            {pressMentions.map((press, index) => (
              <a 
                key={index}
                href={press.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pressLink}
              >
                {press.name}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true">•</div>

        {/* Notable Artists */}
        <div className={styles.artistsSection}>
          <p className={styles.label}>Artists who've graced our stage:</p>
          <div className={styles.artistsList}>
            {notableArtists.map((artist, index) => (
              <span key={index} className={styles.artist}>
                {artist}
                {index < notableArtists.length - 1 && (
                  <span className={styles.separator} aria-hidden="true"> • </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressBar;