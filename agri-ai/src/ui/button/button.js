import styles from './button.module.css'

const Button =((props)=> {
    return (
        <button className={styles.btn} onClick={()=>props.click()} disabled={props.disabled}>
            {props.children}
        </button>
    )
})

export default Button