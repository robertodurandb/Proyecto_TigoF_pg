import React, { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from '../utils/const'

function Passwordupdate() {
  const [newpassword1, setPassword1] = useState();
  const [newpassword2, setPassword2] = useState();

let ipbackend = `${API.URL}`
let token = sessionStorage.getItem("token");
let user = sessionStorage.getItem("currentUser")

function handlePassword1Changed (e) {
  setPassword1(e.target.value)
}
function handlePassword2Changed (e) {
  setPassword2(e.target.value)
}

  const updatePassword = async () => {
    try {
      if (newpassword1 == newpassword2) {
        console.log("las contraseñas coinciden");
        console.log("password1: "+newpassword1)
        console.log("password2: "+newpassword2)
        const response = await Axios.put(ipbackend+'updatepassword/'+user, {
          password_user: newpassword2
        }, {
          headers:{
              'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          alert("contraseña cambiada con exito")
          console.log(response)
        });
      } else {
        console.log("las contraseñas no coinciden, verificar!!")
      }
      
    } catch (error) {
      console.error('Error updatepassword data:', error);
    }
}


return(
    <div>
        <div className='container-fluid login border border-secondary border-2 rounded p-3 m'>
                <div className='text-center pb-2'>
                  <h1>Modificar Contraseña</h1>
                </div>
                
                <div className="mb-3 row">
                  <label for="inputPassword" className="col-form-label"  onChange={handlePassword1Changed}>Nueva Contraseña:</label>
                  <input type="password" className="form-control" id="inputPassword"/>
                </div>
                <div className="mb-3 row">
                  <label for="inputPassword" className="col-form-label"  onChange={handlePassword2Changed}>Repita Nueva Contraseña:</label>
                  <input type="password" className="form-control" id="inputPassword"/>
                </div>
          </div>
          <div className='text-center'>
                <button type="button" className="btn btn-primary mt-3" onClick={updatePassword}>Guardar</button>
          </div>
        </div>
   
)

}


export default Passwordupdate;