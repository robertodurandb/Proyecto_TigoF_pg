import { useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Cliente() {
    const [dnicliente, setDnicliente] = useState("");
    const [nombrecli, setNombrecli] = useState("");
    const [apellidocli, setApellidocli] = useState("");
    const [direccioncli, setDireccioncli] = useState("");
    const [distritocli, setDistritocli] = useState("");
    const [provinciacli, setProvinciacli] = useState("");
    const [nacionalidadcli, setNacionalidadcli] = useState("Peruana");
    const [telefonocli, setTelefonocli] = useState();
    const [telefonocli2, setTelefonocli2] = useState();
    const [ubicacioncli, setUbicacioncli] = useState();
    const [clientes, setClientes] = useState([]);
    const [editar, setEditar] = useState(false);
   
    let token = sessionStorage.getItem("token");
   
  const add = () => {
    if (dnicliente.length>7) {
    Axios.post("http://localhost:9100/cliente", 
    {  
        dnicliente: dnicliente,
        nombrecli: nombrecli,
        apellidocli: apellidocli,
        direccioncli: direccioncli,
        distritocli: distritocli,
        provinciacli: provinciacli,
        nacionalidadcli: nacionalidadcli,
        telefonocli: telefonocli,
        telefonocli2: telefonocli2,
        ubicacion_cli: ubicacioncli,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getClientes();
      limpiarcampos();
      alert("Cliente Registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  } else {
      alert("El Documento de Identidad debe tener mas de 7 caracteres")
  }
  };
  const getClientes = () => {
    Axios.get("http://localhost:9100/clientes").then((response) => {
      setClientes(response.data);
    });
  };
  const editarClientes = (val)=>{
    setEditar(true);

    setDnicliente(val.dnicliente);
    setNombrecli(val.nombrecli);
    setApellidocli(val.apellidocli);
    setDireccioncli(val.direccioncli);
    setDistritocli(val.distritocli);
    setProvinciacli(val.provinciacli);
    setNacionalidadcli(val.nacionalidadcli);
    setTelefonocli(val.telefonocli);
    setTelefonocli2(val.telefonocli2);
    setUbicacioncli(val.ubicacion_cli);
  }
  const update = () => {
    Axios.put("http://localhost:9100/cliente/"+dnicliente, {
        dnicliente: dnicliente,
        nombrecli: nombrecli,
        apellidocli: apellidocli,
        direccioncli: direccioncli,
        distritocli: distritocli,
        provinciacli: provinciacli,
        nacionalidadcli: nacionalidadcli,
        telefonocli: telefonocli,
        telefonocli2: telefonocli2,
        ubicacion_cli: ubicacioncli,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getClientes();
      limpiarcampos();
      alert("Cliente Actualizado con exito");
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
    setDnicliente("");
    setNombrecli("");
    setApellidocli("");
    setDireccioncli("");
    setDistritocli("");
    setProvinciacli("");
    setNacionalidadcli("Peruana");
    setTelefonocli("");
    setTelefonocli2("");
    setUbicacioncli("");
    
    setEditar(false);
  }

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestion de Clientes</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              DNI Cliente:
            </span>
            <input type="text" value={dnicliente}
              onChange={(event) => { setDnicliente(event.target.value); }}
              className="form-control" placeholder="Ingrese Documento de Identidad" aria-label="Dni Cliente" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombres:
            </span>
            <input type="text" value={nombrecli}
              onChange={(event) => { setNombrecli(event.target.value); }}
              className="form-control" placeholder="Nombres del Cliente" aria-label="Nombres" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Apellidos:
            </span>
            <input type="text" value={apellidocli}
              onChange={(event) => { setApellidocli(event.target.value); }}
              className="form-control" placeholder="Apellidos del Cliente" aria-label="Apellidos" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Dirección:
            </span>
            <input type="text" value={direccioncli}
              onChange={(event) => { setDireccioncli(event.target.value); }}
              className="form-control" placeholder="Dirección del Cliente" aria-label="Direccion" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Distrito:
            </span>
            <input type="text" value={distritocli}
              onChange={(event) => { setDistritocli(event.target.value); }}
              className="form-control" placeholder="Ingrese Distrito" aria-label="Distrito" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Provincia:
            </span>
            <input type="text" value={provinciacli}
              onChange={(event) => { setProvinciacli(event.target.value); }}
              className="form-control" placeholder="Ingrese Provincia" aria-label="Provincia" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nacionalidad:
            </span>
            <select value={nacionalidadcli}
            onChange={(event) => { setNacionalidadcli(event.target.value); }}
            className="form-control" aria-label="Nacionalidad" aria-describedby="basic-addon1"
            >
              <option>Peruana</option>
              <option>Extranjera</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Telefono 1:
            </span>
            <input type="number" value={telefonocli}
              onChange={(event) => { setTelefonocli(event.target.value); }}
              className="form-control" placeholder="Telefono del Cliente" aria-label="Telefono1" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Telefono 2:
            </span>
            <input type="number" value={telefonocli2}
              onChange={(event) => { setTelefonocli2(event.target.value); }}
              className="form-control" placeholder="Telefono (opcional)" aria-label="Telefono2" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Localización Maps:
            </span>
            <input type="text" value={ubicacioncli}
              onChange={(event) => { setUbicacioncli(event.target.value); }}
              className="form-control" placeholder="Por el Técnico (al momento de la instalación)" aria-label="Ubicacion" aria-describedby="basic-addon1"
            ></input>
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
          <button className="btn btn-info" onClick={getClientes}>
            Editar Datos
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">DNI</th>
              <th scope="col">Nombres</th>
              <th scope="col">Apellidos</th>
              <th scope="col">Direccion</th>
              <th scope="col">Distrito</th>
              <th scope="col">Telefono</th>
              <th scope="col">Ubicacion</th>
              <th scope="col">Accion</th>

            </tr>
          </thead>
          <tbody>
          {clientes.map((val, key) => {
            return <tr key={val.dnicliente}>
                    <th>{val.dnicliente}</th>
                    <td>{val.nombrecli}</td>
                    <td>{val.apellidocli}</td>
                    <td>{val.direccioncli}</td>
                    <td>{val.distritocli}</td>
                    <td>{val.telefonocli}</td>
                    <td>{val.ubicacion_cli}</td>
                    <td>
                    <button type="button" className="btn btn-info" 
                    onClick={()=>{
                      editarClientes(val);
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

export default Cliente;