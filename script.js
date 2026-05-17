let selectedChar='assets/characters/village-boy.png';
let selectedName='Village Boy';
let scenes=[];
let currentScene=0;
let timer=null;

function $(id){return document.getElementById(id)}

function selectChar(src,name){
 selectedChar=src; selectedName=name;
 document.querySelectorAll('.char').forEach(c=>c.classList.remove('active'));
 event.currentTarget.classList.add('active');
 $('mainChar').src=src;
 renderTimeline();
}

function generateScenes(){
 scenes=$('scriptBox').value.split(/[.।\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,6);
 currentScene=0;
 renderTimeline();
 showScene(0);
}

function renderTimeline(){
 const make=(type)=>scenes.map((s,i)=>`<div class="clip ${i===currentScene?'active':''}" onclick="showScene(${i})">${type==='scene'?'Scene '+(i+1):type==='char'?selectedName:type==='voice'?$('voiceSelect').value:s.slice(0,22)+'...'}</div>`).join('');
 $('sceneTrack').innerHTML=make('scene');
 $('charTrack').innerHTML=make('char');
 $('textTrack').innerHTML=make('text');
 $('voiceTrack').innerHTML=make('voice');
}

function showScene(i){
 if(!scenes.length) return;
 currentScene=i;
 $('subtitle').textContent=scenes[i];
 $('sceneEdit').value=scenes[i];
 renderTimeline();
}

function playScenes(){
 if(!scenes.length) generateScenes();
 let i=0;
 clearInterval(timer);
 timer=setInterval(()=>{showScene(i); i=(i+1)%scenes.length;},1600);
}

function stopScenes(){clearInterval(timer)}

function changeBg(){
 $('canvas').className='canvas '+$('bgSelect').value;
}

function updateScene(){
 if(!scenes.length) generateScenes();
 scenes[currentScene]=$('sceneEdit').value;
 $('canvas').className='canvas '+$('bgSelect').value+' '+$('actionSelect').value.toLowerCase();
 showScene(currentScene);
}

function saveProject(){
 if(!scenes.length) generateScenes();
 localStorage.setItem('aiAnimateProject',JSON.stringify({scenes,selectedChar,selectedName}));
 alert('Project saved locally ✅');
}

function downloadProject(){
 if(!scenes.length) generateScenes();
 const data={name:'AI Animate Studio Demo',character:selectedName,background:$('bgSelect').value,voice:$('voiceSelect').value,scenes};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='ai-animate-studio-demo-project.json';
 a.click();
}

function openExport(){$('exportModal').style.display='grid'}
function closeExport(){$('exportModal').style.display='none'}

generateScenes();
