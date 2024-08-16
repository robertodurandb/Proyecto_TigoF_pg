import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const'

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
    const [instalaciones, setInstalaciones] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [controlbusqueda, setControlbusqueda] = useState(false)

    const [num_contrato, setNum_contrato] = useState();
    const [dnicliente, setDnicliente] = useState();
    const [plan, setPlan] = useState();
    //Datos Instalacion
    const [idinstalacion, setIdinstalacion] = useState();
    const [idinstalacion2, setIdinstalacion2] = useState();
    const [fechainstalacion, setFechainstalacion] = useState(fechaactual);
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [observacion, setObservacion] = useState();
    const [user_create, setUser_create] = useState();
    const [fecha_create, setFecha_create] = useState(fechaactual);
    const [estado, setEstado] = useState("Instalado");
    const [editar, setEditar] = useState(false);

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModalConfirmar = () => setModalConfirmar(!modalConfirmar);

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser")
    let ipbackend = `${API.URL}`;

    const addinstalacion = () => {
        Axios.post(ipbackend+"instalacion", {
            fechainstalacion: fechainstalacion,
            geolocalizacion: geolocalizacion,
            observacion_instalacion: observacion,
            user_create: user_create,
            fecha_create: fecha_create,
            estado: estado,
            contratoinstalacion: num_contrato,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
            ventanaModal();
            ventanaModalConfirmar(); 
            let id = "";
            id = response.data
            let id2 = id.split(',')
            setIdinstalacion2(id2[1])
                  
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
      fetch(ipbackend+'list')
          .then(response => response.json())
          .then(data => setListaClientes(data))
          setUser_create(user)
          //console.log("los clientes son:")
         // console.log(listaClientes[1])
  }

  function getInstalaciones(){
    fetch(ipbackend+'todolist')
        .then(response => response.json())
        .then(data => setInstalaciones(data))
       // console.log("los clientes con instalacion son")
        //console.log(instalaciones[1])
}

      const confirmarinstalacion = () => {
        Axios.put(ipbackend+"detallecontrato/"+num_contrato, {
            estadodc_instalacion: "instalado",
            instalacion_idinstalacion: idinstalacion2
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          limpiarcampos();
          alert("Instalacion registrada con exito");
          console.log("el id capturado es: "+idinstalacion2)
          ventanaModalConfirmar();
          getClientes();
        }).catch((error) => {
          if (401 === error.response.status){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };

      const capturarID = (cliente) =>{
        let idinst = instalaciones[0].idinstalacion;
        setNum_contrato(cliente.num_contrato);
        setDnicliente(cliente.dnicliente);
        setPlan(cliente.nombreplan);
        ventanaModal();  
        setIdinstalacion(instalaciones[0].idinstalacion)
        console.log("id inst es "+idinst);
 
    }

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
      const cerrarModal = ()=>{
        limpiarcampos();
        ventanaModal();
      }


       //****************Funcion de Busqueda
       const searcher = (e) =>{
        setBusqueda(e.target.value);
        getClientes();
        getInstalaciones();
        if(e.target.value=="instalados"){
          console.log("instalados")
          setControlbusqueda(true)
        }
        if(e.target.value=="pendientes"){
          console.log("pendientes")
          setControlbusqueda(false)
        }
        }
        let results = listaClientes
        if (busqueda === "instalados") {
          results = instalaciones
            
          } else{
            results = listaClientes
          
          }
        
      
    
        useEffect(() =>{
          getClientes();
          getInstalaciones();
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
        <div className="App">
          <h1 className="mb3">Gestión de Instalaciones</h1>
          <select type='text' value={busqueda} onChange={searcher} className='form-select form-select-lg mt-3'>
            <option value="pendientes">Pendientes</option>
            <option value="instalados">Instalados</option>
          </select>

            <table className="table table-striped table-hover mt-5 shadow-lg">
              <thead>
                <tr className="bg-curso text-white">
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Distrito</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Fecha programada</th>
                            <th>Técnico</th>
                            <th>Fecha Instalacion</th>
                            <th>Acción</th>
                </tr>
              </thead>
              <tbody>
              {results.map((cliente, key)=>(
                            <tr key={cliente.num_contrato} value={num_contrato}>
                                <td>{cliente.dnicliente}</td>
                                <td>{cliente.apellidocli}</td>
                                <td>{cliente.nombrecli}</td>
                                <td>{cliente.distritocli}</td>
                                <td>{cliente.direccioncli}</td>
                                <td>{cliente.telefonocli}</td>
                                <td>{cliente.fechaprog_instalacion}</td>
                                <td>{cliente.user_create}</td>
                                <td>{cliente.fechainstalacion}</td>
                                {controlbusqueda?(
                                  <td><button type="button" className="btn btn-outline-success" 
                                  >Editar
                                  </button></td>
                                ):(
                                  <td><button type="button" className="btn btn-outline-success" 
                                  onClick={()=>{capturarID(cliente)}}>Registrar
                                  </button></td>
                                )}
                                
                            </tr>
                    ))}  
              </tbody>
            </table>

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Registrar Instalación:</h4>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  Número de Contrato:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {num_contrato}
                  </span>
              </div>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  DNI Cliente:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {dnicliente}
                  </span>
              </div>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  Plan Contratado:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {plan}
                  </span>
              </div>
              <div className="mb-3">
                <label for="geolocalización" className="form-label">
                  Geolocalización:
                </label>
                <input type="text" value={geolocalizacion}
                  onChange={(event) => {
                    setGeolocalizacion(event.target.value);
                  }}
                  className="form-control" id="geolocalizacion" placeholder="Ingrese Geolocalización de Maps" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="geolocalización" className="form-label">
                  Observación:
                </label>
                <input type="text" value={observacion}
                  onChange={(event) => {
                    setObservacion(event.target.value);
                  }}
                  className="form-control" id="observacion" placeholder="Observación" aria-describedby="basic-addon1"
                ></input>
              </div> 
            </div>
          </ModalBody>
          <ModalFooter>
            {editar ? (
              <div>
                <button className="btn btn-warning m-2" onClick="">
                  Actualizar
                </button>
              </div>
            ) : (
              <button className="btn btn-success" onClick={addinstalacion}>
                Registrar
              </button>
            )}
            <button className="btn btn-danger" onClick={cerrarModal}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalConfirmar} toggle={ventanaModalConfirmar}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Confirmar Instalación:</h4>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  Número de Contrato:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {num_contrato}
                  </span>
              </div>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  DNI Cliente:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {dnicliente}
                  </span>
              </div>
              <div className="mb-3">
                <label for="geolocalización" className="form-label">
                  Observación:
                </label>
                <input type="text" value={observacion}
                  onChange={(event) => {
                    setObservacion(event.target.value);
                  }}
                  className="form-control" id="observacion" placeholder="Observación" aria-describedby="basic-addon1"
                ></input>
              </div> 
            </div>
          </ModalBody>
          <ModalFooter>    
              <div>
                <button className="btn btn-warning m-2" onClick={confirmarinstalacion}>
                  Confirmar
                </button>
                <button className="btn btn-danger" onClick={ventanaModalConfirmar}>
                  Cancelar
                </button>
              </div>
            
          </ModalFooter>
        </Modal>

        </div>
      )
}
export default Instalacion;