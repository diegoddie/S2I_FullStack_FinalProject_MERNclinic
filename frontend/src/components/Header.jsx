import React from 'react'
import Button from './Button'
import header from '../assets/header.png'

const Header = () => {
    return (
        <header className='md:px-24 p-4 rounded-xl mb-16'>
            <div className='flex flex-col md:flex-row-reverse justify-between items-center gap-10'>
                <div className='flex justify-center items-center mx-auto'>
                    <img src={header} alt="header" className='h-[416px] 2xl:h-[500px]' />
                </div>
                <div className='md:w-3/5 flex flex-col justify-center'>
                    <h2 className='2xl:text-7xl md:text-5xl text-4xl font-bold mb-6 leading-relaxed text-[#29885f]'>
                        Welcome to MyClinic. Your Health, Our Priority.
                    </h2>
                    <p className='text-2xl mb-8 text-[#333]'>
                        At MyClinic, you can book and manage your appointments with our expert doctors, putting your health journey at the forefront of innovation.
                    </p>
                    <div className='mb-8 md:mb-0 text-2xl font-bold justify-center items-center'>
                        <Button label='Join MyClinic' color='[#ffafcc]' hoverColor='[#fa7fac]' to='/sign-up'/>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header