import { Routes, Route } from "react-router";

import NavBar from "./components/NavBar";
import Home from "./routes/Home";
import Contact from "./routes/Contact";
import About from "./routes/About";

function App() {

  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/apropos" element={<About/>}/>
      </Routes>
    </div>
    
  );

}

export default App;