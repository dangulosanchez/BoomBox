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

// Central config (icons = real assets)
const SOCIAL_PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/theboomboxmiami',
    iconSrc: '/icons/instagram.svg',
    username: '@theboomboxmiami',
    showFollowers: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://tiktok.com/@theboomboxmiami',
    iconSrc: '/icons/tiktok.png',
    username: '@theboomboxmiami',
    showFollowers: false
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/theboomboxmiami',
    iconSrc: '/icons/facebook.png',
    username: 'The Boombox Miami',
    showFollowers: false
  }
];

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
          {/* Real SVG icon */}
          <img
            src={p.iconSrc}
            alt=""
            className={styles.icon}
            width="20"
            height="20"
            aria-hidden="true"
          />

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
