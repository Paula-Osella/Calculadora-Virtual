let usuario = {
    nombre: "",
    tarjetas: [],
    gastos: []
};

let totalGastos = 0;


// Función para enviar datos del usuario al servidor
function enviarDatosAlServidor(datos) {
    return new Promise((resolve, reject) => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (!response.ok) {
                    const error = new Error('Error en la respuesta del servidor');
                    return reject(error);
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Event listener para iniciar sesión

document.getElementById('nombreUsuario').addEventListener('keydown', function (event) {
    document.getElementById('nombreUsuario').addEventListener('keydown', event => event.key === 'Enter' && (event.preventDefault(), validarNombre(document.getElementById('nombreUsuario').value.trim()) ? (usuario.nombre = document.getElementById('nombreUsuario').value.trim(), guardarUsuarioEnLocalStorage(), document.getElementById('bienvenida').style.display = 'none', document.getElementById('configuracion').style.display = 'block') : mostrarError()));

});

document.getElementById('iniciar').addEventListener('click', function () {
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    validarNombre(nombreUsuario) ? (usuario.nombre = nombreUsuario, guardarUsuarioEnLocalStorage(), document.getElementById('bienvenida').style.display = 'none', document.getElementById('configuracion').style.display = 'block') : mostrarError();

});

// Función para validar el nombre
function validarNombre(nombre) {
    return nombre.trim() !== '';
}

// Función para mostrar error con SweetAlert2
function mostrarError() {
    Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'Por favor, ingrese un nombre válido.',
    });
}


document.getElementById('calcular').addEventListener('click', function () {
    let { value: semanas } = document.getElementById('semanas');
    let { value: ganancia } = document.getElementById('ganancia');
    let { value: gastosServicios } = document.getElementById('gastosServicios');
    let { value: gastosComidaSemana } = document.getElementById('gastosComidaSemana');

    semanas = parseInt(semanas);
    ganancia = parseFloat(ganancia);
    gastosServicios = parseFloat(gastosServicios);
    gastosComidaSemana = parseFloat(gastosComidaSemana);

    const camposVacios = [semanas, ganancia, gastosServicios, gastosComidaSemana].some(valor => valor === '' || isNaN(valor));
    if (camposVacios) {
        mostrarError();
        return;
    }

    const validInputs = [semanas, ganancia, gastosServicios, gastosComidaSemana].every(validarNumeroPositivo);
    if (!validInputs) {
        Swal.fire({
            icon: 'error',
            title: 'Campos vacios',
            text: 'Por favor, ingrese valores válidos.',
        });
        return;
    }


    Swal.fire({

        icon: 'success',
        title: 'Datos enviados',
        text: 'Los datos se enviaron correctamente',
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, realizar los cálculos y enviar los datos
            usuario.gastos.push({ tipo: 'Servicio', descripcion: 'Gastos en servicios', monto: gastosServicios });
            usuario.gastos.push({ tipo: 'Comida', descripcion: 'Gastos en comida por semana', monto: gastosComidaSemana });

            const gastosTotales = usuario.gastos.reduce((total, gasto) => total + gasto.monto, 0);
            const ahorro = calcularAhorro(ganancia, gastosTotales);

            document.getElementById('ahorroSemana').textContent = `Su ahorro es de $${ahorro.semana.toFixed(2)} por semana.`;
            document.getElementById('ahorroMes').textContent = `Estás ahorrando $${ahorro.mes.toFixed(2)} en el mes.`;

            document.getElementById('configuracion').style.display = 'none';
            document.getElementById('resultado').style.display = 'block';
            guardarUsuarioEnLocalStorage();

            enviarDatosAlServidor(usuario) // Enviamos los datos al servidor
                .then(data => {
                    console.log('Promesa resuelta: datos enviados correctamente', data);

                })
                .catch(error => {
                    console.log('Promesa rechazada: error al enviar los datos', error);
;
                });
        }
    });
});

// Función para validar números positivos
function validarNumeroPositivo(numero) {
    return !isNaN(numero) && parseFloat(numero) > 0;
}

// Función para calcular el ahorro
function calcularAhorro(ganancia, gastos) {
    let ahorroMes = ganancia - gastos;
    let ahorroSemana = ahorroMes / 4;
    return { semana: ahorroSemana, mes: ahorroMes };
}


// Función para guardar usuario en Local Storage
function guardarUsuarioEnLocalStorage() {
    let usuarioParaGuardar = {
        nombre: usuario.nombre,
        tarjetas: usuario.tarjetas
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioParaGuardar));
}



// Función para validar números positivos
function validarNumeroPositivo(numero) {
    return !isNaN(numero) && parseFloat(numero) > 0;
}

// Función para calcular el ahorro
function calcularAhorro(ganancia, gastos) {
    let ahorroMes = ganancia - gastos;
    let ahorroSemana = ahorroMes / 4;
    return { semana: ahorroSemana, mes: ahorroMes };
}

// Función para mostrar los gastos
document.getElementById('mostrarGastos').addEventListener('click', function () {
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('gastos').style.display = 'block';
    mostrarGastos();
});


