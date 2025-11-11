/**
 * TicketAvailability Component - Real-time ticket availability display
 * 
 * @component
 * @description
 * Shows remaining ticket counts with visual urgency indicators
 * and animated updates to drive FOMO and conversions
 * 
 * Features:
 * - Color-coded availability levels
 * - Animated count changes
 * - "Selling fast" indicators
 * - Live update simulation
 * - Mobile-optimized display
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TicketAvailability.module.css';

/**
 * Calculate urgency level based on tickets remaining
 * @param {number} remaining - Tickets remaining
 * @param {number} capacity - Total venue capacity
 * @returns {Object} Urgency level and properties
 */
const getUrgencyLevel = (remaining, capacity) => {
  const percentRemaining = (remaining / capacity) * 100;

  if (remaining === 0) {
    return {
      level: 'soldout',
      color: '#ff0000',
      message: 'SOLD OUT',
      showCount: false,
      pulse: false
    };
  }

  if (remaining <= 10) {
    return {
      level: 'critical',
      color: '#ff4444',
      message: `Only ${remaining} left!`,
      showCount: true,
      pulse: true
    };
  }

  if (percentRemaining <= 15) {
    return {
      level: 'urgent',
      color: '#ff8800',
      message: `${remaining} tickets left`,
      subMessage: 'Selling fast',
      showCount: true,
      pulse: true
    };
  }

  if (percentRemaining <= 30) {
    return {
      level: 'limited',
      color: '#ffaa00',
      message: `${remaining} tickets remaining`,
      subMessage: 'Limited availability',
      showCount: true,
      pulse: false
    };
  }

  if (percentRemaining <= 50) {
    return {
      level: 'moderate',
      color: '#ffd700',
      message: `${remaining} tickets available`,
      showCount: true,
      pulse: false
    };
  }

  return {
    level: 'available',
    color: '#00ff00',
    message: 'Tickets available',
    showCount: false,
    pulse: false
  };
};

/**
 * TicketAvailability Component
 * 
 * @param {Object} props
 * @param {number} props.remaining - Current tickets remaining
 * @param {number} [props.capacity=200] - Total venue capacity
 * @param {string} [props.eventName] - Name of the event
 * @param {boolean} [props.showBar=true] - Show visual progress bar
 * @param {boolean} [props.compact=false] - Compact mode for inline display
 * @param {boolean} [props.animated=true] - Enable animations
 * @param {boolean} [props.liveUpdates=false] - Simulate live updates
 * @param {'inline' | 'badge' | 'banner' | 'card'} [props.variant='inline'] - Display variant
 */
const TicketAvailability = ({
  remaining: initialRemaining,
  capacity = 200,
  eventName,
  showBar = true,
  compact = false,
  animated = true,
  liveUpdates = false,
  variant = 'inline'
}) => {
  const [remaining, setRemaining] = useState(initialRemaining);
  const [previousRemaining, setPreviousRemaining] = useState(initialRemaining);
  const [isUpdating, setIsUpdating] = useState(false);
  const urgency = getUrgencyLevel(remaining, capacity);
  const updateTimeoutRef = useRef();

  // Simulate live updates (for demo/testing)
  useEffect(() => {
    if (!liveUpdates || remaining <= 0) return;

    const interval = setInterval(() => {
      // Randomly decrease by 0-3 tickets
      const decrease = Math.floor(Math.random() * 4);
      if (decrease > 0 && remaining > 0) {
        setPreviousRemaining(remaining);
        setRemaining(prev => Math.max(0, prev - decrease));
        setIsUpdating(true);
        
        // Reset updating state after animation
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = setTimeout(() => {
          setIsUpdating(false);
        }, 1000);
      }
    }, Math.random() * 10000 + 5000); // Random interval 5-15 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(updateTimeoutRef.current);
    };
  }, [liveUpdates, remaining]);

  // Track ticket decrease for analytics
  useEffect(() => {
    if (previousRemaining > remaining && window.gtag) {
      window.gtag('event', 'ticket_availability_decreased', {
        event_name: eventName,
        previous: previousRemaining,
        current: remaining,
        decrease: previousRemaining - remaining
      });
    }
  }, [remaining, previousRemaining, eventName]);

  const percentSold = ((capacity - remaining) / capacity) * 100;

  // Component variants
  const renderContent = () => {
    switch (variant) {
      case 'badge':
        return (
          <motion.div
            className={`${styles.badge} ${styles[urgency.level]}`}
            animate={animated && urgency.pulse ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={styles.badgeText}>{urgency.message}</span>
          </motion.div>
        );

      case 'banner':
        return (
          <div className={`${styles.banner} ${styles[urgency.level]}`}>
            <div className={styles.bannerContent}>
              {eventName && (
                <span className={styles.eventName}>{eventName}</span>
              )}
              <span className={styles.separator}>•</span>
              <motion.span
                className={styles.message}
                key={remaining}
                initial={animated ? { scale: 0.8, opacity: 0 } : {}}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {urgency.message}
              </motion.span>
              {urgency.subMessage && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.subMessage}>{urgency.subMessage}</span>
                </>
              )}
            </div>
            {showBar && (
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  initial={false}
                  animate={{ width: `${percentSold}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: urgency.color }}
                />
              </div>
            )}
          </div>
        );

      case 'card':
        return (
          <div className={`${styles.card} ${styles[urgency.level]}`}>
            {eventName && (
              <h4 className={styles.cardTitle}>{eventName}</h4>
            )}
            <div className={styles.cardContent}>
              <div className={styles.ticketInfo}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={remaining}
                    initial={animated ? { y: isUpdating ? -20 : 0, opacity: 0 } : {}}
                    animate={{ y: 0, opacity: 1 }}
                    exit={animated ? { y: 20, opacity: 0 } : {}}
                    transition={{ duration: 0.3 }}
                    className={styles.countWrapper}
                  >
                    {urgency.showCount && (
                      <span className={styles.bigNumber}>{remaining}</span>
                    )}
                    <span className={styles.label}>
                      {remaining === 0 ? 'SOLD OUT' : 
                       remaining === 1 ? 'ticket left' : 'tickets left'}
                    </span>
                  </motion.div>
                </AnimatePresence>
                {urgency.subMessage && (
                  <p className={styles.urgencyMessage}>{urgency.subMessage}</p>
                )}
              </div>
              {showBar && (
                <div className={styles.visualIndicator}>
                  <div className={styles.capacityBar}>
                    <motion.div
                      className={styles.soldBar}
                      initial={false}
                      animate={{ height: `${percentSold}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: urgency.color }}
                    />
                  </div>
                  <div className={styles.capacityLabels}>
                    <span className={styles.sold}>{capacity - remaining} sold</span>
                    <span className={styles.total}>/ {capacity} total</span>
                  </div>
                </div>
              )}
            </div>
            {isUpdating && (
              <motion.div
                className={styles.updateNotification}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                🔥 Someone just bought {previousRemaining - remaining} ticket{previousRemaining - remaining > 1 ? 's' : ''}!
              </motion.div>
            )}
          </div>
        );

      default: // inline
        return (
          <div className={`${styles.inline} ${compact ? styles.compact : ''} ${styles[urgency.level]}`}>
            <motion.span
              className={styles.inlineText}
              animate={animated && urgency.pulse ? { opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {urgency.level === 'soldout' ? '🚫' : '🎟️'} {urgency.message}
            </motion.span>
            {urgency.subMessage && !compact && (
              <span className={styles.inlineSubtext}> • {urgency.subMessage}</span>
            )}
          </div>
        );
    }
  };

  return renderContent();
};

export default TicketAvailability;