// ==UserScript==
// @name         Neopets: Dailies OS (JT$ v7.1 Clean UI, Edit Mode, Collapse, Import/Export, Theme)
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Clean floating Dailies dashboard with Edit Mode toggle (shows edit/delete & add/import/export only when enabled), collapsible groups, add groups/dailies, animated progress with tracking, NST rollover, theme (dark/light, accent, blur). Fully persistent. No placeholders.
// @match        *://*.neopets.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const BASE_DAILIES = [
    {"name":"Advent Calendar","url":"https://www.neopets.com/winter/adventcalendar.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/fur_mistletoe_wreath.gif"},
    {"name":"Anchor Management","url":"https://www.neopets.com/pirates/anchormanagement.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/fur_pirate_anchor.gif"},
    {"name":"Apple Bobbing","url":"https://www.neopets.com/halloween/applebobbing.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/spf_slimy_apple.gif"},
    {"name":"Bank Interest","url":"https://www.neopets.com/bank.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/ltoo_scorch_bank.gif"},
    {"name":"Coltzan's Shrine","url":"https://www.neopets.com/desert/shrine.phtml","category":"Freebies","cooldown":"13h","notes":"Every 13h","iconUrl":"https://images.neopets.com/items/bd_desert_deathmask.gif"},
    {"name":"Council Chamber","url":"https://www.neopets.com/altador/council.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/toy_kingaltador_figure.gif"},
    {"name":"Fruit Machine","url":"https://www.neopets.com/desert/fruitmachine.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/food_desert3.gif"},
    {"name":"Giant Jelly","url":"https://www.neopets.com/jelly/jelly.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/jel_cornupepper_whole.gif"},
    {"name":"Giant Omelette","url":"https://www.neopets.com/prehistoric/omelette.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/om_sausage_pepperoni1.gif"},
    {"name":"Grave Danger","url":"https://www.neopets.com/halloween/gravedanger/","category":"Freebies","cooldown":"7h","notes":"Every ~7h","iconUrl":"https://images.neopets.com/items/boo_zombiehandbook.gif"},
    {"name":"Grumpy Old King","url":"https://www.neopets.com/medieval/grumpyking.phtml","category":"Freebies","cooldown":"twice-daily","notes":"Twice a day","iconUrl":"https://images.neopets.com/items/toy_plushie_skarl.gif"},
    {"name":"Healing Springs","url":"https://www.neopets.com/faerieland/springs.phtml","category":"Freebies","cooldown":"30m","notes":"Every 30m","iconUrl":"https://images.neopets.com/items/mag_healing_striped.gif"},
    {"name":"Money Tree","url":"https://www.neopets.com/donations.phtml","category":"Freebies","cooldown":"10/day","notes":"10 per day","iconUrl":"https://images.neopets.com/items/mini_moneytree.gif"},
    {"name":"Tombola","url":"https://www.neopets.com/island/tombola.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/toy_squeezy_tombola.gif"},
    {"name":"Trudy's Surprise","url":"https://www.neopets.com/trudys_surprise.phtml","category":"Freebies","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/boo_defender_mynci.gif"},
    {"name":"Desert Kiosk","url":"https://www.neopets.com/desert/sc/kiosk.phtml","category":"Scratchcards","cooldown":"4h","notes":"Every 4h","iconUrl":"https://images.neopets.com/items/scr_coltzans_cash.gif"},
    {"name":"Haunted Kiosk","url":"https://www.neopets.com/halloween/scratch.phtml","category":"Scratchcards","cooldown":"2h","notes":"Every 2h","iconUrl":"https://images.neopets.com/items/bd_sssidney_tickets.gif"},
    {"name":"Ice Caves Kiosk","url":"https://www.neopets.com/winter/kiosk.phtml","category":"Scratchcards","cooldown":"6h","notes":"Every 6h","iconUrl":"https://images.neopets.com/items/toy_kiosk_plushie.gif"},
    {"name":"Food Club","url":"https://www.neopets.com/pirates/foodclub.phtml?type=bet","category":"NP Investing","cooldown":"daily","notes":"Bets close 2pm","iconUrl":"https://images.neopets.com/games/pages/trophies/88_1.png"},
    {"name":"Stock Market","url":"https://www.neopets.com/stockmarket.phtml?type=portfolio","category":"NP Investing","cooldown":"anytime","notes":"Anytime","iconUrl":"https://images.neopets.com/games/game_stocks.gif"},
    {"name":"Faerie Caverns","url":"https://www.neopets.com/faerieland/caverns/index.phtml","category":"NP Investing","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/bg_faerie_caverns.gif"},
    {"name":"Illusen's Glade","url":"https://www.neopets.com/medieval/earthfaerie.phtml","category":"Quests","cooldown":"12h","notes":"Every 12h","iconUrl":"https://images.neopets.com/items/toy_faerie_illusen.gif"},
    {"name":"Jhudora's Bluff","url":"https://www.neopets.com/faerieland/darkfaerie.phtml","category":"Quests","cooldown":"12h","notes":"Every 12h","iconUrl":"https://images.neopets.com/items/toy_faerie_jhudora.gif"},
    {"name":"Kitchen Quests","url":"https://www.neopets.com/island/kitchen.phtml","category":"Quests","cooldown":"10/day","notes":"10 per day","iconUrl":"https://images.neopets.com/items/toy_kitchenquest_flotsam.gif"},
    {"name":"The Coincidence","url":"https://www.neopets.com/space/coincidence.phtml","category":"Quests","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/rpp_reu2014_robotassispetpet.gif"},
    {"name":"Lab Ray","url":"https://www.neopets.com/lab.phtml","category":"Pet Improvement","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/labmap_09.gif"},
    {"name":"Petpet Lab Ray","url":"https://www.neopets.com/petpetlab.phtml","category":"Pet Improvement","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/petpetlab_soot.gif"},
    {"name":"Battledome","url":"https://www.neopets.com/dome/","category":"Pet Improvement","cooldown":"anytime","notes":"15 items/day","iconUrl":"https://images.neopets.com/items/bd_spirit_blade.gif"},
    {"name":"Wheel of Excitement","url":"https://www.neopets.com/faerieland/wheel.phtml","category":"Wheels","cooldown":"2h","notes":"Every 2h","iconUrl":"https://images.neopets.com/items/toy_faerie_light.gif"},
    {"name":"Wheel of Knowledge","url":"https://www.neopets.com/medieval/knowledge.phtml","category":"Wheels","cooldown":"daily","notes":"Once a day","iconUrl":"https://images.neopets.com/items/toy_bv_wheelofknowledge.gif"},
    {"name":"Wheel of Mediocrity","url":"https://www.neopets.com/prehistoric/mediocrity.phtml","category":"Wheels","cooldown":"40m","notes":"Every 40m","iconUrl":"https://images.neopets.com/items/toy_action_plesio.gif"},
    {"name":"Wheel of Misfortune","url":"https://www.neopets.com/halloween/wheel/index.phtml","category":"Wheels","cooldown":"2h","notes":"Every 2h","iconUrl":"https://images.neopets.com/items/gar_wheelmisfortune.gif"}
  ];

  const CONFIG = {
    KEY_DATA: 'jt_dailies_os_data_v71',
    KEY_LAST_NST: 'jt_dailies_os_last_nst',
    NST_OFFSET: -8 * 60 * 60 * 1000
  };

  GM_addStyle(`
:root{--bg:#ffffff;--fg:#0f172a;--muted:#475569;--card:#f8fafc;--accent:#3b82f6;--accent-2:#22c55e;--shadow:rgba(2,6,23,.15);--blur:10px}
.tmn-dark{--bg:#0b1020;--fg:#e5e7eb;--muted:#9aa3b2;--card:#11172b;--accent:#60a5fa;--accent-2:#34d399;--shadow:rgba(0,0,0,.35)}
#tmn-dailies-container{position:fixed;top:20px;right:20px;width:300px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--fg);z-index:9999}
.tmn-panel{background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.45));backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid rgba(148,163,184,.35);border-radius:14px;box-shadow:0 10px 25px var(--shadow);overflow:hidden}
.tmn-dark .tmn-panel{background:linear-gradient(180deg,rgba(17,23,43,.55),rgba(17,23,43,.35))}
.tmn-drag-handle{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;font-weight:800;font-size:12px}
.tmn-actions{display:flex;gap:6px}
.tmn-btn{border:0;background:var(--card);color:var(--fg);padding:6px 8px;border-radius:8px;font-size:11px;cursor:pointer;transition:transform .1s cubic-bezier(.22,1.61,.36,1)}
.tmn-btn:active{transform:scale(.96)}
.tmn-progress{position:relative;height:12px;margin:0 12px 10px;border-radius:999px;background:rgba(148,163,184,.25);overflow:hidden;animation:tmn-breathe 3s ease-in-out infinite}
.tmn-progress>span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent));background-size:200% 100%;animation:tmn-shimmer 2.2s linear infinite;transition:width .5s cubic-bezier(.22,1.61,.36,1)}
.tmn-progress-label{position:absolute;top:50%;left:0;transform:translate(-50%,-50%);font-size:11px;font-weight:800;transition:transform .3s cubic-bezier(.22,1.61,.36,1)}
.tmn-progress-celebrate>span{animation:tmn-shimmer 1.2s linear infinite,tmn-glow 1s ease-in-out 2}
.tmn-groups{padding:6px 0}
.tmn-category-module{margin:8px 12px;background:var(--card);border:1px solid rgba(148,163,184,.25);border-radius:12px;transition:box-shadow .2s ease}
.tmn-category-module:hover{box-shadow:0 8px 18px var(--shadow)}
.tmn-dailies-header{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:8px 10px;font-weight:700;font-size:12px}
.tmn-left{display:flex;align-items:center;gap:8px}
.tmn-chevron{cursor:pointer;user-select:none;font-weight:900}
.tmn-group-name[contenteditable="true"]{outline:none;border-bottom:1px dashed transparent}
.tmn-group-name[contenteditable="true"]:focus{border-bottom:1px dashed var(--accent)}
.tmn-group-controls{display:flex;gap:6px}
.tmn-group-controls[hidden]{display:none!important}
.tmn-dailies-content{padding:6px 10px 10px;overflow:hidden;max-height:0;opacity:0;transition:max-height .28s ease,opacity .28s ease}
.tmn-category-module.tmn-open .tmn-dailies-content{max-height:1000px;opacity:1}
.tmn-dailies-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 8px}
.tmn-daily-item{position:relative;text-align:center;font-size:10px;user-select:none}
.tmn-daily-link{display:block;position:relative;overflow:hidden;border-radius:10px;padding:6px 0;transition:transform .12s cubic-bezier(.22,1.61,.36,1)}
.tmn-daily-link:hover{transform:translateY(-1px)}
.tmn-ripple{position:absolute;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%) scale(0);opacity:.3;background:currentColor;animation:tmn-ripple .55s ease}
.tmn-daily-icon{width:48px;height:48px;object-fit:contain;display:block;margin:0 auto;transition:filter .25s ease,opacity .25s ease}
.tmn-daily-name{font-weight:800;display:block;margin-top:2px}
.tmn-daily-status{color:var(--muted);font-size:9px;display:block;height:18px;line-height:10px}
.tmn-daily-item--done .tmn-daily-icon{filter:grayscale(1);opacity:.6}
.tmn-daily-item--done .tmn-daily-name{opacity:.8}
.tmn-reset{color:var(--accent);cursor:pointer;text-decoration:underline}
.tmn-item-controls{position:absolute;top:2px;right:2px;display:flex;gap:4px}
.tmn-item-controls[hidden]{display:none!important}
.tmn-editbar{position:fixed;bottom:12px;right:20px;display:flex;gap:6px;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:6px 8px;border-radius:10px;z-index:10000}
.tmn-editbar .tmn-btn{background:rgba(255,255,255,.15);color:#fff}
.tmn-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10001}
.tmn-modal-card{background:var(--bg);color:var(--fg);min-width:340px;max-width:90vw;border-radius:12px;box-shadow:0 10px 25px var(--shadow);padding:14px;display:flex;flex-direction:column;gap:8px}
.tmn-row{display:flex;gap:8px}
.tmn-input{padding:8px;border:1px solid #cbd5e1;border-radius:8px;background:var(--card);color:var(--fg);width:100%;font-size:12px}
.tmn-modal .btns{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}
.tmn-modal .btns button{border:0;border-radius:8px;padding:6px 10px;cursor:pointer}
.tmn-save{background:var(--accent);color:#fff}
.tmn-cancel{background:#94a3b8;color:#fff}
@keyframes tmn-shimmer{0%{background-position:0% 0}100%{background-position:200% 0}}
@keyframes tmn-breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.05)}}
@keyframes tmn-glow{0%{filter:brightness(1)}50%{filter:brightness(1.6) drop-shadow(0 0 6px var(--accent-2))}100%{filter:brightness(1)}}
@keyframes tmn-ripple{to{transform:translate(-50%,-50%) scale(10);opacity:0}}
.confetti-piece{position:absolute;width:6px;height:6px;border-radius:2px;background:var(--accent);opacity:0;animation:confetti-fall 1.1s ease forwards}
@keyframes confetti-fall{0%{transform:translateY(-8px) rotate(0);opacity:1}100%{transform:translateY(60px) rotate(360deg);opacity:0}}
  `);

  const App = {
    data: { theme:{mode:'light',accent:'#3b82f6',blur:10}, groups:[], state:{} },
    editMode: false,
    els: {},

    nstNow(){ return new Date(Date.now() + CONFIG.NST_OFFSET); },
    fmt(ms){ if(ms<=0) return '00:00:00'; const s=Math.floor(ms/1000),h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor((s%3600)/60)).padStart(2,'0'),sec=String(s%60).padStart(2,'0'); return `${h}:${m}:${sec}`; },
    clone(o){ return JSON.parse(JSON.stringify(o)); },

    parseCooldown(v){
      if(!v) return {type:'manual'};
      const pd = v.match(/(\d+)\/day/); if(pd) return {type:'count',limit:parseInt(pd[1],10)};
      if(['daily','monthly'].includes(v)) return {type:'reset'};
      if(v==='twice-daily') return {type:'count',limit:2};
      if(['anytime','random','window'].includes(v)) return {type:'manual'};
      const m=v.match(/^(\d+)([hmd])$/);
      if(m){const n=parseInt(m[1],10),u=m[2]; if(u==='m') return {type:'timer',duration:n*60*1000}; if(u==='h') return {type:'timer',duration:n*3600*1000}; if(u==='d') return {type:'timer',duration:n*24*3600*1000};}
      if(v==='7h7m') return {type:'timer',duration:(7*3600+7*60)*1000};
      return {type:'manual'};
    },

    status(d, st, now){
      const cd = App.parseCooldown(d.cooldown);
      let isDone=false, text=d.notes||'';
      if(cd.type==='reset' || cd.type==='manual'){ isDone=(st.completed||0)>0; if(isDone) text='Done <span class="tmn-reset">[Reset]</span>'; }
      else if(cd.type==='count'){ isDone=(st.completed||0)>=cd.limit; text=isDone?'Done <span class="tmn-reset">[Reset]</span>':(st.completed?`${st.completed}/${cd.limit} Done`:`${cd.limit} per day`); }
      else if(cd.type==='timer'){ const next=(st.lastCompleted||0)+cd.duration; isDone=now<next; if(isDone) text=`<b>${App.fmt(next-now)}</b>`; }
      return {isDone,text};
    },

    storage: {
      load(){
        try{
          const raw = GM_getValue(CONFIG.KEY_DATA, null);
          if(raw){ App.data = JSON.parse(raw); }
          else { App.bootstrapFromBase(); App.storage.save(); }
        }catch(e){ App.bootstrapFromBase(); App.storage.save(); }
      },
      save(){ GM_setValue(CONFIG.KEY_DATA, JSON.stringify(App.data)); }
    },

    bootstrapFromBase(){
      const map={};
      for(const d of BASE_DAILIES){
        const include = (d.name!=='Advent Calendar') || (App.nstNow().getUTCMonth()===11);
        if(!include) continue;
        (map[d.category] ||= []).push(App.clone(d));
      }
      App.data.groups = Object.keys(map).map(k=>({name:k, items:map[k]}));
      App.data.state = {};
      App.data.theme = {mode:'light',accent:'#3b82f6',blur:10};
    },

    rolloverIfNeeded(){
      const last = GM_getValue(CONFIG.KEY_LAST_NST,'');
      const cur = App.nstNow().toISOString().slice(0,10);
      if(last!==cur){
        let changed=false;
        for(const g of App.data.groups){
          for(const it of g.items){
            const st = App.data.state[it.name] || {completed:0,lastCompleted:null};
            const t = App.parseCooldown(it.cooldown).type;
            if((t==='reset'||t==='count') && (st.completed||0)>0){ st.completed=0; App.data.state[it.name]=st; changed=true; }
          }
        }
        if(changed) App.storage.save();
        GM_setValue(CONFIG.KEY_LAST_NST, cur);
      }
    },

    computeProgress(){
      let total=0, done=0; const now=Date.now();
      for(const g of App.data.groups){
        for(const it of g.items){
          total++;
          const st = App.data.state[it.name] || {completed:0,lastCompleted:null};
          if(App.status(it, st, now).isDone) done++;
        }
      }
      const percent = total? Math.round((done/total)*100) : 0;
      return {done,total,percent};
    },

    inject(){
      const root=document.createElement('div');
      root.id='tmn-dailies-container';
      if(App.data.theme.mode==='dark') root.classList.add('tmn-dark');
      root.innerHTML=`
        <div class="tmn-panel">
          <div class="tmn-drag-handle">
            <span class="tmn-title">Dailies OS</span>
            <div class="tmn-actions">
              <button class="tmn-btn tmn-theme">Theme</button>
              <button class="tmn-btn tmn-edit-toggle">Edit Mode</button>
            </div>
          </div>
          <div class="tmn-progress"><span></span><span class="tmn-progress-label">0%</span></div>
          <div class="tmn-groups"></div>
        </div>
      `;
      const prev=document.querySelector('#tmn-dailies-container'); if(prev) prev.remove();
      document.body.appendChild(root);
      App.els.root=root;
      App.els.progressFill = root.querySelector('.tmn-progress>span');
      App.els.progressLabel = root.querySelector('.tmn-progress-label');
      App.els.progressWrap = root.querySelector('.tmn-progress');
      App.els.groups = root.querySelector('.tmn-groups');

      App.applyTheme();
      App.renderGroups();
      App.attachTopEvents();
      App.updateAll();
      setInterval(App.updateAll, 1000);
    },

    applyTheme(){
      const t = App.data.theme;
      const html = document.documentElement;
      html.classList.toggle('tmn-dark', t.mode==='dark');
      html.style.setProperty('--accent', t.accent);
      html.style.setProperty('--blur', t.blur+'px');
    },

    renderGroups(){
      App.els.groups.innerHTML='';
      for(const g of App.data.groups){
        const mod=document.createElement('div');
        mod.className='tmn-category-module tmn-open';
        mod.dataset.group=g.name;
        mod.innerHTML=`
          <div class="tmn-dailies-header">
            <div class="tmn-left">
              <span class="tmn-chevron">▾</span>
              <span class="tmn-group-name" contenteditable="${App.editMode?'true':'false'}">${g.name}</span>
            </div>
            <div class="tmn-group-controls" ${App.editMode?'':'hidden'}>
              <button class="tmn-btn tmn-add-daily" title="Add Daily">＋</button>
              <button class="tmn-btn tmn-del-group" title="Delete Group">🗑</button>
            </div>
          </div>
          <div class="tmn-dailies-content">
            <div class="tmn-dailies-grid"></div>
          </div>
        `;
        const grid=mod.querySelector('.tmn-dailies-grid');
        for(const it of g.items){
          const item=document.createElement('div');
          item.className='tmn-daily-item';
          item.dataset.name=it.name;
          item.innerHTML=`
            <a class="tmn-daily-link" href="${it.url}">
              <img class="tmn-daily-icon" src="${it.iconUrl}">
              <span class="tmn-daily-name">${it.name}</span>
            </a>
            <span class="tmn-daily-status">${it.notes||''}</span>
            <div class="tmn-item-controls" ${App.editMode?'':'hidden'}>
              <button class="tmn-btn tmn-edit" title="Edit">✏️</button>
              <button class="tmn-btn tmn-del" title="Delete">🗑</button>
            </div>
          `;
          grid.appendChild(item);
        }
        App.els.groups.appendChild(mod);
      }
      App.attachGroupEvents();
      if(App.editMode) App.showEditBar(); else App.hideEditBar();
    },

    attachTopEvents(){
      App.els.root.querySelector('.tmn-theme').onclick = () => App.openThemeModal();
      App.els.root.querySelector('.tmn-edit-toggle').onclick = () => { App.editMode=!App.editMode; App.renderGroups(); };
    },

    attachGroupEvents(){
      App.els.groups.querySelectorAll('.tmn-chevron').forEach(ch=>{
        ch.onclick = () => {
          const mod = ch.closest('.tmn-category-module');
          const open = mod.classList.toggle('tmn-open');
          ch.textContent = open ? '▾' : '▸';
        };
      });

      App.els.groups.querySelectorAll('.tmn-group-name').forEach(gn=>{
        gn.addEventListener('blur', ()=>{
          if(!App.editMode) return;
          const mod=gn.closest('.tmn-category-module');
          const old=mod.dataset.group;
          const nv=gn.textContent.trim() || old;
          if(nv!==old){
            const g=App.data.groups.find(x=>x.name===old);
            if(g){ g.name=nv; g.items.forEach(it=>it.category=nv); mod.dataset.group=nv; App.storage.save(); }
          }
        });
      });

      App.els.groups.addEventListener('click',(e)=>{
        const addDaily=e.target.closest('.tmn-add-daily');
        const delGroup=e.target.closest('.tmn-del-group');
        const edit=e.target.closest('.tmn-edit');
        const del=e.target.closest('.tmn-del');
        const link=e.target.closest('.tmn-daily-link');
        const reset=e.target.closest('.tmn-reset');

        if(addDaily){
          const groupName = addDaily.closest('.tmn-category-module').dataset.group;
          App.openDailyModal(groupName);
          return;
        }
        if(delGroup){
          const groupName = delGroup.closest('.tmn-category-module').dataset.group;
          App.data.groups = App.data.groups.filter(x=>x.name!==groupName);
          App.storage.save(); App.renderGroups(); return;
        }
        if(edit){
          const item = edit.closest('.tmn-daily-item');
          const name = item.dataset.name;
          const it = App.findItem(name);
          App.openDailyModal(it.category, it);
          return;
        }
        if(del){
          const item = del.closest('.tmn-daily-item');
          const name = item.dataset.name;
          const it = App.findItem(name);
          const g = App.data.groups.find(x=>x.name===it.category);
          g.items = g.items.filter(x=>x.name!==name);
          delete App.data.state[name];
          App.storage.save(); App.renderGroups(); return;
        }
        if(reset){
          e.preventDefault(); e.stopPropagation();
          const item = reset.closest('.tmn-daily-item');
          const name = item.dataset.name;
          App.data.state[name]={completed:0,lastCompleted:null};
          App.storage.save(); App.updateAll(); return;
        }
        if(link){
          const item = link.closest('.tmn-daily-item');
          if(item.classList.contains('tmn-daily-item--done')) return;
          const name = item.dataset.name;
          const it = App.findItem(name);
          const st = App.data.state[name] || {completed:0,lastCompleted:null};
          const cd = App.parseCooldown(it.cooldown);
          const completed = (cd.type==='count') ? (st.completed+1) : 1;
          App.data.state[name] = {completed,lastCompleted:Date.now()};
          App.storage.save();
          App.updateAll();
          e.preventDefault();
          setTimeout(()=>{ window.location.href = link.href; },140);
          return;
        }
      });
    },

    findItem(name){
      for(const g of App.data.groups){
        for(const it of g.items){ if(it.name===name) return it; }
      }
      return null;
    },

    updateAll(){
      const now=Date.now();
      document.querySelectorAll('#tmn-dailies-container .tmn-daily-item').forEach(el=>{
        const name=el.dataset.name;
        const it=App.findItem(name);
        if(!it) return;
        const st=App.data.state[name] || {completed:0,lastCompleted:null};
        const {isDone,text}=App.status(it, st, now);
        el.classList.toggle('tmn-daily-item--done', isDone);
        el.querySelector('.tmn-daily-status').innerHTML = text;
      });
      const p=App.computeProgress();
      App.els.progressFill.style.width = p.percent+'%';
      App.els.progressLabel.textContent = p.percent+'%';
      App.els.progressLabel.style.transform = `translate(calc(${p.percent}% - 50%), -50%)`;
      App.els.progressWrap.classList.toggle('tmn-progress-celebrate', p.percent===100);
      if(p.percent===100) App.confettiBurst();
    },

    confettiBurst(){
      const wrap = App.els.progressWrap;
      if(wrap.querySelector('.confetti-piece')) return;
      for(let i=0;i<14;i++){
        const c=document.createElement('div');
        c.className='confetti-piece';
        c.style.left = (50 + (Math.random()*40-20)) + '%';
        c.style.background = Math.random()>0.5 ? 'var(--accent)' : 'var(--accent-2)';
        c.style.animationDelay = (i*0.04)+'s';
        wrap.appendChild(c);
        c.addEventListener('animationend',()=>c.remove());
      }
    },

    showEditBar(){
      if(document.querySelector('#tmn-editbar')) return;
      const bar=document.createElement('div');
      bar.id='tmn-editbar';
      bar.className='tmn-editbar';
      bar.innerHTML=`
        <button class="tmn-btn tmn-add-group">＋ Group</button>
        <button class="tmn-btn tmn-export">Export</button>
        <button class="tmn-btn tmn-import">Import</button>
        <button class="tmn-btn tmn-collapse-all">Collapse All</button>
        <button class="tmn-btn tmn-expand-all">Expand All</button>
      `;
      document.body.appendChild(bar);
      bar.querySelector('.tmn-add-group').onclick=()=>{ App.data.groups.push({name:'New Group',items:[]}); App.storage.save(); App.renderGroups(); };
      bar.querySelector('.tmn-export').onclick=()=>{
        const a=document.createElement('a');
        const blob=new Blob([JSON.stringify(App.data,null,2)],{type:'application/json'});
        a.href=URL.createObjectURL(blob); a.download='dailies_os_backup.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),0);
      };
      bar.querySelector('.tmn-import').onclick=()=>{
        const inp=document.createElement('input'); inp.type='file'; inp.accept='application/json';
        inp.onchange=()=>{
          const f=inp.files[0]; if(!f) return;
          const fr=new FileReader();
          fr.onload=()=>{
            try{ const obj=JSON.parse(fr.result); if(!obj.groups||!obj.theme) throw new Error('Invalid'); App.data=obj; App.storage.save(); App.inject(); }
            catch(_){ alert('Import failed: invalid file'); }
          };
          fr.readAsText(f);
        };
        inp.click();
      };
      bar.querySelector('.tmn-collapse-all').onclick=()=>{
        document.querySelectorAll('.tmn-category-module').forEach(m=>{ m.classList.remove('tmn-open'); m.querySelector('.tmn-chevron').textContent='▸'; });
      };
      bar.querySelector('.tmn-expand-all').onclick=()=>{
        document.querySelectorAll('.tmn-category-module').forEach(m=>{ m.classList.add('tmn-open'); m.querySelector('.tmn-chevron').textContent='▾'; });
      };
    },

    hideEditBar(){ document.querySelector('#tmn-editbar')?.remove(); },

    openDailyModal(groupName, existing){
      const m=document.createElement('div'); m.className='tmn-modal';
      const v=existing || {name:'',url:'',iconUrl:'',cooldown:'daily',notes:''};
      m.innerHTML=`
        <div class="tmn-modal-card" role="dialog" aria-modal="true">
          <div style="font-weight:900">${existing?'Edit Daily':'Add Daily'}</div>
          <div class="tmn-row"><input class="tmn-input nm" placeholder="Name" value="${v.name}"></div>
          <div class="tmn-row"><input class="tmn-input url" placeholder="https://..." value="${v.url}"></div>
          <div class="tmn-row"><input class="tmn-input icon" placeholder="Icon URL" value="${v.iconUrl}"></div>
          <div class="tmn-row"><input class="tmn-input cd" placeholder="Cooldown (daily | 2h | 30m | 10/day)" value="${v.cooldown}"></div>
          <div class="tmn-row"><input class="tmn-input nt" placeholder="Notes" value="${v.notes}"></div>
          <div class="tmn-row"><div class="tmn-pill" id="tmn-cd-preview"></div></div>
          <div class="btns">
            <button class="tmn-cancel">Cancel</button>
            <button class="tmn-save">${existing?'Save':'Add'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(m);
      const prev=m.querySelector('#tmn-cd-preview'), cdIn=m.querySelector('.cd');
      const upd=()=>{ const cd=App.parseCooldown(cdIn.value.trim()); if(cd.type==='timer') prev.textContent='Next available in '+App.fmt(cd.duration); else if(cd.type==='count') prev.textContent='Per-day limit: '+cd.limit; else if(cd.type==='reset') prev.textContent='Resets daily'; else prev.textContent='Manual'; };
      upd(); cdIn.addEventListener('input',upd);
      const close=()=>m.remove();
      m.querySelector('.tmn-cancel').onclick=close;
      m.querySelector('.tmn-save').onclick=()=>{
        const name=m.querySelector('.nm').value.trim();
        const url=m.querySelector('.url').value.trim();
        const icon=m.querySelector('.icon').value.trim();
        const cd=m.querySelector('.cd').value.trim();
        const nt=m.querySelector('.nt').value.trim();
        if(!name||!url){ close(); return; }
        const g=App.data.groups.find(x=>x.name===groupName);
        if(!g){ close(); return; }
        if(existing){
          const ix=g.items.findIndex(i=>i.name===existing.name);
          if(ix>-1) g.items[ix]={name,url,iconUrl:icon,cooldown:cd,notes:nt,category:groupName};
        }else{
          g.items.push({name,url,iconUrl:icon,cooldown:cd,notes:nt,category:groupName});
        }
        App.storage.save(); App.renderGroups(); close();
      };
      m.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); if(e.key==='Enter') m.querySelector('.tmn-save').click(); });
    },

    openThemeModal(){
      const t=App.data.theme;
      const m=document.createElement('div'); m.className='tmn-modal';
      m.innerHTML=`
        <div class="tmn-modal-card" role="dialog" aria-modal="true">
          <div style="font-weight:900">Theme</div>
          <div class="tmn-row">
            <label style="font-size:12px;align-self:center">Accent</label>
            <input class="tmn-input tmn-accent" type="color" value="${t.accent}" style="max-width:60px">
            <input class="tmn-input tmn-accent-hex" type="text" value="${t.accent}">
          </div>
          <div class="tmn-row">
            <label style="font-size:12px;align-self:center">Blur</label>
            <input class="tmn-input tmn-blur" type="range" min="0" max="20" value="${t.blur}">
            <span class="tmn-pill tmn-blur-val">${t.blur}px</span>
          </div>
          <div class="tmn-row">
            <button class="tmn-btn tmn-mode">${t.mode==='dark'?'Switch to Light':'Switch to Dark'}</button>
          </div>
          <div class="btns">
            <button class="tmn-cancel">Cancel</button>
            <button class="tmn-save">Save</button>
          </div>
        </div>
      `;
      document.body.appendChild(m);
      const accent=m.querySelector('.tmn-accent'), hex=m.querySelector('.tmn-accent-hex'), blur=m.querySelector('.tmn-blur'), blurVal=m.querySelector('.tmn-blur-val');
      accent.addEventListener('input',()=>{ hex.value=accent.value; });
      hex.addEventListener('input',()=>{ if(/^#([0-9a-f]{6})$/i.test(hex.value)) accent.value=hex.value; });
      blur.addEventListener('input',()=>{ blurVal.textContent=blur.value+'px'; });
      m.querySelector('.tmn-mode').onclick=()=>{ t.mode = (t.mode==='dark'?'light':'dark'); m.querySelector('.tmn-mode').textContent = t.mode==='dark'?'Switch to Light':'Switch to Dark'; };
      const close=()=>m.remove();
      m.querySelector('.tmn-cancel').onclick=close;
      m.querySelector('.tmn-save').onclick=()=>{
        App.data.theme.accent = accent.value;
        App.data.theme.blur = parseInt(blur.value,10);
        App.data.theme.mode = t.mode;
        App.storage.save(); App.applyTheme(); close();
      };
      m.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); if(e.key==='Enter') m.querySelector('.tmn-save').click(); });
    }
  };

  App.storage.load();
  App.rolloverIfNeeded();
  App.inject();
})();
