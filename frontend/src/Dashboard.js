// frontend/src/Dashboard.js - Fixed version
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { 'x-auth-token': token }
                };

                // Fetch user's forms
                const formsResponse = await axios.get('http://localhost:5000/api/forms/my-forms', config);
                setForms(formsResponse.data.submissions);
                
                setLoading(false);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
                setError('Failed to load dashboard data');
                
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('onboardingToken');
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'draft': { class: 'bg-secondary', text: 'Draft' },
            'submitted': { class: 'bg-primary', text: 'Submitted' },
            'in_review': { class: 'bg-warning', text: 'In Review' },
            'approved': { class: 'bg-success', text: 'Approved' },
            'rejected': { class: 'bg-danger', text: 'Rejected' },
            'requires_revision': { class: 'bg-warning', text: 'Needs Revision' }
        };
        
        const config = statusConfig[status] || { class: 'bg-secondary', text: status };
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>My Dashboard</h2>
                        <button onClick={handleLogout} className="btn btn-outline-danger">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>My Forms</h4>
                        </div>
                        <div className="card-body">
                            {forms.length === 0 ? (
                                <div className="text-center text-muted">
                                    <p>No forms submitted yet.</p>
                                    <p>Your completed onboarding form should appear here.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Form Type</th>
                                                <th>Status</th>
                                                <th>Progress</th>
                                                <th>Last Updated</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {forms.map(form => (
                                                <tr key={form._id}>
                                                    <td>
                                                        <strong>{form.formType}</strong>
                                                        <br />
                                                        <small className="text-muted">v{form.formVersion}</small>
                                                    </td>
                                                    <td>{getStatusBadge(form.status)}</td>
                                                    <td>
                                                        <div className="progress" style={{height: '6px'}}>
                                                            <div 
                                                                className="progress-bar" 
                                                                style={{width: `${form.completionPercentage}%`}}
                                                            ></div>
                                                        </div>
                                                        <small>{form.completionPercentage}% complete</small>
                                                    </td>
                                                    <td>
                                                        {new Date(form.updatedAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <Link 
                                                            to={`/forms/${form._id}`} 
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;