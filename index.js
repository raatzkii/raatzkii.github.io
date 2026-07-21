const forwardReveal = document.querySelector(".warning-reveal--forward");
const forwardBand = document.querySelector(".warning-reveal--forward .warning-band");
const reverseReveal = document.querySelector(".warning-reveal--reverse");
const reverseBand = document.querySelector(".warning-band--reverse");
const firstHero = document.querySelector(".hero-panel--primary");
const secondHero = document.querySelector(".hero-layer");
const featureCardsSection = document.querySelector(".feature-cards-section");
const repelImages = [...document.querySelectorAll(".hero-repel-image")];
const mobileEffectiveWord = document.getElementById("mobileEffectiveWord");

let revealTicking = false;
let forwardBandTop = 0;
let secondBandTop = 0;
let forwardSlowOffset = 0;
let secondSlowOffset = 0;
let mobileEffectiveTimer = 0;
let mobileEffectiveShiftTimer = 0;
let mobileEffectiveIndex = 0;
let desktopEffectiveTimer = 0;
let desktopEffectiveShiftTimer = 0;
let desktopEffectiveIndex = 0;

const mobileEffectiveWords = [
    "effective",
    "impactful",
    "consistent",
    "clean",
    "useful",
    "seamless",
    "responsive",
    "scalable",
    "practical"
];
const mobileEffectiveQuery = window.matchMedia("(max-width: 768px)");
const desktopEffectiveQuery = window.matchMedia("(min-width: 769px)");
const mobileEffectiveReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function setPx(element, property, value) {
    if (!element) return;
    element.style.setProperty(property, `${value}px`);
}

function setMobileEffectiveWord() {
    if (!mobileEffectiveWord || !mobileEffectiveQuery.matches) return;

    if (mobileEffectiveReduceMotion.matches) {
        mobileEffectiveIndex = (mobileEffectiveIndex + 1) % mobileEffectiveWords.length;
        mobileEffectiveWord.textContent = mobileEffectiveWords[mobileEffectiveIndex];
        return;
    }

    mobileEffectiveWord.classList.add("is-shifting");

    window.clearTimeout(mobileEffectiveShiftTimer);
    mobileEffectiveShiftTimer = window.setTimeout(() => {
        if (!mobileEffectiveQuery.matches) return;

        mobileEffectiveIndex = (mobileEffectiveIndex + 1) % mobileEffectiveWords.length;
        mobileEffectiveWord.textContent = mobileEffectiveWords[mobileEffectiveIndex];
        mobileEffectiveWord.classList.remove("is-shifting");
    }, 280);
}

function setDesktopEffectiveWord() {
    if (!mobileEffectiveWord || !desktopEffectiveQuery.matches) return;

    if (mobileEffectiveReduceMotion.matches) {
        desktopEffectiveIndex = (desktopEffectiveIndex + 1) % mobileEffectiveWords.length;
        mobileEffectiveWord.textContent = mobileEffectiveWords[desktopEffectiveIndex];
        return;
    }

    mobileEffectiveWord.classList.add("is-shifting");

    window.clearTimeout(desktopEffectiveShiftTimer);
    desktopEffectiveShiftTimer = window.setTimeout(() => {
        if (!desktopEffectiveQuery.matches) return;

        desktopEffectiveIndex = (desktopEffectiveIndex + 1) % mobileEffectiveWords.length;
        mobileEffectiveWord.textContent = mobileEffectiveWords[desktopEffectiveIndex];
        mobileEffectiveWord.classList.remove("is-shifting");
    }, 280);
}

function syncEffectiveWordRotator() {
    if (!mobileEffectiveWord) return;

    window.clearInterval(mobileEffectiveTimer);
    window.clearTimeout(mobileEffectiveShiftTimer);
    window.clearInterval(desktopEffectiveTimer);
    window.clearTimeout(desktopEffectiveShiftTimer);
    mobileEffectiveTimer = 0;
    mobileEffectiveShiftTimer = 0;
    desktopEffectiveTimer = 0;
    desktopEffectiveShiftTimer = 0;
    mobileEffectiveWord.classList.remove("is-shifting");

    if (mobileEffectiveQuery.matches) {
        desktopEffectiveIndex = 0;
        mobileEffectiveWord.textContent = mobileEffectiveWords[mobileEffectiveIndex];
        mobileEffectiveTimer = window.setInterval(setMobileEffectiveWord, 1700);
        return;
    }

    mobileEffectiveIndex = 0;
    mobileEffectiveWord.textContent = mobileEffectiveWords[desktopEffectiveIndex];
    desktopEffectiveTimer = window.setInterval(setDesktopEffectiveWord, 1700);
}

syncEffectiveWordRotator();

