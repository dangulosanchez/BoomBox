import { Link } from 'react-router-dom';
import styles from './BlogCard.module.css';

/**
 * BlogCard Component - Individual blog post preview card
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.post - Blog post object
 * @param {boolean} [props.featured=false] - Whether this is a featured post
 * @param {string} [props.layout='grid'] - 'grid' or 'list' layout
 * 
 * @features
 * - Hover effects with image zoom
 * - Tag display
 * - Author info
 * - Published date formatting
 * - View count display
 * - Excerpt preview
 * - Responsive design
 * 
 * @example
 * <BlogCard post={postData} featured={true} />
 */
const BlogCard = ({ post, featured = false, layout = 'grid' }) => {
  
  /**
   * Format date to readable string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * Format view count with abbreviations (e.g., 1.2k)
   * @param {number} count - View count
   * @returns {string} Formatted count
   */
  const formatViewCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  /**
   * Get reading time estimate based on content length
   * @param {string} content - Post content
   * @returns {number} Estimated minutes to read
   */
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes);
  };

  return (
    <article 
      className={`${styles.blogCard} ${featured ? styles.featured : ''} ${styles[layout]}`}
    >
      <Link to={`/blog/${post.slug}`} className={styles.cardLink}>
        
        {/* Cover Image */}
        <div className={styles.imageWrapper}>
          {post.coverImage ? (
            <img 
              src={post.coverImage} 
              alt={post.title}
              className={styles.coverImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span className={styles.placeholderIcon}>📝</span>
            </div>
          )}
          
          {/* Featured Badge */}
          {featured && (
            <div className={styles.featuredBadge}>
              <span>⭐ Featured</span>
            </div>
          )}
          
          {/* Image Overlay */}
          <div className={styles.imageOverlay}></div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className={styles.tagMore}>+{post.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={styles.title}>{post.title}</h3>

          {/* Excerpt */}
          <p className={styles.excerpt}>
            {post.excerpt || 'No excerpt available...'}
          </p>

          {/* Meta Information */}
          <div className={styles.meta}>
            
            {/* Author */}
            <div className={styles.author}>
              <div className={styles.authorAvatar}>
                {post.author?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className={styles.authorName}>
                {post.author?.username || 'Anonymous'}
              </span>
            </div>

            {/* Divider */}
            <span className={styles.metaDivider}>•</span>

            {/* Date */}
            <time className={styles.date} dateTime={post.publishedAt}>
              {formatDate(post.publishedAt || post.createdAt)}
            </time>

            {/* View Count (if available) */}
            {post.viewCount > 0 && (
              <>
                <span className={styles.metaDivider}>•</span>
                <span className={styles.viewCount}>
                  👁️ {formatViewCount(post.viewCount)}
                </span>
              </>
            )}

            {/* Reading Time */}
            <span className={styles.metaDivider}>•</span>
            <span className={styles.readingTime}>
              {getReadingTime(post.content)} min read
            </span>
          </div>

        </div>
      </Link>
    </article>
  );
};

export default BlogCard;