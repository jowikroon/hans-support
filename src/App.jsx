import { useState, useEffect, useRef } from "react";

/*
 * hans.support — v8.0 SANCTUARY
 * Cinematic hero → Full-screen heart → Slide menu
 * Lovable-level polish meets psychological depth
 */

// ─── PALETTE ───────────────────────────────────────────────────
const C = {
  bg: "#0b0b12", bgCard: "#111119", bgSurface: "#0e0e16",
  bgGlass: "rgba(16,16,26,0.82)", border: "#1c1c30", borderGlow: "#28284a",
  rose: "#e88ca0", roseGlow: "rgba(232,140,160,0.18)", roseDim: "rgba(232,140,160,0.08)", roseBright: "#f5a0b4",
  cyan: "#7ec8d4", cyanGlow: "rgba(126,200,212,0.12)", cyanDim: "rgba(126,200,212,0.06)",
  amber: "#d4b87e", amberGlow: "rgba(212,184,126,0.12)",
  green: "#7ed4a0", greenGlow: "rgba(126,212,160,0.12)",
  red: "#d47e7e", redGlow: "rgba(212,126,126,0.15)",
  purple: "#a08cd4", purpleGlow: "rgba(160,140,212,0.1)",
  text: "#e8e4f0", textMuted: "#8a86a0", textDim: "#5c5872", textGhost: "#3a3652",
  heartWarm: "#f4d4c4", heartPeach: "#f0bca8", heartGlow: "rgba(244,212,196,0.25)",
};

// ─── DATA ──────────────────────────────────────────────────────
const CRIT_WORDS = ["koud","deur","vriest","achterdeur","ijskoud","tocht","onveilig"];
const isCrit = t => CRIT_WORDS.some(w => t.toLowerCase().includes(w));
const TRUST = { score:72, status:"Betrouwbaar maar licht chaotisch", insights:["Verbetert na feedback","Zwak punt: consistentie (deuren)","Sterk punt: intentie & inzet"], history:[{l:"Ma",v:68},{l:"Di",v:71},{l:"Wo",v:65},{l:"Do",v:70},{l:"Vr",v:74},{l:"Za",v:72},{l:"Nu",v:72}] };
const STATS = { hugsSent:25,hugsRec:20,listening:"verbeterend",decisions:"twijfelachtig",doors:"wordt onderzocht ❄️",
  achievements:[{t:"Discussie niet laten escaleren",done:true,i:"🏆"},{t:"Volledig geluisterd (30+ min)",done:true,i:"👂"},{t:"Deur dicht in de winter",done:false,i:"🚪",rare:true},{t:"Was correct gedaan",done:false,i:"🧺",rare:true},{t:"Als eerste schuld toegegeven",done:true,i:"🤝"},{t:"Knuffel geïnitieerd na conflict",done:true,i:"🤗"}]};
const ISSUES = [
  {id:"TEMP-001",title:"Achterdeur open bij vriestemperaturen",cat:"Klimaat",sev:"critical",note:"Ik snap dat je van frisse lucht houdt. Maar er is een verschil tussen ventileren en cryogene opslag."},
  {id:"LNDR-002",title:"Wasrechten ingetrokken",cat:"Huishouden",sev:"high",note:"Ik beheer complete marktplaatsplatformen. Ik moet toch een wasmachine aankunnen."},
  {id:"COMM-003",title:"Escalatiepatroon in discussies",cat:"Communicatie",sev:"medium",note:"Dit portaal bestaat omdat ik genoeg om je geef om er een hele website voor te bouwen."},
  {id:"ASK-004",title:"Angst om dingen te vragen",cat:"Verzoekbeheer",sev:"low",note:"Je hoeft nooit bang te zijn om mij iets te vragen."},
];
const AGREEMENTS = [
  {topic:"Was Protocol v1.0",hans:["Eigen was zelfstandig","Instructies opvolgen"],partner:["Geen override"],violations:0,status:"concept"},
  {topic:"Deur Protocol v1.0",hans:["Deur dicht onder 10°C","Ventileren max 5 min"],partner:["Herinneren zonder escalatie"],violations:3,status:"actief"},
  {topic:"Discussie Protocol v1.0",hans:["Niet in verdediging","Eerst luisteren"],partner:["Toon niet verhogen"],violations:1,status:"actief"},
];
const ANALYTICS = {
  conflicts:[{w:"W1",n:4},{w:"W2",n:3},{w:"W3",n:5},{w:"W4",n:2}],
  hugs:[{w:"W1",n:12},{w:"W2",n:15},{w:"W3",n:10},{w:"W4",n:18}],
  patterns:["Conflicten pieken bij vermoeidheid (na 21:00)","Onduidelijke verwachtingen = trigger #1","Knuffel → de-escalatie in ~12 min"],
  tip:"Check-in rond 20:00 kan 40% van escalaties voorkomen.",
};

