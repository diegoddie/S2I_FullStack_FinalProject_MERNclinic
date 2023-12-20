import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="App font-body bg-sky-50">
      <BrowserRouter> 
        <Navbar />
        <Home />
        <Footer />
      </BrowserRouter>
    </div>
  )
}
