// Las peticiones pasan por la API de Next, que las reenvía al backend en el puerto 3001.
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BACKEND_CAIDO = 'El backend no responde: arráncalo con npm start en backend-memoria (puerto 3001).';

// PASO 1 de la guía: escribe esta función.
// pedirJSON('/talleres') debe hacer fetch a `${API_URL}/api/talleres`, regresar el JSON de la respuesta
// y, si algo sale mal, lanzar un Error con un mensaje que se pueda mostrar en pantalla.
export async function pedirJSON(ruta, opciones = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}/api${ruta}`, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...opciones.headers },
    });
  } catch {
    throw new Error(BACKEND_CAIDO);
  }

  let datos = null;
  try {
    datos = await res.json();
  } catch {
    datos = null;
  }

  if (!res.ok) {
    if (datos && datos.error) throw new Error(datos.error);
    throw new Error(res.status === 500 ? BACKEND_CAIDO : `El backend respondió ${res.status}`);
  }

  return datos;
}