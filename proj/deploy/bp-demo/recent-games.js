// Session lifecycle adapter. Call enter only when the actual game is entered,
// for either play or spectating, and leave when the game is exited.
(function(root){
  function createRecentGames({storage,now=()=>Date.now(),validId=()=>true,onChange=()=>{},key='game-search.recent.v1'}={}){
    let history=[];
    try{const saved=JSON.parse(storage?.getItem(key)||'[]');if(Array.isArray(saved))history=saved.filter(x=>x&&validId(x.id)&&Number.isFinite(x.lastPlayed)).sort((a,b)=>b.lastPlayed-a.lastPlayed).filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i).slice(0,10);}catch{}
    let session=null;
    function list(){return history.map(x=>({...x}));}
    function checkpoint(){
      if(!session||now()-session.started<=300000)return;
      history=[{id:session.id,lastPlayed:now()},...history.filter(x=>x.id!==session.id)].slice(0,10);
      try{storage?.setItem(key,JSON.stringify(history));}catch{}
      onChange(list());
    }
    function leave(){checkpoint();session=null;}
    function enter(id){if(!validId(id))return false;if(session?.id===id)return true;leave();session={id,started:now()};return true;}
    return {enter,leave,checkpoint,list};
  }
  if(typeof module!=='undefined')module.exports={createRecentGames};else root.createRecentGames=createRecentGames;
})(typeof window!=='undefined'?window:globalThis);
