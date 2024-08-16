import React, { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from '../utils/const'

function Usuarios() {
    const [dniuser, setDniuser] = useState("");
    const [nombre_user, setNombreuser] = useState("");
    const [apellido_user, setApellidouser] = useState("");
    const [perfil_user, setPerfiluser] = useState("User");
    const [password, setPassword] = useState("");
    const [estado_user, setEstado] = useState("Activo");
    const [usuarios, setUsuarios] = useState([]);
    const [editar, setEditar] = useState(false);

    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;

  const add = () => {
    Axios.post(ipbackend+"usuario",{
      dniuser: dniuser,
      nombre_user: nombre_user,
      apellido_user: apellido_user,
      perfil_user: perfil_user,
      password: password,
      estado_user: estado_user,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getUsers();
        limpiarcampos();
        alert("Usuario registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  const getUsers = () => {
    Axios.get(ipbackend+"usuarios").then((response) => {
        setUsuarios(response.data);
    });
  };
  const editarUser = (val)=>{
    setEditar(true);
    setDniuser(val.dniuser);
    setNombreuser(val.nombre_user);
    setApellidouser(val.apellido_user);
    setPerfiluser(val.perfil_user);
    setEstado(val.estado_user);
  }
  const update = () => {
    Axios.put(ipbackend+"usuario/"+dniuser, {
        dniuser: dniuser,
        nombre_user: nombre_user,
        apellido_user: apellido_user,
        perfil_user: perfil_user,
        estado_user: estado_user,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getUsers();
      limpiarcampos();
      alert("Usuario Actualizado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  const limpiarcampos = ()=>{
    setDniuser("");
    setNombreuser("");
    setApellidouser("");
    setPerfiluser("User");
    setPassword("");
    setEstado("Activo");
    setEditar(false);
  }

  return (
    <div className="Container">
      <div className="card text-center">
        <h1 className="card-header">Gestion de Usuarios</h1>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Usuario:
            </span>
            <input type="text" value={dniuser}
              onChange={(event) => { setDniuser(event.target.value); }}
              className="form-control" placeholder="Ingrese Usuario" aria-label="dni" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre Usuario:
            </span>
            <input type="text" value={nombre_user}
              onChange={(event) => { setNombreuser(event.target.value); }}
              className="form-control" placeholder="Ingrese Nombres" aria-label="Nombre" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Apellido Usuario:
            </span>
            <input type="text" value={apellido_user}
              onChange={(event) => { setApellidouser(event.target.value); }}
              className="form-control" placeholder="Ingrese Apellidos" aria-label="Apellido" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Perfil:
            </span>
            <select value={perfil_user}
              onChange={(event) => { setPerfiluser(event.target.value); }}
              className="form-control" aria-label="Velocidad" aria-describedby="basic-addon1"
              >
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Password:
            </span>
            <input type="password" value={password}
              onChange={(event) => { setPassword(event.target.value); }}
              className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Estado:
            </span>
            <select value={estado_user}
            onChange={(event) => { setEstado(event.target.value); }}
            className="form-control" aria-label="Estado" aria-describedby="basic-addon1"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          {
            editar? 
            <div>
            <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
            <button className="btn btn-info m-2" onClick={limpiarcampos}>Cancelar</button>
            </div>
            :<button className="btn btn-success" onClick={add}>Registrar</button>
          }
          
        </div>
        <div className="lista">
          <button className="btn btn-info" onClick={getUsers}>
            Editar Datos
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Nombres</th>
              <th scope="col">Apellidos</th>
              <th scope="col">Perfil</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
          {usuarios.map((val, key) => {
            return <tr key={val.dniuser}>
                    <td>{val.dniuser}</td>
                    <td>{val.nombre_user}</td>
                    <td>{val.apellido_user}</td>
                    <td>{val.perfil_user}</td>
                    <td>{val.estado_user}</td>
                    <td>
                    <button type="button" className="btn btn-info" 
                    onClick={()=>{
                      editarUser(val);
                    }}>
                      Editar
                    </button>
                    </td>
            </tr>
           
          })}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usuarios;