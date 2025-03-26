//import 'bootstrap/dist/css/bootstrap.css';
import './estilos/style.css';
// import Caja from '../src/componentes/Caja';
import Planes from '../src/componentes/Planes';
import Clientes from '../src/componentes/Cliente';
import Ordenes_Transporte from '../src/componentes/Ordenes_Transporte';
import Instalacion from '../src/componentes/Instalacion';
import Consultas from './componentes/Consulta';
// import Inicio from './componentes/Inicio';
import ImportPagos from '../src/componentes/ImportPagos';
import ControlPagos from '../src/componentes/ControlPagos';
import Passwordupdate from '../src/componentes/Passwordupdate';
import Gestiontickets from '../src/componentes/Gestiontickets';
import Cortes from '../src/componentes/Cortes_Activaciones';
import Logs from '../src/componentes/Logs_Carga';

import Usuarios from '../src/componentes/Usuario';
import Login from '../src/componentes/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import React, { useEffect } from 'react';

function App() {
  const [logged, setLogged] = React.useState(false)
  const [User, setUser] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenbutton, setIsOpenbutton] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  // Función para manejar el scroll
  // const handleScroll = () => {
  //   if (window.scrollY > 50 && isOpen) {
  //     setIsOpen(false);
  //   }
  // };

  function checkLogin() {
    let token = sessionStorage.getItem('token')

    if (token) {
        setLogged(true)
      }else {
        setLogged(false)
      }
      setUser(sessionStorage.getItem('currentUser'));
  }
  function isAdmin() {
    let role = sessionStorage.getItem("role");
    return role == "Admin";
}
  useEffect(() => {
    checkLogin();
    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  function signOut() {

    sessionStorage.removeItem("token")
    sessionStorage.removeItem("currentUser")
    sessionStorage.removeItem("role")
    checkLogin()
  }

  return (

    <div className='main1'>
      {  logged?
        (
        <Router>
              
              <nav className="navbar1">
                <div className='logo'>TIGO</div>
                <ul className={isOpen ? 'nav-links2':'nav-links1'}>
                  <li>
                    <Link to="/" className="links1">Consultas</Link>
                  </li>
                  <li>
                    <Link to="/Ordenes_Trabajo" className="links1">Ordenes_Trabajo</Link>
                  </li>
                  <li>
                    <Link to="/Instalaciones" className="links1" role='button'>Instalaciones</Link>
                  </li>
                  {/* <li>
                    <Link to="/ControlPagos" className="links1">Pagos</Link>
                  </li>
                  <li>
                    <Link to="/Pagos" className="links1">Importar</Link>
                  </li> */}
                  {/* <li>
                    <Link to="/Tickets" className="links1">Tickets</Link>
                  </li> */}
                </ul>

                  <div className='burger' aria-label='Abrir menu de navegacion' onClick={toggleMenu}>
                    <div className='line'></div>
                    <div className='line'></div>
                    <div className='line'></div>
                    {/**/}
                    
                  </div>
                  <div class="dropdown">
                    <button class="dropdown-button" onClick={() => setIsOpenbutton(!isOpenbutton)}>
                      {User}
                    </button>
                    {isOpenbutton && (
                      <div className="dropdown-content">
                      <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/usuarios">
                        Tabla Usuarios
                      </Link></button>
                      <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/planes">
                        Tabla Planes
                      </Link></button>
                      <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/cliente">
                        Tabla Clientes
                      </Link></button>
                      {/* <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/cortes">
                        Control de Cambios
                      </Link></button>
                      <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/logs">
                        Logs Errores (Import)
                      </Link></button> */}
                        <button className="dropdown-item"><Link className='text-decoration-none text-reset' to="/Passwordupdate">
                        Cambio de contraseña
                      </Link></button>
                      <hr className='dropdown-item'></hr>
                        <button className="dropdown-item" onClick={signOut}>Cerrar Sesión</button>
                    </div>
                    )}
                    


                    
                </div>

                  
                  
              </nav>
              {isOpen ? 
              (<>
              <hr />
              <hr />
              <hr />
              <hr />
              <hr />
              <hr />
              <hr />

              </>):null}
              {/* <hr /> */}
          
            <Routes>
                <Route path="/Ordenes_Trabajo" element={ isAdmin() ?(<Ordenes_Transporte />):null} />
            </Routes>
            <Routes>
                <Route path="/Pagos" element={<ImportPagos />} />
            </Routes>
            <Routes>
                <Route path="/ControlPagos" element={<ControlPagos />} />
            </Routes>
              <Routes>
                <Route path="/cliente" element={<Clientes />} />
              </Routes>
              <Routes>
                <Route path="/cortes" element={<Cortes />} />
              </Routes>
              <Routes>
                <Route path="/logs" element={<Logs />} />
              </Routes>
              <Routes>
                <Route path="/Instalaciones" element={<Instalacion />} />
              </Routes>
              <Routes>
                <Route path="/passwordupdate" element={<Passwordupdate />} />
              </Routes>
              {/* <Routes>
                <Route path="/tickets" element={<Gestiontickets />} />
              </Routes> */}
              <Routes>
                <Route path="/planes" element={ isAdmin() ?(<Planes />):null} />
              </Routes>
              <Routes>
              <Route path="/usuarios" element={ isAdmin() ?(<Usuarios />):null} />
            </Routes>
              <Routes>
                <Route path="/" element={ <Consultas />} />
            </Routes>
        </Router> 
          )
          :
          (
            <Login loginCallback={checkLogin}></Login>
          )
}
    </div>

  );

}

export default App;
