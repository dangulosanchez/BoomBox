// frontend/src/EmailVerification.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.post(`http://localhost:5000/api/auth/verify-email/${token}`);
                
                // Store onboarding token
                localStorage.setItem('onboardingToken', response.data.onboardingToken);
                
                setStatus('success');
                setMessage(response.data.message);
                
                // Redirect to onboarding after 2 seconds
                setTimeout(() => {
                    navigate('/onboarding');
                }, 2000);
                
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body text-center">
                            {status === 'verifying' && (
                                <>
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h4>Verifying your email...</h4>
                                </>
                            )}
                            
                            {status === 'success' && (
                                <>
                                    <div className="text-success mb-3">
                                        <i className="bi bi-check-circle-fill" style={{fontSize: '3rem'}}></i>
                                    </div>
                                    <h4 className="text-success">Email Verified!</h4>
                                    <p>{message}</p>
                                    <p>Redirecting to onboarding...</p>
                                </>
                            )}
                            
                            {status === 'error' && (
                                <>
                                    <div className="text-danger mb-3">
                                        <i className="bi bi-exclamation-circle-fill" style={{fontSize: '3rem'}}></i>
                                    </div>
                                    <h4 className="text-danger">Verification Failed</h4>
                                    <p>{message}</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => navigate('/register')}
                                    >
                                        Back to Registration
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;