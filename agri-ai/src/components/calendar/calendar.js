import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

// Styles
import styles from './calendar.module.css'

// Assets
import { MdOutlineCalendarToday, MdClose, MdSearch,  MdKeyboardArrowRight, MdOutlineRadioButtonChecked, MdKeyboardArrowLeft } from 'react-icons/md'
import { TbSwitch2 } from 'react-icons/tb'

let MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const Calendar = (props) => {
    const [monthSearchValue, setMonthSearchValue] = useState('')
    const [yearSearchValue, setYearSearchValue] = useState('')
    const [chooseMonth, setChooseMonth] = useState(true)
    const [years, setYears] = useState([])
    const [switchMonthsAndYears, setSwitchMonthsAndYears] = useState(false)
    
    const [currentYear, setCurrentYear] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [currentDate, setCurrentDate] = useState(null)
    const [daysOfTheMonth, setDaysOfTheMonth] = useState([])

    const [selectedFromDate, setSelectedFromDate] = useState('1/1/1970')
    const [selectedToDate, setSelectedToDate] = useState('1/1/1970')

    const [side, setSide] = useState('')
    const [openRanges, setOpenRanges] = useState(false)
    const [setRange, setSetRange] = useState('This Month')

    useEffect(()=>{
        let numbers = []
        let startYear = 1960
        let currentDayYear = new Date().getFullYear()
        let countYear = startYear
        while(countYear <= currentDayYear){
            countYear++
            numbers.push(countYear)
        }
        setYears(numbers)
    },[])

    useEffect(()=> {
        // TODO : handle selectedDate for ['year'] range. Selected date is one month greater
        if(props.dateFilterValues ){
            let { from, to } = props.dateFilterValues

            // From Date
            let [fromMonth, fromDay, fromYear] = from!==''?from.split('/'):'1/1/1970'
            let fromDateString = `${fromMonth}/${fromDay}/${fromYear}`
            let fromTimestamp = new Date(from).getTime()

            // To Date
            let [toMonth, toDay, toYear] = to!==''?to.split('/'):'1/1/1970'
            let toDateString = `${toMonth}/${toDay}/${toYear}`
            let toTimestamp = new Date(to).getTime()

            if(fromTimestamp > toTimestamp){
                setSelectedFromDate(toDateString)
                setSelectedToDate(fromDateString)
            }else {
                setSelectedFromDate(fromDateString)
                setSelectedToDate(toDateString)
            }
        }
    }, [props.dateFilterValues])

    useEffect(()=>{
        let month = currentMonth === null? new Date().getMonth() : currentMonth
        let year = currentYear === null? new Date().getFullYear() : currentYear

        month = side === 'left'?(currentMonth-1):(side === 'right'?(currentMonth+1):month)

        if(month < 0 || month > 11) {
            let date = new Date(currentYear, month)
            month = date.getMonth()
            year = date.getFullYear()
        }

        let firstDayOfMonth = new Date(year, month, 1).getDay() // Getting first day of month
        let lastDateOfLastMonth = new Date(year, month, 0).getDate() // Getting last day of prev month
        let lastDateOfMonth = new Date(year, month + 1, 0).getDate() // Getting last day of month
        let allTheDaysOfTheMonth = []

        for(let i=firstDayOfMonth; i > 0; i--){
            allTheDaysOfTheMonth.push({day:`${lastDateOfLastMonth -i + 1}`, year: year, month:month, class: 'prev'})
        }

        for(let day = 1; day <= lastDateOfMonth; day++) {

            // let today = props.min === ''?new Date():new Date(props.min)
            // let mm = today.getMonth()
            // let dd = today.getDate()
            // let yyyy = today.getFullYear()

            // let todaysDate = `${mm}/${dd}/${yyyy}`
            // let todaysTimeStamp = new Date(todaysDate).getTime()
            // let calendarDate = `${month}/${day}/${year}`
            // let calendarTimeStamp = new Date(calendarDate).getTime()

            // let isDateValid = todaysTimeStamp >= calendarTimeStamp

            // allTheDaysOfTheMonth.push({day:day, year: year, month:month, class: isDateValid?'invalid':'valid'})
            allTheDaysOfTheMonth.push({day:day, year: year, month:month+1, class: ''})

        }

        setDaysOfTheMonth(allTheDaysOfTheMonth)

        setCurrentMonth(month)
        setCurrentYear(year)
        setSide('')
        setCurrentDate(`${MONTHS[month]} ${year}`)
    }, [currentYear, currentMonth, props.min, side])

    const selectDate = (date)=> {
        props.changeDate(`${date.month}/${date.day}/${date.year}`, props.name)
    }

    const selectDateRange = (range)=> {
        props.handleChangeDateRange(range)
        setOpenRanges(false)
        setSetRange(()=> range==='month'?'This Month':'This Year')
    }

    const handleGoToMonth = (value)=> {
        let month = 0

        let year = currentYear
        let lastDateOfMonth = 30

        // format : mm/dd/yy
        switch(value){
            case 'January':
                month = 0
                break
            case 'February':
                month = 1
                break
            case 'March':
                month = 2
                break
            case 'April':
                month = 3
                break
            case 'May':
                month = 4
                break
            case 'June':
                month = 5
                break
            case 'July':
                month = 6
                break
            case 'August':
                month = 7
                break
            case 'September':
                month = 8
                break
            case 'October':
                month = 9
                break
            case 'November':
                month = 10
                break
            case 'December':
                month = 11
                break
            default:
                month = new Date().getMonth()
        }

        lastDateOfMonth = new Date(year, month + 1, 0).getDate() 
        let from = `${month+1}/1/${year}`
        let to = `${month+1}/${lastDateOfMonth}/${year}`

        props.setDateFilterValues({
            from,
            to
        })

        setCurrentMonth(month)
        setCurrentYear(year)

        setCurrentDate(`${MONTHS[month]} ${year}`)
    }

    const handleGoToYear = (year)=> {
        // update currentYear
        // set from to first day of first month and 
        // to - last day of first month

        let month = 0

        let lastDateOfMonth = new Date(year, month + 1, 0).getDate() 
        let from = `${month+1}/1/${year}`
        let to = `${month+1}/${lastDateOfMonth}/${year}`

         props.setDateFilterValues({
            from,
            to
        })

        setCurrentYear(year)
        setCurrentDate(`${MONTHS[month]} ${year}`)
    }

    return (
        <section className={styles.CalendarWrapper} ref={props.calendarRef} style={{display: props.showCalendar?(props.showCalendarUI?'flex':'none'):'none', top:`${props.topRect}px`}}>
            <section className={styles.CalendarHeader}>
                <section className={styles.date} onClick={()=>setSwitchMonthsAndYears((prevState)=>!prevState)}>{currentDate}</section>
                <section className={styles.currentDate} style={{display:switchMonthsAndYears?'flex':'none'}} onMouseLeave={()=>setSwitchMonthsAndYears(false)}>
                    <section className={styles.search}>
                        <MdSearch size={18} color='#808080' />
                        {
                            chooseMonth?<input className={styles.inputBox} value={monthSearchValue} onChange={(e)=>setMonthSearchValue(e.target.value)} placeholder='Filter months...' />:
                            <input className={styles.inputBox} value={yearSearchValue} onChange={(e)=>setYearSearchValue(e.target.value)} placeholder='Filter years...' />
                        }
                        <section className={styles.switch} onClick={()=>setChooseMonth(prevState=>!prevState)}>
                            <TbSwitch2 color='#5E17EB' size={15} />
                        </section>
                        <section className={styles.switch} onClick={()=>setSwitchMonthsAndYears(prevState=>!prevState)}>
                            <MdClose color='#5E17EB' size={15} />
                        </section>
                    </section>
                    {
                        chooseMonth?(
                            <section className={styles.columns}>
                                {
                                    MONTHS.filter((month)=> {
                                        return monthSearchValue===''?month:month.trim().toLowerCase().includes(monthSearchValue.trim().toLowerCase())
                                    }).map((month, index)=> {
                                        return (
                                            <section className={styles.months} key={index} onClick={()=>handleGoToMonth(month)}>
                                                <MdOutlineRadioButtonChecked size={15} color={MONTHS[currentMonth]===month?'#0058FF':'#808080'} />
                                                <span style={{color: MONTHS[currentMonth]===month?'#0058FF':'#222'}}>{month}</span>
                                            </section>
                                        )
                                    })
                                }
                            </section>
                        ):(
                            <section className={styles.columns}>
                                {
                                    years.filter((year)=> {
                                        return yearSearchValue===''?year:year.toString().includes(yearSearchValue.toString())
                                    }).map((year, index)=> {
                                        return (
                                            <section className={styles.months} key={index} onClick={()=>handleGoToYear(year)}>
                                                <MdOutlineRadioButtonChecked size={15} color={currentYear===year?'#0058FF':'#808080'} />
                                                <span style={{color: currentYear===year?'#0058FF':'#222'}}>{year}</span>
                                            </section>
                                        )
                                    })
                                }
                            </section>
                        )
                    }
                </section>
                <section className={styles.icons}>
                    <span onClick={()=>setSide('left')}>
                        <MdKeyboardArrowLeft className={styles.MdKeyboardArrow} />
                    </span>
                    <span onClick={()=>setSide('right')}>
                        <MdKeyboardArrowRight className={styles.MdKeyboardArrow} />
                    </span>
                </section>
            </section>
            <section className={styles.calendar}>
                <ul className={styles.weeks}>
                    <li>S</li>
                    <li>M</li>
                    <li>T</li>
                    <li>W</li>
                    <li>T</li>
                    <li>F</li>
                    <li>S</li>
                </ul>
                <ul className={styles.days}>
                    {
                        daysOfTheMonth.length > 0 ?(
                            daysOfTheMonth.map((date, index)=> {
                                const { day, month, year, ...rest } = date
                                let iterDateTimestamp = new Date(`${month}/${day}/${year}`).getTime()
                                let toDateTimestamp = new Date(selectedToDate).getTime()
                                let fromDateTimestamp = new Date(selectedFromDate).getTime()

                                const isFromDateSelected = fromDateTimestamp === iterDateTimestamp
                                const isToDateSelected = toDateTimestamp === iterDateTimestamp
                                let isDateInRange = ((iterDateTimestamp > fromDateTimestamp)&&(iterDateTimestamp < toDateTimestamp))

                                return ( 
                                    <li 
                                        key={index} 
                                        className={clsx({[styles.prev] : date.class === 'prev', [styles.invalid] : date.class === 'invalid', [styles.selected] : ((isFromDateSelected === true)||(isToDateSelected===true)), [styles.inBetween] : isDateInRange === true})} 
                                        onClick={()=>selectDate(date)}>
                                       {date.day}
                                    </li>
                                )
                            })
                        ):null
                    }
                </ul>
            </section>
            <section className={styles.footer}>
                <section className={styles.cover}>
                    <button className={styles.clear} onClick={()=>setOpenRanges(true)}>
                        <MdOutlineCalendarToday color='#808080' size={14} className={styles.MdOutlineCalendarToday} />
                        {setRange}
                    </button>
                    <section className={styles.ranges} style={{display:openRanges?'flex':'none'}}>
                        <section className={styles.period} onClick={()=>selectDateRange('month')}>
                            <MdOutlineRadioButtonChecked size={15} color={setRange==='This Month'?'#0058FF':'#808080'} />
                            <span style={{ color: setRange==='This Month'?'#0058FF':'#808080'}}>This Month</span>
                        </section>
                        <section className={styles.period} onClick={()=>selectDateRange('year')}>
                            <MdOutlineRadioButtonChecked size={15} color={setRange==='This Month'?'#808080':'#0058FF'} />
                            <span style={{ color: setRange==='This Month'?'#808080':'#0058FF'}}>This Year</span>
                        </section>
                    </section>
                </section>
                <button className={styles.close} onClick={()=>props.clearDates()}>
                    Clear Dates
                </button>
            </section>
        </section>
      );
}

