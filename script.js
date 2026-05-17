const chars=[
{name:"Village Boy",img:"assets/characters/village-boy.png"},
{name:"Village Woman",img:"assets/characters/village-woman.png"},
{name:"Grandmother",img:"assets/characters/grandmother.png"},
{name:"Villain Man",img:"assets/characters/villain-man.png"}
];
let selected=chars[0], scenes=[], selectedScene=0, timer=null;

const $=id=>document.getElementById(id);
document.querySelectorAll("[data-page]").forEach(btn=>btn.onclick=()=>showPage(btn.dataset.page));
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 $(id).classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));
 window.scrollTo({top:0,behavior:"smooth"});
 if(id==="projects") loadProjects();
}
function renderChars(){
 $("characters").innerHTML=chars.map((c,i)=>`<div class="char ${i===0?'active':''}" onclick="selectChar(${i})"><div class="imgbox"><img src="${c.img}" onerror="this.style.display='none'"></div><b>${c.name}</b></div>`).join("");
}
window.selectChar=i=>{
 selected=chars[i]||chars[0];
 document.querySelectorAll(".char").forEach((c,idx)=>c.classList.toggle("active",idx===i));
 $("charPreview").src=selected.img; $("editorChar").src=selected.img;
 updatePreview();
}
function splitScript(){return $("script").value.split(/[.।\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,8)}
window.autoGenerate=()=>{
 scenes=splitScript().map((text,i)=>({text,bg:i%2?"forest":$("bg").value,character:selected.name,img:selected.img,action:i%2?"Walking":"Talking",voice:$("voice").value}));
 selectedScene=0;
 renderScenes(); renderTimeline(); updatePreview(); playPreview(); showPage("editor");
}
function renderScenes(){
 $("sceneCards").innerHTML=scenes.map((s,i)=>`<div class="scene"><b>Scene ${i+1}</b><p>${s.text}</p><small>${s.character} • ${s.voice}</small></div>`).join("");
}
function renderTimeline(){
 $("sceneCount").textContent=scenes.length+" scenes";
 const make=(name,fn)=>scenes.map((s,i)=>`<div class="clip ${i===selectedScene?'active':''}" onclick="selectScene(${i})">${fn(s,i)}</div>`).join("");
 $("sceneTrack").innerHTML=make("scene",(s,i)=>"Scene "+(i+1));
 $("characterTrack").innerHTML=make("char",s=>s.character);
 $("subtitleTrack").innerHTML=make("sub",s=>s.text.slice(0,24)+"...");
 $("voiceTrack").innerHTML=make("voice",s=>s.voice);
}
window.selectScene=i=>{
 selectedScene=i;
 const s=scenes[i];
 $("sceneEdit").value=s.text;
 $("action").value=s.action || "Talking";
 updatePreview(s); renderTimeline();
}
function emoji(text){text=(text||"").toLowerCase(); if(text.includes("घाबर")||text.includes("रहस्यमय")) return "😨"; if(text.includes("वाचव")) return "😊"; return "🗣️";}
window.updatePreview=(scene=null)=>{
 const s=scene||scenes[selectedScene]||{text:"Generate Scenes click करा.",bg:$("bg").value,img:selected.img,action:"Talking"};
 ["preview","editorCanvas"].forEach(id=>{$(id).className=(id==="preview"?"preview ":"canvas ")+s.bg+" "+(s.action||"").toLowerCase();});
 $("subtitle").textContent=s.text; $("editorSubtitle").textContent=s.text; $("emoji").textContent=emoji(s.text);
 $("charPreview").src=s.img||selected.img; $("editorChar").src=s.img||selected.img;
};
window.playPreview=()=>{
 if(!scenes.length) return updatePreview();
 let i=0; clearInterval(timer);
 const step=()=>{selectedScene=i; updatePreview(scenes[i]); renderTimeline(); $("progressBar").style.width=((i+1)/scenes.length*100)+"%"; i=(i+1)%scenes.length;};
 step(); timer=setInterval(step,1800);
}
window.stopPreview=()=>clearInterval(timer);
window.addScene=()=>{scenes.push({text:"New scene text",bg:$("bg").value,character:selected.name,img:selected.img,action:"Talking",voice:$("voice").value}); selectedScene=scenes.length-1; renderScenes(); renderTimeline(); selectScene(selectedScene);}
window.updateSelectedScene=()=>{if(!scenes.length)return; scenes[selectedScene].text=$("sceneEdit").value; scenes[selectedScene].action=$("action").value; renderScenes(); renderTimeline(); updatePreview(scenes[selectedScene]);}
window.duplicateScene=()=>{if(!scenes.length)return; scenes.splice(selectedScene+1,0,{...scenes[selectedScene]}); renderScenes(); renderTimeline();}
window.deleteScene=()=>{if(!scenes.length)return; scenes.splice(selectedScene,1); selectedScene=Math.max(0,selectedScene-1); renderScenes(); renderTimeline(); updatePreview();}
window.updateAction=()=>{if(scenes[selectedScene]){scenes[selectedScene].action=$("action").value; updatePreview(scenes[selectedScene]);}}
window.saveProject=()=>{
 if(!scenes.length) autoGenerate();
 const projects=JSON.parse(localStorage.getItem("projects")||"[]");
 projects.unshift({id:Date.now(),title:$("title").value,scenes,character:selected.name,date:new Date().toLocaleString()});
 localStorage.setItem("projects",JSON.stringify(projects));
 alert("Project saved locally ✅");
}
window.loadProjects=()=>{
 const projects=JSON.parse(localStorage.getItem("projects")||"[]");
 $("projectsList").innerHTML=projects.length?projects.map(p=>`<div class="project"><div class="thumb">🎬</div><h3>${p.title}</h3><p>${p.scenes.length} scenes • ${p.character}</p></div>`).join(""):`<div class="project"><div class="thumb">🖼️</div><h3>No projects yet</h3><p>Create your first demo.</p></div>`;
}
window.downloadDemo=()=>{
 if(!scenes.length) autoGenerate();
 const data={title:$("title").value,format:$("format")?.value||"9:16 Shorts",scenes,note:"Low-cost MVP demo export. Real MP4 needs backend/FFmpeg later."};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="ai-animate-studio-demo-project.json"; a.click();
}
window.useTemplate=name=>{
 $("title").value=name; $("script").value="गावात एक मुलगा राहत होता. त्याला एक मोठी समस्या आली. त्याने धैर्याने प्रयत्न केला. शेवटी गावकऱ्यांनी त्याचा सन्मान केला."; showPage("create");
}
document.addEventListener("DOMContentLoaded",()=>{renderChars(); loadProjects();});
