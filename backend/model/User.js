const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    usedVerificationTokens: [{ 
        token: String, 
        usedAt: { type: Date, default: Date.now }
    }],

    activeOnboardingSession: { type: String }, // Store session ID
    accountStatus: { 
        type: String, 
        enum: ['pending_verification', 'pending_onboarding', 'active', 'suspended'],
        default: 'pending_verification'
    },
    onboardingCompleted: { type: Boolean, default: false },
    
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
    emailVerifiedAt: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);