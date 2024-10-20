import React, { useState, useEffect } from "react";
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
        Hola voy a cambiar mi contraseña
    </div>
)

}


export default Passwordupdate;