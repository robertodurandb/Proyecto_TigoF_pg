import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import API from '../utils/const';
import { Link } from 'react-router-dom';

function Instalacion() {

  //FECHA ACTUAL
let fechaactual = `${API.DATENOW}`

    const [ordenesPendientes, setOrdenesPendientes] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [busquedadni, setBusquedadni] = useState("");
    const [select_instalados, setSelect_instalados] = useState(false)

    const [id_ordentrabajo, setId_ordentrabajo] = useState();
    const [num_contrato, setNum_contrato] = useState();
    const [dnicliente, setDnicliente] = useState();
    const [plan, setPlan] = useState();
    const [idplan, setIdplan] = useState();
    //Datos Instalacion
    const [observacion, setObservacion] = useState("");
    const [apellidocliente, setApellidocliente] = useState("");
    const [nombrecliente, setNombrecliente] = useState("");
    const [user_create, setUser_create] = useState("");
    const [fecha_actual, setFecha_actual] = useState(fechaactual);
    const [user_update, setUser_update] = useState();
    const [caja_instalacion, setCajainstalacion] = useState();
    const [cobro_instalacion, setCobro_instalacion] = useState(0);
    const [condicion_equipo, setCondicion_equipo] = useState("Alquiler");
    const [cobro_equipo, setCobro_equipo] = useState(0);
    const [tipo_equipo, setTipo_equipo] = useState("");
    const [dia_pago, setDia_pago] = useState();
    const [estado_servicio, setEstado_servicio] = useState(1);
    const [imgcaja_antes, setImgcaja_antes] = useState();
    const [imgpotencia_antes, setImgpotencia_antes] = useState();
    const [imgcaja_despues, setImgcaja_despues] = useState();
    const [imgpotencia_despues, setImgpotencia_despues] = useState();
    const [imginstalacion_interna, setImginstalacion_interna] = useState();
    const [imgpotencia_interna, setImgpotencia_interna] = useState();
    const [imgcontrato, setImgcontrato] = useState();
    const [imgcasa, setImgcasa] = useState();
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [latitud, setLatitud]  = useState();
    const [longitud, setLongitud] = useState();
    const [editar, setEditar] = useState(false);

    // const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [invalidImage, setinvalidImage] = useState(null);
    const [userInfo, setuserInfo] = useState({
      file:[],
      filepreview:null,
  });

    const maxLengthObservacion = 100;

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    const [modalImagen, setModalImagen] = useState(false);
    // const [modalGeo, setModalGeo] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModalConfirmar = () => setModalConfirmar(!modalConfirmar);
    const ventanaModalImagen = () => setModalImagen(!modalImagen);
    // const ventanaModalGeo = () => setModalGeo(!modalGeo);

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser")
    let ipbackend = `${API.URL}`;

    //***************** CODIGO PARA SUBIR IMAGEN **********//
  let reader = new FileReader();
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
 
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

       var MAX_WIDTH = 800;
       var MAX_HEIGHT = 800;
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
  
  const handleSubmitImgCajaAntes = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', userInfo.file);
    if (invalidImage==null) {
      try {
        await Axios.put(ipbackend+'updatefotocajaantes/'+num_contrato, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
          alert("Se cargó imagen con éxito ")
          getInstalaciones();
          ventanaModalImagen();
          limpiarcampos();
    } catch (error) {
        console.error(error);
    }
    } else {
      alert(invalidImage)
    }
};
const handleSubmitImgPotenciaAntes = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('image', userInfo.file);
  if (invalidImage==null) {
    try {
      await Axios.put(ipbackend+'updatefotopotenciaantes/'+num_contrato, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
        alert("Se cargó imagen con éxito ")
        getInstalaciones();
        ventanaModalImagen();
        limpiarcampos();
  } catch (error) {
      console.error(error);
  }
  } else {
    alert(invalidImage)
  }
};
const handleSubmitImgCajaDespues = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('image', userInfo.file);
  if (invalidImage==null) {
    try {
      await Axios.put(ipbackend+'updatefotocajadespues/'+num_contrato, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
        alert("Se cargó imagen con éxito ")
        getInstalaciones();
        ventanaModalImagen();
        limpiarcampos();
  } catch (error) {
      console.error(error);
  }
  } else {
    alert(invalidImage)
  }
};
const handleSubmitImgPotenciaDespues = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('image', userInfo.file);
  if (invalidImage==null) {
    try {
      await Axios.put(ipbackend+'updatefotopotenciadespues/'+num_contrato, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
        alert("Se cargó imagen con éxito ")
        getInstalaciones();
        ventanaModalImagen();
        limpiarcampos();
  } catch (error) {
      console.error(error);
  }
  } else {
    alert(invalidImage)
  }
};
const handleSubmitImgInstalacionInterna = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('image', userInfo.file);
  if (invalidImage==null) {
    try {
      await Axios.put(ipbackend+'updatefotoinstalacion/'+num_contrato, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
        alert("Se cargó imagen con éxito ")
        getInstalaciones();
        ventanaModalImagen();
        limpiarcampos();
  } catch (error) {
      console.error(error);
  }
  } else {
    alert(invalidImage)
  }
};
const handleSubmitImgPotenciaInterna = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('image', userInfo.file);
  if (invalidImage==null) {
    try {
      await Axios.put(ipbackend+'updatefotopotenciainterna/'+num_contrato, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
        alert("Se cargó imagen con éxito ")
        getInstalaciones();
        ventanaModalImagen();
        limpiarcampos();
  } catch (error) {
      console.error(error);
  }
  } else {
    alert(invalidImage)
  }
};
  const handleSubmitImgContrato = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('image', userInfo.file);
      if (invalidImage==null) {
        try {
          await Axios.put(ipbackend+'updatefotocontrato/'+num_contrato, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              }
          });
            alert("Se cargó imagen con éxito ")
            getInstalaciones();
            ventanaModalImagen();
            limpiarcampos();
      } catch (error) {
          console.error(error);
      }
      } else {
        alert(invalidImage)
      }
  };
  const handleSubmitImgCasa = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', userInfo.file);
    if (invalidImage==null) {
      try {
        await Axios.put(ipbackend+'updatefotocasa/'+num_contrato, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
          alert("Se cargó imagen con éxito ")
          getInstalaciones();
          ventanaModalImagen();
          limpiarcampos();
    } catch (error) {
        console.error(error);
    }
    } else {
      alert(invalidImage)
    }
};

  
  //FUNCION PARA VER GEOLOCALIZACION
  // function contieneBarra() {
  //   if (geolocalizacion.includes('/')) {
  //     console.log("si incluye /")
  //     let newgeo = geolocalizacion.replace("/",",");
  //     return(newgeo)
  //   } else {
  //     console.log("no incluye /")
  //     return(geolocalizacion)
  //   }
  // }
  
  // FUNCION PARA OBTENER LAS COORDENADAS DEL TECNICO CON UN BOTÓN
  // En tu formulario de instalación
