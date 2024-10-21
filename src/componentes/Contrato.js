import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';

//OBTENER FECHA ACTUAL
let fechaactual = `${API.DATENOW}`

function Contrato() {
    const [planes_idplanes, setPlanes_idplanes] = useState(1);
    const [cliente_dnicliente, setCliente_dnicliente] = useState("");
    const [num_contrato, setNum_contrato] = useState();
    const [fecha_contrato, setFecha_contrato] = useState(fechaactual);
    const [observacion, setObservacion] = useState("");
    const [fechaprog_instalacion, setFechaprog_instalacion] = useState("");
    const [diapago, setDiapago] = useState(1);
    const [contratos, setContratos] = useState([]);
    const [editar, setEditar] = useState(false);

    const [busqueda, setBusqueda] = useState("");

    //VALIDAR SI EXISTE EL DNI
    const [listaPlanes, setListaPlanes] = useState([]);
    const [listaclientes, setListaclientes] = useState([]);
    const [errordni, setErrordni] = useState();

    const [nombrecli, setNombrecli] = useState("");
    const [apellidocli, setApellidocli] = useState("");
    const [direccioncli, setDireccioncli] = useState("");
    const [distritocli, setDistritocli] = useState("");
    const [provinciacli, setProvinciacli] = useState("");
    const [nacionalidadcli, setNacionalidadcli] = useState("Peruana");
    const [telefonocli, setTelefonocli] = useState();
    const [telefonocli2, setTelefonocli2] = useState();

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalMostrar2, setModalMostrar2] = useState(false);
    const [modalMostrar3, setModalMostrar3] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModal2 = () => setModalMostrar2(!modalMostrar2);
    const ventanaModal3 = () => setModalMostrar3(!modalMostrar3);

    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;

    const agregarContrato=()=>{
      setEditar(false);
      ventanaModal();
  }
  const agregarCliente=()=>{
    ventanaModal2();
}
  const addcontrato = () => {
    Axios.post(ipbackend+"detallecontrato", {
        planes_idplanes: planes_idplanes,
        cliente_dnicliente: cliente_dnicliente,
        num_contrato: num_contrato,
        fecha_contrato: fecha_contrato,
        observacion: observacion,
        fechaprog_instalacion: fechaprog_instalacion,
        diapago: diapago,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getContratos();
        cerrarModalContrato();
        alert("Contrato Registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  /************************************ */
  const addcliente = () => {
    if (cliente_dnicliente.length>7) {
    Axios.post(ipbackend+"cliente", 
    {  
        dnicliente: cliente_dnicliente,
        nombrecli: nombrecli,
        apellidocli: apellidocli,
        direccioncli: direccioncli,
        distritocli: distritocli,
        provinciacli: provinciacli,
        nacionalidadcli: nacionalidadcli,
        telefonocli: telefonocli,
        telefonocli2: telefonocli2,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getClientes();
      cerrarModalCliente();
      alert("Cliente Registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  } else {
      alert("El Documento de Identidad debe tener mas de 7 caracteres")
  }
  };

  function getContratos(){
    fetch(ipbackend+"todocontratosactiv", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => setContratos(data))
    console.log(contratos[1])
    }

  const editarContrato = (val)=>{
    setEditar(true);

    setNum_contrato(val.num_contrato);
    setPlanes_idplanes(val.planes_idplanes);
    setCliente_dnicliente(val.cliente_dnicliente);
    setFecha_contrato(val.fecha_contrato);
    setObservacion(val.observacion);
    setFechaprog_instalacion(val.fechaprog_instalacion);
    setDiapago(val.diapago);
    ventanaModal();
  }
  const update = () => {
    Axios.put(ipbackend+"todocontratosactiv/"+num_contrato, {
        planes_idplanes: planes_idplanes,
        observacion: observacion,
        fechaprog_instalacion: fechaprog_instalacion,
        diapago: diapago,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getContratos();
      cerrarModalContrato();
      alert("Contrato Actualizado con exito");
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
    fetch(ipbackend+'getclientes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(response => response.json())
        .then(data => setListaclientes(data))
}
function getPlanes(){
  fetch(ipbackend+'getplanes', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
      .then(response => response.json())
      .then(data => setListaPlanes(data))
}

/** VALIDAR SI EXISTE EL DNI***/
function validardnicliente() {
  let index = listaclientes.findIndex(function(i){
    return i.dnicliente == cliente_dnicliente;
  });
  if (cliente_dnicliente.length <8) {
      setErrordni("debe introducir al menos 8 digitos");
    setTimeout(() => {
      setErrordni("");
    }, "3000");
  } else {
    setErrordni("");
    if (index == -1) {
      alert("El DNI ingresado no existe")
    } else {
      ventanaModal3();
      
      setApellidocli(listaclientes[index].apellidocli)
      setNombrecli(listaclientes[index].nombrecli)
      setDireccioncli(listaclientes[index].direccioncli)
      setDistritocli(listaclientes[index].distritocli)
      setTelefonocli(listaclientes[index].telefonocli)      
    }
  }
}

  const limpiarcamposcontrato = ()=>{
    setPlanes_idplanes(1);
    setCliente_dnicliente("");
    setNum_contrato();
    setFecha_contrato(fechaactual);
    setObservacion("");
    setFechaprog_instalacion("");
    setDiapago("1");
    setEditar(false); 
  }
  const limpiarcamposcliente = () => {
    setCliente_dnicliente("");
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("");
    setNacionalidadcli("Peruana");
    setTelefonocli("");
    setTelefonocli2("");
  }
  const limpiarcamposclienteencontrado = () => {
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("");
    setNacionalidadcli("Peruana");
    setTelefonocli("");
    setTelefonocli2("");
  }
  const cerrarModalContrato = ()=>{
    limpiarcamposcontrato();
    ventanaModal();
  }
  const cerrarModalCliente = ()=>{
    limpiarcamposcliente();
    ventanaModal2();
  }
  const cerrarModalClienteEncontrado = ()=>{
    limpiarcamposclienteencontrado();
    ventanaModal3();
  }

  //Funcion de Busqueda
  const searcher = (e) =>{
    setBusqueda(e.target.value);
    }
//Funcion de Filtrado
const newfilter = contratos.filter(dato => {
  return (
    dato.cliente_dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase())
)
});

let results = [];

if (busqueda === "") {
  results = contratos;
} else {
  results = newfilter;
}

    
  useEffect(() =>{
    getPlanes();
    getClientes();
    getContratos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
      <h1 className="mb-3">Gestión de Contratos</h1>
        <button type="button" className="btn btn-info" onClick={agregarContrato}>
          Registrar Nuevo Contrato
        </button>
        <br />
        <br />
        <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI' className='form-control border border-success'/>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">N° Contrato</th>
              <th scope="col">dni_Cliente</th>
              <th scope="col">Plan</th>
              <th scope="col">Fecha Contrato</th>
              <th scope="col">Dia de pago</th>
              <th scope="col">Fec. Instalacion Programada</th>
              <th scope="col">Estado Instalacion</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.map((val, key) => {
              return (
                <tr key={val.num_contrato}>
                  <td>{val.num_contrato}</td>
                  <td>{val.cliente_dnicliente}</td>
                  <td>{val.nombreplan}</td>
                  <td>{val.fecha_contrato}</td>
                  <td>{val.diapago}</td>
                  <td>{val.fechaprog_instalacion}</td>
                  <td>{val.estadoc_instalacion}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        editarContrato(val);
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

        <Modal isOpen={modalMostrar} toggle={ventanaModal}>
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
                  <input type="number" value={num_contrato} onChange={(event) => {
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
                { editar ? (
                  <span className="input-group-text" id="basic-addon1">
                  {cliente_dnicliente}
                </span>
                ) : (
                  <input type="text" value={cliente_dnicliente} onChange={(event) => {
                    setCliente_dnicliente(event.target.value);}}
                  className="form-control"
                  id="dnicliente"
                  placeholder="DNI del cliente"
                  aria-describedby="basic-addon1"
                ></input>
                )}
                  
                <div className="fw-bold">{errordni}</div>
                { editar ? (
                  null
                ) : (
                  <>
                  <button type="button" className="btn btn-secondary" onClick={validardnicliente}>
                  validar DNI
                </button>
                &nbsp;
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={agregarCliente}
                >
                  Nuevo Cliente
                </button>
                  </>
                )}
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
                {editar ?(
                  <span className="input-group-text" id="basic-addon1">
                    {fecha_contrato}
                  </span>
                ):(
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
                )}
                {/* <input
                  type="date"
                  value={fecha_contrato}
                  onChange={(event) => {
                    setFecha_contrato(event.target.value);
                  }}
                  className="form-control"
                  id="fecha_contrato"
                  placeholder="Fecha Contrato"
                  aria-describedby="basic-addon1"
                ></input> */}
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
                  Fecha Instalacion programada:
                </label>
                <span className="input-group-text" id="basic-addon1">
                    {fechaprog_instalacion}
                  </span>
                <input
                  type="date"
                  value={fechaprog_instalacion}
                  onChange={(event) => {
                    setFechaprog_instalacion(event.target.value);
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
        </Modal>

        <Modal isOpen={modalMostrar2} toggle={ventanaModal2}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Agregar/Modificar Cliente:</h4>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">
                  DNI Cliente:
                </label>
                <input type="text" value={cliente_dnicliente} onChange={(event) => {
                    setCliente_dnicliente(event.target.value);
                  }} className="form-control" id="dnicliente" placeholder="Ingrese Documento de Identidad" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="nombres" className="form-label">Nombres:</label>
                <input type="text" value={nombrecli} onChange={(event) => {
                    setNombrecli(event.target.value);
                  }} className="form-control" id="nombres" placeholder="Nombres del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="apellidos" className="form-label">Apellidos:</label>
                <input type="text" value={apellidocli} onChange={(event) => {
                    setApellidocli(event.target.value);
                  }} className="form-control" id="apellidos" placeholder="Apellidos del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="direccion" className="form-label">Direccion: </label>
                <input type="text" value={direccioncli} onChange={(event) => {
                    setDireccioncli(event.target.value);
                  }}
                  className="form-control" id="direccion" placeholder="Dirección del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="distrito" className="form-label"> Distrito:</label>
                <input type="text" value={distritocli} onChange={(event) => {
                    setDistritocli(event.target.value);
                  }}
                  className="form-control" id="distrito" placeholder="Ingrese Distrito" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="provincia" className="form-label">Provincia: </label>
                <input type="text" value={provinciacli} onChange={(event) => {
                    setProvinciacli(event.target.value);
                  }}
                  className="form-control" id="provincia" placeholder="Ingrese Provincia" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="nacionalidad" className="form-label">Nacionalidad:</label>
                <select value={nacionalidadcli} onChange={(event) => {
                    setNacionalidadcli(event.target.value);
                  }}
                  className="form-select" id="nacionalidad" aria-describedby="basic-addon1"
                >
                  <option>Peruana</option>
                  <option>Extranjera</option>
                </select>
              </div>
              <div className="mb-3">
                <label for="telefono1" className="form-label">Telefono 1:</label>
                <input type="number" value={telefonocli} onChange={(event) => {
                    setTelefonocli(event.target.value);
                  }}
                  className="form-control" id="telefono1" placeholder="Telefono del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="telefono2" className="form-label">Telefono 2:</label>
                <input type="number" value={telefonocli2} onChange={(event) => {
                    setTelefonocli(event.target.value);
                  }}
                  className="form-control" id="telefono2" placeholder="Telefono 2 del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={addcliente}>
              Registrar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalCliente}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalMostrar3} toggle={ventanaModal3}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Datos del Cliente encontrado:</h4>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">
                  DNI:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {cliente_dnicliente}
                  </span>
              </div>
              <div className="mb-3">
                <label for="nombres" className="form-label">
                  Nombres:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {apellidocli+" "+nombrecli}
                  </span>
              </div>
              <div className="mb-3">
                <label for="direccioncli" className="form-label">
                  Direccion:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {direccioncli}
                  </span>
              </div>
              <div className="mb-3">
                <label for="distritocli" className="form-label">
                  Distrito:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {distritocli}
                  </span>
              </div>
              <div className="mb-3">
                <label for="telefonocli" className="form-label">
                  Telefono:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {telefonocli}
                  </span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={cerrarModalClienteEncontrado}>Cerrar</button>
          </ModalFooter>
        </Modal>
    </div>
  );
}
export default Contrato;