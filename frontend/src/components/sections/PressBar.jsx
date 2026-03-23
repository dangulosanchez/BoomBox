import styles from './PressBar.module.css';
import content from '../../data/content.json';

const { press_bar } = content.home;

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
  const pressMentions = press_bar.press_mentions;
  const notableArtists = press_bar.notable_artists;

  return (
    <section className={styles.pressBar}>
      <div className={styles.container}>
        {/* Press Mentions */}
        <div className={styles.pressSection}>
          <p className={styles.label}>{press_bar.press_label}</p>
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
        <div className={styles.divider} aria-hidden="true"></div>

        {/* Notable Artists */}
        <div className={styles.artistsSection}>
          <p className={styles.label}>{press_bar.artists_label}</p>
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