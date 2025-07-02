"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"

// Components
import AddFarmer from '@/components/addUser/addUser'
import AddCropAmount from '@/components/addCropAmount/addCropAmount'
import RecordSale from '@/components/recordSale/recordSale'
import Calendar from '@/components/calendar/calendar'
import Doughnut from "@/components/charts/doughnut/doughnut"
import GrainsTable from '@/components/tables/grains/grains'
import Sidebar from '@/components/sidebar/sidebar'
import ViewFarmersComponent from '@/components/farmers/farmers'
import Aiinsights from '@/components/insights/aiinsights'
import RestocksModal from '@/components/restocksModal/restocksModal'

import { loadModel, predict } from '@/predict'

// Hooks
import useDashboard from '@/hooks/useDashboard'

// Context
import { UserAuth } from '@/contexts/auth'

// Styles
import styles from '@/styles/dashboard.module.css'

// Assets
import { TrendingUp, TrendingDown, Bean, Wheat, Plus, Sparkles } from 'lucide-react' 
import { GiPeas  } from "react-icons/gi"

import { PiGrainsBold } from "react-icons/pi"

const Consumed = (props) => {
    const [primaryColor, setPrimaryColor] = useState("")
    const [secondaryColor, setSecondaryColor] = useState("")

    useEffect(() => {
      if (props.hasIncreased) {
        setPrimaryColor("#98FB98")
        setSecondaryColor("#0BDA51")
      } else {
        setPrimaryColor("#FA8072")
        setSecondaryColor("#FF2400")
      }
    }, [props.hasIncreased])
  
    return (
      <section className={styles.consumed}>
        <span style={{color:`${secondaryColor}`}}>{`${props.hasIncreased ? "+" : ""}${props.percent}%`}</span>
        <section className={styles.faint} style={{ backgroundColor: primaryColor }}>
          <section className={styles.fluid} style={{ width: `${props.percent}%`, backgroundColor: secondaryColor }}></section>
        </section>
      </section>
    )
}
  
