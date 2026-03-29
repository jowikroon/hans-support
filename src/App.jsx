import { useState, useEffect, useRef } from "react";

/*
 * hans.support — v7.0 NEON SANCTUARY
 * Cinematic hero → dark neo-glow app
 * Doorlopend donker thema met rustige neon accenten
 * Mobile-first, alle systemen actief
 */

const C = {
  bg: "#0c0c14",
  bgCard: "#13131e",
  bgCardHover: "#18182a",
  bgSurface: "#0f0f1a",
  bgGlass: "rgba(18,18,32,0.75)",
  border: "#1e1e35",
  borderGlow: "#2a2a4a",
  // Neo accents (muted, not screaming)
  rose: "#e88ca0",
  roseGlow: "rgba(232,140,160,0.15)",
  roseDim: "rgba(232,140,160,0.08)",
  cyan: "#7ec8d4",
  cyanGlow: "rgba(126,200,212,0.12)",
  cyanDim: "rgba(126,200,212,0.06)",
  amber: "#d4b87e",
  amberGlow: "rgba(212,184,126,0.12)",
  green: "#7ed4a0",
  greenGlow: "rgba(126,212,160,0.12)",
  red: "#d47e7e",
  redGlow: "rgba(212,126,126,0.15)",
  purple: "#a08cd4",
  purpleGlow: "rgba(160,140,212,0.1)",
  // Text
  text: "#e0dce8",
  textMuted: "#8884a0",
  textDim: "#5a5670",
  textGhost: "#3a3650",
  // Heart
  heartWarm: "#f0c8b8",
  heartGlow: "rgba(240,200,184,0.2)",
};

// ─── DATA ──────────────────────────────────────────────────────
const CRIT_WORDS = ["koud","deur","vriest","achterdeur","ijskoud","tocht","open deur","onveilig"];
const isCrit = t => CRIT_WORDS.some(w => t.toLowerCase().includes(w));
const TRUST = { score:72, status:"Betrouwbaar maar licht chaotisch", insights:["Verbetert na feedback","Zwak punt: consistentie (deuren)","Sterk punt: intentie & inzet"], history:[{l:"Ma",v:68},{l:"Di",v:71},{l:"Wo",v:65},{l:"Do",v:70},{l:"Vr",v:74},{l:"Za",v:72},{l:"Nu",v:72}] };
const STATS = { hugsSent:25,hugsRec:20,listening:"verbeterend",decisions:"twijfelachtig",doors:"wordt onderzocht ❄️",
  achievements:[{t:"Discussie niet laten escaleren",done:true,i:"🏆"},{t:"Volledig geluisterd (30+ min)",done:true,i:"👂"},{t:"Deur dicht in de winter",done:false,i:"🚪",rare:true},{t:"Was correct gedaan",done:false,i:"🧺",rare:true},{t:"Als eerste schuld toegegeven",done:true,i:"🤝"},{t:"Knuffel geïnitieerd na conflict",done:true,i:"🤗"}]};
const ISSUES = [
  {id:"TEMP-001",title:"Achterdeur open bij vriestemperaturen",cat:"Klimaat",sev:"critical",note:"Ik snap dat je van frisse lucht houdt. Maar er is een verschil tussen ventileren en cryogene opslag."},
  {id:"LNDR-002",title:"Wasrechten ingetrokken",cat:"Huishouden",sev:"high",note:"Ik beheer complete marktplaatsplatformen. Ik moet toch een wasmachine aankunnen."},
  {id:"COMM-003",title:"Escalatiepatroon in discussies",cat:"Communicatie",sev:"medium",note:"Dit portaal bestaat omdat ik genoeg om je geef om er een hele website voor te bouwen."},
  {id:"ASK-004",title:"Angst om dingen te vragen",cat:"Verzoekbeheer",sev:"low",note:"Je hoeft nooit bang te zijn om mij iets te vragen. Submit away."},
];
const AGREEMENTS = [
  {topic:"Was Protocol v1.0",hans:["Eigen was zelfstandig","Instructies opvolgen"],partner:["Geen override zonder overleg"],violations:0,status:"concept"},
  {topic:"Deur Protocol v1.0",hans:["Deur dicht onder 10°C","Ventileren = max 5 min"],partner:["Herinneren zonder escalatie"],violations:3,status:"actief"},
  {topic:"Discussie Protocol v1.0",hans:["Niet in verdediging","Eerst luisteren"],partner:["Toon niet verhogen","Eén onderwerp"],violations:1,status:"actief"},
];
const ANALYTICS = {
  conflicts:[{w:"W1",n:4},{w:"W2",n:3},{w:"W3",n:5},{w:"W4",n:2}],
  hugs:[{w:"W1",n:12},{w:"W2",n:15},{w:"W3",n:10},{w:"W4",n:18}],
  patterns:["Conflicten pieken bij vermoeidheid (na 21:00)","Onduidelijke verwachtingen = trigger #1","Knuffel → de-escalatie in ~12 min"],
  tip:"Check-in rond 20:00 kan 40% van escalaties voorkomen.",
};

