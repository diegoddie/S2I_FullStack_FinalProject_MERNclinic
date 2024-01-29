import React, { useState } from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import logo from '../assets/MYClinic.png';
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { RiArrowLeftDoubleLine } from "react-icons/ri";
import { useAuthContext } from '../hooks/auth/useAuthContext';
import LogoutButton from './Auth/LogoutButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, token } = useAuthContext();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReturnToStart = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: 'easeInOutQuad', 
    });
  };

  const homeNavItems = [
    { link: 'About', path: 'about' },
    { link: 'Services', path: 'services' },
    { link: 'Doctors', path: 'doctors' },
    { link: 'Contact', path: 'contact' }
  ];  

  return (
      <header className='py-4 lg:pt-2 lg:pb-14 lg:px-8'>
        <div className='container mx-auto lg:relative flex flex-col lg:flex-row lg:justify-between gap-y-4 lg:gap-y-0'>
          <div className='flex justify-center lg:justify-normal '>
            <Link to="/" className='font-semibold flex items-center text-secondary mr-2' onClick={handleReturnToStart}>
                <img src={logo} alt='logo' className='w-16 items-center' />
                <span className='text-2xl hover:text-[#3f869c]'>MyClinic</span>
            </Link>
          </div>
          <div className='flex flex-col gap-y-4 lg:flex-row lg:gap-x-10 lg:gap-y-0'>
            <div className='flex justify-center items-center gap-x-1 lg:justify-normal'>
              <FaLocationDot className='text-xl text-secondary mb-1'/>
              <div className='text-sm text-secondary'>Via Giuseppe Garibaldi, 54 Flero (BS)</div>
            </div>
            <div className='flex justify-center items-center gap-x-2 lg:justify-normal'>
              <FaPhoneAlt className='text-xl text-secondary'/>
              <div className='text-sm text-secondary'>+39 329-3094304</div>
            </div>
            <div className='flex justify-center md:mt-0 items-center gap-2 font-semibold text-xl text-gray-700'>
              {token && user ? (
                <>
                  <div className="relative inline-block rounded-full overflow-hidden border-2 border-secondary mr-3" >
                    <Link to={user.specialization ? `/doctor/profile/${user._id}` : `/profile/${user._id}`}>
                      <img src={user.profilePicture} alt="User" className="w-14 h-14 object-cover cursor-pointer" />
                    </Link>
                  </div>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link to='/login' className='bg-[#168aad] hover:bg-[#12657f] text-white py-2 px-4 transition-all duration-300 rounded-lg'>
                    Login
                  </Link>
                  <Link to='/sign-up' className='bg-[#fc81b0] text-white py-2 px-4 transition-all duration-300 rounded-lg hover:bg-[#f873a4]'>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <nav className={`bg-white fixed w-[250px] top-0 h-screen ${isMenuOpen ? 'left-0' : '-left-[250px]'} shadow-2xl lg:hidden transition-all duration-300 z-20`}>
              <div className='w-8 h-8 relative -right-full top-8 flex justify-center items-center rounded-tr-lg rounded-br-lg cursor-pointer transition-all'>
                {isMenuOpen ? (
                  <RiArrowLeftDoubleLine className='text-3xl bg-black text-white' onClick={toggleMenu} />
                ) : (
                  <RiArrowRightDoubleFill className='text-3xl bg-black text-white' onClick={toggleMenu} />
                )}
              </div>
              <div className='px-12 flex flex-col gap-y-12 h-full'>
                <Link to="/" className='font-semibold flex items-center text-secondary' onClick={handleReturnToStart}>
                    <img src={logo} alt='logo' className='w-16 items-center' />
                    <span className='text-2xl'>MyClinic</span>
                </Link>
                <ul className='flex flex-col gap-y-5'>
                  {location.pathname === '/' ? (
                    homeNavItems.map(({ link, path }) => (
                        <ScrollLink key={link} to={path} spy={true} smooth={true} duration={500} className='text-secondary hover:text-gray-300 transition-all duration-300 font-semibold text-xl'>
                          {link}  
                        </ScrollLink>
                    ))
                  ) : (
                    <Link to='/' className='text-secondary font-semibold hover:text-[#3f869c] transition-all duration-300 text-lg uppercase flex items-center'>
                      <RiArrowLeftDoubleLine className='text-2xl' />
                      HOME
                    </Link>
                  )}
                </ul>
              </div>
            </nav>
            <nav className='bg-white absolute shadow-xl w-full left-0 -bottom-[86px] h-16 rounded-[10px] hidden lg:flex lg:items-center lg:justify-center lg:px-[50px]'>
              <ul className='flex gap-x-8 cursor-pointer'>
                {location.pathname === '/' ? (
                  homeNavItems.map(({ link, path }, index) => (
                    <ScrollLink key={link} to={path} spy={true} smooth={true} duration={500} className={`text-secondary font-semibold hover:text-[#3f869c] transition-all duration-300 text-lg uppercase ${
                      index < homeNavItems.length - 1 ? 'border-r pr-8' : ''
                    }`}>
                      {link}
                    </ScrollLink>
                  ))
                ) : (
                  <Link to='/' className='text-secondary font-semibold hover:text-[#3f869c] transition-all duration-300 text-lg uppercase flex items-center'>
                    <RiArrowLeftDoubleLine className='text-2xl' />
                    Back to the homepage
                  </Link>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>
  );
};

export default Navbar;