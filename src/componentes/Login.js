import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilos/style.css'
import Tigo from '../imagenes/tigo1.png'
import API from '../utils/const'

function Login(props){

const [username, setUsername] = React.useState("")
const [password, setPassword] = React.useState("")
const [error, setError] = React.useState("")
const [isLoading, setIsLoading] = React.useState(false);

const {loginCallback} = props
let ipbackend = `${API.URL}`;

 // Validaciones del formulario antes de enviar
 const validateForm = () => {
    if (!username.trim()) {
      setError('Usuario es requerido');
      return false;
    }
    if (!password.trim()) {
      setError('Contraseña es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault(); // Para manejar tanto el click como el Enter
    
    if (!validateForm()) {
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
        const response = await fetch(`${ipbackend}dologin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_user: username.toLowerCase(), // Coincide con el backend
            password_user: password
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // Usamos el mensaje del backend si está disponible
          const errorMessage = data.message || 
            (response.status === 401 ? 'Credenciales inválidas' : 
             response.status === 404 ? 'Usuario no encontrado o inactivo' : 
             'Error en el servidor');
          throw new Error(errorMessage);
        }
  
        // Guardamos los datos de sesión
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("currentUser", data.user.username);
        sessionStorage.setItem("role", data.user.role);
        
        // Llamamos al callback de login exitoso
        loginCallback();
        
      } catch (err) {
        setError(err.message || 'Error al conectar con el servidor');
        setTimeout(() => setError(''), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    // function doLogin() {
    //     fetch(ipbackend+'dologin', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             id_user: username,
    //             password_user: password
    //         })
    //     }).then ((response) => {
    //         console.log(response.status)
    //         if (response.status == 401){
    //            setError("Password Inválido")
    //            setTimeout(() => {
    //             setError("");
    //           }, "3000");
    //             console.log("ERROR DE PASSWORD")  
    //         }else if(response.status == 404){
    //             setError("Usuario no existe")
    //             setTimeout(() => {
    //                 setError("");
    //               }, "3000");
    //             console.log("USUARIO NO EXISTE") 
    //         }else{
    //             return response.json()
    //             .then((data) =>{
    //                 sessionStorage.setItem("token", data.token)
    //                 sessionStorage.setItem("currentUser", data.user.username)
    //                 sessionStorage.setItem("role", data.user.role)
    //                 loginCallback()
    //             })    
    //         }    
    //     })   
    // }
    
function handleUsernameChanged (event) {
    setUsername(event.target.value)
    if (error) setError(""); // Limpia el error al editar
};
function handlePasswordChanged (event) {
    setPassword(event.target.value)
    if (error) setError(""); // Limpia el error al editar
};
const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

    return(
        <div className='container'>
            <div className='container-fluid login border border-secondary border-2 rounded p-3 m'>
                <div>
                    <img src={Tigo} alt='Tigo' className='img-fluid'/>
                </div>
                <div className='text-center pb-2'>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={() => setError('')}
                        ></button>
                    </div>
                )}

<form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <input 
              placeholder='Username' 
              className="form-control" 
              value={username} 
              onChange={handleUsernameChanged}
              disabled={isLoading}
            />
          </div>
          
          <div className='mb-3'>
            <input 
              placeholder='Password' 
              type='password' 
              className="form-control" 
              value={password} 
              onChange={handlePasswordChanged}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          
          <div className='text-center'>
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cargando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

                {/* <div className='text-center mb-3'>
                    <input placeholder='Username' className="form-control" id="exampleInputPassword1" value={username} onChange={handleUsernameChanged}/>
                    <input placeholder='Password' type='password' className="form-control" id="exampleInputPassword2" value={password} onChange={handlePasswordChanged}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            console.log("Enter presed")
                            doLogin();
                        }
                    }}
                    />
                        <div>{error}</div>
                </div>
                <div className='text-center'>
                    <button type="button" className="btn btn-primary" onClick={doLogin}>Iniciar Sesion</button>
                </div> */}
                
           
            </div>
            
        </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
}
export default Login;