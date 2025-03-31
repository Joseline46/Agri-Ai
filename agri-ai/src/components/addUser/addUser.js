"use client"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"
import { Lock, User } from "lucide-react"

// Styles
import styles from './addUser.module.css'

// Hooks
import useAddUser from '@/hooks/useAddUser'

const AddUser = ((props) => {
  const { values, errors, isLoading, addUser, changeValues } = useAddUser()
  return (
    <div className={styles.signInContainer} onClick={()=>props.setShowAddUserForm((prevState)=>!prevState)}>
      <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.logoText} onClick={()=>props.setShowAddUserForm((prevState)=>!prevState)}>Add User</h2>
            <p className={styles.subText}>Create a new user account with role permissions.</p>
          </div>

          <section className={styles.form}>
            <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                  <Input label='Username' errorMessage='Username is required' placeholder='ruemapara@gmail.com' name='username' type='text' value={values.username} error={errors.username} change={changeValues}>
                  </Input>
                </div>

                <div className={styles.inputField}>
                    <div className={styles.inputWrapper}>
                      <Input label='Role' errorMessage='Role is required' placeholder='manager' name='role' type='text' value={values.role} error={errors.role} change={changeValues}>
                      </Input>
                    </div>
                </div>
            </div>

            <Button click={addUser} disabled={isLoading}>
              {isLoading ? "Creating User..." : "Create User"}
            </Button>
          </section>
      </div>
    </div>
  )
})

export default AddUser