export const Card = ({children, cardName, currentValue, previousValue, target, displayValue, updateCropAmount}) => {
  const [percentChange, setPercentChange] = useState(0)
  const [hasIncreased, setHasIncreased] = useState(false)
  const [difference, setDifference] = useState(0)

  useEffect(() => {
    if (isNaN(previousValue) || isNaN(currentValue)) {
      setPercentChange(0)
      setHasIncreased(false)
      setDifference(0)
      return
    }else if(previousValue === currentValue) {
      setPercentChange(0)
      setHasIncreased(false)
      setDifference(0)
    }else if(previousValue === 0 && currentValue > 0) {
      setPercentChange(100)
      setHasIncreased(true)
      setDifference(currentValue)
    }else {
      let calculatedDifference = currentValue - previousValue
      let percent = previousValue === 0 ? 100 : (calculatedDifference / previousValue) * 100

      percent = Math.round(percent)

      setPercentChange(percent)
      setDifference(calculatedDifference)
    }
  }, [currentValue, previousValue])

  return (
    <section className={styles.card} onClick={()=>updateCropAmount(cardName, currentValue)}>
      <section className={styles.icons}>
        <section className={styles.circle}>{children}</section>
        <Consumed percent={percentChange} hasIncreased={hasIncreased} />
      </section>
      <p className={styles.h2}>{cardName}</p>
      <section className={styles.comparisonH1}>
        <p className={styles.h1}>{displayValue} Kgs</p>
        {
          hasIncreased===null?null:(
            <p className={styles.compared} style={{ color: hasIncreased ? "#217346" : "#EB173A" }}>
              {`${hasIncreased ? "+" : ""}${percentChange}%`}
            </p>
          )
        }
        {
          hasIncreased===null?null:(
            <p className={styles.comparedValue} style={{ color: hasIncreased ? "#217346" : "#EB173A", }}>
              {hasIncreased ? ( <TrendingUp color="#217346" size={15} /> ) : ( <TrendingDown color="#EB173A" size={15} /> )}
              {difference} kgs
            </p>
          )
        }
      </section>
    </section>
  )
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const GrainLabel = (props)=> {
  const [percentChange, setPercentChange] = useState(0)
  const [hasIncreased, setHasIncreased] = useState(false)
  const [difference, setDifference] = useState(0)

  useEffect(() => {
    let previousValue = props.previousValue
    let currentValue = props.currentValue

    if (isNaN(previousValue) || isNaN(currentValue)) {
      setPercentChange(0)
      setHasIncreased(false)
      setDifference(0)
      return
    }else if(previousValue === currentValue) {
      setPercentChange(0)
      setHasIncreased(false)
      setDifference(0)
    }else if(previousValue === 0 && currentValue > 0) {
      setPercentChange(100)
      setHasIncreased(true)
      setDifference(currentValue)
    }else {
      let calculatedDifference = currentValue - previousValue
      let percent = previousValue === 0 ? 100 : (calculatedDifference / previousValue) * 100

      percent = Math.round(percent)

      setPercentChange(percent)
      setDifference(calculatedDifference)
    }
  }, [props.currentValue, props.previousValue])

  return (
    <section className={styles.category}>
      <section className={styles.avatar}>
        { props.mapIcons(props.name) }
      </section>
      <section className={styles.labelAndAmount}>
        <p className={styles.label}>{props.name}</p>
        <section className={styles.amount}>
          { formatNumber(props.currentValue) }Kg
          {
            hasIncreased===null?null:(
              <p className={styles.compared} style={{ color: hasIncreased ? "#EB173A" : "#217346", }} >
                {`${hasIncreased ? "+" : ""}${percentChange}%`}
              </p>
            )
          }
          {
            hasIncreased===null?null:(
              <p className={styles.comparedValue} style={{ color: hasIncreased ? "#EB173A" : "#217346", top:"0", flexFlow:"row nowrap" }}>
                {hasIncreased ? ( <TrendingUp color="#EB173A" size={15} /> ) : ( <TrendingDown color="#217346" size={15} />)}
                {difference} Kg
              </p>
            )
          }
        </section>
      </section>
    </section>
  )
}

const grainsTypes = ['Maize', 'Wheat', 'Beans', 'Soybeans']

const Dashboard = ()=> {
  const { user, credentials, signout } = UserAuth()
  const router = useRouter() 
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [showRecordSale, setShowRecordSale] = useState(false)
  const [showAddCropAmountForm, setShowAddCropAmountForm] = useState(false)
  const [cropData, setCropData] = useState(null)
  const [totalWeight, setTotalWeight] = useState(0)
  const [viewFarmers, setViewFarmers] = useState(false)
  const [viewInsights, setViewInsights] = useState(false)
  const [viewRestocks, setViewRestocks] = useState(false)

  const {
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
  } = useDashboard()

  const testPredict = async ()=> {
    const model = await loadModel();
    const prediction = await predict(model, [2025, 6, 29, 555]);
    console.log(`Predicted Quantity (kg): ${prediction.toFixed(2)}`);
  }

  const recordGrainSale = ()=> {
    setShowRecordSale((prevState)=>!prevState)
  }

  const closeRecordSale = ()=> {
    setShowRecordSale(false)
  }

  const openViewFarmers = ()=> {
    setViewFarmers(true)
  }

  const closeViewFarmers = ()=> {
    setViewFarmers(false)
  }

  const openViewInsights = ()=> {
    setViewInsights(true)
  }

  const closeViewInsights = ()=> {
    setViewInsights(false)
  }

  const openViewRestocks = ()=> {
    setViewRestocks(true)
  }

  const closeViewRestocks = ()=> {
    setViewRestocks(false)
  }

  useEffect(()=>{
    if(user === null ){
      router.push('/sign-in')
    }
  }, [user, router])

  useEffect(() => {
    function sumArrayValues(arr) {
      return arr.reduce((total, value) => total + value, 0);
    }
    const total = sumArrayValues(doughnutValues);
    setTotalWeight(total);  
  }, [doughnutValues])

  const updateCropAmount = (name, amount)=> {
    setShowAddCropAmountForm(true)
    setCropData({ name, amount })
  }

  const closeUpdateCropAmount = ()=> {
    setShowAddCropAmountForm(false)
    setCropData(null)
  }

  if(user){
    return (
      <>
        <Toaster position="bottom-right" />
        { viewInsights ? <Aiinsights currentYearRestocksStats={currentYearRestocksStats} close={closeViewInsights} /> : null }
        { viewFarmers && <ViewFarmersComponent showComponent={viewFarmers} farmers={farmersData} close={closeViewFarmers} /> }
        { viewRestocks && <RestocksModal showComponent={viewRestocks} farmers={farmersData} close={closeViewRestocks} /> }
        
        <section className={styles.dashboard}>
          <Sidebar
            openViewRestocks={openViewRestocks} 
            openViewFarmers={openViewFarmers}
            recordGrainSale={recordGrainSale} 
            setShowAddUserForm={setShowAddUserForm} 
            signout={signout} 
            credentials={credentials} />
          <section className={styles.component}>
            { showAddUserForm && <AddFarmer setShowAddUserForm={setShowAddUserForm}/> }
            { showRecordSale && <RecordSale closeRecordSale={closeRecordSale} setShowRecordSale={setShowRecordSale}/> }
            { showAddCropAmountForm && <AddCropAmount usernames={usernames} closeUpdateCropAmount={closeUpdateCropAmount} cropData={cropData}/> }

            <section className={styles.header}>
              <section className={styles.dashboardTitle}>
                <p className={styles.logoText} onClick={()=>testPredict()}>Dashboard</p>
                <section className={styles.controls}>
                  <section className={styles.circle} onClick={()=>openViewInsights()}>
                    <Sparkles size={20} color='#800080' />
                  </section>
                </section>
              </section>
            </section>

            <section className={styles.corusel}>
              <Card updateCropAmount={updateCropAmount} cardName="Maize" currentValue={currentYearRestocksStats['Maize']} displayValue={stocks?stocks['Maize'] : 0} previousValue={previousYearRestocksStats['Maize']} target={previousYearRestocksStats['Maize']}>
                <PiGrainsBold size={20} color='#0058FF' />
              </Card>
              <Card updateCropAmount={updateCropAmount} cardName="Beans" currentValue={currentYearRestocksStats['Beans']} displayValue={stocks?stocks['Beans'] : 0} previousValue={previousYearRestocksStats['Beans']} target={previousYearRestocksStats['Beans']}>
                <Bean size={17} color='#4B10BF' />
              </Card>  
              <Card updateCropAmount={updateCropAmount} cardName="Wheat" currentValue={currentYearRestocksStats['Wheat']} displayValue={stocks?stocks['Wheat'] : 0} previousValue={previousYearRestocksStats['Wheat']} target={previousYearRestocksStats['Wheat']}>
                <Wheat  size={20} color='#FFC700' />
              </Card>
               <Card updateCropAmount={updateCropAmount} cardName="Soybeans" currentValue={currentYearRestocksStats['Soybeans']} displayValue={stocks?stocks['Soybeans'] : 0} previousValue={previousYearRestocksStats['Soybeans']} target={previousYearRestocksStats['Soybeans']}>
                <GiPeas  size={20} color='#EB17A4' />
              </Card>
            </section>

            <section className={styles.section}>
              <section className={styles.sectionHeader}>
                <section className={styles.recordSale} onClick={()=>recordGrainSale()}>
                  <Plus size={20} color='#ffffff' /> 
                  <p>Record Sale</p>
                </section>
                <section className={styles.calendar}>
                  <Calendar setDateFilterValues={setDateFilterValues} handleChangeDateRange={handleChangeDateRange} dateFilterValues={dateFilterValues} handleChangeDateFilterValues={handleChangeDateFilterValues} />
                </section>
              </section>
              <section className={styles.doughnutAndLabelsContent}>
                <section className={styles.overview}>
                  <h1 className={styles.doughnut}>
                    <span>{totalWeight}Kgs</span>
                  </h1>
                  <Doughnut values={doughnutValues} />
                </section>

                {/* Labels */}
                <section className={styles.labels}>
                  {
                    grainsTypes.map((grain, index)=> {
                      return (
                        <GrainLabel currentValue={currentYearSalesStats[`${grain}`]} previousValue={previousYearSalesStats[`${grain}`]} mapIcons={mapIcons} key={index} name={grain} />
                      )
                    })
                  }
                </section>
              </section>

              <p className={styles.headerText}>Grains Sales</p>
              <GrainsTable grains={filteredGrainsData} />
            </section>
          </section>
        </section>
      </>
    )
  }
}

export default Dashboard