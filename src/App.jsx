import React,{useState,useEffect,useRef,useMemo} from "react";
import { jsPDF } from "jspdf";
import {SEED_EDITORS,ExploreEditors,EditorProfile,JoinEditor,HomeEditors} from "./Editors.jsx";
import {Ph,ScrollBar,Fan,Stats,CreatorsScroll,BrandsScroll,Platforms,Features,Faq,Launch} from "./Sections.jsx";


const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?Math.round(n/1e3)+'K':String(n);
const r5=n=>Math.round(n/500)*500;
const mkRates=p=>[["Instagram Reel","20 Seconds",p],["Instagram Reel","30 Seconds",1.4*p],["Instagram Reel","60 Seconds",2*p],["YouTube Shorts","20 Seconds",.6*p],["YouTube Shorts","30 Seconds",.85*p],["YouTube Shorts","60 Seconds",1.2*p],["Instagram Story","Per Story",.5*p],["Instagram Post","Static / Carousel",.8*p],["YouTube Integration","60–90 Seconds",3*p],["Dedicated YouTube Video","5–8 Minutes",5*p],["Product Review","Reel + Story",1.5*p],["Brand Mention","Voice / Caption",.4*p]].map(([s,d,x])=>({s,d,p:r5(x)}));
const GR=["#e8223f,#ff8a3d","#ff6b8f,#8f1325","#ffc933,#ff8a3d","#8f1325,#e8223f","#ff8a3d,#ff6b8f","#e8223f,#ffc933"];
const base=[["Rohan Kapoor","Fashion","Mumbai","Hindi, English",1250000,310000,6000],["Riya Deshmukh","Travel","Nagpur","Marathi, Hindi",480000,220000,4000],["Meera Iyer","Food","Bengaluru","English, Tamil",760000,95000,3500],["Kavya Malhotra","Fitness","Delhi","Hindi, English",2100000,640000,9000],["Jack dae","Beauty","Pune","Marathi, Hindi",930000,120000,5000],["Arjun Nair","Technology","Kochi","English, Malayalam",210000,880000,7000],["arjun mishra","Lifestyle","Jaipur","Hindi, English",540000,60000,3000],["samii Joshi","Gaming","Nagpur","Hindi, Marathi",150000,1400000,8000]];
const SEED=base.map(([name,niche,city,lang,ig,yt,p],i)=>({id:i+1,name,niche,city,lang,ig,yt,h:name.split(" ")[0].toLowerCase()+"."+name.split(" ")[1].toLowerCase(),g:GR[i%6],bio:`${niche} creator from ${city} making honest, high-energy content that audiences trust. Open to long-term brand partnerships.`,er:(3+i*.7).toFixed(1),rv:fmt(ig*.18),vv:fmt(yt*.12+8000),img:"/creators/"+name.split(" ")[0].toLowerCase()+".jpg",rates:mkRates(p),past:["Aura Skincare","Nomad Trails","Pulse Fitness"]}));
const CATS=["Fashion","Beauty","Lifestyle","Travel","Food","Technology","Fitness","Entertainment","Education","Gaming"];
const minP=c=>Math.min(...c.rates.map(r=>r.p));

