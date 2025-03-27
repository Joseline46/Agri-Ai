import { useState } from 'react'

// Hooks
import useValidation from './useValidation'

const useSignin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [values, setValues] = useState({
        username: '',
    })
    const [errors, setErrors] = useState({
        username: false,
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
        })
        setErrors({
            username: false,
        })
        setNotificationStatus({
            show: false,
            message:'',
            type:'success'
        })
        setIsLoading(false)
    }

    const recoverPassword = async ()=> {
        const numberOfErrors = checkErrors()
        if(numberOfErrors <= 0) {
            const numberOfFieldsErrors = checkEmptyFields()
            if(numberOfFieldsErrors <= 0) {
                setIsLoading(true)
            }
        }
    }

    return { values, errors, isLoading, isSubmitted, setIsSubmitted, recoverPassword, changeValues }
}
 
export default useSignin