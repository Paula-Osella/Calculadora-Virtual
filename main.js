let usuario = {
    nombre: "",
    tarjetas: [],
    gastos: []
};

document.getElementById('iniciar').addEventListener('click', () => validarNombre(nombreUsuario = document.getElementById('nombreUsuario').value.trim()) ? (usuario.nombre = nombreUsuario, guardarUsuarioEnLocalStorage(), document.getElementById('bienvenida'), document.getElementById('configuracion').style.display = 'block') : alert("Por favor, ingrese un nombre válido."));

document.getElementById("nombreUsuario").addEventListener('keydown', event => event.key === "Enter" ? (validarNombre(nombreUsuario = document.getElementById('nombreUsuario').value.trim()) ? (usuario.nombre = nombreUsuario, guardarUsuarioEnLocalStorage(), document.getElementById('configuracion').style.display = 'block') : alert("Por favor, ingrese un nombre válido.")) : null);

function validarNombre(nombre) {
    return isNaN(nombre) && nombre.trim() !== "";
}

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

    const validInputs = [semanas, ganancia, gastosServicios, gastosComidaSemana].every(validarNumeroPositivo);
    validInputs ? (
        usuario.gastos.push({ tipo: 'Servicio', descripcion: 'Gastos en servicios', monto: gastosServicios }),
        usuario.gastos.push({ tipo: 'Comida', descripcion: 'Gastos en comida por semana', monto: gastosComidaSemana }),

        gastosTotales = usuario.gastos.reduce((total, gasto) => total + gasto.monto, 0),
        ahorro = calcularAhorro(ganancia, gastosTotales),

        document.getElementById('ahorroSemana').textContent = `Estás ahorrando $${ahorro.semana.toFixed(2)} por semana.`,
        document.getElementById('ahorroMes').textContent = `Estás ahorrando $${ahorro.mes.toFixed(2)} en el mes.`,

        document.getElementById('configuracion').style.display = 'none',
        document.getElementById('resultado').style.display = 'block',

        guardarUsuarioEnLocalStorage()
    ) : alert("Por favor, ingrese valores válidos.");
});


function calcularAhorro(ganancia, gastos) {
    let ahorroMes = ganancia - gastos;
    let ahorroSemana = ahorroMes / 4;
    return { semana: ahorroSemana, mes: ahorroMes };
}

document.getElementById('mostrarGastos').addEventListener('click', function ()  {
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
        console.log(`Agregando gasto: ${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}`);
        listaGastos.innerHTML += `<p>${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}</p>`;
    });
}

document.getElementById('buscar').addEventListener('click', function () {
    let descripcion = document.getElementById('buscarGasto').value.trim();
    let resultados = buscarGasto(descripcion);
    let resultadosBusqueda = document.getElementById('resultadosBusqueda');
    resultadosBusqueda.innerHTML = '';
    resultados.length > 0 && descripcion !== ""
        ? resultados.forEach((gasto, index) => resultadosBusqueda.innerHTML += `<p>${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}</p>`)
        : resultadosBusqueda.innerHTML = `<p>No se encontraron gastos que coincidan con "${descripcion}".</p>`;

});

function buscarGasto(descripcion) {
    return usuario.gastos.filter(gasto => gasto.descripcion.toLowerCase().includes(descripcion.toLowerCase()));

}

document.getElementById('agregarTarjeta').addEventListener('click', function () {
    let gastosTarjeta = parseFloat(prompt("Ingrese los gastos mensuales de la tarjeta de crédito"));
    while (!validarNumeroPositivo(gastosTarjeta)) {
        gastosTarjeta = parseFloat(prompt("Por favor, ingrese un número válido para los gastos de la tarjeta de crédito"));
    }

    let tarjeta = { tipo: 'Tarjeta de Crédito', descripcion: 'Gastos de tarjeta de crédito', monto: gastosTarjeta };
    usuario.tarjetas.push(tarjeta);
    usuario.gastos.push(tarjeta);
    guardarUsuarioEnLocalStorage();
});

document.getElementById('finalizar').addEventListener('click', function () {
    document.getElementById('gastos').style.display = 'none';
    document.getElementById('saludoFinal').style.display = 'block';
    document.getElementById('saludoUsuario').textContent = `¡Gracias ${usuario.nombre} por usar nuestra aplicación!`;
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
