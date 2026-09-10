const artworks = document.querySelectorAll(".artwork");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxStory = document.querySelector("#lightbox-story");
const lightboxDetails = document.querySelector("#lightbox-details");
const closeButton = document.querySelector("#lightbox-close");


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


artworks.forEach(function (artwork, index) {

    artwork.addEventListener("click", function () {

        const image = artwork.querySelector("img");
        const data = artworkData[index];

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightboxTitle.textContent = data.title;
        lightboxStory.textContent = data.story;
        lightboxDetails.textContent = data.details;

        lightbox.style.display = "flex";
    });

});


closeButton.addEventListener("click", function () {

    lightbox.style.display = "none";

});