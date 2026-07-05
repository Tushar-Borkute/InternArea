import NavBar from "./components/navBar";
import Home from "./components/home";
import TrustedCompanies from "./components/TrustedCompanies";
import Jobs from "./components/Jobs";
function App() {
  return (
    <div className="App">
      <NavBar />
      <Home />
      <TrustedCompanies />
      <Jobs />
    </div>
  );
}

export default App;
