import React, { useState, useRef, useEffect } from 'react'
import ReactToPrint from 'react-to-print'
import { useReactToPrint } from 'react-to-print'

// Assets
import { X } from "lucide-react"
import { MdSearch } from 'react-icons/md'

// Styles
import styles from './aiinsights.module.css'
import usersTableStyles from '@/styles/userTable.module.css'

import Calendar from '@/components/calendar/calendar'

import { Skeleton } from "@/components/ui/skeleton"
import useAiinsights from '@/hooks/useAiinsights'

export const UserSkeleton = ()=> {
    return (
        <section className={usersTableStyles.tr} style={{borderRadius:"7px"}}>
            <section className={usersTableStyles.td}>
                <Skeleton className="bg-gray-200 w-[35px] h-[35px] rounded-full" />
                <section className={usersTableStyles.id}>
                    <Skeleton className="h-4 w-[80px] bg-gray-200 mb[2px]" />
                    <Skeleton className="h-4 w-[120px] bg-gray-200" />
                </section>
            </section>
            <section className={usersTableStyles.td}>
                <Skeleton className="h-4 w-[100px] bg-gray-200" />
            </section>
        </section>
    )
}

export const ComponentToPrint = React.forwardRef((props, ref)=> {
    const [searchValue, setSearchValue] = useState('')
    const componentRef = useRef(null)
    const contentRef = useRef(null)

    const printRef = useRef(null)

    useEffect(() => {
        if (ref && printRef.current) {
            if (typeof ref === 'function') {
                ref(printRef.current)
            } else {
                ref.current = printRef.current
            }
        }
    }, [ref])

    useEffect(() => {
        const MIN_MARGIN = 40
        const compWidth = props.componentWidth
        const compHeight = props.componentHeight
    
        const updatePosition = () => {
            if (window.innerWidth >= 1024) {
                let top = (window.innerHeight - compHeight) / 2
                let left = (window.innerWidth - compWidth) / 2
        
                const willOverflow = top + compHeight + MIN_MARGIN > window.innerHeight
        
                if (willOverflow) {
                // Not enough height: make it full height and flush to top
                componentRef.current.style.top = '0'
                componentRef.current.style.height = '100vh'
                } else {
                // Center it with clamped margins
                top = Math.max(MIN_MARGIN, Math.min(top, window.innerHeight - compHeight - MIN_MARGIN))
                componentRef.current.style.top = `${top}px`
                componentRef.current.style.height = `${compHeight}px !important`
                }
        
                left = Math.max(MIN_MARGIN, Math.min(left, window.innerWidth - compWidth - MIN_MARGIN))
                componentRef.current.style.left = `${left}px`
        
                // Clear mobile styles
                componentRef.current.style.right = ''
                componentRef.current.style.bottom = ''
                componentRef.current.style.width = `${compWidth}px`
            } else {
                // Mobile: full screen
                componentRef.current.style.top = '0'
                componentRef.current.style.left = '0'
                componentRef.current.style.right = '0'
                componentRef.current.style.bottom = '0'
                componentRef.current.style.width = '100vw'
                componentRef.current.style.height = '100vh'
            }
        }
    
        updatePosition() // Run on mount
        window.addEventListener('resize', updatePosition) // Update on resize
    
        return () => {
            window.removeEventListener('resize', updatePosition)
        }
    }, [])

    const { 
        dateFilterValues, 
        setDateFilterValues, 
        handleChangeDateRange, 
        handleChangeDateFilterValues, 
    } = useAiinsights()

    // [year,  month, day, previous_quantity (amount sold on that date)]

    return (
        <section className={styles.container}  ref={ref}>
            <section ref={componentRef}  className={styles.component}>
                {/* Header */}
                <section className={styles.header}>
                    <section className={styles.location}>
                        <p className={styles.heading}>AI Insight s For Crops List</p>
                        <section className={styles.description}>
                            <p>4 registered and tracked grains with Agri-AI</p>
                        </section>
                    </section>

                    <section className={styles.controls}>
                        <section style={{color:"red"}} className={styles.control} onClick={props.click}>
                            Save As Pdf/Print
                        </section>
                        {
                            props.figure && <section className={styles.figure}>
                                {props.figure}
                            </section>
                        }
                        <section className={styles.circle} onClick={()=>props.close()}>
                            <X size={17} color='#808080' />
                        </section>
                    </section>
                </section>

                <section ref={contentRef} className={styles.content}> 
                    <section className={styles.search}>
                        <MdSearch size={20} color='#808080'/> 
                        <input type='text' placeholder='Search...' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} /> 
                    </section>

                    <section className={styles.calendar}>
                        <Calendar setDateFilterValues={setDateFilterValues} handleChangeDateRange={handleChangeDateRange} dateFilterValues={dateFilterValues} handleChangeDateFilterValues={handleChangeDateFilterValues} />
                    </section>

                    <section className={usersTableStyles.container} ref={printRef}>
                        <section className={usersTableStyles.table}>
                            <section className={usersTableStyles.head} style={{padding:'0'}}>
                                <section className={usersTableStyles.tr} style={{paddingLeft:'5px', gridTemplateColumns:'24% 37% 41%'}}>
                                    <p className={usersTableStyles.text}>Name</p>
                                    <p className={usersTableStyles.addressText}>L/Year Consumption</p>
                                    <p className={usersTableStyles.addressText}>C/Year Prediction</p>
                                </section>
                            </section>
                            <section className={usersTableStyles.tbody} style={{padding:'0'}}>
                                {
                                    ['Maize', 'Beans', 'Wheat', 'Soybeans'].map((crop, index) => {
                                        return (
                                            <section className={usersTableStyles.tr} style={{paddingLeft:'5px', gridTemplateColumns:'24% 37% 41%'}} key={index}>
                                                <section className={usersTableStyles.profile}>
                                                    <section className={usersTableStyles.id}>
                                                        <p className={usersTableStyles.name}>{crop}</p>
                                                    </section>
                                                </section>
                                                <section className={usersTableStyles.address}>
                                                    <p>{props.currentYearRestocksStats[`${crop}`]} Kgs</p>
                                                </section>
                                                <section className={usersTableStyles.address}>
                                                    <p>{props.currentYearRestocksStats[`${crop}`]} Kgs</p>
                                                </section>
                                            </section>
                                        )
                                    })
                                }
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
})

ComponentToPrint.displayName = 'ComponentToPrint'

const Insights = (props)=> {
    const insightsCardRef = useRef(null)

    const handlePrint = useReactToPrint({
        content: ()=> insightsCardRef.current,
    }) 

    const click = ()=> {
        console.log('insightsCardRef.current', insightsCardRef.current)
        handlePrint() 
    }

    return ( 
        <>
            <ComponentToPrint ref={insightsCardRef} click={click} handlePrint={handlePrint} showComponent={props.showComponent} close={props.close} figure={props.figure} currentYearRestocksStats={props.currentYearRestocksStats} />
            <section className={styles.communication}>
                <section style={{color:"red"}} className={styles.control} onClick={handlePrint}>
                    Save As Pdf/Print
                </section> 
            </section>
        </>
     );
}
export default Insights;