const obtenerUbicacion = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Guardar en el estado del formulario
        setLatitud(latitude)
        setLongitud(longitude)
        console.log("se obtuvieron las coordenadas con exito")
        console.log("latitud: "+latitude)
        console.log("longitud: "+longitude)
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        // Puedes manejar el error o pedir que ingresen las coordenadas manualmente
      }
    );
  } else {
    alert("Geolocalización no es soportada por este navegador.");
  }
};

    const addinstalacion = () => {
      if (latitud==null) {
        alert("Error al obtener geolocalización")
      } else {
        Axios.post(ipbackend+"createinstalacion", {
          num_contrato: num_contrato,
          clienteactual_dnicliente: dnicliente,
          ordentrabajo_idordentrabajo: id_ordentrabajo,
          planactual_idplanes: idplan,
          fecha_inicio_contrato: fecha_actual,
          condicion_equipo: condicion_equipo,
          tipo_equipo: tipo_equipo,
          cobro_equipo: cobro_equipo,
          cobro_instalacion: cobro_instalacion,
          comentario_instalacion: observacion,
          caja_instalacion: caja_instalacion,
          dia_pago: dia_pago,
          latitud: latitud,
          longitud: longitud,
          ciclo_facturacion: 30,
          user_create: user_create,
          fecha_create: fecha_actual,
          caja_instalacion: caja_instalacion,
          estado_servicio: estado_servicio,
          latitud: latitud,
          longitud: longitud
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
          ventanaModal();
          ventanaModalConfirmar();
          console.log(response.data)
      }).catch((error) => {
        if (error.response && error.response.status === 400){
        alert("Error: "+error.response.data.error);
        console.log(error.response.data.error)//d
        }
        return error;
        });
      }
      };

      const confirmarinstalacion = () => {
        Axios.put(ipbackend+"updateordentrabajo/"+id_ordentrabajo, {
            estado_instalacion: 2
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
           return error;
          });
      };

      const updateinstalacion = () => {
        Axios.put(ipbackend+"updateinstalacion/"+num_contrato, {
            comentario_instalacion: observacion,
            user_update: user_update,
            fecha_update: fecha_actual,
            caja_instalacion: caja_instalacion,
            condicion_equipo: condicion_equipo,
            tipo_equipo: tipo_equipo,
            cobro_equipo: cobro_equipo,
            cobro_instalacion: cobro_instalacion
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          limpiarcampos();
          ventanaModal();
          // getInstalacionesPendientes();
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

      // const updateGeolocalizacion = () => {
      //   let newgeo = contieneBarra();
      //   Axios.put(ipbackend+"updatecliente/"+dnicliente, {
      //       geolocalizacion: newgeo,
      //   },{
      //     headers: {
      //       'Authorization': `Bearer ${token}`
      //     }
      //   }).then(() => {
      //     limpiarcampos();
      //     ventanaModalGeo();
      //     getInstalaciones();
      //     alert("Geolocalización Actualizado con exito");
      //   }).catch((error) => {
      //     if (401 === error.response.status){
      //     sessionStorage.removeItem("token");
      //     window.location.reload();
      //     alert("Sesión expirada, vuelva a iniciar sesión");
      //     }
      //     return error;
      //     });
      // };

      const getInstalacionesPendientes = async () => {
        try {
          const response = await Axios.get(ipbackend+'orders_pending', {
            headers:{
                'Authorization': `Bearer ${token}`
            }
          }
          );
          setOrdenesPendientes(response.data);
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
    const response = await Axios.get(ipbackend+'orders_install', {
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

      const capturarIDordentrabajo = () =>{
        if (selectedRow == undefined) {
          alert("Debe seleccionar un registro")
        } else {
          console.log("ID OT: "+selectedRow)
        console.log(dnicliente)
        setId_ordentrabajo(selectedRow);
        // setDnicliente(cliente.clienteinicial_dnicliente);
        // setPlan(cliente.nombreplan);
        // setIdplan(cliente.planinicial_idplanes);
        // setApellidocliente(cliente.apellidocli);
        // setNombrecliente(cliente.nombrecli);
        // setCobro_instalacion(cliente.costo_instalacion);
        // setDia_pago(cliente.diapago);
        obtenerUbicacion();
        ventanaModal();   
        }
        
    }
    const capturarIDforimage = () =>{
      if (num_contrato==undefined) {
        alert("Debe seleccionar un registro")
      } else {
        console.log(imgcontrato)
        ventanaModalImagen();
      }
  }
//   const capturarIDforgeo = () =>{
//     if (num_contrato==undefined) {
//       alert("Debe seleccionar un registro")
//     } else {
//       console.log(imgcontrato)
//       ventanaModalGeo();
//     }
// }
    const capturarIDinstalacion = () =>{
      if (num_contrato==undefined) {
        alert("Debe seleccionar un registro")
      } else {
      setEditar(true);
      ventanaModal();   
      }
  }
    // Función para manejar el clic en una fila
    const handleRowClick = (cliente) => {    
      setSelectedRow(cliente.id_ordentrabajo);
      setNum_contrato(cliente.num_contrato);
      setDnicliente(cliente.dnicliente);
      setPlan(cliente.nombreplan);
      setApellidocliente(cliente.apellidocli);
      setNombrecliente(cliente.nombrecli);
      setCondicion_equipo(cliente.condicion_equipo);
      setTipo_equipo(cliente.tipo_equipo);
      setCobro_equipo(cliente.cobro_equipo);
      setCobro_instalacion(cliente.cobro_instalacion);
      setCajainstalacion(cliente.caja_instalacion);
      setObservacion(cliente.comentario_instalacion);
      setImgcaja_antes(cliente.nombreimg_caja_antes);
      setImgpotencia_antes(cliente.nombreimg_potencia_antes);
      setImgcaja_despues(cliente.nombreimg_caja_despues);
      setImgpotencia_despues(cliente.nombreimg_potencia_despues);
      setImginstalacion_interna(cliente.nombreimg_instalacion_interna);
      setImgpotencia_interna(cliente.nombreimg_potencia_interna);
      setImgcontrato(cliente.nombreimg_contrato);
      setImgcasa(cliente.nombreimg_casa);
      setGeolocalizacion(cliente.geolocalizacion);
      setLatitud(cliente.latitud);
      setLongitud(cliente.longitud);
      console.log(cliente.num_contrato)
      console.log(cliente.id_ordentrabajo)
      console.log(cliente.imgcontrato)
      console.log(cliente.geolocalizacion)
    };

    // Función para manejar el clic en una fila de las OTs pendientes
    const handleRowClick_ot = (cliente) => {    
      setSelectedRow(cliente.id_ordentrabajo);
      setDnicliente(cliente.clienteinicial_dnicliente);
      setIdplan(cliente.planinicial_idplanes);
      setDia_pago(cliente.diapago);
      setPlan(cliente.nombreplan);
      setApellidocliente(cliente.apellidocli);
      setNombrecliente(cliente.nombrecli);
      setGeolocalizacion(cliente.geolocalizacion);
      setCobro_instalacion(cliente.costo_instalacion);
      console.log(cliente.planinicial_idplanes)
      console.log(cliente.id_ordentrabajo)
      console.log("Esta seleccionando una fila de los pendientes de instalacion")
    };

      const limpiarcampos = ()=>{
        setFecha_actual(fechaactual);
        setId_ordentrabajo("");
        setNum_contrato("");
        setObservacion("");
        setCajainstalacion("");
        setCondicion_equipo("Alquiler");
        setTipo_equipo("")
        setCobro_equipo(0);
        setCobro_instalacion(0);
        setGeolocalizacion("")
        setLatitud();
        setLongitud();
        setinvalidImage(null);
        setSelectedRow(null);
        setuserInfo({
          file:[],
          filepreview:null
        })

        setEditar(false);
      }
      const limpiarcamposeditar = ()=>{
        setFecha_actual(fechaactual);
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
      const cerrarModalEditar = ()=>{
        limpiarcamposeditar();
        ventanaModal();
      }
      const cerrarModalImagen = ()=>{
       ventanaModalImagen();
      }
      // const cerrarModalGeo = ()=>{
      //   ventanaModalGeo();
      //  }
  const verimagen1 = () => {
    window.open(ipbackend + imgcaja_antes, "_blank");
  }
  const verimagen2 = () => {
    window.open(ipbackend + imgpotencia_antes, "_blank");
  }
  const verimagen3 = () => {
    window.open(ipbackend + imgcaja_despues, "_blank");
  }
  const verimagen4 = () => {
    window.open(ipbackend + imgpotencia_despues, "_blank");
  }
  const verimagen5 = () => {
    window.open(ipbackend + imginstalacion_interna, "_blank");
  }
  const verimagen6 = () => {
    window.open(ipbackend + imgpotencia_interna, "_blank");
  }
  const verimagen7 = () => {
    window.open(ipbackend + imgcontrato, "_blank");
  }
  const verimagen8 = () => {
    window.open(ipbackend + imgcasa, "_blank");
  }


       //****************Funcion de Busqueda de INSTALADOS y PENDIENTES
       const searcher = (e) =>{
        setBusqueda(e.target.value);
        getInstalacionesPendientes();
        getInstalaciones();
        if(e.target.value=="instalados"){
          console.log("instalados")
          setSelect_instalados(true)
        }
        if(e.target.value=="pendientes"){
          console.log("pendientes")
          setSelect_instalados(false)
        }
        }
        let results = ordenesPendientes
        if (busqueda === "instalados") {
          results = instalaciones
            
          } else{
            results = ordenesPendientes
          }

        //Funcion de Busqueda DNI
  const searcherdni = (e) =>{
    setBusquedadni(e.target.value);
    console.log(busquedadni)
    }
// Funcion de Filtrado por dni
const newfilter = results.filter(dato => {
  return (
    dato.dnicliente.toLowerCase().includes(busquedadni.toLocaleLowerCase())
)
});

// let resultsdni = [];

if (busquedadni === "") {
  results = results;
} else {
  results = newfilter;
}

        useEffect(() =>{
          getInstalacionesPendientes();
          getInstalaciones();
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
        <div className="App">
          <h1 className="mb3">Registro de Instalaciones</h1>
          {select_instalados ? (
            <div
              class="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                class="btn btn-outline-primary"
                onClick={capturarIDinstalacion}
              >
                Editar instalación
              </button>
              <button
                type="button"
                class="btn btn-outline-primary"
                onClick={capturarIDforimage}
              >
                Registrar fotos
              </button>
              <input value={busquedadni} onChange={searcherdni} type='text' placeholder='Busqueda por DNI' className='form-control border border-success'
              />
            </div>
            
            
          ) : (
            <button
                type="button"
                class="btn btn-outline-primary"
                onClick={capturarIDordentrabajo}
              >
                Registrar Instalación
              </button>
          )}

          <div className="mb-3">
            <select
              type="text"
              value={busqueda}
              onChange={searcher}
              className="form-select form-select-lg mt-3"
            >
              <option value="pendientes">Pendientes</option>
              <option value="instalados">Instalados</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table">
              {/* table-striped table-hover mt-5 shadow-lg */}
              <thead>
                <tr className="bg-curso text-white">
                  <th>DNI</th>
                  <th>Apellidos</th>
                  <th>Nombres</th>
                  <th>Distrito</th>
                  <th>Direccion</th>
                  <th>Referencia</th>
                  <th>Telefono</th>
                  <th>Fecha programada</th>
                  <th>Horario programado</th>
                  {select_instalados ? (
                    <>
                      <th>Condic equipo</th>
                      <th>Tipo equipo</th>
                      <th>cobro equipo</th>
                      <th>cobro instalacion</th>
                      <th>Caja instalacion</th>
                      <th>Ubicación</th>
                      <th>Geolocalización</th>
                      <th>Técnico</th>
                      <th>Fecha Instalacion</th>
                    </>
                  ) : (
                    <>
                      <th>Plan</th>
                      <th>Indicaciones</th>
                      <th>Ubicación</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((cliente, key) => (
                  <tr
                    key={cliente.id_ordentrabajo}
                    value={id_ordentrabajo}
                    onClick={() => {
                      {select_instalados?(handleRowClick(cliente)):(handleRowClick_ot(cliente))};
                    }}
                    className={
                      selectedRow === cliente.id_ordentrabajo
                        ? "table-primary"
                        : null
                    }
                  >
                    <td>{cliente.clienteinicial_dnicliente}</td>
                    <td>{cliente.apellidocli}</td>
                    <td>{cliente.nombrecli}</td>
                    <td>{cliente.distritocli}</td>
                    <td>{cliente.direccioncli}</td>
                    <th>{cliente.referenciacli}</th>
                    <td>{cliente.telefonocli}</td>
                    <td>{cliente.fechaprog_instalacion}</td>
                    <td>{cliente.horario_instalacion}</td>
                    {select_instalados ? (
                      <>
                        <td>{cliente.condicion_equipo}</td>
                        <td>{cliente.tipo_equipo}</td>
                        <td>{cliente.cobro_equipo}</td>
                        <td>{cliente.cobro_instalacion}</td>
                        <td>{cliente.caja_instalacion}</td>
                        <td>
                          <Link
                            to={cliente.geolocalizacion}
                            target="_blank"
                          >
                            <a>{cliente.geolocalizacion}</a>
                          </Link>
                        </td>
                        <td>
                        <Link
                            to={
                              "https://www.google.com/maps/search/?api=1&query=" +
                              cliente.latitud+","+cliente.longitud+
                              "&zoom=20"
                            }
                            target="_blank"
                          >
                            <a>{cliente.latitud},{cliente.longitud}</a>
                          </Link>
                        </td>
                        <td>{cliente.tecnico}</td>
                        <td>{cliente.fecha_instalacion}</td>
                      </>
                    ) : (
                      <>
                        <td>{cliente.nombreplan}</td>
                        <td>{cliente.indicacion_instalacion}</td>
                        <td>
                          <Link
                            to={cliente.geolocalizacion}
                            target="_blank"
                          >
                            <a>{cliente.geolocalizacion}</a>
                          </Link>
                        </td>
                      </>
                    )}
                    {/* {select_instalados ? null : (
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() => {
                            capturarIDordentrabajo(cliente);
                          }}
                        >
                          Registrar
                        </button>
                      </td>
                    )} */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal isOpen={modalMostrar} toggle={ventanaModal}>
            <ModalBody>
              <div className="from-group">
                {editar ? (
                  <h4>Editar Instalación</h4>
                ) : (
                  <h4 className="">Registrar Instalación:</h4>
                )}

                <div className="mb-3">
                  <label for="num_contrato" className="form-label">
                    Número de Contrato:
                  </label>
                  {editar ? (
                    <span className="input-group-text" id="basic-addon1">
                      {num_contrato}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={num_contrato}
                      onChange={(event) => {
                        setNum_contrato(event.target.value);
                      }}
                      className="form-control"
                      id="num_contrato"
                      placeholder="número de contrato"
                      aria-describedby="basic-addon1"
                    ></input>
                  )}
                </div>
                <div className="mb-3">
                  <label for="dnicliente" className="form-label">
                    DNI Cliente:
                  </label>
                  <span className="input-group-text" id="basic-addon1">
                    {dnicliente}
                  </span>
                </div>
                <div className="mb-3">
                  <label for="coordenadas" className="form-label">
                    Coordenadas detectadas: (latitud, longitud)
                  </label>
                  <span className="input-group-text" id="basic-addon1">
                    {latitud},{longitud}
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
                  <label for="condicion_equipo" className="form-label">
                    Condicion Equipo:
                  </label>
                  <select
                    value={condicion_equipo}
                    onChange={(event) => {
                      setCondicion_equipo(event.target.value);
                    }}
                    className="form-control"
                    id="condicion_equipo"
                    aria-describedby="basic-addon1"
                  >
                    <option>Alquiler</option>
                    <option>Venta</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label for="tipo_equipo" className="form-label">
                    Tipo Equipo:
                  </label>
                  <input
                    type="text"
                    value={tipo_equipo}
                    onChange={(event) => {
                      setTipo_equipo(event.target.value);
                    }}
                    className="form-control"
                    id="cajainstalacion"
                    placeholder="Marca y/o modelo"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="cobro_equipo" className="form-label">
                    Cobro por Equipo:
                  </label>
                  <input
                    type="number"
                    value={cobro_equipo}
                    onChange={(event) => {
                      setCobro_equipo(event.target.value);
                    }}
                    className="form-control"
                    id="cobro_equipo"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="cobro_instalacion" className="form-label">
                    Cobro por Intalacion:
                  </label>
                  <input
                    type="number"
                    value={cobro_instalacion}
                    onChange={(event) => {
                      setCobro_instalacion(event.target.value);
                    }}
                    className="form-control"
                    id="cobro_instalacion"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="caja_instalacion" className="form-label">
                    Caja & Spliter:
                  </label>
                  <input
                    type="text"
                    value={caja_instalacion}
                    onChange={(event) => {
                      setCajainstalacion(event.target.value);
                    }}
                    className="form-control"
                    id="cajainstalacion"
                    placeholder="Ingrese la Caja & Spliter"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="observacion" className="form-label">
                    Observación:
                  </label>
                  <input
                    type="text"
                    value={observacion}
                    onChange={(event) => {
                      setObservacion(event.target.value);
                    }}
                    maxLength={maxLengthObservacion}
                    className="form-control"
                    id="observacion"
                    placeholder="Observación"
                    aria-describedby="basic-addon1"
                  ></input>
                  {/* <div>
                {observacion.length} caracteres
              </div>
              {observacion.length >= maxLengthObservacion && (
                <div style={{ color: "red" }}>
                  Has alcanzado el límite de caracteres
                </div>
              )} */}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {editar ? (
                <div>
                  <button
                    className="btn btn-success"
                    onClick={updateinstalacion}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={cerrarModalEditar}
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div>
                  <button className="btn btn-success" onClick={addinstalacion}>
                    Registrar
                  </button>
                  <button className="btn btn-danger" onClick={cerrarModal}>
                    Cerrar
                  </button>
                </div>
              )}
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalConfirmar} toggle={ventanaModalConfirmar}>
            <ModalBody>
              <div className="from-group h3">
                La instalación ha sido grabada con éxito:
                <span>{" " + apellidocliente + " " + nombrecliente}</span>
              </div>
            </ModalBody>
            <ModalFooter>
              <div>
                <button
                  className="btn btn-warning m-2"
                  onClick={confirmarinstalacion}
                >
                  Aceptar
                </button>
              </div>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalImagen} toggle={ventanaModalImagen}>
            <ModalBody>
              <div className="from-group h3">
                Adjuntar fotos:
                <span>{" " + apellidocliente + " " + nombrecliente}</span>
              </div>
              {/* FOTO 1 CAJA ANTES */}
              <div>
                <label className="form-label fw-bold">
                  Foto 1 Caja antes:{" "}
                </label>
                <button onClick={verimagen1}>{imgcaja_antes}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgCajaAntes}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 2 POTENCIA ANTES */}
              <div>
                <label className="form-label fw-bold">
                  Foto 2 Potencia antes:{" "}
                </label>
                <button onClick={verimagen2}>{imgpotencia_antes}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgPotenciaAntes}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 3 CAJA DESPUES */}
              <div>
                <label className="form-label fw-bold">
                  Foto 3 Caja después:{" "}
                </label>
                <button onClick={verimagen3}>{imgcaja_despues}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgCajaDespues}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 4 POTENCIA DESPUES */}
              <div>
                <label className="form-label fw-bold">
                  Foto 4 Potencia después:{" "}
                </label>
                <button onClick={verimagen4}>{imgpotencia_despues}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgPotenciaDespues}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 5 INSTALACION INTERIOR */}
              <div>
                <label className="form-label fw-bold">
                  Foto 5 Instalación interior:{" "}
                </label>
                <button onClick={verimagen5}>{imginstalacion_interna}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgInstalacionInterna}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 6 POTENCIA INTERIOR */}
              <div>
                <label className="form-label fw-bold">
                  Foto 6 Potencia interior:{" "}
                </label>
                <button onClick={verimagen6}>{imgpotencia_interna}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgPotenciaInterna}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 7 CONTRATO */}
              <div>
                <label className="form-label fw-bold">Foto 7 Contrato: </label>
                <button onClick={verimagen7}>{imgcontrato}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgContrato}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
              {/* FOTO 8 CASA */}
              <div>
                <label className="form-label fw-bold">Foto 8 Casa: </label>
                <button onClick={verimagen8}>{imgcasa}</button>
                <br />
                <form
                  className="input-group mb-3"
                  onSubmit={handleSubmitImgCasa}
                >
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit" className="btn btn-secondary">
                    Cargar
                  </button>
                </form>
              </div>
            </ModalBody>
            <ModalFooter>
              <div>
                <button className="btn btn-danger" onClick={cerrarModalImagen}>
                  Cerrar
                </button>
              </div>
            </ModalFooter>
          </Modal>

          {/* <Modal isOpen={modalGeo} toggle={ventanaModalGeo}>
            <ModalBody>
              <div className="from-group h3">
                Actualizar Geolocalización:
                <span>{" " + apellidocliente + " " + nombrecliente}</span>
                <br />
                <input
                  type="text"
                  value={geolocalizacion}
                  onChange={(event) => {
                    setGeolocalizacion(event.target.value);
                  }}
                  className="form-control"
                  id="geolocalizacion"
                  placeholder="Ingresar las coordenadas"
                  aria-describedby="basic-addon1"
                ></input>
              </div>
            </ModalBody>
            <ModalFooter>
              <div>
                <button
                  className="btn btn-warning m-2"
                  onClick={updateGeolocalizacion}
                >
                  Actualizar
                </button>
                <button className="btn btn-danger" onClick={cerrarModalGeo}>
                  Cancelar
                </button>
              </div>
            </ModalFooter>
          </Modal> */}
        </div>
      );
}
export default Instalacion;