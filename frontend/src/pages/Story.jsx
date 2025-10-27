import { motion } from 'framer-motion';
import styles from './Story.module.css';

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
 * @flow
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
        <h1 className={styles.heroTitle}>Full Circle</h1>
        <p className={styles.heroSubtitle}>
          From warehouse kids to venue owners: The story of Miami's most authentic underground space
        </p>
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
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>Where It Started</h2>
              <div className={styles.accentLine}></div>
              
              <p className={styles.bodyText}>
                Long before The Boombox became Miami's underground sanctuary, it was just 
                a forgotten warehouse park in western Miami-Dade. Not the glamorous parts 
                of the city you see in magazines — this was the suburbs, the overlooked corners 
                where kids grew up finding their own way.
              </p>
              
              <p className={styles.bodyText}>
                "I remember my friends and I used to skip school all the time and go over to 
                this little warehouse park to smoke weed, do graffiti — all our little activities," 
                recalls one of the founders. "It was our spot. Away from everything, just us and 
                the walls."
              </p>
              
              <p className={styles.bodyText}>
                The area wasn't much to look at — concrete, chain-link fences, spray paint 
                layered on top of spray paint. But for a group of restless teenagers in the early 2010s, 
                it was freedom. No rules, no authority, just raw creative expression and the kind of 
                bonding that happens when you're young and finding your identity in the margins.
              </p>
            </div>
            
            <div className={styles.imageContainer}>
              <img 
                src="images/owners.jpg"
                alt="The 3 owners of The Boombox."
                className={styles.sectionImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
          </div>
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
        <blockquote className={styles.pullQuote}>
          <div className={styles.quoteIcon}>"</div>
          <p className={styles.quoteText}>
            I think it's funny that we're throwing these huge parties there now, making a name 
            for ourselves. It all came full circle.
          </p>
          <footer className={styles.quoteAuthor}>— The Boombox Founders</footer>
        </blockquote>
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
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>The Bird Road Arts District</h2>
              <div className={styles.accentLine}></div>
              
              <p className={styles.bodyText}>
                What most people don't know is that this area — the Bird Road Arts District — 
                was Miami's original underground arts hub, long before Wynwood became the city's 
                commercialized art epicenter.
              </p>
              
              <p className={styles.bodyText}>
                Back in the 1970s, the landlord's father bought the land for next to nothing. 
                It was industrial, unglamorous, real. The neighborhood was a patchwork of carpentry 
                shops, gardening supply stores, mechanic garages — working-class Miami at its core. 
                Artists gravitated here because rent was cheap and nobody was watching.
              </p>
              
              <p className={styles.bodyText}>
                By the time the founders were teenagers in the 2010s, the district had faded from 
                public memory. The artists had moved on, the storefronts were weathered, and the 
                warehouses sat quiet. But the energy was still there, embedded in the walls, waiting 
                for someone to bring it back to life.
              </p>
              
              <p className={styles.bodyText}>
                This wasn't prime real estate. It was overlooked, forgotten, raw — and that's 
                exactly what made it perfect.
              </p>
            </div>
            
            <div className={styles.imageContainer}>
              {/* TODO: Replace with daytime exterior shot of venue/neighborhood */}
              <img 
                src="images/outside_2.jpeg" 
                alt="Bird Road Arts District warehouse exterior during daytime"
                className={styles.sectionImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
          </div>
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
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>The Vision</h2>
              <div className={styles.accentLine}></div>
              
              <p className={styles.bodyText}>
                Years later, those same kids who used to skip school and paint the walls had grown up. 
                They'd traveled, experienced different music scenes, but always felt something was missing 
                in Miami's nightlife.
              </p>
              
              <p className={styles.bodyText}>
                The city had clubs, sure — but they were corporate, overpriced, pretentious. The underground 
                was either too sketchy or didn't exist at all. Western Miami-Dade, where they grew up, 
                was a cultural desert for anyone who wanted authentic, cutting-edge music experiences.
              </p>
              
              <p className={styles.bodyText}>
                So they decided to create what they always wanted: a space that felt like home. 
                Somewhere that honored the underground but stayed legal and safe. A venue that served 
                the community they came from — locals, artists, outsiders, misfits. People who just wanted 
                real music, real vibes, no bullshit.
              </p>
              
              <p className={styles.bodyText}>
                In 2018, The Boombox opened its doors in the exact same warehouse park where they used 
                to hang out as teenagers. The full circle wasn't planned — it just happened.
              </p>
            </div>
            
            <div className={styles.imageContainer}>
              {/* TODO: Replace with interior venue shot or crowd energy photo */}
              <img 
                src="images/owners_2.jpg" 
                alt="The Boombox venue interior with crowd at event"
                className={styles.sectionImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
          </div>
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
        <blockquote className={styles.pullQuote}>
          <div className={styles.quoteIcon}>"</div>
          <p className={styles.quoteText}>
            People still do graffiti there. Our spot has gotten hit a couple of times. 
            It's cool to see there are still kids on a mission.
          </p>
          <footer className={styles.quoteAuthor}>— The Boombox Founders</footer>
        </blockquote>
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
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>Today</h2>
              <div className={styles.accentLine}></div>
              
              <p className={styles.bodyText}>
                Six years later, The Boombox has become what it was always meant to be: Miami's 
                underground sanctuary. A place where emerging artists find their voice and music 
                lovers discover their next obsession.
              </p>
              
              <p className={styles.bodyText}>
                The walls still get tagged. The neighborhood hasn't changed much. The venue is still 
                in the same unglamorous part of town. And that's the point.
              </p>
              
              <p className={styles.bodyText}>
                While other venues chase trends and instagram aesthetics, The Boombox stays rooted in 
                what it's always been: authentic, local, for the people who get it. The same kids who 
                grew up feeling like outsiders now have a home. The same community that raised the 
                founders now has a space to call their own.
              </p>
              
              <p className={styles.bodyText}>
                From skipping school to running the show. From spray paint on walls to hosting 
                international artists. From forgotten warehouse to cultural landmark.
              </p>
              
              <p className={styles.bodyText}>
                <strong>Full circle.</strong>
              </p>
            </div>
            
            <div className={styles.imageContainer}>
              {/* TODO: Replace with modern day venue photo showing current vibe */}
              <img 
                src="images/owners_2.jpg" 
                alt="The Boombox today - Miami's underground music venue"
                className={styles.sectionImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
          </div>
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
        <h2 className={styles.ctaTitle}>Experience The Boombox Yourself</h2>
        <p className={styles.ctaSubtext}>
          See what 6 years of authentic underground culture looks like.
        </p>
        <a href="/events" className={styles.ctaButton}>
          See Upcoming Events
        </a>
      </motion.section>
    </div>
  );
};

export default Story;