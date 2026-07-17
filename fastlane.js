const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";
const FASTLANE_TABLE = "fastlane_scores";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fastlanePage = document.querySelector(".fastlane-page");
const fastlaneStart = document.getElementById("fastlaneStart");
const fastlaneStartBtn = document.getElementById("fastlaneStartBtn");
const fastlaneGame = document.getElementById("fastlaneGame");
const fastlaneStatus = document.getElementById("fastlaneStatus");
const fastlaneLights = Array.from(document.querySelectorAll(".fastlane-light"));
const fastlaneResult = document.getElementById("fastlaneResult");
const fastlaneResultText = document.getElementById("fastlaneResultText");
const fastlaneScoreForm = document.getElementById("fastlaneScoreForm");
const fastlaneNickname = document.getElementById("fastlaneNickname");
const fastlaneSubmitScore = document.getElementById("fastlaneSubmitScore");
const fastlaneScoreStatus = document.getElementById("fastlaneScoreStatus");
const fastlaneTryAgain = document.getElementById("fastlaneTryAgain");
const fastlaneExitResult = document.getElementById("fastlaneExitResult");

const leaderboardToggle = document.getElementById("leaderboardToggle");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardList = document.getElementById("leaderboardList");

let runState = "idle";
let greenAt = 0;
let latestReactionMs = null;
let sequenceTimers = [];

const LIGHT_COLUMN_INTERVAL = 700;
const FINAL_GREEN_MIN_DELAY = 400;
const FINAL_GREEN_MAX_DELAY = 3000;

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearSequence() {
    sequenceTimers.forEach(timerId => clearTimeout(timerId));
    sequenceTimers = [];
}

function queueStep(callback, delay) {
    const timerId = setTimeout(callback, delay);
    sequenceTimers.push(timerId);
}

function setLightState(blackColumns = 0, green = false) {
    fastlaneLights.forEach((light, index) => {
        const columnIndex = index % 3;
        light.classList.toggle("is-black", !green && columnIndex < blackColumns);
        light.classList.toggle("is-green", green);
    });
}

function showStart() {
    clearSequence();
    runState = "idle";
    latestReactionMs = null;

    setLightState();
    fastlanePage.classList.remove("is-playing");
    fastlaneResult.classList.remove("is-retry-only");
    fastlaneStart.hidden = false;
    fastlaneGame.hidden = true;
    fastlaneResult.hidden = true;
    fastlaneScoreForm.hidden = true;
    fastlaneExitResult.hidden = true;
    fastlaneTryAgain.hidden = true;
    fastlaneScoreStatus.textContent = "";
}

function showTooSoon() {
    clearSequence();
    runState = "finished";

    setLightState();
    fastlanePage.classList.remove("is-playing");
    fastlaneGame.hidden = true;
    fastlaneResult.hidden = false;
    fastlaneResult.classList.remove("is-retry-only");
    fastlaneScoreForm.hidden = true;
    fastlaneExitResult.hidden = false;
    fastlaneExitResult.textContent = "+ try again";
    fastlaneTryAgain.hidden = true;
    fastlaneResultText.textContent = "too soon";
    fastlaneScoreStatus.textContent = "";
}

function showReaction() {
    clearSequence();
    runState = "finished";

    fastlanePage.classList.remove("is-playing");
    fastlaneGame.hidden = true;
    fastlaneResult.hidden = false;
    fastlaneResult.classList.remove("is-retry-only");
    fastlaneScoreForm.hidden = false;
    fastlaneExitResult.hidden = true;
    fastlaneTryAgain.hidden = true;
    fastlaneResultText.textContent = `${latestReactionMs}ms`;
    fastlaneScoreStatus.textContent = "";
    fastlaneNickname.value = "";
    fastlaneNickname.focus();
}

function showPostedAcknowledgement() {
    fastlaneResult.classList.remove("is-retry-only");
    fastlaneScoreForm.hidden = true;
    fastlaneTryAgain.hidden = true;
    fastlaneExitResult.hidden = false;
    fastlaneExitResult.textContent = "exit";
    fastlaneResultText.textContent = "score posted";
    fastlaneScoreStatus.textContent = "";
}

function exitResultModal() {
    if (fastlaneExitResult.textContent.trim() === "+ try again") {
        showStart();
        return;
    }

    fastlaneResult.classList.add("is-retry-only");
    fastlaneExitResult.hidden = true;
    fastlaneScoreForm.hidden = true;
    fastlaneTryAgain.hidden = false;
    fastlaneScoreStatus.textContent = "";
}

