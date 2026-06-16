const flagMap = {
  "Mexico":"MEX",
  "South Africa":"RSA",
  "South Korea":"KOR",
  "Czechia":"CZE",
  "Canada":"CAN",
  "Bosnia & Herz.":"BIH",
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
  "Netherlands":"NED",
  "Japan":"JPN",
  "France":"FRA",
  "England":"ENG",
  "Spain":"ESP",
  "Argentina":"ARG",
  "Portugal":"POR",
  "Italy":"ITA",
  "Belgium":"BEL",
  "Uruguay":"URU",
  "Croatia":"CRO",
  "Denmark":"DEN",
  "Poland":"POL",
  "Sweden":"SWE",
  "Norway":"NOR",
  "Chile":"CHI",
  "Peru":"PER",
  "Colombia":"COL",
  "Ecuador":"ECU",
  "Senegal":"SEN",
  "Nigeria":"NGA",
  "Egypt":"EGY",
  "Algeria":"ALG",
  "Tunisia":"TUN",
  "Ghana":"GHA",
  "Cameroon":"CMR"
};

function renderStandings(data){

  const container = document.getElementById("schedule");
  container.innerHTML = "";

  const table = calc(data);

  Object.keys(table).forEach(group=>{

    const card = document.createElement("div");
    card.className = "card";

    let html = `<div class="card-header">Group ${group}</div>`;

    html += `<div class="match">
    <table style="width:100%;font-size:13px">
      <tr>
        <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
      </tr>`;

    table[group].forEach(t=>{

      const flag = flagMap[t.name] || "none";

      html += `
      <tr>
        <td>
          <img src="flags/${flag}.jpg" width="18">
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

function calc(data){

  const g = {};
  const all = {};

  data.forEach(d=>{
    d.matches.forEach(m=>{
      if(!m.group) return;

      if(!all[m.group]) all[m.group] = new Set();

      all[m.group].add(m.home);
      all[m.group].add(m.away);
    });
  });

  Object.keys(all).forEach(k=>{
    g[k] = {};
    all[k].forEach(t=>{
      g[k][t] = {name:t,played:0,win:0,draw:0,lose:0,gf:0,ga:0,pts:0};
    });
  });

  data.forEach(d=>{
    d.matches.forEach(m=>{

      const hs = Number(m.homeScore);
      const as = Number(m.awayScore);

      if(isNaN(hs)||isNaN(as)) return;

      const home=m.home,away=m.away,gp=m.group;

      g[gp][home].played++;
      g[gp][away].played++;

      g[gp][home].gf+=hs;
      g[gp][home].ga+=as;

      g[gp][away].gf+=as;
      g[gp][away].ga+=hs;

      if(hs>as){
        g[gp][home].win++; g[gp][away].lose++; g[gp][home].pts+=3;
      }else if(hs<as){
        g[gp][away].win++; g[gp][home].lose++; g[gp][away].pts+=3;
      }else{
        g[gp][home].draw++; g[gp][away].draw++;
        g[gp][home].pts++; g[gp][away].pts++;
      }
    });
  });

  Object.keys(g).forEach(k=>{
    g[k] = Object.values(g[k]).sort((a,b)=>
      b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga)
    );
  });

  return g;
}
