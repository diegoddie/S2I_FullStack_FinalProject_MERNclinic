import React, { useEffect, useState } from 'react'
import { useManageVisits } from '../../hooks/visits/useManageVisits';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import Spinner from '../Utils/Spinner';
import RegisterPaymentsTable from '../Table/RegisterPaymentsTable';

const RegisterPayments = () => {
    const { getNotPayedVisits, isLoading } = useManageVisits();
    const { user } = useAuthContext();

    const [data, setData] = useState([]);

    const isAdmin = user.isAdmin || false;

    const fetchData = async () => {
      try {
        if(isAdmin){
          const visits = await getNotPayedVisits();
          setData(visits)
        }
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    return (
      <div className=''>
        <div className='font-semibold flex items-center mx-auto justify-center mt-3'>
            <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                Register Payments
            </h3>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center mx-auto py-10">
                <Spinner />
            </div>
        )}
        {!isLoading && (
          <>
            <RegisterPaymentsTable data={data} />
          </>
        )}
      </div>
    )
}

export default RegisterPayments