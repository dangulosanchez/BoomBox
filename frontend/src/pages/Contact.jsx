// frontend/src/pages/Contact.jsx
import ContactForm from '../components/form/ContactForm';
import styles from './Contact.module.css';

/**
 * Contact Page
 * 
 * Full-page layout for the contact form with:
 * - Hero section
 * - Contact information
 * - Form component
 * - Social media links
 */
const Contact = () => {
    return (
        <div className={styles.contactPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Get in Touch</h1>
                    <p className={styles.heroSubtitle}>
                        Questions about bookings, events, or partnerships? We'd love to hear from you.
                    </p>
                </div>
            </section>
            
            {/* Main Content */}
            <section className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.contentGrid}>
                        {/* Left Column - Contact Info */}
                        <div className={styles.infoColumn}>
                            <div className={styles.infoCard}>
                                <h2 className={styles.infoTitle}>Contact Information</h2>
                                
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>📧</div>
                                    <div>
                                        <h3 className={styles.infoLabel}>Email</h3>
                                        <a 
                                            href="mailto:contact@theboomboxmiami.com" 
                                            className={styles.infoLink}
                                        >
                                            contact@theboomboxmiami.com
                                        </a>
                                    </div>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>📍</div>
                                    <div>
                                        <h3 className={styles.infoLabel}>Location</h3>
                                        <p className={styles.infoText}>
                                            Miami, Florida<br />
                                            Underground Music Scene
                                        </p>
                                    </div>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>🎵</div>
                                    <div>
                                        <h3 className={styles.infoLabel}>Events</h3>
                                        <a 
                                            href="https://shotgun.live/en/venues/the-boombox-miami" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.infoLink}
                                        >
                                            View on Shotgun
                                        </a>
                                    </div>
                                </div>
                                
                                <div className={styles.socialLinks}>
                                    <h3 className={styles.infoLabel}>Follow Us</h3>
                                    <div className={styles.socialIcons}>
                                        <a 
                                            href="https://instagram.com/theboomboxmiami" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.socialIcon}
                                            aria-label="Follow us on Instagram"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </a>
                                        <a 
                                            href="https://facebook.com/theboomboxmiami" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.socialIcon}
                                            aria-label="Follow us on Facebook"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Response Time Card */}
                            <div className={styles.responseCard}>
                                <h3 className={styles.responseTitle}>⚡ Quick Response</h3>
                                <p className={styles.responseText}>
                                    We typically respond to all inquiries within 24-48 hours. 
                                    For urgent booking requests, please mention it in your message.
                                </p>
                            </div>
                        </div>
                        
                        {/* Right Column - Contact Form */}
                        <div className={styles.formColumn}>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;