/**
 * ExitIntentModal Component - Smart email capture modal
 * 
 * @component
 * @description
 * Detects when user is about to leave and shows email capture modal.
 * Mobile: Triggers on scroll up near top of page
 * Desktop: Triggers on mouse leaving viewport
 * 
 * Features:
 * - Smart exit detection (mobile vs desktop)
 * - Session storage to prevent repeat shows
 * - Configurable delay and sensitivity
 * - A/B testing support
 * - Analytics tracking
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailCapture from './EmailCapture';
import styles from './ExitIntentModal.module.css';

/**
 * Check if modal should be shown based on user history
 * @returns {boolean} Should show modal
 */
const shouldShowModal = () => {
  // Check if email already captured
  const emailCaptured = localStorage.getItem('boombox_email_captured');
  if (emailCaptured) return false;

  // Check if dismissed recently (24 hours)
  const dismissedAt = localStorage.getItem('boombox_modal_dismissed');
  if (dismissedAt) {
    const hoursSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
    if (hoursSinceDismissed < 24) return false;
  }

  // Check if shown in this session
  const shownThisSession = sessionStorage.getItem('boombox_modal_shown');
  if (shownThisSession) return false;

  return true;
};

/**
 * ExitIntentModal Component
 * 
 * @param {Object} props
 * @param {number} [props.delaySeconds=30] - Minimum time before showing
 * @param {number} [props.scrollThreshold=25] - Scroll % before eligible (mobile)
 * @param {boolean} [props.testMode=false] - Show immediately for testing
 * @param {string} [props.variant='A'] - A/B test variant
 */
const ExitIntentModal = ({ 
  delaySeconds = 30,
  scrollThreshold = 25,
  testMode = false,
  variant = 'A'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);

  // Track time on page
  useEffect(() => {
    if (testMode) {
      setIsEligible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsEligible(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [delaySeconds, testMode]);

  // Track scroll depth (mobile)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > scrollThreshold) {
        setHasScrolledEnough(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  // Desktop: Mouse leave detection
  const handleMouseLeave = useCallback((e) => {
    if (!isEligible || !shouldShowModal()) return;
    
    // Only trigger when mouse leaves from top (likely going to tabs/close)
    if (e.clientY <= 0) {
      setIsOpen(true);
      sessionStorage.setItem('boombox_modal_shown', 'true');
      
      // Track event
      if (window.gtag) {
        window.gtag('event', 'exit_intent_triggered', {
          variant,
          trigger: 'mouse_leave',
          time_on_page: delaySeconds
        });
      }
    }
  }, [isEligible, variant, delaySeconds]);

  // Mobile: Scroll up detection near top
  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    let lastScrollY = window.scrollY;
    let scrollUpDistance = 0;

    const handleMobileScroll = () => {
      const currentScrollY = window.scrollY;
      
      // User is scrolling up
      if (currentScrollY < lastScrollY) {
        scrollUpDistance += lastScrollY - currentScrollY;
        
        // If scrolled up 100px and near top of page, and eligible
        if (
          scrollUpDistance > 100 && 
          currentScrollY < 200 && 
          isEligible && 
          hasScrolledEnough &&
          shouldShowModal()
        ) {
          setIsOpen(true);
          sessionStorage.setItem('boombox_modal_shown', 'true');
          
          // Track event
          if (window.gtag) {
            window.gtag('event', 'exit_intent_triggered', {
              variant,
              trigger: 'scroll_up',
              scroll_depth: scrollThreshold
            });
          }
        }
      } else {
        // Reset when scrolling down
        scrollUpDistance = 0;
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleMobileScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleMobileScroll);
  }, [isEligible, hasScrolledEnough, variant, scrollThreshold]);

  // Desktop mouse leave listener
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('boombox_modal_dismissed', Date.now().toString());
    
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'exit_intent_dismissed', { variant });
    }
  };

  const handleSuccess = (email) => {
    setIsOpen(false);
    // Email already saved in EmailCapture component
    console.log('Email captured via exit intent:', email);
  };

  // Test mode: Open immediately
  useEffect(() => {
    if (testMode && isEligible) {
      setIsOpen(true);
    }
  }, [testMode, isEligible]);

  // A/B test content variants
  const contentVariants = {
    A: {
      title: "Wait! Don't Miss Out 🎵",
      subtitle: "Get exclusive presale access before events sell out (they usually do)"
    },
    B: {
      title: "Leaving Already?",
      subtitle: "Join 5,000+ underground music lovers getting secret show invites"
    },
    C: {
      title: "Before You Go...",
      subtitle: "This weekend's show has only 47 tickets left. Want first dibs next time?"
    }
  };

  const content = contentVariants[variant] || contentVariants.A;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <EmailCapture
              variant="modal"
              title={content.title}
              subtitle={content.subtitle}
              onClose={handleClose}
              onSuccess={handleSuccess}
              source={`exit_intent_${variant}`}
              showConsent={true}
              buttonText="Get Exclusive Access"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;