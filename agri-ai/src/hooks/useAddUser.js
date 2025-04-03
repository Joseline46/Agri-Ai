import { useState } from 'react'

// Context
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '@/firebase'

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

const useAddUser = () => {
    const { signout } = UserAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        username: '',
        plants: '',
        landsize: '',
        arable: '',
        region: '',
    })
    const [errors, setErrors] = useState({
        username: false,
        plants: false,
        landsize: false,
        arable: false,
        region: false,
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
            plants: '',
            landsize: '',
            arable: '',
            region: '',
        })
        setErrors({
            username: false,
            plants: false,
            landsize: false,
            arable: false,
            region: false,
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

                let mm = new Date().getMonth()+1
                let dd = new Date().getDate()
                let yyyy = new Date().getFullYear()

                let date = `${mm}/${dd}/${yyyy}`
                let usersDocument = {...values, date}
                let usersDocumentId = createRandomString(10)

                const auth = getAuth();
                createUserWithEmailAndPassword(auth, values.username, values.username)
                .then((userCredential) => {
                    const user = userCredential.user;

                    console.log('user', user)
                    console.log('user.uid', user.uid)

                    setDoc(doc(db, 'farmers', usersDocumentId), {...usersDocument, id:user.uid})
                    .then(()=>{
                        signout()
                        setIsLoading(false)
                    })
                    .catch((error)=> {
                        console.log('error-1', error)
                        setIsLoading(false)
                    })
                })
                .catch((error) => {
                    console.log('error-2', error)
                    setIsLoading(false)
                });
            }
        }
    }

    return { values, errors, isLoading, addUser, changeValues }
}
 
export default useAddUser