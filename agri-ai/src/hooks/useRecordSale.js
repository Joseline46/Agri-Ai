import { useEffect, useState } from 'react'
import { collection, setDoc, onSnapshot, updateDoc, doc, arrayUnion } from "firebase/firestore"
import {db} from '@/firebase'

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

const useRecordSale = (closeRecordSale) => {
    const [isLoading, setIsLoading] = useState(false)
    const [stocks, setStocks] = useState(null)
    const [stockLevel, setStockLevel] = useState(0)
    const [values, setValues] = useState({
        grainType: '',
        consumerType: 'Human',
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

    const [optionsValues, setOptionsValues] = useState({
        grainType: '',
        consumerType: ''
    })

    const listItem = {
        grainType: [
            { name: 'Maize', code: 'Maize' },
            { name: 'Wheat', code: 'Wheat' },
            { name: 'Soybeans', code: 'Soybeans' },
            { name: 'Beans', code: 'Beans' },
        ],
        consumerType: [
            { name: 'Human', code: 'Human' },
            { name: 'Livestock', code: 'Livestock' },
        ]
    }

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
        if(values.grainType!=='' && stocks) {
            let stock = stocks.find((stock)=> stock.name.trim().toLowerCase() === values.grainType.trim().toLowerCase())
            setStockLevel(stock ? stock.amount : 0)
            setValues((prevState)=>{
                return {
                    ...prevState,
                    price: stock ? stock.price : 0,
                }
            })
        }
    }, [values.grainType, stocks])

    useEffect(()=> {
        if(stocks) {
            if(values.grainType !==''){
                let stock = stocks.find((stock)=> stock.name.trim().toLowerCase() === values.grainType.trim().toLowerCase())
                setValues((prevState)=>{
                    return {
                        ...prevState,
                        price: stock ? stock.price : 0,
                    }
                })
            }
        }
    }, [stocks, values.grainType])

    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors, setNotificationStatus)

    // Reset to defaults
    const reset = ()=> {
        setValues({
            grainType: '',
            consumerType: 'Human',
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

                if(stockLevel < parseFloat(values.quantity)) {
                    console.log('Insufficient stock level')
                    return
                }

                setIsLoading(true)

                let mm = new Date().getMonth()+1
                let dd = new Date().getDate()
                let yyyy = new Date().getFullYear()

                let date = `${mm}/${dd}/${yyyy}`
                let salesDocument = {...values, date}
                let salesDocumentId = createRandomString(10)

                setDoc(doc(db, 'sales', salesDocumentId), salesDocument)
                .then(()=>{
                    let newAmount = parseFloat(stockLevel) - parseFloat(values.quantity)
                    updateDoc(doc(db, 'crops', values.grainType), {amount: newAmount})
                    .then(()=> {
                        closeRecordSale()
                        reset()
                        console.log('updated crop amount successfully')
                    }).catch((error)=> {
                        setIsLoading(false)
                    })
                })
                .catch((error)=> {
                    setIsLoading(false)
                })
            }
        }
    }

    return { 
        optionsValues, 
        setOptionsValues, 
        listItem, 
        values, 
        setErrors, 
        setValues, 
        errors, 
        isLoading, 
        recordSale, 
        changeValues }
}
 
export default useRecordSale