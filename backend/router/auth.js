const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../model/User');

const router = express.Router();

const rateLimit = require('express-rate-limit');
const emailVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many verification attempts'
});


const createEmailTransporter = () => {
    if (process.env.NODE_ENV === 'production') {
        return nodemailer.createTransport({
            service: 'gmail', // or your preferred service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    } else {
        // Development - use Ethereal Email for testing
        return nodemailer.createTestAccount().then(account => {
            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
        });
    }
};

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
        });
        
        await newUser.save();
        
        // Send verification email
        const transporter = await createEmailTransporter();
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email - Complete Your Registration',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <h2>Welcome ${username}!</h2>
                    <p>Thank you for registering. Please click the link below to verify your email and complete your onboarding:</p>
                    <a href="${verificationUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
                        Verify Email & Complete Onboarding
                    </a>
                    <p><strong>This link expires in 24 hours.</strong></p>
                    <p>If you didn't create this account, please ignore this email.</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(201).json({ 
            message: 'Registration successful. Please check your email to verify your account.',
            emailSent: true
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Email verification endpoint
router.post('/verify-email/:token', emailVerificationLimiter, async (req, res) => {
    const { token } = req.params;
    
    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }
        
        const tokenAlreadyUsed = user.usedVerificationTokens.some(
            usedToken => usedToken.token === token
        );
        
        if (tokenAlreadyUsed) {
            return res.status(400).json({ error: 'Verification link has already been used' });
        }
        
        // Mark token as used
        user.usedVerificationTokens.push({ token });
        
        // Generate session ID for onboarding
        const sessionId = crypto.randomBytes(16).toString('hex');
        user.activeOnboardingSession = sessionId;
        
        // Update user status
        user.isEmailVerified = true;
        user.emailVerifiedAt = new Date();
        user.accountStatus = 'pending_onboarding';
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        
        await user.save();
        
        // Generate temporary JWT with session ID
        const onboardingToken = jwt.sign(
            { 
                userId: user._id, 
                purpose: 'onboarding',
                sessionId: sessionId
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        
        res.json({
            message: 'Email verified successfully',
            onboardingToken,
            redirectTo: '/onboarding'
        });
        
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        
        // Check account status
        if (!user.isEmailVerified) {
            return res.status(403).json({ 
                error: 'Please verify your email before logging in',
                accountStatus: user.accountStatus
            });
        }
        
        if (user.accountStatus === 'pending_onboarding') {
            // Generate onboarding token
            const onboardingToken = jwt.sign(
                { userId: user._id, purpose: 'onboarding' },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );
            
            return res.json({
                message: 'Please complete your onboarding',
                onboardingToken,
                accountStatus: user.accountStatus,
                redirectTo: '/onboarding'
            });
        }
        
        if (user.accountStatus !== 'active') {
            return res.status(403).json({ 
                error: 'Account is not active. Please contact support.',
                accountStatus: user.accountStatus
            });
        }
        
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        
        // Generate full access token
        const token = jwt.sign(
            { userId: user._id, purpose: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                accountStatus: user.accountStatus
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;