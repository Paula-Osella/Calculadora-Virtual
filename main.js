let usuario = {
    nombre: "",
    tarjetas: [], // Array para almacenar las tarjetas de crédito
    gastos: [] // Array para almacenar todos los gastos
};

// Función de bienvenida
function bienvenida() {
    let nombreUsuario
    do {
        nombreUsuario = prompt("Ingrese su nombre").trim()
    } while (!validarNombre(nombreUsuario))
    alert(`Bienvenido/a ${nombreUsuario} a tu ahorrador virtual`)
    return nombreUsuario
}

// Función para verificar si el nombre de usuario es válido
function validarNombre(nombre) {
    return isNaN(nombre) && nombre.trim() !== ""
}

// Función para validar números positivos
function validarNumeroPositivo(numero) {
    return !isNaN(numero) && parseFloat(numero) > 0
}

// Función para agregar tarjeta de crédito
function agregarTarjeta() {
    let gastosTarjeta
    do {
        gastosTarjeta = parseFloat(prompt("Ingrese los gastos mensuales de la tarjeta de crédito"))
    } while (!validarNumeroPositivo(gastosTarjeta))

    let tarjeta = { tipo: 'Tarjeta de Crédito', descripcion: 'Gastos de tarjeta de crédito', monto: gastosTarjeta }
    usuario.tarjetas.push(tarjeta)
    usuario.gastos.push(tarjeta)
}

// Función para calcular el ahorro
function calcularAhorro(ganancia, gastos) {
    let ahorroMes = ganancia - gastos
    let ahorroSemana = ahorroMes / 4
    return { semana: ahorroSemana, mes: ahorroMes }
}

// Función para mostrar todos los gastos
function mostrarGastos() {
    let mensaje = "Gastos ingresados:\n"
    usuario.gastos.forEach((gasto, index) => {
        mensaje += `${index + 1}. ${gasto.tipo} - ${gasto.descripcion}: $${gasto.monto.toFixed(2)}\n`
    })
    alert(mensaje)
}

// Función para buscar un gasto específico
function buscarGasto(descripcion) {

        return usuario.gastos.filter(gasto => gasto.descripcion.toLowerCase().includes(descripcion.toLowerCase()))
}

// Función principal
function iniciarPrograma() {
    // Datos iniciales
    usuario.nombre = bienvenida()

    // Consulta sobre duración del cálculo
    let semanas = parseInt(prompt("¿Cuántas semanas desea calcular sus gastos?"))
    while (!validarNumeroPositivo(semanas)) {
        semanas = parseInt(prompt("Por favor, ingrese un número válido de semanas"))
    }

    // Ganancia del mes
    let ganancia = parseFloat(prompt("Ingrese su ganancia mensual"))
    while (!validarNumeroPositivo(ganancia)) {
        ganancia = parseFloat(prompt("Por favor, ingrese un número válido para su ganancia"))
    }

    // Consulta sobre los gastos típicos
    let gastosServicios = parseFloat(prompt("Ingrese sus gastos en servicios (luz, internet, etc.)"))
    while (!validarNumeroPositivo(gastosServicios)) {
        gastosServicios = parseFloat(prompt("Por favor, ingrese un número válido para sus gastos en servicios"))
    }
    usuario.gastos.push({ tipo: 'Servicio', descripcion: 'Gastos en servicios', monto: gastosServicios })

    let gastosComidaSemana = parseFloat(prompt("Ingrese sus gastos totales de comida para las semanas que está calculando"))
    while (!validarNumeroPositivo(gastosComidaSemana)) {
        gastosComidaSemana = parseFloat(prompt("Por favor, ingrese un número válido para sus gastos en comida"))
    }
    usuario.gastos.push({ tipo: 'Comida', descripcion: 'Gastos en comida por semana', monto: gastosComidaSemana })

    // Consulta sobre gastos de tarjeta de crédito
    let tieneTarjeta = prompt("¿Tiene gastos en su tarjeta de crédito? (Sí/No)").toLowerCase()
    if (tieneTarjeta === "sí" || tieneTarjeta === "si") {
        let agregarOtraTarjeta = "sí"
        while (agregarOtraTarjeta === "sí" || agregarOtraTarjeta === "si") {
            agregarTarjeta()
            agregarOtraTarjeta = prompt("¿Desea agregar otra tarjeta de crédito? (Sí/No)").toLowerCase()
        }
    }

    // Cálculo de gastos totales
    let gastosTotales = usuario.gastos.reduce((total, gasto) => total + gasto.monto, 0)

    // Cálculo de ahorro
    let ahorro = calcularAhorro(ganancia, gastosTotales)

    // Mostrar resultados de ahorro
    alert(`Estás ahorrando $${ahorro.semana.toFixed(2)} por semana y $${ahorro.mes.toFixed(2)} en el mes.`)

    // Mostrar todos los gastos
    mostrarGastos()

    // Preguntar si desea buscar algún gasto
    let buscarMasGastos = prompt("¿Desea buscar algún gasto con una palabra clave? (Sí/No)").toLowerCase()
    while (buscarMasGastos === "sí" || buscarMasGastos === "si") {
        let gastoBuscar = prompt("Ingrese una palabra clave para buscar un gasto específico").trim()
        let resultadosBusqueda = buscarGasto(gastoBuscar)

        if (resultadosBusqueda.length > 0 && gastoBuscar !== "" && gasto.includes(gastoBuscar)) {
            let mensaje = `Se encontraron ${resultadosBusqueda.length} gastos que coinciden con "${gastoBuscar}":\n`
            resultadosBusqueda.forEach((gasto, index) => {
                mensaje += `Gasto ${index + 1}: ${gasto.tipo} - ${gasto.descripcion} - Monto: $${gasto.monto.toFixed(2)}\n`
            });
            alert(mensaje)
        } else {
            alert(`No se encontraron gastos que coincidan con "${gastoBuscar}".`)
        }

        buscarMasGastos = prompt("¿Desea intentar buscar nuevamente? (Sí/No)").toLowerCase()
    }

    alert("Gracias por elegir nuestro servicio!")
}

// Ejecutar función principal
iniciarPrograma()
