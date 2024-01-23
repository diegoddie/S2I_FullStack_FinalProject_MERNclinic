import React, { useState } from 'react'
import { useUpdateDoctor } from '../../hooks/doctors/useUpdateDoctor'

const CreateLeaveRequest = () => {
  const {updateDoctor, error, isLoading} = useUpdateDoctor()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveRequests: [],
  })

  const handleInputChange = (e) => {
    setFormData({
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor({
        formData,
      });
    } catch (error) {
      console.error("Error updating the doctor's leave requests:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
  };

  return (
    <>
      <button
        className='px-6 py-4 leading-5 transition-colors duration-200 transform rounded-md text-xl font-semibold bg-green-500 hover:bg-green-600'
        onClick={handleOpenModal}
      >
        New Request
      </button>
      {isModalOpen && (
        // Qui puoi inserire la tua modale o la form per la richiesta di ferie
        // Usa formData e gli eventi di input per gestire la form
        <div>
          <form onSubmit={handleSubmit}>
            {/* Campi del modulo */}
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
            {/* Aggiungi altri campi secondo le tue esigenze */}

            <button type="submit">Submit</button>
          </form>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
    </>
  )
}

export default CreateLeaveRequest