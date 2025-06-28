"use client"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"

// Assets
import { Package } from "lucide-react"
import { PiGrainsBold } from "react-icons/pi"

// Styles
import styles from './addCropAmount.module.css'

// Hooks
import useAddCropAmount from '@/hooks/useAddCropAmount'

const AddCropAmount = ((props) => {
  const { values, errors, isLoading, updateCropAmount, changeValues } = useAddCropAmount(props.cropData)
  return (
    <div className={styles.signInContainer}>
      <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.logoText}>Add Crop Amount</h2>
            <p className={styles.subText}>Update stock amount for this crop.</p>
          </div>

          <section className={styles.form}>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <Input label='Grain Type' errorMessage='Grain type is required' placeholder='Maize' name='grainType' type='text' value={values.grainType} error={errors.grainType} change={changeValues}>
                    <PiGrainsBold size={20} color='black' />
                  </Input>
                </div>
                <div className={styles.inputField}>
                  <div className={styles.inputWrapper}>
                    <Input label='Amount' errorMessage='Amount is required' placeholder='10' name='amount' type='text' value={values.amount} error={errors.amount} change={changeValues}>
                      <Package size={20} color='black' />
                    </Input>
                  </div>
                </div>
            </div>

            <Button click={updateCropAmount} disabled={isLoading}>
              {isLoading ? "Adding amount..." : "Add Amount"}
            </Button>
            <button className={styles.cancel} onClick={()=>props.closeUpdateCropAmount()} disabled={isLoading}>
              Cancel
            </button>
          </section>
      </div>
    </div>
  )
})

export default AddCropAmount
