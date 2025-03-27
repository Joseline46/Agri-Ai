"use client"
import Metric from "@/components/metric/metric"
import { BarChart3, Brain, Leaf, TrendingUp } from "lucide-react"
import styles from "./aiinsights.module.css"

const AIInsights = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textCenter}>
          <div className={styles.tag}>
            <Brain size={16} />
            <span>AI-Powered Insights</span>
          </div>

          <h2 className={styles.heading} style={{ animationDelay: "200ms" }}>
            Advanced Analytics & Predictions
          </h2>
          <p className={styles.description} style={{ animationDelay: "300ms" }}>
            Our AI analyzes your data to provide actionable insights, helping
            you make data-driven decisions for optimal inventory management and
            sales forecasting.
          </p>
        </div>

        <div className={styles.grid}>
          <Metric
            title="Predicted Demand (Monthly)"
            value="+12.5%"
            trend={{ value: 12.5, isPositive: true }}
            icon={<TrendingUp size={20} />}
            delay={100}
          />
          <Metric
            title="Optimal Stock Levels"
            value="2,450 tons"
            icon={<Leaf size={20} />}
            delay={200}
          />
          <Metric
            title="Sales Forecast"
            value="$45,230"
            trend={{ value: 5.2, isPositive: true }}
            icon={<BarChart3 size={20} />}
            delay={300}
          />
          <Metric
            title="Supply Chain Efficiency"
            value="94.2%"
            trend={{ value: 3.1, isPositive: true }}
            icon={<Brain size={20} />}
            delay={400}
          />
        </div>
      </div>
    </section>
  )
}

export default AIInsights
