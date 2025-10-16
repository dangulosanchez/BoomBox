import styles from './TestimonialSection.module.css';

/**
 * TestimonialSection Component - Social proof via testimonials
 * 
 * @component
 * @description
 * Displays testimonials from regulars/attendees.
 * Placeholder testimonials included - replace with real ones.
 * 
 * @example
 * <TestimonialSection />
 */
const TestimonialSection = () => {
  // TODO: Replace with real testimonials from regulars
  // Collect via Instagram DMs, email, or in-person at events
  const testimonials = [
    {
      id: 1,
      quote: "Real music, real people. No pretense, just good vibes and sound. Been my go-to spot since '21.",
      author: "Marcus T.",
      location: "Design District"
    },
    {
      id: 2,
      quote: "The Box is where Miami's underground actually lives. Every show feels like discovering something special.",
      author: "Sofia R.",
      location: "Little Havana"
    },
    {
      id: 3,
      quote: "Best sound system in Miami, hands down. If you know, you know.",
      author: "DJ Maya",
      location: "Miami local"
    }
  ];

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What People Say</h2>
          <div className={styles.accentLine}></div>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className={styles.card}>
              <div className={styles.quoteIcon} aria-hidden="true">"</div>
              <blockquote className={styles.quote}>
                <p className={styles.quoteText}>{testimonial.quote}</p>
                <footer className={styles.author}>
                  — {testimonial.author}, <span className={styles.location}>{testimonial.location}</span>
                </footer>
              </blockquote>
            </article>
          ))}
        </div>

        <div className={styles.rating}>
          <p className={styles.ratingText}>
            <span className={styles.stars} aria-label="5 out of 5 stars">
              ⭐⭐⭐⭐⭐
            </span>
            <span className={styles.ratingScore}>4.8/5 on Google</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;