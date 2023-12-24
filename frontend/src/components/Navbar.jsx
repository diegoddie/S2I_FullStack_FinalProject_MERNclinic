import React, { useState } from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { Link } from 'react-router-dom'; 
import logo from '../assets/MYClinic.png';
import Button from './Button';
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { RiArrowLeftDoubleLine } from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReturnToStart = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: 'easeInOutQuad', 
    });
  };

  const navItems = [
    { link: 'About', path: 'about' },
    { link: 'Services', path: 'services' },
    { link: 'Doctors', path: 'doctors' },
    { link: 'Contact', path: 'contact' }
  ];

  return (
      <header className='py-4 lg:pt-2 lg:pb-14 lg:px-8 '>
        <div className='container mx-auto lg:relative flex flex-col lg:flex-row lg:justify-between gap-y-4 lg:gap-y-0'>
          <div className='flex justify-center lg:justify-normal '>
            <Link to="/" className='font-semibold flex items-center text-secondary mr-2' onClick={handleReturnToStart}>
                <img src={logo} alt='logo' className='w-16 items-center' />
                <span className='text-2xl hover:text-[#3f869c]'>MyClinic</span>
            </Link>
          </div>
          <div className='flex flex-col gap-y-4 lg:flex-row lg:gap-x-10 lg:gap-y-0'>
            <div className='flex justify-center items-center gap-x-2 lg:justify-normal'>
              <FaLocationDot className='text-xl text-secondary'/>
              <div className='text-sm text-secondary'>Via Giuseppe Garibaldi, 54 Flero (BS)</div>
            </div>
            <div className='flex justify-center items-center gap-x-2 lg:justify-normal'>
              <FaPhoneAlt className='text-xl text-secondary'/>
              <div className='text-sm text-secondary'>+39 329-3094304</div>
            </div>
            <div className='flex justify-center md:mt-0 items-center gap-2 font-bold text-xl'>
              <button className='hover:bg-[#48cae4]'></button>
              <Button label='Login' color='primary' hoverColor='[#48cae4]' to='/login' />
              <Button label='Sign Up' color='[#ffc8dd]' hoverColor='[#fa7fac]' to='/sign-up' />
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
                  {navItems.map(({ link, path }) => (
                      <ScrollLink key={link} to={path} spy={true} smooth={true} duration={500}>
                        <Link key={link} to={path} className='text-secondary hover:text-gray-300 transition-all duration-300 font-semibold text-xl'>
                          {link}
                        </Link>
                      </ScrollLink>
                  ))}
                </ul>
              </div>
            </nav>
            <nav className='bg-white absolute shadow-xl w-full left-0 -bottom-[86px] h-16 rounded-[10px] hidden lg:flex lg:items-center lg:justify-center lg:px-[50px]'>
              <ul className='flex gap-x-8'>
                  {navItems.map(({ link, path }, index) => (
                    <ScrollLink key={link} to={path} spy={true} smooth={true} duration={500}>
                      <Link key={link} to={path} className={`text-secondary font-semibold hover:text-[#3f869c] transition-all duration-300 text-lg uppercase ${
                        index < navItems.length - 1 ? 'border-r pr-8' : ''
                      }`}>
                        {link}
                      </Link>
                    </ScrollLink>
                  ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
  );
};

export default Navbar;