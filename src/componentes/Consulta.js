import React, { useEffect, useState, useRef } from 'react'
import Axios from "axios";
import '../estilos/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import html2canvas from 'html2canvas';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { Link } from 'react-router-dom';
import API from '../utils/const';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table'

function Consulta() {

    const [listaClientes, setListaClientes] = useState([]);
    const [listaPlanes, setListaPlanes] = useState([]);
    //Datos para el Modal
    const [num_contrato, setNum_contrato] = useState();
    const [planes_idplanes, setPlanes_idplanes] = useState();
    const [plan_anterior, setPlan_anterior] = useState();
    const [contrato, setContrato] = useState();
    const [dnicli, setDnicli] = useState();
    const [nuevo_dnicli, setNuevo_Dnicli] = useState();
    const [nombrecli, setNombrecli] = useState();
    const [apellidocli, setApellidocli] = useState();
    const [direccioncli, setDireccioncli] = useState();
    const [referenciacli, setReferenciacli] = useState();
    const [telefonocli, setTelefonocli] = useState();
    const [telefonocli2, setTelefonocli2] = useState();
    const [nombreplan, setNombreplan] = useState();
    const [precioplan, setPrecioplan] = useState();
    const [descuento_anterior, setDescuento_anterior] = useState();
    const [mensaje, setMensaje] = useState('');
    const [descuento, setDescuento] = useState();
    const [comentario, setComentario] = useState('');
    const [preciofinal, setPreciofinal] = useState();
    const [descplan, setDescplan] = useState();
    const [sedecli, setSedecli] = useState();
    const [user_mk, setUser_mk] = useState();
    const [user_venta, setUserventa] = useState();
    const [fecha_venta, setFechaventa] = useState();
    
    //TABLA INSTALACION
    const [tecnico_instalador, setTecnico_instalador] = useState();
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [latitud, setLatitud] = useState();
    const [longitud, setLongitud] = useState();
    const [estado_servicio, setEstado_servicio] = useState();
    const [fechainstalacion, setFechainstalacion] = useState();
    const [fechacontrato, setFechacontrato] = useState();
    const [imgcaja_antes, setImgcaja_antes] = useState();
    const [imgpotencia_antes, setImgpotencia_antes] = useState();
    const [imgcaja_despues, setImgcaja_despues] = useState();
    const [imgpotencia_despues, setImgpotencia_despues] = useState();
    const [imginstalacion_interna, setImginstalacion_interna] = useState();
    const [imgpotencia_interna, setImgpotencia_interna] = useState();
    const [imgcontrato, setImgcontrato] = useState();
    const [imgcasa, setImgcasa] = useState();
    const [comentario_instalacion, setComentario_instalacion] = useState();
    const [caja_instalacion, setCaja_instalacion] = useState();
    const [splitter_instalacion, setSplitter_instalacion] = useState();
    const [tipo_equipo, setTipo_equipo] = useState();
    const [condicion_equipo, setCondicion_equipo] = useState();
    const [cobro_equipo, setCobroequipo] = useState();
    const [cobro_instalacion, setCobroinstalacion] = useState();
    const [diapago, setDiapago] = useState();
    const [fecha_ultimo_pago, setFecha_ultimo_pago] = useState();
    const [fecha_proximo_pago, setFecha_proximo_pago] = useState();
    // Estados para el rango

    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
      })
      const [columnFilters, setColumnFilters] = useState([])

    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalMostrarFotos, setModalMostrarFotos] = useState(false);
    const [modalCorregirDNI, setModalCorregirDNI] = useState(false);
    const [modalCambiarPlan, setModalCambiarPlan] = useState(false);
    const modalRef = useRef(null); // 1. Definir correctamente la referencia

    let ipbackend = `${API.URL}`
    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser");

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModalfotos = () => setModalMostrarFotos(!modalMostrarFotos);
    const ventanaModalCorregirDNI = () => setModalCorregirDNI(!modalCorregirDNI);
    const ventanaModalCambiarPlan = () => setModalCambiarPlan(!modalCambiarPlan);

    const getClientes = async () => {
        try {
          const response = await Axios.get(ipbackend+'getinstalacionesall', {
            headers:{
                'Authorization': `Bearer ${token}`
            }
          }
          );
          setListaClientes(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          if (error.response && error.response.status === 401){
            sessionStorage.removeItem("token");
            window.location.reload();
            alert("Sesión expirada, vuelva a iniciar sesión");
            }
        }
      };
      //OBTENER LISTA PLANES
      function getPlanes(){
        fetch(ipbackend+'getplanes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
            .then(response => response.json())
            .then(data => setListaPlanes(data))
      }

//CORREGIR DNI CLIENTE
const corregirDNI = () => {
        Axios.post(ipbackend+"contratos/corregir-dni", 
          {  
              nuevo_dni: nuevo_dnicli,
              dni_incorrecto: dnicli
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(() => {
            getClientes();
            cerrarModalCorregirDNI();
            alert("Se corrigió el DNI");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

      //CAMBIAR PLAN
const confirmarCambioPlan = () => {

   // Verificar si hay cambios reales
    if (planes_idplanes === plan_anterior && descuento === descuento_anterior) {
        setMensaje("No se detectaron cambios para actualizar");
        return; // Salir de la función sin hacer la petición
    }

        Axios.put(ipbackend+"updateinstalacion/"+num_contrato, 
          {  
              planactual_idplanes: planes_idplanes,
              descuento: descuento
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(Axios.post(ipbackend+"create_historicoplanes",
            {
              num_contrato: num_contrato,
              user_create: user,
              plan_anterior: plan_anterior,
              plan_nuevo: planes_idplanes,
              descuento_anterior: descuento_anterior,
              descuento_nuevo: descuento,
              comentario: comentario
            },{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }))
            .then(() => {
            getClientes();
            cerrarModalCambiarPlan();
            alert("Se cambió el Plan");
          }).catch((error) => {
            if (error.response && error.response.status === 400){
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error)
            }
            return error;
            });
      }

 const cerrarModalCorregirDNI = ()=>{
        ventanaModalCorregirDNI();
        setNuevo_Dnicli();
      }
 const cerrarModalCambiarPlan = ()=>{
        ventanaModalCambiarPlan();
        setNuevo_Dnicli();
        setMensaje('');
        setComentario('');
      }

      const columns = [
        {
          header: 'Fecha Contrato',
          accessorKey: 'fecha_inicio_contrato',
        },
          {
            header: 'Servicio',
            accessorKey: 'nombre_estado',
          },
          {
            header: 'DNI',
            accessorKey: 'clienteactual_dnicliente',
          },
          {
            header: 'Apellidos',
            accessorKey: 'apellidocli',
          },
          {
            header: 'Nombre',
            accessorKey: 'nombrecli',
          },
            {
            header: 'Sede',
            accessorKey: 'nombre_sede',
          },
          {
            header: 'Dirección',
            accessorKey: 'direccioncli',
          },
          {
            header: 'Dia pago',
            accessorKey: 'dia_pago',
          },
          {
            header: 'Caja Terminal',
            accessorKey: 'caja_instalacion',
          },
          {
            header: 'Splitter',
            accessorKey: 'splitter_instalacion',
          },
          {
            header: 'Plan',
            accessorKey: 'nombreplan',
          },
          {
            header: 'Tecnico',
            accessorKey: 'tecnico_instalador',
          },
        ];
        const data = listaClientes;

            const table = useReactTable({
            columns,
            data,
            filterFns: {},
            debugTable: true,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onPaginationChange: setPagination,
            state: {
                sorting,
                globalFilter: filtering,
                rowSelection: rowSelection,
                pagination,
                columnFilters,
            },
            onColumnFiltersChange: setColumnFilters,
            onSortingChange: setSorting,
            onGlobalFilterChange: setFiltering,
            onRowSelectionChange: setRowSelection,
            enableMultiRowSelection: false,
            enableRowSelection: true,
            debugHeaders: true,
            debugColumns: false,
          });

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

    // ABRIR MODAL PARA CORREGIR DNI
    const corregirDNIcli = () => {
        if (table.getSelectedRowModel().flatRows[0] == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            setNum_contrato(table.getSelectedRowModel().flatRows[0].original.num_contrato);
            setContrato(table.getSelectedRowModel().flatRows[0].original.contrato);
            setNombrecli(table.getSelectedRowModel().flatRows[0].original.nombrecli);
            setApellidocli(table.getSelectedRowModel().flatRows[0].original.apellidocli);
            setDnicli(table.getSelectedRowModel().flatRows[0].original.clienteactual_dnicliente);
            ventanaModalCorregirDNI();
        }
    }
    // ABRIR MODAL PARA CAMBIAR DE PLAN
    const cambiarPlan = () => {
        if (table.getSelectedRowModel().flatRows[0] == undefined) {
            alert("Debe seleccionar un registro")
        } else {
            setNum_contrato(table.getSelectedRowModel().flatRows[0].original.num_contrato);
            setContrato(table.getSelectedRowModel().flatRows[0].original.contrato);
            setNombrecli(table.getSelectedRowModel().flatRows[0].original.nombrecli);
            setApellidocli(table.getSelectedRowModel().flatRows[0].original.apellidocli);
            setDnicli(table.getSelectedRowModel().flatRows[0].original.clienteactual_dnicliente);
            setPlanes_idplanes(table.getSelectedRowModel().flatRows[0].original.planactual_idplanes);
            setPlan_anterior(table.getSelectedRowModel().flatRows[0].original.planactual_idplanes);
            setNombreplan(table.getSelectedRowModel().flatRows[0].original.nombreplan);
            setDescuento(table.getSelectedRowModel().flatRows[0].original.descuento);
            setDescuento_anterior(table.getSelectedRowModel().flatRows[0].original.descuento);
            ventanaModalCambiarPlan();
        }
    }

    const detalleCliente = () => {
        if (table.getSelectedRowModel().flatRows[0]==undefined) {
            alert("Debe seleccionar un registro")
        }else{
            setNum_contrato(table.getSelectedRowModel().flatRows[0].original.num_contrato);
            setContrato(table.getSelectedRowModel().flatRows[0].original.contrato);
            setDnicli(table.getSelectedRowModel().flatRows[0].original.clienteactual_dnicliente);
            setNombrecli(table.getSelectedRowModel().flatRows[0].original.nombrecli);
            setApellidocli(table.getSelectedRowModel().flatRows[0].original.apellidocli);
            setDiapago(table.getSelectedRowModel().flatRows[0].original.dia_pago);
            setDireccioncli(table.getSelectedRowModel().flatRows[0].original.direccioncli);
            setSedecli(table.getSelectedRowModel().flatRows[0].original.nombre_sede);
            setUser_mk(table.getSelectedRowModel().flatRows[0].original.user_mk);
            setReferenciacli(table.getSelectedRowModel().flatRows[0].original.referenciacli);
            setGeolocalizacion(table.getSelectedRowModel().flatRows[0].original.geolocalizacion);
            setLatitud(table.getSelectedRowModel().flatRows[0].original.latitud);
            setLongitud(table.getSelectedRowModel().flatRows[0].original.longitud);
            setTelefonocli(table.getSelectedRowModel().flatRows[0].original.telefonocli);
            setTelefonocli2(table.getSelectedRowModel().flatRows[0].original.telefonocli2);
            setFechainstalacion(table.getSelectedRowModel().flatRows[0].original.fecha_instalacion);
            setFechacontrato(table.getSelectedRowModel().flatRows[0].original.fecha_inicio_contrato);
            setTecnico_instalador(table.getSelectedRowModel().flatRows[0].original.tecnico_instalador);
            setComentario_instalacion(table.getSelectedRowModel().flatRows[0].original.comentario_instalacion);
            setNombreplan(table.getSelectedRowModel().flatRows[0].original.nombreplan);
            setDescplan(table.getSelectedRowModel().flatRows[0].original.descplan);
            setPrecioplan(table.getSelectedRowModel().flatRows[0].original.precioplan);
            setDescuento(table.getSelectedRowModel().flatRows[0].original.descuento);
            setPreciofinal(table.getSelectedRowModel().flatRows[0].original.precio_final);
            setEstado_servicio(table.getSelectedRowModel().flatRows[0].original.nombre_estado); 
            setCaja_instalacion(table.getSelectedRowModel().flatRows[0].original.caja_instalacion);
            setSplitter_instalacion(table.getSelectedRowModel().flatRows[0].original.splitter_instalacion);
            setTipo_equipo(table.getSelectedRowModel().flatRows[0].original.tipo_equipo);
            setCondicion_equipo(table.getSelectedRowModel().flatRows[0].original.condicion_equipo);
            setCobroequipo(table.getSelectedRowModel().flatRows[0].original.cobro_equipo);
            setCobroinstalacion(table.getSelectedRowModel().flatRows[0].original.cobro_instalacion);
            setFecha_ultimo_pago(table.getSelectedRowModel().flatRows[0].original.fecha_ultimo_pago);
            setFecha_proximo_pago(table.getSelectedRowModel().flatRows[0].original.fecha_proximo_pago);
            setUserventa(table.getSelectedRowModel().flatRows[0].original.user_venta);
            setFechaventa(table.getSelectedRowModel().flatRows[0].original.fecha_venta);
            ventanaModal();
        }
    }
    const verFotos = () => {
        if (table.getSelectedRowModel().flatRows[0]==undefined) {
            alert("Debe seleccionar un registro")
        }else{
            setNum_contrato(table.getSelectedRowModel().flatRows[0].original.num_contrato);
            setContrato(table.getSelectedRowModel().flatRows[0].original.contrato);
            setDnicli(table.getSelectedRowModel().flatRows[0].original.clienteactual_dnicliente);
            setNombrecli(table.getSelectedRowModel().flatRows[0].original.nombrecli);
            setApellidocli(table.getSelectedRowModel().flatRows[0].original.apellidocli);
            setDiapago(table.getSelectedRowModel().flatRows[0].original.dia_pago);
            setDireccioncli(table.getSelectedRowModel().flatRows[0].original.direccioncli);
            setSedecli(table.getSelectedRowModel().flatRows[0].original.nombre_sede);
            setUser_mk(table.getSelectedRowModel().flatRows[0].original.user_mk);
            setReferenciacli(table.getSelectedRowModel().flatRows[0].original.referenciacli);
            setGeolocalizacion(table.getSelectedRowModel().flatRows[0].original.geolocalizacion);
            setTelefonocli(table.getSelectedRowModel().flatRows[0].original.telefonocli);
            setTelefonocli2(table.getSelectedRowModel().flatRows[0].original.telefonocli2);
            setFechainstalacion(table.getSelectedRowModel().flatRows[0].original.fecha_instalacion);
            setFechacontrato(table.getSelectedRowModel().flatRows[0].original.fecha_inicio_contrato);
            setTecnico_instalador(table.getSelectedRowModel().flatRows[0].original.tecnico_instalador);
            setComentario_instalacion(table.getSelectedRowModel().flatRows[0].original.comentario_instalacion);
            setImgcaja_antes(table.getSelectedRowModel().flatRows[0].original.nombreimg_caja_antes);
            setImgpotencia_antes(table.getSelectedRowModel().flatRows[0].original.nombreimg_potencia_antes);
            setImgcaja_despues(table.getSelectedRowModel().flatRows[0].original.nombreimg_caja_despues);
            setImgpotencia_despues(table.getSelectedRowModel().flatRows[0].original.nombreimg_potencia_despues);
            setImginstalacion_interna(table.getSelectedRowModel().flatRows[0].original.nombreimg_instalacion_interna);
            setImgpotencia_interna(table.getSelectedRowModel().flatRows[0].original.nombreimg_potencia_interna);
            setImgcontrato(table.getSelectedRowModel().flatRows[0].original.nombreimg_contrato);
            setImgcasa(table.getSelectedRowModel().flatRows[0].original.nombreimg_casa);
            setNombreplan(table.getSelectedRowModel().flatRows[0].original.nombreplan);
            setDescplan(table.getSelectedRowModel().flatRows[0].original.descplan);
            setPrecioplan(table.getSelectedRowModel().flatRows[0].original.precioplan);
            setDescuento(table.getSelectedRowModel().flatRows[0].original.descuento);
            setPreciofinal(table.getSelectedRowModel().flatRows[0].original.precio_final);
            setEstado_servicio(table.getSelectedRowModel().flatRows[0].original.nombre_estado); 
            setCaja_instalacion(table.getSelectedRowModel().flatRows[0].original.caja_instalacion);
            setSplitter_instalacion(table.getSelectedRowModel().flatRows[0].original.splitter_instalacion);
            setTipo_equipo(table.getSelectedRowModel().flatRows[0].original.tipo_equipo);
            setCondicion_equipo(table.getSelectedRowModel().flatRows[0].original.condicion_equipo);
            setCobroequipo(table.getSelectedRowModel().flatRows[0].original.cobro_equipo);
            setCobroinstalacion(table.getSelectedRowModel().flatRows[0].original.cobro_instalacion);
            setFecha_ultimo_pago(table.getSelectedRowModel().flatRows[0].original.fecha_ultimo_pago);
            setFecha_proximo_pago(table.getSelectedRowModel().flatRows[0].original.fecha_proximo_pago);
            ventanaModalfotos();
        }
    };

const compartirComoImagen = async () => {
        try {
            // 2. Acceder al contenido del modal a través de la referencia
            const modalContent = modalRef.current;
            
            if (!modalContent) return;
            
            // 3. Ocultar botones temporalmente para la captura
            const footer = modalContent.querySelector('.modal-footer');
            if (footer) footer.style.visibility = 'hidden';
            
            // 4. Capturar el contenido del modal
            const canvas = await html2canvas(modalContent.querySelector('.modal-content'), {
                scale: 1,
                logging: false,
                backgroundColor: '#ffffff',
                useCORS: true
            });
            
            // 5. Restaurar visibilidad del footer
            if (footer) footer.style.visibility = 'visible';
            
            // 6. Convertir a imagen
            const imagen = canvas.toDataURL('image/png');

        // 6. Descarga automática primero
            const link = document.createElement('a');
            link.download = 'contrato.png';
            link.href = imagen;
            link.click();
            
            // 7. Esperar 1 segundo para que complete la descarga
            setTimeout(() => {
                // Abrir WhatsApp después de la descarga
                const texto = encodeURIComponent("Detalles del contrato:");
                window.open(`https://wa.me/?text=${texto}`, '_blank');

            }, 3500);
                
        } catch (error) {
            console.error('Error al compartir:', error);
            alert('No se pudo compartir la imagen');
        }
    };

    useEffect(() =>{
        getClientes();
        getPlanes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className='App'>
            <h1 className='mb-3'>Consultas</h1>
        <div className="btn-group mb-3" role="group" aria-label="Basic outlined example">
          <button type="button" class="btn btn-outline-primary" onClick={detalleCliente}>Datos</button>
          &nbsp;&nbsp;
          <button type="button" class="btn btn-outline-primary" onClick={verFotos}>Fotos</button>
          &nbsp;&nbsp;
          <button type="button" class="btn btn-outline-primary" onClick={corregirDNIcli}>Corregir DNI</button>
          &nbsp;&nbsp;
          <button type="button" class="btn btn-outline-primary" onClick={cambiarPlan}>Cambio plan</button>
        </div>

            <div className='table-responsive'>
            <table className='table'>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                    return (
                        <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                            <>
                            <div 
                                {...{
                                    className: header.column.getCanSort()
                                        ? 'pe-auto'
                                        : '',
                                    onClick: header.column.getToggleSortingHandler(),
                                }}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                }[header.column.getIsSorted()] ?? null}
                                </div>
                                {header.column.getCanFilter() ? (
                                <div>
                                    <input
                                    type="text"
                                    value={header.column.getFilterValue() || ''}
                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                    />
                                </div>
                                ) : null}
                            </>
                        )}
                         </th>
                        )
                    })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} 
                    className={row.getIsSelected() ? 'table-primary' : null}
                    onClick={row.getToggleSelectedHandler()}>
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="h2" />
            <div className="flex items-center gap-2">
                <button
                className="border rounded p-1"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<<'}
                </button>
                <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<'}
                </button>
                <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>'}
                </button>
                <button
                className="border rounded p-1"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Página</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <div>
                    Mostrando {table.getRowModel().rows.length.toLocaleString()} de{' '}
                    {table.getRowCount().toLocaleString()} Filas
                </div>
                </div>

            <Modal isOpen={modalMostrar} toggle={ventanaModal} innerRef={modalRef} id='shareable-modal'>
                <ModalBody>
                <div className='container'>
                    <h3 className=''>Detalle del Contrato &nbsp;<button className='btn btn-success' onClick={compartirComoImagen}>
                            <i className="fab fa-whatsapp me-2"></i>
                            Enviar
                        </button></h3>
                    <div className='row mb-2'>
                        <div className='col-4'>Contrato:</div>
                        <div className='col-6'>{contrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fec.Contrato:</div>
                        <div className="col-6">{fechacontrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Servicio:</div>
                        <div className="col-6">{estado_servicio}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Sede:</div>
                        <div className="col-6">{sedecli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Nombres:</div>
                        <div className="col-6">{apellidocli+" "}{nombrecli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>DNI:</div>
                        <div className='col-6'>{dnicli}</div>
                    </div>
                    
                    
                    <div className='row mb-2'>
                        <div className='col-4'>Telefonos:</div>
                        <div className="col-6">{telefonocli} / {telefonocli2}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Direccion:</div>
                        <div className="col-6">{direccioncli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Referencia:</div>
                        <div className="col-6">{referenciacli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Dia de Pago:</div>
                        <div className="col-6">{diapago}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>CT/Spliter:</div>
                        <div className="col-6">{caja_instalacion} / {splitter_instalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Plan:</div>
                        <div className="col-6">{nombreplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>detalle Plan:</div>
                        <div className="col-6">{descplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Precio Plan:</div>
                        <div className="col-6">S/. {precioplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Descuento:</div>
                        <div className="col-6">S/. {descuento}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Precio final:</div>
                        <div className="col-6">S/. {preciofinal}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Usuario Mikrotik:</div>
                        <div className="col-6">{user_mk}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Ubicación 1:</div>
                        <div className="col-6"><Link to={geolocalizacion} target="_blank"><a>{geolocalizacion}</a></Link></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Ubicación 2:</div>
                        <div className="col-6"><Link to={"https://www.google.com/maps/search/?api=1&query=" +
                                                          latitud+","+longitud+"&zoom=20"} target="_blank"
                                                      ><a>{latitud},{longitud}</a>
                                                </Link>
                        </div>
                    </div>
                    <div className='corte'>----------------------------------------------------------------</div>
                    <div className='row mb-2'>
                        <div className='col-4'>Equipos:</div>
                        <div className="col-6">{tipo_equipo}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Condición:</div>
                        <div className="col-6">{condicion_equipo}</div>
                    </div>      
                    <div className='row mb-2'>
                        <div className='col-4'>Tecnico:</div>
                        <div className="col-6">{tecnico_instalador}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Observación tec:</div>
                        <div className="col-6">{comentario_instalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha Instalacion:</div>
                        <div className="col-6">{fechainstalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Costo por equipo:</div>
                        <div className="col-6">{cobro_equipo}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Costo por instalacion:</div>
                        <div className="col-6">{cobro_instalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>User venta:</div>
                        <div className="col-6">{user_venta}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha venta:</div>
                        <div className="col-6">{fecha_venta}</div>
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-danger' onClick={ventanaModal}>Cerrar</button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalMostrarFotos} toggle={ventanaModalfotos}>
                <ModalBody>
                <div className='container'>
                    <h3 className=''>Fotos de la Instalación</h3>
                    
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Caja antes:</div>
                        <div className="col-6"><button onClick={verimagen1}>{imgcaja_antes}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Foto potencia antes:</div>
                        <div className="col-6"><button onClick={verimagen2}>{imgpotencia_antes}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Caja después:</div>
                        <div className="col-6"><button onClick={verimagen3}>{imgcaja_despues}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Potencia después:</div>
                        <div className="col-6"><button onClick={verimagen4}>{imgpotencia_despues}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Instalación interna:</div>
                        <div className="col-6"><button onClick={verimagen5}>{imginstalacion_interna}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Potencia interna:</div>
                        <div className="col-6"><button onClick={verimagen6}>{imgpotencia_interna}</button></div>
                    </div> 
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Contrato:</div>
                        <div className="col-6"><button onClick={verimagen7}>{imgcontrato}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Foto Casa:</div>
                        <div className="col-6"><button onClick={verimagen8}>{imgcasa}</button></div>
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-danger' onClick={ventanaModalfotos}>Cerrar</button>
                </ModalFooter>
            </Modal>

       {/* MODAL PARA CORREGIR DNI */}
          <Modal isOpen={modalCorregirDNI} toggle={ventanaModalCorregirDNI}>
            <ModalBody>
              <div className="from-group">
              {
                  <h4 className="">Corregir DNI Cliente:</h4>
              } 
                <div className="mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    DNI Incorrecto: {dnicli}
                  </span>
                  <span className="input-group-text" id="basic-addon1">
                    {apellidocli} {nombrecli}
                  </span>
                </div>
    
                <div className="mb-3">
                  <label for="nombres" className="form-label">Ingrese DNI correcto:</label>
                  <input type="text" onChange={(event) => {
                    setNuevo_Dnicli(event.target.value);
                  }}
                    value={nuevo_dnicli}
                    className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
                  </input>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-success" onClick={corregirDNI}>
                Confirmar
              </button>
              <button className="btn btn-danger" onClick={cerrarModalCorregirDNI}>
                Cancelar
              </button>
            </ModalFooter>
          </Modal>

 {/* MODAL PARA CAMBIAR DE PLAN */}
          <Modal isOpen={modalCambiarPlan} toggle={ventanaModalCambiarPlan}>
            <ModalBody>
              <div className="from-group">
              {
                  <h4 className="">Cambiar de Plan:</h4>
              } 
                <div className="mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Plan anterior: {nombreplan}
                  </span>
                  <span className="input-group-text" id="basic-addon1">
                    {apellidocli} {nombrecli}
                  </span>
                </div>
                <div className="mb-3">
                  <label for="nombres" className="form-label">Ingrese nuevo Plan:</label>
                  <select
                  className="form-control" aria-describedby="basic-addon1" key={planes_idplanes} value={planes_idplanes}
                  onChange={(event) => { setPlanes_idplanes(event.target.value);}}
                >
                  {listaPlanes.map((planes) => {
                    return (
                      <>
                        <option value={planes.idplanes}>
                          {planes.nombreplan}
                        </option>
                      </>
                    );
                  })}
                </select>
                </div>
                <div className="mb-3">
              <label for="nombres" className="form-label">Descuento:</label>
              <input type="text" onChange={(event) => {
                setDescuento(event.target.value);
              }}
                value={descuento}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
              </div>
              <div className="mb-3">
              <label for="comentario" className="form-label">Comentario:</label>
              <input type="text" onChange={(event) => {
                setComentario(event.target.value);
              }}
                value={comentario}
                className="form-control" id="detalle_suspension" aria-describedby="basic-addon1">
              </input>
              </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-success" onClick={confirmarCambioPlan}>
                Confirmar
              </button>
              <button className="btn btn-danger" onClick={cerrarModalCambiarPlan}>
                Cancelar
              </button>
              {mensaje && <div className="alert alert-info">{mensaje}
                </div>}
              
            </ModalFooter>
          </Modal>
  
        </div>
    )
}
export default Consulta;