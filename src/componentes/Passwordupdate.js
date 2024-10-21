import React, { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from '../utils/const'

function Passwordupdate() {
    const [newpassword, setNewpassword] = useState();
const [modalMostrar, setModalMostrar] = useState(false);

let ipbackend = `${API.URL}`
let token = sessionStorage.getItem("token");
let user = sessionStorage.getItem("currentUser")

  const updatePassword = async () => {
    try {
      const response = await Axios.put(ipbackend+'updatepassword/'+user, {
        password_user: newpassword
      }, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
      }).then(() => {
        alert("contraseña cambiada con exito")
      });
    } catch (error) {
      console.error('Error updatepassword data:', error);
      // if (error.response && error.response.status === 401){
      //   sessionStorage.removeItem("token");
      //   window.location.reload();
      //   alert("Sesión expirada, vuelva a iniciar sesión");
      //   }
    }
}

return(
    <div>
        <div className='container-fluid login border border-secondary border-2 rounded p-3 m'>
                <div className='text-center pb-2'>
                  <h1>Modificar Contraseña</h1>
                </div>
                
                <div className="mb-3 row">
                  <label for="inputPassword" className="col-form-label">Nueva Contraseña:</label>
                  <input type="password" className="form-control" id="inputPassword"/>
                </div>
                <div className="mb-3 row">
                  <label for="inputPassword" className="col-form-label">Repita Nueva Contraseña:</label>
                  <input type="password" className="form-control" id="inputPassword"/>
                </div>
          </div>
          <div className='text-center'>
                <button type="button" className="btn btn-primary mt-3">Guardar</button>
          </div>
        </div>
   
)

}


export default Passwordupdate;