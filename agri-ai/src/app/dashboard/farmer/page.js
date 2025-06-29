"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from "next/navigation"

// Styles
import styles from '@/styles/farmer.module.css';

// Components
import BarChart from '@/components/barchart/barchart'
import { Card } from '@/app/dashboard/page'
import { Skeleton } from "@/components/ui/skeleton"

// Assets
import { Settings2, ArrowLeft, Bean, Wheat } from 'lucide-react' 
import { GiPeas  } from "react-icons/gi"

import { PiGrainsBold } from "react-icons/pi"

// Hooks
import useFarmer from '@/hooks/getFarmerData'

const Farmer = () => {
  const searchParams = useSearchParams()

  const [farmerId, setFarmerId] = useState('')
  const [lineChartData, setLineChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  const { farmerCredentials, farmersDeliveries } = useFarmer(farmerId)

  useEffect(() => {
    const id = searchParams.get("id")
    setFarmerId(id)
  }, [searchParams])

  const goToOrdersDashboard = () => {
    window.location.href = `/dashboard/`
  }

  return (
    <>
     <section className={styles.page}>
        {/* Header */}
        <section className={styles.headerOne}>
          <section className={styles.titleAndArrow} onClick={()=>goToOrdersDashboard()}>
            <section className={styles.arrowBackCircle}>
              <ArrowLeft className={styles.arrowBack} size={20} color='black' />
            </section>
            <p className={styles.headerText}>Farmer Account</p>
          </section>
          <section className={styles.controls}>
            <section className={styles.circle}>
              <Settings2 size={17} color='black' />
            </section>
          </section>
        </section>

        <section className={styles.headerTwo}>
          { farmerCredentials?<section className={styles.skeletonCover}><p className={styles.headerText}>{`${farmerCredentials.firstname} / ${farmerCredentials.lastname}`}</p></section>:<section className={styles.skeletonCover}><Skeleton className="h-4 w-[120px] bg-gray-200" /></section> }
        </section>

        <section className={styles.content}>
          <section className={styles.corusel}>
            <Card cardName="Maize" currentValue={0} displayValue={0} previousValue={0} target={0}>
                <PiGrainsBold size={20} color='#0058FF' />
              </Card>
              <Card cardName="Beans" currentValue={0} displayValue={0} previousValue={0} target={0}>
                <Bean size={17} color='#4B10BF' />
              </Card>  
              <Card cardName="Wheat" currentValue={0} displayValue={0} previousValue={0} target={0}>
                <Wheat  size={20} color='#FFC700' />
              </Card>
               <Card cardName="Soybeans" currentValue={0} displayValue={0} previousValue={0} target={0}>
                <GiPeas  size={20} color='#EB17A4' />
              </Card>
          </section>

          {/* Charts */}
          <section className={styles.row}>
            {/* <BarChart barChartData={barChartData} /> */}
            {/* <Line lineChartData={lineChartData} /> */}
          </section>

          {/* Deliveries Activity */}
          <section className={styles.group}>
            <p className={styles.headerText}>Deliveries Activity</p>
          </section>
        </section>
      </section>
    </>
)}

export default Farmer