import axios from "axios";
import { useState } from "react";
import errorHandler from "../utils/errorHandler";
import { toast } from 'react-toastify';

export const useManageLeaveRequests = () => {
    const [isLoading, setIsLoading] = useState(false);

    const approveLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);

            const res = await axios.put(`http://localhost:3000/doctor/${doctorId}/approve/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                toast.success('Request approved succesfully.')
                window.location.reload()
            }
        }catch(error){
            console.error('Error approving leave request:', error);
            setIsLoading(false)

            errorHandler(error)
        }
    }

    const declineLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);

            const res = await axios.put(`http://localhost:3000/doctor/${doctorId}/decline/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                toast.success('Request declined succesfully.')
                window.location.reload()
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

            const res = await axios.delete(`http://localhost:3000/doctor/${doctorId}/leave-requests/${leaveRequestId}`, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                window.location.reload()
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