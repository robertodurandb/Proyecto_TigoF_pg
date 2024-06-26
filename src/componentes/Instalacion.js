import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';


function Instalacion() {

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

    const [listaClientes, setListaClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const [num_contrato, setNum_contrato] = useState();
    const [nombrecli, setNombrecli] = useState();
    const [dnicliente, setDnicliente] = useState();
    const [idinstalacion, setIdinstalacion] = useState();
    const [fechainstalacion, setFechainstalacion] = useState(fechaactual);
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
    let ipbackend = "https://michel.zapto.org:9100/";

    const addinstalaciones = () => {
        Axios.post(ipbackend+"instalacion", {
            fechainstalacion: fechainstalacion,
            num_contrato: num_contrato,
            geolocalizacion: geolocalizacion,
            observacion: observacion,
            tecnico: user,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
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

    function getClientes(){
      fetch(ipbackend+'todolist')
          .then(response => response.json())
          .then(data => setListaClientes(data))
  }

  //   function getInstalaciones(){
  //     fetch(ipbackend+'instalaciones')
  //         .then(response => response.json())
  //         .then(data => setInstalaciones(data))
  // }

      const editarInstalacion = (val)=>{
        setEditar(true);
        setIdinstalacion(val.idinstalacion)
        setFechainstalacion(val.fechainstalacion);
        setNum_contrato(val.num_contrato);
        setGeolocalizacion(val.geolocalizacion);
        setObservacion(val.observacion);
      }
      const update = () => {
        Axios.put(ipbackend+"instalacion/"+idinstalacion, {
            fechainstalacion: fechainstalacion,
            num_contrato: num_contrato,
            geolocalizacion: geolocalizacion,
            observacion: observacion,
            user_update: user,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
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
        setNum_contrato("");
        setGeolocalizacion("");
        setObservacion("");
        // setTecnico("");
        // setUsuarioactualiza("");
        setEditar(false);
      }

      //Funcion de Busqueda
    const searcher = (e) =>{
      setBusqueda(e.target.value);
      }
  //Funcion de Filtrado
   const newfilter = listaClientes.filter(dato => {
      return (
  dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase())
  )
  });

  let results = [];
  
  if (busqueda === "") {
      results = listaClientes;
  } else {
      results = newfilter;
  }
    
        useEffect(() =>{
          // getInstalaciones();
          getClientes();
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
        <div className="App">
          <h1 className="mb3">Gestión de Instalaciones</h1>
          <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por: DNI/Apellidos/Dirección' className='form-control border border-success'/>
            <table className="table table-striped table-hover mt-5 shadow-lg">
              <thead>
                <tr className="bg-curso text-white"> 
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Distrito</th>
                            <th>Direccion</th>
                            {/* <th>Instalacion</th>
                            <th></th> */}
                </tr>
              </thead>
              <tbody>
              {listaClientes.map((cliente, key)=>(
                            <tr key={cliente.num_contrato} value={num_contrato}>
                                <td>{cliente.dnicliente}</td>
                                <td>{cliente.apellidocli}</td>
                                <td>{cliente.nombrecli}</td>
                                <td>{cliente.distritocli}</td>
                                <td>{cliente.direccioncli}</td>
                                {/* <td>{cliente.instalacion}</td>
                                <td><button type="button" className="btn btn-outline-success" 
                                onClick={()=>{capturarID(cliente);
                                }}>Detalles</button></td>
                                <td><button type='button' className='btn btn-outline-success'
                                onClick={()=>{capturarIDpago(cliente);
                                }}>Pagos</button></td> */}
                            </tr>
                    ))}  
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
      )
}
export default Instalacion;