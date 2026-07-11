const stickyCvBanner = document.querySelector(".sticky-cv-banner");
const stickyCvClose = document.querySelector(".sticky-cv-close");

stickyCvClose?.addEventListener("click", () => {
    stickyCvBanner?.classList.add("is-hidden");
});
