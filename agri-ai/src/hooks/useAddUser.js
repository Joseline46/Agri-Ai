import { useState } from 'react'

// Context
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '@/firebase'

// Hooks
import useValidation from './useValidation'

const useAddUser = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        username: '',
        role: '',
    })
    const [errors, setErrors] = useState({
        username: false,
        role: false,
    })
    const [dateFilterValues, setDateFilterValues] = useState({ date: '' })

    const [notificationStatus, setNotificationStatus] = useState({
        show: false,
        message:'',
        type:'success'
    })
    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors, setNotificationStatus)

    // Reset to defaults
    const reset = ()=> {
        setValues({
            username: '',
            role: '',
        })
        setErrors({
            username: false,
            role: false,
        })
        setNotificationStatus({
            show: false,
            message:'',
            type:'success'
        })
        setIsLoading(false)
    }

    const addUser = async ()=> {
        const numberOfErrors = checkErrors()
        if(numberOfErrors <= 0) {
            const numberOfFieldsErrors = checkEmptyFields()
            if(numberOfFieldsErrors <= 0) {
                setIsLoading(true)
                
                setIsLoading(false)
            }
        }
    }

    return { values, errors, isLoading, addUser, changeValues }
}
 
export default useAddUser