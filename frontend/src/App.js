import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import OnboardingRoute from './OnboardingRoute';
import Navbar from './Navbar';
import Home from './Home';
// import EmailVerification from './EmailVerification';
// import RegistrationSuccess from './RegistrationSuccess';

function App() {
    const [authState, setAuthState] = useState({
        isAuthenticated: !!localStorage.getItem('token'),
        isOnboarding: !!localStorage.getItem('onboardingToken'),
        user: null
    });

    // Check token validity on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const onboardingToken = localStorage.getItem('onboardingToken');
        
        if (token || onboardingToken) {
            // Could add token validation here
            setAuthState({
                isAuthenticated: !!token,
                isOnboarding: !!onboardingToken,
                user: null // Will be populated on successful auth
            });
        }
    }, []);

    const updateAuthState = (newState) => {
        setAuthState(prev => ({ ...prev, ...newState }));
    };

    return (
        <Router>
            <Navbar authState={authState} updateAuthState={updateAuthState} />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    
                    <Route path="/register" element={
                        <PublicRoute authState={authState}>
                            <RegistrationForm />
                        </PublicRoute>
                    } />
                    
                    <Route path="/login" element={
                        <PublicRoute authState={authState}>
                            <LoginForm setAuth={updateAuthState} />
                        </PublicRoute>
                    } />
                    
                    {/* <Route path="/registration-success" element={<RegistrationSuccess />} /> */}
                    {/* <Route path="/verify-email/:token" element={<EmailVerification />} /> */}
                    
                    <Route path="/onboarding" element={
                        <OnboardingRoute authState={authState}>
                            {/* <A1Form updateAuthState={updateAuthState} /> */}
                        </OnboardingRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute authState={authState}>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/forms/:formId" element={
                        <ProtectedRoute authState={authState}>
                            {/* <FormView /> */}
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;