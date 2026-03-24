import { motion } from 'framer-motion';
import XPButton from '../components/base/XPButton';
import CyberLunaWindow from '../components/base/CyberLunaWindow';
import styles from './Story.module.css';
import content from '../data/content.json';

const s = content.story;

/**
 * Story Page - The Boombox Origin Story
 * 
 * @component
 * @description
 * Tells the authentic origin story of The Boombox Miami:
 * From teenage warehouse park hangouts to becoming Miami's premier
 * underground venue. A full-circle journey rooted in local authenticity.
 * 
 * @features
 * - Photo-essay format with nostalgic aesthetic
 * - Timeline narrative structure (4 sections)
 * - Pull quotes from founders
 * - Responsive two-column layouts (desktop) / single column (mobile)
 * - Scroll-triggered animations
 * - CTA to events at the end
 * 
 * @narrative
 * Hero → Warehouse Park Days → Pull Quote → Bird Road Arts District →
 * The Vision → Today → CTA Footer
 */
const Story = () => {
  // Animation variants for scroll-triggered reveals
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className={styles.storyPage}>
      {/* ========================================
          HERO SECTION
          ======================================== */}
      <motion.section 
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className={styles.heroTitle}>{s.hero.title}</h1>
        <p className={styles.heroSubtitle}>{s.hero.subtitle}</p>
        <div className={styles.heroAccent}></div>
      </motion.section>

      {/* ========================================
          SECTION 1: THE WAREHOUSE PARK DAYS
          ======================================== */}
      <motion.section
        className={styles.timelineSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className={styles.container}>
          <CyberLunaWindow isStatic title="where_it_started.doc" bodyClassName={styles.windowContent}>
            <div className={styles.contentGrid}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>{s.section_where_it_started.title}</h2>
                <div className={styles.accentLine}></div>
                {s.section_where_it_started.paragraphs.map((p, i) => (
                  <p key={i} className={styles.bodyText}>{p}</p>
                ))}
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/owners.jpg`}
                  alt={s.section_where_it_started.image_alt}
                  className={styles.sectionImage}
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          </CyberLunaWindow>
        </div>
      </motion.section>

      {/* ========================================
          PULL QUOTE 1
          ======================================== */}
      <motion.section
        className={styles.pullQuoteSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className={styles.container}>
          <blockquote className={`${styles.pullQuote} ${styles.xpAlert}`}>
            <p className={styles.quoteText}>{s.pull_quote_1.text}</p>
            <footer className={styles.quoteAuthor}>— {s.pull_quote_1.author}</footer>
          </blockquote>
        </div>
      </motion.section>

      {/* ========================================
          SECTION 2: BIRD ROAD ARTS DISTRICT
          ======================================== */}
      <motion.section
        className={`${styles.timelineSection} ${styles.alternate}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className={styles.container}>
          <CyberLunaWindow isStatic title="bird_road_arts_district.doc" bodyClassName={styles.windowContent}>
            <div className={styles.contentGrid}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>{s.section_bird_road.title}</h2>
                <div className={styles.accentLine}></div>
                {s.section_bird_road.paragraphs.map((p, i) => (
                  <p key={i} className={styles.bodyText}>{p}</p>
                ))}
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/outside_2.jpeg`}
                  alt={s.section_bird_road.image_alt}
                  className={styles.sectionImage}
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          </CyberLunaWindow>
        </div>
      </motion.section>

      {/* ========================================
          SECTION 3: THE VISION
          ======================================== */}
      <motion.section
        className={styles.timelineSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className={styles.container}>
          <CyberLunaWindow isStatic title="the_vision.txt" bodyClassName={styles.windowContent}>
            <div className={styles.contentGrid}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>{s.section_the_vision.title}</h2>
                <div className={styles.accentLine}></div>
                {s.section_the_vision.paragraphs.map((p, i) => (
                  <p key={i} className={styles.bodyText}>{p}</p>
                ))}
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/owners_2.jpg`}
                  alt={s.section_the_vision.image_alt}
                  className={styles.sectionImage}
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          </CyberLunaWindow>
        </div>
      </motion.section>

      {/* ========================================
          PULL QUOTE 2
          ======================================== */}
      <motion.section
        className={styles.pullQuoteSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className={styles.container}>
          <blockquote className={`${styles.pullQuote} ${styles.xpAlert}`}>
            <p className={styles.quoteText}>{s.pull_quote_2.text}</p>
            <footer className={styles.quoteAuthor}>— {s.pull_quote_2.author}</footer>
          </blockquote>
        </div>
      </motion.section>

      {/* ========================================
          SECTION 4: TODAY
          ======================================== */}
      <motion.section
        className={`${styles.timelineSection} ${styles.alternate}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className={styles.container}>
          <CyberLunaWindow isStatic title="today — boombox_miami.exe" bodyClassName={styles.windowContent}>
            <div className={styles.contentGrid}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>{s.section_today.title}</h2>
                <div className={styles.accentLine}></div>
                {s.section_today.paragraphs.map((p, i) => (
                  <p key={i} className={styles.bodyText}>
                    {i === s.section_today.paragraphs.length - 1 ? <strong>{p}</strong> : p}
                  </p>
                ))}
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/owners_2.jpg`}
                  alt={s.section_today.image_alt}
                  className={styles.sectionImage}
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          </CyberLunaWindow>
        </div>
      </motion.section>

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <motion.section 
        className={styles.ctaSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className={styles.ctaTitle}>{s.cta.title}</h2>
        <p className={styles.ctaSubtext}>{s.cta.subtitle}</p>
        <XPButton as="a" href="/events">
          {s.cta.button}
        </XPButton>
      </motion.section>
    </div>
  );
};

export default Story;