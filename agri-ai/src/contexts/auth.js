"use client"

import { useContext, createContext, useEffect, useState } from 'react'
import { collection, getDoc, setDoc, onSnapshot, updateDoc, doc } from "firebase/firestore"; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '@/firebase'

const AuthContext = createContext()

export const AuthContextProvider = ({children})=> {
    const [user, setUser] = useState(null)
    const [registering, setRegistering] = useState(false)
    const [credentials, setCredentials] = useState(null)
    const [notificationStatus, setNotificationStatus] = useState({
        head: '',
        meta: '',
        show: false, 
        message: '', 
        type: 'success'
    })

    const updateUserPassword = (newPassword)=> {
        const auth = getAuth();

        const user = auth.currentUser;

        updatePassword(user, newPassword).then(() => {
            setNotificationStatus({ 
                head: 'Update Password',
                meta: '',
                type: 'success', 
                message: 'Update Done!', 
                show: true
            })
        }).catch((error) => {
            setNotificationStatus({
                head: 'Update Password',
                meta: 'Failed to update user passsword, Please try again.',
                type: 'fail', 
                message: error.code, 
                show: true
            })
        })
    }

    const forgotPassword = (email)=> {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setNotificationStatus({ 
                head: 'Forgot Password',
                meta: '',
                show: true, 
                type:'success', 
                message: 'The password reset email have been sent.'
            })
        })
        .catch((error) => {
            setNotificationStatus({
                head: 'Forgot Password',
                meta: 'Failed to send the password reset email.', 
                show: true, 
                type: 'fail', 
                message: error.code 
            })
        })
    }

    const accessAccount = (username, password)=> {
        setRegistering(true)
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // user id
            const uid = userCredential.uid
            setRegistering(false)
        }).catch((error) => {
            setNotificationStatus({
                head: 'Access Account',
                meta: '', 
                show: true, 
                type: 'fail', 
                message: error.code })
            setRegistering(false)
        })
    }

    const logout = ()=> {
        signOut(auth)
    }

    useEffect(()=>{
        let subscribe = onAuthStateChanged(auth, (currentUser)=> {
            setUser(currentUser)
        })
        return subscribe
    },[user])

    const getUserCredentials = async (uid)=> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            let { firstname, lastname, position, email, hasAdminPrivileges, attendance, status } = docSnap.data()
            setCredentials({firstname, lastname, position, email, hasAdminPrivileges, attendance, status })
        } else {
          // docSnap.data() will be undefined in this case
        }
    }

    useEffect(()=> {
        const uid = user!==null?user.uid:''
        uid!==''?getUserCredentials(uid):null
    },[user])

    return (
        <AuthContext.Provider value={{user, registering, credentials, updateUserPassword, notificationStatus, setNotificationStatus, accessAccount, forgotPassword, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const UserAuth = ()=> {
    return useContext(AuthContext)
}