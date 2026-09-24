

const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

//Crear funcion que se encargue de pintar la tabla 

function pintarTabla(){
    //Debe de obtener la tabla y rellenarla con los datos de talleres
    const tbody = document.querySelector('#tabla-talleres tbody');
    const filasHTML = talleres.map((t) => {
        return `
        <tr>
            <td>${t.nombre}</td>
            <td>${t.instructor}</td>
            <td>${t.inscritos}</td>
            <td>${t.cupo}</td>
        </tr>
        `;
    }).join('');
    tbody.innerHTML = filasHTML;
}

pintarTabla();

const formArreglos = document.getElementById('formulario-arreglo');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');
formArreglos.addEventListener('submit', (event) => {event.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch(operacion){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            break;
    
        case 'map':
            resultado = talleres.map((t) => t.nombre).join('\n');
            break;
        case 'filter':
            resultado = talleres
                .filter((t) => t.inscritos >= t.cupo)
                .map((t) => t.nombre)
                .join('\n');
            break;
        case 'find':
            const tallerEncontrado = talleres.find((t) => t.instructor === 'Ing. María López');
            resultado = tallerEncontrado
                ? `${tallerEncontrado.nombre} (${tallerEncontrado.instructor})`
                : 'No se encontró ningún taller';
            break;
        case 'reduce':
            const totalInscritos = talleres.reduce((total, t) => total + t.inscritos, 0);
            resultado = `Total de inscritos: ${totalInscritos}`;
            break;
        case 'filterMap':
            resultado = talleres
                .filter((t) => t.inscritos < t.cupo)
                .map((t) => t.nombre)
                .join('\n');
            break;
        default:
            resultado = 'Operación no válida';
            break;
    }


    resultadoArreglos.textContent = resultado;
});


//Ejercicio de objetos

const formObjeto = document.getElementById('form-objeto');
const resultadoObjeto = document.getElementById('resultado-objeto');

formObjeto-addEventListener('submit', (evento) => {
    evento.preventDefault();

    //Necesitamos contrsuir el objeto del taller
    const taller = {
        nombre: document.getElementById('obj-nombre').value,
        instructor: document.getElementById('obj-instructor').value,
        cupo: Number(document.getElementById('obj-cupo').value),
        inscritos: Number(document.getElementById('obj-inscritos').value)
    };

    const operacion = document.getElementById('operacion-objeto').value;
    let resultado;

    switch(operacion){
        case 'keys':
            resultado = JSON.stringify(Object.keys(taller));
            break;

        case 'values':
            resultado = JSON.stringify(Object.values(taller));
            break;

        case 'entries':
            break;

        case 'stringify':
            const textoJson = JSON.stringify(taller, null, 2);
            resultado = `${textoJson}\n \n tipo: ${typeof textoJson}`;
            break;

        case 'roundtrip':
            const textoJsons = JSON.stringify(taller, null, 2);
            const objetoDeVuelta = JSON.parse(textoJsons);

            resultado = [
                textoJsons,
                '',
                `tipo: ${typeof objetoDeVuelta}`,
                objetoDeVuelta.nombre
            ].join('\n');
            break;
    }
    resultadoObjeto.textContent = resultado;
});