function Rv({children,className="",style}){const r=useRef();useEffect(()=>{const o=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add("in")),{threshold:.12});o.observe(r.current);return()=>o.disconnect()},[]);return <div ref={r} style={style} className={"rv "+className}>{children}</div>}
const Av=({c,cls=""})=><div className={"av "+cls} style={{background:`linear-gradient(135deg,${c.g})`}}>{c.name[0]}<Ph src={c.img} alt={c.name}/></div>;
function Field({l,v,set,err,type="text",opts,area,full,ph}){return <div className={full?"full":""}><label>{l}</label>{opts?<select value={v} onChange={e=>set(e.target.value)}><option value="">Select…</option>{opts.map(o=><option key={o}>{o}</option>)}</select>:area?<textarea rows="3" value={v} placeholder={ph} onChange={e=>set(e.target.value)}/>:<input type={type} value={v} placeholder={ph} onChange={e=>set(e.target.value)}/>}{err&&<div className="er">{err}</div>}</div>}
const downloadAgreementPdf = (f, sig, st) => {
  const doc = new jsPDF();
  const W = 180;
  let y = 20;
  const write = (text, size = 11, bold = false, gap = 7) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.splitTextToSize(text, W).forEach((line) => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, 15, y);
      y += gap;
    });
  };

  write("Creator Collaboration Agreement", 18, true, 10);
  y += 2;
  write(`Between Collably Platform Pvt. Ltd. and ${f.name}, ${f.email}, ${f.city}, ${f.state}.`);
  y += 3;
  write("1. Terms & conditions", 12, true);
  write("Creator agrees to list their profile and rates on the Company platform and to respond to brand enquiries promptly.");
  y += 3;
  write("2. Collaboration guidelines", 12, true);
  write("Sponsored content must be disclosed, truthful and delivered on the agreed timeline.");
  y += 3;
  write("3. Content usage rights", 12, true);
  write("Creator retains ownership; brands receive usage rights only as agreed per campaign.");
  y += 3;
  write("4. Payment terms", 12, true);
  write("Payment follows the rates and schedule agreed in each collaboration.");
  y += 3;
  write("5. Professional conduct", 12, true);
  write("Creator will act respectfully and avoid misleading or unlawful content.");
  y += 3;
  write("6. Validity", 12, true);
  write("This agreement is valid for 12 months from the date of signing, auto-renewable.");
  y += 8;
  write(`Digital signature: ${sig || "Not signed yet"}`, 12, true);
  write(`Status: ${st}`);
  write(`Date: ${new Date().toLocaleDateString("en-IN")}`);

  doc.save(`Collably-Agreement-${(f.name || "Creator").replace(/\s+/g, "-")}.pdf`);
};
function Nav({page,go,open,setOpen}){const L=[["home","Home"],["creators","For Creators"],["brands","For Brands"],["editors","Editors"],["explore","Explore Creators"],["how","How It Works"],["contact","Contact"]];
return <div className="nav"><div className="navin"><div className="logo" onClick={()=>go("home")}><i>C</i>Collably</div>
<div className={"links "+(open?"open":"")}>{L.map(([k,t])=><a key={k} className={page===k?"on":""} onClick={()=>{setOpen(false);k==="creators"?go("joincreator"):k==="brands"?go("joinbrand"):k==="contact"?document.getElementById("contact")?.scrollIntoView():go(k==="how"?"home":k,k==="how"?"how":null)}}>{t}</a>)}</div>
<button className="btn burger" onClick={()=>setOpen(!open)}>☰</button></div></div>}

function Hero({go,cs}){const row=[...cs,...cs,...cs,...cs];return <section className="hero"><div className="wrap" style={{position:"relative"}}>
<div className="floatc" style={{left:"2%",top:"90px"}}><span className="ico ig">IG</span>1.2M</div><div className="floatc" style={{right:"3%",top:"60px",animationDelay:"1s"}}><span className="ico yt">▶</span>640K subs</div><div className="floatc" style={{right:"8%",top:"360px",animationDelay:"2s"}}>✓ Campaign live</div>
<span className="pill">#CreatorsMeetBrands</span><br/><br/>
<h1>Where Creators Meet Brands. Where <b>Influence</b> Creates Impact.</h1>
<p>One platform to showcase your influence, discover talented creators and build meaningful brand collaborations. Connect with the right audience through the right creators.</p>

<div className="cta"><button className="btn red big" onClick={()=>go("joincreator")}>Join as Creator ↗</button><button className="btn big white" onClick={()=>go("joinbrand")}>Register Your Brand ↗</button><button className="btn big" onClick={()=>go("joineditor")}>Join as Editor ↗</button></div><Fan cs={cs} go={go}/></div>
<div style={{marginTop:30}}><div className="row">{row.map((c,i)=><React.Fragment key={i}><Av c={c} cls={i%3===0?"sq":""}/><div className="cn" style={{background:["var(--orange)","var(--pink)","var(--yellow)"][i%3]}}/></React.Fragment>)}</div>
<div className="row rev">{row.map((c,i)=><React.Fragment key={i}><Av c={c}/><div className="cn" style={{background:["var(--pink)","var(--orange)","var(--red)"][i%3]}}/></React.Fragment>)}</div></div></section>}