// ─── HELPERS ───────────────────────────────────────────────────
const wait = ms => new Promise(r=>setTimeout(r,ms));
function Fade({children,d=0,s={}}){return <div style={{animation:`fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s both`,...s}}>{children}</div>}
function Label({children,c=C.textDim}){return <span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:3,color:c,display:"block",marginBottom:14}}>{children}</span>}
function Card({children,glow,onClick,s={}}){
  return <div onClick={onClick} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:22,padding:"26px 28px",marginBottom:18,cursor:onClick?"pointer":"default",transition:"all 0.3s ease",position:"relative",overflow:"hidden",...s}}>
    {glow&&<div style={{position:"absolute",top:-50,right:-50,width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle,${glow}15,transparent 70%)`,pointerEvents:"none"}}/>}
    <div style={{position:"relative",zIndex:1}}>{children}</div>
  </div>;
}
function NeonLine({color=C.rose,w="50%"}){return <div style={{width:w,height:1,margin:"12px auto",background:`linear-gradient(90deg,transparent,${color}55,transparent)`}}/>}

// ─── CINEMATIC HERO ────────────────────────────────────────────
function Hero({onEnter}){
  const [phase,setPhase]=useState(0);
  const [hs,setHs]=useState(1);
  useEffect(()=>{setTimeout(()=>setPhase(1),400);
    const hb=setInterval(()=>{setHs(1.12);setTimeout(()=>setHs(1.04),150);setTimeout(()=>setHs(1.14),280);setTimeout(()=>setHs(1),500)},1500);
    return()=>clearInterval(hb)},[]);
  return <div style={{position:"relative",width:"100%",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:C.bg}}>
    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 40%,${C.roseGlow} 0%,transparent 55%),radial-gradient(ellipse at 30% 65%,${C.cyanDim} 0%,transparent 40%),radial-gradient(ellipse at 70% 30%,${C.purpleGlow} 0%,transparent 35%)`,animation:"heroPulse 8s ease infinite"}}/>
    {[...Array(12)].map((_,i)=><div key={i} style={{position:"absolute",width:2+Math.random()*3,height:2+Math.random()*3,borderRadius:"50%",background:`rgba(232,140,160,${0.08+Math.random()*0.12})`,left:`${10+Math.random()*80}%`,top:`${10+Math.random()*80}%`,animation:`floatP ${8+Math.random()*10}s ease ${Math.random()*5}s infinite`,zIndex:1}}/>)}
    <div style={{position:"absolute",zIndex:2,top:"50%",left:"50%",transform:`translate(-50%,-50%) scale(${hs})`,transition:"transform 0.15s cubic-bezier(0.22,1,0.36,1)",opacity:phase>=1?0.08:0}}>
      <svg width="450" height="400" viewBox="0 0 100 90"><path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28 C70 8,88 10,95 25 C105 45,75 65,50 85Z" fill="none" stroke={C.rose} strokeWidth="0.3" opacity="0.5"/><path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28 C70 8,88 10,95 25 C105 45,75 65,50 85Z" fill={C.roseDim}/></svg>
    </div>
    <svg style={{position:"absolute",bottom:"28%",left:0,width:"100%",height:50,zIndex:2,opacity:phase>=1?0.2:0,transition:"opacity 1.5s ease 0.6s"}} viewBox="0 0 400 50" preserveAspectRatio="none">
      <path d="M0 25 L115 25 L135 25 L148 8 L158 42 L165 3 L173 47 L183 25 L205 25 L400 25" fill="none" stroke={C.rose} strokeWidth="1" strokeDasharray="500" strokeDashoffset="500" style={{animation:"ecgDraw 3s ease infinite"}}/>
    </svg>
    <div style={{position:"relative",zIndex:3,textAlign:"center",padding:"0 36px",maxWidth:440,opacity:phase>=1?1:0,transform:phase>=1?"translateY(0)":"translateY(30px)",transition:"all 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s"}}>
      <p style={{fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:6,color:C.textDim,marginBottom:32,animation:"fadeUp 1s ease 0.7s both"}}>Een veilige plek</p>
      <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:200,color:C.text,lineHeight:1.1,letterSpacing:-1,marginBottom:14,animation:"fadeUp 1s ease 0.9s both"}}>hans<span style={{color:C.rose}}>.support</span></h1>
      <p style={{fontSize:15,color:C.textMuted,lineHeight:1.8,fontWeight:300,marginBottom:48,animation:"fadeUp 1s ease 1.1s both"}}>Adem in. Reik uit.<br/>Wij luisteren.</p>
      <button onClick={onEnter} style={{padding:"15px 52px",borderRadius:60,background:"transparent",border:`1px solid ${C.rose}33`,color:C.text,fontSize:14,fontWeight:400,fontFamily:"inherit",cursor:"pointer",letterSpacing:2,transition:"all 0.4s ease",animation:"fadeUp 1s ease 1.3s both",backdropFilter:"blur(8px)"}}
        onMouseEnter={e=>{e.target.style.background=C.roseDim;e.target.style.borderColor=C.rose+"77";e.target.style.boxShadow=`0 0 35px ${C.roseGlow}`}}
        onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.rose+"33";e.target.style.boxShadow="none"}}>Binnenkomen</button>
    </div>
    <div style={{position:"absolute",bottom:30,left:"50%",transform:"translateX(-50%)",zIndex:3,animation:"fadeUp 1s ease 2s both"}}>
      <div style={{width:22,height:36,borderRadius:11,border:`1px solid ${C.textGhost}`,display:"flex",justifyContent:"center",paddingTop:8}}>
        <div style={{width:2,height:7,borderRadius:2,background:C.textDim,animation:"scrollDot 2s ease infinite"}}/>
      </div>
    </div>
  </div>;
}

