import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.bundle';
import Caja from '../src/componentes/Caja';
import Planes from '../src/componentes/Planes';
import Clientes from '../src/componentes/Cliente';
import Contratos from '../src/componentes/Contrato';
import Pagos from '../src/componentes/Pagos';
import Principal from '../src/componentes/Principal';
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

  function checkLogin() {
    let token = sessionStorage.getItem('token')
    if (token) {
      setLogged(true)
    } else {
      setLogged(false)
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
        {logged ?
        (
        <Router>
              <div className="btn-group">
                <Link to="/" className="btn btn-dark">
                  Principal
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
                <Link to="/caja" className="btn btn-dark">
                  Caja
                </Link>
                <Link to="/pagos" className="btn btn-dark">
                  Pagos
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
                <Route path="/cliente" element={<Clientes />} />
              </Routes>
              <Routes>
                <Route path="/planes" element={<Planes />} />
              </Routes>
              <Routes>
                <Route path="/caja" element={<Caja />} />
              </Routes>
              <Routes>
                <Route path="/pagos" element={<Pagos />} />
              </Routes>
              <Routes>
                <Route path="/usuario" element={<Usuarios />} />
              </Routes>
              <Routes>
                <Route path="/" element={<Principal />} />
              </Routes>
        </Router>
          )
          :
          (
            <Login loginCallback={checkLogin}></Login>
          )}
    </div>

  );

}

export default App;
