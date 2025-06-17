import React, { useState, useEffect } from 'react'
import Axios from "axios";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    const [num_contrato, setNum_contrato] = useState("");
    const [dnicli, setDnicli] = useState("");
    const [nombrecli, setNombrecli] = useState("");
    const [apellidocli, setApellidocli] = useState("");
    const [user_create, setUser_create] = useState(user);
    const [estado_anterior, setEstado_anterior] = useState();
    const [estado_nuevo, setEstado_nuevo] = useState();
    const [nombre_estado, setNombre_estado] = useState();
    const [detalle_cambio, setDetalle_cambio] = useState("");
    const [cliente_suspendido, setCliente_suspendido] = useState(false);
    const [cliente_baja, setCliente_baja] = useState(false);
    
    const maxLengthDetalle = 120;

    const [modalModificarServicio, setModalModificarServicio] = useState(false);
    const [modalBajaServicio, setModalBajaServicio] = useState(false);

    const ventanaModalModificarServicio = () => setModalModificarServicio(!modalModificarServicio);
    const ventanaModalBajaServicio = () => setModalBajaServicio(!modalBajaServicio);

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
          setDetalle_cambio("BAJA del servicio y retiro de equipos porque no regularizó el pago: ")
          ventanaModalBajaServicio();
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

 const cerrarModalSuspension = ()=>{
        limpiarcampos();
        ventanaModalModificarServicio();
      }
 const cerrarModalBaja = ()=>{
        limpiarcampos();
        ventanaModalBajaServicio();
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
        setUser_create(user);
        setCliente_baja(false);
        setCliente_suspendido(false);
    }

// Función para manejar el clic en una fila
    const handleRowClick = (cliente) => {    
      setNum_contrato(cliente.num_contrato);
      setDnicli(cliente.clienteactual_dnicliente);
      setApellidocli(cliente.apellidocli);
      setNombrecli(cliente.nombrecli);
      setEstado_anterior(cliente.estado_servicio);
      setNombre_estado(cliente.nombre_estado);

      if (cliente.estado_servicio==1) {
        setDetalle_cambio("Se suspende servicio por falta de pago: ");
        setEstado_nuevo(3);
        setCliente_suspendido(false);
        setCliente_baja(false);
      } else if(cliente.estado_servicio==3){
        setDetalle_cambio("Se Activa servicio, se regularizó el pago: ");
        setEstado_nuevo(1);
        setCliente_suspendido(true);
        setCliente_baja(false);
      } else if(cliente.estado_servicio==2){
        setCliente_baja(true);
        setCliente_suspendido(false);
      }else {
        setDetalle_cambio("");
        setEstado_nuevo();
        setCliente_suspendido(false);
        setCliente_baja(false);
      }
    };

       //****************Busqueda de ESTADOS= ACTIVOS e INACTIVOS
    const searcherEstado = (e) => {
        setFiltroEstado(e.target.value);
    }
      /***********************BUSQUEDA POR UBICACION */
      const searcherUbicacion = (e) => {
        setFiltroUbicacion(e.target.value);
        console.log(e.target.value)
    }
      /***********************BUSQUEDA POR DNI, APELLIDOS, SEDE */
      const searcherDni = (e) => {
        setFiltroDni(e.target.value);
    }

    let results_estado = clientesActivos
    if (filtroEstado === "activos") {   
        results_estado = clientesActivos
    } else {
        results_estado = clientesInactivos
    }

  //Funcion de Filtrado por UBICACION
  const newfilterUbicacion = results_estado.filter(dato => {
    return (
      dato.nombre_sede.toLowerCase().includes(filtroUbicacion.toLocaleLowerCase())
    )
  });

  let results_ubicacion = "";
  if (filtroUbicacion === "") {
    results_ubicacion = results_estado;
  } else {
    results_ubicacion = newfilterUbicacion;
  }

  //Funcion de Filtrado por DNI o APELLIDOS
  const newfilterDni = results_ubicacion.filter(dato => {
    return (
      dato.clienteactual_dnicliente.toLowerCase().includes(filtroDni.toLocaleLowerCase()) ||
      dato.apellidocli.toLowerCase().includes(filtroDni.toLocaleLowerCase())
    )
  });

  let results_Dni = "";
  if (filtroDni === "") {
    results_Dni = results_ubicacion;
  } else {
    results_Dni = newfilterDni;
  }
        

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
          <div className="btn-group mb-3" role="group" aria-label="Basic outlined example">
            {
              cliente_suspendido ? (
                <>
                <button type="button" class="btn btn-outline-primary" onClick={modificarEstadoServicio}>Activar Servicio</button>
                &nbsp;&nbsp;
                <button type="button" class="btn btn-outline-primary">Recojo equipos</button>
                &nbsp;&nbsp;
                <button type="button" class="btn btn-outline-primary" onClick={activarbajaServicio}>Dar de baja</button>
                </>
              ): cliente_baja ? (
                <button type="button" class="btn btn-outline-primary" onClick={activarbajaServicio}>Reactivar Servicio</button>
              ):(
                <button type="button" class="btn btn-outline-primary" onClick={modificarEstadoServicio}>Suspender Servicio</button>
              )
            }
              
              &nbsp;&nbsp;
              
          </div>
          <div className="mb-3">
              <select
                  type="text"
                  value={filtroEstado}
                  onChange={searcherEstado}
                  className="form-select form-select-lg mt-3"
              >
                  <option value="activos">Clientes Activos</option>
                  <option value="inactivos">Clientes Inactivos</option>
              </select>
          </div>
          <div className="mb-3">
              <select
                  type="text"
                  value={filtroUbicacion}
                  onChange={searcherUbicacion}
                  className="form-select form-select-lg mt-3"
              >
                <option value="">- Select Ubicación -</option>
                  <option value="PIURA">Piura</option>
                  <option value="HUASCAR">Huascar</option>
                  <option value="JUAN PABLO">Juan Pablo</option>
                  <option value="COLLIQUE">Collique</option>
              </select>
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
                      <th>DNI</th>
                      <th>Apellidos</th>
                      <th>Nombres</th>
                      <th>Usuario</th>
                      <th>Costo</th>
                      <th>Dia pago</th>
                      <th>Ubicacion</th>
                      <th>Estado</th>
                      <th>Comentario</th>
                      <th>Pendiente</th>
                      <th>Mayo</th>
                      <th>Fecha corte</th>
                      <th>Fecha activacion</th>
                      
                  </tr>
              </thead>
              <tbody>
                {results_Dni.map((cliente, key) => (
                                  <tr
                                    key={cliente.num_contrato}
                                    value={num_contrato}
                                    onClick={() => {
                                      {handleRowClick(cliente)};
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
                                    <td>{cliente.precioplan}</td>
                                    <th>{cliente.dia_pago}</th>
                                    <td>{cliente.nombre_sede}</td>
                                    <td>{cliente.nombre_estado}</td>
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
              <h4 className="">Está seguro que desea DAR DE BAJA el servicio para:</h4>
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
          <button className="btn btn-danger" onClick={cerrarModalBaja}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

    </div>
  )
}
export default Pagos;