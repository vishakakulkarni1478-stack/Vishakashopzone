
// Get HTML Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const cartSection = document.getElementById("cartSection");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

// Store Products and Cart Data
let products = [];
let cart = [];

let selectedCategory = "All";

// Fetch Products from JSON File
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productGrid.innerHTML = `
            <p class="no-products">
                Unable to load products.
                Please run the project using Live Server.
            </p>
        `;

        console.error(error);

    }

}

// Display Products
function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p class="no-products">
                No products found!
            </p>
        `;

        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ⭐ ${product.rating} / 5
                </div>

                <div class="product-price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <button class="add-cart-btn"
                        data-id="${product.id}">
                    🛒 Add to Cart
                </button>

            </div>
        `;

        productGrid.appendChild(card);

    });

}

// Search Products
function searchProducts() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);

}

// Search Button
searchBtn.addEventListener("click", searchProducts);

// Search While Typing
searchInput.addEventListener("input", searchProducts);

// Category Filtering
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        searchProducts();

    });

});

// Add Product to Cart
productGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const selectedProduct = products.find(
        product => product.id === productId
    );

    if (!selectedProduct) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...selectedProduct,
            quantity: 1
        });

    }

    updateCart();

});

// Update Shopping Cart
function updateCart() {

    // Calculate Total Quantity
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    // Display Cart Items
    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h4>${item.name}</h4>

                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                    × ${item.quantity}
                </p>
            </div>

            <button class="remove-btn"
                    data-id="${item.id}">
                ✕
            </button>
        `;

        cartItems.appendChild(cartItem);

    });

    // Calculate Total Price
    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    cartTotal.textContent =
        "₹" + totalPrice.toLocaleString("en-IN");

}

// Remove Product from Cart
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest(".remove-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const item = cart.find(
        product => product.id === productId
    );

    if (item) {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(
                product => product.id !== productId
            );

        }

    }

    updateCart();

});

// Open Cart
cartButton.addEventListener("click", () => {

    cartSection.classList.add("show");

});

// Close Cart
closeCart.addEventListener("click", () => {

    cartSection.classList.remove("show");

});

// Checkout Button
checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping at ShopZone! " +
        "Your total is " + cartTotal.textContent
    );

    cart = [];

    updateCart();

    cartSection.classList.remove("show");

});

// Newsletter Subscription
const newsletterForm =
    document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("emailInput").value;

    alert("Thank you for subscribing, " + email + "!");

    newsletterForm.reset();

});

// Start Website
loadProducts();

