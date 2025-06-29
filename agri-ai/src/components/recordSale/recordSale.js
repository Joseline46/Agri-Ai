"use client"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"
import Select from "@/ui/select/select"
import { AudioWaveform, PersonStanding, HandCoins  } from 'lucide-react' 

import { PiGrainsBold } from "react-icons/pi"

// Styles
import styles from './recordSale.module.css'

// Hooks
import useRecordSale from '@/hooks/useRecordSale'

const RecordSale = ((props) => {
  const { 
    optionsValues, 
    setOptionsValues, 
    listItem, 
    values, 
    setErrors, 
    setValues, 
    errors, 
    isLoading, 
    recordSale, 
    changeValues } = useRecordSale(props.closeRecordSale)

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
                  <Select 
                    id='grainType'
                    notification={null} 
                    label='Grain Type' 
                    errorMessage='Grain type is required'
                    placeholder='Grain type' 
                    name='grainType' 
                    type='text' 
                    value={values.grainType} 
                    error={errors.grainType} 
                    change={changeValues}

                    list={listItem.grainType}  
                    values={values} 
                    setValue={setValues} 
                    errors={errors} 
                    setError={setErrors}
                    optionsValues={optionsValues}
                    setOptionsValues={setOptionsValues}>
                    <PiGrainsBold color='#808080' size={17} />
                  </Select>
                </div>
              </div>

              {/* <div className={styles.inputField}>
                <Select 
                  id='consumerType'
                  notification={null} 
                  label='Consumer Type' 
                  errorMessage='Consumer Type is required'
                  placeholder='Livestock/Human' 
                  name='consumerType' 
                  type='text' 
                  value={values.consumerType} 
                  error={errors.consumerType} 
                  change={changeValues}

                  list={listItem.consumerType}  
                  values={values} 
                  setValue={setValues} 
                  errors={errors} 
                  setError={setErrors}
                  optionsValues={optionsValues}
                  setOptionsValues={setOptionsValues}>
                  <PersonStanding color='#808080' size={17} />
                </Select>
              </div> */}

              <div className={styles.inputField}>
                <div className={styles.inputWrapper}>
                  <Input label='Quantity' errorMessage='Quantity is required' placeholder='410' name='quantity' type='text' value={values.quantity} error={errors.quantity} change={changeValues}>
                    <AudioWaveform size={20} color='black' />
                  </Input>
                </div>
              </div>

              <div className={styles.inputField}>
                <div className={styles.inputWrapper}>
                  <Input label='Price' errorMessage='Price is required' disabled placeholder='25' name='price' type='text' value={values.price} error={errors.price} change={changeValues}>
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
