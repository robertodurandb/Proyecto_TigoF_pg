import React, { useState, useEffect } from 'react'
import Axios from "axios";
import { CSVLink } from "react-csv";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

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


function Consultapagos() {
    const [listaPagos, setListaPagos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalMostrar, setModalMostrar] = useState(false);
    const [idpago, setIdpago] = useState("");
    const [num_contrato, setNum_contrato] = useState("");
    const [montopago, setMontopago] = useState("");
    const [fechapago, setFechapago] = useState(fechaactual);
    const [mespago, setMespago] = useState("");
    const [anio, setAnio] = useState("");
    const [observacion, setObservacion] = useState("");
    const [mediopago, setMediopago] = useState("");

    let token = sessionStorage.getItem("token");
    let ipbackend = "https://michel.zapto.org:9100/";

    const ventanaModal = () => setModalMostrar(!modalMostrar);

    const mostrarPagos=()=>{
        ventanaModal();
    }

    function isAdmin() {
      let role = sessionStorage.getItem("role");
      return role == "Admin";
  }

        function getPagos(){
            fetch(ipbackend+'pagos2')
                .then(response => response.json())
                .then(data => setListaPagos(data))
        }
        const update = () => {
          Axios.put(ipbackend+"pago/"+idpago, {
              num_contrato: num_contrato,
              montopago: montopago,
              mespago: mespago,
              fechapago: fechapago,
              anio: anio,
              mediopago: mediopago,
              observacion: observacion
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(() => {
            limpiarcampos();
            ventanaModal();
            getPagos();
            alert("Pago Actualizado con exito");
          }).catch((error) => {
            if (401 === error.response.status){
            sessionStorage.removeItem("token");
            window.location.reload();
            alert("Sesión expirada, vuelva a iniciar sesión");
            }
            return error;
            });
        };
    //Funcion de Busqueda
    const searcher = (e) =>{
        setBusqueda(e.target.value);
    }
    
     const newfilter = listaPagos.filter(dato => {
        return (
    dato.cliente_dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
    )
    });
    
    let results = [];

    if (busqueda === "") {
        results = listaPagos;
    } else {
        results = newfilter;
    }

    //CAPTURAR ID PAGO SELECCIONADO A EDITAR
    const capturarID = (pago) =>{
        setIdpago(pago.idpago)
        setNum_contrato(pago.num_contrato);
        setMontopago(pago.montopago);
        setMespago(pago.mespago);
        setAnio(pago.anio);
        setMediopago(pago.mediopago);
        setObservacion(pago.observacion);
        setFechapago(pago.fechapago);
        
        mostrarPagos();   
    }

    const limpiarcampos = ()=>{
      setIdpago("");
      setNum_contrato("");
      setMontopago("");
      setMespago("");
      setFechapago(fechaactual);
      setAnio("");
      setMediopago("")
      setObservacion("");
      ventanaModal();
    }

     useEffect(() =>{   
        getPagos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return(
        <div className='App'>
          <h1 className='mb-3'>Registro de Pagos</h1>
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o Apellidos' className='form-control border border-success'/>
            {
              isAdmin() ?(
                <CSVLink data={results}><button className='btn btn-success mt-2'>Exportar CSV</button></CSVLink>
              ):null
            }
            
            
            <table className='table table-striped table-hover mt-3 shadow-lg'>
                    <thead>
                        <tr className='bg-curso text-white'>
                            <th>N° Contrato</th>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Plan contratado</th>
                            <th>Fecha_pago</th>
                            <th>Monto pagado</th>
                            <th>Medio de pago</th>
                            <th>Mes Facturado</th>
                            <th>Año</th>
                            {isAdmin() ?(
                              <th>Acción</th>
                            ):null}
                            
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((pago, key)=>(
                            <tr key={pago.idpago}>
                                <td>{pago.num_contrato}</td>
                                <td>{pago.cliente_dnicliente}</td>
                                <td>{pago.apellidocli}</td>
                                <td>{pago.nombrecli}</td>
                                <td>{pago.nombreplan}</td>
                                <td>{pago.fechapago}</td>
                                <td>{pago.montopago}</td>
                                <td>{pago.mediopago}</td>
                                <td>{pago.mespago}</td>
                                <td>{pago.anio}</td>
                                {isAdmin() ?(
                                  <td><button type="button" className="btn btn-outline-success"
                                  onClick={()=>{capturarID(pago);
                                  }}>Editar</button></td>
                                ):null}
                                
                            </tr>
                    ))}
                    </tbody>
            </table>

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
                <ModalBody>
                <div className='from-group'>
                <h4 className=''>Modificar Pago:</h4>
                <div className='mb-3'>
                        <label for='num_contrato' className="form-label">Numero Contrato:</label>
                        <input type="number" value={num_contrato}
                                onChange={(event) => { setNum_contrato(event.target.value); }}
                                className="form-control" id="num_contrato" placeholder="Número de Contrato" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='montopago' className="form-label">
                          Monto pagado:
                        </label>
                        <input type="number" value={montopago}
                          onChange={(event) => { setMontopago(event.target.value); }}
                          className="form-control" id="montopago" placeholder="Monto Pago" aria-describedby="basic-addon1"
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
                        <label for='mespago' className="form-label">
                          Periodo/mes Facturado:
                        </label>
                        <input type="text" value={mespago}
                          onChange={(event) => { setMespago(event.target.value); }}
                          className="form-control" id="mespago" placeholder="Mes Facturado" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='aniofacturado' className="form-label">
                          Año Facturado:
                        </label>
                        <input type="number" value={anio}
                          onChange={(event) => { setAnio(event.target.value); }}
                          className="form-control" id="aniofacturado" placeholder="Año Facturado" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                        <label for='mediopago' className="form-label">
                          Medio Pago:
                        </label>
                        <input type="text" value={mediopago}
                          onChange={(event) => { setMediopago(event.target.value); }}
                          className="form-control" id="mediopago" placeholder="Medio Pago" aria-describedby="basic-addon1"
                        ></input>
                </div>
                <div className="mb-3">
                          <label for='observacion' className="form-label">
                            Observacion:
                          </label>
                          <input type="number" value={observacion}
                          onChange={(event) => { setObservacion(event.target.value); }}
                          className="form-control" id="observacion" placeholder="Observacion" aria-describedby="basic-addon1"
                        ></input>
                </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
    
                    <button className='btn btn-danger' onClick={limpiarcampos}>Cerrar</button>
                </ModalFooter>
            </Modal>

        </div>
    )

}
export default Consultapagos;
