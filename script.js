// Obtenemos las referencias a los elementos del DOM
const productCards = document.querySelectorAll('.product-card');
const productosCarrito = document.getElementById('productos-carrito');
const totalPriceElement = document.getElementById('total');
const limpiarCarritoButton = document.getElementById('limpiar-carrito');
const checkoutButton = document.getElementById('checkout-button');

// Carrito de compras en localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el carrito en la vista
function actualizarCarrito() {
    productosCarrito.innerHTML = ''; // Limpiamos el contenido actual del carrito
    let total = 0;

    // Si el carrito está vacío, mostramos un mensaje
    if (carrito.length === 0) {
        productosCarrito.innerHTML = '<p>Tu carrito está vacío. Añade productos para comenzar.</p>';
        totalPriceElement.innerText = 'Total: $0';
        limpiarCarritoButton.style.display = 'none';
        return;
    }

    // Si hay productos en el carrito, mostramos cada uno
    carrito.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-carrito');
        productoDiv.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <button class="eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        productosCarrito.appendChild(productoDiv);

        // Calculamos el total
        total += producto.precio * producto.cantidad;
    });

    // Mostramos el total
    totalPriceElement.innerText = `Total: $${total.toFixed(2)}`;

    // Si el carrito tiene productos, mostramos el botón de limpiar
    limpiarCarritoButton.style.display = carrito.length > 0 ? 'inline-block' : 'none';

    // Actualizamos el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Agregar el evento de eliminar productos
    const eliminarButtons = document.querySelectorAll('.eliminar');
    eliminarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productoId = e.target.getAttribute('data-id');
            eliminarDelCarrito(productoId);
        });
    });
}

// Función para añadir productos al carrito
function añadirAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(producto => producto.id === id);

    if (productoExistente) {
        // Si el producto ya está en el carrito, incrementamos la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no está en el carrito, lo añadimos con cantidad 1
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    const producto = carrito.find(producto => producto.id === id);

    if (producto.cantidad > 1) {
        // Si el producto tiene más de una unidad, reducimos la cantidad
        producto.cantidad -= 1;
    } else {
        // Si solo hay una unidad, lo eliminamos del carrito
        carrito = carrito.filter(producto => producto.id !== id);
    }

    actualizarCarrito();
}

// Función para limpiar el carrito
function limpiarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Evento para añadir productos al carrito al hacer clic en el botón "Añadir al Carrito"
productCards.forEach(card => {
    const id = card.getAttribute('data-id');
    const nombre = card.querySelector('h3').innerText;
    const precioTexto = card.querySelector('strong').innerText;
    
    // Extraemos solo el número del precio (eliminando "$")
    const precio = parseFloat(precioTexto.replace('Precio: $', '').trim());
    
    // Verificamos que el precio sea un número válido antes de añadirlo
    if (!isNaN(precio)) {
        const addButton = card.querySelector('.add-to-cart');
        addButton.addEventListener('click', () => {
            añadirAlCarrito(id, nombre, precio);
        });
    } else {
        console.error('Precio inválido para el producto:', nombre);
    }
});

// Evento para limpiar el carrito
limpiarCarritoButton.addEventListener('click', limpiarCarrito);

// Evento para finalizar la compra (ahora muestra un mensaje con los detalles)
checkoutButton.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de proceder.');
    } else {
        // Mostrar los productos del carrito y el total de la compra
        let mensajeCompra = "¡Gracias por tu compra!\n\nDetalles de tu compra:\n\n";
        carrito.forEach(producto => {
            mensajeCompra += `${producto.nombre} - $${producto.precio} x ${producto.cantidad}\n`;
        });
        mensajeCompra += `\nTotal: $${calcularTotal()}`;

        // Confirmación de compra
        if (confirm(mensajeCompra + "\n¿Te gustaría proceder con el pago?")) {
            // Aquí puedes integrar el pago con un servicio real como Stripe o PayPal
            alert("Compra realizada con éxito. ¡Gracias por tu compra!");
            // Limpiar el carrito después de la compra
            carrito = [];
            actualizarCarrito();
        } else {
            alert("Compra cancelada. ¡Puedes seguir comprando!");
        }
    }
});

// Función para calcular el total de la compra
function calcularTotal() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total.toFixed(2);
}

// Inicializamos el carrito al cargar la página
actualizarCarrito();

