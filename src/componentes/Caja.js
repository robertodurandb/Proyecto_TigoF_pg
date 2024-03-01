import React, { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Caja() {
  const [idcaja, setIdcaja] = useState("");
  const [nombrecaja, setNombrecaja] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [cajas, setCajas] = useState([]);
  const [editar, setEditar] = useState(false);

  let token = sessionStorage.getItem("token");
  let ipbackend = "http://192.168.18.8:9100/";

  const add = () => {
    Axios.post(ipbackend+"caja", {
      idcaja: idcaja,
      nombrecaja: nombrecaja,
      localizacion: localizacion,
      estado: estado,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getCajas();
      limpiarcampos();
      alert("Caja Registrada con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  const getCajas = () => {
    Axios.get(ipbackend+"cajas").then((response) => {
      setCajas(response.data);
    });
  };
  const editarCajas = (val)=>{
    setEditar(true);
    setIdcaja(val.idcaja);
    setNombrecaja(val.nombrecaja);
    setLocalizacion(val.localizacion);
    setEstado(val.estado);
  }
  const update = () => {
    Axios.put(ipbackend+"caja/"+idcaja, {
      idcaja: idcaja,
      nombrecaja: nombrecaja,
      localizacion: localizacion,
      estado: estado,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getCajas();
      limpiarcampos();
      alert("Caja Actualizada con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  const limpiarcampos = ()=>{
    setIdcaja("");
    setNombrecaja("");
    setLocalizacion("");
    setEstado("Activo");
    setEditar(false);
  }

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestion de Cajas</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              IdCaja:
            </span>
            <input type="text" value={idcaja}
              onChange={(event) => { setIdcaja(event.target.value); }}
              className="form-control" placeholder="Ingrese Id Caja" aria-label="IdCaja" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre Caja:
            </span>
            <input type="text" value={nombrecaja}
              onChange={(event) => { setNombrecaja(event.target.value); }}
              className="form-control" placeholder="Ejm: Terminal 01 Spliter 01" aria-label="Terminal" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Ubicacion:
            </span>
            <input type="text" value={localizacion}
              onChange={(event) => { setLocalizacion(event.target.value); }}
              className="form-control" placeholder="Ingrese Localización de Caja" aria-label="Detalle" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Estado:
            </span>
            <select value={estado}
            onChange={(event) => { setEstado(event.target.value); }}
            className="form-control" aria-label="Estado" aria-describedby="basic-addon1"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          {
            editar? 
            <div>
            <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
            <button className="btn btn-info m-2" onClick={limpiarcampos}>Cancelar</button>
            </div>
            :<button className="btn btn-success" onClick={add}>Registrar</button>
          }
          
        </div>
        <div className="lista">
          <button className="btn btn-info" onClick={getCajas}>
            Editar Datos
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre Caja</th>
              <th scope="col">Localizacion</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {cajas.map((val, key) => {
            return <tr key={val.idcaja}>
                    <th>{val.idcaja}</th>
                    <td>{val.nombrecaja}</td>
                    <td>{val.localizacion}</td>
                    <td>{val.estado}</td>
                    <td>
                    <button type="button" className="btn btn-info" 
                    onClick={()=>{
                      editarCajas(val);
                    }}>
                      Editar
                    </button>
                    </td>
            </tr>
           
          })}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Caja;
