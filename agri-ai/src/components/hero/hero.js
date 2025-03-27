import { ArrowDownRight, Sparkles } from "lucide-react"
import styles from "./hero.module.css"

const Hero = ({ onExplore }) => {
  return (
    <section className={styles.heroSection}>
      {/* Background gradient */}
      <div className={styles.backgroundGradient} />

      {/* Content container */}
      <div className={styles.containerMain}>
        <div className={styles.textContainer}>
          <div className={`${styles.tagline} ${styles.fadeIn}`}>
            <Sparkles size={16} />
            <span>AI-powered agricultural management</span>
          </div>

          <h1 className={`${styles.heading} ${styles.fadeIn}`} style={{ animationDelay: "200ms" }}>
            Smart Agricultural Inventory Management
          </h1>

          <p className={`${styles.description} ${styles.fadeIn}`} style={{ animationDelay: "400ms" }}>
            AI-powered inventory management, sales tracking, and farmer registration 
            for governmental and NGO organizations focused on food security.
          </p>

          <div className={`${styles.buttonContainer} ${styles.fadeIn}`} style={{ animationDelay: "600ms" }}>
            <button 
              onClick={onExplore} 
              className={styles.buttonPrimary}
            >
              Explore Features
              <ArrowDownRight size={18} />
            </button>
            <button className={styles.buttonSecondary}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className={styles.decorativeElement1} />
      <div className={styles.decorativeElement2} />
    </section>
  )
}

export default Hero
