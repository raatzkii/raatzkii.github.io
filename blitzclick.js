const GAME_TIME = 30;
const DAILY_ATTEMPT_LIMIT = 3;

const CUBE_SIZE = 20;
const CUBE_GAP = 2;
const GAME_DURATION_MS = GAME_TIME * 1000;

const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const startSmashingBtn = document.getElementById("startSmashingBtn");
const clickathonStart = document.getElementById("clickathonStart");
const clickathonLimitNotice = document.getElementById("clickathonLimitNotice");
const gameShell = document.getElementById("gameShell");
const cubeGrid = document.getElementById("cubeGrid");

const timeLeft = document.getElementById("timeLeft");
const scoreCount = document.getElementById("scoreCount");
const attemptsLeft = document.getElementById("attemptsLeft");

const gameResult = document.getElementById("gameResult");
const finalScore = document.getElementById("finalScore");
const nicknameInput = document.getElementById("nicknameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const resultMessage = document.getElementById("resultMessage");

const scoreConfirmation = document.getElementById("scoreConfirmation");
const closeConfirmationBtn = document.getElementById("closeConfirmationBtn");
const rankPlace = document.getElementById("rankPlace");
const rankMovement = document.getElementById("rankMovement");
const confirmationMessage = document.getElementById("confirmationMessage");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const shareScoreBtn = document.getElementById("shareScoreBtn");

const leaderboardToggle = document.getElementById("leaderboardToggle");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardList = document.getElementById("leaderboardList");

const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");

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
    return "clickathon_attempts";
}

function getLastAttemptStorageKey() {
    return "clickathon_last_successful_attempt";
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
    if (attemptsLeft) {
        attemptsLeft.textContent = getAttemptsRemaining();
    }

    tryAgainBtn.textContent = `try again (${getAttemptsRemaining()})`;
    tryAgainBtn.disabled = getAttemptsRemaining() <= 0;
}

function updateScoreUI() {
    if (scoreCount) {
        scoreCount.textContent = score;
    }
}

function showLimitNotice() {
    if (!clickathonLimitNotice) return;

    clickathonLimitNotice.textContent = "limit reached. try again after 24hrs";
}

function getOrdinal(number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;
    return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

function createGrid() {
    cubeGrid.innerHTML = "";

    const wrap = cubeGrid.parentElement;
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    const columns = Math.floor((width + CUBE_GAP) / (CUBE_SIZE + CUBE_GAP));
    const rows = Math.floor((height + CUBE_GAP) / (CUBE_SIZE + CUBE_GAP));
    const totalCubes = columns * rows;

    cubeGrid.style.gridTemplateColumns = `repeat(${columns}, ${CUBE_SIZE}px)`;
    cubeGrid.style.gridTemplateRows = `repeat(${rows}, ${CUBE_SIZE}px)`;

    for (let i = 0; i < totalCubes; i++) {
        const cube = document.createElement("button");
        cube.className = "cube";
        cube.type = "button";

        cube.addEventListener("click", () => {
            if (!gameActive || cube.classList.contains("is-green")) return;

            cube.classList.add("is-green");
            cube.style.background = "var(--color-accent)";
            cube.style.borderColor = "var(--color-accent)";
            cube.style.pointerEvents = "none";

            score++;
            updateScoreUI();
        });

        cubeGrid.appendChild(cube);
    }
}

async function runCountdown() {
    gameShell.classList.add("is-counting-down");
    countdownOverlay.hidden = false;

    for (let i = 3; i > 0; i--) {
        countdownNumber.textContent = i;
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    countdownOverlay.hidden = true;
    gameShell.classList.remove("is-counting-down");
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
    clickathonLimitNotice.textContent = "";

    clickathonStart.hidden = true;
    gameResult.hidden = true;
    scoreConfirmation.hidden = true;
    gameShell.hidden = false;
    document.body.classList.add("blitz-active");

    createGrid();

    await runCountdown();

    gameActive = true;
    gameEndsAt = performance.now() + GAME_DURATION_MS;

    cubeGrid.classList.add("is-active");

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
    cubeGrid.classList.remove("is-active");
    document.body.classList.remove("blitz-active");

    latestSubmittedScore = score;
    finalScore.textContent = score;

    gameResult.hidden = false;
    nicknameInput.focus();
}

async function getLeaderboard() {
    const { data, error } = await supabaseClient
        .from("clickathon_scores")
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
        const nameSpan = document.createElement("span");
        nameSpan.textContent = row.nickname || "anonymous";

        const scoreStrong = document.createElement("strong");
        scoreStrong.textContent = row.score ?? 0;

        item.appendChild(nameSpan);
        item.appendChild(scoreStrong);
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

    if (!Number.isFinite(latestSubmittedScore) || latestSubmittedScore < 0) {
        resultMessage.textContent = "Score looks off.";
        return;
    }

    submitScoreBtn.disabled = true;
    submitScoreBtn.textContent = "Posting...";

    const beforeRows = await getLeaderboard();
    const beforeRank = getRankFromRows(beforeRows, latestSubmittedScore);

    const { error } = await supabaseClient
        .from("clickathon_scores")
        .insert({
            nickname,
            score: latestSubmittedScore
        });

    if (error) {
        console.error(error);
        resultMessage.textContent = "Failed to post score.";
        submitScoreBtn.disabled = false;
        submitScoreBtn.textContent = "Submit Score";
        return;
    }

    const afterRows = await getLeaderboard();
    const afterRank = getRankFromRows(afterRows, latestSubmittedScore);

    rankPlace.textContent = getOrdinal(afterRank);

    rankMovement.classList.remove("is-up", "is-down");

    if (afterRank <= beforeRank) {
        rankMovement.textContent = "↗";
        rankMovement.classList.add("is-up");
        confirmationMessage.textContent = "nice! you landed at";
    } else {
        rankMovement.textContent = "↘";
        rankMovement.classList.add("is-down");
        confirmationMessage.textContent = "nice! you landed at";
    }

    updateAttemptsUI();

    gameResult.hidden = true;
    scoreConfirmation.hidden = false;

    submitScoreBtn.disabled = false;
    submitScoreBtn.textContent = "Submit Score";

    await renderLeaderboard();
}

function sharePage() {
    const shareData = {
        title: "Clickathon",
        text: `I scored ${latestSubmittedScore} on Clickathon. Beat me.`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(window.location.href);
        confirmationMessage.textContent = "Link copied. Now go annoy someone.";
    }
}

startSmashingBtn.addEventListener("click", startGame);
submitScoreBtn.addEventListener("click", submitScore);

tryAgainBtn.addEventListener("click", () => {
    startGame();
});

shareScoreBtn.addEventListener("click", sharePage);

closeConfirmationBtn.addEventListener("click", () => {
    scoreConfirmation.hidden = true;
    clickathonStart.hidden = false;
    gameShell.hidden = true;
    document.body.classList.remove("blitz-active");
});

leaderboardToggle.addEventListener("click", async () => {
    leaderboardModal.hidden = false;
    await renderLeaderboard();
});

closeLeaderboardBtn.addEventListener("click", () => {
    leaderboardModal.hidden = true;
});

window.addEventListener("resize", () => {
    if (!gameShell.hidden && !gameActive) {
        createGrid();
    }
});

updateAttemptsUI();
