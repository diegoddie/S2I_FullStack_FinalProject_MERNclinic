import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import QRCode from 'qrcode.react';

const Manage2FAModal = ({ onDisable2FA, onEnable2FA, onClose, user, twoFactorSecret }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempSecretCode, setTempSecretCode] = useState('');

  return (
    <div className='px-2 py-2 md:px-0 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow my-auto'>
        <div className='flex justify-end'>
          <button onClick={onClose} className='text-gray-600 hover:text-gray-800'>
            <MdClose className='text-xl'/>
          </button>
        </div>
        <div className='w-full items-center mx-auto justify-center text-center'> 
          <h3 className='text-2xl font-semibold mb-4 text-[#168aad]'>Two-Factor Authentication (2FA)</h3>
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
                  className="bg-red-400 text-white py-2 px-4 mt-4 rounded hover:bg-red-500"
                  onClick={(e) => onDisable2FA(password, confirmPassword, e)}
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
                <button className='bg-[#168aad] hover:bg-[#12657f] text-white py-2 px-4 mt-4 rounded' onClick={(e) => onEnable2FA(tempSecretCode, e)}>
                  Verify and Enable 2FA
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Manage2FAModal