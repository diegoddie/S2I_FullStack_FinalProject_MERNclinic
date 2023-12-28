import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import DoctorDetails from "./pages/DoctorDetails";
import { AuthProvider } from "./context/authContext";
import Profile from "./pages/Profile";
import PrivateRoutes from "./components/Auth/PrivateRoutes.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <div className="App font-body bg-teal-50">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/profile/:id" element={<Profile />}/>
            </Route>
            <Route path="*" element={<NotFound />}/>
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