// ─── FULL SCREEN HEART LANDING ─────────────────────────────────
function HeartLanding({onNavigate,hugCount,onHug,hugSent}){
  return <div style={{minHeight:"85vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 24px 32px",textAlign:"center"}}>
    <Fade><p style={{fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:5,color:C.textDim,marginBottom:16}}>Welkom terug</p></Fade>
    <Fade d={0.1}><h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:34,fontWeight:200,color:C.text,lineHeight:1.2,marginBottom:6}}>Cheyenne's</h2></Fade>
    <Fade d={0.15}><h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:34,fontWeight:200,color:C.rose,lineHeight:1.2,marginBottom:8}}>Heartbeat Hub</h2></Fade>
    <Fade d={0.2}><p style={{fontSize:14,color:C.textMuted,fontWeight:300,marginBottom:40}}>Adem in en reik uit</p></Fade>

    {/* BIG HEART — SVG shape + HTML text overlay for crisp readability */}
    <Fade d={0.3}><div style={{position:"relative",width:300,height:270,margin:"0 auto 28px"}}>
      {/* Glow layers */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:420,height:420,borderRadius:"50%",background:`radial-gradient(circle,${C.heartGlow} 0%,transparent 55%)`,animation:"heartGlow 3s ease infinite"}}/>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:360,height:360,borderRadius:"50%",background:`radial-gradient(circle,${C.roseGlow} 0%,transparent 45%)`,animation:"heartGlow 3s ease 0.7s infinite"}}/>
      {/* Heart shape only — no text in SVG */}
      <svg viewBox="0 0 100 90" style={{width:300,height:270,position:"relative",zIndex:2,filter:`drop-shadow(0 0 20px ${C.heartGlow})`,animation:"heartBeat 3s ease infinite"}}>
        <defs>
          <linearGradient id="hf8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.heartWarm} stopOpacity="0.92"/><stop offset="100%" stopColor={C.heartPeach} stopOpacity="0.78"/></linearGradient>
          <filter id="glow8"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28" fill="url(#hf8)" opacity="0.88"/>
        <path d="M50 85 C75 65,105 45,95 25 C88 10,70 8,50 28" fill="url(#hf8)" opacity="0.78"/>
        <path d="M50 85 C25 65,-5 45,5 25 C12 10,30 8,50 28 C70 8,88 10,95 25 C105 45,75 65,50 85Z" fill="none" stroke={C.heartWarm} strokeWidth="0.35" opacity="0.4" filter="url(#glow8)"/>
        <line x1="50" y1="30" x2="50" y2="80" stroke={C.heartWarm} strokeWidth="0.15" opacity="0.15"/>
      </svg>
      {/* HTML text overlays — crisp, scalable, always readable */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:3,display:"flex",pointerEvents:"none",animation:"heartBeat 3s ease infinite"}}>
        {/* Left half — Cheyenne */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:20,paddingRight:8}}>
          <span style={{fontSize:16,fontWeight:600,color:"#4a2820",letterSpacing:0.5,marginBottom:6}}>Cheyenne</span>
          <span style={{fontSize:11,color:"#6a4838",opacity:0.8,lineHeight:1.4}}>Knuffels</span>
          <span style={{fontSize:11,color:"#6a4838",opacity:0.8,marginBottom:4}}>gegeven:</span>
          <span style={{fontSize:32,fontWeight:700,color:"#3a1810",lineHeight:1}}>{STATS.hugsSent+hugCount}</span>
        </div>
        {/* Right half — Hans */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:20,paddingLeft:8}}>
          <span style={{fontSize:16,fontWeight:600,color:"#4a2820",letterSpacing:0.5,marginBottom:6}}>Hans</span>
          <span style={{fontSize:11,color:"#6a4838",opacity:0.8,lineHeight:1.4}}>Knuffels</span>
          <span style={{fontSize:11,color:"#6a4838",opacity:0.8,marginBottom:4}}>gehad:</span>
          <span style={{fontSize:32,fontWeight:700,color:"#3a1810",lineHeight:1}}>{STATS.hugsRec}</span>
        </div>
      </div>
    </div></Fade>

    {/* Hug button */}
    <Fade d={0.4}>
      <button onClick={onHug} style={{
        padding:"14px 44px",borderRadius:60,background:hugSent?C.rose+"22":"transparent",
        border:`1px solid ${hugSent?C.rose:C.border}`,color:hugSent?C.rose:C.textMuted,
        fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",transition:"all 0.4s ease",
        boxShadow:hugSent?`0 0 30px ${C.roseGlow}`:"none",marginBottom:12,
      }}>{hugSent?"💕 Signaal verzonden":"🤗 Stuur Knuffelsignaal"}</button>
      {hugCount>0&&<p style={{fontSize:11,color:C.textDim,fontStyle:"italic"}}>{hugCount} signaal{hugCount>1?"en":""} deze sessie</p>}
    </Fade>

    {/* Main CTA */}
    <Fade d={0.5}><div style={{width:"100%",maxWidth:360,marginTop:40}}>
      <button onClick={()=>onNavigate("ticket")} style={{
        width:"100%",padding:"18px",borderRadius:16,background:C.bgCard,
        border:`1px solid ${C.border}`,color:C.text,fontSize:16,fontWeight:500,
        fontFamily:"inherit",cursor:"pointer",transition:"all 0.3s ease",
        boxShadow:`0 0 0 0 ${C.roseGlow}`,
      }}
      onMouseEnter={e=>{e.target.style.borderColor=C.rose+"55";e.target.style.boxShadow=`0 0 25px ${C.roseGlow}`}}
      onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none"}}>
        Log Incident
      </button>
    </div></Fade>

    {/* Quick links */}
    <Fade d={0.6}><div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap",justifyContent:"center"}}>
      {[{id:"trust",l:"Trust Score",c:C.cyan},{id:"issues",l:"Bekende Issues",c:C.amber},{id:"afspraken",l:"Afspraken",c:C.green}].map(q=>
        <button key={q.id} onClick={()=>onNavigate(q.id)} style={{padding:"8px 18px",borderRadius:20,background:"transparent",border:`1px solid ${C.border}`,color:C.textDim,fontSize:11,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s ease",letterSpacing:0.5}}
          onMouseEnter={e=>{e.target.style.borderColor=q.c+"44";e.target.style.color=q.c}}
          onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.textDim}}>
          {q.l}
        </button>
      )}
    </div></Fade>

    {/* ─── 5-STAR REVIEWS ─── */}
    <Fade d={0.7}><div style={{width:"100%",maxWidth:400,marginTop:48}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:3,color:C.textDim}}>Reviews</span>
        <span style={{fontSize:13,color:C.amber}}>★★★★★</span>
        <span style={{fontSize:11,color:C.textDim}}>5/5 reeten</span>
      </div>
      <p style={{fontSize:10,color:C.textGhost,textAlign:"center",marginBottom:20}}>Gebaseerd op 1 relatie en 0 alternatieven</p>

      {[
        {name:"Cheyenne",time:"2 dagen geleden",stars:5,text:"Hans liet de achterdeur open bij -3°C. Ik diende een ticket in. Binnen 8 minuten stond hij met een dekentje, warme chocolademelk én excuses. 10/10 incident response, dikke billen service.",verified:true},
        {name:"Hans z'n moeder",time:"1 week geleden",stars:5,text:"Eindelijk een platform waar mijn zoon z'n leven op orde krijgt. Had dit 25 jaar eerder moeten bestaan. Die jongen kan nog steeds geen was draaien maar hij heeft er nu tenminste een protocol voor.",verified:false},
        {name:"De Achterdeur",time:"3 weken geleden",stars:5,text:"Sinds hans.support word ik eindelijk serieus genomen. Voorheen stond ik uren open in de vrieskou. Nu krijg ik een KRITIEK INCIDENT status. Respect.",verified:true},
        {name:"Rik",time:"1 maand geleden",stars:5,text:"Hans vertelde me over dit project. Ik dacht dat het een grap was. Toen zag ik de Trust Barometer, de NVC-engine, en het Agreement Protocol voor de was. Dit is geen website. Dit is therapie met CSS.",verified:false},
        {name:"De Wasmachine",time:"2 maanden geleden",stars:5,text:"Hans heeft me nog nooit aangeraakt. Ik sta hier maar. Te wachten. Het Was Protocol v1.0 geeft me hoop dat we ooit een connectie zullen hebben. Status: concept. Net als onze relatie.",verified:true},
      ].map((r,i)=>
        <Fade key={i} d={0.75+i*0.08}><div style={{
          background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,
          padding:"18px 20px",marginBottom:10,textAlign:"left",
          transition:"all 0.3s ease",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>{r.name}</span>
              {r.verified&&<span style={{fontSize:9,color:C.green,background:C.greenGlow,padding:"2px 6px",borderRadius:4,fontWeight:600}}>✓ GEVERIFIEERD</span>}
            </div>
            <span style={{fontSize:10,color:C.textGhost}}>{r.time}</span>
          </div>
          <div style={{marginBottom:8}}>
            <span style={{fontSize:12,color:C.amber,letterSpacing:2}}>{"★".repeat(r.stars)}</span>
            <span style={{fontSize:10,color:C.textDim,marginLeft:6}}>{r.stars}/5 reeten</span>
          </div>
          <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7,margin:0}}>{r.text}</p>
        </div></Fade>
      )}

      <Fade d={1.2}><p style={{fontSize:10,color:C.textGhost,textAlign:"center",marginTop:12,fontStyle:"italic"}}>
        "Dikke billen, dik vertrouwen." — hans.support marketing afdeling (1 persoon)
      </p></Fade>
    </div></Fade>
  </div>;
}

