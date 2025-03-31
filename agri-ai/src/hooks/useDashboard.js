import { useState, useEffect } from 'react'

import { TrendingUp, TrendingDown, Wheat, Package, UserPlus, CirclePlus, Bean, Nut } from 'lucide-react' 

import { PiGrainsBold } from "react-icons/pi"
import { GiPeanut } from "react-icons/gi"

const mapIcons = (description)=> {
    let ICON = null
    let transformedDescription = description.trim().toLowerCase()
    switch (transformedDescription) {
        case 'maize':
            ICON = <PiGrainsBold color='#0058FF' size={20} />
            break;
        case 'wheat':
            ICON = <Wheat color='#21D59B' size={20} />
            break;
        case 'beans':
            ICON = <GiPeanut  color='#4B10BF' size={20} />
            break;
        default:
            ICON = <GiPeanut  color='#4B10BF' size={20} />
            break;
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

const grainCategoriesColumnMaps = [
    { unTransformedName: 'maize', transformedName: 'Maize' },
    { unTransformedName: 'wheat', transformedName: 'Wheat' },
    { unTransformedName: 'beans', transformedName: 'Beans' },
]
  
const useDashboard = ()=> {
    const [showComparativeStats, setShowComparativeStats] = useState(true)
    const [filteredGrainsData, setFilteredGrainsData] = useState([])
    const [grainsData, setGrainsData] = useState([{'id': 1,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 592,
        'date': '03/26/2025'},
       {'id': 2,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 859,
        'date': '02/21/2025'},
       {'id': 3,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 802,
        'date': '02/08/2025'},
       {'id': 4,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 256,
        'date': '03/29/2025'},
       {'id': 5,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 637,
        'date': '03/18/2025'},
       {'id': 6,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 652,
        'date': '03/23/2025'},
       {'id': 7,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 315,
        'date': '02/05/2025'},
       {'id': 8,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 824,
        'date': '02/22/2025'},
       {'id': 9,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 119,
        'date': '02/01/2025'},
       {'id': 10,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 865,
        'date': '03/19/2025'},
       {'id': 11,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 440,
        'date': '02/27/2025'},
       {'id': 12,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 147,
        'date': '03/11/2025'},
       {'id': 13,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 606,
        'date': '02/28/2025'},
       {'id': 14,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 844,
        'date': '02/28/2025'},
       {'id': 15,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 480,
        'date': '02/25/2025'},
       {'id': 16,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 511,
        'date': '02/21/2025'},
       {'id': 17,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 444,
        'date': '03/09/2025'},
       {'id': 18,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 393,
        'date': '02/03/2025'},
       {'id': 19,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 574,
        'date': '03/22/2025'},
       {'id': 20,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 857,
        'date': '02/01/2025'},
       {'id': 21,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 567,
        'date': '03/18/2025'},
       {'id': 22,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 690,
        'date': '02/25/2025'},
       {'id': 23,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 493,
        'date': '02/26/2025'},
       {'id': 24,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 202,
        'date': '03/11/2025'},
       {'id': 25,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 542,
        'date': '02/17/2025'},
       {'id': 26,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 306,
        'date': '03/13/2025'},
       {'id': 27,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 854,
        'date': '02/16/2025'},
       {'id': 28,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 877,
        'date': '02/13/2025'},
       {'id': 29,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 756,
        'date': '02/22/2025'},
       {'id': 30,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 101,
        'date': '02/21/2025'},
       {'id': 31,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 835,
        'date': '02/08/2025'},
       {'id': 32,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 673,
        'date': '02/28/2025'},
       {'id': 33,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 593,
        'date': '03/21/2025'},
       {'id': 34,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 846,
        'date': '02/19/2025'},
       {'id': 35,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 604,
        'date': '03/26/2025'},
       {'id': 36,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 626,
        'date': '03/18/2025'},
       {'id': 37,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 481,
        'date': '02/25/2025'},
       {'id': 38,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 316,
        'date': '02/17/2025'},
       {'id': 39,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 644,
        'date': '03/17/2025'},
       {'id': 40,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 165,
        'date': '02/16/2025'},
       {'id': 41,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 264,
        'date': '02/26/2025'},
       {'id': 42,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 537,
        'date': '02/05/2025'},
       {'id': 43,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 169,
        'date': '02/23/2025'},
       {'id': 44,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 326,
        'date': '02/24/2025'},
       {'id': 45,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 219,
        'date': '02/26/2025'},
       {'id': 46,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 199,
        'date': '03/01/2025'},
       {'id': 47,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 863,
        'date': '03/14/2025'},
       {'id': 48,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 653,
        'date': '03/26/2025'},
       {'id': 49,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 555,
        'date': '02/22/2025'},
       {'id': 50,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 381,
        'date': '03/02/2025'},
       {'id': 51,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 233,
        'date': '03/14/2025'},
       {'id': 52,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 202,
        'date': '03/21/2025'},
       {'id': 53,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 587,
        'date': '03/10/2025'},
       {'id': 54,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 647,
        'date': '03/27/2025'},
       {'id': 55,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 414,
        'date': '03/05/2025'},
       {'id': 56,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 800,
        'date': '02/16/2025'},
       {'id': 57,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 660,
        'date': '02/28/2025'},
       {'id': 58,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 664,
        'date': '02/07/2025'},
       {'id': 59,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 860,
        'date': '03/15/2025'},
       {'id': 60,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 505,
        'date': '03/30/2025'},
       {'id': 61,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 160,
        'date': '02/02/2025'},
       {'id': 62,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 506,
        'date': '02/13/2025'},
       {'id': 63,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 638,
        'date': '03/13/2025'},
       {'id': 64,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 854,
        'date': '03/18/2025'},
       {'id': 65,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 385,
        'date': '03/27/2025'},
       {'id': 66,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 512,
        'date': '02/24/2025'},
       {'id': 67,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 340,
        'date': '03/13/2025'},
       {'id': 68,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 344,
        'date': '03/11/2025'},
       {'id': 69,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 162,
        'date': '02/03/2025'},
       {'id': 70,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 254,
        'date': '02/16/2025'},
       {'id': 71,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 874,
        'date': '03/23/2025'},
       {'id': 72,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 462,
        'date': '02/26/2025'},
       {'id': 73,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 189,
        'date': '03/04/2025'},
       {'id': 74,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 255,
        'date': '02/05/2025'},
       {'id': 75,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 556,
        'date': '02/03/2025'},
       {'id': 76,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 185,
        'date': '02/25/2025'},
       {'id': 77,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 386,
        'date': '03/26/2025'},
       {'id': 78,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 148,
        'date': '02/17/2025'},
       {'id': 79,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 669,
        'date': '03/26/2025'},
       {'id': 80,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 620,
        'date': '03/14/2025'},
       {'id': 81,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 656,
        'date': '02/13/2025'},
       {'id': 82,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 745,
        'date': '02/19/2025'},
       {'id': 83,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 366,
        'date': '03/12/2025'},
       {'id': 84,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 808,
        'date': '03/18/2025'},
       {'id': 85,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 178,
        'date': '03/01/2025'},
       {'id': 86,
        'grainType': 'Beans',
        'consumerType': 'Human',
        'quantity': 619,
        'date': '03/27/2025'},
       {'id': 87,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 186,
        'date': '02/19/2025'},
       {'id': 88,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 316,
        'date': '02/03/2025'},
       {'id': 89,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 823,
        'date': '02/12/2025'},
       {'id': 90,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 458,
        'date': '02/20/2025'},
       {'id': 91,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 487,
        'date': '02/10/2025'},
       {'id': 92,
        'grainType': 'Wheat',
        'consumerType': 'Human',
        'quantity': 175,
        'date': '03/20/2025'},
       {'id': 93,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 723,
        'date': '02/16/2025'},
       {'id': 94,
        'grainType': 'Maize',
        'consumerType': 'Livestock',
        'quantity': 339,
        'date': '03/13/2025'},
       {'id': 95,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 254,
        'date': '02/15/2025'},
       {'id': 96,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 865,
        'date': '02/21/2025'},
       {'id': 97,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 204,
        'date': '03/30/2025'},
       {'id': 98,
        'grainType': 'Beans',
        'consumerType': 'Livestock',
        'quantity': 629,
        'date': '03/22/2025'},
       {'id': 99,
        'grainType': 'Maize',
        'consumerType': 'Human',
        'quantity': 109,
        'date': '03/22/2025'},
       {'id': 100,
        'grainType': 'Wheat',
        'consumerType': 'Livestock',
        'quantity': 717,
        'date': '03/05/2025'}]
    )
    const [dateFilterValues, setDateFilterValues] = useState({ 
        from: '',
        to: ''
    })
    const [copyGrainCategory, setCopyGrainCategory] = useState({
        maize: 0,
        beans: 0,
        wheat: 0,
    });
    const [grainCategories, setGrainCategories] = useState({
        maize: 0,
        beans: 0,
        wheat: 0,
    });

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

    useEffect(()=> {
        if(grainsData.length){
          let filteredByDate = filterByDate(dateFilterValues.from, dateFilterValues.to, grainsData)
          const sortedRecords = [...filteredByDate].sort((a, b)=> {
            return new Date(a['date']).getTime() < new Date(b['date']).getTime()? 1 : -1
          })
          setFilteredGrainsData(sortedRecords)
        }
    }, [grainsData, dateFilterValues.from, dateFilterValues.to])

    return { filteredGrainsData, grainCategories, copyGrainCategory, showComparativeStats, dateFilterValues, setDateFilterValues, handleChangeDateRange, handleChangeDateFilterValues, mapIcons, grainCategoriesColumnMaps }
}

export default useDashboard