function mostrarGastos() {
    let listaGastos = document.getElementById('listaGastos');
    if (!listaGastos) {
        console.error('Elemento listaGastos no encontrado');
        return;
    }

    console.log('Llamando a mostrarGastos');
    console.log('Gastos actuales:', usuario.gastos);

    listaGastos.innerHTML = '';

    if (!Array.isArray(usuario.gastos)) {
        console.error('usuario.gastos no es un arreglo');
        return;
    }



    usuario.gastos.forEach((gasto, index) => {
        totalGastos += gasto.monto;
        console.log(`Agregando gasto: ${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}`);
        listaGastos.innerHTML += `<p>${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}</p>`;
    });

    let totalGastosElemento = document.createElement('p');
    totalGastosElemento.textContent = `Total de gastos en el mes: $${totalGastos.toFixed(2)}`;
    listaGastos.appendChild(totalGastosElemento);
}

// Función para buscar gastos por descripción
document.getElementById('buscar').addEventListener('click', function () {
    buscar();
});

// Función para buscar gastos por descripción (similar al código anterior)
document.getElementById('buscarGasto').addEventListener('keydown', event => event.key === "Enter" ? buscar() : null);

function buscar() {
    let descripcion = document.getElementById('buscarGasto').value.trim();
    let resultados = buscarGasto(descripcion);
    let resultadosBusqueda = document.getElementById('resultadosBusqueda');
    resultadosBusqueda.innerHTML = '';
    resultados.length > 0 && descripcion !== ""
        ? resultados.forEach((gasto, index) => resultadosBusqueda.innerHTML += `<p>${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}</p>`)
        : resultadosBusqueda.innerHTML = `<p>No se encontraron gastos que coincidan con "${descripcion}".</p>`;
}

// Función para buscar gastos en el arreglo de usuario
function buscarGasto(descripcion) {
    return usuario.gastos.filter(gasto => gasto.descripcion.toLowerCase().includes(descripcion.toLowerCase()));
}

// Event listener para agregar tarjeta de crédito
document.getElementById('agregarTarjeta').addEventListener('click', function () {
    mostrarPreguntaAgregarTarjeta();
});

function mostrarPreguntaAgregarTarjeta() {
    Swal.fire({
        icon: 'question',
        title: '¿Desea agregar tarjeta de crédito?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarConsumoTarjeta();
        }
    });
}

function mostrarConsumoTarjeta() {
    Swal.fire({
        icon: 'question',
        title: '¿Cuál es el consumo de tu tarjeta de crédito por mes?',
        input: 'text',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        preConfirm: (value) => {
            if (!value.trim()) {
                Swal.showValidationMessage('Por favor, ingrese un valor.');
            } else if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
                Swal.showValidationMessage('Por favor, ingrese un número válido mayor que cero.');
            } else {
                return value; // Devuelve el valor ingresado por el usuario
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const gastosTarjeta = parseInt(result.value);
            agregarTarjeta(gastosTarjeta);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelado', 'No se agregó ninguna tarjeta de crédito.', 'info');
        }
    });
}

function agregarTarjeta(gastosTarjeta) {
    const tarjeta = { tipo: 'Tarjeta de Crédito', descripcion: 'Gastos de tarjeta de crédito', monto: gastosTarjeta };

    usuario.tarjetas.push(tarjeta); // Agregar tarjeta a usuario
    usuario.gastos.push(tarjeta);   // Agregar gastos de tarjeta al usuario

    guardarUsuarioEnLocalStorage(); // Guardar usuario en local storage

    Swal.fire({
        icon: 'success',
        title: 'Tarjeta agregada',
        text: 'La tarjeta de crédito fue agregada correctamente.',
    });
}

document.getElementById('finalizar').addEventListener('click', function () {
    document.getElementById('gastos').style.display = 'none';
    document.getElementById('saludoFinal').style.display = 'block';

    Swal.fire({
        icon: 'success',
        title: `¡Gracias ${usuario.nombre} por utilizar nuestra aplicación!`,
    });
});


document.addEventListener('DOMContentLoaded', function () {
    let datosUsuario = localStorage.getItem('usuario');
    datosUsuario ? (
        usuario.nombre = JSON.parse(datosUsuario).nombre,
        usuario.tarjetas = (JSON.parse(datosUsuario).tarjetas || []),
        document.getElementById('configuracion').classList.add('mostrar')
    ) : (
        document.getElementById('bienvenida').classList.add('mostrar')
    );
});

function guardarUsuarioEnLocalStorage() {
    let usuarioParaGuardar = {
        nombre: usuario.nombre,
        tarjetas: usuario.tarjetas
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioParaGuardar));
}

const toggleThemeButton = document.getElementById('toggleTheme');
const body = document.body;

toggleThemeButton.addEventListener('click', () => body.classList.contains('dark-theme') ? (body.classList.remove('dark-theme'), localStorage.setItem('theme', 'light')) : (body.classList.add('dark-theme'), localStorage.setItem('theme', 'dark')));

document.addEventListener('DOMContentLoaded', () => (localStorage.getItem('theme') === 'dark' ? body.classList.add('dark-theme') : null));
