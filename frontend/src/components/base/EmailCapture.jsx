/**
 * EmailCapture Component - Multi-variant email capture system
 * 
 * @component
 * @description
 * Flexible email capture component with multiple design variants,
 * analytics tracking, and email service integration
 *  s
 * Features:
 * - Multiple visual variants (hero, footer, modal, inline)
 * - GDPR-compliant consent handling
 * - Email validation and error states
 * - Success animations
 * - Analytics tracking
 * - A/B testing support
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import XPButton from '../base/XPButton';
import styles from './EmailCapture.module.css';

/**
 * Track email capture events
 * @param {string} action - Action type (view, submit, success, error)
 * @param {string} variant - Component variant
 * @param {Object} metadata - Additional data
 */
const trackEmailEvent = (action, variant, metadata = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'email_capture', {
      action,
      variant,
      ...metadata
    });
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Email event:', { action, variant, metadata });
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * EmailCapture Component
 * 
 * @param {Object} props
 * @param {'hero' | 'footer' | 'modal' | 'inline' | 'sticky'} [props.variant='inline'] - Visual variant
 * @param {string} [props.title] - Main headline
 * @param {string} [props.subtitle] - Supporting text
 * @param {string} [props.buttonText='Join the Underground'] - CTA button text
 * @param {string} [props.placeholder='Enter your email'] - Input placeholder
 * @param {boolean} [props.showConsent=true] - Show GDPR consent checkbox
 * @param {boolean} [props.showFrequency=false] - Show email frequency info
 * @param {Function} [props.onSuccess] - Callback on successful submission
 * @param {Function} [props.onClose] - Callback for modal close
 * @param {string} [props.source] - Source identifier for tracking
 */
const EmailCapture = ({ 
  variant = 'inline',
  title = "Never Miss a Show",
  subtitle = "Get exclusive access to presales and secret events",
  buttonText = "Join the Underground",
  placeholder = "Enter your email",
  showConsent = true,
  showFrequency = false,
  onSuccess,
  onClose,
  source = 'unknown'
}) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  // Track component view
  useEffect(() => {
    trackEmailEvent('view', variant, { source });
  }, [variant, source]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    // Validation
    if (!email) {
      setError('Email is required');
      trackEmailEvent('error', variant, { error: 'empty_email', source });
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      trackEmailEvent('error', variant, { error: 'invalid_email', source });
      return;
    }

    if (showConsent && !consent) {
      setError('Please accept the terms to continue');
      trackEmailEvent('error', variant, { error: 'no_consent', source });
      return;
    }

    // Submit
    setIsLoading(true);
    setError('');

    try {
      // API call to save email
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent,
          source: `${variant}_${source}`,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });

      if (!response.ok) throw new Error('Subscription failed');

      // Success handling
      setSuccess(true);
      trackEmailEvent('success', variant, { source });

      // Clear form
      setTimeout(() => {
        setEmail('');
        setConsent(false);
        if (onSuccess) onSuccess(email);
      }, 2000);

      // Store in localStorage to prevent repeat popups
      if (variant === 'modal') {
        localStorage.setItem('boombox_email_captured', 'true');
        localStorage.setItem('boombox_email_captured_date', Date.now().toString());
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
      trackEmailEvent('error', variant, { error: err.message, source });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const successVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200 }
    }
  };

  // Variant-specific content
  const content = {
    hero: {
      title: title || "Be First to Know",
      subtitle: subtitle || "Exclusive presales • Secret shows • Limited capacity",
      showFrequency: true
    },
    footer: {
      title: title || "Join 5,000+ Music Lovers",
      subtitle: subtitle || "Weekly lineup drops and special announcements",
      showFrequency: true
    },
    modal: {
      title: title || "Wait! Before You Go...",
      subtitle: subtitle || "Get exclusive access to presales before they sell out",
      showFrequency: false
    },
    inline: {
      title: title,
      subtitle: subtitle,
      showFrequency: false
    },
    sticky: {
      title: title || "This Weekend's Shows",
      subtitle: subtitle || "Get notified when tickets drop",
      showFrequency: false
    }
  };

  const currentContent = content[variant];

  return (
    <div className={`${styles.emailCapture} ${styles[variant]}`}>
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={styles.form}
          >
            {/* Close button for modal */}
            {variant === 'modal' && onClose && (
              <button
                type="button"
                onClick={onClose}
                className={styles.closeBtn}
                aria-label="Close"
              >
                ✕
              </button>
            )}

            {/* Header */}
            <div className={styles.header}>
              <h3 className={styles.title}>{currentContent.title}</h3>
              <p className={styles.subtitle}>{currentContent.subtitle}</p>
            </div>

            {/* Email Input Group */}
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched) setError('');
                  }}
                  placeholder={placeholder}
                  className={`${styles.input} ${error && touched ? styles.inputError : ''}`}
                  aria-label="Email address"
                  aria-invalid={!!error && touched}
                  aria-describedby={error ? "email-error" : undefined}
                  disabled={isLoading}
                />
                <XPButton
                  type="submit"
                  disabled={isLoading}
                  className={styles.submitBtn}
                >
                  {isLoading ? 'Joining...' : buttonText}
                </XPButton>
              </div>

              {/* Error message */}
              {error && touched && (
                <p id="email-error" className={styles.error} role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Consent checkbox */}
            {showConsent && (
              <label className={styles.consent}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className={styles.checkbox}
                  disabled={isLoading}
                />
                <span className={styles.consentText}>
                  I agree to receive emails about events and updates. 
                  <a href="/privacy" className={styles.privacyLink}> Privacy Policy</a>
                </span>
              </label>
            )}

            {/* Frequency info */}
            {currentContent.showFrequency && (
              <p className={styles.frequency}>
                📧 Weekly emails. Unsubscribe anytime. No spam ever.
              </p>
            )}

            {/* Social proof */}
            {variant === 'footer' && (
              <div className={styles.socialProof}>
                <span className={styles.avatars}>👥👥👥</span>
                <span className={styles.proofText}>
                  Join 5,234 underground music lovers
                </span>
              </div>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="success"
            variants={successVariants}
            initial="initial"
            animate="animate"
            className={styles.success}
          >
            <span className={styles.successIcon}>✅</span>
            <h3 className={styles.successTitle}>Welcome to the Underground!</h3>
            <p className={styles.successText}>
              Check your inbox for your first exclusive drop
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailCapture;