import 'bootstrap/dist/css/bootstrap.css';
// import Caja from '../src/componentes/Caja';
import Planes from '../src/componentes/Planes';
import Clientes from '../src/componentes/Cliente';
import Contratos from '../src/componentes/Contrato';
// import Pagos from '../src/componentes/Pagos';
import Instalacion from '../src/componentes/Instalacion';
import Inicio from '../src/componentes/Principal';
import Reportepagos from '../src/componentes/Consultapagos';
import Usuarios from '../src/componentes/Usuario';
import Login from '../src/componentes/Login';
//import Inicio from './Inicio/Inicio';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import React, { useEffect } from 'react';

function App() {
  const [logged, setLogged] = React.useState(false)
  const [logged2, setLogged2] = React.useState(false)

  function checkLogin() {
    let token = sessionStorage.getItem('token')
    let role = sessionStorage.getItem('role')
    if (token) {
        setLogged(true)
      }else {
        setLogged(false)
      }
    if (role == "Admin"){
      setLogged2(true)
    }else{
      setLogged2(false)
    }
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
              <div className="btn-group">
              <Link to="/" className="btn btn-dark">
                  Inicio
                </Link>
              {/* <Link to="/consultaclientes" className="btn btn-dark">
                  Consulta Clientes
                </Link> */}
                <Link to="/reportepagos" className="btn btn-dark">
                  Reporte Pagos
                </Link>
                <Link to="/contrato" className="btn btn-dark">
                  Contrato
                </Link>
                <Link to="/cliente" className="btn btn-dark">
                  Cliente
                </Link>
                <Link to="/planes" className="btn btn-dark">
                Planes
              </Link>
              {/* <Link to="/caja" className="btn btn-dark">
                Caja
              </Link> */}
              {/* <Link to="/pagos" className="btn btn-dark">
                Pagos
              </Link> */}
              <Link to="/instalacion" className="btn btn-dark">
                Instalaciones
              </Link>
              <Link to="/usuario" className="btn btn-dark">
                Usuario
              </Link>  
                
                <button onClick={signOut}>Cerrar Sesion</button>
              </div>
              <hr />

            <Routes>
                <Route path="/contrato" element={<Contratos />} />
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
                <Route path="/planes" element={logged2?<Planes />:alert("Acesso Restringido")} />
              </Routes>
              {/* <Routes>
                <Route path="/caja" element={logged2?<Caja />:null} />
              </Routes> */}
              {/* <Routes>
                <Route path="/pagos" element={logged2?<Pagos />:null} />
              </Routes> */}
              <Routes>
              <Route path="/usuario" element={logged2?<Usuarios />:null} />
            </Routes>     
              {/* <Routes>
                <Route path="/consultaclientes" element={<Principal />} />
              </Routes> */}
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