// ─── HELPERS ───────────────────────────────────────────────────
const wait = ms => new Promise(r=>setTimeout(r,ms));
function Fade({children,d=0,s={}}){return <div style={{animation:`fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) ${d}s both`,...s}}>{children}</div>}
function Label({children,c=C.textDim}){return <span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:3,color:c,display:"block",marginBottom:14}}>{children}</span>}

// ─── GLOW CARD ─────────────────────────────────────────────────
function GlowCard({children,glowColor,onClick,style:s={}}){
  const [hover,setHover]=useState(false);
  return <div
    onClick={onClick}
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{
      background:C.bgCard,
      border:`1px solid ${hover?(glowColor||C.borderGlow):C.border}`,
      borderRadius:20,padding:"24px 26px",marginBottom:16,
      cursor:onClick?"pointer":"default",
      transition:"all 0.35s ease",
      boxShadow:hover&&glowColor?`0 0 30px ${glowColor}15, inset 0 0 30px ${glowColor}05`:"none",
      position:"relative",overflow:"hidden",...s,
    }}
  >
    {/* Subtle corner glow */}
    {glowColor && <div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${glowColor}12,transparent 70%)`,pointerEvents:"none"}}/>}
    <div style={{position:"relative",zIndex:1}}>{children}</div>
  </div>;
}

// ─── NEON LINE SEPARATOR ───────────────────────────────────────
function NeonLine({color=C.rose,w="60%"}){
  return <div style={{width:w,height:1,margin:"0 auto",background:`linear-gradient(90deg,transparent,${color}44,transparent)`,marginBottom:24,marginTop:8}}/>;
}

// ─── HEART SVG ─────────────────────────────────────────────────
function Heart({leftV,rightV,size=240}){
  return <div style={{position:"relative",width:size,height:size*0.85,margin:"0 auto"}}>
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:size*1.5,height:size*1.5,borderRadius:"50%",background:`radial-gradient(circle,${C.heartGlow} 0%,transparent 60%)`,animation:"heartGlow 3s ease infinite"}}/>
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:size*1.2,height:size*1.2,borderRadius:"50%",background:`radial-gradient(circle,${C.roseGlow} 0%,transparent 50%)`,animation:"heartGlow 3s ease 0.8s infinite"}}/>
    <svg viewBox="0 0 100 90" style={{width:size,height:size*0.85,position:"relative",zIndex:2,filter:`drop-shadow(0 0 15px ${C.heartGlow})`,animation:"heartBeat 3s ease infinite"}}>
      <defs>
        <linearGradient id="hf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.heartWarm} stopOpacity="0.9"/><stop offset="100%" stopColor={C.rose} stopOpacity="0.7"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28" fill="url(#hf)" opacity="0.85"/>
      <path d="M50 85 C75 65,105 45,95 25 C88 10,70 8,50 28" fill="url(#hf)" opacity="0.75"/>
      <path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28 C70 8,88 10,95 25 C105 45,75 65,50 85Z" fill="none" stroke={C.heartWarm} strokeWidth="0.4" opacity="0.5" filter="url(#glow)"/>
      <line x1="50" y1="28" x2="50" y2="82" stroke={C.heartWarm} strokeWidth="0.2" opacity="0.2"/>
      <text x="27" y="48" textAnchor="middle" fill={C.text} fontSize="4.8" fontWeight="600" fontFamily="'Outfit',sans-serif">Cheyenne</text>
      <text x="27" y="60" textAnchor="middle" fill={C.textMuted} fontSize="3.5" fontFamily="'Outfit',sans-serif">{leftV}</text>
      <text x="73" y="48" textAnchor="middle" fill={C.text} fontSize="4.8" fontWeight="600" fontFamily="'Outfit',sans-serif">Hans</text>
      <text x="73" y="60" textAnchor="middle" fill={C.textMuted} fontSize="3.5" fontFamily="'Outfit',sans-serif">{rightV}</text>
    </svg>
  </div>;
}

// ─── PROGRESS RING ─────────────────────────────────────────────
function Ring({pct,size=130,color=C.cyan,label}){
  const r=52,circ=2*Math.PI*r,offset=circ-(pct/100)*circ;
  return <div style={{textAlign:"center"}}>
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke={C.border} strokeWidth="4"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{transition:"stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)",filter:`drop-shadow(0 0 8px ${color}44)`}}/>
      <text x="60" y="56" textAnchor="middle" fill={C.text} fontSize="22" fontWeight="300" fontFamily="'Outfit',sans-serif">{pct}%</text>
      <text x="60" y="72" textAnchor="middle" fill={C.textDim} fontSize="8" textTransform="uppercase" letterSpacing="2" fontFamily="'Outfit',sans-serif">{label}</text>
    </svg>
  </div>;
}

// ─── PREMIUM BLUR ──────────────────────────────────────────────
function PremiumBlur({children}){
  const [open,setOpen]=useState(false);
  const [anim,setAnim]=useState(false);
  const unlock=async()=>{setAnim(true);await wait(800);setOpen(true)};
  if(open) return <Fade><GlowCard glowColor={C.amber}><Label c={C.amber}>✓ Hans Premium™ — Ontgrendeld</Label><p style={{fontSize:13,color:C.textMuted,fontStyle:"italic",marginBottom:14}}>Toegang tot Hans' emotionele systeem. Gebruik verantwoord.</p>{children}</GlowCard></Fade>;
  return <GlowCard glowColor={C.amber} style={{textAlign:"center"}}>
    <div style={{filter:anim?"blur(0)":"blur(8px)",opacity:anim?1:0.3,transition:"all 0.8s ease",userSelect:"none",pointerEvents:"none",marginBottom:anim?0:12}}>{children}</div>
    {!anim&&<>
      <p style={{fontSize:13,color:C.textDim,marginBottom:4}}>Inhoud is diagnostisch complex.</p>
      <p style={{fontSize:13,color:C.textDim,marginBottom:20}}>Ontgrendel met <strong style={{color:C.amber}}>Hans Premium™</strong> — €4,95/maand</p>
      <button onClick={unlock} style={{background:C.amberGlow,border:`1px solid ${C.amber}44`,borderRadius:12,padding:"10px 28px",color:C.amber,fontSize:13,fontWeight:500,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s ease"}}>Steun Hans financieel</button>
    </>}
  </GlowCard>;
}

// ─── CINEMATIC HERO ────────────────────────────────────────────
function Hero({onEnter}){
  const [phase,setPhase]=useState(0);
  const [hs,setHs]=useState(1);
  useEffect(()=>{setTimeout(()=>setPhase(1),300);
    const hb=setInterval(()=>{setHs(1.12);setTimeout(()=>setHs(1.04),150);setTimeout(()=>setHs(1.15),280);setTimeout(()=>setHs(1),500)},1400);
    return()=>clearInterval(hb)},[]);

  return <div style={{position:"relative",width:"100%",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:C.bg}}>
    {/* Ambient layers */}
    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 35%,${C.roseGlow} 0%,transparent 50%),radial-gradient(ellipse at 30% 60%,${C.cyanGlow} 0%,transparent 40%),radial-gradient(ellipse at 70% 70%,${C.purpleGlow} 0%,transparent 40%)`,animation:"heroPulse 8s ease infinite"}}/>
    {/* Particles */}
    {[...Array(15)].map((_,i)=><div key={i} style={{position:"absolute",width:2+Math.random()*3,height:2+Math.random()*3,borderRadius:"50%",background:`rgba(232,140,160,${0.1+Math.random()*0.15})`,left:`${8+Math.random()*84}%`,top:`${8+Math.random()*84}%`,animation:`floatP ${7+Math.random()*9}s ease ${Math.random()*5}s infinite`,zIndex:1}}/>)}
    {/* Heart outline */}
    <div style={{position:"absolute",zIndex:2,top:"50%",left:"50%",transform:`translate(-50%,-50%) scale(${hs})`,transition:"transform 0.15s cubic-bezier(0.22,1,0.36,1)",opacity:phase>=1?0.1:0}}>
      <svg width="420" height="380" viewBox="0 0 100 90"><path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28 C70 8,88 10,95 25 C105 45,75 65,50 85Z" fill="none" stroke={C.rose} strokeWidth="0.3" opacity="0.6"/><path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28 C70 8,88 10,95 25 C105 45,75 65,50 85Z" fill={C.roseDim}/></svg>
    </div>
    {/* ECG */}
    <svg style={{position:"absolute",bottom:"30%",left:0,width:"100%",height:50,zIndex:2,opacity:phase>=1?0.25:0,transition:"opacity 1.5s ease 0.5s"}} viewBox="0 0 400 50" preserveAspectRatio="none">
      <path d="M0 25 L110 25 L130 25 L145 8 L155 42 L162 3 L170 47 L180 25 L200 25 L400 25" fill="none" stroke={C.rose} strokeWidth="1.2" strokeDasharray="500" strokeDashoffset="500" style={{animation:"ecgDraw 2.8s ease infinite"}}/>
    </svg>
    {/* Content */}
    <div style={{position:"relative",zIndex:3,textAlign:"center",padding:"0 32px",maxWidth:460,opacity:phase>=1?1:0,transform:phase>=1?"translateY(0)":"translateY(30px)",transition:"all 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s"}}>
      <p style={{fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:5,color:C.textDim,marginBottom:28,animation:"fadeUp 1s ease 0.6s both"}}>Een veilige plek</p>
      <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:52,fontWeight:200,color:C.text,lineHeight:1.1,letterSpacing:-1,marginBottom:16,animation:"fadeUp 1s ease 0.8s both"}}>hans<span style={{color:C.rose}}>.support</span></h1>
      <p style={{fontSize:15,color:C.textMuted,lineHeight:1.7,fontWeight:300,marginBottom:44,animation:"fadeUp 1s ease 1s both"}}>Adem in. Reik uit.<br/>Wij luisteren.</p>
      <button onClick={onEnter} style={{padding:"14px 48px",borderRadius:60,background:"transparent",border:`1px solid ${C.rose}44`,color:C.text,fontSize:14,fontWeight:400,fontFamily:"inherit",cursor:"pointer",letterSpacing:1.5,transition:"all 0.4s ease",animation:"fadeUp 1s ease 1.2s both",backdropFilter:"blur(8px)"}}
        onMouseEnter={e=>{e.target.style.background=C.roseDim;e.target.style.borderColor=C.rose+"88";e.target.style.boxShadow=`0 0 30px ${C.roseGlow}`}}
        onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.rose+"44";e.target.style.boxShadow="none"}}>
        Binnenkomen
      </button>
    </div>
    <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:3,animation:"fadeUp 1s ease 1.8s both"}}>
      <div style={{width:22,height:36,borderRadius:11,border:`1px solid ${C.textDim}44`,display:"flex",justifyContent:"center",paddingTop:8}}>
        <div style={{width:2,height:7,borderRadius:2,background:C.textDim,animation:"scrollDot 2s ease infinite"}}/>
      </div>
    </div>
  </div>;
}

