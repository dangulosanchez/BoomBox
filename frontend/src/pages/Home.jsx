import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import PressBar from '../components/sections/PressBar';
import EventsPreview from '../components/sections/EventsPreview';
import Logo from '../components/base/Logo';
import XPButton from '../components/base/XPButton';
import SocialLinks from '../components/base/SocialLinks';
import styles from './Home.module.css';
import content from '../data/content.json';

const { home } = content;

const Home = () => {
  return (
    <>
      <Hero
        title={home.hero.title}
        subtitle={home.hero.subtitle}
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
          {home.hero.cta_button}
        </XPButton>
        <p className={styles.heroSupport}>
          {home.hero.support_text}
        </p>
      </Hero>

      <div data-section="events">
        <EventsPreview />
      </div>

      <PressBar />

      <AboutSection
        title={home.about.title}
        windowTitle="about_the_box.exe"
        content={
          <div>
            <p className={styles.aboutParagraphLg}>{home.about.paragraphs[0]}</p>
            <p className={styles.aboutParagraphSm}>{home.about.paragraphs[1]}</p>
            <div className={styles.aboutStats}>
              {home.about.stats.map((stat, i) => (
                <div key={i} className={styles.aboutStatItem}>
                  <div className={styles.aboutStatNumber}>{stat.number}</div>
                  <div className={styles.aboutStatLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        }
        image={`${process.env.PUBLIC_URL}/real_images/12.jpg`}
      />

      <div className={styles.socialSection}>
        <h2 className={styles.socialTitle}>{home.social.title}</h2>
        <p className={styles.socialSubtitle}>{home.social.subtitle}</p>
        <SocialLinks
          placement="inline"
          showLabels={false}
          showCounts={false}
          size="lg"
        />
      </div>
    </>
  );
};

export default Home;
