// // load component logic
// function loadComponent(id, file){
//     return fetch(file)
//         .then(res => res.text())
//         .then(data => {
//             document.getElementById(id).innerHTML = data;
//         });
// }

// loadComponent("offer", "./Components/offer.html").then(initOffer);
// loadComponent("nav", "./Components/nav.html");
// loadComponent("footer", "./Components/footer.html");

// function initOffer() {
//     const xIcon = document.querySelector(".offer i");
//     const offerSection = document.querySelector(".offer");

//     if (xIcon && offerSection) {
//         xIcon.addEventListener("click", () => {
//             offerSection.style.display = "none";
//         });
//     }
// }

// let allProducts = [];
// let filteredProducts = [];
// let currentPage = 1;
// let perPage = 9;
// let selectedSort = "default";

// let selectedCategory = null;
// let selectedBrand = null;

// window.onload = () => {
//     setupPrice();
//     setupApplyFilter();
//     setupPaginationButtons();
//     fetchProducts();
// };

// function fetchProducts() {
//     fetch("https://dummyjson.com/products")
//         .then(res => res.json())
//         .then(data => {
//             console.log(data);
//             allProducts = data.products;
//             filteredProducts = [...allProducts];

//             renderCategories();
//             renderProducts();
//         });
// }

// // ================== CATEGORIES ==================
// // function renderCategories() {
// //     const container = document.getElementById("categories");
// //     if (!container) return;

// //     const categories = [...new Set(allProducts.map(p => p.category))];

// //     container.innerHTML = "";

// //     categories.forEach(cat => {
// //         container.innerHTML += `
// //             <label>
// //                 <input type="radio" name="category" value="${cat}">
// //                 ${cat}
// //             </label>
// //         `;
// //     });

// //     document.querySelectorAll('input[name="category"]').forEach(input => {
// //         input.addEventListener("change", e => {
// //             selectedCategory = e.target.value;
// //             selectedBrand = null;
// //             renderBrands();
// //         });
// //     });
// // }
// function renderCategories() {
//     const container = document.getElementById("categories");
//     if (!container) return;

//     const categories = [...new Set(allProducts.map(p => p.category))];

//     container.innerHTML = "";

//     categories.forEach(cat => {
//         container.innerHTML += `
//             <div class="category-item">
//                 <div class="category-title" data-cat="${cat}">
//                     ${cat} <i class="fa-solid fa-chevron-down fa-rotate-270"></i>
//                 </div>
//                 <div class="brand-list" id="brands-${cat}" style="display:none;"></div>
//             </div>
//         `;
//     });

//     // click on category
//     document.querySelectorAll(".category-title").forEach(el => {
//         el.addEventListener("click", () => {
//             const cat = el.dataset.cat;
//             const brandContainer = document.getElementById(`brands-${cat}`);

//             // toggle open / close
//             const isOpen = brandContainer.style.display === "block";

//             // close all
//             document.querySelectorAll(".brand-list").forEach(b => b.style.display = "none");

//             if (!isOpen) {
//                 brandContainer.style.display = "block";
//                 renderBrands(cat);
//             }

//             selectedCategory = cat;
//             selectedBrand = null;
//         });
//     });
// }

// // ================== BRANDS ==================
// // function renderBrands() {
// //     const container = document.getElementById("brands");
// //     if (!container) return;

// //     let products = allProducts;

// //     if (selectedCategory) {
// //         products = products.filter(p => p.category === selectedCategory);
// //     }

// //     const brands = [...new Set(products.map(p => p.brand))];

// //     container.innerHTML = "";

// //     brands.forEach(brand => {
// //         container.innerHTML += `
// //             <label>
// //                 <input type="radio" name="brand" value="${brand}">
// //                 ${brand}
// //             </label>
// //         `;
// //     });

// //     document.querySelectorAll('input[name="brand"]').forEach(input => {
// //         input.addEventListener("change", e => {
// //             selectedBrand = e.target.value;
// //         });
// //     });
// // }
// function renderBrands(category) {
//     const container = document.getElementById(`brands-${category}`);
//     if (!container) return;

