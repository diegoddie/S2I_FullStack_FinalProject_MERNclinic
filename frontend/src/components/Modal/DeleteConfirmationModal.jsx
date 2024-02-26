import { useState } from 'react';
import { MdClose } from 'react-icons/md';

const DeleteConfirmationModal = ({ onClose, onDelete, passwordConfirmation }) => {
    const [password, setPassword] = useState('');

    return (
        <div className='px-2 py-2 md:px-0 fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-lg shadow my-auto'>
            <div className='flex justify-end'>
              <button onClick={onClose} className='text-gray-600 hover:text-gray-800'>
                <MdClose className='text-xl' />
              </button>
            </div>
            <div className='w-full items-center mx-auto justify-center text-center'>
              <h3 className='text-2xl font-semibold mb-2 text-[#168aad]'>Confirm Deletion</h3>
            </div>
            <div className='p-2 space-y-2'>
              <p className='text-center text-red-500 mb-2 text-lg md:text-xl font-semibold '>
                Are you sure to proceed? This action is irreversible.
              </p>
              <div>
                {passwordConfirmation && (
                  <>
                    <p className='text-sm mb-2'>To confirm, please enter your password:</p>
                    <div>
                      <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border rounded p-2 w-full mb-2'
                        />
                    </div>
                  </>
                )}            
                <button
                    className='bg-red-400 text-white py-2 px-4 mt-4 rounded hover:bg-red-500'
                    onClick={() => {
                        if (passwordConfirmation) {
                            onDelete(password);
                            onClose()
                        } else {
                            onDelete();
                            onClose()
                        }
                    }}
                >
                    Confirm Deletion
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };
  
  export default DeleteConfirmationModal;