// ─── SLIDE MENU ────────────────────────────────────────────────
function SlideMenu({open,onClose,onNavigate,current}){
  const items=[{id:"home",l:"Home",i:"♥"},{id:"ticket",l:"Nieuw Ticket",i:"✦"},{id:"trust",l:"Trust Score",i:"◎"},{id:"issues",l:"Bekende Issues",i:"⚡"},{id:"afspraken",l:"Afspraken",i:"⬡"},{id:"inzichten",l:"Inzichten",i:"◈"},{id:"hans",l:"Hans Analyse",i:"◉"}];
  return <>
    {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,animation:"fadeIn 0.3s ease",backdropFilter:"blur(4px)"}}/>}
    <div style={{position:"fixed",top:0,left:0,bottom:0,width:280,background:C.bgCard,borderRight:`1px solid ${C.border}`,zIndex:201,transform:open?"translateX(0)":"translateX(-100%)",transition:"transform 0.35s cubic-bezier(0.16,1,0.3,1)",padding:"32px 24px",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:40}}>
        <span style={{fontSize:18,fontWeight:200,color:C.text,fontFamily:"'Outfit',sans-serif",letterSpacing:1}}>hans<span style={{color:C.rose}}>.support</span></span>
        <p style={{fontSize:11,color:C.textDim,marginTop:6}}>Cheyenne's Sanctuary</p>
      </div>
      {items.map(it=><button key={it.id} onClick={()=>{onNavigate(it.id);onClose()}} style={{
        display:"flex",alignItems:"center",gap:14,padding:"14px 12px",borderRadius:12,
        background:current===it.id?C.roseDim:"transparent",border:"none",
        color:current===it.id?C.rose:C.textMuted,fontSize:14,fontWeight:current===it.id?500:400,
        fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s ease",textAlign:"left",marginBottom:2,width:"100%",
      }}>
        <span style={{fontSize:16,width:22,textAlign:"center",opacity:0.7}}>{it.i}</span>{it.l}
      </button>)}
      <div style={{marginTop:"auto",paddingTop:20,borderTop:`1px solid ${C.border}`}}>
        <p style={{fontSize:10,color:C.textGhost,lineHeight:1.6}}>Privé tussen jou en Hans.<br/>Geen tracking. Geen delen.</p>
      </div>
    </div>
  </>;
}

// ─── PREMIUM BLUR ──────────────────────────────────────────────
function PremiumBlur({children}){
  const [open,setOpen]=useState(false);const [anim,setAnim]=useState(false);
  const go=async()=>{setAnim(true);await wait(800);setOpen(true)};
  if(open) return <Fade><Card glow={C.amber}><Label c={C.amber}>✓ Hans Premium™ — Ontgrendeld</Label><p style={{fontSize:12,color:C.textMuted,fontStyle:"italic",marginBottom:12}}>Gebruik verantwoord.</p>{children}</Card></Fade>;
  return <Card glow={C.amber} s={{textAlign:"center"}}>
    <div style={{filter:anim?"blur(0)":"blur(8px)",opacity:anim?1:0.3,transition:"all 0.8s ease",userSelect:"none",pointerEvents:"none",marginBottom:anim?0:10}}>{children}</div>
    {!anim&&<><p style={{fontSize:12,color:C.textDim,marginBottom:16}}>Ontgrendel met <strong style={{color:C.amber}}>Hans Premium™</strong> — €4,95/maand</p>
      <button onClick={go} style={{background:C.amberGlow,border:`1px solid ${C.amber}44`,borderRadius:12,padding:"10px 26px",color:C.amber,fontSize:12,fontWeight:500,fontFamily:"inherit",cursor:"pointer"}}>Steun Hans financieel</button></>}
  </Card>;
}

