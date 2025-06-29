// Functions
import regex from "@/functions/regex"

import { toast } from "sonner"

const useValidation = (values, errors, setValues, setErrors, setNotificationStatus) => {
    const changeValues = (event)=> {
        const { name, value } = event.target
        regex[`${name}`].test(value)? validateValues(true, event) : validateValues(false, event)
    }

    const validateValues = (validator, event)=> {
        const { name, value } = event.target
        setValues({ ...values, [name]: value })
        validator?setErrors({...errors, [name]:false}): setErrors({...errors, [name]:true})
    }

    // Re-use
    const checkEmptyFields = ()=> {
        let counter = 0
        const errors = {}
        for(const value in values) {
            if((values[value]==="") || (values[value].length===0) || (values[value]===null)) {
                counter++
                errors[`${value}`] = true
                toast.message("Complete the highlighted fields.")
            }
        }
        setErrors(errors)
        return counter
    }

    // Re-use
    const checkErrors = ()=>{
        let counter = 0
        for(const error in errors) {
            if(errors[error]===true) {
                counter++
                toast.message("Resolve the highlighted errors")
            }
        }
        return counter
    }

    return { changeValues, checkEmptyFields, checkErrors }
}
 
export default useValidation