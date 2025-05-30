const AGENDA_STORAGE_KEY = "productosAgenda";
const LOGIN_STORAGE_KEY = "usuarioLogueado";
let usuarioLogueado = JSON.parse(localStorage.getItem(LOGIN_STORAGE_KEY));

const especialidades = [
  { id: 1, nombre: "Dermatología", valor: "$10.000" },
  { id: 2, nombre: "Pestañas", valor: "$15.000" },
  { id: 3, nombre: "Depilación", valor: "$11.000" },
  { id: 4, nombre: "Dermocosmética", valor: "$9.000" },
  { id: 5, nombre: "Manicura", valor: "$20.000" },
  { id: 6, nombre: "Pedicura", valor: "$25.000" },
];
const turnosDisponibles = {
  1: ["10 de junio 10:00", "11 de junio 13:00", "12 de junio 15:00"],
  2: ["9 de junio 12:00", "13 de junio 11:30", "14 de junio 14:00"],
  3: ["8 de junio 10:30", "15 de junio 16:00"],
  4: ["12 de junio 11:15", "13 de junio 15:30"],
  5: ["10 de junio 14:00", "11 de junio 12:45", "14 de junio 10:15"],
  6: ["9 de junio 11:00", "12 de junio 13:30"],
};
let productosCarrito = [];

function imprimirEspecialidadesEnHTML(lista) {
  const contenedor = document.getElementById("cards-container");
  contenedor.innerHTML = "";

  for (const especialidad of lista) {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${especialidad.nombre}</h3>
      <p>${especialidad.valor}</p>
      <button class="boton-reserva" id="${especialidad.id}">Reservar</button>
    `;
    contenedor.appendChild(card);
  }
  activarBotonesReserva();
}

function activarBotonesReserva() {
  const botones = document.getElementsByClassName("boton-reserva");
  for (const boton of botones) {
    boton.addEventListener("click", function (e) {
      const id = parseInt(e.currentTarget.id);
      const especialidad = especialidades.find(function (item) {
        return item.id === id;
      });
      if (especialidad) {
        if (usuarioLogueado) {
          mostrarModalTurnos(especialidad);
        } else {
          mostrarModalLogin(especialidad);
        }
      }
    });
  }
}

function mostrarModalTurnos(especialidad) {
  const modal = document.getElementById("modal-turno");
  const titulo = document.getElementById("titulo-especialidad");
  const selector = document.getElementById("selector-turno");
  titulo.textContent = "Seleccioná un turno para " + especialidad.nombre;
  selector.innerHTML = "";
  const opciones = turnosDisponibles[especialidad.id] || [];
  for (const turno of opciones) {
    const option = document.createElement("option");
    option.value = turno;
    option.textContent = turno;
    selector.appendChild(option);
  }
  modal.style.display = "block";

  document.getElementById("confirmar-turno").onclick = function () {
    const turnoSeleccionado = selector.value;
    if (turnoSeleccionado) {
      const yaEsta = productosCarrito.some(function (item) {
        return item.id === especialidad.id && item.horario === turnoSeleccionado;
      });
      if (!yaEsta) {
        const especialidadConTurno = {
          ...especialidad,
          horario: turnoSeleccionado,
        };
        productosCarrito.push(especialidadConTurno);
        localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(productosCarrito));
        Swal.fire({
          icon: "success",
          title: "Reserva confirmada",
          text: `Turno para ${especialidad.nombre} el ${turnoSeleccionado}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
    modal.style.display = "none";
  };
  document.getElementById("cancelar-turno").onclick = function () {
    modal.style.display = "none";
  };
}

