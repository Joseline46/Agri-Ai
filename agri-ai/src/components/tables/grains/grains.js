import { useRef, useEffect, useState } from "react"
import styles from "./grains.module.css"

// Assets
import { MdSearch } from 'react-icons/md'
 
export default function ScrollableTable(props) {
    const tableRef = useRef(null)
    const fixedColumnRef = useRef(null)
    const [searchValue, setSearchValue] = useState('')
    const [recordsToUse, setRecordsToUse] = useState([])

    useEffect(() => {
        let records = props.grains.filter((grain) => {
            const consumerType = grain.consumerType.trim().toLowerCase().includes(searchValue.trim().toLowerCase())
            const grainType = grain.grainType.trim().toLowerCase().includes(searchValue.trim().toLowerCase())
            
            return consumerType || grainType
        })

        setRecordsToUse(records)
    }, [searchValue, props.grains, props.grainCategoryFilter])

    const handleScroll = () => {
        if (tableRef.current && fixedColumnRef.current) {
        fixedColumnRef.current.scrollTop = tableRef.current.scrollTop
        }
    }

    return (
        <section className={styles.component}>
            <section className={styles.search}>
                <MdSearch color='#808080'/> 
                <input type='text' placeholder='Filter Grains...' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} /> 
            </section>
            <div className={styles.tableContainer}>
            <div ref={fixedColumnRef} className={styles.fixedColumnContainer} style={{height:"100%"}}>
                <table className={styles.fixedColumnTable}>
                <thead>
                    <tr className={styles.tr}><th className={styles.fixedColumn}>Grain Type</th></tr>
                </thead>
                <tbody>
                    {
                        recordsToUse.length > 0 && recordsToUse.map((grain, index) => (
                            <tr  className={styles.tr} key={index}>
                                <td className={styles.fixedColumn}>{grain.grainType}</td>
                            </tr>
                        ))
                    }
                </tbody>
                </table>
            </div>
            <div ref={tableRef} className={styles.scrollableWrapper} onScroll={handleScroll}>
                <table className={styles.scrollableTable}>
                    <thead>
                        <tr className={styles.tr}>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Consumer Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            recordsToUse.length > 0 && recordsToUse.map((grain, index) => (
                                <tr className={styles.tr} key={index}>
                                    <td>{grain.date}</td>
                                    <td>{grain.quantity}Kg</td>
                                    <td>{grain.consumerType}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            </div>
        </section>
    )
}