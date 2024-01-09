import React, { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Planes() {
    const [idplanes, setIdplanes] = useState();
    const [nombreplan, setNombreplan] = useState("");
    const [descplan, setDescplan] = useState("");
    const [precioplan, setPrecioplan] = useState();
    const [velocidadplan, setVelocidadplan] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [planes, setPlanes] = useState([]);
    const [editar, setEditar] = useState(false);

    let token = sessionStorage.getItem("token");
    let ipbackend = "http://192.168.18.8:9100/";

  const add = () => {
    Axios.post(ipbackend+"plan", {
      nombreplan: nombreplan,
      descplan: descplan,
      precioplan: precioplan,
      velocidadplan: velocidadplan,
      estado: estado,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getPlanes();
        limpiarcampos();
        alert("Plan Registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  const getPlanes = () => {
    Axios.get(ipbackend+"planes").then((response) => {
      setPlanes(response.data);
    });
  };
  const editarPlan = (val)=>{
    setEditar(true);
    setIdplanes(val.idplanes);
    setNombreplan(val.nombreplan);
    setDescplan(val.descplan);
    setPrecioplan(val.precioplan);
    setVelocidadplan(val.velocidadplan)
    setEstado(val.estado);
    console.log("el id plan capturado es "+idplanes);
    }
  const update = () => {
    Axios.put(ipbackend+"plan/"+idplanes, {
        nombreplan: nombreplan,
        descplan: descplan,
        precioplan: precioplan,
        velocidadplan: velocidadplan,
        estado: estado,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getPlanes();
      limpiarcampos();
      alert("Plan Actualizado con exito");
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
    setIdplanes("");
    setNombreplan("");
    setDescplan("");
    setPrecioplan("");
    setVelocidadplan("");
    setEstado("Activo")
    setEditar(false);
  }

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestion de Planes</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre Plan:
            </span>
            <input type="text" value={nombreplan}
              onChange={(event) => { setNombreplan(event.target.value); }}
              className="form-control" placeholder="Ingrese Nombre del Plan" aria-label="Plan" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Descripción Plan:
            </span>
            <input type="text" value={descplan}
              onChange={(event) => { setDescplan(event.target.value); }}
              className="form-control" placeholder="Ingrese la descripción del plan" aria-label="Descripción" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Precio Plan:
            </span>
            <input type="text" value={precioplan}
              onChange={(event) => { setPrecioplan(event.target.value); }}
              className="form-control" placeholder="Ingrese Precio del plan" aria-label="Precio" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Velocidad Plan:
            </span>
            <input type="text" value={velocidadplan}
              onChange={(event) => { setVelocidadplan(event.target.value); }}
              className="form-control" placeholder="Ingrese Velocidad del plan" aria-label="Velocidad" aria-describedby="basic-addon1"
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
          <button className="btn btn-info" onClick={getPlanes}>
            Editar Datos
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre Plan</th>
              <th scope="col">Descripción</th>
              <th scope="col">Precio</th>
              <th scope="col">Velocidad</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {planes.map((val, key) => {
            return <tr key={val.idplanes}>
                    <td>{val.nombreplan}</td>
                    <td>{val.descplan}</td>
                    <td>{val.precioplan}</td>
                    <td>{val.velocidadplan}</td>
                    <td>{val.estado}</td>
                    <td>
                    <button type="button" className="btn btn-info" 
                    onClick={()=>{
                      editarPlan(val);
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

export default Planes;