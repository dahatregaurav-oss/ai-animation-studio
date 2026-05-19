const characters=[
  {
    "name": "Orange Kurta Man",
    "img": "assets/characters/orange-kurta-man.png"
  },
  {
    "name": "Stick Village Man",
    "img": "assets/characters/stick-village-man.png"
  },
  {
    "name": "Blue Shirt Dhoti Man",
    "img": "assets/characters/blue-shirt-dhoti-man.png"
  },
  {
    "name": "Red Turban Man",
    "img": "assets/characters/red-turban-man.png"
  },
  {
    "name": "Green Dress Woman",
    "img": "assets/characters/green-dress-woman.png"
  },
  {
    "name": "Blue Saree Woman",
    "img": "assets/characters/blue-saree-woman.png"
  },
  {
    "name": "Angry Villain Man",
    "img": "assets/characters/angry-villain-man.png"
  },
  {
    "name": "Businessman",
    "img": "assets/characters/businessman.png"
  },
  {
    "name": "Pink Shirt Man",
    "img": "assets/characters/pink-shirt-man.png"
  },
  {
    "name": "White Turban Man",
    "img": "assets/characters/white-turban-man.png"
  },
  {
    "name": "Village Man Stick",
    "img": "assets/characters/village-man-stick-2d.png"
  },
  {
    "name": "Village Man Stick 3D",
    "img": "assets/characters/village-man-stick-3d.png"
  },
  {
    "name": "School Boy",
    "img": "assets/characters/school-boy.png"
  }
];
const bgs=[{name:"Village",value:"village"},{name:"Forest",value:"forest"},{name:"Night",value:"horror"},{name:"City",value:"city"},{name:"School",value:"school"},{name:"Desert",value:"desert"},{name:"Ocean",value:"ocean"}];
let selectedChar=characters[0],selectedBg=bgs[0],scenes=[],selectedScene=0,timer=null,zoom=1,audioUrl=null,blink=0;
const imgs={},canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),$=id=>document.getElementById(id);
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$(id).classList.add("active");}
function preload(){characters.forEach(c=>{let im=new Image();im.src=c.img;imgs[c.img]=im;})}
function startEditor(){generateScenes();showPage("editor");}
function generateScenes(){let p=$("dashPrompt").value||"गावात एक मुलगा राहत होता";scenes=[{text:p,action:"Idle",pos:"center",char:selectedChar,bg:selectedBg},{text:"तो पुढे चालत गेला",action:"Walking",pos:"center",char:selectedChar,bg:selectedBg},{text:"तो बोलू लागला",action:"Talking",pos:"center",char:selectedChar,bg:selectedBg},{text:"सगळे आनंदी झाले",action:"Happy",pos:"center",char:selectedChar,bg:selectedBg}];selectedScene=0;renderAll();draw();}
function renderAll(){renderChars();renderBgs();renderTimeline();renderProjects();}
function renderChars(){$("chars").innerHTML=characters.map((c,i)=>`<div class="card ${c===selectedChar?'active':''}" onclick="selectChar(${i})"><img src="${c.img}"><b>${c.name}</b></div>`).join("");}
function renderBgs(){$("bgs").innerHTML=bgs.map((b,i)=>`<div class="card ${b===selectedBg?'active':''}" onclick="selectBg(${i})"><div class="bgthumb"></div><b>${b.name}</b></div>`).join("");}
function selectChar(i){selectedChar=characters[i];scenes[selectedScene].char=selectedChar;renderChars();draw();}
function selectBg(i){selectedBg=bgs[i];scenes[selectedScene].bg=selectedBg;renderBgs();draw();}
function bgDraw(bg){let W=canvas.width,H=canvas.height;let c={village:["#a7e9ff","#fff0a8","#2ddd6f"],forest:["#064e3b","#166534","#052e16"],horror:["#111827","#374151","#020617"],city:["#60a5fa","#1e293b","#0f172a"],school:["#93c5fd","#fef3c7","#c084fc"],desert:["#fbbf24","#fed7aa","#d97706"],ocean:["#38bdf8","#0ea5e9","#0369a1"]}[bg.value]||["#a7e9ff","#fff0a8","#2ddd6f"];let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,c[0]);g.addColorStop(.58,c[1]);g.addColorStop(.75,c[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle="rgba(255,255,255,.55)";ctx.beginPath();ctx.arc(W*.2,H*.16,60,0,7);ctx.fill();ctx.beginPath();ctx.arc(W*.72,H*.17,42,0,7);ctx.fill();ctx.fillStyle="rgba(10,80,40,.8)";for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(W*(.25+i*.15),H*.64,20,0,7);ctx.fill();ctx.fillRect(W*(.25+i*.15)-3,H*.64,6,60);}}
function drawBodyImage(im,x,y,w,h,action,p){ctx.save();let bounce=0,scaleX=1,rot=0;if(action==="Walking"){bounce=Math.abs(Math.sin(p*Math.PI*2))*16;scaleX=1+Math.sin(p*Math.PI*2)*.025;}if(action==="Talking"){bounce=Math.sin(p*Math.PI*12)*5;rot=Math.sin(p*Math.PI*4)*.015;}if(action==="Happy")bounce=Math.sin(p*Math.PI*2)*-18;if(action==="Dance"){bounce=Math.sin(p*Math.PI*4)*-20;rot=Math.sin(p*Math.PI*4)*.08;}if(action==="Fight"||action==="Angry"){rot=Math.sin(p*Math.PI*8)*.035;}if(action==="Scared"){scaleX=1+Math.sin(p*Math.PI*12)*.02;}ctx.translate(x+w/2,y+h/2+bounce);ctx.rotate(rot);ctx.scale(scaleX,1);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
function drawRigOverlay(x,y,w,h,action,p){ctx.lineCap="round";ctx.strokeStyle="rgba(255,220,170,.95)";ctx.lineWidth=Math.max(5,w*.035);let arm=0,leg=0,mouth=0;if(action==="Walking"){arm=Math.sin(p*Math.PI*2)*30;leg=Math.sin(p*Math.PI*2)*35;}if(action==="Talking"){arm=Math.sin(p*Math.PI*6)*18;mouth=Math.abs(Math.sin(p*Math.PI*12));}if(action==="Fight")arm=Math.sin(p*Math.PI*8)*45;if(action==="Dance"){arm=Math.sin(p*Math.PI*4)*55;leg=Math.cos(p*Math.PI*4)*25;}let shoulder=y+h*.42,hip=y+h*.72;ctx.beginPath();ctx.moveTo(x+w*.35,shoulder);ctx.lineTo(x+w*.25,shoulder+h*.18+arm*.6);ctx.moveTo(x+w*.65,shoulder);ctx.lineTo(x+w*.75,shoulder+h*.18-arm*.6);ctx.moveTo(x+w*.42,hip);ctx.lineTo(x+w*.36+leg*.45,y+h*.95);ctx.moveTo(x+w*.58,hip);ctx.lineTo(x+w*.64-leg*.45,y+h*.95);ctx.stroke();if(action==="Talking"){ctx.fillStyle="rgba(80,0,0,.9)";ctx.beginPath();ctx.ellipse(x+w*.5,y+h*.20,w*.05,h*.018+mouth*h*.02,0,0,7);ctx.fill();}}
function draw(p=0){if(!scenes.length)generateScenes();let s=scenes[selectedScene];ctx.clearRect(0,0,canvas.width,canvas.height);bgDraw(s.bg);let im=imgs[s.char.img]||new Image();if(!imgs[s.char.img]){im.src=s.char.img;imgs[s.char.img]=im;}let W=canvas.width,H=canvas.height,cw=W*.22*zoom,ch=cw*1.55,x=W/2-cw/2,y=H*.73-ch;if(s.pos==="left")x=W*.22-cw/2;if(s.pos==="right")x=W*.78-cw/2;if(s.action==="Walking")x+=Math.sin(p*Math.PI*2)*W*.12;if(s.action==="Jump")y+=Math.sin(p*Math.PI)*-95;if(im.complete&&im.naturalWidth)drawBodyImage(im,x,y,cw,ch,s.action,p);else{ctx.fillStyle="#1f2937";ctx.fillRect(x,y,cw,ch)}drawRigOverlay(x,y,cw,ch,s.action,p);ctx.fillStyle="rgba(0,0,0,.72)";ctx.fillRect(W*.08,H-105,W*.84,65);ctx.fillStyle="#fff";ctx.font="bold 30px Arial";ctx.textAlign="center";ctx.fillText(s.text,W/2,H-65);}
function setAction(a){scenes[selectedScene].action=a;renderTimeline();let f=0;clearInterval(timer);timer=setInterval(()=>{draw((f%60)/60);f++;if(f>120)clearInterval(timer);},33);}
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
function renderTimeline(){let clips=scenes.map((s,i)=>`<div class="clip ${i===selectedScene?'active':''}" onclick="selectedScene=${i};updateEditor()">Sc ${i+1}<br>${s.action}</div>`).join("");$("sceneTrack").innerHTML=clips;$("charTrack").innerHTML=clips;$("actionTrack").innerHTML=clips;}
function saveProject(){let p=JSON.parse(localStorage.getItem("projects")||"[]");p.unshift({title:"Project "+(p.length+1),scenes});localStorage.setItem("projects",JSON.stringify(p));renderProjects();alert("Saved ✅");}
function renderProjects(){let p=JSON.parse(localStorage.getItem("projects")||"[]");$("recent").innerHTML=(p.length?p:[{title:"New Project 1"},{title:"New Project 2"},{title:"New Project 3"}]).map(x=>`<div class="project"><b>${x.title}</b></div>`).join("");$("projectsList").innerHTML=p.map(x=>`<div class="asset">${x.title} • ${x.scenes.length} scenes</div>`).join("")||"No saved projects";}
function clearProjects(){localStorage.removeItem("projects");renderProjects();}
function focusPanel(id){document.getElementById(id+"Title")?.scrollIntoView({behavior:"smooth"});}
async function exportVideo(){$("loading").style.display="grid";let stream=canvas.captureStream(30),rec=new MediaRecorder(stream,{mimeType:"video/webm"}),chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=()=>{let blob=new Blob(chunks,{type:"video/webm"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ai-animate-v28-character-engine.webm";a.click();$("loading").style.display="none";};rec.start();let si=0,f=0,total=90*scenes.length;let r=setInterval(()=>{selectedScene=si;draw((f%90)/90);f++;if(f%90===0)si++;if(f>=total){clearInterval(r);setTimeout(()=>rec.stop(),250);}},33);}
preload();generateScenes();renderAll();updateEditor();
