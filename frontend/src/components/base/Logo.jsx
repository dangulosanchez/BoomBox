import styles from './Logo.module.css';

/**
 * Logo Component - The Boombox logo with size variants
 * 
 * @component
 * @param {Object} props
 * @param {('black'|'new')} [props.variant='new'] - Logo variant (black or new)
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Size variant
 * @param {string} [props.alt='The Boombox Logo'] - Alt text for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * // Small logo for navbar
 * <Logo size="sm" variant="new" />
 * 
 * @example
 * // Large logo for hero section
 * <Logo size="lg" variant="black" />
 */
const Logo = ({ 
  variant = 'new', 
  size = 'md', 
  alt = 'The Boombox Logo',
  className = ''
}) => {
  // Map variant to image file
  const logoSrc = variant === 'new'
    ? `${process.env.PUBLIC_URL}/images/new logo.png`
    : `${process.env.PUBLIC_URL}/images/logo_black.png`;

  // Build className
  const classNames = [
    styles.logo,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <img 
      src={logoSrc}
      alt={alt}
      className={classNames}
    />
  );
};

export default Logo;