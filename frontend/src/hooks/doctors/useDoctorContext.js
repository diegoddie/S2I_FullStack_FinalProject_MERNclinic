import { useContext } from "react"
import { DoctorContext } from "../../context/DoctorContext"

export const useDoctorContext = () => {
    const context = useContext(DoctorContext)

    if(!context){
        throw Error('useDoctorContext must be used inside DoctorContextProvider')
    }

    return context
}