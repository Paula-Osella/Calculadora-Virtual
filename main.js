let usuario = {
    nombre: "",
    tarjetas: [],
    gastos: []
};

document.getElementById('iniciar').addEventListener('click', function () {
    let nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    if (validarNombre(nombreUsuario)) {
        usuario.nombre = nombreUsuario;
        guardarUsuarioEnLocalStorage();
        document.getElementById('bienvenida');

        document.getElementById('configuracion').style.display = 'block';
    } else {
        alert("Por favor, ingrese un nombre válido.");
    }
});


document.getElementById("nombreUsuario").addEventListener('keydown', function(event) {
    if (event.key === "Enter"){
        let nombreUsuario = document.getElementById('nombreUsuario').value.trim();
        if (validarNombre(nombreUsuario)) {
            usuario.nombre = nombreUsuario;
            guardarUsuarioEnLocalStorage();
            document.getElementById('bienvenida');

            document.getElementById('configuracion').style.display = 'block';
        } else {
        alert("Por favor, ingrese un nombre válido.");
        }
    }
});



function validarNombre(nombre) {
    return isNaN(nombre) && nombre.trim() !== "";
}

function validarNumeroPositivo(numero) {
    return !isNaN(numero) && parseFloat(numero) > 0;
}

document.getElementById('calcular').addEventListener('click', function () {
    let semanas = parseInt(document.getElementById('semanas').value);
    let ganancia = parseFloat(document.getElementById('ganancia').value);
    let gastosServicios = parseFloat(document.getElementById('gastosServicios').value);
    let gastosComidaSemana = parseFloat(document.getElementById('gastosComidaSemana').value);

    if (validarNumeroPositivo(semanas) && validarNumeroPositivo(ganancia) &&
        validarNumeroPositivo(gastosServicios) && validarNumeroPositivo(gastosComidaSemana)) {

        usuario.gastos.push({ tipo: 'Servicio', descripcion: 'Gastos en servicios', monto: gastosServicios });
        usuario.gastos.push({ tipo: 'Comida', descripcion: 'Gastos en comida por semana', monto: gastosComidaSemana });

        let gastosTotales = usuario.gastos.reduce((total, gasto) => total + gasto.monto, 0);
        let ahorro = calcularAhorro(ganancia, gastosTotales);

        document.getElementById('ahorroSemana').textContent = `Estás ahorrando $${ahorro.semana.toFixed(2)} por semana.`;
        document.getElementById('ahorroMes').textContent = `Estás ahorrando $${ahorro.mes.toFixed(2)} en el mes.`;

        document.getElementById('configuracion').style.display = 'none';
        document.getElementById('resultado').style.display = 'block';
        // No guardar gastos en localStorage
        guardarUsuarioEnLocalStorage();
    } else {
        alert("Por favor, ingrese valores válidos.");
    }
});

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

    if (resultados.length > 0 && descripcion !== "") {
        resultados.forEach((gasto, index) => {
            resultadosBusqueda.innerHTML += `<p>${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}</p>`;
        });
    } else {
        resultadosBusqueda.innerHTML = `<p>No se encontraron gastos que coincidan con "${descripcion}".</p>`;
    }
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
    // No guardar gastos en localStorage
    guardarUsuarioEnLocalStorage();
});

document.getElementById('finalizar').addEventListener('click', function () {
    document.getElementById('gastos').style.display = 'none';
    document.getElementById('saludoFinal').style.display = 'block';
    document.getElementById('saludoUsuario').textContent = `¡Gracias ${usuario.nombre} por usar nuestra aplicación!`;
});


document.addEventListener('DOMContentLoaded', function () {
    let datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
        let datos = JSON.parse(datosUsuario);
        usuario.nombre = datos.nombre;
        usuario.tarjetas = datos.tarjetas || [];
        
        // Mostrar la sección de configuración al cargar los datos del usuario
        document.getElementById('configuracion').classList.add('mostrar');
    } else {
        // Mostrar la sección de bienvenida si no hay datos de usuario en el localStorage
        document.getElementById('bienvenida').classList.add('mostrar');
    }
});

document.getElementById('iniciar').addEventListener('click', function () {
    let nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    if (validarNombre(nombreUsuario)) {
        usuario.nombre = nombreUsuario;
        guardarUsuarioEnLocalStorage();
        
        // Ocultar la sección de bienvenida y mostrar la de configuración
        document.getElementById('bienvenida').classList.remove('mostrar');
        document.getElementById('configuracion').classList.add('mostrar');
    } else {
        alert("Por favor, ingrese un nombre válido.");
    }
});

function guardarUsuarioEnLocalStorage() {
    // Crear un objeto con solo las propiedades que deseas almacenar
    let usuarioParaGuardar = {
        nombre: usuario.nombre,
        tarjetas: usuario.tarjetas
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioParaGuardar));
}

const toggleThemeButton = document.getElementById('toggleTheme');
const body = document.body;

// Agrega un event listener al botón de alternancia de tema
toggleThemeButton.addEventListener('click', function() {
    // Verifica si la clase dark-theme está presente en el cuerpo del documento
    const isDarkMode = body.classList.contains('dark-theme');

    // Si el modo oscuro está activo, quítalo; de lo contrario, actívalo
    if (isDarkMode) {
        body.classList.remove('dark-theme');
        // Guarda la preferencia del usuario en localStorage
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        // Guarda la preferencia del usuario en localStorage
        localStorage.setItem('theme', 'dark');
    }
});

// Al cargar la página, verifica si el usuario ha seleccionado un tema anteriormente y aplicalo
document.addEventListener('DOMContentLoaded', function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    }
});
