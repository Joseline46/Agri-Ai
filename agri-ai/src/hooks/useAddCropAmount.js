import { useState, useEffect } from 'react'

// Context
import { collection, setDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from '@/firebase'

import { toast } from "sonner"

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

const useAddCropAmount = (cropData, closeModal) => {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        amount: '',
        grainType: '',
        username: ''
    })
    const [errors, setErrors] = useState({
        amount: false,
        grainType: false,
        username: false
    })
    const [stocks, setStocks] = useState(null)
    const [price, setPrice] = useState(0)

    const [optionsValues, setOptionsValues] = useState({
        username: ''
    })

    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors)

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

    // Fetch crops stocks data in real time
    useEffect(() => {
        const cropsDocsRef = collection(db, "crops")
    
        const unsubscribeProperty = onSnapshot(cropsDocsRef, (querySnapshot) => {
            let records = []
            querySnapshot.forEach((doc) => {
                records.push(doc.data())
            })
            setStocks(records)
        })
    }, [])

    // Fetch price of stocks data
    useEffect(() => {
        if(cropData && stocks) {
            let stock = stocks.find((stock)=> stock.name.trim().toLowerCase() === cropData.name.trim().toLowerCase())
            setPrice(stock ? stock.price : 0)
        }
    }, [cropData, stocks])

    // Reset to defaults
    const reset = ()=> {
        setValues({
            amount: '',
            grainType: '',
            username: ''
        })
        setErrors({
            amount: false,
            grainType: false,
            username: false
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

                let date = new Date()
                let dateString = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`

                updateDoc(doc(db, 'crops', cropData.name), {amount: newAmount})
                .then(()=>{
                    let documentId = createRandomString(10)

                    let restockData = {
                        name: cropData.name,
                        amount: parseFloat(values.amount),
                        date: dateString,
                        price: price,
                        username: values.username,
                    }

                    setDoc(doc(db, 'restocks', documentId), restockData)
                    .then(()=>{
                        setIsLoading(false)
                        reset()
                        closeModal()
                        toast.message(`${cropData.name} added successfully`)
                    })
                    .catch((error)=> {
                        toast.message(error)
                        setIsLoading(false)
                    })
                }).catch((error)=> {
                    toast.message(error)
                    setIsLoading(false)
                })
            }
        }
    }

    return { 
        optionsValues, 
        values, 
        errors, 
        isLoading, 
        setOptionsValues, 
        updateCropAmount, 
        changeValues,
        setValues,
        setErrors
    }
}
 
export default useAddCropAmount