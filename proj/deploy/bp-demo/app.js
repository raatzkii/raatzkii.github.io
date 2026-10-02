const controller = '<svg class="icon-fill" viewBox="0 0 48 48" aria-hidden="true"><path fill-rule="evenodd" d="M14 14h20c5.7 0 8.2 5.7 9.2 11.5.9 5.2.5 10.7-2.5 11.8-2.5.9-5-1.2-7.2-3.2L29 30H19l-4.5 4.1c-2.2 2-4.7 4.1-7.2 3.2-3-1.1-3.4-6.6-2.5-11.8C5.8 19.7 8.3 14 14 14Zm3.2 5a1.4 1.4 0 0 0-1.4 1.4v2.4h-2.4a1.4 1.4 0 1 0 0 2.8h2.4V28a1.4 1.4 0 1 0 2.8 0v-2.4H21a1.4 1.4 0 1 0 0-2.8h-2.4v-2.4a1.4 1.4 0 0 0-1.4-1.4Zm13.8 3.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm4 4a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"/></svg>';
const names = [ ['Super Ace','Slots','JILI'],['Fortune Gems','Slots','JILI'],['Money Coming','Slots','JILI'],['Super Ace Deluxe','Slots','JILI'],['Fortune Gems 2','Slots','JILI'],['Golden Empire','Slots','JILI'],['Tongits Plus','Card Games','In-house'],['Pusoy Dos','Card Games','In-house'],['Tongits Classic','Card Games','In-house'],['Pinoy Drop Ball','Perya','In-house'],['Color Game','Perya','In-house'],['Lucky 9','Perya','In-house'],['Super Baccarat','Live Casino','Evolution'],['Lightning Roulette','Live Casino','Evolution'],['Crazy Time','Live Casino','Evolution'],['Wild Bounty Showdown','Slots','PG Soft'],['Mahjong Ways','Slots','PG Soft'],['Gates of Olympus','Slots','Pragmatic Play'],['Sweet Bonanza','Slots','Pragmatic Play'],['Wild Bandito','Slots','PG Soft'],['Bingo Party','Bingo','In-house'],['Mega Bingo','Bingo','In-house'],['Lucky Bingo','Bingo','In-house'],['Fortune Tiger','Slots','PG Soft'],['1000x Treasure','Slots','Pragmatic Play'],['Dragon Tiger','Live Casino','Evolution'],['Bingo Rush','Bingo','In-house'],['Monopoly Live','Live Casino','Evolution'] ];
// Extra sample titles fill out the category wireframes.
names.push(...['Bingo Fiesta','Bingo Night','Bingo Stars','Bingo Club','Bingo Bonanza','Bingo Classic','Bingo Express','Bingo Gold'].map(name=>[name,'Bingo','Demo']));
names.push(...['Perya Dice','Lucky Colors','Perya Wheel','Coin Toss','Triple Dice','Lucky Ball','Color Fiesta','Perya Lucky Pick','Perya Classic'].map(name=>[name,'Perya','Demo']));
names.push(...['Pusoy Classic','Tongits Quick','Lucky Cards','Card Club','Pusoy Party','Tongits Stars','Card Match','Card Masters','Classic Solitaire'].map(name=>[name,'Card Games','Demo']));
names.push(...['Lucky Spin','Coin Flip','Dice Dash','Ball Drop','Quick Match','Number Pick','Mini Wheel','Lucky Tiles','Color Match','Coin Catch','Puzzle Dash','Mini Cards'].map(name=>[name,'Mini Games','Demo']));
names.push(['Free Spins Preview','Slots','JDB'],['Bonus Reels Preview','Slots','CQ9'],['Progressive Gold Preview','Slots','JILI'],['Progressive Fortune Preview','Slots','PG Soft'],['Progressive Reels Preview','Slots','Pragmatic Play'],['Classic Sevens Preview','Slots','Demo'],['Fruit Reels Preview','Slots','Demo'],['Golden Bells Preview','Slots','Demo']);
names.push(['Speed Blackjack','Live Casino','Vivo Gaming'],['Sic Bo Live Preview','Live Casino','Vivo Gaming'],['Pula Puti Preview','Perya','Demo'],['In Between Preview','Perya','Demo'],['Poker Table Preview','Card Games','Demo'],['Crash Preview','Mini Games','Demo'],['Mines Preview','Mini Games','Demo'],['Plinko Preview','Mini Games','Demo']);
names.push(...['Dream Catcher Preview','Lightning Dice Preview','Mega Wheel Preview','Cash or Crash Preview','Deal or No Deal Preview','Speed Baccarat Preview','VIP Baccarat Preview',"Casino Hold'em Preview",'Three Card Poker Preview','Auto Roulette Preview','Speed Roulette Preview','Roulette Royale Preview','European Roulette Preview','French Roulette Preview','Mega Roulette Preview'].map(name=>[name,'Live Casino','Demo']));
const originalGameNames=names.map(row=>row[0]);
names.forEach((row,id)=>{row[0]=window.gameArtwork[id][0];row[2]=window.gameArtwork[id][1]});
const games=names.map(([name,category,provider],id)=>({id,name,category,provider,legacyName:originalGameNames[id]}));
const findGame=name=>games.find(g=>g.legacyName===name)||games.find(g=>g.name===name);
const livePreviewProviders={'Dream Catcher Preview':'Evolution','Lightning Dice Preview':'Evolution','Mega Wheel Preview':'Pragmatic Play Live','Cash or Crash Preview':'Evolution','Deal or No Deal Preview':'Evolution','Speed Baccarat Preview':'Ezugi','VIP Baccarat Preview':'Pragmatic Play Live',"Casino Hold'em Preview":'Ezugi','Three Card Poker Preview':'Playtech Live','Auto Roulette Preview':'Ezugi','Speed Roulette Preview':'Vivo Gaming','Roulette Royale Preview':'Playtech Live','European Roulette Preview':'Pragmatic Play Live','French Roulette Preview':'Playtech Live','Mega Roulette Preview':'Pragmatic Play Live'};
// The asset catalog is authoritative for the provider shown with each real game.
const categories=['All','Slots','Bingo','Perya','Live Casino','Card Games','Mini Games'];let category='All', provider='All', discovery='', theme='All themes', subCategory='All', sectionView='';
const categorySubcategories={
  Slots:['All','Jackpot','Classic','Ways','Hold & Win','Feature Buy'],
  'Live Casino':['All','Baccarat','Roulette','Blackjack','Sic Bo','Game Shows'],
  Perya:['All','Color Game','Pula Puti','Ball Games','In Between'],
  Bingo:['All','Traditional','Speed Bingo','Pattern Bingo','Specialty'],
  'Card Games':['All','Tongits','Pusoy','Poker','Other Cards'],
  'Mini Games':['All','Crash','Mines','Plinko','Dice','Arcade']
};
const subcategoryGames={
  Slots:{Jackpot:['Fortune Gems','Fortune Gems 2','Progressive Gold Preview','Progressive Fortune Preview','Progressive Reels Preview'],Classic:['Classic Sevens Preview','Fruit Reels Preview','Golden Bells Preview'],Ways:['Mahjong Ways','Wild Bounty Showdown','Wild Bandito'], 'Hold & Win':['Golden Empire','Money Coming','Progressive Reels Preview'],'Feature Buy':['Bonus Reels Preview','Free Spins Preview','Gates of Olympus','Sweet Bonanza']},
  'Live Casino':{Baccarat:['Super Baccarat','Speed Baccarat Preview','VIP Baccarat Preview'],Roulette:['Lightning Roulette','Auto Roulette Preview','Speed Roulette Preview','Roulette Royale Preview','European Roulette Preview','French Roulette Preview','Mega Roulette Preview'],Blackjack:['Speed Blackjack','Three Card Poker Preview'],'Sic Bo':['Sic Bo Live Preview'],'Game Shows':['Crazy Time','Monopoly Live','Dream Catcher Preview','Lightning Dice Preview','Mega Wheel Preview','Cash or Crash Preview','Deal or No Deal Preview']},
  Perya:{'Color Game':['Color Game','Lucky Colors','Color Fiesta'],'Pula Puti':['Pula Puti Preview'],'Ball Games':['Pinoy Drop Ball','Lucky 9'],'In Between':['In Between Preview']},
  Bingo:{Traditional:['Bingo Party','Bingo Classic','Bingo Club','Lucky Bingo'],'Speed Bingo':['Bingo Rush','Bingo Express','Bingo Night'],'Pattern Bingo':['Bingo Stars','Bingo Bonanza','Bingo Fiesta'],Specialty:['Mega Bingo','Bingo Gold']},
  'Card Games':{Tongits:['Tongits Plus'],Pusoy:['Pusoy Dos'],Poker:['Lucky Cards','Card Club','Pusoy Party','Card Masters'], 'Other Cards':['Tongits Classic','Pusoy Classic','Tongits Quick','Tongits Stars','Card Match','Classic Solitaire','Poker Table Preview']},
  'Mini Games':{Crash:['Ball Drop','Quick Match','Crash Preview'],Mines:['Coin Flip','Dice Dash','Mines Preview'],Plinko:['Lucky Spin','Plinko Preview'],Dice:['Mini Cards'],Arcade:['Number Pick','Mini Wheel','Lucky Tiles','Color Match','Coin Catch','Puzzle Dash']}
};
const categoryFacets={
  Slots:{'Bet Range':['₱1–₱10','₱11–₱50','₱51+'],Volatility:['Low','Medium','High'],Features:['Free Spins','Multipliers','Bonus Buy','Jackpot']},
  'Live Casino':{'Bet Range':['₱1–₱10','₱11–₱50','₱51+'],'Table Type':['Standard','Speed','Game Show'],Language:['English','Filipino']},
  Perya:{'Bet Range':['₱1–₱10','₱11–₱50','₱51+']},
  Bingo:{'Bet Range':['₱1–₱10','₱11–₱50','₱51+'],'Ball Type':['75 Ball','90 Ball','30 Ball']},
  'Card Games':{'Bet Range':['₱1–₱10','₱11–₱50','₱51+'],Players:['2 Players','3 Players','4+ Players'],'Game Mode':['Classic','Quick','Tournament']},
  'Mini Games':{'Bet Range':['₱1–₱10','₱11–₱50','₱51+'],'Game Type':['Chance','Skill','Arcade']}
};
let facetSelections={};
const themes=['All themes','Egyptian','Asian','Candy','King','Girls','Animals','Movie'];
// Illustrative theme tags for the wireframe catalog; untagged themes show an empty state.
const themeGames={Egyptian:[],Asian:[1,4,16,19,23],Candy:[18],King:[5,17],Girls:[],Animals:[19,23,25],Movie:[27]};
// One badge source keeps All and the discovery filters consistent.
const gameBadges={'Super Ace':'Trending','Fortune Gems':'Trending','Super Baccarat':'Trending','Crazy Time':'Trending','Mega Bingo':'Trending','Bingo Stars':'Trending','Wild Bounty Showdown':'Trending','Gates of Olympus':'Trending','Pinoy Drop Ball':'Trending','Bingo Rush':'Trending','Lucky Spin':'Trending','Money Coming':'Popular','Golden Empire':'Popular','Dragon Tiger':'Popular','Monopoly Live':'Popular','Mahjong Ways':'Popular','Fortune Tiger':'Popular','Color Game':'Popular','Pusoy Dos':'Popular','Lucky Bingo':'Popular','Coin Flip':'Popular','Super Ace Deluxe':'New','Lucky Colors':'New'};
const rankedNames={
  Trending:['Super Ace','Fortune Gems','Super Baccarat','Crazy Time','Mega Bingo','Bingo Stars','Money Coming','Golden Empire','Dragon Tiger','Monopoly Live','Wild Bounty Showdown','Gates of Olympus','Pinoy Drop Ball','Bingo Rush','Lucky Spin'],
  Popular:['Money Coming','Golden Empire','Dragon Tiger','Monopoly Live','Super Ace','Fortune Gems','Super Baccarat','Crazy Time','Mega Bingo','Mahjong Ways','Fortune Tiger','Color Game','Pusoy Dos','Lucky Bingo','Coin Flip']
};
const badgeRanks=Object.fromEntries(Object.entries(rankedNames).map(([label,list])=>[label,Object.fromEntries(list.map((name,index)=>[name,index+1]))]));
const gameTags=Object.fromEntries(games.map(g=>[g.id,gameBadges[g.legacyName]?[gameBadges[g.legacyName]]:[]]));
// Groups overlap: these are independent discovery attributes, not exclusive categories.
for(const [label,list] of Object.entries(rankedNames))for(const name of list){const game=findGame(name);if(!gameTags[game.id].includes(label))gameTags[game.id].push(label)}
for(const id of [1,4,5,9,17,21,24])gameTags[id].push('Jackpot');
const discoveryGroups=Object.fromEntries(['Trending','Popular','Jackpot','New'].map(label=>[label,rankedNames[label]?rankedNames[label].map(name=>findGame(name).id):games.filter(g=>gameTags[g.id].includes(label)).map(g=>g.id)]));
const discoveryHeadings={Trending:'Rising',Popular:'All-time Favorites',Jackpot:'Massive Win',New:'New Releases'};
const statusBadges=new Set(['Trending','Popular','Jackpot','New']);
const $=s=>document.querySelector(s);const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function badgeMarkup(g,label,className){const rank=badgeRanks[label]?.[g.legacyName];if(statusBadges.has(label)){const icon=label.toLowerCase();return `<span class="${className} status-icon-badge ${icon}-icon-badge" data-badge="${label}" aria-label="${label}" style="--badge-rank:${rank||1}"><img src="assets/ico-${icon}.avif" alt="" aria-hidden="true"></span>`}return `<span class="${className}" data-badge="${esc(label)}" aria-label="${esc(label)}">${esc(label)}</span>`}
function defaultBadge(g){return gameBadges[g.legacyName]||(gameTags[g.id].includes('Jackpot')?'Jackpot':'')}
function badgeLabels(badge){return Array.isArray(badge)?badge:badge?[badge]:[]}
function titleBadges(g,badge){return badgeLabels(badge).filter(label=>statusBadges.has(label)).map(label=>badgeMarkup(g,label,'caption-badge')).join('')}
function art(g,badge=defaultBadge(g)){const badges=badgeLabels(badge).filter(label=>!statusBadges.has(label));const image=window.gameImageFiles[g.id];const extended=window.gameExtendedFiles?.[g.id];const landscape=extended&&[16,19,76].includes(g.id);return `<div class="game-art${image?' has-image':''}${extended?' has-extended-image':''}${landscape?' has-landscape-extension':''}">${badges.length?`<span class="game-badges">${badges.map(label=>badgeMarkup(g,label,'tag')).join('')}</span>`:''}${extended?`<img class="game-art-extension" src="assets/games/${extended}" alt="" loading="lazy">`:''}${image?`<img class="game-art-image" src="assets/games/${image}" alt="" loading="lazy">`:controller}</div>`}
function card(g,badge){const selected=badge===undefined?defaultBadge(g):badge;const labels=badgeLabels(selected).filter(label=>statusBadges.has(label));return `<button class="game-card" data-game="${g.id}" aria-label="View ${esc(g.name)}${labels.length?`, ${labels.join(', ')}`:''}">${art(g,selected)}<span class="game-title-row">${titleBadges(g,selected)}<span class="game-name">${esc(g.name)}</span></span><span class="game-provider">${esc(g.provider)}</span></button>`}
const discoveryIcons={
  Trending:'<img class="trending-icon" src="assets/ico-trending.avif" alt="" aria-hidden="true">',
  Popular:'<img class="discovery-image-icon" src="assets/ico-popular.avif" alt="" aria-hidden="true">',
  Jackpot:'<img class="discovery-image-icon" src="assets/ico-jackpot.avif" alt="" aria-hidden="true">',
  New:'<img class="discovery-image-icon" src="assets/ico-new.avif" alt="" aria-hidden="true">'
};
const categoryIcons={
  Slots:'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><rect class="icon-cutout" x="5" y="8" width="4" height="8" rx="1"/><rect class="icon-cutout" x="10" y="8" width="4" height="8" rx="1"/><rect class="icon-cutout" x="15" y="8" width="4" height="8" rx="1"/></svg>',
  Bingo:'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4"/><circle class="icon-cutout" cx="7" cy="7" r="2"/><circle class="icon-cutout" cx="17" cy="7" r="2"/><circle class="icon-cutout" cx="7" cy="17" r="2"/><circle class="icon-cutout" cx="17" cy="17" r="2"/></svg>',
  Perya:'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 3v5.3L6.4 7.6A7 7 0 0 1 11 5Zm-6 7c0-1 .2-1.9.6-2.7l4.6 2.7-4.6 2.7A7 7 0 0 1 5 12Zm6 7a7 7 0 0 1-4.6-2.6l4.6-2.7V19Zm2 0v-5.3l4.6 2.7A7 7 0 0 1 13 19Zm5.4-4.3L13.8 12l4.6-2.7a7 7 0 0 1 0 5.4ZM13 10.3V5a7 7 0 0 1 4.6 2.6L13 10.3Z"/></svg>',
  'Live Casino':'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="14" height="14" rx="3"/><path d="m17 9 5-3v12l-5-3V9Z"/></svg>',
  'Card Games':'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm14 3h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2V6Z"/></svg>',
  'Mini Games':'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12c2.6 0 4 2 4.6 5.5.6 3.7.2 7.8-1.7 8.4-1.6.5-3-1-4.5-2.4L15 16H9l-1.4 1.5C6.1 19 4.7 20.4 3.1 19.9c-1.9-.6-2.3-4.7-1.7-8.4C2 8 3.4 6 6 6Zm1.4 3v2H5.5v2h1.9v2h2v-2h2v-2h-2V9h-2Zm8 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm3 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'
};
const allSectionIcons={
  Slots:categoryIcons.Slots,
  Bingo:'<svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle class="icon-cutout" cx="12" cy="12" r="6.5"/><path d="M9 8h6v1.8l-3.5 6H9.4l3.6-6H9V8Z"/></svg>',
  Perya:categoryIcons.Perya,
  'Card Games':categoryIcons['Card Games'],
  'Mini Games':categoryIcons['Mini Games']
};
function syncPills(selector,labels,attribute,selected,content){
  const row=$(selector);
  let indicator=row.querySelector(':scope > .pill-indicator');
  if([...row.querySelectorAll(':scope > button')].map(button=>button.dataset[attribute]).join('|')!==labels.join('|')){
    row.innerHTML=labels.map(label=>`<button type="button" data-${attribute}="${label}" aria-pressed="false">${content(label)}</button>`).join('');
  }
  if(!indicator){indicator=document.createElement('span');indicator.className='pill-indicator';indicator.setAttribute('aria-hidden','true')}
  if(row.firstElementChild!==indicator)row.prepend(indicator);
  let activeButton=null;
  for(const button of row.querySelectorAll(':scope > button')){
    const active=button.dataset[attribute]===selected;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
    if(active)activeButton=button;
  }
  indicator.hidden=!activeButton;
  if(activeButton){
    indicator.style.left=`${activeButton.offsetLeft}px`;
    indicator.style.top=`${activeButton.offsetTop}px`;
    indicator.style.width=`${activeButton.offsetWidth}px`;
    indicator.style.height=`${activeButton.offsetHeight}px`;
    if(row.dataset.activePill!==selected){
      const inset=12;
      const left=activeButton.offsetLeft;
      const right=left+activeButton.offsetWidth;
      if(left<row.scrollLeft+inset)row.scrollLeft=Math.max(0,left-inset);
      else if(right>row.scrollLeft+row.clientWidth-inset)row.scrollLeft=right-row.clientWidth+inset;
    }
  }
  row.dataset.activePill=selected;
}
function chips(){
  $('#themes').innerHTML=themes.map(t=>`<button data-theme="${t}" class="${theme===t?'active':''}" aria-pressed="${theme===t}">${t}</button>`).join('');
  const categoryRow=category!=='All';
  $('#discovery-filters').classList.toggle('category-subnav',categoryRow);
  if(categoryRow)syncPills('#discovery-filters',categorySubcategories[category],'subcategory',subCategory,label=>esc(label));
  else syncPills('#discovery-filters',Object.keys(discoveryGroups),'discovery',discovery,label=>`${discoveryIcons[label]}<span>${label}</span>`);
  syncPills('#categories',categories,'category',category,label=>`${categoryIcons[label]||''}<span>${label}</span>`);
  $('#provider-heading').textContent=categoryRow?'Provider':'Game providers';
  $('#providers').innerHTML=['All',...new Set(games.filter(g=>category==='All'||g.category===category).map(g=>g.provider))].map(p=>`<button data-provider="${p}" class="${provider===p?'active':''}" aria-pressed="${provider===p}">${p==='All'?'All providers':p}</button>`).join('');
  $('#theme-filter').hidden=categoryRow;
  $('#extra-filters').innerHTML=categoryRow?Object.entries(categoryFacets[category]).map(([name,options])=>`<div class="filter-heading facet-heading"><strong>${esc(name)}</strong></div><div class="provider-options facet-options" aria-label="${esc(name)}">${options.map(value=>`<button data-facet="${esc(name)}" data-value="${esc(value)}" class="${facetSelections[name]===value?'active':''}" aria-pressed="${facetSelections[name]===value}">${esc(value)}</button>`).join('')}</div>`).join(''):'';
}
let providerLoopFrame = 0;
function stopProviderLoop(){
  cancelAnimationFrame(providerLoopFrame);
  providerLoopFrame = 0;
  providerLoopEvents.abort();
  providerLoopEvents = new AbortController();
}
const providerReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function startProviderLoop(){
  const rail = document.querySelector('.provider-rail');
  if (!rail || providerReducedMotion.matches) return;
  const first = rail.querySelector('[data-provider-copy="0"]');
  const second = rail.querySelector('[data-provider-copy="1"]');
  const cycleWidth = second.offsetLeft - first.offsetLeft;
  if (!cycleWidth) return;
  let position = cycleWidth;
  rail.scrollLeft = position;
  let lastTime = 0;
  let pauseUntil = 0;
  let held = false;
  rail.addEventListener('pointerdown', () => { held = true; });
  window.addEventListener('pointerup', () => { if (held) { held = false; pauseUntil = performance.now() + 1800; } }, {signal: providerLoopEvents.signal});
  window.addEventListener('pointercancel', () => { held = false; pauseUntil = performance.now() + 1800; }, {signal: providerLoopEvents.signal});
  rail.addEventListener('focusin', () => { held = true; });
  rail.addEventListener('focusout', () => { held = false; pauseUntil = performance.now() + 1800; });
  function tick(time){
    if (held || time < pauseUntil) {
      position = rail.scrollLeft;
    } else {
      if (position >= cycleWidth * 2) position -= cycleWidth;
      else if (position <= 0) position += cycleWidth;
      if (lastTime && !document.hidden) position += Math.min(time - lastTime, 50) * 0.022;
      rail.scrollLeft = position;
    }
    lastTime = time;
    providerLoopFrame = requestAnimationFrame(tick);
  }
  providerLoopFrame = requestAnimationFrame(tick);
}
let providerLoopEvents = new AbortController();
providerReducedMotion.addEventListener('change',()=>{
  stopProviderLoop();
  if(!providerReducedMotion.matches && !$('#category-page').hidden)startProviderLoop();
});
const rouletteReds=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const extraHotTables=[
  {name:'Lightning Roulette',tableNumber:'05',results:[17,8,23,0,12,5,20,32,4,1,29,14,10,3,24,7,11,36].map(number=>({text:String(number),label:number===0?'Green':rouletteReds.has(number)?'Red':'Black',color:number===0?'#278149':rouletteReds.has(number)?'#bd3c47':'#343b46'}))},
  {name:'Speed Blackjack',tableNumber:'06',results:'P D P P T D P D D P P T D P D P T D'.split(' ').map(value=>({text:value,label:{P:'Player',D:'Dealer',T:'Tie'}[value],color:{P:'#286cb6',D:'#bd3c47',T:'#278149'}[value]}))}
];
const liveTableImages={
  'Super Baccarat':'super-speed-baccarat.avif',
  'Crazy Time':'crazy-time.avif',
  'Dragon Tiger':'dragon-tiger.avif',
  'Monopoly Live':'monopoly-live.avif',
  'Lightning Roulette':'lightning-roulette.avif',
  'Speed Blackjack':'blackjack-party.avif'
};
function liveTablePreview(name,tableNumber){
  const image=liveTableImages[name];
  return `<div class="blank-game-preview live-table-preview"><img src="assets/live-tables/${image}" alt="" loading="lazy" decoding="async">${tableNumber?`<span class="table-number">Table ${tableNumber}</span>`:''}</div>`;
}
function liveTableCaption(game){return `<div class="live-table-caption"><span class="game-title-row">${titleBadges(game,defaultBadge(game))}<strong class="table-title">${esc(game.name)}</strong></span><span class="live-table-provider">${esc(game.provider)}</span></div>`}
function extraHotTable(table){
  const game=findGame(table.name);
  const history=table.results.map(result=>`${result.text} ${result.label}`).join(', ');
  return `<button class="live-table hot-table" data-game="${game.id}" aria-label="View ${esc(game.name)}"><div class="live-table-art"><div class="live-preview-area">${liveTablePreview(table.name,table.tableNumber)}</div><div class="game-roadmap" aria-label="Demo result history, newest first, read down each column: ${history}">${table.results.map(result=>`<span class="roadmap-result" title="${result.text} ${result.label}" style="background:${result.color}" aria-hidden="true">${result.text}</span>`).join('')}</div></div>${liveTableCaption(game)}</button>`;
}
const providerLogos={
  'JILI':['jili.avif','jili'],
  'PG Soft':['pg-soft.avif','pg-soft'],
  'Pragmatic Play':['pragmatic-play.avif','pragmatic-play'],
  'JDB':['jdb.avif','jdb'],
  'CQ9':['cq9.avif','cq9'],
  'Evolution':['evolution.avif','evolution'],
  'Pragmatic Play Live':['pragmatic-play.avif','pragmatic-play'],
  'Playtech Live':['playtech.svg','playtech'],
  'Ezugi':['ezugi.avif','ezugi'],
  'Vivo Gaming':['vivo-gaming.avif','vivo-gaming']
};
function providerTile(name,copy,categoryName){
  const [file,theme]=providerLogos[name];
  return `<button class="provider-tile" data-provider="${esc(name)}" data-provider-copy="${copy}" ${copy===1?'':`aria-hidden="true" tabindex="-1"`} aria-label="View ${esc(name)} ${esc(categoryName)} games"><span class="provider-logo provider-logo--${theme}"><img src="assets/providers/${file}" alt=""></span><span class="provider-name">${esc(name)}</span></button>`;
}
function renderCategorySection(section, providers, categoryName){
  if(section.type==='providers'){
    return `<section class="shelf"><div class="shelf-heading"><h2>${section.title}</h2></div><div class="recent-games provider-rail" aria-label="${esc(categoryName)} providers">${[0,1,2].map(copy=>providers.map(p=>providerTile(p,copy,categoryName)).join('')).join('')}</div></section>`;
  }
  if(section.type==='featured'){
    const game=findGame(section.name);
    const jackpot=`₱${section.jackpot.toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    return `<section class="shelf featured-slot-section" aria-labelledby="featured-slot-title"><div class="shelf-heading featured-slot-heading">${badgeMarkup(game,'Jackpot','featured-slot-heading-badge')}<h2 id="featured-slot-title">${esc(game.name)}</h2></div><div class="featured-slot">${art(game,['Min bet ₱1','Max win 10,000x'])}<div class="featured-slot-prize"><span class="sr-only">Jackpot amount: </span><strong class="featured-slot-jackpot-value">${jackpot}</strong></div><button type="button" class="featured-slot-action" data-game="${game.id}" aria-label="Play ${esc(game.name)}">Play Now</button></div></section>`;
  }
  if(section.type==='featuredGames'){
    return `<section class="shelf category-shelf"><div class="shelf-heading"><h2>${section.title}</h2></div><div class="slots-featured">${section.names.map(name=>card(findGame(name))).join('')}</div></section>`;
  }
  if(section.type==='featuredLive'){
    const game=findGame(section.name);
    const image=game.legacyName==='Bingo Party'?'bingo-carnaval.avif':'pula-puti.avif';
    return `<section class="shelf featured-game-section" aria-labelledby="featured-game-title"><div class="shelf-heading"><h2 id="featured-game-title">Featured Game</h2></div><button type="button" class="featured-game-banner" data-game="${game.id}" aria-label="View ${esc(game.name)}"><img src="assets/featured-games/${image}" alt="" loading="lazy" decoding="async"></button></section>`;
  }
  if(section.type==='liveTables'){
    const tables=$('#live-tables').innerHTML.replaceAll('id="wheel-','id="category-wheel-').replaceAll('url(#wheel-','url(#category-wheel-');
    return `<section class="shelf category-shelf"><div class="shelf-heading featured-live-heading"><span class="live-badge">LIVE</span><h2>${section.title}</h2></div><div class="live-grid">${tables}${extraHotTables.map(extraHotTable).join('')}</div></section>`;
  }
  return `<section class="shelf category-shelf"><div class="shelf-heading"><h2>${section.title}</h2></div><div class="recent-games category-rail" tabindex="0" aria-label="${section.title}">${section.names.map(name=>card(findGame(name))).join('')}${section.viewAllGroup?viewAllGroupTile(section.title):section.viewAll?viewAllTile(categoryName):''}</div></section>`;
}
const categoryConfigs={
 Slots:{
   title:'Slots',eyebrow:'EXPLORE SLOTS',headline:'Find your next<br>favorite slot.',
   word:'SPIN',
   providers:['JILI','PG Soft','Pragmatic Play','JDB','CQ9'],
   sections:[
     {title:'Progressive Jackpots',names:['Progressive Gold Preview','Progressive Fortune Preview','Progressive Reels Preview']},
     {title:'Featured',type:'featured',name:'Progressive Gold Preview',jackpot:12486750},
     {title:'Low Bet Favorites',names:['Fortune Gems','Mahjong Ways','Money Coming','Fortune Tiger','Sweet Bonanza']},
     {title:'High Max Win',names:['1000x Treasure','Gates of Olympus','Wild Bounty Showdown','Golden Empire','Super Ace Deluxe']},
     {title:'Bonus Feature Slots',names:['Super Ace','Gates of Olympus','Sweet Bonanza','Free Spins Preview','Bonus Reels Preview']},
     {title:'Top Providers',type:'providers'},
     {title:'Classic Slots',names:['Classic Sevens Preview','Fruit Reels Preview','Golden Bells Preview','Super Ace','Fortune Gems 2']}
   ]
 },
 Bingo:{
   eyebrow:'EXPLORE BINGO',headline:'Find your next<br>bingo room.',word:'BINGO',
   sections:[
     {type:'featuredLive',name:'Bingo Party'},
     {title:'Rising Rooms',names:['Mega Bingo','Bingo Rush','Bingo Stars','Bingo Express','Bingo Gold']},
     {title:'All-time Favorites',names:['Bingo Party','Lucky Bingo','Bingo Classic','Bingo Club','Bingo Bonanza']},
     {title:'Quick Rounds',names:['Bingo Express','Bingo Rush','Bingo Fiesta','Bingo Night','Bingo Stars']}
   ]
 },
 Perya:{
   eyebrow:'EXPLORE PERYA',headline:'Find your next<br>perya favorite.',word:'PLAY',
   sections:[
     {title:'Pula Puti',type:'featuredLive',name:'Pula Puti Preview'},
     {title:'Crowd Favorites',names:['Pinoy Drop Ball','Color Game','Lucky 9','Lucky Colors','Perya Wheel']},
     {title:'Classic Perya',names:['Perya Classic','Perya Dice','Triple Dice','Color Fiesta','Lucky Ball']},
     {title:'Quick Chance',names:['Coin Toss','Lucky Ball','Perya Lucky Pick','Lucky 9','Lucky Colors']}
   ]
 },
 'Live Casino':{
   eyebrow:'EXPLORE LIVE CASINO',headline:'Live tables.<br>Fresh results.',word:'LIVE',
   providers:['Evolution','Pragmatic Play Live','Playtech Live','Ezugi','Vivo Gaming'],
   sections:[
     {title:'Hot Tables',type:'liveTables'},
     {title:'Top Providers',type:'providers'},
     {title:'Game Shows',names:['Crazy Time','Monopoly Live','Dream Catcher Preview','Lightning Dice Preview','Mega Wheel Preview','Cash or Crash Preview','Deal or No Deal Preview'],viewAllGroup:true},
     {title:'Roulette',names:['Lightning Roulette','Auto Roulette Preview','Speed Roulette Preview','Roulette Royale Preview','European Roulette Preview','French Roulette Preview','Mega Roulette Preview'],viewAllGroup:true},
     {title:'Card Tables',names:['Super Baccarat','Dragon Tiger','Speed Blackjack','Speed Baccarat Preview','VIP Baccarat Preview',"Casino Hold'em Preview",'Three Card Poker Preview'],viewAllGroup:true}
   ]
 },
 'Card Games':{
   eyebrow:'EXPLORE CARD GAMES',headline:'Your next hand<br>starts here.',word:'CARDS',
   sections:[
     {title:'Featured Card Games',type:'featuredGames',names:['Tongits Plus','Pusoy Dos']},
     {title:'Classic Card Tables',names:['Tongits Plus','Tongits Classic','Tongits Quick','Tongits Stars']},
     {title:'Pusoy & Cards',names:['Pusoy Dos','Pusoy Classic','Pusoy Party','Card Club','Card Masters']},
     {title:'Quick Play',names:['Card Match','Lucky Cards','Classic Solitaire','Tongits Quick','Card Club']}
   ]
 },
 'Mini Games':{
   eyebrow:'EXPLORE MINI GAMES',headline:'Small games.<br>Big fun.',word:'FUN',
   sections:[
     {title:'Featured Mini Games',type:'featuredGames',names:['Lucky Spin','Coin Flip']},
     {title:'Chance Games',names:['Lucky Spin','Mini Wheel','Coin Flip','Dice Dash','Ball Drop']},
     {title:'Quick Play',names:['Number Pick','Coin Catch','Lucky Tiles','Mini Cards','Quick Match']},
     {title:'More Mini Games',names:['Puzzle Dash','Color Match','Quick Match','Lucky Tiles','Mini Cards']}
   ]
 }
};
function renderCategoryPage(selectedCategory){
 const config=categoryConfigs[selectedCategory];
 const heroArtwork={
  Slots:{src:'assets/hero-slots.avif',alt:'Fortune Horse, November 2026'},
  Bingo:{src:'assets/hero-bingo.avif',alt:'Mega Jackpot Winner: ₱188,971,055'},
  Perya:{src:'assets/hero-perya.avif',alt:'Pula Puti: a new BP host is arriving Sunday, September 25'},
  'Live Casino':{src:'assets/hero-livecasino.avif',alt:'Sabado Panalo weekly rebate. Check details.'},
  'Card Games':{src:'assets/hero-cardgames.avif',alt:'Tongits Go. Download now on Google Play or the App Store.'},
  'Mini Games':{src:'assets/hero-minigames.avif',alt:'Aviator: join the flight and win big.'}
 }[selectedCategory];
 const banner=heroArtwork
  ? `<div class="banner banner-art"><img src="${heroArtwork.src}" alt="${heroArtwork.alt}"></div>`
  : `<div class="banner"><span class="eyebrow">${config.eyebrow}</span><strong>${config.headline}</strong><div class="dots"><i class="selected"></i><i></i><i></i><i></i></div><span class="banner-word" aria-hidden="true">${config.word}</span></div>`;
 $('#category-page').innerHTML=`${banner}${config.sections.map(section=>renderCategorySection(section,config.providers,selectedCategory)).join('')}`;
 startProviderLoop();
}
// Facets are illustrative catalog metadata for the wireframe.
function facetValues(game,name){
  const valueAt=options=>options[game.id%options.length];
  if(name==='Bet Range')return [valueAt(categoryFacets[game.category]['Bet Range'])];
  if(name==='Volatility')return [valueAt(['Low','Medium','High'])];
  if(name==='Features'){
    const values=[];
    if(/Free Spins|Gates|Sweet/i.test(game.name))values.push('Free Spins');
    if(/1000x|Money|Super|Golden/i.test(game.name))values.push('Multipliers');
    if(/Bonus|Feature/i.test(game.name))values.push('Bonus Buy');
    if(/Progressive|Fortune/i.test(game.name))values.push('Jackpot');
    return values;
  }
  if(name==='Table Type')return [/Crazy Time|Monopoly Live/.test(game.name)?'Game Show':/Lightning/.test(game.name)?'Speed':'Standard'];
  if(name==='Language')return [valueAt(['English','Filipino'])];
  if(name==='Ball Type')return [valueAt(['75 Ball','90 Ball','30 Ball'])];
  if(name==='Players')return [valueAt(['2 Players','3 Players','4+ Players'])];
  if(name==='Game Mode')return [valueAt(['Classic','Quick','Tournament'])];
  if(name==='Game Type')return [/Puzzle|Match|Mines/.test(game.name)?'Skill':/Lucky|Coin|Dice|Plinko/.test(game.name)?'Chance':'Arcade'];
  return [];
}
function render(force=false){
  const q=$('#search').value.trim();
  const hasFacets=Object.keys(facetSelections).length>0;
  const defaultSubcategory=!subCategory||subCategory==='All';
  const categoryLanding=category!=='All'&&defaultSubcategory&&!sectionView&&!q&&provider==='All'&&theme==='All themes'&&!hasFacets&&!force;
  $('#category-page').hidden=!categoryLanding;
  stopProviderLoop();
  if(categoryLanding)renderCategoryPage(category);
  const searching=!!(q||category!=='All'||provider!=='All'||theme!=='All themes'||discovery||sectionView||hasFacets||force);
  $('#clear').hidden=!q;
  $('#filter-dot').hidden=provider==='All'&&theme==='All themes'&&!hasFacets;
  $('#lobby').hidden=searching;
  $('#results').hidden=!searching||categoryLanding;
  const orderedGames=category==='All'&&discovery==='Trending'?discoveryGroups.Trending.map(id=>games[id]):games;
  const sectionNames=sectionView?categoryConfigs[category]?.sections.find(section=>section.title===sectionView)?.names:null;
  const result=orderedGames.filter(game=>(category==='All'||game.category===category)
    &&(provider==='All'||game.provider===provider)
    &&(category!=='All'||theme==='All themes'||themeGames[theme].includes(game.id))
    &&(category!=='All'||!discovery||discoveryGroups[discovery].includes(game.id))
    &&(category==='All'||defaultSubcategory||subcategoryGames[category][subCategory].includes(game.legacyName))
    &&(!sectionNames||sectionNames.includes(game.legacyName))
    &&Object.entries(facetSelections).every(([name,value])=>facetValues(game,name).includes(value))
    &&`${game.name} ${game.provider} ${game.category}`.toLowerCase().includes(q.toLowerCase()));
  if(category==='All'&&discovery==='Popular')result.sort((a,b)=>badgeRanks.Popular[a.legacyName]-badgeRanks.Popular[b.legacyName]);
  $('#result-title').textContent=q?`Results for “${q}”`:category==='All'?(discovery?discoveryHeadings[discovery]:'All games'):(sectionView||(defaultSubcategory?category:subCategory));
  $('#result-count').textContent=`${result.length} game${result.length===1?'':'s'}`;
  $('#result-grid').innerHTML=result.map(game=>card(game,discovery||!defaultSubcategory||sectionView?'':undefined)).join('');
  $('.empty').hidden=result.length!==0;
  chips();
}
const viewAllTile=category=>{const label=category.endsWith('Games')?category:`${category} games`;return `<button class="game-card view-all-tile" data-view="${category}" aria-label="View all ${label}"><span class="game-art"><svg class="view-all-arrow icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5h11.8l-4-4 2.1-2.1L21 12l-8.1 7.6-2.1-2.1 4-4H3v-3Z"/></svg><span>View all</span></span></button>`};
const viewAllGroupTile=group=>`<button class="game-card view-all-tile" data-view-group="${esc(group)}" aria-label="View all ${esc(group)} games"><span class="game-art"><svg class="view-all-arrow icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5h11.8l-4-4 2.1-2.1L21 12l-8.1 7.6-2.1-2.1 4-4H3v-3Z"/></svg><span>View all</span></span></button>`;
const allShelfViewAll=category=>{const count=games.filter(g=>g.category===category).length;const label=category.endsWith('Games')?category:`${category} games`;return `<button type="button" class="all-shelf-view-all" data-view="${esc(category)}" aria-label="View all ${esc(label)}, ${count} total">View All (${count})</button>`};
$('#category-shelves').innerHTML=`<section class="shelf slots-shelf" aria-labelledby="slots-title"><div class="shelf-heading"><span class="section-icon" aria-hidden="true">${allSectionIcons.Slots}</span><h2 id="slots-title">Slots</h2>${allShelfViewAll('Slots')}</div><div class="slots-featured">${[0,1].map(id=>card(games[id])).join('')}</div><div class="recent-games slots-rail" tabindex="0" aria-label="More slot games">${[2,5,3,16,18].map(id=>card(games[id])).join('')}</div></section>`+['Bingo','Perya','Card Games','Mini Games'].map(category=>{const slug=category.toLowerCase().replaceAll(' ','-');return `<section class="shelf category-shelf" aria-labelledby="${slug}-title"><div class="shelf-heading"><span class="section-icon" aria-hidden="true">${allSectionIcons[category]}</span><h2 id="${slug}-title">${category}</h2>${allShelfViewAll(category)}</div><div class="recent-games category-rail" tabindex="0" aria-label="${category} games">${games.filter(g=>g.category===category).slice(0,12).map(g=>card(g)).join('')}</div></section>`;}).join('');
const livePreviews=[
  {id:12,tableNumber:'01',roadmap:['P','B','P','B','B','T','P','P','B','T','B','P','B','P','P','B','T','B']},
  {id:14,history:[2,2,1,5,1,10,1,2,5,1,2,10,1,5,2,1,1,5]},
  {id:25,tableNumber:'03',roadmap:['D','Tiger','D','Tiger','Tie','D','D','Tiger','Tiger','D','Tie','Tiger','D','D','Tiger','Tie','D','Tiger']},
  {id:27,history:[1,1,5,10,2,2,5,1,10,2,1,5,2,1,10,2,5,1]}
];
const wheelColors={14:{1:'#087f82',2:'#c45b12',5:'#bc397a',10:'#7440ae'},27:{1:'#68717d',2:'#278149',5:'#803640',10:'#286cb6'}};
function moneyWheel(table){
  const color=wheelColors[table.id][table.history[0]];
  const point=angle=>[100+90*Math.cos(angle*Math.PI/180),100+90*Math.sin(angle*Math.PI/180)];
  const boundaries=Array.from({length:8},(_,i)=>180+i*180/7);
  const wedge=i=>{const a=point(boundaries[i]),b=point(boundaries[i+1]);return `M100 100 L${a.join(' ')} A90 90 0 0 1 ${b.join(' ')} Z`;};
  const slices=Array.from({length:7},(_,i)=>`<path d="${wedge(i)}" fill="#e9edf2" stroke="#b6beca" stroke-width="1.5"/>`).join('');
  const id=`wheel-${table.id}`;
  return `<div class="money-wheel" aria-label="Wheel color matches newest result ${table.history[0]}"><svg viewBox="0 -12 200 117" aria-hidden="true"><defs><filter id="${id}-shadow" x="-60%" y="-30%" width="220%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#283442" flood-opacity=".35"/></filter><linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs><g opacity="0.35">${slices}</g><g transform="translate(0 -8)"><path d="${wedge(3)}" fill="${color}" stroke="none"/><path d="${wedge(3)}" fill="url(#${id}-shine)" stroke="none"/></g><path d="M95 -10 L105 -10 L100 -2 Z" fill="#515b69" stroke="none"/><path d="M87 100 A13 13 0 0 1 113 100 Z" fill="#c3cbd6" stroke="#aab4c1"/></svg></div>`;
}
$('#live-tables').innerHTML=livePreviews.map((table,index)=>{
  const game=games[table.id];
  const roadmapStyles={P:{label:'Player',letter:'P',color:'#286cb6'},B:{label:'Banker',letter:'B',color:'#bd3c47'},T:{label:'Tie',letter:'T',color:'#278149'},D:{label:'Dragon',letter:'D',color:'#bd3c47'},Tiger:{label:'Tiger',letter:'T',color:'#eac447'},Tie:{label:'Tie',letter:'T',color:'#278149'}};
  const detail=table.roadmap
    ?`<div class="game-roadmap" aria-label="Demo result roadmap, read down each column: ${table.roadmap.map(value=>roadmapStyles[value].label).join(', ')}">${table.roadmap.map(value=>{const result=roadmapStyles[value];return `<span class="roadmap-result" title="${result.label}" style="background:${result.color};color:${value==='Tiger'?'#493907':'#fff'}" aria-hidden="true">${result.letter}</span>`;}).join('')}</div>`
    :`<div class="result-history wheel-history" aria-label="Result history, newest first, read down each column: ${table.history.join(', ')}">${table.history.map((value,i)=>`<span class="result-ball" style="background:${wheelColors[table.id][value]};opacity:1" aria-hidden="true">${value}</span>`).join('')}</div>`;
  const badge=defaultBadge(game);
  return `<button class="live-table ${table.history?'wheel-table':''}" data-game="${table.id}" aria-label="View ${esc(game.name)}${badge?`, ${badge}`:''}"><div class="live-table-art"><div class="live-preview-area">${liveTablePreview(game.legacyName,table.tableNumber)}</div>${detail}</div>${liveTableCaption(game)}</button>`;
}).join('');
let searchActive=false;
let filterActive=false;
const suggestionProviders=[...new Set(games.map(g=>g.provider))];
const trendingSuggestionIcon='<svg class="suggestion-arrow icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18.4 8.8 11.6l3.7 3.7 6.1-6.1V12H22V3h-9v3.4h3.2l-3.7 3.7-3.7-3.7L0 16.4l2 2Z"/></svg>';
function renderSuggestions(){
  const q=$('#search').value.trim().toLowerCase();
  const groups=q?[['Game titles',games.map(g=>g.name)],['Providers',suggestionProviders],['Categories',categories.filter(c=>c!=='All')]]:[['Trending searches',discoveryGroups.Trending.slice(0,6).map(id=>games[id].name)]];
  let total=0;
  $('#search-suggestions').innerHTML=groups.map(([label,values])=>{
    const matches=q?values.filter(value=>value.toLowerCase().includes(q)):values.slice(0,label==='Game titles'?6:values.length);
    total+=matches.length;
    return `<section class="suggestion-group" aria-label="${label}"><h2>${label}</h2>${matches.length?matches.map(value=>`<button class="suggestion-item" data-suggestion="${esc(value)}"><span>${esc(value)}</span>${label==='Trending searches'?trendingSuggestionIcon:'<svg class="suggestion-arrow icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17.1 15.1 7H8V4h12v12h-3V8.9L6.9 19 5 17.1Z"/></svg>'}</button>`).join(''):'<p class="suggestion-none">No matches</p>'}</section>`;
  }).join('')+`<span class="sr-only" role="status">${total} suggestions</span>`;
  $('#clear').hidden=true;
}
function setSearchActive(active){
  if(active&&filterActive)setFilterActive(false);
  searchActive=active;
  $('.phone').classList.toggle('search-active',active);
  $('#search-suggestions').hidden=!active;
  $('#filter-toggle').setAttribute('aria-label',active?'Cancel search':'Filter games');
  $('#filters').hidden=true;
  $('#filter-toggle').setAttribute('aria-expanded','false');
  if(active){renderSuggestions();window.scrollTo({top:0});}
}
function closeSearch(clear=false){
  if(clear)$('#search').value='';
  $('#search').blur();setSearchActive(false);render();
}
function setFilterActive(active){
  filterActive=active;
  $('.phone').classList.toggle('filter-active',active);
  $('#filters').hidden=!active;
  $('#filter-toggle').setAttribute('aria-expanded',String(active));
  $('#filter-toggle').setAttribute('aria-label',active?'Close filters':'Filter games');
  if(active){
    $('#filters').scrollTop=0;
    window.scrollTo({top:0});
  }
}
$('#search').addEventListener('focus',()=>setSearchActive(true));
$('#search').addEventListener('input',()=>{if(!searchActive)setSearchActive(true);renderSuggestions();});
function resetBrowse(){category='All';provider='All';theme='All themes';discovery='';subCategory='All';sectionView='';facetSelections={}}
$('#search-form').addEventListener('submit',e=>{e.preventDefault();resetBrowse();closeSearch();render(true);});
$('#search').addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch(true);$('#filter-toggle').focus();}});
$('#search-suggestions').addEventListener('click',e=>{const item=e.target.closest('[data-suggestion]');if(!item)return;resetBrowse();$('#search').value=item.dataset.suggestion;closeSearch();});
$('#clear').onclick=()=>{$('#search').value='';$('#search').focus();renderSuggestions();};
$('#search-back').onclick=()=>{resetBrowse();closeSearch(true);window.scrollTo({top:0});};
$('#filter-toggle').onclick=()=>{if(searchActive){closeSearch(true);return;}setFilterActive(!filterActive);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&filterActive){setFilterActive(false);$('#filter-toggle').focus();}});
$('#reset-filters').onclick=()=>{provider='All';theme='All themes';facetSelections={};render()};
$('#empty-reset').onclick=()=>{resetBrowse();$('#search').value='';render(true)};
const pillAnimations=new WeakMap();
function switchPill(selectors,update){
  const positions=selectors.map(selector=>{
    const row=$(selector),indicator=row.querySelector(':scope > .pill-indicator');
    const from=indicator&&!indicator.hidden?indicator.getBoundingClientRect():null;
    pillAnimations.get(row)?.();
    row.classList.remove('pill-moving');
    return {row,from};
  });
  update();
  window.scrollTo({top:0});
  for(const {row,from} of positions){
    const indicator=row.querySelector(':scope > .pill-indicator');
    const active=row.querySelector(':scope > button.active');
    if(!indicator||!active||indicator.hidden)continue;
    const to=indicator.getBoundingClientRect();
    const dx=from?from.left-to.left:0,dy=from?from.top-to.top:0;
    if(from&&Math.abs(dx)<1&&Math.abs(dy)<1&&Math.abs(from.width-to.width)<1)continue;
    indicator.innerHTML=active.innerHTML;
    indicator.dataset.discovery=active.dataset.discovery||'';
    row.classList.add('pill-moving');
    const direction=Math.sign(-dx)||1;
    indicator.style.setProperty('--pill-from-x',`${dx}px`);
    indicator.style.setProperty('--pill-from-y',`${dy}px`);
    indicator.style.setProperty('--pill-over-x',`${direction*8}px`);
    indicator.style.setProperty('--pill-from-width',`${from?.width||to.width}px`);
    indicator.style.setProperty('--pill-over-width',`${to.width+3}px`);
    indicator.classList.toggle('pill-slide',!!from);
    indicator.classList.toggle('pill-appear',!from);
    let finished=false;
    let fallback;
    const finish=()=>{
      if(finished)return;
      finished=true;
      clearTimeout(fallback);
      indicator.removeEventListener('animationend',finish);
      indicator.classList.remove('pill-slide','pill-appear');
      indicator.innerHTML='';
      row.classList.remove('pill-moving');
      pillAnimations.delete(row);
    };
    indicator.addEventListener('animationend',finish);
    pillAnimations.set(row,finish);
    fallback=setTimeout(finish,550);
  }
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-theme]'),d=e.target.closest('[data-discovery]'),s=e.target.closest('[data-subcategory]'),c=e.target.closest('[data-category]'),p=e.target.closest('[data-provider]'),f=e.target.closest('[data-facet]'),v=e.target.closest('[data-view]'),vg=e.target.closest('[data-view-group]'),g=e.target.closest('[data-game]');
  if(t){theme=t.dataset.theme;render()}
  if(d)switchPill(['#discovery-filters'],()=>{discovery=discovery===d.dataset.discovery?'':d.dataset.discovery;render()});
  if(s&&!(s.dataset.subcategory==='All'&&subCategory==='All'))switchPill(['#discovery-filters'],()=>{subCategory=subCategory===s.dataset.subcategory?'All':s.dataset.subcategory;sectionView='';render()});
  if(c)switchPill(['#categories','#discovery-filters'],()=>{category=c.dataset.category;subCategory='All';sectionView='';discovery='';provider='All';theme='All themes';facetSelections={};$('#discovery-filters').scrollLeft=0;render()});
  if(p){provider=p.dataset.provider;render()}
  if(f){const name=f.dataset.facet,value=f.dataset.value;facetSelections[name]===value?delete facetSelections[name]:facetSelections[name]=value;render()}
  if(v){category=v.dataset.view;subCategory='All';sectionView='';discovery='';provider='All';theme='All themes';facetSelections={};$('#discovery-filters').scrollLeft=0;render();window.scrollTo({top:0,behavior:'smooth'})}
  if(vg){sectionView=vg.dataset.viewGroup;subCategory=categorySubcategories[category]?.includes(sectionView)?sectionView:'All';render(true);window.scrollTo({top:0,behavior:'smooth'})}
  if(g){const game=games[Number(g.dataset.game)];$('#game-detail').innerHTML=`${art(game,discovery||(subCategory&&subCategory!=='All')||sectionView?'':undefined)}<div class="dialog-title-row">${titleBadges(game,defaultBadge(game))}<h2>${esc(game.name)}</h2></div><span>${esc(game.provider)} · ${esc(game.category)}</span>`;$('#game-dialog').showModal()}
});
$('#close-dialog').onclick=()=>$('#game-dialog').close();
$('#game-dialog').addEventListener('click',e=>{if(e.target===$('#game-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
render();


// Pointer drags emulate mobile swipes in the desktop preview. Native touch remains native.
let drag=null,suppressClick=false;
document.addEventListener('pointerdown',e=>{
  if(e.pointerType==='touch'||e.button!==0||e.target.closest('input,textarea,dialog'))return;
  suppressClick=false;
  const row=e.target.closest('#categories,#discovery-filters,.recent-games');
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,page:window.scrollY,row,left:row?.scrollLeft||0,axis:null};
});
window.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.axis){
    if(Math.max(Math.abs(dx),Math.abs(dy))<=5)return;
    drag.axis=Math.abs(dx)>Math.abs(dy)&&drag.row?'x':'y';
    document.documentElement.setPointerCapture(e.pointerId);
    document.documentElement.classList.add('page-dragging');
    if(drag.axis==='x')drag.row.style.scrollSnapType='none';
  }
  e.preventDefault();
  if(drag.axis==='x')drag.row.scrollLeft=drag.left-dx;else window.scrollTo(0,drag.page-dy);
});
function finishDrag(e){
  if(!drag||e.pointerId!==drag.id)return;
  suppressClick=!!drag.axis;
  if(drag.row){drag.row.style.scrollSnapType='';}
  drag=null;document.documentElement.classList.remove('page-dragging');
  if(document.documentElement.hasPointerCapture(e.pointerId))document.documentElement.releasePointerCapture(e.pointerId);
}
window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
document.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;}},true);
let recentStorage;try{recentStorage=window.localStorage;}catch{}
// Display-only demo recent activity; never stored as actual play history.
const demoRecentIds=[0,20,9,12,6,1,21,13,10,7];
function renderRecentGames(history){
  const ids=[...history.map(entry=>entry.id),...demoRecentIds].filter((id,index,all)=>all.indexOf(id)===index).slice(0,10);
  $('#recent-games').innerHTML=ids.map(id=>card(games.find(g=>g.id===id))).join('');
  $('#recent-games').hidden=false;
  $('#recent-empty').hidden=true;
}
window.gameSession=createRecentGames({storage:recentStorage,validId:id=>games.some(g=>g.id===id),onChange:renderRecentGames});
renderRecentGames(window.gameSession.list());
setInterval(()=>window.gameSession.checkpoint(),1000);
window.addEventListener('pagehide',()=>window.gameSession.leave());

let navNoticeTimer;
document.querySelector('.bottom-nav').addEventListener('click',e=>{
  const button=e.target.closest('[data-bottom-nav]');if(!button)return;
  clearTimeout(navNoticeTimer);
  for(const item of document.querySelectorAll('.bottom-nav [data-bottom-nav]')){
    const selected=item.dataset.bottomNav==='Games';
    item.classList.toggle('selected',selected);
    item.setAttribute('aria-pressed',String(selected));
  }
  if(button.dataset.bottomNav==='Games'){
    $('#nav-notice').hidden=true;resetBrowse();closeSearch(true);window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }else{
    $('#nav-notice').textContent=`${button.dataset.bottomNav} is not connected in this prototype yet.`;
    $('#nav-notice').hidden=false;navNoticeTimer=setTimeout(()=>$('#nav-notice').hidden=true,3000);
  }
});
