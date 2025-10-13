import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component - Polymorphic button with multiple variants
 * 
 * @component
 * @example
 * // Primary button
 * <Button variant="primary" size="md">
 *   Click Me
 * </Button>
 * 
 * @example
 * // Link styled as button
 * <Button as={Link} to="/events" variant="secondary">
 *   View Events
 * </Button>
 * 
 * @param {Object} props
 * @param {('button'|'a'|React.Component)} [props.as='button'] - Element or component to render as
 * @param {('primary'|'secondary'|'ghost'|'outline')} [props.variant='primary'] - Visual style variant
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Size variant
 * @param {boolean} [props.fullWidth=false] - Full width button
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.restProps - All other props passed to underlying element
 * 
 * @accessibility
 * - Uses semantic button element by default
 * - Supports aria-label for icon-only buttons
 * - Clear focus indicators
 * - Disabled state properly communicated
 */
const Button = ({ 
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...restProps 
}) => {
  // Build className string
  const classNames = [
    styles.button,
    styles[variant],
    styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  // Add disabled attribute for button elements
  const buttonProps = Component === 'button' ? { disabled } : {};

  return (
    <Component 
      className={classNames}
      aria-disabled={disabled}
      {...buttonProps}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Button;