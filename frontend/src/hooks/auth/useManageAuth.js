import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import errorHandler from "../utils/errorHandler";

export const useManageAuth = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async({ formData, model }) => {
        try{
            setIsLoading(true)

            const res = await axios.post(`http://localhost:3000/${model}/sign-in`, formData, { withCredentials: true });
            const { codeRequested, ...json } = res.data;

            if (res.status === 200 && !codeRequested){
                dispatch({
                    type: 'LOGIN', 
                    payload: {
                        user: json.user,
                        token: {
                            token: json.token,
                            expiration: json.expiration
                        }
                    },
                })

                localStorage.setItem('user', JSON.stringify(json.user));
                localStorage.setItem('token', JSON.stringify({ token: json.token, expiration: json.expiration }));
                
                setIsLoading(false)

                const userId = json.user._id;
                const profilePath = model === 'user' ? 'profile' : 'doctor/profile';
                navigate(`/${profilePath}/${userId}`);
                toast.success(`Welcome back, ${json.user.firstName}!`);

                return json
            }else if(codeRequested){
                setIsLoading(false)
                return { requiresTwoFactor: true };
            }
        } catch (error) {
            console.error('Error during login', error);
            setIsLoading(false);
          
            errorHandler(error)
        }      
    }

    const logout = async() => {
        try {
            setIsLoading(true)

            const res = await axios.get('http://localhost:3000/sign-out', { withCredentials: true });

            if (res.status === 200) {
                setIsLoading(false)
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                dispatch({ type: 'LOGOUT' })
                navigate('/');
                toast.success('Logout successful!');
            }
        } catch (error) {
            console.error('Error during logout:', error);

            if (error.response && error.response.status === 401) {
                console.log('Token expired. Logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                
                toast.warning('Session expired. Please log in again.');
            } else {
                errorHandler(error);
            }

            setIsLoading(false);
        }
    }

    return { login, logout, isLoading }
}