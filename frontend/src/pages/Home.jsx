import React from 'react'
import About from '../components/About'
import Services from '../components/Services'
import Doctors from '../components/Doctors'
import Hero from '../components/Hero'
import Stats from '../components/Stats'

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