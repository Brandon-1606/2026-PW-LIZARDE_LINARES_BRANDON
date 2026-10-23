const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, instructor, fechas, cupo';

//Consultar por taller
async function consultarTaller(){
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM talleres ORDER BY id`);
    return filas;
}


//Registrarse en un taller
async function registrarTaller(){
    const [filas] = await pool.query(`INSERT INTO talleres (nombre, instructor, fechas, cupo) VALUES (?, ?, ?, ?)`, [nombre, instructor, fechas, cupo]);
    return filas;
}

module.exports = {consultarTaller, registrarTaller};