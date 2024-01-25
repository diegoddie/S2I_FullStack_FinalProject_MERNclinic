import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import errorHandler from "../utils/errorHandler";

export const useSignup = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);

    const signup = async ({ formData }) => {
        try {
            setIsLoading(true);
            const res = await axios.post('http://localhost:3000/sign-up', formData);

            if(res.status === 201){
                setIsLoading(false)
                toast.success('Signup successful! Redirecting to login.');
                navigate('/login')
            }            
        } catch (error) {
            console.error('Error during sign-up:', error);
            setIsLoading(false);
            
            errorHandler(error)
        }
    };

    return { signup, isLoading };
};

