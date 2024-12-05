import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilos/style.css'
import Tigo from '../imagenes/tigo1.png'
import API from '../utils/const'

function Login(props){

const [username, setUsername] = React.useState("")
const [password, setPassword] = React.useState("")
const [hashError, setHashError] = React.useState("")

const {loginCallback} = props
let ipbackend = `${API.URL}`;

    function doLogin() {
        fetch(ipbackend+'dologin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_user: username,
                password_user: password
            })
        }).then ((response) => {
            console.log(response.status)
            if (response.status == 401){
               setHashError("Password Inválido")
               setTimeout(() => {
                setHashError("");
              }, "3000");
                console.log("ERROR DE PASSWORD")  
            }else if(response.status == 404){
                setHashError("Usuario no existe")
                setTimeout(() => {
                    setHashError("");
                  }, "3000");
                console.log("USUARIO NO EXISTE") 
            }else{
                return response.json()
                .then((data) =>{
                    sessionStorage.setItem("token", data.token)
                    sessionStorage.setItem("currentUser", data.username)
                    sessionStorage.setItem("role", data.role)
                    loginCallback()
                })    
            }    
        })   
    }
    
function handleUsernameChanged (event) {
    setUsername(event.target.value)
}
function handlePasswordChanged (event) {
    setPassword(event.target.value)
}

    return(
        <div className='container'>
            <div className='container-fluid login border border-secondary border-2 rounded p-3 m'>
                <div>
                    <img src={Tigo} alt='Tigo' className='img-fluid'/>
                </div>
                <div className='text-center pb-2'>
                </div>
                <div className='text-center mb-3'>
                    <input placeholder='Username' className="form-control" id="exampleInputPassword1" value={username} onChange={handleUsernameChanged}/>
                    <input placeholder='Password' type='password' className="form-control" id="exampleInputPassword2" value={password} onChange={handlePasswordChanged}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            console.log("Enter presed")
                            doLogin();
                        }
                    }}
                    />
                        <div>{hashError}</div>
                </div>
                <div className='text-center'>
                    <button type="button" className="btn btn-primary" onClick={doLogin}>Iniciar Sesion</button>
                </div>
                
           
            </div>
            
        </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
}
export default Login;