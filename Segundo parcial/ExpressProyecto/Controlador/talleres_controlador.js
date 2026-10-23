const bcrypt = require('bcrypt');

const talleresModel = require('../Modelo/talleres');

//Vamos a hacer una funcion asincrona por cada funcion del modelo
async function consultarTaller(req, res){
    try{
        const talleres = await talleresModel.consultarTaller();
        res.json(talleres);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

async function registrarTaller(req, res){
    const {nombre, instructor, fechas, cupo} = req.body;
    try{
        const taller = await talleresModel.registrarTaller({nombre, instructor, fechas, cupo});
        res.status(201).json(taller);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {consultarTaller, registrarTaller};