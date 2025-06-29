"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

// Components
import AddFarmer from '@/components/addUser/addUser'
import AddCropAmount from '@/components/addCropAmount/addCropAmount'
import RecordSale from '@/components/recordSale/recordSale'
import Calendar from '@/components/calendar/calendar'
import Doughnut from "@/components/charts/doughnut/doughnut"
import GrainsTable from '@/components/tables/grains/grains'
import Sidebar from '@/components/sidebar/sidebar'

// Hooks
import useDashboard from '@/hooks/useDashboard'

// Context
import { UserAuth } from '@/contexts/auth'

// Styles
import styles from '@/styles/dashboard.module.css'

// Assets
import { TrendingUp, TrendingDown, Bean, Wheat, Plus } from 'lucide-react' 
import { GiPeas  } from "react-icons/gi"

import { PiGrainsBold } from "react-icons/pi"

const Consumed = (props) => {
    const [primaryColor, setPrimaryColor] = useState("");
    const [secondaryColor, setSecondaryColor] = useState("");
    const [sign, setSign] = useState("plus");
    const [percent, setPercent] = useState(0);
  
    useEffect(() => {
      let target = parseFloat(props.target);
      let gained = parseFloat(props.gained);
  
      let operand = "plus";
      let total = 0;
  
      // Cannot divide by zero
      if (parseFloat(target) > 0) {
        total = parseInt((parseFloat(gained) / parseFloat(target)) * 100);
      }
      if (total > 100) {
        total = total - 100;
        operand = "minus";
      }
      setPercent(total);
      setSign(operand);
    }, [props.gained, props.target]);
  
    useEffect(() => {
      if (sign === "plus") {
        setPrimaryColor("#98FB98");
        setSecondaryColor("#0BDA51");
      } else if (sign === "minus") {
        setPrimaryColor("#FA8072");
        setSecondaryColor("#FF2400");
      }
    }, [sign]);
  
    return (
      <section className={styles.consumed}>
        <span>{`${sign === "plus" ? "+" : ""}${percent}%`}</span>
        <section
          className={styles.faint}
          style={{ backgroundColor: primaryColor }}
        >
          <section
            className={styles.fluid}
            style={{ width: `${percent}%`, backgroundColor: secondaryColor }}
          ></section>
        </section>
      </section>
    );
}
  
