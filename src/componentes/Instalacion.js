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
    const [instalacionesforuser, setInstalacionesforuser] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [busquedadni, setBusquedadni] = useState("");
    const [perfiluser, setPerfiluser] = useState("");
    const [select_instalados, setSelect_instalados] = useState(false)

    const [id_ordentrabajo, setId_ordentrabajo] = useState();
    const [num_contrato, setNum_contrato] = useState();
    const [contrato, setContrato] = useState();
    const [dnicliente, setDnicliente] = useState();
    const [plan, setPlan] = useState();
    const [idplan, setIdplan] = useState();
    //Datos Instalacion
    const [observacion, setObservacion] = useState("");
    const [apellidocliente, setApellidocliente] = useState("");
    const [nombrecliente, setNombrecliente] = useState("");
    const [user_create, setUser_create] = useState("");
    const [fecha_actual, setFecha_actual] = useState(fechaactual);
    const [user_update, setUser_update] = useState("");
    const [caja_instalacion, setCajainstalacion] = useState("");
    const [splitter_instalacion, setSplitterinstalacion] = useState("");
    const [user_mk, setUser_mk] = useState("");
    const [cobro_instalacion, setCobro_instalacion] = useState(0);
    const [condicion_equipo, setCondicion_equipo] = useState("ALQUILER");
    const [cobro_equipo, setCobro_equipo] = useState(0);
    const [tipo_equipo, setTipo_equipo] = useState("");
    const [dia_pago, setDia_pago] = useState("");
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

  const [images, setImages] = useState({
    cajaAntes: { file: null, preview: null, name: imgcaja_antes },
    potenciaAntes: { file: null, preview: null, name: imgpotencia_antes },
    cajaDespues: { file: null, preview: null, name: imgcaja_despues },
    potenciaDespues: { file: null, preview: null, name: imgpotencia_despues },
    instalacionInterna: { file: null, preview: null, name: imginstalacion_interna },
    potenciaInterna: { file: null, preview: null, name: imgpotencia_interna },
    contrato: { file: null, preview: null, name: imgcontrato },
    casa: { file: null, preview: null, name: imgcasa }
  });

    const maxLengthObservacion = 100;

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    const [modalImagen, setModalImagen] = useState(false);

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModalConfirmar = () => setModalConfirmar(!modalConfirmar);
    const ventanaModalImagen = () => setModalImagen(!modalImagen);

    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser");
    let perfil = sessionStorage.getItem("role");
    let ipbackend = `${API.URL}`;

    //***************** CODIGO PARA SUBIR IMAGEN **********//
  let reader = new FileReader();
  const handleImageChange = (event, imageType) => {
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
      setImages(prev => ({
        ...prev,
        [imageType]: {
          ...prev[imageType],
          file: file,
          preview: URL.createObjectURL(imageFile),
          name: imageFile.name
        }
      }));
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
  
  const handleSubmitImage = async (event, endpoint, imageType) => {
    event.preventDefault();
    const imageData = images[imageType];
    
    if (!imageData.file) {
      alert('Por favor seleccione una imagen');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', imageData.file);
  
    try {
      await Axios.put(`${ipbackend}${endpoint}/${id_ordentrabajo}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Actualizar el estado con el nombre del archivo devuelto por el backend
      const response = await Axios.get(`${ipbackend}getordentrabajo/${id_ordentrabajo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      setImages(prev => ({
        ...prev,
        [imageType]: {
          ...prev[imageType],
          name: response.data[`nombreimg_${imageType.replace(/([A-Z])/g, '_$1').toLowerCase()}`]
        }
      }));
  
      alert(`Imagen ${imageType} cargada con éxito`);
      getInstalacionesPendientes();
    } catch (error) {
      console.error(error);
      alert('Error al cargar la imagen');
    }

    // Limpiar preview después de 5 segundos
  setTimeout(() => {
    setImages(prev => ({
      ...prev,
      [imageType]: {
        ...prev[imageType],
        preview: null
      }
    }));
    if (images[imageType].preview) {
      URL.revokeObjectURL(images[imageType].preview);
    }
  }, 5000);
  };
  
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
          contrato: contrato,
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
          splitter_instalacion: splitter_instalacion,
          user_mk: user_mk,
          dia_pago: dia_pago,
          latitud: latitud,
          longitud: longitud,
          ciclo_facturacion: 30,
          user_create: user_create,
          fecha_create: fecha_actual,
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
            splitter_instalacion: splitter_instalacion,
            user_mk: user_mk,
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

      const getInstalacionesforuser = async () => {
        try {
          const response = await Axios.get(ipbackend + 'orders_install_user/' + user, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
          }
          );
          setInstalacionesforuser(response.data);
          console.log("El perfil del usuario es: "+perfiluser);
        } catch (error) {
          console.error('Error fetching data:', error);
          //Capturar el mensaje específico cuando no hay instalaciones 404
          if (error.response && error.response.status === 404) {
            alert(error.response.data.message); // Muestra: "Usuario no tiene ninguna instalación"
        } 
        // Manejo de sesión expirada (401)   
          if (error.response && error.response.status === 401){
            sessionStorage.removeItem("token");
            window.location.reload();
            alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
      };

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
          setPerfiluser(perfil);
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
        obtenerUbicacion();
        ventanaModal();   
        }
        
    }
    const capturarIDforimage = () =>{
      if (selectedRow==undefined) {
        alert("Debe seleccionar un registro")
      } else {
        setId_ordentrabajo(selectedRow);
        console.log(selectedRow)
        ventanaModalImagen();
      }
  }

    const capturarIDinstalacion = () =>{
      if (num_contrato==undefined || selectedRow==undefined) {
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
      setContrato(cliente.contrato);
      setDnicliente(cliente.dnicliente);
      setPlan(cliente.nombreplan);
      setApellidocliente(cliente.apellidocli);
      setNombrecliente(cliente.nombrecli);
      setCondicion_equipo(cliente.condicion_equipo);
      setTipo_equipo(cliente.tipo_equipo);
      setCobro_equipo(cliente.cobro_equipo);
      setCobro_instalacion(cliente.cobro_instalacion);
      setCajainstalacion(cliente.caja_instalacion);
      setSplitterinstalacion(cliente.splitter_instalacion);
      setUser_mk(cliente.user_mk);
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
      console.log(cliente.contrato);
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
      setImgcaja_antes(cliente.nombreimg_caja_antes);
      setImgpotencia_antes(cliente.nombreimg_potencia_antes);
      setImgcaja_despues(cliente.nombreimg_caja_despues);
      setImgpotencia_despues(cliente.nombreimg_potencia_despues);
      setImginstalacion_interna(cliente.nombreimg_instalacion_interna);
      setImgpotencia_interna(cliente.nombreimg_potencia_interna);
      setImgcontrato(cliente.nombreimg_contrato);
      setImgcasa(cliente.nombreimg_casa);
      console.log(cliente.planinicial_idplanes)
      console.log(cliente.id_ordentrabajo)
      console.log("Esta seleccionando una fila de los pendientes de instalacion")
    };

      const limpiarcampos = ()=>{
        setFecha_actual(fechaactual);
        setId_ordentrabajo("");
        setNum_contrato("");
        setContrato("");
        setObservacion("");
        setCajainstalacion("");
        setSplitterinstalacion("");
        setUser_mk("");
        setCondicion_equipo("Alquiler");
        setTipo_equipo("")
        setCobro_equipo(0);
        setCobro_instalacion(0);
        setGeolocalizacion("")
        setLatitud();
        setLongitud();
        setinvalidImage(null);
        setSelectedRow(null);

        setEditar(false);
      }
      const limpiarcamposeditar = ()=>{
        setFecha_actual(fechaactual);
        setinvalidImage(null);
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
      const cerrarModalImagen = () => {
        // Liberar las URLs de los previews para evitar memory leaks
        if (images.cajaAntes.preview) URL.revokeObjectURL(images.cajaAntes.preview);
        if (images.potenciaAntes.preview) URL.revokeObjectURL(images.potenciaAntes.preview);
        if (images.cajaDespues.preview) URL.revokeObjectURL(images.cajaDespues.preview);
        if (images.potenciaDespues.preview) URL.revokeObjectURL(images.potenciaDespues.preview);
        if (images.instalacionInterna.preview) URL.revokeObjectURL(images.instalacionInterna.preview);
        if (images.potenciaInterna.preview) URL.revokeObjectURL(images.potenciaInterna.preview);
        if (images.contrato.preview) URL.revokeObjectURL(images.contrato.preview);
        if (images.casa.preview) URL.revokeObjectURL(images.casa.preview);
        // Resetear el estado de los previews
        setImages({
          cajaAntes: { ...images.cajaAntes, file: null, preview: null, name: null },
          potenciaAntes: { ...images.potenciaAntes, file: null, preview: null, name: null },
          cajaDespues: { ...images.cajaDespues, file: null, preview: null, name: null },
          potenciaDespues: { ...images.potenciaDespues, file: null, preview: null, name: null },
          instalacionInterna: { ...images.instalacionInterna, file: null, preview: null, name: null },
          potenciaInterna: { ...images.potenciaInterna, file: null, preview: null, name: null },
          contrato: { ...images.contrato, file: null, preview: null, name: null },
          casa: { ...images.casa, file: null, preview: null, name: null }
        });
        setSelectedRow(null)
        // Cerrar el modal
        ventanaModalImagen();
      };

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
        getInstalacionesforuser();
        if(e.target.value=="instalados"){
          console.log("instalados")
          limpiarcampos();
          setSelect_instalados(true)
        }
        if(e.target.value=="pendientes"){
          console.log("pendientes")
          limpiarcampos();
          setSelect_instalados(false)
        }
        }
        let results = ordenesPendientes
  if (busqueda === "instalados") {
    if (perfiluser === "Tecnico") {
      results = instalacionesforuser
    } else {
      results = instalaciones
    }
  } else {
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

        // useEffect para carga inicial (se ejecuta solo al montar el componente)
  useEffect(() => {
    getInstalacionesPendientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    if (selectedRow) {
      setImages({
        cajaAntes: { ...images.cajaAntes, name: imgcaja_antes },
        potenciaAntes: { ...images.potenciaAntes, name: imgpotencia_antes },
        cajaDespues: { ...images.cajaDespues, name: imgcaja_despues },
        potenciaDespues: { ...images.potenciaDespues, name: imgpotencia_despues },
        instalacionInterna: { ...images.instalacionInterna, name: imginstalacion_interna },
        potenciaInterna: { ...images.potenciaInterna, name: imgpotencia_interna },
        contrato: { ...images.contrato, name: imgcontrato },
        casa: { ...images.casa, name: imgcasa }
      });
    }
  }, [imgcaja_antes, imgpotencia_antes, imgcaja_despues, imgpotencia_despues, imginstalacion_interna, imgpotencia_interna, imgcontrato, imgcasa, selectedRow])

      return (
        <div className="App">
          <h1 className="mb3">Registro de Instalaciones</h1>
          {select_instalados ? (
            <>
            <div
              className="btn-group mt-2"
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
                Editar fotos
              </button>    
            </div>
            <input value={busquedadni} onChange={searcherdni} type='text' placeholder='Busqueda por DNI' 
            className='form-control border border-success'
              />
            </>
          ) : (
            <>
            <button
                type="button"
                class="btn btn-outline-primary"
                onClick={capturarIDforimage}
              >
                Registrar fotos
              </button>
            <button
                type="button"
                class="btn btn-outline-primary"
                onClick={capturarIDordentrabajo}
              >
                Registrar Instalación
              </button>
            </> 
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
                  <th>Sede</th>
                  <th>Direccion</th>
                  <th>Referencia</th>
                  <th>Telefonos</th>
                  <th>Fecha programada</th>
                  <th>Horario programado</th>
                  {select_instalados ? (
                    <>
                      <th>Condic equipo</th>
                      <th>Tipo equipo</th>
                      <th>cobro equipo</th>
                      <th>cobro instalacion</th>
                      <th>CT Splitter</th>
                      <th>User_MK</th>
                      <th>Ubicación (Maps)</th>
                      <th>Coordenadas</th>
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
                    <td>{cliente.nombre_sede}</td>
                    <td>{cliente.direccioncli}</td>
                    <th>{cliente.referenciacli}</th>
                    <td>{cliente.telefonocli} {cliente.telefonocli2}</td>
                    <td>{cliente.fechaprog_instalacion}</td>
                    <td>{cliente.horario_instalacion}</td>
                    {select_instalados ? (
                      <>
                        <td>{cliente.condicion_equipo}</td>
                        <td>{cliente.tipo_equipo}</td>
                        <td>{cliente.cobro_equipo}</td>
                        <td>{cliente.cobro_instalacion}</td>
                        <td>{cliente.caja_instalacion} / {cliente.splitter_instalacion}</td>
                        <td>{cliente.user_mk}</td>
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
                  <label for="contrato" className="form-label">
                    N° Contrato Físico:
                  </label>
                  {editar ? (
                    <span className="input-group-text" id="basic-addon1">
                      {contrato}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={contrato}
                      onChange={(event) => {
                        setContrato(event.target.value);
                      }}
                      className="form-control"
                      id="contrato"
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
                  <label for="plan" className="form-label">
                    Plan Solicitado:
                  </label>
                  <span className="input-group-text" id="basic-addon1">
                    {plan}
                  </span>
                </div>
                <div className="mb-3">
                  <label for="condicion_equipo" className="form-label">
                    Condicion Equipo principal (ONT):
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
                    <option>ALQUILER</option>
                    <option>VENTA</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label for="tipo_equipo" className="form-label">
                    Equipos entregados (ONT, cámara, etc):
                  </label>
                  <input
                    type="text"
                    value={tipo_equipo}
                    onChange={(event) => {
                      setTipo_equipo(event.target.value);
                    }}
                    maxLength={100}
                    className="form-control uppercase-input"
                    id="Equipo ONT"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="cobro_equipo" className="form-label">
                    Cobro por Equipos:
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
                    Cobro por la Intalacion:
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
                    Caja Terminal(CT):
                  </label>
                  <input
                    type="text"
                    value={caja_instalacion}
                    onChange={(event) => {
                      setCajainstalacion(event.target.value);
                    }}
                    maxLength={40}
                    className="form-control uppercase-input"
                    id="cajainstalacion"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="splitter_instalacion" className="form-label">
                    Splitter:
                  </label>
                  <input
                    type="text"
                    value={splitter_instalacion}
                    onChange={(event) => {
                      setSplitterinstalacion(event.target.value);
                    }}
                    maxLength={40}
                    className="form-control uppercase-input"
                    id="splitter_instalacion"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="user_mk" className="form-label">
                    Usuario Winbox cliente:
                  </label>
                  <input
                    type="text"
                    value={user_mk}
                    onChange={(event) => {
                      setUser_mk(event.target.value);
                    }}
                    maxLength={20}
                    className="form-control uppercase-input"
                    id="observacion"
                    aria-describedby="basic-addon1"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="observacion" className="form-label">
                    Observación y/o Comentario:
                  </label>
                  <input
                    type="text"
                    value={observacion}
                    onChange={(event) => {
                      setObservacion(event.target.value);
                    }}
                    maxLength={maxLengthObservacion}
                    className="form-control uppercase-input"
                    id="observacion"
                    aria-describedby="basic-addon1"
                  ></input>
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
              <div className="from-group">
                <h3 className="text-center">****CARGAR IMAGENES****</h3>
                <h5>CLIENTE:<span>{" " + apellidocliente + " " + nombrecliente}</span></h5> 
              </div>

              {/* FOTO 1 CAJA ANTES */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 1 Caja antes:</label>
                {images.cajaAntes.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen1()}
                  >
                    {images.cajaAntes.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotocajaantes', 'cajaAntes')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'cajaAntes')}
                      key={`cajaAntes-${images.cajaAntes.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.cajaAntes.preview && (
                    <div className="mt-2">
                      <img
                        src={images.cajaAntes.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 2 POTENCIA ANTES */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 2 Potencia antes:</label>
                {images.potenciaAntes.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen2()}
                  >
                    {images.potenciaAntes.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotopotenciaantes', 'potenciaAntes')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'potenciaAntes')}
                      key={`potenciaAntes-${images.cajaAntes.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.potenciaAntes.preview && (
                    <div className="mt-2">
                      <img
                        src={images.potenciaAntes.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 3 CAJA DESPUES */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 3 Caja despues:</label>
                {images.cajaDespues.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen3()}
                  >
                    {images.cajaDespues.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotocajadespues', 'cajaDespues')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'cajaDespues')}
                      key={`cajaDespues-${images.cajaDespues.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.cajaDespues.preview && (
                    <div className="mt-2">
                      <img
                        src={images.cajaDespues.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 4 POTENCIA DESPUES */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 4 Potencia despues:</label>
                {images.potenciaDespues.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen4()}
                  >
                    {images.potenciaDespues.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotopotenciadespues', 'potenciaDespues')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'potenciaDespues')}
                      key={`potenciaDespues-${images.potenciaDespues.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.potenciaDespues.preview && (
                    <div className="mt-2">
                      <img
                        src={images.potenciaDespues.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 5 INSTALACION INTERNA */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 5 Instalación interna:</label>
                {images.instalacionInterna.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen5()}
                  >
                    {images.instalacionInterna.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotoinstalacion', 'instalacionInterna')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'instalacionInterna')}
                      key={`instalacionInterna-${images.instalacionInterna.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.instalacionInterna.preview && (
                    <div className="mt-2">
                      <img
                        src={images.instalacionInterna.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 6 POTENCIA INTERNA */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 6 Potencia interna:</label>
                {images.potenciaInterna.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen6()}
                  >
                    {images.potenciaInterna.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotopotenciainterna', 'potenciaInterna')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'potenciaInterna')}
                      key={`potenciaInterna-${images.potenciaInterna.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.potenciaInterna.preview && (
                    <div className="mt-2">
                      <img
                        src={images.potenciaInterna.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 7 CONTRATO */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 8 Contrato:</label>
                {images.contrato.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen7()}
                  >
                    {images.contrato.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotocontrato', 'contrato')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'contrato')}
                      key={`contrato-${images.contrato.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.contrato.preview && (
                    <div className="mt-2">
                      <img
                        src={images.contrato.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* FOTO 8 CASA */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Foto 8 Casa:</label>
                {images.casa.name && (
                  <button
                    className="btn btn-link p-0 mb-2"
                    onClick={() => verimagen8()}
                  >
                    {images.casa.name}
                  </button>
                )}
                <form onSubmit={(e) => handleSubmitImage(e, 'updatefotocasa', 'casa')}>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, 'casa')}
                      key={`casa-${images.casa.name}`} // Forzar re-render al cambiar
                    />
                    <button type="submit" className="btn btn-primary">
                      Cargar
                    </button>
                  </div>
                  {images.casa.preview && (
                    <div className="mt-2">
                      <img
                        src={images.casa.preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
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

        </div>
      );
}
export default Instalacion;