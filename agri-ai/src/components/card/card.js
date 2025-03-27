"use client"

import styles from "./card.module.css";

const Card = ({ title, description, icon, delay = 0, onClick }) => {
  return (
    <div
      className={styles.navCard}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.heading}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Card;
