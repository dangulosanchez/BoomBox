import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Showcasing.module.css';

// ========== DATA STRUCTURE ==========
const activitiesData = [
  {
    id: 'coffee-sundays',
    title: "Coffee Sundays",
    frequency: 'Every Sunday',
    time: '9AM-2PM',
    vibe: 'Tres leches lattes & hour-long lines worth the wait',
    description: 'Experience Miami\'s hottest coffee trailer serving unique sugary lattes with flavors like Lucky Charms, french toast, and s\'mores. Perfect for those who love varying levels of sugar and milk in their coffee.',
    category: 'weekly',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'
    ],
    cta: { text: 'Learn More', link: '/events/coffee-sundays' }
  },
  {
    id: 'art-club',
    title: 'Art Club',
    frequency: 'Every Other Thursday',
    time: '7PM-10PM',
    vibe: 'Creative expression meets community vibes',
    description: 'Bi-weekly creative sessions where local artists and art enthusiasts gather to create, collaborate, and connect. From painting to mixed media, all skill levels welcome.',
    category: 'biweekly',
    images: [
      'images/mart.jpeg',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      'https://images.unsplash.com/photo-1482245294234-b3f2f8d5f1a4?w=800'
    ],
    cta: { text: 'Join Next Session', link: '/events/art-club' }
  },
  {
    id: 'car-shows',
    title: 'Car Shows',
    frequency: 'Monthly',
    time: 'Various',
    vibe: 'Horsepower, style, and community',
    description: 'Monthly automotive meetups featuring everything from classics to customs, exotics to daily drivers. Music, awards, and a community of car enthusiasts.',
    category: 'monthly',
    images: [
      'images/cars.jpg',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800'
    ],
    cta: { text: 'See Schedule', link: '/events/car-shows' }
  },
  {
    id: 'raves',
    title: 'Electronic Nights',
    frequency: 'Weekly',
    time: '10PM-4AM',
    vibe: 'Underground beats, immersive experiences',
    description: 'Miami\'s hottest electronic music events featuring top DJs and producers. From house to techno, experience cutting-edge sound in an intimate venue.',
    category: 'weekly',
    images: [
      'images/rave_2.jpeg',
      'images/rave_3.jpeg',
      'images/rave_4.jpeg'
    ],
    cta: { text: 'View Lineup', link: '/events/raves' }
  },
  {
    id: 'concerts',
    title: 'Live Music',
    frequency: 'Multiple Nights',
    time: 'Varies',
    vibe: 'Intimate performances, diverse sounds',
    description: 'Live performances across genres - from indie rock to Latin jazz. Experience music in an intimate setting with world-class acoustics.',
    category: 'multiple',
    images: [
      'images/live_show_1.jpeg',
      'images/live_show_2.jpeg',
      'images/live_show_3.jpeg'
    ],
    cta: { text: 'Upcoming Shows', link: '/events/concerts' }
  }
];

// ========== FILTER BAR COMPONENT ==========
const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Bi-Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'multiple', label: 'Multiple Nights' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.filterBar}
    >
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
        >
          {filter.label}
        </button>
      ))}
    </motion.div>
  );
};

// ========== LIGHTBOX COMPONENT ==========
const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (currentIndex === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={styles.lightbox}
    >
      <button onClick={onClose} className={styles.lightboxClose}>✕</button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
          >
            ›
          </button>
        </>
      )}

      <motion.img
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        src={images[currentIndex]}
        alt="Gallery"
        onClick={(e) => e.stopPropagation()}
        className={styles.lightboxImage}
      />

      <div className={styles.lightboxCounter}>
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

