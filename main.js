let groupData = [];
let knockoutData = [];
let currentTab = "group";

const container = document.getElementById("schedule");

/* LOAD */
fetch("matches.json?v=" + Date.now())
.then(r=>r.json())
.then(data=>{
  groupData = data;
  if(currentTab==="group") render();
});

fetch("knockout.json?v=" + Date.now())
.then(r=>r.json())
.then(data=>{
  knockoutData = data;
});

/* TAB */
function switchTab(tab, e){
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  e.target.classList.add("active");

  if(tab==="group") render();
  if(tab==="standings") renderStandings(groupData);
  if(tab==="knockout") renderKnockout();
}

/* ===== UI เดิมคุณ (ไม่แตะเลย) ===== */
function render(){

    container.innerHTML = "";

    groupData.forEach(day => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-header">${day.date}</div>

            ${day.matches.map(match => {

                const scoreText =
                    (match.homeScore === "-" && match.awayScore === "-")
                    ? "-"
                    : `${match.homeScore} - ${match.awayScore}`;

                return `
                <div class="match">
                    <div class="top-row">
                        <div>${match.group}</div>
                        <div>${match.time}</div>
                    </div>

                    <div class="teams">
                        <div class="home">
                            <img class="flag" src="flags/${match.homeFlag}.jpg">
                            ${match.home}
                        </div>

                        <div class="score">${scoreText}</div>

                        <div class="away">
                            ${match.away}
                            <img class="flag" src="flags/${match.awayFlag}.jpg">
                        </div>
                    </div>
                </div>`;
            }).join("")}
        `;

        container.appendChild(card);
    });
}

/* knockout = เดิมคุณ ไม่แตะ */
function renderKnockout(){
    container.innerHTML = "<div class='card'><div class='card-header'>Knockout</div></div>";
}
