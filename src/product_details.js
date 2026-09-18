let currentProduct = null;

let quantity = 0;

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id");

console.log("Product ID:", productId);

if (!productId) {
  console.error("No product ID found in the URL");
} else {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      return response.json();
    })
    .then((product) => {
      console.log("Product:", product);

      currentProduct = product;

      quantity = 0;

      document.getElementById("product-quantity").textContent = quantity;

      // PRODUCT IMAGE

      document.getElementById("product-image").src = product.thumbnail;

      document.getElementById("product-image").alt = product.title;

      // PRODUCT TITLE

      document.getElementById("product-title").textContent = product.title;

      // CATEGORY

      document.getElementById("product-category").textContent =
        product.category;

      document.getElementById("product-category-info").textContent =
        product.category;

      // PRICE

      document.getElementById("product-price").textContent = `Rp${(
        product.price * 15000
      ).toLocaleString("id-ID")}`;

      // DESCRIPTION

      document.getElementById("product-description").textContent =
        product.description;

      document.getElementById("product-description-bottom").textContent =
        product.description;

      // RATING

      document.getElementById("product-rating").textContent = product.rating;

      // REVIEWS

      const reviews = product.reviews || [];

      document.getElementById("product-reviews").textContent =
        `(${reviews.length} reviews)`;

      document.getElementById("review-count").textContent =
        `${reviews.length} Reviews`;

      // BRAND

      document.getElementById("product-brand").textContent =
        product.brand || "No Brand";

      // SKU

      document.getElementById("product-sku").textContent = `PROD-${product.id}`;

      // PRODUCT WEIGHT

      document.getElementById("product-weight").textContent =
        `${product.weight} kg`;

      // PRODUCT DIMENSIONS

      document.getElementById("product-dimensions").textContent =
        `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`;

      // MINIMUM ORDER

      document.getElementById("product-min-order").textContent =
        `${product.minimumOrderQuantity} units`;

      // STOCK

      document.getElementById("product-stock").textContent =
        product.stock > 0 ? "In Stock" : "Out of Stock";

      if (product.stock <= 0) {
        document
          .getElementById("product-stock")
          .classList.remove("text-[#668c4a]");

        document.getElementById("product-stock").classList.add("text-red-500");
      }

      // PRODUCT THUMBNAILS

      const thumbnails = document.querySelectorAll(".product-thumbnail");

      thumbnails.forEach((thumbnail, index) => {
        const image = product.images[index];

        if (image) {
          thumbnail.querySelector("img").src = image;

          thumbnail.querySelector("img").alt = product.title;

          thumbnail.addEventListener("click", () => {
            document.getElementById("product-image").src = image;

            thumbnails.forEach((item) => {
              item.classList.remove("border-2", "border-[#668c4a]");

              item.classList.add("border", "border-gray-200");
            });

            thumbnail.classList.remove("border", "border-gray-200");

            thumbnail.classList.add("border-2", "border-[#668c4a]");
          });
        } else {
          thumbnail.classList.add("hidden");
        }
      });

      // CUSTOMER REVIEWS

      for (let i = 0; i < 2; i++) {
        const reviewNumber = i + 1;

        const reviewContainer = document.getElementById(
          `review-${reviewNumber}`,
        );

        const nameElement = document.getElementById(
          `review-name-${reviewNumber}`,
        );

        const commentElement = document.getElementById(
          `review-comment-${reviewNumber}`,
        );

        const dateElement = document.getElementById(
          `review-date-${reviewNumber}`,
        );

        const starsElement = document.getElementById(
          `review-stars-${reviewNumber}`,
        );

        if (reviews[i]) {
          const review = reviews[i];

          // REVIEWER NAME

          nameElement.textContent = review.reviewerName;

          // REVIEW COMMENT

          commentElement.textContent = review.comment;

          // REVIEW DATE

          const reviewDate = new Date(review.date);

          dateElement.textContent = reviewDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // REVIEW STARS

          starsElement.innerHTML = "";

          const rating = Math.round(review.rating);

          for (let star = 1; star <= 5; star++) {
            const starIcon = document.createElement("i");

            if (star <= rating) {
              starIcon.classList.add("fa-solid", "fa-star");
            } else {
              starIcon.classList.add("fa-regular", "fa-star");
            }

            starsElement.appendChild(starIcon);
          }

          reviewContainer.classList.remove("hidden");
        } else {
          reviewContainer.classList.add("hidden");
        }
      }
    })

    .catch((error) => {
      console.error("Product Error:", error);
    });

  // QUANTITY ELEMENTS

  const decreaseButton = document.getElementById("decrease-quantity");

  const increaseButton = document.getElementById("increase-quantity");

  const quantityDisplay = document.getElementById("product-quantity");

  const addToCartButton = document.getElementById("product-add-to-cart");

  // DECREASE QUANTITY

  decreaseButton.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;

      quantityDisplay.textContent = quantity;
    }

    if (quantity === 0) {
      addToCartButton.innerHTML = `
          <i class="fa-solid fa-cart-plus mr-2"></i>
          Add to Cart
        `;

      addToCartButton.classList.remove("bg-[#668c4a]", "text-white");

      addToCartButton.classList.add(
        "border-2",
        "border-[#668c4a]",
        "text-[#668c4a]",
      );
    }
  });

  // INCREASE QUANTITY

  increaseButton.addEventListener("click", () => {
    if (!currentProduct) {
      return;
    }

    if (quantity < currentProduct.stock) {
      quantity++;

      quantityDisplay.textContent = quantity;
    }
  });

  // ADD TO CART

  addToCartButton.addEventListener("click", () => {
    if (!currentProduct) {
      return;
    }

    if (currentProduct.stock <= 0) {
      return;
    }

    if (quantity === 0) {
      quantity = 1;

      quantityDisplay.textContent = quantity;
    }

    const existingProduct = cart.find((item) => item.id === currentProduct.id);

    if (existingProduct) {
      const availableStock = currentProduct.stock - existingProduct.quantity;

      if (availableStock <= 0) {
        return;
      }

      const quantityToAdd = Math.min(quantity, availableStock);

      existingProduct.quantity += quantityToAdd;
    } else {
      cart.push({
        id: currentProduct.id,

        title: currentProduct.title,

        price: currentProduct.price,

        thumbnail: currentProduct.thumbnail,

        quantity: quantity,

        stock: currentProduct.stock,

        brand: currentProduct.brand || "No Brand",

        category: currentProduct.category,
      });
    }

    // SAVE CART

    sessionStorage.setItem("cart", JSON.stringify(cart));

    console.log("Cart:", cart);

    // CHANGE BUTTON

    addToCartButton.innerHTML = `
        <i class="fa-solid fa-check mr-2"></i>
        Added
      `;

    addToCartButton.classList.remove(
      "border-2",
      "border-[#668c4a]",
      "text-[#668c4a]",
    );

    addToCartButton.classList.add("bg-[#668c4a]", "text-white");
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
