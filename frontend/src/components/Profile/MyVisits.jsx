import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import Spinner from '../Utils/Spinner';
import VisitsTable from '../Utils/VisitsTable';
import { useManageVisits } from '../../hooks/visits/useManageVisits';

const MyVisits = () => {
  const { getVisits, isLoading } = useManageVisits();
  const { user } = useAuthContext();

  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('nextVisits');

  const isDoctor = user.specialization || false;

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  }

  const fetchData = async () => {
    try {
        if (isDoctor) {
            const visits = await getVisits("doctor", user._id);
            setData(visits)
        } else {
            const visits = await getVisits("user", user._id);
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
                My Visits
            </h3>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center mx-auto py-10">
                <Spinner />
            </div>
        )}
        {!isLoading && (
          <>
            <div className="flex gap-2 justify-center pt-4">
              <button onClick={() => handleTabChange('nextVisits')} className="px-5 py-3 leading-4 transition-colors duration-200 transform rounded-md text-xl font-semibold text-white bg-[#168aad] hover:bg-[#12657f]">Next Visits</button>
              <button onClick={() => handleTabChange('pastVisits')} className="px-5 py-3 leading-4 transition-colors duration-200 transform rounded-md text-xl font-semibold text-white bg-[#fc81b0] hover:bg-[#f873a4]">Past Visits</button>
            </div>
            <div className='overflow-x-auto'>
              {selectedTab === 'nextVisits' && (
                <VisitsTable data={data} isDoctor={isDoctor} title="Next Visits" />
              )}
              {selectedTab === 'pastVisits' && (
                <VisitsTable data={data} isDoctor={isDoctor} title="Past Visits" />
              )}
            </div>
          </>
        )}
    </div>
);
}

export default MyVisits