const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";
const SIDEQUEST_TABLE = "side_quest_posts";
const SIDEQUEST_BUCKET = "side-quest-photos";
const POST_LIMIT = 5;
const TARGET_MIN_METERS = 35;
const TARGET_MAX_METERS = 95;
const UNLOCK_RADIUS_METERS = 18;

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const sidequestGate = document.getElementById("sidequestGate");
const sidequestCompass = document.getElementById("sidequestCompass");
const sidequestFeed = document.getElementById("sidequestFeed");
const enterGateBtn = document.getElementById("enterGateBtn");
const gateStatus = document.getElementById("gateStatus");
const questArrow = document.getElementById("questArrow");
const questDistance = document.getElementById("questDistance");
const postProofBtn = document.getElementById("postProofBtn");
const proofInput = document.getElementById("proofInput");
const proofModal = document.getElementById("proofModal");
const closeProofModal = document.getElementById("closeProofModal");
const proofForm = document.getElementById("proofForm");
const proofPreview = document.getElementById("proofPreview");
const proofCaption = document.getElementById("proofCaption");
const submitProofBtn = document.getElementById("submitProofBtn");
const proofStatus = document.getElementById("proofStatus");
const sidequestPosts = document.getElementById("sidequestPosts");

let currentPosition = null;
let targetPosition = null;
let watchId = null;
let deviceHeading = null;
let selectedFile = null;
let latestDistance = null;

