import styles from './QuoteBlock.module.css';

/**
 * QuoteBlock - Styled blockquote with author attribution
 * 
 * @component
 * @param {Object} props
 * @param {string} props.quote - Quote text
 * @param {string} props.author - Quote author/attribution
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * <QuoteBlock 
 *   quote="THE Boombox showcases Miami's top underground music and arts scene."
 *   author="The Boombox"
 * />
 */
const QuoteBlock = ({ quote, author, className = '' }) => {
  return (
    <blockquote className={`${styles.quote} ${className}`}>
      <p className={styles.text}>{quote}</p>
      <footer className={styles.author}>— {author}</footer>
    </blockquote>
  );
};

export default QuoteBlock;