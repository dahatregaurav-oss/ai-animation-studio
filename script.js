import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1MCHdOazDyeDXSXWMnwVHD2fo7oOdr9g",
  authDomain: "ai-animation-studio-e963c.firebaseapp.com",
  projectId: "ai-animation-studio-e963c",
  storageBucket: "ai-animation-studio-e963c.firebasestorage.app",
  messagingSenderId: "1043459063205",
  appId: "1:1043459063205:web:dec1e034a51ac3ded4fc4c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const chars = [
  {name:"Village Boy", img:"assets/characters/village-boy.png"},
  {name:"Village Woman", img:"assets/characters/village-woman.png"},
  {name:"Old Grandmother", img:"assets/characters/grandmother.png"},
  {name:"Villain Man", img:"assets/characters/villain-man.png"}
];

let currentUser=null, selectedSceneIndex=-1, scenes=[], playTimer=null;
function $(id){return document.getElementById(id)}

window.go=function(id,btn=null){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelectorAll(".nav").forEach(n=>n.classList.remove("active"));
  if(btn) btn.classList.add("active");
  $("pageTitle").textContent = id[0].toUpperCase()+id.slice(1);
  $("pageSub").textContent = id==="editor" ? "Build scene-by-scene animation videos." : "Create and manage your AI animation videos.";
};
window.goByName=function(id){go(id); document.querySelectorAll(".nav").forEach(n=>{if(n.textContent.toLowerCase().includes(id)) n.classList.add("active")})}

window.loginWithGoogle=async()=>{try{await signInWithPopup(auth,provider)}catch(e){alert("Login error: "+e.message)}}
window.logoutUser=async()=>{await signOut(auth)}
onAuthStateChanged(auth,async user=>{
  currentUser=user;
  $("userStatus").textContent=user?(user.displayName||user.email):"Not logged in";
  $("loginBtn").style.display=user?"none":"inline-block";
  $("logoutBtn").style.display=user?"inline-block":"none";
  if(user) await loadProjects(); else renderProjects([]);
});

function setup(){
  $("characterSelect").innerHTML=chars.map((c,i)=>`<option value="${i}">${c.name}</option>`).join("");
  $("characterGrid").innerHTML=chars.map((c,i)=>`<div class="char-card"><div class="imgbox"><img src="${c.img}"></div><h3>${c.name}</h3><button class="primary full" onclick="selectChar(${i})">Use Character</button></div>`).join("");
  updatePreview(); renderTimeline(); renderProjects([]);
}
window.selectChar=function(i){$("characterSelect").value=i; updatePreview(); goByName("editor")}

function formScene(){
  const c=chars[Number($("characterSelect").value)]||chars[0];
  return {title:$("sceneTitle").value, dialogue:$("sceneDialogue").value, bg:$("backgroundSelect").value, character:c.name, characterImg:c.img, action:$("actionSelect").value, position:$("positionSelect").value, voice:$("voiceSelect").value}
}
window.updatePreview=function(scene=null){
  const s=scene||formScene(), canvas=$("canvas");
  canvas.className=`canvas bg-${s.bg} ${s.action} pos-${s.position}`;
  $("canvasCharacter").src=s.characterImg; $("canvasSubtitle").textContent=s.dialogue; $("actionBadge").textContent=s.action.toUpperCase();
  $("faceEmoji").textContent={talking:"🗣️",walking:"🚶",idle:"🙂",happy:"😊",angry:"😠",sad:"😢",scared:"😨"}[s.action]||"😊";
}
window.addScene=function(){scenes.push(formScene()); selectedSceneIndex=scenes.length-1; renderTimeline(); updatePreview(scenes[selectedSceneIndex]);}
window.updateSelectedScene=function(){if(selectedSceneIndex<0){alert("Add/select scene first");return} scenes[selectedSceneIndex]=formScene(); renderTimeline(); updatePreview(scenes[selectedSceneIndex]);}
window.deleteSelectedScene=function(){if(selectedSceneIndex<0)return; scenes.splice(selectedSceneIndex,1); selectedSceneIndex=scenes.length?0:-1; renderTimeline(); if(selectedSceneIndex>=0) updatePreview(scenes[selectedSceneIndex]);}
function renderTimeline(){
  $("timelineInfo").textContent=scenes.length+" scenes";
  $("timeline").innerHTML=scenes.map((s,i)=>`<div class="clip ${i===selectedSceneIndex?'active':''}" onclick="selectScene(${i})"><b>${s.title}</b><small>${s.character} • ${s.action}</small></div>`).join("");
}
window.selectScene=function(i){selectedSceneIndex=i; const s=scenes[i]; $("sceneTitle").value=s.title; $("sceneDialogue").value=s.dialogue; $("backgroundSelect").value=s.bg; $("characterSelect").value=chars.findIndex(c=>c.name===s.character); $("actionSelect").value=s.action; $("positionSelect").value=s.position; $("voiceSelect").value=s.voice; renderTimeline(); updatePreview(s);}
window.playTimeline=function(){if(!scenes.length){alert("Add scene first");return} let i=0; clearInterval(playTimer); selectScene(0); playTimer=setInterval(()=>{i=(i+1)%scenes.length; selectScene(i)},2200)}
window.pauseTimeline=()=>clearInterval(playTimer)
window.resetTimeline=()=>{clearInterval(playTimer); if(scenes.length) selectScene(0)}
window.smartPrompt=function(){$("projectTitle").value=$("aiPrompt").value; $("sceneDialogue").value="या topic वर एक engaging animation scene तयार करा: "+$("aiPrompt").value; goByName("editor");}

window.saveEditorProject=async function(){
  if(!currentUser){alert("Login first"); return}
  if(!scenes.length){alert("Add at least one scene"); return}
  await addDoc(collection(db,"projects"),{uid:currentUser.uid,email:currentUser.email||"",title:$("projectTitle").value,scenes,thumbnailImg:scenes[0].characterImg,createdAt:serverTimestamp()});
  alert("Project saved ✅"); await loadProjects(); goByName("dashboard");
}
window.loadProjects=async function(){
  if(!currentUser){renderProjects([]);return}
  const q=query(collection(db,"projects"),where("uid","==",currentUser.uid)); const snap=await getDocs(q); const arr=[]; snap.forEach(d=>arr.push({id:d.id,...d.data()})); arr.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)); renderProjects(arr);
}
function renderProjects(arr){
  $("projectCount").textContent=arr.length;
  const html=arr.length?arr.map(p=>`<div class="project-card"><div class="thumb"><img src="${p.thumbnailImg||'assets/characters/village-boy.png'}"></div><h3>${p.title}</h3><p>${p.scenes?p.scenes.length+" scenes":"Saved project"}</p></div>`).join(""):`<div class="project-card"><div class="thumb">🖼️</div><h3>No projects yet</h3><p>Create your first professional editor project.</p></div>`;
  $("dashboardProjects").innerHTML=html; $("projectsList").innerHTML=html;
}
window.downloadProject=function(){
  const count=Number(localStorage.getItem("downloads")||"0")+1; localStorage.setItem("downloads",count); $("downloadCount").textContent=count;
  const blob=new Blob([JSON.stringify({title:$("projectTitle").value,scenes,note:"Real MP4 export needs backend."},null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="ai-animation-project.json"; a.click();
}
document.addEventListener("DOMContentLoaded",()=>{setup(); $("downloadCount").textContent=localStorage.getItem("downloads")||"0";});
