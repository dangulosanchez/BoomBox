import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { galleryImages } from '../data/galleryData';
import styles from './Gallery.module.css';

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const photos = useMemo(() =>
    galleryImages.map(img => ({
      src: img.src,
      width: img.width,
      height: img.height,
      alt: img.alt,
      key: img.id,
    })), []);

  const lightboxSlides = useMemo(() =>
    galleryImages.map(img => ({
      src: img.src,
      alt: img.alt,
    })), []);

  const handlePhotoClick = useCallback(({ index }) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
        setLightboxIndex(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  return (
    <div className={styles.gallery}>
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.hero}
      >
        <h1 className={styles.heroTitle}>Gallery</h1>
        <div className={styles.heroAccent} />
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={styles.gridContainer}
      >
        <PhotoAlbum
          photos={photos}
          layout="rows"
          targetRowHeight={420}
          spacing={10}
          onClick={handlePhotoClick}
          renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
            <div
              style={wrapperStyle}
              className={styles.photoWrapper}
            >
              {renderDefaultPhoto({ wrapped: true })}
              <div className={styles.photoOverlay} />
            </div>
          )}
        />
      </motion.div>

      <Lightbox
        open={isLightboxOpen}
        index={lightboxIndex}
        close={() => {
          setIsLightboxOpen(false);
          setLightboxIndex(-1);
        }}
        slides={lightboxSlides}
        carousel={{ finite: false }}
        animation={{ fade: 300, swipe: 300 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.97)' } }}
      />
    </div>
  );
};

export default Gallery;
