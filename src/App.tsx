import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Job from "./Pages/Jobs/Job";
import Internship from "./Pages/Internship/Internship";
import Admin from "./Pages/Admin/Admin";
import Padmin from "./Pages/AdminPanel/Padmin";
import Pinternship from "./Pages/PostInternship/pInternship";
import Pjob from "./Pages/PostJob/pJob";
import ViewApplication from "./Pages/Applications/viewApplication";
import Vapplication from "./Pages/ViewApplication";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Job" element={<Job />} />
        <Route path="/Internship" element={<Internship/>}/>
        <Route path="/Admin" element={<Admin/>}/>
        <Route path="/adminPanel" element={<Padmin/>}/>
        <Route path="/postInternship" element={<Pinternship/>}/> 
        <Route path="/postJob" element={<Pjob/>}/>  
        <Route path="/viewApplication" element={<ViewApplication/>}/> 
        <Route path="/view-application/:id" element={<Vapplication/>}/>  
      </Routes>
    </div>
  );
}

export default App;
