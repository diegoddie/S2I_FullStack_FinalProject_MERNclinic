import React, { useRef } from "react";
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import doc1 from '../assets/doc1.jpg'
import doc2 from '../assets/doc2.jpg'
import doc3 from '../assets/doc3.jpg'
import doc4 from '../assets/doc4.jpg'
import doc5 from '../assets/doc5.jpg'
import doc6 from '../assets/doc6.jpg'

const Doctors = () => {
    const data = [
        {
          img: doc1,
          name: "Dr. Serena Mitchell",
          specialties: "Orthopedic Surgeon",
        },
        {
          img: doc2,
          name: "Dr. Julian Bennett",
          specialties: "Cardiologist",
        },
        {
          img: doc3,
          name: "Dr. Camila Rodriguez",
          specialties: "Pediatrician",
        },
        {
          img: doc4,
          name: "Dr. Victor Nguyen",
          specialties: "Neurologist",
        },
        {
          img: doc5,
          name: "Dr. Ethan Carter",
          specialties: "Dermatologist",
        },
        {
          img: doc6,
          name: "Dr. Olivia Martinez",
          specialties: "Ophthalmologist",
        },
    ];

    const slider = useRef(null);

    const settings = {
        accessibility: true,
        dots: true,
        infinite: true,
        speed: 500,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1023,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 2,
            },
          },
        ],
      };

    return (
        <section id='doctors'>
            <div className='py-16 md:px-4 px-2 mx-auto bg-green-100'>
                <div className='mx-auto text-center'>
                    <h2 className='text-4xl font-semibold'>
                        Our Doctors
                    </h2>
                </div>
            
            <div className='flex flex-col justify-center lg:px-28 px-5 pt-6'>
                <div className='flex flex-col items-center mb-2'>
                    <div>
                        <p className='text-center lg:text-start'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil iure officia reiciendis beatae veritatis repellendus consequuntur dolor dolore aspernatur officiis. Vitae fuga est veniam corrupti. Praesentium eligendi quo accusantium laborum.</p>
                    </div>
                    <div className="hidden md:flex gap-5 mt-4">
                        <button
                            className=" bg-[#d5f2ec] text-backgroundColor px-4 py-2 rounded-lg active:bg-[#ade9dc]"
                            onClick={() => slider.current.slickPrev()}
                        >
                            <FaArrowLeft size={25} />
                        </button>
                        <button
                            className=" bg-[#d5f2ec] text-backgroundColor px-4 py-2 rounded-lg active:bg-[#ade9dc]"
                            onClick={() => slider.current.slickNext()}
                        >
                            <FaArrowRight size={25} />
                        </button>
                    </div>
                </div>
                <div className="mt-8">
                    <Slider ref={slider} {...settings}>
                        {data.map((e, index) => (
                            <div
                                className="h-[350px] text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-8 cursor-pointer"
                                key={index}
                            >
                                <div>
                                    <img
                                        src={e.img}
                                        alt="img"
                                        className="h-56 rounded-t-xl w-full"
                                    />
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <h1 className="font-semibold text-xl pt-4">{e.name}</h1>
                                    <h3 className="pt-2">{e.specialties}</h3>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            </div>
        </section>
    )
}

export default Doctors