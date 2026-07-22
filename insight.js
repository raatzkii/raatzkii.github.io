const askCioIntro = document.getElementById("askCioIntro");
const chatShell = document.getElementById("chatShell");
const chatThread = document.getElementById("chatThread");
const startConversationBtn = document.getElementById("startConversationBtn");
const questionPills = document.getElementById("questionPills");

let conversationStarted = false;
let isCioReplying = false;

const threads = {
    intro: {
        user: "hello dennis!",
        replies: [
            () => `hiii, ${getGreeting()}!`
        ],
        nextQuestions: [
            {
                label: "what is this?",
                key: "what-is-this"
            }
        ]
    },

    "what-is-this": {
        user: "what is this?",
        replies: [
            "i created this to answer some basic questions about who i am",
            "and what i do",
            "i figured we could get the basic questions out of the way",
            "so we can spend more time discussing the technicalities when we meet.",
            "what do you think?"
        ],
        nextQuestions: [
            {
                label: "awesome! let's get started",
                key: "start"
            },
            {
                label: "hmmm... i don't know..",
                key: "skeptical"
            }
        ]
    },

    skeptical: {
        user: "hmmm... i don't know..",
        replies: [
            "that's fair.",
            "would it help to know that this section doesn't rely on AI?",
            "every response here was written in advance by me.",
            "so while the experience feels scripted, rest assured that all answers are still mine.",
            "awesome, right?"
        ],
        nextQuestions: [
            {
                label: "awesome! let's get started",
                key: "start"
            }
        ]
    },

    start: {
        user: "awesome! let's get started",
        replies: [
            "cool.",
            "i'll try my best to keep it short and simple.",
            "so tell me, what would you like to know?"
        ],
        nextQuestions: [
            {
                label: "about",
                key: "about"
            },
            {
                label: "work",
                key: "work"
            },
            {
                label: "role",
                key: "role"
            },
            {
                label: "software",
                key: "software"
            },
            {
                label: "location",
                key: "location"
            }
        ]
    },

    about: {
        user: "okay, tell me about yourself",
        replies: [
            "i am a highly-skilled graphic designer and creative lead with over 10 years of experience across print, digital, and ui/ux designs.",
            "over the last several years, i've evolved from purely designing into leading creative teams and delegating tasks",
            "although i've worked in retail, events, fintech, and healthcare, much of my experience comes from the fast-paced online gaming industry.",
            "there, i focused on rebuilding brands, creating visual outputs, and collaborating with developers, quality analysts, marketing and sales teams, project managers, product heads, and executives.",
            "what makes me different is that i don't create just for my own aesthetical preferences.",
            "i also care about the story that needs to be told and how it affects my target audience.",
            "anything else?"
        ],
        nextQuestions: [
            {
                label: "work",
                key: "work"
            },
            {
                label: "role",
                key: "role"
            },
            {
                label: "software",
                key: "software"
            },
            {
                label: "location",
                key: "location"
            },
            {
                label: "i'm not convinced",
                key: "not-convinced"
            }
        ]
    },

    work: {
        user: "what are you working on at the moment?",
        replies: [
            "i joined an asian gaming platform earlier this year as a digital designer.",
            "most of my current work revolves around sports matchup graphics, character design, and gaming-related promotional materials.",
            "contrary to my previous role, i now work as a supporting designer.",
            "a great opportunity to sit back, learn new things, and assist our art director whenever possible.",
            "anything else?"
        ],
        nextQuestions: [
            {
                label: "about",
                key: "about"
            },
            {
                label: "role",
                key: "role"
            },
            {
                label: "software",
                key: "software"
            },
            {
                label: "location",
                key: "location"
            },
            {
                label: "i'm not convinced",
                key: "not-convinced"
            }
        ]
    },

    role: {
        user: "as a creative lead, how do you handle working with non-designers?",
        replies: [
            "ohh that's a good question!",
            "over the years, i've learned to look at projects objectively.",
            "instead of becoming defensive when someone influences my creative direction, i try to understand the reason behind the request.",
            "whenever possible, i sit down with the people involved, discuss the project goals, and present different design approaches together.",
            "my responsibility isn't just to 'create a banner' or 'convert it to GIF'",
            "it's to find the 'middle ground' where project goal, layout, and positive feedback meet..",
            "while staying true to the specified brand.",
            "anything else?"
        ],
        nextQuestions: [
            {
                label: "about",
                key: "about"
            },
            {
                label: "work",
                key: "work"
            },
            {
                label: "software",
                key: "software"
            },
            {
                label: "location",
                key: "location"
            },
            {
                label: "i'm not convinced",
                key: "not-convinced"
            }
        ]
    },

    software: {
        user: "what software or tools do you usually use?",
        replies: [
            "hmm, let me think..",
            "to be honest, photoshop probably accounts for around 85% of my creative work.",
            "the rest is split across illustrator, after effects, and various task tracking tools.",
            "like asana, trello, monday, and clickup.",
            "anything else?"
        ],
        nextQuestions: [
            {
                label: "about",
                key: "about"
            },
            {
                label: "work",
                key: "work"
            },
            {
                label: "role",
                key: "role"
            },
            {
                label: "location",
                key: "location"
            },
            {
                label: "i'm not convinced",
                key: "not-convinced"
            }
        ]
    },

    location: {
        user: "do you prefer a specific work setup?",
        replies: [
            "not really.",
            "while remote work is enticing, i also have no problem working on-site.",
            "i'm currently office-based in taguig, and commuting has never been an issue for me.",
            "i'm curious with the hybrid style too. never tried that before.",
            "anything else?"
        ],
        nextQuestions: [
            {
                label: "about",
                key: "about"
            },
            {
                label: "work",
                key: "work"
            },
            {
                label: "role",
                key: "role"
            },
            {
                label: "software",
                key: "software"
            },
            {
                label: "i'm not convinced",
                key: "not-convinced"
            }
        ]
    },

    "not-convinced": {
        user: "i'm not convinced",
        replies: [
            "i see. it's okay.. totally acceptable.",
            "that's actually one of the reasons i included my full cv on this website.",
            `if you'd prefer a more traditional 'read-and-review' process, you can view or download it <a href="assets/DennisEspinosa_2026_CV.pdf" download>here</a>.`,
            "my contact details are in there if you'd like to schedule a phone, zoom, or face-to-face conversation.",
            "i hope this gives you some peace of mind.",
            "shall we start again?"
        ],
        nextQuestions: [
            {
                label: "awesome! let's get started",
                key: "start"
            }
        ]
    }
};

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "good morning";
    if (hour < 18) return "good afternoon";
    return "good evening";
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollChatToBottom() {
    requestAnimationFrame(() => {
        chatThread.scrollTop = chatThread.scrollHeight;
    });
}

