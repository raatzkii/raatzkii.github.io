const dontblinkBrief = document.getElementById("dontblinkBrief");
const dontblinkGame = document.getElementById("dontblinkGame");
const dontblinkField = document.getElementById("dontblinkField");
const dontblinkTimer = document.getElementById("dontblinkTimer");
const dontblinkStart = document.getElementById("dontblinkStart");
const dontblinkRestart = document.getElementById("dontblinkRestart");
const dontblinkResult = document.getElementById("dontblinkResult");
const dontblinkResultText = document.getElementById("dontblinkResultText");
const dontblinkScoreForm = document.getElementById("dontblinkScoreForm");
const dontblinkNickname = document.getElementById("dontblinkNickname");
const dontblinkSubmitScore = document.getElementById("dontblinkSubmitScore");
const dontblinkScoreStatus = document.getElementById("dontblinkScoreStatus");
const leaderboardToggle = document.getElementById("leaderboardToggle");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardList = document.getElementById("leaderboardList");
const backToPlay = document.querySelector(".back-to-play");

const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const gameDuration = 300000;

const decoyIcons = [
    "hgi-home-01", "hgi-carousel-vertical", "hgi-cells", "hgi-message-add-02",
    "hgi-search-01", "hgi-user", "hgi-settings-02", "hgi-alert-02",
    "hgi-analytics-01", "hgi-doc-01", "hgi-image-01", "hgi-paint-board",
    "hgi-sent", "hgi-menu-01", "hgi-eye",
    "hgi-lock", "hgi-unlock-01", "hgi-laptop", "hgi-code",
    "hgi-rocket-01", "hgi-bug-01", "hgi-wifi-01", "hgi-cloud",
    "hgi-clock-01", "hgi-calendar-03", "hgi-location-01", "hgi-link-01",
    "hgi-share-08", "hgi-thumbs-up", "hgi-thumbs-down", "hgi-dashboard-square-01",
    "hgi-cursor-01", "hgi-coffee-01", "hgi-game-controller-03", "hgi-magic-wand-01",
    "hgi-brush", "hgi-layers-01", "hgi-package", "hgi-folder-01",
    "hgi-bubble-chat", "hgi-task-01", "hgi-news", "hgi-cpu",
    "hgi-database", "hgi-terminal", "hgi-server-01", "hgi-shield-01",
    "hgi-key-01", "hgi-finger-print", "hgi-mouse-01", "hgi-keyboard",
    "hgi-monitor-01", "hgi-smart-phone-01", "hgi-tablet-01", "hgi-usb",
    "hgi-ai-brain-01", "hgi-bot", "hgi-git-branch", "hgi-code-circle",
    "hgi-puzzle", "hgi-target-01", "hgi-radar-01", "hgi-map-pin",
    "hgi-flag-01", "hgi-book-01", "hgi-pen-tool-01", "hgi-pencil",
    "hgi-eraser", "hgi-crop", "hgi-colors", "hgi-palette",
    "hgi-camera-01", "hgi-video-01", "hgi-mic-01", "hgi-headphones",
    "hgi-bell-01", "hgi-notification-01", "hgi-star", "hgi-fire",
    "hgi-zap", "hgi-flash", "hgi-trophy", "hgi-medal-01",
    "hgi-gift", "hgi-cart", "hgi-wallet-01", "hgi-money-bag-01",
    "hgi-chart", "hgi-pie-chart", "hgi-activity-01", "hgi-speedometer-01"
];

let countdownId;
let restoreId;
let revealId;
let resultId;
let gameEndsAt = 0;
let gameStartsAt = 0;
let gameActive = false;
let latestElapsedMilliseconds = 0;
let currentIconPool = shuffle(decoyIcons);

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

function clearTimers() {
    cancelAnimationFrame(countdownId);
    clearTimeout(restoreId);
    clearTimeout(revealId);
    clearTimeout(resultId);
}

function resetRoundState() {
    document.body.classList.remove("hunt-active");
    dontblinkGame?.classList.remove("is-over");
    dontblinkGame?.querySelectorAll(".is-revealed").forEach(element => {
        element.classList.remove("is-revealed");
    });
}

