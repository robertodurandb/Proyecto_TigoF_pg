//import 'bootstrap/dist/css/bootstrap.css';
import './estilos/style.css';
// import Caja from '../src/componentes/Caja';
import Planes from '../src/componentes/Planes';
import Clientes from '../src/componentes/Cliente';
import Contratos from '../src/componentes/Contrato';
import Instalacion from '../src/componentes/Instalacion';
import Consultas from './componentes/Consulta';
import Inicio from './componentes/Inicio';
import Reportepagos from '../src/componentes/Consultapagos';
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
                    <Link to="/" className="links1">Inicio</Link>
                  </li>
                  <li>
                    <Link to="/Consultas" className="links1">Consultas</Link>
                  </li>
                  <li>
                    <Link to="/Contratos" className="links1">Contratos</Link>
                  </li>
                  <li>
                    <Link to="/Instalaciones" className="links1" role='button'>Instalaciones</Link>
                  </li>
                  <li>
                    <Link to="/Pagos" className="links1">Pagos</Link>
                  </li>
                  <li>
                    <Link to="/Tickets" className="links1">Gestión de Tickets</Link>
                  </li>

                

                  </ul>
                  <div className='burger' aria-label='Abrir menu de navegacion' onClick={toggleMenu}>
                    <div className='line'></div>
                    <div className='line'></div>
                    <div className='line'></div>
                  </div>

                  {/* <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    {User}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><button className="dropdown-item"><Link className='text-decoration-none' to="/usuarios">
                    Tabla Usuarios
                  </Link></button></li>
                  <li><button className="dropdown-item"><Link className='text-decoration-none' to="/planes">
                    Tabla Planes
                  </Link></button></li>
                  <li><button className="dropdown-item"><Link className='text-decoration-none' to="/cliente">
                    Tabla Clientes
                  </Link></button></li>
                  <li><button className="dropdown-item"><Link className='text-decoration-none' to="/cortes">
                    Cortes/Activ
                  </Link></button></li>
                  <li><button className="dropdown-item"><Link className='text-decoration-none' to="/logs">
                    Logs Errores
                  </Link></button></li>
                    <li><button className="dropdown-item"><Link className='text-decoration-none' to="/Passwordupdate">
                    Cambio de contraseña
                  </Link></button></li>
                    <li><button className="dropdown-item" onClick={signOut}>Cerrar Sesión</button></li>
                  </ul>
                </div> */}
                  
              </nav>
              {isOpen ? 
              (<>
              <hr />
              <hr />
              <hr />
              <hr />
              <hr />
              </>):null}
              {/* <hr /> */}
            
            <Routes>
                <Route path="/Consultas" element={ <Consultas />} />
            </Routes>
            <Routes>
                <Route path="/Contratos" element={ isAdmin() ?(<Contratos />):null} />
            </Routes>
            <Routes>
                <Route path="/Pagos" element={<Reportepagos />} />
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
              <Routes>
                <Route path="/tickets" element={<Gestiontickets />} />
              </Routes>
              <Routes>
                <Route path="/planes" element={ isAdmin() ?(<Planes />):null} />
              </Routes>
              <Routes>
              <Route path="/usuarios" element={ isAdmin() ?(<Usuarios />):null} />
            </Routes>
              <Routes>
                <Route path="/" element={<Inicio />} />
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
