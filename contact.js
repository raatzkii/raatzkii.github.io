const messageButton = document.getElementById("messageButton");
const burgerButton = document.getElementById("burgerButton");
const contactFormModal = document.getElementById("contactFormModal");
const contactFrameStage = document.getElementById("contactFrameStage");
const contactMaskImage = document.querySelector(".contact-mask-image");
const qrPanels = document.querySelectorAll("[data-qr-panel]");

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function setContactQrPanel(panelName) {
    qrPanels.forEach(panel => {
        panel.hidden = panel.dataset.qrPanel !== panelName;
    });
}

function openContactModal(panelName = "channels") {
    if (!contactFormModal) return;

    setContactQrPanel(panelName);
    contactFormModal.dataset.activePanel = panelName;
    contactFormModal.hidden = false;
    document.body.classList.add("contact-modal-open");
}

function closeContactModal() {
    if (!contactFormModal) return;

    contactFormModal.hidden = true;
    document.body.classList.remove("contact-modal-open");
}

messageButton?.addEventListener("click", () => openContactModal("channels"));
burgerButton?.addEventListener("click", () => openContactModal("burger"));

contactFormModal?.addEventListener("click", event => {
    if (!event.target.closest("[data-contact-modal-close]")) return;
    closeContactModal();
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || contactFormModal?.hidden) return;
    closeContactModal();
});

if (contactFrameStage && contactMaskImage) {
    const movement = {
        ticking: false,
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0
    };

    function updateFrameMovement() {
        movement.ticking = false;
        movement.currentX += (movement.targetX - movement.currentX) * 0.045;
        movement.currentY += (movement.targetY - movement.currentY) * 0.045;

        contactMaskImage.style.setProperty("--contact-avoid-x", `${movement.currentX.toFixed(2)}px`);
        contactMaskImage.style.setProperty("--contact-avoid-y", `${movement.currentY.toFixed(2)}px`);

        if (Math.abs(movement.targetX - movement.currentX) > 0.05 || Math.abs(movement.targetY - movement.currentY) > 0.05) {
            requestFrameMovementUpdate();
        }
    }

    function requestFrameMovementUpdate() {
        if (movement.ticking) return;

        movement.ticking = true;
        requestAnimationFrame(updateFrameMovement);
    }

    contactFrameStage.addEventListener("pointermove", event => {
        const rect = contactFrameStage.getBoundingClientRect();
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        const dx = centerX - event.clientX;
        const dy = centerY - event.clientY;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const strength = clamp(1 - distance / 520, 0, 1);
        const maxShift = 8;

        movement.targetX = (dx / distance) * maxShift * strength;
        movement.targetY = (dy / distance) * maxShift * strength;
        requestFrameMovementUpdate();
    });

    contactFrameStage.addEventListener("pointerleave", () => {
        movement.targetX = 0;
        movement.targetY = 0;
        requestFrameMovementUpdate();
    });
}
