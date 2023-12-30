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
import { useAuthContext } from "./hooks/useAuthContext.js";
import PasswordResetRequest from "./pages/PasswordReset/PasswordResetRequest.jsx";
import PasswordReset from "./pages/PasswordReset/PasswordReset.jsx";

const App = () => {
  const {user,token} = useAuthContext()

  return (
    <div className="App font-body bg-teal-50">
      <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/login" element={!user && !token ? <Login /> : <Navigate to="/" />} />
            <Route path="/sign-up" element={!user && !token ? <SignUp /> : <Navigate to="/" />} />
            <Route exact path="/profile/:id" element={user && token ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/password-reset/:token" element={<PasswordReset />} />
            <Route path="*" element={<NotFound />}/>
          </Routes>
          <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
