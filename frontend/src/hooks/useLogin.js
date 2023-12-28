import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const navigate = useNavigate()
    const [error, setError] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()

    const login = async({formData}) => {
        try{
            setIsLoading(true)
            setError([])

            const res = await axios.post('http://localhost:3000/sign-in', formData, { withCredentials: true });

            if (res.status === 200){
                const json = res.data

                localStorage.setItem('user', JSON.stringify(json))
        
                dispatch({type: 'LOGIN', payload: json})
        
                setIsLoading(false)
                const userId = json.user._id
                navigate(`/profile/${userId}`);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
          
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
          
            console.error('Error during login', error);
        }      
    }

    return { login, isLoading, error }
}