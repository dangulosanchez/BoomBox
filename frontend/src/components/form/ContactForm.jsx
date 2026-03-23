// frontend/src/components/forms/ContactForm.jsx
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import styles from './ContactForm.module.css';
import content from '../../data/content.json';

const cf = content.contact_form;

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
 * - URL parameter support for pre-filling inquiry type (?type=event-collaboration)
 */

const inquiryTypes = cf.inquiry_types;

const ContactForm = () => {
    const [searchParams] = useSearchParams();

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

    /**
     * Pre-fill inquiry type from URL parameter on mount
     */
    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam) {
            // Check if the type parameter matches a valid inquiry type
            const validType = inquiryTypes.find(t => t.value === typeParam);
            if (validType) {
                setFormData(prev => ({
                    ...prev,
                    inquiryType: typeParam
                }));
            }
        }
    }, [searchParams]);

    /**
     * Real-time Validation
     */
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 100) return 'Name cannot exceed 100 characters';
                if (!/^[a-zA-Z\s\-'.]+$/.test(value)) return 'Name contains invalid characters';
                return '';

            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
                if (value.length > 100) return 'Email is too long';
                return '';

            case 'phone':
                if (value && !/^[\d\s\-+()]+$/.test(value)) return 'Invalid phone number';
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

        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate if field was previously touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    /**
     * Handle field blur (mark as touched)
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    /**
     * Validate entire form
     */
    const validateForm = () => {
        const formErrors = {};

        Object.keys(formData).forEach(key => {
            if (key !== 'website' && key !== 'phone') { // Skip honeypot and optional phone
                const error = validateField(key, formData[key]);
                if (error) formErrors[key] = error;
            }
        });

        return formErrors;
    };

    /**
     * Handle captcha verification
     */
    const handleCaptchaVerify = (token) => {
        setCaptchaToken(token);
    };

    /**
     * Handle captcha expiration
     */
    const handleCaptchaExpire = () => {
        setCaptchaToken(null);
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
            setSubmitMessage(cf.validation.captcha_required);
            return;
        }

        // Check honeypot (if filled, it's a bot)
        if (formData.website) {
            console.log('Bot detected via honeypot');
            // Silently fail for bots
            setSubmitStatus('success');
            setSubmitMessage(cf.success.default_message);
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
                setSubmitMessage(data.message || cf.success.default_message);

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
                setSubmitMessage(data.error || cf.errors.generic);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            setSubmitMessage(cf.errors.network);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.contactFormWrapper} ref={formRef}>
            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className={styles.successMessage} role="alert">
                    <div className={styles.successIcon}>✓</div>
                    <h3>{cf.success.title}</h3>
                    <p>{submitMessage}</p>
                    <p className={styles.successSubtext}>{cf.success.subtext}</p>
                </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
                <div className={styles.errorMessage} role="alert">
                    <span className={styles.errorIcon}>⚠</span>
                    <p>{submitMessage}</p>
                </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
                {/* Name Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        {cf.labels.name} <span className={styles.required} aria-label="required">*</span>
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
                        {cf.labels.email} <span className={styles.required} aria-label="required">*</span>
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
                        {cf.labels.phone} <span className={styles.optional}>{cf.labels.phone_optional}</span>
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
                        placeholder={cf.placeholders.phone}
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
                        {cf.labels.inquiry_type} <span className={styles.required} aria-label="required">*</span>
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
                        {cf.labels.subject} <span className={styles.required} aria-label="required">*</span>
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
                        placeholder={cf.placeholders.subject}
                    />
                    {errors.subject && touched.subject && (
                        <span id="subject-error" className={styles.errorText} role="alert">
                            {errors.subject}
                        </span>
                    )}
                </div>

                {/* Message Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>
                        {cf.labels.message} <span className={styles.required} aria-label="required">*</span>
                    </label>
                    <div className={styles.textareaWrapper}>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows="6"
                            maxLength={MAX_MESSAGE_LENGTH}
                            className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ''}`}
                            aria-required="true"
                            aria-invalid={errors.message && touched.message ? 'true' : 'false'}
                            aria-describedby={errors.message && touched.message ? 'message-error' : 'message-hint'}
                            disabled={isSubmitting}
                            placeholder={cf.placeholders.message}
                        />
                        <div className={styles.characterCount}>
                            {formData.message.length} / {MAX_MESSAGE_LENGTH}
                        </div>
                    </div>
                    {errors.message && touched.message ? (
                        <span id="message-error" className={styles.errorText} role="alert">
                            {errors.message}
                        </span>
                    ) : (
                        <span id="message-hint" className={styles.hintText}>
                            {cf.submit.message_hint.replace('{min}', MIN_MESSAGE_LENGTH)}
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
                    aria-label={isSubmitting ? cf.submit.button_sending : cf.submit.button_idle}
                >
                    {isSubmitting ? (
                        <>
                            <span className={styles.spinner} aria-hidden="true"></span>
                            {cf.submit.button_sending}
                        </>
                    ) : (
                        cf.submit.button_idle
                    )}
                </button>

                {/* Required Fields Notice */}
                <p className={styles.requiredNotice}>
                    <span className={styles.required}>*</span> {cf.submit.required_notice.replace('* ', '')}
                </p>
            </form>
        </div>
    );
};

export default ContactForm;
