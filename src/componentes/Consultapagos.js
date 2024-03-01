import React, { useState, useEffect } from 'react'
import { CSVLink } from "react-csv";
import 'bootstrap/dist/css/bootstrap.min.css';
function Consultapagos() {
    const [listaPagos, setListaPagos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    let ipbackend = "http://192.168.18.8:9100/";

        function getPagos(){
            fetch(ipbackend+'pagos2')
                .then(response => response.json())
                .then(data => setListaPagos(data))
                console.log(listaPagos[0]);
        }
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


     useEffect(() =>{   
        getPagos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    
    

    return(
        <div className='App'>
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o Apellidos' className='form-control'/>
            <CSVLink data={results}>Exportar CSV</CSVLink>
            <table className='table table-striped table-hover mt-5 shadow-lg'>
                    <thead>
                        <tr className='bg-curso text-white'>
                            <th>N°Contrato</th>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Plan contratado</th>
                            <th>Monto a pagar</th>
                            <th>Fecha_pago</th>
                            <th>Monto pagado</th>
                            <th>Medio de pago</th>
                            <th>Mes_Facturado</th>
                            <th>Año</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((pagos, key)=>(
                            <tr>
                                <td>{pagos.num_contrato}</td>
                                <td>{pagos.cliente_dnicliente}</td>
                                <td>{pagos.apellidocli}</td>
                                <td>{pagos.nombrecli}</td>
                                <td>{pagos.nombreplan}</td>
                                <td>{pagos.precioplan}</td>
                                <td>{pagos.fechapago}</td>
                                <td>{pagos.montopago}</td>
                                <td>{pagos.mediopago}</td>
                                <td>{pagos.mespago}</td>
                                <td>{pagos.anio}</td>
                            </tr>
                    ))}
                    </tbody>
            </table>
        </div>
    )

}
export default Consultapagos;
