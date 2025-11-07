const loginCard = document.getElementById("loginCard");
const panel = document.getElementById("panel");
const loginMsg = document.getElementById("loginMsg");

const tokenKey = "sz_token";

// login
document.getElementById("btnLogin").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) { loginMsg.textContent = data.message || "Error"; return; }
    localStorage.setItem(tokenKey, data.token);
    loginCard.style.display = "none";
    panel.style.display = "block";
    loadProductsAdmin();
  } catch (err) { loginMsg.textContent = err.message; }
});

// logout
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem(tokenKey);
  panel.style.display = "none";
  loginCard.style.display = "block";
});

// crear producto
document.getElementById("btnCreate").addEventListener("click", async () => {
  const name = document.getElementById("p_name").value;
  const brand = document.getElementById("p_brand").value;
  const price = Number(document.getElementById("p_price").value);
  const image = document.getElementById("p_image").value;
  const stock = Number(document.getElementById("p_stock").value);

  const token = localStorage.getItem(tokenKey);
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify({ name, brand, price, image, stock })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message || "Error");
  alert("Producto creado");
  loadProductsAdmin();
});

// mostrar productos y opciones editar/borrar
async function loadProductsAdmin() {
  const token = localStorage.getItem(tokenKey);
  const res = await fetch("/api/products", {
    headers: token ? { "Authorization": "Bearer " + token } : {}
  });
  const products = await res.json();
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.style.border = "1px solid #222";
    div.style.padding = "8px";
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <strong>${p.name}</strong> — ${p.brand} — $${p.price} — stock: ${p.stock}
      <div style="margin-top:6px;">
        <button data-id="${p._id}" class="editBtn">Editar</button>
        <button data-id="${p._id}" class="delBtn">Eliminar</button>
      </div>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll(".delBtn").forEach(b => b.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!confirm("Eliminar producto?")) return;
    const token = localStorage.getItem(tokenKey);
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Error");
    loadProductsAdmin();
  }));

  document.querySelectorAll(".editBtn").forEach(b => b.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const newName = prompt("Nombre nuevo:");
    if (!newName) return;
    const token = localStorage.getItem(tokenKey);
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type":"application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ name: newName })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Error");
    loadProductsAdmin();
  }));
}

// si ya hay token, intenta auto-login visual
if (localStorage.getItem(tokenKey)) {
  loginCard.style.display = "none";
  panel.style.display = "block";
  loadProductsAdmin();
}
