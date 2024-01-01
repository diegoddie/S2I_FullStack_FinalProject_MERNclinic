import axios from "axios";
import { useAuthContext } from "./useAuthContext"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useLogout = () => {
    const navigate = useNavigate()
    const [error, setError] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const logout = async() => {
        try{
            setIsLoading(true)
            setError([])

            const res = await axios.get('http://localhost:3000/sign-out', { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                dispatch({type: 'LOGOUT'})
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                navigate('/');
            }
        }catch(error){
            setIsLoading(false);
            console.error('Error during logout:', error);
        }
    }
    return { logout, isLoading, error }
}