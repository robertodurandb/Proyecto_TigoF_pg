import 'bootstrap/dist/css/bootstrap.css';
// import Caja from '../src/componentes/Caja';
// import Planes from '../src/componentes/Planes';
import Clientes from '../src/componentes/Cliente';
import Contratos from '../src/componentes/Contrato';
import Instalacion from '../src/componentes/Instalacion';
import Inicio from '../src/componentes/Principal';
import Reportepagos from '../src/componentes/Consultapagos';
import Passwordupdate from '../src/componentes/Passwordupdate';
import Gestiontickets from '../src/componentes/Gestiontickets';

// import Upload from '../src/componentes/Upload';
//import Usuarios from '../src/componentes/Usuario';
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
  const [User, setUser] = React.useState("")

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
    checkLogin()
  }, [])

  function signOut() {

    sessionStorage.removeItem("token")
    sessionStorage.removeItem("currentUser")
    sessionStorage.removeItem("role")
    checkLogin()
  }

  return (

    <div className="container-xl">
      {  logged?
        (
       
        <Router>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className='container'>
                  <Link to="/" className="btn navbar-brand">
                    Inicio
                  </Link>
                  <Link to="/reportepagos" className="btn navbar-brand">
                    Reporte Pagos
                  </Link>

                  
                  {isAdmin()?(
                    <>
                    <Link to="/contrato" className="btn navbar-brand">
                    Contrato
                  </Link>
                  {/* <Link to="/planes" className="btn navbar-brand">
                  Planes
                  </Link> */}
                  {/* <Link to="/usuario" className="btn navbar-brand">
                    Usuario
                  </Link> */}
                    </>
                  ):null}
                <Link to="/instalacion" className="btn navbar-brand" role='button'>
                  Instalaciones
                </Link>
                <Link to="/tickets" className="btn navbar-brand">
                    Gestión de Tickets
                  </Link>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    {User}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><button className="dropdown-item"><Link className='text-decoration-none' to="/cliente">
                    Tabla Clientes
                  </Link></button></li>
                    <li><button className="dropdown-item"><Link className='text-decoration-none' to="/Passwordupdate">
                    Cambio de contraseña
                  </Link></button></li>
                    <li><button className="dropdown-item" onClick={signOut}>Cerrar Sesión</button></li>
                  </ul>
                </div>
                  </div>
              
              </nav>
              <hr />

            <Routes>
                <Route path="/contrato" element={ isAdmin() ?(<Contratos />):null} />
            </Routes>
            <Routes>
                <Route path="/reportepagos" element={<Reportepagos />} />
            </Routes>
              <Routes>
                <Route path="/cliente" element={<Clientes />} />
              </Routes>
              <Routes>
                <Route path="/instalacion" element={<Instalacion />} />
              </Routes>
              <Routes>
                <Route path="/passwordupdate" element={<Passwordupdate />} />
              </Routes>
              <Routes>
                <Route path="/tickets" element={<Gestiontickets />} />
              </Routes>
              {/* <Routes>
                <Route path="/planes" element={ isAdmin() ?(<Planes />):null} />
              </Routes> */}
              {/* <Routes>
                <Route path="/caja" element={logged2?<Caja />:null} />
              </Routes> */}
              {/* <Routes>
              <Route path="/usuario" element={ isAdmin() ?(<Usuarios />):null} />
            </Routes>      */}
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