// ─── BOTTOM NAV ────────────────────────────────────────────────
function BottomNav({tab,setTab}){
  const items=[
    {id:"dashboard",l:"DASHBOARD",svg:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><rect x="10.5" y="1" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="10.5" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><rect x="10.5" y="10.5" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.2"/></svg>},
    {id:"ticket",l:"TICKET",svg:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.2"/><path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>},
    {id:"issues",l:"ISSUES",svg:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>},
    {id:"afspraken",l:"AFSPRAKEN",svg:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 3v12M14 3v12M3 5h12M3 13h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>},
    {id:"inzichten",l:"INZICHTEN",svg:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="9" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="5" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="13" y="3" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>},
  ];
  return <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.bgGlass,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"6px 0 env(safe-area-inset-bottom, 6px)",zIndex:100}}>
    {items.map(it=><button key={it.id} onClick={()=>setTab(it.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"transparent",border:"none",color:tab===it.id?C.rose:C.textDim,fontSize:8,fontWeight:600,fontFamily:"inherit",cursor:"pointer",letterSpacing:1.5,transition:"color 0.2s ease"}}><span>{it.svg}</span>{it.l}</button>)}
  </div>;
}

// ─── DASHBOARD ─────────────────────────────────────────────────
function DashboardTab(){
  const [hugCount,setHugCount]=useState(0);
  const [hugSent,setHugSent]=useState(false);
  const [delayed,setDelayed]=useState(false);
  const pct=TRUST.score;
  const sendHug=()=>{setHugSent(true);setHugCount(c=>c+1);setTimeout(()=>setHugSent(false),2500)};

  return <>
    {/* Trust Ring */}
    <Fade d={0.1}><GlowCard glowColor={C.cyan}>
      <Label c={C.textDim}>Hans Trust Barometer™</Label>
      <Ring pct={pct} color={C.cyan} label="TRUST"/>
      <p style={{fontSize:13,color:C.textMuted,fontStyle:"italic",textAlign:"center",marginTop:12,marginBottom:20}}>{TRUST.status}</p>
      {/* Sparkline */}
      <div style={{display:"flex",alignItems:"end",gap:5,height:36,marginBottom:16}}>
        {TRUST.history.map((h,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
          <div style={{height:`${(h.v-55)*2}px`,background:i===TRUST.history.length-1?C.cyan:C.border,borderRadius:2,margin:"0 auto",maxWidth:20,transition:`height 0.6s ease ${i*0.05}s`,boxShadow:i===TRUST.history.length-1?`0 0 8px ${C.cyanGlow}`:"none"}}/>
          <span style={{fontSize:8,color:C.textGhost,marginTop:3,display:"block"}}>{h.l}</span>
        </div>)}
      </div>
      <NeonLine color={C.cyan}/>
      {TRUST.insights.map((ins,i)=><div key={i} style={{fontSize:12,color:C.textMuted,lineHeight:1.8,paddingLeft:16,position:"relative"}}><span style={{position:"absolute",left:0,color:C.cyan}}>→</span>{ins}</div>)}
      <p style={{fontSize:11,color:C.textDim,marginTop:14,fontStyle:"italic"}}>Hans doet z'n best. Resultaten kunnen variëren.</p>
    </GlowCard></Fade>

    {/* Heart + Hugs */}
    <Fade d={0.2}><GlowCard glowColor={C.rose}>
      <Label c={C.textDim}>Connectie Metrics</Label>
      <Heart leftV={STATS.hugsSent+hugCount} rightV={STATS.hugsRec}/>
      {STATS.hugsSent-STATS.hugsRec>2&&<div style={{background:C.roseDim,border:`1px solid ${C.rose}22`,borderRadius:12,padding:"12px 16px",margin:"16px 0",textAlign:"center"}}>
        <p style={{fontSize:12,color:C.text,lineHeight:1.6}}><span style={{color:C.rose,fontWeight:600}}>Systeemmelding:</span> Hans loopt achter op knuffels.</p>
      </div>}
      <div style={{textAlign:"center",marginTop:16}}>
        <button onClick={sendHug} style={{padding:"13px 40px",borderRadius:60,background:hugSent?C.rose+"22":"transparent",border:`1px solid ${hugSent?C.rose:C.border}`,color:hugSent?C.rose:C.textMuted,fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",transition:"all 0.4s ease",boxShadow:hugSent?`0 0 25px ${C.roseGlow}`:"none",transform:hugSent?"scale(1.03)":"scale(1)"}}>{hugSent?"💕 Signaal verzonden":"🤗 Stuur Knuffelsignaal"}</button>
        {hugCount>0&&<p style={{fontSize:11,color:C.textDim,marginTop:8,fontStyle:"italic"}}>{hugCount} signaal{hugCount>1?"en":""} deze sessie</p>}
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,marginTop:20,paddingTop:14,textAlign:"center"}}>
        {delayed?<p style={{fontSize:12,color:C.green}}>✓ Hans krijgt een herinnering.</p>
        :<button onClick={()=>setDelayed(true)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 20px",color:C.textDim,fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>Herinner Hans om me later te knuffelen</button>}
      </div>
    </GlowCard></Fade>

    {/* Hans Stats */}
    <Fade d={0.3}><GlowCard glowColor={C.purple}>
      <Label c={C.textDim}>Hans Vandaag</Label>
      {[{l:"Luisteren",v:STATS.listening,c:C.green},{l:"Besluitvaardigheid",v:STATS.decisions,c:C.amber},{l:"Deurbewustzijn",v:STATS.doors,c:C.cyan}].map((s,i)=>
        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
          <span style={{fontSize:13,color:C.textMuted}}>{s.l}</span>
          <span style={{fontSize:13,color:s.c,fontWeight:500}}>{s.v}</span>
        </div>)}
      <div style={{marginTop:22}}>
        <Label c={C.textGhost}>Achievements</Label>
        {STATS.achievements.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:a.done?1:0.35,fontSize:12,color:a.done?C.text:C.textDim}}>
          <span style={{fontSize:14}}>{a.i}</span><span>{a.t}</span>
          {a.rare&&!a.done&&<span style={{fontSize:9,background:C.amberGlow,color:C.amber,padding:"2px 8px",borderRadius:4,fontWeight:600,border:`1px solid ${C.amber}33`}}>ZELDZAAM</span>}
          {a.done&&<span style={{fontSize:9,color:C.green,marginLeft:"auto",textShadow:`0 0 6px ${C.greenGlow}`}}>✓</span>}
        </div>)}
      </div>
    </GlowCard></Fade>

    {/* Explain Hans */}
    <Fade d={0.35}><PremiumBlur>
      <div style={{textAlign:"left"}}><Label c={C.textDim}>Hans Analyse</Label>
        {[{l:"Intentie",v:"Praktisch, niet emotioneel"},{l:"Blinde vlek",v:"Onderschat impact kleine acties"},{l:"Default",v:"Probleemoplossing i.p.v. luisteren"},{l:"Gottman",v:"Verdediging bij kritiek"},{l:"Conclusie",v:"Niet kwaadaardig, gewoon Hans"}].map((x,i)=>
          <div key={i} style={{marginBottom:11}}><span style={{fontSize:10,color:C.textGhost,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:2}}>{x.l}</span><span style={{fontSize:13,color:C.text}}>→ {x.v}</span></div>)}
      </div>
    </PremiumBlur></Fade>
  </>;
}

