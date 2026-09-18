let allHomeGoods = [];

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// UPDATE CART COUNT

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");

  if (!cartCount) {
    return;
  }

  const totalProducts = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalProducts;

  if (totalProducts > 0) {
    cartCount.classList.remove("hidden");

    cartCount.classList.add("flex");
  } else {
    cartCount.classList.add("hidden");

    cartCount.classList.remove("flex");
  }
}

// SAVE CART

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

// ADD PRODUCT TO CART

function addProductToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    if (existingProduct.quantity < existingProduct.stock) {
      existingProduct.quantity++;
    }
  } else {
    cart.push({
      id: product.id,

      title: product.title,

      price: product.price,

      thumbnail: product.thumbnail,

      quantity: 1,

      stock: product.stock || 10,

      brand: product.brand || "No Brand",

      category: product.category,
    });
  }

  saveCart();

  updateCartCount();
}

// RENDER HOME GOODS

function renderHomeGoods() {
  const homeGoodsGrid = document.getElementById("homegoods-grid");

  console.log("Rendering into:", homeGoodsGrid);

  if (!homeGoodsGrid) {
    console.log("❌ homegoods-grid not found");

    return;
  }

  homeGoodsGrid.innerHTML = "";

  allHomeGoods.forEach((product) => {
    const price = Math.round(product.price * 15000);

    homeGoodsGrid.innerHTML += `

                <div data-product-id="${product.id}" class="flex flex-col h-full p-3 hover:shadow-[0px_0px_5px_black] rounded-xl cursor-pointer">

                    <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-[280px] object-contain">

                    <h4 class="font-semibold mt-2">
                        ${product.title}
                    </h4>

                    <p class="text-[#668c4a] font-semibold">
                        Rp${price.toLocaleString("id-ID")}
                    </p>

                    <button data-add-cart="${product.id}" type="button" class="w-full mt-auto bg-[#668c4a] text-white font-semibold py-2 rounded-full hover:bg-[#557a3c] transition">
                        Add to Cart
                    </button>

                </div>

            `;
  });

  connectProductCards();

  connectAddToCartButtons();

  console.log("✅ Home goods rendered:", allHomeGoods.length);
}

// CONNECT PRODUCT CARDS

function connectProductCards() {
  const productCards = document.querySelectorAll("[data-product-id]");

  productCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-cart]");

      if (addButton) {
        return;
      }

      const productId = card.dataset.productId;

      window.location.href = `./product-details.html?id=${productId}`;
    });
  });
}

// CONNECT ADD TO CART BUTTONS

function connectAddToCartButtons() {
  const addButtons = document.querySelectorAll("[data-add-cart]");

  addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const productId = Number(button.dataset.addCart);

      const product = allHomeGoods.find((item) => item.id === productId);

      if (!product) {
        return;
      }

      addProductToCart(product);

      button.innerHTML = `
                        <i class="fa-solid fa-check mr-2"></i>
                        Added
                    `;

      setTimeout(() => {
        button.innerHTML = "Add to Cart";
      }, 1000);
    });
  });
}

// LOAD HOME GOODS

function loadHomeGoods() {
  const homeGoodsGrid = document.getElementById("homegoods-grid");

  if (!homeGoodsGrid) {
    return;
  }

  Promise.all([
    fetch("https://dummyjson.com/products/category/home-decoration"),

    fetch("https://dummyjson.com/products/category/kitchen-accessories"),
  ])
    .then(async ([homeResponse, kitchenResponse]) => {
      if (!homeResponse.ok || !kitchenResponse.ok) {
        throw new Error("Failed to fetch home goods");
      }

      const homeData = await homeResponse.json();

      const kitchenData = await kitchenResponse.json();

      return [...homeData.products, ...kitchenData.products];
    })
    .then((products) => {
      allHomeGoods = products;

      console.log("Home goods:", allHomeGoods);

      console.log("Total home goods:", allHomeGoods.length);

      renderHomeGoods();
    })
    .catch((error) => {
      console.error("Home Goods API Error:", error);
    });
}

// HOME GOODS GRID

const homeGoodsGrid = document.getElementById("homegoods-grid");

console.log("HOME GOODS GRID:", homeGoodsGrid);

if (homeGoodsGrid) {
  console.log("✅ HOME GOODS GRID FOUND");

  loadHomeGoods();
}

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

// INITIAL CART COUNT

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
