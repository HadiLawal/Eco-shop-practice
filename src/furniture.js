const localFurniture = [
    {
        id: "local-furniture-1",
        image: "./media/8.png",
        title: "Lollygagger Recycled Lounge Chair",
        price: 699900,
        stock: 10,
        brand: "Eco-Shop",
        category: "furniture"
    },
    {
        id: "local-furniture-2",
        image: "./media/7.png",
        title: "Lollygagger Recycled Lounge Chair",
        price: 999900,
        stock: 10,
        brand: "Eco-Shop",
        category: "furniture"
    },
    {
        id: "local-furniture-3",
        image: "./media/6.png",
        title: "Nisswa Recycled Loveseat",
        price: 1399900,
        stock: 10,
        brand: "Eco-Shop",
        category: "furniture"
    },
    {
        id: "local-furniture-4",
        image: "./media/5.png",
        title: "Lollygagger Recycled Outdoor Chaise",
        price: 1199900,
        stock: 10,
        brand: "Eco-Shop",
        category: "furniture"
    }
];


let allFurniture = [];


let cart =
    JSON.parse(sessionStorage.getItem("cart")) || [];


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

            thumbnail:
                product.thumbnail ||
                product.image,

            quantity: 1,

            stock:
                product.stock || 10,

            brand:
                product.brand ||
                "Eco-Shop",

            category:
                product.category ||
                "furniture"

        });

    }


    saveCart();

    updateCartCount();

}


// RENDER FURNITURE

function renderFurniture() {

    const furnitureGrid =
        document.getElementById(
            "furniture-grid"
        );


    if (!furnitureGrid) {

        console.log(
            "❌ furniture-grid not found"
        );

        return;

    }


    furnitureGrid.innerHTML = "";


    allFurniture.forEach(
        (product) => {

            const image =
                product.thumbnail ||
                product.image;


            let price;


            if (product.thumbnail) {

                price =
                    Math.round(
                        product.price *
                        15000
                    );

            } else {

                price =
                    product.price;

            }


            furnitureGrid.innerHTML += `

                <div data-product-id="${product.id}" class="flex flex-col h-full p-3 hover:shadow-[0px_0px_5px_black] rounded-xl cursor-pointer">

                    <img src="${image}" alt="${product.title}" class="w-full h-[280px] object-contain">

                    <h4 class="font-semibold mt-2">
                        ${product.title}
                    </h4>

                    <p class="text-[#668c4a] font-semibold">
                        ${product.thumbnail ? `Rp${price.toLocaleString("id-ID")}` : `Rp${price.toLocaleString("id-ID")}`}
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
        "✅ Furniture rendered:",
        allFurniture.length
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


                    /*
                     * DummyJSON products use
                     * numeric IDs.
                     *
                     * Local furniture uses
                     * string IDs, so we also
                     * allow those products
                     * to be stored in the cart.
                     */

                    if (
                        typeof productId ===
                        "string" &&
                        productId.startsWith(
                            "local-"
                        )
                    ) {

                        return;

                    }


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
                        button.dataset.addCart;


                    const product =
                        allFurniture.find(
                            (item) =>
                                String(item.id) ===
                                String(productId)
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


// LOAD FURNITURE

function loadFurniture() {

    const furnitureGrid =
        document.getElementById(
            "furniture-grid"
        );


    if (!furnitureGrid) {
        return;
    }


    fetch(
        "https://dummyjson.com/products/category/furniture"
    )
        .then(
            (response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch furniture"
                    );

                }


                return response.json();

            }
        )
        .then(
            (data) => {

                allFurniture = [
                    ...localFurniture,
                    ...data.products
                ];


                console.log(
                    "Local furniture:",
                    localFurniture
                );


                console.log(
                    "API furniture:",
                    data.products
                );


                console.log(
                    "Total furniture:",
                    allFurniture.length
                );


                renderFurniture();

            }
        )
        .catch(
            (error) => {

                console.error(
                    "Furniture API Error:",
                    error
                );


                allFurniture = [
                    ...localFurniture
                ];


                renderFurniture();

            }
        );

}


// FURNITURE GRID

const furnitureGrid =
    document.getElementById(
        "furniture-grid"
    );


console.log(
    "FURNITURE GRID:",
    furnitureGrid
);


if (furnitureGrid) {

    console.log(
        "✅ FURNITURE GRID FOUND"
    );


    loadFurniture();

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
