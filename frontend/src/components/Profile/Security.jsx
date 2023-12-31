import React, { useState } from 'react'
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { MdClose } from "react-icons/md";
import QRCode from 'qrcode.react';
import Spinner from '../Utils/Spinner';
import Alert from '../Utils/Alert';
import { use2FA } from '../../hooks/users/use2FA';

const Security = () => {
    const { generate2FA, verify2FA, disable2FA, error, isLoading } = use2FA();
    const { user } = useAuthContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSecretCode, setTempSecretCode] = useState('');
    const [twoFactorSecret, setTwoFactorSecret] = useState(null)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOpenModal = async () => {
        try {
          setIsModalOpen(true);
          if (!user.twoFactorEnabled) {
            const otpauthURL = await generate2FA();
            setTwoFactorSecret(otpauthURL);
          }
        } catch (err) {
          console.error('Error generating 2FA:', err);
        }
      };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTempSecretCode('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleVerifyAndEnable2FA = (e) => {
        e.preventDefault()
        verify2FA(tempSecretCode);
        setIsModalOpen(false);
    };

    const handleDisable2FA = (e) => {
        e.preventDefault()
        disable2FA(password, confirmPassword);
        setIsModalOpen(false);
    };

    return (
        <div className='flex flex-col h-full px-3 md:px-10'>
            {isLoading && 
                <div className='flex items-center justify-center mx-auto py-10'>
                    <Spinner />
                </div>
            }
            {error.length > 0 && (
                <div className='w-full max-w-[570px] items-center justify-center text-center mx-auto'>
                    {error.map((error, index) => (
                        <Alert key={index} type='error' message={error} />
                    ))}
                </div>
            )}
            {!isLoading && (
                <>
                    <div className='font-semibold flex mx-auto justify-center mt-3'>
                        <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                            Two Factor Authentication
                        </h3>
                    </div>
                    <div className='flex flex-col justify-center h-full items-center'>
                        {!user.twoFactorEnabled && (
                            <>
                                <p className='text-center text-gray-700 mb-8 text-lg md:text-xl font-semibold'>
                                    Enable Two Factor Authentication (2FA) for an extra layer of security. When 2FA is enabled,
                                    you'll need to provide a verification code in addition to your password during login.
                                    This helps protect your account from unauthorized access.
                                </p>
                                <div className='flex justify-center mb-4'>
                                    <button
                                        onClick={handleOpenModal}
                                        className='px-8 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl font-semibold bg-[#ffc8dd] hover:bg-[#fa7fac]'
                                    >
                                        Enable 2FA
                                    </button>
                                </div>
                            </>
                        )}
                        {user.twoFactorEnabled && (
                            <div className='flex flex-col justify-center items-center mb-4'>
                                <p className='text-center text-gray-700 mb-4 text-lg md:text-xl font-semibold'>
                                    You have already enabled two-factor authentication.
                                </p>
                                <button
                                    onClick={handleOpenModal}
                                    className='px-8 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl font-semibold bg-red-500 hover:bg-red-600'
                                >
                                    Disable 2FA
                                </button>
                            </div>
                        )}
                        {isModalOpen && (
                            <div className='px-2 py-2 md:px-0 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center'>
                                <div className='bg-white p-8 rounded-lg shadow my-auto'>
                                    <div className='flex justify-end'>
                                        <button onClick={handleCloseModal} className='text-gray-600 hover:text-gray-800'>
                                            <MdClose className='text-xl'/>
                                        </button>
                                    </div>
                                    <div className='w-full items-center mx-auto justify-center text-center'> 
                                        <h3 className='text-2xl font-semibold mb-4'>Two-Factor Authentication (2FA)</h3>
                                    </div>
                                    <div className="p-2 space-y-4">
                                        {user.twoFactorEnabled ? (
                                            <>
                                                <h4 className="text-base text-gray-600 font-medium border-b mb-2">Disable 2FA</h4>
                                                <div>
                                                    <p className="text-sm mb-2">
                                                        To disable 2FA, please enter your password and confirm:
                                                    </p>
                                                    <div>
                                                        <input
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            placeholder="Enter your password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="border rounded p-2 w-full mb-2"
                                                        />
                                                        <input
                                                            type="password"
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            placeholder="Confirm your password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="border rounded p-2 w-full mb-2"
                                                        />
                                                    </div>
                                                    <button
                                                        className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                                                        onClick={handleDisable2FA}
                                                    >
                                                        Disable 2FA
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="text-base text-gray-600 font-medium border-b mb-2">
                                                    Configuring Google Authenticator or Authy
                                                </h4>
                                                <div className=''>
                                                    <li>
                                                        Install Google Authenticator (IOS - Android) or Authy (IOS - Android).
                                                    </li>
                                                    <li>In the authenticator app, select "+" icon.</li>
                                                    <li>
                                                        Select "Scan a barcode (or QR code)" and use the phone's camera to scan this barcode.
                                                    </li>
                                                </div>
                                                <div>
                                                    <h4 className='text-base text-gray-600 font-medium border-b mb-2'>
                                                        Scan QR Code
                                                    </h4>
                                                    <div className='flex justify-center'>
                                                        {twoFactorSecret && <QRCode value={twoFactorSecret} />}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className='text-base text-gray-600 font-medium border-b mb-2'>Or Enter Code Into Your App</h4>
                                                    <p className="text-sm">SecretKey: {user.twoFactorSecret} (Base32 encoded)</p>
                                                </div>
                                                <div>
                                                    <h4 className='text-base text-gray-600 font-medium border-b mb-2'>Verify Code</h4>
                                                    <p className="text-sm mb-2">
                                                        For changing the setting, please verify the authentication code:
                                                    </p>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter verification code"
                                                            value={tempSecretCode}
                                                            onChange={(e) => setTempSecretCode(e.target.value)}
                                                            className='border rounded p-2 w-full'
                                                        />
                                                    </div>
                                                    <button className='bg-blue-500 text-white py-2 px-4 mt-4 rounded' onClick={handleVerifyAndEnable2FA}>
                                                        Verify and Enable 2FA
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Security