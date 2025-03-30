import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';

//OBTENER FECHA ACTUAL
let fechaactual = `${API.DATENOW}`

function Ordenes_Transporte() {
    const [planes_idplanes, setPlanes_idplanes] = useState(1);
    const [cliente_dnicliente, setCliente_dnicliente] = useState("");
    const [id_ordentrabajo, setId_ordentrabajo] = useState();
    const [observacion, setObservacion] = useState("");
    const [fechaprog_instalacion, setFechaprog_instalacion] = useState(fechaactual);
    const [horario_instalacion, setHorario_instalacion] = useState("8am - 1pm")
    const [diapago, setDiapago] = useState(1);
    const [estadoc_instalacion, setEstadocinstalacion] = useState(1);
    const [costo_instalacion, setCosto_instalacion] = useState()
    const [ordenes, setOrdenes] = useState([]);
    const [editar, setEditar] = useState(false);
    const [instalado, setInstalado] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const maxLengthDireccion = 100;
    const maxLengthReferencia = 45;
    const maxLengthIndicaciones = 100;

    //VALIDAR SI EXISTE EL DNI
    const [listaPlanes, setListaPlanes] = useState([]);
    const [listaclientes, setListaclientes] = useState([]);
    const [errordni, setErrordni] = useState();

    const [nombrecli, setNombrecli] = useState("");
    const [apellidocli, setApellidocli] = useState("");
    const [direccioncli, setDireccioncli] = useState("");
    const [distritocli, setDistritocli] = useState("");
    const [provinciacli, setProvinciacli] = useState("Lima");
    const [telefonocli, setTelefonocli] = useState();
    const [referenciacli, setReferenciacli] = useState('');
    const [geolocalizacion, setGeolocalizacion] = useState('');
    const [user_create, setUser_create] = useState();
    const [fecha_actual, setFecha_actual] = useState(fechaactual);
    const [fecha_createcli, setFecha_createcli] = useState("");

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalMostrar2, setModalMostrar2] = useState(false);
    const [modalMostrar3, setModalMostrar3] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModal2 = () => setModalMostrar2(!modalMostrar2);
    const ventanaModal3 = () => setModalMostrar3(!modalMostrar3);

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
  const addordentrabajo = () => {
    Axios.post(ipbackend+"createordentrabajo", {
        planinicial_idplanes: planes_idplanes,
        clienteinicial_dnicliente: cliente_dnicliente,
        indicacion_instalacion: observacion,
        fechaprog_instalacion: fechaprog_instalacion,
        horario_instalacion: horario_instalacion,
        diapago: diapago,
        costo_instalacion: costo_instalacion,
        estado_instalacion: estadoc_instalacion,
        fecha_create: fecha_actual,
        user_create: user_create,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getOrdenes();
        cerrarModalContrato();
        alert("OT Registrado con exito");
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
      let newgeo = contieneBarra();
        Axios.post(ipbackend+"createcliente", 
          {  
              dnicliente: cliente_dnicliente,
              nombrecli: nombrecli,
              apellidocli: apellidocli,
              direccioncli: direccioncli,
              distritocli: distritocli,
              provinciacli: provinciacli,
              telefonocli: telefonocli,
              referenciacli: referenciacli,
              geolocalizacion: newgeo,
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
            agregarContrato();
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

    const getOrdenes = async () => {
      try {
        const response = await Axios.get(ipbackend+'orders_pending', {
          headers:{
              'Authorization': `Bearer ${token}`
          }
        }
        );
        setOrdenes(response.data);
        setUser_create(user);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
      }
    };

  const editarOrden = (val)=>{
    setEditar(true);
    setId_ordentrabajo(val.id_ordentrabajo);
    setPlanes_idplanes(val.planinicial_idplanes);
    setCliente_dnicliente(val.clienteinicial_dnicliente);
    setObservacion(val.indicacion_instalacion);
    setFechaprog_instalacion(val.fechaprog_instalacion);
    setDiapago(val.diapago);
    setHorario_instalacion(val.horario_instalacion);
    setCosto_instalacion(val.costo_instalacion);
    ventanaModal();
  }

  const update = () => {
    Axios.put(ipbackend+"updateordentrabajo/"+id_ordentrabajo  , {
        planinicial_idplanes: planes_idplanes,
        indicacion_instalacion: observacion,
        fechaprog_instalacion: fechaprog_instalacion,
        horario_instalacion: horario_instalacion,
        costo_instalacion: costo_instalacion,
        diapago: diapago,
        fecha_update: fecha_actual,
        user_update: user_create,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getOrdenes();
      cerrarModalContrato();
      alert("OT Actualizada con exito");
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
      alert("El DNI ingresado no existe, puede usted continuar registrando..")
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
    setId_ordentrabajo();
    setObservacion("");
    setFechaprog_instalacion(fecha_actual);
    setDiapago("1");
    setHorario_instalacion("8-12");
    setCosto_instalacion();
    setEstadocinstalacion(1);
    setEditar(false);
    setUser_create(user);
    
  }
  const limpiarcamposcliente = () => {
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("Lima");
    setReferenciacli("");
    setGeolocalizacion("");
    setTelefonocli("");
    setFecha_createcli("");
  }
  const limpiarcamposclienteencontrado = () => {
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("Lima");
    setTelefonocli("");
    setFecha_createcli("");
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

    //FUNCION PARA GEOLOCALIZACION
    function contieneBarra() {
      if (geolocalizacion.includes('/')) {
        console.log("si incluye /")
        let newgeo = geolocalizacion.replace("/",",");
        return(newgeo)
      } else {
        console.log("no incluye /")
        return(geolocalizacion)
      }
    }

  //Funcion de Busqueda
  const searcher = (e) =>{
    setBusqueda(e.target.value);
    }
//Funcion de Filtrado
const newfilter = ordenes.filter(dato => {
  return (
    dato.clienteinicial_dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase())
)
});

let results = [];

if (busqueda === "") {
  results = ordenes;
} else {
  results = newfilter;
}

    
  useEffect(() =>{
    getPlanes();
    getClientes();
    getOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
        <h1 className="mb-3">Registro de Ordenes de Trabajo</h1>
        <button type="button" className="btn btn-info" onClick={agregarCliente}>
          Registrar Nueva OT
        </button>
        <br />
        <br />
        <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI' className='form-control border border-success'/>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">DNI</th>
                <th scope="col">Apellidos</th>
                <th scope="col">Nombre</th>
                <th scope="col">Direccion</th>
                <th scope="col">Telefono</th>
                <th scope="col">Referencia</th>
                <th scope="col">Plan</th>
                <th scope="col">Fecha OT</th>
                <th scope="col">Dia de pago</th>
                <th scope="col">Fecha Instalacion</th>
                <th scope="col">Horario Instalacion</th>
                <th scope="col">Costo Instalacion</th>
                <th scope="col">Indicaciones</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((val, key) => {
                return (
                  <tr key={val.id_ordentrabajo}>
                    <td>{val.clienteinicial_dnicliente}</td>
                    <td>{val.apellidocli}</td>
                    <td>{val.nombrecli}</td>
                    <td>{val.direccioncli}</td>
                    <td>{val.telefonocli}</td>
                    <td>{val.referenciacli}</td>
                    <td>{val.nombreplan}</td>
                    <td>{val.fecha_ot}</td>
                    <td>{val.diapago}</td>
                    <td>{val.fechaprog_instalacion}</td>
                    <td>{val.horario_instalacion}</td>
                    <td>{val.costo_instalacion}</td>
                    <td>{val.indicacion_instalacion}</td>
                    <td><button type="button" className="btn btn-info"
                        onClick={() => {editarOrden(val); }}>Edit</button>
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
              { editar ? (
                <h4 className="">Modificar Orden de Transporte:</h4>
              ):(
                <h4 className="">Registrar Orden de Transporte:</h4>
              )}
              
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
                  <div className="mb-3">
                    <label for="fecha_instalacion" className="form-label"> Fecha Instalacion programada: </label>
                    <input type="date" value={fechaprog_instalacion} onChange={(event) => {
                    setFechaprog_instalacion(event.target.value);
                  }}
                  className="form-control" id="fecha_instalacion" placeholder="fecha programada para instalar" aria-describedby="basic-addon1"
                ></input>
                </div>
                

              <div className="mb-3">
                <label for="horario_instalacion" className="form-label">
                  Rango horario:
                </label>
                <select value={horario_instalacion} onChange={(event) => {
                    setHorario_instalacion(event.target.value);
                  }}
                  className="form-control" id="horario_instalacion" aria-label="horario_instalacion" aria-describedby="basic-addon1"
                >
                  <option>8am - 1pm</option>
                  <option>2pm - 6pm</option>
                </select>
              </div>
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
                  <option>15</option>
                </select>
              </div>
              <div className="mb-3">
                <label for="costo_instalacion" className="form-label">
                  Costo Instalacion:
                </label>
                <input type="text" value={costo_instalacion}
                  onChange={(event) => { setCosto_instalacion(event.target.value); }}
                  className="form-control" id="costo_instalacion" placeholder="Costo instalacion" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="observacion" className="form-label">
                  Indicacion adicional para el técnico:
                </label>
                <input type="text" value={observacion}
                  onChange={(event) => { setObservacion(event.target.value); }}
                  maxLength={maxLengthIndicaciones}
                  className="form-control" id="observacion" placeholder="Ingrese Observacion" aria-describedby="basic-addon1"
                ></input>
                <div>
                {observacion.length} caracteres
              </div>
              {observacion.length >= maxLengthIndicaciones && (
                <div style={{ color: "red" }}>
                  Has alcanzado el límite de caracteres
                </div>
              )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {
            editar ?
              <div>
                <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
              </div>
              :<button className="btn btn-success" onClick={addordentrabajo}>Registrar</button>
            }
            <button className="btn btn-danger" onClick={cerrarModalContrato}>Cerrar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalMostrar2} toggle={ventanaModal2}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Ingresar Datos del Cliente:</h4>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">DNI Cliente:</label>
                  <input type="text" value={cliente_dnicliente} onChange={(event) => {
                    setCliente_dnicliente(event.target.value);
                  }} className="form-control" id="dnicliente" placeholder="Ingrese Documento de Identidad" aria-describedby="basic-addon1">
                  </input>
                  <button type="button" className="btn btn-secondary" onClick={validardnicliente}>validar si DNI existe</button>

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
                <label for="provincia" className="form-label">Provincia: </label>
                <select value={provinciacli} onChange={(event) => {
                    setProvinciacli(event.target.value);
                  }}
                  className="form-control" id="provincia" aria-label="provincia" aria-describedby="basic-addon1"
                >
                  <option>Lima</option>
                  <option>Piura</option>
                </select>
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
                <label for="direccion" className="form-label">Direccion: </label>
                <input type="text" value={direccioncli} onChange={(event) => {
                    setDireccioncli(event.target.value);
                  }}
                  maxLength={maxLengthDireccion}
                  className="form-control" id="direccion" placeholder="Dirección del Cliente" aria-describedby="basic-addon1"
                ></input>
                <div>{direccioncli.length} caracteres</div>
              {direccioncli.length >= maxLengthDireccion && (
                <div style={{ color: "red" }}>
                  Has alcanzado el límite de caracteres
                </div>
              )}
              </div>
              <div className="mb-3">
                <label for="referenciacli" className="form-label">Referencia:</label>
                <input type="text" value={referenciacli} onChange={(event) => {
                    setReferenciacli(event.target.value);
                  }}
                  maxLength={maxLengthReferencia}
                  className="form-control" id="referenciacli" aria-describedby="basic-addon1"
                ></input>
                <div>{referenciacli.length} caracteres</div>
              {referenciacli.length >= maxLengthReferencia && (
                <div style={{ color: "red" }}>
                  Has alcanzado el límite de caracteres
                </div>
              )}
              </div>
              <div className="mb-3">
                <label for="geolocalizacion" className="form-label">Coordenadas:</label>
                <input type="text" value={geolocalizacion} onChange={(event) => {
                    setGeolocalizacion(event.target.value);
                  }}
                  className="form-control" id="geolocalizacion" aria-describedby="basic-addon1"
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
              <h4 className="">DNI ya existe en la Base de Datos, no será posible registrar con ese DNI</h4>
              <p>-------------------------------------------------------------</p>
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

    </div>
  );
}
export default Ordenes_Transporte;