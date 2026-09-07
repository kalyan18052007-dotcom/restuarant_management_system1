
const APP = document.getElementById("app");
const toast = document.getElementById("toast");

const KEYS = {
  loggedIn: "loggedIn",
  username: "username",
  menu: "menuitems",
  orders: "orders",
  customers: "customers",
  latestOrder: "latestOrder"
};

const VIEWS = {
  login: `
    <div class="login-page">
      <div class="login-box">
        <h1>🍴 Restaurant</h1>
        <h2>Login</h2>
        <p>Restaurant Management System</p>
        <form id="loginForm">
          <div class="input-group">
            <label for="username">Username</label>
            <input id="username" type="text" autocomplete="username" required>
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input id="password" type="password" autocomplete="current-password" required>
          </div>
          <button class="login-btn" type="submit">Login</button>
          <div id="errorMessage" class="error-message"></div>
        </form>
      </div>
    </div>
  `,

  dashboard: `
    <div class="dashboard">
      <aside class="sidebar">
        <h2>🍽️ Restaurant</h2>
        <nav>
          ${navLink("dashboard","🏠 Dashboard")}
          ${navLink("menu","🍔 Menu")}
          ${navLink("order","🧾 Orders")}
          ${navLink("billing","💳 Billing")}
          ${navLink("customers","👥 Customers")}
          ${navLink("sales","💰 Sales")}
          ${navLink("reports","📊 Reports")}
        </nav>
        <button class="logout-btn logout" data-action="logout">🚪 Logout</button>
      </aside>
      <main class="main-content">
        <header class="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin!</p>
          </div>
          <div class="admin-chip">👤 ${escapeHtml(localStorage.getItem(KEYS.username) || "Admin")}</div>
        </header>

        <section class="dashboard-cards">
          <div class="dashboard-card primary">
            <h2>📊 Sales & Reports</h2>
            <p>View sales and order history</p>
            <button class="btn btn-dark" data-nav="sales">Open Reports</button>
          </div>
          <div class="stat-card"><span class="icon">💰</span><div><div class="value" id="dashTotalSales">₹0.00</div><div>Total sales</div></div></div>
          <div class="stat-card"><span class="icon">🍔</span><div><div class="value" id="dashMenuItems">0</div><div>Total Menu Items</div></div></div>
          <div class="stat-card"><span class="icon">👥</span><div><div class="value" id="dashCustomers">0</div><div>Total Customers</div></div></div>
        </section>

        <section class="recent-section">
          <div class="table-header">
            <h2>Recent Orders</h2>
            <button class="btn btn-dark" data-nav="order">+ New Order</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
              <tbody id="recentOrders"></tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `,

  menu: `
    <div class="app-page">
      <div class="container">
        <header class="page-header">
          <div><h1>🍔 Menu Management</h1><p>Manage your restaurant food items</p></div>
          <button class="back-btn" data-nav="dashboard">← Dashboard</button>
        </header>

        <section class="card-section">
          <h2>Add New Food Item</h2>
          <form id="foodForm" class="form-grid">
            <input id="foodName" type="text" placeholder="Food name" required>
            <select id="category" required>
              <option value="">Select Category</option>
              <option>Starters</option><option>Main Course</option><option>Fast Food</option>
              <option>Beverages</option><option>Desserts</option><option>South Indian</option>
            </select>
            <input id="price" type="number" min="1" step="0.01" placeholder="Price (₹)" required>
            <button class="btn btn-dark" type="submit">+ Add Item</button>
          </form>
        </section>

        <section class="card-section">
          <div class="table-header"><h2>Food Items</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Food Name</th><th>Category</th><th>Price</th><th>Action</th></tr></thead>
              <tbody id="menuTable"></tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,

  order: `
    <div class="app-page">
      <div class="container">
        <header class="page-header">
          <div><h1>🧾 Order Management</h1><p>Create and manage customer orders</p></div>
          <button class="back-btn" data-nav="dashboard">← Dashboard</button>
        </header>

        <section class="card-section">
          <h2>Customer Details</h2>
          <div class="customer-inputs">
            <input id="orderCustomerName" type="text" placeholder="Customer name">
            <input id="orderCustomerPhone" type="tel" placeholder="Phone number">
          </div>
        </section>

        <section class="card-section">
          <h2>Add Items</h2>
          <div class="add-item">
            <select id="foodSelect"><option value="">Select Food</option></select>
            <input id="quantity" type="number" min="1" value="1">
            <button class="place-btn" data-action="addItem">+ Add Item</button>
          </div>
        </section>

        <section class="card-section">
          <h2>Current Order</h2>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Food</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr></thead>
              <tbody id="orderTable"><tr id="emptyRow"><td colspan="5" class="empty-message">No items added yet.</td></tr></tbody>
            </table>
          </div>
          <div class="total-box">
            <h2>Grand Total: <span id="grandTotal">₹0.00</span></h2>
            <button class="place-btn" data-action="placeOrder">✅ Place Order</button>
          </div>
        </section>
      </div>
    </div>
  `,

  billing: `
    <div class="app-page">
      <div class="invoice" id="invoice">
        <div class="invoice-header">
          <div>
            <h1>🍽️ Tasty Restaurant</h1>
            <p>Restaurant Management System</p>
            <p>Bagepalli, Karnataka</p>
          </div>
          <div class="invoice-title">
            <h2>INVOICE</h2>
            <p>Order ID: <strong id="billOrderId">-</strong></p>
            <p>Date: <span id="billOrderDate">-</span></p>
          </div>
        </div>
        <hr>

        <div class="customer">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> <span id="billCustomerName">-</span></p>
          <p><strong>Phone:</strong> <span id="billCustomerPhone">-</span></p>
        </div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Food</th><th>Price</th><th>Quantity</th><th>Total</th></tr></thead>
            <tbody id="billItems"></tbody>
          </table>
        </div>

        <div class="summary">
          <p><span>Subtotal:</span><span id="billSubtotal">₹0.00</span></p>
          <p><span>GST (5%):</span><span id="billGst">₹0.00</span></p>
          <h2><span>Grand Total:</span><span id="billGrandTotal">₹0.00</span></h2>
        </div>

        <div class="thank-you"><h3>Thank You! 😊</h3><p>Please visit us again.</p></div>

        <div class="buttons">
          <button onclick="window.print()">🖨️ Print Bill</button>
          <button data-nav="order">+ New Order</button>
          <button data-nav="dashboard">← Dashboard</button>
        </div>
      </div>
    </div>
  `,

  customers: `
    <div class="app-page">
      <div class="container">
        <header class="page-header">
          <div><h1>👥 Customer Management</h1><p>Manage restaurant customers</p></div>
          <button class="back-btn" data-nav="dashboard">← Dashboard</button>
        </header>

        <section class="card-section">
          <h2>Add New Customer</h2>
          <form id="customerForm" class="form-grid customer-grid">
            <input id="customerName" type="text" placeholder="Customer name" required>
            <input id="customerPhone" type="tel" placeholder="Phone number" required>
            <input id="customerEmail" type="email" placeholder="Email address">
            <button class="btn btn-dark" type="submit">+ Add Customer</button>
          </form>
        </section>

        <section class="card-section">
          <div class="list-header">
            <h2>Customer List</h2>
            <input id="searchCustomer" class="search-input" type="text" placeholder="🔍 Search customer...">
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Action</th></tr></thead>
              <tbody id="customerTable"></tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,

  sales: `
    <div class="app-page">
      <div class="container">
        <header class="page-header">
          <div><h1>📊 Sales & Reports</h1><p>View restaurant sales and order history</p></div>
          <button class="back-btn" data-nav="dashboard">← Dashboard</button>
        </header>

        <section class="stats">
          <div class="stat-card"><span class="icon">💰</span><div><div class="value" id="salesTotalSales">₹0.00</div><div>Total Sales</div></div></div>
          <div class="stat-card"><span class="icon">🧾</span><div><div class="value" id="salesTotalOrders">0</div><div>Total Orders</div></div></div>
          <div class="stat-card"><span class="icon">👥</span><div><div class="value" id="salesTotalCustomers">0</div><div>Customers</div></div></div>
          <div class="stat-card"><span class="icon">📈</span><div><div class="value" id="salesAverageOrder">₹0.00</div><div>Average Order</div></div></div>
        </section>

        <section class="report">
          <div class="report-header">
            <h2>Order History</h2>
            <input id="salesSearch" class="search-input" type="text" placeholder="Search customer or order ID...">
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Date</th><th>Total</th><th>Action</th></tr></thead>
              <tbody id="ordersTable"></tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,

  reports: `
    <div class="app-page report-page">
      <div class="container">
        <header class="page-header">
          <div><h1>📊 Reports</h1><p class="subtitle">View restaurant sales and order history</p></div>
          <button class="back-btn" data-nav="dashboard">← Dashboard</button>
        </header>

        <section class="summary-cards">
          <div class="card"><h2 id="reportTotalSales">₹0.00</h2><p>Total Sales</p></div>
          <div class="card"><h2 id="reportTotalOrders">0</h2><p>Total Orders</p></div>
          <div class="card"><h2 id="reportTotalItems">0</h2><p>Total Items Sold</p></div>
        </section>

        <section class="report">
          <h2>📋 Order History</h2>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Items</th><th>Total</th></tr></thead>
              <tbody id="reportOrderTable"></tbody>
            </table>
          </div>
          <button class="refresh-btn" data-action="refreshReports">🔄 Refresh Report</button>
        </section>
      </div>
    </div>
  `
};

function navLink(view, label) {
  return `<button class="nav-link" data-nav="${view}">${label}</button>`;
}

function getJSON(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getMenu() { return getJSON(KEYS.menu); }
function getOrders() { return getJSON(KEYS.orders); }
function getCustomers() { return getJSON(KEYS.customers); }
function saveMenu(menu) { setJSON(KEYS.menu, menu); }
function saveOrders(orders) { setJSON(KEYS.orders, orders); }
function saveCustomers(customers) { setJSON(KEYS.customers, customers); }

function getTotalSales() {
  return getOrders().reduce((sum, order) => sum + (Number(order.total) || 0), 0);
}
function getTotalItemsSold() {
  return getOrders().reduce((sum, order) => sum + (Array.isArray(order.items)
    ? order.items.reduce((s, item) => s + (Number(item.quantity) || 0), 0)
    : (Number(order.quantity) || 0)), 0);
}

function getRoute() {
  return (location.hash || "#dashboard").slice(1) || "dashboard";
}

function isLoggedIn() {
  return localStorage.getItem(KEYS.loggedIn) === "true";
}

function requireLogin(view) {
  return view === "login" || isLoggedIn();
}

function navigate(view) {
  const protectedViews = new Set(["dashboard","menu","order","billing","customers","sales","reports"]);
  if (protectedViews.has(view) && !isLoggedIn()) {
    location.hash = "login";
    return;
  }
  if (view === "login" && isLoggedIn()) {
    location.hash = "dashboard";
    return;
  }
  if (location.hash !== "#" + view) {
    location.hash = view;
  } else {
    render();
  }
}

function render() {
  const view = getRoute();
  const safeView = Object.prototype.hasOwnProperty.call(VIEWS, view) ? view : (isLoggedIn() ? "dashboard" : "login");
  if (!requireLogin(safeView)) {
    location.hash = "login";
    return;
  }

  APP.innerHTML = VIEWS[safeView];
  updateActiveNav(safeView);

  switch (safeView) {
    case "login": initLogin(); break;
    case "dashboard": initDashboard(); break;
    case "menu": initMenu(); break;
    case "order": initOrder(); break;
    case "billing": initBilling(); break;
    case "customers": initCustomers(); break;
    case "sales": initSales(); break;
    case "reports": initReports(); break;
  }
}

function updateActiveNav(view) {
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === view);
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("errorMessage");

    if (username === "admin" && password === "admin123") {
      localStorage.setItem(KEYS.loggedIn, "true");
      localStorage.setItem(KEYS.username, username);
      navigate("dashboard");
    } else {
      error.textContent = "Invalid username or password.";
    }
  });
}

function logout() {
  localStorage.removeItem(KEYS.loggedIn);
  localStorage.removeItem(KEYS.username);
  navigate("login");
}

function initDashboard() {
  document.getElementById("dashTotalSales").textContent = formatCurrency(getTotalSales());
  document.getElementById("dashMenuItems").textContent = getMenu().length;
  document.getElementById("dashCustomers").textContent = getCustomers().length;

  const recent = getOrders().slice(-5).reverse();
  const tbody = document.getElementById("recentOrders");
  tbody.innerHTML = recent.length ? recent.map(order => `
    <tr>
      <td>#${escapeHtml(order.id)}</td>
      <td>${escapeHtml(order.customerName || "-")}</td>
      <td>${Array.isArray(order.items) ? order.items.reduce((s,i)=>s+(Number(i.quantity)||0),0) : 0}</td>
      <td>${formatCurrency(order.total)}</td>
      <td><span class="completed">${escapeHtml(order.status || "Completed")}</span></td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="empty-message">No orders yet.</td></tr>`;
}

function initMenu() {
  const form = document.getElementById("foodForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const item = {
      name: document.getElementById("foodName").value.trim(),
      category: document.getElementById("category").value,
      price: Number(document.getElementById("price").value)
    };
    if (!item.name || !item.category || !item.price) return;
    const menu = getMenu();
    item.id = menu.length ? Math.max(...menu.map(x => Number(x.id) || 0)) + 1 : 1;
    menu.push(item);
    saveMenu(menu);
    form.reset();
    displayMenu();
    toastMessage("Menu item added successfully.");
  });
  displayMenu();
}

function displayMenu() {
  const tbody = document.getElementById("menuTable");
  if (!tbody) return;
  const menu = getMenu();
  tbody.innerHTML = menu.length ? menu.map(item => `
    <tr>
      <td>${escapeHtml(item.id)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.category)}</td>
      <td>${formatCurrency(item.price)}</td>
      <td><button class="delete-btn" data-delete-menu="${item.id}">Delete</button></td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="empty-message">No menu items available.</td></tr>`;
  tbody.querySelectorAll("[data-delete-menu]").forEach(btn => {
    btn.addEventListener("click", () => deleteMenuItem(Number(btn.dataset.deleteMenu)));
  });
}

function deleteMenuItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  saveMenu(getMenu().filter(item => Number(item.id) !== id));
  displayMenu();
  toastMessage("Menu item deleted.");
}

let currentOrderItems = [];

function initOrder() {
  currentOrderItems = [];
  const menu = getMenu();
  const foodSelect = document.getElementById("foodSelect");
  if (!foodSelect) return;
  foodSelect.innerHTML = `<option value="">Select Food</option>` +
    menu.map(item => `<option value="${escapeAttr(item.id)}">${escapeHtml(item.name)} - ${formatCurrency(item.price)}</option>`).join("");
  renderCurrentOrder();
}

function addItem() {
  const foodId = Number(document.getElementById("foodSelect").value);
  const quantity = Number(document.getElementById("quantity").value);
  const item = getMenu().find(x => Number(x.id) === foodId);
  if (!item) return toastMessage("Please select a food item.");
  if (!Number.isInteger(quantity) || quantity < 1) return toastMessage("Please enter a valid quantity.");

  const existing = currentOrderItems.find(x => x.menuId === foodId);
  if (existing) {
    existing.quantity += quantity;
    existing.total = existing.price * existing.quantity;
  } else {
    currentOrderItems.push({
      menuId: foodId,
      name: item.name,
      price: Number(item.price),
      quantity,
      total: Number(item.price) * quantity
    });
  }
  document.getElementById("foodSelect").value = "";
  document.getElementById("quantity").value = 1;
  renderCurrentOrder();
}

function renderCurrentOrder() {
  const tbody = document.getElementById("orderTable");
  const total = currentOrderItems.reduce((sum, item) => sum + item.total, 0);
  if (!tbody) return;
  tbody.innerHTML = currentOrderItems.length ? currentOrderItems.map((item, index) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.total)}</td>
      <td><button class="delete-btn" data-remove-order-item="${index}">Remove</button></td>
    </tr>
  `).join("") : `<tr id="emptyRow"><td colspan="5" class="empty-message">No items added yet.</td></tr>`;
  document.getElementById("grandTotal").textContent = formatCurrency(total);
  tbody.querySelectorAll("[data-remove-order-item]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentOrderItems.splice(Number(btn.dataset.removeOrderItem), 1);
      renderCurrentOrder();
    });
  });
}

