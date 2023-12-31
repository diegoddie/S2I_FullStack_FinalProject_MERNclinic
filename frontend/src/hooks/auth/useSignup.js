import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
    const navigate = useNavigate()
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const signup = async ({ formData }) => {
        try {
            setIsLoading(true);
            setError([]);
            const res = await axios.post('http://localhost:3000/sign-up', formData);

            if(res.status === 201){
                setIsLoading(false)
                navigate('/login')
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
          
            console.error('Error during sign-up:', error);
        }
    };

    return { signup, isLoading, error };
};

