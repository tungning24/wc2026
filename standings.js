function calculateStandings(data){

  const groups = {};

  data.forEach(day=>{
    day.matches.forEach(m=>{

      const g = m.group;

      if(!groups[g]) groups[g] = {};

      const home = m.home;
      const away = m.away;

      const hs = parseInt(m.homeScore);
      const as = parseInt(m.awayScore);

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
      }
      else if(hs < as){
        groups[g][away].win++;
        groups[g][home].lose++;
        groups[g][away].pts += 3;
      }
      else{
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
      const gdB = b.gf - b.ga;
      const gdA = a.gf - a.ga;
      if(gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });
  });

  return groups;
}

function init(name){
  return{
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