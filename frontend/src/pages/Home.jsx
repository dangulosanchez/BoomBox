import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import PressBar from '../components/sections/PressBar';
import EventsPreview from '../components/sections/EventsPreview';
import Logo from '../components/base/Logo';
import XPButton from '../components/base/XPButton';
import SocialLinks from '../components/base/SocialLinks';
import styles from './Home.module.css';

const Home = () => {
  return (
    <>
      <Hero
        title="THE BOOMBOX"
        subtitle="For locals, by locals."
        backgroundImage={`${process.env.PUBLIC_URL}/images/building.jpeg`}
        logo={<Logo size="lg" variant="black"/>}
        height="100vh"
        overlay={true}
      >
        <XPButton
          as="a"
          href="https://shotgun.live/en/venues/the-boombox-miami"
          target="_blank"
          rel="noopener noreferrer"
        >
          See What's Happening
        </XPButton>
        <p className={styles.heroSupport}>
          Authentic Miami. Zero Tourist Traps.
        </p>
      </Hero>

      <div data-section="events">
        <EventsPreview />
      </div>

      <PressBar />

      <AboutSection
        title="About The Box"
        content={
          <div>
            <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>
              The Boombox has been Miami's underground refuge for six years,
              a place where artists experiment and audiences fall in love with what's next.
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
              In the Bird Road Arts District, we mix music, art, and culture into one space. Electronic nights,
              live sessions, and exhibitions are examples of events that celebrate what Miami truly sounds and feels like.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              marginTop: '3rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-accent-gold)', marginBottom: '0.5rem' }}>300+</div>
                <div style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Events Hosted</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-accent-gold)', marginBottom: '0.5rem' }}>6+</div>
                <div style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Years Strong</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-accent-gold)', marginBottom: '0.5rem' }}>500+</div>
                <div style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Artists Showcased</div>
              </div>
            </div>
          </div>
        }
        image={`${process.env.PUBLIC_URL}/real_images/12.jpg`}
      />

      <div className={styles.socialSection}>
        <h2 className={styles.socialTitle}>Don't Miss Anything</h2>
        <p className={styles.socialSubtitle}>Follow us for upcoming events, releases, and more</p>
        <SocialLinks
          placement="inline"
          showLabels={true}
          showCounts={false}
          size="lg"
        />
      </div>
    </>
  );
};

export default Home;
