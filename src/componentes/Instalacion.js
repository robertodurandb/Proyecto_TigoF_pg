import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';


//FUNCION PARA OBTENER FECHA ACTUAL
let fechaactual = "";
let fecha = new Date();
let dia = fecha.getDate("dd");
let mes = (fecha.getMonth("mm"))+1;
let anioactual = fecha.getFullYear();
let texdia = "";
let texmes = "";
if (dia < 10) {
  texdia = "-0"
}else{
  texdia = "-"
}
if (mes < 10) {
  texmes = "-0"
}else{
  texmes = "-"
}
fechaactual = anioactual + texmes + mes + texdia + dia;

function Instalacion() {
    const [idinstalacion, setIdinstalacion] = useState();
    const [fechainstalacion, setFechainstalacion] = useState(fechaactual);
    const [numcontrato, setNumcontrato] = useState();
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [observacion, setObservacion] = useState();
    const [editar, setEditar] = useState(false);
    const [instalaciones, setInstalaciones] = useState([]);

    // const [apellidoscliente, setApellidoscliente] = useState();
    // const [nombrescliente, setNombrescliente] = useState();
    // const [dnicliente, setDnicliente] = useState();
    // const [listacontratos, setListacontratos] = useState();

    const [modalMostrar, setModalMostrar] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser")
    let ipbackend = "http://michel.zapto.org:9100/";

    const addinstalaciones = () => {
        Axios.post(ipbackend+"instalacion", {
            fechainstalacion: fechainstalacion,
            numcontrato: numcontrato,
            geolocalizacion: geolocalizacion,
            observacion: observacion,
            tecnico: user,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
            getInstalaciones();
            limpiarcampos();
            alert("Instalacion Registrada con exito");
        }).catch((error) => {
          if (401 === error.response.status){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };

     
    //   const getContratos = () => {
    //     Axios.get(ipbackend+"todolist").then((response) => {
    //       setListacontratos(response.data);
    //     });
    //   };

    function getInstalaciones(){
      fetch(ipbackend+'instalaciones')
          .then(response => response.json())
          .then(data => setInstalaciones(data))
  }

      const editarInstalacion = (val)=>{
        setEditar(true);
        setIdinstalacion(val.idinstalacion)
        setFechainstalacion(val.fechainstalacion);
        setNumcontrato(val.numcontrato);
        setGeolocalizacion(val.geolocalizacion);
        setObservacion(val.observacion);
      }
      const update = () => {
        Axios.put(ipbackend+"instalacion/"+idinstalacion, {
            fechainstalacion: fechainstalacion,
            numcontrato: numcontrato,
            geolocalizacion: geolocalizacion,
            observacion: observacion,
            user_update: user,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          getInstalaciones();
          limpiarcampos();
          alert("Instalacion actualizada con exito");
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
        setIdinstalacion();
        setFechainstalacion(fechaactual);
        setNumcontrato("");
        setGeolocalizacion("");
        setObservacion("");
        // setTecnico("");
        // setUsuarioactualiza("");
        setEditar(false);
      }
    
        useEffect(() =>{
          getInstalaciones();
          //getClientes();
          //getContratos();
      }, [])

      return (
        <div className="container">
          <h1>Instalaciones Pendientes</h1>
          <div className="container text-center">
            {/* <div className="card-header">Gestion de Instalaciones</div>
            <div className="card-body" id="Editarpago">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                    Fecha Instalacion:
                    </span>
                    <input type="text" value={fechainstalacion}
                    onChange={(event) => { setFechainstalacion(event.target.value); }}
                    className="form-control" placeholder="Fecha instalacion" aria-label="fecha instalacion" aria-describedby="basic-addon1"
                    ></input>
                </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Numero Contrato:
                </span>
                <input type="text" value={numcontrato}
                  onChange={(event) => { setNumcontrato(event.target.value); }}
                  className="form-control" placeholder="Ingrese número de contrato" aria-label="Numero Contrato" aria-describedby="basic-addon1"
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Geolocalizacion:
                </span>
                <input type="text" value={geolocalizacion}
                  onChange={(event) => { setGeolocalizacion(event.target.value); }}
                  className="form-control" placeholder="Ingrese ubicacion Maps" aria-label="" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Observación:
                </span>
                <input type="text" value={observacion}
                  onChange={(event) => { setObservacion(event.target.value); }}
                  className="form-control" placeholder="ejemplo: " aria-label="observacion" aria-describedby="basic-addon1"
                ></input>
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
              <button className="btn btn-info" onClick={getInstalaciones}>
                Editar Datos
              </button>
            </div> */}


            <table className="table table-striped">
              <thead>
                <tr> 
                    <th scope="col">ID Instalación</th>
                    <th scope="col">N° Contrato</th>
                    <th scope="col">Fecha instalación</th>
                    <th scope="col">Geolocalización</th>
                    <th scope="col">Observación</th>
                    <th scope="col">Técnico</th>
                    <th scope="col">Usuario Actualiza</th>
                    <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
              {instalaciones.map((val, key) => {
                return <tr key={val.idinstalacion}>
                        <td>{val.idinstalacion}</td>
                        <td>{val.numcontrato}</td>
                        <td>{val.fechainstalacion}</td>
                        <td>{val.geolocalizacion}</td>
                        <td>{val.observacion}</td>
                        <td>{val.tecnico}</td>
                        <td>{val.user_update}</td>
                        <td>
                        <button type="button" className="btn btn-info" 
                        onClick={()=>{
                          editarInstalacion(val);
                        }}>
                          <a href="#Editarinstalacion">Editar</a>
                        </button>
                        </td>
                </tr>
               
              })}      
              </tbody>
            </table>

            {/* <Modal isOpen={modalMostrar} toggle={ventanaModal}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Agregar/Modificar Contrato:</h4>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  Número de Contrato:
                </label>
                {editar ? (
                  <span className="input-group-text" id="basic-addon1">
                    {num_contrato}
                  </span>
                ) : (
                  <input type="text" value={num_contrato} onChange={(event) => {
                      setNum_contrato(event.target.value);
                    }}
                    className="form-control" id="num_contrato" placeholder="Ingrese numero de contrato" aria-describedby="basic-addon1"
                  ></input>
                )}
              </div>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">
                  DNI:
                </label>
                <input
                  type="text"
                  value={cliente_dnicliente}
                  onChange={(event) => {
                    setCliente_dnicliente(event.target.value);
                  }}
                  className="form-control"
                  id="dnicliente"
                  placeholder="DNI del cliente"
                  aria-describedby="basic-addon1"
                ></input>
                <div className="fw-bold">{errordni}</div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={validardnicliente}
                >
                  validar DNI
                </button>{" "}
                &nbsp;
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={agregarCliente}
                >
                  Nuevo Cliente
                </button>
                <br />
                
              </div>
              <div className="mb-3">
                <label for="planes" className="form-label">
                  Planes:
                </label>
                <select
                  className="form-control"
                  aria-describedby="basic-addon1"
                  key={planes_idplanes}
                  value={planes_idplanes}
                  onChange={(event) => {
                    setPlanes_idplanes(event.target.value);
                  }}
                >
                  {listaPlanes.map((planes) => {
                    return (
                      <>
                        <option value={planes.idplanes}>
                          {planes.nombreplan}
                        </option>
                      </>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label for="fecha_contrato" className="form-label">
                  Fecha Contrato:
                </label>
                <input
                  type="date"
                  value={fecha_contrato}
                  onChange={(event) => {
                    setFecha_contrato(event.target.value);
                  }}
                  className="form-control"
                  id="fecha_contrato"
                  placeholder="Fecha Contrato"
                  aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="observacion" className="form-label">
                  Observacion:
                </label>
                <input
                  type="text"
                  value={observacion}
                  onChange={(event) => {
                    setObservacion(event.target.value);
                  }}
                  className="form-control"
                  id="observacion"
                  placeholder="Ingrese Observacion"
                  aria-describedby="basic-addon1"
                ></input>
              </div>
              
              <div className="mb-3">
                <label for="fecha_instalacion" className="form-label">
                  Fecha Instalacion:
                </label>
                <input
                  type="date"
                  value={fecha_instalacion}
                  onChange={(event) => {
                    setFecha_instalacion(event.target.value);
                  }}
                  className="form-control"
                  id="fecha_instalacion"
                  placeholder="fecha programada para instalar"
                  aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="diapago" className="form-label">
                  Dia Pago:
                </label>
                <select
                  value={diapago}
                  onChange={(event) => {
                    setDiapago(event.target.value);
                  }}
                  className="form-control"
                  id="diapago"
                  aria-label="Dia Pago"
                  aria-describedby="basic-addon1"
                >
                  <option>1</option>
                  <option>16</option>
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
              <button className="btn btn-success" onClick={addcontrato}>
                Registrar
              </button>
            )}
            <button className="btn btn-danger" onClick={cerrarModalContrato}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal> */}

          </div>
        </div>
      );
}
export default Instalacion;