function vibrateForCioReply() {
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobileViewport || !("vibrate" in navigator)) {
        return;
    }

    navigator.vibrate(35);
}

function addMessage(sender, text) {
    const message = document.createElement("div");
    message.className = `chat-message ${sender}`;

    message.innerHTML = `
        <div class="chat-bubble">
            ${text}
        </div>
    `;

    chatThread.appendChild(message);
    scrollChatToBottom();

    if (sender === "cio") {
        vibrateForCioReply();
    }
}

function addTypingBubble() {
    const typing = document.createElement("div");
    typing.className = "chat-message cio typing-message";

    typing.innerHTML = `
        <div class="typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;

    chatThread.appendChild(typing);
    scrollChatToBottom();

    return typing;
}

function getTypingDelay(text) {
    const plainText = String(text || "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const length = plainText.length;
    const baseDelay = 520;
    const perCharacter = length > 120 ? 26 : 20;
    const randomDelay = 160 + Math.random() * 420;

    return Math.min(
        4200,
        baseDelay + (length * perCharacter) + randomDelay
    );
}

function getReadDelay(question) {
    const baseDelay = 1300;
    const perCharacter = 30;
    const randomDelay = Math.random() * 900;

    return Math.min(
        3500,
        baseDelay + (question.length * perCharacter) + randomDelay
    );
}

async function cioReply(text) {
    const typing = addTypingBubble();
    const delay = getTypingDelay(text);

    await wait(delay);

    typing.remove();
    addMessage("cio", text);
}

async function cioReplyGroup(messages, question = "") {
    isCioReplying = true;
    questionPills.classList.add("is-disabled");
    questionPills.hidden = true;

    if (question) {
        await wait(getReadDelay(question));
    }

    for (const message of messages) {
        const reply = typeof message === "function" ? message() : message;

        await cioReply(reply);
        await wait(650);
    }

    questionPills.classList.remove("is-disabled");
    isCioReplying = false;
}

function renderQuestionPills(questions) {
    questionPills.innerHTML = "";

    questions.forEach((question, index) => {
        const button = document.createElement("button");

        button.className = "question-pill";
        button.type = "button";
        button.dataset.question = question.key;
        button.textContent = question.label;

        questionPills.appendChild(button);

        if (index === 2) {
            const rowBreak = document.createElement("span");

            rowBreak.className = "question-pill-row-break";
            rowBreak.setAttribute("aria-hidden", "true");

            questionPills.appendChild(rowBreak);
        }
    });

    questionPills.hidden = false;
}

async function runThread(threadKey, showUserMessage = true) {
    const thread = threads[threadKey];

    if (!thread || isCioReplying) return;

    if (showUserMessage && thread.user) {
        addMessage("user", thread.user);
    }

    await cioReplyGroup(thread.replies, thread.user);

    renderQuestionPills(thread.nextQuestions);
}

async function startConversation() {
    if (conversationStarted) return;

    conversationStarted = true;

    askCioIntro.hidden = true;
    chatShell.hidden = false;
    questionPills.hidden = true;

    await runThread("intro", true);
}

function handleQuestionClick(event) {
    const pill = event.target.closest(".question-pill");

    if (!pill || isCioReplying) return;

    const threadKey = pill.dataset.question;

    runThread(threadKey, true);
}

startConversationBtn.addEventListener("click", startConversation);
questionPills.addEventListener("click", handleQuestionClick);
