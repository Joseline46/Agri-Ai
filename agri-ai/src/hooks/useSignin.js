import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Context
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '@/firebase'

// Hooks
import useValidation from './useValidation'

const useSignin = () => {
  const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        username: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        username: false,
        password: false,
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
            password: '',
        })
        setErrors({
            username: false,
            password: false,
        })
        setNotificationStatus({
            show: false,
            message:'',
            type:'success'
        })
        setIsLoading(false)
    }

    const signIn = async ()=> {
        console.log('clckeed')

        const numberOfErrors = checkErrors()
        if(numberOfErrors <= 0) {
            const numberOfFieldsErrors = checkEmptyFields()
            if(numberOfFieldsErrors <= 0) {
                console.log('in here')
                setIsLoading(true)
                const accessAccount = (username, password)=> {
                        setIsLoading(true)
                        signInWithEmailAndPassword(auth, username, password)
                        .then((userCredential) => {
                            // user id
                            const uid = userCredential.uid
                            router.push('/dashboard')
                            setIsLoading(false)
                        }).catch((error) => {
                            setNotificationStatus({
                                head: 'Access Account',
                                meta: '', 
                                show: true, 
                                type: 'fail', 
                                message: error.code })
                            setIsLoading(false)
                        })
                    }
                accessAccount(values.username, values.password)
                setIsLoading(false)
            }
        }
    }

    return { values, errors, isLoading, signIn, changeValues }
}
 
export default useSignin