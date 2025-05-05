let carritoContainer = document.getElementById("carrito-container");

let carritoGuardado = localStorage.getItem("productosCarrito");

function renderCarrito(lista) {
  carritoContainer.innerHTML = "";

  for (const especialidad of lista) {
    const item = document.createElement("div");

    item.innerHTML = `
      <h3>${especialidad.nombre}</h3>
      <h4>${especialidad.valor}</h4>
      <button class="boton-quitar" data-id="${especialidad.id}">Quitar</button>
    `;

    carritoContainer.appendChild(item);

    item.querySelector(".boton-quitar").addEventListener("click", function(e) {
      const idAEliminar = parseInt(e.currentTarget.dataset.id);
      productosCarrito = productosCarrito.filter(function(item) {
        return item.id !== idAEliminar;
      });

      localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
      renderCarrito(productosCarrito);
    });
  }

  // Total
  let total = 0;
  for (const item of lista) {
    total += parseInt(item.valor.replace("$", "").replace(".", ""));
  }

  const totalElemento = document.createElement("h3");
  totalElemento.textContent = `Total: $${total.toLocaleString("es-AR")}`;
  carritoContainer.appendChild(totalElemento);
}

if (carritoGuardado) {
  productosCarrito = JSON.parse(carritoGuardado);
  renderCarrito(productosCarrito);
}
