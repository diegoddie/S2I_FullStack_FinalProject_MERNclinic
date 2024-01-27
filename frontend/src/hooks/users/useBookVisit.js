import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import errorHandler from "../utils/errorHandler";
import { useAuthContext } from "../auth/useAuthContext";

export const useBookVisit = () => {
    const navigate = useNavigate()
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const bookVisit = async ({ user, doctor, date }) => {
        try {
            setIsLoading(true);
            const res = await axios.post('http://localhost:3000/visit/create', { user, doctor, date }, { withCredentials: true })

            if(res.status === 201){
                setIsLoading(false)
                navigate(`/profile/${user}`);
                toast.success("Visit booked, you'll receive a mail");
            }            
        } catch (error) {
            console.error('Error booking the visit', error);
            setIsLoading(false);
            
            errorHandler(error)
        }
    };

    return { bookVisit, isLoading };
};

