let repetir = true;

while (repetir) {

let menu = parseInt(prompt("Ingrese la especialidad: \n 1- Clínica médica \n 2- Pediatría \n 3- Odontología \n 4- Dermatología \n 5- Cardiología"));

let especialidad = "";
let fechas = [];
let seleccion;

let fechasCM = ["15/04 a las 10:15hs", "28/04 a las 15:45hs", "05/05 a las 17:00hs", "07/05 a las 08:00hs"];
let fechasPD = ["20/04 a las 09:40hs", "25/04 a las 12:20hs", "10/05 a las 08:50hs", "17/05 a las 10:05hs"];
let fechasOD = ["15/04 a las 10:15hs", "28/04 a las 15:45hs", "05/05 a las 17:00hs", "07/05 a las 08:00hs"];
let fechasDERM = ["20/04 a las 09:40hs", "25/04 a las 12:20hs", "10/05 a las 08:50hs", "17/05 a las 10:05hs"];

switch(menu){
    case 1:
        especialidad = "Clínica médica";
        fechas = fechasCM;
        break;
    case 2:
        especialidad = "Pediatría"; 
        fechas = fechasPD; 
        break;
    case 3:
        especialidad = "Odontología";
        fechas = fechasOD;
        break;
    case 4:
        especialidad = "Dermatología"; 
        fechas = fechasDERM;
        break;
    case 5:
        especialidad = "Cardiología";
        break;
}

if (especialidad === "Cardiología"){
    alert("⚠️​ Atención: No hay turnos próximos disponibles para esta especialidad.");
}

if (fechas.length > 0) {
    let mensaje = "Fechas disponibles para " + especialidad + ":\n";

    for (let i = 0; i < fechas.length; i++) {
        mensaje += (i + 1) + " - " + fechas[i] + "\n";
    }

    seleccion = parseInt(prompt(mensaje)); 

    if (seleccion >= 1 && seleccion <= fechas.length) {
        alert("✅ Se ha confirmado el turno para " + especialidad + " el día " + fechas[seleccion - 1]);
    }  
}

if (especialidad === "Clínica médica") {
    if (fechas[seleccion - 1] === "05/05 a las 17:00hs") {
        alert("⚠️​ Atención: La fecha seleccionada no se encuentra disponible ");
    }
}

if (especialidad === "Pediatría") {
    if (fechas[seleccion - 1] === "20/04 a las 09:40hs") {
        alert("⚠️​ Atención: La fecha seleccionada no se encuentra disponible");
    }
}

if (especialidad === "Odontología") {
    if (fechas[seleccion - 1] === "07/05 a las 08:00hs") {
        alert("⚠️​ Atención: La fecha seleccionada no se encuentra disponible");
    }
}

if (especialidad === "Dermatología") {
    if (fechas[seleccion - 1] === "17/05 a las 10:05hs") {
        alert("⚠️​ Atención: La fecha seleccionada no se encuentra disponible");
    }
}
}