// ─── TRUST PAGE ────────────────────────────────────────────────
function TrustPage(){
  const pct=TRUST.score,r=52,circ=2*Math.PI*r,off=circ-(pct/100)*circ;
  return <div style={{padding:"20px 0"}}>
    <Fade><h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:200,color:C.text,textAlign:"center",marginBottom:24}}>Trust <span style={{color:C.cyan}}>Barometer™</span></h2></Fade>
    <Fade d={0.1}><Card glow={C.cyan}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <svg width={150} height={150} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke={C.border} strokeWidth="4"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke={C.cyan} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 60 60)" style={{transition:"stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)",filter:`drop-shadow(0 0 10px ${C.cyan}44)`}}/>
          <text x="60" y="56" textAnchor="middle" fill={C.text} fontSize="24" fontWeight="200" fontFamily="'Outfit'">{pct}%</text>
          <text x="60" y="74" textAnchor="middle" fill={C.textDim} fontSize="8" letterSpacing="2" fontFamily="'Outfit'">TRUST</text>
        </svg>
      </div>
      <p style={{fontSize:13,color:C.textMuted,fontStyle:"italic",textAlign:"center",marginBottom:20}}>{TRUST.status}</p>
      <div style={{display:"flex",alignItems:"end",gap:5,height:40,marginBottom:18}}>
        {TRUST.history.map((h,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:`${(h.v-55)*2}px`,background:i===TRUST.history.length-1?C.cyan:C.border,borderRadius:2,margin:"0 auto",maxWidth:20,boxShadow:i===TRUST.history.length-1?`0 0 8px ${C.cyanGlow}`:"none"}}/><span style={{fontSize:8,color:C.textGhost,display:"block",marginTop:3}}>{h.l}</span></div>)}
      </div>
      <NeonLine color={C.cyan}/>
      {TRUST.insights.map((ins,i)=><div key={i} style={{fontSize:12,color:C.textMuted,lineHeight:1.8,paddingLeft:16,position:"relative"}}><span style={{position:"absolute",left:0,color:C.cyan}}>→</span>{ins}</div>)}
      <p style={{fontSize:11,color:C.textDim,marginTop:14,fontStyle:"italic"}}>Hans doet z'n best. Resultaten kunnen variëren.</p>
    </Card></Fade>
    {/* Hans Stats */}
    <Fade d={0.2}><Card glow={C.purple}>
      <Label>Hans Vandaag</Label>
      {[{l:"Luisteren",v:STATS.listening,c:C.green},{l:"Besluitvaardigheid",v:STATS.decisions,c:C.amber},{l:"Deurbewustzijn",v:STATS.doors,c:C.cyan}].map((s,i)=>
        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:i<2?`1px solid ${C.border}`:"none",fontSize:13}}>
          <span style={{color:C.textMuted}}>{s.l}</span><span style={{color:s.c,fontWeight:500}}>{s.v}</span>
        </div>)}
      <div style={{marginTop:20}}><Label c={C.textGhost}>Achievements</Label>
        {STATS.achievements.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:a.done?1:0.35,fontSize:12,color:a.done?C.text:C.textDim}}>
          <span style={{fontSize:14}}>{a.i}</span><span>{a.t}</span>
          {a.rare&&!a.done&&<span style={{fontSize:9,background:C.amberGlow,color:C.amber,padding:"2px 8px",borderRadius:4,fontWeight:600,border:`1px solid ${C.amber}33`}}>ZELDZAAM</span>}
          {a.done&&<span style={{fontSize:9,color:C.green,marginLeft:"auto"}}>✓</span>}
        </div>)}
      </div>
    </Card></Fade>
  </div>;
}

