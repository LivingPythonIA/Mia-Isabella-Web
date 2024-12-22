// Variables Globales
const productosCarrito = document.getElementById('productos-carrito');
const totalPriceElement = document.getElementById('total');
const limpiarCarritoButton = document.getElementById('limpiar-carrito');
const checkoutButton = document.getElementById('checkout-button');
const productGrid = document.getElementById('product-grid');

// Carrito de compras en localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el carrito en la vista
function actualizarCarrito() {
    productosCarrito.innerHTML = ''; // Limpiamos el contenido actual del carrito
    let total = 0;

    if (carrito.length === 0) {
        productosCarrito.innerHTML = '<p>Tu carrito está vacío. Añade productos para comenzar.</p>';
        totalPriceElement.innerText = 'Total: $0';
        limpiarCarritoButton.style.display = 'none';
        return;
    }

    carrito.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-carrito');
        productoDiv.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <button class="eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        productosCarrito.appendChild(productoDiv);

        total += producto.precio * producto.cantidad;
    });

    totalPriceElement.innerText = `Total: $${total.toFixed(2)}`;
    limpiarCarritoButton.style.display = 'inline-block';

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Asignar eventos a los botones "Eliminar"
    const eliminarButtons = document.querySelectorAll('.eliminar');
    eliminarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            eliminarDelCarrito(id);
        });
    });
}

// Función para añadir productos al carrito
function añadirAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(producto => producto.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    const producto = carrito.find(producto => producto.id === id);

    if (producto.cantidad > 1) {
        producto.cantidad -= 1;
    } else {
        carrito = carrito.filter(producto => producto.id !== id);
    }

    actualizarCarrito();
}

// Función para limpiar el carrito
function limpiarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Función para cargar productos dinámicamente desde el JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        const productos = await respuesta.json();

        productos.forEach(producto => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.setAttribute('data-id', producto.id);

            productCard.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p><strong>Precio: $${producto.precio}</strong></p>
                <button class="add-to-cart">Añadir al Carrito</button>
            `;
            productGrid.appendChild(productCard);

            // Asignar evento al botón "Añadir al Carrito"
            const addButton = productCard.querySelector('.add-to-cart');
            addButton.addEventListener('click', () => {
                añadirAlCarrito(producto.id, producto.nombre, producto.precio);
            });
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de proceder.');
        return;
    }

    let mensajeCompra = "¡Gracias por tu compra!\n\nDetalles de tu compra:\n\n";
    carrito.forEach(producto => {
        mensajeCompra += `${producto.nombre} - $${producto.precio} x ${producto.cantidad}\n`;
    });
    mensajeCompra += `\nTotal: $${carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0).toFixed(2)}`;

    if (confirm(mensajeCompra + "\n¿Te gustaría proceder con el pago?")) {
        alert('Compra realizada con éxito. ¡Gracias!');
        carrito = [];
        actualizarCarrito();
    } else {
        alert('Compra cancelada. Puedes seguir comprando.');
    }
}

// Inicializar todo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarrito();

    limpiarCarritoButton.addEventListener('click', limpiarCarrito);
    checkoutButton.addEventListener('click', finalizarCompra);
});