//     let products = allProducts.filter(p => p.category === category);

//     const brands = [...new Set(products.map(p => p.brand))];

//     container.innerHTML = "";

//     brands.forEach(brand => {
//         container.innerHTML += `
//             <label>
//                 <input type="radio" name="brand" value="${brand}">
//                 ${brand}
//             </label>
//         `;
//     });

//     document.querySelectorAll('input[name="brand"]').forEach(input => {
//         input.addEventListener("change", e => {
//             selectedBrand = e.target.value;
//         });
//     });
// }

// // ================== PRICE ==================
// function setupPrice() {
//     const priceRange = document.getElementById("priceRange");
//     const priceValue = document.getElementById("priceValue");

//     if (!priceRange || !priceValue) return;

//     priceRange.addEventListener("input", () => {
//         maxPrice = priceRange.value;
//         priceValue.textContent = "$" + maxPrice;
//     });
// }

// // ================== APPLY FILTER ==================
// function setupApplyFilter() {
//     const btn = document.querySelector(".apply-btn");
//     if (!btn) return;

//     btn.addEventListener("click", () => {
//         filteredProducts = allProducts.filter(p => {
//             return (!selectedCategory || p.category === selectedCategory)
//                 && (!selectedBrand || p.brand === selectedBrand)
//                 && (p.price <= maxPrice);
//         });

//         currentPage = 1;
//         renderProducts();
//     });
// }

// // ================== RENDER PRODUCTS ==================
// function renderProducts() {
//     const grid = document.querySelector(".products-grid");
//     if (!grid) return;

//     const start = (currentPage - 1) * perPage;
//     const paginated = filteredProducts.slice(start, start + perPage);

//     grid.innerHTML = "";

//     paginated.forEach(p => {
//         grid.innerHTML += `
//             <div class="product-card">
//                 <img src="${p.thumbnail}" />
//                 <h4>${p.title}</h4>
//                 <p>$${p.price}</p>
//                 <p>⭐ ${p.rating}</p>
//             </div>
//         `;
//     });

//     renderPagination();
// }

// // ================== PAGINATION ==================
// function renderPagination() {
//     const pagesContainer = document.getElementById("pages");
//     if (!pagesContainer) return;

//     pagesContainer.innerHTML = "";

//     const totalPages = Math.ceil(filteredProducts.length / perPage);

//     for (let i = 1; i <= totalPages; i++) {
//         pagesContainer.innerHTML += `
//             <button onclick="goToPage(${i})">${i}</button>
//         `;
//     }
// }

// function goToPage(page) {
//     currentPage = page;
//     renderProducts();
// }

// // ================== PREV / NEXT ==================
// function setupPaginationButtons() {
//     const prev = document.getElementById("prev");
//     const next = document.getElementById("next");

//     if (!prev || !next) return;

//     prev.onclick = () => {
//         if (currentPage > 1) {
//             currentPage--;
//             renderProducts();
//         }
//     };

//     next.onclick = () => {
//         const totalPages = Math.ceil(filteredProducts.length / perPage);
//         if (currentPage < totalPages) {
//             currentPage++;
//             renderProducts();
//         }
//     };
// }


// load component logic
function loadComponent(id, file){
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

    if (xIcon && offerSection) {
        xIcon.addEventListener("click", () => {
            offerSection.style.display = "none";
        });
    }
}

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let perPage = 9;

let selectedCategory = null;
let selectedBrand = null;

let selectedSort = "default";
let minPrice = 0;
let maxPrice = 2000;


window.onload = () => {
    setupPrice();
    setupApplyFilter();
    setupPaginationButtons();
    setupSort();
    fetchProducts();
};


function fetchProducts() {
    fetch("https://dummyjson.com/products")
        .then(res => res.json())
        .then(data => {
            allProducts = data.products;
            filteredProducts = [...allProducts];

            renderCategories();
            renderProducts();
        });
}

