import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import XPButton from '../base/XPButton';
import styles from './BlogPost.module.css';
import BlogCard from './BlogCard';
/**
 * BlogPost Page - Single blog post view with full content
 * 
 * @component
 * @features
 * - Full post content display
 * - Author information
 * - Published date and reading time
 * - Tags with clickable links
 * - Related posts section
 * - Social share buttons
 * - Back navigation
 * - Loading and error states
 * - 404 handling
 * 
 * @future_enhancements
 * - Comments section
 * - Like/reaction system
 * - Table of contents for long posts
 * - Print functionality
 * - Bookmark/save feature
 */
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  /**
   * Fetch blog post by slug
   */
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
        
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
    
    // Scroll to top when post changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * Get reading time estimate
   */
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes);
  };

  /**
   * Share on social media
   */
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Loading State
  if (loading) {
    return (
      <div className={styles.blogPostPage}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={styles.blogPostPage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h1 className={styles.errorTitle}>
              {error === 'Post not found' ? '404' : 'Oops!'}
            </h1>
            <p className={styles.errorMessage}>
              {error === 'Post not found' 
                ? 'The blog post you\'re looking for doesn\'t exist.'
                : 'Something went wrong while loading this post.'}
            </p>
            <div className={styles.errorActions}>
              <XPButton onClick={() => navigate('/blog')}>
                ← Back to Blog
              </XPButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Post Not Found
  if (!post) {
    return null;
  }

  return (
    <div className={styles.blogPostPage}>
      
      {/* Back Navigation */}
      <div className={styles.backNav}>
        <div className={styles.container}>
          <Link to="/blog" className={styles.backLink}>
            <span className={styles.backArrow}>←</span>
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <header className={styles.postHeader}>
        {post.coverImage && (
          <div 
            className={styles.headerImage}
            style={{ backgroundImage: `url(${post.coverImage})` }}
          >
            <div className={styles.headerOverlay}></div>
          </div>
        )}
        
        <div className={styles.headerContent}>
          <div className={styles.container}>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className={styles.headerTags}>
                {post.tags.map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/blog?tag=${tag}`}
                    className={styles.headerTag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className={styles.postTitle}>{post.title}</h1>

            {/* Meta */}
            <div className={styles.postMeta}>
              
              {/* Author */}
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  {post.author?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>
                    {post.author?.username || 'Anonymous'}
                  </span>
                  <span className={styles.authorRole}>Author</span>
                </div>
              </div>

              <div className={styles.metaDivider}></div>

              {/* Date & Reading Time */}
              <div className={styles.postInfo}>
                <time className={styles.postDate} dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt || post.createdAt)}
                </time>
                <span className={styles.readingTime}>
                  {getReadingTime(post.content)} min read
                </span>
                {post.viewCount > 0 && (
                  <span className={styles.viewCount}>
                    👁️ {post.viewCount} views
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className={styles.postContent}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            
            {/* Article Body */}
            <div className={styles.articleBody}>
              {/* Format content with proper line breaks */}
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className={styles.paragraph}>
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Social Share */}
            <div className={styles.shareSection}>
              <h3 className={styles.shareTitle}>Share this post</h3>
              <div className={styles.shareButtons}>
                <button 
                  onClick={() => handleShare('twitter')}
                  className={`${styles.shareBtn} ${styles.twitter}`}
                  aria-label="Share on Twitter"
                >
                  <span className={styles.shareIcon}>🐦</span>
                  Twitter
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className={`${styles.shareBtn} ${styles.facebook}`}
                  aria-label="Share on Facebook"
                >
                  <span className={styles.shareIcon}>📘</span>
                  Facebook
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className={`${styles.shareBtn} ${styles.linkedin}`}
                  aria-label="Share on LinkedIn"
                >
                  <span className={styles.shareIcon}>💼</span>
                  LinkedIn
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className={`${styles.shareBtn} ${styles.copy}`}
                  aria-label="Copy link"
                >
                  <span className={styles.shareIcon}>🔗</span>
                  Copy Link
                </button>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h2 className={styles.relatedTitle}>Related Posts</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map(relatedPost => (
                <BlogCard
                  key={relatedPost._id} 
                  post={relatedPost}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Keep Reading</h2>
          <p className={styles.ctaText}>
            Discover more stories from The Boombox community
          </p>
          <XPButton as={Link} to="/blog">
            View All Posts
          </XPButton>
        </div>
      </section>

    </div>
  );
};

export default BlogPost;