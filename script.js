const data={title:"AI Animation Studio V16",scenes:["एक छोटा सा गाँव था...","उस गांव में एक गरीब लड़का रहता था।","वह बहुत मेहनती था।"],tracks:["Text","Character","Background","Music","Voiceover"]};
function downloadProject(){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="ai-animation-studio-v16-project.json";
  a.click();
}
document.querySelectorAll(".scene-thumb").forEach((el,i)=>{
  el.addEventListener("click",()=>{
    document.querySelectorAll(".scene-thumb").forEach(x=>x.classList.remove("active"));
    el.classList.add("active");
    document.querySelector(".subtitle").textContent=data.scenes[i%data.scenes.length];
  });
});