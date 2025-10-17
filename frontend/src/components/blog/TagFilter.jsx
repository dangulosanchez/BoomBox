import styles from './TagFilter.module.css';

/**
 * TagFilter Component - Tag filtering UI for blog posts
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.tags - Array of tag objects with {tag, count}
 * @param {string} props.selectedTag - Currently selected tag
 * @param {Function} props.onTagSelect - Callback when tag is clicked
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * 
 * @features
 * - Click to toggle tag filter
 * - Display post count per tag
 * - Active state indication
 * - Responsive horizontal scroll on mobile
 * 
 * @example
 * <TagFilter 
 *   tags={[{tag: 'music', count: 5}]}
 *   selectedTag="music"
 *   onTagSelect={(tag) => console.log(tag)}
 * />
 */
const TagFilter = ({ tags, selectedTag, onTagSelect, onClearFilters }) => {
  
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.tagFilter}>
      <div className={styles.tagLabel}>
        <span className={styles.labelText}>Filter by tag:</span>
      </div>
      
      <div className={styles.tagList}>
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`${styles.tagButton} ${
              selectedTag === tag ? styles.active : ''
            }`}
            aria-pressed={selectedTag === tag}
          >
            <span className={styles.tagName}>{tag}</span>
            <span className={styles.tagCount}>{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;