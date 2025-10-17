const express = require('express');
const { auth } = require('../middleware/auth');
const BlogPost = require('../model/BlogPost');

const router = express.Router();

/**
 * Blog Routes
 * 
 * PUBLIC ROUTES:
 * - GET /api/blog - List all published posts (with pagination, search, tag filtering)
 * - GET /api/blog/tags - Get all unique tags
 * - GET /api/blog/:slug - Get single post by slug
 * 
 * PROTECTED ROUTES (Temporary - will move to admin):
 * - POST /api/blog - Create new post
 * - PUT /api/blog/:id - Update post
 * - DELETE /api/blog/:id - Delete post
 * - GET /api/blog/user/drafts - List user's draft posts
 */

// ========================================
// PUBLIC ROUTES
// ========================================

/**
 * GET /api/blog
 * List all published posts with pagination, search, and filtering
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Posts per page (default: 10, max: 50)
 * - search: Search in title and content
 * - tag: Filter by tag
 * - featured: Filter featured posts (true/false)
 * 
 * @example GET /api/blog?page=1&limit=10&tag=music&search=jazz
 */
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            tag = '',
            featured = ''
        } = req.query;
        
        // Validate and sanitize inputs
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 per page
        const skip = (pageNum - 1) * limitNum;
        
        // Build query
        const query = { status: 'published' };
        
        // Add tag filter
        if (tag) {
            query.tags = tag.toLowerCase().trim();
        }
        
        // Add featured filter
        if (featured === 'true') {
            query.featured = true;
        }
        
        // Add search filter (case-insensitive regex on title and content)
        if (search) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { excerpt: searchRegex }
            ];
        }
        
        // Execute query with pagination
        const [posts, total] = await Promise.all([
            BlogPost.find(query)
                .populate('author', 'username email')
                .select('-content') // Exclude full content for list view (performance)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(), // Convert to plain JS objects for better performance
            BlogPost.countDocuments(query)
        ]);
        
        res.json({
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limitNum),
                currentPage: pageNum,
                perPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            },
            filters: {
                search: search || null,
                tag: tag || null,
                featured: featured === 'true' ? true : null
            }
        });
        
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ 
            error: 'Failed to fetch blog posts',
            message: error.message 
        });
    }
});

/**
 * GET /api/blog/tags
 * Get all unique tags from published posts
 * 
 * @returns {Array} Array of tag objects with count
 */
router.get('/tags', async (req, res) => {
    try {
        // Get all published posts and extract tags
        const posts = await BlogPost.find({ status: 'published' }, 'tags').lean();
        
        // Count tag occurrences
        const tagCount = {};
        posts.forEach(post => {
            post.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });
        
        // Convert to array and sort by count (most popular first)
        const tags = Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
        
        res.json({ tags });
        
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ 
            error: 'Failed to fetch tags',
            message: error.message 
        });
    }
});

/**
 * GET /api/blog/:slug
 * Get single post by slug and increment view count
 * 
 * @param {String} slug - Post slug
 */
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Find post by slug
        const post = await BlogPost.findOne({ 
            slug, 
            status: 'published' 
        })
        .populate('author', 'username email createdAt')
        .lean();
        
        if (!post) {
            return res.status(404).json({ 
                error: 'Post not found',
                message: 'The requested blog post does not exist or is not published'
            });
        }
        
        // Increment view count asynchronously (don't wait for it)
        BlogPost.updateOne(
            { _id: post._id },
            { $inc: { viewCount: 1 } }
        ).exec();
        
        // Find related posts (same tags, exclude current post)
        const relatedPosts = await BlogPost.find({
            status: 'published',
            _id: { $ne: post._id },
            tags: { $in: post.tags }
        })
        .populate('author', 'username')
        .select('title slug excerpt coverImage publishedAt tags')
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean();
        
        res.json({ 
            post,
            relatedPosts
        });
        
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ 
            error: 'Failed to fetch blog post',
            message: error.message 
        });
    }
});

// ========================================
// PROTECTED ROUTES (Temporary)
// ========================================

/**
 * POST /api/blog
 * Create a new blog post
 * 
 * @auth Required
 * @body { title, content, excerpt?, coverImage?, tags?, status?, featured? }
 */
