const searchForm = document.getElementById("site-search-form");

const searchInput = document.getElementById("site-search-input");

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (query) {
      const isInSrcFolder = window.location.pathname.includes("/src/");

      const searchPath = isInSrcFolder ? "search.html" : "src/search.html";

      window.location.href = `${searchPath}?q=${encodeURIComponent(query)}`;
    }
  });
}

// GET CART FROM SESSION STORAGE

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// CART COUNT

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");

  if (!cartCount) {
    return;
  }

  const totalProducts = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  cartCount.textContent = totalProducts;

  if (totalProducts > 0) {
    cartCount.classList.remove("hidden");

    cartCount.classList.add("flex");
  } else {
    cartCount.classList.add("hidden");

    cartCount.classList.remove("flex");
  }
}

// GET PRODUCT PRICE

function getProductPrice(product) {
  if (product.priceInRupiah !== undefined) {
    return Number(product.priceInRupiah);
  }

  if (product.isLocal === true) {
    return Number(product.price);
  }

  return Math.round(Number(product.price) * 15000);
}

// DISPLAY CART

function displayCart() {
  const cartContainer = document.getElementById("cart-container");

  if (!cartContainer) {
    return;
  }

  cartContainer.innerHTML = "";

  // EMPTY CART

  if (cart.length === 0) {
    cartContainer.innerHTML = `

            <div class="bg-white border border-gray-200 rounded-2xl p-10 text-center">

                <i class="fa-solid fa-bag-shopping text-5xl text-gray-300"></i>

                <h2 class="font-bold text-xl mt-5">
                    Your cart is empty
                </h2>

                <p class="text-gray-500 mt-2">
                    Add some products to your cart.
                </p>

                <a href="./categories.html" class="inline-flex items-center gap-2 mt-6 bg-[#668c4a] text-white px-6 py-3 rounded-xl font-semibold">

                    Continue Shopping

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

        `;

    updateCartSummary();

    updateCartCount();

    return;
  }

  // DISPLAY PRODUCTS

  cart.forEach((product, index) => {
    const price = getProductPrice(product);

    const productTotal = price * Number(product.quantity || 0);

    const article = document.createElement("article");

    article.className =
      "bg-white border border-gray-200 rounded-2xl p-5 md:p-6";

    article.innerHTML = `

            <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_40px] gap-5 items-center">

                <div class="flex items-center gap-5">

                    <div class="w-28 h-28 md:w-32 md:h-32 bg-[#f3f5ef] rounded-xl flex items-center justify-center overflow-hidden shrink-0">

                        <img
                            src="${product.thumbnail || product.image}"
                            alt="${product.title}"
                            class="w-full h-full object-contain"
                        >

                    </div>


                    <div>

                        <p class="text-xs text-[#668c4a] font-medium mb-2 uppercase">
                            ${product.category || "Product"}
                        </p>


                        <h2 class="font-semibold text-base md:text-lg leading-snug">
                            ${product.title}
                        </h2>


                        <p class="text-sm text-gray-400 mt-2">
                            ${product.brand || "Eco-Shop"}
                        </p>


                        <p class="font-semibold mt-3 md:hidden">
                            Rp${price.toLocaleString("id-ID")}
                        </p>


                        <p class="text-sm text-gray-500 mt-2 md:hidden">
                            Total:
                            Rp${productTotal.toLocaleString("id-ID")}
                        </p>

                    </div>

                </div>


                <div class="hidden md:block">

                    <p class="font-semibold">
                        Rp${price.toLocaleString("id-ID")}
                    </p>

                </div>


                <div class="flex items-center justify-between md:justify-start gap-5">

                    <div>

                        <p class="text-xs text-gray-400 mb-2 md:hidden">
                            QUANTITY
                        </p>


                        <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                            <button
                                class="decrease-cart-quantity w-9 h-9 hover:bg-[#f3f5ef] transition"
                                data-index="${index}"
                                type="button"
                            >
                                −
                            </button>


                            <span class="w-9 text-center text-sm font-medium">
                                ${product.quantity}
                            </span>


                            <button
                                class="increase-cart-quantity w-9 h-9 hover:bg-[#f3f5ef] transition"
                                data-index="${index}"
                                type="button"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-cart-product text-gray-400 hover:text-red-500 transition md:hidden"
                        data-index="${index}"
                        type="button"
                    >

                        <i class="fa-regular fa-trash-can"></i>

                    </button>

                </div>


                <button
                    class="remove-cart-product hidden md:block text-gray-400 hover:text-red-500 transition text-lg"
                    data-index="${index}"
                    type="button"
                >

                    <i class="fa-regular fa-trash-can"></i>

                </button>

            </div>

        `;

    cartContainer.appendChild(article);
  });

  addCartEvents();

  updateCartSummary();

  updateCartCount();
}

// CART BUTTON EVENTS

function addCartEvents() {
  const decreaseButtons = document.querySelectorAll(".decrease-cart-quantity");

  const increaseButtons = document.querySelectorAll(".increase-cart-quantity");

  const removeButtons = document.querySelectorAll(".remove-cart-product");

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      if (!cart[index]) {
        return;
      }

      if (Number(cart[index].quantity) > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }

      saveCart();

      displayCart();
    });
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      if (!cart[index]) {
        return;
      }

      const currentQuantity = Number(cart[index].quantity || 0);

      const stock = Number(cart[index].stock || 999999);

      if (currentQuantity < stock) {
        cart[index].quantity = currentQuantity + 1;
      }

      saveCart();

      displayCart();
    });
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      if (index < 0 || index >= cart.length) {
        return;
      }

      cart.splice(index, 1);

      saveCart();

      displayCart();
    });
  });
}

// SAVE CART

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

// UPDATE SUMMARY

function updateCartSummary() {
  let subtotal = 0;

  cart.forEach((product) => {
    const price = getProductPrice(product);

    subtotal += price * Number(product.quantity || 0);
  });

  const shipping = cart.length > 0 ? 50000 : 0;

  const discount = cart.length > 0 ? 20000 : 0;

  const total = subtotal + shipping - discount;

  const subtotalElement = document.getElementById("cart-subtotal");

  const shippingElement = document.getElementById("cart-shipping");

  const discountElement = document.getElementById("cart-discount");

  const totalElement = document.getElementById("cart-total");

  const itemCountElement = document.getElementById("cart-item-count");

  if (subtotalElement) {
    subtotalElement.textContent = `Rp${subtotal.toLocaleString("id-ID")}`;
  }

  if (shippingElement) {
    shippingElement.textContent = `Rp${shipping.toLocaleString("id-ID")}`;
  }

  if (discountElement) {
    discountElement.textContent = `-Rp${discount.toLocaleString("id-ID")}`;
  }

  if (totalElement) {
    totalElement.textContent = `Rp${total.toLocaleString("id-ID")}`;
  }

  if (itemCountElement) {
    const totalItems = cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );

    itemCountElement.textContent = `${totalItems} ${
      totalItems === 1 ? "Item" : "Items"
    }`;
  }
}

// START

displayCart();

updateCartCount();


const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    mobileNav.classList.toggle("translate-x-[120%]");
    mobileNav.classList.toggle("translate-x-0");
  });

  mobileNav.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    mobileNav.classList.remove("translate-x-0");
    mobileNav.classList.add("translate-x-[120%]");
  });

  window.addEventListener("scroll", () => {
    mobileNav.classList.remove("translate-x-0");
    mobileNav.classList.add("translate-x-[120%]");
  });
}