function startRun() {
    clearSequence();
    setLightState();

    runState = "arming";
    greenAt = 0;
    latestReactionMs = null;

    fastlaneStart.hidden = true;
    fastlaneResult.hidden = true;
    fastlaneGame.hidden = false;
    fastlanePage.classList.add("is-playing");
    fastlaneStatus.textContent = "wait for green";

    queueStep(() => {
        if (runState !== "arming") return;
        setLightState(1);
    }, LIGHT_COLUMN_INTERVAL);

    queueStep(() => {
        if (runState !== "arming") return;
        setLightState(2);
    }, LIGHT_COLUMN_INTERVAL * 2);

    queueStep(() => {
        if (runState !== "arming") return;
        setLightState(3);
    }, LIGHT_COLUMN_INTERVAL * 3);

    queueStep(() => {
        if (runState !== "arming") return;
        setLightState(0, true);
        runState = "green";
        greenAt = performance.now();
        fastlaneStatus.textContent = "tap";
    }, (LIGHT_COLUMN_INTERVAL * 3) + randomBetween(FINAL_GREEN_MIN_DELAY, FINAL_GREEN_MAX_DELAY));
}

function handleGameTap(event) {
    if (fastlaneGame.hidden || runState === "idle" || runState === "finished") return;

    event.preventDefault();

    if (runState === "arming") {
        showTooSoon();
        return;
    }

    if (runState === "green") {
        latestReactionMs = Math.max(0, Math.round(performance.now() - greenAt));
        showReaction();
    }
}

async function getLeaderboard() {
    const { data, error } = await supabaseClient
        .from(FASTLANE_TABLE)
        .select("*")
        .order("reaction_ms", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(12);

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
}

async function getRank(reactionMs) {
    const { count, error } = await supabaseClient
        .from(FASTLANE_TABLE)
        .select("id", { count: "exact", head: true })
        .lte("reaction_ms", reactionMs);

    if (error) {
        console.error(error);
        return null;
    }

    return count || 1;
}

function renderLeaderboard(scores) {
    leaderboardList.innerHTML = "";

    if (!scores.length) {
        const emptyItem = document.createElement("li");
        emptyItem.innerHTML = "<span>no scores yet</span><strong>0ms</strong>";
        leaderboardList.appendChild(emptyItem);
        return;
    }

    scores.forEach((score, index) => {
        const item = document.createElement("li");
        const name = score.nickname || "anonymous";

        item.innerHTML = `
            <span>${index + 1}. ${name}</span>
            <strong>${score.reaction_ms}ms</strong>
        `;

        leaderboardList.appendChild(item);
    });
}

async function openLeaderboard() {
    leaderboardModal.hidden = false;
    leaderboardList.innerHTML = `
        <li>
            <span>checking...</span>
            <strong>0ms</strong>
        </li>
    `;

    try {
        renderLeaderboard(await getLeaderboard());
    } catch (error) {
        console.error(error);
        leaderboardList.innerHTML = `
            <li>
                <span>leaderboard unavailable</span>
                <strong>--</strong>
            </li>
        `;
    }
}

async function submitScore(event) {
    event.preventDefault();

    const nickname = fastlaneNickname.value.trim();

    if (!nickname || latestReactionMs === null) return;

    fastlaneSubmitScore.disabled = true;
    fastlaneScoreStatus.textContent = "posting...";

    const { error } = await supabaseClient
        .from(FASTLANE_TABLE)
        .insert({
            nickname,
            reaction_ms: latestReactionMs
        });

    if (error) {
        console.error(error);
        fastlaneScoreStatus.textContent = "score did not post.";
        fastlaneSubmitScore.disabled = false;
        return;
    }

    await getRank(latestReactionMs);
    showPostedAcknowledgement();
    fastlaneSubmitScore.disabled = false;
}

fastlaneStartBtn.addEventListener("click", startRun);
fastlaneGame.addEventListener("pointerdown", handleGameTap);
fastlaneTryAgain.addEventListener("click", showStart);
fastlaneExitResult.addEventListener("click", exitResultModal);
fastlaneScoreForm.addEventListener("submit", submitScore);
leaderboardToggle.addEventListener("click", openLeaderboard);

closeLeaderboardBtn.addEventListener("click", () => {
    leaderboardModal.hidden = true;
});

leaderboardModal.addEventListener("click", event => {
    if (event.target === leaderboardModal) {
        leaderboardModal.hidden = true;
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !leaderboardModal.hidden) {
        leaderboardModal.hidden = true;
    }
});

showStart();
