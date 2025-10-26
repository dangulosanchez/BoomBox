// frontend/src/components/forms/ContactForm.jsx
import { useState, useRef, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import styles from './ContactForm.module.css';

/**
 * ContactForm Component
 * 
 * Features:
 * - Real-time validation
 * - hCaptcha integration
 * - Honeypot field for bot detection
 * - Accessible (ARIA labels, keyboard nav)
 * - Character counter
 * - Loading states and error handling
 */
const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: '',
        website: '' // Honeypot field
    });
    
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
    const [submitMessage, setSubmitMessage] = useState('');
    
    const captchaRef = useRef(null);
    const formRef = useRef(null);
    
    const MAX_MESSAGE_LENGTH = 2000;
    const MIN_MESSAGE_LENGTH = 20;
    
    const inquiryTypes = [
        { value: '', label: 'Select inquiry type *' },
        { value: 'booking', label: 'Booking Request' },
        { value: 'general', label: 'General Inquiry' },
        { value: 'press', label: 'Press Inquiry' },
        { value: 'partnerships', label: 'Partnerships' },
        { value: 'technical', label: 'Technical Support' }
    ];
    
    /**
     * Real-time Validation
     */
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 100) return 'Name cannot exceed 100 characters';
                if (!/^[a-zA-Z\s\-'\.]+$/.test(value)) return 'Name contains invalid characters';
                return '';
            
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
                if (value.length > 100) return 'Email is too long';
                return '';
            
            case 'phone':
                if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) return 'Invalid phone number';
                if (value && value.length > 20) return 'Phone number is too long';
                return '';
            
            case 'subject':
                if (!value.trim()) return 'Subject is required';
                if (value.length < 5) return 'Subject must be at least 5 characters';
                if (value.length > 200) return 'Subject cannot exceed 200 characters';
                return '';
            
            case 'message':
                if (!value.trim()) return 'Message is required';
                if (value.length < MIN_MESSAGE_LENGTH) return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
                if (value.length > MAX_MESSAGE_LENGTH) return `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
                return '';
            
            case 'inquiryType':
                if (!value) return 'Please select an inquiry type';
                return '';
            
            default:
                return '';
        }
    };
    
    /**
     * Handle input change with validation
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate on change if field has been touched
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };
    
    /**
     * Handle blur (mark field as touched)
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };
    
    /**
     * Handle hCaptcha verification
     */
    const handleCaptchaVerify = (token) => {
        setCaptchaToken(token);
    };
    
    /**
     * Handle hCaptcha expiration
     */
    const handleCaptchaExpire = () => {
        setCaptchaToken(null);
    };
    
    /**
     * Validate entire form
     */
    const validateForm = () => {
        const newErrors = {};
        
        Object.keys(formData).forEach(key => {
            if (key !== 'website' && key !== 'phone') { // Phone is optional
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        
        return newErrors;
    };
    
    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        // Validate form
        const formErrors = validateForm();
        setErrors(formErrors);
        
        // Check if there are errors
        if (Object.keys(formErrors).length > 0) {
            // Focus on first error field
            const firstErrorField = Object.keys(formErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) element.focus();
            return;
        }
        
        // Check captcha
        if (!captchaToken) {
            setSubmitStatus('error');
            setSubmitMessage('Please complete the captcha verification');
            return;
        }
        
        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage('');
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    captchaToken
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage(data.message || 'Your message has been sent successfully!');
                
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    inquiryType: '',
                    website: ''
                });
                setTouched({});
                setErrors({});
                setCaptchaToken(null);
                
                // Reset captcha
                if (captchaRef.current) {
                    captchaRef.current.resetCaptcha();
                }
                
                // Scroll to success message
                if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                setSubmitStatus('error');
                
                // Handle validation errors from backend
                if (data.details && Array.isArray(data.details)) {
                    const backendErrors = {};
                    data.details.forEach(err => {
                        backendErrors[err.field] = err.message;
                    });
                    setErrors(backendErrors);
                    setSubmitMessage('Please fix the errors and try again');
                } else {
                    setSubmitMessage(data.error || 'An error occurred. Please try again.');
                }
                
                // Reset captcha on error
                if (captchaRef.current) {
                    captchaRef.current.resetCaptcha();
                }
                setCaptchaToken(null);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            setSubmitMessage('Network error. Please check your connection and try again.');
            
            // Reset captcha on error
            if (captchaRef.current) {
                captchaRef.current.resetCaptcha();
            }
            setCaptchaToken(null);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    /**
     * Get character count color based on limit
     */
    const getCharCountColor = () => {
        const length = formData.message.length;
        if (length < MIN_MESSAGE_LENGTH) return styles.charCountLow;
        if (length > MAX_MESSAGE_LENGTH * 0.9) return styles.charCountHigh;
        return styles.charCountNormal;
    };
    
    return (
        <div className={styles.contactFormWrapper} ref={formRef}>
            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className={styles.successMessage} role="alert" aria-live="polite">
                    <div className={styles.successIcon}>✓</div>
                    <h3>Message Sent!</h3>
                    <p>{submitMessage}</p>
                    <p className={styles.successSubtext}>
                        We typically respond within 24-48 hours.
                    </p>
                </div>
            )}
            
            {/* Error Message */}
            {submitStatus === 'error' && (
                <div className={styles.errorMessage} role="alert" aria-live="assertive">
                    <div className={styles.errorIcon}>⚠</div>
                    <p>{submitMessage}</p>
                </div>
            )}
            
            <form 
                className={styles.contactForm} 
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
            >
                {/* Name Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Name <span className={styles.required} aria-label="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
                        aria-required="true"
                        aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                        aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                        disabled={isSubmitting}
                    />
                    {errors.name && touched.name && (
                        <span id="name-error" className={styles.errorText} role="alert">
                            {errors.name}
                        </span>
                    )}
                </div>
                
                {/* Email Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email <span className={styles.required} aria-label="required">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                        aria-required="true"
                        aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                        aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                        disabled={isSubmitting}
                    />
                    {errors.email && touched.email && (
                        <span id="email-error" className={styles.errorText} role="alert">
                            {errors.email}
                        </span>
                    )}
                </div>
                
                {/* Phone Field (Optional) */}
                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                        Phone <span className={styles.optional}>(optional)</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
                        aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                        disabled={isSubmitting}
                        placeholder="(555) 123-4567"
                    />
                    {errors.phone && touched.phone && (
                        <span id="phone-error" className={styles.errorText} role="alert">
                            {errors.phone}
                        </span>
                    )}
                </div>
                
                {/* Inquiry Type Dropdown */}
                <div className={styles.formGroup}>
                    <label htmlFor="inquiryType" className={styles.label}>
                        Inquiry Type <span className={styles.required} aria-label="required">*</span>
                    </label>
                    <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${styles.select} ${errors.inquiryType && touched.inquiryType ? styles.inputError : ''}`}
                        aria-required="true"
                        aria-invalid={errors.inquiryType && touched.inquiryType ? 'true' : 'false'}
                        aria-describedby={errors.inquiryType && touched.inquiryType ? 'inquiryType-error' : undefined}
                        disabled={isSubmitting}
                    >
                        {inquiryTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.inquiryType && touched.inquiryType && (
                        <span id="inquiryType-error" className={styles.errorText} role="alert">
                            {errors.inquiryType}
                        </span>
                    )}
                </div>
                
                {/* Subject Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.label}>
                        Subject <span className={styles.required} aria-label="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.subject && touched.subject ? styles.inputError : ''}`}
                        aria-required="true"
                        aria-invalid={errors.subject && touched.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject && touched.subject ? 'subject-error' : undefined}
                        disabled={isSubmitting}
                        placeholder="Brief description of your inquiry"
                    />
                    {errors.subject && touched.subject && (
                        <span id="subject-error" className={styles.errorText} role="alert">
                            {errors.subject}
                        </span>
                    )}
                </div>
                
                {/* Message Field with Character Counter */}
                <div className={styles.formGroup}>
                    <div className={styles.labelRow}>
                        <label htmlFor="message" className={styles.label}>
                            Message <span className={styles.required} aria-label="required">*</span>
                        </label>
                        <span 
                            className={`${styles.charCount} ${getCharCountColor()}`}
                            aria-live="polite"
                            aria-label={`${formData.message.length} of ${MAX_MESSAGE_LENGTH} characters used`}
                        >
                            {formData.message.length} / {MAX_MESSAGE_LENGTH}
                        </span>
                    </div>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows="6"
                        className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ''}`}
                        aria-required="true"
                        aria-invalid={errors.message && touched.message ? 'true' : 'false'}
                        aria-describedby={errors.message && touched.message ? 'message-error' : 'message-hint'}
                        disabled={isSubmitting}
                        placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && touched.message ? (
                        <span id="message-error" className={styles.errorText} role="alert">
                            {errors.message}
                        </span>
                    ) : (
                        <span id="message-hint" className={styles.hintText}>
                            Minimum {MIN_MESSAGE_LENGTH} characters required
                        </span>
                    )}
                </div>
                
                {/* Honeypot Field (hidden from users, catches bots) */}
                <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex="-1"
                        autoComplete="off"
                    />
                </div>
                
                {/* hCaptcha Widget */}
                <div className={styles.captchaWrapper}>
                    <HCaptcha
                        ref={captchaRef}
                        sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                        onVerify={handleCaptchaVerify}
                        onExpire={handleCaptchaExpire}
                        theme="light"
                    />
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting || !captchaToken}
                    aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                >
                    {isSubmitting ? (
                        <>
                            <span className={styles.spinner} aria-hidden="true"></span>
                            Sending...
                        </>
                    ) : (
                        'Send Message'
                    )}
                </button>
                
                {/* Required Fields Notice */}
                <p className={styles.requiredNotice}>
                    <span className={styles.required}>*</span> Required fields
                </p>
            </form>
        </div>
    );
};

export default ContactForm;