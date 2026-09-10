const artworks = document.querySelectorAll(".artwork");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxStory = document.querySelector("#lightbox-story");
const lightboxDetails = document.querySelector("#lightbox-details");
const closeButton = document.querySelector("#lightbox-close");

const previousButton = document.querySelector("#lightbox-prev");
const nextButton = document.querySelector("#lightbox-next");

previousButton.addEventListener("click", showPreviousArtwork);
nextButton.addEventListener("click", showNextArtwork);

let currentIndex = 0;

const artworkData = [
    {
        title: "Obra 1",
        story: "História e significado da obra a preencher.",
        details: "Técnica, materiais e data a preencher."
    },
    {
        title: "Obra 2",
        story: "História e significado da obra a preencher.",
        details: "Técnica, materiais e data a preencher."
    },
    {
        title: "Obra 3",
        story: "História e significado da obra a preencher.",
        details: "Técnica, materiais e data a preencher."
    },
    {
        title: "Obra 4",
        story: "História e significado da obra a preencher.",
        details: "Técnica, materiais e data a preencher."
    },
    {
        title: "Obra 5",
        story: "História e significado da obra a preencher.",
        details: "Técnica, materiais e data a preencher."
    }
];

function showArtwork(index) {
    const artwork = artworks[index];
    const image = artwork.querySelector("img");
    const data = artworkData[index];

    currentIndex = index;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = data.title;
    lightboxStory.textContent = data.story;
    lightboxDetails.textContent = data.details;

    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "";
}

function showPreviousArtwork() {
    const previousIndex =
        (currentIndex - 1 + artworks.length) % artworks.length;

    showArtwork(previousIndex);
}

function showNextArtwork() {
    const nextIndex =
        (currentIndex + 1) % artworks.length;

    showArtwork(nextIndex);
}

artworks.forEach(function (artwork, index) {
    artwork.addEventListener("click", function () {
        showArtwork(index);
    });
});

closeButton.addEventListener("click", closeLightbox);

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