"use client"

// Styles
import styles from "./metric.module.css";

const Metric = ({ title, value, trend, icon, className, delay = 0 }) => {
  return (
    <div
      className={`${styles.metricCard} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.content}>
        <p className={styles.value}>{value}</p>
        {trend && (
          <span className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default Metric;
