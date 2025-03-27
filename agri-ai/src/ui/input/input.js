// Styles
import styles from "./input.module.css";

import { AlertCircle } from 'lucide-react';

const Input = (props) => {
    return (
        <section className={styles.attribute}>
            <p className={styles.label} style={{color:props.error?"#EF4444":"#020817"}}>{props.label}</p>
            <section className={styles.container}>
                <section className={styles.wrapper}>
                    {
                        props.children && <section className={styles.icon}> { props.children } </section>
                    }
                    <input 
                        className={styles.input} 
                        type={props.type} 
                        name={props.name }
                        value={props.value} 
                        onChange={(e)=> props.change && props.change(e)}
                        placeholder={props.placeholder}
                        disabled={props.disabled?props.disabled:false}
                        required />
                </section>
            </section>
            { 
                props.notification  &&   <section className={styles.alert}>
                                            <AlertCircle color='#EF4444' size={15}/>
                                            <span>{props.notification}</span>
                                        </section> 
            }
            { props.error && <p className={styles.errorMessage}>{props.errorMessage}</p> }
        </section>
    )
}
 
export default Input;