import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogCreate.module.css'; // Reuse same styles

/**
 * TEMPORARY PUBLIC ROUTE
 * This will be moved to a separate admin frontend once established.
 * For now, this allows blog editing without admin infrastructure.
 * 
 * BlogEdit Page - Edit existing blog posts
 * 
 * @component
 * @features
 * - Load existing post data
 * - Edit all post fields
 * - Preview changes
 * - Update post
 * - Delete post (with confirmation)
 * - Ownership validation
 * - Form validation
 * - Success/error handling
 */
const BlogEdit = () => {
  const { id } = useParams();
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
  
  const [originalPost, setOriginalPost] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  /**
   * Fetch existing post data
   */
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to edit posts');
          setLoading(false);
          return;
        }
        
        // Fetch post by ID
        const response = await fetch(`${API_BASE_URL}/blog/post/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          if (response.status === 403) {
            throw new Error('You do not have permission to edit this post');
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        const post = data.post;
        
        setOriginalPost(post);
        
        // Populate form with existing data
        setFormData({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          coverImage: post.coverImage || '',
          tags: post.tags ? post.tags.join(', ') : '',
          status: post.status || 'draft',
          featured: post.featured || false
        });
        
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

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
   * Handle form submission (update post)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      setSaving(false);
      return;
    }
    
    if (formData.title.length > 200) {
      setError('Title must be 200 characters or less');
      setSaving(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to edit posts');
        setSaving(false);
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
      
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog post');
      }
      
      setSuccess(true);
      
      // Redirect to the updated post after a short delay
      setTimeout(() => {
        navigate(`/blog/${data.post.slug}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle post deletion
   */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    
    if (!confirmDelete) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to delete posts');
        setDeleting(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete post');
      }
      
      // Redirect to blog listing after successful deletion
      navigate('/blog', { 
        state: { message: 'Post deleted successfully' }
      });
      
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message);
      setDeleting(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      navigate(`/blog/${originalPost.slug}`);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className={styles.blogCreatePage}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State (can't load post)
  if (error && !originalPost) {
    return (
      <div className={styles.blogCreatePage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h1 className={styles.errorTitle}>Error</h1>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => navigate('/blog')}
              className={styles.backButton}
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const titleCharCount = formData.title.length;
  const titleCharLimit = 200;

  return (
    <div className={styles.blogCreatePage}>
      <div className={styles.container}>
        
        {/* Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Post</h1>
          <p className={styles.pageSubtitle}>
            Make changes to your post
          </p>
        </header>

        {/* Success Message */}
        {success && (
          <div className={styles.successBanner}>
            <span className={styles.successIcon}>✓</span>
            <div>
              <strong>Success!</strong> Your post has been updated. Redirecting...
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
                  placeholder="Write your post content here..."
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
                  placeholder="Brief summary of your post"
                  rows={3}
                  maxLength={300}
                />
                <span className={styles.hint}>
                  {formData.excerpt.length}/300 characters
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
                  Separate tags with commas
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
                    <option value="archived">Archived</option>
                  </select>
                  <span className={styles.hint}>
                    {formData.status === 'draft' && 'Only you can see drafts'}
                    {formData.status === 'published' && 'Post is visible to everyone'}
                    {formData.status === 'archived' && 'Post is hidden from public'}
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
                  onClick={handleDelete}
                  className={styles.deleteButton}
                  disabled={saving || deleting || success}
                >
                  {deleting ? (
                    <>
                      <span className={styles.spinner}></span>
                      Deleting...
                    </>
                  ) : (
                    '🗑️ Delete Post'
                  )}
                </button>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                    disabled={saving || deleting || success}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={saving || deleting || success}
                  >
                    {saving ? (
                      <>
                        <span className={styles.spinner}></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>

            </form>
          ) : (
            // PREVIEW MODE (same as BlogCreate)
            <div className={styles.preview}>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>Preview</h2>
                <span className={styles.previewBadge}>
                  {formData.status === 'published' ? '🌐 Published' : 
                   formData.status === 'archived' ? '📦 Archived' : '📝 Draft'}
                </span>
              </div>

              {formData.coverImage && (
                <div className={styles.previewCover}>
                  <img src={formData.coverImage} alt="Cover" />
                </div>
              )}

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

              <h1 className={styles.previewPostTitle}>
                {formData.title || 'Untitled Post'}
              </h1>

              {formData.featured && (
                <div className={styles.previewFeaturedBadge}>
                  ⭐ Featured Post
                </div>
              )}

              {formData.excerpt && (
                <p className={styles.previewExcerpt}>{formData.excerpt}</p>
              )}

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

export default BlogEdit;