import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import imgconsultas from '../imagenes/busqueda.png';
import imgpagos from '../imagenes/pagos.png'
import imgclientes from '../imagenes/contrato.png';
import Consultas from '../componentes/Principal';

function Inicio() {
    const [isAdmin, setIsAdmin] = useState(false);

    function checkAdmin() {
        let role = sessionStorage.getItem('role')

        if (role == "Admin"){
        setIsAdmin(true)
        }else{
        setIsAdmin(false)
        }
    }
        useEffect(() => {
            checkAdmin()
          }, [])
    
    return(
        <div> 
            { isAdmin?
                (
                    <div className='row'>
                    <div className='col-md-3 col-sm-6'>
                        <div className='border border-secondary'>
                        <Link to='http://localhost:3000/consultaclientes'>
                        <img src={imgconsultas} alt='Consultas' className='img-fluid'/>
                        <h3 className='text-center'>Consultas</h3>
                        </Link>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6'>
                        <div className='border border-secondary'>
                        <Link to='../src/componentes/Clientes'>
                        <img src={imgclientes} alt='Clientes' className='img-fluid'/>
                        <h3 className='text-center'>Clientes</h3>
                        </Link>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6'>
                        <div className='border border-secondary'>
                        <Link to='../src/componentes/Consultapagos'>
                        <img src={imgpagos} alt='Pagos' className='img-fluid'/>
                        <h3 className='text-center'>Pagos</h3>
                        </Link>
                        </div>
                    </div>
                    </div>
                )
                :
                (
                    <div className='row'>
                    <div className='col-md-3 col-sm-6'>
                    <div className='border border-secondary'>
                    <Link to='../src/componentes/Principal'>
                    <img src={Consultas} alt='Consultas' className='img-fluid'/>
                    <h3 className='text-center'>Consultas</h3>
                    </Link>
                    </div>
                    </div>
                    </div>
                )
            }             
            </div>    
    );
}
export default Inicio;