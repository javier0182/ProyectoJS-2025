const especialidades = [
  {
    id: 1,
    nombre: "Dermatología",
    horario: "15 de abril 10:15 hs",
    valor: "$10.000",
  },
  {
    id: 2,
    nombre: "Dermatología",
    horario: "16 de abril 11:15 hs",
    valor: "$10.000",
  },
  {
    id: 5,
    nombre: "Dermocosmética",
    horario: "29 de abril 17:15 hs",
    valor: "$9.000",
  },
  { 
    id: 6,
    nombre: "Dermocosmética",
    horario: "10 de mayo 08:50 hs",
    valor: "$9.000",
  },
  {
    id: 7,
    nombre: "Manicura",
    horario: "10 de mayo 15:20 hs",
    valor: "$20.000",
  },
  {
    id: 8,
    nombre: "Manicura",
    horario: "22 de mayo 09:20 hs",
    valor: "$20.000",
  }
];

let productosCarrito = [];

function imprimirEspecialidadesEnHTML(lista) {
  const contenedor = document.getElementById("cards-container");

  for (const especialidad of lista) {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${especialidad.nombre}</h3>
      <p>${especialidad.horario}</p>
      <p> ${especialidad.valor}</p>
      <button class="boton-reserva" id="${especialidad.id}">Reservar</button>
    `;

    contenedor.appendChild(card);
  }

  activarBotonesReserva(); 
}

function activarBotonesReserva() {
  const botones = document.getElementsByClassName("boton-reserva");

  for (const boton of botones) {
    boton.addEventListener("click", function(e) {
      const id = parseInt(e.currentTarget.id);
      const especialidadSeleccionada = especialidades.find(function(item) {
        return item.id === id;
      });

      if (especialidadSeleccionada) {
        const yaEsta = productosCarrito.some(function(item) {
          return item.id === especialidadSeleccionada.id;
        });

        if (!yaEsta) {
          productosCarrito.push(especialidadSeleccionada);
          localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
        }
        console.log("Carrito:", productosCarrito);
      }
    });
  }
}

imprimirEspecialidadesEnHTML(especialidades);

let carritoGuardado = localStorage.getItem("productosCarrito");
if (carritoGuardado) {
  productosCarrito = JSON.parse(carritoGuardado);
}
