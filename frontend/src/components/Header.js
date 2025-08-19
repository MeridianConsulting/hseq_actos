import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo_meridian.png';
import { isAuthenticated, getUser, logout, isAdmin, isSupport, isCollaborator } from '../utils/auth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detectar si estamos en el dashboard
  const isDashboard = location.pathname.includes('/dashboard') || 
                     location.pathname.includes('/support') || 
                     location.pathname.includes('/collaborator');

  // Detectar scroll para cambiar la apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Obtener usuario al cargar
  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  // Renderizar navegación según el rol
  const renderNavLinks = () => {
    if (!isAuthenticated() || !user) {
      return (
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
          <li><Link to="/servicios" onClick={closeMenu}>Servicios</Link></li>
          <li><Link to="/nosotros" onClick={closeMenu}>Nosotros</Link></li>
          <li><Link to="/contacto" onClick={closeMenu}>Contacto</Link></li>
        </ul>
      );
    }

    // Navegación para usuarios autenticados según rol
    if (isAdmin()) {
      return (
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/dashboard" onClick={closeMenu} className={location.pathname === '/dashboard' ? 'active' : ''}>
              <i className="fas fa-chart-line"></i>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" onClick={closeMenu} className={location.pathname === '/admin/users' ? 'active' : ''}>
              <i className="fas fa-users"></i>
              Usuarios
            </Link>
          </li>
          <li>
            <Link to="/notifications" onClick={closeMenu} className={location.pathname === '/notifications' ? 'active' : ''}>
              <i className="fas fa-bell"></i>
              Notificaciones
            </Link>
          </li>
          <li className="user-menu">
            <span className="user-name">
              <i className="fas fa-user-circle"></i>
              {user.nombre}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      );
    }

    if (isSupport()) {
      return (
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/support" onClick={closeMenu} className={location.pathname === '/support' ? 'active' : ''}>
              <i className="fas fa-headset"></i>
              Soporte
            </Link>
          </li>
          <li>
            <Link to="/notifications" onClick={closeMenu} className={location.pathname === '/notifications' ? 'active' : ''}>
              <i className="fas fa-bell"></i>
              Notificaciones
            </Link>
          </li>
          <li className="user-menu">
            <span className="user-name">
              <i className="fas fa-user-circle"></i>
              {user.nombre}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      );
    }

    if (isCollaborator()) {
      return (
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/collaborator" onClick={closeMenu} className={location.pathname === '/collaborator' ? 'active' : ''}>
              <i className="fas fa-clipboard-list"></i>
              Mis Reportes
            </Link>
          </li>
          <li className="user-menu">
            <span className="user-name">
              <i className="fas fa-user-circle"></i>
              {user.nombre}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      );
    }

    // Fallback para roles no reconocidos
    return (
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li className="user-menu">
          <span className="user-name">
            <i className="fas fa-user-circle"></i>
            {user.nombre}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    );
  };

  return (
    <header className={`main-header ${isDashboard ? 'dashboard-header' : ''} ${isScrolled ? 'scrolled' : ''}`} id="header">
      <div className="header-container">
        <div className="logo">
          <Link to={isAuthenticated() ? (isAdmin() ? '/dashboard' : isSupport() ? '/support' : '/collaborator') : '/'} onClick={closeMenu}>
            <img className="navbar-logo" src={logo} alt="Meridian Consulting" />
          </Link>
        </div>
        <nav>
          {renderNavLinks()}
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
