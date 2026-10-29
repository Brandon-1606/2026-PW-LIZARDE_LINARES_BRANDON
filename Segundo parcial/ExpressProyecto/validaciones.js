const ROLES_VALIDOS = ['alumno', 'admin'];

function validarCorreo(correo) {
    if (typeof correo !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo.trim());
}

function validarBoleta(boleta) {
    return typeof boleta === 'string' && /^\d{10}$/.test(boleta.trim());
}

function validarRol(rol) {
    return typeof rol === 'string' && ROLES_VALIDOS.includes(rol.trim().toLowerCase());
}

function validarContrasena(contrasena) {
    if (typeof contrasena !== 'string') return false;
    return contrasena.trim().length >= 8;
}

module.exports = {validarCorreo, validarBoleta, validarContrasena, validarRol};