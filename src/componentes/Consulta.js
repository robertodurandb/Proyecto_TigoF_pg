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

    //Datos para el Modal
    const [num_contrato, setNum_contrato] = useState();
    const [contrato, setContrato] = useState();
    const [dnicli, setDnicli] = useState();
    const [nombrecli, setNombrecli] = useState();
    const [apellidocli, setApellidocli] = useState();
    const [direccioncli, setDireccioncli] = useState();
    const [distritocli, setDistritocli] = useState();
    const [referenciacli, setReferenciacli] = useState();
    const [telefonocli, setTelefonocli] = useState();
    const [telefonocli2, setTelefonocli2] = useState();
    const [nombreplan, setNombreplan] = useState();
    const [precioplan, setPrecioplan] = useState();
    const [descplan, setDescplan] = useState();
    const [sedecli, setSedecli] = useState();
    const [user_mk, setUser_mk] = useState();
    
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
    const [estados, setEstados] = useState([]);
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
    const modalRef = useRef(null); // 1. Definir correctamente la referencia

    let ipbackend = `${API.URL}`
    let token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("currentUser");

    const ventanaModal = () => setModalMostrar(!modalMostrar);
    const ventanaModalfotos = () => setModalMostrarFotos(!modalMostrarFotos);

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
      function getEstados(){
        fetch(ipbackend+'getestados', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
            .then(response => response.json())
            .then(data => setEstados(data))
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
            header: 'Sede',
            accessorKey: 'nombre_sede',
          },
          {
            header: 'Dia pago',
            accessorKey: 'dia_pago',
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
            header: 'Distrito',
            accessorKey: 'distritocli',
          },
          {
            header: 'Dirección',
            accessorKey: 'direccioncli',
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

    const mostrarCliente=()=>{
        ventanaModal();
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
            setDistritocli(table.getSelectedRowModel().flatRows[0].original.distritocli);
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
            setEstado_servicio(table.getSelectedRowModel().flatRows[0].original.nombre_estado); 
            setCaja_instalacion(table.getSelectedRowModel().flatRows[0].original.caja_instalacion);
            setSplitter_instalacion(table.getSelectedRowModel().flatRows[0].original.splitter_instalacion);
            setTipo_equipo(table.getSelectedRowModel().flatRows[0].original.tipo_equipo);
            setCondicion_equipo(table.getSelectedRowModel().flatRows[0].original.condicion_equipo);
            setCobroequipo(table.getSelectedRowModel().flatRows[0].original.cobro_equipo);
            setCobroinstalacion(table.getSelectedRowModel().flatRows[0].original.cobro_instalacion);
            setFecha_ultimo_pago(table.getSelectedRowModel().flatRows[0].original.fecha_ultimo_pago);
            setFecha_proximo_pago(table.getSelectedRowModel().flatRows[0].original.fecha_proximo_pago);
            mostrarCliente();
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
            setDistritocli(table.getSelectedRowModel().flatRows[0].original.distritocli);
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
        getClientes()
        getEstados()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className='App'>
            <h1 className='mb-3'>Consulta de Clientes y Contratos</h1>
        <div className="btn-group mb-3" role="group" aria-label="Basic outlined example">
          <button type="button" class="btn btn-outline-primary" onClick={detalleCliente}>Ver datos cliente</button>
          &nbsp;&nbsp;
          <button type="button" class="btn btn-outline-primary" onClick={verFotos}>Ver fotos</button>
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
                        <div className='col-4'>Distrito:</div>
                        <div className="col-6">{distritocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Referencia:</div>
                        <div className="col-6">{referenciacli}</div>
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
                        <div className="col-6">S/. {precioplan}.00</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Dia de Pago:</div>
                        <div className="col-6">{diapago}</div>
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

           
        </div>
    )
}
export default Consulta;