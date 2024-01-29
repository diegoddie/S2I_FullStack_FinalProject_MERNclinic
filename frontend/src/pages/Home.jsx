import React from 'react'
import About from '../components/Home/About'
import Services from '../components/Home/Services'
import Doctors from '../components/Home/Doctors.jsx'
import Hero from '../components/Home/Hero'
import Stats from '../components/Home/Stats'
import Contact from '../components/Home/Contact.jsx'

const Home = () => {
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