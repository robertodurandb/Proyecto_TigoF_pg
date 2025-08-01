import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API from '../utils/const'

function Historico_Planes() {
    const [Listacambioplanes, setListacambioplanes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
   
    let token = sessionStorage.getItem("token");
    let ipbackend = `${API.URL}`;
 
  const getCambioPlanes = async () => {
        try {
          const response = await Axios.get(ipbackend+'gethistorico_planes', {
            headers:{
                'Authorization': `Bearer ${token}`
            }
          }
          );
          setListacambioplanes(response.data);
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
 const newfilter = Listacambioplanes.filter(dato => {
    return (
dato.clienteactual_dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
)
});

let results = [];

if (busqueda === "") {
    results = Listacambioplanes;
} else {
    results = newfilter;
}

  useEffect(() =>{
    getCambioPlanes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
      <h1 className="mb-3">Histórico de Planes y Descuentos</h1>
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
              <th scope="col">Plan anterior</th>
              <th scope="col">Descuento anterior</th>
              <th scope="col">Plan nuevo</th>
              <th scope="col">Descuento nuevo</th>
              <th scope="col">Comentario</th>
              <th scope="col">Fecha</th>
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
                  <td>{val.plan_anterior}</td>
                  <td>{val.descuento_anterior}</td>
                  <td>{val.plan_nuevo}</td>
                  <td>{val.descuento_nuevo}</td>
                  <td>{val.comentario}</td>
                  <td>{val.fecha_create}</td>
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

export default Historico_Planes;