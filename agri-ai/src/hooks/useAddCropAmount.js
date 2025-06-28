import { useState, useEffect } from 'react'

// Context
import { updateDoc, doc } from "firebase/firestore";
import { db } from '@/firebase'

// Hooks
import useValidation from './useValidation'

export const createRandomString = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Context
import { UserAuth } from '@/contexts/auth'

const useAddCropAmount = (cropData, closeModal) => {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        amount: '',
        grainType: ''
    })
    const [errors, setErrors] = useState({
        amount: false,
        grainType: false
    })
    const [notificationStatus, setNotificationStatus] = useState({
        show: false,
        message:'',
        type:'success'
    })
    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors, setNotificationStatus)

    useEffect(()=>{
        if(cropData){
            setValues((prevState)=> {
                return {
                    ...prevState,
                    grainType: cropData.name 
                }
            })
        }
    }, [cropData])

    // Reset to defaults
    const reset = ()=> {
        setValues({
            amount: '',
            grainType: ''
        })
        setErrors({
            amount: false,
            grainType: false
        })
        setIsLoading(false)
    }

     const updateCropAmount = async ()=> {
        const numberOfErrors = checkErrors()
        if(numberOfErrors <= 0) {
            const numberOfFieldsErrors = checkEmptyFields()
            if(numberOfFieldsErrors <= 0) {
                setIsLoading(true)
                let newAmount = parseFloat(cropData.amount) + parseFloat(values.amount)
                console.log('newAmount', newAmount)
                console.log(' parseFloat(cropData.amount)',  parseFloat(cropData.amount))
                console.log('parseFloat(values.amount)',  parseFloat(values.amount))

                updateDoc(doc(db, 'crops', cropData.name), {amount: newAmount})
                .then(()=>{
                    setIsLoading(false)
                    reset()
                    closeModal()
                    console.log('updated crop amount successfully')
                }).catch((error)=> {
                    setIsLoading(false)
                })
            }
        }
    }

    return { values, errors, isLoading, updateCropAmount, changeValues }
}
 
export default useAddCropAmount