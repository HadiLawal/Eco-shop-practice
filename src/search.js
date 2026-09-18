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

function cardHTML(product) {
  return `
        <div data-product-id="${product.id}" class="p-5 flex flex-col h-full w-full cursor-pointer">
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain">
            <h4 class="font-semibold mt-2">${product.title}</h4>
            <small>${product.price}</small>
            <button data-add-cart="${product.id}" type="button" class="w-full mt-auto bg-[#668c4a] text-white font-semibold py-2 rounded-full hover:bg-[#557a3c] transition">
                Add to Cart
            </button>
        </div>
    `;
}

function connectProductCards() {
  const productCards = document.querySelectorAll("[data-product-id]");

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
}

function connectAddToCartButtons() {
  const addButtons = document.querySelectorAll("[data-add-cart]");

  addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const productId = button.dataset.addCart;

      const product = window.searchProducts.find(
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

function runSearch() {
  const params = new URLSearchParams(window.location.search);

  const query = params.get("q") || "";

  document.getElementById("search-query").textContent = query;

  fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=100`,
  )
    .then((res) => res.json())

    .then((data) => {
      const results = data.products.map((p) => ({
        id: p.id,

        image: p.thumbnail,

        thumbnail: p.thumbnail,

        title: p.title,

        price: p.price,

        stock: p.stock,

        brand: p.brand || "No Brand",

        category: p.category,
      }));

      window.searchProducts = results;

      const resultsContainer = document.getElementById("search-results");

      const emptyState = document.getElementById("search-empty");

      const countLabel = document.getElementById("search-count");

      if (results.length === 0) {
        resultsContainer.innerHTML = "";

        emptyState.classList.remove("hidden");

        countLabel.textContent = "";
      } else {
        emptyState.classList.add("hidden");

        resultsContainer.innerHTML = results
          .map((product) =>
            cardHTML({
              id: product.id,

              image: product.image,

              title: product.title,

              price: `Rp${Math.round(product.price * 15000).toLocaleString("id-ID")}`,
            }),
          )
          .join("");

        countLabel.textContent = `${results.length} product${results.length > 1 ? "s" : ""} found`;

        connectProductCards();

        connectAddToCartButtons();
      }
    })

    .catch((error) => {
      console.error("Search Error:", error);
    });
}

runSearch();

updateCartCount();

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
