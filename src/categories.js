let cart =
    JSON.parse(sessionStorage.getItem("cart")) || [];


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


function updateCount(id, count) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            `${count}+ products`;

    }

}


const localClothes = [

    {
        id: "local-clothing-1",
        title: "Organic Cotton Crewneck Tee",
        category: "clothing"
    },

    {
        id: "local-clothing-2",
        title: "Recycled Denim Jacket",
        category: "clothing"
    },

    {
        id: "local-clothing-3",
        title: "Bamboo Fiber Joggers",
        category: "clothing"
    },

    {
        id: "local-clothing-4",
        title: "Hemp Blend Hoodie",
        category: "clothing"
    }

];


const localFurniture = [

    {
        id: "local-furniture-1",
        title: "Lollygagger Recycled Lounge Chair",
        category: "furniture"
    },

    {
        id: "local-furniture-2",
        title: "Lollygagger Recycled Lounge Chair",
        category: "furniture"
    },

    {
        id: "local-furniture-3",
        title: "Nisswa Recycled Loveseat",
        category: "furniture"
    },

    {
        id: "local-furniture-4",
        title: "Lollygagger Recycled Outdoor Chaise",
        category: "furniture"
    }

];


function loadCategoryCounts() {

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

                const products =
                    data.products;


                // ================= CLOTHING =================

                const clothingCategories = [

                    "mens-shirts",
                    "tops",
                    "womens-dresses"

                ];


                const clothingApi =
                    products.filter(
                        (product) =>
                            clothingCategories.includes(
                                product.category
                            )
                    );


                const clothing = [

                    ...localClothes,
                    ...clothingApi

                ];


                // ================= BATH =================

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
                    "bathroom"

                ];


                const bath =
                    products.filter(
                        (product) => {

                            const text =
                                `${product.title} ${product.description || ""} ${product.category}`.toLowerCase();


                            return bathKeywords.some(
                                (keyword) =>
                                    text.includes(
                                        keyword
                                    )
                            );

                        }
                    );


                // ================= BEDDING =================

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
                    "bedspread"

                ];


                const bedding =
                    products.filter(
                        (product) => {

                            const text =
                                `${product.title} ${product.description || ""} ${product.category}`.toLowerCase();


                            return beddingKeywords.some(
                                (keyword) =>
                                    text.includes(
                                        keyword
                                    )
                            );

                        }
                    );


                // ================= HOME GOODS =================

                const homeDecoration =
                    products.filter(
                        (product) =>
                            product.category ===
                            "home-decoration"
                    );


                const kitchenAccessories =
                    products.filter(
                        (product) =>
                            product.category ===
                            "kitchen-accessories"
                    );


                const homeGoods = [

                    ...homeDecoration,
                    ...kitchenAccessories

                ];


                // ================= FURNITURE =================

                const furnitureApi =
                    products.filter(
                        (product) =>
                            product.category ===
                            "furniture"
                    );


                const furniture = [

                    ...localFurniture,
                    ...furnitureApi

                ];


                // ================= FOOTWEAR =================

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


                const footwear =
                    products.filter(
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


                // ================= ACCESSORIES =================

                const accessoryCategories = [

                    "mens-watches",
                    "womens-watches",
                    "womens-jewellery",
                    "sunglasses"

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
                    "accessories"

                ];


                const accessories =
                    products.filter(
                        (product) => {

                            const text =
                                `${product.title} ${product.description || ""} ${product.category}`.toLowerCase();


                            const categoryMatch =
                                accessoryCategories.includes(
                                    product.category
                                );


                            const keywordMatch =
                                accessoryKeywords.some(
                                    (keyword) =>
                                        text.includes(
                                            keyword
                                        )
                                );


                            return (
                                categoryMatch ||
                                keywordMatch
                            );

                        }
                    );


                // ================= NEW =================

                const allCategoryProducts = [

                    ...clothing,
                    ...bath,
                    ...bedding,
                    ...homeGoods,
                    ...furniture,
                    ...footwear,
                    ...accessories

                ];


                const uniqueProducts =
                    allCategoryProducts.filter(
                        (product, index, array) =>

                            index ===
                            array.findIndex(
                                (item) =>
                                    item.id ===
                                    product.id
                            )

                    );


                // ================= UPDATE COUNTS =================

                updateCount(
                    "new-count",
                    uniqueProducts.length
                );


                updateCount(
                    "clothing-count",
                    clothing.length
                );


                updateCount(
                    "bath-count",
                    bath.length
                );


                updateCount(
                    "bedding-count",
                    bedding.length
                );


                updateCount(
                    "homegoods-count",
                    homeGoods.length
                );


                updateCount(
                    "furniture-count",
                    furniture.length
                );


                updateCount(
                    "footwear-count",
                    footwear.length
                );


                updateCount(
                    "accessories-count",
                    accessories.length
                );


                // ================= CONSOLE =================

                console.log(
                    "Total API products:",
                    products.length
                );


                console.log(
                    "New:",
                    uniqueProducts.length
                );


                console.log(
                    "Clothing:",
                    clothing.length
                );


                console.log(
                    "Bath:",
                    bath.length
                );


                console.log(
                    "Bedding:",
                    bedding.length
                );


                console.log(
                    "Home Goods:",
                    homeGoods.length
                );


                console.log(
                    "Furniture:",
                    furniture.length
                );


                console.log(
                    "Footwear:",
                    footwear.length
                );


                console.log(
                    "Accessories:",
                    accessories.length
                );

            }
        )

        .catch(
            (error) => {

                console.error(
                    "Category Count Error:",
                    error
                );


                // Local products still count if API fails

                updateCount(
                    "clothing-count",
                    localClothes.length
                );


                updateCount(
                    "furniture-count",
                    localFurniture.length
                );


                updateCount(
                    "new-count",
                    localClothes.length +
                    localFurniture.length
                );

            }
        );

}


loadCategoryCounts();


// UPDATE CART NUMBER WHEN PAGE LOADS

updateCartCount();


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
