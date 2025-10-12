// frontend/src/OnboardingRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OnboardingRoute = ({ children, authState }) => {
    const onboardingToken = localStorage.getItem('onboardingToken');
    const accessToken = localStorage.getItem('token');
    
    // If user is fully authenticated, redirect to dashboard
    if (accessToken && authState.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }
    
    // Check onboarding token
    if (onboardingToken) {
        try {
            const decodedToken = jwtDecode(onboardingToken);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp > currentTime && decodedToken.purpose === 'onboarding') {
                return children;
            } else {
                localStorage.removeItem('onboardingToken');
            }
        } catch (error) {
            console.error('Invalid onboarding token:', error);
            localStorage.removeItem('onboardingToken');
        }
    }
    
    return <Navigate to="/login" />;
};

export default OnboardingRoute;