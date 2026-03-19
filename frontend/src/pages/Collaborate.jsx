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
import styles from './Collaborate.module.css';

const Collaborate = () => {
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // FAQ data
  const faqs = [
    {
      question: "Do you rent the venue for private events like birthdays or weddings?",
      answer: "We focus on music and community events rather than private celebrations. However, if you have a creative concept that aligns with our vibe, reach out and let's talk!"
    },
    {
      question: "What's the difference between \"renting\" and \"collaborating\"?",
      answer: "We don't do traditional venue rentals where you pay a flat fee. Instead, we collaborate on events—sharing responsibilities, costs, and revenue. This keeps us invested in your success and maintains our community-first approach."
    },
    {
      question: "How far in advance should I reach out?",
      answer: "For event collaborations: 4-8 weeks minimum. For rehearsal space: 1-2 weeks. For vendor spots: ASAP as spaces fill quickly."
    },
    {
      question: "What's your capacity?",
      answer: "200 people. It's intimate, which creates an incredible energy."
    },
    {
      question: "Is parking really free?",
      answer: "Yes! Abundant free parking—one of our biggest advantages over downtown/South Beach venues."
    },
    {
      question: "What genres/styles do you prioritize?",
      answer: "We're genre-agnostic! Electronic, hip-hop, indie, emo, punk, live bands—if it's authentic and brings community together, we're interested."
    }
  ];

  // Collaboration card data
  const collaborationTypes = [
    {
      id: 'events',
      icon: '🎉',
      title: 'Event Collaborations',
      subtitle: 'Bring Your Vision to Life',
      description: `Have an event concept? Let's make it happen together. We partner with promoters, collectives, and artists to host unforgettable nights—from underground raves to live shows, genre-fluid parties to themed experiences.`,
      howItWorks: [
        'We discuss your vision and audience',
        'Collaborate on talent, production, and promotion',
        'Split door sales and bar revenue (terms negotiated)',
        'You bring the vibe, we bring the space and infrastructure'
      ],
      perfectFor: [
        'Event promoters and collectives',
        'DJs and artists building their brand',
        'Genre-specific nights (electronic, hip-hop, indie, emo, etc.)',
        'Themed parties and cultural events'
      ],
      ctaText: 'Propose an Event',
      ctaLink: '/contact?type=event-collaboration',
      additionalInfo: ['Response time: 48-72 hours', 'Capacity: 200 people']
    },
        {
      id: 'vendor',
      icon: '🛍️',
      title: 'Vendor & Community Events',
      subtitle: 'Join Our Market Days',
      description: `Calling all vendors, artisans, and small businesses! The Boombox regularly hosts flea markets, car shows, coffee Sundays, and community gatherings. We're always looking for quality vendors to participate and showcase their goods.`,
      eventTypes: [
        'Weekly Coffee Sundays (featuring Kujo\'s Coffee)',
        'Monthly flea markets and pop-up shops',
        'Car shows and automotive meetups',
        'Art markets and creative showcases',
        'Seasonal community festivals'
      ],
      perfectFor: [
        'Vintage and handmade goods vendors',
        'Food and beverage vendors',
        'Artists and craftspeople',
        'Car enthusiasts and collectors',
        'Local small businesses'
      ],
      ctaText: 'Apply as a Vendor',
      ctaLink: '/contact?type=vendor-community',
      additionalInfo: ['Booth fees and details shared upon approval', 'Priority given to local/independent vendors']
    },
    {
      id: 'rehearsal',
      icon: '🎸',
      title: 'Rehearsal Space Rental',
      subtitle: 'Perfect Your Sound',
      description: `Need a space to rehearse, record, or create? The Boombox offers our venue as a rehearsal space for bands, musicians, and performers during off-hours. Full sound system, stage setup, and room to work on your craft.`,
      whatYouGet: [
        'Professional sound system and stage',
        '200-person capacity space (great for full band setup)',
        'Flexible booking during non-event hours',
        'Secure, private environment',
        'Affordable rates for local artists'
      ],
      perfectFor: [
        'Bands preparing for shows',
        'Musicians refining their set',
        'Performers rehearsing with full production',
        'Recording sessions and content creation'
      ],
      ctaText: 'Book Rehearsal Time',
      ctaLink: '/contact?type=rehearsal-space',
      additionalInfo: ['Hourly and daily rates available', 'Weekday availability']
    },
  ];

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
            Work With Us
          </motion.h1>
          <motion.h2 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We don't rent our space.
          </motion.h2>
          <motion.h2 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{fontSize: "32px"}}
          >
            We build partnerships with our community
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

      {/* ========== PHILOSOPHY SECTION ========== */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <motion.div
            className={styles.philosophyContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.philosophyLeft}>
              <span className={styles.philosophyEyebrow}>Our approach</span>
              <h2 className={styles.philosophyTitle}>More than a venue</h2>
            </div>
            <div className={styles.philosophyRight}>
              <p className={styles.philosophyText}>
                We work with promoters, artists, vendors, and creators who share our values of authenticity,
                creativity, and inclusivity. Every collaboration is a partnership — we invest in your success
                because your success is ours.
              </p>
              <div className={styles.statsBar}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>300+</div>
                  <div className={styles.statLabel}>Collaborations</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>6+</div>
                  <div className={styles.statLabel}>Years strong</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>200</div>
                  <div className={styles.statLabel}>Capacity</div>
                </div>
              </div>
            </div>
          </motion.div>
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
            Three Ways to Work With Us
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
                <CollaborationCard {...collab} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Common Questions
          </motion.h2>
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
                  <svg 
                    className={styles.faqIcon}
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
            <h2 className={styles.finalCtaTitle}>Ready to Work Together?</h2>
            <p className={styles.finalCtaText}>
              Whether you're planning an event, need rehearsal space, or want to join our vendor community—we'd love to hear from you.
            </p>
            <div className={styles.finalCtaButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                Send Us Your Idea
              </Link>
              <Link to="/showcasing" className={styles.secondaryBtn}>
                See What We've Done
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Collaborate;