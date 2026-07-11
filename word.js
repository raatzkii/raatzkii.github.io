const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const currentWord = document.getElementById("currentWord");
const currentAge = document.getElementById("currentAge");
const totalChanges = document.getElementById("totalChanges");
const uniqueWords = document.getElementById("uniqueWords");

const changeWordBtn = document.getElementById("changeWordBtn");
const wordModal = document.getElementById("wordModal");
const closeModalBtn = document.getElementById("closeModalBtn");

const wordForm = document.getElementById("wordForm");
const wordInput = document.getElementById("wordInput");

const hallOfFame = document.getElementById("hallOfFame");

let rows = [];

function getAgeLabel(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

    return "just now";
}

function getDurationLabel(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(ms / 86400000);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

    return "less than a minute";
}

function getCurrentRow() {
    return rows[rows.length - 1] || null;
}

function getHallOfFameRows() {
    return rows
        .slice(0, -1)
        .map((row, index) => {
            const nextRow = rows[index + 1];

            const start = new Date(row.created_at).getTime();
            const end = new Date(nextRow.created_at).getTime();

            return {
                word: row.word,
                ageMs: end - start,
                age: getDurationLabel(end - start)
            };
        })
        .sort((a, b) => b.ageMs - a.ageMs)
        .slice(0, 5);
}

async function loadWords() {
    const { data, error } = await supabaseClient
        .from("last_word")
        .select("id, word, created_at")
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    rows = data || [];

    if (!rows.length) {
        await createInitialWord();
        return;
    }

    render();
}

async function createInitialWord() {
    const { error } = await supabaseClient
        .from("last_word")
        .insert({
            word: "hello"
        });

    if (error) {
        console.error(error);
        return;
    }

    await loadWords();
}

function renderHallOfFame() {
    hallOfFame.innerHTML = "";

    const fameRows = getHallOfFameRows();

    if (!fameRows.length) {
        hallOfFame.replaceChildren();

        const emptyState = document.createElement("p");
        emptyState.className = "empty-state";
        emptyState.textContent = "no defeated words yet.";

        hallOfFame.appendChild(emptyState);
        return;
    }

    fameRows.forEach(item => {
        const row = document.createElement("div");

        row.className = "hall-item";

        const wordStrong = document.createElement("strong");
        wordStrong.textContent = item.word;

        const ageSpan = document.createElement("span");
        ageSpan.textContent = item.age;

        row.appendChild(wordStrong);
        row.appendChild(ageSpan);

        hallOfFame.appendChild(row);
    });
}

function render() {
    const current = getCurrentRow();

    if (!current) return;

    currentWord.replaceChildren();

    const wordHighlight = document.createElement("span");
    wordHighlight.className = "word-highlight";
    wordHighlight.textContent = current.word;

    currentWord.appendChild(wordHighlight);
    currentAge.textContent = getAgeLabel(current.created_at);
    totalChanges.textContent = Math.max(rows.length - 1, 0);

    const unique = new Set(
        rows.map(row => row.word.toLowerCase())
    );

    uniqueWords.textContent = unique.size;

    renderHallOfFame();
}

function openModal() {
    wordModal.hidden = false;

    setTimeout(() => {
        wordInput.focus();
    }, 50);
}

function closeModal() {
    wordModal.hidden = true;
    wordInput.value = "";
}

async function submitWord(event) {
    event.preventDefault();

    const newWord = wordInput.value.trim().slice(0, 10);

    if (!newWord) return;

    if (newWord.length > 10) {
        alert("Maximum of 10 characters only.");
        return;
    }

    const current = getCurrentRow();

    if (
        current &&
        newWord.toLowerCase() === current.word.toLowerCase()
    ) {
        alert("Choose a different word.");
        return;
    }

    const { error } = await supabaseClient
        .from("last_word")
        .insert({
            word: newWord
        });

    if (error) {
        console.error(error);
        alert("Word update failed.");
        return;
    }

    closeModal();
    await loadWords();
}

changeWordBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

wordModal.addEventListener("click", event => {
    if (event.target === wordModal) {
        closeModal();
    }
});

wordForm.addEventListener("submit", submitWord);

setInterval(render, 10000);

loadWords();
