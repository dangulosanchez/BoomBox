import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import PressBar from '../components/sections/PressBar';
import TestimonialSection from '../components/sections/TestimonialSection';
import EventsPreview from '../components/sections/EventsPreview';
import Logo from '../components/base/Logo';
import Button from '../components/base/Button';
import StickyMobileCTA from '../components/base/StickyMobileCTA';
import styles from './Home.module.css';

/**
 * Home Page - Complete conversion-optimized experience
 * 
 * @component
 * @improvements (Phase 2 - Conversion Optimization)
 * - Added press/authority bar (Miami New Times, notable artists)
 * - Added testimonials section with social proof
 * - Added upcoming events preview with placeholder cards
 * - Enhanced hero CTA with urgency/social proof
 * - Added mobile sticky CTA bar
 * - Updated copy to be more benefit-driven
 * - Prepared Shotgun widget integration point
 * 
 * @flow
 * Hero → Press Bar → About → Testimonials → Events Preview
 */
const Home = () => {
  return (
    <>
      {/* ========== MOBILE LAYOUT ========== */}
      <div className={`${styles.mobileHome} mobile-only`}>
        <div className={styles.mobileLogoSection}>
          <Logo size="md" variant="black" />
        </div>

        <div className={styles.mobileImageWrapper}>
          <img 
            src="/images/building.jpeg" 
            alt="The Boombox - Miami's Underground Music Venue" 
            className={styles.mobileHeroImage}
            loading="eager"
          />
          <div className={styles.mobileImageGradient}></div>
        </div>

        <div className={styles.mobileTagline}>
          <h1 className={styles.taglineText}>For locals, by locals</h1>
        </div>

        <div className={styles.mobileQuoteSection}>
          <div className={styles.accentLine}></div>
          
          <blockquote className={styles.quote}>
            <span className={styles.quoteIcon} aria-hidden="true">"</span>
            <p className={styles.quoteText}>
              For 6 years, The Boombox has been Miami's underground sanctuary — 
              where emerging artists find their voice and music lovers discover their next obsession. 
              Often imitated, never duplicated.
            </p>
            <footer className={styles.quoteAuthor}>— THE BOOMBOX</footer>
          </blockquote>
        </div>

        <PressBar />

        <div className={styles.mobileAboutSection}>
          <h2 className={styles.mobileAboutTitle}>About The Box</h2>
          <div className={styles.accentLine}></div>
          
          <p className={styles.mobileAboutText}>
            We're a community hub where emerging artists find their voice and 
            music lovers discover their next obsession.
          </p>
          
          <p className={styles.mobileAboutText}>
            High-energy electronic nights, intimate acoustic sets, art exhibitions, 
            and cultural celebrations—we bring Miami's underground to life.
          </p>

          {/* Stats Row - Compact Mobile Version */}
          <div className={styles.mobileStatsRow}>
            <div className={styles.mobileStat}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Events</div>
            </div>
            <div className={styles.mobileStat}>
              <div className={styles.statNumber}>10+</div>
              <div className={styles.statLabel}>Years</div>
            </div>
            <div className={styles.mobileStat}>
              <div className={styles.statNumber}>1000+</div>
              <div className={styles.statLabel}>Artists</div>
            </div>
          </div>
        </div>

        {/* <TestimonialSection /> */}

        <div data-section="events">
          <EventsPreview />
        </div>
      </div>

      <div className="desktop-only">
        <Hero
          title="THE BOOMBOX"
          subtitle="Miami's Underground: All Its Corners. One Community."
          tagline=""
          backgroundImage="/images/building.jpeg"
          logo={<Logo size="lg" variant="black" />}
          height="100vh"
          overlay={true}
        >
          <div className={styles.heroCTAWrapper}>
            {/* TODO: Resolve latest event */}
            {/* <p className={styles.heroTeaser}>
              Coming up: Bassline Fridays • This Saturday
            </p> */}
            <Button 
              as="a"
              href="https://shotgun.live/en/venues/the-boombox-miami"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
            >
              See What's Happening
            </Button>
            <p className={styles.heroSupport}>
              Authentic Miami. Zero Tourist Traps.
            </p>
          </div>
        </Hero>

        <PressBar />

        <AboutSection
          title="About The Box"
          content={
            <div>
              <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>
                The Boombox has been Miami’s underground refuge for six years, 
                a place where artists experiment and audiences fall in love with what’s next.
              </p>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                In the Bird Road Arts District, we mix music, art, and culture into one space. Electronic nights, 
                live sessions, and exhibitions are examples of  events that celebrate what Miami truly sounds and feels like.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '2rem', 
                marginTop: '3rem' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: 'var(--color-accent-gold)',
                    marginBottom: '0.5rem'
                  }}>300+</div>
                  <div style={{ 
                    fontSize: '1rem', 
                    color: 'var(--color-text-secondary)' 
                  }}>Events Hosted</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: 'var(--color-accent-gold)',
                    marginBottom: '0.5rem'
                  }}>6+</div>
                  <div style={{ 
                    fontSize: '1rem', 
                    color: 'var(--color-text-secondary)' 
                  }}>Years Strong</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: 'var(--color-accent-gold)',
                    marginBottom: '0.5rem'
                  }}>500+</div>
                  <div style={{ 
                    fontSize: '1rem', 
                    color: 'var(--color-text-secondary)' 
                  }}>Artists Showcased</div>
                </div>
              </div>
            </div>
          }
          image="/images/building.jpeg"
        />

        {/* <TestimonialSection /> */}

        <div data-section="events">
          <EventsPreview />
        </div>
      </div>

      <StickyMobileCTA 
        eventName="See Upcoming Shows"
        ctaText="View Events"
      />
    </>
  );
};

export default Home;