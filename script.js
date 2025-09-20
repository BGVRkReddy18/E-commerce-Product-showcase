// 1. PRODUCT DATA 
const products = [
    {
        id: 1,
        name: "Artisan Leather Wallet",
        price: 55.00,
        category: "Accessories",
        image: "https://www.glidinggearcompany.com/cdn/shop/files/IMG_3164.jpg?v=1682422929&width=1346",
        description: "Handcrafted leather wallet with multiple card slots and a classic design, perfect for everyday sophistication."
    },
    {
        id: 2,
        name: "Ceramic Coffee Mug",
        price: 18.50,
        category: "Home Goods",
        image: "https://ii1.pepperfry.com/media/catalog/product/3/5/1600x1760/350ml-white-ceramic--set-of-2---coffee-mug-350ml-white-ceramic--set-of-2---coffee-mug-41spf0.jpg",
        description: "Large 16oz ceramic mug with a matte finish, perfect for your morning brew. Ethically sourced and dishwasher safe."
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 35.00,
        category: "Apparel",
        image: "https://www.morningclubclothing.co.uk/cdn/shop/files/IntoTheWildernessNaturalAdultsT-Shirt-Front1_2048x2048.jpg?v=1756989845",
        description: "Ultra-soft, breathable t-shirt made from 100% organic cotton. A sustainable staple for your wardrobe."
    },
    {
        id: 4,
        name: "Mini Succulent Trio",
        price: 22.00,
        category: "Home Goods",
        image: "https://masonhome.in/cdn/shop/files/IMG_8447.heic?v=1723536135&width=1500",
        description: "A lovely set of three easy-to-care-for mini succulents with minimal upkeep and stylish ceramic pots."
    },
    {
        id: 5,
        name: "Noise-Cancelling Headphones",
        price: 199.99,
        category: "Electronics",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Bose_QuietComfort_25_Acoustic_Noise_Cancelling_Headphones_with_Carry_Case.jpg/1920px-Bose_QuietComfort_25_Acoustic_Noise_Cancelling_Headphones_with_Carry_Case.jpg",
        description: "Premium over-ear headphones with superior sound quality and crystal-clear active noise cancellation. 24-hour battery life."
    },
    {
        id: 6,
        name: "Portable Bluetooth Speaker",
        price: 79.99,
        category: "Electronics",
        image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9130.jpg?auto=webp&quality=75&width=1024&dpr=2",
        description: "Compact and powerful speaker with rich bass and ten hours of playtime. Waterproof for outdoor use."
    },
];

// 2. DOM ELEMENT SELECTION
const productGrid = document.getElementById('product-grid');
const filterSelect = document.getElementById('category-filter');
const productModal = document.getElementById('product-modal');
const cartModal = document.getElementById('cart-modal');
const purchaseModal = document.getElementById('purchase-modal');

// CART ELEMENTS
const cartCountSpan = document.getElementById('cart-count');
const openCartButton = document.getElementById('open-cart');
const addToCartButton = document.getElementById('add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartGrandTotalSpan = document.getElementById('cart-grand-total');
const checkoutButton = document.getElementById('checkout-btn');

// 3. CART DATA & LOCAL STORAGE
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let currentProductId = null; 

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

// 4. RENDERING & FILTERING
function renderProducts(productList) {
    productGrid.innerHTML = ''; 
    
    if (productList.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; font-style: italic; color: #777;">No products found in this category. Try selecting "All Items".</p>';
        return;
    }

    productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id); 

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openProductModal(product.id));

        productGrid.appendChild(card);
    });
}

function initializeFilters() {
    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        let filteredProducts = products;

        if (selectedCategory !== 'all') {
            filteredProducts = products.filter(p => p.category === selectedCategory);
        }

        renderProducts(filteredProducts);
    });
}

// 5. PRODUCT MODAL
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProductId = id; 

    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-category').textContent = product.category.toUpperCase(); 
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-image').alt = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    
    productModal.style.display = 'block';
}

// 6. CART LOGIC 
function handleAddToCart() {
    const productId = currentProductId;
    if (productId === null) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    productModal.style.display = 'none'; 
    openCartModal(); // Show the cart after adding an item
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let grandTotal = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p id="empty-cart-message" style="text-align: center; color: #777;">Your cart is empty.</p>';
        cartGrandTotalSpan.textContent = '$0.00';
        checkoutButton.disabled = true; 
        return;
    }

    checkoutButton.disabled = false; 

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="item-quantity">
                Qty: ${item.quantity}
                <button class="remove-btn" data-id="${item.id}" title="Remove item">&times;</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    cartGrandTotalSpan.textContent = `$${grandTotal.toFixed(2)}`;

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', handleRemoveFromCart);
    });
}

function handleRemoveFromCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        saveCart();
        renderCart(); 
    }
}

function openCartModal() {
    renderCart();
    cartModal.style.display = 'block';
}

function handleCheckout() {
    if (cart.length === 0) return; // Prevent empty checkout

    cartModal.style.display = 'none';

    // Show thank you modal
    purchaseModal.style.display = 'block';

    // Clear the cart
    cart = [];
    saveCart();
}


// 7. EVENT LISTENERS
addToCartButton.addEventListener('click', handleAddToCart);
openCartButton.addEventListener('click', openCartModal);
checkoutButton.addEventListener('click', handleCheckout);

// Universal Modal Closing
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const modalId = e.target.dataset.modal;
        document.getElementById(modalId).style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === purchaseModal) {
        purchaseModal.style.display = 'none';
    }
});


// 8. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products); 
    initializeFilters();
    updateCartCount(); 
});