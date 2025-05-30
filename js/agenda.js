const STORAGE_KEY = "productosAgenda";
let agendaContainer = document.getElementById("agenda-container");

const turnosDisponibles = {
  "1": ["10 de junio 10:00", "11 de junio 13:00", "12 de junio 15:00"],
  "2": ["9 de junio 12:00", "13 de junio 11:30", "14 de junio 14:00"],
  "3": ["8 de junio 10:30", "15 de junio 16:00"],
  "4": ["12 de junio 11:15", "13 de junio 15:30"],
  "5": ["10 de junio 14:00", "11 de junio 12:45", "14 de junio 10:15"],
  "6": ["9 de junio 11:00", "12 de junio 13:30"]
}

let agendaGuardado = localStorage.getItem(STORAGE_KEY);
let productosAgenda = [];

if (agendaGuardado) {
  productosAgenda = JSON.parse(agendaGuardado);
  renderAgenda(productosAgenda);
}

function renderAgenda(lista) {
  agendaContainer.innerHTML = "";

  for (const especialidad of lista) {
    const item = document.createElement("div");

    item.innerHTML = `
      <h3>${especialidad.nombre}</h3>
      ${especialidad.horario ? `<p>Turno: <span class="turno-text">${especialidad.horario}</span></p>` : ""}
      <h4>${especialidad.valor}</h4>
      <button class="boton-quitar" data-id="${especialidad.id}">Quitar</button>
      <button class="boton-modificar" data-id="${especialidad.id}">Modificar</button>
      <div class="modificar-turno-container" style="display:none; margin-top: 10px;">
        <select class="select-turno"></select>
        <button class="btn-guardar">Guardar</button>
        <button class="btn-cancelar">Cancelar</button>
      </div>
    `;

    agendaContainer.appendChild(item);

    item.querySelector(".boton-quitar").addEventListener("click", function (e) {
      const idAEliminar = parseInt(e.currentTarget.dataset.id);
      productosAgenda = productosAgenda.filter(function (item) {
        return item.id !== idAEliminar;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productosAgenda));
      renderAgenda(productosAgenda);
    });

    const btnModificar = item.querySelector(".boton-modificar");
    const contenedorModificar = item.querySelector(".modificar-turno-container");
    const selectTurno = contenedorModificar.querySelector(".select-turno");
    const btnGuardar = contenedorModificar.querySelector(".btn-guardar");
    const btnCancelar = contenedorModificar.querySelector(".btn-cancelar");
    const turnoTexto = item.querySelector(".turno-text");

    btnModificar.addEventListener("click", function () {
      contenedorModificar.style.display = "block";
      btnModificar.style.display = "none";

      const idEspecialidad = parseInt(btnModificar.dataset.id);
      const turnosOpciones = turnosDisponibles[idEspecialidad] || [];

      selectTurno.innerHTML = "";
      for (const turno of turnosOpciones) {
        const option = document.createElement("option");
        option.value = turno;
        option.textContent = turno;
        selectTurno.appendChild(option);
      }
      selectTurno.value = especialidadHorario(lista, idEspecialidad);
    });

    btnCancelar.addEventListener("click", function () {
      contenedorModificar.style.display = "none";
      btnModificar.style.display = "inline-block";
    });

    btnGuardar.addEventListener("click", function () {
      const nuevoTurno = selectTurno.value;
      const idEspecialidad = parseInt(btnModificar.dataset.id);

      for (let prod of productosAgenda) {
        if (prod.id === idEspecialidad) {
          prod.horario = nuevoTurno;
          break;
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(productosAgenda));
      renderAgenda(productosAgenda);
    });
  }

  let total = 0;
  for (const item of lista) {
    total += parseInt(item.valor.replace("$", "").replace(".", ""));
  }

  const totalElemento = document.createElement("h3");
  totalElemento.textContent = `Total: $${total.toLocaleString("es-AR")}`;
  agendaContainer.appendChild(totalElemento);

  if (lista.length > 0) {
    const btnFinalizar = document.createElement("button");
    btnFinalizar.textContent = "Finalizar reserva";
    btnFinalizar.classList.add("btn-finalizar");
    agendaContainer.appendChild(btnFinalizar);

    btnFinalizar.addEventListener("click", () => {
      Swal.fire({
        title: "¿Abonás con tarjeta o con efectivo al asistir?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Tarjeta",
        denyButtonText: "Efectivo",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Datos de la tarjeta",
            html: `
              <input type="text" id="numero" class="swal2-input" placeholder="Número de tarjeta">
              <input type="text" id="nombre" class="swal2-input" placeholder="Nombre que sale en la tarjeta">
              <input type="password" id="clave" class="swal2-input" placeholder="Clave de seguridad">
            `,
            confirmButtonText: "Confirmar pago",
            showCancelButton: true,
            preConfirm: () => {
              const numero = document.getElementById("numero").value;
              const nombre = document.getElementById("nombre").value;
              const clave = document.getElementById("clave").value;
              if (!numero || !nombre || !clave) {
                Swal.showValidationMessage("Completá todos los campos");
                return false;
              }
              if (numero !== "4970110000000062" || clave !== "182") {
                Swal.showValidationMessage("Datos inválidos");
                return false;
              }
              return { metodo: "tarjeta", nombre };
            }
          }).then((res) => {
            if (res.isConfirmed) {
              Swal.fire("Turno reservado", "¡Gracias por tu reserva!", "success");
              productosAgenda = [];
              localStorage.removeItem(STORAGE_KEY);
              renderAgenda(productosAgenda);
            } else {
              Swal.fire("No se completó el proceso", "", "info");
            }
          });

        } else if (result.isDenied) {
          Swal.fire({
            title: "Confirmar pago en el local",
            text: "¿Reservar turno y pagar en efectivo?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, reservar",
            cancelButtonText: "Cancelar"
          }).then((res2) => {
            if (res2.isConfirmed) {
              Swal.fire("Turno reservado", "Abonás al asistir", "success");
              productosAgenda = [];
              localStorage.removeItem(STORAGE_KEY);
              renderAgenda(productosAgenda);
            } else {
              Swal.fire("No se completó el proceso", "", "info");
            }
          });
        }
      });
    });
  }
}

function especialidadHorario(lista, id) {
  const especialidad = lista.find(item => item.id === id);
  return especialidad ? especialidad.horario : "";
}