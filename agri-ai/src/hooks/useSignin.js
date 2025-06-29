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

    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors)

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
        setIsLoading(false)
    }

    const signIn = async ()=> {
        const numberOfErrors = checkErrors()
        if(numberOfErrors <= 0) {
            const numberOfFieldsErrors = checkEmptyFields()
            if(numberOfFieldsErrors <= 0) {
                setIsLoading(true)
                const accessAccount = (username, password)=> {
                    signInWithEmailAndPassword(auth, username, password)
                    .then(() => {
                        reset()
                        router.push('/dashboard')
                    }).catch((error) => {
                        setIsLoading(false)
                    })
                }
                accessAccount(values.username, values.password)
            }
        }
    }

    return { 
        values, 
        errors, 
        isLoading, 
        signIn, 
        changeValues }
}
 
export default useSignin