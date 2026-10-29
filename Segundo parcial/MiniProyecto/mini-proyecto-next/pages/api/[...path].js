const BACKEND_URL = 'http://localhost:3001';

export default async function handler(req, res) {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const path = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const backendUrl = new URL(
    `/api/${path.map(encodeURIComponent).join('/')}`,
    BACKEND_URL
  );
  backendUrl.search = new URL(req.url, 'http://localhost').search;

  const headers = { Accept: 'application/json' };
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }

  const options = { method: req.method, headers };
  if (req.method !== 'GET' && req.method !== 'DELETE' && req.body !== undefined) {
    options.body = JSON.stringify(req.body);
  }

  try {
    const backendResponse = await fetch(backendUrl, options);
    res.status(backendResponse.status);

    const contentType = backendResponse.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);

    if (backendResponse.status === 204) return res.end();
    return res.send(await backendResponse.text());
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo conectar con el backend en el puerto 3001.',
      detalle: error.message,
    });
  }
}
