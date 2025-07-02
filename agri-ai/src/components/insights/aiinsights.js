"use client"

import React, { useState, useRef, useEffect } from 'react'

// Assets
import { X, Printer } from "lucide-react"
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
        <section ref={ref}>
            <section ref={componentRef} className={styles.component}>
                {/* Header */}
                <section className={styles.header}>
                    <section className={styles.location}>
                        <p className={styles.heading}>AI Insights For Crops List</p>
                        <section className={styles.description}>
                            <p>4 registered and tracked grains with Agri-AI</p>
                        </section>
                    </section>

                    <section className={styles.controls}>
                        {
                            props.figure && <section className={styles.figure}>
                                {props.figure}
                            </section>
                        }
                        <section className={styles.circle} onClick={props.handlePrint}>
                            <Printer size={17} color='#808080' />
                        </section>
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

                    <section className={usersTableStyles.printArea} ref={printRef}>
                        <table className={usersTableStyles.table}>
                            <thead>
                                <tr className={usersTableStyles.tr}>
                                    <th className={usersTableStyles.th}>Name</th>
                                    <th className={usersTableStyles.th}>L/Year Consumption</th>
                                    <th className={usersTableStyles.th}>C/Year Prediction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ['Maize', 'Beans', 'Wheat', 'Soybeans'].map((crop, index) => {
                                        return (
                                            <tr className={usersTableStyles.tr} key={index}>
                                                <td className={usersTableStyles.td}>{crop}</td>
                                                <td className={usersTableStyles.td}>{props.currentYearRestocksStats[`${crop}`]} Kgs</td>
                                                <td className={usersTableStyles.td}>{props.predicts[`${crop}`]} Kgs</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </section>
                </section>
            </section>
        </section>
    )
})

ComponentToPrint.displayName = 'ComponentToprint'

const Insights = (props)=> {
    const insightsCardRef = useRef(null)
    
    const handlePrint = () => {
        window.print()
    }

    return ( 
        <section className={styles.container}>
            <ComponentToPrint predicts={props.predicts} ref={insightsCardRef} click={handlePrint} handlePrint={handlePrint}  close={props.close} figure={props.figure} currentYearRestocksStats={props.currentYearRestocksStats} />
        </section>
    )
}

export default Insights;