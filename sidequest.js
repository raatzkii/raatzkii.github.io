const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";
const SIDEQUEST_TABLE = "side_quest_posts";
const SIDEQUEST_BUCKET = "side-quest-photos";
const POST_LIMIT = 5;
const TARGET_MIN_METERS = 20;
const TARGET_MAX_METERS = 120;
const UNLOCK_RADIUS_METERS = 18;
const LOCATION_MAX_ACCURACY_METERS = 35;
const LOCATION_JITTER_METERS = 10;

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const sidequestGate = document.getElementById("sidequestGate");
const sidequestCompass = document.getElementById("sidequestCompass");
const sidequestFeed = document.getElementById("sidequestFeed");
const startQuestBtn = document.getElementById("startQuestBtn");
const viewOthersBtn = document.getElementById("viewOthersBtn");
const gateStatus = document.getElementById("gateStatus");
const questArrow = document.getElementById("questArrow");
const questDistance = document.getElementById("questDistance");
const captureMomentBtn = document.getElementById("captureMomentBtn");
const proofInput = document.getElementById("proofInput");
const proofModal = document.getElementById("proofModal");
const proofPreviewStep = document.getElementById("proofPreviewStep");
const closeProofModal = document.getElementById("closeProofModal");
const closeShareModal = document.getElementById("closeShareModal");
const openShareStepBtn = document.getElementById("openShareStepBtn");
const proofForm = document.getElementById("proofForm");
const proofPreview = document.getElementById("proofPreview");
const proofNickname = document.getElementById("proofNickname");
const shareAnonymous = document.getElementById("shareAnonymous");
const submitProofBtn = document.getElementById("submitProofBtn");
const proofStatus = document.getElementById("proofStatus");
const postedModal = document.getElementById("postedModal");
const viewPostedBtn = document.getElementById("viewPostedBtn");
const nextLocationBtn = document.getElementById("nextLocationBtn");
const postDetailModal = document.getElementById("postDetailModal");
const closePostDetail = document.getElementById("closePostDetail");
const postDetailImage = document.getElementById("postDetailImage");
const postDetailDate = document.getElementById("postDetailDate");
const postDetailAuthor = document.getElementById("postDetailAuthor");
const sidequestPosts = document.getElementById("sidequestPosts");

let currentPosition = null;
let targetPosition = null;
let watchId = null;
let deviceHeading = null;
let selectedFile = null;
let latestDistance = null;
let lastAcceptedPosition = null;

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

function getAnonLabel() {
    return `anon${Math.floor(100000 + Math.random() * 900000)}`;
}

function formatPostDate(value) {
    const date = new Date(value);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
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

function getPositionFromGeolocation(position) {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || null
    };
}

function shouldAcceptLocationUpdate(nextPosition) {
    if (
        nextPosition.accuracy
        && nextPosition.accuracy > LOCATION_MAX_ACCURACY_METERS
    ) {
        return false;
    }

    if (!lastAcceptedPosition) return true;

    const movement = getDistanceMeters(lastAcceptedPosition, nextPosition);
    const jitterLimit = Math.max(
        LOCATION_JITTER_METERS,
        (nextPosition.accuracy || 0) * 0.5
    );

    return movement >= jitterLimit;
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

function showOnly(section) {
    sidequestGate.hidden = section !== sidequestGate;
    sidequestCompass.hidden = section !== sidequestCompass;
    sidequestFeed.hidden = section !== sidequestFeed;
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
        sidequestCompass.classList.add("is-arrived");
        questDistance.textContent = "you made it!";
        captureMomentBtn.hidden = false;
        return;
    }

    sidequestCompass.classList.remove("is-arrived");
    questDistance.textContent = `${Math.ceil(latestDistance)}m away`;
    captureMomentBtn.hidden = true;
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
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") return;
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
        const nextPosition = getPositionFromGeolocation(position);

        if (!shouldAcceptLocationUpdate(nextPosition)) {
            return;
        }

        currentPosition = nextPosition;
        lastAcceptedPosition = nextPosition;
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

async function startQuest() {
    startQuestBtn.disabled = true;
    gateStatus.textContent = "";

    try {
        const anonymousId = getAnonymousId();
        const count = await getRecentPostCount(anonymousId);

        if (count >= POST_LIMIT) {
            gateStatus.textContent = "quest limit reached. try again tomorrow.";
            startQuestBtn.disabled = false;
            return;
        }

        await requestCompassAccess();

        const position = await getCurrentPosition();
        currentPosition = getPositionFromGeolocation(position);
        lastAcceptedPosition = currentPosition;
        targetPosition = createTarget(currentPosition);

        showOnly(sidequestCompass);
        startLocationWatch();
        updateCompass();
    } catch (error) {
        console.error(error);
        gateStatus.textContent = error?.message?.toLowerCase().includes("permission")
            ? "can't start without location."
            : "quest setup unavailable.";
        startQuestBtn.disabled = false;
    }
}

async function startNextLocation() {
    postedModal.hidden = true;
    proofStatus.textContent = "";
    startQuestBtn.disabled = false;
    await startQuest();
}

function openProofPicker() {
    proofInput.click();
}

function openProofModal(file) {
    selectedFile = file;
    proofPreview.src = URL.createObjectURL(file);
    proofNickname.value = "";
    shareAnonymous.checked = false;
    proofStatus.textContent = "";
    proofPreviewStep.hidden = false;
    proofForm.hidden = true;
    proofModal.hidden = false;
}

function openShareStep() {
    proofPreviewStep.hidden = true;
    proofForm.hidden = false;
    proofNickname.focus();
}

function closeProofFlow() {
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

    const nickname = proofNickname.value.trim().slice(0, 24);
    const isAnonymous = shareAnonymous.checked;

    if (!isAnonymous && !nickname) {
        proofStatus.textContent = "nickname first.";
        return;
    }

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

        const authorLabel = isAnonymous ? getAnonLabel() : nickname;
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
                nickname,
                is_anonymous: isAnonymous,
                author_label: authorLabel,
                distance_m: Math.round(latestDistance)
            });

        if (insertError) throw insertError;

        closeProofFlow();
        postedModal.hidden = false;
    } catch (error) {
        console.error(error);
        proofStatus.textContent = "post failed.";
    } finally {
        submitProofBtn.disabled = false;
    }
}

