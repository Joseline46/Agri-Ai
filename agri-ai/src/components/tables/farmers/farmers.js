import { useRef, useEffect, useState } from "react";
import styles from "./farmers.module.css";

// Assets
import { MdSearch } from 'react-icons/md'
 
export default function ScrollableTable(props) {
  const tableRef = useRef(null);
  const fixedColumnRef = useRef(null);
  const [searchValue, setSearchValue] = useState('')
  const [recordsToUse, setRecordsToUse] = useState([])

  useEffect(() => {
    let records = props.farmersData.filter((grain) => {
        const region = grain.region.trim().toLowerCase().includes(searchValue.trim().toLowerCase());
        const plants = grain.plants.trim().toLowerCase().includes(searchValue.trim().toLowerCase());
        return region || plants;
    });

    setRecordsToUse(records);
}, [searchValue, props.farmersData]);

  const handleScroll = () => {
    if (tableRef.current && fixedColumnRef.current) {
      fixedColumnRef.current.scrollTop = tableRef.current.scrollTop;
    }
  };

  return (
    <section className={styles.component}>
        <section className={styles.search}>
            <MdSearch color='#808080'/> 
            <input type='text' placeholder='Filter Farmers...' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} /> 
        </section>
        <div className={styles.tableContainer}>
        <div ref={fixedColumnRef} className={styles.fixedColumnContainer} style={{height:"100%"}}>
            <table className={styles.fixedColumnTable}>
            <thead>
                <tr><th className={styles.fixedColumn}>Username</th></tr>
            </thead>
            <tbody>
                {
                    recordsToUse.length > 0 && recordsToUse.map(farmer => (
                    <tr key={farmer.id}>
                        <td className={styles.fixedColumn}>{farmer.username}</td>
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
                    <th>Region</th>
                    <th>Plants</th>
                    <th>Land Size</th>
                    <th>Arable Land Size</th>
                </tr>
            </thead>
            <tbody>
                {
                    recordsToUse.length > 0 && recordsToUse.map((farmer, index) => (
                        <tr key={farmer.region}>
                            <td>{farmer.region}</td>
                            <td>{farmer.plants}</td>
                            <td>{farmer.landsize}</td>
                            <td>{farmer.arable}</td>
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