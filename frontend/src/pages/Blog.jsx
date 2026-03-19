import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import XPButton from '../components/base/XPButton';
import BlogCard from '../components/blog/BlogCard';
import BlogHeader from '../components/blog/BlogHeader';
import TagFilter from '../components/blog/TagFilter';
import styles from './Blog.module.css';

/**
 * Blog Page - Main blog listing with filtering, search, and pagination
 * 
 * @component
 * @features
 * - Paginated blog post listing
 * - Search functionality
 * - Tag filtering
 * - Featured posts section
 * - Grid/List layout toggle
 * - Loading and error states
 * 
 * @future_enhancements
 * - Infinite scroll option
 * - Save user's layout preference to localStorage
 * - Sort options (newest, oldest, most viewed)
 */
const Blog = () => {
  // State management
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & pagination
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [layout, setLayout] = useState('grid'); // 'grid' or 'list'
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  /**
   * Fetch blog posts with current filters
   */
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9, // 9 posts per page for nice 3x3 grid
        ...(searchQuery && { search: searchQuery }),
        ...(selectedTag && { tag: selectedTag })
      });
      
      const response = await fetch(`${API_BASE_URL}/blog?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.pagination.pages);
      
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch featured posts (separate from main list)
   */
  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog?featured=true&limit=3`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured posts');
      }
      
      const data = await response.json();
      setFeaturedPosts(data.posts);
      
    } catch (err) {
      console.error('Error fetching featured posts:', err);
      // Don't set error state - featured posts are optional
    }
  };

  /**
   * Fetch all available tags
   */
  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/tags`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      
      const data = await response.json();
      setTags(data.tags);
      
    } catch (err) {
      console.error('Error fetching tags:', err);
      // Don't set error state - tags are optional
    }
  };

  // Initial load
  useEffect(() => {
    fetchFeaturedPosts();
    fetchTags();
  }, []);

  // Fetch posts when filters or page change
  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedTag, searchQuery]);

  /**
   * Handle search submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on new search
    fetchPosts();
  };

  /**
   * Handle tag selection
   */
  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag); // Toggle tag
    setCurrentPage(1); // Reset to page 1
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSelectedTag('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.blogPage}>
      {/* Hero Header */}
      <BlogHeader 
        title="The Box Blog"
        subtitle="Stories, insights, and updates from Miami's underground music scene"
      />

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Stories</h2>
            <div className={styles.featuredGrid}>
              {featuredPosts.map(post => (
                <BlogCard 
                  key={post._id} 
                  post={post} 
                  featured={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          
          {/* Filters & Search */}
          <div className={styles.controlsBar}>
            {/* Search */}
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </form>

            {/* Layout Toggle */}
            <div className={styles.layoutToggle}>
              <button 
                className={`${styles.layoutBtn} ${layout === 'grid' ? styles.active : ''}`}
                onClick={() => setLayout('grid')}
                aria-label="Grid view"
              >
                <span className={styles.gridIcon}>▦</span>
              </button>
              <button 
                className={`${styles.layoutBtn} ${layout === 'list' ? styles.active : ''}`}
                onClick={() => setLayout('list')}
                aria-label="List view"
              >
                <span className={styles.listIcon}>☰</span>
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <TagFilter 
              tags={tags}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Active Filters Display */}
          {(selectedTag || searchQuery) && (
            <div className={styles.activeFilters}>
              <span className={styles.filterLabel}>Active filters:</span>
              {selectedTag && (
                <span className={styles.filterBadge}>
                  Tag: {selectedTag}
                  <button 
                    onClick={() => setSelectedTag('')}
                    className={styles.filterRemove}
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className={styles.filterBadge}>
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className={styles.filterRemove}
                  >
                    ×
                  </button>
                </span>
              )}
              <button 
                onClick={handleClearFilters}
                className={styles.clearAll}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>⚠️ {error}</p>
              <XPButton onClick={fetchPosts}>
                Try Again
              </XPButton>
            </div>
          )}

          {/* Posts Grid/List */}
          {!loading && !error && (
            <>
              {posts.length > 0 ? (
                <div className={`${styles.postsContainer} ${styles[layout]}`}>
                  {posts.map(post => (
                    <BlogCard 
                      key={post._id} 
                      post={post}
                      layout={layout}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyMessage}>
                    No posts found matching your criteria.
                  </p>
                  <button 
                    onClick={handleClearFilters}
                    className={styles.clearFiltersButton}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.paginationBtn}
                  >
                    ← Previous
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`${styles.pageBtn} ${
                          page === currentPage ? styles.active : ''
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.paginationBtn}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Want to contribute?</h2>
          <p className={styles.ctaText}>
            Share your story, review, or insight with The Boombox community.
          </p>
          <XPButton as={Link} to="/blog/create">
            Write a Post
          </XPButton>
        </div>
      </section>
    </div>
  );
};

export default Blog;