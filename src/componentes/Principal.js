import React, { useEffect, useState } from 'react'
//import '../estilos/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

function Principal() {

    const [listaClientes, setListaClientes] = React.useState([]);
    const [busqueda, setBusqueda] = React.useState("");

    //Datos para el Modal
    const [num_contrato, setNum_contrato] = useState();
    const [dnicli, setDnicli] = useState();
    const [nombrecli, setNombrecli] = useState();
    const [apellidocli, setApellidocli] = useState();
    const [direccioncli, setDireccioncli] = useState();
    const [distritocli, setDistritocli] = useState();
    const [telefonocli, setTelefonocli] = useState();
    const [nombreplan, setNombreplan] = useState();
    const [fechacontrato, setFechacontrato] = useState();
    const [precioplan, setPrecioplan] = useState();
    const [velocidadplan, setVelocidadplan] = useState();
    const [diapago, setDiapago] = useState();
    const [nombrecaja, setNombrecaja] = useState();
    const [localizacion, setLocalizacion] = useState();
    const [fecha_instalacion, setFecha_instalacion] = useState();
    const [ubicacioninstalacion, setUbicacioninstalacion] = useState();

    const [modalMostrar, setModalMostrar] = React.useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    let ipbackend = "http://10.0.28.60:9100/";

    function getClientes(){
        fetch(ipbackend+'todolist')
            .then(response => response.json())
            .then(data => setListaClientes(data))
            console.log(listaClientes[1]);
    }

    const mostrarCliente=()=>{
        ventanaModal();
    }
    const capturarID = (cliente) => {
        setNum_contrato(cliente.num_contrato);
        setDnicli(cliente.dnicliente);
        setNombrecli(cliente.nombrecli);
        setApellidocli(cliente.apellidocli);
        setDiapago(cliente.diapago);
        setDireccioncli(cliente.direccioncli);
        setDistritocli(cliente.distritocli);
        setLocalizacion(cliente.localizacion);
        setNombrecaja(cliente.nombrecaja);
        setNombreplan(cliente.nombreplan);
        setFechacontrato(cliente.fecha_contrato);
        setTelefonocli(cliente.telefonocli);
        setVelocidadplan(cliente.velocidadplan);
        setPrecioplan(cliente.precioplan);
        setFecha_instalacion(cliente.fecha_instalacion);
        setUbicacioninstalacion(cliente.ubicacioninstalacion);

        mostrarCliente();
    }
    //Funcion de Busqueda
    const searcher = (e) =>{
        setBusqueda(e.target.value);
        console.log(e.target.value);
    }
    //Funcion de Filtrado
    //  const results = !busqueda ? listaClientes : listaClientes.filter((dato)=> dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()))
     const newfilter = listaClientes.filter(dato => {
        return (
    dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
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
    }, [])

    return(
        <div className="App">
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o por Apellidos' className='form-control'/>
              <table className='table table-striped table-hover mt-5 shadow-lg'>
                    <thead>
                        <tr className='bg-curso text-white'>
                            <th>DNI</th>
                            <th>N° Contrato</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Direccion</th>
                            <th>Distrito</th>
                            <th>Instalacion</th>
                            <th>Plan</th>
                            
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((cliente, key)=>(
                            <tr key={cliente.num_contrato} value={num_contrato}>
                                <td>{cliente.dnicliente}</td>
                                <td>{cliente.num_contrato}</td>
                                <td>{cliente.nombrecli}</td>
                                <td>{cliente.apellidocli}</td>
                                <td>{cliente.direccioncli}</td>
                                <td>{cliente.distritocli}</td>
                                <td>{cliente.instalacion}</td>
                                <td>{cliente.nombreplan}</td>
                                <td><button type="button" className="btn btn-outline-success" 
                                onClick={()=>{capturarID(cliente);
                                }}>Detalles</button></td>
                            </tr>
                    ))}
                    </tbody>
            </table>

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
                <ModalBody>
                <div className='container'>
                    <h3 className=''>Detalle del Contrato</h3>
                    <div className='row mb-2'>
                        <div className='col-4'>DNI Cliente:</div>
                        <div className='col-6'>{dnicli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Nombre Cliente:</div>
                        <div className="col-6">{nombrecli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Apellido Cliente:</div>
                        <div className="col-6">{apellidocli}</div>
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
                        <div className='col-4'>Nombre Caja:</div>
                        <div className="col-6">{nombrecaja}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Ubicacion Caja:</div>
                        <div className="col-6"><Link to={localizacion} target='_blank'>{localizacion}</Link></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Ubicacion Vivienda:</div>
                        <div className="col-6"><Link to={ubicacioninstalacion} target='_blank'>{ubicacioninstalacion}</Link></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha Instalacion:</div>
                        <div className="col-6">{fecha_instalacion}</div>
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-danger' onClick={ventanaModal}>Cerrar</button>
                </ModalFooter>
            </Modal>
            
        </div>
    )
}
export default Principal;