function placeOrder() {
  const customerName = document.getElementById("orderCustomerName").value.trim();
  const customerPhone = document.getElementById("orderCustomerPhone").value.trim();
  if (!customerName) return toastMessage("Please enter customer name.");
  if (!currentOrderItems.length) return toastMessage("Please add at least one food item.");

  const orders = getOrders();
  const numericIds = orders.map(o => Number(o.id)).filter(Number.isFinite);
  const orderId = numericIds.length ? Math.max(1000, ...numericIds) + 1 : 1001;
  const newOrder = {
    id: orderId,
    customerName,
    customerPhone,
    items: currentOrderItems.map(({menuId, ...item}) => item),
    total: currentOrderItems.reduce((sum, item) => sum + item.total, 0),
    date: new Date().toLocaleString(),
    status: "Completed"
  };
  orders.push(newOrder);
  saveOrders(orders);
  localStorage.setItem(KEYS.latestOrder, JSON.stringify(newOrder));
  currentOrderItems = [];
  toastMessage(`Order #${orderId} placed successfully.`);
  setTimeout(() => navigate("billing"), 350);
}

function initBilling() {
  const order = getJSON(KEYS.latestOrder, null);
  if (!order) {
    document.getElementById("invoice").innerHTML = `
      <div class="empty">
        <h2>No Order Found</h2>
        <p>Please create an order first.</p>
        <div class="buttons"><button data-nav="order">Create New Order</button></div>
      </div>`;
    return;
  }
  document.getElementById("billOrderId").textContent = "#" + order.id;
  document.getElementById("billOrderDate").textContent = order.date || "-";
  document.getElementById("billCustomerName").textContent = order.customerName || "-";
  document.getElementById("billCustomerPhone").textContent = order.customerPhone || "-";
  document.getElementById("billItems").innerHTML = (order.items || []).map(item => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.total)}</td>
    </tr>
  `).join("");

  const subtotal = Number(order.total) || 0;
  const gst = subtotal * 0.05;
  document.getElementById("billSubtotal").textContent = formatCurrency(subtotal);
  document.getElementById("billGst").textContent = formatCurrency(gst);
  document.getElementById("billGrandTotal").textContent = formatCurrency(subtotal + gst);
}

function initCustomers() {
  const form = document.getElementById("customerForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const customers = getCustomers();
    const customer = {
      id: customers.length ? Math.max(...customers.map(x => Number(x.id) || 0)) + 1 : 1,
      name: document.getElementById("customerName").value.trim(),
      phone: document.getElementById("customerPhone").value.trim(),
      email: document.getElementById("customerEmail").value.trim()
    };
    customers.push(customer);
    saveCustomers(customers);
    form.reset();
    displayCustomers();
    toastMessage("Customer added successfully.");
  });

  document.getElementById("searchCustomer")?.addEventListener("input", displayCustomers);
  displayCustomers();
}

function displayCustomers() {
  const tbody = document.getElementById("customerTable");
  if (!tbody) return;
  const q = (document.getElementById("searchCustomer")?.value || "").toLowerCase().trim();
  const customers = getCustomers().filter(c =>
    String(c.name || "").toLowerCase().includes(q) ||
    String(c.phone || "").toLowerCase().includes(q) ||
    String(c.email || "").toLowerCase().includes(q)
  );
  tbody.innerHTML = customers.length ? customers.map(customer => `
    <tr>
      <td>${escapeHtml(customer.id)}</td>
      <td>${escapeHtml(customer.name)}</td>
      <td>${escapeHtml(customer.phone)}</td>
      <td>${escapeHtml(customer.email || "-")}</td>
      <td><button class="delete-btn" data-delete-customer="${customer.id}">Delete</button></td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="empty-message">No customers found.</td></tr>`;

  tbody.querySelectorAll("[data-delete-customer]").forEach(btn => {
    btn.addEventListener("click", () => deleteCustomer(Number(btn.dataset.deleteCustomer)));
  });
}

function deleteCustomer(id) {
  if (!confirm("Delete this customer?")) return;
  saveCustomers(getCustomers().filter(c => Number(c.id) !== id));
  displayCustomers();
  toastMessage("Customer deleted.");
}

let salesOrders = [];

function initSales() {
  salesOrders = getOrders();
  updateSales();
  document.getElementById("salesSearch")?.addEventListener("input", () => updateSales(true));
}

function updateSales(useFilter = false) {
  salesOrders = getOrders();
  const q = useFilter ? (document.getElementById("salesSearch")?.value || "").toLowerCase().trim() : "";
  const filtered = salesOrders.filter(order =>
    !q ||
    String(order.id).includes(q) ||
    String(order.customerName || "").toLowerCase().includes(q) ||
    String(order.customerPhone || "").includes(q)
  );

  const total = salesOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const customers = new Set(salesOrders.map(order => order.customerName).filter(Boolean));
  document.getElementById("salesTotalSales").textContent = formatCurrency(total);
  document.getElementById("salesTotalOrders").textContent = salesOrders.length;
  document.getElementById("salesTotalCustomers").textContent = customers.size;
  document.getElementById("salesAverageOrder").textContent = formatCurrency(salesOrders.length ? total / salesOrders.length : 0);

  const tbody = document.getElementById("ordersTable");
  tbody.innerHTML = filtered.length ? filtered.map(order => `
    <tr>
      <td>#${escapeHtml(order.id)}</td>
      <td>${escapeHtml(order.customerName || "-")}</td>
      <td>${escapeHtml(order.customerPhone || "-")}</td>
      <td>${escapeHtml(order.date || "-")}</td>
      <td>${formatCurrency(order.total)}</td>
      <td><button class="delete-btn" data-delete-order="${order.id}">Delete</button></td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="empty-message">No orders found.</td></tr>`;

  tbody.querySelectorAll("[data-delete-order]").forEach(btn => {
    btn.addEventListener("click", () => deleteOrder(Number(btn.dataset.deleteOrder)));
  });
}

function deleteOrder(id) {
  if (!confirm("Are you sure you want to delete this order?")) return;
  const remaining = getOrders().filter(order => Number(order.id) !== id);
  saveOrders(remaining);
  const latest = getJSON(KEYS.latestOrder, null);
  if (latest && Number(latest.id) === id) localStorage.removeItem(KEYS.latestOrder);
  updateSales();
  toastMessage("Order deleted.");
}

function initReports() {
  loadReports();
}

function loadReports() {
  const orders = getOrders();
  const totalSales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalItems = getTotalItemsSold();

  document.getElementById("reportTotalSales").textContent = formatCurrency(totalSales);
  document.getElementById("reportTotalOrders").textContent = orders.length;
  document.getElementById("reportTotalItems").textContent = totalItems;

  const tbody = document.getElementById("reportOrderTable");
  tbody.innerHTML = orders.length ? orders.map((order, index) => {
    const itemCount = Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
      : (Number(order.quantity) || 0);
    return `
      <tr>
        <td>Order #${escapeHtml(order.id ?? (index + 1))}</td>
        <td>${itemCount}</td>
        <td>${formatCurrency(order.total)}</td>
      </tr>`;
  }).join("") : `<tr><td colspan="3" class="empty-message">No orders available</td></tr>`;
}

function refreshReports() {
  loadReports();
  toastMessage("Report refreshed.");
}

function formatCurrency(value) {
  return "₹" + (Number(value) || 0).toFixed(2);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}
function escapeAttr(value) {
  return escapeHtml(value);
}

let toastTimer;
function toastMessage(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    navigate(nav.dataset.nav);
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "logout") logout();
  if (action === "addItem") addItem();
  if (action === "placeOrder") placeOrder();
  if (action === "refreshReports") refreshReports();
});

window.addEventListener("hashchange", render);
window.addEventListener("pageshow", () => {
  if (!isLoggedIn() && getRoute() !== "login") location.hash = "login";
});

if (!location.hash) {
  location.hash = isLoggedIn() ? "dashboard" : "login";
} else {
  render();
}
