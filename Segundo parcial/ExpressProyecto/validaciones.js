//Vamos a tener funciones que se encargan de validar correo, boleta y contraseña 

//Aqui va funcion de correo
function validarCorreo(correo){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}
//Aqui va funcion de boleta
function validarBoleta(boleta){
    const regex = /^\d{8}$/;
    return regex.test(boleta);
}


function validarContrasena(contrasena){
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = {validarCorreo, validarBoleta, validarContrasena};