function openPostDetail(post) {
    const { data: publicData } = supabaseClient.storage
        .from(SIDEQUEST_BUCKET)
        .getPublicUrl(post.image_path);

    postDetailImage.src = publicData.publicUrl;
    postDetailDate.textContent = formatPostDate(post.created_at);
    postDetailAuthor.textContent = post.author_label || "anon000000";
    postDetailModal.hidden = false;
}

function closePostDetailModal() {
    postDetailModal.hidden = true;
    postDetailImage.removeAttribute("src");
}

async function showPostedFeed() {
    postedModal.hidden = true;
    await showOthers();
}

async function showOthers() {
    showOnly(sidequestFeed);
    gateStatus.textContent = "";
    await loadPosts();
}

async function loadPosts() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabaseClient
        .from(SIDEQUEST_TABLE)
        .select("image_path, created_at, author_label")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(48);

    if (error) {
        console.error(error);
        sidequestPosts.innerHTML = `<p class="sidequest-empty">nothing here yet.</p>`;
        return;
    }

    const posts = data || [];

    if (!posts.length) {
        sidequestPosts.innerHTML = `<p class="sidequest-empty">nothing here yet.</p>`;
        return;
    }

    sidequestPosts.innerHTML = "";

    posts.forEach(post => {
        const { data: publicData } = supabaseClient.storage
            .from(SIDEQUEST_BUCKET)
            .getPublicUrl(post.image_path);

        const button = document.createElement("button");
        button.className = "sidequest-post";
        button.type = "button";
        button.innerHTML = `<img src="${publicData.publicUrl}" alt="">`;
        button.addEventListener("click", () => openPostDetail(post));

        sidequestPosts.appendChild(button);
    });
}

startQuestBtn.addEventListener("click", startQuest);
viewOthersBtn.addEventListener("click", showOthers);
captureMomentBtn.addEventListener("click", openProofPicker);
proofInput.addEventListener("change", event => {
    const [file] = Array.from(event.target.files || []);
    if (file) openProofModal(file);
});
closeProofModal.addEventListener("click", closeProofFlow);
closeShareModal.addEventListener("click", closeProofFlow);
proofModal.addEventListener("click", event => {
    if (event.target === proofModal) closeProofFlow();
});
openShareStepBtn.addEventListener("click", openShareStep);
proofForm.addEventListener("submit", submitProof);
viewPostedBtn.addEventListener("click", showPostedFeed);
nextLocationBtn.addEventListener("click", startNextLocation);
closePostDetail.addEventListener("click", closePostDetailModal);
postDetailModal.addEventListener("click", event => {
    if (event.target === postDetailModal) closePostDetailModal();
});

window.addEventListener("beforeunload", () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
});
