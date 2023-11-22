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

function Pagos() {
    const [idpago, setIdpago] = useState();
    const [contrato, setContrato] = useState();
    const [montopago, setMontopago] = useState();
    const [fechapago, setFechapago] = useState(fechaactual);
    const [mespago, setMespago] = useState();
    const [editar, setEditar] = useState(false);
    const [pagos, setPagos] = useState([]);

    let token = sessionStorage.getItem("token");

    const add = () => {
        Axios.post("http://localhost:9100/pago", {
            detallecontrato_iddetallecontrato: contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
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
        Axios.get("http://localhost:9100/pagos").then((response) => {
          setPagos(response.data);
          console.log(response.data);
        });
      };
      const editarPago = (val)=>{
        setEditar(true);
        setContrato(val.detallecontrato_iddetallecontrato);
        setMontopago(val.montopago);
        setFechapago(val.fechapago);
        setMespago(val.mespago);
      }
      const update = () => {
        Axios.put("http://localhost:9100/pago/"+idpago, {
            detallecontrato_iddetallecontrato: contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
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
        setMontopago("");
        setFechapago(fechaactual);
        setMespago("");
        
        setEditar(false);
      }

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
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Monto del pago:
                </span>
                <input type="text" value={montopago}
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
                  Mes Pago:
                </span>
                <select value={mespago}
                onChange={(event) => { setMespago(event.target.value); }}
                className="form-control" aria-label="Mes pago" aria-describedby="basic-addon1"
                >
                  <option>1 Enero</option>
                  <option>2 Febrero</option>
                  <option>3 Marzo</option>
                  <option>4 Abril</option>
                  <option>5 Mayo</option>
                  <option>6 Junio</option>
                  <option>7 Julio</option>
                  <option>8 Agosto</option>
                  <option>9 Setiembre</option>
                  <option>10 Octubre</option>
                  <option>11 Noviembre</option>
                  <option>12 Diciembre</option>
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
                    <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
              {pagos.map((val, key) => {
                return <tr key={val.idpago}>
                        <td>{val.detallecontrato_iddetallecontrato}</td>
                        <td>{val.montopago}</td>
                        <td>{val.fechapago}</td>
                        <td>{val.mespago}</td>
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