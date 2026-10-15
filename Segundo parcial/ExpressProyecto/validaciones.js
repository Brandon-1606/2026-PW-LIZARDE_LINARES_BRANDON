//Vamos a tener funciones que se encargan de validar correo, boleta y contraseña 

//Aqui va funcion de correo
function validarCorreo(correo){

}
//Aqui va funcion de boleta
function validarBoleta(boleta){
    
}


function validarContrasena(contrasena){
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = {validarCorreo, validarBoleta, validarContrasena};