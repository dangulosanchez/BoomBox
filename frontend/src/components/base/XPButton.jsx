import styles from './XPButton.module.css';

/**
 * XPButton — Windows XP "Luna" Default Blue style button
 *
 * Polymorphic: pass `as="a"` or `as={Link}` to render as a link.
 *
 * @param {Object} props
 * @param {('button'|'a'|React.Component)} [props.as='button']
 * @param {string} [props.type='button']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
const XPButton = ({
  as: Component = 'button',
  type = 'button',
  className = '',
  children,
  ...restProps
}) => {
  const buttonProps = Component === 'button' ? { type } : {};

  return (
    <Component
      className={`${styles.xpButton} ${className}`}
      {...buttonProps}
      {...restProps}
    >
      <span className={styles.xpLabel}>{children}</span>
    </Component>
  );
};

export default XPButton;