// ─── TICKET PAGE ───────────────────────────────────────────────
function TicketPage(){
  const [form,setForm]=useState({type:"frustrated",mood:"",msg:"",urg:"binnenkort"});
  const [done,setDone]=useState(false);const [loading,setLoading]=useState(false);const [resp,setResp]=useState("");const [crit,setCrit]=useState(false);const [dots,setDots]=useState("");
  useEffect(()=>{setCrit(isCrit(form.msg))},[form.msg]);
  useEffect(()=>{if(!loading)return;const iv=setInterval(()=>setDots(d=>d.length>=3?"":d+"."),400);return()=>clearInterval(iv)},[loading]);
  const go=async()=>{if(!form.msg.trim())return;setLoading(true);setDone(true);const c=isCrit(form.msg);
    const tM={frustrated:"Frustratie",request:"Wens",boundary:"Grensgesprek",appreciation:"Waardering"};
    const uM={vandaag:"voor het slapengaan",binnenkort:"binnen 24 uur",reflectie:"ter reflectie"};
    const prompt=c?`AI-crisisprotocol hans.support. KRITIEK INCIDENT (deur/kou). Bericht: "${form.msg}". Stemming: ${form.mood||"?"}. Nederlands, geen markdown:\n\n⚠️ KRITIEK INCIDENT\n\nOBSERVATIE:\n→ [NVC 1]\n\nGEVOEL:\n→ [NVC 2]\n\nBEHOEFTE:\n→ [NVC 3]\n\nACTIE:\n→ [NVC 4]\n\nCOMPENSATIE:\n→ [warm]\n\nGeen humor. Max 100w.`
    :`AI-mediator hans.support. Kalm, premium. NVC (Observatie→Gevoel→Behoefte→Verzoek) + Gottman (escalatie→pauze, kritiek→zachte startup). Context: achterdeur/kou, wasrechten, escalatie, te verlegen om te vragen. Ticket: "${tM[form.type]}". Stemming: ${form.mood||"?"}. Urgentie: ${uM[form.urg]}. Bericht: "${form.msg}"\n\nNederlands, geen markdown:\n\nWAT IK HOOR:\n→ [valideer]\n\nNVC-VERTALING:\nObservatie → ...\nGevoel → ...\nBehoefte → ...\nVerzoek → ...\n\nACTIE VOOR HANS:\n→ [concreet]\n\nMax 150w.`;
    try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});const d=await r.json();setResp(d.content?.map(b=>b.text||"").join("")||"Je gevoelens zijn geldig.")}catch{setResp("WAT IK HOOR:\n→ Iets belangrijks.\n\nACTIE VOOR HANS:\n→ Luister.")}setLoading(false)};
  const reset=()=>{setForm({type:"frustrated",mood:"",msg:"",urg:"binnenkort"});setDone(false);setResp("");setCrit(false)};

  if(done) return <Fade><Card glow={crit?C.red:C.cyan}><Label c={crit?C.red:C.cyan}>{crit?"⚠️ Kritiek Incident":"hans.support AI Mediator"}</Label>
    {loading?<p style={{fontSize:13,color:C.textMuted}}>{crit?"Prioriteit escalatie":"Verwerken"}{dots}</p>
    :<div style={{fontSize:13,color:C.text,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{resp}</div>}
    {!loading&&<button onClick={reset} style={{marginTop:20,background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 22px",color:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>Nog een ticket</button>}
  </Card></Fade>;

  return <div style={{padding:"20px 0"}}>
    <Fade><div style={{textAlign:"center",marginBottom:32}}>
      <h2 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:200,color:C.text,lineHeight:1.3,marginBottom:8}}>De Digitale<br/><span style={{color:C.rose}}>Schuilplaats</span></h2>
      <p style={{fontSize:13,color:C.textMuted}}>Neem de tijd, we luisteren.</p>
    </div></Fade>
    <Card glow={C.rose}>
      {crit&&<div style={{background:C.redGlow,border:`1px solid ${C.red}33`,borderRadius:14,padding:"12px 16px",marginBottom:20}}>
        <span style={{fontSize:10,fontWeight:700,color:C.red,textTransform:"uppercase",letterSpacing:2}}>⚠️ Kritiek Incident</span>
      </div>}
      <Label>Categorie van reflectie</Label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
        {[{v:"frustrated",i:"💔",l:"Frustratie"},{v:"request",i:"✨",l:"Wens"},{v:"boundary",i:"⚖️",l:"Grensgesprek"},{v:"appreciation",i:"❤️",l:"Waardering"}].map(t=>
          <button key={t.v} onClick={()=>setForm(f=>({...f,type:t.v}))} style={{padding:"18px 0",background:form.type===t.v?C.roseDim:"transparent",border:`1px solid ${form.type===t.v?C.rose+"44":C.border}`,borderRadius:16,color:form.type===t.v?C.rose:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all 0.25s ease",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <span style={{fontSize:24,filter:form.type===t.v?`drop-shadow(0 0 8px ${C.roseGlow})`:""}}>{t.i}</span>{t.l}
          </button>)}
      </div>
      <Label>Hoe voelt het nu?</Label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
        {["Kalm","Onrustig","Vastgelopen","Gehoord","Nieuwsgierig","Moe","Boos"].map(m=>
          <button key={m} onClick={()=>setForm(f=>({...f,mood:m}))} style={{padding:"7px 16px",background:form.mood===m?C.cyanDim:"transparent",border:`1px solid ${form.mood===m?C.cyan+"33":C.border}`,borderRadius:20,color:form.mood===m?C.cyan:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s ease"}}>{m}</button>)}
      </div>
      <Label>Jouw verhaal</Label>
      <textarea value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} placeholder="Schrijf het van je af..."
        style={{width:"100%",minHeight:130,background:C.bgSurface,border:`1px solid ${crit?C.red+"33":C.border}`,borderRadius:14,padding:16,color:C.text,fontSize:14,fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.7,boxSizing:"border-box"}}/>
      <div style={{marginTop:24,marginBottom:20}}>
        <Label>Dringendheid</Label>
        <div style={{display:"flex",gap:16}}>
          {[{v:"vandaag",l:"Vandaag"},{v:"binnenkort",l:"Binnenkort"},{v:"reflectie",l:"Ter reflectie"}].map(u=>
            <label key={u.v} onClick={()=>setForm(f=>({...f,urg:u.v}))} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:form.urg===u.v?C.text:C.textDim}}>
              <span style={{width:16,height:16,borderRadius:"50%",border:`1.5px solid ${form.urg===u.v?C.rose:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:form.urg===u.v?`0 0 8px ${C.roseGlow}`:"none"}}>
                {form.urg===u.v&&<span style={{width:6,height:6,borderRadius:"50%",background:C.rose}}/>}
              </span>{u.l}
            </label>)}
        </div>
      </div>
      <NeonLine color={C.rose} w="35%"/>
      <div style={{background:C.bgSurface,borderRadius:14,padding:"14px 18px",marginBottom:18,textAlign:"center"}}>
        <p style={{fontSize:13,color:C.textMuted,fontStyle:"italic"}}>"Hans is momenteel aan het nadenken. Geen haast."</p>
      </div>
      <button onClick={go} disabled={!form.msg.trim()} style={{width:"100%",padding:"16px",borderRadius:14,background:form.msg.trim()?(crit?C.red:C.rose):"transparent",border:`1px solid ${form.msg.trim()?(crit?C.red:C.rose):C.border}`,color:form.msg.trim()?"#fff":C.textDim,fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:form.msg.trim()?"pointer":"default",transition:"all 0.3s ease",boxShadow:form.msg.trim()?`0 0 20px ${crit?C.redGlow:C.roseGlow}`:"none"}}>
        {crit?"⚠️ Kritiek Ticket":"Verzend naar de Sanctuary"}
      </button>
    </Card>
  </div>;
}

// ─── ISSUES PAGE ───────────────────────────────────────────────
function IssuesPage(){
  const [exp,setExp]=useState(null);
  const sc={critical:C.red,high:C.amber,medium:C.cyan,low:C.green};
  const sl={critical:"KRITIEK",high:"HOOG",medium:"MEDIUM",low:"LAAG"};
  return <div style={{padding:"20px 0"}}>
    <Fade><h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:200,color:C.text,textAlign:"center",marginBottom:24}}>Bekende <span style={{color:C.amber}}>Issues</span></h2></Fade>
    {ISSUES.map((is,i)=><Fade key={is.id} d={i*0.06}><Card glow={sc[is.sev]} onClick={()=>setExp(exp===i?null:i)} s={{cursor:"pointer"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:10,color:C.textGhost,fontFamily:"monospace",letterSpacing:1}}>{is.id}</span>
        <span style={{fontSize:9,fontWeight:700,color:sc[is.sev],textTransform:"uppercase",letterSpacing:1.5}}>{sl[is.sev]}</span>
      </div>
      <h3 style={{fontSize:14,fontWeight:500,color:C.text,margin:"0 0 4px"}}>{is.title}</h3>
      <span style={{fontSize:11,color:C.textDim}}>{is.cat}</span>
      {exp===i&&<div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,animation:"fadeUp 0.4s ease"}}>
        <Label c={C.rose}>Hans reageert</Label>
        <p style={{fontSize:13,color:C.textMuted,lineHeight:1.8,fontStyle:"italic"}}>"{is.note}"</p>
      </div>}
    </Card></Fade>)}
  </div>;
}

// ─── AGREEMENTS PAGE ───────────────────────────────────────────
function AgreementsPage(){
  const [exp,setExp]=useState(null);
  return <div style={{padding:"20px 0"}}>
    <Fade><h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:200,color:C.text,textAlign:"center",marginBottom:24}}>Onze <span style={{color:C.green}}>Afspraken</span></h2></Fade>
    {AGREEMENTS.map((ag,i)=><Fade key={i} d={i*0.06}><Card glow={ag.status==="actief"?C.green:C.amber} onClick={()=>setExp(exp===i?null:i)} s={{cursor:"pointer"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div><h3 style={{fontSize:14,fontWeight:500,color:C.text,margin:0}}>{ag.topic}</h3><span style={{fontSize:11,color:C.textDim}}>{ag.violations} overtredingen</span></div>
        <span style={{fontSize:10,fontWeight:600,color:ag.status==="actief"?C.green:C.amber,textTransform:"uppercase",letterSpacing:1}}>{ag.status}</span>
      </div>
      {exp===i&&<div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${C.border}`,animation:"fadeUp 0.4s ease",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><Label c={C.cyan}>Hans</Label>{ag.hans.map((r,j)=><p key={j} style={{fontSize:12,color:C.textMuted,lineHeight:1.7,paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:0,color:C.cyan}}>→</span>{r}</p>)}</div>
        <div><Label c={C.rose}>Partner</Label>{ag.partner.map((r,j)=><p key={j} style={{fontSize:12,color:C.textMuted,lineHeight:1.7,paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:0,color:C.rose}}>→</span>{r}</p>)}</div>
      </div>}
    </Card></Fade>)}
  </div>;
}

// ─── ANALYTICS PAGE ────────────────────────────────────────────
function AnalyticsPage(){
  const mC=Math.max(...ANALYTICS.conflicts.map(w=>w.n)),mH=Math.max(...ANALYTICS.hugs.map(w=>w.n));
  return <div style={{padding:"20px 0"}}>
    <Fade><h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:200,color:C.text,textAlign:"center",marginBottom:24}}>Relatie <span style={{color:C.purple}}>Inzichten</span></h2></Fade>
    <Fade d={0.05}><Card glow={C.purple}><Label>Weekoverzicht</Label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}}>
        <div><span style={{fontSize:11,color:C.rose}}>Conflicten</span><div style={{display:"flex",alignItems:"end",gap:6,height:50,marginTop:10}}>
          {ANALYTICS.conflicts.map((w,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:`${(w.n/mC)*42}px`,background:C.roseDim,borderRadius:3,boxShadow:`0 0 6px ${C.roseDim}`}}/><span style={{fontSize:8,color:C.textGhost,display:"block",marginTop:3}}>{w.w}</span></div>)}</div></div>
        <div><span style={{fontSize:11,color:C.green}}>Knuffels</span><div style={{display:"flex",alignItems:"end",gap:6,height:50,marginTop:10}}>
          {ANALYTICS.hugs.map((w,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:`${(w.n/mH)*42}px`,background:C.greenGlow,borderRadius:3,boxShadow:`0 0 6px ${C.greenGlow}`}}/><span style={{fontSize:8,color:C.textGhost,display:"block",marginTop:3}}>{w.w}</span></div>)}</div></div>
      </div>
    </Card></Fade>
    <Fade d={0.1}><Card glow={C.cyan}><Label>AI Inzichten</Label>
      {ANALYTICS.patterns.map((p,i)=><div key={i} style={{fontSize:12,color:C.textMuted,lineHeight:1.8,paddingLeft:16,position:"relative",marginBottom:4}}><span style={{position:"absolute",left:0,color:C.cyan}}>→</span>{p}</div>)}
      <div style={{background:C.greenGlow,border:`1px solid ${C.green}22`,borderRadius:12,padding:"12px 16px",marginTop:14}}>
        <Label c={C.green}>Aanbeveling</Label>
        <p style={{fontSize:12,color:C.text,lineHeight:1.7}}>{ANALYTICS.tip}</p>
      </div>
    </Card></Fade>
  </div>;
}