function How({id}){const [t,setT]=useState("c");const ref=useRef(),pr=useRef();
useEffect(()=>{const f=()=>{const b=ref.current.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight-b.top)/(b.height+innerHeight*.6)));pr.current.style.strokeDashoffset=1-p};f();addEventListener("scroll",f);return()=>removeEventListener("scroll",f)},[]);
const D={c:[["Register","Create your creator account in a minute."],["Complete profile","Add niche, bio, languages and audience details."],["Connect socials","Link Instagram and YouTube."],["Upload portfolio","Show reels, videos and past brand work."],["Sign the agreement","Review and digitally sign the company agreement."],["Publish profile","Go live in the creator directory."],["Get opportunities","Receive collaboration requests from brands."]],b:[["Register company","Sign up your brand in a minute."],["Add details","Industry, budget and ad requirements."],["Open the directory","Access every approved creator."],["Explore portfolios","Reels, collabs and media kits."],["Compare","Followers, platforms and rate cards."],["Select creators","Shortlist the right fit."],["Send enquiries","Request a collaboration directly."]],e:[["Register","Create your editor account in a minute."],["Add your details","Speciality, software, experience and starting price."],["Upload portfolio","Upload reels, videos and links to past edits."],["Publish profile","Go live in the editors directory."],["Get requests","Creators and brands send you their editing briefs."],["Connect directly","Agree on scope, price and deadline."],["Deliver & grow","Deliver edits and build repeat clients."]]};
return <section id={id} ref={ref} className="sec" style={{position:"relative"}}><svg className="curve" viewBox="0 0 1000 1400" preserveAspectRatio="none"><defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stopColor="#ffc933"/><stop offset=".5" stopColor="#ff6b8f"/><stop offset="1" stopColor="#e8223f"/></linearGradient></defs><path ref={pr} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M-20 1300C250 1100 150 800 500 750S900 500 700 250S900 60 1040 20" fill="none" stroke="url(#gr)" strokeWidth="16" strokeLinecap="round" vectorEffect="non-scaling-stroke"/></svg>
<div className="wrap" style={{position:"relative",zIndex:1}}><Rv><h2>Two pathways.<br/>One collaboration.</h2><div className="tabs"><button className={t==="c"?"on":""} onClick={()=>setT("c")}>Creators</button><button className={t==="b"?"on":""} onClick={()=>setT("b")}>Brands</button><button className={t==="e"?"on":""} onClick={()=>setT("e")}>Editors</button></div></Rv>
<div className="steps" key={t}>{D[t].map(([h,p],i)=><Rv key={i} style={{transitionDelay:i*70+"ms"}}><div className={"step c"+((i+(t==="b"?3:t==="e"?5:0))%7)}><div className="an" style={{fontSize:13,opacity:.7}}>Step {i+1}</div><h3>{h}</h3><p>{p}</p><span className="n">0{i+1}</span></div></Rv>)}</div></div></section>}

function Why({go}){const C=["Showcase your talent","Professional creator portfolio","Transparent pricing","Direct brand opportunities","Easy collaboration management"],B=["Discover relevant creators","Compare creator rates","Access creator portfolios","Direct social media links","Simplified collaboration process"];
return <section className="sec"><div className="wrap"><Rv><h2>Why choose Collably</h2></Rv><div className="why" style={{marginTop:24}}><Rv><div className="panel r"><h3 style={{fontSize:30}}>For Creators</h3><ul>{C.map(x=><li key={x}>{x}</li>)}</ul><br/><button className="btn white" onClick={()=>go("joincreator")}>Join as Creator ↗</button></div></Rv><Rv><div className="panel d"><h3 style={{fontSize:30}}>For Brands</h3><ul>{B.map(x=><li key={x}>{x}</li>)}</ul><br/><button className="btn red" onClick={()=>go("joinbrand")}>Register Your Brand ↗</button></div></Rv></div></div></section>}

function Home({go,cs,eds}){return <><Hero go={go} cs={cs}/><Stats/>
<section className="sec"><div className="wrap"><Rv><h2>Featured creators</h2><p className="sub">Approved, agreement-signed creators ready to collaborate.</p></Rv><div className="grid" style={{marginTop:26}}>{cs.slice(0,4).map(c=><Rv key={c.id}><Card c={c} go={go}/></Rv>)}</div><br/><button className="btn red big" onClick={()=>go("explore")}>Explore all creators ↗</button></div></section>
<CreatorsScroll cs={cs} go={go}/><BrandsScroll go={go}/><HomeEditors eds={eds} go={go}/><Platforms/><Features go={go}/><How id="how"/><Why go={go}/><Faq/><Launch cs={cs} go={go}/></>}

