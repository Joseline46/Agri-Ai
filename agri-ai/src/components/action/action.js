"use client"
import { ArrowRight } from "lucide-react";
import styles from "./action.module.css";

const CallToActionSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Background elements */}
          <div className={styles.bgCircleOne} />
          <div className={styles.bgCircleTwo} />

          <div className={styles.content}>
            <h2 className={styles.heading}>Ready to Optimize Your Agricultural Operations?</h2>

            <p className={styles.text}>
              Join organizations around the world who are leveraging our AI-powered platform
              to enhance their agricultural inventory and sales management.
            </p>

            <button className={styles.button}>
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
