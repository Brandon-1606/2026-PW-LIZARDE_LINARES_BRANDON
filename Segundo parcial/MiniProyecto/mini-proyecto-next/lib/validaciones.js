// Validación auxiliar: comprueba que la boleta contenga exactamente 10 dígitos numéricos
export function validarBoleta(boleta) {
  if (!boleta) return false;
  const b = boleta.trim();
  return /^\d{10}$/.test(b);
}