// ─── HANS ANALYSE PAGE ─────────────────────────────────────────
function HansPage(){
  return <div style={{padding:"20px 0"}}>
    <Fade><h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:200,color:C.text,textAlign:"center",marginBottom:24}}>Hans <span style={{color:C.amber}}>Analyse</span></h2></Fade>
    <Fade d={0.1}><PremiumBlur>
      <div style={{textAlign:"left"}}><Label>Diagnostiek</Label>
        {[{l:"Intentie",v:"Praktisch, niet emotioneel"},{l:"Blinde vlek",v:"Onderschat impact kleine acties"},{l:"Default",v:"Probleemoplossing i.p.v. luisteren"},{l:"Gottman",v:"Verdediging bij kritiek"},{l:"Conclusie",v:"Niet kwaadaardig, gewoon Hans"}].map((x,i)=>
          <div key={i} style={{marginBottom:11}}><span style={{fontSize:10,color:C.textGhost,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:2}}>{x.l}</span><span style={{fontSize:13,color:C.text}}>→ {x.v}</span></div>)}
      </div>
    </PremiumBlur></Fade>
  </div>;
}

// ─── APP ───────────────────────────────────────────────────────
export default function App(){
  const [entered,setEntered]=useState(false);
  const [page,setPage]=useState("home");
  const [menuOpen,setMenuOpen]=useState(false);
  const [hugCount,setHugCount]=useState(0);
  const [hugSent,setHugSent]=useState(false);

  const sendHug=()=>{setHugSent(true);setHugCount(c=>c+1);setTimeout(()=>setHugSent(false),2500)};
  const navigate=(p)=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"})};

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap');
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes heartBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
    @keyframes heartGlow{0%,100%{opacity:0.3;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.6;transform:translate(-50%,-50%) scale(1.07)}}
    @keyframes heroPulse{0%,100%{opacity:1}50%{opacity:0.8}}
    @keyframes floatP{0%,100%{transform:translateY(0) translateX(0);opacity:0.12}50%{transform:translateY(-25px) translateX(12px);opacity:0.3}}
    @keyframes ecgDraw{0%{stroke-dashoffset:500}40%{stroke-dashoffset:0}100%{stroke-dashoffset:-500}}
    @keyframes scrollDot{0%{transform:translateY(0);opacity:0.4}50%{transform:translateY(10px);opacity:0.1}100%{transform:translateY(0);opacity:0.4}}
    *{box-sizing:border-box;margin:0;padding:0}
    ::selection{background:${C.rose}33}
    textarea::placeholder{color:${C.textDim}}
    body{background:${C.bg};overflow-x:hidden}
    ::-webkit-scrollbar{width:0;height:0}
  `;

  if(!entered) return <><style>{css}</style><Hero onEnter={()=>setEntered(true)}/></>;

  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit','Segoe UI',sans-serif",color:C.text}}>
    <style>{css}</style>
    {/* Ambient */}
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:`radial-gradient(ellipse at 50% 15%,${C.roseDim} 0%,transparent 50%),radial-gradient(ellipse at 15% 75%,${C.cyanDim} 0%,transparent 35%),radial-gradient(ellipse at 85% 55%,${C.purpleGlow} 0%,transparent 35%)`}}/>

    <SlideMenu open={menuOpen} onClose={()=>setMenuOpen(false)} onNavigate={navigate} current={page}/>

    {/* Top bar */}
    <div style={{position:"sticky",top:0,zIndex:50,background:C.bgGlass,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",maxWidth:500,margin:"0 auto"}}>
        <button onClick={()=>setMenuOpen(true)} style={{background:"transparent",border:"none",cursor:"pointer",padding:4,display:"flex",flexDirection:"column",gap:4}}>
          <span style={{width:20,height:1.5,background:C.textMuted,borderRadius:1,display:"block"}}/>
          <span style={{width:14,height:1.5,background:C.textMuted,borderRadius:1,display:"block"}}/>
        </button>
        <span style={{fontSize:14,fontWeight:300,color:C.text,letterSpacing:1}}>hans<span style={{color:C.rose}}>.support</span></span>
        <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.rose}44,${C.purple}44)`,border:`1px solid ${C.rose}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{color:C.rose,fontSize:11,fontWeight:600}}>H</span>
        </div>
      </div>
    </div>

    <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px",position:"relative",zIndex:1}}>
      <div key={page} style={{animation:"fadeUp 0.5s ease"}}>
        {page==="home"&&<HeartLanding onNavigate={navigate} hugCount={hugCount} onHug={sendHug} hugSent={hugSent}/>}
        {page==="ticket"&&<TicketPage/>}
        {page==="trust"&&<TrustPage/>}
        {page==="issues"&&<IssuesPage/>}
        {page==="afspraken"&&<AgreementsPage/>}
        {page==="inzichten"&&<AnalyticsPage/>}
        {page==="hans"&&<HansPage/>}
      </div>
      {page!=="home"&&<div style={{textAlign:"center",padding:"20px 0 40px"}}>
        <button onClick={()=>navigate("home")} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 24px",color:C.textDim,fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>← Terug naar Home</button>
      </div>}
      <footer style={{textAlign:"center",padding:"24px 0 32px"}}>
        <p style={{fontSize:10,color:C.textGhost,lineHeight:1.7,fontStyle:"italic",maxWidth:280,margin:"0 auto"}}>"Ik heb dit niet gebouwd om discussies te winnen. Ik heb dit gebouwd omdat ik wil dat we elkaar beter begrijpen."</p>
        <p style={{fontSize:9,color:C.textGhost,marginTop:10}}>Privé tussen jou en Hans · v8.0</p>
      </footer>
    </div>
  </div>;
}
