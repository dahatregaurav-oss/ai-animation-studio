const chars=[
 {name:"Village Boy",img:"assets/characters/village-boy.png"},
 {name:"Village Woman",img:"assets/characters/village-woman.png"},
 {name:"Grandmother",img:"assets/characters/grandmother.png"},
 {name:"Villain Man",img:"assets/characters/villain-man.png"}
];

let scenes=[];
let selectedScene=0;
let selectedChar=chars[0];
let bgMode="preset";
let uploadedBg=null;
let timer=null;
let charImages={};
let bgPresets={};
const canvas=document.getElementById("videoCanvas");
const ctx=canvas.getContext("2d");

function $(id){return document.getElementById(id)}

function init(){
 renderChars();
 generateScenes();
 resizeCanvas();
 loadAssets();
}

function loadAssets(){
 chars.forEach(c=>{
  const img=new Image();
  img.src=c.img;
  charImages[c.name]=img;
 });
}

function renderChars(){
 $("chars").innerHTML=chars.map((c,i)=>`<div class="char ${i===0?'active':''}" onclick="selectCharacter(${i})"><img src="${c.img}" onerror="this.style.display='none'"><b>${c.name}</b></div>`).join("");
}

function selectCharacter(i){
 selectedChar=chars[i];
 document.querySelectorAll(".char").forEach((el,idx)=>el.classList.toggle("active",idx===i));
 scenes.forEach(s=>{s.character=selectedChar.name;s.characterImg=selectedChar.img});
 drawScene(scenes[selectedScene]||null);
 renderTimeline();
}

function generateScenes(){
 const parts=$("scriptText").value.split(/[.।\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,8);
 scenes=parts.map((text,i)=>({
   text,
   bg:$("bgSelect").value,
   bgImage: uploadedBg,
   character:selectedChar.name,
   characterImg:selectedChar.img,
   action:i%2?"Walking":"Talking"
 }));
 selectedScene=0;
 renderTimeline();
 selectScene(0);
}

function renderTimeline(){
 $("timeline").innerHTML=scenes.map((s,i)=>`<div class="clip ${i===selectedScene?'active':''}" onclick="selectScene(${i})"><b>Scene ${i+1}</b><small>${s.text.slice(0,30)}...</small></div>`).join("");
}

function selectScene(i){
 selectedScene=i;
 const s=scenes[i];
 if(!s)return;
 $("sceneEdit").value=s.text;
 $("actionSelect").value=s.action;
 drawScene(s);
 renderTimeline();
}

function resizeCanvas(){
 const format=$("formatSelect").value;
 if(format==="9:16"){
  canvas.width=720; canvas.height=1280;
 }else{
  canvas.width=1280; canvas.height=720;
 }
 drawScene(scenes[selectedScene]||null);
}

function selectPresetBackground(){
 bgMode="preset";
 uploadedBg=null;
 scenes.forEach(s=>{s.bg=$("bgSelect").value;s.bgImage=null});
 drawScene(scenes[selectedScene]||null);
}

function uploadBackground(e){
 const file=e.target.files[0];
 if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
  const img=new Image();
  img.onload=()=>{
   uploadedBg=img;
   bgMode="upload";
   scenes.forEach(s=>s.bgImage=img);
   drawScene(scenes[selectedScene]||null);
  };
  img.src=reader.result;
 };
 reader.readAsDataURL(file);
}

function drawBackground(s){
 const w=canvas.width,h=canvas.height;
 if(s && s.bgImage){
  ctx.drawImage(s.bgImage,0,0,w,h);
  ctx.fillStyle="rgba(0,0,0,0.12)";
  ctx.fillRect(0,0,w,h);
  return;
 }
 const bg=(s&&s.bg)||$("bgSelect").value;
 let sky="#8bd3ff", ground="#22c55e", mid="#f9e29f";
 if(bg==="forest"){sky="#064e3b";mid="#14532d";ground="#052e16"}
 if(bg==="horror"){sky="#111827";mid="#374151";ground="#020617"}
 if(bg==="school"){sky="#93c5fd";mid="#fef3c7";ground="#c084fc"}
 if(bg==="city"){sky="#60a5fa";mid="#1e293b";ground="#0f172a"}
 const grad=ctx.createLinearGradient(0,0,0,h);
 grad.addColorStop(0,sky); grad.addColorStop(.55,mid); grad.addColorStop(.7,ground);
 ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
 // decorative simple scene elements
 ctx.fillStyle="rgba(0,0,0,.18)";
 for(let i=0;i<5;i++){
   ctx.beginPath();
   ctx.arc((i+1)*w/6,h*.62,60,0,Math.PI*2);
   ctx.fill();
 }
}

