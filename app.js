// =========================================================
// AUTODRIVE CAR COMMERCE WEBSITE
// app.js
// =========================================================

const cars = [
    { id: 1, name: "BMW M4 Competition", category: "sports", price: 9500000, year: 2025, fuel: "Petrol", image: "images/car1.jpg" },
    { id: 2, name: "Mercedes-Benz C-Class", category: "sedan", price: 6200000, year: 2025, fuel: "Petrol", image: "images/car2.jpg" },
    { id: 3, name: "Audi Q8", category: "suv", price: 8800000, year: 2025, fuel: "Diesel", image: "images/car3.jpg" },
    { id: 4, name: "Tesla Model S", category: "electric", price: 7200000, year: 2025, fuel: "Electric", image: "images/car4.jpg" },
    { id: 5, name: "Range Rover Sport", category: "suv", price: 12500000, year: 2025, fuel: "Diesel", image: "images/car5.jpg" },
    { id: 6, name: "Porsche 911 Carrera", category: "sports", price: 18500000, year: 2025, fuel: "Petrol", image: "images/car6.jpg" }
];

let cart = [];
let wishlist = [];

const carsGrid = document.getElementById("carsGrid");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const wishlistCountEl = document.getElementById("wishlistCount");

function formatPrice(num) {
    return "₹" + num.toLocaleString("en-IN");
}

// =========================================================
// RENDER CAR CARDS
// =========================================================
function renderCars(list) {
    carsGrid.innerHTML = "";

    if (list.length === 0) {
        carsGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#777;">No cars found.</p>`;
        resultCount.textContent = "0 Cars";
        return;
    }

    list.forEach(car => {
        const isWishlisted = wishlist.includes(car.id);

        const card = document.createElement("div");
        card.className = "car-card";
        card.innerHTML = `
            <div class="car-image">
                <span class="category">${car.category.toUpperCase()}</span>
                <button class="wishlist ${isWishlisted ? "active" : ""}" data-id="${car.id}" title="Wishlist">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <img src="${car.image}" alt="${car.name}">
            </div>
            <div class="car-info">
                <h3>${car.name}</h3>
                <div class="car-details">
                    <span><i class="fa-solid fa-calendar"></i>${car.year}</span>
                    <span><i class="fa-solid fa-gas-pump"></i>${car.fuel}</span>
                </div>
                <div class="car-bottom">
                    <span class="price">${formatPrice(car.price)}</span>
                    <button class="add-cart" data-id="${car.id}">Add to Cart</button>
                </div>
            </div>
        `;
        carsGrid.appendChild(card);
    });

    resultCount.textContent = `${list.length} Cars`;
}

// =========================================================
// SEARCH + FILTER
// =========================================================
function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const filtered = cars.filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(query);
        const matchesCategory = category === "all" || car.category === category;
        return matchesSearch && matchesCategory;
    });

    renderCars(filtered);
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

// =========================================================
// WISHLIST + ADD TO CART (event delegation)
// =========================================================
carsGrid.addEventListener("click", (e) => {
    const wishlistBtn = e.target.closest(".wishlist");
    const addCartBtn = e.target.closest(".add-cart");

    if (wishlistBtn) {
        const id = Number(wishlistBtn.dataset.id);
        toggleWishlist(id);
        applyFilters();
    }

    if (addCartBtn) {
        const id = Number(addCartBtn.dataset.id);
        addToCart(id);
    }
});

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(w => w !== id);
    } else {
        wishlist.push(id);
    }
    wishlistCountEl.textContent = wishlist.length;
}

function addToCart(id) {
    const car = cars.find(c => c.id === id);
    if (!car) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...car, qty: 1 });
    }

    renderCart();
}

// =========================================================
// CART SIDEBAR
// =========================================================
function renderCart() {
    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotalEl.textContent = formatPrice(0);
        return;
    }

    cartItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>
                <small>Qty: ${item.qty}</small>
            </div>
            <button class="remove-item" data-id="${item.id}" title="Remove">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = formatPrice(total);
}

cartItemsEl.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-item");
    if (removeBtn) {
        const id = Number(removeBtn.dataset.id);
        cart = cart.filter(item => item.id !== id);
        renderCart();
    }
});

// =========================================================
// CART SIDEBAR OPEN/CLOSE
// =========================================================
cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
});

closeCart.addEventListener("click", closeCartSidebar);
overlay.addEventListener("click", closeCartSidebar);

function closeCartSidebar() {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
}

// =========================================================
// INIT
// =========================================================
renderCars(cars);
renderCart();