function Card({c,go}){return <div className="cc"><div className="ph" style={{background:`linear-gradient(135deg,${c.g})`}}>{c.name[0]}<Ph src={c.img} alt={c.name}/></div><div style={{padding:18}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{fontSize:21}}>{c.name}</h3><span className="tag">{c.niche}</span></div><div style={{color:"var(--mut)",fontSize:13,margin:"2px 0 12px"}}>📍 {c.city} · {c.lang}</div>
<div style={{display:"flex",gap:8}}><div className="stat"><b>{fmt(c.ig)}</b><span>Instagram</span></div><div className="stat"><b>{fmt(c.yt)}</b><span>YouTube</span></div></div>
<div style={{display:"flex",alignItems:"center",gap:8,margin:"14px 0"}}><a className="ico ig" target="_blank" rel="noopener" href={"https://instagram.com/"+c.h}>IG</a><a className="ico yt" target="_blank" rel="noopener" href={"https://youtube.com/@"+c.h}>▶</a><span style={{marginLeft:"auto",fontSize:12,color:"var(--mut)"}}>Starting at <b style={{color:"var(--yellow)",fontSize:16}}>₹{minP(c).toLocaleString("en-IN")}</b></span></div>
<button className="btn red" style={{width:"100%"}} onClick={()=>go("creator",c.id)}>View Full Portfolio</button></div></div>}

function Explore({cs,go}){const [f,setF]=useState({q:"",cat:"",pl:"",fol:0,city:"",lang:"",bud:0,sort:"fol"}),[view,setView]=useState("grid");const s=(k,v)=>setF({...f,[k]:v});
const cities=[...new Set(cs.map(c=>c.city))],langs=[...new Set(cs.flatMap(c=>c.lang.split(", ")))];
const L=useMemo(()=>cs.filter(c=>(!f.q||c.name.toLowerCase().includes(f.q.toLowerCase()))&&(!f.cat||c.niche===f.cat)&&(f.pl!=="Instagram"||c.ig>0)&&(f.pl!=="YouTube"||c.yt>0)&&(f.pl!=="Both"||(c.ig>0&&c.yt>0))&&c.ig+c.yt>=f.fol&&(!f.city||c.city===f.city)&&(!f.lang||c.lang.includes(f.lang))&&(!f.bud||minP(c)<=f.bud)).sort((a,b)=>f.sort==="fol"?b.ig+b.yt-a.ig-a.yt:f.sort==="pr"?minP(a)-minP(b):a.niche.localeCompare(b.niche)),[cs,f]);
return <div className="wrap" style={{paddingTop:50}}><h2 style={{fontSize:"clamp(36px,6vw,72px)"}}>Explore creators</h2><p className="sub">{L.length} verified creators with signed agreements.</p>
<div className="filters"><input placeholder="🔍 Search creator" value={f.q} onChange={e=>s("q",e.target.value)}/>
<select value={f.cat} onChange={e=>s("cat",e.target.value)}><option value="">All categories</option>{CATS.map(x=><option key={x}>{x}</option>)}</select>
<select value={f.pl} onChange={e=>s("pl",e.target.value)}><option value="">Any platform</option><option>Instagram</option><option>YouTube</option><option>Both</option></select>
<select value={f.fol} onChange={e=>s("fol",+e.target.value)}><option value="0">Any followers</option><option value="500000">500K+</option><option value="1000000">1M+</option><option value="2000000">2M+</option></select>
<select value={f.city} onChange={e=>s("city",e.target.value)}><option value="">Any city</option>{cities.map(x=><option key={x}>{x}</option>)}</select>
<select value={f.lang} onChange={e=>s("lang",e.target.value)}><option value="">Any language</option>{langs.map(x=><option key={x}>{x}</option>)}</select>
<select value={f.bud} onChange={e=>s("bud",+e.target.value)}><option value="0">Any budget</option><option value="4000">Up to ₹4,000</option><option value="6000">Up to ₹6,000</option><option value="10000">Up to ₹10,000</option></select>
<select value={f.sort} onChange={e=>s("sort",e.target.value)}><option value="fol">Sort: Followers</option><option value="pr">Sort: Price</option><option value="cat">Sort: Category</option></select>
<button className="btn" onClick={()=>setView(view==="grid"?"list":"grid")}>{view==="grid"?"☰ List view":"▦ Grid view"}</button></div>
<div className={"grid "+(view==="list"?"list":"")}>{L.map(c=><Card key={c.id} c={c} go={go}/>)}</div>{!L.length&&<div className="card">No creators match these filters.</div>}</div>}

