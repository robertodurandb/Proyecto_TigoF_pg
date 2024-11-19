import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';

//OBTENER FECHA ACTUAL
let fechaactual = `${API.DATENOW}`
let horaactual = `${API.TIMENOW}`

function Contrato() {
    const [planes_idplanes, setPlanes_idplanes] = useState(1);
    const [cliente_dnicliente, setCliente_dnicliente] = useState("");
    const [num_contrato, setNum_contrato] = useState();
    const [fecha_contrato, setFecha_contrato] = useState(fechaactual);
    const [observacion, setObservacion] = useState("");
    const [fechaprog_instalacion, setFechaprog_instalacion] = useState(fechaactual);
    const [diapago, setDiapago] = useState(1);
    const [estadoc_instalacion, setEstadocinstalacion] = useState(1);
    const [estado, setEstado] = useState(2);
    const [estados, setEstados] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [instalado, setInstalado] = useState(false);

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
    const [telefonocli, setTelefonocli] = useState();
    const [fechanacimiento, setFechaNacimiento] = useState('2001-01-01');
    const [user_create, setUser_create] = useState();
    const [fecha_actual, setFecha_actual] = useState(fechaactual);
    const [hora_actual, setHora_actual] = useState(horaactual)
    const [nombre_estado, setNombre_estado] = useState("");
    const [detalle_estado, setDetalle_estado] = useState("");
    const [nuevo_estado, setNuevo_estado] = useState(3);


    const [fecha_createcli, setFecha_createcli] = useState("");

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalMostrar2, setModalMostrar2] = useState(false);
    const [modalMostrar3, setModalMostrar3] = useState(false);
    const [modalMostrar4, setModalMostrar4] = useState(false);


    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModal2 = () => setModalMostrar2(!modalMostrar2);
    const ventanaModal3 = () => setModalMostrar3(!modalMostrar3);
    const ventanaModal4 = () => setModalMostrar4(!modalMostrar4);

    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;
    let user = sessionStorage.getItem("currentUser");

    const agregarContrato=()=>{
      setEditar(false);
      ventanaModal();
  }
  const agregarCliente=()=>{
    ventanaModal2();
}
  const addcontrato = () => {
    Axios.post(ipbackend+"createcontrato", {
        planes_idplanes: planes_idplanes,
        cliente_dnicliente: cliente_dnicliente,
        num_contrato: num_contrato,
        fecha_contrato: fecha_contrato,
        observacion_contrato: observacion,
        fechaprog_instalacion: fechaprog_instalacion,
        diapago: diapago,
        estadoc_instalacion: estadoc_instalacion,
        estado_servicio: estado,
        fecha_create: fecha_actual,
        user_create: user_create,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getContratos();
        cerrarModalContrato();
        alert("Contrato Registrado con exito");
    }).catch((error) => {
      if (error.response && error.response.status === 400){
      alert("Error: "+error.response.data.error);
      console.log(error.response.data.error)
      }
      return error;
      });
  };
  /************************************ */
  const addcliente = () => {
    if (cliente_dnicliente.length>7) {

        Axios.post(ipbackend+"createcliente", 
          {  
              dnicliente: cliente_dnicliente,
              nombrecli: nombrecli,
              apellidocli: apellidocli,
              direccioncli: direccioncli,
              distritocli: distritocli,
              provinciacli: provinciacli,
              telefonocli: telefonocli,
              fecha_nacimiento: fechanacimiento,
              fecha_create: fecha_actual,
              user_create: user_create,
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(() => {
            getClientes();
            cerrarModalCliente();
            alert("Cliente Registrado con exito");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });  
      } else {
          alert("El Documento de Identidad debe tener minimo 8 caracteres")
      }
    } 

    const getContratos = async () => {
      try {
        const response = await Axios.get(ipbackend+'todocontratosactiv', {
          headers:{
              'Authorization': `Bearer ${token}`
          }
        }
        );
        setContratos(response.data);
        setUser_create(user);
        console.log(horaactual)
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
      }
    };

    const registrarCambioEstado = () => {
      Axios.post(ipbackend+"createcambioestado", 
        {  
            num_contrato: num_contrato,
            detalle: detalle_estado,
            estado_anterior: estado,
            estado_actual: nuevo_estado,
            user_create: user_create,
            fecha_create: fecha_actual,
            hora_create: hora_actual
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(Axios.put(ipbackend+"updatecontrato/"+num_contrato,
          {
            estado_servicio: nuevo_estado,
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }))
          .then(() => {
          getContratos();
          cerrarModalEstado();
          alert("Estado Servicio actualizado correctamente");
        }).catch((error) => {
          if (error.response && error.response.status === 400){
          alert("Error: "+error.response.data.error);
          console.log(error.response.data.error)
          }
          return error;
          });
    }

    function getEstados(){
      fetch(ipbackend+'getestados', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(response => response.json())
          .then(data => setEstados(data))
    }

  const editarContrato = (val)=>{
    setEditar(true);
    if (val.estadoc_instalacion==2) {
      setInstalado(true)
    }else{
      setInstalado(false)
    }

    setNum_contrato(val.num_contrato);
    setPlanes_idplanes(val.planes_idplanes);
    setCliente_dnicliente(val.cliente_dnicliente);
    setFecha_contrato(val.fecha_contrato);
    setObservacion(val.observacion_contrato);
    setFechaprog_instalacion(val.fechaprog_instalacion);
    setDiapago(val.diapago);
    setEstado(val.id_estado);
    setEstadocinstalacion(val.estadoc_instalacion);
    ventanaModal();
  }

  const update = () => {
    Axios.put(ipbackend+"updatecontrato/"+num_contrato, {
        planes_idplanes: planes_idplanes,
        observacion_contrato: observacion,
        fechaprog_instalacion: fechaprog_instalacion,
        diapago: diapago,
        //estado_servicio: estado,
        fecha_update: fecha_actual,
        user_update: user_create,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getContratos();
      cerrarModalContrato();
      alert("Contrato Actualizado con exito");
    }).catch((error) => {
      if (error.response && error.response.status === 400){
        alert("Error: "+error.response.data.error);
        console.log(error.response.data.error)
        }else if(error.response && error.response.status === 401){
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

const editarEstado = (val)=>{
  setNum_contrato(val.num_contrato);
  setCliente_dnicliente(val.cliente_dnicliente);
  setNombre_estado(val.nombre_estado);
  setEstado(val.id_estado);
  setHora_actual(horaactual);
  ventanaModal4();
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

/** VALIDAR SI EXISTE EL DNI Y SI TIENE CONTRATO***/
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
      setFecha_createcli(listaclientes[index].fecha_create)
    }
  }
}

  const limpiarcamposcontrato = ()=>{
    setPlanes_idplanes(1);
    setCliente_dnicliente("");
    setNum_contrato();
    setFecha_contrato(fechaactual);
    setObservacion("");
    setFechaprog_instalacion(fecha_actual);
    setDiapago("1");
    setEstadocinstalacion(1);
    setEstado(2);
    setEditar(false);
    setInstalado(false); 
    setUser_create(user);
    
  }
  const limpiarcamposcliente = () => {
    setCliente_dnicliente("");
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("");
    setTelefonocli("");
    setFechaNacimiento("2001-01-01");
    setFecha_createcli("");
  }
  const limpiarcamposclienteencontrado = () => {
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("");
    setTelefonocli("");
    setFechaNacimiento("2001-01-01");
    setFecha_createcli("");
    setUser_create(user);
  }
  const limpiarcampos_estado = () => {
    setCliente_dnicliente("");
    setNum_contrato("");
    setDetalle_estado("");
    setEstado(2);
    setNuevo_estado(3);
    setNombre_estado("");
    setUser_create(user);
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
  const cerrarModalEstado = ()=>{
    limpiarcampos_estado();
    ventanaModal4();
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
    getEstados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
      <h1 className="mb-3">Registro de Contratos</h1>
        <button type="button" className="btn btn-info" onClick={agregarContrato}>
          Registrar Nuevo Contrato
        </button>
        <br />
        <br />
        <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI' className='form-control border border-success'/>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Contrato</th>
              <th scope="col">dni_Cliente</th>
              <th scope="col">Plan</th>
              <th scope="col">Fecha Contrato</th>
              <th scope="col">Dia de pago</th>
              <th scope="col">Fec. Instalacion Programada</th>
              <th scope="col">Instalacion</th>
              <th scope="col">Servicio</th>
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
                  <td>{val.nombre_estadoinstalacion}</td>
                  <td>{val.nombre_estado}</td>
                  <td><button type="button" className="btn btn-info"
                      onClick={() => {editarContrato(val); }}>Edit</button>
                  </td>
                  <td><button type="button" className="btn btn-info"
                      onClick={() => {editarEstado(val); }}>E</button>
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
                <label for="num_contrato" className="form-label">Número de Contrato:</label>
                {editar ? (
                  <span className="input-group-text" id="basic-addon1">{num_contrato}</span>
                ) : (
                  <input type="number" value={num_contrato} onChange={(event) => {
                      setNum_contrato(event.target.value);
                    }}
                    className="form-control" id="num_contrato" placeholder="Ingrese numero de contrato" aria-describedby="basic-addon1"
                  ></input>
                )}
              </div>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">DNI:</label>
                { editar ? (
                  <span className="input-group-text" id="basic-addon1">{cliente_dnicliente}</span>
                ) : (
                  <input type="text" value={cliente_dnicliente} onChange={(event) => {setCliente_dnicliente(event.target.value);}}
                  className="form-control" id="dnicliente" placeholder="DNI del cliente" aria-describedby="basic-addon1"
                ></input>
                )}
                <div className="fw-bold">{errordni}</div>
                { editar ? (
                  null
                ) : (
                  <>
                  <button type="button" className="btn btn-secondary" onClick={validardnicliente}>validar DNI</button>
                &nbsp;
                <button type="button"  className="btn btn-secondary" onClick={agregarCliente}>Nuevo Cliente</button>
                  </>
                )}
              </div>
              <div className="mb-3">
                <label for="fecha_contrato" className="form-label">Fecha Contrato: </label>
                {editar ?(
                  <span className="input-group-text" id="basic-addon1">
                    {fecha_contrato}
                  </span>
                ):(
                  <input type="date" value={fecha_contrato} onChange={(event) => {setFecha_contrato(event.target.value);
                  }}
                  className="form-control" id="fecha_contrato" placeholder="Fecha Contrato" aria-describedby="basic-addon1"
                ></input>
                )}
              </div>
              <div className="mb-3">
                <label for="planes" className="form-label"> Plan: </label>                
                <select
                  className="form-control" aria-describedby="basic-addon1" key={planes_idplanes} value={planes_idplanes}
                  onChange={(event) => { setPlanes_idplanes(event.target.value);}}
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
                {
                  instalado?(
                    null
                  ):(
                  <div className="mb-3">
                    <label for="fecha_instalacion" className="form-label"> Fecha Instalacion programada: </label>
                    <input type="date" value={fechaprog_instalacion} onChange={(event) => {
                    setFechaprog_instalacion(event.target.value);
                  }}
                  className="form-control" id="fecha_instalacion" placeholder="fecha programada para instalar" aria-describedby="basic-addon1"
                ></input>
                </div>
                  )
                }
              
              <div className="mb-3">
                <label for="diapago" className="form-label">
                  Dia Pago:
                </label>
                <select value={diapago} onChange={(event) => {
                    setDiapago(event.target.value);
                  }}
                  className="form-control" id="diapago" aria-label="Dia Pago" aria-describedby="basic-addon1"
                >
                  <option>1</option>
                  <option>16</option>
                </select>
              </div>
              <div className="mb-3">
                <label for="observacion" className="form-label">
                  Observacion:
                </label>
                <input type="text" value={observacion}
                  onChange={(event) => { setObservacion(event.target.value); }}
                  className="form-control" id="observacion" placeholder="Ingrese Observacion" aria-describedby="basic-addon1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {
            editar ?
              <div>
                <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
              </div>
              :<button className="btn btn-success" onClick={addcontrato}>Registrar</button>
            }
            <button className="btn btn-danger" onClick={cerrarModalContrato}>Cerrar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalMostrar2} toggle={ventanaModal2}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Agregar/Modificar Cliente:</h4>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">DNI Cliente:</label>
                  <input type="text" value={cliente_dnicliente} onChange={(event) => {
                    setCliente_dnicliente(event.target.value);
                  }} className="form-control" id="dnicliente" placeholder="Ingrese Documento de Identidad" aria-describedby="basic-addon1">
                  </input>
              </div>
              <div className="mb-3">
                <label for="nombres" className="form-label">Nombres:</label>
                  <input type="text" value={nombrecli} onChange={(event) => {
                    setNombrecli(event.target.value);
                  }} className="form-control" id="nombres" placeholder="Nombres del Cliente" aria-describedby="basic-addon1">
                  </input>
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
                <label for="fechanacimiento" className="form-label">Fecha Nacimiento:</label>
                <input type="date" value={fechanacimiento} onChange={(event) => {
                    setFechaNacimiento(event.target.value);
                  }}
                  className="form-control" id="fechanacimiento" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="telefono2" className="form-label">Telefono:</label>
                <input type="number" value={telefonocli} onChange={(event) => {
                    setTelefonocli(event.target.value);
                  }}
                  className="form-control" id="telefono2" placeholder="Telefono del Cliente" aria-describedby="basic-addon1"
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
              <h4 className="">DNI encontrado en la Base de Datos Clientes!!</h4>
              <div className="mb-3">
                <label for="fecha_create" className="form-label">Fecha creación Cliente:</label>
                <span className="input-group-text" id="basic-addon1">{fecha_createcli}</span>
              </div>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">DNI:</label>
                <span className="input-group-text" id="basic-addon1">{cliente_dnicliente}</span>
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


        <Modal isOpen={modalMostrar4} toggle={ventanaModal4}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Modificar Estado Servicio:</h4>
              <div className="mb-3">
                <label for="numcontrato" className="form-label">Contrato:</label>
                <span className="input-group-text" id="basic-addon1">
                    {num_contrato}
                  </span>
              </div>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">DNI Cliente:</label>
                <span className="input-group-text" id="basic-addon1">
                    {cliente_dnicliente}
                  </span>
              </div>
              <div className="mb-3">
                <label for="nombre_estadoanterior" className="form-label">Estado Anterior:</label>
                <span className="input-group-text" id="basic-addon1">
                    {nombre_estado}
                  </span>
              </div>
              <div className="mb-3">
                <label for="nombres" className="form-label">Detalle:</label>
                  <input type="text" onChange={(event) => {
                    setDetalle_estado(event.target.value);
                  }} className="form-control" id="detalle_estado" placeholder="Detalle del cambio estado" aria-describedby="basic-addon1">
                  </input>
              </div>
              <div className="mb-3">
                <label for="nuevo_estado" className="form-label">Nuevo Estado:</label>
                <div className="mb-3">
                <select
                            className="form-control"
                            aria-describedby="basic-addon1"
                            key={nuevo_estado}
                            value={nuevo_estado}
                            onChange={(event) => {
                              setNuevo_estado(event.target.value);
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
             
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={registrarCambioEstado}>
              Registrar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalEstado}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

    </div>
  );
}
export default Contrato;