if (mobileEffectiveQuery.addEventListener) {
    mobileEffectiveQuery.addEventListener("change", syncEffectiveWordRotator);
} else if (mobileEffectiveQuery.addListener) {
    mobileEffectiveQuery.addListener(syncEffectiveWordRotator);
}

function updateLayerReveal() {
    revealTicking = false;

    if (!forwardReveal || !forwardBand || !reverseReveal || !reverseBand || !firstHero || !secondHero || !featureCardsSection) {
        return;
    }

    const viewportHeight = window.innerHeight;
    const forwardHeight = forwardBand.offsetHeight;
    const reverseHeight = reverseBand.offsetHeight;

    const forwardRawTop = forwardBandTop - window.scrollY;
    const forwardProgress = clamp(viewportHeight - forwardRawTop, 0, viewportHeight + forwardHeight);
    forwardSlowOffset = forwardProgress * 0.18;

    const forwardVisualTop = forwardRawTop + forwardSlowOffset;
    const forwardVisualBottom = forwardVisualTop + forwardHeight;
    const forwardTop = clamp(forwardVisualTop, 0, viewportHeight);
    const forwardBottom = clamp(forwardVisualBottom, 0, viewportHeight);

    const secondRawTop = secondBandTop - window.scrollY;
    const secondProgress = clamp(viewportHeight - secondRawTop, 0, viewportHeight + reverseHeight);
    secondSlowOffset = secondProgress * 0.18;

    const secondVisualTop = secondRawTop + secondSlowOffset;
    const secondVisualBottom = secondVisualTop + reverseHeight;
    const secondTop = clamp(secondVisualTop, 0, viewportHeight);
    const secondBottom = clamp(secondVisualBottom, 0, viewportHeight);
    const secondRevealStart = parseFloat(getComputedStyle(reverseReveal).getPropertyValue("--second-reveal-start")) || 0;
    const secondIsComplete = -secondRawTop >= secondRevealStart;

    const secondHeroTopClip = forwardBottom;
    const secondHeroBottomClip = viewportHeight - secondTop;

    forwardBand.style.setProperty("--warning-slow-offset", `${forwardSlowOffset}px`);
    reverseBand.style.setProperty("--second-warning-slow-offset", `${secondSlowOffset}px`);

    setPx(firstHero, "--hero-clip-bottom", viewportHeight - forwardTop);
    setPx(secondHero, "--hero-layer-clip-top", secondHeroTopClip);
    setPx(secondHero, "--hero-layer-clip-bottom", secondHeroBottomClip);
    setPx(featureCardsSection, "--features-clip-top", secondBottom);
    reverseReveal.classList.toggle("is-feature-scrolling", secondIsComplete);
}

function measureRevealPositions() {
    if (reverseReveal && reverseBand && featureCardsSection) {
        const secondClearOffset = reverseBand.offsetHeight + (window.innerHeight + reverseBand.offsetHeight) * 0.18 + 170;
        reverseReveal.style.setProperty("--second-reveal-start", `${secondClearOffset}px`);
        reverseReveal.style.setProperty("--features-scroll-height", `${featureCardsSection.scrollHeight}px`);
    }

    forwardBandTop = forwardBand
        ? forwardBand.getBoundingClientRect().top + window.scrollY - forwardSlowOffset
        : 0;
    secondBandTop = reverseBand
        ? reverseBand.getBoundingClientRect().top + window.scrollY - secondSlowOffset
        : 0;
}

function requestRevealUpdate() {
    if (revealTicking) return;

    revealTicking = true;
    requestAnimationFrame(updateLayerReveal);
}

function bindHeroAvoidance(image) {
    const hero = image.closest(".scroll-hero");
    const state = {
        ticking: false,
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0
    };

    function update() {
        state.ticking = false;
        state.currentX += (state.targetX - state.currentX) * 0.09;
        state.currentY += (state.targetY - state.currentY) * 0.09;

        image.style.setProperty("--hero-avoid-x", `${state.currentX.toFixed(2)}px`);
        image.style.setProperty("--hero-avoid-y", `${state.currentY.toFixed(2)}px`);

        if (Math.abs(state.targetX - state.currentX) > 0.05 || Math.abs(state.targetY - state.currentY) > 0.05) {
            requestUpdate();
        }
    }

    function requestUpdate() {
        if (state.ticking) return;

        state.ticking = true;
        requestAnimationFrame(update);
    }

    if (!hero) return;

    hero.addEventListener("pointermove", (event) => {
        const rect = image.getBoundingClientRect();
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        const dx = centerX - event.clientX;
        const dy = centerY - event.clientY;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const strength = clamp(1 - distance / 520, 0, 1);
        const maxShift = 8;

        state.targetX = (dx / distance) * maxShift * strength;
        state.targetY = (dy / distance) * maxShift * strength;
        requestUpdate();
    });

    hero.addEventListener("pointerleave", () => {
        state.targetX = 0;
        state.targetY = 0;
        requestUpdate();
    });
}

