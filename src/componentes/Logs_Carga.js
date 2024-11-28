import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../utils/const';

function Logs_Carga() {
    const [logs, setLogs] = useState([]);

    let ipbackend = `${API.URL}`;
    let token = sessionStorage.getItem("token");
   
    function getLogs(){
        fetch(ipbackend+'logs', {
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
            .then(response => response.json())
            .then(data => setLogs(data))
            .catch(error => console.error(error));
    }
    function prueba1(){
      let objeto = Object.values(logs)
      console.log(objeto)
    }
  
     useEffect(() =>{   
        getLogs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return(
        <div className='App'> 
        <button onClick={prueba1}>prueba</button>  
          <h1 className='mb-3'>Registro de Logs de la Carga de Pagos</h1>   
            {logs}
        </div>
    )
}
export default Logs_Carga;
