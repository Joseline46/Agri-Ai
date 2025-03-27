import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import MainLayout from "@/layouts/main/main"
import { ArrowLeft } from "lucide-react"
import styles from "@/styles/notFound.module.css"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    )
  }, [location.pathname])

  return (
    <MainLayout>
      <div className={styles.notFoundContainer}>
        <div className={styles.glassCard}>
          <h1 className={styles.heading}>404</h1>
          <p className={styles.textMuted}>Oops! We couldn't find the page you're looking for.</p>
          <a href="/" className={styles.buttonPrimary}>
            <ArrowLeft size={18} />
            Return to Home
          </a>
        </div>
      </div>
    </MainLayout>
  )
}

export default NotFound