repelImages.forEach(bindHeroAvoidance);

window.addEventListener("scroll", requestRevealUpdate, { passive: true });
window.addEventListener("resize", () => {
    measureRevealPositions();
    requestRevealUpdate();
});

measureRevealPositions();
updateLayerReveal();

// Feature cards behavior

const daysCounter = document.getElementById("daysCounter");
const industryRing = document.querySelector(".industry-ring");
const helloWord = document.getElementById("helloWord");
const effortToggle = document.getElementById("effortToggle");
const effortCard = document.querySelector(".effort-card");
const workPillTracks = document.querySelectorAll(".work-pill-track");
const statsTitle = document.querySelector(".stats-card .interact-title");
const statsCaption = document.querySelector(".stats-card .portfolio-kicker");
const industryPercent = document.querySelector(".industry-ring span");
const industryCaption = document.querySelector(".industry-caption");
const careerTitle = document.querySelector(".career-timeline h2");
const careerBars = document.querySelectorAll(".career-bar");
const workPillRows = document.querySelectorAll(".work-pill-row");
const toolsCaption = document.querySelector(".tools-caption");

const helloTranslations = [
    "kumusta",
    "你好",
    "สวัสดี",
    "こんにちは",
    "नमस्ते",
    "hello",
    "안녕하세요"
];
const sleepTranslations = [
    "tulog",
    "睡觉",
    "นอน",
    "睡眠",
    "नींद",
    "sleep",
    "수면"
];
const restPillRows = [
    [
        { text: "snooze", tone: "pill-light" },
        { text: "reset", tone: "pill-light" },
        { text: "slumber", tone: "pill-light" },
        { text: "refresh", tone: "pill-light" },
        { text: "shut down", tone: "pill-light" },
        { text: "bedtime", tone: "pill-light" }
    ],
    [
        { text: "recharge", tone: "pill-light" },
        { text: "unplug", tone: "pill-light" },
        { text: "z-hours", tone: "pill-light" },
        { text: "hibernate", tone: "pill-light" },
        { text: "reboot", tone: "pill-light" },
        { text: "idle", tone: "pill-light" }
    ],
    [
        { text: "rejuvenate", tone: "pill-light" },
        { text: "pause", tone: "pill-light" },
        { text: "silent mode", tone: "pill-light" },
        { text: "cool off", tone: "pill-light" },
        { text: "offline", tone: "pill-light" },
        { text: "clock out", tone: "pill-light" }
    ]
];

const normalContent = {
    statsCaption: statsCaption ? statsCaption.textContent.trim() : "",
    industryPercent: industryPercent ? industryPercent.textContent.trim() : "",
    industryCaption: industryCaption ? industryCaption.innerHTML : "",
    careerTitle: careerTitle ? careerTitle.textContent : "",
    careerBars: Array.from(careerBars, (bar) => bar.textContent),
    toolsCaption: toolsCaption ? toolsCaption.textContent.trim() : "",
    workPillSets: Array.from(document.querySelectorAll(".work-pill-set"), (set) => set.innerHTML)
};

let setHelloTranslations = () => {};
let renderNormalStatsTitle = () => {};
let updateWorkPillDistances = () => {};

function fillIndustryRing() {
    if (!industryRing) return;

    industryRing.classList.add("is-filled");
}

const startDate = new Date("2012-06-01T00:00:00");
const targetDays = Math.floor(
    (Date.now() - startDate.getTime()) /
    (1000 * 60 * 60 * 24)
);

function renderStatsTitle(value) {
    if (!statsTitle) return;

    statsTitle.innerHTML = `<span id="daysCounter">${value.toLocaleString()}</span> days`;
}

if (daysCounter) {
    const duration = 2000;
    const startTime = performance.now();

    renderNormalStatsTitle = () => {
        renderStatsTitle(targetDays);
    };

    fillIndustryRing();

    function animateCount(timestamp) {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        const current = Math.floor(eased * targetDays);
        const activeDaysCounter = document.getElementById("daysCounter");

        if (activeDaysCounter) {
            activeDaysCounter.textContent = current.toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(animateCount);
        } else {
            const activeDaysCounter = document.getElementById("daysCounter");

            if (activeDaysCounter) {
                activeDaysCounter.textContent = targetDays.toLocaleString();
            }
        }
    }

    requestAnimationFrame(animateCount);
} else {
    fillIndustryRing();
    renderNormalStatsTitle = () => {
        renderStatsTitle(targetDays);
    };
}

