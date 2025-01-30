import React, { useState, useEffect } from 'react'
import { CSVLink } from "react-csv";
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../utils/const';

function ControlPagos() {
    const [listaPagos, setListaPagos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    
    let ipbackend = `${API.URL}`;
    let token = sessionStorage.getItem("token");

    function isAdmin() {
      let role = sessionStorage.getItem("role");
      return role == "Admin";
  }

        function getControlPagos(){
            fetch(ipbackend+'getcontrolpagos', {
              headers:{
                'Authorization': `Bearer ${token}`
              }
            })
                .then(response => response.json())
                .then(data => setListaPagos(data))
        }

    //Funcion de Busqueda
    const searcher = (e) =>{
        setBusqueda(e.target.value);
    }
    
     const newfilter = listaPagos.filter(dato => {
        return (
    dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
    )
    });
    
    let results = [];

    if (busqueda === "") {
        results = listaPagos;
    } else {
        results = newfilter;
    }

     useEffect(() =>{   
        getControlPagos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return(
        <div className='App'>
            <h1 className='mb-3'>Control de Pagos</h1>   
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o Apellidos' className='form-control border border-success'/>
            {
              isAdmin() ?(
                <CSVLink data={results}><button className='btn btn-success mt-2'>Exportar CSV</button></CSVLink>
                
              ):null
            }
            <div className='table-responsive'>
              <table className='table table-striped table-hover mt-3 shadow-lg'>
                      <thead>
                          <tr className='bg-curso text-white'>
                              <th>DNI</th>
                              <th>Apellidos</th>
                              <th>Nombres</th>
                              <th>Inicio servicio</th>
                              <th>Servicio</th>
                              <th>N° meses</th>
                              <th>Pago mensual</th>
                              <th>Deuda total</th>
                              <th>Pendiente</th>
                              <th>Estado pago</th>                          
                          </tr>
                      </thead>
                      <tbody>
                      {results.map((pago, key)=>(
                              <tr key={pago.num_contrato}>
                                  <td>{pago.dnicliente}</td>
                                  <td>{pago.apellidocli}</td>
                                  <td>{pago.nombrecli}</td>
                                  <td>{pago.incio_servicio}</td>
                                  <td>{pago.servicio}</td>
                                  <td>{pago.total_meses}</td>
                                  <td>{pago.pago_mensual}</td>
                                  <td>{pago.deuda_total}</td>
                                  <td>{pago.pago_pendiente}</td>
                                  <td>{pago.estado}</td>            
                              </tr>
                      ))}
                      </tbody>
              </table>
            </div>
        </div>
    )
}
export default ControlPagos;
