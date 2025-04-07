import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const'

function Sedes() {
    const [idsede, setIdsede] = useState();
    const [nombresede, setNombresede] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [estadosede, setEstadosede] = useState(1);
    const [distritosede, setDistritosede] = useState("");
    const [estados, setEstados] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [editar, setEditar] = useState(false);

    const [modalMostrar, setModalMostrar] = React.useState(false);

    const maxLength = 5;
    const maxLengthNombre = 20;

    const ventanaModal = () => setModalMostrar(!modalMostrar);

    const agregarSede=()=>{
      ventanaModal();
  }
    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;

  const add = () => {
    Axios.post(ipbackend+"createsede", {
      nombre_sede: nombresede,
      empresa: empresa,
      distritosede: distritosede,
      estado: estadosede,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getSedes();
        limpiarcampos();
        alert("Sede Registrada con exito");
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

const getSedes = async () => {
  try {
    const response = await Axios.get(ipbackend+'getsedes', {
      headers:{
          'Authorization': `Bearer ${token}`
      }
    }
    );
    setSedes(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response && error.response.status === 401){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
  }
};

  const editarSede = (val)=>{
    setEditar(true);
    setIdsede(val.id_sede);
    setNombresede(val.nombre_sede);
    setEmpresa(val.empresa);
    setEstadosede(val.estado);
    setDistritosede(val.distritosede);
    ventanaModal();
    }

  
  const update = () => {
    Axios.put(ipbackend+"updatesede/"+idsede, {
        nombre_sede: nombresede,
        empresa: empresa,
        distritosede: distritosede,
        estado: estadosede,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getSedes();
      limpiarcampos();
      alert("Sede Actualizada con exito");
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
    setIdsede("");
    setNombresede("");
    setEmpresa("");
    setDistritosede("");
    setEstadosede(1);
    setEditar(false);
    ventanaModal();
  }
      useEffect(() =>{
        getSedes()
        getEstados()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div className="App">
      <h1 className="mb-3">Tabla Sedes</h1>
      <button type="button" className="btn btn-info" onClick={agregarSede}>
        Registrar Nueva Sede
      </button>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre Sede</th>
              <th scope="col">Empresa</th>
              <th scope="col">Distrito Sede</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.map((val, key) => {
              return (
                <tr key={val.id_sede}>
                  <td>{val.nombre_sede}</td>
                  <td>{val.empresa}</td>
                  <td>{val.distritosede}</td>
                  <td>{val.nombre_estado}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        editarSede(val);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalMostrar} toggle={ventanaModal}>
        <ModalBody>
          <div className="from-group">
            <h4 className="">Agregar/Modificar Sede:</h4>
            <div className="mb-3">
              <label for="nombresede" className="form-label">
                Nombre Sede:
              </label>
              <input
                type="text"
                value={nombresede}
                onChange={(event) => {
                  setNombresede(event.target.value);
                }}
                maxLength={maxLengthNombre} // Esto evita que se ingrese mas caracteres
                className="form-control"
                id="nombresede"
                placeholder="Ingrese Nombre Sede"
                aria-describedby="basic-addon1"
              ></input>
              <div>
                {nombresede.length} caracteres
              </div>
              {nombresede.length >= maxLengthNombre && (
                <div style={{ color: "red" }}>
                  Has alcanzado el límite de caracteres
                </div>
              )}
            </div>
            <div className="mb-3">
              <label for="empresa" className="form-label">
                Empresa:
              </label>
              <input
                type="text"
                value={empresa}
                onChange={(event) => {
                  setEmpresa(event.target.value);
                }}
                maxLength={maxLength} // Esto evita que se ingrese más caracteres
                className="form-control"
                id="empresa"
                placeholder="V&K O TIGO"
                aria-describedby="basic-addon1"
              ></input>
              <div>
                {empresa.length} caracteres
              </div>
              {empresa.length >= maxLength && (
                <div style={{ color: "red" }}>
                  Has alcanzado el límite de caracteres
                </div>
              )}
            </div>
            <div className="mb-3">
              <label for="distritosede" className="form-label">
                Distrito Sede:
              </label>
              <input
                type="text"
                value={distritosede}
                onChange={(event) => {
                  setDistritosede(event.target.value);
                }}
                maxLength="45" // Esto evita que se ingrese más caracteres
                className="form-control"
                id="empresa"
                placeholder="Ingrese algún distrito"
                aria-describedby="basic-addon1"
              ></input>
            </div>
            <div className="mb-3">
              <label for="estado" className="form-label">
                Estado:
              </label>
              <select
                className="form-control"
                aria-describedby="basic-addon1"
                key={estadosede}
                value={estadosede}
                onChange={(event) => {
                  setEstadosede(event.target.value);
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
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>
                Actualizar
              </button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={add}>
              Registrar
            </button>
          )}
          <button className="btn btn-danger" onClick={limpiarcampos}>
            Cerrar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Sedes;