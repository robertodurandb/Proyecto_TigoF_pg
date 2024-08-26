import React, { useEffect, useState } from 'react'
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import API from '../utils/const';

function Principal() {

//FECHA ACTUAL
let fechaactual = `${API.DATENOW}`
let anioactual = `${API.ANIO}`
let mes = `${API.MES}`

    const [listaClientes, setListaClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [listaPagos, setListaPagos] = useState([]);

    //Datos para el Modal
    const [num_contrato, setNum_contrato] = useState();
    const [dnicli, setDnicli] = useState();
    const [nombrecli, setNombrecli] = useState();
    const [apellidocli, setApellidocli] = useState();
    const [direccioncli, setDireccioncli] = useState();
    const [distritocli, setDistritocli] = useState();
    const [telefonocli, setTelefonocli] = useState();
    const [fecha_nacimiento, setFecha_nacimiento] = useState();
    const [nombreplan, setNombreplan] = useState();
    const [fechacontrato, setFechacontrato] = useState();
    const [precioplan, setPrecioplan] = useState();
    const [velocidadplan, setVelocidadplan] = useState();
    const [diapago, setDiapago] = useState();
    const [fechaprog_instalacion, setFechaprog_instalacion] = useState();
    //TABLA INSTALACION
    const [user_create, setUser_create] = useState();
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [estadodc_instalacion, setEstadodc_instalacion] = useState();
    const [fechainstalacion, setFechainstalacion] = useState();
    const [imagencasa, setImagencasa] = useState();
    const [observacion_instalacion, setObservacion_instalacion] = useState();

    const [montopago, setMontopago] = useState(0);
    const [fechapago, setFechapago] = useState(fechaactual);
    const [mespago, setMespago] = useState(mes);
    const [anio, setAnio] = useState(anioactual);
    const [mediopago, setMediopago] = useState();
    const [observacion, setObservacion] = useState();

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalPagos, setModalPagos] = useState(false);
    const [modalPagar, setModalPagar] = useState(false);

    //Datos para el modal de pagos
    const [verPagos, setVerPagos] = useState(false);
    const [results2, setResults2] = useState([]);

    let ipbackend = `${API.URL}`
    let token = sessionStorage.getItem("token");

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModal2 = () => setModalPagos(!modalPagos);
    const ventanaModal3 = () => setModalPagar(!modalPagar);

    function getPagos(){
        fetch(ipbackend+'pagos')
            .then(response => response.json())
            .then(data => setListaPagos(data))    
    }

    function getClientes(){
        fetch(ipbackend+'todoinstacli')
            .then(response => response.json())
            .then(data => setListaClientes(data))
            console.log(listaClientes[0])
    }

    const verimagen=()=>{
        window.open(ipbackend+imagencasa,"_blank");
    }

    function isAdmin() {
        let role = sessionStorage.getItem("role");
        return role == "Admin";
    }

    const mostrarCliente=()=>{
        ventanaModal();
    }
    const mostrarPagos=()=>{
        ventanaModal2();
    }
    const Registrarpago=()=>{
        ventanaModal3();
    }
    const addpagos = () => {
        Axios.post(ipbackend+"pago", {
            num_contrato: num_contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
            anio: anio,
            mediopago: mediopago,
            observacion: observacion,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
            limpiarcampos();
            getPagos();
            ventanaModal3();
            alert("Pago Registrado con exito");
            ventanaModal2();
        }).catch((error) => {
            console.log(error.response.status)
          if (401 === error.response.status){
            limpiarcampos();
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };
    const capturarID = (cliente) => {
        setNum_contrato(cliente.num_contrato);
        setDnicli(cliente.dnicliente);
        setNombrecli(cliente.nombrecli);
        setApellidocli(cliente.apellidocli);
        setDiapago(cliente.diapago);
        setDireccioncli(cliente.direccioncli);
        setDistritocli(cliente.distritocli);
        setNombreplan(cliente.nombreplan);
        setFechacontrato(cliente.fecha_contrato);
        setTelefonocli(cliente.telefonocli);
        setFecha_nacimiento(cliente.fecha_nacimiento);
        setVelocidadplan(cliente.velocidadplan);
        setPrecioplan(cliente.precioplan);
        setFechaprog_instalacion(cliente.fechaprog_instalacion);
        setUser_create(cliente.user_create);
        setGeolocalizacion(cliente.geolocalizacion);
        setEstadodc_instalacion(cliente.estadodc_instalacion);
        setFechainstalacion(cliente.fechainstalacion);
        setImagencasa(cliente.nombreimg);
        setObservacion_instalacion(cliente.observacion_instalacion);

        mostrarCliente();
    }
    const capturarIDpago = (cliente) =>{
        setNum_contrato(cliente.num_contrato);
        setDnicli(cliente.dnicliente);
        setNombrecli(cliente.nombrecli);
        setApellidocli(cliente.apellidocli);
        setDiapago(cliente.diapago);
        setNombreplan(cliente.nombreplan);
        setVerPagos(false);
        mostrarPagos();   
    }
    const Verpagos = ()=> {
        console.log("contrato seleccionado es: "+num_contrato)
        let results3 = listaPagos.filter(function(cli) {
            return cli.num_contrato == num_contrato;
          });
        setResults2(results3);
        setVerPagos(true);
        }

        const limpiarcampos = ()=>{
            setMontopago(0);
            setFechapago(fechaactual);
            setMespago(mes);
            setAnio(anioactual);
            setMediopago("");
            setObservacion("");
          }
       
    //Funcion de Busqueda
    const searcher = (e) =>{
        setBusqueda(e.target.value);
        }
    //Funcion de Filtrado
     const newfilter = listaClientes.filter(dato => {
        return (
    dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    dato.direccioncli.toLowerCase().includes(busqueda.toLocaleLowerCase())
    )
    });

    let results = [];
    
    if (busqueda === "") {
        results = listaClientes;
    } else {
        results = newfilter;
    }

    useEffect(() =>{
        getClientes()
        getPagos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className="App">
            <h1 className='mb-3'>Contratos y Clientes Activos</h1>
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por: DNI/Apellidos/Dirección' className='form-control border border-success'/>
              <table className='table table-striped table-hover mt-5 shadow-lg'>
                    <thead>
                        <tr className='bg-curso text-white'>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Distrito</th>
                            <th>Direccion</th>
                            <th>Tecnico</th>
                            <th></th>
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
                                <td>{cliente.user_create}</td>
                                <td><button type="button" className="btn btn-outline-success" 
                                onClick={()=>{capturarID(cliente);
                                }}>Detalles</button></td>
                                <td><button type='button' className='btn btn-outline-success'
                                onClick={()=>{capturarIDpago(cliente);
                                }}>Pagos</button></td>
                            </tr>
                    ))}
                    </tbody>
            </table>

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
                <ModalBody>
                <div className='container'>
                    <h3 className=''>Detalle del Contrato</h3>
                    <div className='row mb-2'>
                        <div className='col-4'>Num_Contrato:</div>
                        <div className='col-6'>{num_contrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>DNI Cliente:</div>
                        <div className='col-6'>{dnicli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Apellido Cliente:</div>
                        <div className="col-6">{apellidocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Nombre Cliente:</div>
                        <div className="col-6">{nombrecli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha nacimiento:</div>
                        <div className="col-6">{fecha_nacimiento}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Telefono Cliente:</div>
                        <div className="col-6">{telefonocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Direccion Cliente:</div>
                        <div className="col-6">{direccioncli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Distrito:</div>
                        <div className="col-6">{distritocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Plan:</div>
                        <div className="col-6">{nombreplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha Contrato:</div>
                        <div className="col-6">{fechacontrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Dia Pago:</div>
                        <div className="col-6">{diapago}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Precio Plan:</div>
                        <div className="col-6">{precioplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Velocidad Plan:</div>
                        <div className="col-6">{velocidadplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Instalacion programada:</div>
                        <div className="col-6">{fechaprog_instalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Tecnico:</div>
                        <div className="col-6">{user_create}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Ubicación Casa:</div>
                        <div className="col-6"><Link to={"https://www.google.com/maps/search/?api=1&query="+geolocalizacion+"&zoom=20"} target="_blank"><a>{geolocalizacion}</a></Link></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Instalación ejecutada:</div>
                        <div className="col-6">{fechainstalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Imagen de la casa:</div>
                        <div className="col-6">{imagencasa}<button onClick={verimagen}>Ver imagen</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Observación instalación:</div>
                        <div className="col-6">{observacion_instalacion}</div>
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-danger' onClick={ventanaModal}>Cerrar</button>
                </ModalFooter>
            </Modal>

            {/* MODAL PARA MOSTRAR LOS PAGOS DEL CLIENTE
                         */}
            <Modal isOpen={modalPagos} toggle={ventanaModal2}>
                <ModalBody>
                <div className='container'>
                    <h3 className=''>Detalle de Pagos del Cliente</h3>
                    <div className='row mb-2'>
                        <div className='col-4'>DNI Cliente:</div>
                        <div className='col-6'>{dnicli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Contrato:</div>
                        <div className='col-6'>{num_contrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Cliente:</div>
                        <div className="col-6">{nombrecli+" "+apellidocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Dia pago:</div>
                        <div className='col-6'>{diapago}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Nombre Plan:</div>
                        <div className='col-6'>{nombreplan}</div>
                    </div>

                    <button onClick={Verpagos} className='btn btn-outline-success'>Ver Pagos</button>
                    { isAdmin() ? (
                        <button onClick={Registrarpago} className='btn btn-outline-success'>Registrar Pago</button>
                    ): null}
                    
                    <div>
                    {
                        verPagos ? 
                            <table className='table table-hover mt-5 shadow-lg'>
                                <thead>
                                    <tr className='bg-curso text-white'>
                                        <th>Año</th>
                                        <th>Mes Fact</th>
                                        <th>Monto</th>
                                        <th>Medio pago</th>
                                        <th>Fecha_Pago</th>
                                        <th>Obs</th>    
                                    </tr>
                                </thead>
                                <tbody>
                                {results2.map((pagos, key)=>(
                                        <tr key={pagos.idpago}>
                                            <td>{pagos.anio}</td>
                                            <td>{pagos.mespago}</td>
                                            <td>{pagos.montopago}</td>
                                            <td>{pagos.mediopago}</td>
                                            <td>{pagos.fechapago}</td>
                                            <td>{pagos.observacion}</td>
                                        </tr>
                                ))}
                                </tbody>
                            </table>
                        :null
                    }
                    
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-danger' onClick={ventanaModal2}>Cerrar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalPagar} toggle={ventanaModal3}>
                <ModalBody>
                <div className='from-group'>
                <h4 className=''>Registrar pago:</h4>
                <div className='mb-3'>
                        <label for='contrato' className="form-label">DNI Cliente:</label>
                        <span className='form-control'>{dnicli}</span>
                        <label for='contrato' className="form-label">Número de contrato:</label>
                        <span className='form-control'>{num_contrato}</span>
                        <label for='contrato' className="form-label">Nombres y Apellidos:</label>
                        <span className='form-control'>{nombrecli+" "+apellidocli}</span>
                </div>
                <div className="mb-3">
                        <label for='descplan' className="form-label">
                          Monto Pagado:
                        </label>
                        <input type="text" value={montopago}
                          onChange={(event) => { setMontopago(event.target.value); }}
                          className="form-control" id="descplan" placeholder="Ingrese monto pagado" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='fechapago' className="form-label">
                          Fecha Pago:
                        </label>
                        <input type="date" value={fechapago}
                          onChange={(event) => { setFechapago(event.target.value); }}
                          className="form-control" id="fechapago" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='mesfacturado' className="form-label">
                          Mes Facturado:
                        </label>
                        <select value={mespago}
                            onChange={(event) => { setMespago(event.target.value); }}
                            className="form-select" aria-describedby="basic-addon1"
                            >
                            <option>1</option><option>2</option><option>3</option>
                            <option>4</option><option>5</option><option>6</option>
                            <option>7</option><option>8</option><option>9</option>
                            <option>10</option><option>11</option><option>12</option>
                        </select>
                </div>
                <div className="mb-3">
                          <label for='estado' className="form-label">
                            Año:
                          </label>
                          <input type="text" value={anio}
                          onChange={(event) => { setAnio(event.target.value); }}
                          className="form-control" id="año facturado" placeholder="Ingrese mes facturado" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                          <label for='mediopago' className="form-label">
                            Medio Pago:
                          </label>
                          <input type="text" value={mediopago}
                          onChange={(event) => { setMediopago(event.target.value); }}
                          className="form-control" id="Medio de pago" placeholder="Ej. Yape/Plin/Transferencia/efectivo " aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                          <label for='observaciones' className="form-label">
                            Obervaciones:
                          </label>
                          <input type="text" value={observacion}
                          onChange={(event) => { setObservacion(event.target.value); }}
                          className="form-control" id="observaciones" placeholder="Observaciones" aria-describedby="basic-addon1"
                        ></input>
                </div>
                </div>
                </ModalBody>
                <ModalFooter>
                        <button className="btn btn-success" onClick={addpagos}>Registrar</button>
                        <button className='btn btn-danger' onClick={ventanaModal3}>Cerrar</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
export default Principal;