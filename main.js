let matchData = [];
let knockoutData = [];
let currentTab = "matches";

const app = document.getElementById("app");

fetch("matches.json")
.then(r=>r.json())
.then(data=>{
  matchData = data;
  if(currentTab==="matches") renderMatches();
});

fetch("knockout.json")
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

/* ===== MATCHES ===== */
function renderMatches(){

  app.innerHTML = "";

  matchData.forEach(day=>{

    const card = document.createElement("div");
    card.className="card";

    let html = `<div class="card-header">${day.date}</div>`;

    day.matches.forEach(m=>{
      html += `
      <div class="match">
        <div class="row">
          <div>${m.group}</div>
          <div>${m.time}</div>
        </div>

        <div class="row">
          <div>${m.home}</div>
          <div class="score">${m.homeScore} - ${m.awayScore}</div>
          <div>${m.away}</div>
        </div>
      </div>`;
    });

    card.innerHTML = html;
    app.appendChild(card);
  });
}

/* ===== STANDINGS ===== */
function renderStandings(){

  app.innerHTML = "";

  const table = calculateStandings(matchData);

  Object.keys(table).forEach(group=>{

    const card = document.createElement("div");
    card.className="card";

    let html = `<div class="card-header">Group ${group}</div>`;

    html += `
    <table class="table">
      <tr>
        <th>Team</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GD</th>
        <th>Pts</th>
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

    html += `</table>`;

    card.innerHTML = html;
    app.appendChild(card);
  });
}

/* ===== KNOCKOUT ===== */
function renderKnockout(){

  app.innerHTML = "";

  knockoutData.forEach(round=>{

    const card = document.createElement("div");
    card.className="card";

    let html = `<div class="card-header">${round.round}</div>`;

    round.days.forEach(day=>{
      html += `<div class="match"><b>${day.date}</b></div>`;

      day.matches.forEach(m=>{
        html += `
        <div class="match">
          <div class="row">
            <div>${m.home}</div>
            <div class="score">${m.homeScore ?? "-"} - ${m.awayScore ?? "-"}</div>
            <div>${m.away}</div>
          </div>
        </div>`;
      });
    });

    card.innerHTML = html;
    app.appendChild(card);
  });
}