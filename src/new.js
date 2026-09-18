let allProducts = [];

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

const localClothes = [
  {
    id: "local-clothing-1",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Organic Cotton Crewneck Tee",
    price: 149900,
    category: "clothing",
    stock: 10,
    brand: "Eco-Shop",
  },
  {
    id: "local-clothing-2",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Recycled Denim Jacket",
    price: 349900,
    category: "clothing",
    stock: 10,
    brand: "Eco-Shop",
  },
  {
    id: "local-clothing-3",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Bamboo Fiber Joggers",
    price: 199900,
    category: "clothing",
    stock: 10,
    brand: "Eco-Shop",
  },
  {
    id: "local-clothing-4",
    image: "https://i.ebayimg.com/images/g/S2cAAOSwqbloA0cp/s-l1600.webp",
    title: "Hemp Blend Hoodie",
    price: 279900,
    category: "clothing",
    stock: 10,
    brand: "Eco-Shop",
  },
];

const localFurniture = [
  {
    id: "local-furniture-1",
    image: "./media/8.png",
    title: "Lollygagger Recycled Lounge Chair",
    price: 699900,
    category: "furniture",
    stock: 10,
    brand: "Eco-Shop",
  },
  {
    id: "local-furniture-2",
    image: "./media/7.png",
    title: "Lollygagger Recycled Lounge Chair",
    price: 999900,
    category: "furniture",
    stock: 10,
    brand: "Eco-Shop",
  },
  {
    id: "local-furniture-3",
    image: "./media/6.png",
    title: "Nisswa Recycled Loveseat",
    price: 1399900,
    category: "furniture",
    stock: 10,
    brand: "Eco-Shop",
  },
  {
    id: "local-furniture-4",
    image: "./media/5.png",
    title: "Lollygagger Recycled Outdoor Chaise",
    price: 1199900,
    category: "furniture",
    stock: 10,
    brand: "Eco-Shop",
  },
];

const clothingCategories = ["mens-shirts", "tops", "womens-dresses"];

const footwearCategories = ["mens-shoes", "womens-shoes"];

const accessoryCategories = [
  "mens-watches",
  "womens-watches",
  "womens-jewellery",
  "sunglasses",
];

const bathKeywords = [
  "bath",
  "towel",
  "soap",
  "shower",
  "lotion",
  "cream",
  "body",
  "skin",
  "cleanser",
  "scrub",
  "shampoo",
  "conditioner",
  "bathroom",
];

const beddingKeywords = [
  "bed",
  "bedding",
  "bedsheet",
  "bed sheet",
  "sheet",
  "sheets",
  "pillow",
  "pillowcase",
  "blanket",
  "comforter",
  "duvet",
  "mattress",
  "quilt",
  "bedspread",
];

const footwearKeywords = [
  "shoe",
  "shoes",
  "slipper",
  "slippers",
  "sandal",
  "sandals",
  "sneaker",
  "sneakers",
  "boot",
  "boots",
  "footwear",
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

// CATEGORY CHECKS

function isBathProduct(product) {
  const text =
    `${product.title} ${product.description || ""} ${product.category}`.toLowerCase();

  return bathKeywords.some((keyword) => text.includes(keyword));
}

function isBeddingProduct(product) {
  const text =
    `${product.title} ${product.description || ""} ${product.category}`.toLowerCase();

  return beddingKeywords.some((keyword) => text.includes(keyword));
}

function isFootwearProduct(product) {
  const categoryMatch = footwearCategories.includes(product.category);

  const titleMatch = footwearKeywords.some((keyword) =>
    product.title.toLowerCase().includes(keyword),
  );

  return categoryMatch || titleMatch;
}

function isAccessoryProduct(product) {
  const categoryMatch = accessoryCategories.includes(product.category);

  const titleMatch = accessoryKeywords.some((keyword) =>
    product.title.toLowerCase().includes(keyword),
  );

  return categoryMatch || titleMatch;
}

// GET ECO-SHOP PRODUCTS

function getEcoShopProducts(products) {
  const clothing = products.filter((product) =>
    clothingCategories.includes(product.category),
  );

  const bath = products.filter((product) => isBathProduct(product));

  const bedding = products.filter((product) => isBeddingProduct(product));

  const homeGoods = products.filter(
    (product) =>
      product.category === "home-decoration" ||
      product.category === "kitchen-accessories",
  );

  const furniture = products.filter(
    (product) => product.category === "furniture",
  );

  const footwear = products.filter((product) => isFootwearProduct(product));

  const accessories = products.filter((product) => isAccessoryProduct(product));

  const ecoShopProducts = [
    ...clothing,
    ...bath,
    ...bedding,
    ...homeGoods,
    ...furniture,
    ...footwear,
    ...accessories,
  ];

  return ecoShopProducts.filter(
    (product, index, array) =>
      index === array.findIndex((item) => item.id === product.id),
  );
}

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

      brand: product.brand || "No Brand",

      category: product.category,
    });
  }

  saveCart();

  updateCartCount();
}

