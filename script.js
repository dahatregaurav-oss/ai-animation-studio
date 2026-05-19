const characters = [
  {
    "name": "Village Man Stick",
    "img": "assets/characters/village-man-stick-2d.png"
  },
  {
    "name": "Village Man Stick 3D",
    "img": "assets/characters/village-man-stick-3d.png"
  },
  {
    "name": "Old Man Stick",
    "img": "assets/characters/old-man-stick.png"
  },
  {
    "name": "Blue Turban Man",
    "img": "assets/characters/blue-turban-man.png"
  },
  {
    "name": "Simple Village Man",
    "img": "assets/characters/simple-village-man.png"
  },
  {
    "name": "Green Headwrap Man",
    "img": "assets/characters/green-headwrap-man.png"
  },
  {
    "name": "Mustache Village Man",
    "img": "assets/characters/mustache-village-man.png"
  },
  {
    "name": "Vest Village Man",
    "img": "assets/characters/vest-village-man.png"
  },
  {
    "name": "School Boy",
    "img": "assets/characters/school-boy.png"
  }
];
const bgs=[{name:"Village",type:"preset",value:"village"},{name:"Forest",type:"preset",value:"forest"},{name:"Night",type:"preset",value:"horror"},{name:"City",type:"preset",value:"city"},{name:"School",type:"preset",value:"school"},{name:"Desert",type:"preset",value:"desert"},{name:"Ocean",type:"preset",value:"ocean"}];
let selectedChar=characters[0],selectedBg=bgs[0],scenes=[],selectedScene=0,timer=null,frame=0,zoom=1,audioUrl=null;
const imgs={},canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),$=id=>document.getElementById(id);
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$(id).classList.add("active");}
function preload(){characters.forEach(c=>{let im=new Image();im.src=c.img;imgs[c.img]=im;})}
function startEditor(){generateScenes();showPage("editor");}
function generateScenes(){const p=$("dashPrompt").value||"गावात एक मुलगा राहत होता";scenes=[{text:p,action:"Idle",pos:"center",char:selectedChar,bg:selectedBg},{text:"तो पुढे चालत गेला",action:"Walking",pos:"center",char:selectedChar,bg:selectedBg},{text:"त्याने गावकऱ्यांशी बोलले",action:"Talking",pos:"center",char:selectedChar,bg:selectedBg},{text:"शेवटी सगळे आनंदी झाले",action:"Happy",pos:"center",char:selectedChar,bg:selectedBg}];selectedScene=0;renderAll();draw();}
function renderAll(){renderChars();renderBgs();renderTimeline();renderProjects();}
function renderChars(){$("chars").innerHTML=characters.map((c,i)=>`<div class="card ${c===selectedChar?'active':''}" onclick="selectChar(${i})"><img src="${c.img}"><b>${c.name}</b></div>`).join("");}
function renderBgs(){$("bgs").innerHTML=bgs.map((b,i)=>`<div class="card ${b===selectedBg?'active':''}" onclick="selectBg(${i})"><div class="bgthumb"></div><b>${b.name}</b></div>`).join("");}
function selectChar(i){selectedChar=characters[i];scenes[selectedScene].char=selectedChar;renderChars();draw();}
function selectBg(i){selectedBg=bgs[i];scenes[selectedScene].bg=selectedBg;renderBgs();draw();}
function bgDraw(bg){const w=canvas.width,h=canvas.height;let colors={village:["#a7e9ff","#fff0a8","#2ddd6f"],forest:["#064e3b","#166534","#052e16"],horror:["#111827","#374151","#020617"],city:["#60a5fa","#1e293b","#0f172a"],school:["#93c5fd","#fef3c7","#c084fc"],desert:["#fbbf24","#fed7aa","#d97706"],ocean:["#38bdf8","#0ea5e9","#0369a1"]}[bg.value]||["#a7e9ff","#fff0a8","#2ddd6f"];let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,colors[0]);g.addColorStop(.58,colors[1]);g.addColorStop(.75,colors[2]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle="rgba(255,255,255,.55)";ctx.beginPath();ctx.arc(w*.2,h*.16,60,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w*.74,h*.17,40,0,Math.PI*2);ctx.fill();}
function draw(progress=0){if(!scenes.length)generateScenes();const s=scenes[selectedScene];ctx.clearRect(0,0,canvas.width,canvas.height);bgDraw(s.bg);const im=imgs[s.char.img]||new Image();if(!imgs[s.char.img]){im.src=s.char.img;imgs[s.char.img]=im;}const w=canvas.width,h=canvas.height;let cw=w*.22*zoom,ch=cw*1.55,x=w/2-cw/2,y=h*.72-ch;if(s.pos==="left")x=w*.22-cw/2;if(s.pos==="right")x=w*.78-cw/2;if(s.action==="Walking")x+=Math.sin(progress*Math.PI*2)*w*.09;if(s.action==="Talking")y+=Math.sin(progress*Math.PI*12)*8;if(s.action==="Jump")y+=Math.sin(progress*Math.PI)*-90;if(s.action==="Dance"){x+=Math.sin(progress*Math.PI*4)*30;y+=Math.sin(progress*Math.PI*4)*-15;}if(s.action==="Fight"||s.action==="Angry"||s.action==="Scared")x+=Math.sin(progress*Math.PI*10)*10;if(s.action==="Happy")y+=Math.sin(progress*Math.PI*2)*-18;if(im.complete&&im.naturalWidth)ctx.drawImage(im,x,y,cw,ch);else{ctx.fillStyle="#1f2937";ctx.fillRect(x,y,cw,ch);}ctx.fillStyle="rgba(0,0,0,.72)";ctx.fillRect(w*.08,h-105,w*.84,65);ctx.fillStyle="#fff";ctx.font="bold 30px Arial";ctx.textAlign="center";ctx.fillText(s.text,w/2,h-65);}
function setAction(a){scenes[selectedScene].action=a;renderTimeline();let f=0;clearInterval(timer);timer=setInterval(()=>{draw((f%60)/60);f++;if(f>90)clearInterval(timer);},33);}
function playPreview(){let i=0,f=0;clearInterval(timer);if(audioUrl){$("audio").currentTime=0;$("audio").play();}timer=setInterval(()=>{selectedScene=i;draw((f%75)/75);f++;if(f%75===0){i=(i+1)%scenes.length;renderTimeline();}},33);}
function stopPreview(){clearInterval(timer);if(audioUrl)$("audio").pause();}
function nextScene(){selectedScene=Math.min(scenes.length-1,selectedScene+1);updateEditor();}
function prevScene(){selectedScene=Math.max(0,selectedScene-1);updateEditor();}
function updateEditor(){$("sceneEdit").value=scenes[selectedScene].text;$("pos").value=scenes[selectedScene].pos;renderTimeline();draw();}
function updateScene(){scenes[selectedScene].text=$("sceneEdit").value;scenes[selectedScene].pos=$("pos").value;draw();renderTimeline();}
function addScene(){scenes.push({text:"New Scene",action:"Idle",pos:"center",char:selectedChar,bg:selectedBg});selectedScene=scenes.length-1;updateEditor();}
function addTextScene(){addScene();scenes[selectedScene].text="Text Scene";updateEditor();}
function duplicateScene(){scenes.splice(selectedScene+1,0,{...scenes[selectedScene]});renderTimeline();}
function deleteScene(){if(scenes.length>1){scenes.splice(selectedScene,1);selectedScene=Math.max(0,selectedScene-1);updateEditor();}}
function zoomIn(){zoom+=.1;draw();}function zoomOut(){zoom=Math.max(.5,zoom-.1);draw();}
function uploadAudioClick(){$("audioInput").click();}function uploadAudio(e){let f=e.target.files[0];if(!f)return;audioUrl=URL.createObjectURL(f);$("audio").src=audioUrl;$("audioTrack").innerHTML="🎵 "+f.name;}
function renderTimeline(){const clips=scenes.map((s,i)=>`<div class="clip ${i===selectedScene?'active':''}" onclick="selectedScene=${i};updateEditor()">Sc ${i+1}<br>${s.action}</div>`).join("");$("sceneTrack").innerHTML=clips;$("actionTrack").innerHTML=clips;}
function saveProject(){let p=JSON.parse(localStorage.getItem("projects")||"[]");p.unshift({title:"Project "+(p.length+1),scenes});localStorage.setItem("projects",JSON.stringify(p));renderProjects();alert("Saved ✅");}
function renderProjects(){let p=JSON.parse(localStorage.getItem("projects")||"[]");$("recent").innerHTML=(p.length?p:[{title:"New Project 1"},{title:"New Project 2"},{title:"New Project 3"}]).map(x=>`<div class="project"><b>${x.title}</b></div>`).join("");$("projectsList").innerHTML=p.map(x=>`<div class="asset">${x.title} • ${x.scenes.length} scenes</div>`).join("")||"No saved projects";}
function clearProjects(){localStorage.removeItem("projects");renderProjects();}
function focusPanel(id){document.getElementById(id+"Title")?.scrollIntoView({behavior:"smooth"});}
async function exportVideo(){$("loading").style.display="grid";const stream=canvas.captureStream(30),rec=new MediaRecorder(stream,{mimeType:"video/webm"}),chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=()=>{let blob=new Blob(chunks,{type:"video/webm"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ai-animate-v27-fixed.webm";a.click();$("loading").style.display="none";};rec.start();let si=0,f=0,total=90*scenes.length;let r=setInterval(()=>{selectedScene=si;draw((f%90)/90);f++;if(f%90===0)si++;if(f>=total){clearInterval(r);setTimeout(()=>rec.stop(),250);}},33);}
preload();generateScenes();renderAll();updateEditor();
