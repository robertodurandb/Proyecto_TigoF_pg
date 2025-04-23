//import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect, useRef } from "react";
import './estilos/style.css';
// import Caja from '../src/componentes/Caja';
import Planes from '../src/componentes/Planes';
import Clientes from '../src/componentes/Cliente';
import Sedes from '../src/componentes/Sedes';
import Ordenes_Transporte from '../src/componentes/Ordenes_Transporte';
import Instalacion from '../src/componentes/Instalacion';
import Consultas from './componentes/Consulta';
// import Inicio from './componentes/Inicio';
import ImportPagos from '../src/componentes/ImportPagos';
import ControlPagos from '../src/componentes/ControlPagos';
import Passwordupdate from '../src/componentes/Passwordupdate';
// import Gestiontickets from '../src/componentes/Gestiontickets';
import Cortes from '../src/componentes/Cortes_Activaciones';
import Logs from '../src/componentes/Logs_Carga';

import Usuarios from '../src/componentes/Usuario';
import Login from '../src/componentes/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  Outlet
} from "react-router-dom";
import { Button } from "reactstrap";

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isLoggedIn = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

// Componente de layout para la estructura de la aplicación
const AppLayout = ({ children, user, signOut, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenbutton, setIsOpenbutton] = useState(false);
  const dropdownRef = useRef(null);
  const burgerRef = useRef(null);

  //MENU DEL BOTÓN HAMBURGUESA PARA CELULARES
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    // Cerramos el menú principal si está abierto
    if (isOpenbutton) setIsOpenbutton(false);
  };

  //MENU PRINCIPAL DE CONFIGURACIÓN Y TABLAS
  const toggleMenuPrincipal = () => {
    setIsOpenbutton(prev => !prev);
    // Cerramos el menú hamburguesa si está abierto
    if (isOpen) setIsOpen(false);
  };

  // Cerrar ambos menús
  const closeAllMenus = () => {
    //setIsOpen(false);
    setIsOpenbutton(false);
    console.log("se cierra solo el menu principal")
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (burgerRef.current && !burgerRef.current.contains(event.target)){
          console.log("se cierran todos los menús");
           closeAllMenus();
        }
      }
    };
  
    // Solo agregamos los listeners si el menú está abierto
    if (isOpenbutton || isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      console.log("se estan agregando los listeners xq el menu esta abierto")
      console.log("Boton hamburguesa is: "+isOpen)
      console.log("menu principal is: "+isOpenbutton)
    }
    return () => {
      // Limpiamos los listeners cuando el componente se desmonta o el estado cambia
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpenbutton, isOpen]); // Dependencias del efecto

  return (
    <>
      <nav className="navbar1">
        <div className='logo'>TIGO</div>
        <ul className={isOpen ? 'nav-links2' : 'nav-links1'}>
          
          {isAdmin && (
            <>
            <li>
            <Link to="/" className="links1" role='button' onClick={() => setIsOpen(false)}>Consultas</Link>
          </li>
          {/* <li>
            <Link to="/Cortes" className="links1" role='button' onClick={() => setIsOpen(false)}>Registro_Cortes</Link>
          </li> */}
            <li>
              <Link to="/Ordenes_Trabajo" className="links1" role='button' onClick={() => setIsOpen(false)}>Ordenes_Trabajo</Link>
            </li>

            </>
            
          )}
          <li>
            <Link to="/Instalaciones" className="links1" role='button' onClick={() => setIsOpen(false)}>Instalaciones</Link>
          </li>
        </ul>

        <div 
          className='burger' 
          aria-label='Abrir menu de navegacion' 
          ref={burgerRef}
          onClick={toggleMenu}
        >
          <div className='line'></div>
          <div className='line'></div>
          <div className='line'></div>
        </div>
        
        <div ref={dropdownRef} className="dropdown">
          <button className="dropdown-button" onClick={toggleMenuPrincipal}>
            {user}{isOpenbutton ? '▲' : '▼'}
          </button>
          {isOpenbutton && (
            <div className="dropdown-content">
              {isAdmin && (
                <>
                  <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}>
                    <Link className='text-decoration-none text-reset' to="/usuarios">
                      Tabla Usuarios
                    </Link>
                  </button>
                  <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}>
                    <Link className='text-decoration-none text-reset' to="/planes">
                      Tabla Planes
                    </Link>
                  </button>
                  <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}>
                    <Link className='text-decoration-none text-reset' to="/cliente">
                      Tabla Clientes
                    </Link>
                  </button>
                  <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}>
                    <Link className='text-decoration-none text-reset' to="/sedes">
                      Tabla Sedes
                    </Link>
                  </button>
                </>
              )}
              <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}>
                <Link className='text-decoration-none text-reset' to="/Passwordupdate">
                  Cambio de contraseña
                </Link>
              </button>
              <hr className='dropdown-item'></hr>
              <button className="dropdown-item" onClick={signOut}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </nav>
      {children}
    </>
  );
};

function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  function checkLogin() {
    const token = sessionStorage.getItem('token');
    if (token) {
      setLogged(true);
    } else {
      setLogged(false);
    }
    setUser(sessionStorage.getItem('currentUser'));
  }

  function isAdmin() {
    const role = sessionStorage.getItem("role");
    return role === "Admin";
  }

  function signOut() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("role");
    setLogged(false);
    navigate('/');
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div className='main1'>
      {logged ? (
        <AppLayout user={user} signOut={signOut} isAdmin={isAdmin()}>
          <Routes>
            <Route path="/" element={<Consultas />} />
            
            <Route element={<ProtectedRoute requiredRole="Admin" />}>
              <Route path="/Ordenes_Trabajo" element={<Ordenes_Transporte />} />
              <Route path="/cliente" element={<Clientes />} />
              <Route path="/cortes" element={<Cortes />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/planes" element={<Planes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/sedes" element={<Sedes />} />
            </Route>
            
            <Route path="/Instalaciones" element={<Instalacion />} />
            <Route path="/passwordupdate" element={<Passwordupdate />} />
            <Route path="/Pagos" element={<ImportPagos />} />
            <Route path="/ControlPagos" element={<ControlPagos />} />
            
            <Route path="/unauthorized" element={<div>No tienes permisos para acceder a esta página</div>} />
          </Routes>
        </AppLayout>
      ) : (
        <Login loginCallback={checkLogin} />
      )}
    </div>
  );
}

// Componente raíz que envuelve todo con Router
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}