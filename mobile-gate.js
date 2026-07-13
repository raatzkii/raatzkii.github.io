const MOBILE_GATE_SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const MOBILE_GATE_SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";
const MOBILE_GATE_SESSION_KEY = "raatzkii_mobile_gate_unlocked";

(function initMobileGate() {
    const mobileQuery = window.matchMedia("(max-width: 1024px), (pointer: coarse)");

    if (!mobileQuery.matches) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (currentPage === "index.html" || currentPage === "contact.html" || currentPage === "") {
        document.body.classList.add("mobile-empty-page");
    }

    if (sessionStorage.getItem(MOBILE_GATE_SESSION_KEY) === "true") return;

    document.body.classList.add("mobile-gate-locked");

    const gate = document.createElement("section");
    gate.className = "mobile-gate";
    gate.setAttribute("aria-label", "Mobile preview gate");

    gate.innerHTML = `
        <form class="mobile-gate__card" id="mobileGateForm">
            <h1 class="mobile-gate__title">temp access</h1>
            <input
                class="mobile-gate__input"
                id="mobileGatePassword"
                type="password"
                placeholder="password"
                autocomplete="current-password"
                required
            >
            <button class="mobile-gate__button" id="mobileGateSubmit" type="submit">
                enter
            </button>
            <p class="mobile-gate__status" id="mobileGateStatus" aria-live="polite"></p>
        </form>
    `;

    document.body.appendChild(gate);

    const form = gate.querySelector("#mobileGateForm");
    const passwordInput = gate.querySelector("#mobileGatePassword");
    const submitButton = gate.querySelector("#mobileGateSubmit");
    const status = gate.querySelector("#mobileGateStatus");

    async function verifyPassword(password) {
        const client = window.supabase.createClient(
            MOBILE_GATE_SUPABASE_URL,
            MOBILE_GATE_SUPABASE_ANON_KEY
        );

        const { data, error } = await client.rpc(
            "verify_mobile_gate_password",
            {
                input_password: password
            }
        );

        if (error) {
            console.error(error);
            return false;
        }

        return data === true;
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const password = passwordInput.value.trim();

        if (!password) return;

        submitButton.disabled = true;
        status.textContent = "checking...";

        const isVerified = await verifyPassword(password);

        if (!isVerified) {
            status.textContent = "wrong password.";
            submitButton.disabled = false;
            passwordInput.select();
            return;
        }

        sessionStorage.setItem(MOBILE_GATE_SESSION_KEY, "true");
        document.body.classList.remove("mobile-gate-locked");
        gate.remove();
    });

    requestAnimationFrame(() => {
        passwordInput.focus();
    });
})();