if (helloWord) {
    let helloIndex = 0;
    let currentHelloTranslations = helloTranslations;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    helloWord.textContent = "";

    function createHelloToken(text) {
        const token = document.createElement("span");

        token.className = "hello-word-token";
        token.textContent = text;

        return token;
    }

    let activeToken = createHelloToken(currentHelloTranslations[helloIndex]);
    helloWord.appendChild(activeToken);
    requestAnimationFrame(() => {
        activeToken.classList.add("is-active");
    });

    setHelloTranslations = (translations) => {
        currentHelloTranslations = translations;
        helloIndex = 0;
        helloWord.textContent = "";

        activeToken = createHelloToken(currentHelloTranslations[helloIndex]);
        helloWord.appendChild(activeToken);

        requestAnimationFrame(() => {
            activeToken.classList.add("is-active");
        });
    };

    function cycleHelloWord() {
        if (reduceMotion) {
            helloIndex = (helloIndex + 1) % currentHelloTranslations.length;
            activeToken.textContent = currentHelloTranslations[helloIndex];
            return;
        }

        helloIndex = (helloIndex + 1) % currentHelloTranslations.length;
        const nextToken = createHelloToken(currentHelloTranslations[helloIndex]);
        const previousToken = activeToken;

        helloWord.appendChild(nextToken);
        activeToken = nextToken;

        requestAnimationFrame(() => {
            previousToken.classList.remove("is-active");
            previousToken.classList.add("is-leaving");
            nextToken.classList.add("is-active");
        });

        setTimeout(() => {
            previousToken.remove();
        }, 950);
    }

    setInterval(cycleHelloWord, 1800);
}

if (effortToggle && effortCard) {
    effortToggle.addEventListener("click", () => {
        const isOff = effortCard.classList.toggle("is-off");

        document.body.classList.toggle("is-resting", isOff);
        setRestMode(isOff);
        effortToggle.setAttribute("aria-pressed", String(!isOff));
    });
}

function renderPillSet(set, pills) {
    set.innerHTML = pills
        .map(({ text, tone }) => `<span class="${tone}">${text}</span>`)
        .join("");
}

function setRestMode(isResting) {
    if (statsTitle) {
        if (isResting) {
            statsTitle.innerHTML = 'zzz<span class="sleep-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>';
        } else {
            renderNormalStatsTitle();
        }
    }

    if (statsCaption) {
        statsCaption.textContent = isResting ? "no data available" : normalContent.statsCaption;
    }

    if (industryPercent) {
        industryPercent.textContent = isResting ? "" : normalContent.industryPercent;
    }

    if (industryCaption) {
        industryCaption.innerHTML = isResting
            ? "no great work happens<br>without proper rest"
            : normalContent.industryCaption;
    }

    setHelloTranslations(isResting ? sleepTranslations : helloTranslations);

    if (document.querySelector(".hello-card .portfolio-kicker")) {
        document.querySelector(".hello-card .portfolio-kicker").textContent = isResting
            ? "recovery fuels creativity"
            : "designs that know no borders";
    }

    if (careerTitle) {
        careerTitle.textContent = isResting ? "mastery takes time" : normalContent.careerTitle;
    }

    careerBars.forEach((bar, index) => {
        bar.textContent = isResting ? "no data available" : normalContent.careerBars[index];
    });

    if (toolsCaption) {
        toolsCaption.innerHTML = isResting
            ? "ah, they're available 24/7.<br>but i'm not."
            : normalContent.toolsCaption;
    }

    if (workPillRows.length) {
        if (isResting) {
            workPillRows.forEach((row, rowIndex) => {
                row.querySelectorAll(".work-pill-set").forEach((set) => {
                    renderPillSet(set, restPillRows[rowIndex] || restPillRows[0]);
                });
            });
        } else {
            document.querySelectorAll(".work-pill-set").forEach((set, index) => {
                set.innerHTML = normalContent.workPillSets[index] || "";
            });
        }
    }

    if (typeof updateWorkPillDistances === "function") {
        updateWorkPillDistances();
    }
}

if (workPillTracks.length) {
    let pillMeasureFrame = 0;

    updateWorkPillDistances = () => {
        cancelAnimationFrame(pillMeasureFrame);

        pillMeasureFrame = requestAnimationFrame(() => {
            workPillTracks.forEach((track) => {
                const firstSet = track.querySelector(".work-pill-set");

                if (!firstSet) return;

                const distance = firstSet.getBoundingClientRect().width;

                track.style.setProperty("--marquee-distance", `${-distance}px`);
            });
        });
    };

    updateWorkPillDistances();
    window.addEventListener("resize", updateWorkPillDistances);

    if (document.fonts) {
        document.fonts.ready.then(updateWorkPillDistances);
    }

    if ("ResizeObserver" in window) {
        const pillObserver = new ResizeObserver(updateWorkPillDistances);

        workPillTracks.forEach((track) => {
            const firstSet = track.querySelector(".work-pill-set");

            if (firstSet) {
                pillObserver.observe(firstSet);
            }
        });
    }
}
