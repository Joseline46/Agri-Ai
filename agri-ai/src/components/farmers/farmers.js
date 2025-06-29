import { useEffect, useRef, useState } from 'react'
import Link  from 'next/link'

// Assets
import { X } from "lucide-react"
import { MdSearch } from 'react-icons/md'

// Styles
import styles from './farmers.module.css'
import usersTableStyles from '@/styles/userTable.module.css'

import { Skeleton } from "@/components/ui/skeleton"

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

const Farmers = (props)=> {
    const [searchValue, setSearchValue] = useState('')
    const componentRef = useRef(null)
    const contentRef = useRef(null)
    const [filteredFarmers, setFilteredFarmers] = useState([])

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

    useEffect(()=> {
        let filtered = []
        if(props.farmers){
            if(props.farmers.length){
                filtered = props.farmers.filter((customer)=> {
                    let addressMatch = customer.address.trim().toLowerCase().includes(searchValue.trim().toLocaleLowerCase())
                    let firstnameMatch = customer.firstname.trim().toLowerCase().includes(searchValue.trim().toLocaleLowerCase())
                    let lastnameMatch = customer.lastname.trim().toLowerCase().includes(searchValue.trim().toLocaleLowerCase())

                    return addressMatch ||  firstnameMatch || lastnameMatch
                })
            }
        }
        setFilteredFarmers(filtered)
    }, [props.farmers, searchValue])

    return (
        <section className={styles.container} style={{display: props.showComponent?'flex':'none'}}>
            <section ref={componentRef}  className={styles.component}>
                {/* Header */}
                <section className={styles.header}>
                    <section className={styles.location}>
                        <p className={styles.heading}>Farmers List</p>
                        <section className={styles.description}>
                            <p>{`${props.farmers ? props.farmers.length : 'No'} registered farmers with Agri-AI`}</p>
                        </section>
                    </section>

                    <section className={styles.controls}>
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

                    { 
                        filteredFarmers?(
                            filteredFarmers.length > 0?(
                                <section className={usersTableStyles.container}>
                                    <section className={usersTableStyles.table}>
                                        <section className={usersTableStyles.head}>
                                            <section className={usersTableStyles.tr}>
                                                <p className={usersTableStyles.text}>Name</p>
                                                <p className={usersTableStyles.addressText}>Address</p>
                                            </section>
                                        </section>
                                        <section className={usersTableStyles.tbody}>
                                            {
                                                filteredFarmers.map((user, index) => {
                                                    const initials = `${user.firstname[0]}`
                                                    return (
                                                        <Link key={index} href={`/dashboard/customer/?id=${user.firstname}`}>
                                                            <section className={usersTableStyles.tr}>
                                                                <section className={usersTableStyles.profile}>
                                                                    <section className={usersTableStyles.avatar}>
                                                                        <p className={usersTableStyles.initials} style={{color:"#000000"}}>{initials}</p>
                                                                    </section>
                                                                    <section className={usersTableStyles.id}>
                                                                        <p className={usersTableStyles.name}>{user.firstname} {user.lastname}</p>
                                                                    </section>
                                                                </section>
                                                                <section className={usersTableStyles.address}>
                                                                    <p>{`${user.address}`}</p>
                                                                </section>
                                                            </section>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </section>
                                    </section>
                                </section>
                            ):<UserSkeleton />
                        ):<UserSkeleton />
                    }
                </section>
            </section>
        </section>
    )
}

export default Farmers