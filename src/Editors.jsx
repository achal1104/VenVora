import React,{useState,useMemo,useRef} from "react";
import {Ph} from "./Sections.jsx";

const GR=["#e8223f,#ff8a3d","#ff6b8f,#8f1325","#ffc933,#ff8a3d","#8f1325,#e8223f","#ff8a3d,#ff6b8f","#e8223f,#ffc933"];
export const SPECS=["Instagram Reels","YouTube Shorts","YouTube Long-form","Brand Ads / Promos","Podcast / Interviews","Gaming","Wedding / Events","Motion Graphics"];
export const TOOLS=["Premiere Pro","DaVinci Resolve","Final Cut Pro","After Effects","CapCut","VN Editor"];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const inr=n=>"₹"+Number(n).toLocaleString("en-IN");
const demo=t=>({id:uid(),kind:"demo",title:t});

const base=[
["Aarav Patil","Instagram Reels","Pune","Marathi, Hindi, English",["Premiere Pro","CapCut"],4,1500,"24 hrs",160],
["Sneha Kulkarni","Instagram Reels","Nagpur","Marathi, Hindi",["CapCut","VN Editor"],3,1000,"24 hrs",120],
["Imran Sheikh","YouTube Long-form","Mumbai","Hindi, English, Urdu",["DaVinci Resolve","Premiere Pro"],6,6000,"3 days",85],
["Tanvi Rao","Motion Graphics","Bengaluru","English, Kannada",["After Effects","Premiere Pro"],5,4500,"3 days",70],
["Karan Mehta","Brand Ads / Promos","Delhi","Hindi, English",["Final Cut Pro","After Effects"],7,8000,"4 days",95],
["Pooja Wankhede","YouTube Shorts","Nagpur","Marathi, Hindi",["CapCut","Premiere Pro"],2,800,"12 hrs",210],
["Rahul Nair","Gaming","Kochi","English, Malayalam",["DaVinci Resolve"],4,2500,"2 days",64],
["Nisha Joshi","Wedding / Events","Jaipur","Hindi, English",["Premiere Pro","DaVinci Resolve"],8,12000,"5 days",48]
];
// Placeholder portraits matched to gender. Change the number (0-99) to pick another face,
// or replace with your own photo path like "/editors/aarav.jpg" (put files in public/editors/).
const PH={"Aarav Patil":"men/32","Sneha Kulkarni":"women/44","Imran Sheikh":"men/41","Tanvi Rao":"women/68","Karan Mehta":"men/36","Pooja Wankhede":"women/65","Rahul Nair":"men/22","Nisha Joshi":"women/26"};
export const SEED_EDITORS=base.map(([name,spec,city,lang,tools,exp,price,tat,projects],i)=>({
  id:i+1,name,spec,city,lang,tools,exp,price,tat,projects,g:GR[i%6],img:"https://randomuser.me/api/portraits/"+PH[name]+".jpg",
  bio:`${spec} editor from ${city} with ${exp}+ years of experience. Clean cuts, strong hooks, fast delivery and unlimited-feel revisions for creators and brands.`,
  portfolio:["Reel · Product launch","Reel · Before/After","Video · Vlog edit","Ad · Festive promo","Short · Trending cut","Reel · Brand story"].map(demo)
}));

function Field({l,v,set,err,type="text",opts,area,full,ph}){return <div className={full?"full":""}><label>{l}</label>{opts?<select value={v} onChange={e=>set(e.target.value)}><option value="">Select…</option>{opts.map(o=><option key={o}>{o}</option>)}</select>:area?<textarea rows="3" value={v} placeholder={ph} onChange={e=>set(e.target.value)}/>:<input type={type} value={v} placeholder={ph} onChange={e=>set(e.target.value)}/>}{err&&<div className="er">{err}</div>}</div>}

const EAv=({e,cls=""})=><div className={"av "+cls} style={{background:`linear-gradient(135deg,${e.g})`}}>{e.name[0]}<Ph src={e.img} alt={e.name}/></div>;

