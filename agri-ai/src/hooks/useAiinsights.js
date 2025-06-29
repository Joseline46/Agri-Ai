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

const useAiinsights = ()=> {
    const [dateFilterValues, setDateFilterValues] = useState({ 
        from: '',
        to: ''
    })

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

    return { 
        dateFilterValues, 
        setDateFilterValues, 
        handleChangeDateRange, 
        handleChangeDateFilterValues, 
    }
}

export default useAiinsights