const localClothes = [
  {
    id: "local-clothing-1",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Organic Cotton Crewneck Tee",
    price: 149900,
    stock: 10,
    brand: "Eco-Shop",
    category: "clothing",
  },
  {
    id: "local-clothing-2",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Recycled Denim Jacket",
    price: 349900,
    stock: 10,
    brand: "Eco-Shop",
    category: "clothing",
  },
  {
    id: "local-clothing-3",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Bamboo Fiber Joggers",
    price: 199900,
    stock: 10,
    brand: "Eco-Shop",
    category: "clothing",
  },
  {
    id: "local-clothing-4",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Hemp Blend Hoodie",
    price: 279900,
    stock: 10,
    brand: "Eco-Shop",
    category: "clothing",
  },
];

let allClothes = [];

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

      thumbnail: product.thumbnail || product.image,

      quantity: 1,

      stock: product.stock || 10,

      brand: product.brand || "Eco-Shop",

      category: product.category || "clothing",
    });
  }

  saveCart();

  updateCartCount();
}

// RENDER CLOTHES

function renderClothes() {
  const clothingGrid = document.getElementById("clothing-grid");

  console.log("Rendering into:", clothingGrid);

  if (!clothingGrid) {
    console.log("❌ clothing-grid not found");

    return;
  }

  clothingGrid.innerHTML = "";

  allClothes.forEach((product) => {
    const image = product.thumbnail || product.image;

    let price;

    if (product.thumbnail) {
      price = Math.round(product.price * 15000);
    } else {
      price = product.price;
    }

    clothingGrid.innerHTML += `

                <div data-product-id="${product.id}" class="flex flex-col h-full p-3 hover:shadow-[0px_0px_5px_black] rounded-xl cursor-pointer">

                    <img src="${image}" alt="${product.title}" class="w-full h-[280px] object-contain">

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

  console.log("✅ Products rendered:", allClothes.length);
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

      const productId = button.dataset.addCart;

      const product = allClothes.find(
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

// LOAD CLOTHES

function loadClothes() {
  const clothingGrid = document.getElementById("clothing-grid");

  if (!clothingGrid) {
    return;
  }

  fetch("https://dummyjson.com/products?limit=0")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return res.json();
    })
    .then((data) => {
      const clothingProducts = data.products.filter((product) => {
        return (
          product.category.includes("shirt") ||
          product.category === "tops" ||
          product.category === "womens-dresses"
        );
      });

      allClothes = [...localClothes, ...clothingProducts];

      console.log("Clothing products:", clothingProducts);

      console.log("All clothes:", allClothes);

      renderClothes();
    })
    .catch((error) => {
      console.error("API Error:", error);

      allClothes = localClothes;

      renderClothes();
    });
}

// CLOTHING GRID

const clothingGrid = document.getElementById("clothing-grid");

console.log("CLOTHING GRID:", clothingGrid);

if (clothingGrid) {
  console.log("✅ CLOTHING GRID FOUND");

  loadClothes();
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
