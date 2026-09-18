const accessoryCategories = [
  "mens-watches",
  "womens-watches",
  "womens-jewellery",
  "sunglasses",
];

const accessoryKeywords = [
  "watch",
  "watches",
  "jewelry",
  "jewellery",
  "necklace",
  "bracelet",
  "ring",
  "earring",
  "earrings",
  "sunglasses",
  "glasses",
  "bag",
  "bags",
  "wallet",
  "wallets",
  "purse",
  "purses",
  "handbag",
  "handbags",
  "belt",
  "belts",
  "accessory",
  "accessories",
];

// CART

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

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

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

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

      stock: product.stock,

      brand: product.brand || "No Brand",

      category: product.category,
    });
  }

  saveCart();

  updateCartCount();
}

// ACCESSORY FILTER

function isAccessoryProduct(product) {
  const text =
    `${product.title} ${product.description || ""} ${product.category}`.toLowerCase();

  const categoryMatch = accessoryCategories.includes(
    product.category.toLowerCase(),
  );

  const keywordMatch = accessoryKeywords.some((keyword) =>
    text.includes(keyword),
  );

  return categoryMatch || keywordMatch;
}

// LOAD ACCESSORIES

function loadAccessories() {
  fetch("https://dummyjson.com/products?limit=0")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json();
    })

    .then((data) => {
      const products = data.products;

      const accessories = products.filter((product) =>
        isAccessoryProduct(product),
      );

      renderAccessories(accessories);

      console.log("Accessories:", accessories);

      console.log("Accessories count:", accessories.length);
    })

    .catch((error) => {
      console.error("Accessories Error:", error);
    });
}

// RENDER ACCESSORIES

function renderAccessories(products) {
  const accessoriesGrid = document.getElementById("accessories-grid");

  if (!accessoriesGrid) {
    console.log("❌ accessories-grid not found");

    return;
  }

  accessoriesGrid.innerHTML = "";

  products.forEach((product) => {
    const price = Math.round(product.price * 15000);

    accessoriesGrid.innerHTML += `
                <div data-product-id="${product.id}" class="product-card flex flex-col h-full p-3 hover:shadow-[0px_0px_5px_black] rounded-xl transition cursor-pointer">
                    <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-[280px] object-contain">
                    <h4 class="font-semibold mt-2 line-clamp-2">${product.title}</h4>
                    <p class="text-[#668c4a] font-semibold mt-1">Rp${price.toLocaleString("id-ID")}</p>
                    <button data-add-cart="${product.id}" type="button" class="add-to-cart-card w-full mt-auto bg-[#668c4a] text-white font-semibold py-2 rounded-full hover:bg-[#557a3c] transition mt-4">
                        Add to Cart
                    </button>
                </div>
            `;
  });

  // PRODUCT CARD CLICK

  const productCards = accessoriesGrid.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-cart]");

      if (addButton) {
        return;
      }

      const productId = card.dataset.productId;

      window.location.href = `product-details.html?id=${productId}`;
    });
  });

  // ADD TO CART BUTTONS

  const addButtons = accessoriesGrid.querySelectorAll("[data-add-cart]");

  addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const productId = button.dataset.addCart;

      const product = products.find(
        (item) => String(item.id) === String(productId),
      );

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

// LOAD PAGE

loadAccessories();

// UPDATE CART NUMBER WHEN PAGE OPENS

updateCartCount();

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
