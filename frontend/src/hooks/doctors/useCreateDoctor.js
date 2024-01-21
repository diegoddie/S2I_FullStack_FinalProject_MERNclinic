import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useCreateDoctor = () => {
    const navigate = useNavigate()
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const createDoctor = async ({ formData }) => {
        try {
            setIsLoading(true);
            setError([]);
            const res = await axios.post('http://localhost:3000/doctor/create', formData, { withCredentials: true });

            if(res.status === 201){
                window.location.reload();
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
          
            console.error('Error adding a doctor:', error);
        }
    };

    return { createDoctor, isLoading, error };
};

