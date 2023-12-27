import React from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import logo from '../assets/MYClinic.png';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const navItems = [
    { link: 'About', path: 'about' },
    { link: 'Services', path: 'services' },
    { link: 'Doctors', path: 'doctors' },
    { link: 'Contact', path: 'contact' }
  ];

  const handleReturnToStart = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: 'easeInOutQuad', 
    });
  };

  return (
    <section id="contact">
      <footer className='bg-secondary text-white'>
        <div className='container mx-auto py-12'>
          <div className='flex flex-col xl:flex-row gap-x-5 gap-y-10 px-4'>
            <div className='flex-1 items-center mx-auto flex flex-col'>
              <Link to="/" className='justify-center font-semibold flex items-center text-white' onClick={handleReturnToStart}>
                  <img src={logo} alt='logo' className='w-16 items-center' />
                  <span className='text-3xl hover:text-[#168aad]'>MyClinic</span>
              </Link>
              <div className='flex flex-col gap-y-3 mt-2 mb-8 mx-auto items-center justify-center'>
                <div className='flex items-center gap-x-[6px]'>
                  <FaLocationDot className='text-xl text-gray-200'/>
                  <div className='text-lg'>Via Giuseppe Garibaldi, 54 Flero (BS)</div>
                </div>
                <div className='flex items-center gap-x-[6px]'>
                  <MdEmail className='text-xl text-gray-200'/>
                  <div className='text-lg'>myclinic@gmail.com</div>
                </div>
                <div className='flex items-center gap-x-[6px]'>
                  <FaPhoneAlt className='text-xl text-gray-200'/>
                  <div className='text-lg'>+39 329-3094304</div>
                </div>
              </div>
              <div className='flex gap-[14px] text-[30px]'>
                <div className='p-[10px] rounded-[10px] shadow-xl text-gray-200 hover:text-blue-700 cursor-pointer transition-all'>
                  <FaFacebook />
                </div>
                <div className='p-[10px] rounded-[10px] shadow-xl text-gray-200 hover:text-orange-400 cursor-pointer transition-all'>
                  <FaInstagram />
                </div>
                <div className='p-[10px] rounded-[10px] shadow-xl text-gray-200 hover:text-primary cursor-pointer transition-all'>
                  <FaTwitter />
                </div>
                <div className='p-[10px] rounded-[10px] shadow-xl text-gray-200 hover:text-blue-700 cursor-pointer transition-all'>
                  <FaLinkedin />
                </div>
              </div>
            </div>
            <div className='flex-1 mt-4 items-center mx-auto flex flex-col'>
              <h4 className='text-3xl mb-5 font-semibold'>Quick Links</h4>
              <div className='flex gap-x-5'>
                  <ul className='flex-1 flex flex-col gap-y-5 items-center cursor-pointer'>
                    {navItems.map(({ link, path }) => (
                        <ScrollLink key={link} to={path} spy={true} smooth={true} duration={500} className='text-white hover:text-primary transition-all text-xl'>  
                          {link}
                        </ScrollLink>
                    ))}
                  </ul>
              </div>
            </div>
            <div className='flex-1 mt-4 mx-auto flex flex-col'>
              <h4 className='text-3xl mb-5 font-semibold mx-auto'>Opening Hours</h4>
              <div className='flex flex-col gap-5'>
                <div className='flex-1'>
                  <div className='flex justify-between items-center border-b pb-[10px] gap-8 md:gap-0'>
                    <div>Monday - Thursday</div>
                    <div className='text-primary font-medium'>8:00 AM - 6:00 PM</div>
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex justify-between items-center border-b pb-[10px] gap-8 md:gap-0'>
                    <div>Friday - Saturday</div>
                    <div className='text-primary font-medium'>10:00 AM - 4:00 PM</div>
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex justify-between items-center border-b pb-[10px] gap-8 md:gap-0'>
                    <div>Sunday</div>
                    <div className='text-primary font-medium'>Emergency Only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='py-[20px] border-t'>
          <div className="container mx-auto text-center">
            <div className='font-light text-base'>&copy; 2023 MyClinic - All rights reserved.</div>
          </div>
        </div>
      </footer>
    </section>
  )
}

export default Footer