function getAnonymousId() {
    const key = "sidequest_anon_id";
    const existingId = localStorage.getItem(key);

    if (existingId) return existingId;

    const newId = crypto.randomUUID
        ? crypto.randomUUID()
        : `sidequest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, newId);
    return newId;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

function getDistanceMeters(from, to) {
    const earthRadius = 6371000;
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);
    const deltaLat = toRadians(to.latitude - from.latitude);
    const deltaLng = toRadians(to.longitude - from.longitude);

    const a = Math.sin(deltaLat / 2) ** 2
        + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

function getBearingDegrees(from, to) {
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);
    const deltaLng = toRadians(to.longitude - from.longitude);

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2)
        - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function createTarget(origin) {
    const distance = TARGET_MIN_METERS + Math.random() * (TARGET_MAX_METERS - TARGET_MIN_METERS);
    const bearing = Math.random() * 360;
    const earthRadius = 6371000;
    const angularDistance = distance / earthRadius;
    const bearingRadians = toRadians(bearing);
    const lat1 = toRadians(origin.latitude);
    const lng1 = toRadians(origin.longitude);

    const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance)
        + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRadians)
    );
    const lng2 = lng1 + Math.atan2(
        Math.sin(bearingRadians) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

    return {
        latitude: toDegrees(lat2),
        longitude: toDegrees(lng2)
    };
}

function updateCompass() {
    if (!currentPosition || !targetPosition) return;

    latestDistance = getDistanceMeters(currentPosition, targetPosition);
    const bearing = getBearingDegrees(currentPosition, targetPosition);
    const rotation = deviceHeading === null
        ? bearing
        : (bearing - deviceHeading + 360) % 360;

    questArrow.style.setProperty("--arrow-rotation", `${rotation}deg`);

    if (latestDistance <= UNLOCK_RADIUS_METERS) {
        questDistance.textContent = "you found it.";
        postProofBtn.hidden = false;
        return;
    }

    questDistance.textContent = `${Math.ceil(latestDistance)}m remaining`;
    postProofBtn.hidden = true;
}

function handleOrientation(event) {
    if (typeof event.webkitCompassHeading === "number") {
        deviceHeading = event.webkitCompassHeading;
    } else if (typeof event.alpha === "number") {
        deviceHeading = (360 - event.alpha) % 360;
    }

    updateCompass();
}

async function requestCompassAccess() {
    if (
        typeof DeviceOrientationEvent !== "undefined"
        && typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== "granted") return;
        } catch (error) {
            console.warn(error);
            return;
        }
    }

    window.addEventListener("deviceorientation", handleOrientation, true);
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is unavailable."));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        });
    });
}

async function getRecentPostCount(anonymousId) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error } = await supabaseClient
        .from(SIDEQUEST_TABLE)
        .select("id", { count: "exact", head: true })
        .eq("anon_user_id", anonymousId)
        .gte("created_at", since);

    if (error) throw error;

    return count || 0;
}

function startLocationWatch() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }

    watchId = navigator.geolocation.watchPosition(position => {
        currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        updateCompass();
    }, error => {
        console.warn(error);
        questDistance.textContent = "location got shy. try moving.";
    }, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    });
}

async function enterGate() {
    enterGateBtn.disabled = true;
    gateStatus.textContent = "asking gps...";

    try {
        const anonymousId = getAnonymousId();
        const count = await getRecentPostCount(anonymousId);

        if (count >= POST_LIMIT) {
            gateStatus.textContent = "quest limit reached. try again tomorrow.";
            enterGateBtn.disabled = false;
            return;
        }

        await requestCompassAccess();

        const position = await getCurrentPosition();
        currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        targetPosition = createTarget(currentPosition);

        sidequestGate.hidden = true;
        sidequestCompass.hidden = false;
        sidequestFeed.hidden = false;

        startLocationWatch();
        updateCompass();
        await loadPosts();
    } catch (error) {
        console.error(error);
        gateStatus.textContent = error?.message?.toLowerCase().includes("permission")
            ? "can't start without location."
            : "quest setup unavailable.";
        enterGateBtn.disabled = false;
    }
}

function openProofPicker() {
    proofInput.click();
}

function openProofModal(file) {
    selectedFile = file;
    proofPreview.src = URL.createObjectURL(file);
    proofCaption.value = "";
    proofStatus.textContent = "";
    proofModal.hidden = false;
}

function closeModal() {
    proofModal.hidden = true;
    selectedFile = null;
    proofInput.value = "";
    proofPreview.removeAttribute("src");
}

function getFileExtension(file) {
    const fallback = "jpg";
    const extension = file.name.split(".").pop();
    return extension ? extension.toLowerCase() : fallback;
}

async function submitProof(event) {
    event.preventDefault();

    if (!selectedFile || !targetPosition || latestDistance === null) return;

    submitProofBtn.disabled = true;
    proofStatus.textContent = "posting...";

    try {
        const anonymousId = getAnonymousId();
        const count = await getRecentPostCount(anonymousId);

        if (count >= POST_LIMIT) {
            proofStatus.textContent = "quest limit reached. try again tomorrow.";
            submitProofBtn.disabled = false;
            return;
        }

        const filePath = `${anonymousId}/${Date.now()}.${getFileExtension(selectedFile)}`;
        const { error: uploadError } = await supabaseClient.storage
            .from(SIDEQUEST_BUCKET)
            .upload(filePath, selectedFile, {
                cacheControl: "86400",
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { error: insertError } = await supabaseClient
            .from(SIDEQUEST_TABLE)
            .insert({
                anon_user_id: anonymousId,
                image_path: filePath,
                caption: proofCaption.value.trim(),
                distance_m: Math.round(latestDistance)
            });

        if (insertError) throw insertError;

        proofStatus.textContent = "posted.";
        closeModal();
        await loadPosts();
    } catch (error) {
        console.error(error);
        proofStatus.textContent = "post failed.";
    } finally {
        submitProofBtn.disabled = false;
    }
}

async function loadPosts() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabaseClient
        .from(SIDEQUEST_TABLE)
        .select("image_path, caption, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(24);

    if (error) {
        console.error(error);
        sidequestPosts.innerHTML = "";
        return;
    }

    sidequestPosts.innerHTML = "";

    (data || []).forEach(post => {
        const { data: publicData } = supabaseClient.storage
            .from(SIDEQUEST_BUCKET)
            .getPublicUrl(post.image_path);

        const article = document.createElement("article");
        article.className = "sidequest-post";
        const caption = post.caption ? escapeHtml(post.caption) : "";
        article.innerHTML = `
            <img src="${publicData.publicUrl}" alt="">
            ${caption ? `<p>${caption}</p>` : ""}
        `;

        sidequestPosts.appendChild(article);
    });
}

enterGateBtn.addEventListener("click", enterGate);
postProofBtn.addEventListener("click", openProofPicker);
proofInput.addEventListener("change", event => {
    const [file] = Array.from(event.target.files || []);
    if (file) openProofModal(file);
});
closeProofModal.addEventListener("click", closeModal);
proofModal.addEventListener("click", event => {
    if (event.target === proofModal) closeModal();
});
proofForm.addEventListener("submit", submitProof);

window.addEventListener("beforeunload", () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
});
