let gastosDelmes = 0
let nombreUsuario = prompt("Ingrese su nombre").toLowerCase()
alert("Bienvenido/a" + " " + nombreUsuario + " " + "a tu organizador financiero del mes")
let gananciaDelmes = parseInt(prompt("Ingrese cuanto gana en el mes"))
let semanasDelmes = parseInt(prompt("Ingresa cuantas semanas tendra este mes"))


function calcularPromedio(gananciaDelmes, gastosDelmes,semanasDelmes){
if (gananciaDelmes > gastosDelmes){
    let resta = gananciaDelmes - gastosDelmes;
        let promedio = resta / semanasDelmes;
        alert("El resultado luego de tus gastos semanales será de" + " " + "$" + resta);
        alert("En base a tus gastos, terminarías ahorrando" + " " + "$" + promedio.toFixed(2) + " " + "por semana")
    } else {
        alert("Perdón, no podrás llegar a fin de mes :c")
    }

}

if (semanasDelmes == 4 || semanasDelmes == 5) {
    for (let i = 1; i <= semanasDelmes; i++) {
        let gastosDelasemana = parseInt(prompt("Ingresa los gastos de la semana" + " " + i))
        gastosDelmes += gastosDelasemana;
        if (gastosDelmes >= gananciaDelmes) {
            break;
        }
    }
    calcularPromedio(gananciaDelmes, gastosDelmes, semanasDelmes)
} else {
    alert("Ingrese correctamente la cantidad de semanas del mes")
}
