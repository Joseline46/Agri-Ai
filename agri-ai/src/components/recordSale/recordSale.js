"use client"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"

import { AudioWaveform, PersonStanding, HandCoins, Torus  } from 'lucide-react' 

import { PiGrainsBold } from "react-icons/pi"
import { GiPeas } from "react-icons/gi"

// Styles
import styles from './recordSale.module.css'

// Hooks
import useRecordSale from '@/hooks/useRecordSale'

const RecordSale = ((props) => {
  const { values, setValues, errors, isLoading, recordSale, changeValues } = useRecordSale()
  return (
    <div className={styles.signInContainer}>
      <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.logoText}>Record Sale</h2>
            <p className={styles.subText}>Add a new sales record to the system.</p>
          </div>

          <section className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputField}>
                <div className={styles.inputWrapper}>
                  <Input label='Grain Type' errorMessage='Grain type is required' placeholder='Maize' name='grainType' type='text' value={values.grainType} error={errors.grainType} change={changeValues}>
                    <PiGrainsBold size={20} color='black' />
                  </Input>
                </div>
              </div>

              <div className={styles.inputField}>
                <Input label='Consumer Type' errorMessage='Consumer type is required' placeholder='Livestock/Human' name='consumerType' type='text' value={values.consumerType} error={errors.consumerType} change={changeValues}>
                  <PersonStanding size={20} color='black' />
                </Input>
              </div>

              <div className={styles.inputField}>
                <div className={styles.inputWrapper}>
                  <Input label='Quantity' errorMessage='Quantity is required' placeholder='410' name='quantity' type='text' value={values.quantity} error={errors.quantity} change={changeValues}>
                    <AudioWaveform size={20} color='black' />
                  </Input>
                </div>
              </div>

              <div className={styles.inputField}>
                <div className={styles.inputWrapper}>
                  <Input label='Price' errorMessage='Price is required' placeholder='25' name='price' type='text' value={values.price} error={errors.price} change={changeValues}>
                    <HandCoins size={20} color='black' />
                  </Input>
                </div>
              </div>
            </div>

            <Button click={recordSale} disabled={isLoading}>
              {isLoading ? "Recording Sale..." : "Record Sale"}
            </Button>

            <button className={styles.cancel} onClick={()=>props.setShowRecordSale((prevState)=>!prevState)} disabled={isLoading}>
              Cancel
            </button>
          </section>
      </div>
    </div>
  )
})

export default RecordSale
