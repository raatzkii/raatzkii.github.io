const SUPABASE_URL = "https://bkngawvthptxdswshcbm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gW9mV7KogmX_ZR1xmTUk8w_O9IRap8H";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const adminPage = document.getElementById("adminPage");
const adminStatus = document.getElementById("adminStatus");

const wallToggleBtn = document.getElementById("wallToggleBtn");
const wallNotesPanel = document.getElementById("wallNotesPanel");
const wallNotesList = document.getElementById("wallNotesList");
const wallNotesStatus = document.getElementById("wallNotesStatus");

let mainAdminPassword = "";

async function verifyPassword(password) {
    const { data, error } = await supabaseClient.rpc(
        "verify_main_admin_password",
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

async function unlockAdmin() {
    const password = prompt(
        "Enter admin password"
    );

    if (!password) {
        document.body.innerHTML = "";
        return;
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
        document.body.innerHTML = `
            <main style="
                min-height:100vh;
                display:grid;
                place-items:center;
                font-family:'DM Sans',sans-serif;
            ">
                <h1>Access denied.</h1>
            </main>
        `;

        return;
    }
    
    mainAdminPassword = password;
    adminPage.hidden = false;
}

async function resetWord() {
    const confirmed = confirm(
        "Reset Last Word?"
    );

    if (!confirmed) return;

    adminStatus.textContent = "Resetting Last Word...";

    const { error } = await supabaseClient.rpc(
        "reset_last_word_everything",
        {
            input_password: mainAdminPassword
        }
    );

    if (error) {
        console.error(error);

        adminStatus.textContent =
            "Last Word reset failed.";

        return;
    }

    adminStatus.textContent =
        "Last Word reset complete.";
}

async function resetWall() {
    const confirmed = confirm(
        "Reset Wall?"
    );

    if (!confirmed) return;

    adminStatus.textContent = "Resetting Wall...";

    const { error } = await supabaseClient.rpc(
        "reset_wall_everything",
        {
            input_password: mainAdminPassword
        }
    );

    if (error) {
        console.error(error);

        adminStatus.textContent =
            "Wall reset failed.";

        return;
    }

    adminStatus.textContent =
        "Wall reset complete.";

    if (!wallNotesPanel.hidden) {
        await loadWallNotes();
    }
}

async function resetGallery() {
    const confirmed = confirm(
        "Reset Gallery reactions?"
    );

    if (!confirmed) return;

    adminStatus.textContent =
        "Resetting Gallery...";

    const { error } = await supabaseClient.rpc(
        "reset_gallery_reactions",
        {
            input_password: mainAdminPassword
        }
    );

    if (error) {
        console.error(error);

        adminStatus.textContent =
            "Gallery reset failed.";

        return;
    }

    adminStatus.textContent =
        "Gallery reset complete.";
}

async function resetClickathon() {
    const confirmed = confirm(
        "Reset Clickathon scores?"
    );

    if (!confirmed) return;

    adminStatus.textContent =
        "Resetting Clickathon...";

    const { error } = await supabaseClient.rpc(
        "reset_clickathon_scores",
        {
            input_password: mainAdminPassword
        }
    );

    if (error) {
        console.error(error);

        adminStatus.textContent =
            "Clickathon reset failed.";

        return;
    }

    adminStatus.textContent =
        "Clickathon reset complete.";
}

async function resetDontBlink() {
    const confirmed = confirm(
        "Reset Don't Blink scores?"
    );

    if (!confirmed) return;

    adminStatus.textContent =
        "Resetting Don't Blink...";

    const { error } = await supabaseClient.rpc(
        "reset_mostwanted_scores",
        {
            input_password: mainAdminPassword
        }
    );

    if (error) {
        console.error(error);

        adminStatus.textContent =
            "Don't Blink reset failed.";

        return;
    }

    adminStatus.textContent =
        "Don't Blink reset complete.";
}

async function loadWallNotes() {
    wallNotesList.innerHTML = "";
    wallNotesStatus.textContent = "Loading notes...";

    const { data, error } = await supabaseClient
        .from("wall_notes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);

        wallNotesStatus.textContent =
            "Failed to load notes.";

        return;
    }

    if (!data || data.length === 0) {
        wallNotesStatus.textContent =
            "No notes found.";

        return;
    }

    wallNotesStatus.textContent = "";

    data.forEach(note => {
        const noteText =
            note.note ||
            note.message ||
            note.content ||
            note.text ||
            "";

        const createdAt = note.created_at
            ? new Date(note.created_at).toLocaleString()
            : "";

        const noteItem = document.createElement("div");

        noteItem.className = "wall-note-item";

        noteItem.innerHTML = `
            <div class="wall-note-content">
                <p class="wall-note-text">
                    ${escapeHtml(noteText)}
                </p>

                <div class="wall-note-date">
                    ${createdAt}
                </div>
            </div>

            <button
                type="button"
                class="wall-note-delete"
                data-id="${note.id}"
            >
                Delete
            </button>
        `;

        wallNotesList.appendChild(noteItem);
    });
}

async function deleteWallNote(noteId, button) {
    const confirmed = confirm(
        "Delete this wall note?"
    );

    if (!confirmed) return;

    button.disabled = true;
    button.textContent = "...";

    const { error } = await supabaseClient.rpc(
        "delete_wall_note_by_admin",
        {
            note_id: noteId,
            input_password: mainAdminPassword
        }
    );

    if (error) {
        console.error(error);

        alert("Failed to delete note.");

        button.disabled = false;
        button.textContent = "Delete";

        return;
    }

    button.closest(".wall-note-item")?.remove();

    adminStatus.textContent =
        "Wall note deleted.";

    if (!wallNotesList.children.length) {
        wallNotesStatus.textContent =
            "No notes found.";
    }
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

wallToggleBtn?.addEventListener("click", async () => {
    const opening = wallNotesPanel.hidden;

    wallNotesPanel.hidden = !opening;

    wallToggleBtn.textContent = opening
        ? "⌃"
        : "⌄";

    wallToggleBtn.setAttribute(
        "aria-expanded",
        String(opening)
    );

    if (opening) {
        await loadWallNotes();
    }
});

wallNotesList?.addEventListener("click", async event => {
    const button = event.target.closest(
        ".wall-note-delete"
    );

    if (!button) return;

    await deleteWallNote(
        button.dataset.id,
        button
    );
});

document.addEventListener("click", async event => {
    const button = event.target.closest(
        "[data-reset]"
    );

    if (!button) return;

    const type = button.dataset.reset;

    switch (type) {
        case "gallery":
            await resetGallery();
            break;

        case "wall":
            await resetWall();
            break;

        case "word":
            await resetWord();
            break;

        case "blitzclick":
            await resetClickathon();
            break;

        case "dontblink":
            await resetDontBlink();
            break;
    }
});

unlockAdmin();
