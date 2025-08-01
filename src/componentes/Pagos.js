import React, { useState, useEffect } from 'react'
import Axios from "axios";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';
import 'bootstrap/dist/css/bootstrap.min.css';

//OBTENER FECHA ACTUAL
let fechaactual = `${API.DATENOW}`

function Pagos() {

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser");
    let ipbackend = `${API.URL}`;

    //ESTADOS
    const [clientesActivos, setClientesActivos] = useState([]);
    const [clientesInactivos, setClientesInactivos] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("activos");
    const [filtroUbicacion, setFiltroUbicacion] = useState("");
    const [filtroDni, setFiltroDni] = useState("");
    const [fecha_actual, setFecha_actual] = useState(fechaactual);

    const [num_contrato, setNum_contrato] = useState();
    const [dnicli, setDnicli] = useState("");
    const [nombrecli, setNombrecli] = useState("");
    const [apellidocli, setApellidocli] = useState("");
    const [user_create, setUser_create] = useState(user);
    const [estado_anterior, setEstado_anterior] = useState();
    const [estado_nuevo, setEstado_nuevo] = useState();
    const [nombre_estado, setNombre_estado] = useState();
    const [detalle_cambio, setDetalle_cambio] = useState("");
    const [cliente_suspendido, setCliente_suspendido] = useState(false);
    const [cliente_suspendido_recojo, setCliente_suspendido_recojo] = useState(false);
    const [cliente_baja, setCliente_baja] = useState(false);
    const [cliente_activo, setCliente_activo] = useState(false);
    const [indicaciones_recojo, setIndicaciones_recojo] = useState("");
    const [comentario, setComentario] = useState("");
    const [pendiente, setPendiente] = useState("");

    
    const maxLengthDetalle = 120;

    const [modalModificarServicio, setModalModificarServicio] = useState(false);
    const [modalBajaServicio, setModalBajaServicio] = useState(false);
    const [modalRecojoEquipos, setModalRecojoEquipos] = useState(false);
    const [modalComentario, setModalComentario] = useState(false);
    const [modalPendiente, setModalPendiente] = useState(false);

    const ventanaModalModificarServicio = () => setModalModificarServicio(!modalModificarServicio);
    const ventanaModalBajaServicio = () => setModalBajaServicio(!modalBajaServicio);
    const ventanaModalRecojoEquipos = () => setModalRecojoEquipos(!modalRecojoEquipos);
    const ventanaModalComentario = () => setModalComentario(!modalComentario);
    const ventanaModalPendiente = () => setModalPendiente(!modalPendiente);

    const getClientesActivos = async () => {
        try {
            const response = await Axios.get(ipbackend + 'getinstalacionesall', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            setClientesActivos(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                sessionStorage.removeItem("token");
                window.location.reload();
                alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
    };

    const getClientesInactivos = async () => {
        try {
            const response = await Axios.get(ipbackend + 'getinstalacionesall2', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            setClientesInactivos(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                sessionStorage.removeItem("token");
                window.location.reload();
                alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
    };

    // ABRIR MODAL PARA AGREGAR COMENTARIO
    const agregarComentario = () => {
        if (num_contrato == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalComentario();
        }
    }
        // ABRIR MODAL PARA AGREGAR PENDIENTE
    const agregarPendiente = () => {
        if (num_contrato == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalPendiente();
        }
    }

// ABRIR MODAL PARA ACTIVAR/SUSPENDER SERVICIO
    const modificarEstadoServicio = () => {
        if (num_contrato == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalModificarServicio();
        }
    }
// ABRIR MODAL PARA DAR DE BAJA SERVICIO
    const activarbajaServicio = () => {
        if (num_contrato == undefined) {
            alert("Debe seleccionar un registro")
        } else if(cliente_baja){
          setDetalle_cambio("REACTIVACIÓN del servicio, se instalan nuevamente los equipos: ")
          setEstado_nuevo(1);
          ventanaModalBajaServicio();
        } else {
          setEstado_nuevo(2);
          setDetalle_cambio("BAJA del servicio, ya se recogió equipos")
          ventanaModalBajaServicio();
        }
    }

    // ABRIR MODAL PARA PROGRAMAR RECOJO DE EQUIPOS
    const programarRecojoEquipos = () => {
        if (num_contrato == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalRecojoEquipos();
            console.log(num_contrato)
            console.log(indicaciones_recojo)
            console.log(user_create)
        }
    }

//Modificar Estado Servicio
const ModificarEstado = () => {
        Axios.post(ipbackend+"createcambioestado", 
          {  
              num_contrato: num_contrato,
              detalle: detalle_cambio,
              estado_anterior: estado_anterior,
              estado_actual: estado_nuevo,
              user_create: user_create,
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(Axios.put(ipbackend+"updateinstalacion/"+num_contrato,
            {
              estado_servicio: estado_nuevo,
              pendiente_recojo: false,
            },{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }))
            .then(() => {
            getClientesActivos();
            getClientesInactivos();
            cerrarTodosLosModales();
            alert("Se modificó el estado correctamente");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

      //Crear el Recojo de equipos
const crearRecojoEquipos = () => {
        Axios.post(ipbackend+"create_recojoequipos", 
          {  
              num_contrato: num_contrato,
              indicaciones: indicaciones_recojo,
              user_create: user_create,
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(Axios.put(ipbackend+"updateinstalacion/"+num_contrato,
            {
              fecha_programacion_recojo: fecha_actual,
              pendiente_recojo: true
            },{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }))
            .then(() => {
            getClientesActivos();
            getClientesInactivos();
            cerrarModalRecojoEquipos();
            alert("Se creo la OT para recojo de equipo");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

 //Actualizar Comentario cliente
const actualizarComentario = () => {
        Axios.put(ipbackend+"updateinstalacion/"+num_contrato, 
          {  
              comentario: comentario
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(() => {
            getClientesActivos();
            cerrarModalComentario();
            alert("Se actualizo el comentario");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

//Actualizar Comentario cliente
const actualizarPendiente = () => {
        Axios.put(ipbackend+"updateinstalacion/"+num_contrato, 
          {  
              pendiente: pendiente
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(() => {
            getClientesActivos();
            cerrarModalPendiente();
            alert("Se actualizo el pendiente");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

//CERRAR MODALES
 const cerrarModalSuspension = ()=>{
        limpiarcampos();
        ventanaModalModificarServicio();
      }
 const cerrarModalBaja = ()=>{
        limpiarcampos();
        ventanaModalBajaServicio();
      }
 const cerrarModalRecojoEquipos = ()=>{
        limpiarcampos();
        ventanaModalRecojoEquipos();
      }
 const cerrarModalComentario = ()=>{
        limpiarcampos();
        ventanaModalComentario();
      }
const cerrarModalPendiente = ()=>{
        limpiarcampos();
        ventanaModalPendiente();
      }
const cerrarTodosLosModales = () => {
  setModalBajaServicio(false);
  setModalModificarServicio(false);
  limpiarcampos();
};

    const limpiarcampos = () => {
        setDnicli("");
        setNum_contrato();
        setDetalle_cambio("");
        setEstado_anterior();
        setEstado_nuevo();
        setIndicaciones_recojo("")
        setComentario("");
        setPendiente("");
        setUser_create(user);
        setCliente_suspendido(false);
        setCliente_suspendido_recojo(false);
    }

// Función para manejar el clic en una fila
    const handleRowClick = (cliente) => {    
      setNum_contrato(cliente.num_contrato);
      setDnicli(cliente.clienteactual_dnicliente);
      setApellidocli(cliente.apellidocli);
      setNombrecli(cliente.nombrecli);
      setEstado_anterior(cliente.estado_servicio);
      setNombre_estado(cliente.nombre_estado);
      setComentario(cliente.comentario);
      setPendiente(cliente.pendiente);
      console.log(cliente.pendiente_recojo);
      console.log(cliente.fecha_suspension);
      console.log(cliente.num_contrato);

      if (cliente.estado_servicio==1) {
        setDetalle_cambio("Se suspende servicio por falta de pago: ");
        setEstado_nuevo(3);
        setCliente_activo(true);
        setCliente_suspendido(false);
        setCliente_suspendido_recojo(false)
      } else if(cliente.estado_servicio==3 && cliente.fecha_programacion_recojo){
        setCliente_suspendido_recojo(true);
        setCliente_suspendido(false);
        setCliente_activo(false)
      } else if(cliente.estado_servicio==3){
        setDetalle_cambio("Se Activa servicio, se regularizó el pago: ");
        setIndicaciones_recojo("Ninguna");
        setEstado_nuevo(1);
        setCliente_suspendido(true);
        setCliente_suspendido_recojo(false);
        setCliente_activo(false);
      } else if(cliente.estado_servicio==2){
        setCliente_suspendido(false);
        setCliente_suspendido_recojo(false);
        setCliente_activo(false);
      }else {
        setDetalle_cambio("");
        setEstado_nuevo();
        setCliente_suspendido(false);
        setCliente_suspendido_recojo(false);
        setCliente_baja(false);
      }
    };

       //****************Busqueda de ESTADOS= ACTIVOS e INACTIVOS
    const searcherEstado = (e) => {
        setFiltroEstado(e.target.value);
        setFiltroUbicacion("");
        setFiltroDni("");
        setNum_contrato();
        if (e.target.value === 'activos') {
          setCliente_baja(false);
          setCliente_activo(true);
        } else {
          setCliente_baja(true);
        }
    }
      /***********************BUSQUEDA POR UBICACION */
      const searcherUbicacion = (e) => {
        setFiltroUbicacion(e.target.value);
    }
      /***********************BUSQUEDA POR DNI, APELLIDOS, SEDE, ESTADO_PENDIENTE */
      const searcherDni = (e) => {
        setFiltroDni(e.target.value);
    }

    let results_estado = clientesActivos
    if (filtroEstado === "activos") {   
        results_estado = clientesActivos
    } else {
        results_estado = clientesInactivos
    }

  const resultadosFiltrados = results_estado.filter(dato => {
    const cumpleUbicacion = !filtroUbicacion ||
      dato.nombre_sede.toLowerCase().includes(filtroUbicacion.toLowerCase());

// Verifica si el filtro es "SI" (case insensitive)
    const filtroPenSI = filtroDni && filtroDni.toLowerCase() === 'si*';
    const filtroRecSI = filtroDni && filtroDni.toLowerCase() === 'si-';

    const cumpleDni = !filtroDni ||
      dato.clienteactual_dnicliente.toLowerCase().includes(filtroDni.toLowerCase()) ||
      dato.apellidocli.toLowerCase().includes(filtroDni.toLowerCase()) || 
      dato.nombre_estado.toLowerCase().includes(filtroDni.toLowerCase()) ||
      (filtroPenSI ? dato.estado_pendiente === true : 
         String(dato.estado_pendiente).toLowerCase().includes(filtroDni.toLowerCase())) ||
      (filtroRecSI ? dato.pendiente_recojo === true : 
         String(dato.pendiente_recojo).toLowerCase().includes(filtroDni.toLowerCase()));

    return cumpleUbicacion && cumpleDni;
  });

        // useEffect para carga inicial (se ejecuta solo al montar el componente)
  useEffect(() => {
    getClientesActivos();
    getClientesInactivos();
    setUser_create(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return(
    <div className="App">
        <h1 className="mb3">Gestión de Pagos</h1>
        <div className="d-flex flex-row gap-3 mb-2">
              <select
                  type="text"
                  value={filtroEstado}
                  onChange={searcherEstado}
                  className="form-select form-select-lg mt-3"
              >
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
              </select>
              <select
                  type="text"
                  value={filtroUbicacion}
                  onChange={searcherUbicacion}
                  className="form-select form-select-lg mt-3"
              >
                <option value="">- Sedes -</option>
                  <option value="PIURA">Piura</option>
                  <option value="HUASCAR">Huascar</option>
                  <option value="JUAN PABLO">Juan Pablo</option>
                  <option value="COLLIQUE">Collique</option>
              </select>
          </div>

          <div className="btn-group mb-3" role="group" aria-label="Basic outlined example">
            {
              cliente_baja ? (
                <button type="button" class="btn btn-outline-primary" onClick={activarbajaServicio}>Reactivar</button>
              ):cliente_activo ?(
                <>
                <button type="button" class="btn btn-outline-primary" onClick={modificarEstadoServicio}>Suspender</button>
                &nbsp;&nbsp;
              <button type="button" className="btn btn-outline-primary" onClick={agregarComentario}>💬c</button>
              &nbsp;&nbsp;
              <button type="button" className="btn btn-outline-primary" onClick={agregarPendiente}>📝 p</button>
                </>
              ):cliente_suspendido?(
                <>
                <button type="button" class="btn btn-outline-primary" onClick={modificarEstadoServicio}>Activar</button>
                &nbsp;&nbsp;
                <button type="button" class="btn btn-outline-primary" onClick={programarRecojoEquipos}>Recojo</button>
                &nbsp;&nbsp;
                <button type="button" class="btn btn-outline-primary" onClick={activarbajaServicio}>Baja</button>
                &nbsp;&nbsp;
              <button type="button" className="btn btn-outline-primary" onClick={agregarComentario}>💬c</button>
              &nbsp;&nbsp;
              <button type="button" className="btn btn-outline-primary" onClick={agregarPendiente}>📝 p</button>
                </>
              ):cliente_suspendido_recojo?(
                <>
              <button type="button" className="btn btn-outline-primary" onClick={agregarComentario}>💬c</button>
              &nbsp;&nbsp;
              <button type="button" className="btn btn-outline-primary" onClick={agregarPendiente}>📝 p</button>
                </>
              ):null
            }
              
              
          </div>
          
      <input
        value={filtroDni}
        onChange={searcherDni}
        type="text"
        placeholder="Buscar: DNI, APELLIDOS, ESTADO, (P.R), (P)"
        className="form-control border border-success"
      />

          <div className="table-responsive">
        <table className="table">
          <thead>
            <tr className="bg-curso text-white">
              <th>DNI</th>
              <th>Apellidos</th>
              <th>Nombres</th>
              <th>Usuario</th>
              <th>Costo</th>
              <th>Dia pago</th>
              <th>Ubicacion</th>
              <th>Estado</th>
              <th>Fecha corte</th>
              <th>Fecha activ</th>
              {
                cliente_baja ? (
                  <>
                    <th>Fecha Baja</th>
                    <th>User Baja</th>
                  </>
                ) : (
                  <>
                    <th>(P.R)</th>
                    <th>Fecha P.R.</th>
                    <th>Comentario (c)</th>
                    <th>(P)</th>
                    <th>Pendiente (p)</th>
                  </>
                )
              }

            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.map((cliente, key) => (
              <tr
                key={cliente.num_contrato}
                value={num_contrato}
                onClick={() => {
                  { handleRowClick(cliente) };
                }}
                className={
                  num_contrato === cliente.num_contrato
                    ? "table-primary"
                    : null
                }
              >
                <td>{cliente.clienteactual_dnicliente}</td>
                <td>{cliente.apellidocli}</td>
                <td>{cliente.nombrecli}</td>
                <td>{cliente.user_mk}</td>
                <td>{cliente.precio_final}</td>
                <th>{cliente.dia_pago}</th>
                <td>{cliente.nombre_sede}</td>
                <td>{cliente.nombre_estado}</td>
                <td>{cliente.fecha_suspension}</td>
                <td>{cliente.fecha_activacion}</td>
                {
                  cliente_baja ? (
                    <>
                      <td>{cliente.fecha_baja}</td>
                      <td>{cliente.user_baja}</td>
                    </>
                  ) : (
                    <>
                      <td>{cliente.pendiente_recojo ? 'SI-' : null}</td>
                      <td>{cliente.fecha_programacion_recojo}</td>
                      <td>{cliente.comentario}</td>
                      <td>{cliente.estado_pendiente ? 'SI*' : null}</td>
                      <td>{cliente.pendiente}</td>
                    </>
                  )
                }


              </tr>
            ))}
          </tbody>
        </table>
              
          </div>

     {/* MODAL PARA ACTIVAR/SUSPENDER SERVICIO */}
      <Modal isOpen={modalModificarServicio} toggle={ventanaModalModificarServicio}>
        <ModalBody>
          <div className="from-group">
            <h4 className="">Está seguro de modificar el servicio para:</h4>
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {nombre_estado}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>

            <div className="mb-3">
              <label for="nombres" className="form-label">Motivo:</label>
              <input type="text" onChange={(event) => {
                setDetalle_cambio(event.target.value);
              }}
                maxLength={maxLengthDetalle}
                value={detalle_cambio}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {
            cliente_suspendido ? (
              <button className="btn btn-success" onClick={ModificarEstado}>
                Activar
              </button>
            ) : (
              <button className="btn btn-success" onClick={ModificarEstado}>
                Suspender
              </button>
            )
          }
          <button className="btn btn-danger" onClick={cerrarModalSuspension}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

       {/* MODAL PARA DAR DE BAJA O ACTIVAR SERVICIO */}
      <Modal isOpen={modalBajaServicio} toggle={ventanaModalBajaServicio}>
        <ModalBody>
          <div className="from-group">
          {
            cliente_baja ? (
              <h4 className="">Está seguro que desea REACTIVAR el servicio para:</h4>
            ):(
              <h4 className="">Está seguro que desea DAR DE BAJA sin Programar Recojo:</h4>
            )
          } 
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {nombre_estado}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>

            <div className="mb-3">
              <label for="nombres" className="form-label">Motivo:</label>
              <input type="text" onChange={(event) => {
                setDetalle_cambio(event.target.value);
              }}
                maxLength={maxLengthDetalle}
                value={detalle_cambio}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {
            cliente_baja ? (
              <button className="btn btn-success" onClick={ModificarEstado}>
                Reactivar
              </button>
            ) : (
              <button className="btn btn-success" onClick={ModificarEstado}>
                Dar de baja
              </button>
            )
          }
          <button className="btn btn-secondary" onClick={() => setDetalle_cambio('')}>
          Limpiar
        </button>
          <button className="btn btn-danger" onClick={cerrarModalBaja}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* MODAL PARA PROGRAMAR RECOJO DE EQUIPOS */}
      <Modal isOpen={modalRecojoEquipos} toggle={ventanaModalRecojoEquipos}>
        <ModalBody>
          <div className="from-group">
          {
              <h4 className="">Programar recojo de equipos para:</h4>
          } 
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {nombre_estado}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>

            <div className="mb-3">
              <label for="nombres" className="form-label">Indicaciones:</label>
              <input type="text" onChange={(event) => {
                setIndicaciones_recojo(event.target.value);
              }}
                value={indicaciones_recojo}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={crearRecojoEquipos}>
            Programar
          </button>
          <button className="btn btn-danger" onClick={cerrarModalRecojoEquipos}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* MODAL PARA AGREGAR COMENTARIO */}
      <Modal isOpen={modalComentario} toggle={ventanaModalComentario}>
        <ModalBody>
          <div className="from-group">
          {
              <h4 className="">Agregar comentario para:</h4>
          } 
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {nombre_estado}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>

            <div className="mb-3">
              <label for="nombres" className="form-label">Comentario:</label>
              <input type="text" onChange={(event) => {
                setComentario(event.target.value);
              }}
                value={comentario}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={actualizarComentario}>
            Guardar
          </button>
          <button className="btn btn-danger" onClick={cerrarModalComentario}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

       {/* MODAL PARA AGREGAR PENDIENTE */}
      <Modal isOpen={modalPendiente} toggle={ventanaModalPendiente}>
        <ModalBody>
          <div className="from-group">
          {
              <h4 className="">Agregar Pendiente:</h4>
          } 
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {nombre_estado}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>

            <div className="mb-3">
              <label for="nombres" className="form-label">Pendiente:</label>
              <input type="text" onChange={(event) => {
                setPendiente(event.target.value);
              }}
                value={pendiente}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={actualizarPendiente}>
            Guardar
          </button>
          <button className="btn btn-secondary" onClick={() => setPendiente('')}>
          Limpiar
        </button>
          <button className="btn btn-danger" onClick={cerrarModalPendiente}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

    </div>
  )
}
export default Pagos;