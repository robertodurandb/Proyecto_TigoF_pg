import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const'

function Usuarios() {
    const [iduser, setIduser] = useState("");
    const [nombre_user, setNombreuser] = useState("");
    const [apellido_user, setApellidouser] = useState("");
    const [perfil_user, setPerfiluser] = useState("User");
    const [password, setPassword] = useState("");
    const [estado_user, setEstado] = useState(1);
    const [estados, setEstados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [editar, setEditar] = useState(false);

    const [modalMostrar, setModalMostrar] = React.useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);

    const agregarUsuario=()=>{
      ventanaModal();
  }

    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;

  const add = () => {
    Axios.post(ipbackend+"createuser",{
      id_user: iduser,
      nombre_user: nombre_user,
      apellido_user: apellido_user,
      perfil_user: perfil_user,
      password_user: password,
      estado_user: estado_user,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getUsers();
        limpiarcampos();
        ventanaModal();
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

  const getUsers = async () => {
    try {
      const response = await Axios.get(ipbackend+'getusers', {
        headers:{
            'Authorization': `Bearer ${token}`
        }
      }
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401){
        sessionStorage.removeItem("token");
        window.location.reload();
        alert("Sesión expirada, vuelva a iniciar sesión");
        }
    }
  };

  function getEstados(){
    fetch(ipbackend+'getestados', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(response => response.json())
        .then(data => setEstados(data))
  }

  const editarUser = (val)=>{
    setEditar(true);
    setIduser(val.id_user);
    setNombreuser(val.nombre_user);
    setApellidouser(val.apellido_user);
    setPerfiluser(val.perfil_user);
    setEstado(val.estado_user);
    ventanaModal();
  }
  const update = () => {
    Axios.put(ipbackend+"updateuser/"+iduser, {
        id_user: iduser,
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
    setIduser("");
    setNombreuser("");
    setApellidouser("");
    setPerfiluser("User");
    setPassword("");
    setEstado(1);
    setEditar(false);
    ventanaModal();
  }

  useEffect(() =>{
    getUsers();
    getEstados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
      <h1 className="mb-3">Tabla de Usuarios</h1>
        <button type="button" className="btn btn-info" onClick={agregarUsuario}>Registrar Nuevo Usuario</button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Nombre Usuario</th>
              <th scope="col">Apellido Usuario</th>
              <th scope="col">Perfil</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {usuarios.map((val, key) => {
            return <tr key={val.id_user}>
                    <td>{val.id_user}</td>
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

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
                <ModalBody>
                <div className='from-group'>
                <h4 className=''>Agregar/Modificar Usuario:</h4>
                <div className='mb-3'>
                        <label for='usuario' className="form-label">Usuario:</label>
                        <input type="text" value={iduser}
                                onChange={(event) => { setIduser(event.target.value); }}
                                className="form-control" id="usuario" placeholder="Ingrese Id Usuario" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='nombre' className="form-label">
                          Nombre Usuario:
                        </label>
                        <input type="text" value={nombre_user}
                          onChange={(event) => { setNombreuser(event.target.value); }}
                          className="form-control" id="nombre" placeholder="Ingrese Nombres" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='apellido' className="form-label">
                          Apellido Usuario:
                        </label>
                        <input type="text" value={apellido_user}
                          onChange={(event) => { setApellidouser(event.target.value); }}
                          className="form-control" id="apellido" placeholder="Ingrese Apellidos" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='perfil' className="form-label">
                          Perfil:
                        </label>
                        <select value={perfil_user}
                          onChange={(event) => { setPerfiluser(event.target.value); }}
                          className="form-control" aria-label="Velocidad" aria-describedby="basic-addon1"
                          >
                          <option>User</option>
                          <option>Tecnico</option>
                          <option>Admin</option>
                        </select>
                </div>
                {
                  editar?
                  null
                  :
                  <div className="mb-3">
                          <label for='password' className="form-label">
                            Password:
                          </label>
                          <input type="password" value={password}
                            onChange={(event) => { setPassword(event.target.value); }}
                            className="form-control" id="password" placeholder="Password" aria-describedby="basic-addon1"
                          ></input>
                </div>
                }
                <div className="mb-3">
                          <label for='estado' className="form-label">
                            Estado:
                          </label>
                          <select
                            className="form-control"
                            aria-describedby="basic-addon1"
                            key={estado_user}
                            value={estado_user}
                            onChange={(event) => {
                              setEstado(event.target.value);
                            }}
                          >
                            {estados.map((estado) => {
                              return (
                                <>
                                  <option value={estado.id_estado}>
                                    {estado.nombre_estado}
                                  </option>
                                </>
                              );
                            })}
                          </select>                         
                </div>
                </div>
                </ModalBody>
                <ModalFooter>
                          {
                            editar? 
                            <div>
                            <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
                            </div>
                            :<button className="btn btn-success" onClick={add}>Registrar</button>
                          }
                    <button className='btn btn-danger' onClick={limpiarcampos}>Cerrar</button>
                </ModalFooter>
            </Modal>
    </div>
  );
}

export default Usuarios;