document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const filterButtons = document.querySelectorAll(".filters button");

    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const lightboxTitle = document.querySelector("#lightbox-title");
    const lightboxStory = document.querySelector("#lightbox-story");
    const lightboxDetails = document.querySelector("#lightbox-details");
    const closeButton = document.querySelector("#lightbox-close");
    const previousButton = document.querySelector("#lightbox-prev");
    const nextButton = document.querySelector("#lightbox-next");

    let artworkData = [];
    let artworks = [];
    let currentIndex = 0;

    async function loadArtworks() {
        try {
            const response = await fetch("./data/artworks.json");

            if (!response.ok) {
                throw new Error("Não foi possível carregar artworks.json.");
            }

            artworkData = await response.json();

            renderGallery();
            setupFilters();
        } catch (error) {
            console.error(error);
            gallery.textContent = "Não foi possível carregar a galeria.";
        }
    }

    function renderGallery() {
        gallery.innerHTML = "";

        artworkData.forEach(function (data, index) {
            const figure = document.createElement("figure");
            figure.className = "artwork";
            figure.dataset.id = data.id;

            const image = document.createElement("img");
            image.src = data.image;
            image.alt = data.title + " — Gala Glez";

            const caption = document.createElement("figcaption");
            caption.textContent = data.title;

            figure.appendChild(image);
            figure.appendChild(caption);

            figure.addEventListener("click", function () {
                showArtwork(index);
            });

            gallery.appendChild(figure);
        });

        artworks = Array.from(gallery.querySelectorAll(".artwork"));
    }

    function setupFilters() {
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const category = button.dataset.category;

                filterArtworks(category);

                filterButtons.forEach(function (item) {
                    item.classList.remove("active");
                });

                button.classList.add("active");
            });
        });
    }

    function filterArtworks(category) {
        artworks.forEach(function (artwork, index) {
            const artworkCategory = artworkData[index].category;

            if (category === "all" || artworkCategory === category) {
                artwork.style.display = "";
            } else {
                artwork.style.display = "none";
            }
        });
    }

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

    function showArtwork(index) {
        const artwork = artworks[index];
        const image = artwork.querySelector("img");
        const data = artworkData[index];

        currentIndex = index;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = data.title;

        lightboxStory.innerHTML = "";

        const descriptionTitle = document.createElement("strong");
        descriptionTitle.textContent = "Descrição";

        const description = document.createTextNode(data.description || "");

        const storyTitle = document.createElement("strong");
        storyTitle.textContent = "História";

        const story = document.createTextNode(data.story || "");

        lightboxStory.appendChild(descriptionTitle);
        lightboxStory.appendChild(document.createElement("br"));
        lightboxStory.appendChild(description);
        lightboxStory.appendChild(document.createElement("br"));
        lightboxStory.appendChild(document.createElement("br"));
        lightboxStory.appendChild(storyTitle);
        lightboxStory.appendChild(document.createElement("br"));
        lightboxStory.appendChild(story);

        lightboxDetails.textContent = createArtworkDetails(data);

        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
    }

    function showPreviousArtwork() {
        if (artworks.length === 0) {
            return;
        }

        const previousIndex =
            (currentIndex - 1 + artworks.length) % artworks.length;

        showArtwork(previousIndex);
    }

    function showNextArtwork() {
        if (artworks.length === 0) {
            return;
        }

        const nextIndex =
            (currentIndex + 1) % artworks.length;

        showArtwork(nextIndex);
    }

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

    loadArtworks();
});
