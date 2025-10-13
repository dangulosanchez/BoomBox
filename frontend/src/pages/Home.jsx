import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import QuoteBlock from '../components/sections/QuoteBlock';
import Logo from '../components/base/Logo';
import styles from './Home.module.css';

/**
 * Home Page - Landing page for The Boombox
 * 
 * @component
 * @description Mirrors theboomboxmiami/index.html structure
 * 
 * @layout_strategy
 * Mobile (<992px):
 *   - Logo centered at top
 *   - Building image full width
 *   - Quote block below image
 * 
 * Desktop (≥992px):
 *   - Full-screen Hero with logo, title, subtitle, tagline
 *   - Desktop About section with image + content grid
 *   - Mobile logo and quote hidden
 * 
 * @responsive_classes
 * - .mobile-only: display: block on mobile, display: none on desktop
 * - .desktop-only: display: none on mobile, display: block on desktop
 * (Defined in globals.css)
 */
const Home = () => {
  return (
    <div className={styles.homePage}>
      {/* ========== MOBILE LAYOUT ========== */}
      
      {/* Mobile Logo Section - Hidden on desktop */}
      <div className="mobile-only" style={{ textAlign: 'center', padding: '2rem 0' }}>
        <Logo size="md" variant="black" />
      </div>

      {/* Mobile Content - Image + Quote */}
      <div className={`mobile-only ${styles.mobileContent}`}>
        <img 
          src="/images/building.jpeg" 
          alt="The Boombox exterior" 
          className={styles.mobileImage}
        />
        
        <div className={styles.mobileQuoteWrapper}>
          <QuoteBlock 
            quote="THE Boombox showcases Miami's top underground music and arts scene. Often imitated but never duplicated, 'The Box' is the place to be."
            author="The Boombox"
          />
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT ========== */}
      
      {/* Desktop Hero - Full Screen */}
      <div className="desktop-only">
        <Hero
          title="THE BOOMBOX"
          subtitle="Miami's Underground Music Scene"
          tagline="For locals, by locals"
          backgroundImage="/images/building.jpeg"
          logo={<Logo size="lg" variant="black" />}
          height="100vh"
          overlay={true}
        />
      </div>

      {/* Desktop About Section */}
      <div className="desktop-only">
        <AboutSection
          title="About The Box"
          content={
            <div>
              <p className={styles.lead}>
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
        />
      </div>
    </div>
  );
};

export default Home;