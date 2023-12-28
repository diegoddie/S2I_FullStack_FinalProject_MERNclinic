import React from 'react'
import About from '../components/Home/About'
import Services from '../components/Home/Services'
import Doctors from '../components/Doctors/Doctors.jsx'
import Hero from '../components/Home/Hero'
import Stats from '../components/Home/Stats'

const Home = () => {
  return (
    <div className='2xl:px-4 w-full mx-auto mt-20'>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Doctors />
    </div>
  )
}

export default Home