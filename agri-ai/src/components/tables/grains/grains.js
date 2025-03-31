import { useRef, useEffect, useState } from "react";
import styles from "./grains.module.css";

// Assets
import { MdSearch } from 'react-icons/md'
import { TbChecklist } from "react-icons/tb"
 
export default function ScrollableTable(props) {
  const tableRef = useRef(null);
  const fixedColumnRef = useRef(null);
  const [searchValue, setSearchValue] = useState('')
  const [recordsToUse, setRecordsToUse] = useState([])

  useEffect(() => {
    let records = props.grains.filter((grain) => {
        const consumerType = grain.consumerType.trim().toLowerCase().includes(searchValue.trim().toLowerCase());
        const grainType = grain.grainType.trim().toLowerCase().includes(searchValue.trim().toLowerCase());

        
        if (props.grainCategoryFilter === 'all') {
            return consumerType || grainType;
        } else {
            return grain.grainType.trim().toLowerCase() === props.grainCategoryFilter.trim().toLowerCase() && (consumerType) // Apply search only to name or supplier after category is matched
        }
    });

    setRecordsToUse(records);
}, [searchValue, props.grains, props.grainCategoryFilter]);


  const handleScroll = () => {
    if (tableRef.current && fixedColumnRef.current) {
      fixedColumnRef.current.scrollTop = tableRef.current.scrollTop;
    }
  };

  return (
    <section className={styles.component}>
        <section className={styles.search}>
            <MdSearch color='#808080'/> 
            <input type='text' placeholder='Filter Grains...' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} /> 
            {/* <section className={styles.controls}>
                <section className={styles.circle} onClick={()=>props.setgrainCategoryFilter('all')}>
                    <TbChecklist size={17} color='#5E17EB' />
                </section>
            </section> */}
        </section>
        <div className={styles.tableContainer}>
        <div ref={fixedColumnRef} className={styles.fixedColumnContainer} style={{height:"100%"}}>
            <table className={styles.fixedColumnTable}>
            <thead>
                <tr><th className={styles.fixedColumn}>Grain Type</th></tr>
            </thead>
            <tbody>
                {
                    recordsToUse.length > 0 && recordsToUse.map(grain => (
                    <tr key={grain.id}>
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
                <tr>
                <th>Date</th>
                <th>Quantity</th>
                <th>Consumer Type</th>
                </tr>
            </thead>
            <tbody>
                {
                    recordsToUse.length > 0 && recordsToUse.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.date}</td>
                            <td>{expense.quantity}Kg</td>
                            <td>{expense.consumerType}</td>
                        </tr>
                    ))
                }
            </tbody>
            </table>
        </div>
        </div>
    </section>
  );
}