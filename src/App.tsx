import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Home from "./Pages/Home/Home";
import Job from "./Pages/Jobs/Job";
import Internship from "./Pages/Internship/Internship";
import Admin from "./Pages/Admin/Admin";
import Padmin from "./Pages/AdminPanel/Padmin";
import Pinternship from "./Pages/PostInternship/pInternship";
import Pjob from "./Pages/PostJob/pJob";
import ViewApplication from "./Pages/Applications/viewApplication";
import Vapplication from "./Pages/ViewApplication/index";
import JobDetail from "./Pages/JobDetail/JobDetail";
import InternshipDetail from "./Pages/InternshipDetail/InternshipDetail";
import Profile from "./Pages/Profile/Profile";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Job" element={<Job />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/Internship" element={<Internship />} />
          <Route path="/internship/:id" element={<InternshipDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/adminPanel" element={<Padmin />} />
          <Route path="/postInternship" element={<Pinternship />} />
          <Route path="/postJob" element={<Pjob />} />
          <Route path="/viewApplication" element={<ViewApplication />} />
          <Route path="/view-application/:id" element={<Vapplication />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
