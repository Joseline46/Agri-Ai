// Functions
import regex from "@/functions/regex"

const useValidation = (values, errors, setValues, setErrors, setNotificationStatus) => {
    const changeValues = (event)=> {
        const { name, value } = event.target
        // console.log(value)
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
                setNotificationStatus({
                    head: 'Check Empty Fields',
                    meta: 'All fields are required. Please complete them before submitting.', 
                    show:true, 
                    message:"Kindly complete the highlighted fields.", 
                    type:"fail" 
                })
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
                setNotificationStatus({
                    head: 'Check Errors',
                    meta: 'Please provide accurate and complete data for all records.', 
                    show:true, 
                    message:"To proceed, kindly resolve the errors highlighted in the input fields.", 
                    type:"fail"
                })
            }
        }
        return counter
    }

    return { changeValues, checkEmptyFields, checkErrors }
}
 
export default useValidation