// categories filter
function renderCategories() {
    const container = document.getElementById("categories");
    if (!container) return;

    const categories = [...new Set(allProducts.map(p => p.category))];

    container.innerHTML = "";

    categories.forEach(cat => {
        container.innerHTML += `
            <div class="category-item">
                <div class="category-title" data-cat="${cat}">
                    ${cat} <i class="fa-solid fa-chevron-down fa-rotate-270"></i>
                </div>
                <div class="brand-list" id="brands-${cat}" style="display:none;"></div>
            </div>
        `;
    });

    document.querySelectorAll(".category-title").forEach(el => {
        el.addEventListener("click", () => {
            const cat = el.dataset.cat;
            const brandContainer = document.getElementById(`brands-${cat}`);

            const isOpen = brandContainer.style.display === "block";

            document.querySelectorAll(".brand-list").forEach(b => b.style.display = "none");

            if (!isOpen) {
                brandContainer.style.display = "block";
                renderBrands(cat);
            }
            selectedCategory = cat;
            selectedBrand = null;
            const title = document.getElementById("categoryTitle");
            if (title) title.textContent = cat;
        });
    });
}

// filter by brand inside each category
function renderBrands(category) {
    const container = document.getElementById(`brands-${category}`);
    if (!container) return;
    let products = allProducts.filter(p => p.category === category);
    const brands = [...new Set(products.map(p => p.brand))];
    container.innerHTML = "";

    brands.forEach(brand => {
        container.innerHTML += `
            <label>
                <input type="radio" name="brand" value="${brand}">
                ${brand}
            </label>
        `;
    });
    document.querySelectorAll('input[name="brand"]').forEach(input => {
        input.addEventListener("change", e => {
            selectedBrand = e.target.value;
        });
    });
}

// filter by price logic
function setupPrice() {
    const minRange = document.getElementById("minPrice");
    const maxRange = document.getElementById("maxPrice");

    const minValue = document.getElementById("minPriceValue");
    const maxValue = document.getElementById("maxPriceValue");

    if (!minRange || !maxRange) return;

    minRange.addEventListener("input", () => {
        if (+minRange.value > +maxRange.value - 50) {
            minRange.value = maxRange.value - 50;
        }

        minPrice = +minRange.value;
        minValue.textContent = "$" + minPrice;
    });

    maxRange.addEventListener("input", () => {
        if (+maxRange.value < +minRange.value + 50) {
            maxRange.value = +minRange.value + 50;
        }

        maxPrice = +maxRange.value;
        maxValue.textContent = "$" + maxPrice;
    });
}

// apply fileter button logic
function setupApplyFilter() {
    const btn = document.querySelector(".apply-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        applyFiltersAndSort();
    });
}

function applyFiltersAndSort() {
    filteredProducts = allProducts.filter(p => {
        return (!selectedCategory || p.category === selectedCategory)
            && (!selectedBrand || p.brand === selectedBrand)
            && (p.price >= minPrice && p.price <= maxPrice);
    });

    if (selectedSort === "priceLow") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "priceHigh") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    currentPage = 1;
    renderProducts();
}

// sort by logic
function setupSort() {
    const sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) return;

    sortSelect.addEventListener("change", (e) => {
        selectedSort = e.target.value;
        applyFiltersAndSort();
    });
}

// render products
function renderProducts() {
    const grid = document.querySelector(".products-grid");
    if (!grid) return;

    const start = (currentPage - 1) * perPage;
    const paginated = filteredProducts.slice(start, start + perPage);

    grid.innerHTML = "";

    paginated.forEach(product => {
        grid.innerHTML += `
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
    });

    renderPagination();
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

// pagination logic
function renderPagination() {
    const pagesContainer = document.getElementById("pages");
    if (!pagesContainer) return;

    pagesContainer.innerHTML = "";

    const totalPages = Math.ceil(filteredProducts.length / perPage);

    for (let i = 1; i <= totalPages; i++) {
        pagesContainer.innerHTML += `
            <button onclick="goToPage(${i})">${i}</button>
        `;
    }
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
}

// prev and next logic
function setupPaginationButtons() {
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    if (!prev || !next) return;

    prev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    };

    next.onclick = () => {
        const totalPages = Math.ceil(filteredProducts.length / perPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    };
}
// go to single product logic
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