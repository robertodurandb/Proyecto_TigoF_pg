import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import consultas from '../imagenes/busqueda.png';
import pagos from '../imagenes/pagos.png'
import clientes from '../imagenes/contrato.png';

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
                        <div className='acceso'>
                        <Link to='../src/componentes/Principal'>
                        <img src={consultas} alt='Consultas' className='img-fluid'/>
                        <h3>Consultas</h3>
                        </Link>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6'>
                        <div className='acceso'>
                        <Link to='../src/componentes/Clientes'>
                        <img src={clientes} alt='Clientes' className='img-fluid'/>
                        <h3>Clientes</h3>
                        </Link>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6'>
                        <div>
                        <Link to='../src/componentes/Consultapagos'>
                        <img src={pagos} alt='Pagos' className='img-fluid'/>
                        <h3>Pagos</h3>
                        </Link>
                        </div>
                    </div>
                    </div>
                )
                :
                (
                    <div className='row'>
                    <div className='col-md-3 col-sm-6'>
                    <div className='acceso'>
                    <Link to='../src/componentes/Principal'>
                    <img src={consultas} alt='Consultas' className='img-fluid'/>
                    <h3>Consultas</h3>
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