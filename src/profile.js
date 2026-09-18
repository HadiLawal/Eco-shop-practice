const profileImage = document.querySelector("#profile-image");
const profileName = document.querySelector("#profile-name");
const profileUsername = document.querySelector("#profile-username");

const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const username = document.querySelector("#username");
const gender = document.querySelector("#gender");
const birthDate = document.querySelector("#birth-date");
const phone = document.querySelector("#phone");

const email = document.querySelector("#email");
const contactUsername = document.querySelector("#contact-username");

const addressName = document.querySelector("#address-name");
const streetAddress = document.querySelector("#street-address");
const cityState = document.querySelector("#city-state");
const country = document.querySelector("#country");

function loadUser() {
  fetch("https://dummyjson.com/users/8")
    .then((res) => res.json())
    .then((user) => {
      profileImage.src = user.image;

      profileName.textContent = `${user.firstName} ${user.lastName}`;

      profileUsername.textContent = `@${user.username}`;

      firstName.textContent = user.firstName;

      lastName.textContent = user.lastName;

      username.textContent = user.username;

      gender.textContent = user.gender;

      birthDate.textContent = new Date(user.birthDate).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      );

      phone.textContent = user.phone;

      email.textContent = user.email;

      contactUsername.textContent = user.username;

      addressName.textContent = `${user.firstName} ${user.lastName}`;

      streetAddress.textContent = user.address.address;

      cityState.textContent = `${user.address.city}, ${user.address.state} ${user.address.postalCode}`;

      country.textContent = user.address.country;
    })
    .catch((error) => {
      console.error("Unable to load user:", error);

      profileName.textContent = "Unable to load user";
      profileUsername.textContent = "";
      firstName.textContent = "Unavailable";
      lastName.textContent = "Unavailable";
      username.textContent = "Unavailable";
      gender.textContent = "Unavailable";
      birthDate.textContent = "Unavailable";
      phone.textContent = "Unavailable";
      email.textContent = "Unavailable";
      contactUsername.textContent = "Unavailable";
      addressName.textContent = "Unavailable";
      streetAddress.textContent = "Unable to load address";
      cityState.textContent = "";
      country.textContent = "";
    });
}

loadUser();

const searchForm = document.getElementById('site-search-form');
const searchInput = document.getElementById('site-search-input');

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // if we're already inside /src/, search.html is right here.
            // if we're at the root (index.html), search.html is inside /src/.
            const isInSrcFolder = window.location.pathname.includes('/src/');
            const searchPath = isInSrcFolder ? 'search.html' : 'src/search.html';

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
