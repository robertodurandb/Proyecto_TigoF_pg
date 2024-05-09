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

function Instalacion() {
    const [idinstalacion, setIdinstalacion] = useState();
    const [fechainstalacion, setFechainstalacion] = useState(fechaactual);
    const [numcontrato, setNumcontrato] = useState();
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [observacion, setObservacion] = useState();
    const [editar, setEditar] = useState(false);
    const [instalaciones, setInstalaciones] = useState([]);

    // const [apellidoscliente, setApellidoscliente] = useState();
    // const [nombrescliente, setNombrescliente] = useState();
    // const [dnicliente, setDnicliente] = useState();
    // const [listacontratos, setListacontratos] = useState();

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser")
    let ipbackend = "http://192.168.18.8:9100/";

    const add = () => {
        Axios.post(ipbackend+"instalacion", {
            fechainstalacion: fechainstalacion,
            numcontrato: numcontrato,
            geolocalizacion: geolocalizacion,
            observacion: observacion,
            tecnico: user,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
            getInstalaciones();
            limpiarcampos();
            alert("Instalacion Registrada con exito");
        }).catch((error) => {
          if (401 === error.response.status){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };

     
    //   const getContratos = () => {
    //     Axios.get(ipbackend+"todolist").then((response) => {
    //       setListacontratos(response.data);
    //     });
    //   };

    function getInstalaciones(){
      fetch(ipbackend+'instalaciones')
          .then(response => response.json())
          .then(data => setInstalaciones(data))
  }

      const editarInstalacion = (val)=>{
        setEditar(true);
        setIdinstalacion(val.idinstalacion)
        setFechainstalacion(val.fechainstalacion);
        setNumcontrato(val.numcontrato);
        setGeolocalizacion(val.geolocalizacion);
        setObservacion(val.observacion);
      }
      const update = () => {
        Axios.put(ipbackend+"instalacion/"+idinstalacion, {
            fechainstalacion: fechainstalacion,
            numcontrato: numcontrato,
            geolocalizacion: geolocalizacion,
            observacion: observacion,
            user_update: user,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          getInstalaciones();
          limpiarcampos();
          alert("Instalacion actualizada con exito");
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
        setIdinstalacion();
        setFechainstalacion(fechaactual);
        setNumcontrato("");
        setGeolocalizacion("");
        setObservacion("");
        // setTecnico("");
        // setUsuarioactualiza("");
        setEditar(false);
      }
//************ACA ESTAMOS***/

    // function datosinstalacion() {
    //   let index = listacontratos.findIndex(function(i){
    //     return i.num_contrato == contrato;
    //   });
    //   setApellidoscliente(listaclientes[index].apellidocli)
    //   setPlancliente(listaclientes[index].nombreplan)
    //   setMontopago(listaclientes[index].precioplan)
    //   setNombrescliente(listaclientes[index].nombrecli)
    // }

    //   useEffect(() =>{   
    //     getContratos();
    // }, [])

      return (
        <div className="container">
          <div className="card text-center">
            <div className="card-header">Gestion de Instalaciones</div>
            <div className="card-body" id="Editarpago">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                    Fecha Instalacion:
                    </span>
                    <input type="text" value={fechainstalacion}
                    onChange={(event) => { setFechainstalacion(event.target.value); }}
                    className="form-control" placeholder="Fecha instalacion" aria-label="fecha instalacion" aria-describedby="basic-addon1"
                    ></input>
                </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Numero Contrato:
                </span>
                <input type="text" value={numcontrato}
                  onChange={(event) => { setNumcontrato(event.target.value); }}
                  className="form-control" placeholder="Ingrese número de contrato" aria-label="Numero Contrato" aria-describedby="basic-addon1"
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Geolocalizacion:
                </span>
                <input type="text" value={geolocalizacion}
                  onChange={(event) => { setGeolocalizacion(event.target.value); }}
                  className="form-control" placeholder="Ingrese ubicacion Maps" aria-label="" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Observación:
                </span>
                <input type="text" value={observacion}
                  onChange={(event) => { setObservacion(event.target.value); }}
                  className="form-control" placeholder="ejemplo: " aria-label="observacion" aria-describedby="basic-addon1"
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
              <button className="btn btn-info" onClick={getInstalaciones}>
                Editar Datos
              </button>
            </div>
            <table className="table table-striped">
              <thead>
                <tr> 
                    <th scope="col">ID Instalación</th>
                    <th scope="col">N° Contrato</th>
                    <th scope="col">Fecha instalación</th>
                    <th scope="col">Geolocalización</th>
                    <th scope="col">Observación</th>
                    <th scope="col">Técnico</th>
                    <th scope="col">Usuario Actualiza</th>
                    <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
              {instalaciones.map((val, key) => {
                return <tr key={val.idinstalacion}>
                        <td>{val.idinstalacion}</td>
                        <td>{val.numcontrato}</td>
                        <td>{val.fechainstalacion}</td>
                        <td>{val.geolocalizacion}</td>
                        <td>{val.observacion}</td>
                        <td>{val.tecnico}</td>
                        <td>{val.user_update}</td>
                        <td>
                        <button type="button" className="btn btn-info" 
                        onClick={()=>{
                          editarInstalacion(val);
                        }}>
                          <a href="#Editarinstalacion">Editar</a>
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
export default Instalacion;