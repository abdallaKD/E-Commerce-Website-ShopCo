// ================== LOAD COMPONENTS ==================
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

// ================== OFFER ==================
function initOffer() {
    const xIcon = document.querySelector(".offer i");
    const offerSection = document.querySelector(".offer");

    if (xIcon && offerSection) {
        xIcon.addEventListener("click", () => {
            offerSection.style.display = "none";
        });
    }
}

// ================== VARIABLES ==================
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let perPage = 9;

let selectedCategory = null;
let selectedBrand = null;
let maxPrice = 2000;

// ================== INIT ==================
window.onload = () => {
    setupPrice();
    setupApplyFilter();
    setupPaginationButtons();
    fetchProducts();
};

// ================== FETCH ==================
function fetchProducts() {
    fetch("https://dummyjson.com/products")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            allProducts = data.products;
            filteredProducts = [...allProducts];

            renderCategories();
            renderProducts();
        });
}

// ================== CATEGORIES ==================
function renderCategories() {
    const container = document.getElementById("categories");
    if (!container) return;

    const categories = [...new Set(allProducts.map(p => p.category))];

    container.innerHTML = "";

    categories.forEach(cat => {
        container.innerHTML += `
            <label>
                <input type="radio" name="category" value="${cat}">
                ${cat}
            </label>
        `;
    });

    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.addEventListener("change", e => {
            selectedCategory = e.target.value;
            selectedBrand = null;
            renderBrands();
        });
    });
}

// ================== BRANDS ==================
function renderBrands() {
    const container = document.getElementById("brands");
    if (!container) return;

    let products = allProducts;

    if (selectedCategory) {
        products = products.filter(p => p.category === selectedCategory);
    }

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

// ================== PRICE ==================
function setupPrice() {
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");

    if (!priceRange || !priceValue) return;

    priceRange.addEventListener("input", () => {
        maxPrice = priceRange.value;
        priceValue.textContent = "$" + maxPrice;
    });
}

// ================== APPLY FILTER ==================
function setupApplyFilter() {
    const btn = document.querySelector(".apply-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        filteredProducts = allProducts.filter(p => {
            return (!selectedCategory || p.category === selectedCategory)
                && (!selectedBrand || p.brand === selectedBrand)
                && (p.price <= maxPrice);
        });

        currentPage = 1;
        renderProducts();
    });
}

// ================== RENDER PRODUCTS ==================
function renderProducts() {
    const grid = document.querySelector(".products-grid");
    if (!grid) return;

    const start = (currentPage - 1) * perPage;
    const paginated = filteredProducts.slice(start, start + perPage);

    grid.innerHTML = "";

    paginated.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.thumbnail}" />
                <h4>${p.title}</h4>
                <p>$${p.price}</p>
                <p>⭐ ${p.rating}</p>
            </div>
        `;
    });

    renderPagination();
}

// ================== PAGINATION ==================
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

// ================== PREV / NEXT ==================
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