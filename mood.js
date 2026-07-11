const spotifyNotes = [...document.querySelectorAll(".spotify-note")];

const rowPattern = [3, 4, 3, 4, 3, 4, 3];
const activeRowByDay = {
    0: 7,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6
};

function getRowForIndex(index) {
    let runningTotal = 0;

    for (let row = 0; row < rowPattern.length; row += 1) {
        runningTotal += rowPattern[row];

        if (index < runningTotal) {
            return row + 1;
        }
    }

    return rowPattern.length;
}

function createSpotifyEmbed(trackId) {
    const iframe = document.createElement("iframe");

    iframe.className = "spotify-embed";
    iframe.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
    iframe.width = "100%";
    iframe.height = "80";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.loading = "lazy";
    iframe.title = "Spotify track";

    return iframe;
}

function createPlaceholder() {
    const placeholder = document.createElement("div");

    placeholder.className = "spotify-placeholder";

    return placeholder;
}

function setMoodBoardAvailability() {
    const today = new Date().getDay();
    const activeRow = activeRowByDay[today] ?? 1;

    spotifyNotes.forEach((note, index) => {
        const noteRow = getRowForIndex(index);
        const isAvailable = noteRow === activeRow;
        const trackId = note.dataset.trackId;

        note.classList.toggle("is-disabled", !isAvailable);
        note.setAttribute("aria-disabled", String(!isAvailable));
        note.replaceChildren(isAvailable && trackId ? createSpotifyEmbed(trackId) : createPlaceholder());
    });
}

setMoodBoardAvailability();
