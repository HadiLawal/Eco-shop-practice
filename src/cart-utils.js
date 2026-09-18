function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    showAddedToast(product.title);
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
}

function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) return removeFromCart(id);

    saveCart(cart);
}

function cartTotalItems() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count-badge');
    if (!badge) return;

    const count = cartTotalItems();
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
}

function showAddedToast(title) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#668c4a] text-white px-5 py-3 rounded-full text-sm shadow-lg z-[2000] transition-opacity duration-300 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
    }

    toast.textContent = `Added "${title}" to cart`;
    toast.classList.remove('opacity-0');

    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 1800);
}

updateCartBadge();


