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

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".cart-items");
    
    cartContainer.innerHTML = "";
    
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        cartContainer.innerHTML += `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" width="80">
            </div>
            <div class="item-details">
                <div>
                    <h3>${item.title} <i class="fa-solid fa-trash-can" onclick="removeItem(${item.id})"></i></h3>
                    <p>Size: <span>${item.size}</span></p>
                </div>
                <div>
                    <p>$${item.price}</p>
                    <div class="qty-box">
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    
    updateSummary(subtotal);
}

function changeQty(id, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.map(item => {
        if (item.id === id) {
            item.quantity += delta;
            if (item.quantity < 1) item.quantity = 1;
        }
        return item;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function updateSummary(subtotal) {
    const discount = Number((subtotal * 0.2).toFixed(2));
    const delivery = 15;
    const total = Number((subtotal - discount + delivery).toFixed(2));

    document.getElementById("subtotal").textContent = `$${subtotal}`;
    document.getElementById("discount").textContent = `-$${discount}`;
    document.getElementById("delivery").textContent = `$${delivery}`;
    document.getElementById("total").textContent = `$${total}`;
}

document.addEventListener("DOMContentLoaded", loadCart);

// goto profile page logic
document.addEventListener("click", (e) => {
    if (e.target.closest(".fa-circle-user")) {
        window.location.href = "login.html";
    }
});