import React, { useEffect, useState } from 'react'
import Axios from "axios";
//import '../estilos/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
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
    const [dnicli, setDnicli] = useState();
    const [nombrecli, setNombrecli] = useState();
    const [apellidocli, setApellidocli] = useState();
    const [direccioncli, setDireccioncli] = useState();
    const [distritocli, setDistritocli] = useState();
    const [telefonocli, setTelefonocli] = useState();
    const [fecha_nacimiento, setFecha_nacimiento] = useState();
    const [nombreplan, setNombreplan] = useState();
    const [fechacontrato, setFechacontrato] = useState();
    const [precioplan, setPrecioplan] = useState();
    const [velocidadplan, setVelocidadplan] = useState();
    const [diapago, setDiapago] = useState();
    //TABLA INSTALACION
    const [user_create, setUser_create] = useState();
    const [geolocalizacion, setGeolocalizacion] = useState();
    const [estado_servicio, setEstado_servicio] = useState();
    const [fechainstalacion, setFechainstalacion] = useState();
    const [imagencasa, setImagencasa] = useState();
    const [observacion_instalacion, setObservacion_instalacion] = useState();
    const [caja_instalacion, setCaja_instalacion] = useState();

    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const [rowSelection, setRowSelection] = useState({})
    const [filaselect, setFilaselect] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
      })
      const [columnFilters, setColumnFilters] = React.useState([])

    const [modalMostrar, setModalMostrar] = useState(false);

    let ipbackend = `${API.URL}`
    let token = sessionStorage.getItem("token");

    const ventanaModal = () => setModalMostrar(!modalMostrar);

    const getClientes = async () => {
        try {
          const response = await Axios.get(ipbackend+'todoinstacli', {
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

      const columns = [
          {
            header: 'DNI',
            accessorKey: 'dnicliente',
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
            header: 'Provincia',
            accessorKey: 'provinciacli',
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
            header: 'Servicio',
            accessorKey: 'nombre_estado',
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

    const verimagen=()=>{
        window.open(ipbackend+imagencasa,"_blank");
    }
   
    const mostrarCliente=()=>{
        ventanaModal();
    }

    const detalleCliente = () => {
        if (table.getSelectedRowModel().flatRows[0]==undefined) {
            alert("Debe seleccionar un registro")
        }else{
            setNum_contrato(table.getSelectedRowModel().flatRows[0].original.num_contrato);
            setDnicli(table.getSelectedRowModel().flatRows[0].original.dnicliente);
            setNombrecli(table.getSelectedRowModel().flatRows[0].original.nombrecli);
            setApellidocli(table.getSelectedRowModel().flatRows[0].original.apellidocli);
            setDiapago(table.getSelectedRowModel().flatRows[0].original.diapago);
            setDireccioncli(table.getSelectedRowModel().flatRows[0].original.direccioncli);
            setDistritocli(table.getSelectedRowModel().flatRows[0].original.distritocli);
            setNombreplan(table.getSelectedRowModel().flatRows[0].original.nombreplan);
            setFechacontrato(table.getSelectedRowModel().flatRows[0].original.fecha_contrato);
            setTelefonocli(table.getSelectedRowModel().flatRows[0].original.telefonocli);
            setFecha_nacimiento(table.getSelectedRowModel().flatRows[0].original.fecha_nacimiento);
            setVelocidadplan(table.getSelectedRowModel().flatRows[0].original.velocidadplan);
            setPrecioplan(table.getSelectedRowModel().flatRows[0].original.precioplan);
            setUser_create(table.getSelectedRowModel().flatRows[0].original.user_create);
            setGeolocalizacion(table.getSelectedRowModel().flatRows[0].original.geolocalizacion);
            setEstado_servicio(table.getSelectedRowModel().flatRows[0].original.nombre_estado);
            setFechainstalacion(table.getSelectedRowModel().flatRows[0].original.fechainstalacion);
            setImagencasa(table.getSelectedRowModel().flatRows[0].original.nombreimg);
            setObservacion_instalacion(table.getSelectedRowModel().flatRows[0].original.observacion_instalacion);
            setCaja_instalacion(table.getSelectedRowModel().flatRows[0].original.caja_instalacion);

            mostrarCliente();
        }
    }

    useEffect(() =>{
        getClientes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div>
            <h1 className='mb-3'>Consulta de Clientes y Contratos</h1>
            <button type="button" className="btn btn-outline-success mb-3" onClick={detalleCliente}>Detalle Cliente Seleccionado</button>
            {/* <input value={filtering} type='text' placeholder='Búsqueda de registros' className='form-control border border-success'
            onChange={(e) => setFiltering(e.target.value)}
            /> */}
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
                {/* <select type='text' value={busqueda} onChange={seleccionestado} className='form-select form-select-lg mt-3'>
                    <option value="Activo">Activos</option>
                    <option value="Suspendido">Suspendidos</option>
                </select> */}
                {/* <button onClick={Agrupardata}>Procesar</button> */}
            {/* <input value={busqueda} onChange={searcher2} type='text' placeholder='Busqueda por: DNI/Apellidos/Dirección' className='form-control border border-success'/> */}
              {/* <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Cont</th>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Distrito</th>
                            <th>Direccion</th>
                            <th>Tecnico</th>
                            <th>Servicio</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {listaClientes.map((cliente, key)=>(
                            <tr key={cliente.num_contrato} value={num_contrato} >
                                <td>{cliente.num_contrato}</td>
                                <td>{cliente.dnicliente}</td>
                                <td>{cliente.apellidocli}</td>
                                <td>{cliente.nombrecli}</td>
                                <td>{cliente.distritocli}</td>
                                <td>{cliente.direccioncli}</td>
                                <td>{cliente.user_create}</td>
                                <td>{cliente.nombre_estado}</td>
                                <td><button type="button" className="btn btn-outline-success" 
                                onClick={()=>{capturarID(cliente);
                                }}>Detalles</button></td>
                            </tr>
                    ))}
                    </tbody>
            </table> */}

            <Modal isOpen={modalMostrar} toggle={ventanaModal}>
                <ModalBody>
                <div className='container'>
                    <h3 className=''>Detalle del Contrato</h3>
                    <div className='row mb-2'>
                        <div className='col-4'>Num_Contrato:</div>
                        <div className='col-6'>{num_contrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>DNI Cliente:</div>
                        <div className='col-6'>{dnicli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Nombres:</div>
                        <div className="col-6">{apellidocli+" "}{nombrecli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha nacimiento:</div>
                        <div className="col-6">{fecha_nacimiento}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Telefono Cliente:</div>
                        <div className="col-6">{telefonocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Direccion Cliente:</div>
                        <div className="col-6">{direccioncli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Distrito:</div>
                        <div className="col-6">{distritocli}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Plan:</div>
                        <div className="col-6">{nombreplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha Contrato:</div>
                        <div className="col-6">{fechacontrato}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Dia Pago:</div>
                        <div className="col-6">{diapago}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Precio Plan:</div>
                        <div className="col-6">{precioplan}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Velocidad Plan:</div>
                        <div className="col-6">{velocidadplan}</div>
                    </div>
                    <div className='corte'>----------------------------------------------------------------</div>
                    <div className='row mb-2'>
                        <div className='col-4'>Fecha Instalacion:</div>
                        <div className="col-6">{fechainstalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Inicio Servicio:</div>
                        <div className="col-6">{fechainstalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Estado Servicio:</div>
                        <div className="col-6">{estado_servicio}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Tecnico instalacion:</div>
                        <div className="col-6">{user_create}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Caja/Spliter:</div>
                        <div className="col-6">{caja_instalacion}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Ubicación Casa:</div>
                        <div className="col-6"><Link to={"https://www.google.com/maps/search/?api=1&query="+geolocalizacion+"&zoom=20"} target="_blank"><a>{geolocalizacion}</a></Link></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Imagen de la casa:</div>
                        <div className="col-6"><button onClick={verimagen}>{imagencasa}</button></div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-4'>Observación del técnico:</div>
                        <div className="col-6">{observacion_instalacion}</div>
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-danger' onClick={ventanaModal}>Cerrar</button>
                </ModalFooter>
            </Modal>


        </div>
    )
}
export default Consulta;