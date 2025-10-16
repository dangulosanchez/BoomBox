import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Showcasing.module.css';

// ========== DATA STRUCTURE ==========
const activitiesData = [
  {
    id: 'kujos',
    title: "Kujo's Coffee",
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
    cta: { text: 'Learn More', link: '/events/kujos-coffee' }
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
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
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
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
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
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800'
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
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
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

// ========== INSTAGRAM FEED COMPONENT ==========
const InstagramFeed = () => {
  return (
    <section className={styles.instagramSection}>
      <h2 className={styles.instagramTitle}>Follow Us on Instagram</h2>
      <p className={styles.instagramHandle}>@theboomboxmiami</p>
      <a
        href="https://instagram.com/theboomboxmiami"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.instagramCTA}
      >
        Follow Us
      </a>
      <p className={styles.instagramNote}>Instagram feed integration coming soon</p>
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
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Masonry Grid */}
      <div className={styles.gridContainer}>
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