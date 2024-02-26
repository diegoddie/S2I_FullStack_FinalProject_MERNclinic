import React, { useEffect, useState } from 'react';
import DashboardCard from '../Card/DashboardCard';
import { IoPeople } from 'react-icons/io5';
import { MdHealthAndSafety, MdOutlinePayment } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";
import { useManageVisits } from '../../hooks/visits/useManageVisits';
import { endOfDay, getYear, isWithinInterval, startOfDay } from 'date-fns';
import { useManageDoctors } from '../../hooks/doctors/useManageDoctors';
import Clock from '../Utils/Clock';
import Spinner from '../Utils/Spinner';

const Dashboard = () => {
  const { getAllVisits, getNotPayedVisits, isLoading: isLoadingVisits } = useManageVisits();
  const { getDoctors, isLoading: isLoadingDoctors } = useManageDoctors();

  const [todaysVisits, setTodaysVisits] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const fetchTodaysVisits = async () => {
    try {
        let todaysVisits = 0;
        const today = new Date();

        const visits = await getAllVisits();

        todaysVisits = visits.filter((visit) => {
          const visitDate = new Date(visit.date);
          return isWithinInterval(visitDate, { start: startOfDay(today), end: endOfDay(today) });
        });

        setTodaysVisits(todaysVisits.length)
    } catch (error) {
        console.log(error);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const pendingPayments = await getNotPayedVisits();
      setPendingPayments(pendingPayments.length)
    } catch(error){
      console.log(error)
    }
  }

  const fetchPendingLeaveRequests = async () => {
    try {
      const allDoctors = await getDoctors();
  
      const userLeaveRequests = allDoctors
        .map(doctor => doctor.leaveRequests)
        .flat()
        .filter(request => request.isApproved === null);
  
      setPendingLeaveRequests(userLeaveRequests.length);
    } catch(error) {
      console.log(error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const visits = await getAllVisits();
      const currentYear = getYear(new Date());
      
      const revenue = visits
        .filter(visit => getYear(new Date(visit.date)) === currentYear && visit.paid)
        .reduce((total, visit) => total + visit.amount, 0);
      
      setRevenue(revenue);
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodaysVisits();
    fetchPendingPayments();
    fetchPendingLeaveRequests();
    fetchRevenue();
  }, []);

  return (
    <div>
      <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
        <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3'>
          Dashboard
        </h3>
      </div>
      <div className='my-8'>
        <Clock />
      </div>
      {isLoadingDoctors || isLoadingVisits ? (
        <div className="flex items-center justify-center mx-auto py-10">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 px-4 mx-auto my-10 md:my-20">
          <DashboardCard
            icon={<MdHealthAndSafety />}
            title="Visits Today"
            content={todaysVisits}
            cardBg="bg-sky-300"
            hoverBg="hover:bg-sky-500"
          />
          <DashboardCard
            icon={<MdOutlinePayment />}
            title="Pending Payments"
            content={pendingPayments}
            cardBg="bg-yellow-200"
            hoverBg="hover:bg-yellow-500"
          />
          <DashboardCard
            icon={<IoPeople />}
            title="Leave Requests"
            content={pendingLeaveRequests}
            cardBg="bg-gray-400"
            hoverBg="hover:bg-gray-500"
          />
          <DashboardCard
            icon={<FaCashRegister />}
            title={`Revenue ${getYear(new Date())} ($)`}
            content={`${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            cardBg="bg-green-300"
            hoverBg="hover:bg-green-500"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