/* ---------- Portfolio grid (images, videos, links, demo tiles) ---------- */
export function PortfolioGrid({items,onRemove}){
  if(!items.length)return <div className="card" style={{color:"var(--mut)"}}>No portfolio items yet.</div>;
  return <div className="grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))"}}>{items.map((it,i)=>{
    const bgc={background:`linear-gradient(160deg,${GR[i%6]})`,color:"#fff"};
    return <div key={it.id} className="tile pf" style={it.kind==="video"||it.kind==="image"?{background:"#000"}:bgc}>
      {it.kind==="video"&&<video src={it.src} controls muted playsInline preload="metadata"/>}
      {it.kind==="image"&&<img src={it.src} alt={it.title}/>}
      {it.kind==="link"&&<a href={it.src} target="_blank" rel="noopener noreferrer" className="lk">▶ Watch ↗</a>}
      <div className="tl">{it.title}</div>
      {onRemove&&<button className="rm" title="Remove" onClick={()=>onRemove(it.id)}>×</button>}
    </div>})}</div>}

/* ---------- Add portfolio: upload videos/images or paste links ---------- */
function PortfolioAdder({onAdd,toast}){
  const fr=useRef(),[lt,setLt]=useState(""),[lu,setLu]=useState("");
  const files=e=>{const list=[...e.target.files];list.forEach(f=>{
    if(!/^(video|image)\//.test(f.type)){toast(f.name+" skipped (only video / image)");return}
    onAdd({id:uid(),kind:f.type.startsWith("video")?"video":"image",title:f.name.replace(/\.[^.]+$/,""),src:URL.createObjectURL(f)})});
    if(list.length)toast(list.length+" file(s) added");e.target.value=""};
  const link=()=>{if(!/^https?:\/\/\S+\.\S+/.test(lu)){toast("Enter a full URL (https://…)");return}
    onAdd({id:uid(),kind:"link",title:lt.trim()||"Portfolio link",src:lu.trim()});setLt("");setLu("");toast("Link added")};
  return <div className="card" style={{margin:"0 0 16px",background:"#ffffff08"}}>
    <label>Upload reels / videos / images</label>
    <input ref={fr} type="file" multiple accept="video/*,image/*" onChange={files}/>
    <p style={{fontSize:12,color:"var(--mut)",margin:"6px 0 14px"}}>Tip: for big files, paste a YouTube / Instagram / Drive link below.</p>
    <div className="fgrid"><div><label>Link title</label><input value={lt} onChange={e=>setLt(e.target.value)} placeholder="e.g. Festive launch reel"/></div><div><label>Video link</label><input value={lu} onChange={e=>setLu(e.target.value)} placeholder="https://instagram.com/reel/…"/></div></div>
    <br/><button className="btn" onClick={link}>+ Add link</button></div>}

/* ---------- Editor card ---------- */
export function EditorCard({e,go}){return <div className="cc"><div className="ph" style={{background:`linear-gradient(135deg,${e.g})`}}>{e.name[0]}<Ph src={e.img} alt={e.name}/></div><div style={{padding:18}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}><h3 style={{fontSize:21}}>{e.name}</h3><span className="tag">✂ Editor</span></div>
  <div style={{color:"var(--mut)",fontSize:13,margin:"2px 0 10px"}}>📍 {e.city} · {e.lang}</div>
  <p style={{fontWeight:600,marginBottom:8}}>{e.spec}</p>
  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{e.tools.map(t=><span key={t} className="tag">{t}</span>)}</div>
  <div style={{display:"flex",gap:8}}><div className="stat"><b>{e.exp} yrs</b><span>Experience</span></div><div className="stat"><b>{e.tat}</b><span>Turnaround</span></div></div>
  <div style={{margin:"14px 0",fontSize:12,color:"var(--mut)"}}>Starting at <b style={{color:"var(--yellow)",fontSize:16}}>{inr(e.price)}</b> / video</div>
  <button className="btn red" style={{width:"100%"}} onClick={()=>go("editor",e.id)}>View Portfolio</button></div></div>}

/* ---------- Direct hire request (creator or brand -> editor) ---------- */
function HireModal({e,close,toast}){
  const [f,setF]=useState({who:"",n:"",em:"",mb:"",pt:"",pl:"Instagram",cnt:"1",dl:"",bu:"",fl:"",br:""}),[er,setEr]=useState({});
  const s=k=>v=>setF({...f,[k]:v});
  const send=()=>{const x={};
    if(!f.who)x.who="Select one";if(!f.n.trim())x.n="Required";
    if(!/^\S+@\S+\.\S+$/.test(f.em))x.em="Valid email needed";
    if(!/^[6-9]\d{9}$/.test(f.mb))x.mb="10-digit mobile";
    if(!f.pt)x.pt="Select type";if(!(+f.cnt>0))x.cnt="Enter count";
    if(!f.bu||+f.bu<=0)x.bu="Enter budget";if(f.br.trim().length<15)x.br="Describe the edit (min 15 chars)";
    setEr(x);if(!Object.keys(x).length){toast("Request sent to "+e.name+". They will contact you directly.");close()}};
  return <div className="modal" onClick={close}><div className="card" onClick={ev=>ev.stopPropagation()}>
    <h3 style={{fontSize:28,marginBottom:14}}>Hire {e.name}</h3><div className="fgrid">
    <Field l="I am a" v={f.who} set={s("who")} opts={["Creator","Brand"]} err={er.who}/><Field l="Your / brand name" v={f.n} set={s("n")} err={er.n}/>
    <Field l="Email" v={f.em} set={s("em")} err={er.em}/><Field l="Mobile number" v={f.mb} set={s("mb")} err={er.mb}/>
    <div><label>Selected editor</label><input value={e.name} readOnly/></div>
    <Field l="Type of edit" v={f.pt} set={s("pt")} opts={SPECS} err={er.pt}/>
    <Field l="Platform" v={f.pl} set={s("pl")} opts={["Instagram","YouTube","Both"]}/><Field l="Number of videos" type="number" v={f.cnt} set={s("cnt")} err={er.cnt}/>
    <Field l="Deadline" type="date" v={f.dl} set={s("dl")}/><Field l="Budget (₹)" type="number" v={f.bu} set={s("bu")} err={er.bu}/>
    <Field full l="Raw footage link (Drive / Dropbox)" v={f.fl} set={s("fl")} ph="https://drive.google.com/…"/>
    <Field full area l="Brief / what you want" v={f.br} set={s("br")} ph="Style, references, music, captions, hooks…" err={er.br}/></div><br/>
    <div style={{display:"flex",gap:10}}><button className="btn red big" onClick={send}>Send Request</button><button className="btn big" onClick={close}>Cancel</button></div></div></div>}

/* ---------- Explore editors ---------- */
export function ExploreEditors({eds,go}){
  const [f,setF]=useState({q:"",spec:"",tool:"",city:"",lang:"",bud:0,sort:"exp"});const s=(k,v)=>setF({...f,[k]:v});
  const cities=[...new Set(eds.map(e=>e.city))],langs=[...new Set(eds.flatMap(e=>e.lang.split(", ")))];
  const L=useMemo(()=>eds.filter(e=>(!f.q||e.name.toLowerCase().includes(f.q.toLowerCase()))&&(!f.spec||e.spec===f.spec)&&(!f.tool||e.tools.includes(f.tool))&&(!f.city||e.city===f.city)&&(!f.lang||e.lang.includes(f.lang))&&(!f.bud||e.price<=f.bud)).sort((a,b)=>f.sort==="exp"?b.exp-a.exp:f.sort==="pr"?a.price-b.price:b.projects-a.projects),[eds,f]);
  return <div className="wrap" style={{paddingTop:50}}>
    <h2 style={{fontSize:"clamp(36px,6vw,72px)"}}>Find editors</h2>
    <p className="sub">Specialist reel and video editors for creators and brands. Check portfolios, then connect directly.</p>
    <div style={{margin:"14px 0"}}><button className="btn red" onClick={()=>go("joineditor")}>Join as Editor ↗</button></div>
    <div className="filters"><input placeholder="🔍 Search editor" value={f.q} onChange={e=>s("q",e.target.value)}/>
      <select value={f.spec} onChange={e=>s("spec",e.target.value)}><option value="">All specialities</option>{SPECS.map(x=><option key={x}>{x}</option>)}</select>
      <select value={f.tool} onChange={e=>s("tool",e.target.value)}><option value="">Any software</option>{TOOLS.map(x=><option key={x}>{x}</option>)}</select>
      <select value={f.city} onChange={e=>s("city",e.target.value)}><option value="">Any city</option>{cities.map(x=><option key={x}>{x}</option>)}</select>
      <select value={f.lang} onChange={e=>s("lang",e.target.value)}><option value="">Any language</option>{langs.map(x=><option key={x}>{x}</option>)}</select>
      <select value={f.bud} onChange={e=>s("bud",+e.target.value)}><option value="0">Any budget</option><option value="1500">Up to ₹1,500</option><option value="5000">Up to ₹5,000</option><option value="10000">Up to ₹10,000</option></select>
      <select value={f.sort} onChange={e=>s("sort",e.target.value)}><option value="exp">Sort: Experience</option><option value="pr">Sort: Price</option><option value="pj">Sort: Projects</option></select></div>
    <p className="sub" style={{marginBottom:14}}>{L.length} editors available</p>
    <div className="grid">{L.map(e=><EditorCard key={e.id} e={e} go={go}/>)}</div>{!L.length&&<div className="card">No editors match these filters.</div>}</div>}

/* ---------- Editor profile ---------- */
export function EditorProfile({e,go,addPf,rmPf,toast}){
  const [m,setM]=useState(false),[edit,setEdit]=useState(false);
  return <div className="wrap" style={{paddingTop:40}}><button className="btn" onClick={()=>go("editors")}>← Back to editors</button>
    <div className="card" style={{marginTop:18,display:"flex",gap:26,flexWrap:"wrap",background:`linear-gradient(135deg,${e.g.split(",")[1]}55,var(--card))`}}><EAv e={e} cls="sq"/>
      <div style={{flex:1,minWidth:240}}><h2 style={{fontSize:46}}>{e.name} <span className="tag" style={{fontFamily:"Inter",fontSize:12}}>✂ Video Editor</span></h2>
        <p style={{color:"var(--mut)",maxWidth:560}}>{e.bio}</p>
        <p style={{margin:"8px 0"}}><span className="tag">{e.spec}</span> <span className="tag">📍 {e.city}</span> <span className="tag">🗣 {e.lang}</span></p>
        <p style={{margin:"8px 0",display:"flex",gap:6,flexWrap:"wrap"}}>{e.tools.map(t=><span key={t} className="tag">🛠 {t}</span>)}</p>
        <button className="btn red big" onClick={()=>setM(true)}>Hire / Connect Directly</button></div></div>
    <div className="why" style={{margin:"18px 0",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))"}}>
      <div className="stat"><b>{inr(e.price)}</b><span>Starting price / video</span></div><div className="stat"><b>{e.tat}</b><span>Typical turnaround</span></div>
      <div className="stat"><b>{e.exp}+ yrs</b><span>Experience</span></div><div className="stat"><b>{e.projects}+</b><span>Projects delivered</span></div></div>
    <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",margin:"34px 0 14px"}}><h2 style={{fontSize:36}}>Portfolio</h2>
      <button className="btn" onClick={()=>{setEdit(!edit);edit&&toast("Portfolio saved")}}>{edit?"✓ Done":"✎ Manage portfolio (editor mode)"}</button></div>
    {edit&&<PortfolioAdder onAdd={it=>addPf(e.id,it)} toast={toast}/>}
    <PortfolioGrid items={e.portfolio} onRemove={edit?iid=>rmPf(e.id,iid):null}/>
    <p style={{color:"var(--mut)",fontSize:12,margin:"10px 0"}}>Uploaded files live in this browser session. Connect a backend / storage (e.g. Cloudinary, S3) to keep them permanently.</p>
    {m&&<HireModal e={e} close={()=>setM(false)} toast={toast}/>}</div>}

/* ---------- Editor registration ---------- */
export function JoinEditor({go,addEditor,toast}){
  const [step,setStep]=useState(1),[f,setF]=useState({name:"",email:"",mob:"",city:"",state:"",spec:"",tools:"",exp:"",price:"",tat:"",lang:"",bio:""}),[er,setEr]=useState({}),[img,setImg]=useState(""),[pf,setPf]=useState([]);
  const s=k=>v=>setF({...f,[k]:v});
  const sub=()=>{const e={};
    if(f.name.trim().length<3)e.name="Enter full name";if(!/^\S+@\S+\.\S+$/.test(f.email))e.email="Valid email needed";
    if(!/^[6-9]\d{9}$/.test(f.mob))e.mob="10-digit Indian mobile";if(!f.city)e.city="Required";if(!f.state)e.state="Required";
    if(!f.spec)e.spec="Pick a speciality";if(!f.tools.trim())e.tools="Add at least one software";
    if(f.exp===""||!(+f.exp>=0))e.exp="Required";if(!f.price||+f.price<=0)e.price="Enter starting price";
    if(!f.tat)e.tat="Required";if(!f.lang)e.lang="Required";if(f.bio.length<20)e.bio="Min 20 characters";
    setEr(e);if(!Object.keys(e).length){setStep(2);scrollTo(0,0)}};
  const photo=ev=>{const x=ev.target.files[0];if(x)setImg(URL.createObjectURL(x))};
  const pub=()=>{if(!pf.length){toast("Add at least one portfolio item");return}
    const id=addEditor({name:f.name.trim(),spec:f.spec,city:f.city,lang:f.lang,tools:f.tools.split(",").map(x=>x.trim()).filter(Boolean),exp:+f.exp,price:+f.price,tat:f.tat,bio:f.bio,img,portfolio:pf});
    toast("Editor profile published!");go("editor",id)};
  const pct=step===1?40:pf.length?100:70;
  return <div className="wrap" style={{paddingTop:50,maxWidth:860}}><h2 style={{fontSize:"clamp(34px,6vw,64px)"}}>Join as editor</h2>
    <div className="prog" style={{margin:"14px 0 6px"}}><i style={{width:pct+"%"}}/></div>
    <p className="sub" style={{marginBottom:22}}>Profile completion {pct}% · {step===1?"Step 1: Your details":"Step 2: Upload portfolio"}</p>
    {step===1?<div className="card"><div className="fgrid">
      <Field l="Full name" v={f.name} set={s("name")} err={er.name}/><Field l="Email address" v={f.email} set={s("email")} err={er.email}/>
      <Field l="Mobile number" v={f.mob} set={s("mob")} err={er.mob}/><Field l="Main speciality" v={f.spec} set={s("spec")} opts={SPECS} err={er.spec}/>
      <Field l="City" v={f.city} set={s("city")} err={er.city}/><Field l="State" v={f.state} set={s("state")} err={er.state}/>
      <Field l="Software you use" v={f.tools} set={s("tools")} err={er.tools} ph="Premiere Pro, CapCut"/><Field l="Languages" v={f.lang} set={s("lang")} err={er.lang} ph="Marathi, Hindi, English"/>
      <Field l="Experience (years)" type="number" v={f.exp} set={s("exp")} err={er.exp}/><Field l="Starting price per video (₹)" type="number" v={f.price} set={s("price")} err={er.price}/>
      <Field l="Typical turnaround" v={f.tat} set={s("tat")} err={er.tat} opts={["12 hrs","24 hrs","2 days","3 days","4 days","5 days","1 week"]}/>
      <div><label>Profile photo</label><input type="file" accept="image/*" onChange={photo}/></div>
      <Field full area l="Short bio" v={f.bio} set={s("bio")} err={er.bio} ph="Your editing style, strengths, type of clients…"/></div>
      <br/><button className="btn red big" onClick={sub}>Register & continue →</button></div>
    :<div className="card"><h3 style={{fontSize:26,marginBottom:12}}>Upload your portfolio</h3>
      <PortfolioAdder onAdd={it=>setPf(p=>[...p,it])} toast={toast}/>
      <PortfolioGrid items={pf} onRemove={iid=>setPf(p=>p.filter(x=>x.id!==iid))}/>
      <br/><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button className="btn" onClick={()=>setStep(1)}>← Back</button><button className="btn red big" onClick={pub} disabled={!pf.length}>Publish my profile ↗</button></div>
      <p style={{fontSize:12,color:"var(--mut)",marginTop:10}}>Creators and brands will see your portfolio and can contact you directly.</p></div>}</div>}

/* ---------- Home section ---------- */
export function HomeEditors({eds,go}){return <section className="sec"><div className="wrap">
  <span className="pill">#ForEditors</span><h2 style={{marginTop:14}}>Need a specialist<br/>editor for your reels?</h2>
  <p className="sub">Creators and brands can connect directly with expert video editors. Editors can register and showcase their portfolio.</p>
  <div className="grid" style={{marginTop:26}}>{eds.slice(0,4).map(e=><EditorCard key={e.id} e={e} go={go}/>)}</div><br/>
  <div className="cta" style={{justifyContent:"flex-start"}}><button className="btn red big" onClick={()=>go("editors")}>Find editors ↗</button><button className="btn big white" onClick={()=>go("joineditor")}>Join as Editor ↗</button></div></div></section>}