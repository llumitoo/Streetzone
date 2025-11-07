async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('product-list');

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" width="180">
      <h3>${p.name}</h3>
      <p>${p.brand}</p>
      <p>$${p.price}</p>
      <button onclick="addToCart('${p._id}')">Agregar al carrito</button>
    `;
    container.appendChild(div);
  });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(id) {
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Producto agregado 🛒');
}

loadProducts();
