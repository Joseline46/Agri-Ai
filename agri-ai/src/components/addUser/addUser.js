"use client"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"
import { GitCompare, User, Pickaxe, Nut, TreePalm } from "lucide-react"

// Styles
import styles from './addUser.module.css'

// Hooks
import useAddUser from '@/hooks/useAddUser'

const AddUser = ((props) => {
  const { values, errors, isLoading, addUser, changeValues } = useAddUser()
  return (
    <div className={styles.signInContainer}>
      <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.logoText}>Add Farmer</h2>
            <p className={styles.subText}>Create a new farmer account.</p>
          </div>

          <section className={styles.form}>
            <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                  <Input label='Username' errorMessage='Username is required' placeholder='ruemapara@gmail.com' name='username' type='text' value={values.username} error={errors.username} change={changeValues}>
                    <User size={20} color='black' />
                  </Input>
                </div>

                <div className={styles.inputField}>
                  <div className={styles.inputWrapper}>
                    <Input label='Plants' errorMessage='Plants is required' placeholder='Wheat, Maize, Soybeans' name='plants' type='text' value={values.plants} error={errors.plants} change={changeValues}>
                      <Nut size={20} color='black' />
                    </Input>
                  </div>
                </div>

                <div className={styles.inputField}>
                  <div className={styles.inputWrapper}>
                    <Input label='Land Size' errorMessage='Land size is required' placeholder='10ha' name='landsize' type='text' value={values.landsize} error={errors.landsize} change={changeValues}>
                      <Pickaxe size={20} color='black' />
                    </Input>
                  </div>
                </div>

                <div className={styles.inputField}>
                  <div className={styles.inputWrapper}>
                    <Input label='Arable Land Size' errorMessage='Arable Land size is required' placeholder='5ha' name='arable' type='text' value={values.arable} error={errors.arable} change={changeValues}>
                      <TreePalm size={20} color='black' />
                    </Input>
                  </div>
                </div>

                <div className={styles.inputField}>
                  <div className={styles.inputWrapper}>
                    <Input label='Region' errorMessage='Region is required' placeholder='2' name='region' type='text' value={values.region} error={errors.region} change={changeValues}>
                      <GitCompare size={20} color='black' />
                    </Input>
                  </div>
                </div>
            </div>

            <Button click={addUser} disabled={isLoading}>
              {isLoading ? "Adding Farmer..." : "Add Farmer"}
            </Button>
            <button className={styles.cancel} onClick={()=>props.setShowAddUserForm((prevState)=>!prevState)} disabled={isLoading}>
              Cancel
            </button>
          </section>
      </div>
    </div>
  )
})

export default AddUser
