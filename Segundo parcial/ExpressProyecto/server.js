const express = require('express')

const app = express();

app.use(express.json());

const PORT = 4000;

//Tenemos la ruta principal por medio del metodo get
app.get('/saludo', (req, res) => {
    res.json({mensaje: 'Hola, esto es un aprueba en GET'});
});

//Rutas por medio del netodo POST, como un endponit propio
app.post('/eco', (req, res) => {
    const {texto} = req.body;
    if(texto){
        return res.status(400).json({error: 'El texto es obligatorio'});
    }
    res.status(201).json({eco: texto});
});

app.listen(PORT, () => {
    console.log(`El servidor escuchando en el puerto: ${PORT}`);
})

