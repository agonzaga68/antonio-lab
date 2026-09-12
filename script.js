const artworks = document.querySelectorAll(".artwork");

const filterButtons = document.querySelectorAll(".filters button");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxStory = document.querySelector("#lightbox-story");
const lightboxDetails = document.querySelector("#lightbox-details");

const closeButton = document.querySelector("#lightbox-close");
const previousButton = document.querySelector("#lightbox-prev");
const nextButton = document.querySelector("#lightbox-next");

let currentIndex = 0;

let visibleArtworks = [];

artworks.forEach(function (artwork, index) {
    visibleArtworks.push(index);
});

const artworkData = [
    {
        title: "Carmen",
        year: "2026",
        technique: "Técnica mista",
        materials: "Pastel e lápis Faber-Castell",
        category: "Retrato",
        description: "Estudo de retrato realizado para desenvolver e aperfeiçoar técnicas de desenho e pintura.",
        story: "A rapariga modelo"
    },
    {
        title: "Akari",
        year: "2026",
        technique: "Técnica mista",
        materials: "Pastel e lápis Faber-Castell sobre papel Fabriano 1264, 300 g",
        category: "Desenho",
        description: "Estudo realizado para desenvolver e aperfeiçoar conhecimentos e técnicas de desenho e pintura.",
        story: "Passeio de domingo"
    },
    {
        title: "Estudo de Max — Stranger Things",
        year: "2026",
        technique: "Técnica mista",
        materials: "Desenho a cores sobre papel Fabriano 1264, 300 g",
        category: "Retrato",
        description: "Estudo de desenho a partir da personagem Max, de Stranger Things, realizado no contexto de uma aula com Alícia Mesas.",
        story: "Personagem da serie televisiva"
    },
    {
        title: "Lobo",
        year: "2026",
        technique: "Pastel seco e lápis de carvão",
        materials: "Pastel seco e lápis Faber-Castell sobre papel Fabriano 1264, 300 g",
        category: "Retrato",
        description: "Estudo de retrato realizado para desenvolver e aperfeiçoar técnicas de desenho e pintura.",
        story: "Um lobo"
    },
    {
        title: "Sombras",
        year: "2026",
        technique: "Carvão",
        materials: "Carvão sobre papel Fabriano 1264, 300 g",
        category: "Desenho",
        description: "Estudo dedicado à exploração das sombras e ao aperfeiçoamento da técnica do carvão.",
        story: "Petter e Gala"
    }
];


function createArtworkDetails(data) {
    const details = [];

    if (data.technique) {
        details.push("Técnica: " + data.technique);
    }

    if (data.materials) {
        details.push("Materiais: " + data.materials);
    }

    if (data.year) {
        details.push("Ano: " + data.year);
    }

    return details.join(" · ");
}

function filterArtworks(category) {

    visibleArtworks = [];

    artworks.forEach(function (artwork, index) {

        const artworkCategory = artworkData[index].category;

        if (category === "all" || artworkCategory === category) {

            artwork.style.display = "";
            visibleArtworks.push(index);

        } else {

            artwork.style.display = "none";
        }
    });
}

function showArtwork(index) {

const artworkIndex = visibleArtworks[index];
const artwork = artworks[artworkIndex];
const image = artwork.querySelector("img");
const data = artworkData[artworkIndex];

currentIndex = index;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = data.title;

   lightboxStory.innerHTML =
    "<strong>Descrição</strong><br>" +
    data.description +
    "<br><br>" +
    "<strong>História</strong><br>" +
    data.story;

lightboxDetails.textContent = createArtworkDetails(data);

    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "";
}

function showPreviousArtwork() {

    const previousIndex =
        (currentIndex - 1 + visibleArtworks.length) % visibleArtworks.length;

    showArtwork(previousIndex);
}

function showNextArtwork() {

    const nextIndex =
        (currentIndex + 1) % visibleArtworks.length;

    showArtwork(nextIndex);
}

artworks.forEach(function (artwork, index) {
    artwork.addEventListener("click", function () {

        const visibleIndex = visibleArtworks.indexOf(index);

        showArtwork(visibleIndex);
    });
});

closeButton.addEventListener("click", closeLightbox);

previousButton.addEventListener("click", showPreviousArtwork);

nextButton.addEventListener("click", showNextArtwork);

lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (lightbox.style.display !== "flex") {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPreviousArtwork();
    }

    if (event.key === "ArrowRight") {
        showNextArtwork();
    }
});

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        filterButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        button.classList.add("active");

        filterArtworks(button.dataset.category);
    });
});