export const Textbox = (props)=> {
  const calendarRef = useRef(null)
  
  return (
    <section className={styles.container}>
      <input className={styles.textbox} placeholder='mm/dd/yyyy' value={props.dateFilterValues[props.name]} onChange={null} readOnly={true}/>
      <MdOutlineCalendarToday className={styles.icon} size={10} />
      <Calendar
        calendarRef={calendarRef}
        setDateFilterValues={props.setDateFilterValues}
        showCalendar={props.showCalendar} 
        name={props.name} 
        clearDates={props.clearDates}
        value={props.dateFilterValues[props.name]}
        dateFilterValues={props.dateFilterValues}
        min={props.name === 'to'?props.dateFilterValues['from']:props.dateFilterValues[props.name]} 
        showCalendarUI={props.showCalendarUI} 
        handleChangeDateRange={props.handleChangeDateRange} 
        changeDate={props.handleChangeDateFilterValues} 
        topRect={props.topRect}
        />
    </section>
  )
}

export const DateInput = (props)=> {
    const boxRef = useRef(null)
    const [topRect, setTopRect] = useState(0)
    const [showCalendarUI, setShowCalendarUI] = useState(false)
    
    const clearDates = ()=> {
        props.setDateFilterValues({ 
            from: '',
            to: ''
        })
    }

    // Open UI 
    const closeCalendarUI = ()=> {
        setShowCalendarUI(false)
    }

    // Close UI  
    const openCalendarUI = ()=> {
        const domRect = boxRef.current.getBoundingClientRect()
        // console.log('domRect', domRect)
        
        let windowHeight = window.innerHeight
        let distance = windowHeight - domRect.bottom

        const height = 420

        if(parseFloat(domRect.top) <= 130){
            let offset = 130 - parseFloat(domRect.top)
            let newValue = parseFloat(domRect.top) + offset + 5
            setTopRect((domRect.top - 15))
        }else {
            let offset = parseFloat(domRect.top) - 130
            offset = offset <=5?0:(offset - 5)
            offset = offset  >= height? offset - height : offset
            let newValue = parseFloat(domRect.top) - offset
            setTopRect(newValue)
        }
        setShowCalendarUI(true)
    }

    return (
        <section className={styles.component} ref={boxRef} onMouseLeave={()=>closeCalendarUI()}>
            <section className={styles.in} onClick={()=>openCalendarUI()}>
                <p className={styles.label}>{props.labels?props.labels[0]:'FROM'}</p>
                <Textbox
                    setDateFilterValues={props.setDateFilterValues}
                    name='from'
                    showCalendar={true} 
                    dateFilterValues={props.dateFilterValues}
                    clearDates={clearDates}
                    handleChangeDateRange={props.handleChangeDateRange}
                    handleChangeDateFilterValues={props.handleChangeDateFilterValues}
                    boxRef={boxRef}
                    showCalendarUI={showCalendarUI}
                    topRect={topRect} />
            </section>
            <section className={styles.out}>
                <p className={styles.label}>{props.labels?props.labels[1]:'TO'}</p>
                <Textbox
                    setDateFilterValues={props.setDateFilterValues}
                    name='to'
                    showCalendar={false} 
                    dateFilterValues={props.dateFilterValues}
                    clearDates={clearDates}
                    handleChangeDateRange={props.handleChangeDateRange}
                    handleChangeDateFilterValues={props.handleChangeDateFilterValues}
                    ref={boxRef}
                    showCalendarUI={showCalendarUI}
                    topRect={topRect} />
            </section>
        </section>
    )
}

export default DateInput