// ─── TICKET ────────────────────────────────────────────────────
function TicketTab(){
  const [form,setForm]=useState({type:"frustrated",mood:"",msg:"",urg:"binnenkort"});
  const [done,setDone]=useState(false);const [loading,setLoading]=useState(false);const [resp,setResp]=useState("");const [crit,setCrit]=useState(false);const [dots,setDots]=useState("");
  useEffect(()=>{setCrit(isCrit(form.msg))},[form.msg]);
  useEffect(()=>{if(!loading)return;const iv=setInterval(()=>setDots(d=>d.length>=3?"":d+"."),400);return()=>clearInterval(iv)},[loading]);
  const go=async()=>{if(!form.msg.trim())return;setLoading(true);setDone(true);const c=isCrit(form.msg);
    const tM={frustrated:"Frustratie",request:"Wens",boundary:"Grensgesprek",appreciation:"Waardering"};
    const uM={vandaag:"voor het slapengaan",binnenkort:"binnen 24 uur",reflectie:"ter reflectie"};
    const prompt=c?`AI-crisisprotocol hans.support. KRITIEK INCIDENT (deur/kou). Bericht: "${form.msg}". Stemming: ${form.mood||"?"}. Nederlands, geen markdown:\n\n⚠️ KRITIEK INCIDENT\n\nOBSERVATIE:\n→ [NVC 1]\n\nGEVOEL:\n→ [NVC 2]\n\nBEHOEFTE:\n→ [NVC 3]\n\nACTIE:\n→ [NVC 4]\n\nCOMPENSATIE:\n→ [warm]\n\nGeen humor. Max 100w.`
    :`AI-mediator hans.support. Kalm, premium. NVC+Gottman. Context: achterdeur/kou, wasrechten, escalatie. Ticket: "${tM[form.type]}". Stemming: ${form.mood||"?"}. Urgentie: ${uM[form.urg]}. Bericht: "${form.msg}"\n\nNederlands, geen markdown:\n\nWAT IK HOOR:\n→ [valideer]\n\nNVC-VERTALING:\nObservatie → ...\nGevoel → ...\nBehoefte → ...\nVerzoek → ...\n\nACTIE VOOR HANS:\n→ [concreet]\n\nMax 150w.`;
    try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});const d=await r.json();setResp(d.content?.map(b=>b.text||"").join("")||"Je gevoelens zijn geldig.")}catch{setResp("WAT IK HOOR:\n→ Iets belangrijks.\n\nACTIE VOOR HANS:\n→ Luister.")}setLoading(false)};
  const reset=()=>{setForm({type:"frustrated",mood:"",msg:"",urg:"binnenkort"});setDone(false);setResp("");setCrit(false)};

  if(done) return <Fade><GlowCard glowColor={crit?C.red:C.cyan}><Label c={crit?C.red:C.cyan}>{crit?"⚠️ Kritiek Incident":"hans.support AI Mediator"}</Label>
    {loading?<div><p style={{fontSize:13,color:C.textMuted}}>{crit?"Prioriteit escalatie":"Verwerken"}{dots}</p></div>
    :<div style={{fontSize:13,color:C.text,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{resp}</div>}
    {!loading&&<button onClick={reset} style={{marginTop:20,background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 22px",color:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>Nog een ticket</button>}
  </GlowCard></Fade>;

  const TypeBtn=({val,icon,label})=><button onClick={()=>setForm(f=>({...f,type:val}))} style={{
    padding:"16px 0",background:form.type===val?C.roseDim:"transparent",border:`1px solid ${form.type===val?C.rose+"44":C.border}`,
    borderRadius:16,color:form.type===val?C.rose:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer",
    transition:"all 0.25s ease",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8,
  }}><span style={{fontSize:22,filter:form.type===val?`drop-shadow(0 0 8px ${C.roseGlow})`:""}}>{icon}</span>{label}</button>;

  const MoodPill=({m})=><button onClick={()=>setForm(f=>({...f,mood:m}))} style={{
    padding:"7px 16px",background:form.mood===m?C.cyanDim:"transparent",border:`1px solid ${form.mood===m?C.cyan+"33":C.border}`,
    borderRadius:20,color:form.mood===m?C.cyan:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s ease",
  }}>{m}</button>;

  return <div>
    <Fade><div style={{textAlign:"center",marginBottom:28}}>
      <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:200,color:C.text,marginBottom:8,lineHeight:1.3}}>De Digitale<br/><span style={{color:C.rose}}>Schuilplaats</span></h2>
      <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>Neem de tijd. We luisteren.</p>
    </div></Fade>
    <GlowCard glowColor={C.rose}>
      {crit&&<div style={{background:C.redGlow,border:`1px solid ${C.red}33`,borderRadius:14,padding:"12px 16px",marginBottom:20,animation:"fadeUp 0.3s ease"}}>
        <span style={{fontSize:10,fontWeight:700,color:C.red,textTransform:"uppercase",letterSpacing:2}}>⚠️ Kritiek Incident</span>
      </div>}
      <Label>Categorie van reflectie</Label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
        <TypeBtn val="frustrated" icon="💔" label="Frustratie"/>
        <TypeBtn val="request" icon="✨" label="Wens"/>
        <TypeBtn val="boundary" icon="⚖️" label="Grensgesprek"/>
        <TypeBtn val="appreciation" icon="❤️" label="Waardering"/>
      </div>
      <Label>Hoe voelt het nu?</Label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
        {["Kalm","Onrustig","Vastgelopen","Gehoord","Nieuwsgierig","Moe","Boos"].map(m=><MoodPill key={m} m={m}/>)}
      </div>
      <Label>Jouw verhaal</Label>
      <textarea value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} placeholder="Schrijf het van je af..."
        style={{width:"100%",minHeight:120,background:C.bgSurface,border:`1px solid ${crit?C.red+"33":C.border}`,borderRadius:14,padding:16,color:C.text,fontSize:14,fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.7,boxSizing:"border-box"}}/>
      <div style={{marginTop:24,marginBottom:20}}>
        <Label>Dringendheid</Label>
        <div style={{display:"flex",gap:14}}>
          {[{v:"vandaag",l:"Vandaag"},{v:"binnenkort",l:"Binnenkort"},{v:"reflectie",l:"Ter reflectie"}].map(u=>
            <label key={u.v} onClick={()=>setForm(f=>({...f,urg:u.v}))} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:form.urg===u.v?C.text:C.textDim,transition:"color 0.2s ease"}}>
              <span style={{width:16,height:16,borderRadius:"50%",border:`1.5px solid ${form.urg===u.v?C.rose:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s ease",boxShadow:form.urg===u.v?`0 0 8px ${C.roseGlow}`:"none"}}>
                {form.urg===u.v&&<span style={{width:6,height:6,borderRadius:"50%",background:C.rose}}/>}
              </span>{u.l}
            </label>)}
        </div>
      </div>
      <NeonLine color={C.rose} w="40%"/>
      <div style={{background:C.bgSurface,borderRadius:14,padding:"14px 18px",marginBottom:18,textAlign:"center"}}>
        <p style={{fontSize:13,color:C.textMuted,fontStyle:"italic"}}>"Hans is momenteel aan het nadenken. Geen haast."</p>
      </div>
      <button onClick={go} disabled={!form.msg.trim()} style={{
        width:"100%",padding:"15px",borderRadius:14,
        background:form.msg.trim()?(crit?C.red:C.rose):"transparent",
        border:`1px solid ${form.msg.trim()?(crit?C.red:C.rose):C.border}`,
        color:form.msg.trim()?"#fff":C.textDim,fontSize:14,fontWeight:500,fontFamily:"inherit",
        cursor:form.msg.trim()?"pointer":"default",transition:"all 0.3s ease",
        boxShadow:form.msg.trim()?`0 0 20px ${crit?C.redGlow:C.roseGlow}`:"none",
      }}>{crit?"⚠️ Kritiek Ticket":"Verzend naar de Sanctuary"}</button>
    </GlowCard>
  </div>;
}

// ─── ISSUES ────────────────────────────────────────────────────
function IssuesTab(){
  const [exp,setExp]=useState(null);
  const sc={critical:C.red,high:C.amber,medium:C.cyan,low:C.green};
  const sl={critical:"KRITIEK",high:"HOOG",medium:"MEDIUM",low:"LAAG"};
  return <div>
    <Fade><p style={{fontSize:12,color:C.textDim,lineHeight:1.7,marginBottom:20}}>Bekende problemen in het Hans Operating System.</p></Fade>
    {ISSUES.map((is,i)=><Fade key={is.id} d={i*0.06}><GlowCard glowColor={sc[is.sev]} onClick={()=>setExp(exp===i?null:i)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:10,color:C.textGhost,fontFamily:"monospace",letterSpacing:1}}>{is.id}</span>
        <span style={{fontSize:9,fontWeight:700,color:sc[is.sev],textTransform:"uppercase",letterSpacing:1.5,textShadow:`0 0 8px ${sc[is.sev]}44`}}>{sl[is.sev]}</span>
      </div>
      <h3 style={{fontSize:14,fontWeight:500,color:C.text,margin:"0 0 4px"}}>{is.title}</h3>
      <span style={{fontSize:11,color:C.textDim}}>{is.cat}</span>
      {exp===i&&<div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,animation:"fadeUp 0.4s ease"}}>
        <Label c={C.rose}>Hans reageert</Label>
        <p style={{fontSize:13,color:C.textMuted,lineHeight:1.8,fontStyle:"italic"}}>"{is.note}"</p>
      </div>}
    </GlowCard></Fade>)}
  </div>;
}

// ─── AGREEMENTS ────────────────────────────────────────────────
function AgreementsTab(){
  const [exp,setExp]=useState(null);
  return <div>
    <Fade><p style={{fontSize:12,color:C.textDim,lineHeight:1.7,marginBottom:20}}>Afspraken die herhalende discussies omzetten in systemen.</p></Fade>
    {AGREEMENTS.map((ag,i)=><Fade key={i} d={i*0.06}><GlowCard glowColor={ag.status==="actief"?C.green:C.amber} onClick={()=>setExp(exp===i?null:i)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h3 style={{fontSize:14,fontWeight:500,color:C.text,margin:0}}>{ag.topic}</h3><span style={{fontSize:11,color:C.textDim}}>{ag.violations} overtredingen</span></div>
        <span style={{fontSize:10,fontWeight:600,color:ag.status==="actief"?C.green:C.amber,textTransform:"uppercase",letterSpacing:1,textShadow:`0 0 6px ${ag.status==="actief"?C.greenGlow:C.amberGlow}`}}>{ag.status}</span>
      </div>
      {exp===i&&<div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${C.border}`,animation:"fadeUp 0.4s ease",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><Label c={C.cyan}>Hans</Label>{ag.hans.map((r,j)=><p key={j} style={{fontSize:12,color:C.textMuted,lineHeight:1.7,paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:0,color:C.cyan}}>→</span>{r}</p>)}</div>
        <div><Label c={C.rose}>Partner</Label>{ag.partner.map((r,j)=><p key={j} style={{fontSize:12,color:C.textMuted,lineHeight:1.7,paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:0,color:C.rose}}>→</span>{r}</p>)}</div>
      </div>}
    </GlowCard></Fade>)}
  </div>;
}

