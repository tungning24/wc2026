let groupData = [];
let knockoutData = [];
let currentTab = "group";

const container = document.getElementById("schedule");

/* ===== FULL FLAG MAP (เพิ่มครบแล้ว) ===== */
const flagMap = {
  "Mexico":"MEX",
  "South Africa":"RSA",
  "South Korea":"KOR",
  "Czechia":"CZE",
  "Canada":"CAN",
  "Bosnia & Herz.":"BIH",
  "Bosnia":"BIH",
  "USA":"USA",
  "Paraguay":"PAR",
  "Qatar":"QAT",
  "Switzerland":"SUI",
  "Brazil":"BRA",
  "Morocco":"MAR",
  "Haiti":"HAI",
  "Scotland":"SCO",
  "Australia":"AUS",
  "Turkiye":"TUR",
  "Germany":"GER",
  "Curacao":"CUW",
  "Netherlands":"NED",
  "Japan":"JPN",
  "Ivory Coast":"CIV",
  "Ecuador":"ECU",
  "Sweden":"SWE",
  "Tunisia":"TUN",
  "Spain":"ESP",
  "Cape Verde":"CPV",
  "Belgium":"BEL",
  "Egypt":"EGY",
  "Saudi Arabia":"KSA",
  "Uruguay":"URU",
  "Iran":"IRN",
  "New Zealand":"NZL",
  "France":"FRA",
  "Senegal":"SEN",
  "Iraq":"IRQ",
  "Norway":"NOR",
  "Argentina":"ARG",
  "Algeria":"ALG",
  "Austria":"AUT",
  "Jordan":"JOR",
  "Portugal":"POR",
  "Congo DR":"COD",
  "England":"ENG",
  "Croatia":"CRO",
  "Ghana":"GHA",
  "Panama":"PAN",
  "Uzbekistan":"UZB",
  "Colombia":"COL",
  "Italy":"ITA",
  "Poland":"POL",
  "Denmark":"DEN",
  "Hungary":"HUN",
  "Ukraine":"UKR",
  "Serbia":"SRB",
  "Chile":"CHI",
  "Peru":"PER",
  "Venezuela":"VEN",
  "Costa Rica":"CRC",
  "Cameroon":"CMR",
  "Nigeria":"NGA",
  "Albania":"ALB",
  "Greece":"GRE",
  "Romania":"ROU",
  "Slovakia":"SVK",
  "Slovenia":"SVN",
  "Croatia":"CRO",
  "Wales":"WAL"
};

/* ===== LOAD DATA ===== */
fetch("matches.json?v=" + Date.now())
.then(r=>r.json())
.then(data=>{
  groupData = data;
  if(currentTab==="group") renderGroup();
});

fetch("knockout.json?v=" + Date.now())
.then(r=>r.json())
.then(data=>{
  knockoutData = data;
});

/* ===== TAB ===== */
function switchTab(tab, e){
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  e.target.classList.add("active");

  if(tab==="group") renderGroup();
  if(tab==="standings") renderStandings(groupData, flagMap);
  if(tab==="knockout") renderKnockout();
}

/* ===== MATCH ===== */
function renderGroup(){

  container.innerHTML = "";

  groupData.forEach(day=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">${day.date}</div>`;

    day.matches.forEach(m=>{

      const homeFlag = flagMap[m.home] || "none";
      const awayFlag = flagMap[m.away] || "none";

      const notPlayed =
        m.homeScore === undefined ||
        m.homeScore === null ||
        m.homeScore === "";

      const scoreText = notPlayed
        ? `${m.home} - ${m.away}`
        : `${m.homeScore} - ${m.awayScore}`;

      html += `
      <div class="match">
        <div class="top-row">
          <div>${m.group}</div>
          <div>${m.time}</div>
        </div>

        <div class="teams">
          <div class="home">
            <img class="flag" src="flags/${homeFlag}.jpg"
            onerror="this.src='flags/none.png'">
            ${m.home}
          </div>

          <div class="score">${scoreText}</div>

          <div class="away">
            ${m.away}
            <img class="flag" src="flags/${awayFlag}.jpg"
            onerror="this.src='flags/none.png'">
          </div>
        </div>
      </div>`;
    });

    card.innerHTML = html;
    container.appendChild(card);
  });
}

/* ===== KNOCKOUT (ของเดิม) ===== */
function renderKnockout(){

  container.innerHTML = "";

  knockoutData.forEach(round=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">${round.round}</div>`;

    round.days.forEach(day=>{
      html += `<div class="knockout-date">${day.date}</div>`;

      day.matches.forEach(m=>{

        const homeFlag = flagMap[m.home] || "none";
        const awayFlag = flagMap[m.away] || "none";

        const scoreText =
          (m.homeScore == null && m.awayScore == null)
          ? "-"
          : `${m.homeScore} - ${m.awayScore}`;

        html += `
        <div class="match">
          <div class="top-row">
            <div>${round.round}</div>
            <div>${m.time}</div>
          </div>

          <div class="teams">
            <div class="home">
              <img class="flag" src="flags/${homeFlag}.jpg">
              ${m.home}
            </div>

            <div class="score">${scoreText}</div>

            <div class="away">
              ${m.away}
              <img class="flag" src="flags/${awayFlag}.jpg">
            </div>
          </div>
        </div>`;
      });
    });

    card.innerHTML = html;
    container.appendChild(card);
  });
}
