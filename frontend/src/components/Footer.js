import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Meridian Consulting LTDA</h3>
          <p>Soluciones integrales para la industria petrolera y de hidrocarburos</p>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Dirección: Cl. 67 #7-94, Bogotá, Colombia</p>
          <p>Teléfono: (571) 7469090 Ext 1190</p>
          <p>Email: info@meridianconsulting.com.co</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Meridian Consulting LTDA. Todos los derechos reservados.</p>
        <p>
          <Link to="/privacidad">Política de Privacidad</Link> | <Link to="/terminos">Términos de Uso</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
