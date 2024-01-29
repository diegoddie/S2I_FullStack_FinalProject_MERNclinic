import React, { useEffect } from 'react'
import About from '../components/Home/About'
import Services from '../components/Home/Services'
import Doctors from '../components/Home/Doctors.jsx'
import Hero from '../components/Home/Hero'
import Stats from '../components/Home/Stats'
import Contact from '../components/Home/Contact.jsx'
import { animateScroll as scroll } from 'react-scroll';

const Home = () => {
  useEffect(() => {
    scroll.scrollToTop({
        duration: 500,
        smooth: 'easeInOutQuad',
    });
  }, []);

  return (
    <div className='2xl:px-4 w-full mx-auto mt-20'>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Doctors />
        <Contact />
    </div>
  )
}

export default Home