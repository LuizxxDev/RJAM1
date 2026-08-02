// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sobre from './components/Sobre';
import Programacao from './components/Programacao';
import Local from './components/Local';
import Footer from './components/Footer';
import InscricaoPage from './components/InscricaoPage';
import AdminPage from './components/AdminPage';

// Componente da Página Principal (Home)
function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sobre />
      <Programacao />
      <Local />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/inscricao" element={<InscricaoPage />} />
      </Routes>
    </Router>
  );
}

export default App;