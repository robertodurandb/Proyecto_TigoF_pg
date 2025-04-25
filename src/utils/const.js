//FUNCION PARA OBTENER FECHA ACTUAL
let fecha = new Date();
let dia = fecha.getDate("dd");
let mes = (fecha.getMonth("mm"))+1;
let anioactual = fecha.getFullYear();
let texdia = "";
let texmes = "";
if (dia < 10) {
  texdia = "-0"
}else{
  texdia = "-"
}
if (mes < 10) {
  texmes = "-0"
}else{
  texmes = "-"
}

let API = {
     URL: "https://proyectotigobpg-production.up.railway.app/api/v1/clientes/",
    // URL: "http://192.168.18.27:9100/api/v1/clientes/",
    // URL: "http://192.168.18.8:9100/api/v1/clientes/",
    // URL:"http://localhost:9100/api/v1/clientes/",
    // URL:"https://api.tigo.com.pe/api/v1/clientes/",
    //************************************ */
    DATENOW: anioactual + texmes + mes + texdia + dia,
    ANIO: anioactual,
    MES: mes,
}

export default API