import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import Logo from '../components/base/Logo';
import Button from '../components/base/Button';
import styles from './Home.module.css';

/**
 * Home Page - Complete experience with content parity & CTA
 * 
 * @component
 * @improvements
 * - Mobile now has About content (not just quote)
 * - Added strong CTA section (Shotgun events)
 * - Fixed logo centering
 * - Maintained fast performance
 * - Progressive disclosure (essential first, details fold)
 */
const Home = () => {
  return (
    <>
      {/* ========== MOBILE LAYOUT ========== */}
      <div className={`${styles.mobileHome} mobile-only`}>
        {/* Logo Section - FIXED CENTERING */}
        <div className={styles.mobileLogoSection}>
          <Logo size="md" variant="black" />
        </div>

        {/* Hero Image with Gradient Overlay */}
        <div className={styles.mobileImageWrapper}>
          <img 
            src="/images/building.jpeg" 
            alt="The Boombox - Miami's Underground Music Venue" 
            className={styles.mobileHeroImage}
            loading="eager"
          />
          <div className={styles.mobileImageGradient}></div>
        </div>

        {/* Tagline - Short & Punchy */}
        <div className={styles.mobileTagline}>
          <h1 className={styles.taglineText}>For locals, by locals</h1>
        </div>

        {/* Quote Section */}
        <div className={styles.mobileQuoteSection}>
          <div className={styles.accentLine}></div>
          
          <blockquote className={styles.quote}>
            <span className={styles.quoteIcon} aria-hidden="true">"</span>
            <p className={styles.quoteText}>
              THE Boombox showcases Miami's top underground music and arts scene. 
              Often imitated but never duplicated, "The Box" is the place to be.
            </p>
            <footer className={styles.quoteAuthor}>— THE BOOMBOX</footer>
          </blockquote>
        </div>

        {/* About Content - Mobile Optimized */}
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

        {/* CTA Section - Primary Action */}
        <div className={styles.mobileCTA}>
          <h2 className={styles.ctaTitle}>Upcoming Events</h2>
          <p className={styles.ctaSubtext}>
            Check out what's happening at The Box
          </p>
          
          <div className={styles.ctaButtons}>
            <Button 
              as="a"
              href="https://shotgun.live/en/venues/the-boombox-miami"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              fullWidth
            >
              View Events on Shotgun
            </Button>
          </div>
          
          {/* Optional: Secondary CTAs */}
          <div className={styles.secondaryCTAs}>
            <a href="#" className={styles.secondaryLink}>
              Contact Us
            </a>
            <span className={styles.linkDivider}>•</span>
            <a href="#" className={styles.secondaryLink}>
              Gallery
            </a>
          </div>
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="desktop-only">
        {/* Full-screen Hero */}
        <Hero
          title="THE BOOMBOX"
          subtitle="Miami's Underground Music Scene"
          tagline="For locals, by locals"
          backgroundImage="/images/building.jpeg"
          logo={<Logo size="lg" variant="black" />}
          height="100vh"
          overlay={true}
        >
          {/* CTA in Desktop Hero */}
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <Button 
              as="a"
              href="https://shotgun.live/en/venues/the-boombox-miami"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
            >
              View Upcoming Events
            </Button>
          </div>
        </Hero>

        {/* About Section */}
        <AboutSection
          title="About The Box"
          content={
            <div>
              <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>
                THE Boombox showcases Miami's top underground music and arts scene. 
                Often imitated but never duplicated, "The Box" is the place to be.
              </p>
              <p>
                We're a community hub where emerging artists find their voice and 
                music lovers discover their next obsession. High-energy electronic 
                nights, intimate acoustic sets, art exhibitions, and cultural 
                celebrations—we bring Miami's underground to life.
              </p>
            </div>
          }
          stats={[
            { number: '500+', label: 'Events Hosted' },
            { number: '10+', label: 'Years Active' },
            { number: '1000+', label: 'Artists Featured' }
          ]}
          image="/images/building.jpeg"
          imageAlt="The Boombox venue exterior"
        />
      </div>
    </>
  );
};

export default Home;