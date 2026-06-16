let matchData = [];
let knockoutData = [];
let currentTab = "matches";

const container = document.getElementById("schedule");

const flagMap = {
  "Mexico":"MEX",
  "South Africa":"RSA",
  "South Korea":"KOR",
  "Czechia":"CZE",
  "Canada":"CAN",
  "Bosnia & Herz.":"BIH",
  "USA":"USA",
  "Brazil":"BRA",
  "Argentina":"ARG",
  "France":"FRA",
  "Germany":"GER",
  "Japan":"JPN",
  "England":"ENG",
  "Spain":"ESP"
};

fetch("matches.json?v=" + Date.now())
.then(r=>r.json())
.then(data=>{
  matchData = data;
  if(currentTab==="matches") renderMatches();
});

fetch("knockout.json?v=" + Date.now())
.then(r=>r.json())
.then(data=>{
  knockoutData = data;
});

function switchTab(tab, e){
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  e.target.classList.add("active");

  if(tab==="matches") renderMatches();
  if(tab==="standings") renderStandings();
  if(tab==="knockout") renderKnockout();
}

/* ================= MATCHES ================= */
function renderMatches(){

  container.innerHTML = "";

  matchData.forEach(day=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">${day.date}</div>`;

    day.matches.forEach(m=>{

      const homeFlag = flagMap[m.home] || "none";
      const awayFlag = flagMap[m.away] || "none";

      const hs = m.homeScore;
      const as = m.awayScore;

      const scoreText =
        (hs === undefined || as === undefined || hs === "-" || as === "-")
        ? "-"
        : `${hs} - ${as}`;

      html += `
      <div class="match">
        <div class="top-row">
          <div>${m.group}</div>
          <div>
            ${m.tv ? `<img src="tv/${m.tv}.png" class="tv-icon">` : ''}
            ${m.time}
          </div>
        </div>

        <div class="teams">
          <div class="home">
            <img class="flag" src="flags/${homeFlag}.jpg"
            onerror="this.src='flags/none.jpg'">
            <span class="team-name">${m.home}</span>
          </div>

          <div class="score">${scoreText}</div>

          <div class="away">
            <span class="team-name">${m.away}</span>
            <img class="flag" src="flags/${awayFlag}.jpg"
            onerror="this.src='flags/none.jpg'">
          </div>
        </div>
      </div>`;
    });

    card.innerHTML = html;
    container.appendChild(card);
  });
}

/* ================= STANDINGS ================= */
function renderStandings(){

  container.innerHTML = "";

  const table = calculateStandings(matchData);

  Object.keys(table).forEach(group=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">Group ${group}</div>`;

    html += `
    <div class="match">
    <table style="width:100%;font-size:13px">
      <tr>
        <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
      </tr>
    `;

    table[group].forEach(t=>{
      html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.played}</td>
        <td>${t.win}</td>
        <td>${t.draw}</td>
        <td>${t.lose}</td>
        <td>${t.gf - t.ga}</td>
        <td>${t.pts}</td>
      </tr>`;
    });

    html += `</table></div>`;

    card.innerHTML = html;
    container.appendChild(card);
  });
}

/* ================= KNOCKOUT ================= */
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

        const hs = m.homeScore;
        const as = m.awayScore;

        const scoreText =
          (hs === undefined || as === undefined)
          ? "-"
          : `${hs} - ${as}`;

        html += `
        <div class="match">
          <div class="top-row">
            <div>${round.round}</div>
            <div>
              ${m.tv ? `<img src="tv/${m.tv}.png" class="tv-icon">` : ''}
              ${m.time}
            </div>
          </div>

          <div class="teams">
            <div class="home">
              <img class="flag" src="flags/${homeFlag}.jpg"
              onerror="this.src='flags/none.jpg'">
              <span class="team-name">${m.home}</span>
            </div>

            <div class="score">${scoreText}</div>

            <div class="away">
              <span class="team-name">${m.away}</span>
              <img class="flag" src="flags/${awayFlag}.jpg"
              onerror="this.src='flags/none.jpg'">
            </div>
          </div>
        </div>`;
      });
    });

    card.innerHTML = html;
    container.appendChild(card);
  });
}
