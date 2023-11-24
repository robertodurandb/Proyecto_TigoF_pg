import { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


//FUNCION PARA OBTENER FECHA ACTUAL
let fechaactual = "";
let fecha = new Date();
let dia = fecha.getDate();
let mes = (fecha.getMonth())+1;
let anio = fecha.getFullYear();
fechaactual = anio + "-" + mes + "-" + dia;
console.log("hola")
console.log(fechaactual);

function Contrato() {
    // const [iddetallecontrato, setIddetallecontrato] = useState();
    const [planes_idplanes, setPlanes_idplanes] = useState(1);
    const [cliente_dnicliente, setCliente_dnicliente] = useState("");
    const [caja_idcaja, setCaja_idcaja] = useState("c0101");
    const [num_contrato, setNum_contrato] = useState();
    const [fecha_contrato, setFecha_contrato] = useState(fechaactual);
    const [instalacion, setInstalacion] = useState("Pendiente");
    const [diapago, setDiapago] = useState("1");
    const [contratos, setContratos] = useState([]);
    const [editar, setEditar] = useState(false);

    const [listaCajas, setListaCajas] = useState([]);
    const [listaPlanes, setListaPlanes] = useState([]);
    // const [busquedaCliente, setBusquedaCliente] = useState([]);
    // const [nombreCliente, SetNombreCliente] = useState();

    let token = sessionStorage.getItem("token");

  const add = () => {
    Axios.post("http://localhost:9100/detallecontrato", {
        planes_idplanes: planes_idplanes,
        cliente_dnicliente: cliente_dnicliente,
        caja_idcaja: caja_idcaja,
        num_contrato: num_contrato,
        fecha_contrato: fecha_contrato,
        instalacion: instalacion,
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
        getContratos();
        limpiarcampos();
        alert("Contrato Registrado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };
  const getContratos = () => {
    Axios.get("http://localhost:9100/detallecontratos").then((response) => {
      setContratos(response.data);
      console.log(response.data);
    });
  };
  const editarContrato = (val)=>{
    setEditar(true);
    // setIddetallecontrato(val.iddetallecontrato);
    setNum_contrato(val.num_contrato);
    setPlanes_idplanes(val.planes_idplanes);
    setCliente_dnicliente(val.cliente_dnicliente);
    setCaja_idcaja(val.caja_idcaja);
    setFecha_contrato(val.fecha_contrato)
    setInstalacion(val.instalacion);
  }
  const update = () => {
    Axios.put("http://localhost:9100/detallecontrato/"+num_contrato, {
        planes_idplanes: planes_idplanes,
        cliente_dnicliente: cliente_dnicliente,
        caja_idcaja: caja_idcaja,
        num_contrato: num_contrato,
        fecha_contrato: fecha_contrato,
        instalacion: instalacion,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getContratos();
      limpiarcampos();
      alert("Contrato Actualizado con exito");
    }).catch((error) => {
      if (401 === error.response.status){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
      return error;
      });
  };

  function getCajas(){
    fetch('http://localhost:9100/cajas')
        .then(response => response.json())
        .then(data => setListaCajas(data))
}
function getPlanes(){
  fetch('http://localhost:9100/planes')
      .then(response => response.json())
      .then(data => setListaPlanes(data))
}

  const limpiarcampos = ()=>{
    // setIddetallecontrato();
    setPlanes_idplanes("");
    setCliente_dnicliente("");
    setCaja_idcaja("");
    setNum_contrato("");
    setFecha_contrato(fechaactual);
    setInstalacion("Pendiente");
    
    setEditar(false);
  }

  //*******************Consultar DNI esta pendiente */
    // let number = 0;
    // number = cliente_dnicliente.length;
    // if (number<8){
    //   alert("dni no cumple")
    // }
    // if (number=8) {
    //   Axios.get("http://localhost:9100/cliente/"+cliente_dnicliente).then((response) => {
    //     setBusquedaCliente(response.data);
    //   })
    //   .catch(() => {
    //     console.log("no se pudo encontrar el DNI")
    //   });
    // }

  // const validarDni = ()=>{
  //     SetNombreCliente(busquedaCliente[0].apellidocli);
  //   alert(nombreCliente);
  //   }
    
  useEffect(() =>{
    getCajas();
    getPlanes();
}, [])

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestion de Contratos</div>
        <div className="card-body" id="Editarcontrato">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Numero Contrato:
            </span>
            <input type="text" value={num_contrato}
              onChange={(event) => { setNum_contrato(event.target.value); }}
              className="form-control" placeholder="Ingrese número de contrato" aria-label="Numero Contrato" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              DNI Cliente:
            </span>
            <input type="text" value={cliente_dnicliente}
              onChange={(event) => { setCliente_dnicliente(event.target.value); }}
              className="form-control" placeholder="Ingrese dni cliente" aria-label="dni cliente" aria-describedby="basic-addon1"
            ></input>
            {/* <button onClick={validarDni}>Validar</button> */}
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Plan:
            </span>
            <select className="form-control" aria-label="Caja" aria-describedby="basic-addon1" key={planes_idplanes} value={planes_idplanes} 
            onChange={(event) => { setPlanes_idplanes(event.target.value); }}>
                    { listaPlanes.map((planes)=>{
                        return(
                            <>
                                <option value={planes.idplanes}>{planes.nombreplan}</option>
                            </>
                        )
                    })}
            </select>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Caja:
            </span>
            <select className="form-control" aria-label="Caja" aria-describedby="basic-addon1" value={caja_idcaja} 
            onChange={(event) => { setCaja_idcaja(event.target.value); }}>
                    { listaCajas.map((caja, key)=>{
                        return(
                            <>
                                <option value={caja.idcaja}>{caja.nombrecaja}</option>
                            </>
                        )
                    })}
            </select>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Fecha Contrato:
            </span>
            <input type="text" value={fecha_contrato}
              onChange={(event) => { setFecha_contrato(event.target.value); }}
              className="form-control" placeholder="Fecha Contrato" aria-label="fecha contrato" aria-describedby="basic-addon1"
            ></input>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              instalacion:
            </span>
            <select value={instalacion}
            onChange={(event) => { setInstalacion(event.target.value); }}
            className="form-control" aria-label="Estado" aria-describedby="basic-addon1"
            >
              <option>Pendiente</option>
              <option>Completada</option>
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
          <button className="btn btn-info" onClick={getContratos}>
            Editar Datos
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr> 
                <th scope="col">N° Contrato</th>
                
                <th scope="col">Plan</th>
                <th scope="col">Cliente</th>
                <th scope="col">Caja</th>
                <th scope="col">Fecha</th>
                <th scope="col">instalacion</th>
                <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {contratos.map((val, key) => {
            return <tr key={val.num_contrato}>
                    <td>{val.num_contrato}</td>
                    <td>{val.nombreplan}</td>
                    <td>{val.cliente_dnicliente}</td>
                    <td>{val.nombrecaja}</td>
                    <td>{val.fecha_contrato}</td>
                    <td>{val.instalacion}</td>
                    <td>
                    <button type="button" className="btn btn-info" 
                    onClick={()=>{
                      editarContrato(val);
                    }}>
                      <a href="#Editarcontrato">Editar</a>
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
export default Contrato;