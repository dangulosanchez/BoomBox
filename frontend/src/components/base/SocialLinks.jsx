// components/base/SocialLinks.jsx
/**
 * Minimalist, brand-authentic social links
 * - Real SVG icons (no emojis)
 * - Monochrome by default; subtle gold accent on hover/focus
 * - Preserves existing API: placement, showCounts, showLabels, direction, size, className
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './SocialLinks.module.css';
import content from '../../data/content.json';

// Inline SVG icons — no external files needed
const PLATFORM_ICONS = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.26 8.26 0 0 0 4.83 1.55V4.57a4.85 4.85 0 0 1-1.05-.12z" />
    </svg>
  ),
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

// Non-text platform metadata (URLs, follower tracking)
const PLATFORM_META = {
  instagram: { url: 'https://instagram.com/theboomboxmiami', showFollowers: true },
  tiktok:    { url: 'https://tiktok.com/@theboomboxmiami',   showFollowers: false },
  facebook:  { url: 'https://facebook.com/theboomboxmiami',  showFollowers: false },
};

// Names and usernames come from content.json
const SOCIAL_PLATFORMS = content.social_platforms.map(p => ({
  ...p,
  ...PLATFORM_META[p.id],
}));

// Format counts (kept from your original behavior)
const formatFollowerCount = (count) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
};

// Unified analytics
const trackSocialClick = (platform, placement) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social_click', {
      platform,
      placement,
      timestamp: new Date().toISOString()
    });
  }
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/social-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, placement, timestamp: Date.now() })
    }).catch(() => {});
  }
};

const SocialLinks = ({
  placement = 'footer',
  showCounts = false,
  showLabels = false,
  className = '',
  direction = 'horizontal',
  size = 'md'
}) => {
  const [followerCounts, setFollowerCounts] = useState({
    instagram: 5234,
    facebook: null,
    tiktok: null
  });
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!showCounts) return;

    const fetchFollowerCounts = async () => {
      const cacheKey = 'boombox_follower_counts';
      const cacheExpiry = 'boombox_follower_counts_expiry';

      const cached = localStorage.getItem(cacheKey);
      const expiry = localStorage.getItem(cacheExpiry);

      if (cached && expiry && Date.now() < parseInt(expiry)) {
        setFollowerCounts(JSON.parse(cached));
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/social/follower-counts');
        const data = await res.json();
        setFollowerCounts(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheExpiry, (Date.now() + 3600000).toString());
      } catch {
        // silent fallback
      } finally {
        setLoading(false);
      }
    };

    fetchFollowerCounts();
  }, [showCounts]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  }), [reduceMotion]);

  return (
    <motion.nav
      className={[
        styles.socialLinks,
        styles[placement],
        styles[direction],
        styles[size],
        className
      ].join(' ')}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Social media links"
      style={{
        justifyContent: "center"
      }}
    >
      {SOCIAL_PLATFORMS.map((p) => (
        <motion.a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          onClick={() => trackSocialClick(p.id, placement)}
          variants={itemVariants}
          whileHover={reduceMotion ? undefined : { y: -1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          aria-label={`Follow us on ${p.name}`}
        >
          {PLATFORM_ICONS[p.id]}

          {showLabels && (
            <span className={styles.label}>
              {p.name}
            </span>
          )}

          {showCounts && p.showFollowers && followerCounts[p.id] && (
            <span className={styles.followerCount} aria-label={`${p.name} followers`}>
              {loading ? '…' : formatFollowerCount(followerCounts[p.id])}
            </span>
          )}
        </motion.a>
      ))}
    </motion.nav>
  );
};

export default SocialLinks;
