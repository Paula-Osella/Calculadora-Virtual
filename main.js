let gastosDelmes = 0
let nombreUsuario = prompt("Ingrese su nombre").toLowerCase()
alert("Bienvenido/a" + " " + nombreUsuario + " " + "a tu organizador financiero del mes")
let gananciaDelmes = parseInt(prompt("Ingrese cuanto gana en el mes"))
let semanasDelmes = parseInt(prompt("Ingresa cuantas semanas tendra este mes"))



if (semanasDelmes == 4 || semanasDelmes == 5) {
    for (let i = 1; i <= semanasDelmes; i++) {
        let gastosDelasemana = parseInt(prompt("Ingresa los gastos de la semana" + " " + i))
        gastosDelmes = gastosDelmes + gastosDelasemana
        if (gastosDelmes >= gananciaDelmes){

            break
        }
    }
    if (gananciaDelmes > gastosDelmes) {
        let Resta = parseInt(gananciaDelmes - gastosDelmes)
        let restaResultado = parseInt(alert("El resultado luego de pagar tus cuentas sera de" + " " + "$" + Resta))
        let divisor = parseInt(Resta / semanasDelmes)
        let resultadoFinal = parseInt(alert("En base a tus gastos, terminarias ahorrando" + " " + "$" + divisor + " " + "por semana"))
    } else {
        alert("Perdon, no podras llegar a fin de mes :c")
    }
    
} else {
    alert("Ingrese correctamente la cantidad de semanas del mes")
}
