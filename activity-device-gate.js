(function () {
    const script = document.currentScript;
    const expectedDevice = script?.dataset.activityDevice;

    if (!expectedDevice) return;

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const coarseQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    const isMobileExperience = mobileQuery.matches || coarseQuery.matches;
    const shouldBlock =
        (expectedDevice === "mobile" && !isMobileExperience) ||
        (expectedDevice === "desktop" && isMobileExperience);

    if (!shouldBlock) return;

    document.documentElement.classList.add("activity-device-blocked");

    const showGate = () => {
        const gate = document.createElement("main");
        gate.className = "activity-device-gate";
        gate.textContent = expectedDevice === "mobile"
            ? "best viewed on mobile"
            : "best viewed on desktop";
        document.body.replaceChildren(gate);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showGate, { once: true });
    } else {
        showGate();
    }
})();