// ─── ANALYTICS ─────────────────────────────────────────────────
function AnalyticsTab(){
  const mC=Math.max(...ANALYTICS.conflicts.map(w=>w.n)),mH=Math.max(...ANALYTICS.hugs.map(w=>w.n));
  return <div>
    <Fade d={0.05}><GlowCard glowColor={C.purple}>
      <Label>Weekoverzicht</Label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}}>
        <div><span style={{fontSize:11,color:C.rose}}>Conflicten</span>
          <div style={{display:"flex",alignItems:"end",gap:6,height:50,marginTop:10}}>
            {ANALYTICS.conflicts.map((w,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:`${(w.n/mC)*42}px`,background:C.roseDim,border:`1px solid ${C.rose}22`,borderRadius:3,boxShadow:`0 0 6px ${C.roseDim}`}}/><span style={{fontSize:8,color:C.textGhost,display:"block",marginTop:3}}>{w.w}</span></div>)}
          </div>
        </div>
        <div><span style={{fontSize:11,color:C.green}}>Knuffels</span>
          <div style={{display:"flex",alignItems:"end",gap:6,height:50,marginTop:10}}>
            {ANALYTICS.hugs.map((w,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:`${(w.n/mH)*42}px`,background:C.greenGlow,border:`1px solid ${C.green}22`,borderRadius:3,boxShadow:`0 0 6px ${C.greenGlow}`}}/><span style={{fontSize:8,color:C.textGhost,display:"block",marginTop:3}}>{w.w}</span></div>)}
          </div>
        </div>
      </div>
    </GlowCard></Fade>
    <Fade d={0.1}><GlowCard glowColor={C.cyan}>
      <Label>AI Inzichten</Label>
      {ANALYTICS.patterns.map((p,i)=><div key={i} style={{fontSize:12,color:C.textMuted,lineHeight:1.8,paddingLeft:16,position:"relative",marginBottom:4}}><span style={{position:"absolute",left:0,color:C.cyan,textShadow:`0 0 6px ${C.cyanGlow}`}}>→</span>{p}</div>)}
      <div style={{background:C.greenGlow,border:`1px solid ${C.green}22`,borderRadius:12,padding:"12px 16px",marginTop:14}}>
        <Label c={C.green}>Aanbeveling</Label>
        <p style={{fontSize:12,color:C.text,lineHeight:1.7}}>{ANALYTICS.tip}</p>
      </div>
    </GlowCard></Fade>
  </div>;
}

