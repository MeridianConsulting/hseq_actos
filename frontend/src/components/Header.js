import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo_meridian.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="main-header" id="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img className="navbar-logo" src={logo} alt="Meridian Consulting" />
          </Link>
        </div>
        <nav>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/servicios" onClick={closeMenu}>Servicios</Link></li>
            <li><Link to="/nosotros" onClick={closeMenu}>Nosotros</Link></li>
            <li><Link to="/contacto" onClick={closeMenu}>Contacto</Link></li>
          </ul>
          <div className="menu-toggle" onClick={toggleMenu}>
            <div className={`hamburger ${menuOpen ? 'active' : ''}`}></div>
          </div>
          <div className={`menu-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
