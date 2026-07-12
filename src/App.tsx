import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Job from "./Pages/Jobs/Job";
import Internship from "./Pages/Internship/Internship";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Job" element={<Job />} />
        <Route path="/Internship" element={<Internship/>}/>
      </Routes>
    </div>
  );
}

export default App;
