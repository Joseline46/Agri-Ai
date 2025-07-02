"use client"

import React, { useState, useRef, useEffect } from 'react'

// Assets
import { X, Printer } from "lucide-react"
import { MdSearch } from 'react-icons/md'

// Styles
import styles from './restocksModal.module.css'
import usersTableStyles from '@/styles/userTable.module.css'

import Calendar from '@/components/calendar/calendar'
import useGetRestocksRecords from '@/hooks/useGetRestocksRecords'

const RestocksModal = (props)=> {
    const [searchValue, setSearchValue] = useState('')
    const componentRef = useRef(null)
    const contentRef = useRef(null)

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
        filteredRestocksData, 
        dateFilterValues, 
        setDateFilterValues, 
        handleChangeDateRange, 
        handleChangeDateFilterValues, 
    } = useGetRestocksRecords()

    const handlePrint = () => {
        window.print()
    }

    return (
        <section className={styles.container}>
            <section ref={componentRef} className={styles.component}>
                {/* Header */}
                <section className={styles.header}>
                    <section className={styles.location}>
                        <p className={styles.heading}>Restocks List</p>
                        <section className={styles.description}>
                            {/* <p>4 registered and tracked grains with Agri-AI</p> */}
                        </section>
                    </section>

                    <section className={styles.controls}>
                        <section className={styles.circle} onClick={handlePrint}>
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

                    <section className={usersTableStyles.printArea}>
                        <table className={usersTableStyles.table}>
                            <thead>
                                <tr className={usersTableStyles.tr}>
                                    <th className={usersTableStyles.th}>Date</th>
                                    <th className={usersTableStyles.th}>Grain</th>
                                    <th className={usersTableStyles.th}>Purchase From</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredRestocksData.map((row, index) => {
                                        return (
                                            <tr className={usersTableStyles.tr} key={index}>
                                                <td className={usersTableStyles.td}>{row.date}</td>
                                                <td className={usersTableStyles.td}>{`${row.name}, ${row.amount}Kgs`}</td>
                                                <td className={usersTableStyles.td}>{row.username}</td>
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
}

export default RestocksModal;