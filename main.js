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
  "Colombia":"COL"
};

let groupData = [];
let knockoutData = [];
let currentTab = "group";

const container = document.getElementById("schedule");

/* LOAD DATA */
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

/* TAB SWITCH */
function switchTab(tab, e){
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  e.target.classList.add("active");

  if(tab==="group") renderGroup();
  if(tab==="standings") renderStandings();
  if(tab==="knockout") renderKnockout();
}

/* SAFE SCORE */
function safe(v){
  return (v === undefined || v === null || v === "") ? "-" : v;
}

/* ================= GROUP ================= */
function renderGroup(){

  container.innerHTML = "";

  groupData.forEach(day=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">${day.date}</div>`;

    day.matches.forEach(m=>{

      const homeFlag = flagMap[m.home] || "none";
      const awayFlag = flagMap[m.away] || "none";

      const scoreText =
                    (m.homeScore === "-" && m.awayScore === "-")
                    ? "-"
                    : `${m.homeScore} - ${m.awayScore}`;

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
            onerror="this.src='flags/none.png'">
            <span class="team-name">${m.home}</span>
          </div>

          <div class="score">${scoreText}</div>

          <div class="away">
            <span class="team-name">${m.away}</span>
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

/* ================= STANDINGS ================= */
function calculateStandings(data){

  const groups = {};

  data.forEach(day=>{
    day.matches.forEach(m=>{

      if(!m.group) return;

      const g = m.group;

      if(!groups[g]) groups[g] = {};

      const hs = Number(m.homeScore);
      const as = Number(m.awayScore);

      if(Number.isNaN(hs) || Number.isNaN(as)) return;

      const home = m.home;
      const away = m.away;

      if(!groups[g][home]) groups[g][home] = init(home);
      if(!groups[g][away]) groups[g][away] = init(away);

      groups[g][home].played++;
      groups[g][away].played++;

      groups[g][home].gf += hs;
      groups[g][home].ga += as;

      groups[g][away].gf += as;
      groups[g][away].ga += hs;

      if(hs > as){
        groups[g][home].win++;
        groups[g][away].lose++;
        groups[g][home].pts += 3;
      } else if(hs < as){
        groups[g][away].win++;
        groups[g][home].lose++;
        groups[g][away].pts += 3;
      } else {
        groups[g][home].draw++;
        groups[g][away].draw++;
        groups[g][home].pts++;
        groups[g][away].pts++;
      }
    });
  });

  Object.keys(groups).forEach(g=>{
    groups[g] = Object.values(groups[g]).sort((a,b)=>{
      if(b.pts !== a.pts) return b.pts - a.pts;
      const gd = (b.gf-b.ga) - (a.gf-a.ga);
      if(gd !== 0) return gd;
      return b.gf - a.gf;
    });
  });

  return groups;
}

function init(name){
  return {
    name,
    played:0,
    win:0,
    draw:0,
    lose:0,
    gf:0,
    ga:0,
    pts:0
  };
}

function renderStandings(){

  container.innerHTML = "";

  const table = calculateStandings(groupData);

  Object.keys(table).forEach(group=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">Group ${group}</div>`;

    html += `<div class="match">
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <tr>
        <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
      </tr>`;

    table[group].forEach(t=>{

      const flag = flagMap[t.name] || "none";

      html += `
      <tr>
        <td style="text-align:left">
          <img src="flags/${flag}.jpg"
          style="width:18px;height:12px;vertical-align:middle;margin-right:6px"
          onerror="this.src='flags/none.png'">
          ${t.name}
        </td>
        <td>${t.played}</td>
        <td>${t.win}</td>
        <td>${t.draw}</td>
        <td>${t.lose}</td>
        <td>${t.gf - t.ga}</td>
        <td><b>${t.pts}</b></td>
      </tr>`;
    });

    html += `</table></div>`;

    card.innerHTML = html;
    container.appendChild(card);
  });
}

/* ================= KNOCKOUT (ของเดิมคุณ ไม่แตะ logic) ================= */
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
            <div>
              ${m.tv ? `<img src="tv/${m.tv}.png" class="tv-icon">` : ''}
              ${m.time}
            </div>
          </div>

          <div class="teams">
            <div class="home">
              <img class="flag" src="flags/${homeFlag}.jpg"
              onerror="this.src='flags/none.png'">
              <span class="team-name">${m.home}</span>
            </div>

            <div class="score">${scoreText}</div>

            <div class="away">
              <span class="team-name">${m.away}</span>
              <img class="flag" src="flags/${awayFlag}.jpg"
              onerror="this.src='flags/none.png'">
            </div>
          </div>
        </div>`;
      });
    });

    card.innerHTML = html;
    container.appendChild(card);
  });
}
