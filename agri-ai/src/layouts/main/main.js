import Header from "@/components/header/header"
import { AuthContextProvider } from '@/contexts/auth'

// Styles
import styles from "./main.module.css"
import "../../app/globals.css"

const Main= ({ children, hideHeader = false }) => {
  return (
    <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"  crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" /> 
        </head>
        <AuthContextProvider>
          <body className={styles.main}>
            {!hideHeader && <Header />}
            <section className={styles.mainContent}>{children}</section>
          </body>
        </AuthContextProvider>
    </html>
  )
}

export default Main
