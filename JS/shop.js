// load component logic
function loadComponent(id, file){
    return fetch(file)
            .then(res => res.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
            })
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