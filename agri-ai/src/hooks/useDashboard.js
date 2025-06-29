import { useState, useEffect } from 'react'
import { collection, setDoc, onSnapshot, doc } from "firebase/firestore"
import { db } from '@/firebase'

import { Bean, Wheat, Nut } from 'lucide-react' 
import { PiGrainsBold } from "react-icons/pi"
import { GiPeas  } from "react-icons/gi"

// Hoc
import { toast } from "sonner"

const mapIcons = (description)=> {
    let ICON = null
    let transformedDescription = description.trim().toLowerCase()
    switch (transformedDescription) {
        case 'maize':
            ICON = <PiGrainsBold color='#0058FF' size={20} />
            break
        case 'beans':
            ICON = <Bean color='#4B10BF' size={20} />
            break
        case 'wheat':
            ICON = <Wheat color='#FFC700' size={20} />
            break
        case 'soybeans':
            ICON = <GiPeas color='#EB17A4' size={20} />
            break
        default:
            ICON = <Nut color='#4B10BF' size={20} />
            break
    }
    
    return ICON
}

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

export const createRandomString = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
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
    const grain = sale.grainType
    const quantity = parseFloat(sale.quantity)

    if (grainTypes.includes(grain)) {
      cumulativeTotals[grain] += quantity
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
  
const useDashboard = ()=> {
    const [stocks, setStocks] = useState(null)
    const [filteredGrainsData, setFilteredGrainsData] = useState([])
    const [grainsSalesData, setGrainsSalesData] = useState([])
    const [restocksData, setRestocksData] = useState([])
    const [farmersData, setFarmersData] = useState([])

    const [doughnutValues, setDoughnutValues] = useState([])

    const [dateFilterValues, setDateFilterValues] = useState({ 
        from: '',
        to: ''
    })

    const [currentYearSalesStats, setCurrentYearSalesStats] = useState({Maize: 0, Wheat: 0, Soybeans: 0, Beans: 0})
    const [previousYearSalesStats, setPreviousYearSalesStats] = useState({Maize: 0, Wheat: 0, Soybeans: 0, Beans: 0})

    const [currentYearRestocksStats, setCurrentYearRestocksStats] = useState({Maize: 0, Wheat: 0, Soybeans: 0, Beans: 0})
    const [previousYearRestocksStats, setPreviousYearRestocksStats] = useState({Maize: 0, Wheat: 0, Soybeans: 0, Beans: 0})

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

    const [usernames, setUsernames] = useState([])

    useEffect(()=> {
        let names = []
        if(farmersData.length){
            farmersData.map((farmer)=> {
                names.push({"name": farmer.username, "code": farmer.username})
            })
        }
        setUsernames(names)
    }, [farmersData])

    useEffect(() => {
        function extractOrderedValues(dataObj) {
            const order = ['Maize', 'Beans', 'Wheat', 'Soybeans']
            return order.map(grain => dataObj[grain] || 0)
        }
        let orderedValues = extractOrderedValues(currentYearSalesStats)
        setDoughnutValues(orderedValues)
    }, [currentYearSalesStats])

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

    // Fetch sales data in real time
    useEffect(() => {
        const salesDocsRef = collection(db, "sales")
    
        const unsubscribeProperty = onSnapshot(salesDocsRef, (querySnapshot) => {
            let records = []
            querySnapshot.forEach((doc) => {
                records.push(doc.data())
            })
            setGrainsSalesData(records)
        })
    }, [])

    // Fetch restocks data in real time
    useEffect(() => {
        const restocksDocsRef = collection(db, "restocks")
    
        const unsubscribeProperty = onSnapshot(restocksDocsRef, (querySnapshot) => {
            let records = []
            querySnapshot.forEach((doc) => {
                records.push(doc.data())
            })
            setRestocksData(records)
        })
    }, [])

    useEffect(() => {
        let [__, _, currentYear] = dateFilterValues.from.split('/')
        let previousYear = currentYear - 1

        let [firstDatePreviousYear, lastDatePreviousYear] = getYearStartAndEnd(previousYear)
        let [firstDateCurrentYear, lastDateCurrentYear] = getYearStartAndEnd(currentYear)

        let prevYearGrainsData = filterByDate(firstDatePreviousYear, lastDatePreviousYear, grainsSalesData)
        let currentYearGrainsData = filterByDate(firstDateCurrentYear, lastDateCurrentYear, grainsSalesData)

        let currentYearTotals = getCumulativeQuantities(currentYearGrainsData)
        let previousYearTotals = getCumulativeQuantities(prevYearGrainsData)

        setCurrentYearSalesStats(currentYearTotals)
        setPreviousYearSalesStats(previousYearTotals)
    }, [grainsSalesData, dateFilterValues.from])

    useEffect(() => {
        let [__, _, currentYear] = dateFilterValues.from.split('/')
        let previousYear = currentYear - 1

        let [firstDatePreviousYear, lastDatePreviousYear] = getYearStartAndEnd(previousYear)
        let [firstDateCurrentYear, lastDateCurrentYear] = getYearStartAndEnd(currentYear)

        let prevYearRestocksData = filterByDate(firstDatePreviousYear, lastDatePreviousYear, restocksData)
        let currentYearRestocksData = filterByDate(firstDateCurrentYear, lastDateCurrentYear, restocksData)
        
        let currentYearRestocks = getCumulativeQuantitiesForRestocks(currentYearRestocksData)
        let previousYearRestocks = getCumulativeQuantitiesForRestocks(prevYearRestocksData)

        setCurrentYearRestocksStats(currentYearRestocks)
        setPreviousYearRestocksStats(previousYearRestocks)
    }, [restocksData, dateFilterValues.from])

    // Fetch sales data in real time
    useEffect(() => {
        const farmersDocsRef = collection(db, "farmers")
    
        const unsubscribeProperty = onSnapshot(farmersDocsRef, (querySnapshot) => {
            let records = []
            querySnapshot.forEach((doc) => {
                records.push({docId: doc.id, ...doc.data()})
            })

            records.map(r=>console.log('id', r.id))

            console.log('farmers-data', records)
            setFarmersData(records)
        })
    }, [])

    // Fetch crops stocks data in real time
    useEffect(() => {
        const cropsDocsRef = collection(db, "crops")
    
        const unsubscribeProperty = onSnapshot(cropsDocsRef, (querySnapshot) => {
            let records = []
            querySnapshot.forEach((doc) => {
                records.push(doc.data())
            })
            let obj = {}
            records.map((record)=> {
                obj = {...obj, [record.name]: record.amount}
            })
            setStocks(obj)
        })
    }, [])

    // Filter sales data by date
    useEffect(()=> {
        if(grainsSalesData.length){
          let filteredByDate = filterByDate(dateFilterValues.from, dateFilterValues.to, grainsSalesData)
          const sortedRecords = [...filteredByDate].sort((a, b)=> {
            return new Date(a['date']).getTime() < new Date(b['date']).getTime()? 1 : -1
          })
          setFilteredGrainsData(sortedRecords)
        }
    }, [grainsSalesData, dateFilterValues.from, dateFilterValues.to])

    return { 
        farmersData,
        stocks,
        farmersData, 
        doughnutValues, 
        filteredGrainsData, 
        dateFilterValues, 
        currentYearSalesStats,
        previousYearSalesStats,
        currentYearRestocksStats,
        previousYearRestocksStats,
        usernames,
        setDateFilterValues, 
        handleChangeDateRange, 
        handleChangeDateFilterValues, 
        mapIcons,
    }
}

export default useDashboard