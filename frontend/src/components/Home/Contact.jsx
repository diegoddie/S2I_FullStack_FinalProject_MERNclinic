import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_heinjzx', 'template_dshphma', form.current, '-NfLDS0azd-HIeq0d')
          .then(() => {
              toast.success("Mail sent succesfully.");
          }, (error) => {
              toast.error(error.text);
          });
          form.current.reset();
    };

    return (
        <section id='contact' className='bg-white'>
            <div className='py-12 md:py-24 md:px-1 px-2 mx-auto'>
                <div className='md:w-2/3 mx-auto text-center pb-4 items-center'>
                    <h2 className='text-4xl mb-4 font-semibold text-[#168aad]'>
                        Contact Us
                    </h2>
                    <p className="text-justify md:text-center text-lg 2xl:text-xl text-gray-700 px-8">
                        Are you looking to get in touch with us via email? Fill out the form below, and we'll get back to you as soon as possible.
                    </p>
                </div>
                <div className='mt-10 mx-auto md:w-1/2 px-8'>
                    <form ref={form}>
                        <div className="mb-6">
                            <input
                                type="text"
                                className="block w-full rounded border border-gray-500 bg-transparent py-2 px-4 outline-none"
                                placeholder="Name"
                                name="user_name"
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="email"
                                className="block w-full rounded border border-gray-500 bg-transparent py-2 px-4 outline-none"
                                placeholder="Email address"
                                name="user_email"
                            />
                        </div>
                        <div className="mb-6">
                            <textarea
                                className="block w-full rounded border border-gray-500 bg-transparent py-2 px-4 outline-none"
                                rows="3"
                                placeholder="Your message"
                                name="message"
                            />
                        </div>
                        <button
                        type="button"
                        onClick={sendEmail}
                        className="w-full text-white bg-[#168aad] hover:bg-[#12657f] text-xl leading-[30px] rounded-lg px-2 py-2"
                        >
                        Send Email
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
