"use client"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"
import { Lock, User } from "lucide-react"

// Styles
import styles from './recordSale.module.css'

// Hooks
import useRecordSale from '@/hooks/useRecordSale'

const RecordSale = ((props) => {
  const { values, setValues, errors, isLoading, recordSale, changeValues } = useRecordSale()
  return (
    <div className={styles.signInContainer} onClick={()=>props.setShowAddUserForm((prevState)=>!prevState)}>
      <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.logoText} onClick={()=>props.setShowAddUserForm((prevState)=>!prevState)}>Record Sale</h2>
            <p className={styles.subText}>Add a new sales record to the system.</p>
          </div>

          <section className={styles.form}>
            <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                  <Input label='Consumer Type' errorMessage='Consumer type is required' placeholder='Livestock/Human' name='consumerType' type='text' value={values.consumerType} error={errors.consumerType} change={changeValues}>
                  </Input>
                </div>

                <div className={styles.inputField}>
                    <div className={styles.inputWrapper}>
                      <Input label='Quantity' errorMessage='Quantity is required' placeholder='410' name='quantity' type='text' value={values.quantity} error={errors.quantity} change={changeValues}>
                      </Input>
                    </div>
                </div>
            </div>

            <Button click={recordSale} disabled={isLoading}>
              {isLoading ? "Recording Sale..." : "Record Sale"}
            </Button>
          </section>
      </div>
    </div>
  )
})

export default RecordSale
