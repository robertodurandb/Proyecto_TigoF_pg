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
    //URL:"https://michel.zapto.org:9100/"
    //URL:"http://192.168.18.8:9100/",
    URL:"http://10.0.28.60:9100/",
    //************************************ */
    DATENOW: anioactual + texmes + mes + texdia + dia,
    ANIO: anioactual,
    MES: mes
}

export default API