// RENDER PRODUCTS

function renderProducts(products) {
  const productsGrid = document.getElementById("new-products-grid");

  if (!productsGrid) {
    console.log("❌ new-products-grid not found");

    return;
  }

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const image = product.thumbnail || product.image;

    let price;

    if (product.thumbnail) {
      price = Math.round(product.price * 15000);
    } else {
      price = product.price;
    }

    productsGrid.innerHTML += `

                <div data-product-id="${product.id}" class="flex flex-col h-full p-3 hover:shadow-[0px_0px_5px_black] rounded-xl transition cursor-pointer">

                    <img src="${image}" alt="${product.title}" class="w-full h-[280px] object-contain">

                    <h4 class="font-semibold mt-2 line-clamp-2">
                        ${product.title}
                    </h4>

                    <p class="text-[#668c4a] font-semibold mt-1">
                        Rp${price.toLocaleString("id-ID")}
                    </p>

                    <button data-add-cart="${product.id}" type="button" class="w-full mt-auto bg-[#668c4a] text-white font-semibold py-2 rounded-full hover:bg-[#557a3c] transition mt-4">
                        Add to Cart
                    </button>

                </div>

            `;
  });

  connectProductCards();

  connectAddToCartButtons();

  const productCount = document.getElementById("product-count");

  if (productCount) {
    productCount.textContent = `${products.length} products`;
  }
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

      /*
       * Local products do not exist
       * in DummyJSON, so they cannot
       * use the DummyJSON product
       * details page.
       */

      if (String(productId).startsWith("local-")) {
        return;
      }

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

      const product = allProducts.find(
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

// LOAD PRODUCTS

function loadProducts() {
  fetch("https://dummyjson.com/products?limit=0")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json();
    })
    .then((data) => {
      const apiProducts = data.products;

      const ecoShopApiProducts = getEcoShopProducts(apiProducts);

      allProducts = [...localClothes, ...localFurniture, ...ecoShopApiProducts];

      renderProducts(allProducts);

      console.log(
        "API products in Eco-Shop categories:",
        ecoShopApiProducts.length,
      );

      console.log("Local clothing:", localClothes.length);

      console.log("Local furniture:", localFurniture.length);

      console.log("Total Eco-Shop products:", allProducts.length);
    })
    .catch((error) => {
      console.error("Product API Error:", error);

      allProducts = [...localClothes, ...localFurniture];

      renderProducts(allProducts);
    });
}

// SORT PRODUCTS

function sortProducts() {
  const sortValue = document.getElementById("sort-products").value;

  let sortedProducts = [...allProducts];

  if (sortValue === "low") {
    sortedProducts.sort((a, b) => {
      const priceA = a.thumbnail ? Math.round(a.price * 15000) : a.price;

      const priceB = b.thumbnail ? Math.round(b.price * 15000) : b.price;

      return priceA - priceB;
    });
  }

  if (sortValue === "high") {
    sortedProducts.sort((a, b) => {
      const priceA = a.thumbnail ? Math.round(a.price * 15000) : a.price;

      const priceB = b.thumbnail ? Math.round(b.price * 15000) : b.price;

      return priceB - priceA;
    });
  }

  if (sortValue === "name") {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderProducts(sortedProducts);
}

// SORT SELECT

const sortProductsSelect = document.getElementById("sort-products");

if (sortProductsSelect) {
  sortProductsSelect.addEventListener("change", sortProducts);
}

// LOAD

loadProducts();

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
