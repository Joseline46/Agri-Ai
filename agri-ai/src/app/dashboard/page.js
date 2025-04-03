"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

// Components
import Header from '@/components/header/header'
import AddUser from '@/components/addUser/addUser'
import RecordSale from '@/components/recordSale/recordSale'
import Calendar from '@/components/calendar/calendar'
import Doughnut from "@/components/charts/doughnut/doughnut"
import GrainsTable from '@/components/tables/grains/grains'
import FarmersTable from '@/components/tables/farmers/farmers'
import Sidebar from '@/components/sidebar/sidebar'

// Hooks
import useDashboard from '@/hooks/useDashboard'
import useRecordSale from '@/hooks/useRecordSale'

// Context
import { UserAuth } from '@/contexts/auth'

// Styles
import styles from '@/styles/dashboard.module.css'

// Assets
import { TrendingUp, TrendingDown, Bean, Nut } from 'lucide-react' 

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
  
const Card = ({children, recordGrainSale, selectedTab='Maize', cardName, currentValue, previousValue, target}) => {
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
      <section className={styles.card} style={{ backgroundColor: selectedTab.trim().toLowerCase() === cardName.trim().toLowerCase() ? "beige" : "transparent", }} onClick={()=>recordGrainSale(4.3, cardName)}>
        <section className={styles.icons}>
          {children}
          <Consumed gained={currentValue} target={target} />
        </section>
        <p className={styles.h2}>{cardName}</p>
        <section className={styles.comparisonH1}>
          <p className={styles.h1}>{currentValue}</p>
          
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
                    {difference} tonnes
                </p>
            )
        }
  
        </section>
        <p className={styles.h3}>Total amount of produce</p>
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
    let calculatedDifference = 0;
    let previousValue = props.copyCategories[`${props.grain.unTransformedName}`]
    let currentValue = props.categories[`${props.grain.unTransformedName}`]
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
  }, [props.copyCategories, props.categories])

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
          { formatNumber(props.categories[`${props.grain.unTransformedName}`]) }Kg
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
  console.log('credentials', credentials)
  const router = useRouter() 
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [showRecordSale, setShowRecordSale] = useState(false)

  const [grainCategoryFilter, setGrainsCategoryFilter] = useState('all')
  const { setValues } = useRecordSale()
  const { farmersData, doughnutValues, filteredGrainsData, grainCategories, copyGrainCategory, showComparativeStats, dateFilterValues, setDateFilterValues, handleChangeDateRange, handleChangeDateFilterValues, mapIcons, grainCategoriesColumnMaps } = useDashboard()

  const recordGrainSale = (price, grainType)=> {
    setShowRecordSale((prevState)=>!prevState)
    setValues((prevState)=>{
      return {...prevState, price: price,  grainType:grainType}
    })
  }

  useEffect(()=>{
    if(user === null ){
      router.push('/sign-in')
    }
  }, [user, router])

  if(user){
    return (

      <section className={styles.dashboard}>
        <Sidebar setShowAddUserForm={setShowAddUserForm} signout={signout} credentials={credentials} />
        <section className={styles.component}>
          {
            showAddUserForm?<AddUser setShowAddUserForm={setShowAddUserForm}/>:null
          }
          {
            showRecordSale?<RecordSale setShowRecordSale={setShowRecordSale}/>:null
          }
          {/* <section className={styles.nav}>
            <section className={styles.roof}>
              <p className={styles.logo}>Agri-Ai</p>
            </section>
            <section className={styles.floor}>
              <ul className={styles.ul}>
              <li className={styles.selectedLink}>Dashboard</li>
                <li className={styles.link}>Farmers</li>
                <li className={styles.link}>Employees</li>
                <li className={styles.link}>Reports</li>
                <li className={styles.link}>About</li>
              </ul>
            </section>
          </section> */}
          <section className={styles.header}>
            <section className={styles.dashboardTitle}>
              <p className={styles.logoText}>Dashboard</p>
              <p className={styles.inventoryOverview}>Inventory overview</p>
            </section>
              {/* <section className={styles.controls}>
                <button className={styles.addUser} onClick={()=>setShowAddUserForm((prevState)=>!prevState)}>
                  <UserPlus size={17} color='#020817' />
                  <p>Add User</p>
                </button>
                <button className={styles.addSale}>
                  <CirclePlus size={17} color='#ffffff' />
                  <p>Record Sale</p>
                </button>
              </section> */}
          </section>

          <section className={styles.corusel}>
            <Card recordGrainSale={recordGrainSale} cardName="Maize" selectedTab="Maize" currentValue={120} previousValue={110} target={134}>
              <PiGrainsBold size={20} color='black' />
            </Card>
            <Card recordGrainSale={recordGrainSale} cardName="Beans" selectedTab="Beans" currentValue={231} previousValue={110} target={200}>
              <Bean size={17} color='black' />
            </Card>  
            <Card recordGrainSale={recordGrainSale} cardName="Groundnuts" selectedTab="Groundnuts" currentValue={61} previousValue={53} target={100}>
              <Nut  size={20} color='black' />
            </Card>
          </section>

          <section className={styles.section}>
            <section className={styles.sectionHeader}>
              <section className={styles.calendar}>
                <Calendar setDateFilterValues={setDateFilterValues} handleChangeDateRange={handleChangeDateRange} dateFilterValues={dateFilterValues} handleChangeDateFilterValues={handleChangeDateFilterValues} />
              </section>
            </section>
            <section className={styles.doughnutAndLabelsContent}>
                <section className={styles.overview}>
                  <h2 className={styles.title} style={{  position: "relative", left: "174px", top: "103px"}}> Silos Overview </h2>
                  <h1 className={styles.doughnut}>
                    <span>416Kg</span>
                    <span>Total Produce</span>
                  </h1>
                  <Doughnut values={doughnutValues} />
                </section>

                {/* Labels */}
                <section className={styles.labels}>
                  {
                    grainCategoriesColumnMaps.map((grain, index)=> {
                      return (
                        <GrainLabel  mapIcons={mapIcons} grainCategoryFilter={grainCategoryFilter} setGrainsCategoryFilter={setGrainsCategoryFilter} showComparativeStats={showComparativeStats} key={index} copyCategories={copyGrainCategory} categories={grainCategories} grain={grain} />
                      )
                    })
                  }
                </section>

            </section>
            <GrainsTable setGrainsCategoryFilter={setGrainsCategoryFilter} grainCategoryFilter={grainCategoryFilter} grains={filteredGrainsData} />
            <FarmersTable  farmersData={farmersData} />
          </section>
        </section>
      </section>
    )
  }
}

export default Dashboard