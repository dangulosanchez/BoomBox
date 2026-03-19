import { Link } from 'react-router-dom';
import XPButton from '../components/base/XPButton';
import styles from './Placeholder.module.css';

/**
 * Placeholder - Generic placeholder page for unfinished routes
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {string} [props.message='Coming Soon'] - Message to display
 * @param {boolean} [props.showBackButton=true] - Show back to home button
 * 
 * @example
 * <Placeholder 
 *   title="Gallery" 
 *   subtitle="Moments Captured"
 *   message="Coming Soon in Phase 2"
 * />
 */
const Placeholder = ({ 
  title, 
  subtitle, 
  message = 'Coming Soon',
  showBackButton = true 
}) => {
  return (
    <div className={styles.placeholder}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        <p className={styles.message}>{message}</p>
        
        {showBackButton && (
          <XPButton as={Link} to="/">
            ← Back to Home
          </XPButton>
        )}
      </div>
    </div>
  );
};

export default Placeholder;