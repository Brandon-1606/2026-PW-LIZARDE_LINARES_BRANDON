const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, taller_id, nombre_alumno, boleta, fecha_registro';

//Registrar asistencia
async function registrarAsistencia({taller_id, nombre_alumno, boleta, fecha_registro}) {
    const [info] = await pool.query(`INSERT INTO asistencias (taller_id, nombre_alumno, boleta, fecha_registro) VALUES (?, ?, ?, ?)`, [taller_id, nombre_alumno, boleta, fecha_registro]);
    return info;
}

//Consultar lista de asistencia
async function consultarListaAsistencia(taller_id) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM asistencias WHERE taller_id = ? ORDER BY id`, [taller_id]);
    return filas;
}

module.exports = {registrarAsistencia, consultarListaAsistencia};