const bcrypt = require('bcrypt');

const asistenciasModel = require('../Modelo/asistencias');

//Vamos a hacer una funcion asincrona por cada funcion del modelo
async function registrarAsistencia(req, res){
    const {taller_id, nombre_alumno, boleta, fecha_registro} = req.body;
    try{
        const asistencia = await asistenciasModel.registrarAsistencia({taller_id, nombre_alumno, boleta, fecha_registro});
        res.status(201).json(asistencia);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

async function consultarListaAsistencia(req, res){
    const {taller_id} = req.params;
    try{
        const asistencias = await asistenciasModel.consultarListaAsistencia(taller_id);
        res.json(asistencias);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {registrarAsistencia, consultarListaAsistencia};
