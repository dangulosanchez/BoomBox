const jwt = require('jsonwebtoken');
const User = require('../model/User');

// Standard authentication middleware
const authMiddleware = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure token is for general access
        if (decoded.purpose !== 'access') {
            return res.status(401).json({ message: 'Invalid token type' });
        }
        
        const user = await User.findById(decoded.userId);
        if (!user || user.accountStatus !== 'active') {
            return res.status(401).json({ message: 'Account not active' });
        }
        
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Onboarding-specific middleware (allows pending_onboarding users)
const onboardingMiddleware = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!['onboarding', 'access'].includes(decoded.purpose)) {
            return res.status(401).json({ message: 'Invalid token type' });
        }
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        // Validate session for onboarding tokens
        if (decoded.purpose === 'onboarding') {
            if (!decoded.sessionId || user.activeOnboardingSession !== decoded.sessionId) {
                return res.status(401).json({ message: 'Invalid or expired session' });
            }
        }
        
        if (!['pending_onboarding', 'active'].includes(user.accountStatus)) {
            return res.status(401).json({ message: 'Account not authorized' });
        }
        
        req.user = decoded.userId;
        req.userStatus = user.accountStatus;
        req.sessionId = decoded.sessionId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { 
    auth: authMiddleware, 
    authMiddleware,
    onboardingMiddleware
};