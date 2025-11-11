/**
 * ============================================
 * GALLERY DATA - The Boombox Miami
 * ============================================
 * 
 * Image data structure for the Gallery page.
 * Replace placeholder images with real event photos.
 * 
 * IMAGE OPTIMIZATION GUIDELINES:
 * - Thumbnails: 600px wide, 80% quality JPEG
 * - Full-size: 1920px wide, 90% quality JPEG
 * - Use WebP format with JPEG fallback
 * - Consider Cloudinary or similar CDN for automatic optimization
 */

export const galleryImages = [
  // ========== EVENTS - ELECTRONIC NIGHTS ==========
  {
    id: 'event-001',
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    alt: 'Electronic music event with crowd and DJ at The Boombox Miami',
    category: 'events',
    subcategory: 'electronic',
    date: '2024-12-15',
    eventName: 'Bassline Fridays',
    photographer: 'The Boombox Team',
    width: 1920,
    height: 1280,
    tags: ['rave', 'dj', 'crowd', 'lights']
  },
  {
    id: 'event-002',
    src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
    alt: 'DJ performing at The Boombox with light show',
    category: 'events',
    subcategory: 'electronic',
    date: '2024-12-10',
    eventName: 'Underground Saturdays',
    photographer: 'John Doe Photography',
    width: 1920,
    height: 1280,
    tags: ['dj', 'performance', 'lights']
  },

  // ========== EVENTS - LIVE MUSIC ==========
  {
    id: 'event-003',
    src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600',
    alt: 'Live band performance at The Boombox Miami',
    category: 'events',
    subcategory: 'live-music',
    date: '2024-11-28',
    eventName: 'Indie Wednesdays',
    photographer: 'The Boombox Team',
    width: 1920,
    height: 1280,
    tags: ['live-music', 'band', 'performance']
  },
  {
    id: 'event-004',
    src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600',
    alt: 'Crowd enjoying live music at The Boombox',
    category: 'events',
    subcategory: 'live-music',
    date: '2024-11-20',
    eventName: 'Indie Wednesdays',
    photographer: 'Jane Smith Photo',
    width: 1920,
    height: 1440,
    tags: ['crowd', 'live-music', 'atmosphere']
  },

  // ========== VENUE - INTERIOR ==========
  {
    id: 'venue-001',
    src: 'https://images.unsplash.com/photo-1571266028243-d220c2dcdfb9?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1571266028243-d220c2dcdfb9?w=600',
    alt: 'The Boombox Miami interior - main dance floor',
    category: 'venue',
    subcategory: 'interior',
    date: '2024-10-15',
    eventName: null,
    photographer: 'Venue Photography',
    width: 1920,
    height: 1280,
    tags: ['venue', 'interior', 'dance-floor']
  },
  {
    id: 'venue-002',
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
    alt: 'The Boombox bar area with gold lighting',
    category: 'venue',
    subcategory: 'bar',
    date: '2024-10-15',
    eventName: null,
    photographer: 'Venue Photography',
    width: 1920,
    height: 1280,
    tags: ['venue', 'bar', 'interior']
  },

  // ========== VENUE - DJ BOOTH ==========
  {
    id: 'venue-003',
    src: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600',
    alt: 'Professional DJ booth at The Boombox Miami',
    category: 'venue',
    subcategory: 'dj-booth',
    date: '2024-10-15',
    eventName: null,
    photographer: 'Venue Photography',
    width: 1920,
    height: 1440,
    tags: ['venue', 'dj-booth', 'equipment']
  },

  // ========== COMMUNITY - CANDID MOMENTS ==========
  {
    id: 'community-001',
    src: 'images/cool_2.jpeg',
    thumbnail: 'images/cool_2.jpeg',
    alt: 'Friends enjoying event at The Boombox Miami',
    category: 'community',
    subcategory: 'candid',
    date: '2024-12-01',
    eventName: 'Bassline Fridays',
    photographer: 'The Boombox Team',
    width: 1920,
    height: 1280,
    tags: ['community', 'friends', 'vibes']
  },
  {
    id: 'community-002',
    src: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600',
    alt: 'Dancing crowd at The Boombox',
    category: 'community',
    subcategory: 'dancing',
    date: '2024-11-25',
    eventName: 'Underground Saturdays',
    photographer: 'The Boombox Team',
    width: 1920,
    height: 1280,
    tags: ['dancing', 'community', 'energy']
  },

  // ========== ARTISTS - PERFORMERS ==========
  {
    id: 'artist-001',
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
    alt: 'Artist performing live at The Boombox',
    category: 'artists',
    subcategory: 'performer',
    date: '2024-11-18',
    eventName: 'Indie Wednesdays',
    photographer: 'The Boombox Team',
    width: 1920,
    height: 1440,
    tags: ['artist', 'performance', 'live']
  },
  {
    id: 'artist-002',
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    alt: 'DJ mixing at The Boombox Miami',
    category: 'artists',
    subcategory: 'dj',
    date: '2024-12-08',
    eventName: 'Bassline Fridays',
    photographer: 'John Doe Photography',
    width: 1920,
    height: 1280,
    tags: ['dj', 'mixing', 'artist']
  },

  // ========== SPECIAL EVENTS ==========
  {
    id: 'special-001',
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
    alt: 'Special event at The Boombox Miami',
    category: 'events',
    subcategory: 'special',
    date: '2024-12-31',
    eventName: 'NYE 2025',
    photographer: 'The Boombox Team',
    width: 1920,
    height: 1280,
    tags: ['nye', 'special-event', 'celebration']
  },
  {
    id: 'special-002',
    src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600',
    alt: 'Art show at The Boombox Miami',
    category: 'events',
    subcategory: 'art',
    date: '2024-10-22',
    eventName: 'Art & Beats',
    photographer: 'Jane Smith Photo',
    width: 1920,
    height: 1440,
    tags: ['art', 'exhibition', 'culture']
  }
];

/**
 * Gallery Filter Categories
 * Used for filtering images in the gallery
 */
export const galleryCategories = [
  { id: 'all', label: 'All Photos', icon: '🎨' },
  { id: 'events', label: 'Events', icon: '🎉' },
  { id: 'venue', label: 'The Venue', icon: '🏛️' },
  { id: 'community', label: 'Community', icon: '👥' },
  { id: 'artists', label: 'Artists', icon: '🎤' }
];

/**
 * Gallery Date Filters
 * Optional: Use for date-based filtering
 */
export const dateFilters = [
  { id: 'recent', label: 'Recent', days: 30 },
  { id: 'this-month', label: 'This Month' },
  { id: '2024', label: '2024', year: 2024 },
  { id: '2023', label: '2023', year: 2023 }
];

/**
 * Utility: Get images by category
 */
export const getImagesByCategory = (category) => {
  if (category === 'all') return galleryImages;
  return galleryImages.filter(img => img.category === category);
};

/**
 * Utility: Get images by date range
 */
export const getImagesByDateRange = (startDate, endDate) => {
  return galleryImages.filter(img => {
    const imgDate = new Date(img.date);
    return imgDate >= startDate && imgDate <= endDate;
  });
};

/**
 * Utility: Search images by tags
 */
export const searchImagesByTags = (tags) => {
  return galleryImages.filter(img => 
    img.tags.some(tag => tags.includes(tag))
  );
};