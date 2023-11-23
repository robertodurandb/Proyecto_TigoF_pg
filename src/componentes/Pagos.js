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
    const [anio, setAnio] = useState();
    const [editar, setEditar] = useState(false);
    const [pagos, setPagos] = useState([]);

    let token = sessionStorage.getItem("token");

    const add = () => {
        Axios.post("http://localhost:9100/pago", {
            num_contrato: contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
            anio: anio,
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

        setIdpago(val.idpago);
        setContrato(val.num_contrato);
        setMontopago(val.montopago);
        setFechapago(val.fechapago);
        setMespago(val.mespago);
        setAnio(val.anio);
      }
      const update = () => {
        Axios.put("http://localhost:9100/pago/"+idpago, {
            num_contrato: contrato,
            montopago: montopago,
            fechapago: fechapago,
            mespago: mespago,
            anio: anio,
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
        setAnio("");
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
                  Mes Pago:
                </span>
                <input type="number" value={mespago}
                  onChange={(event) => { setMespago(event.target.value); }}
                  className="form-control" placeholder="Ingrese mes pago" aria-label="mes pago" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Año pago:
                </span>
                <input type="number" value={anio}
                  onChange={(event) => { setAnio(event.target.value); }}
                  className="form-control" placeholder="Ingrese anio pago" aria-label="anio pago" aria-describedby="basic-addon1"
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