export function validarBoleta(boleta) {
  return typeof boleta === 'string' && /^\d{10}$/.test(boleta.trim());
}

export function validarCorreo(correo) {
  if (typeof correo !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function validarRol(rol) {
  return typeof rol === 'string' && ['alumno', 'admin'].includes(rol.trim().toLowerCase());
}