function Profile({c,go,setRates,toast}){const [edit,setEdit]=useState(false),[m,setM]=useState(false);
return <div className="wrap" style={{paddingTop:40}}><button className="btn" onClick={()=>go("explore")}>← Back to directory</button>
<div className="card" style={{marginTop:18,display:"flex",gap:26,flexWrap:"wrap",background:`linear-gradient(135deg,${c.g.split(",")[1]}55,var(--card))`}}><Av c={c} cls="sq" /><div style={{flex:1,minWidth:240}}><h2 style={{fontSize:46}}>{c.name} <span className="tag" style={{fontFamily:"Inter",fontSize:12}}>✓ Verified</span></h2><p style={{color:"var(--mut)",maxWidth:560}}>{c.bio}</p><p style={{margin:"8px 0"}}><span className="tag">{c.niche}</span> <span className="tag">📍 {c.city}</span> <span className="tag">🗣 {c.lang}</span></p><button className="btn red big" onClick={()=>setM(true)}>Request Collaboration</button> <button className="btn big" onClick={()=>go("editors")}>🎬 Need an editor?</button></div></div>
<div className="why" style={{margin:"18px 0"}}><div className="card"><div style={{display:"flex",gap:10,alignItems:"center"}}><span className="ico ig">IG</span><h3>Instagram</h3><a className="btn" style={{marginLeft:"auto"}} target="_blank" rel="noopener" href={"https://instagram.com/"+c.h}>Open profile ↗</a></div><div style={{display:"flex",gap:8,marginTop:14}}><div className="stat"><b>{fmt(c.ig)}</b><span>Followers</span></div><div className="stat"><b>{c.er}%</b><span>Engagement</span></div><div className="stat"><b>{c.rv}</b><span>Avg reel views</span></div></div></div>
<div className="card"><div style={{display:"flex",gap:10,alignItems:"center"}}><span className="ico yt">▶</span><h3>YouTube</h3><a className="btn" style={{marginLeft:"auto"}} target="_blank" rel="noopener" href={"https://youtube.com/@"+c.h}>Open channel ↗</a></div><div style={{display:"flex",gap:8,marginTop:14}}><div className="stat"><b>{fmt(c.yt)}</b><span>Subscribers</span></div><div className="stat"><b>{c.vv}</b><span>Avg video views</span></div></div></div></div>
<h2 style={{fontSize:36,margin:"34px 0 14px"}}>Portfolio</h2><div className="grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))"}}>{["Reel · Festive launch","Video · Review","Collab · "+c.past[0],"Reel · Travel diary","Featured · "+c.past[1],"Collab · "+c.past[2]].map((t,i)=><div key={i} className="tile" style={{background:`linear-gradient(160deg,${GR[(c.id+i)%6]})`,color:"#fff"}}>{t}</div>)}</div>
<div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",margin:"40px 0 14px"}}><h2 style={{fontSize:36}}>Rate card</h2><button className="btn" onClick={()=>{setEdit(!edit);edit&&toast("Rates saved")}}>{edit?"✓ Save rates":"✎ Edit rates (creator mode)"}</button></div>
<div className="price">{c.rates.map((r,i)=><div className="pc" key={i}><div style={{fontWeight:600}}>{r.s}</div><div style={{fontSize:12,color:"var(--mut)",marginBottom:8}}>{r.d}</div>{edit?<input type="number" value={r.p} onChange={e=>setRates(c.id,i,+e.target.value||0)}/>:<b>₹{r.p.toLocaleString("en-IN")}</b>}</div>)}</div>
<p style={{color:"var(--mut)",fontSize:12,margin:"10px 0"}}>Sample rates. Creators set and manage their own pricing.</p>
{m&&<Enquiry c={c} close={()=>setM(false)} toast={toast}/>}</div>}

function Enquiry({c,close,toast}){const [f,setF]=useState({b:"",p:"",e:"",cn:"",d:"",pl:"Instagram",du:"30 Seconds",dl:"",bu:"",dt:""}),[er,setEr]=useState({});const s=k=>v=>setF({...f,[k]:v});
const go=()=>{const e={};if(!f.b)e.b="Required";if(!f.p)e.p="Required";if(!/^\S+@\S+\.\S+$/.test(f.e))e.e="Valid email needed";if(!f.cn)e.cn="Required";if(!f.bu||+f.bu<=0)e.bu="Enter budget";setEr(e);if(!Object.keys(e).length){toast("Collaboration request sent to "+c.name);close()}};
return <div className="modal" onClick={close}><div className="card" onClick={e=>e.stopPropagation()}><h3 style={{fontSize:28,marginBottom:14}}>Request collaboration</h3><div className="fgrid">
<Field l="Brand name" v={f.b} set={s("b")} err={er.b}/><Field l="Contact person" v={f.p} set={s("p")} err={er.p}/><Field l="Email" v={f.e} set={s("e")} err={er.e}/><div><label>Selected creator</label><input value={c.name} readOnly/></div>
<Field l="Campaign name" v={f.cn} set={s("cn")} err={er.cn}/><Field l="Campaign date" type="date" v={f.dt} set={s("dt")}/><Field l="Platform" v={f.pl} set={s("pl")} opts={["Instagram","YouTube","Both"]}/><Field l="Content duration" v={f.du} set={s("du")} opts={["20 Seconds","30 Seconds","60 Seconds"]}/>
<Field full area l="Campaign description" v={f.d} set={s("d")}/><Field l="Expected deliverables" v={f.dl} set={s("dl")} ph="2 reels + 1 story"/><Field l="Proposed budget (₹)" type="number" v={f.bu} set={s("bu")} err={er.bu}/></div><br/><div style={{display:"flex",gap:10}}><button className="btn red big" onClick={go}>Send Collaboration Request</button><button className="btn big" onClick={close}>Cancel</button></div></div></div>}

