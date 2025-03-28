"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Components
import Header from '@/components/header/header'
import AddUser from '@/components/addUser/addUser'

// Context
import { UserAuth } from '@/contexts/auth'

// Styles
import styles from '@/styles/dashboard.module.css'

// Assets
import { TrendingUp, TrendingDown, Wheat, Package, UserPlus, CirclePlus, Bean, Nut } from 'lucide-react' 

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
  
const Card = ({children, selectedTab='Maize', cardName, currentValue, previousValue, target}) => {
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
      <section className={styles.card} style={{ backgroundColor: selectedTab.trim().toLowerCase() === cardName.trim().toLowerCase() ? "beige" : "transparent", }} >
        <section className={styles.icons}>
          {children}
          <Consumed gained={currentValue} target={target} />
        </section>
        <p className={styles.h2}>{cardName}</p>
        <section className={styles.comparisonH1}>
          <p className={styles.h1}>{currentValue}t</p>
          
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
};

const Dashboard = ()=> {
  const { user, credentials } = UserAuth()
  const router = useRouter() 
  const [showAddUserForm, setShowAddUserForm] = useState(false)

  useEffect(()=>{
    if(user === null ){
      router.push('/sign-in')
    }
  }, [user, router])

  if(user){
    return (
      <section className={styles.component}>
        {
          showAddUserForm?<AddUser />:null
        }
          <section className={styles.header}>
            <p className={styles.logo}>Agri-Ai</p>
          </section>
          <section className={styles.header}>
              <p className={styles.logoText}>Dashboard</p>
              <section className={styles.controls}>
                <button className={styles.addUser} onClick={()=>setShowAddUserForm((prevState)=>!prevState)}>
                  <UserPlus size={17} color='#020817' />
                  <p>Add User</p>
                </button>
                <button className={styles.addSale}>
                  <CirclePlus size={17} color='#ffffff' />
                  <p>Record Sale</p>
                </button>
              </section>
          </section>

          <section className={styles.inventoryOverview}>
            <Package size={17} color='#020817' />
            <p>Inventory Overview</p>
          </section>
          <section className={styles.corusel}>
            <Card cardName="Maize" selectedTab="Maize" currentValue={120} previousValue={110} target={134}>
              <Wheat size={17} color='black' />
            </Card>
            <Card cardName="Beans" selectedTab="Beans" currentValue={231} previousValue={110} target={200}>
              <Bean size={17} color='black' />
            </Card>  
            <Card cardName="Groundnuts" selectedTab="Groundnuts" currentValue={61} previousValue={53} target={100}>
              <Nut  size={17} color='black' />
            </Card>
          </section>
      </section>
    )
  }
}

export default Dashboard