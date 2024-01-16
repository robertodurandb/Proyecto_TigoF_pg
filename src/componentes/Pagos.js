import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


//FUNCION PARA OBTENER FECHA ACTUAL
let fechaactual = "";
let fecha = new Date();
let dia = fecha.getDate();
let mes = (fecha.getMonth())+1;
let anioactual = fecha.getFullYear();
fechaactual = anioactual + "-" + mes + "-" + dia;

function Pagos() {
    const [idpago, setIdpago] = useState();
    const [contrato, setContrato] = useState();
    const [montopago, setMontopago] = useState(0);
    const [fechapago, setFechapago] = useState(fechaactual);
    const [mespago, setMespago] = useState(mes);
    const [anio, setAnio] = useState(anioactual);
    const [mediopago, setMediopago] = useState();
    const [observacion, setObservacion] = useState();
    const [editar, setEditar] = useState(false);
    const [pagos, setPagos] = useState([]);

    const [apellidoscliente, setApellidoscliente] = useState();
    const [nombrescliente, setNombrescliente] = useState();
    const [plancliente, setPlancliente] = useState();
    const [listaclientes, setListaclientes] = useState();

    let token = sessionStorage.getItem("token");
    let ipbackend = "http://10.0.28.60:9100/";

    const add = () => {
        Axios.post(ipbackend+"pago", {
            num_contrato: contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
            anio: anio,
            mediopago: mediopago,
            observacionpago: observacion,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
            getPagos();
            limpiarcampos();
            alert("Pago Registrado con exito");
        }).catch((error) => {
          if (401 === error.response.status){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };

     
      const getPagos = () => {
        Axios.get(ipbackend+"pagos").then((response) => {
          setPagos(response.data);
        });
      };

    function getClientes(){
      fetch(ipbackend+'todolist')
          .then(response => response.json())
          .then(data => setListaclientes(data))
  }

      const editarPago = (val)=>{
        setEditar(true);

        setIdpago(val.idpago);
        setContrato(val.num_contrato);
        setMontopago(val.montopago);
        setFechapago(val.fechapago);
        setMespago(val.mespago);
        setAnio(val.anio);
        setMediopago(val.mediopago);
        setObservacion(val.observacionpago);
      }
      const update = () => {
        Axios.put(ipbackend+"pago/"+idpago, {
            num_contrato: contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
            anio: anio,
            mediopago: mediopago,
            observacionpago: observacion,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          getPagos();
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

      const limpiarcampos = ()=>{
        setIdpago();
        setContrato("");
        setMontopago(0);
        setFechapago(fechaactual);
        setMespago(mes);
        setAnio(anioactual);
        setMediopago("");
        setObservacion("");
        setEditar(false);
      }

    function datospagos() {
      let index = listaclientes.findIndex(function(i){
        return i.num_contrato == contrato;
      });
      setApellidoscliente(listaclientes[index].apellidocli)
      setPlancliente(listaclientes[index].nombreplan)
      setMontopago(listaclientes[index].precioplan)
      setNombrescliente(listaclientes[index].nombrecli)
    }

      useEffect(() =>{   
        getClientes();
    }, [])

      return (
        <div className="container">
          <div className="card text-center">
            <div className="card-header">Gestion y Seguimiento de Pagos</div>
            <div className="card-body" id="Editarpago">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Numero Contrato:
                </span>
                <input type="text" value={contrato}
                  onChange={(event) => { setContrato(event.target.value); }}
                  className="form-control" placeholder="Ingrese número de contrato" aria-label="Numero Contrato" aria-describedby="basic-addon1"
                ></input>
              </div>
              {/* //BOTON VALIDAR */}
              <button onClick={datospagos}>validar</button>
              <span className="input-group-text" id="basic-addon1">
                  Apellidos Cliente:{apellidoscliente}
                </span>
                <span className="input-group-text" id="basic-addon1">
                  Nombres Cliente:{nombrescliente}
                </span>
                <span className="input-group-text" id="basic-addon1">
                  Plan Contratado:{plancliente}
                </span>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Monto pagado:
                </span>
                <input type="number" value={montopago}
                  onChange={(event) => { setMontopago(event.target.value); }}
                  className="form-control" placeholder="Ingrese monto pago" aria-label="monto pago" aria-describedby="basic-addon1"
                ></input>
              </div>
              
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Fecha Pago:
                </span>
                <input type="text" value={fechapago}
                  onChange={(event) => { setFechapago(event.target.value); }}
                  className="form-control" placeholder="Fecha pago" aria-label="fecha pago" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Mes Facturado:
                </span>
                <select value={mespago}
                onChange={(event) => { setMespago(event.target.value); }}
                className="form-control" aria-label="Ingrese mes pago" aria-describedby="basic-addon1"
                >
                  <option>1</option><option>2</option><option>3</option>
                  <option>4</option><option>5</option><option>6</option>
                  <option>7</option><option>8</option><option>9</option>
                  <option>10</option><option>11</option><option>12</option>
                </select>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Año:
                </span>
                <input type="number" value={anio}
                  onChange={(event) => { setAnio(event.target.value); }}
                  className="form-control" placeholder="Año" aria-label="anio pago" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Medio pago:
                </span>
                <input type="text" value={mediopago}
                  onChange={(event) => { setMediopago(event.target.value); }}
                  className="form-control" placeholder="Yape o transferencia...etc" aria-label="medio pago" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Observación:
                </span>
                <input type="text" value={observacion}
                  onChange={(event) => { setObservacion(event.target.value); }}
                  className="form-control" placeholder="ejemplo: pendiente 20 soles" aria-label="observacion" aria-describedby="basic-addon1"
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
              <button className="btn btn-info" onClick={getPagos}>
                Editar Datos
              </button>
            </div>
            <table className="table table-striped">
              <thead>
                <tr> 
                    <th scope="col">N° Contrato</th>
                    <th scope="col">Monto pagado</th>
                    <th scope="col">Fecha pago</th>
                    <th scope="col">Mes pagado</th>
                    <th scope="col">Año</th>
                    <th scope="col">Medio pago</th>
                    <th scope="col">Observación</th>
                    <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
              {pagos.map((val, key) => {
                return <tr key={val.idpago}>
                        <td>{val.num_contrato}</td>
                        <td>{val.montopago}</td>
                        <td>{val.fechapago}</td>
                        <td>{val.mespago}</td>
                        <td>{val.anio}</td>
                        <td>{val.mediopago}</td>
                        <td>{val.observacionpago}</td>
                        <td>
                        <button type="button" className="btn btn-info" 
                        onClick={()=>{
                          editarPago(val);
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
export default Pagos;