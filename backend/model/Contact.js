// backend/model/Contact.js
const mongoose = require('mongoose');

/**
 * Contact Submission Schema
 * 
 * Security Features:
 * - Stores IP and User Agent for abuse tracking
 * - Timestamps for audit trail
 * - Indexed email for quick lookup/blocking
 * - Status field for future admin moderation
 */
const ContactSchema = new mongoose.Schema({
    // User-provided fields
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        index: true, // Index for quick lookups (blocking repeat offenders)
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: { 
        type: String,
        trim: true,
        maxlength: [20, 'Phone cannot exceed 20 characters'],
        default: null
    },
    subject: { 
        type: String, 
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: { 
        type: String, 
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    inquiryType: {
        type: String,
        required: [true, 'Inquiry type is required'],
        enum: {
            values: ['booking', 'general', 'press', 'partnerships', 'technical'],
            message: '{VALUE} is not a valid inquiry type'
        }
    },
    
    // Security & Tracking Fields (not exposed to user)
    ipAddress: { 
        type: String,
        required: true
    },
    userAgent: { 
        type: String,
        default: 'Unknown'
    },
    
    // Status for future admin moderation
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'spam', 'resolved'],
        default: 'pending'
    },
    
    // Metadata
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true // Index for sorting/filtering by date
    },
    
    // Future: Link to user account if they're logged in
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    // Additional options
    timestamps: true // Adds createdAt and updatedAt automatically
});

/**
 * Indexes for Performance & Security
 */
// Compound index for finding submissions by email within a time range
ContactSchema.index({ email: 1, createdAt: -1 });

// Index for IP-based abuse detection
ContactSchema.index({ ipAddress: 1, createdAt: -1 });

/**
 * Static Method: Check if email/IP has exceeded submission limit
 * Returns true if abuse detected
 */
ContactSchema.statics.checkAbuse = async function(email, ipAddress) {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    // Check email-based abuse (max 3 submissions per 15 min)
    const emailCount = await this.countDocuments({
        email: email,
        createdAt: { $gte: fifteenMinutesAgo }
    });
    
    // Check IP-based abuse (max 5 submissions per 15 min)
    const ipCount = await this.countDocuments({
        ipAddress: ipAddress,
        createdAt: { $gte: fifteenMinutesAgo }
    });
    
    return emailCount >= 3 || ipCount >= 5;
};

/**
 * Instance Method: Sanitize for public display (future admin panel)
 */
ContactSchema.methods.toPublicJSON = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        subject: this.subject,
        inquiryType: this.inquiryType,
        status: this.status,
        createdAt: this.createdAt
        // Excludes: message, ipAddress, userAgent for privacy
    };
};

module.exports = mongoose.model('Contact', ContactSchema);