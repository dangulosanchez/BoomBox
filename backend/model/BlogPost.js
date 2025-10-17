const mongoose = require('mongoose');

/**
 * BlogPost Model
 * 
 * @description Schema for blog posts with support for drafts, publishing, tags, and analytics
 * 
 * @features
 * - Auto-generated slugs from titles
 * - Draft/Published/Archived status workflow
 * - Tag-based categorization
 * - View count tracking
 * - Featured post support
 * - Author association with User model
 * 
 * @future_enhancements
 * - Add comments system (separate Comment model)
 * - Add likes/reactions
 * - Add SEO meta fields (metaTitle, metaDescription, ogImage)
 * - Add content versioning/revision history
 */

const BlogPostSchema = new mongoose.Schema({
    // Core Content
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    
    slug: { 
        type: String, 
        unique: true,
        lowercase: true,
        trim: true,
        index: true // For fast lookups by slug
    },
    
    content: { 
        type: String, 
        required: [true, 'Content is required']
    },
    
    excerpt: { 
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    
    // Media
    coverImage: { 
        type: String,
        default: null,
        validate: {
            validator: function(v) {
                // Basic URL validation (optional - allows null)
                if (!v) return true;
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Cover image must be a valid URL'
        }
    },
    
    // Author & Publishing
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'Author is required'],
        index: true // For querying posts by author
    },
    
    status: { 
        type: String, 
        enum: {
            values: ['draft', 'published', 'archived'],
            message: '{VALUE} is not a valid status'
        },
        default: 'draft',
        index: true // For filtering published posts
    },
    
    publishedAt: { 
        type: Date,
        default: null
    },
    
    // Organization & Discovery
    tags: [{ 
        type: String,
        lowercase: true,
        trim: true
    }],
    
    featured: { 
        type: Boolean, 
        default: false,
        index: true // For quickly finding featured posts
    },
    
    // Analytics
    viewCount: { 
        type: Number, 
        default: 0,
        min: 0
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// ========== INDEXES FOR PERFORMANCE ==========
// Compound index for common queries
BlogPostSchema.index({ status: 1, publishedAt: -1 }); // List published posts by date
BlogPostSchema.index({ status: 1, featured: 1, publishedAt: -1 }); // Featured published posts
BlogPostSchema.index({ tags: 1, status: 1 }); // Posts by tag

// ========== PRE-SAVE MIDDLEWARE ==========

/**
 * Auto-generate slug from title if not provided
 * Convert title to URL-friendly slug
 */
BlogPostSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        // Generate slug from title
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens with single
            .substring(0, 100); // Limit length
        
        // Add timestamp to ensure uniqueness (will be improved in routes)
        this.slug = `${this.slug}-${Date.now()}`;
    }
    next();
});

/**
 * Auto-generate excerpt from content if not provided
 * Takes first 200 characters and adds ellipsis
 */
BlogPostSchema.pre('save', function(next) {
    if (this.isModified('content') && !this.excerpt) {
        // Strip HTML tags if present (basic cleanup)
        const plainText = this.content.replace(/<[^>]*>/g, '');
        
        // Generate excerpt (first 200 chars)
        this.excerpt = plainText.length > 200 
            ? plainText.substring(0, 200).trim() + '...'
            : plainText;
    }
    next();
});

/**
 * Set publishedAt timestamp when status changes to 'published'
 */
BlogPostSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// ========== STATIC METHODS ==========

/**
 * Find all published posts with pagination
 * @param {Number} page - Page number (starts at 1)
 * @param {Number} limit - Posts per page
 * @returns {Object} { posts, total, pages }
 */
BlogPostSchema.statics.findPublished = async function(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
        this.find({ status: 'published' })
            .populate('author', 'username email')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit),
        this.countDocuments({ status: 'published' })
    ]);
    
    return {
        posts,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    };
};

/**
 * Find posts by tag
 * @param {String} tag - Tag to filter by
 * @returns {Array} Array of posts
 */
BlogPostSchema.statics.findByTag = function(tag) {
    return this.find({ 
        status: 'published',
        tags: tag.toLowerCase()
    })
    .populate('author', 'username email')
    .sort({ publishedAt: -1 });
};

/**
 * Get all unique tags from published posts
 * @returns {Array} Array of tag strings
 */
BlogPostSchema.statics.getAllTags = async function() {
    const posts = await this.find({ status: 'published' }, 'tags');
    const tagSet = new Set();
    
    posts.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
};

/**
 * Increment view count for a post
 * @param {String} postId - Post ID
 */
BlogPostSchema.statics.incrementViews = function(postId) {
    return this.findByIdAndUpdate(
        postId,
        { $inc: { viewCount: 1 } },
        { new: true }
    );
};

// ========== INSTANCE METHODS ==========

/**
 * Check if post is published
 * @returns {Boolean}
 */
BlogPostSchema.methods.isPublished = function() {
    return this.status === 'published';
};

/**
 * Check if user is author of post
 * @param {String} userId - User ID to check
 * @returns {Boolean}
 */
BlogPostSchema.methods.isAuthor = function(userId) {
    return this.author.toString() === userId.toString();
};

module.exports = mongoose.model('BlogPost', BlogPostSchema);