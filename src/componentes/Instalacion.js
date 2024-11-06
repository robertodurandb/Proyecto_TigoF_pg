import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';
// import Resizer from "react-image-file-resizer";

function Instalacion() {

  //FECHA ACTUAL
let fechaactual = `${API.DATENOW}`

    const [listaClientes, setListaClientes] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [controlbusqueda, setControlbusqueda] = useState(false)

    const [num_contrato, setNum_contrato] = useState();
    const [dnicliente, setDnicliente] = useState();
    const [plan, setPlan] = useState();
    //Datos Instalacion
    const [idinstalacion, setIdinstalacion] = useState();
    const [fechainstalacion, setFechainstalacion] = useState(fechaactual);
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [observacion, setObservacion] = useState();
    const [apellidocliente, setApellidocliente] = useState();
    const [nombrecliente, setNombrecliente] = useState();
    const [user_create, setUser_create] = useState();
    const [fecha_actual, setFecha_actual] = useState(fechaactual);
    const [user_update, setUser_update] = useState();
    const [caja_instalacion, setCajainstalacion] = useState();
    const [editar, setEditar] = useState(false);

    // const [selectedImage, setSelectedImage] = useState(null);
    const [invalidImage, setinvalidImage] = useState(null);
    const [userInfo, setuserInfo] = useState({
      file:[],
      filepreview:null,
  });

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    const [modalImagen, setModalImagen] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModalConfirmar = () => setModalConfirmar(!modalConfirmar);
    const ventanaModalImagen = () => setModalImagen(!modalImagen);

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser")
    let ipbackend = `${API.URL}`;

    //***************** CODIGO PARA SUBIR IMAGEN **********//
  let reader = new FileReader();
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
    // if (!imageFile) {
    //   setinvalidImage('Please select image.');
    //    return false;
    //  }
 
     if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
      setinvalidImage('Please select valid image JPG,JPEG,PNG');
       return false;
     }
     reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {

//------------- Resize img code ----------------------------------
       var canvas = document.createElement('canvas');
       var ctx = canvas.getContext("2d");
       ctx.drawImage(img, 0, 0);

       var MAX_WIDTH = 400;
       var MAX_HEIGHT = 400;
       var width = img.width;
       var height = img.height;

       if (width > height) {
         if (width > MAX_WIDTH) {
           height *= MAX_WIDTH / width;
           width = MAX_WIDTH;
         }
       } else {
         if (height > MAX_HEIGHT) {
           width *= MAX_HEIGHT / height;
           height = MAX_HEIGHT;
         }
       }
       canvas.width = width;
       canvas.height = height;
       var ctx = canvas.getContext("2d");
       ctx.drawImage(img, 0, 0, width, height);
       ctx.canvas.toBlob((blob) => {
         const file = new File([blob], imageFilname, {
             type: 'image/jpeg',
             lastModified: Date.now()
         });
         setuserInfo({
            ...userInfo,
            file:file,
            filepreview:URL.createObjectURL(imageFile),
       })
       }, 'image/jpeg', 1);
     setinvalidImage(null)
     };
      img.onerror = () => {
            setinvalidImage('Invalid image content.');
        return false;
      };
      //debugger
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
    //console.log(imageFile)
  };
  //********************************************** */
  

  const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('image', userInfo.file);
      //console.log(invalidImage)
      //console.log(userInfo.file)
      if (invalidImage==null) {
        try {
          await Axios.put(ipbackend+'updateimagen/'+idinstalacion, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              }
          });
            alert("Se cargó imagen con éxito ")
            ventanaModalImagen();
            limpiarcampos();
      } catch (error) {
          console.error(error);
      }
      } else {
        alert(invalidImage)
      }
      
  };

    const addinstalacion = () => {
        Axios.post(ipbackend+"createinstalacion", {
            fechainstalacion: fechainstalacion,
            geolocalizacion: geolocalizacion,
            observacion_instalacion: observacion,
            user_create: user_create,
            fecha_create: fecha_actual,
            caja_instalacion: caja_instalacion
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
            ventanaModal();
            ventanaModalConfirmar();
            console.log(response.data)
            let id = "";
            id = response.data
            setIdinstalacion(id.idinstalacion)
        }).catch((error) => {
          if (401 === error.response.status){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };

      const confirmarinstalacion = () => {
        Axios.put(ipbackend+"updatecontrato/"+num_contrato, {
            estadoc_instalacion: 2,
            instalacion_idinstalacion: idinstalacion,
            estado_servicio: 1
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() =>{
          limpiarcampos();
          ventanaModalConfirmar();
          getInstalacionesPendientes();
        }).catch((error) => {
          if (error.response && error.response.status === 401){
            sessionStorage.removeItem("token");
            window.location.reload();
            alert("Sesión expirada, vuelva a iniciar sesión");
            }
          // return error;
          });
      };

      const updateinstalacion = () => {
        Axios.put(ipbackend+"updateinstalacion/"+idinstalacion, {
            geolocalizacion: geolocalizacion,
            observacion_instalacion: observacion,
            user_update: user_update,
            fecha_update: fecha_actual,
            caja_instalacion: caja_instalacion
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          limpiarcampos();
          ventanaModal();
          getInstalacionesPendientes();
          getInstalaciones();
          alert("Instalacion Actualizada con exito");
        }).catch((error) => {
          if (401 === error.response.status){
          sessionStorage.removeItem("token");
          window.location.reload();
          alert("Sesión expirada, vuelva a iniciar sesión");
          }
          return error;
          });
      };

      const getInstalacionesPendientes = async () => {
        try {
          const response = await Axios.get(ipbackend+'pendinstacli', {
            headers:{
                'Authorization': `Bearer ${token}`
            }
          }
          );
          setListaClientes(response.data);
          setUser_create(user);
          setUser_update(user);
        } catch (error) {
          console.error('Error fetching data:', error);
          if (error.response && error.response.status === 401){
            sessionStorage.removeItem("token");
            window.location.reload();
            alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
      };

const getInstalaciones = async () => {
  try {
    const response = await Axios.get(ipbackend+'todoinstacli', {
      headers:{
          'Authorization': `Bearer ${token}`
      }
    }
    );
    setInstalaciones(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response && error.response.status === 401){
      sessionStorage.removeItem("token");
      window.location.reload();
      alert("Sesión expirada, vuelva a iniciar sesión");
      }
  }
};

      const capturarID = (cliente) =>{
        setNum_contrato(cliente.num_contrato);
        setDnicliente(cliente.dnicliente);
        setPlan(cliente.nombreplan);
        setApellidocliente(cliente.apellidocli);
        setNombrecliente(cliente.nombrecli);
        ventanaModal();   
    }
    const capturarIDforimage = (cliente) =>{
      setIdinstalacion(cliente.instalacion_idinstalacion);
      setNum_contrato(cliente.num_contrato);
      setDnicliente(cliente.dnicliente);
      setApellidocliente(cliente.apellidocli);
      setNombrecliente(cliente.nombrecli);
      ventanaModalImagen();
  }
    const capturarIDinstalacion = (cliente) =>{
      setEditar(true);
      setNum_contrato(cliente.num_contrato);
      setDnicliente(cliente.dnicliente);
      setPlan(cliente.nombreplan);
      setApellidocliente(cliente.apellidocli);
      setNombrecliente(cliente.nombrecli);
      setIdinstalacion(cliente.instalacion_idinstalacion);
      setObservacion(cliente.observacion_instalacion);
      setGeolocalizacion(cliente.geolocalizacion);
      setCajainstalacion(cliente.caja_instalacion);
      
      ventanaModal();   
      console.log(cliente.instalacion_idinstalacion)
  }

      const limpiarcampos = ()=>{
        setIdinstalacion();
        setFechainstalacion(fechaactual);
        setFecha_actual(fechaactual);
        setNum_contrato("");
        setGeolocalizacion("");
        setObservacion("");
        setCajainstalacion("");
        setinvalidImage(null);
        setuserInfo({
          file:[],
          filepreview:null
        })

        setEditar(false);
      }
      const cerrarModal = ()=>{
        limpiarcampos();
        ventanaModal();
      }
      const cerrarModalImagen = ()=>{
        limpiarcampos();
       ventanaModalImagen();
      }


       //****************Funcion de Busqueda
       const searcher = (e) =>{
        setBusqueda(e.target.value);
        getInstalacionesPendientes();
        getInstalaciones();
        if(e.target.value=="instalados"){
          console.log("instalados")
          setControlbusqueda(true)
        }
        if(e.target.value=="pendientes"){
          console.log("pendientes")
          setControlbusqueda(false)
        }
        }
        let results = listaClientes
        if (busqueda === "instalados") {
          results = instalaciones
            
          } else{
            results = listaClientes
          
          }

        useEffect(() =>{
          getInstalacionesPendientes();
          getInstalaciones();
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
        <div className="App">
          <h1 className="mb3">Registro de Instalaciones</h1>
          <select type='text' value={busqueda} onChange={searcher} className='form-select form-select-lg mt-3'>
            <option value="pendientes">Pendientes</option>
            <option value="instalados">Instalados</option>
          </select>

            <table className="table table-striped table-hover mt-5 shadow-lg">
              <thead>
                <tr className="bg-curso text-white">
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Distrito</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Fecha programada</th>
                            <th>Técnico</th>
                            <th>Fecha Instalacion</th>
                            <th>Acción</th>
                </tr>
              </thead>
              <tbody>
              {results.map((cliente, key)=>(
                            <tr key={cliente.num_contrato} value={num_contrato}>
                                <td>{cliente.dnicliente}</td>
                                <td>{cliente.apellidocli}</td>
                                <td>{cliente.nombrecli}</td>
                                <td>{cliente.distritocli}</td>
                                <td>{cliente.direccioncli}</td>
                                <td>{cliente.telefonocli}</td>
                                <td>{cliente.fechaprog_instalacion}</td>
                                <td>{cliente.user_create}</td>
                                <td>{cliente.fechainstalacion}</td>
                                {controlbusqueda?(
                                <>
                                <td><button type="button" className="btn btn-outline-success" 
                                onClick={()=>{capturarIDinstalacion(cliente)}}>Editar </button></td>
                                <td><button type="button" className="btn btn-outline-success" onClick={()=>{capturarIDforimage(cliente)}}>Img</button></td>
                                </>
                                ):(
                                  <td><button type="button" className="btn btn-outline-success" 
                                  onClick={()=>{capturarID(cliente)}}>Registrar
                                  </button></td>
                                )}
                                
                            </tr>
                    ))}  
              </tbody>
            </table>

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
          <ModalBody>
            <div className="from-group">
              <h4 className="">Registrar Instalación:</h4>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  Número de Contrato:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {num_contrato}
                  </span>
              </div>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  DNI Cliente:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {dnicliente}
                  </span>
              </div>
              <div className="mb-3">
                <label for="num_contrato" className="form-label">
                  Plan Contratado:
                </label>
                  <span className="input-group-text" id="basic-addon1">
                    {plan}
                  </span>
              </div>
              <div className="mb-3">
                <label for="geolocalización" className="form-label">
                  Geolocalización:
                </label>
                <input type="text" value={geolocalizacion}
                  onChange={(event) => {
                    setGeolocalizacion(event.target.value);
                  }}
                  className="form-control" id="geolocalizacion" placeholder="Ingrese Geolocalización de Maps" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="caja_instalacion" className="form-label">
                  Caja & Spliter:
                </label>
                <input type="text" value={caja_instalacion}
                  onChange={(event) => {
                    setCajainstalacion(event.target.value);
                  }}
                  className="form-control" id="cajainstalacion" placeholder="Ingrese la Caja & Spliter" aria-describedby="basic-addon1"
                ></input>
              </div>
              <div className="mb-3">
                <label for="geolocalización" className="form-label">
                  Observación:
                </label>
                <input type="text" value={observacion}
                  onChange={(event) => {
                    setObservacion(event.target.value);
                  }}
                  className="form-control" id="observacion" placeholder="Observación" aria-describedby="basic-addon1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {editar ? (
              <div>
                <button className="btn btn-warning m-2" onClick={updateinstalacion}>
                  Actualizar
                </button>
              </div>
            ) : (
              <button className="btn btn-success" onClick={addinstalacion}>
                Registrar
              </button>
            )}
            <button className="btn btn-danger" onClick={cerrarModal}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalConfirmar} toggle={ventanaModalConfirmar}>
          <ModalBody>
            <div className="from-group h3">
                  Desea confirmar la instalación para el Cliente:
                  <span>
                    {" "+apellidocliente + " " + nombrecliente}
                  </span>
            </div>
          </ModalBody>
          <ModalFooter>    
              <div>
                <button className="btn btn-warning m-2" onClick={confirmarinstalacion}>
                  Confirmar
                </button>
                <button className="btn btn-danger" onClick={ventanaModalConfirmar}>
                  Cancelar
                </button>
              </div>
            
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalImagen} toggle={ventanaModalImagen}>
          <ModalBody>
            <div className="from-group h3">
                  Agregar/actualizar Imagen de la Casa de:
                  <span>
                    {" "+apellidocliente + " " + nombrecliente}
                  </span>
            </div>
            <label className="form-label">Cargar imagen de la casa: (opcional)</label>
              <form className="input-group mb-3" onSubmit={handleSubmit}>
            <input type="file" className="form-control" onChange={handleImageChange}/>
            <br/>
            <button type="submit" className="btn btn-secondary">Cargar</button>
              </form>
          </ModalBody>
          <ModalFooter>    
              <div>
                <button className="btn btn-danger" onClick={cerrarModalImagen}>
                  Cerrar
                </button>
              </div>
            
          </ModalFooter>
        </Modal>

        </div>
      )
}
export default Instalacion;