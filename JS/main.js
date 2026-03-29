// Loading components logic
function loadComponent(id, file) {
    return fetch(file)
            .then(res => res.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
            });
}
loadComponent("offer", "./Components/offer.html").then(initOffer);
loadComponent("nav", "./Components/nav.html");
loadComponent("footer", "./Components/footer.html");

function initOffer() {
    const xIcon = document.querySelector(".offer i");
    const offerSection = document.querySelector(".offer");

    if (xIcon) {
        xIcon.addEventListener("click", () => {
            offerSection.style.display = "none";
        });
    }
}


// Fetch products and display them
const productsData = [];

fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        productsData.push(...data.products);

        initProductsSection({
            containerSelector: ".new-arrivals-products",
            start: 2,
            end: 6
        });

        initProductsSection({
            containerSelector: ".top-selling-products",
            start: 9,
            end: 13
        });
    })
    .catch(err => console.error("Error:", err));

function initProductsSection({ containerSelector, start, end }) {
    const container = document.querySelector(containerSelector);
    const productsHTML = productsData.slice(start, end).map(product => {
        return `
            <div class="product" data-id="${product.id}">
                <div class="image">
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.title}</h3>
                    <p class="rate">
                        ${getStars(product.rating)}
                        <span>${product.rating}</span><span class="all-rate">/5</span>
                    </p>
                    <span class="price">$${product.price}</span> <span class="old-price">$${Math.round(product.price / (1 - product.discountPercentage / 100))}</span> <span class="discount">${Math.round(product.discountPercentage)}%</span>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = productsHTML;
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<i class="fa-solid fa-star"></i>`;
    }
    if (hasHalfStar) {
        starsHTML += `<i class="fa-solid fa-star-half-stroke"></i>`;
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `<i class="fa-regular fa-star"></i>`;
    }
    return starsHTML;
}


// Display all reviews 
const reviewsContainer = document.querySelector(".reviews-container");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let scrollAmount = 0;
let cardWidth = 320;

fetch("./Json Files/top selling.json")
    .then(res => res.json())
    .then(data => {
        displayReviews(data.products);
        calculateCardWidth();
    })
    .catch(err => console.error(err));

function displayReviews(products) {
    let allReviews = [];
    products.forEach(product => {
        allReviews.push(...product.reviews);
    });
    const reviewsHTML = allReviews.map(review => {
        return `
            <div class="review-card">
                <div class="stars">
                    ${getStars(review.rating)}
                </div>
                <h3 style="font-size: 18px;">
                    ${review.author}
                    <i class="fa-solid fa-circle-check" style="color: limegreen;"></i>
                </h3>

                <p>"${review.comment}"</p>
            </div>
        `;
    }).join("");
    reviewsContainer.innerHTML = reviewsHTML;
}
function calculateCardWidth() {
    const card = document.querySelector(".review-card");
    if (!card) return;
    const gap = 20;
    cardWidth = card.offsetWidth + gap;
}
nextBtn.addEventListener("click", () => {
    const maxScroll = reviewsContainer.scrollWidth - reviewsContainer.parentElement.clientWidth;
    scrollAmount += cardWidth;
    if (scrollAmount > maxScroll) {
        scrollAmount = maxScroll;
    }
    reviewsContainer.style.transform = `translateX(-${scrollAmount}px)`;
});
prevBtn.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    if (scrollAmount < 0) {
        scrollAmount = 0;
    }
    reviewsContainer.style.transform = `translateX(-${scrollAmount}px)`;
});

// goto single product logic
document.addEventListener("click", function(e) {
    const product = e.target.closest(".product");

    if (product) {
        const id = product.dataset.id;
        window.location.href = `single_product.html?id=${id}`;
    }
});

// goto cart page logic
document.addEventListener("click", (e) => {
    if (e.target.closest(".fa-cart-shopping")) {
        window.location.href = "cart.html";
    }
});

// goto profile page logic
document.addEventListener("click", (e) => {
    if (e.target.closest(".fa-circle-user")) {
        window.location.href = "login.html";
    }
});
