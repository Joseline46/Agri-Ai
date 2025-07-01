import { useState, useEffect } from "react"

import { toast } from "sonner"

import { doc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { db } from '@/firebase'

const filterByDate = (from, to, DATA)=> {
  // Get from milliseconds
  const fromMs = new Date(from).getTime()
  // Get to milliseconds
  const toMs = new Date(to).getTime()

  const filteredByDate = DATA.filter((row, index)=> {
      // Get current date milliseconds
      const ms = new Date(row.date).getTime()
      // return value
      return ((ms >= fromMs) && (ms <= toMs))
  })

  return filteredByDate
}

const getFirstAndLastDateStringOfCurrentMonth = ()=> {
    // Get the current year : "2024"
    let currentYear = new Date().getFullYear()
    // Get current month : "2" add +1. 0 based index
    let currentMonth = new Date().getMonth()

    // Get first day of the current month : "1"
    let firstDayOfCurrentMonth = new Date(`${currentYear}`, `${currentMonth}`, 1).getDate()
    // Get last day of the current month : "31"
    let lastDayOfCurrentMonth = new Date(`${currentYear}`, `${parseInt(currentMonth) + 1}`, 0).getDate()
    // Set full date of first day of the current month : "1/1/2024" mm/dd/yyyy
    let firstDayString = `${currentMonth+1}/${firstDayOfCurrentMonth}/${currentYear}`
    // Set full date of last day of the current month : "1/31/2024" mm/dd/yyyy
    let lastDayString = `${currentMonth+1}/${lastDayOfCurrentMonth}/${currentYear}`
    

    // e.g if month is january and year is 2024 
    // ['1/1/2024', '1/31/2024']
    return [firstDayString, lastDayString]
}

function getYearStartAndEnd(year) {
  // Create date objects for Jan 1 and Dec 31
  const startDate = new Date(year, 0, 1) // Month is 0-based (0 = January)
  const endDate = new Date(year, 11, 31) // 11 = December

  // Helper to format date as mm/dd/yyyy
  function formatDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${mm}/${dd}/${yyyy}`
  }

  return [
    formatDate(startDate),
    formatDate(endDate)
  ]
}

function getCumulativeQuantities(salesData) {
  // Initialize with all known grain types
  const grainTypes = ['Maize', 'Wheat', 'Soybeans', 'Beans']
  const cumulativeTotals = {
    Maize: 0,
    Wheat: 0,
    Soybeans: 0,
    Beans: 0
  }

  salesData.forEach(sale => {
    const grain = sale.name
    const amount = parseFloat(sale.amount)

    if (grainTypes.includes(grain)) {
      cumulativeTotals[grain] += amount
    }
  })

  return cumulativeTotals
}

function getCumulativeQuantitiesForRestocks(restocksData) {
  // Initialize with all known grain types
  const grainTypes = ['Maize', 'Wheat', 'Soybeans', 'Beans']
  const cumulativeTotals = {
    Maize: 0,
    Wheat: 0,
    Soybeans: 0,
    Beans: 0
  }

  restocksData.forEach(record => {
    const grain = record.name
    const amount = parseFloat(record.amount)

    if (grainTypes.includes(grain)) {
      cumulativeTotals[grain] += amount
    }
  })

  return cumulativeTotals
}

const useFarmer = (farmerId) => {
    const [farmersDeliveries, setFarmersDeliveries] = useState([])
    const [farmerCredentials, setFarmerCredentials] = useState(null)
    const [dateFilterValues, setDateFilterValues] = useState({ 
      from: '',
      to: ''
    })
    const [currentYearSalesStats, setCurrentYearSalesStats] = useState({Maize: 0, Wheat: 0, Soybeans: 0, Beans: 0})
    const [previousYearSalesStats, setPreviousYearSalesStats] = useState({Maize: 0, Wheat: 0, Soybeans: 0, Beans: 0})

    // Fetch Tank-Swaps Orders
    useEffect(() => {
        if(farmerCredentials){
            const q = query(collection(db, "restocks"), where("username", "==", farmerCredentials.username))
            let records = []
            getDocs(q).then((querySnapshot)=> {
                querySnapshot.forEach((doc) => {
                  records.push(doc.data())
                })
                console.log('records', records)
                setFarmersDeliveries(records)
            }).catch((error)=> {
                toast.error(error.message)
            })
        }
    }, [farmerCredentials])

    
    const handleChangeDateRange = (range)=> {
        let year = new Date().getFullYear()
        let month = new Date().getMonth()
    
        let fromDate = ``
        let toDate = ``
    
        if(range === 'month'){
          let firstDateOfMonth = 1
          let lastDateOfMonth = new Date(year, month + 1, 0).getDate() 
    
          fromDate = `${month+1}/${firstDateOfMonth}/${year}`
          toDate = `${month+1}/${lastDateOfMonth}/${year}`
        }
        
        if(range === 'year'){
          let firstMonth = 0
          let lastMonth = 11
          let firstDateOfFirstMonth = 1
          let lastDateOfLastMonth = new Date(year, lastMonth + 1, 0).getDate() 
    
          fromDate = `${firstMonth+1}/${firstDateOfFirstMonth}/${year}`
          toDate = `${lastMonth+1}/${lastDateOfLastMonth}/${year}`
        }
    
        if(range === 'clear'){
          let [firstDayString, lastDayString] = getFirstAndLastDateStringOfCurrentMonth()
    
          fromDate = firstDayString
          toDate = lastDayString
        }
    
        setDateFilterValues({
          'from': fromDate,
          'to':toDate
        })
    }

    // Change the "from" and "to" values of the date input
    const handleChangeDateFilterValues = (inputValue)=> {
        let { from, to } = dateFilterValues
        let fromValue = ''
        let toValue = ''

        if(from===''){
            fromValue = inputValue
        }else if(from!=='' && to===''){
            toValue = inputValue
            fromValue = dateFilterValues.from
        }else {
            // Input Value
            let [inputMonth, inputDay, inputYear] = inputValue.split('/')
            let inputDateString = `${inputMonth}/${inputDay}/${inputYear}`
            let inputTimestamp = new Date(inputValue).getTime()

            // From Date
            let [fromMonth, fromDay, fromYear] = from.split('/')
            let fromTimestamp = new Date(from).getTime()

            // To Date
            let [toMonth, toDay, toYear] = to.split('/')

            if(inputTimestamp > fromTimestamp){
                toValue = inputDateString
                fromValue = dateFilterValues.from
            }else if(inputTimestamp < fromTimestamp){
                fromValue = inputDateString
                toValue = dateFilterValues.to
            }
        }


        setDateFilterValues({
            from: fromValue,
            to: toValue
        })
    }

    // Set date filter values
    useEffect(() => {
        let [firstDayString, lastDayString] = getFirstAndLastDateStringOfCurrentMonth()
        setDateFilterValues((prevState) => {
          return {
            from: firstDayString,
            to: lastDayString,
          }
        })
    }, [])


      // Fetch Tank-Swaps Orders
    // useEffect(() => {
    //     if(farmerCredentials){
    //         const q = collection(db, "restocks")
    //         let records = []
    //         getDocs(q).then((querySnapshot)=> {
    //             querySnapshot.forEach((doc) => {
    //               records.push(doc.data())
    //             })
    //             let filtered = records.filter(r => r.username === farmerCredentials.username)
    //             console.log('records', filtered)
    //             setFarmersDeliveries(filtered)
    //         }).catch((error)=> {
    //             toast.error(error.message)
    //         })
    //     }
    // }, [farmerCredentials])

    useEffect(() => {
      let [__, _, currentYear] = dateFilterValues.from.split('/')
      let previousYear = currentYear - 1

      let [firstDatePreviousYear, lastDatePreviousYear] = getYearStartAndEnd(previousYear)
      let [firstDateCurrentYear, lastDateCurrentYear] = getYearStartAndEnd(currentYear)

      let prevYearGrainsData = filterByDate(firstDatePreviousYear, lastDatePreviousYear, farmersDeliveries)
      let currentYearGrainsData = filterByDate(firstDateCurrentYear, lastDateCurrentYear, farmersDeliveries)

      let currentYearTotals = getCumulativeQuantities(currentYearGrainsData)
      let previousYearTotals = getCumulativeQuantities(prevYearGrainsData)

      console.log('currentYearTotals', currentYearTotals)
      console.log('previousYearTotals', previousYearTotals)

      setCurrentYearSalesStats(currentYearTotals)
      setPreviousYearSalesStats(previousYearTotals)
  }, [farmersDeliveries, dateFilterValues.from])

    useEffect(()=> {
      if(farmerId){
        const docRef = doc(db, "farmers", `${farmerId}`);
        getDoc(docRef).then((docSnap)=> {
            let customerData = docSnap.data()
            setFarmerCredentials(customerData)
        }).catch((error)=> {
          toast.error(error.message)
        })
      }
    }, [farmerId])

    return { 
      currentYearSalesStats,
      previousYearSalesStats, 
      farmerCredentials, 
      farmersDeliveries 
    }
}

export default useFarmer