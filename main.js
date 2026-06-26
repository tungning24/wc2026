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
  if(currentTab==="knockout") renderKnockout();
  if(currentTab==="bracket") renderBracket(knockoutData);
});

/* TAB SWITCH */
function switchTab(tab, e){
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  e.target.classList.add("active");

  if(tab==="group") renderGroup();
  if(tab==="standings") renderStandings();
  if(tab==="knockout") renderKnockout();
  if(tab==="bracket") renderBracket(knockoutData);
}

/* SAFE SCORE */
function safe(v){
  return (v === undefined || v === null || v === "") ? "-" : v;
}

/* ================= GROUP ================= */
function renderGroup(){

  container.innerHTML = "";
  container.classList.remove("knockout-mode");

  groupData.forEach(day=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">${day.date}</div>`;

    day.matches.forEach(m=>{

      const homeFlag = flagMap[m.home] || "none";
      const awayFlag = flagMap[m.away] || "none";

      const scoreText =
					(safe(m.homeScore) === "-" && safe(m.awayScore) === "-")
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

      const home = m.home;
      const away = m.away;

      if(!groups[g][home]) groups[g][home] = init(home);
      if(!groups[g][away]) groups[g][away] = init(away);

      const hs = Number(m.homeScore);
      const as = Number(m.awayScore);

      // ยังไม่แข่งก็แค่สร้างทีมไว้
      if(Number.isNaN(hs) || Number.isNaN(as)) return;

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

/* ================= RENDER ================= */
function renderStandings(){

  container.innerHTML = "";
  container.classList.remove("knockout-mode");

  const table = calculateStandings(groupData);

  Object.keys(table).forEach(group=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `
      <div class="card-header">Group ${group}</div>

      <div class="match" style="padding:0">
        <table class="standings-table">
          <colgroup>
            <col style="width:42%">
            <col style="width:6%">
            <col style="width:6%">
            <col style="width:6%">
            <col style="width:6%">
            <col style="width:6%">
            <col style="width:6%">
            <col style="width:10%">
            <col style="width:12%">
          </colgroup>

          <thead>
            <tr>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>F</th>
              <th>A</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>

          <tbody>
    `;

    table[group].forEach(t=>{

      const flag = flagMap[t.name] || "none";

      html += `
        <tr>
          <td class="team-cell">
            <img src="flags/${flag}.jpg"
                 onerror="this.src='flags/none.png'">
            <span>${t.name}</span>
          </td>

          <td>${t.played}</td>
          <td>${t.win}</td>
          <td>${t.draw}</td>
          <td>${t.lose}</td>
          <td>${t.gf}</td>
          <td>${t.ga}</td>
          <td>${t.gf - t.ga}</td>
          <td><b>${t.pts}</b></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    card.innerHTML = html;
    container.appendChild(card);
  });
}
/* ================= KNOCKOUT (ของเดิมคุณ ไม่แตะ logic) ================= */
function renderKnockout(){

  container.innerHTML = "";
  container.classList.remove("knockout-mode");

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

/* ================= BRACKET ================= */
function renderBracket(rounds){

  container.innerHTML = "";
  container.classList.add("knockout-mode");

  if(!rounds.length){
    container.innerHTML = `<div class="status">Loading knockout data...</div>`;
    return;
  }

  const bracketWrap = document.createElement("div");
  bracketWrap.className = "bracket-wrap";
  bracketWrap.innerHTML = `
    <div id="bracket" class="bracket">
      <svg id="lines" viewBox="0 0 1180 1580" aria-hidden="true"></svg>
    </div>
  `;

  container.appendChild(bracketWrap);

  const bracket = bracketWrap.querySelector("#bracket");
  const svg = bracketWrap.querySelector("#lines");
  const matchPositions = {};

  const roundX = {
    "Round of 32":20,
    "Round of 16":250,
    "Quarter-final":480,
    "Semi-final":710,
    "Final":940,
    "Match for third place":940
  };

  const roundTop = {
    "Round of 32":58,
    "Round of 16":104,
    "Quarter-final":196,
    "Semi-final":380,
    "Final":748,
    "Match for third place":920
  };

  const roundGap = {
    "Round of 32":92,
    "Round of 16":184,
    "Quarter-final":368,
    "Semi-final":736
  };

  const roundTitles = [
    ["Round of 32", roundX["Round of 32"]],
    ["Round of 16", roundX["Round of 16"]],
    ["Quarter-final", roundX["Quarter-final"]],
    ["Semi-final", roundX["Semi-final"]],
    ["Final", roundX["Final"]]
  ];

  const connections = [
    [74,89],[77,89],[73,90],[75,90],
    [76,91],[78,91],[79,92],[80,92],
    [83,93],[84,93],[81,94],[82,94],
    [86,95],[88,95],[85,96],[87,96],
    [89,97],[90,97],[93,98],[94,98],
    [91,99],[92,99],[95,100],[96,100],
    [97,101],[98,101],[99,102],[100,102],
    [101,104],[102,104]
  ];

  const matches = flattenKnockoutMatches(rounds);

  roundTitles.forEach(([title, x])=>{
    const titleEl = document.createElement("div");
    titleEl.className = "round-title";
    titleEl.style.left = x + "px";
    titleEl.textContent = title;
    bracket.appendChild(titleEl);
  });

  placeRound(matches, "Round of 32", [74,77,73,75,83,84,81,82,76,78,79,80,86,88,85,87]);
  placeRound(matches, "Round of 16", [89,90,93,94,91,92,95,96]);
  placeRound(matches, "Quarter-final", 97, 100);

  createBracketMatch(matches[101], roundX["Semi-final"], roundTop["Semi-final"]);
  createBracketMatch(matches[102], roundX["Semi-final"], roundTop["Semi-final"] + roundGap["Semi-final"]);
  createBracketMatch(matches[104], roundX["Final"], roundTop["Final"]);
  createBracketMatch(matches[103], roundX["Match for third place"], roundTop["Match for third place"]);

  connections.forEach(([from, to])=>drawConnection(from, to));

  function placeRound(matchesByNum, roundName, startOrOrder, end){
    let y = roundTop[roundName];

    const nums = Array.isArray(startOrOrder)
      ? startOrOrder
      : Array.from(
          { length: end - startOrOrder + 1 },
          (_, i) => startOrOrder + i
        );

    for (const num of nums) {
      createBracketMatch(matchesByNum[num], roundX[roundName], y);
      y += roundGap[roundName];
    }
  }

  function createBracketMatch(match, x, y){
    if(!match) return;

    const homeFlag = flagMap[match.home] || "none";
    const awayFlag = flagMap[match.away] || "none";

    const div = document.createElement("div");
    div.className = "ko-match";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.innerHTML = `
      <div class="ko-match-header">
        <span>M${match.num} ${match.date}</span>
        <span>${match.time}</span>
      </div>
      ${bracketTeamRow(match.home, homeFlag, safe(match.homeScore))}
      ${bracketTeamRow(match.away, awayFlag, safe(match.awayScore))}
    `;

    bracket.appendChild(div);

    matchPositions[match.num] = {
      x,
      y,
      w:180,
      h:div.offsetHeight
    };
  }

  function drawConnection(from, to){
    const a = matchPositions[from];
    const b = matchPositions[to];

    if(!a || !b) return;

    const x1 = a.x + a.w;
    const y1 = a.y + a.h / 2;
    const x2 = b.x;
    const y2 = b.y + b.h / 2;
    const mid = (x1 + x2) / 2;

    addLine(x1, y1, mid, y1);
    addLine(mid, y1, mid, y2);
    addLine(mid, y2, x2, y2);
  }

  function addLine(x1, y1, x2, y2){
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    svg.appendChild(line);
  }
}

function flattenKnockoutMatches(rounds){
  const matches = {};

  rounds.forEach(round=>{
    round.days.forEach(day=>{
      day.matches.forEach(match=>{
        matches[match.num] = {
          ...match,
          round: round.round,
          date: day.date
        };
      });
    });
  });

  return matches;
}

function bracketTeamRow(name, flag, score){
  return `
    <div class="ko-team">
      <img class="flag" src="flags/${flag}.jpg" onerror="this.src='flags/none.png'" alt="">
      <span class="team-name" title="${escapeAttr(name)}">${name}</span>
      <span class="ko-score">${score}</span>
    </div>
  `;
}

function escapeAttr(value){
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
