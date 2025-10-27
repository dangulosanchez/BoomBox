/**

 */

import { motion } from 'framer-motion';
import styles from './Events.module.css';

const Events = () => {

  return (
    <div className={styles.collaboratePage}>
      <section className={styles.hero} style={{
        background: 
            "var(--gradient-overlay), url('/images/cool_2.jpeg') center/cover no-repeat"
      }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Work With Us
          </motion.h1>
          <motion.h2 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We don't rent our space—we build partnerships with our community
          </motion.h2>
          <motion.p 
            className={styles.heroText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join promoters, artists, vendors, and creators who share our values of authenticity, creativity, and inclusivity
          </motion.p>
          <motion.div 
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span>Explore Opportunities</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;