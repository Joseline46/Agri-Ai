import styles from "./header.module.css"

const Header = ({ className }) => {
  return (
    <header className={`${styles.header} ${className || ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Agri-AI</span>
        </div>
        <nav className={styles.nav}>
          <a href='/sign-in/'>
            <button className={styles.signInButton}>Sign In</button>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
