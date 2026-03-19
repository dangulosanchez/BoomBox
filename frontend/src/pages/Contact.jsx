// frontend/src/pages/Contact.jsx
import ContactForm from '../components/form/ContactForm';
import styles from './Contact.module.css';

/**
 * Contact Page — Windows XP CyberLuna style
 *
 * Two-panel layout: left info window + right form window.
 * Window chrome mirrors the CyberLunaWindow component (static, not draggable).
 */
const Contact = () => {
    return (
        <div className={styles.contactPage}>
            <div className={styles.desktop}>
                <div className={styles.container}>
                    <div className={styles.layout}>

                        {/* ─── Left: Contact Information Window ─── */}
                        <aside className={styles.infoPanel}>
                            <div className={styles.xpWindow}>
                                {/* Title Bar */}
                                <div className={styles.titleBar}>
                                    <span className={styles.winIcon}>◈</span>
                                    <span className={styles.winTitle}>Contact Information</span>
                                    <div className={styles.winControls}>
                                        <button className={`${styles.winBtn} ${styles.minBtn}`} type="button" aria-label="Minimize">
                                            <span className={styles.minIcon} />
                                        </button>
                                        <button className={`${styles.winBtn} ${styles.maxBtn}`} type="button" aria-label="Maximize">
                                            <span className={styles.maxIcon} />
                                        </button>
                                        <button className={`${styles.winBtn} ${styles.closeBtn}`} type="button" aria-label="Close">✕</button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className={styles.windowBody}>
                                    <h2 className={styles.sectionHeading}>Contact Information</h2>
                                    <hr className={styles.divider} />

                                    {/* Email */}
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>✉</div>
                                        <div>
                                            <div className={styles.infoLabel}>EMAIL</div>
                                            <a href="mailto:contact@theboomboxmiami.com" className={styles.infoLink}>
                                                contact@theboomboxmiami.com
                                            </a>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>⊙</div>
                                        <div>
                                            <div className={styles.infoLabel}>LOCATION</div>
                                            <p className={styles.infoText}>
                                                Miami, Florida<br />
                                                Underground Music Scene
                                            </p>
                                        </div>
                                    </div>

                                    {/* Events */}
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>♪</div>
                                        <div>
                                            <div className={styles.infoLabel}>EVENTS</div>
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

                                    {/* Social */}
                                    <div className={styles.socialSection}>
                                        <div className={styles.socialLabel}>Follow Us</div>
                                        <div className={styles.socialIcons}>
                                            <a
                                                href="https://instagram.com/theboomboxmiami"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialIcon}
                                                aria-label="Follow us on Instagram"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                            </a>
                                            <a
                                                href="https://facebook.com/theboomboxmiami"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialIcon}
                                                aria-label="Follow us on Facebook"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Response Alert */}
                            <div className={styles.responseBox}>
                                <div className={styles.responseTitle}>⚠ Quick Response</div>
                                <p className={styles.responseText}>
                                    We typically respond to all inquiries within 24-48 hours.
                                    For urgent booking requests, please mention it in your message.
                                </p>
                            </div>
                        </aside>

                        {/* ─── Right: Inquiry Form Window ─── */}
                        <div className={styles.formPanel}>
                            <div className={styles.xpWindow}>
                                {/* Title Bar */}
                                <div className={styles.titleBar}>
                                    <span className={styles.winIcon}>◈</span>
                                    <span className={styles.winTitle}>Contact Us – Inquiry Form</span>
                                    <div className={styles.winControls}>
                                        <button className={`${styles.winBtn} ${styles.minBtn}`} type="button" aria-label="Minimize">
                                            <span className={styles.minIcon} />
                                        </button>
                                        <button className={`${styles.winBtn} ${styles.maxBtn}`} type="button" aria-label="Maximize">
                                            <span className={styles.maxIcon} />
                                        </button>
                                        <button className={`${styles.winBtn} ${styles.closeBtn}`} type="button" aria-label="Close">✕</button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className={styles.windowBody}>
                                    <ContactForm />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
