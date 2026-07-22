const GAME_TIME = 30;
const DAILY_ATTEMPT_LIMIT = 3;
const GAME_DURATION_MS = GAME_TIME * 1000;

const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";
const SCORE_TABLE = "tap_smash_scores";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const tapStart = document.getElementById("tapStart");
const startTapBtn = document.getElementById("startTapBtn");
const tapLimitNotice = document.getElementById("tapLimitNotice");
const tapGame = document.getElementById("tapGame");
const tapZone = document.getElementById("tapZone");
const tapScore = document.getElementById("tapScore");
const timeLeft = document.getElementById("timeLeft");
const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");
const gameResult = document.getElementById("gameResult");
const finalScore = document.getElementById("finalScore");
const nicknameInput = document.getElementById("nicknameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const resultMessage = document.getElementById("resultMessage");
const scoreConfirmation = document.getElementById("scoreConfirmation");
const closeConfirmationBtn = document.getElementById("closeConfirmationBtn");
const rankPlace = document.getElementById("rankPlace");
const confirmationMessage = document.getElementById("confirmationMessage");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const shareScoreBtn = document.getElementById("shareScoreBtn");
const leaderboardToggle = document.getElementById("leaderboardToggle");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardList = document.getElementById("leaderboardList");

let score = 0;
let timer = null;
let gameEndsAt = 0;
let gameActive = false;
let latestSubmittedScore = 0;

function formatTime(milliseconds) {
    const safeMilliseconds = Math.max(0, milliseconds);
    const seconds = Math.floor(safeMilliseconds / 1000);
    const centiseconds = Math.floor((safeMilliseconds % 1000) / 10);

    return `${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
}

function getAttemptStorageKey() {
    return "tap_smash_attempts";
}

function getLastAttemptStorageKey() {
    return "tap_smash_last_successful_attempt";
}

function getAttemptsUsed() {
    const lastAttempt = Number(localStorage.getItem(getLastAttemptStorageKey())) || 0;

    if (lastAttempt && Date.now() - lastAttempt >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem(getAttemptStorageKey());
        localStorage.removeItem(getLastAttemptStorageKey());
        return 0;
    }

    return Number(localStorage.getItem(getAttemptStorageKey())) || 0;
}

function getAttemptsRemaining() {
    return Math.max(DAILY_ATTEMPT_LIMIT - getAttemptsUsed(), 0);
}

function useAttempt() {
    const used = getAttemptsUsed() + 1;
    localStorage.setItem(getAttemptStorageKey(), used);
    localStorage.setItem(getLastAttemptStorageKey(), Date.now());
    updateAttemptsUI();
}

function updateAttemptsUI() {
    tryAgainBtn.textContent = `try again (${getAttemptsRemaining()})`;
    tryAgainBtn.disabled = getAttemptsRemaining() <= 0;
}

function updateScoreUI() {
    tapScore.textContent = score;
}

function showLimitNotice() {
    tapLimitNotice.textContent = "limit reached. try again after 24hrs";
}

function getOrdinal(number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;
    return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

async function runCountdown() {
    tapGame.classList.add("is-counting-down");
    countdownOverlay.hidden = false;

    for (let i = 3; i > 0; i--) {
        countdownNumber.textContent = i;
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    countdownOverlay.hidden = true;
    tapGame.classList.remove("is-counting-down");
}

async function startGame() {
    if (getAttemptsRemaining() <= 0) {
        showLimitNotice();
        return;
    }

    useAttempt();

    score = 0;
    gameActive = false;
    updateScoreUI();

    timeLeft.textContent = formatTime(GAME_DURATION_MS);
    tapLimitNotice.textContent = "";

    tapStart.hidden = true;
    gameResult.hidden = true;
    scoreConfirmation.hidden = true;
    tapGame.hidden = false;
    document.body.classList.add("tap-active");

    await runCountdown();

    gameActive = true;
    gameEndsAt = performance.now() + GAME_DURATION_MS;

    timer = setInterval(() => {
        const remaining = gameEndsAt - performance.now();
        timeLeft.textContent = formatTime(remaining);

        if (remaining <= 0) {
            endGame();
        }
    }, 31);
}

function endGame() {
    clearInterval(timer);
    timeLeft.textContent = formatTime(0);
    gameActive = false;
    document.body.classList.remove("tap-active");

    latestSubmittedScore = score;
    finalScore.textContent = score;
    gameResult.hidden = false;
    nicknameInput.focus();
}

function handleTap(event) {
    if (!gameActive) return;

    event.preventDefault();
    score++;
    updateScoreUI();
}

async function getLeaderboard() {
    const { data, error } = await supabaseClient
        .from(SCORE_TABLE)
        .select("*")
        .order("score", { ascending: false })
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
                <span>no scores yet</span>
                <strong>0</strong>
            </li>
        `;
        return;
    }

    rows.forEach(row => {
        const item = document.createElement("li");
        const name = document.createElement("span");
        const value = document.createElement("strong");

        name.textContent = row.nickname || "anonymous";
        value.textContent = row.score ?? 0;

        item.appendChild(name);
        item.appendChild(value);
        leaderboardList.appendChild(item);
    });
}

function getRankFromRows(rows, scoreValue) {
    const index = rows.findIndex(row => scoreValue >= row.score);
    return index === -1 ? rows.length + 1 : index + 1;
}

async function submitScore() {
    const nickname = nicknameInput.value.trim().slice(0, 24);

    if (!nickname) {
        resultMessage.textContent = "nickname first, legend.";
        return;
    }

    submitScoreBtn.disabled = true;
    submitScoreBtn.textContent = "posting...";

    const beforeRows = await getLeaderboard();
    const beforeRank = getRankFromRows(beforeRows, latestSubmittedScore);

    const { error } = await supabaseClient
        .from(SCORE_TABLE)
        .insert({
            nickname,
            score: latestSubmittedScore
        });

    if (error) {
        console.error(error);
        resultMessage.textContent = "failed to post score.";
        submitScoreBtn.disabled = false;
        submitScoreBtn.textContent = "submit score";
        return;
    }

    const afterRows = await getLeaderboard();
    const afterRank = getRankFromRows(afterRows, latestSubmittedScore);

    rankPlace.textContent = getOrdinal(afterRank);
    confirmationMessage.textContent = afterRank <= beforeRank
        ? "nice! you landed at"
        : "nice! you landed at";

    updateAttemptsUI();
    gameResult.hidden = true;
    scoreConfirmation.hidden = false;
    submitScoreBtn.disabled = false;
    submitScoreBtn.textContent = "submit score";

    await renderLeaderboard();
}

function sharePage() {
    const shareData = {
        title: "Tap Smash",
        text: `I scored ${latestSubmittedScore} on Tap Smash. Beat me.`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(window.location.href);
        confirmationMessage.textContent = "link copied.";
    }
}

startTapBtn.addEventListener("click", startGame);
tapZone.addEventListener("pointerdown", handleTap);
submitScoreBtn.addEventListener("click", submitScore);
tryAgainBtn.addEventListener("click", startGame);
shareScoreBtn.addEventListener("click", sharePage);
closeConfirmationBtn.addEventListener("click", () => {
    scoreConfirmation.hidden = true;
    tapStart.hidden = false;
    tapGame.hidden = true;
    document.body.classList.remove("tap-active");
});
leaderboardToggle.addEventListener("click", async () => {
    leaderboardModal.hidden = false;
    await renderLeaderboard();
});
closeLeaderboardBtn.addEventListener("click", () => {
    leaderboardModal.hidden = true;
});

updateAttemptsUI();
