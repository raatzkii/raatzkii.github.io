document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.querySelector(".close");
    const navItems = document.querySelectorAll(".mobile-nav .nav-item");
    let currentImage;

    // ✅ Always Shuffle Images on Every Page Refresh
    function shuffleImages() {
        const grid = document.querySelector(".grid");
        if (!grid) return;

        const images = Array.from(grid.children);
        const shuffledImages = images.sort(() => Math.random() - 0.5);

        // Use DocumentFragment for efficient reordering
        const fragment = document.createDocumentFragment();
        shuffledImages.forEach(img => fragment.appendChild(img));
        grid.innerHTML = ""; // Clear current grid
        grid.appendChild(fragment); // Append shuffled images
    }

    shuffleImages(); // Call shuffle function on every page refresh

    // ✅ Lightbox Functionality
    document.querySelectorAll(".image-container img").forEach(img => {
        img.addEventListener("click", function (event) {
            event.stopPropagation();
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
            currentImage = this.closest(".image-container");
        });
    });

    // ✅ Close Lightbox
    closeLightbox.addEventListener("click", function (event) {
        event.stopPropagation();
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // ✅ Mobile Bottom Navigation - Highlight Active Menu
    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
        });
    });
});
