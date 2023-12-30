import React, { useState } from 'react';
import { MdMenuOpen } from "react-icons/md";
import { MdHealthAndSafety } from "react-icons/md";
import { MdCalendarMonth } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";

const Sidebar = ({ data, isAdmin, selectedSection, handleMenuItemClick }) => {
    const [open, setOpen] = useState(true);

    const menuItems = [
        { title: 'My Visits', section: 'MyVisits', icon: <MdHealthAndSafety /> },
        { title: 'Bookings', section: 'Bookings', icon: <MdCalendarMonth /> },
        { title: 'Settings', section: 'Settings', icon: <MdOutlineSettings />},
        { title: 'Create Doctor', section: 'CreateDoctor', icon: <FaUserDoctor />, adminOnly: true },
        { title: 'Dashboard', section: 'Dashboard', icon: <MdDashboard />,adminOnly: true },
    ];

    return (
        <div className={`bg-pink-500 rounded-md py-3 px-3 mx-auto w-full duration-200 relative ${open ? 'md:w-[310px]' : 'md:w-[120px]'}`}>
            <MdMenuOpen className={`bg-white hidden md:flex absolute cursor-pointer duration-300 rounded-full -right-3 top-14 w-9 h-9 border-4 border-pink-500 text-3xl ${!open && 'rotate-180'}`} onClick={()=>setOpen(!open)}/>
            <div className="flex items-center justify-center">
                <figure className={`w-[100px] h-[100px] ${open ? 'md:w-[120px] md:h-[120px]' : 'md:w-[80px] md:h-[80px]'} rounded-full duration-300 border-2 border-solid border-yellow-500`}>
                    <img src={data.profilePicture} alt="user" className="w-full h-full rounded-full" />
                </figure>
            </div>
            <div className={`text-center mt-2 text-gray-500 duration-700 ${!open && 'hidden'}`}>
                <h3 className='font-bold text-xl'>{`${data.firstName} ${data.lastName}`}</h3>
                <p className='leading-6 font-semibold text-xl'>{data.taxId}</p>
                <p className='leading-6 text-lg'>{data.email}</p>
            </div>
            <div className="pt-4 md:pt-8 flex flex-wrap md:flex-col gap-2 justify-center">
                <ul className='flex flex-wrap md:flex-col gap-2 justify-center'>
                    {menuItems.map((menu, index) => (
                        (isAdmin || !menu.adminOnly) && (
                            <li
                                key={index}
                                className={`flex flex-wrap text-white rounded-md hover:bg-pink-300 items-center my-2 cursor-pointer p-2 font-semibold ${selectedSection === menu.section ? 'bg-pink-300 text-slate-500' : ''}`}
                                onClick={() => handleMenuItemClick(menu.section)}
                            >
                                <span className={`text-3xl duration-300 ${!open && 'justify-center items-center flex mx-auto'}`}>{menu.icon}</span>
                                <span className={`${!open && 'hidden'} ml-2 duration-300 text-xl`}>{menu.title}</span>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