const Card = ({children, cardName, currentValue, previousValue, target, updateCropAmount}) => {
  const [percentageIncrease, setPercentageIncrease] = useState(0);
  const [hasIncreased, setHasIncreased] = useState(false);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    // Ensure values are valid numbers
    let calculatedDifference = 0;
    if (isNaN(previousValue) || isNaN(currentValue)) {
      setPercentageIncrease(0);
      setHasIncreased(false);
      setDifference(0);
      return;
    }

      if(previousValue === currentValue) {
      setPercentageIncrease(null);
      setHasIncreased(null);
      setDifference(null);
    } else if (previousValue === 0) {
      setPercentageIncrease(100)
      
      setHasIncreased(true);
      setDifference(currentValue);
    }  else {
      calculatedDifference = currentValue - previousValue;
      let percent = (calculatedDifference / previousValue) * 100;

      // Round to nearest whole number
      percent = Math.round(percent);

      setPercentageIncrease(percent);
      if(cardName.trim().toLowerCase()==='expenses'){
        setHasIncreased(calculatedDifference < 0);
      }else {
        setHasIncreased(calculatedDifference > 0);
      }
      
      setDifference(Math.abs(calculatedDifference));
    }
  }, [currentValue, previousValue]);

  return (
    <section className={styles.card} onClick={()=>updateCropAmount(cardName, currentValue)}>
      <section className={styles.icons}>
        <section className={styles.circle}>{children}</section>
        <Consumed gained={currentValue} target={target} />
      </section>
      <p className={styles.h2}>{cardName}</p>
      <section className={styles.comparisonH1}>
        <p className={styles.h1}>{currentValue} Kgs</p>
        
      {
        hasIncreased===null?null:(
          <p className={styles.compared} style={{ color: hasIncreased ? "#217346" : "#EB173A" }}>
              {`${hasIncreased ? "+" : ""}${percentageIncrease}%`}
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
  );
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const GrainLabel = (props)=> {
  const [percentageIncrease, setPercentageIncrease] = useState(0);
  const [hasIncreased, setHasIncreased] = useState(false);
  const [difference, setDifference] = useState(0);
  const [isCategorySelected,  setIsCategorySelected] = useState(false)

  useEffect(() => {
    // Ensure values are valid numbers
    if(props.stocks){
      let calculatedDifference = 0;
      let previousValue = props.copyCategories[`${props.grain.unTransformedName}`]
      let currentValue = props.stocks[`${props.grain.unTransformedName}`]
      if (isNaN(previousValue) || isNaN(currentValue)) {
        setPercentageIncrease(0);
        setHasIncreased(false);
        setDifference(0);
        return;
      }

      if(previousValue === currentValue) {
        setPercentageIncrease(null);
        setHasIncreased(null);
        setDifference(null);
      } else if(previousValue === 0) {
        setPercentageIncrease(100);
        setHasIncreased(true);
        setDifference(currentValue);
      } else {
        calculatedDifference = currentValue - previousValue;
        let percent = (calculatedDifference / previousValue) * 100;

        // Round to nearest whole number
        percent = Math.round(percent);

        setPercentageIncrease(percent);
        setHasIncreased(calculatedDifference > 0);
        setDifference(Math.abs(calculatedDifference));
      }
    }
  }, [props.copyCategories, props.stocks])

  useEffect(()=> {
    const isSelected = props.grain.transformedName===props.grainCategoryFilter
    setIsCategorySelected(isSelected)
  }, [props.grainCategoryFilter, props.grain.transformedName])

  return (
    <section className={clsx({[styles.category]:isCategorySelected===false, [styles.selectedCategory]:isCategorySelected===true})} onClick={()=>props.setGrainsCategoryFilter(props.grain.transformedName)}>
      <section className={styles.avatar}>
        { props.mapIcons(props.grain.transformedName) }
      </section>
      <section className={styles.labelAndAmount}>
        <p className={styles.label}>{props.grain.transformedName}</p>
        <section className={styles.amount}>
          { props.stocks && formatNumber(props.stocks[`${props.grain.unTransformedName}`]) }Kg
          {/* {
            props.showComparativeStats?(
              hasIncreased===null?null:(
                <p className={styles.compared} style={{ color: hasIncreased ? "#EB173A" : "#217346", }} >
                  {`${hasIncreased ? "+" : ""}${percentageIncrease}%`}
                </p>
              )
            ):null
          }
          {
            props.showComparativeStats?(
              hasIncreased===null?null:(
                <p className={styles.comparedValue} style={{ color: hasIncreased ? "#EB173A" : "#217346", top:"0", flexFlow:"row nowrap" }}>
                  {hasIncreased ? ( <TrendingUp color="#EB173A" size={15} /> ) : ( <TrendingDown color="#217346" size={15} />)}
                  {difference}
                </p>
              )
            ):null
          } */}
        </section>
      </section>
    </section>
  )
}

const Dashboard = ()=> {
  const { user, credentials, signout } = UserAuth()
  const router = useRouter() 
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [showRecordSale, setShowRecordSale] = useState(false)
  const [showAddCropAmountForm, setShowAddCropAmountForm] = useState(false)
  const [cropData, setCropData] = useState(null)

  const [grainCategoryFilter, setGrainsCategoryFilter] = useState('all')
  const {
    stocks,
    insertDoc, 
    farmersData, 
    doughnutValues, 
    filteredGrainsData, 
    grainCategories, 
    copyGrainCategory, 
    dateFilterValues, 
    setDateFilterValues, 
    handleChangeDateRange, 
    handleChangeDateFilterValues, 
    mapIcons, 
    grainCategoriesColumnMaps } = useDashboard()

  const recordGrainSale = ()=> {
    setShowRecordSale((prevState)=>!prevState)
  }

  const closeRecordSale = ()=> {
    setShowRecordSale(false)
  }

  useEffect(()=>{
    if(user === null ){
      router.push('/sign-in')
    }
  }, [user, router])

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
        <section className={styles.dashboard}>
          <Sidebar recordGrainSale={recordGrainSale} setShowAddUserForm={setShowAddUserForm} signout={signout} credentials={credentials} />
          <section className={styles.component}>
            { showAddUserForm && <AddFarmer setShowAddUserForm={setShowAddUserForm}/> }
            { showRecordSale && <RecordSale closeRecordSale={closeRecordSale} setShowRecordSale={setShowRecordSale}/> }
            { showAddCropAmountForm && <AddCropAmount closeUpdateCropAmount={closeUpdateCropAmount} cropData={cropData}/> }

            <section className={styles.header}>
              <section className={styles.dashboardTitle}>
                <p className={styles.logoText} onClick={()=>insertDoc()}>Dashboard</p>
              </section>
            </section>

            <section className={styles.corusel}>
              <Card updateCropAmount={updateCropAmount} cardName="Maize" currentValue={stocks?stocks['Maize'] : 0} previousValue={110} target={134}>
                <PiGrainsBold size={20} color='#0058FF' />
              </Card>
              <Card updateCropAmount={updateCropAmount} cardName="Beans" currentValue={stocks?stocks['Beans'] : 0} previousValue={110} target={200}>
                <Bean size={17} color='#4B10BF' />
              </Card>  
              <Card updateCropAmount={updateCropAmount} cardName="Wheat" currentValue={stocks?stocks['Wheat'] : 0} previousValue={53} target={100}>
                <Wheat  size={20} color='#FFC700' />
              </Card>
               <Card updateCropAmount={updateCropAmount} cardName="Soybeans" currentValue={stocks?stocks['Soybeans'] : 0} previousValue={53} target={100}>
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
                    <span>416Kg</span>
                  </h1>
                  <Doughnut values={[261, 45, 61, 67]} />
                </section>

                {/* Labels */}
                <section className={styles.labels}>
                  {
                    grainCategoriesColumnMaps.map((grain, index)=> {
                      return (
                        <GrainLabel  stocks={stocks} mapIcons={mapIcons} grainCategoryFilter={grainCategoryFilter} setGrainsCategoryFilter={setGrainsCategoryFilter} key={index} copyCategories={copyGrainCategory} categories={grainCategories} grain={grain} />
                      )
                    })
                  }
                </section>
              </section>

              <p className={styles.headerText}>Grains Inventory</p>
              <GrainsTable setGrainsCategoryFilter={setGrainsCategoryFilter} grainCategoryFilter={grainCategoryFilter} grains={filteredGrainsData} />
            </section>
          </section>
        </section>
      </>
    )
  }
}

export default Dashboard