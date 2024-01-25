import { useState } from "react";
import axios from "axios";
import errorHandler from "../utils/errorHandler";
import { toast } from 'react-toastify';

export const useCreateDoctor = () => {
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(false);
          
            errorHandler(error)
        }
    };

    return { createDoctor, isLoading };
};

