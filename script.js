/* ===================================================
   MATCH FLOW v1.0
   Cardigan Town FC Tournament Display
=================================================== */

const SETTINGS_FILE = "config/settings.json";

let divisions = [];
let currentIndex = 0;
let rotationTimer = null;
let tickerMessages = [];
let currentTicker = 0;
let tickerTimer = null;

const broadcastScene = document.getElementById("broadcastScene");
const groupATable = document.getElementById("groupATable");
const groupBTable = document.getElementById("groupBTable");
const leagueArea = document.getElementById("leagueArea");
const knockoutArea = document.getElementById("knockoutArea");
const divisionPill = document.getElementById("divisionPill");
const contentTitle = document.getElementById("contentTitle");
const groupAHeading = document.getElementById("groupAHeading");
const groupBHeading = document.getElementById("groupBHeading");
const currentDivision = document.getElementById("currentDivision");
const nextDivision = document.getElementById("nextDivision");
const progressBar = document.getElementById("progressBar");
const tickerText = document.getElementById("tickerText");
const divisionSponsor = document.getElementById("divisionSponsor");
const tournamentDate = document.getElementById("tournamentDate");
const overlayDivision = document.getElementById("overlayDivision");
const overlayClock = document.getElementById("overlayClock");
const afterNextDivision = document.getElementById("afterNextDivision");
const TRANSITION_DELAY = 200;
const FADE_DURATION = 250;

async function loadApplication() {

    try {

        const settingsResponse = await fetch(SETTINGS_FILE);

        if (!settingsResponse.ok) {
            throw new Error("Unable to load settings.json");
        }

        const settings = await settingsResponse.json();

        const playlistResponse = await fetch(`config/${settings.playlist}.json`);

        if (!playlistResponse.ok) {
            throw new Error("Unable to load playlist");
        }

        const playlist = await playlistResponse.json();

divisions = playlist.divisions;

tournamentDate.textContent = playlist.date;

        if (!divisions.length) {
            throw new Error("Playlist is empty");
        }


       if (settings.tickerMessages) {

    tickerText.innerHTML = settings.tickerMessages.join(' <span class="ticker-separator">◆</span> ');

}

        showDivision(0);

    }

    catch (error) {

        console.error(error);

        currentDivision.textContent = "Error";
        nextDivision.textContent = "Check Console";

    }

}

function showDivision(index) {

    clearTimeout(rotationTimer);

    currentIndex = index;

    const division = divisions[index];

    const next = divisions[(index + 1) % divisions.length];
    const afterNext = divisions[(index + 2) % divisions.length];

    currentDivision.textContent = division.name;
    overlayDivision.textContent = division.name;

    nextDivision.textContent = next.name.toUpperCase();
    afterNextDivision.textContent = afterNext.name.toUpperCase();

    divisionSponsor.textContent =
    division.sponsor || "Cardigan Town FC";

    frame.classList.add("fade-out");

   setTimeout(() => {

    frame.classList.add("fade-out");

    setTimeout(() => {

        frame.src = division.url;

        frame.classList.remove("fade-out");
        frame.classList.add("fade-in");

    }, FADE_DURATION);

}, TRANSITION_DELAY);

    animateProgress(division.duration);

    rotationTimer = setTimeout(() => {

    showDivision((currentIndex + 1) % divisions.length);

}, (division.duration * 1000) + TRANSITION_DELAY);

}

function animateProgress(seconds) {

    progressBar.style.transition = "none";
    progressBar.style.width = "0%";

    void progressBar.offsetWidth;

    progressBar.style.transition = `width ${seconds}s linear`;
    progressBar.style.width = "100%";

}
function startTicker() {

    if (!tickerMessages.length) return;

    clearInterval(tickerTimer);

    tickerTimer = setInterval(() => {

        currentTicker++;

        if (currentTicker >= tickerMessages.length) {

            currentTicker = 0;

        }

        tickerText.textContent = tickerMessages[currentTicker];

    }, 20000);

}

function updateClock(){

    const now = new Date();

    overlayClock.textContent =
        now.toLocaleTimeString("en-GB",{

            hour:"2-digit",

            minute:"2-digit"

        });

}

const Layouts = {

    DOUBLE_GROUP_KNOCKOUT: "double-group-knockout",

    SINGLE_GROUP_KNOCKOUT: "single-group-knockout",

    FESTIVAL_DOUBLE: "festival-double",

    FESTIVAL_SINGLE: "festival-single"

};

const currentBroadcast = {

    layout: Layouts.DOUBLE_GROUP_KNOCKOUT,

    name: "UNDER 13",

    title: "LEAGUE STANDINGS",

    groupA: "GROUP A",

    groupB: "GROUP B",

    sponsor: "Ultra Clean",

    pitches: "Pitches 5 & 6",

    standings: {

        groupA: [

            { position: 1, name: "Cardigan Town", points: 12 },
            { position: 2, name: "Crymych", points: 9 },
            { position: 3, name: "Fishguard", points: 6 },
            { position: 4, name: "Narberth", points: 3 }

        ],

        groupB: [

            { position: 1, name: "Aberaeron", points: 12 },
            { position: 2, name: "Newcastle Emlyn", points: 9 },
            { position: 3, name: "Llandysul", points: 6 },
            { position: 4, name: "St Clears", points: 3 }

        ]

    }

};
function setBroadcastTitles(division, title, groupA, groupB){

    divisionPill.textContent = division;

    contentTitle.textContent = title;

    groupAHeading.textContent = groupA;

    groupBHeading.textContent = groupB;

}

function renderLayout(layout){

    console.log("Loading layout:", layout);

    // Hide everything first
    leagueArea.style.display = "none";
    knockoutArea.style.display = "none";

    switch(layout){

        case Layouts.DOUBLE_GROUP_KNOCKOUT:

            leagueArea.style.display = "flex";
            knockoutArea.style.display = "flex";

            break;

        case Layouts.FESTIVAL_DOUBLE:

            leagueArea.style.display = "flex";

            break;

    }

}

function renderStandingsTable(table, teams){

    table.innerHTML = "";

    teams.forEach(team => {

        const row = document.createElement("div");

        row.className = "tableRow";

        if(team.position === 2){

            row.classList.add("qualificationLine");

        }

        row.innerHTML = `
            <span>${team.position}</span>
            <span>${team.name}</span>
            <span>${team.points}</span>
        `;

        table.appendChild(row);

    });

}

loadApplication();

updateClock();

setInterval(updateClock,1000);

setBroadcastTitles(
    currentBroadcast.name,
    currentBroadcast.title,
    currentBroadcast.groupA,
    currentBroadcast.groupB
);

renderLayout(currentBroadcast.layout);

renderStandingsTable(
    groupATable,
    currentBroadcast.standings.groupA
);

renderStandingsTable(
    groupBTable,
    currentBroadcast.standings.groupB
);