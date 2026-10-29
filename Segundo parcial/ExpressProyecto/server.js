const express = require('express');
const db = require('./db-local.js');
const { validarBoleta, validarCorreo, validarRol } = require('./validaciones');

const app = express();

app.use(express.json());

const PORT = 4000;

//Tenemos la ruta principal por medio del metodo get
app.get('/', (req, res) => {
    res.json({mensaje: 'Hola, esto es un aprueba en GET'});
});

//Rutas por medio del netodo POST, como un endponit propio
app.post('/eco', (req, res) => {
    const {texto} = req.body;
    if(!texto){
        return res.status(400).json({error: 'El texto es obligatorio'});
    }
    res.status(201).json({eco: texto});
});

// GET /api/talleres (3.1)
app.get('/api/talleres', async (req, res) => {
  const [rows] = await db.query('SELECT id, nombre, instructor, fecha, cupo FROM talleres');
  res.json(rows);
});

// GET /api/talleres/:id (3.2 y 3.3)
app.get('/api/talleres/:id', async (req, res) => {
  const [rows] = await db.query(
    'SELECT t.*, COUNT(a.id) as asistentes FROM talleres t LEFT JOIN asistencias a ON t.id = a.taller_id WHERE t.id = ? GROUP BY t.id', 
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Taller no encontrado" });
  res.json(rows[0]);
});

// POST /api/talleres (3.4 y 3.5)
app.post('/api/talleres', async (req, res) => {
  const { nombre, instructor, fecha, cupo } = req.body;
  if (!nombre || !fecha) return res.status(400).json({ error: "nombre y fecha son obligatorios" });
  
  const id = require('crypto').randomUUID();
  await db.query('INSERT INTO talleres (id, nombre, instructor, fecha, cupo) VALUES (?, ?, ?, ?, ?)', [id, nombre, instructor || 'Sin asignar', fecha, cupo || 10]);
  res.status(201).json({ id, nombre, instructor, fecha, cupo });
});

// Paso 4.1, 4.3 y 4.4: Registrar asistencia
app.post('/api/asistencias', async (req, res) => {
  try {
    const { taller_id, nombre_alumno, boleta } = req.body;

    // Validación de datos obligatorios (4.3)
    if (!taller_id || !nombre_alumno || !boleta) {
      return res.status(400).json({ error: "taller_id, nombre_alumno y boleta son obligatorios" });
    }
    if (!validarBoleta(boleta)) {
      return res.status(400).json({ error: "La boleta debe tener exactamente 10 dígitos" });
    }

    const id = require('crypto').randomUUID();
    await db.query(
      'INSERT INTO asistencias (id, taller_id, nombre_alumno, boleta, fecha_registro) VALUES (?, ?, ?, ?, NOW())',
      [id, taller_id, nombre_alumno.trim(), boleta.trim()]
    );

    const [nueva] = await db.query('SELECT * FROM asistencias WHERE id = ?', [id]);
    res.status(201).json(nueva[0]);
  } catch (error) {
    // Si la llave foránea falla porque el taller no existe (4.4), MySQL arroja error y responde 500
    res.status(500).json({ error: error.message });
  }
});

// Paso 4.2: Ver asistencias de un taller
app.get('/api/talleres/:id/asistencias', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM asistencias WHERE taller_id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, correo, boleta, rol FROM usuarios');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, correo, contrasena, boleta } = req.body;

    // Validaciones del Paso 5.5
    if (!nombre || !correo || !contrasena || !boleta) {
      return res.status(400).json({ error: "nombre, correo, contrasena y boleta son obligatorios" });
    }
    if (!validarCorreo(correo)) {
      return res.status(400).json({ error: "El correo no tiene un formato válido" });
    }
    if (!validarBoleta(boleta)) {
      return res.status(400).json({ error: "La boleta debe tener exactamente 10 dígitos" });
    }
    if (contrasena.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(contrasena, 10);

    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena_hash, boleta, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre.trim(), correo.trim().toLowerCase(), hash, boleta.trim(), 'alumno']
    );

    // Responde 201 Created sin devolver la contraseña (Paso 5.2)
    res.status(201).json({
      id: result.insertId,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      boleta: boleta.trim(),
      rol: 'alumno'
    });
  } catch (error) {
    // Si ya existe el correo o la boleta responde 409 Conflict (Paso 5.4)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Ya existe un usuario con ese correo o boleta" });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, nombre, correo, boleta, rol FROM usuarios WHERE id = ?', 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    if (!nombre && !correo && !rol) {
      return res.status(400).json({ error: "Envía al menos uno de: nombre, correo, rol" });
    }
    if (correo !== undefined && !validarCorreo(correo)) {
      return res.status(400).json({ error: "El correo no tiene un formato válido" });
    }
    if (rol !== undefined && !validarRol(rol)) {
      return res.status(400).json({ error: "El rol debe ser alumno o admin" });
    }

    const [userExists] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (userExists.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const current = userExists[0];
    const newNombre = nombre !== undefined ? nombre : current.nombre;
    const newCorreo = correo !== undefined ? correo.trim().toLowerCase() : current.correo;
    const newRol = rol !== undefined ? rol.trim().toLowerCase() : current.rol;

    await db.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
      [newNombre, newCorreo, newRol, id]
    );

    res.status(200).json({
      id: current.id,
      nombre: newNombre,
      correo: newCorreo,
      boleta: current.boleta,
      rol: newRol
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Ya existe un usuario con ese correo" });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Respuesta 204 No Content (eliminación exitosa)
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`El servidor escuchando en el puerto: ${PORT}`);
})
