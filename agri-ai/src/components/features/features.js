"use client"

import React, { forwardRef } from "react"
import Card from "@/components/card/card"
import { BarChart3, ClipboardList, Database, Users } from "lucide-react"
import styles from "./features.module.css"

const FeaturesSection = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="features" className={styles.featuresSection}>
      <div className={styles.containerMain}>
        <div className={styles.textCenter}>
          <h2 className={`${styles.heading} ${styles.fadeIn}`}>Core Features</h2>
          <p
            className={`${styles.description} ${styles.fadeIn}`}
            style={{ animationDelay: "200ms" }}
          >
            Our platform provides comprehensive tools for agricultural inventory
            and sales management, with AI-powered insights to optimize your
            operations.
          </p>
        </div>

        <div className={styles.gridContainer}>
          <Card
            title="Inventory Management"
            description="Track agricultural stocks in real-time with AI-based demand prediction."
            icon={<Database size={24} />}
            delay={100}
          />
          <Card
            title="Sales Management"
            description="Record transactions with trend analysis and secure PDF invoicing."
            icon={<BarChart3 size={24} />}
            delay={200}
          />
          <Card
            title="Farmer Registration"
            description="Manage farmer profiles with AI crop planning recommendations."
            icon={<ClipboardList size={24} />}
            delay={300}
          />
          <Card
            title="Employee Management"
            description="Role-based access control with secure authentication."
            icon={<Users size={24} />}
            delay={400}
          />
        </div>
      </div>
    </section>
  )
})

FeaturesSection.displayName = "FeaturesSection"

export default FeaturesSection
