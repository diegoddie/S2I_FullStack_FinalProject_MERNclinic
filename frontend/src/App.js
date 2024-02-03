import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import DoctorDetails from "./pages/DoctorDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound.jsx";
import { useAuthContext } from "./hooks/auth/useAuthContext.js";
import PasswordResetRequest from "./pages/PasswordReset/PasswordResetRequest.jsx";
import PasswordReset from "./pages/PasswordReset/PasswordReset.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailVerified from "./components/Auth/EmailVerified.jsx";

const App = () => {
  const { user, token } = useAuthContext()

  return (
    <div className="App font-body bg-teal-50">
      <BrowserRouter>
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/sign-up" element={!user && !token ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/login" element={!user && !token ? <Login model="user"/> : <Navigate to="/" />} />
            <Route path="/doctor/login" element={!user && !token ? <Login model="doctor"/> : <Navigate to="/" />} />
            
            <Route exact path="/profile/:id" element={user && token ? <Profile model="user"/> : <Navigate to="/login" />} />
            <Route exact path="/doctor/profile/:id" element={user && token ? <Profile model="doctor"/> : <Navigate to="/login" />} />

            <Route path="/doctor/:id" element={<DoctorDetails />} />

            <Route path="/user/verify-email/:token" element={<EmailVerified model="user" />} />
            <Route path="/doctor/verify-email/:token" element={<EmailVerified model="doctor" />} />

            <Route path="/user/password-reset" element={<PasswordResetRequest model="user" />} />
            <Route path="/doctor/password-reset" element={<PasswordResetRequest model="doctor" />} />

            <Route path="/user/password-reset/:token" element={<PasswordReset model="user" />} />
            <Route path="/doctor/password-reset/:token" element={<PasswordReset model="doctor" />} />

            <Route path="*" element={<NotFound />}/>
          </Routes>
          <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
