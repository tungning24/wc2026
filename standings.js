function calculateStandings(data, flagMap){

  const groups = {};
  const allTeams = {};

  data.forEach(day=>{
    day.matches.forEach(m=>{
      if(!m.group) return;

      if(!allTeams[m.group]) allTeams[m.group] = new Set();

      allTeams[m.group].add(m.home);
      allTeams[m.group].add(m.away);
    });
  });

  Object.keys(allTeams).forEach(g=>{
    groups[g] = {};

    allTeams[g].forEach(team=>{
      groups[g][team] = init(team);
    });
  });

  data.forEach(day=>{
    day.matches.forEach(m=>{

      const g = m.group;
      if(!g) return;

      const hs = Number(m.homeScore);
      const as = Number(m.awayScore);

      if(Number.isNaN(hs) || Number.isNaN(as)) return;

      const home = m.home;
      const away = m.away;

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
      return gd !== 0 ? gd : b.gf - a.gf;
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

/* ===== RENDER STANDINGS ===== */
function renderStandings(groupData, flagMap){

  const container = document.getElementById("schedule");
  container.innerHTML = "";

  const table = calculateStandings(groupData, flagMap);

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
          style="width:18px;height:12px;margin-right:6px"
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
