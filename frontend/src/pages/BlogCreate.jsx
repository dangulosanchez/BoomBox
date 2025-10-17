import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogCreate.module.css';

/**
 * TEMPORARY PUBLIC ROUTE
 * This will be moved to a separate admin frontend once established.
 * For now, this allows blog creation without admin infrastructure.
 * 
 * BlogCreate Page - Create new blog posts
 * 
 * @component
 * @features
 * - Rich text editor (textarea for now)
 * - Cover image URL input
 * - Tag management (comma-separated or chips)
 * - Excerpt input (optional, auto-generated if empty)
 * - Status selector (draft/published)
 * - Featured checkbox
 * - Preview toggle
 * - Form validation
 * - Success/error handling
 * 
 * @future_enhancements
 * - Rich text WYSIWYG editor (TinyMCE, Quill, etc.)
 * - Image upload functionality
 * - Markdown support
 * - Auto-save drafts
 * - Content templates
 */
const BlogCreate = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    status: 'draft',
    featured: false
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      setLoading(false);
      return;
    }
    
    if (formData.title.length > 200) {
      setError('Title must be 200 characters or less');
      setLoading(false);
      return;
    }
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to create a post');
        setLoading(false);
        return;
      }
      
      // Prepare payload
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        tags: formData.tags.trim(),
        status: formData.status,
        featured: formData.featured
      };
      
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create blog post');
      }
      
      setSuccess(true);
      
      // Redirect to the new post after a short delay
      setTimeout(() => {
        navigate(`/blog/${data.post.slug}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancel/back
   */
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard this post?')) {
      navigate('/blog');
    }
  };

  /**
   * Get character count for title
   */
  const titleCharCount = formData.title.length;
  const titleCharLimit = 200;

  return (
    <div className={styles.blogCreatePage}>
      <div className={styles.container}>
        
        {/* Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Create New Post</h1>
          <p className={styles.pageSubtitle}>
            Share your story with The Boombox community
          </p>
        </header>

        {/* Success Message */}
        {success && (
          <div className={styles.successBanner}>
            <span className={styles.successIcon}>✓</span>
            <div>
              <strong>Success!</strong> Your post has been created. Redirecting...
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠</span>
            <div>
              <strong>Error:</strong> {error}
            </div>
            <button 
              onClick={() => setError(null)}
              className={styles.dismissError}
            >
              ×
            </button>
          </div>
        )}

        {/* Main Form */}
        <div className={styles.formWrapper}>
          
          {/* Toggle Preview Button */}
          <div className={styles.previewToggle}>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`${styles.toggleBtn} ${showPreview ? styles.active : ''}`}
            >
              {showPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>

          {!showPreview ? (
            // EDIT MODE
            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Title */}
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Title *
                  <span className={styles.charCount}>
                    {titleCharCount}/{titleCharLimit}
                  </span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.titleInput}`}
                  placeholder="Enter your post title..."
                  required
                  maxLength={titleCharLimit}
                />
              </div>

              {/* Content */}
              <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.label}>
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className={`${styles.textarea} ${styles.contentTextarea}`}
                  placeholder="Write your post content here... (You can use line breaks for paragraphs)"
                  required
                  rows={20}
                />
                <span className={styles.hint}>
                  Tip: Press Enter twice to create a new paragraph
                </span>
              </div>

              {/* Excerpt */}
              <div className={styles.formGroup}>
                <label htmlFor="excerpt" className={styles.label}>
                  Excerpt (Optional)
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Brief summary of your post (leave empty for auto-generation)"
                  rows={3}
                  maxLength={300}
                />
                <span className={styles.hint}>
                  {formData.excerpt.length}/300 characters
                  {!formData.excerpt && ' - Will be auto-generated from content if left empty'}
                </span>
              </div>

              {/* Cover Image */}
              <div className={styles.formGroup}>
                <label htmlFor="coverImage" className={styles.label}>
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.coverImage && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className={styles.imageError} style={{ display: 'none' }}>
                      ⚠️ Failed to load image
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className={styles.formGroup}>
                <label htmlFor="tags" className={styles.label}>
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="music, events, community (comma-separated)"
                />
                <span className={styles.hint}>
                  Separate tags with commas. Tags will be converted to lowercase.
                </span>
                {formData.tags && (
                  <div className={styles.tagPreview}>
                    {formData.tags.split(',').map((tag, index) => (
                      tag.trim() && (
                        <span key={index} className={styles.tagChip}>
                          {tag.trim().toLowerCase()}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Featured */}
              <div className={styles.formRow}>
                
                {/* Status */}
                <div className={styles.formGroup}>
                  <label htmlFor="status" className={styles.label}>
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <span className={styles.hint}>
                    {formData.status === 'draft' 
                      ? 'Only you can see drafts' 
                      : 'Post will be visible to everyone'}
                  </span>
                </div>

                {/* Featured */}
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>
                      Featured Post
                    </span>
                  </label>
                  <span className={styles.hint}>
                    Featured posts appear in the spotlight section
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner}></span>
                      Creating...
                    </>
                  ) : (
                    `Create ${formData.status === 'published' ? 'Post' : 'Draft'}`
                  )}
                </button>
              </div>

            </form>
          ) : (
            // PREVIEW MODE
            <div className={styles.preview}>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>Preview</h2>
                <span className={styles.previewBadge}>
                  {formData.status === 'published' ? '🌐 Published' : '📝 Draft'}
                </span>
              </div>

              {/* Cover Image Preview */}
              {formData.coverImage && (
                <div className={styles.previewCover}>
                  <img src={formData.coverImage} alt="Cover" />
                </div>
              )}

              {/* Tags Preview */}
              {formData.tags && (
                <div className={styles.previewTags}>
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <span key={index} className={styles.previewTag}>
                        {tag.trim().toLowerCase()}
                      </span>
                    )
                  ))}
                </div>
              )}

              {/* Title Preview */}
              <h1 className={styles.previewPostTitle}>
                {formData.title || 'Untitled Post'}
              </h1>

              {/* Featured Badge */}
              {formData.featured && (
                <div className={styles.previewFeaturedBadge}>
                  ⭐ Featured Post
                </div>
              )}

              {/* Excerpt Preview */}
              {formData.excerpt && (
                <p className={styles.previewExcerpt}>{formData.excerpt}</p>
              )}

              {/* Content Preview */}
              <div className={styles.previewContent}>
                {formData.content ? (
                  formData.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>{paragraph}</p>
                    )
                  ))
                ) : (
                  <p className={styles.emptyContent}>No content yet...</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BlogCreate;