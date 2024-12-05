import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../utils/const';

function Logs_Carga() {
    const [objetos, setObjetos] = useState([]);

    let ipbackend = `${API.URL}`;
    let token = sessionStorage.getItem("token");
   
    const fetchLogData = async () => {
      try {
        const response = await fetch(ipbackend+'getlogs', {
          headers:{
            'Authorization': `Bearer ${token}`
          }
        }); // Reemplaza con la ruta de tu endpoint
        const data = await response.text()
        
        // Dividir el texto por puntos y añadir saltos de línea
        //const partes = data.split('\r\n');
        const partes = data.split('.');
        const newtexto = partes.map(parte => ({parte}));
        setObjetos(newtexto)
      } catch (error) {
        alert('Error al obtener los datos del log:', error);
      }
    };
  
     useEffect(() =>{   
        fetchLogData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return(
        <div className='App'> 
          <h1 className='mb-3'>Registro de Logs de Errores al importar Pagos v2</h1>  
          <table className="table table-striped table-hover mt-3 shadow-lg">
          <thead>
            <tr className='bg-curso text-white'>
                            <th>Detalle Logs</th>
            </tr>
          </thead>
          <tbody>
          {objetos.map((objeto, key)=>(
                            <tr key={objeto.parte}>
                                <td>{objeto.parte}</td>           
                            </tr>
                    ))}
          </tbody>
        </table>
        </div>
    )
}
export default Logs_Carga;
