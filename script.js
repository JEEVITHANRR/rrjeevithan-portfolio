// === LOADER ===
window.addEventListener("load",()=>{
  setTimeout(()=>{
    const ld=document.getElementById("loader");
    ld.classList.add("out");
    setTimeout(()=>{
      ld.style.display="none";
      document.getElementById("hname").classList.add("glitch");
      startTyping();startCount();
    },700);
  },2200);
});

// === CURSOR ===
const dot=document.getElementById("cdot"),ring=document.getElementById("cring");
let mx=0,my=0,rx=0,ry=0;
document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px"});
(function loop(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)})();
document.querySelectorAll("a,button,[data-tilt]").forEach(el=>{
  el.addEventListener("mouseenter",()=>ring.classList.add("big"));
  el.addEventListener("mouseleave",()=>ring.classList.remove("big"));
});

// === NAV SCROLL ===
window.addEventListener("scroll",()=>document.getElementById("nav").classList.toggle("scrolled",scrollY>60));

// === THREE.JS HERO BG ===
(function(){
  const wrap=document.getElementById("cvs-wrap"),canvas=document.getElementById("cvs");
  const W=wrap.clientWidth,H=wrap.clientHeight;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,W/H,0.1,1000);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(W,H);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0,0);camera.position.set(0,0,11);

  // Particles
  const N=2200,pos=new Float32Array(N*3);
  for(let i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*36;
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x666666,size:.045,transparent:true,opacity:.5}));
  scene.add(pts);

  // Wireframe icosahedra
  const icoG=new THREE.IcosahedronGeometry(3.2,1);
  const ico=new THREE.LineSegments(new THREE.WireframeGeometry(icoG),new THREE.LineBasicMaterial({color:0x1a1a1a,transparent:true,opacity:.7}));
  ico.position.set(4.5,-.5,0);scene.add(ico);
  const icoG2=new THREE.IcosahedronGeometry(2,0);
  const ico2=new THREE.LineSegments(new THREE.WireframeGeometry(icoG2),new THREE.LineBasicMaterial({color:0x282828,transparent:true,opacity:.4}));
  ico2.position.set(4.5,-.5,0);scene.add(ico2);
  // Torus ring
  const torG=new THREE.TorusGeometry(2.2,.007,2,90);
  const tor=new THREE.Line(torG,new THREE.LineBasicMaterial({color:0x252525,transparent:true,opacity:.5}));
  tor.position.set(4.5,-.5,0);tor.rotation.x=Math.PI/3;scene.add(tor);
  // Second torus tilted
  const tor2=new THREE.Line(new THREE.TorusGeometry(2.6,.006,2,90),new THREE.LineBasicMaterial({color:0x1e1e1e,transparent:true,opacity:.35}));
  tor2.position.set(4.5,-.5,0);tor2.rotation.x=Math.PI/5;tor2.rotation.y=Math.PI/4;scene.add(tor2);

  let mox=0,moy=0;
  document.addEventListener("mousemove",e=>{mox=(e.clientX/innerWidth-.5);moy=(e.clientY/innerHeight-.5)});
  (function anim(){
    requestAnimationFrame(anim);
    ico.rotation.y+=.0025;ico.rotation.x+=.001;
    ico2.rotation.y-=.004;ico2.rotation.z+=.002;
    tor.rotation.z+=.003;tor2.rotation.z-=.002;
    pts.rotation.y+=.0003;
    camera.position.x+=(mox*1.6-camera.position.x)*.022;
    camera.position.y+=(-moy*1.6-camera.position.y)*.022;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  })();
  window.addEventListener("resize",()=>{
    const w=wrap.clientWidth,h=wrap.clientHeight;
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
  });
})();

// === TYPING ===
function startTyping(){
  const words=["AI Engineer","Full Stack Developer","ML Systems Builder","Generative AI Builder","Problem Solver"];
  let wi=0,ci=0,del=false;
  const el=document.getElementById("typed");
  function tick(){
    const w=words[wi];
    if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(tick,1900);return;}}
    else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length;}}
    setTimeout(tick,del?46:88);
  }tick();
}

// === COUNT-UP ===
function startCount(){
  document.querySelectorAll("[data-count]").forEach(el=>{
    const t=+el.dataset.count,s=el.dataset.suf||"";
    let c=0;const step=Math.ceil(t/40);
    const iv=setInterval(()=>{c=Math.min(c+step,t);el.textContent=c+s;if(c>=t)clearInterval(iv);},28);
  });
}

// === SCROLL REVEAL + SKILL BARS ===
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add("vis");
    e.target.querySelectorAll(".sb-fill[data-w]").forEach(b=>setTimeout(()=>{b.style.width=b.dataset.w+"%";},280));
  });
},{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));

// === 3D CARD TILT ===
document.querySelectorAll("[data-tilt]").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.025)`;
    card.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");
    card.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");
  });
  card.addEventListener("mouseleave",()=>{card.style.transform="perspective(700px) rotateY(0) rotateX(0) scale(1)";});
});
