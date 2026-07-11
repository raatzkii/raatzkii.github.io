const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

function getWallUserId() {
    let userId = localStorage.getItem("wall_user_id");

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("wall_user_id", userId);
    }

    return userId;
}

const wallUserId = getWallUserId();

const noteComposer = document.querySelector("#noteComposer");
const noteInput = document.querySelector("#noteInput");
const noteTrigger = document.querySelector(".wall-note-trigger");
const cancelNote = document.querySelector("#cancelNote");
const postNote = document.querySelector("#postNote");
const charCount = document.querySelector("#charCount");
const wallCooldown = document.querySelector("#wallCooldown");
const notesLayer = document.querySelector(".wall-notes");

const cooldownTime = 10 * 60 * 1000;

function getRemainingCooldown() {
    const lastPost = Number(localStorage.getItem("wall_last_post")) || 0;
    const elapsed = Date.now() - lastPost;

    return Math.max(cooldownTime - elapsed, 0);
}

function formatCooldown(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
}

function updateCooldownText() {
    const remaining = getRemainingCooldown();

    if (remaining <= 0) {
        wallCooldown.textContent = "";
        return;
    }

    wallCooldown.textContent =
        `next note available in ${formatCooldown(remaining)}.`;
}

function getSafeNotePosition(noteWidth, noteHeight) {
    const center = document.querySelector(".wall-center");
    const centerRect = center.getBoundingClientRect();

    const padding = 24;
    const maxAttempts = 100;

    for (let i = 0; i < maxAttempts; i++) {
        const x = Math.random() * (window.innerWidth - noteWidth);
        const y = Math.random() * (window.innerHeight - noteHeight);

        const noteRect = {
            left: x,
            top: y,
            right: x + noteWidth,
            bottom: y + noteHeight
        };

        const overlapsCenter = !(
            noteRect.right < centerRect.left - padding ||
            noteRect.left > centerRect.right + padding ||
            noteRect.bottom < centerRect.top - padding ||
            noteRect.top > centerRect.bottom + padding
        );

        if (!overlapsCenter) {
            return { x, y };
        }
    }

    return { x: 24, y: 24 };
}

function isOverCenterArea(note, x, y) {
    const center = document.querySelector(".wall-center");
    const centerRect = center.getBoundingClientRect();
    const padding = 24;

    const noteRect = {
        left: x,
        top: y,
        right: x + note.offsetWidth,
        bottom: y + note.offsetHeight
    };

    return !(
        noteRect.right < centerRect.left - padding ||
        noteRect.left > centerRect.right + padding ||
        noteRect.bottom < centerRect.top - padding ||
        noteRect.top > centerRect.bottom + padding
    );
}

function renderNote(item) {
    if (!item || item.is_deleted) return;

    const existingNote = document.querySelector(
        `[data-note-id="${item.id}"]`
    );

    if (existingNote) {
        existingNote.textContent = item.message;
        existingNote.dataset.id = item.id;
        existingNote.dataset.noteId = item.id;
        existingNote.dataset.ownerId = item.owner_id || "";
        existingNote.style.left = `${item.x}px`;
        existingNote.style.top = `${item.y}px`;
        return;
    }

    const note = document.createElement("div");

    note.className = "wall-note";
    note.textContent = item.message;

    note.dataset.id = item.id;
    note.dataset.noteId = item.id;
    note.dataset.ownerId = item.owner_id || "";

    note.style.left = `${item.x}px`;
    note.style.top = `${item.y}px`;

    notesLayer.appendChild(note);
    makeNoteDraggable(note);
}

async function loadNotes() {
    await supabaseClient.rpc("cleanup_old_wall_notes");

    const { data, error } = await supabaseClient
        .from("wall_notes")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Load notes error:", error);
        return;
    }

    notesLayer.innerHTML = "";

    data.forEach(item => {
        renderNote(item);
    });
}

function makeNoteDraggable(note) {
    if (note.dataset.ownerId !== wallUserId) {
        note.classList.add("locked-note");
        return;
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    note.addEventListener("pointerdown", event => {
        isDragging = true;

        note.setPointerCapture(event.pointerId);

        offsetX = event.clientX - note.offsetLeft;
        offsetY = event.clientY - note.offsetTop;

        note.style.cursor = "grabbing";
        note.style.zIndex = "30";
    });

    note.addEventListener("pointermove", event => {
        if (!isDragging) return;

        let x = event.clientX - offsetX;
        let y = event.clientY - offsetY;

        const maxX = window.innerWidth - note.offsetWidth;
        const maxY = window.innerHeight - note.offsetHeight;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        if (!isOverCenterArea(note, x, y)) {
            note.style.left = `${x}px`;
            note.style.top = `${y}px`;
        }
    });

    note.addEventListener("pointerup", async () => {
        isDragging = false;

        note.style.cursor = "grab";
        note.style.zIndex = "10";

        const id = note.dataset.id;
        if (!id) return;

        const x = parseFloat(note.style.left);
        const y = parseFloat(note.style.top);

        const { error } = await supabaseClient
            .from("wall_notes")
            .update({ x, y })
            .eq("id", id);

        if (error) {
            console.error("Move note error:", error);
        }
    });
}

noteTrigger.addEventListener("click", () => {
    const remaining = getRemainingCooldown();

    if (remaining > 0) {
        alert(
            `you've reached the note limit. please try again in ${formatCooldown(remaining)}.`
        );
        return;
    }

    noteComposer.classList.add("active");

    noteInput.value = "";
    charCount.textContent = "0/120";

    noteInput.focus();
});

cancelNote.addEventListener("click", () => {
    noteComposer.classList.remove("active");
});

noteInput.addEventListener("input", () => {
    charCount.textContent = `${noteInput.value.length}/120`;
});

postNote.addEventListener("click", async () => {
    if (postNote.disabled) return;

    const message = noteInput.value.trim().slice(0, 120);

    if (!message) return;

    postNote.disabled = true;

    const position = getSafeNotePosition(260, 120);

    const { data, error } = await supabaseClient
        .from("wall_notes")
        .insert({
            message,
            x: position.x,
            y: position.y,
            owner_id: wallUserId,
            is_deleted: false
        })
        .select()
        .single();

    if (error) {
        console.error("Post note error:", error);
        postNote.disabled = false;
        return;
    }

    renderNote(data);

    localStorage.setItem("wall_last_post", Date.now());
    updateCooldownText();

    noteComposer.classList.remove("active");
    noteInput.value = "";
    charCount.textContent = "0/120";
    postNote.disabled = false;
});

loadNotes();

supabaseClient
    .channel("wall-notes-live")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "wall_notes"
        },
        payload => {
            if (payload.eventType === "INSERT") {
                renderNote(payload.new);
            }

            if (payload.eventType === "UPDATE") {
                if (payload.new?.is_deleted) {
                    document
                        .querySelector(`[data-note-id="${payload.new.id}"]`)
                        ?.remove();

                    return;
                }

                renderNote(payload.new);
            }

            if (payload.eventType === "DELETE") {
                document
                    .querySelector(`[data-note-id="${payload.old.id}"]`)
                    ?.remove();
            }
        }
    )
    .subscribe(status => {
        console.log("Wall realtime status:", status);
    });

setInterval(updateCooldownText, 1000);
updateCooldownText();
