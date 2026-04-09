import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import FooterBar from "./components/FooterBar.tsx";

import Home from "./routes/Home";
import Contact from "./routes/Contact";
import About from "./routes/About";
import Jsypa from "./routes/jsypa";

function App() {

  return (
    <div>
      <NavBar/>
    
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/apropos" element={<About/>}/>
        <Route path="/jsypa" element={<Jsypa/>}/>
      </Routes>

      <footer>
        <FooterBar/>
      </footer>
    </div>
    
  );

}

export default App;