function getWinMessage(elapsedMilliseconds) {
    if (elapsedMilliseconds <= 15000) return "yo what the f*ck??";
    if (elapsedMilliseconds <= 45000) return "that's fast. mad respect";
    if (elapsedMilliseconds <= 90000) return "nice. made it look easy";
    if (elapsedMilliseconds <= 150000) return "good find. can do better tho";
    if (elapsedMilliseconds <= 240000) return "congrats. you're eyes are normal";
    if (elapsedMilliseconds <= 270000) return "better late than never, right?";
    if (elapsedMilliseconds < gameDuration) return "mission accomplished, i guess";
    return "at least you didn't quit (slow clap)";
}

function formatTime(milliseconds) {
    const safeMilliseconds = Math.max(0, milliseconds);
    const totalSeconds = Math.ceil(safeMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatElapsedTime(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function resetScoreForm() {
    if (dontblinkScoreForm) {
        dontblinkScoreForm.hidden = true;
        dontblinkScoreForm.reset();
    }

    if (dontblinkScoreStatus) {
        dontblinkScoreStatus.textContent = "";
    }

    if (dontblinkSubmitScore) {
        dontblinkSubmitScore.disabled = false;
        dontblinkSubmitScore.textContent = "submit";
    }
}

function updateTimer() {
    if (!gameActive) return;

    const remaining = gameEndsAt - performance.now();
    dontblinkTimer.textContent = formatTime(remaining);

    if (remaining <= 0) {
        dontblinkTimer.textContent = "00:00";
        loseGame();
        return;
    }

    countdownId = requestAnimationFrame(updateTimer);
}

function createIcon(iconName, index, placement, isTarget = false) {
    const button = document.createElement("button");
    button.className = `dontblink-icon${isTarget ? " is-target" : ""}`;
    button.type = "button";
    button.style.left = `${placement.x}px`;
    button.style.top = `${placement.y}px`;
    button.style.setProperty("--icon-size", "20px");
    button.style.setProperty("--icon-color", "#1c1c1c");
    button.style.setProperty("--icon-rotation", "0deg");
    button.innerHTML = `<i class="hgi hgi-stroke hgi-rounded ${iconName}" aria-hidden="true"></i>`;
    button.setAttribute("aria-label", isTarget ? "Heart" : "Decoy icon");

    if (isTarget) {
        button.addEventListener("click", winGame);
    }

    return button;
}

function createPlacements() {
    const fieldRect = dontblinkField.getBoundingClientRect();
    const placements = [];
    const cellSize = 28;
    const columns = Math.max(1, Math.floor(fieldRect.width / cellSize));
    const rows = Math.max(1, Math.floor(fieldRect.height / cellSize));
    const usedWidth = columns * cellSize;
    const usedHeight = rows * cellSize;
    const startX = (fieldRect.width - usedWidth) / 2;
    const startY = (fieldRect.height - usedHeight) / 2;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            placements.push({
                x: Math.round(startX + (column + 0.5) * cellSize),
                y: Math.round(startY + (row + 0.5) * cellSize)
            });
        }
    }

    return placements;
}

function populateField() {
    dontblinkField.innerHTML = "";

    const placements = createPlacements();
    const totalIcons = placements.length;
    const targetIndex = Math.floor(Math.random() * totalIcons);
    let iconQueue = shuffle(decoyIcons);

    for (let index = 0; index < totalIcons; index++) {
        const isTarget = index === targetIndex;
        if (!iconQueue.length) {
            iconQueue = shuffle(decoyIcons);
        }

        const iconName = isTarget ? "hgi-favourite" : iconQueue.pop();
        dontblinkField.appendChild(createIcon(iconName, index, placements[index], isTarget));
    }
}

function startGame() {
    clearTimers();
    resetRoundState();
    resetScoreForm();
    gameActive = true;
    gameStartsAt = performance.now();
    gameEndsAt = gameStartsAt + gameDuration;
    dontblinkTimer.textContent = "05:00";
    document.body.classList.add("hunt-active");
    dontblinkBrief.hidden = true;
    dontblinkResult.hidden = true;
    dontblinkResult.classList.remove("is-failure");
    dontblinkGame.hidden = false;
    dontblinkGame.classList.remove("is-over");
    populateField();
    countdownId = requestAnimationFrame(updateTimer);
}

function winGame() {
    if (!gameActive) return;

    const elapsedMilliseconds = performance.now() - gameStartsAt;
    latestElapsedMilliseconds = elapsedMilliseconds;
    clearTimers();
    resetRoundState();
    gameActive = false;
    dontblinkGame.hidden = true;
    dontblinkResult.hidden = false;
    dontblinkResult.classList.remove("is-failure");
    dontblinkResultText.textContent = getWinMessage(elapsedMilliseconds);
    dontblinkScoreForm.hidden = false;

    requestAnimationFrame(() => {
        dontblinkNickname?.focus();
    });
}

function loseGame() {
    clearTimers();
    gameActive = false;
    dontblinkGame.classList.add("is-over");
    dontblinkGame.querySelector(".dontblink-icon.is-target")?.classList.add("is-revealed");
    resetScoreForm();

    resultId = setTimeout(() => {
        document.body.classList.remove("hunt-active");
        dontblinkGame.hidden = true;
        dontblinkResult.hidden = false;
        dontblinkResult.classList.remove("is-failure");
        dontblinkResultText.textContent = "looks like this game ain't for you.";
    }, 2000);
}

function quitGame(event) {
    if (!gameActive) return;

    event.preventDefault();
    clearTimers();
    resetRoundState();
    gameActive = false;
    dontblinkGame.hidden = true;
    resetScoreForm();
    dontblinkResult.hidden = false;
    dontblinkResult.classList.remove("is-failure");
    dontblinkResultText.textContent = "i didn't know your surname is 'quitter'. that's okay... i guess.";
}

function returnToStart() {
    clearTimers();
    resetRoundState();
    gameActive = false;
    dontblinkGame.hidden = true;
    dontblinkResult.hidden = true;
    dontblinkResult.classList.remove("is-failure");
    dontblinkBrief.hidden = false;
    dontblinkField.innerHTML = "";
    dontblinkTimer.textContent = "05:00";
    resetScoreForm();
}

async function getLeaderboard() {
    const { data, error } = await supabaseClient
        .from("mostwanted_scores")
        .select("*")
        .order("elapsed_ms", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(12);

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
}

async function renderLeaderboard() {
    const rows = await getLeaderboard();

    leaderboardList.innerHTML = "";

    if (!rows.length) {
        leaderboardList.innerHTML = `
            <li>
                <span>checking...</span>
                <strong>00:00</strong>
            </li>
        `;
        return;
    }

    rows.forEach(row => {
        const item = document.createElement("li");
        const name = document.createElement("span");
        const time = document.createElement("strong");

        name.textContent = row.nickname;
        time.textContent = formatElapsedTime(row.elapsed_ms);

        item.append(name, time);
        leaderboardList.appendChild(item);
    });
}

async function submitDontBlinkScore(event) {
    event.preventDefault();

    const nickname = dontblinkNickname.value.trim().slice(0, 24);

    if (!nickname) {
        dontblinkScoreStatus.textContent = "nickname first.";
        return;
    }

    const elapsedMs = Math.round(latestElapsedMilliseconds);

    if (!Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > gameDuration) {
        dontblinkScoreStatus.textContent = "score looks weird.";
        return;
    }

    dontblinkSubmitScore.disabled = true;
    dontblinkSubmitScore.textContent = "adding...";
    dontblinkScoreStatus.textContent = "";

    const { error } = await supabaseClient
        .from("mostwanted_scores")
        .insert({
            nickname,
            elapsed_ms: elapsedMs
        });

    if (error) {
        console.error(error);
        dontblinkScoreStatus.textContent = "score failed.";
        dontblinkSubmitScore.disabled = false;
        dontblinkSubmitScore.textContent = "submit";
        return;
    }

    dontblinkScoreStatus.textContent = "score added.";
    dontblinkScoreForm.hidden = true;
    await renderLeaderboard();
}

dontblinkStart?.addEventListener("click", startGame);
dontblinkRestart?.addEventListener("click", returnToStart);
backToPlay?.addEventListener("click", quitGame);
dontblinkScoreForm?.addEventListener("submit", submitDontBlinkScore);

leaderboardToggle?.addEventListener("click", async () => {
    leaderboardModal.hidden = false;
    await renderLeaderboard();
});

closeLeaderboardBtn?.addEventListener("click", () => {
    leaderboardModal.hidden = true;
});

leaderboardModal?.addEventListener("click", event => {
    if (event.target === leaderboardModal) {
        leaderboardModal.hidden = true;
    }
});

window.addEventListener("beforeunload", event => {
    if (!gameActive) return;

    event.preventDefault();
    event.returnValue = "";
});
