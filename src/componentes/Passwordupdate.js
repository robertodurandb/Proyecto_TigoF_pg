import React, { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from '../utils/const'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function Passwordupdate() {
  const [newpassword1, setPassword1] = useState();
  const [newpassword2, setPassword2] = useState();
  const [errorPassword, setErrorPassword] = useState();

let ipbackend = `${API.URL}`
let token = sessionStorage.getItem("token");
let user = sessionStorage.getItem("currentUser")

//Funcion de Busqueda
const handlePassword1 = (e) =>{
  setPassword1(e.target.value);
}
const handlePassword2 = (e) =>{
  setPassword2(e.target.value);
}

  const updatePassword = async () => {
    try {
      if (newpassword1 == newpassword2) {
        console.log("las contraseñas coinciden");
        const response = await Axios.put(ipbackend+'updatepassword/'+user, {
          password_user: newpassword2
        }, {
          headers:{
              'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          alert("contraseña cambiada con exito")
          setPassword1("");
          setPassword2("");
          console.log(response)
        });
      } else {
        setErrorPassword("Las contraseñas no coinciden, verificar!!")
        setTimeout(() => {
          setErrorPassword("");
        }, "3000");
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
                  <label for="inputPassword" className="col-form-label" >Nueva Contraseña:</label>
                  <input type="password" className="form-control" id="inputPassword" value={newpassword1} onChange={handlePassword1}/>
                </div>
                <div className="mb-3 row">
                  <label for="inputPassword" className="col-form-label">Repita Nueva Contraseña:</label>
                  <input type="password" className="form-control" id="inputPassword" value={newpassword2} onChange={handlePassword2}/>
                </div>
                <div className="mb-3 row fw-bold">
                  {errorPassword}
                </div>
          </div>
          <div className='text-center'>
                <button type="button" className="btn btn-primary mt-3" onClick={updatePassword}>Guardar</button>

                  {/* <button type="button" className="btn btn-primary mt-3 ms-3">Salir</button> */}

                
          </div>
        </div>
   
)

}

export default Passwordupdate;