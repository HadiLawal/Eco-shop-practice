let allFootwear = [];


let cart =
    JSON.parse(sessionStorage.getItem("cart")) || [];


const footwearCategories = [
    "mens-shoes",
    "womens-shoes"
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
    "footwear"
];


// UPDATE CART COUNT

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");


    if (!cartCount) {
        return;
    }


    const totalProducts =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalProducts;


    if (totalProducts > 0) {

        cartCount.classList.remove(
            "hidden"
        );

        cartCount.classList.add(
            "flex"
        );

    } else {

        cartCount.classList.add(
            "hidden"
        );

        cartCount.classList.remove(
            "flex"
        );

    }

}


// SAVE CART

function saveCart() {

    sessionStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ADD PRODUCT TO CART

function addProductToCart(product) {

    const existingProduct =
        cart.find(
            (item) =>
                item.id === product.id
        );


    if (existingProduct) {

        if (
            existingProduct.quantity <
            existingProduct.stock
        ) {

            existingProduct.quantity++;

        }

    } else {

        cart.push({

            id: product.id,

            title: product.title,

            price: product.price,

            thumbnail: product.thumbnail,

            quantity: 1,

            stock:
                product.stock || 10,

            brand:
                product.brand ||
                "No Brand",

            category:
                product.category

        });

    }


    saveCart();

    updateCartCount();

}


// RENDER FOOTWEAR

function renderFootwear() {

    const footwearGrid =
        document.getElementById(
            "footwear-grid"
        );


    if (!footwearGrid) {

        console.log(
            "❌ footwear-grid not found"
        );

        return;

    }


    footwearGrid.innerHTML = "";


    allFootwear.forEach(
        (product) => {

            const price =
                Math.round(
                    product.price *
                    15000
                );


            footwearGrid.innerHTML += `

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

        }
    );


    connectProductCards();

    connectAddToCartButtons();


    console.log(
        "✅ Footwear rendered:",
        allFootwear.length
    );

}


// CONNECT PRODUCT CARDS

function connectProductCards() {

    const productCards =
        document.querySelectorAll(
            "[data-product-id]"
        );


    productCards.forEach(
        (card) => {

            card.addEventListener(
                "click",
                (event) => {

                    const addButton =
                        event.target.closest(
                            "[data-add-cart]"
                        );


                    if (addButton) {
                        return;
                    }


                    const productId =
                        card.dataset.productId;


                    window.location.href =
                        `./product-details.html?id=${productId}`;

                }
            );

        }
    );

}


// CONNECT ADD TO CART BUTTONS

function connectAddToCartButtons() {

    const addButtons =
        document.querySelectorAll(
            "[data-add-cart]"
        );


    addButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const productId =
                        Number(
                            button.dataset.addCart
                        );


                    const product =
                        allFootwear.find(
                            (item) =>
                                item.id ===
                                productId
                        );


                    if (!product) {
                        return;
                    }


                    addProductToCart(
                        product
                    );


                    button.innerHTML = `
                        <i class="fa-solid fa-check mr-2"></i>
                        Added
                    `;


                    setTimeout(
                        () => {

                            button.innerHTML =
                                "Add to Cart";

                        },
                        1000
                    );

                }
            );

        }
    );

}


// LOAD FOOTWEAR

function loadFootwear() {

    const footwearGrid =
        document.getElementById(
            "footwear-grid"
        );


    if (!footwearGrid) {
        return;
    }


    fetch(
        "https://dummyjson.com/products?limit=0"
    )
        .then(
            (response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch products"
                    );

                }


                return response.json();

            }
        )
        .then(
            (data) => {

                allFootwear =
                    data.products.filter(
                        (product) => {

                            const categoryMatch =
                                footwearCategories.includes(
                                    product.category
                                );


                            const titleMatch =
                                footwearKeywords.some(
                                    (keyword) =>
                                        product.title
                                            .toLowerCase()
                                            .includes(
                                                keyword
                                            )
                                );


                            return (
                                categoryMatch ||
                                titleMatch
                            );

                        }
                    );


                console.log(
                    "Footwear:",
                    allFootwear
                );


                console.log(
                    "Total footwear:",
                    allFootwear.length
                );


                renderFootwear();

            }
        )
        .catch(
            (error) => {

                console.error(
                    "Footwear API Error:",
                    error
                );

            }
        );

}


// FOOTWEAR GRID

const footwearGrid =
    document.getElementById(
        "footwear-grid"
    );


console.log(
    "FOOTWEAR GRID:",
    footwearGrid
);


if (footwearGrid) {

    console.log(
        "✅ FOOTWEAR GRID FOUND"
    );


    loadFootwear();

}


// SEARCH

const searchForm =
    document.getElementById(
        "site-search-form"
    );


const searchInput =
    document.getElementById(
        "site-search-input"
    );


if (searchForm) {

    searchForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();


            const query =
                searchInput.value.trim();


            if (query) {

                const isInSrcFolder =
                    window.location.pathname.includes(
                        "/src/"
                    );


                const searchPath =
                    isInSrcFolder
                        ? "search.html"
                        : "src/search.html";


                window.location.href =
                    `${searchPath}?q=${encodeURIComponent(query)}`;

            }

        }
    );

}

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
