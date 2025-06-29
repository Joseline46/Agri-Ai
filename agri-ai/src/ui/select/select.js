import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

// Styles
import styles from './select.module.css'

// Components
import Option from './options/options'

// Assets
import { MdSearch } from 'react-icons/md'
import { AlertCircle, ChevronDown } from 'lucide-react'

const StandardSelect = (props) => {
    const [showOptionsList, setShowOptionsList] = useState(false)
    // Options container styling
    const [containerStyles, setcontainerStyles] = useState({
        top: '40px',
        left: 0,
        display: showOptionsList?'flex':'none', 
        zIndex: '1000'
    })
    const optionsRef = useRef(null)

    // Toggle options view
    const toggleShowOptions = ()=> {
        setShowOptionsList((prevState)=>!prevState)
    }

    // Toggle options view
    const closeShowOptions = ()=> {
        setShowOptionsList(false)
    }

    useEffect(() => {
        const updatePosition = () => {
            if(showOptionsList){
                const rect = optionsRef.current.getBoundingClientRect()
                const windowWidth = window.innerWidth
                const right = rect.right

                let spaceToRight = windowWidth - right

                setcontainerStyles((prevState)=> {
                    return {
                        ...prevState,
                        left: spaceToRight <= 0?`${spaceToRight}px`:0,
                        display: showOptionsList?'flex':'none', 
                    }
                })
            }else {
                setcontainerStyles((prevState)=> {
                    return {
                        ...prevState,
                        display: 'none', 
                    }
                })
            }
        }

        updatePosition() // Run on mount
        window.addEventListener('resize', updatePosition) // Update on resize
    
        return () => {
            window.removeEventListener('resize', updatePosition)
        }
    }, [showOptionsList])

    return ( 
        <section className={styles.attribute}>
            <section className={styles.labels}>
                <p className={styles.label} style={{color:props.error?"#EF4444":"#020817"}}>{props.label}</p> 
                { props.error && <p className={styles.label} style={{color:"#EF4444"}}>{`(${props.errorMessage})`}</p> }
            </section>
            <section className={styles.component}>
                <section className={styles.wrapper}>
                    {
                        props.children && <section className={styles.icon}> { props.children } </section>
                    }
                    <section tabIndex="0" className={styles.textbox} onClick={()=>toggleShowOptions()} disabled={props.disabled?true:false}>
                        <p className={clsx({[styles.placeholder]:props.values[props.id]==='', [styles.valid]:props.values[props.id]!==''})}>
                            { props.values[props.id]===''?props.placeholder:props.values[props.id] }
                        </p>
                        <section className={styles.searchIcon}>
                            <ChevronDown color='#808080' size={17} />
                        </section>
                    </section>

                    {/* Options */}
                    <section ref={optionsRef} className={styles.options} style={containerStyles} onMouseLeave={()=>setShowOptionsList(false)}>
                        <section className={styles.search}>
                            <section className={styles.searchIcon}>
                                <MdSearch color='#808080' size={20} />
                            </section>
                            <input 
                                className={styles.input}
                                placeholder='Search . . .'
                                value={props.optionsValues[props.id]}
                                onChange={(event)=>props.setOptionsValues({...props.optionsValues, [props.id]: event.target.value})}/>
                        </section>
                        <section className={styles.list}>
                            {
                                props.list.length && props.list.filter((option)=> {
                                    return props.optionsValues[props.id]!==''?option.name.toLowerCase().includes(props.optionsValues[props.id].toLowerCase()):option
                                }).map((option, index) => (
                                        <Option 
                                            closeShowOptions={closeShowOptions}
                                            toggleShowOptions={toggleShowOptions}
                                            option={option} 
                                            key={index} 
                                            values={props.values}
                                            setValue={props.setValue} 
                                            value={props.values[props.id]} 
                                            name={props.id}
                                            regExId={props.regExId}
                                            errors={props.errors}
                                            setError={props.setError} />
                                    )
                                )
                            }
                        </section>
                    </section>
                </section>
            </section>

            { 
                props.notification  &&   <section className={styles.alert}>
                                            <AlertCircle color='#020817' size={17}/>
                                            <span>{props.notification}</span>
                                        </section> 
            }
        </section>
    )
}
 
export default StandardSelect


