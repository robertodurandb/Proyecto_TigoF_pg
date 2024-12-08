import React, { useEffect, useState } from 'react'
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import API from '../utils/const';
import {
    Column,
    ColumnDef,
    PaginationState,
    Table,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getToggleSelectedHandler,
    onRowSelectionChange,
  } from '@tanstack/react-table'

function Consulta() {

    const [listaClientes, setListaClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

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
            header: 'Contrato',
            accessorKey: 'num_contrato',
          },
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
            header: 'Distrito',
            accessorKey: 'distritocli',
          },
          {
            header: 'Dirección',
            accessorKey: 'direccioncli',
          },
          {
            header: 'Técnico',
            accessorKey: 'user_create',
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
            // debugTable: true,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            state: {
                sorting,
                globalFilter: filtering,
                rowSelection: rowSelection,
            },
            onSortingChange: setSorting,
            onGlobalFilterChange: setFiltering,
            onRowSelectionChange: setRowSelection,
            enableMultiRowSelection: false,
            enableRowSelection: true,
          });

    const verimagen=()=>{
        window.open(ipbackend+imagencasa,"_blank");
    }
   
    const mostrarCliente=()=>{
        ventanaModal();
    }

    const capturarID = (cliente) => {
        setNum_contrato(cliente.num_contrato);
        setDnicli(cliente.dnicliente);
        setNombrecli(cliente.nombrecli);
        setApellidocli(cliente.apellidocli);
        setDiapago(cliente.diapago);
        setDireccioncli(cliente.direccioncli);
        setDistritocli(cliente.distritocli);
        setNombreplan(cliente.nombreplan);
        setFechacontrato(cliente.fecha_contrato);
        setTelefonocli(cliente.telefonocli);
        setFecha_nacimiento(cliente.fecha_nacimiento);
        setVelocidadplan(cliente.velocidadplan);
        setPrecioplan(cliente.precioplan);
        setUser_create(cliente.user_create);
        setGeolocalizacion(cliente.geolocalizacion);
        setEstado_servicio(cliente.nombre_estado);
        setFechainstalacion(cliente.fechainstalacion);
        setImagencasa(cliente.nombreimg);
        setObservacion_instalacion(cliente.observacion_instalacion);
        setCaja_instalacion(cliente.caja_instalacion);

        mostrarCliente();
    }
     
    //Funcion de Busqueda 2
    // const searcher2 = (e) =>{
    //     setBusqueda(e.target.value);
    //     }
    //Funcion de Filtrado
    //  const newfilter = listaClientes.filter(dato => {
    //     return (
    // dato.dnicliente.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    // dato.apellidocli.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
    // dato.direccioncli.toLowerCase().includes(busqueda.toLocaleLowerCase())
    // )
    // });

    // let results = [];
    
    // if (busqueda === "") {
    //     results = listaClientes;
    // } else {
    //     results = newfilter;
    // }

    useEffect(() =>{
        getClientes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div>
            <h1 className='mb-3'>Consulta de Clientes y Contratos</h1>
            <h2>--------------------</h2>
            <input value={filtering} type='text' placeholder='Búsqueda de registros' className='form-control border border-success'
            onChange={(e) => setFiltering(e.target.value)}
            />
            <div className='table-responsive'>
            <table className='table'>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                        >
                        {header.isPlaceholder ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                            {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} 
                    className={row.getIsSelected() ? 'selected' : null}
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
                <div>
                    <label>Row Selection State:</label>
                    <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
                    {console.log(rowSelection)}
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