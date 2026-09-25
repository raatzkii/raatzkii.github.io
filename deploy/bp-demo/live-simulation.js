/* Illustrative activity only: no real users, bets or prize feed is connected. */
(function(root){
  const randomBetween=(random,min,max)=>min+random()*(max-min);
  function createModel(base,jackpot,random=Math.random){
    let count=base,amount=jackpot,target=base,trendUntil=0;
    return {
      snapshot:()=>({count,jackpot:amount}),
      participants(now){
        // A slow-changing room trend plus small arrivals/departures, rather than
        // independent random totals. Soft mean reversion keeps long runs credible.
        if(now>=trendUntil){target=Math.round(base*randomBetween(random,.92,1.08));trendUntil=now+randomBetween(random,45000,120000);}
        const size=Math.round(randomBetween(random,1,random()<.1?18:6));
        const chanceUp=Math.max(.28,Math.min(.72,.5+(target-count)/(base*.25)));
        count=Math.max(Math.round(base*.7),Math.min(Math.round(base*1.3),count+(random()<chanceUp?size:-size)));
        return {count,delay:random()<.12?randomBetween(random,18000,35000):randomBetween(random,3500,11000)};
      },
      prize(){
        // Simulate irregular contribution batches, with occasional quiet periods.
        const increment=random()<.18?0:Math.round(randomBetween(random,4,random()<.08?160:45)*(count/base));
        amount+=increment;
        return {jackpot:amount,delay:increment===0?randomBetween(random,10000,18000):randomBetween(random,2200,7500)};
      }
    };
  }
  if(typeof module!=='undefined'){module.exports={createModel};return;}
  const number=new Intl.NumberFormat('en-PH');
  const currency=value=>'₱'+number.format(value);
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const rooms=[{id:9,name:'Pinoy Drop Ball',base:1248,prize:3000000},{id:10,name:'Color Game',base:856,prize:1500000}].map(config=>{
    const card=document.querySelector(`.stream-card[data-game="${config.id}"]`);
    return {...config,card,model:createModel(config.base,config.prize),timers:[],frame:0};
  });
  function animatePrize(room,value){
    const el=room.card.querySelector('.stream-jackpot strong');
    const start=Number(el.textContent.replace(/[^0-9]/g,''));
    cancelAnimationFrame(room.frame);
    room.card.querySelector('.stream-jackpot').setAttribute('aria-label',`${room.name} simulated jackpot ${currency(value)}`);
    if(reducedMotion.matches||start===value){el.textContent=currency(value);return;}
    const began=performance.now();
    function frame(time){const t=Math.min(1,(time-began)/450);el.textContent=currency(Math.round(start+(value-start)*(1-(1-t)**3)));if(t<1)room.frame=requestAnimationFrame(frame);}
    room.frame=requestAnimationFrame(frame);
  }
  function stop(){for(const room of rooms){room.timers.forEach(clearTimeout);room.timers=[];cancelAnimationFrame(room.frame);}}
  function start(){
    stop();if(document.hidden)return;
    for(const room of rooms){
      const count=room.card.querySelector('.stream-count');
      count.title='Simulated players and viewers';
      room.card.querySelector('.stream-jackpot').title='Simulated jackpot';
      // Separate schedules keep the two rooms and their counters independent.
      function people(){const next=room.model.participants(Date.now());count.querySelector('.participant-value').textContent=number.format(next.count);count.setAttribute('aria-label',`${number.format(next.count)} players and viewers, simulated`);room.timers[0]=setTimeout(people,next.delay);}
      function prize(){const next=room.model.prize();animatePrize(room,next.jackpot);room.timers[1]=setTimeout(prize,next.delay);}
      room.timers[0]=setTimeout(people,randomBetween(Math.random,1200,3200));
      room.timers[1]=setTimeout(prize,randomBetween(Math.random,1500,4000));
    }
  }
  document.addEventListener('visibilitychange',start);
  window.addEventListener('pagehide',stop);
  window.addEventListener('pageshow',start);
  start();
})(typeof window!=='undefined'?window:globalThis);
