import React, { useState } from 'react';
import { MdMenuOpen, MdHealthAndSafety, MdSecurity, MdDashboard } from "react-icons/md";
import { FaUserDoctor, FaRegPenToSquare } from "react-icons/fa6";
import { FaHospital } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Sidebar = ({ data, isAdmin, isDoctor, selectedSection, handleMenuItemClick }) => {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { title: 'Dashboard', section: 'Dashboard', icon: <MdDashboard />, user: [isAdmin] },
        { title: 'Manage Doctors', section: 'ManageDoctors', icon: <FaUserDoctor />, user: [isAdmin] },
        { title: 'My Visits', section: 'MyVisits', icon: <MdHealthAndSafety />, user: [isDoctor, !isAdmin] },
        { title: 'Leave Management', section: 'LeaveManagement', icon: <FaRegPenToSquare />, user: [isDoctor, isAdmin] },
        { title: 'Book a Visit', section: 'Bookings', icon: <FaHospital />, user: [!isDoctor] },
        { title: 'Update Profile', section: 'Update', icon: <CgProfile />, user: [isDoctor, isAdmin, !isAdmin]},
        { title: 'Security', section: 'Security', icon: <MdSecurity />, user: [isDoctor, isAdmin, !isAdmin] },
    ];

    const filteredMenuItems = menuItems.filter((menuItem) => {
        return menuItem.user.some((condition) => condition);
    });

    return (
        <div className={`bg-secondary rounded-md py-4 md:py-8 md:px-3 mx-auto w-full duration-200 relative ${open ? 'md:w-[280px]' : 'md:w-[120px]'}`}>
            <MdMenuOpen className={`bg-white hidden md:flex absolute cursor-pointer duration-300 rounded-full -right-3 top-14 w-8 h-8 border-4 border-secondary text-3xl ${!open && 'rotate-180'}`} onClick={()=>setOpen(!open)}/>
            <div className="flex items-center justify-center">
                <figure className={`w-[100px] h-[100px] ${open ? 'md:w-[120px] md:h-[120px]' : 'md:w-[80px] md:h-[80px]'} rounded-full duration-300 border-2 border-solid border-pink-500`}>
                    <img src={data.profilePicture} alt="user" className="w-full h-full rounded-full object-cover" />
                </figure>
            </div>
            <div className={`text-center mt-2 text-white duration-700 ${!open && 'hidden'}`}>
                <h3 className='font-bold text-xl'>{`${data.firstName} ${data.lastName}`}</h3>
                <p className='leading-6 font-semibold text-xl'>{data.taxId}</p>
                <p className='leading-6 text-lg'>{data.email}</p>
            </div>
            <div className="pt-4 md:pt-8 flex flex-wrap md:flex-col gap-2 justify-center">
                <ul className='flex flex-wrap md:flex-col gap-2 justify-center'>
                    {filteredMenuItems.map((menu, index) => (
                        <li
                            key={index}
                            className={`flex flex-wrap text-white rounded-md hover:bg-[#85cdc0] items-center my-2 cursor-pointer p-2 font-semibold ${selectedSection === menu.section ? 'bg-[#85cdc0] text-slate-500' : ''}`}
                            onClick={() => handleMenuItemClick(menu.section)}
                        >
                            <span className={`text-3xl duration-300 ${!open && 'justify-center items-center flex mx-auto'}`}>{menu.icon}</span>
                            <span className={`${!open && 'hidden'} ml-2 duration-300 text-xl`}>{menu.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
