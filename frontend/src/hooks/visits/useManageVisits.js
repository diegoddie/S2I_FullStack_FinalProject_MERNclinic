import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import errorHandler from "../utils/errorHandler";
import { useAuthContext } from "../auth/useAuthContext";

export const useManageVisits = () => {
    const navigate = useNavigate()
    const { token, dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const getAllVisits = async()=>{
        try{
            setIsLoading(true)
            const res = await axios.get('http://localhost:3000/visit', {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if(res.status === 200){
                setIsLoading(false)
                const visits = res.data;
                return visits
            }
        }catch(error){
            console.error('Error getting visits:', error);

            if (error.response && error.response.status === 401) {
                console.log('Token expired. Logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                
                toast.warning('Session expired. Please log in again.');
            } else {
                errorHandler(error);
            }
            setIsLoading(false)
        }
    }

    const getNotPayedVisits = async()=>{
        try{
            setIsLoading(true)
            const res = await axios.get('http://localhost:3000/visit/pending-payments', {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if(res.status === 200){
                setIsLoading(false)
                const visits = res.data;
                return visits
            }
        }catch(error){
            console.error('Error getting not payed visits:', error);

            if (error.response && error.response.status === 401) {
                console.log('Token expired. Logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                
                toast.warning('Session expired. Please log in again.');
            } else {
                errorHandler(error);
            }
            setIsLoading(false)
        }
    }

    const getVisitsById = async (model, id) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:3000/visit/${model}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
            
            if(res.status === 200){
                setIsLoading(false)
                const visits = res.data;
                return visits
            }
        } catch (error) {
            console.error('Error getting visits:', error);

            if (error.response && error.response.status === 401) {
                console.log('Token expired. Logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                
                toast.warning('Session expired. Please log in again.');
            } else {
                errorHandler(error);
            }
            setIsLoading(false)
        }
    }

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

    const updateVisit = async ({ id, formData }) => {
        try{
            setIsLoading(true)

            const res = await axios.put(`http://localhost:3000/visit/update/${id}`, formData, {withCredentials: true})

            if(res.status === 201){
                setIsLoading(false)
                toast.success('Visit data updated succesfully.')
            }
        } catch (error) {
            console.error('Error updating visit data:', error);

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

    const deleteVisit = async (id) => {
        try{
            setIsLoading(true)
            const res = await axios.delete(`http://localhost:3000/visit/delete/${id}`, { withCredentials: true })

            if(res.status === 200){
                setIsLoading(false)
                
                toast.success("Visit cancelled. You'll receive a confirmation e-mail.")
            }
        }catch(error){
            console.error('Error deleting the visit:', error);

            if (error.response && error.response.status === 401) {
                console.log('Token expired. Logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                
                toast.warning('Session expired. Please log in again.');
            } else {
                errorHandler(error);
            }

            setIsLoading(false)
        }
    }

    return { getVisitsById, getAllVisits, getNotPayedVisits, bookVisit, updateVisit, deleteVisit, isLoading };
};

