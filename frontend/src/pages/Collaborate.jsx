/**
 * ============================================
 * COLLABORATE PAGE - The Boombox Miami
 * ============================================
 * 
 * A comprehensive page showcasing three ways to work with The Boombox:
 * 1. Event Collaborations - Partner on unforgettable nights
 * 2. Rehearsal Space Rental - Perfect your sound
 * 3. Vendor & Community Events - Join our market days
 * 
 * Features:
 * - Welcoming hero section with venue photo
 * - Philosophy section explaining collaboration model
 * - Three-column opportunity cards (responsive grid)
 * - FAQ accordion section
 * - Strong CTAs throughout
 * - Mobile-optimized layout
 * - 100% design system compliance
 * 
 * @component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CollaborationCard from '../components/sections/CollaborationCard';
import CyberLunaWindow from '../components/base/CyberLunaWindow';
import XPButton from '../components/base/XPButton';
import styles from './Collaborate.module.css';
import content from '../data/content.json';

const c = content.collaborate;

// IDs that open a CyberLunaWindow instead of navigating
const WINDOW_IDS = new Set(['events', 'vendor']);

// Window body content rendered inside the CyberLunaWindow
const CollabWindowContent = ({ collab }) => (
  <div className={styles.windowBody}>
    <p className={styles.windowDesc}>{collab.description}</p>

    {collab.howItWorks && (
      <div className={styles.windowSection}>
        <h4 className={styles.windowSectionLabel}>{c.window_sections.how_it_works}</h4>
        <ol className={styles.windowList}>
          {collab.howItWorks.map((item, i) => (
            <li key={i} className={styles.windowListItem}>
              <span className={styles.windowStep}>{String(i + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    )}

    {collab.eventTypes && (
      <div className={styles.windowSection}>
        <h4 className={styles.windowSectionLabel}>{c.window_sections.event_types}</h4>
        <ul className={styles.windowBullets}>
          {collab.eventTypes.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    <div className={styles.windowSection}>
      <h4 className={styles.windowSectionLabel}>{c.window_sections.perfect_for}</h4>
      <div className={styles.windowTags}>
        {collab.perfectFor.map((item, i) => (
          <span key={i} className={styles.windowTag}>{item}</span>
        ))}
      </div>
    </div>

    <div className={styles.windowFooter}>
      {collab.additionalInfo?.map((info, i) => (
        <span key={i} className={styles.windowInfo}>{info}</span>
      ))}
      <XPButton as="a" href={collab.ctaLink} className={styles.windowCta}>
        {collab.ctaText} →
      </XPButton>
    </div>
  </div>
);

const Collaborate = () => {
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Active CyberLunaWindow
  const [activeWindow, setActiveWindow] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = c.faq.items;

  // Non-text data kept locally (icons, route links)
  const OPPORTUNITY_META = {
    events:    { ctaLink: '/contact?type=event-collaboration' },
    vendor:    { ctaLink: '/contact?type=vendor-community' },
    rehearsal: { ctaLink: '/contact?type=rehearsal-space' },
  };

  const collaborationTypes = c.opportunities.map(opp => ({
    ...opp,
    ...OPPORTUNITY_META[opp.id],
    howItWorks:     opp.how_it_works,
    eventTypes:     opp.event_types,
    whatYouGet:     opp.what_you_get,
    perfectFor:     opp.perfect_for,
    ctaText:        opp.cta_text,
    additionalInfo: opp.additional_info,
  }));

  return (
    <div className={styles.collaboratePage}>
      {/* ========== HERO SECTION ========== */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {c.hero.title}
          </motion.h1>
          <motion.h2
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {c.hero.subtitle_1}
          </motion.h2>
          <motion.h2
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{fontSize: "32px"}}
          >
            {c.hero.subtitle_2}
          </motion.h2>
          <motion.p
            className={styles.heroText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {c.hero.body}
          </motion.p>
          <motion.div
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span>{c.hero.scroll_indicator}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ========== PHILOSOPHY SECTION ========== */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <CyberLunaWindow isStatic title="venue_philosophy.txt" bodyClassName={styles.windowContent}>
            <motion.div
              className={styles.philosophyContent}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.philosophyLeft}>
                <span className={styles.philosophyEyebrow}>{c.philosophy.eyebrow}</span>
                <h2 className={styles.philosophyTitle}>{c.philosophy.title}</h2>
              </div>
              <div className={styles.philosophyRight}>
                <p className={styles.philosophyText}>{c.philosophy.body}</p>
                <div className={styles.statsBar}>
                  {c.philosophy.stats.map((stat, i) => (
                    <div key={i} className={styles.statItem}>
                      <div className={styles.statNumber}>{stat.number}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </CyberLunaWindow>
        </div>
      </section>

      {/* ========== OPPORTUNITIES GRID SECTION ========== */}
      <section className={styles.opportunitiesSection}>
        <div className={styles.container}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {c.opportunities_title}
          </motion.h2>
          <div className={styles.opportunitiesGrid}>
            {collaborationTypes.map((collab, index) => (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <CollaborationCard
                  {...collab}
                  onCtaClick={
                    WINDOW_IDS.has(collab.id)
                      ? () => setActiveWindow(collab.id)
                      : undefined
                  }
                />
              </motion.div>
            ))}
          </div>

          {/* CyberLunaWindow modals */}
          {collaborationTypes
            .filter((c) => c.id === activeWindow)
            .map((c) => (
              <CyberLunaWindow
                key={c.id}
                title={c.title}
                onClose={() => setActiveWindow(null)}
              >
                <CollabWindowContent collab={c} />
              </CyberLunaWindow>
            ))}
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <CyberLunaWindow isStatic title={c.faq.title} bodyClassName={styles.windowContent}>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    className={`${styles.faqQuestion} ${openFaqIndex === index ? styles.active : ''}`}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                  >
                    <span>{faq.question}</span>
                    <span className={styles.faqToggle} aria-hidden="true">
                      {openFaqIndex === index ? '–' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CyberLunaWindow>
        </div>
      </section>

      {/* ========== FINAL CTA SECTION ========== */}
      <section className={styles.finalCtaSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.finalCtaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.finalCtaTitle}>{c.final_cta.title}</h2>
            <p className={styles.finalCtaText}>{c.final_cta.body}</p>
            <div className={styles.finalCtaButtons}>
              <XPButton as={Link} to="/contact">
                {c.final_cta.button_primary}
              </XPButton>
              <XPButton as={Link} to="/showcasing">
                {c.final_cta.button_secondary}
              </XPButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Collaborate;