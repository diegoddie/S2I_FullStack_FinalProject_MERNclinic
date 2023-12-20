import React, { useState } from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { Link } from 'react-router-dom'; 
import logo from '../assets/MYClinic.png';
import { FaBars } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import Button from './Button';

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
    <>
      <nav className='bg-primary w-full md:px-10 border-b mx-auto py-2 text-secondary fixed top-0 right-0 left-0'>
        <div className='text-lg container mx-auto flex justify-between items-center font-medium'>
          <div className='flex space-x-6 items-center'>
            <Link to="/" className='font-semibold flex items-center text-secondary mr-2' onClick={handleReturnToStart}>
                <img src={logo} alt='logo' className='w-16 inline-block items-center' />
                <span className='text-2xl'>MyClinic</span>
            </Link>
            <ul className='md:flex space-x-6 hidden text-xl'>
              {navItems.map(({ link, path }) => (
                <ScrollLink key={link} to={path} spy={true} smooth={true} duration={500}>
                  <Link className='block hover:text-blue-500'>{link}</Link>
                </ScrollLink>
              ))}
            </ul>
          </div>
          <div className='space-x-2 hidden md:flex items-center text-black'>
            <Button label='Login' color='[#cdb4db]' hoverColor='[#b77ed6]' to='/login' />
            <Button label='Sign Up' color='[#ffafcc]' hoverColor='[#fa7fac]' to='/sign-up' />
          </div>
          <div className='md:hidden'>
            <button onClick={toggleMenu} className='text-white focus:outline-none'>
              {isMenuOpen ? (
                <FaXmark className='w-8 h-8 text-xl text-secondary mr-4 mt-2' />
              ) : (
                <FaBars className='w-8 h-8 text-xl text-secondary mr-4 mt-2' />
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className={`text-secondary space-y-4 px-4 pt-24 pb-5 bg-primary ${isMenuOpen ? 'fixed top-0 right-0 left-0' : 'hidden'}`}>
        {navItems.map(({ link, path }) => (
          <Link key={link} to={path} className='block hover:text-gray-300 text-2xl'>
            {link}
          </Link>
        ))}
        <div className={isMenuOpen ? 'flex text-xl justify-center items-center text-black space-x-2' : 'hidden'}>
          <Button label='Login' color='[#cdb4db]' hoverColor='[#b77ed6]' to='/login' />
          <Button label='Sign Up' color='[#ffafcc]' hoverColor='[#fa7fac]' to='/sign-up' />
        </div>
      </div>
    </>
  );
};

export default Navbar;