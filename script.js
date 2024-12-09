// Fade-in animation on scroll
document.addEventListener('DOMContentLoaded', function () {
    const faders = document.querySelectorAll('.fade-in');
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target);
        });
    }, options);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});

// Array of products
const products = [
    {
        id: 1,
        name: 'Macbook Pro 2022',
        price: 199.99,
        image: 'images/laptop.jpg'
    },
    {
        id: 2,
        name: 'Lenovo',
        price: 299.99,
        image: 'images/laptop.jpg'
    },
    {
        id: 3,
        name: 'Hp',
        price: 399.99,
        image: 'images/laptop.jpg'
    },
    {
        id: 4,
        name: 'Dell',
        price: 499.99,
        image: 'images/laptop.jpg'
    }
];

// Function to generate product cards dynamically
function generateProductCards() {
    const productGrid = document.getElementById('product-grid');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="location.href='details.html?name=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.image)}&price=${product.price}'">View Details</button>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', generateProductCards);

// Initialize cart array (or load from localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) {
        console.error('Product not found!');
        return;
    }

    const productIndex = cart.findIndex(item => item.id === product.id);

    if (productIndex === -1) {
        product.quantity = 1; // Set initial quantity
        cart.push(product);
    } else {
        cart[productIndex].quantity++;
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Call renderCart to update the cart display immediately
    renderCart();

    // Show success message
    const message = document.createElement('div');
    message.textContent = 'Product added to your cart!';
    message.style.cssText = `
        position: fixed;
        top: 10%;
        right: 10%;
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}



// Function to render the cart on the cart.html page
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    let subtotal = 0;

    // Clear previous cart items
    cartItemsContainer.innerHTML = "";

    console.log("Rendering cart..."); // Debugging line
    console.log(cart); // Debugging: check the cart contents

    // Loop through cart and generate rows
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = `
            <tr>
                <td>${item.name}</td>
                <td><img src="${item.image}" alt="${item.name}" style="width: 50px;"></td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td>
                    <button onclick="removeItem(${index})">Remove</button>
                </td>
            </tr>
        `;
        cartItemsContainer.innerHTML += row;
    });

    // Calculate totals
    const tax = subtotal * 0.05; // 5% tax
    const shipping = 10; // Flat shipping fee
    const total = subtotal + tax + shipping;

    // Update summary elements
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}

// Function to update the quantity of a product in the cart
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return; // Prevent invalid quantity

    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem("cart", JSON.stringify(cart)); // Save changes
    renderCart(); // Re-render the cart
}

// Function to remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1); // Remove item from the cart array
    localStorage.setItem("cart", JSON.stringify(cart)); // Save changes
    renderCart(); // Re-render the cart
}

// Render the cart when the cart.html page loads
if (document.title === "Cart - TechVibe Store") {
    renderCart();
}


