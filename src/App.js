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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenuPrincipal = () => {
    setIsOpenbutton(!isOpenbutton);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenbutton(false);
        setIsOpen(false);
      }
    };
  
    // Solo agregamos los listeners si el menú está abierto
    if (isOpenbutton || isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
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
          <li>
            <Link to="/" className="links1" role='button' onClick={() => setIsOpen(false)}>Consultas</Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/Ordenes_Trabajo" className="links1" role='button' onClick={() => setIsOpen(false)}>Ordenes_Trabajo</Link>
            </li>
          )}
          <li>
            <Link to="/Instalaciones" className="links1" role='button' onClick={() => setIsOpen(false)}>Instalaciones</Link>
          </li>
        </ul>

        <div className='burger' aria-label='Abrir menu de navegacion' 
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

// function App() {
//   const [logged, setLogged] = useState(false)
//   const [User, setUser] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isOpenbutton, setIsOpenbutton] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   function checkLogin() {
//     let token = sessionStorage.getItem('token')

//     if (token) {
//       setLogged(true)
//     } else {
//       setLogged(false)
//     }
//     setUser(sessionStorage.getItem('currentUser'));
//   }

//   function isAdmin() {
//     let role = sessionStorage.getItem("role");
//     return role === "Admin";
//   }

//   // Manejar el toggle del menú
//   const toggleMenuPrincipal = () => {
//     setIsOpenbutton(!isOpenbutton);
//   };


  // useEffect(() => {
  //   checkLogin();
  //   // Cierra el menú al hacer clic/touch fuera
  //   const handleInteractionOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpenbutton(false);
  //       setIsOpen(false);
  //     }
  //   };

  //   // Agregamos múltiples tipos de eventos
  //   const events = ["mousedown", "touchstart"];

  //   if (isOpenbutton) {
  //     events.forEach((event) => {
  //       document.addEventListener(event, handleInteractionOutside);
  //     });
  //   }
  //   return () => {
  //     events.forEach((event) => {
  //       document.removeEventListener(event, handleInteractionOutside);
  //     });
  //   };
  // }, [isOpenbutton]);

//   function signOut() {

//     sessionStorage.removeItem("token")
//     sessionStorage.removeItem("currentUser")
//     sessionStorage.removeItem("role")
//     // checkLogin()
//     setLogged(false);
//     navigate('/');
//   }

//   return (
//     <div className='main1'>
//       {logged ? (
//         <Router>
//           <nav className="navbar1">
//             <div className='logo'>TIGO</div>
//             <ul className={isOpen ? 'nav-links2' : 'nav-links1'}>
//               <li>
//                 <Link to="/" className="links1" role='button' onClick={() => setIsOpen(false)}>Consultas</Link>
//               </li>
//               <li>
//                 <Link to="/Ordenes_Trabajo" className="links1" role='button' onClick={() => setIsOpen(false)}>Ordenes_Trabajo</Link>
//               </li>
//               <li>
//                 <Link to="/Instalaciones" className="links1" role='button' onClick={() => setIsOpen(false)}>Instalaciones</Link>
//               </li>
//               {/* <li>
//                     <Link to="/ControlPagos" className="links1">Pagos</Link>
//                   </li>
//                   <li>
//                     <Link to="/Pagos" className="links1">Importar</Link>
//                   </li> */}
//               {/* <li>
//                     <Link to="/Tickets" className="links1">Tickets</Link>
//                   </li> */}
//             </ul>

//             <div className='burger' aria-label='Abrir menu de navegacion' onClick={toggleMenu}>
//               <div className='line'></div>
//               <div className='line'></div>
//               <div className='line'></div>
//               {/**/}

//             </div>
//             <div ref={dropdownRef} className="dropdown">
//               <button class="dropdown-button" onClick={toggleMenuPrincipal}
//               >
//                 {User}{isOpenbutton ? '▲' : '▼'}
//               </button>
//               {isOpenbutton && (
//                 <div className="dropdown-content">
//                   {isAdmin() && (
//                     <>
//                       <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}><Link className='text-decoration-none text-reset' to="/usuarios">
//                         Tabla Usuarios
//                       </Link></button>
//                       <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}><Link className='text-decoration-none text-reset' to="/planes">
//                         Tabla Planes
//                       </Link></button>
//                       <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}><Link className='text-decoration-none text-reset' to="/cliente">
//                         Tabla Clientes
//                       </Link></button>
//                       <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}><Link className='text-decoration-none text-reset' to="/sedes">
//                         Tabla Sedes
//                       </Link></button>
//                     </>
//                   )}

//                   {/* <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/cortes">
//                         Control de Cambios
//                       </Link></button>
//                       <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/logs">
//                         Logs Errores (Import)
//                       </Link></button> */}
//                   <button className="dropdown-item" onClick={() => setIsOpenbutton(false)}><Link className='text-decoration-none text-reset' to="/Passwordupdate">
//                     Cambio de contraseña
//                   </Link>
//                   </button>
//                   <hr className='dropdown-item'></hr>
//                   <button className="dropdown-item" onClick={signOut}>Cerrar Sesión</button>
//                 </div>
//               )}
//             </div>
//           </nav>
//           {/* {isOpen ? 
//               (<>
//               <hr />
//               <hr />
//               <hr />
//               <hr />
//               <hr />
//               <hr />
//               <hr />

//               </>):null} */}
//           {/* <hr /> */}

//           <Routes>
//             <Route path="/Ordenes_Trabajo" element={
//               <ProtectedRoute requiredRole="Admin">
//                 <Ordenes_Transporte />
//               </ProtectedRoute>
//             } />
//             <Route path="/Pagos" element={<ImportPagos />} />
//             <Route path="/ControlPagos" element={<ControlPagos />} />
//             <Route path="/cliente" element={<Clientes />} />
//             <Route path="/cortes" element={<Cortes />} />
//             <Route path="/logs" element={<Logs />} />
//             <Route path="/Instalaciones" element={<Instalacion />} />
//             <Route path="/passwordupdate" element={<Passwordupdate />} />
//             {/* <Route path="/tickets" element={<Gestiontickets />} /> */}
//             <Route path="/planes" element={
//               <ProtectedRoute requiredRole={"Admin"}>
//                 <Planes />
//               </ProtectedRoute>
//             }/>
//             <Route path="/usuarios" element={
//               <ProtectedRoute requiredRole={"Admin"}>
//                 <Usuarios />
//               </ProtectedRoute>
//             }/>
//             <Route path="/sedes" element={
//               <ProtectedRoute requiredRole={"Admin"}>
//                 <Sedes />
//               </ProtectedRoute>
//             }/>
//             <Route path="/" element={<Consultas />} />
//           </Routes>
//         </Router>
//       )
//         :
//         (
//           <Login loginCallback={checkLogin}></Login>
//         )
//       }
//     </div>

//   );

// }

// export default App;