// ─── APP ───────────────────────────────────────────────────────
export default function App(){
  const [entered,setEntered]=useState(false);
  const [tab,setTab]=useState("dashboard");

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap');
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes heartBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    @keyframes heartGlow{0%,100%{opacity:0.3;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.55;transform:translate(-50%,-50%) scale(1.06)}}
    @keyframes heroPulse{0%,100%{opacity:1}50%{opacity:0.8}}
    @keyframes floatP{0%,100%{transform:translateY(0) translateX(0);opacity:0.15}50%{transform:translateY(-25px) translateX(12px);opacity:0.35}}
    @keyframes ecgDraw{0%{stroke-dashoffset:500}40%{stroke-dashoffset:0}100%{stroke-dashoffset:-500}}
    @keyframes scrollDot{0%{transform:translateY(0);opacity:0.5}50%{transform:translateY(10px);opacity:0.15}100%{transform:translateY(0);opacity:0.5}}
    *{box-sizing:border-box;margin:0;padding:0}
    ::selection{background:${C.rose}33}
    textarea::placeholder{color:${C.textDim}}
    body{background:${C.bg};overflow-x:hidden}
    ::-webkit-scrollbar{width:0;height:0}
  `;

  if(!entered) return <><style>{css}</style><Hero onEnter={()=>setEntered(true)}/></>;

  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit','Segoe UI',sans-serif",color:C.text,paddingBottom:72}}>
    <style>{css}</style>
    {/* Ambient background glows */}
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
      background:`radial-gradient(ellipse at 50% 20%,${C.roseDim} 0%,transparent 50%),radial-gradient(ellipse at 20% 80%,${C.cyanDim} 0%,transparent 40%),radial-gradient(ellipse at 80% 60%,${C.purpleGlow} 0%,transparent 40%)`
    }}/>
    {/* Top bar */}
    <Fade><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 22px",maxWidth:500,margin:"0 auto",position:"relative",zIndex:2}}>
      <span style={{fontSize:15,fontWeight:300,color:C.text,fontFamily:"'Outfit',sans-serif",letterSpacing:1}}>hans<span style={{color:C.rose}}>.support</span></span>
      <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.rose}44,${C.purple}44)`,border:`1px solid ${C.rose}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:C.rose,fontSize:12,fontWeight:600}}>H</span>
      </div>
    </div></Fade>
    <div style={{maxWidth:500,margin:"0 auto",padding:"0 18px",position:"relative",zIndex:1}}>
      <div key={tab} style={{animation:"fadeUp 0.5s ease",minHeight:400}}>
        {tab==="dashboard"&&<DashboardTab/>}
        {tab==="ticket"&&<TicketTab/>}
        {tab==="issues"&&<IssuesTab/>}
        {tab==="afspraken"&&<AgreementsTab/>}
        {tab==="inzichten"&&<AnalyticsTab/>}
      </div>
      <footer style={{textAlign:"center",padding:"36px 0 20px",marginTop:28}}>
        <p style={{fontSize:11,color:C.textDim,lineHeight:1.7,fontStyle:"italic",maxWidth:300,margin:"0 auto"}}>"Ik heb dit niet gebouwd om discussies te winnen. Ik heb dit gebouwd omdat ik wil dat we elkaar beter begrijpen."</p>
        <p style={{fontSize:9,color:C.textGhost,marginTop:12}}>Privé tussen jou en Hans · v7.0</p>
      </footer>
    </div>
    <BottomNav tab={tab} setTab={setTab}/>
  </div>;
}
