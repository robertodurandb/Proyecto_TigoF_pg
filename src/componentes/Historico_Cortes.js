import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from '../utils/const'

function Historico_Cortes() {
    const [Listacambioestados, setListacambioestados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
   
    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;
 
  const getCambioEstados = async () => {
        try {
          const response = await Axios.get(ipbackend+'getcambioestadosall', {
            headers:{
                'Authorization': `Bearer ${token}`
            }
          }
          );
          setListacambioestados(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          if (error.response && error.response.status === 401){
            sessionStorage.removeItem("token");
            window.location.reload();
            alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
      };

  //Funcion de Busqueda
  const searcher = (e) =>{
    setBusqueda(e.target.value);
    console.log(e.target.value)
    }
//Funcion de Filtrado
 const newfilter = Listacambioestados.filter(dato => {
    return (
dato.clienteactual_dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
)
});

let results = [];

if (busqueda === "") {
    results = Listacambioestados;
} else {
    results = newfilter;
}

  useEffect(() =>{
    getCambioEstados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
      <h1 className="mb-3">Histórico de Cortes y Activaciones</h1>
      <br />
      <br />
      <input
        value={busqueda}
        onChange={searcher}
        type="text"
        placeholder="Busqueda por DNI o por Apellidos"
        className="form-control border border-success"
      />
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">DNI</th>
              <th scope="col">Apellidos</th>
              <th scope="col">Nombres</th>
              <th scope="col">Estado anterior</th>
              <th scope="col">Nuevo estado</th>
              <th scope="col">Detalle</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora</th>
              <th scope="col">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {results.map((val, key) => {
              return (
                <tr>
                  <th>{val.clienteactual_dnicliente}</th>
                  <td>{val.apellidocli}</td>
                  <td>{val.nombrecli}</td>
                  <td>{val.nomestado_anterior}</td>
                  <td>{val.nomestado_actual}</td>
                  <td>{val.detalle}</td>
                  <td>{val.fecha_create}</td>
                  <td>{val.hora_create}</td>
                  <td>{val.user_create}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Historico_Cortes;