function JoinCreator({go,addCreator,toast}){const [step,setStep]=useState(1),[f,setF]=useState({name:"",email:"",mob:"",city:"",state:"",niche:"",ig:"",yt:"",oth:"",igf:"",ytf:"",bio:"",lang:"",aud:"",port:""}),[er,setEr]=useState({}),[sig,setSig]=useState(""),[ok,setOk]=useState(false),[st,setSt]=useState("Pending");const s=k=>v=>setF({...f,[k]:v});
const sub=()=>{const e={};if(f.name.trim().length<3)e.name="Enter full name";if(!/^\S+@\S+\.\S+$/.test(f.email))e.email="Valid email needed";if(!/^[6-9]\d{9}$/.test(f.mob))e.mob="10-digit Indian mobile";if(!f.city)e.city="Required";if(!f.state)e.state="Required";if(!f.niche)e.niche="Pick a niche";if(!/instagram\.com\//.test(f.ig))e.ig="Enter a valid Instagram URL";if(!/youtube\.com\/|youtu\.be\//.test(f.yt))e.yt="Enter a valid YouTube URL";if(!(+f.igf>=0)||f.igf==="")e.igf="Required";if(!(+f.ytf>=0)||f.ytf==="")e.ytf="Required";if(f.bio.length<20)e.bio="Min 20 characters";if(!f.lang)e.lang="Required";setEr(e);if(!Object.keys(e).length)setStep(2)};
const sign=()=>{if(sig.trim().length<3||!ok){toast("Type your signature and tick consent");return}setSt("Signed");toast("Agreement signed")};
const dl=()=>downloadAgreementPdf(f,sig,st);
const pub=()=>{const i=addCreator({name:f.name,niche:f.niche,city:f.city,lang:f.lang,ig:+f.igf,yt:+f.ytf,bio:f.bio,h:f.ig.split("/").filter(Boolean).pop()});toast("Profile published!");go("creator",i)};
const pct=step===1?30:st==="Signed"?100:65;
return <div className="wrap" style={{paddingTop:50,maxWidth:860}}><h2 style={{fontSize:"clamp(34px,6vw,64px)"}}>Join as creator</h2><div className="prog" style={{margin:"14px 0 6px"}}><i style={{width:pct+"%"}}/></div><p className="sub" style={{marginBottom:22}}>Profile completion {pct}% · {step===1?"Step 1: Your details":"Step 2: Sign agreement"}</p>
{step===1?<div className="card"><div className="fgrid"><Field l="Full name" v={f.name} set={s("name")} err={er.name}/><Field l="Email address" v={f.email} set={s("email")} err={er.email}/><Field l="Mobile number" v={f.mob} set={s("mob")} err={er.mob}/><Field l="Creator category / niche" v={f.niche} set={s("niche")} opts={CATS} err={er.niche}/><Field l="City" v={f.city} set={s("city")} err={er.city}/><Field l="State" v={f.state} set={s("state")} err={er.state}/><Field l="Instagram profile URL" v={f.ig} set={s("ig")} err={er.ig} ph="https://instagram.com/you"/><Field l="YouTube channel URL" v={f.yt} set={s("yt")} err={er.yt} ph="https://youtube.com/@you"/><Field l="Total Instagram followers" type="number" v={f.igf} set={s("igf")} err={er.igf}/><Field l="Total YouTube subscribers" type="number" v={f.ytf} set={s("ytf")} err={er.ytf}/><Field l="Other social links" v={f.oth} set={s("oth")}/><Field l="Languages" v={f.lang} set={s("lang")} err={er.lang} ph="Hindi, English"/><div className="full"><label>Profile photo</label><input type="file" accept="image/*"/></div><Field full area l="Short creator bio" v={f.bio} set={s("bio")} err={er.bio}/><Field full area l="Audience demographics" v={f.aud} set={s("aud")} ph="e.g. 70% women, 18–30, metro cities"/><Field full l="Portfolio / previous work (links)" v={f.port} set={s("port")}/></div><br/><button className="btn red big" onClick={sub}>Register & continue →</button></div>
:<div className="card"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><h3 style={{fontSize:26}}>Collaboration agreement</h3><span className={"st "+st} style={{marginLeft:"auto"}}>{st}</span></div>
<div className="doc"><h3>Creator Collaboration Agreement</h3><p>Between <b>Collably Platform Pvt. Ltd.</b> and <b>{f.name}</b> , {f.email}, {f.city}, {f.state}.</p><h4>1. Terms & conditions</h4><p>Creator agrees to list their profile and rates on the Company platform and to respond to brand enquiries promptly.</p><h4>2. Collaboration guidelines</h4><p>Sponsored content must be disclosed, truthful and delivered on the agreed timeline.</p><h4>3. Content usage rights</h4><p>Creator retains ownership; brands receive usage rights only as agreed per campaign.</p><h4>4. Payment terms</h4><p>Payment follows the rates and schedule agreed in each collaboration.</p><h4>5. Professional conduct</h4><p>Creator will act respectfully and avoid misleading or unlawful content.</p><h4>6. Validity</h4><p>This agreement is valid for 12 months from the date of signing, auto-renewable.</p></div>
<div style={{margin:"16px 0"}}><label>Digital signature (type your name)</label><input value={sig} onChange={e=>setSig(e.target.value)} disabled={st!=="Pending"}/><div className="sig">{sig}</div><p style={{fontSize:12,color:"var(--mut)"}}>Date: {new Date().toLocaleDateString("en-IN")}</p></div>
<label style={{display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" style={{width:18}} checked={ok} onChange={e=>setOk(e.target.checked)}/>I have read the agreement and consent to sign it digitally.</label><br/>
<div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button className="btn red" onClick={sign} disabled={st==="Signed"}>Accept & Sign</button><button className="btn" onClick={()=>setSt("Rejected")}>Reject</button><button className="btn" onClick={dl}>Download Agreement</button>{st==="Signed"&&<button className="btn white" onClick={pub}>Publish my profile ↗</button>}</div>
<p style={{fontSize:12,color:"var(--mut)",marginTop:10}}>Your profile becomes visible to brands only after the agreement is signed.</p></div>}</div>}

function JoinBrand({go,setBrand,toast}){const [f,setF]=useState({co:"",cp:"",em:"",mb:"",web:"",ind:"",loc:"",ds:"",req:"",bud:""}),[er,setEr]=useState({});const s=k=>v=>setF({...f,[k]:v});
const sub=()=>{const e={};if(!f.co)e.co="Required";if(!f.cp)e.cp="Required";if(!/^\S+@\S+\.\S+$/.test(f.em))e.em="Valid business email";if(!/^[6-9]\d{9}$/.test(f.mb))e.mb="10-digit mobile";if(!/^https?:\/\/\S+\.\S+/.test(f.web))e.web="Enter full URL";if(!f.ind)e.ind="Required";if(!f.loc)e.loc="Required";if(!f.bud)e.bud="Select budget";setEr(e);if(!Object.keys(e).length){setBrand(f.co);toast("Welcome, "+f.co+"! Directory unlocked.");go("explore")}};
return <div className="wrap" style={{paddingTop:50,maxWidth:860}}><h2 style={{fontSize:"clamp(34px,6vw,64px)"}}>Register your brand</h2><p className="sub" style={{marginBottom:22}}>Get instant access to the full creator directory.</p><div className="card"><div className="fgrid"><Field l="Company name" v={f.co} set={s("co")} err={er.co}/><Field l="Contact person" v={f.cp} set={s("cp")} err={er.cp}/><Field l="Business email" v={f.em} set={s("em")} err={er.em}/><Field l="Mobile number" v={f.mb} set={s("mb")} err={er.mb}/><Field l="Company website" v={f.web} set={s("web")} err={er.web} ph="https://"/><Field l="Industry" v={f.ind} set={s("ind")} err={er.ind} opts={["Fashion","Beauty","Food & Beverage","Technology","Fitness","Travel","Education","Other"]}/><Field l="Location" v={f.loc} set={s("loc")} err={er.loc}/><Field l="Estimated collaboration budget" v={f.bud} set={s("bud")} err={er.bud} opts={["Under ₹25,000","₹25,000 – ₹1 lakh","₹1 – 5 lakh","₹5 lakh+"]}/><div className="full"><label>Company logo</label><input type="file" accept="image/*"/></div><Field full area l="Company description" v={f.ds} set={s("ds")}/><Field full area l="Advertising requirements" v={f.req} set={s("req")}/></div><br/><button className="btn red big" onClick={sub}>Register & explore creators →</button></div></div>}

function Footer({go}){return <footer id="contact"><div className="wrap"><div className="fg"><div><div className="logo" style={{color:"#fff"}}><i>C</i>Collably</div><p style={{margin:"10px 0",maxWidth:300}}>A focused platform for creator and brand collaboration. hello@collably.example</p><div style={{display:"flex",gap:8}}><span className="ico ig">IG</span><span className="ico yt">▶</span><span className="ico" style={{background:"#0a66c2"}}>in</span></div></div>
<div><b style={{color:"#fff"}}>Platform</b><a>About Platform</a><a onClick={()=>go("explore")}>Explore Creators</a><a onClick={()=>go("editors")}>Find Editors</a><a>Contact</a></div><div><b style={{color:"#fff"}}>Join</b><a onClick={()=>go("joincreator")}>For Creators</a><a onClick={()=>go("joinbrand")}>For Brands</a><a onClick={()=>go("joineditor")}>For Editors</a></div><div><b style={{color:"#fff"}}>Legal</b><a>Privacy Policy</a><a>Terms & Conditions</a><a>Collaboration Agreement</a></div></div><p style={{marginTop:30,fontSize:12}}>© 2026 Collably. All rights reserved.</p></div></footer>}

function App(){const [page,setPage]=useState("home"),[cid,setCid]=useState(1),[eds,setEds]=useState(SEED_EDITORS),[eid,setEid]=useState(1),[cs,setCs]=useState(SEED),[open,setOpen]=useState(false),[brand,setBrand]=useState(""),[t,setT]=useState("");
const toast=m=>{setT(m);setTimeout(()=>setT(""),2600)};
const go=(p,x)=>{setOpen(false);if(p==="creator")setCid(x);if(p==="editor")setEid(x);setPage(p);if(["home","explore","editors","joincreator","joinbrand","joineditor"].includes(p))history.replaceState(null,"","#"+p);if(x==="how"){setPage("home");setTimeout(()=>document.getElementById("how")?.scrollIntoView(),80)}else scrollTo(0,0)};
useEffect(()=>{const h=location.hash.slice(1);if(["explore","editors","joincreator","joinbrand","joineditor"].includes(h))setPage(h)},[]);
const addCreator=d=>{const id=cs.length+1;setCs([...cs,{...d,id,g:GR[id%6],er:"4.2",rv:fmt(d.ig*.15),vv:fmt(d.yt*.1+3000),rates:mkRates(3000),past:["—","—","—"]}]);return id};
const setRates=(id,i,v)=>setCs(cs.map(c=>c.id===id?{...c,rates:c.rates.map((r,j)=>j===i?{...r,p:v}:r)}:c));
const addEditor=d=>{const id=eds.length+1;setEds([...eds,{...d,id,g:GR[id%6],projects:0}]);return id};
const addPf=(id,it)=>setEds(es=>es.map(x=>x.id===id?{...x,portfolio:[...x.portfolio,it]}:x));
const rmPf=(id,iid)=>setEds(es=>es.map(x=>x.id===id?{...x,portfolio:x.portfolio.filter(p=>p.id!==iid)}:x));
const ed=eds.find(x=>x.id===eid)||eds[0];
const c=cs.find(x=>x.id===cid)||cs[0];
return <><ScrollBar/><Nav page={page} go={go} open={open} setOpen={setOpen}/>{brand&&<div className="wrap" style={{marginTop:10,fontSize:12,color:"var(--mut)"}}>Signed in as brand: <b style={{color:"#fff"}}>{brand}</b></div>}
{page==="home"&&<Home go={go} cs={cs} eds={eds}/>}{page==="explore"&&<Explore cs={cs} go={go}/>}{page==="creator"&&<Profile c={c} go={go} setRates={setRates} toast={toast}/>}{page==="joincreator"&&<JoinCreator go={go} addCreator={addCreator} toast={toast}/>}{page==="joinbrand"&&<JoinBrand go={go} setBrand={setBrand} toast={toast}/>}{page==="editors"&&<ExploreEditors eds={eds} go={go}/>}{page==="editor"&&<EditorProfile e={ed} go={go} addPf={addPf} rmPf={rmPf} toast={toast}/>}{page==="joineditor"&&<JoinEditor go={go} addEditor={addEditor} toast={toast}/>}
<Footer go={go}/>{t&&<div className="toast">{t}</div>}</>}
export default App;