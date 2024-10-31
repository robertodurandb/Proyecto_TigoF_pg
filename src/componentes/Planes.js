import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const'

function Planes() {
    const [idplanes, setIdplanes] = useState();
    const [nombreplan, setNombreplan] = useState("");
    const [descplan, setDescplan] = useState("");
    const [precioplan, setPrecioplan] = useState();
    const [velocidadplan, setVelocidadplan] = useState("");
    const [estado, setEstado] = useState(1);
    const [estados, setEstados] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [editar, setEditar] = useState(false);

    const [modalMostrar, setModalMostrar] = React.useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);

    const agregarPlan=()=>{
      ventanaModal();
  }
    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;

  const add = () => {
    Axios.post(ipbackend+"createplan", {
      nombreplan: nombreplan,
      descplan: descplan,
      precioplan: precioplan,
      velocidadplan: velocidadplan,
      estado_plan: estado,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getPlanes();
        limpiarcampos();
        alert("Plan Registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
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

const getPlanes = async () => {
  try {
    const response = await Axios.get(ipbackend+'getplanes', {
      headers:{
          'Authorization': `Bearer ${token}`
      }
    }
    );
    setPlanes(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response && error.response.status === 401){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
  }
};

  const editarPlan = (val)=>{
    setEditar(true);
    setIdplanes(val.idplanes);
    setNombreplan(val.nombreplan);
    setDescplan(val.descplan);
    setPrecioplan(val.precioplan);
    setVelocidadplan(val.velocidadplan)
    setEstado(val.estado_plan);
    ventanaModal();
    }

  
  const update = () => {
    Axios.put(ipbackend+"updateplan/"+idplanes, {
        nombreplan: nombreplan,
        descplan: descplan,
        precioplan: precioplan,
        velocidadplan: velocidadplan,
        estado_plan: estado,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getPlanes();
      limpiarcampos();
      alert("Plan Actualizado con exito");
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
    setIdplanes("");
    setNombreplan("");
    setDescplan("");
    setPrecioplan("");
    setVelocidadplan("");
    setEstado(1);
    setEditar(false);
    ventanaModal();
  }
      useEffect(() =>{
        getPlanes()
        getEstados()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div className="App">
      <h1 className="mb-3">Gestion de Planes</h1>
        <button type="button" className="btn btn-info" onClick={agregarPlan}>Registrar Nuevo Plan</button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre Plan</th>
              <th scope="col">Descripción</th>
              <th scope="col">Precio</th>
              <th scope="col">Velocidad</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {planes.map((val, key) => {
            return <tr key={val.idplanes}>
                    <td>{val.nombreplan}</td>
                    <td>{val.descplan}</td>
                    <td>{val.precioplan}</td>
                    <td>{val.velocidadplan}</td>
                    <td>{val.nombre_estado}</td>
                    <td>
                    <button type="button" className="btn btn-info" 
                    onClick={()=>{
                      editarPlan(val);
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
                <h4 className=''>Agregar/Modificar Plan:</h4>
                <div className='mb-3'>
                        <label for='nombreplan' className="form-label">Nombre Plan:</label>
                        <input type="text" value={nombreplan}
                                onChange={(event) => { setNombreplan(event.target.value); }}
                                className="form-control" id="nombreplan" placeholder="Ingrese Nombre del Plan" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='descplan' className="form-label">
                          Descripción Plan:
                        </label>
                        <input type="text" value={descplan}
                          onChange={(event) => { setDescplan(event.target.value); }}
                          className="form-control" id="descplan" placeholder="Ingrese la descripción del plan" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='precioplan' className="form-label">
                          Precio Plan:
                        </label>
                        <input type="text" value={precioplan}
                          onChange={(event) => { setPrecioplan(event.target.value); }}
                          className="form-control" id="precioplan" placeholder="Ingrese Precio del plan" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='velocidadplan' className="form-label">
                          Velocidad Plan:
                        </label>
                        <input type="text" value={velocidadplan}
                          onChange={(event) => { setVelocidadplan(event.target.value); }}
                          className="form-control" id="velocidadplan" placeholder="Ingrese Velocidad del plan" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                          <label for='estado' className="form-label">
                            Estado:
                          </label>
                          <select
                            className="form-control"
                            aria-describedby="basic-addon1"
                            key={estado}
                            value={estado}
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

export default Planes;