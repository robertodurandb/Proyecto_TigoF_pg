import React, { useState, useEffect } from 'react'
import Axios from "axios";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';
import 'bootstrap/dist/css/bootstrap.min.css';

//OBTENER FECHA ACTUAL
let fechaactual = `${API.DATENOW}`

function Recojos() {

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser");
    let ipbackend = `${API.URL}`;

    //ESTADOS
    const [recojosPendientes, setRecojosPendientes] = useState([]);
    const [recojosTerminados, setRecojosTerminados] = useState([]);
    const [recojosCancelados, setRecojosCancelados] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("pendientes");
    const [filtroDni, setFiltroDni] = useState("");
    const [fecha_actual, setFecha_actual] = useState(fechaactual);

    const [num_contrato, setNum_contrato] = useState();
    const [idrecojo, setIdrecojo] = useState();
    const [dnicli, setDnicli] = useState("");
    const [nombrecli, setNombrecli] = useState("");
    const [apellidocli, setApellidocli] = useState("");
    const [estadoRecojo, setEstadoRecojo] = useState("");
    const [user_create, setUser_create] = useState(user);
    const [comentario, setComentario] = useState("");
    const [equipos, setEquipos] = useState("");
    const [motivo_cancelacion, setMotivo_cancelacion] = useState("");
    const [fotoEvidencia, setFotoEvidencia] = useState(null);
    const [completado_poste, setCompletado_poste] = useState(false);
    const [completados, setCompletados] = useState(false);
    const [cancelados, setCancelados] = useState(false);

    const [modalPoste, setModalPoste] = useState(false);
    const [modalRecojo, setModalRecojo] = useState(false);
    const [modalComentario, setModalComentario] = useState(false);
    const [modalCancelar, setModalCancelar] = useState(false);

    const ventanaModalPoste = () => setModalPoste(!modalPoste);
    const ventanaModalRecojo = () => setModalRecojo(!modalRecojo);
    const ventanaModalComentario = () => setModalComentario(!modalComentario);
    const ventanaModalCancelar = () => setModalCancelar(!modalCancelar);

    const getRecojosPendientes = async () => {
        try {
            const response = await Axios.get(ipbackend + 'getrecojos_pendientes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            setRecojosPendientes(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                sessionStorage.removeItem("token");
                window.location.reload();
                alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
    };

        const getRecojosTerminados = async () => {
        try {
            const response = await Axios.get(ipbackend + 'getrecojos_terminados', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            setRecojosTerminados(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                sessionStorage.removeItem("token");
                window.location.reload();
                alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
    };

  const getRecojosCancelados = async () => {
    try {
      const response = await Axios.get(ipbackend + 'getrecojos_cancelados', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      );
      setRecojosCancelados(response.data);
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
        if (idrecojo == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalComentario();
        }
    }
        // ABRIR MODAL PARA CONFIRMAR CORTE POSTE
    const confirmarPoste = () => {
        if (idrecojo == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalPoste();
        }
    }
            // ABRIR MODAL PARA CONFIRMAR RECOJO EQUIPOS
    const confirmarRecojo = () => {
        if (idrecojo == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalRecojo();
        }
    }
                // ABRIR MODAL PARA CANCELAR UN RECOJO
    const cancelarRecojo = () => {
        if (idrecojo == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            ventanaModalCancelar();
        }
    }


 //Actualizar Comentario cliente
const actualizarComentario = () => {
        Axios.put(ipbackend+"update_recojoequipos/"+idrecojo, 
          {  
              comentario: comentario
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(() => {
            getRecojosPendientes();
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

  //Actualizar corte de Poste
const actualizarCortePoste = () => {
  const formData = new FormData();

  // Agregar todos los campos existentes al FormData
  formData.append('comentario', comentario);
  formData.append('tecnico_completado_poste', user_create);
  formData.append('fecha_completado_poste', fecha_actual);
  formData.append('estado', 'COMPLETADO_POSTE');
  
  // Agregar la foto de evidencia si existe
  if (fotoEvidencia) {
    formData.append('image', fotoEvidencia);
  }

        Axios.put(ipbackend+"update_corteposte/"+idrecojo, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data' // Importante para enviar archivos
            }
        })  .then(() => {
            getRecojosPendientes();
            cerrarModalPoste();
            alert("Se confirmó corte de poste");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

const verEvidencia = () => {
    window.open(ipbackend + fotoEvidencia, "_blank");
  }

//Actualizar Recojo de Equipos
const actualizarRecojoEquipos = () => {
        Axios.put(ipbackend+"update_recojoequipos/"+idrecojo, 
          {  
              comentario: comentario,
              tecnico_completado_recojo: user_create,
              fecha_completado_recojo: fecha_actual,
              equipos_recolectados: equipos,
              estado: 'COMPLETADO_RECOJO'
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(Axios.put(ipbackend+"updateinstalacion/"+num_contrato,
            {
              estado_servicio: 2,
              pendiente_recojo: false,
              estado_pendiente: false,
              fecha_baja: fecha_actual,
              user_baja: user_create,
            },{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }))
            .then(Axios.post(ipbackend+"createcambioestado", 
          {  
              num_contrato: num_contrato,
              detalle: 'POR RECOJO DE EQUIPOS',
              estado_anterior: 3,
              estado_actual: 2,
              user_create: user_create,
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }))
            .then(() => {
            getRecojosPendientes();
            getRecojosTerminados();
            cerrarModalRecojo();
            alert("Se confirmó el recojo de los equipos");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

//Confirmar Cancelación de recojo
const confirmarCancelacion = () => {
        Axios.put(ipbackend+"update_recojoequipos/"+idrecojo, 
          {  
              comentario: comentario,
              user_cancelado: user_create,
              fecha_cancelado: fecha_actual,
              motivo_cancelado: motivo_cancelacion,
              estado: 'CANCELADO'
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(Axios.put(ipbackend+"updateinstalacion/"+num_contrato,
            {
              pendiente: 'RECOJO_CANCELADO',
              pendiente_recojo: false,
            },{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }))
            .then(() => {
            getRecojosPendientes();
            getRecojosCancelados();
            cerrarModalCancelacion();
            alert("Se confirmó la cancelación del recojo");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

//CERRAR MODALES
 const cerrarModalComentario = ()=>{
        limpiarcampos();
        ventanaModalComentario();
      }
const cerrarModalPoste = ()=>{
        limpiarcampos();
        ventanaModalPoste();
      }
const cerrarModalRecojo = ()=>{
        limpiarcampos();
        ventanaModalRecojo();
      }
const cerrarModalCancelacion = ()=>{
        limpiarcampos();
        ventanaModalCancelar();
      }

    const limpiarcampos = () => {
        setIdrecojo();
        setApellidocli("");
        setNombrecli("");
        setDnicli("");
        setNum_contrato();
        setComentario("");
        setMotivo_cancelacion("");
        setEquipos("");
        setFotoEvidencia(null);
        setUser_create(user);
    }

// Función para manejar el clic en una fila
    const handleRowClick = (cliente) => {    
      setNum_contrato(cliente.num_contrato);
      setIdrecojo(cliente.id);
      setDnicli(cliente.clienteactual_dnicliente);
      setApellidocli(cliente.apellidocli);
      setNombrecli(cliente.nombrecli);
      setComentario(cliente.comentario);
      setEquipos(cliente.tipo_equipo);
      setEstadoRecojo(cliente.estado);
      setFotoEvidencia(cliente.foto_evidencia);
      console.log(cliente.num_contrato);
      console.log(cliente.id);
      if (cliente.estado === "COMPLETADO_POSTE") {
        setCompletado_poste(true);
      } else {
        setCompletado_poste(false)
      }

    };

       //****************Busqueda de ESTADOS= PENDIENTES Y TERMINADOS y CANCELADOS
    const searcherEstado = (e) => {
        setFiltroEstado(e.target.value);
        setFiltroDni("");
        if (e.target.value==="completados") {
          setCompletados(true);
          setCancelados(false);
        } else if(e.target.value==="cancelados"){
          setCancelados(true);
          setCompletados(false);
        } else {
          setCancelados(false);
          setCompletados(false);
        }
    }

      /***********************BUSQUEDA POR DNI, APELLIDOS, SEDE, ESTADO_PENDIENTE */
      const searcherDni = (e) => {
        setFiltroDni(e.target.value);
    }

    let results_estado = recojosPendientes
    if (filtroEstado === "pendientes") {   
        results_estado = recojosPendientes
    } else if(filtroEstado === "completados") {
        results_estado = recojosTerminados
    } else {
      results_estado = recojosCancelados
    }

  const resultadosFiltrados = results_estado.filter(dato => {
    const cumpleDni = !filtroDni ||
      dato.clienteactual_dnicliente.toLowerCase().includes(filtroDni.toLowerCase()) ||
      dato.apellidocli.toLowerCase().includes(filtroDni.toLowerCase());
    return cumpleDni;
  });

        // useEffect para carga inicial (se ejecuta solo al montar el componente)
  useEffect(() => {
    getRecojosPendientes();
    getRecojosTerminados();
    getRecojosCancelados();
    setUser_create(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return(
    <div className="App">
        <h1 className="mb3">OTs para Recojo de Equipos</h1>
        <div className="mb-3">
              <select
                  type="text"
                  value={filtroEstado}
                  onChange={searcherEstado}
                  className="form-select form-select-lg mt-3"
              >
                  <option value="pendientes">Recojos pendientes</option>
                  <option value="completados">Recojos completados</option>
                  <option value="cancelados">Recojos cancelados</option>
              </select>
          </div>

          <div className="btn-group mb-3" role="group" aria-label="Basic outlined example">
                     
        {cancelados ? (
          <></>
        ) : completados ? (
          <>
          <button type="button" class="btn btn-outline-primary" onClick={verEvidencia}>Foto evidencia</button>
          </>
        ) : completado_poste ? (
          <>
            <button type="button" class="btn btn-outline-primary" onClick={confirmarRecojo}>Confirmar Recojo</button>
            &nbsp;&nbsp;
            <button type="button" class="btn btn-outline-primary" onClick={cancelarRecojo}>Cancelar Recojo</button>
            &nbsp;&nbsp;
            <button type="button" class="btn btn-outline-primary" onClick={agregarComentario}>💬c</button>

          </>
        ) : (
          <>
            <button type="button" class="btn btn-outline-primary" onClick={confirmarPoste}>Confirmar Poste</button>
            &nbsp;&nbsp;
            <button type="button" class="btn btn-outline-primary" onClick={cancelarRecojo}>Cancelar Recojo</button>
            &nbsp;&nbsp;
            <button type="button" class="btn btn-outline-primary" onClick={agregarComentario}>💬c</button>
          </>

        )}
          </div>
          
      <input
        value={filtroDni}
        onChange={searcherDni}
        type="text"
        placeholder="Busqueda por DNI o Apellidos"
        className="form-control border border-success"
      />

          <div className="table-responsive">
            <table className="table">
            <thead>
                  <tr className="bg-curso text-white">
                      <th>fecha OT</th>
                      <th>Indicacion OT</th>
                      <th>DNI</th>
                      <th>Apellidos</th>
                      <th>Nombres</th>
                      <th>Dirección</th>
                      <th>Telefono</th>
                      <th>Caja Splitter</th>
                      <th>fecha Poste</th>
                      <th>Técnico</th>
                      <th>Comentario</th>
                      {completados?(
                        <>
                        <th>fecha Recojo</th>
                        <th>Tecnico Recojo</th>
                        <th>Equipos</th>
                        <th>Evidencia corte</th>
                        </>
                      ):cancelados?(
                        <>
                        <th>fecha Cancelado</th>
                        <th>User Cancelado</th>
                        <th>Motivo Cancelado</th>
                        </>
                      ):(
                        null
                      )}
                  </tr>
              </thead>
              <tbody>
                {resultadosFiltrados.map((cliente, key) => (
                                  <tr
                                    key={cliente.id}
                                    value={idrecojo}
                                    onClick={() => {
                                      {handleRowClick(cliente)};
                                    }}
                                    className={
                                      idrecojo === cliente.id
                                        ? "table-primary"
                                        : null
                                    }
                                  >
                                    <td>{cliente.fecha_create}</td>
                                    <td>{cliente.indicaciones}</td>
                                    <td>{cliente.clienteactual_dnicliente}</td>
                                    <td>{cliente.apellidocli}</td>
                                    <td>{cliente.nombrecli}</td>
                                    <td>{cliente.direccioncli}</td>
                                    <td>{cliente.telefonocli}</td>
                                    <th>{cliente.caja_instalacion} / {cliente.splitter_instalacion}</th>
                                    <td>{cliente.fecha_completado_poste}</td>
                                    <td>{cliente.tecnico_completado_poste}</td>
                                    <td>{cliente.comentario}</td>
                                    {completados?(
                                      <>
                                      <td>{cliente.fecha_completado_recojo}</td>
                                      <td>{cliente.tecnico_completado_recojo}</td>
                                      <td>{cliente.tipo_equipo}</td>
                                      <td>{cliente.foto_evidencia}</td>
                                      </>
                                    ):cancelados?(
                                      <>
                                      <td>{cliente.fecha_cancelado}</td>
                                      <td>{cliente.user_cancelado}</td>
                                      <td>{cliente.motivo_cancelado}</td>
                                      </>
                                    ):(
                                      null
                                    )}
                                  </tr>
                                ))}
              </tbody>
            </table>
              
          </div>

      {/* MODAL PARA AGREGAR COMENTARIO */}
      <Modal isOpen={modalComentario} toggle={ventanaModalComentario}>
        <ModalBody>
          <div className="from-group">
          {
              <h4 className="">Agregar comentario para:</h4>
          } 
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {estadoRecojo}
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
          <button className="btn btn-secondary" onClick={() => setComentario('')}>
          Limpiar
        </button>
          <button className="btn btn-danger" onClick={cerrarModalComentario}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

{/* MODAL PARA CONFIRMAR CORTE POSTE */}
      <Modal isOpen={modalPoste} toggle={ventanaModalPoste}>
        <ModalBody>
          <div className="from-group">
              <h4 className="">Confirmar Corte de Poste:</h4>
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {estadoRecojo}
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
            <div className="mb-3">
              <label htmlFor="fotoEvidencia" className="form-label">Foto de evidencia:</label>
              <input 
                type="file"
                onChange={(event) => {
                  setFotoEvidencia(event.target.files[0]);
                }}
                className="form-control" 
                id="fotoEvidencia" 
                accept="image/*"
                capture="environment"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={actualizarCortePoste}>
            Confirmar
          </button>
          <button className="btn btn-secondary" onClick={() => setComentario('')}>
          Limpiar
        </button>
          <button className="btn btn-danger" onClick={cerrarModalPoste}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

{/* MODAL PARA CONFIRMAR RECOJO EQUIPOS */}
      <Modal isOpen={modalRecojo} toggle={ventanaModalRecojo}>
        <ModalBody>
          <div className="from-group">
              <h4 className="">Confirmar Recojo de Equipos:</h4>
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {estadoRecojo}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>
            <div className="mb-3">
              <label for="nombres" className="form-label">Equipos:</label>
              <input type="text" onChange={(event) => {
                setEquipos(event.target.value);
              }}
                value={equipos}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
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
          <button className="btn btn-success" onClick={actualizarRecojoEquipos}>
            Confirmar
          </button>
          <button className="btn btn-secondary" onClick={() => setComentario('')}>
          Limpiar comentario
        </button>
          <button className="btn btn-danger" onClick={cerrarModalRecojo}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

{/* MODAL PARA CANCELAR RECOJOS */}
      <Modal isOpen={modalCancelar} toggle={ventanaModalCancelar}>
        <ModalBody>
          <div className="from-group">
              <h4 className="">Está seguro de Cancelar este recojo:</h4>
            <div className="mb-3">
              <span className="input-group-text" id="basic-addon1">
                DNI: {dnicli} / {estadoRecojo}
              </span>
              <span className="input-group-text" id="basic-addon1">
                {apellidocli} {nombrecli}
              </span>
            </div>
            <div className="mb-3">
              <label for="nombres" className="form-label">Motivo cancelación:</label>
              <input type="text" onChange={(event) => {
                setMotivo_cancelacion(event.target.value);
              }}
                value={motivo_cancelacion}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
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
          <button className="btn btn-success" onClick={confirmarCancelacion}>
            Confirmar
          </button>
          <button className="btn btn-danger" onClick={cerrarModalCancelacion}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

    </div>
  )

}
export default Recojos;