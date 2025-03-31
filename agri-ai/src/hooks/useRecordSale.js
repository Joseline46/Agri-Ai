import { useState } from 'react'

// Context
import { collection, deleteDoc, setDoc, onSnapshot, updateDoc, doc, arrayUnion } from "firebase/firestore"
import {  db } from '@/firebase'

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

const useRecordSale = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        grainType: '',
        consumerType: '',
        quantity: '',
        price: '',
    })
    const [errors, setErrors] = useState({
        grainType: false,
        consumerType: false,
        quantity: false,
        price: false,
    })
    const [notificationStatus, setNotificationStatus] = useState({
        show: false,
        message:'',
        type:'success'
    })
    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors, setNotificationStatus)

    // Reset to defaults
    const reset = ()=> {
        setValues({
            grainType: '',
            consumerType: '',
            quantity: '',
            price: '',
        })
        setErrors({
            grainType: false,
            consumerType: false,
            quantity: false,
            price: false,
        })
        setNotificationStatus({
            show: false,
            message:'',
            type:'success'
        })
        setIsLoading(false)
    }

    const recordSale = async ()=> {
        const numberOfErrors = checkErrors()
        if(numberOfErrors <= 0) {
            const numberOfFieldsErrors = checkEmptyFields()
            if(numberOfFieldsErrors <= 0) {
                setIsLoading(true)

                let mm = new Date().getMonth()+1
                let dd = new Date().getDate()
                let yyyy = new Date().getFullYear()

                let date = `${mm}/${dd}/${yyyy}`
                let salesDocument = {...values, date}
                let salesDocumentId = createRandomString(10)

                setDoc(doc(db, 'sales', salesDocumentId), salesDocument)
                .then(()=>{
                    setIsLoading(false)
                })
                .catch((error)=> {
                    setIsLoading(false)
                })
            }
        }
    }
    return { values, setValues, errors, isLoading, recordSale, changeValues }
}
 
export default useRecordSale