// ========== ACTIVITY CARD COMPONENT ==========
const ActivityCard = ({ activity, index }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${styles.card} ${isHovered ? styles.cardHovered : ''}`}
      >
        {/* Main Image */}
        <div onClick={() => setLightboxIndex(0)} className={styles.cardImage}>
          <img
            src={activity.images[0]}
            alt={activity.title}
            className={styles.cardImg}
          />
          <div className={styles.cardOverlay}></div>
          <div className={styles.cardBadge}>{activity.frequency}</div>
        </div>

        {/* Content */}
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{activity.title}</h3>
          <p className={styles.cardTime}>{activity.time}</p>
          <p className={styles.cardVibe}>{activity.vibe}</p>
          <p className={styles.cardDescription}>{activity.description}</p>

          {/* Image Gallery Preview */}
          {activity.images.length > 1 && (
            <div className={styles.cardGallery}>
              {activity.images.slice(1).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx + 1)}
                  className={styles.galleryThumb}
                >
                  <img src={img} alt={`${activity.title} ${idx + 2}`} />
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <a href={activity.cta.link} className={styles.cardCTA}>
            {activity.cta.text}
          </a>
        </div>
      </motion.article>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={activity.images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((lightboxIndex + 1) % activity.images.length)}
            onPrev={() => setLightboxIndex((lightboxIndex - 1 + activity.images.length) % activity.images.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * ========== INSTAGRAM FEED COMPONENT ==========
 * Free right now: render any list of public Instagram post URLs using Instagram's oEmbed script.
 * - Replace the sample URLs with posts from @theboomboxmiami or your preferred hashtag.
 * - Later upgrade path (still free): swap `postUrls` by fetching from your own API
 *   that calls the Instagram Graph API (Hashtag Search/User Media) with a token.
 */
const InstagramFeed = () => {
  const containerRef = useRef(null);

  // TODO: Replace these with your posts (copy the URL from the Instagram post "..." menu > "Copy link").
  // You can also paste URLs that include your hashtag search results gathered manually.
  const postUrls = useMemo(
    () => [
      // Example public posts (placeholders) — replace all three:
      'https://www.instagram.com/p/DOJZqjBjvkm/?utm_source=ig_web_copy_link',
      'https://www.instagram.com/p/DPWs2M1Drye/?utm_source=ig_web_copy_link',
      'https://www.instagram.com/p/DPyf-WgjWpX/?utm_source=ig_web_copy_link'
    ],
    []
  );

  // Load Instagram embed script once; it’s free and official.
  useEffect(() => {
    const existing = document.getElementById('ig-embed-script');
    if (!existing) {
      const s = document.createElement('script');
      s.async = true;
      s.defer = true;
      s.id = 'ig-embed-script';
      s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
      s.onload = () => {
        if (window.instgrm && window.instgrm.Embeds) {
          window.instgrm.Embeds.process();
        }
      };
    } else if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }, []);

  useEffect(() => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }, [postUrls]);

  return (
    <section className={styles.instagramSection}>
      <div ref={containerRef} className={styles.instagramGrid}>
        {postUrls.length > 0 ? (
          postUrls.map((url, i) => (
            <div key={i} className={styles.igEmbed}>
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{ background: 'transparent', border: 0, margin: 0 }}
              >
              </blockquote>
            </div>
          ))
        ) : (
          <p className={styles.igEmpty}>
            No Instagram posts configured yet. Add post URLs to <code>postUrls</code>.
          </p>
        )}
      </div>
    </section>
  );
};

// ========== MAIN SHOWCASE COMPONENT ==========
const Showcasing = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activitiesData;
    return activitiesData.filter(activity => activity.category === activeFilter);
  }, [activeFilter]);

  const gridRef = useRef(null);

    // When a filter button is clicked, change the filter and scroll to the grid
    
    const handleFilterChange = (id) => {
    setActiveFilter(id);
    // account for a fixed header (tweak 80 if your header height differs)
    const headerOffset = 80;
    const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (gridRef.current) {
    const top =
    gridRef.current.getBoundingClientRect().top +
    window.pageYOffset -
    headerOffset;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
    };

  return (
    <div className={styles.showcase}>
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={styles.hero}
      >
        <h1 className={styles.heroTitle}>What We Do</h1>
        <p className={styles.heroSubtitle}>
          From coffee Sundays to underground raves, The Boombox is Miami's premier destination for culture, community, and unforgettable experiences.
        </p>
      </motion.header>

      {/* Filter Bar */}
      <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {/* Masonry Grid */}
      <div div ref={gridRef} className={styles.gridContainer}>
        <div className={styles.masonryGrid}>
          <AnimatePresence mode="wait">
            {filteredActivities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyState}
          >
            <h3>No events in this category</h3>
            <p>Try selecting a different filter</p>
          </motion.div>
        )}
      </div>

      {/* Instagram Feed */}
      <InstagramFeed />
    </div>
  );
};

export default Showcasing;
