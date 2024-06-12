let usuario = {
    nombre: "",
    tarjetas: [],
    gastos: []
};


// POR ACA LISTO! APLICADO EL SWEETALERT2
function validarNombre(nombre) {
    return nombre.trim() !== '';
}

function mostrarError() {
    Swal.fire({
        icon: 'error',
        title: 'Campo vacio',
        text: 'Por favor, ingrese un nombre válido.',
    });
}

// Event listeners
document.getElementById('iniciar').addEventListener('click', function () {
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();

    validarNombre(nombreUsuario) ? (usuario.nombre = nombreUsuario, guardarUsuarioEnLocalStorage(), document.getElementById('bienvenida').style.display = 'none', document.getElementById('configuracion').style.display = 'block') : mostrarError();

});

document.getElementById('nombreUsuario').addEventListener('keydown', function (event) {

    (event.key === 'Enter') && (event.preventDefault(), validarNombre(nombreUsuario = document.getElementById('nombreUsuario').value.trim()) ? (usuario.nombre = nombreUsuario, guardarUsuarioEnLocalStorage(), document.getElementById('bienvenida').style.display = 'none', document.getElementById('configuracion').style.display = 'block') : mostrarError());

});

// Función para guardar usuario en localStorage (puedes ajustar según tus necesidades)
function guardarUsuarioEnLocalStorage() {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

// Ejemplo de función validarNombre (debe definirla según su lógica)
function validarNombre(nombre) {
    return nombre.length > 0;
}

// Ejemplo de función guardarUsuarioEnLocalStorage (debe definirla según su lógica)
function guardarUsuarioEnLocalStorage() {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

/////////////////////////////////////////////////////////////////////////

//POR EL MOMENTO ESTE ESTA SWEETALERT
function validarNumeroPositivo(numero) {
    return !isNaN(numero) && parseFloat(numero) > 0;
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

    // Validación de campos vacíos
    const camposVacios = [semanas, ganancia, gastosServicios, gastosComidaSemana].some(valor => valor === '' || isNaN(valor));
    if (camposVacios) {
        mostrarError();
        return; // Detener la ejecución si hay campos vacíos
    }

    // Validación de valores positivos
    const validInputs = [semanas, ganancia, gastosServicios, gastosComidaSemana].every(validarNumeroPositivo);
    validInputs ? (
        usuario.gastos.push({ tipo: 'Servicio', descripcion: 'Gastos en servicios', monto: gastosServicios }),
        usuario.gastos.push({ tipo: 'Comida', descripcion: 'Gastos en comida por semana', monto: gastosComidaSemana }),

        gastosTotales = usuario.gastos.reduce((total, gasto) => total + gasto.monto, 0),
        ahorro = calcularAhorro(ganancia, gastosTotales),

        document.getElementById('ahorroSemana').textContent = `Su ahorro es de $${ahorro.semana.toFixed(2)} por semana.`,
        document.getElementById('ahorroMes').textContent = `Estás ahorrando $${ahorro.mes.toFixed(2)} en el mes.`,

        document.getElementById('configuracion').style.display = 'none',
        document.getElementById('resultado').style.display = 'block',

        guardarUsuarioEnLocalStorage()
    ) : alert("Por favor, ingrese valores válidos.");   //chequear este
});


function mostrarError() {
    Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor, complete todos los campos con valores válidos.',
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calcularAhorro(ganancia, gastos) {
    let ahorroMes = ganancia - gastos;
    let ahorroSemana = ahorroMes / 4;
    return { semana: ahorroSemana, mes: ahorroMes };
}

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

    let totalGastos = 0;

    usuario.gastos.forEach((gasto, index) => {
        totalGastos += gasto.monto;
        console.log(`Agregando gasto: ${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}`);
        listaGastos.innerHTML += `<p>${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}</p>`;
    });

    let totalGastosElemento = document.createElement('p');
    totalGastosElemento.textContent = `Total de gastos en el mes: $${totalGastos.toFixed(2)}`;
    listaGastos.appendChild(totalGastosElemento);
}



document.getElementById('buscar').addEventListener('click', function () {
    buscar();
});


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


function buscarGasto(descripcion) {
    return usuario.gastos.filter(gasto => gasto.descripcion.toLowerCase().includes(descripcion.toLowerCase()));

}


//TARJETA DE CREDITO LISTO CON EL SWEET ALERT
document.getElementById('agregarTarjeta').addEventListener('click', function () {
    Swal.fire({
        icon: 'question',
        title: '¿Desea agregar tarjeta de credito?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let input, gastosTarjeta;

            Swal.fire({
                icon: 'question',
                title: '¿Cual es el consumo de tu tarjeta de credito por mes?',
                input: 'text',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                preConfirm: (value) => {
                    if (!value.trim()) {
                        Swal.showValidationMessage('Por favor, ingrese un valor.');
                    } else if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
                        Swal.showValidationMessage('Por favor, ingrese un número válido mayor que cero.');
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    gastosTarjeta = parseInt(result.value);
                    let tarjeta = { tipo: 'Tarjeta de Crédito', descripcion: 'Gastos de tarjeta de crédito', monto: gastosTarjeta };
                    usuario.tarjetas.push(tarjeta);
                    usuario.gastos.push(tarjeta);
                    guardarUsuarioEnLocalStorage();
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelado', 'No se agregó ninguna tarjeta de crédito.', 'info');
        }
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.getElementById('finalizar').addEventListener('click', function () {
    document.getElementById('gastos').style.display = 'none';
    document.getElementById('saludoFinal').style.display = 'block';

    // Mostrar SweetAlert con el tema Nyan Cat
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

