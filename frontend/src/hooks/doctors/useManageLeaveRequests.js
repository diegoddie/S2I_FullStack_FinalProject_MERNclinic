import axios from "axios";
import { useState } from "react";
import errorHandler from "../utils/errorHandler";
import { toast } from 'react-toastify';
import { useAuthContext } from "../auth/useAuthContext";

export const useManageLeaveRequests = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch, token } = useAuthContext();

    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.myclinic.tech';

    const approveLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);

            const res = await axios.put(`${baseURL}/doctor/${doctorId}/approve/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                toast.success('Request approved succesfully.')
            }
        }catch(error){
            console.error('Error approving leave request:', error);

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

    const declineLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);

            const res = await axios.put(`${baseURL}/doctor/${doctorId}/decline/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                toast.success('Request declined succesfully.')
            }
        }catch(error){
            console.error('Error declining leave request:', error);
            setIsLoading(false)

            errorHandler(error)
        }
    }

    const deleteLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);

            const res = await axios.delete(`${baseURL}/doctor/${doctorId}/leave-requests/${leaveRequestId}`, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                const updatedUser = res.data.user;
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                toast.success('Request deleted succesfully.')
            }
        }catch(error){
            console.error('Error deleting leave request:', error);
            setIsLoading(false)

            errorHandler(error)
        }
    }

    return { approveLeaveRequest, declineLeaveRequest, deleteLeaveRequest, isLoading };
}