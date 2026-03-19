import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './CyberLunaWindow.module.css';

// Global z-index counter — clicking any window brings it above the rest
let zCounter = 1000;

/**
 * CyberLunaWindow
 *
 * XP "Luna" window chrome recoloured with The Boombox dark palette.
 * Draggable via the title bar. Stacks correctly across multiple instances.
 *
 * @param {string}          title
 * @param {React.ReactNode} children
 * @param {() => void}      onClose
 * @param {() => void}      [onMinimize]
 * @param {() => void}      [onMaximize]
 * @param {{ x: number, y: number }} [defaultPosition]
 * @param {number}          [minWidth=400]
 * @param {string}          [className]
 */
const CyberLunaWindow = ({
  title = 'Window',
  children,
  onClose,
  onMinimize,
  onMaximize,
  defaultPosition,
  minWidth = 400,
  className = '',
}) => {
  // Centre on first render if no explicit position given
  const initPos = defaultPosition ?? {
    x: typeof window !== 'undefined' ? Math.max(0, (window.innerWidth - minWidth) / 2) : 100,
    y: typeof window !== 'undefined' ? Math.max(0, window.innerHeight * 0.15) : 80,
  };

  const [position, setPosition] = useState(initPos);
  const [zIndex, setZIndex] = useState(() => ++zCounter);

  // Use refs for drag state to avoid stale closures in the global listeners
  const posRef = useRef(initPos);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const bringToFront = useCallback(() => {
    setZIndex(++zCounter);
  }, []);

  const handleTitleBarMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    e.preventDefault(); // prevent text selection while dragging
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      const next = {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      };
      posRef.current = next;
      setPosition(next);
    };
    const onUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div
      className={`${styles.window} ${className}`}
      style={{ left: position.x, top: position.y, zIndex, minWidth }}
      onMouseDown={bringToFront}
    >
      {/* ── Title Bar ── */}
      <div className={styles.titleBar} onMouseDown={handleTitleBarMouseDown}>
        {/* Window icon placeholder — keeps symmetry */}
        <span className={styles.windowIcon} aria-hidden="true">◈</span>

        <span className={styles.titleText}>{title}</span>

        <div className={styles.controls}>
          <button
            className={`${styles.controlBtn} ${styles.minimizeBtn}`}
            onClick={onMinimize}
            onMouseDown={(e) => e.stopPropagation()}
            title="Minimize"
            type="button"
          >
            <span className={styles.minimizeIcon} />
          </button>

          <button
            className={`${styles.controlBtn} ${styles.maximizeBtn}`}
            onClick={onMaximize}
            onMouseDown={(e) => e.stopPropagation()}
            title="Maximize"
            type="button"
          >
            <span className={styles.maximizeIcon} />
          </button>

          <button
            className={`${styles.controlBtn} ${styles.closeBtn}`}
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            title="Close"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Content Body ── */}
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
};

export default CyberLunaWindow;
