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

const localChairs = [
  {
    id: "local-chair-1",
    image: "./src/media/8.png",
    title: "Lollygagger Recycled Lounge Chair",
    price: 699900,
    stock: 10,
    brand: "Eco-Shop",
    category: "furniture",
    isLocal: true,
  },
  {
    id: "local-chair-2",
    image: "./src/media/7.png",
    title: "Lollygagger Recycled Lounge Chair",
    price: 999900,
    stock: 10,
    brand: "Eco-Shop",
    category: "furniture",
    isLocal: true,
  },
  {
    id: "local-chair-3",
    image: "./src/media/6.png",
    title: "Nisswa Recycled Loveseat",
    price: 1399900,
    stock: 10,
    brand: "Eco-Shop",
    category: "furniture",
    isLocal: true,
  },
  {
    id: "local-chair-4",
    image: "./src/media/5.png",
    title: "Lollygagger Recycled Outdoor Chaise",
    price: 1199900,
    stock: 10,
    brand: "Eco-Shop",
    category: "furniture",
    isLocal: true,
  },
];

let allChairs = [];

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

let startIndex = 0;

const visibleCount = 4;

let isAnimating = false;

const track = document.getElementById("new-arrivals");

const btnLeft = document.getElementById("scroll-left");

const btnRight = document.getElementById("scroll-right");

const seeMoreBtn = document.getElementById("see-more");

const extraContainer = document.getElementById("extra-rows");

// UPDATE CART COUNT

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
      image: product.image,
      quantity: 1,
      stock: product.stock || 10,
      brand: product.brand || "Eco-Shop",
      category: product.category || "furniture",
      isLocal: product.isLocal === true,
    });
  }

  saveCart();

  updateCartCount();
}

// PRODUCT CARD HTML

function cardHTML(chair, forCarousel = true) {
  const widthClasses = forCarousel
    ? "shrink-0 box-border w-full md:w-[calc(50%-0.625rem)] lg:w-[calc(25%-1.875rem)]"
    : "w-full";

  const price = chair.isLocal
    ? Number(chair.price)
    : Math.round(Number(chair.price) * 15000);

  const formattedPrice = `Rp${price.toLocaleString("id-ID")}`;

  return `
        <div data-product-id="${chair.id}" class="p-5 flex flex-col h-full ${widthClasses} cursor-pointer">

            <img src="${chair.image}" alt="${chair.title}" class="w-full">

            <h4 class="font-semibold mt-2">
                ${chair.title}
            </h4>

            <small class="text-[#668c4a] font-semibold">
                ${formattedPrice}
            </small>

            <button data-add-cart="${chair.id}" type="button" class="w-full mt-auto bg-[#668c4a] text-white font-semibold py-2 rounded-full hover:bg-[#557a3c] transition">
                Add to Cart
            </button>

        </div>
    `;
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

      if (String(productId).startsWith("local-")) {
        return;
      }

      window.location.href = `./src/product-details.html?id=${productId}`;
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

      const product = allChairs.find(
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

// RENDER CHAIRS

function renderChairs() {
  if (!track) {
    return;
  }

  const visibleChairs = allChairs.slice(startIndex, startIndex + visibleCount);

  track.innerHTML = visibleChairs.map((chair) => cardHTML(chair)).join("");

  track.style.transition = "none";

  track.style.transform = "translateX(0)";

  connectProductCards();

  connectAddToCartButtons();

  updateButtonStates();
}

// UPDATE BUTTON STATES

function updateButtonStates() {
  if (!btnLeft || !btnRight) {
    return;
  }

  const atStart = startIndex === 0;

  const atEnd = startIndex + visibleCount >= allChairs.length;

  btnLeft.classList.toggle("bg-[#e6e6e6]", atStart);

  btnLeft.classList.toggle("bg-[#668c4a]", !atStart);

  btnLeft.classList.toggle("pointer-events-none", atStart);

  btnLeft.classList.toggle("opacity-50", atStart);

  btnRight.classList.toggle("bg-[#e6e6e6]", atEnd);

  btnRight.classList.toggle("bg-[#668c4a]", !atEnd);

  btnRight.classList.toggle("pointer-events-none", atEnd);

  btnRight.classList.toggle("opacity-50", atEnd);
}

// SLIDE CAROUSEL

function slide(direction) {
  if (!track || isAnimating) {
    return;
  }

  isAnimating = true;

  const firstCard = track.children[0];

  if (!firstCard) {
    isAnimating = false;
    return;
  }

  const cardWidth = firstCard.getBoundingClientRect().width;

  const gap = parseFloat(window.getComputedStyle(track).gap) || 0;

  const moveBy = cardWidth + gap;

  if (direction === 1) {
    const incoming = allChairs[startIndex + visibleCount];

    if (incoming) {
      track.insertAdjacentHTML("beforeend", cardHTML(incoming));
    }

    track.style.transition = "transform 400ms ease-in-out";

    track.style.transform = `translateX(-${moveBy}px)`;
  } else {
    const incoming = allChairs[startIndex - 1];

    if (incoming) {
      track.insertAdjacentHTML("afterbegin", cardHTML(incoming));
    }

    track.style.transition = "none";

    track.style.transform = `translateX(-${moveBy}px)`;

    requestAnimationFrame(() => {
      track.style.transition = "transform 400ms ease-in-out";

      track.style.transform = "translateX(0)";
    });
  }

  setTimeout(() => {
    startIndex += direction;

    renderChairs();

    isAnimating = false;
  }, 400);
}

// LOAD CHAIRS

function loadChairs() {
  if (!track) {
    return;
  }

  fetch("https://dummyjson.com/products/category/furniture")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch furniture products");
      }

      return res.json();
    })

    .then((data) => {
      const apiChairs = data.products.map((p) => ({
        id: p.id,

        image: p.thumbnail,

        thumbnail: p.thumbnail,

        title: p.title,

        price: p.price,

        stock: p.stock,

        brand: p.brand || "No Brand",

        category: p.category,

        isLocal: false,
      }));

      allChairs = [...localChairs, ...apiChairs];

      renderChairs();
    })

    .catch((error) => {
      console.error("Chair API Error:", error);

      allChairs = localChairs;

      renderChairs();
    });
}

// LEFT BUTTON

if (btnLeft) {
  btnLeft.addEventListener("click", (e) => {
    e.preventDefault();

    if (startIndex > 0) {
      slide(-1);
    }
  });
}

// RIGHT BUTTON

if (btnRight) {
  btnRight.addEventListener("click", (e) => {
    e.preventDefault();

    if (startIndex + visibleCount < allChairs.length) {
      slide(1);
    }
  });
}

// SEE MORE / SEE LESS

if (seeMoreBtn && extraContainer) {
  seeMoreBtn.addEventListener("click", function toggleExtraRows() {
    if (seeMoreBtn.textContent.trim() === "See More") {
      const remaining = allChairs.slice(visibleCount);

      extraContainer.innerHTML = remaining
        .map((chair) => cardHTML(chair, false))
        .join("");

      extraContainer.style.opacity = "0";

      requestAnimationFrame(() => {
        extraContainer.style.opacity = "1";
      });

      connectProductCards();

      connectAddToCartButtons();

      seeMoreBtn.textContent = "See Less";
    } else {
      extraContainer.style.opacity = "0";

      setTimeout(() => {
        extraContainer.innerHTML = "";
      }, 300);

      seeMoreBtn.textContent = "See More";
    }
  });
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

// START NEW ARRIVALS

loadChairs();

// INITIAL CART COUNT

updateCartCount();
