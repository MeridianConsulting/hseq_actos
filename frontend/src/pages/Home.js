import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/styles.css';
const Home = () => {
  return (
    <>
    <Header />
    <div className="home-container">
      <h1>Página de Inicio</h1>
      <p>Bienvenido a la página principal</p>
    </div>    
    <Footer />
    </>

  );
};

export default Home; 