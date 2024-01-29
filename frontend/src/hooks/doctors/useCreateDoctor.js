import { useState } from "react";
import axios from "axios";
import errorHandler from "../utils/errorHandler";
import { toast } from 'react-toastify';
import { useAuthContext } from "../auth/useAuthContext";

export const useCreateDoctor = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const createDoctor = async ({ formData }) => {
        try {
            setIsLoading(true);

            const res = await axios.post('http://localhost:3000/doctor/create', formData, { withCredentials: true });

            if(res.status === 201){
                setIsLoading(false)
                window.location.reload()
                toast.success('Doctor created succesfully.')
            }            
        } catch (error) {
            console.error('Error adding a doctor:', error);

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
    };

    return { createDoctor, isLoading };
};

