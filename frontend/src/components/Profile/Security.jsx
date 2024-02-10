import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { MdClose } from "react-icons/md";
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Utils/Spinner';
import { toast } from 'react-toastify';
import errorHandler from '../../hooks/utils/errorHandler';
import { useManage2FA } from '../../hooks/auth/useManage2FA';
import DeleteConfirmationButton from '../Modal/DeleteConfirmationModal';
import { useManageAuth } from '../../hooks/auth/useManageAuth';
import { useManageUsers } from '../../hooks/users/useManageUsers';
import Manage2FAModal from '../Modal/Manage2FAModal';

const Security = ({ model }) => {
    const navigate = useNavigate()

    const { generate2FA, verify2FA, disable2FA, isLoading } = useManage2FA();
    const { verifyPassword } = useManageAuth()
    const { deleteUser } = useManageUsers()
    const { user } = useAuthContext();
    
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const [tempSecretCode, setTempSecretCode] = useState('');
    const [twoFactorSecret, setTwoFactorSecret] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    };
  
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleOpen2FAModal = async () => {
        try {
            setIs2FAModalOpen(true);
            if (!user.twoFactorEnabled) {
                const otpauthURL = await generate2FA(model);
                setTwoFactorSecret(otpauthURL);
            }
        } catch (err) {
          console.error('Error generating 2FA:', err);
        }
    };

    const handleClose2FAModal = () => {
        setIs2FAModalOpen(false);
        setTempSecretCode('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleVerifyAndEnable2FA = async (tempSecretCode, e) => {
        e.preventDefault();
        try {
            await verify2FA(tempSecretCode, model); 
            setIs2FAModalOpen(false);
        } catch (error) {
            console.error('Error verifying and enabling 2FA:', error);
            errorHandler(error)
        }
    };

    const handleDisable2FA = async (password, confirmPassword, e) => {
        e.preventDefault();
        try{
            disable2FA(password, confirmPassword, model);
            setIs2FAModalOpen(false);
        }catch(error){
            console.error('Error disabling 2FA:', error);
            errorHandler(error)
        }
    };

    const handleDelete = async (password, userId) => {
        try {
            if (!password) {
                toast.error('Please enter your password to confirm deletion.');
                return;
            }

            const isPasswordVerified = await verifyPassword(model, password);
        
            if (isPasswordVerified) {
                await deleteUser(model, userId);
                handleCloseDeleteModal();
                navigate('/')
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            errorHandler(error)
        }
    };

    return (
        <div className='flex flex-col h-full px-3 md:px-10'>
            {isLoading && 
                <div className='flex items-center justify-center mx-auto py-10'>
                    <Spinner />
                </div>
            }
            {!isLoading && (
                <>
                    <div className='font-semibold flex mx-auto justify-center mt-3'>
                        <h3 className='text-4xl leading-[30px] text-[#168aad] text-center px-3 mb-3'>
                            Two Factor Authentication
                        </h3>
                    </div>
                    <div className='flex flex-col justify-center h-full items-center'>
                        {!user.twoFactorEnabled ? (
                            <p className='text-center text-gray-600 mt-3 md:mt-0 mb-8 text-lg font-semibold'>
                                Enable Two Factor Authentication (2FA) for an extra layer of security. When 2FA is enabled,
                                you'll need to provide a verification code in addition to your password during login.
                                This helps protect your account from unauthorized access.
                            </p>
                        ) : (
                            <p className='text-center text-gray-700 mb-4 text-lg md:text-xl font-semibold'>
                                You have already enabled two-factor authentication.
                            </p>
                        )}
                        <div className='flex justify-center mb-4 gap-2'>
                            {!user.twoFactorEnabled ? (
                                <button
                                    onClick={handleOpen2FAModal}
                                    className='text-white px-7 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl font-semibold bg-[#168aad] hover:bg-[#12657f]'
                                >
                                    Enable 2FA
                                </button>
                            ) : (
                                <button
                                    onClick={handleOpen2FAModal}
                                    className='text-white px-7 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl font-semibold bg-red-500 hover:bg-red-600'
                                >
                                    Disable 2FA
                                </button>
                            )}
                            <button
                                onClick={handleOpenDeleteModal}
                                className='px-7 py-4 leading-5 transition-colors duration-200 transform rounded-full text-xl text-white font-semibold bg-red-500 hover:bg-red-600'
                            >
                                Delete Account
                            </button>
                            {isDeleteModalOpen && (
                                <DeleteConfirmationButton onClose={handleCloseDeleteModal} passwordConfirmation={true} onDelete={(password) => handleDelete(password, user._id)}  /> 
                            )}
                            {is2FAModalOpen && (
                                <Manage2FAModal onClose={handleClose2FAModal} user={user} onDisable2FA={(password, confirmPassword, e) => handleDisable2FA(password, confirmPassword, e)} onEnable2FA={(tempSecretCode, e) => handleVerifyAndEnable2FA(tempSecretCode, e)} twoFactorSecret={twoFactorSecret}/>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Security;