function mostrarModalLogin(especialidad) {
  const modalLogin = document.getElementById("modal-login");
  const inputEmail = document.getElementById("input-email");
  const inputPass = document.getElementById("input-pass");

  modalLogin.style.display = "block";
  inputEmail.value = "";
  inputPass.value = "";

  document.getElementById("btn-login").onclick = function () {
    const email = inputEmail.value.trim();
    const pass = inputPass.value.trim();

    if (!email || !pass) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completá todos los campos"
      });
      return;
    }

    if (pass !== "12345") {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: "La contraseña ingresada no es válida"
      });
      return;
    }

    fetch("https://jsonplaceholder.typicode.com/users")
      .then(function (response) {
        return response.json();
      })
      .then(function (usuarios) {
        const usuarioEncontrado = usuarios.find(function (usuario) {
          return usuario.email.toLowerCase() === email.toLowerCase();
        });

        if (usuarioEncontrado) {
          localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(usuarioEncontrado));
          usuarioLogueado = usuarioEncontrado;
          modalLogin.style.display = "none";
          actualizarHeader();

          Swal.fire({
            icon: "success",
            title: "¡Bienvenida, " + usuarioLogueado.name + "!",
            text: "Sesión iniciada con éxito",
            timer: 2000,
            showConfirmButton: false
          });

          if (especialidad) {
            setTimeout(() => {
              mostrarModalTurnos(especialidad);
            }, 2100);
          }

        } else {
          Swal.fire({
            icon: "error",
            title: "Email no encontrado",
            text: "No se encontró ninguna cuenta con ese correo"
          });
        }
      });
  };

  document.getElementById("btn-cancelar-login").onclick = function () {
    modalLogin.style.display = "none";
  };
}

function actualizarHeader() {
  const btnIrAgenda = document.getElementById("btn-ir-agenda");
  const btnIniciarSesion = document.getElementById("btn iniciar-sesion");
  const btnCerrarSesion = document.getElementById("btn-cerrar sesion");
  const btnRegistrarse = document.getElementById("btn-registrarse");
  const infoUsuario = document.getElementById("usuario-info");

  if (usuarioLogueado) {
    if (btnIrAgenda) btnIrAgenda.style.display = "inline-block";
    if (btnIniciarSesion) btnIniciarSesion.style.display = "none";
    if (btnCerrarSesion) btnCerrarSesion.style.display = "inline-block";
    if (btnRegistrarse) btnRegistrarse.style.display = "none";
    if (infoUsuario) infoUsuario.textContent = "Sesión iniciada como: " + usuarioLogueado.name;
  } else {
    if (btnIrAgenda) btnIrAgenda.style.display = "none";
    if (btnIniciarSesion) btnIniciarSesion.style.display = "inline-block";
    if (btnCerrarSesion) btnCerrarSesion.style.display = "none";
    if (btnRegistrarse) btnRegistrarse.style.display = "inline-block";
    if (infoUsuario) infoUsuario.textContent = "";
  }
}

document.getElementById("btn-cerrar sesion").addEventListener("click", function () {
  localStorage.removeItem(LOGIN_STORAGE_KEY);
  usuarioLogueado = null;
  actualizarHeader();
  Swal.fire({
    icon: "info",
    title: "Sesión cerrada",
    text: "Cerraste sesión correctamente",
    timer: 1500,
    showConfirmButton: false
  });
});

document.getElementById("btn iniciar-sesion").addEventListener("click", function () {
  mostrarModalLogin();
});

let carritoGuardado = localStorage.getItem(AGENDA_STORAGE_KEY);
if (carritoGuardado) {
  productosCarrito = JSON.parse(carritoGuardado);
}
imprimirEspecialidadesEnHTML(especialidades);
actualizarHeader();


//No funcionó implementar fetch para vincularlo a JS con JSON, dejo el codigo que implementé y en la carpeta "db" los arrays en formato JSON

//fetch("./database/especialidades.json")
//  .then(response => response.json())
 // .then(data => {
  //  data.forEach(especialidad => {
  //    const card = document.createElement("div");
  //    card.innerHTML = `
  //      <h2>Especialidad: ${especialidad.nombre}</h2>
  //      <h3>Precio: ${especialidad.valor}</h3> `;
   //   container.appendChild(card);
  //  });
 // })
//}

//fetch("./database/horarios.json")
//  .then(response => response.json())
 // .then(response => response.json())
 // .then(data => {
  //  turnosDisponibles =data;
  //})

