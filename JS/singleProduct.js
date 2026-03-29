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

// single product logic
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
let currentProduct = null;
if (productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            console.log(product);
            currentProduct = product;
            displayProduct(product)
        })
        .catch(err => console.error(err));
}

document.addEventListener("click", function(e) {
    const product = e.target.closest(".product");
    
    if (product) {
        const id = product.dataset.id;
        window.location.href = `single_product.html?id=${id}`;
    }
});

let currentReviews = [];

function displayProduct(product) {
    document.querySelector(".title").textContent = product.title;
    document.querySelector(".product-rate").textContent = product.rating;
    document.querySelector(".stars").innerHTML = getStars(product.rating);
    document.querySelector(".product-price").textContent = `$${product.price}`;
    if (product.discountPercentage) {
        const oldPrice = Math.round(product.price / (1 - product.discountPercentage / 100));
        document.querySelector(".old-price").textContent = `$${oldPrice}`;
        document.querySelector(".old-price").style.textDecoration = "line-through";
        document.querySelector(".discount").textContent = `-${Math.round(product.discountPercentage)}%`;
    }
    document.querySelector(".product-desc").textContent = product.description;
    document.querySelector(".main-image").innerHTML = `
        <img src="${product.thumbnail}" class="main-img">
    `;
    document.querySelector(".min-images").innerHTML = product.images.map(img => {
        return `<img src="${img}" class="thumb">`;
    }).join("");

    currentReviews = product.reviews;
    currentReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayReviews(product.reviews);
    loadSimilarProducts(product.category, product.id);
}

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("thumb")) {
        document.querySelector(".main-img").src = e.target.src;
    }
});

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

// Cart quantity logic
const decreaseBtn = document.querySelector(".decrease");
const increaseBtn = document.querySelector(".increase");
const qtyEl = document.querySelector(".qty");
let quantity = 1;
increaseBtn.addEventListener("click", () => {
    if (currentProduct && quantity < currentProduct.stock) {
        quantity++;
        qtyEl.textContent = quantity;
    } else {
        alert("No more stock available");
    }
});
decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
        quantity--;
        qtyEl.textContent = quantity;
    }
});

const addToCartBtn = document.querySelector(".add-to-cart");
addToCartBtn.addEventListener("click", () => {
    if (!currentProduct || currentProduct.stock === 0) {
        alert("Product is out of stock");
        return;
    }
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === currentProduct.id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: currentProduct.price,
            image: currentProduct.thumbnail,
            quantity: quantity,
            size: document.querySelector(".size-selection .active")?.textContent || "M"
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart successfully ✅");
});

// display reviews logic
const sortSelect = document.querySelector(".sort-reviews");

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        let sorted = [...currentReviews];
        if (sortSelect.value === "latest") {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } 
        else if (sortSelect.value === "oldest") {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        } 
        else if (sortSelect.value === "highest") {
            sorted.sort((a, b) => b.rating - a.rating);
        } 
        else if (sortSelect.value === "lowest") {
            sorted.sort((a, b) => a.rating - b.rating);
        }
        displayReviews(sorted);
    });
}

function displayReviews(reviews) {
    const container = document.querySelector(".reviews-container");
    const count = document.querySelector(".reviews-count");
    if (!container) return;
    count.textContent = reviews.length;
    const reviewsHTML = reviews.map(review => {
        const date = new Date(review.date).toDateString();
        return `
            <div class="review-card">
                <div class="stars">
                    ${getStars(review.rating)}
                </div>
                <h3>
                    ${review.reviewerName}
                    <i class="fa-solid fa-circle-check" style="color: limegreen;"></i>
                </h3>
                <p>"${review.comment}"</p>
                <div class="date">Posted on ${date}</div>
            </div>
        `;
    }).join("");

    container.innerHTML = reviewsHTML;
}

// similar products logic
function loadSimilarProducts(category, currentId) {
    fetch("https://dummyjson.com/products")
        .then(res => res.json())
        .then(data => {
            const filtered = data.products.filter(p => 
                p.category === category && p.id !== currentId
            );

            displaySimilarProducts(filtered.slice(0, 4));
        })
        .catch(err => console.error(err));
}

function displaySimilarProducts(products) {
    const container = document.querySelector(".similar-products-products");
    if (!container) return;

    const html = products.map(product => {
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
                    <p class="price">$${product.price}</p>   
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = html;
}

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