import React from 'react'
import Header from '../components/Header'
import About from '../components/About'
import Services from '../components/Services'
import Doctors from '../components/Doctors'

const Home = () => {
  return (
    <div className='2xl:px-4 w-full mx-auto mt-20'>
        <Header />
        <About />
        <Services />
        <Doctors />
    </div>
  )
}

export default Home