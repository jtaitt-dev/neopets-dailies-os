// ==UserScript==
// @name         Neopets: Dailies OS (JT$ v7.5 Pro+)
// @namespace    http://tampermonkey.net/
// @version      7.5.7
// @description  The ultimate Neopets dashboard. Draggable, resizable, and fully integrated with live data, power modules, and deep personalization.
// @match        *://*.neopets.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      neopets.com
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
    KEY_DATA: 'jt_dailies_os_data_v75_pro',
    KEY_LAST_NST: 'jt_dailies_os_last_nst_v75',
    NST_OFFSET: -8 * 60 * 60 * 1000,
    LOG_PREFIX: '[DailiesOS v7.5 Pro+]',
  };

  GM_addStyle(`:root{--bg:#ffffff;--fg:#0f172a;--muted:#475569;--card:#f8fafc;--accent:#3b82f6;--accent-2:#22c55e;--shadow:rgba(2,6,23,.15);--blur:10px}
.tmn-dark{--bg:#0b1020;--fg:#e5e7eb;--muted:#9aa3b2;--card:#11172b;--accent:#60a5fa;--accent-2:#34d399;--shadow:rgba(0,0,0,.35)}
#tmn-dailies-container{position:fixed;top:20px;right:20px;width:300px;height:auto;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--fg);z-index:9999;resize:both;overflow:hidden}
.tmn-panel{background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.45));backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid rgba(148,163,184,.35);border-radius:14px;box-shadow:0 10px 25px var(--shadow);overflow:hidden;display:flex;flex-direction:column;height:100%; position:relative;}
.tmn-dark .tmn-panel{background:linear-gradient(180deg,rgba(17,23,43,.55),rgba(17,23,43,.35))}
.tmn-drag-handle{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;font-weight:800;font-size:12px;cursor:move;flex-shrink:0}
.tmn-header-left{display:flex;align-items:center;gap:8px}
.tmn-active-pet{width:32px;height:32px;border-radius:50%;border:2px solid var(--accent);object-fit:cover}
.tmn-notifications{display:flex;gap:4px}
.tmn-badge{font-size:9px;background:var(--accent);color:#fff;padding:2px 5px;border-radius:99px}
.tmn-actions{display:flex;gap:6px;align-items:center}
.tmn-btn{border:0;background:var(--card);color:var(--fg);padding:6px 8px;border-radius:8px;font-size:11px;cursor:pointer;transition:transform .1s cubic-bezier(.22,1.61,.36,1)}
.tmn-btn:active{transform:scale(.96)}
.tmn-search-bar{padding:0 12px 8px;flex-shrink:0}
.tmn-search-input{width:100%;padding:6px 10px;border-radius:8px;border:1px solid rgba(148,163,184,.25);background:var(--card);color:var(--fg)}
.tmn-info-panels{padding:0 12px 8px;display:flex;gap:6px;flex-wrap:wrap;font-size:10px;flex-shrink:0}
.tmn-info-box{background:var(--card);padding:4px 8px;border-radius:8px;border:1px solid rgba(148,163,184,.25)}
.tmn-quest-alert{background:linear-gradient(45deg, #fef3c7, #fde68a);color:#713f12;margin:0 12px 8px;padding:8px;border-radius:10px;font-size:11px;border:1px solid #fcd34d}
.tmn-dark .tmn-quest-alert{background:linear-gradient(45deg, #422006, #78350f);color:#fef3c7;border-color:#b45309}
.tmn-progress{position:relative;height:12px;margin:0 12px 10px;border-radius:999px;background:rgba(148,163,184,.25);overflow:hidden;animation:tmn-breathe 3s ease-in-out infinite;flex-shrink:0}
.tmn-progress>span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent));background-size:200% 100%;animation:tmn-shimmer 2.2s linear infinite;transition:width .5s cubic-bezier(.22,1.61,.36,1)}
.tmn-progress-label{position:absolute;top:50%;left:0;transform:translate(-50%,-50%);font-size:11px;font-weight:800;transition:transform .3s cubic-bezier(.22,1.61,.36,1)}
.tmn-progress-celebrate>span{animation:tmn-shimmer 1.2s linear infinite,tmn-glow 1s ease-in-out 2}
.tmn-tabs{display:flex;padding:0 12px;border-bottom:1px solid rgba(148,163,184,.25);flex-shrink:0}
.tmn-tab{padding:6px 10px;cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid transparent}
.tmn-tab.tmn-active{border-bottom-color:var(--accent);color:var(--accent)}
.tmn-tab-content{padding-top:6px;overflow-y:auto;flex-grow:1}
.tmn-category-module{margin:8px 12px;background:var(--card);border:1px solid rgba(148,163,184,.25);border-radius:12px;transition:box-shadow .2s ease, transform .15s ease-out, opacity .2s, max-height .3s; will-change: transform; opacity:1;max-height:1000px}
.tmn-category-module.tmn-adding, .tmn-category-module.tmn-deleting{transform:scale(0.95);opacity:0;max-height:0!important;margin:0 12px}
.tmn-category-module:hover{box-shadow:0 8px 18px var(--shadow)}
.tmn-category-module.tmn-group-dragging{transform:scale(1.05);box-shadow:0 12px 28px var(--shadow);opacity:.95;cursor:grabbing!important}
.tmn-drag-placeholder{height:40px;margin:8px 12px;border:2px dashed var(--accent);border-radius:12px;background:rgba(0,0,0,0.05)}
.tmn-dailies-header{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:8px 10px;font-weight:700;font-size:12px;cursor:grab}
.tmn-dailies-header:active{cursor:grabbing}
.tmn-edit-mode .tmn-dailies-header{cursor:default}
.tmn-left{display:flex;align-items:center;gap:8px}
.tmn-chevron{cursor:pointer;user-select:none;font-weight:900}
.tmn-group-name[contenteditable="true"]{outline:none;border-bottom:1px dashed transparent}
.tmn-group-name[contenteditable="true"]:focus{border-bottom:1px dashed var(--accent)}
.tmn-group-controls{display:flex;gap:6px}
.tmn-group-controls[hidden]{display:none!important}
.tmn-dailies-content{padding:6px 10px 10px;overflow:hidden;max-height:0;opacity:0;transition:max-height .28s ease,opacity .28s ease}
.tmn-category-module.tmn-open .tmn-dailies-content{max-height:1000px;opacity:1}
.tmn-dailies-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(90px, 1fr));gap:10px 8px;position:relative}
.tmn-daily-item{position:relative;text-align:center;font-size:10px;user-select:none;transition:transform .2s, opacity .2s; opacity:1;transform:scale(1)}
.tmn-daily-item.tmn-adding, .tmn-daily-item.tmn-deleting{transform:scale(0.9);opacity:0}
.tmn-daily-item.tmn-item-ghost{opacity:.5;transform:scale(1.05);background:var(--accent);border-radius:12px}
.tmn-item-placeholder{background:rgba(0,0,0,.05);border-radius:12px;grid-column:auto;grid-row:auto}
.tmn-daily-link{display:block;position:relative;overflow:hidden;border-radius:10px;padding:6px 0;transition:transform .12s cubic-bezier(.22,1.61,.36,1)}
.tmn-daily-link:hover{transform:translateY(-1px)}
.tmn-daily-icon-wrapper{width:48px;height:48px;margin:0 auto}
.tmn-daily-icon{width:48px;height:48px;object-fit:contain;display:block;transition:filter .25s ease,opacity .25s ease}
.tmn-daily-name{font-weight:800;display:block;margin-top:2px}
.tmn-daily-status{color:var(--muted);font-size:9px;display:block;height:18px;line-height:10px}
.tmn-daily-item--done .tmn-daily-icon{filter:grayscale(1);opacity:.6}
.tmn-daily-item--done .tmn-daily-name{opacity:.8}
.tmn-reset{color:var(--accent);cursor:pointer;text-decoration:underline}
.tmn-item-controls{position:absolute;top:2px;right:2px;display:flex;gap:4px}
.tmn-item-controls[hidden]{display:none!important}
.tmn-editbar{position:fixed;bottom:12px;right:20px;display:flex;flex-wrap:wrap;gap:6px;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:6px 8px;border-radius:10px;z-index:10000}
.tmn-editbar .tmn-btn{background:rgba(255,255,255,.15);color:#fff}
.tmn-grid-controls{display:flex;gap:2px;align-items:center}
.tmn-grid-controls .tmn-btn{padding:4px 6px}
.tmn-grid-controls .tmn-btn.tmn-active{background:var(--accent);color:#fff}
.tmn-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10001}
.tmn-modal-card{background:var(--bg);color:var(--fg);min-width:340px;max-width:90vw;border-radius:12px;box-shadow:0 10px 25px var(--shadow);padding:14px;display:flex;flex-direction:column;gap:8px}
.tmn-row{display:flex;gap:8px;align-items:center}
.tmn-input{padding:8px;border:1px solid #cbd5e1;border-radius:8px;background:var(--card);color:var(--fg);width:100%;font-size:12px}
.tmn-modal .btns{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}
.tmn-modal .btns button{border:0;border-radius:8px;padding:6px 10px;cursor:pointer}
.tmn-save{background:var(--accent);color:#fff}
.tmn-cancel{background:#94a3b8;color:#fff}
.tmn-collapse-toggle{--color:var(--muted);--size:24px;display:flex;justify-content:center;align-items:center;position:relative;cursor:pointer;font-size:var(--size);user-select:none;fill:currentColor;margin-right:4px}
.tmn-collapse-toggle .chevron-down{position:absolute;transition:transform .5s ease}
.tmn-collapse-toggle input:checked ~ .chevron-down{transform:rotate(-180deg)}
.tmn-collapse-toggle input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}
@keyframes tmn-shimmer{0%{background-position:0% 0}100%{background-position:200% 0}}
@keyframes tmn-breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.05)}}
@keyframes tmn-glow{0%{filter:brightness(1)}50%{filter:brightness(1.6) drop-shadow(0 0 6px var(--accent-2))}100%{filter:brightness(1)}}
.confetti-piece{position:absolute;width:6px;height:6px;border-radius:2px;background:var(--accent);opacity:0;animation:confetti-fall 1.1s ease forwards}
@keyframes confetti-fall{0%{transform:translateY(-8px) rotate(0);opacity:1}100%{transform:translateY(60px) rotate(360deg);opacity:0}}
.tmn-theme-switch { display: flex; align-items: center; -webkit-tap-highlight-color: transparent; font-size: 10px; transform: scale(0.6); margin-right: -12px;}
.tmn-theme-switch__icon, .tmn-theme-switch__toggle { z-index: 1; }
.tmn-theme-switch__icon, .tmn-theme-switch__icon-part { position: absolute; }
.tmn-theme-switch__icon { display: block; top: 0.5em; left: 0.5em; width: 1.5em; height: 1.5em; transition: 0.3s; }
.tmn-theme-switch__icon-part { border-radius: 50%; box-shadow: 0.4em -0.4em 0 0.5em hsl(0,0%,100%) inset; top: calc(50% - 0.5em); left: calc(50% - 0.5em); width: 1em; height: 1em; transition: all 0.3s ease-in-out; transform: scale(0.5); }
.tmn-theme-switch__icon-part ~ .tmn-theme-switch__icon-part { background-color: hsl(0,0%,100%); border-radius: 0.05em; top: 50%; left: calc(50% - 0.05em); transform: rotate(0deg) translateY(0.5em); transform-origin: 50% 0; width: 0.1em; height: 0.2em; }
.tmn-theme-switch__icon-part:nth-child(3) { transform: rotate(45deg) translateY(0.45em); }
.tmn-theme-switch__icon-part:nth-child(4) { transform: rotate(90deg) translateY(0.45em); }
.tmn-theme-switch__icon-part:nth-child(5) { transform: rotate(135deg) translateY(0.45em); }
.tmn-theme-switch__icon-part:nth-child(6) { transform: rotate(180deg) translateY(0.45em); }
.tmn-theme-switch__icon-part:nth-child(7) { transform: rotate(225deg) translateY(0.45em); }
.tmn-theme-switch__icon-part:nth-child(8) { transform: rotate(270deg) translateY(0.5em); }
.tmn-theme-switch__icon-part:nth-child(9) { transform: rotate(315deg) translateY(0.5em); }
.tmn-theme-switch__toggle, .tmn-theme-switch__toggle-wrap { position: relative; }
.tmn-theme-switch__toggle, .tmn-theme-switch__toggle:before { display: block; }
.tmn-theme-switch__toggle { background-color: hsl(48,90%,85%); border-radius: 25% / 50%; box-shadow: 0 0 0 0.125em var(--accent); padding: 0.25em; width: 6em; height: 3em; -webkit-appearance: none; appearance: none; transition: all 0.3s ease-in-out; }
.tmn-theme-switch__toggle:before { background-color: hsl(48,90%,55%); border-radius: 50%; content: ""; width: 2.5em; height: 2.5em; transition: 0.3s; }
.tmn-theme-switch__toggle:focus { outline: transparent; }
.tmn-theme-switch__toggle:checked { background-color: hsl(198,90%,15%); }
.tmn-theme-switch__toggle:checked:before, .tmn-theme-switch__toggle:checked ~ .tmn-theme-switch__icon { transform: translateX(3em); }
.tmn-theme-switch__toggle:checked:before { background-color: hsl(198,90%,55%); }
.tmn-theme-switch__toggle:checked ~ .tmn-theme-switch__icon .tmn-theme-switch__icon-part:nth-child(1) { box-shadow: 0.2em -0.2em 0 0.2em hsl(0,0%,100%) inset; transform: scale(1); top: 0.2em; left: -0.2em; }
.tmn-theme-switch__toggle:checked ~ .tmn-theme-switch__icon .tmn-theme-switch__icon-part ~ .tmn-theme-switch__icon-part { opacity: 0; }
.tmn-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;padding:8px 0}
.tmn-stats-card{background:var(--card);border:1px solid rgba(148,163,184,.25);padding:8px;border-radius:8px;text-align:center}
.tmn-stats-val{font-size:16px;font-weight:800;color:var(--accent)}
.tmn-history-log{font-size:10px;max-height:150px;overflow-y:auto;padding:4px}
.tmn-history-item{display:flex;justify-content:space-between;padding:2px;border-bottom:1px solid rgba(148,163,184,.15)}
/* Hidden Scrollbars */
.tmn-tab-content, #tmn-dailies-container { scrollbar-width: none; } /* Firefox */
.tmn-tab-content::-webkit-scrollbar, #tmn-dailies-container::-webkit-scrollbar { display: none; } /* Chrome, Safari, and Opera */
/* Scroll Indicator */
.tmn-scroll-indicator { position: absolute; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; opacity: 0; transition: opacity 0.3s, top 0.3s, bottom 0.3s; z-index: 10; }
.tmn-scroll-indicator.tmn-visible { opacity: 0.7; }
.tmn-scroll-indicator .tmn-scroll-icon { animation: tmn-scroll-bounce 2s infinite; }
.tmn-scroll-indicator.tmn-scroll-down { bottom: 5px; }
.tmn-scroll-indicator.tmn-scroll-up { top: 125px; } /* Adjust this value to position below header/tabs */
.tmn-scroll-icon svg { transition: transform 0.3s; fill: var(--fg); }
.tmn-scroll-indicator.tmn-scroll-up .tmn-scroll-icon svg { transform: rotate(180deg); }
.tmn-scroll-text { font-size: 10px; color: var(--muted); }
@keyframes tmn-scroll-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } 60% { transform: translateY(-4px); } }
`);

  const App = {
    data: {
      theme:{mode:'light',accent:'#3b82f6',blur:10},
      groups:[],
      state:{},
      history:[],
      position:{top:'20px',left:null,right:'20px', width: '320px', height:'auto'},
      settings: { gridColumns: 3, autoCollectBank: false }
    },
    editMode: false,
    els: {},
    cache: {},
    activeTab: 'dailies',
    resizeObserver: null,

    log(...args) { console.log(CONFIG.LOG_PREFIX, ...args); },
    nstNow(){ return new Date(Date.now() + CONFIG.NST_OFFSET); },
    fmt(ms){ if(ms<=0) return '00:00:00'; const s=Math.floor(ms/1000),h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor((s%3600)/60)).padStart(2,'0'),sec=String(s%60).padStart(2,'0'); return `${h}:${m}:${sec}`; },
    clone(o){ return JSON.parse(JSON.stringify(o)); },

    networkRequest(options) {
      App.log(`Network request to ${options.url}`);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          ...options,
          timeout: 15000,
          onload: (response) => {
            if (response.status >= 200 && response.status < 300) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, 'text/html');
              resolve({doc, response});
            } else {
              App.log(`Request to ${options.url} failed with status ${response.status}`);
              reject(new Error(`Request failed with status ${response.status}`));
            }
          },
          onerror: (error) => { App.log(`Request error for ${options.url}:`, error); reject(error); },
          ontimeout: () => { App.log(`Request to ${options.url} timed out.`); reject(new Error('Request timed out')); },
        });
      });
    },

    parseCooldown(v){
      if(!v) return {type:'manual', duration:0};
      const pd = v.match(/(\d+)\/day/); if(pd) return {type:'count',limit:parseInt(pd[1],10), duration:0};
      if(['daily','monthly'].includes(v)) return {type:'reset', duration: 24 * 3600 * 1000};
      if(v==='twice-daily') return {type:'count',limit:2, duration: 12 * 3600 * 1000};
      if(['anytime','random','window'].includes(v)) return {type:'manual', duration:0};
      const m=v.match(/^(\d+)([hmd])$/);
      if(m){const n=parseInt(m[1],10),u=m[2]; if(u==='m') return {type:'timer',duration:n*60*1000}; if(u==='h') return {type:'timer',duration:n*3600*1000}; if(u==='d') return {type:'timer',duration:n*24*3600*1000};}
      if(v==='7h7m') return {type:'timer',duration:(7*3600+7*60)*1000};
      return {type:'manual', duration:0};
    },

    status(d, st, now){
      const cd = App.parseCooldown(d.cooldown);
      let isDone=false, text=d.notes||'', cooldownPercent=0;
      if(cd.type==='reset' || cd.type==='manual'){ isDone=(st.completed||0)>0; if(isDone) text='Done <span class="tmn-reset">[Reset]</span>'; }
      else if(cd.type==='count'){ isDone=(st.completed||0)>=cd.limit; text=isDone?'Done <span class="tmn-reset">[Reset]</span>':(st.completed?`${st.completed}/${cd.limit} Done`:`${cd.limit} per day`); }
      else if(cd.type==='timer'){ const next=(st.lastCompleted||0)+cd.duration; isDone=now<next; if(isDone) { const remaining=next-now; text=`<b>${App.fmt(remaining)}</b>`; cooldownPercent = (remaining / cd.duration) * 100;} }
      return {isDone,text,cooldownPercent};
    },

    storage: {
      load(){
        try{
          const raw = GM_getValue(CONFIG.KEY_DATA, null);
          if(raw){
            const parsed = JSON.parse(raw);
            App.data = {...App.data, ...parsed, settings: {...App.data.settings, ...parsed.settings}};
          }
          else { App.bootstrapFromBase(); App.storage.save(); }
        }catch(e){ App.log("Error loading data, resetting.", e); App.bootstrapFromBase(); App.storage.save(); }
      },
      save(){ GM_setValue(CONFIG.KEY_DATA, JSON.stringify(App.data)); App.log("Data saved."); }
    },

    bootstrapFromBase(){
      const map={};
      for(const d of BASE_DAILIES){
        (map[d.category] ||= []).push(App.clone(d));
      }
      App.data.groups = Object.keys(map).map(k=>({name:k, items:map[k], collapsed: false}));
      App.data.state = {};
      App.data.history = [];
      App.data.theme = {mode:'light',accent:'#3b82f6',blur:10};
      App.data.position = {top:'20px',left:null,right:'20px', width: '320px', height:'auto'};
      App.data.settings = { gridColumns: 3, autoCollectBank: false };
      App.checkActiveEvents();
    },

    rolloverIfNeeded(){
      const last = GM_getValue(CONFIG.KEY_LAST_NST,'');
      const cur = App.nstNow().toISOString().slice(0,10);
      if(last!==cur){
        App.log(`NST Rollover detected from ${last} to ${cur}.`);
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

    checkActiveEvents() {
        const now = App.nstNow();
        const month = now.getUTCMonth(); // 0-11
        const eventGroup = { name: "Current Event", items: [], collapsed: false };
        let eventFound = false;

        // Advent Calendar in December
        if (month === 11) {
            const adventDaily = BASE_DAILIES.find(d => d.name === "Advent Calendar");
            if (adventDaily && !App.findItem("Advent Calendar")) {
                eventGroup.items.push(adventDaily);
                eventFound = true;
            }
        }
        // More events can be added here (e.g., Faerie Festival, Altador Cup)

        if (eventFound && !App.data.groups.some(g => g.name === "Current Event")) {
            App.data.groups.unshift(eventGroup);
            App.log("Dynamic event group added.");
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

      const { top, left, right, width, height } = App.data.position;
      root.style.top = top;
      root.style.left = left;
      root.style.right = right;
      root.style.width = width;
      // Height is applied here, can be 'auto' or a pixel value
      root.style.height = height;

      root.innerHTML=`
        <div class="tmn-panel">
          <div class="tmn-drag-handle">
            <div class="tmn-header-left">
               <img class="tmn-active-pet" src="https://pets.neopets.com/cp/m/1/1.png" alt="Active Pet">
               <span class="tmn-title">Dailies OS</span>
               <div class="tmn-notifications"></div>
            </div>
            <div class="tmn-actions">
              <label class="tmn-collapse-toggle" title="Collapse/Expand All"><input type="checkbox" checked="checked"/><svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="chevron-down"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></label>
              <label for="tmn-theme-toggle-input" class="tmn-theme-switch"><span class="tmn-theme-switch__toggle-wrap"><input id="tmn-theme-toggle-input" class="tmn-theme-switch__toggle" type="checkbox" role="switch" name="theme"><span class="tmn-theme-switch__icon"><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span><span class="tmn-theme-switch__icon-part"></span></span></span></label>
              <button class="tmn-btn tmn-edit-toggle">Edit</button>
            </div>
          </div>
          <div class="tmn-search-bar"><input type="search" class="tmn-search-input" placeholder="Filter dailies..."></div>
          <div class="tmn-info-panels"></div>
          <div class="tmn-quest-alert" style="display:none;"></div>
          <div class="tmn-progress"><span></span><span class="tmn-progress-label">0%</span></div>
          <div class="tmn-tabs">
             <div class="tmn-tab tmn-active" data-tab="dailies">Dailies</div>
             <div class="tmn-tab" data-tab="stats">Stats</div>
             <div class="tmn-tab" data-tab="modules">Modules</div>
          </div>
          <div class="tmn-tab-content tmn-tab-content-dailies">
            <div class="tmn-groups"></div>
          </div>
          <div class="tmn-tab-content tmn-tab-content-stats" style="display:none; padding: 0 12px;"></div>
          <div class="tmn-tab-content tmn-tab-content-modules" style="display:none; padding: 0 12px;"></div>
          <div class="tmn-scroll-indicator">
            <div class="tmn-scroll-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z"></path>
              </svg>
            </div>
            <span class="tmn-scroll-text">Scroll</span>
          </div>
        </div>
      `;
      const prev=document.querySelector('#tmn-dailies-container'); if(prev) prev.remove();
      document.body.appendChild(root);

      App.els.root=root;
      App.els.progressFill = root.querySelector('.tmn-progress>span');
      App.els.progressLabel = root.querySelector('.tmn-progress-label');
      App.els.progressWrap = root.querySelector('.tmn-progress');
      App.els.groups = root.querySelector('.tmn-groups');
      App.els.themeToggle = root.querySelector('#tmn-theme-toggle-input');
      App.els.searchInput = root.querySelector('.tmn-search-input');
      App.els.infoPanels = root.querySelector('.tmn-info-panels');
      App.els.questAlert = root.querySelector('.tmn-quest-alert');
      App.els.activePet = root.querySelector('.tmn-active-pet');
      App.els.notifications = root.querySelector('.tmn-notifications');
      App.els.scrollIndicator = root.querySelector('.tmn-scroll-indicator');
      App.els.dailiesContent = root.querySelector('.tmn-tab-content-dailies');

      if (App.data.theme.mode === 'dark') App.els.themeToggle.checked = true;

      App.applyTheme();
      App.renderGroups();
      App.renderStats();
      App.renderModules();
      App.attachTopEvents();
      App.updateAll();
      App.integrations.fetchAll();
      // Add scroll listener and initial check
      App.els.dailiesContent.addEventListener('scroll', App.updateScrollIndicator);
      setTimeout(App.updateScrollIndicator, 300); // Initial check after load
      setInterval(App.updateAll, 1000);
    },

    applyTheme(){
      const t = App.data.theme;
      App.els.root.classList.toggle('tmn-dark', t.mode === 'dark');
      App.els.root.style.setProperty('--accent', t.accent);
      App.els.root.style.setProperty('--blur', `${t.blur}px`);
    },

    renderGroups(){
      App.els.groups.innerHTML='';
      for(const g of App.data.groups){
        const mod=document.createElement('div');
        mod.className=`tmn-category-module ${g.collapsed ? '' : 'tmn-open'}`;
        mod.dataset.group=g.name;
        mod.innerHTML=`
          <div class="tmn-dailies-header" ${App.editMode?'':'draggable="true"'}>
            <div class="tmn-left">
              <span class="tmn-chevron">${g.collapsed ? '▸' : '▾'}</span>
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
        if(App.editMode) grid.style.gridTemplateColumns = `repeat(${App.data.settings.gridColumns}, 1fr)`;

        for(const it of g.items){
          const item=document.createElement('div');
          item.className='tmn-daily-item';
          item.dataset.name=it.name;
          item.draggable = App.editMode;
          item.innerHTML=`
            <a class="tmn-daily-link" href="${it.url}">
                <div class="tmn-daily-icon-wrapper">
                    <img class="tmn-daily-icon" src="${it.iconUrl}" alt="${it.name} icon">
                </div>
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
      App.log("Groups rendered.");
    },

    attachTopEvents(){
      // Panel Dragging
      const handle = App.els.root.querySelector('.tmn-drag-handle');
      handle.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, label, input')) return;
        const rect = App.els.root.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        function onMouseMove(e) { App.els.root.style.left = `${e.clientX - offsetX}px`; App.els.root.style.top = `${e.clientY - offsetY}px`; App.els.root.style.right = 'auto'; }
        function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); App.data.position = { ...App.data.position, top: App.els.root.style.top, left: App.els.root.style.left, right: null }; App.storage.save(); }
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
      });

      // Panel Resizing
      App.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            App.data.position.width = entry.contentRect.width + 'px';
            App.data.position.height = entry.contentRect.height + 'px';
            App.storage.save();
        }
      });
      App.resizeObserver.observe(App.els.root);


      // Edit Mode Button
      App.els.root.querySelector('.tmn-edit-toggle').onclick = () => { App.editMode=!App.editMode; App.els.root.classList.toggle('tmn-edit-mode', App.editMode); App.renderGroups(); App.log(`Toggled Edit Mode: ${App.editMode}`); };

      // Theme Toggle
      App.els.themeToggle.addEventListener('change', () => { App.data.theme.mode = App.els.themeToggle.checked ? 'dark' : 'light'; App.applyTheme(); App.storage.save(); });

      // Collapse All
      const collapseToggle = App.els.root.querySelector('.tmn-collapse-toggle input');
      collapseToggle.onchange = () => {
          App.resizeObserver.disconnect();
          const shouldOpen = collapseToggle.checked;
          let changed = false;
          App.data.groups.forEach(g => {
              if (g.collapsed === shouldOpen) {
                  g.collapsed = !shouldOpen;
                  changed = true;
              }
          });
          App.els.groups.querySelectorAll('.tmn-category-module').forEach(mod => {
              mod.classList.toggle('tmn-open', shouldOpen);
              mod.querySelector('.tmn-chevron').textContent = shouldOpen ? '▾' : '▸';
          });
          App.els.root.style.height = 'auto';
          App.data.position.height = 'auto';
          if(changed) App.storage.save();
          setTimeout(() => { App.resizeObserver.observe(App.els.root); App.updateScrollIndicator(); }, 300);
      };

      // Search Filter
      App.els.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        App.els.root.querySelectorAll('.tmn-daily-item').forEach(item => {
            const name = item.dataset.name.toLowerCase();
            item.style.display = name.includes(query) ? '' : 'none';
        });
      });

      // Tabs
      App.els.root.querySelectorAll('.tmn-tab').forEach(tab => {
        tab.onclick = () => {
            App.els.root.querySelector('.tmn-tab.tmn-active').classList.remove('tmn-active');
            tab.classList.add('tmn-active');
            App.activeTab = tab.dataset.tab;
            App.els.root.querySelectorAll('.tmn-tab-content').forEach(content => content.style.display = 'none');
            App.els.root.querySelector(`.tmn-tab-content-${App.activeTab}`).style.display = '';
            App.log(`Switched to tab: ${App.activeTab}`);
        };
      });
    },

    attachGroupEvents(){
      App.els.groups.addEventListener('click', (e) => {
        const chevron=e.target.closest('.tmn-chevron');
        if (chevron) {
          App.resizeObserver.disconnect();
          const mod = chevron.closest('.tmn-category-module');
          const group = App.data.groups.find(g => g.name === mod.dataset.group);
          const open = mod.classList.toggle('tmn-open');
          chevron.textContent = open ? '▾' : '▸';
          if (group) { group.collapsed = !open; }
          App.els.root.style.height = 'auto';
          App.data.position.height = 'auto';
          App.storage.save();
          setTimeout(() => { App.resizeObserver.observe(App.els.root); App.updateScrollIndicator(); }, 300);
          return;
        }
        const addDaily=e.target.closest('.tmn-add-daily');
        if(addDaily){ const groupName = addDaily.closest('.tmn-category-module').dataset.group; App.openDailyModal(groupName); return; }
        const delGroupBtn=e.target.closest('.tmn-del-group');
        if(delGroupBtn){
            const groupEl = delGroupBtn.closest('.tmn-category-module');
            const groupName = groupEl.dataset.group;
            groupEl.classList.add('tmn-deleting');
            setTimeout(() => {
                App.data.groups = App.data.groups.filter(x=>x.name!==groupName);
                App.storage.save(); App.renderGroups(); App.log(`Group deleted: ${groupName}`);
            }, 200);
            return;
        }
        const edit=e.target.closest('.tmn-edit');
        if(edit){ const name = edit.closest('.tmn-daily-item').dataset.name; const it = App.findItem(name); App.openDailyModal(it.category, it); return; }
        const del=e.target.closest('.tmn-del');
        if(del){
            const itemEl = del.closest('.tmn-daily-item');
            const name = itemEl.dataset.name;
            itemEl.classList.add('tmn-deleting');
            setTimeout(() => {
                const it = App.findItem(name);
                const g = App.data.groups.find(x=>x.name===it.category);
                g.items = g.items.filter(x=>x.name!==name);
                delete App.data.state[name];
                App.storage.save(); App.renderGroups(); App.log(`Item deleted: ${name}`);
            }, 200);
            return;
        }
        const reset=e.target.closest('.tmn-reset');
        if(reset){ e.preventDefault(); e.stopPropagation(); const name = reset.closest('.tmn-daily-item').dataset.name; App.data.state[name]={completed:0,lastCompleted:null}; App.storage.save(); App.updateAll(); return; }
        const link=e.target.closest('.tmn-daily-link');
        if(link && !App.editMode){
          e.preventDefault();
          const item = link.closest('.tmn-daily-item');
          if(item.classList.contains('tmn-daily-item--done')) return;
          const name = item.dataset.name;
          const it = App.findItem(name);
          const st = App.data.state[name] || {completed:0,lastCompleted:null};
          const cd = App.parseCooldown(it.cooldown);
          const completed = (cd.type==='count') ? (st.completed+1) : 1;
          App.data.state[name] = {completed,lastCompleted:Date.now()};
          App.data.history.unshift({name, time: Date.now()});
          if (App.data.history.length > 50) App.data.history.pop();
          App.storage.save();
          App.updateAll();
          App.renderStats();
          setTimeout(()=>{ window.location.href = link.href; },140);
          return;
        }
      });

      App.els.groups.querySelectorAll('.tmn-group-name').forEach(gn=>{
        gn.addEventListener('blur', ()=>{
          if(!App.editMode) return;
          const mod=gn.closest('.tmn-category-module'); const old=mod.dataset.group; const nv=gn.textContent.trim() || old;
          if(nv!==old){ const g=App.data.groups.find(x=>x.name===old); if(g){ g.name=nv; g.items.forEach(it=>it.category=nv); mod.dataset.group=nv; App.storage.save(); App.log(`Group renamed from ${old} to ${nv}`); }}
        });
      });

      // Drag and Drop Logic
      let draggedItem = null, placeholder = null;
      App.els.groups.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => draggedItem.classList.add('tmn-item-ghost'), 0);
        e.dataTransfer.effectAllowed = 'move';

        if(draggedItem.classList.contains('tmn-daily-item')) {
            placeholder = document.createElement('div');
            placeholder.className = 'tmn-item-placeholder';
            placeholder.style.height = `${draggedItem.offsetHeight}px`;
            placeholder.style.width = `${draggedItem.offsetWidth}px`;
        } else if (draggedItem.classList.contains('tmn-dailies-header')) {
            draggedItem = draggedItem.closest('.tmn-category-module');
            placeholder = document.createElement('div');
            placeholder.className = 'tmn-drag-placeholder';
            draggedItem.classList.add('tmn-group-dragging');
        }
      });

      App.els.groups.addEventListener('dragend', (e) => {
        if (!draggedItem) return;
        draggedItem.classList.remove('tmn-item-ghost', 'tmn-group-dragging');
        if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
        draggedItem = null;
        placeholder = null;
      });

      App.els.groups.addEventListener('dragover', (e) => {
        e.preventDefault();
        if(!draggedItem) return;
        const target = e.target;
        const isItem = draggedItem.classList.contains('tmn-daily-item');
        const isGroup = draggedItem.classList.contains('tmn-category-module');

        if(isItem) {
            const grid = target.closest('.tmn-dailies-grid');
            if (grid) {
                const afterElement = [...grid.children].find(child => e.clientY < child.getBoundingClientRect().top + child.offsetHeight / 2 && child !== placeholder);
                grid.insertBefore(placeholder, afterElement);
            }
        } else if (isGroup) {
            const targetModule = target.closest('.tmn-category-module');
            if (targetModule && targetModule !== draggedItem) {
                const rect = targetModule.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (e.clientY < midY) targetModule.parentNode.insertBefore(placeholder, targetModule);
                else targetModule.parentNode.insertBefore(placeholder, targetModule.nextSibling);
            }
        }
      });

      App.els.groups.addEventListener('drop', (e) => {
        e.preventDefault();
        if(!draggedItem || !placeholder || !placeholder.parentNode) return;
        const isItem = draggedItem.classList.contains('tmn-daily-item');
        const isGroup = draggedItem.classList.contains('tmn-category-module');

        if(isItem) {
            const oldGroupName = draggedItem.closest('.tmn-category-module').dataset.group;
            const newGroupName = placeholder.closest('.tmn-category-module').dataset.group;
            const itemName = draggedItem.dataset.name;

            const oldGroup = App.data.groups.find(g => g.name === oldGroupName);
            const newGroup = App.data.groups.find(g => g.name === newGroupName);
            const itemData = oldGroup.items.find(i => i.name === itemName);

            oldGroup.items = oldGroup.items.filter(i => i.name !== itemName);
            itemData.category = newGroupName;
            const newIndex = Array.from(placeholder.parentNode.children).indexOf(placeholder);
            newGroup.items.splice(newIndex, 0, itemData);

        } else if (isGroup) {
            const groupName = draggedItem.dataset.group;
            const originalIndex = App.data.groups.findIndex(g => g.name === groupName);
            const groupData = App.data.groups.splice(originalIndex, 1)[0];
            const newIndex = Array.from(placeholder.parentNode.children).indexOf(placeholder);
            App.data.groups.splice(newIndex, 0, groupData);
        }
        App.storage.save();
        App.renderGroups(); // Full re-render to ensure state is correct
      });
    },

    findItem(name){
      for(const g of App.data.groups){
        const it = g.items.find(i => i.name === name);
        if (it) return it;
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

    updateScrollIndicator() {
        const el = App.els.dailiesContent;
        const indicator = App.els.scrollIndicator;
        if (!el || !indicator) return;

        const isScrollable = el.scrollHeight > el.clientHeight;
        if (!isScrollable) {
            indicator.classList.remove('tmn-visible');
            return;
        }

        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;

        if (atTop) {
            indicator.classList.add('tmn-visible', 'tmn-scroll-down');
            indicator.classList.remove('tmn-scroll-up');
            indicator.querySelector('.tmn-scroll-text').textContent = 'Scroll';
        } else if (atBottom) {
            indicator.classList.add('tmn-visible', 'tmn-scroll-up');
            indicator.classList.remove('tmn-scroll-down');
            indicator.querySelector('.tmn-scroll-text').textContent = 'Top';
        } else {
            indicator.classList.remove('tmn-visible');
        }
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
      bar.id='tmn-editbar'; bar.className='tmn-editbar';
      bar.innerHTML=`
        <button class="tmn-btn tmn-add-group">＋ Group</button>
        <button class="tmn-btn tmn-export">Export</button>
        <button class="tmn-btn tmn-import">Import</button>
        <div class="tmn-grid-controls">
          <span style="color:#fff;font-size:10px;margin-right:4px;">Cols:</span>
          <button class="tmn-btn" data-cols="1">1</button>
          <button class="tmn-btn" data-cols="2">2</button>
          <button class="tmn-btn" data-cols="3">3</button>
          <button class="tmn-btn" data-cols="4">4</button>
        </div>
      `;
      document.body.appendChild(bar);
      bar.querySelector(`.tmn-grid-controls .tmn-btn[data-cols="${App.data.settings.gridColumns}"]`)?.classList.add('tmn-active');
      bar.querySelector('.tmn-add-group').onclick=()=>{
          const newGroupEl = document.createElement('div');
          newGroupEl.className = 'tmn-category-module tmn-adding';
          App.els.groups.appendChild(newGroupEl);
          setTimeout(() => {
            App.data.groups.push({name:'New Group',items:[], collapsed: false}); App.storage.save(); App.renderGroups(); App.log('Group added.');
          }, 50);
      };
      bar.querySelector('.tmn-export').onclick=()=>{
        const a=document.createElement('a');
        const blob=new Blob([JSON.stringify(App.data,null,2)],{type:'application/json'});
        a.href=URL.createObjectURL(blob); a.download='dailies_os_pro_backup.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),0);
      };
      bar.querySelector('.tmn-import').onclick=()=>{
        const inp=document.createElement('input'); inp.type='file'; inp.accept='application/json';
        inp.onchange=()=>{
          const f=inp.files[0]; if(!f) return;
          const fr=new FileReader();
          fr.onload=()=>{
            try{ const obj=JSON.parse(fr.result); if(!obj.groups||!obj.theme) throw new Error('Invalid'); App.data=obj; App.storage.save(); App.inject(); App.log('Data imported successfully.');}
            catch(e){ alert('Import failed: invalid file'); App.log('Import failed:', e); }
          };
          fr.readAsText(f);
        };
        inp.click();
      };
      bar.querySelectorAll('.tmn-grid-controls .tmn-btn').forEach(btn => {
        btn.onclick = () => {
            App.data.settings.gridColumns = parseInt(btn.dataset.cols, 10);
            bar.querySelector('.tmn-grid-controls .tmn-btn.tmn-active')?.classList.remove('tmn-active');
            btn.classList.add('tmn-active');
            App.storage.save();
            App.renderGroups();
            App.log(`Grid columns set to ${App.data.settings.gridColumns}`);
        };
      });
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
          <div class="btns">
            <button class="tmn-cancel">Cancel</button>
            <button class="tmn-save">${existing?'Save':'Add'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(m);
      const close=()=>m.remove();
      m.querySelector('.tmn-cancel').onclick=close;
      m.querySelector('.tmn-save').onclick=()=>{
        const name=m.querySelector('.nm').value.trim(), url=m.querySelector('.url').value.trim(), icon=m.querySelector('.icon').value.trim(), cd=m.querySelector('.cd').value.trim(), nt=m.querySelector('.nt').value.trim();
        if(!name||!url){ close(); return; }
        const g=App.data.groups.find(x=>x.name===groupName);
        if(!g){ close(); return; }
        if(existing){
          const ix=g.items.findIndex(i=>i.name===existing.name);
          if(ix>-1) g.items[ix]={name,url,iconUrl:icon,cooldown:cd,notes:nt,category:groupName};
          App.log(`Item edited: ${name}`);
        }else{
          g.items.push({name,url,iconUrl:icon,cooldown:cd,notes:nt,category:groupName});
          App.log(`Item added: ${name}`);
        }
        App.storage.save(); App.renderGroups(); close();
      };
      m.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); if(e.key==='Enter') m.querySelector('.tmn-save').click(); });
    },

    renderStats() {
      const container = App.els.root.querySelector('.tmn-tab-content-stats');
      const today = App.nstNow().toISOString().slice(0, 10);
      const todayCompletions = App.data.history.filter(h => new Date(h.time + CONFIG.NST_OFFSET).toISOString().slice(0,10) === today).length;

      let streak = 0;
      let d = App.nstNow();
      while(true) {
        const dStr = d.toISOString().slice(0, 10);
        if (App.data.history.some(h => new Date(h.time + CONFIG.NST_OFFSET).toISOString().slice(0,10) === dStr)) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
      }

      container.innerHTML = `
        <div class="tmn-stats-grid">
            <div class="tmn-stats-card"><div class="tmn-stats-label">Today</div><div class="tmn-stats-val">${todayCompletions}</div></div>
            <div class="tmn-stats-card"><div class="tmn-stats-label">Streak</div><div class="tmn-stats-val">${streak} 🔥</div></div>
        </div>
        <div style="font-size:12px;font-weight:700;margin-top:8px;">History</div>
        <div class="tmn-history-log">${App.data.history.map(h => `<div class="tmn-history-item"><span>${h.name}</span><span style="color:var(--muted)">${new Date(h.time).toLocaleTimeString()}</span></div>`).join('')}</div>
      `;
    },

    renderModules() {
        const container = App.els.root.querySelector('.tmn-tab-content-modules');
        container.innerHTML = `<div>Power Modules (Restocking, SW Pricer, etc.) would be rendered here. This is a placeholder for the extensive UI required.</div>`;
    },

    integrations: {
        async fetchAll() {
            this.fetchFinancials();
            this.fetchFaerieQuest();
            this.fetchActivePet();
            this.fetchNotifications();
            this.fetchTrudy();
        },
        async fetchFinancials() {
            const onHand = document.querySelector('#npanchor')?.textContent || 'N/A';
            const bankPromise = App.networkRequest({method: 'GET', url: '/bank.phtml'}).then(({doc}) => doc.querySelector('#txtCurrentBalance1')?.textContent.replace(/[^0-9]/g, '') || '0');
            const tillPromise = App.networkRequest({method: 'GET', url: '/market.phtml?type=till'}).then(({doc}) => {
                const pTags = Array.from(doc.querySelectorAll('p'));
                const tillPara = pTags.find(p => p.textContent.includes('in your till'));
                const tillAmount = tillPara ? tillPara.querySelector('b')?.textContent.replace(/[^0-9]/g, '') : '0';
                return tillAmount || '0';
            });
            const [bank, till] = await Promise.all([bankPromise, tillPromise]);
            App.els.infoPanels.innerHTML = `
              <div class="tmn-info-box"><b>On Hand:</b> ${onHand}</div>
              <div class="tmn-info-box"><b>Bank:</b> ${parseInt(bank).toLocaleString()} NP</div>
              <div class="tmn-info-box"><b>Till:</b> ${parseInt(till).toLocaleString()} NP</div>
            `;
        },
        async fetchFaerieQuest() {
            if (!document.querySelector('.nav-quest-icon__2020')) return;
            try {
                const { doc } = await App.networkRequest({ method: 'GET', url: '/faerieland/quests.phtml'});
                const questDiv = doc.querySelector('.quest-popup');
                if (questDiv) {
                    const faerieName = questDiv.querySelector('img[width="50"]')?.alt || 'A Faerie';
                    const itemText = questDiv.querySelector('b')?.textContent || 'an unknown item';
                    const swLink = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(itemText)}`;
                    App.els.questAlert.innerHTML = `<b>${faerieName}</b> needs <b>${itemText}</b>! <a href="${swLink}" target="_blank">Shop Wizard</a>`;
                    App.els.questAlert.style.display = 'block';
                }
            } catch(e) { App.log("Failed to fetch Faerie Quest data.", e); }
        },
        fetchActivePet() {
            // Try modern layout selector first, then fall back to classic layout selector.
            const petEl = document.querySelector('.nav-pet-img') || document.querySelector('.activePet img');
            const petImgSrc = petEl?.src;
            if(petImgSrc) App.els.activePet.src = petImgSrc;
        },
        fetchNotifications() {
            const neomail = document.querySelector('.neomail-count')?.textContent;
            if (neomail && parseInt(neomail) > 0) {
                App.els.notifications.innerHTML += `<div class="tmn-badge" title="${neomail} Neomails">📧 ${neomail}</div>`;
            }
        },
        fetchTrudy() {
            const trudyEl = document.querySelector('#trudy-prize-info');
            if (trudyEl) {
                const streakText = trudyEl.textContent.match(/Day (\d+)/);
                if (streakText) {
                    App.els.infoPanels.innerHTML += `<div class="tmn-info-box"><b>Trudy:</b> Day ${streakText[1]}</div>`;
                }
            }
        }
    }
  };

  App.storage.load();
  App.rolloverIfNeeded();
  App.inject();
})();