router.post('/', auth, async (req, res) => {
    try {
        const { 
            title, 
            content, 
            excerpt, 
            coverImage, 
            tags = [], 
            status = 'draft',
            featured = false
        } = req.body;
        
        // Validation
        if (!title || !content) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'Title and content are required'
            });
        }
        
        if (title.length > 200) {
            return res.status(400).json({ 
                error: 'Title too long',
                message: 'Title cannot exceed 200 characters'
            });
        }
        
        // Generate unique slug
        let baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .substring(0, 100);
        
        // Check for slug uniqueness and append number if needed
        let slug = baseSlug;
        let counter = 1;
        while (await BlogPost.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        
        // Process tags (convert to array if comma-separated string)
        let processedTags = tags;
        if (typeof tags === 'string') {
            processedTags = tags
                .split(',')
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag.length > 0);
        }
        
        // Create new blog post
        const newPost = new BlogPost({
            title: title.trim(),
            slug,
            content,
            excerpt: excerpt?.trim(),
            coverImage: coverImage?.trim() || null,
            tags: processedTags,
            status,
            featured,
            author: req.user // From auth middleware
        });
        
        await newPost.save();
        
        // Populate author before sending response
        await newPost.populate('author', 'username email');
        
        res.status(201).json({
            message: 'Blog post created successfully',
            post: newPost
        });
        
    } catch (error) {
        console.error('Error creating blog post:', error);
        
        // Handle duplicate slug error (shouldn't happen with our logic, but just in case)
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: 'Duplicate slug',
                message: 'A post with this title already exists. Please use a different title.'
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to create blog post',
            message: error.message 
        });
    }
});

/**
 * PUT /api/blog/:id
 * Update an existing blog post
 * 
 * @auth Required + Ownership check
 * @param {String} id - Post ID
 * @body { title?, content?, excerpt?, coverImage?, tags?, status?, featured? }
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Find the post
        const post = await BlogPost.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                error: 'Post not found',
                message: 'The requested blog post does not exist'
            });
        }
        
        // Check ownership
        if (post.author.toString() !== req.user.toString()) {
            return res.status(403).json({ 
                error: 'Unauthorized',
                message: 'You can only edit your own posts'
            });
        }
        
        // If title is being updated, regenerate slug
        if (updates.title && updates.title !== post.title) {
            let baseSlug = updates.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .substring(0, 100);
            
            // Check for slug uniqueness
            let slug = baseSlug;
            let counter = 1;
            while (await BlogPost.findOne({ slug, _id: { $ne: id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            
            updates.slug = slug;
        }
        
        // Process tags if provided
        if (updates.tags) {
            if (typeof updates.tags === 'string') {
                updates.tags = updates.tags
                    .split(',')
                    .map(tag => tag.trim().toLowerCase())
                    .filter(tag => tag.length > 0);
            }
        }
        
        // If changing to published and not yet published, set publishedAt
        if (updates.status === 'published' && !post.publishedAt) {
            updates.publishedAt = new Date();
        }
        
        // Update the post
        Object.assign(post, updates);
        await post.save();
        
        // Populate author before sending response
        await post.populate('author', 'username email');
        
        res.json({
            message: 'Blog post updated successfully',
            post
        });
        
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ 
            error: 'Failed to update blog post',
            message: error.message 
        });
    }
});

/**
 * DELETE /api/blog/:id
 * Delete a blog post
 * 
 * @auth Required + Ownership check
 * @param {String} id - Post ID
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the post
        const post = await BlogPost.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                error: 'Post not found',
                message: 'The requested blog post does not exist'
            });
        }
        
        // Check ownership
        if (post.author.toString() !== req.user.toString()) {
            return res.status(403).json({ 
                error: 'Unauthorized',
                message: 'You can only delete your own posts'
            });
        }
        
        await BlogPost.findByIdAndDelete(id);
        
        res.json({
            message: 'Blog post deleted successfully',
            deletedPost: {
                id: post._id,
                title: post.title
            }
        });
        
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ 
            error: 'Failed to delete blog post',
            message: error.message 
        });
    }
});

/**
 * GET /api/blog/user/drafts
 * Get all drafts for the authenticated user
 * 
 * @auth Required
 */
router.get('/user/drafts', auth, async (req, res) => {
    try {
        const drafts = await BlogPost.find({ 
            author: req.user,
            status: { $in: ['draft', 'archived'] }
        })
        .sort({ updatedAt: -1 })
        .lean();
        
        res.json({ 
            drafts,
            count: drafts.length
        });
        
    } catch (error) {
        console.error('Error fetching drafts:', error);
        res.status(500).json({ 
            error: 'Failed to fetch drafts',
            message: error.message 
        });
    }
});

module.exports = router;