const paymentOptions = document.querySelectorAll(".payment-option");

paymentOptions.forEach((option) => {
  option.addEventListener("click", () => {
    paymentOptions.forEach((item) => {
      item.classList.remove("border-[#668c4a]", "bg-[#edf3e8]");

      item.classList.add("border-gray-200", "bg-white");
    });

    option.classList.remove("border-gray-200", "bg-white");

    option.classList.add("border-[#668c4a]", "bg-[#edf3e8]");

    const radio = option.querySelector("input[type='radio']");

    if (radio) {
      radio.checked = true;
    }
  });
});

// SEARCH

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

// GET CART

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// PRODUCT PRICE

function getProductPrice(product) {
  // Local products
  if (product.isLocal === true) {
    return Number(product.price);
  }

  // Products already stored with Rupiah price
  if (product.priceInRupiah !== undefined) {
    return Number(product.priceInRupiah);
  }

  // DummyJSON products
  return Math.round(Number(product.price) * 15000);
}

// DISPLAY PRODUCTS

function displayCheckoutProducts() {
  const checkoutProducts = document.getElementById("checkout-products");

  if (!checkoutProducts) {
    return;
  }

  checkoutProducts.innerHTML = "";

  if (cart.length === 0) {
    checkoutProducts.innerHTML = `

            <div class="text-center py-5">

                <i class="fa-solid fa-bag-shopping text-4xl text-gray-300"></i>

                <p class="text-sm text-gray-500 mt-3">
                    Your cart is empty.
                </p>

                <a href="./categories.html" class="inline-block mt-4 text-[#668c4a] font-semibold text-sm">
                    Continue Shopping
                </a>

            </div>

        `;

    updateCheckoutSummary();

    return;
  }

  cart.forEach((product) => {
    const price = getProductPrice(product);

    const quantity = Number(product.quantity || 0);

    const productTotal = price * quantity;

    const productElement = document.createElement("div");

    productElement.className = "flex items-center gap-3";

    productElement.innerHTML = `

            <div class="w-16 h-16 bg-[#f4f4f0] rounded-lg overflow-hidden shrink-0">

                <img
                    src="${product.thumbnail || product.image}"
                    alt="${product.title}"
                    class="w-full h-full object-contain"
                >

            </div>


            <div class="flex-1 min-w-0">

                <h3 class="font-semibold text-sm line-clamp-2">
                    ${product.title}
                </h3>


                <p class="text-xs text-gray-500 mt-1">
                    Qty: ${quantity}
                </p>

            </div>


            <span class="font-medium text-sm whitespace-nowrap">
                Rp${productTotal.toLocaleString("id-ID")}
            </span>

        `;

    checkoutProducts.appendChild(productElement);
  });

  updateCheckoutSummary();
}

// UPDATE SUMMARY

function updateCheckoutSummary() {
  let subtotal = 0;

  cart.forEach((product) => {
    const price = getProductPrice(product);

    const quantity = Number(product.quantity || 0);

    subtotal += price * quantity;
  });

  const shipping = cart.length > 0 ? 50000 : 0;

  const discount = cart.length > 0 ? 20000 : 0;

  const total = subtotal + shipping - discount;

  const subtotalElement = document.getElementById("checkout-subtotal");

  const shippingElement = document.getElementById("checkout-shipping");

  const discountElement = document.getElementById("checkout-discount");

  const totalElement = document.getElementById("checkout-total");

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
}

// START

displayCheckoutProducts();

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
