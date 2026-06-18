import { Navigate, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import FooterBar from "./components/FooterBar.tsx";

import Home from "./routes/Home";
import Contact from "./routes/Contact";
import About from "./routes/About";
import Jsypa from "./routes/jsypa.tsx";
import Train from "./routes/train.tsx";
import Voiture from "./routes/voiture.tsx";
import Avion from "./routes/avion.tsx";


function App() {

  return (
    <div>
      <NavBar/>
    
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/apropos" element={<About/>}/>
        <Route path="/jsypa" element={<Jsypa/>}/>
        <Route path="train" element={<Train/>}/>
        <Route path="/voiture" element={<Voiture/>}/>
        <Route path="/avion" element={<Avion/>}/>
      </Routes>

      <footer>
        <FooterBar/>
      </footer>
    </div>
    
  );

}

export default App;
