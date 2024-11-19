import React, { useState, useEffect } from 'react'
import axios from "axios";
import { CSVLink } from "react-csv";
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../utils/const';

function Cortes_Activaciones() {
    const [listaCortes, setListaCortes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    let ipbackend = `${API.URL}`;
    let token = sessionStorage.getItem("token");

    function isAdmin() {
      let role = sessionStorage.getItem("role");
      return role == "Admin";
  }

        function getCortes(){
            fetch(ipbackend+'getcambioestadosall', {
              headers:{
                'Authorization': `Bearer ${token}`
              }
            })
                .then(response => response.json())
                .then(data => setListaCortes(data))
        }
  
    //Funcion de Busqueda
    const searcher = (e) =>{
        setBusqueda(e.target.value);
    }
    
     const newfilter = listaCortes.filter(dato => {
        return (
    dato.cliente_dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
    )
    });
    
    let results = [];

    if (busqueda === "") {
        results = listaCortes;
    } else {
        results = newfilter;
    }

     useEffect(() =>{   
        getCortes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return(
        <div className='App'>   
          <h1 className='mb-3'>Registro de Cortes y/o Activaciones</h1>   
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o Apellidos' className='form-control border border-success'/>
            {
              isAdmin() ?(
                <CSVLink data={results}><button className='btn btn-success mt-2'>Exportar CSV</button></CSVLink>
              ):null
            }
            
            <table className='table table-striped table-hover mt-3 shadow-lg'>
                    <thead>
                        <tr className='bg-curso text-white'>
                            <th>Contrato</th>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Descripcion</th>
                            <th>User</th>
                                                   
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((corte, key)=>(
                            <tr key={corte.num_contrato}>
                                <td>{corte.num_contrato}</td>
                                <td>{corte.cliente_dnicliente}</td>
                                <td>{corte.apellidocli}</td>
                                <td>{corte.nombrecli}</td>
                                <td>{corte.fecha_create}</td>
                                <td>{corte.hora_create}</td>
                                <td>{corte.nomestado_actual}</td>
                                <td>{corte.detalle}</td>   
                                <th>{corte.user_create}</th>       
                            </tr>
                    ))}
                    </tbody>
            </table>

        </div>
    )
}
export default Cortes_Activaciones;
