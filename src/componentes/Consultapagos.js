import React, { useState, useEffect } from 'react'
import axios from "axios";
import { CSVLink } from "react-csv";
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../utils/const';

function Consultapagos() {
    const [listaPagos, setListaPagos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    let ipbackend = `${API.URL}`;
    let token = sessionStorage.getItem("token");

    function isAdmin() {
      let role = sessionStorage.getItem("role");
      return role == "Admin";
  }

  //***************** CODIGO PARA SUBIR EXCEL **********/
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('excel', selectedFile);

  try {
      const response = await axios.post(ipbackend+'importar', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
        alert("Se cargó con éxito ")
        getPagos();
        setSelectedFile(null);
  } catch (error) {
      console.error(error);
      alert("Hay un error con el archivo: "+error.response.data)
  }
};

        function getPagos(){
            fetch(ipbackend+'getpagosall', {
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
    dato.dnipago.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
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
          <div>
            <form className="input-group mb-3" onSubmit={handleSubmit}>
            <input type="file" className="form-control" onChange={handleFileChange}/>
            <br/>
            <button type="submit" className="btn btn-secondary">Cargar</button>
            </form>
            </div>    
          <h1 className='mb-3'>Reporte de Pagos</h1>      
            <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o Apellidos' className='form-control border border-success'/>
            {
              isAdmin() ?(
                <CSVLink data={results}><button className='btn btn-success mt-2'>Exportar CSV</button></CSVLink>
              ):null
            }
            
            <table className='table table-striped table-hover mt-3 shadow-lg'>
                    <thead>
                        <tr className='bg-curso text-white'>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Fecha_pago</th>
                            <th>Hora_pago</th>
                            <th>Descripcion</th>
                            <th>Monto</th>
                            <th>Agencia</th>
                            <th>Operacion</th>                            
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((pago, key)=>(
                            <tr key={pago.idpago}>
                                <td>{pago.dnipago}</td>
                                <td>{pago.apellidocli}</td>
                                <td>{pago.nombrecli}</td>
                                <td>{pago.fechapago2}</td>
                                <td>{pago.hora}</td>
                                <td>{pago.descripcion}</td>
                                <td>{pago.monto}</td>
                                <td>{pago.agencia}</td>
                                <td>{pago.operacion}</td>            
                            </tr>
                    ))}
                    </tbody>
            </table>

        </div>
    )
}
export default Consultapagos;
