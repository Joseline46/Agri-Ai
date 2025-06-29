import { useState, useEffect } from "react"

import { toast } from "sonner"

import { doc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { db } from '@/firebase'

const useFarmer = (farmerId) => {
    const [farmersDeliveries, setFarmersDeliveries] = useState([])
    const [farmerCredentials, setFarmerCredentials] = useState(null)

    // Fetch Tank-Swaps Orders
    useEffect(() => {
        if(farmerCredentials){
            const q = query(collection(db, "restocks"), where("username", "==", farmerCredentials.username))
            let records = []
            getDocs(q).then((querySnapshot)=> {
                querySnapshot.forEach((doc) => {
                  records.push(doc.data())
                })
                console.log('records', records)
                setFarmersDeliveries(records)
            }).catch((error)=> {
                toast.error(error.message)
            })
        }
    }, [farmerCredentials])


      // Fetch Tank-Swaps Orders
    // useEffect(() => {
    //     if(farmerCredentials){
    //         const q = collection(db, "restocks")
    //         let records = []
    //         getDocs(q).then((querySnapshot)=> {
    //             querySnapshot.forEach((doc) => {
    //               records.push(doc.data())
    //             })
    //             let filtered = records.filter(r => r.username === farmerCredentials.username)
    //             console.log('records', filtered)
    //             setFarmersDeliveries(filtered)
    //         }).catch((error)=> {
    //             toast.error(error.message)
    //         })
    //     }
    // }, [farmerCredentials])

    useEffect(()=> {
      if(farmerId){
        const docRef = doc(db, "farmers", `${farmerId}`);
        getDoc(docRef).then((docSnap)=> {
            let customerData = docSnap.data()
            setFarmerCredentials(customerData)
        }).catch((error)=> {
          toast.error(error.message)
        })
      }
    }, [farmerId])

    return { farmerCredentials, farmersDeliveries }
}

export default useFarmer