function drawScene(s,progress=0){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 drawBackground(s);
 const w=canvas.width,h=canvas.height;
 if(!s){
  ctx.fillStyle="#fff";ctx.font="bold 42px Arial";ctx.textAlign="center";ctx.fillText("Generate Scenes click करा",w/2,h/2);
  return;
 }
 const img=charImages[s.character] || charImages[selectedChar.name];
 let cw=w*(canvas.width<canvas.height?.45:.24);
 let ch=cw*1.4;
 let x=w/2-cw/2;
 let y=h*.72-ch;
 const action=(s.action||"Talking").toLowerCase();
 if(action==="walking") x+=Math.sin(progress*Math.PI*2)*w*.08;
 if(action==="happy") y+=Math.sin(progress*Math.PI*2)*-20;
 if(action==="angry"||action==="scared") x+=Math.sin(progress*Math.PI*8)*8;
 if(img && img.complete && img.naturalWidth){
  ctx.drawImage(img,x,y,cw,ch);
 }else{
  ctx.fillStyle="#111827";ctx.fillRect(x,y,cw,ch);
 }
 // subtitle box
 ctx.fillStyle="rgba(0,0,0,.72)";
 const boxH=canvas.width<canvas.height?120:76;
 roundRect(ctx,w*.06,h-boxH-30,w*.88,boxH,18,true);
 ctx.fillStyle="#fff";
 ctx.textAlign="center";
 ctx.font=`bold ${canvas.width<canvas.height?34:32}px Arial`;
 wrapText(ctx,s.text,w/2,h-boxH/2-18,w*.82,canvas.width<canvas.height?42:38);
}

function roundRect(ctx,x,y,w,h,r,fill){
 ctx.beginPath();
 ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
 if(fill)ctx.fill();
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){
 const words=text.split(" ");
 let line="", lines=[];
 words.forEach(word=>{
  const test=line+word+" ";
  if(ctx.measureText(test).width>maxWidth && line){lines.push(line); line=word+" ";}
  else line=test;
 });
 lines.push(line);
 const start=y-(lines.length-1)*lineHeight/2;
 lines.forEach((ln,i)=>ctx.fillText(ln,x,start+i*lineHeight));
}

function playPreview(){
 if(!scenes.length) generateScenes();
 let i=0, frame=0;
 clearInterval(timer);
 const speed=Number($("speedSelect").value);
 timer=setInterval(()=>{
  selectedScene=i;
  drawScene(scenes[i],(frame%60)/60);
  $("progress").style.width=((i+1)/scenes.length*100)+"%";
  frame++;
  if(frame%Math.round(speed/33)===0){i=(i+1)%scenes.length; renderTimeline();}
 },33);
}

function stopPreview(){clearInterval(timer)}

function updateCurrentScene(){
 if(!scenes.length)generateScenes();
 scenes[selectedScene].text=$("sceneEdit").value;
 scenes[selectedScene].action=$("actionSelect").value;
 drawScene(scenes[selectedScene]);
 renderTimeline();
}

function duplicateScene(){
 if(!scenes.length)return;
 scenes.splice(selectedScene+1,0,{...scenes[selectedScene]});
 renderTimeline();
}

function deleteScene(){
 if(!scenes.length)return;
 scenes.splice(selectedScene,1);
 selectedScene=Math.max(0,selectedScene-1);
 renderTimeline();
 drawScene(scenes[selectedScene]||null);
}

function saveProject(){
 if(!scenes.length)generateScenes();
 const data={script:$("scriptText").value,scenes,character:selectedChar.name,bg:$("bgSelect").value,format:$("formatSelect").value};
 localStorage.setItem("aiAnimateWorkingProject",JSON.stringify(data));
 alert("Project saved locally ✅");
}

function loadProject(){
 const data=JSON.parse(localStorage.getItem("aiAnimateWorkingProject")||"null");
 if(!data){alert("No saved project found");return;}
 $("scriptText").value=data.script||"";
 scenes=data.scenes||[];
 selectedScene=0;
 renderTimeline();
 drawScene(scenes[0]||null);
}

async function exportVideo(){
 if(!scenes.length)generateScenes();
 $("loading").style.display="grid";
 resizeCanvas();
 const stream=canvas.captureStream(30);
 const recorder=new MediaRecorder(stream,{mimeType:"video/webm"});
 const chunks=[];
 recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 recorder.onstop=()=>{
  const blob=new Blob(chunks,{type:"video/webm"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="ai-animate-studio-video.webm";
  a.click();
  $("loading").style.display="none";
 };
 recorder.start();
 let sceneIndex=0;
 let frame=0;
 const framesPerScene=90;
 const totalFrames=framesPerScene*scenes.length;
 const render=setInterval(()=>{
  const s=scenes[sceneIndex];
  drawScene(s,(frame%framesPerScene)/framesPerScene);
  $("progress").style.width=((frame+1)/totalFrames*100)+"%";
  frame++;
  if(frame%framesPerScene===0)sceneIndex++;
  if(frame>=totalFrames){
    clearInterval(render);
    setTimeout(()=>recorder.stop(),250);
  }
 },33);
}

init();
