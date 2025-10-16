import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    cta: { text: 'Learn More', link: '#' }
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
    cta: { text: 'Join Next Session', link: '#' }
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
    cta: { text: 'See Schedule', link: '#' }
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
    cta: { text: 'View Lineup', link: '#' }
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
    cta: { text: 'Upcoming Shows', link: '#' }
  }
];

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
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '2rem 1rem',
        marginBottom: '2rem'
      }}
    >
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '50px',
            background: activeFilter === filter.id 
              ? 'linear-gradient(135deg, #D4AF37 0%, #F4E4B7 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            color: activeFilter === filter.id ? '#000' : '#fff',
            fontWeight: activeFilter === filter.id ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem',
            backdropFilter: 'blur(10px)',
            transform: activeFilter === filter.id ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== filter.id) {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== filter.id) {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {filter.label}
        </button>
      ))}
    </motion.div>
  );
};

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (currentIndex === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: '#fff',
          fontSize: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            style={{
              position: 'absolute',
              left: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{
              position: 'absolute',
              right: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
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
        src={images[currentIndex]}
        alt="Gallery"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90%',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px'
        }}
      />

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        color: '#fff',
        fontSize: '0.9rem'
      }}>
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

const ActivityCard = ({ activity, index }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(212, 175, 55, 0.3)' 
            : '0 8px 16px rgba(0, 0, 0, 0.3)',
          marginBottom: '1.5rem',
          breakInside: 'avoid'
        }}
      >
        <div
          onClick={() => setLightboxIndex(0)}
          style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            overflow: 'hidden'
          }}
        >
          <img
            src={activity.images[0]}
            alt={activity.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.5s ease'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
              opacity: isHovered ? 0.8 : 0.6,
              transition: 'opacity 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(212, 175, 55, 0.9)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#000',
            backdropFilter: 'blur(10px)'
          }}>
            {activity.frequency}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {activity.title}
          </h3>

          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.85rem',
            color: '#D4AF37',
            fontWeight: '500'
          }}>
            {activity.time}
          </p>

          <p style={{
            margin: '0 0 1rem 0',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }}>
            {activity.vibe}
          </p>

          <p style={{
            margin: '0 0 1.5rem 0',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            {activity.description}
          </p>

          {activity.images.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {activity.images.slice(1).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx + 1)}
                  style={{
                    flex: 1,
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '2px solid rgba(212, 175, 55, 0.8)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '2px solid rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={img}
                    alt={`${activity.title} ${idx + 2}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <a
            href={activity.cta.link}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B7 100%)',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 8px 16px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {activity.cta.text}
          </a>
        </div>
      </motion.div>

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

const InstagramFeed = () => {
  return (
    <div style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'rgba(20, 20, 20, 0.5)',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>
        Follow Us on Instagram
      </h2>
      <p style={{
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '2rem',
        fontSize: '1.1rem'
      }}>
        @theboomboxmiami
      </p>
      <a
        href="https://instagram.com/theboomboxmiami"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 10px 30px rgba(131, 58, 180, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Follow Us
      </a>
      <p style={{
        marginTop: '1.5rem',
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.5)',
        fontStyle: 'italic'
      }}>
        Instagram feed integration coming soon
      </p>
    </div>
  );
};

const Showcasing = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activitiesData;
    return activitiesData.filter(activity => activity.category === activeFilter);
  }, [activeFilter]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      paddingTop: '80px'
    }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: 'center',
          padding: '4rem 2rem 2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B7 50%, #D4AF37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          What We Do
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '1.6',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          From coffee Sundays to underground raves, The Boombox is Miami's premier destination for culture, community, and unforgettable experiences.
        </p>
      </motion.div>

      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem 4rem'
      }}>
        <div style={{
          columnCount: 'auto',
          columnWidth: '350px',
          columnGap: '1.5rem',
          '@media (max-width: 768px)': {
            columnWidth: '100%'
          }
        }}>
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
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              No events in this category
            </h3>
            <p>Try selecting a different filter</p>
          </motion.div>
        )}
      </div>

      <InstagramFeed />
    </div>
  );
};

export default Showcasing;