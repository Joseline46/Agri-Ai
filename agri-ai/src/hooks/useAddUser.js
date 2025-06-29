import { useState } from 'react'

// Context
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from '@/firebase'

// Hooks
import useValidation from './useValidation'

import { toast } from "sonner"

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

const useAddUser = (closeModal) => {
    const { signout } = UserAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        username: '',
        firstname: '',
        address: '',
        lastname: '',
        plants: '',
        landsize: '',
        arable: '',
        region: '',
    })
    const [errors, setErrors] = useState({
        username: false,
        firstname: false,
        lastname: false,
        plants: false,
        landsize: false,
        arable: false,
        region: false,
    })

    const { changeValues, checkEmptyFields, checkErrors } = useValidation(values, errors, setValues, setErrors)

    // Reset to defaults
    const reset = ()=> {
        setValues({
            username: '',
            plants: '',
            landsize: '',
            arable: '',
            region: '',
            firstname: '',
            lastname: '',
            address: '',
        })
        setErrors({
            username: false,
            plants: false,
            landsize: false,
            arable: false,
            region: false,
            firstname: false,
            lastname: false,
            address: false,
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

                    setDoc(doc(db, 'farmers', usersDocumentId), {...usersDocument, id:user.uid})
                    .then(()=>{
                        signout()
                        setIsLoading(false)
                        closeModal()
                        reset()
                        toast.message('New farmer added successfully')
                    })
                    .catch((error)=> {
                        toast.message(error)
                        setIsLoading(false)
                    })
                })
                .catch((error) => {
                    toast.message(error)
                    setIsLoading(false)
                });
            }
        }
    }

    return { values, errors, isLoading, addUser, changeValues }
}
 
export default useAddUser