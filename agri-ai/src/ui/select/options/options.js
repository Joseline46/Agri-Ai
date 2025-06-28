import styles from './options.module.css'

const Option = (props) => {
    const listItemStyles = { backgroundColor: props.value===props.option.code?'#f9f7f7':'transparent' }
    const click = () => {
        props.closeShowOptions()
        props.setValue({
            ...props.values,
            [props.name] : props.option.code
        })
        props.setError({
            ...props.errors,
             [props.regExId?props.regExId:props.name]:false
        })
    }

    return ( 
        <section className={styles.component} style={listItemStyles} onClick={()=> click()}>
            {
                props.option.name.trim().toLowerCase() === props.option.code.trim().toLowerCase()?`${props.option.name}`:`${props.option.name} - (${props.option.code})`
            }
        </section>
    )
}
 
export default Option