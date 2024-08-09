import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

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
    const [listaClientes, setListaClientes] = useState([]);
    const [editar, setEditar] = useState(false);

    const [busqueda, setBusqueda] = useState("");

    const [modalMostrar, setModalMostrar] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
   
    let token = sessionStorage.getItem("token");
    //let ipbackend = "https://michel.zapto.org:9100/";
    //let ipbackend = "http://192.168.18.8:9100/";
    let ipbackend = "http://10.0.28.60:9100/";
   
  const addcliente = () => {
    if (dnicliente.length>7) {
    Axios.post(ipbackend+"cliente", 
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
  function getClientes(){
    fetch(ipbackend+"clientes")
    .then(response => response.json())
    .then(data => setListaClientes(data))
    }
    function isAdmin() {
      let role = sessionStorage.getItem("role");
      return role == "Admin";
  }
  
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
    ventanaModal();
  }
  const update = () => {
    Axios.put(ipbackend+"cliente/"+dnicliente, {
        nombrecli: nombrecli,
        apellidocli: apellidocli,
        direccioncli: direccioncli,
        distritocli: distritocli,
        provinciacli: provinciacli,
        nacionalidadcli: nacionalidadcli,
        telefonocli: telefonocli,
        telefonocli2: telefonocli2,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getClientes();
      cerrarModalCliente();
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
  
  const agregarcliente = ()=>{
    setEditar(false);
    ventanaModal();
  }
  const cerrarModalCliente = ()=>{
    limpiarcampos();
    ventanaModal();
  }
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
    
    setEditar(false);
  }

  //Funcion de Busqueda
  const searcher = (e) =>{
    setBusqueda(e.target.value);
    }
//Funcion de Filtrado
 const newfilter = listaClientes.filter(dato => {
    return (
dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase())
)
});

let results = [];

if (busqueda === "") {
    results = listaClientes;
} else {
    results = newfilter;
}

  useEffect(() =>{
    getClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div className="App">
      <h1 className="mb-3">Información de Clientes</h1>
      {/* <div className="container text-start"> */}
      {
       isAdmin() ?(
        <button type="button" className="btn btn-info" onClick={agregarcliente}>Registrar Nuevo Cliente</button> 
      ):null
    }
    <br />
        <br />
        <input value={busqueda} onChange={searcher} type='text' placeholder='Busqueda por DNI o por Apellidos' className='form-control border border-success'/>
        
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
             { 
              isAdmin() ? (
                <th scope="col">Accion</th>
              ):null
            }
            </tr>
          </thead>
          <tbody>
          {results.map((val, key) => {
            return <tr key={val.dnicliente}>
                    <th>{val.dnicliente}</th>
                    <td>{val.nombrecli}</td>
                    <td>{val.apellidocli}</td>
                    <td>{val.direccioncli}</td>
                    <td>{val.distritocli}</td>
                    <td>{val.telefonocli}</td>
                    <td>{val.ubicacion_cli}</td>
                    <td>
                     { 
                      isAdmin() ? (
                        <button type="button" className="btn btn-info" 
                    onClick={()=>{ editarClientes(val) }}>
                      Editar
                    </button>
                      ):null 
                      }
                    </td>
            </tr>
           
          })}
            
          </tbody>
        </table>

        <Modal isOpen={modalMostrar} toggle={ventanaModal}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Agregar/Modificar Cliente:</h4>
              <div className="mb-3">
                <label for="dnicliente" className="form-label">
                  DNI Cliente:
                </label>
                {editar ? (
                  <span className="input-group-text" id="basic-addon1">
                    {dnicliente}
                  </span>
                ) : (
                  <input type="text" value={dnicliente} onChange={(event) => {
                      setDnicliente(event.target.value);
                    }}
                    className="form-control" id="dnicliente" placeholder="Ingrese Documento de Identidad" aria-describedby="basic-addon1"
                  ></input>
                )}
              </div>
              <div className="mb-3">
                <label for="nombres" className="form-label">Nombres:</label>
                <input type="text" value={nombrecli} onChange={(event) => {
                    setNombrecli(event.target.value);
                  }} className="form-control" id="nombres" placeholder="Nombres del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="apellidos" className="form-label">Apellidos:</label>
                <input type="text" value={apellidocli} onChange={(event) => {
                    setApellidocli(event.target.value);
                  }} className="form-control" id="apellidos" placeholder="Apellidos del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="direccion" className="form-label">Direccion: </label>
                <input type="text" value={direccioncli} onChange={(event) => {
                    setDireccioncli(event.target.value);
                  }}
                  className="form-control" id="direccion" placeholder="Dirección del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="distrito" className="form-label"> Distrito:</label>
                <input type="text" value={distritocli} onChange={(event) => {
                    setDistritocli(event.target.value);
                  }}
                  className="form-control" id="distrito" placeholder="Ingrese Distrito" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="provincia" className="form-label">Provincia: </label>
                <input type="text" value={provinciacli} onChange={(event) => {
                    setProvinciacli(event.target.value);
                  }}
                  className="form-control" id="provincia" placeholder="Ingrese Provincia" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="nacionalidad" className="form-label">Nacionalidad:</label>
                <select value={nacionalidadcli} onChange={(event) => {
                    setNacionalidadcli(event.target.value);
                  }}
                  className="form-select" id="nacionalidad" aria-describedby="basic-addon1"
                >
                  <option>Peruana</option>
                  <option>Extranjera</option>
                </select>
              </div>
              <div className="mb-3">
                <label for="telefono1" className="form-label">Telefono 1:</label>
                <input type="number" value={telefonocli} onChange={(event) => {
                    setTelefonocli(event.target.value);
                  }}
                  className="form-control" id="telefono1" placeholder="Telefono del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="telefono2" className="form-label">Telefono 2:</label>
                <input type="number" value={telefonocli2} onChange={(event) => {
                    setTelefonocli(event.target.value);
                  }}
                  className="form-control" id="telefono2" placeholder="Telefono 2 del Cliente" aria-describedby="basic-addon1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {editar ? (
              <div>
                <button className="btn btn-warning m-2" onClick={update}>
                  Actualizar
                </button>
              </div>
            ) : (
              <button className="btn btn-success" onClick={addcliente}>
                Registrar
              </button>
            )}
            <button className="btn btn-danger" onClick={cerrarModalCliente}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
      {/* </div> */}
    </div>
  );
}

export default Cliente;