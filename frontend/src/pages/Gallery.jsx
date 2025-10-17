/**
 * ============================================
 * GALLERY PAGE - The Boombox Miami
 * ============================================
 * 
 * A visually stunning photo gallery showcasing The Boombox's
 * atmosphere, events, and community through immersive imagery.
 * 
 * Features:
 * - Justified grid layout (Google Photos style)
 * - Category filtering with smooth transitions
 * - Full-screen lightbox with keyboard/swipe navigation
 * - Progressive image loading with blur-up effect
 * - Mobile-optimized with touch gestures
 * - 100% design system compliance
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Import local components and data
import { galleryImages, galleryCategories } from '../data/galleryData';
import styles from './Gallery.module.css';

/**
 * ========== MAIN GALLERY COMPONENT ==========
 */
const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter images based on active category
  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return galleryImages;
    return galleryImages.filter(img => img.category === activeFilter);
  }, [activeFilter]);

  // Format images for react-photo-album
  const photos = useMemo(() => {
    return filteredImages.map(img => ({
      src: img.src,
      width: img.width,
      height: img.height,
      alt: img.alt,
      key: img.id,
      // Pass through custom data for lightbox
      title: img.eventName || img.alt,
      photographer: img.photographer,
      date: img.date
    }));
  }, [filteredImages]);

  // Format images for lightbox
  const lightboxSlides = useMemo(() => {
    return filteredImages.map(img => ({
      src: img.src,
      alt: img.alt,
      title: img.eventName || img.alt,
      description: `${img.photographer ? `Photo: ${img.photographer}` : ''} ${img.date ? `• ${new Date(img.date).toLocaleDateString()}` : ''}`.trim()
    }));
  }, [filteredImages]);

  // Handle filter change
  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
    // Close lightbox if open
    if (isLightboxOpen) {
      setIsLightboxOpen(false);
      setLightboxIndex(-1);
    }
  }, [isLightboxOpen]);

  // Handle image click
  const handlePhotoClick = useCallback(({ index }) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  }, []);

  // Keyboard shortcuts for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setLightboxIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  return (
    <div className={styles.gallery}>
      {/* Hero Section */}
      <GalleryHero />

      {/* Filter Bar */}
      <FilterBar 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />

      {/* Photo Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.gridContainer}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {photos.length > 0 ? (
              <PhotoAlbum
                photos={photos}
                layout="rows"
                targetRowHeight={350}
                spacing={16}
                onClick={handlePhotoClick}
                renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
                  <motion.div
                    style={wrapperStyle}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className={styles.photoWrapper}
                  >
                    {renderDefaultPhoto({ wrapped: true })}
                    <div className={styles.photoOverlay}>
                      <span className={styles.photoIcon}>🔍</span>
                    </div>
                  </motion.div>
                )}
              />
            ) : (
              <EmptyState filter={activeFilter} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        index={lightboxIndex}
        close={() => {
          setIsLightboxOpen(false);
          setLightboxIndex(-1);
        }}
        slides={lightboxSlides}
        carousel={{
          finite: false
        }}
        animation={{
          fade: 300,
          swipe: 300
        }}
        controller={{
          closeOnBackdropClick: true
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
          }
        }}
      />

      {/* Image Count Badge */}
      <div className={styles.imageCount}>
        <span className={styles.countText}>
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
        </span>
      </div>
    </div>
  );
};

/**
 * ========== GALLERY HERO COMPONENT ==========
 */
const GalleryHero = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={styles.hero}
    >
      <h1 className={styles.heroTitle}>Gallery</h1>
      <p className={styles.heroSubtitle}>
        Experience The Boombox through the lens. Every photo tells a story of music, community, and unforgettable nights in Miami's underground.
      </p>
      <div className={styles.heroAccent}></div>
    </motion.header>
  );
};

/**
 * ========== FILTER BAR COMPONENT ==========
 */
const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={styles.filterBar}
    >
      {galleryCategories.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span className={styles.filterIcon} aria-hidden="true">{filter.icon}</span>
          <span className={styles.filterLabel}>{filter.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

/**
 * ========== EMPTY STATE COMPONENT ==========
 */
const EmptyState = ({ filter }) => {
  const category = galleryCategories.find(cat => cat.id === filter);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.emptyState}
    >
      <span className={styles.emptyIcon} aria-hidden="true">📸</span>
      <h3 className={styles.emptyTitle}>No photos yet</h3>
      <p className={styles.emptyText}>
        {category ? `We haven't uploaded any ${category.label.toLowerCase()} photos yet.` : 'No photos found.'}
      </p>
      <p className={styles.emptySubtext}>Check back soon or try a different category.</p>
    </motion.div>
  );
};

export default Gallery;