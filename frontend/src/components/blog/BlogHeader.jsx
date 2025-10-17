import styles from './BlogHeader.module.css';

/**
 * BlogHeader Component - Hero section for blog page
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} [props.subtitle] - Optional subheading text
 * @param {string} [props.backgroundImage] - Optional background image URL
 * 
 * @features
 * - Animated gradient background
 * - Optional background image with overlay
 * - Responsive typography
 * - Gold accent styling
 * 
 * @example
 * <BlogHeader 
 *   title="The Box Blog" 
 *   subtitle="Stories from Miami's underground"
 * />
 */
const BlogHeader = ({ title, subtitle, backgroundImage }) => {
  return (
    <header className={styles.blogHeader}>
      {/* Background Image (if provided) */}
      {backgroundImage && (
        <div 
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay */}
      <div className={styles.overlay}></div>
      
      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        
        {/* Decorative accent line */}
        <div className={styles.accentLine}></div>
      </div>
      
      {/* Animated background elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </header>
  );
};

export default BlogHeader;