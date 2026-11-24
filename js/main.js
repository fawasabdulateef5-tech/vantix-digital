const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NAV=[["Home","/"],["About","/about"],["Services","/services"],["Portfolio","/portfolio"],["Contact","/contact"]];
const img=(src,alt,cls="",w="",h="")=>`<div class="ph ${cls}"><img src="${src}" alt="${alt}" ${w?`width="${w}" height="${h}"`:""} loading="lazy" onerror="this.parentElement.classList.add('missing');this.remove()"><span class="miss">Add image:<br>${src}</span></div>`;
window.img=img;
const path=location.pathname.replace(/\.html$/,"").replace(/\/$/,"")||"/";
const links=NAV.map(([n,h])=>`<a href="${h}" ${h===path?'aria-current="page"':""}>${n}</a>`).join("");
$("#site-header").innerHTML=`<div class="wrap bar"><a class="brand" href="/" aria-label="VANTIX DIGITAL home"><img src="/assets/logo/logo.png" alt="VANTIX DIGITAL" onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:'VANTIX DIGITAL'}))"></a>
<nav id="nav" aria-label="Main">${links}<a class="btn sm navcta" href="/contact">Let's Discuss Your Project</a></nav>
<button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button></div>`;
$("#site-footer").innerHTML=`<div class="wrap fgrid"><div><img class="flogo" src="/assets/logo/logo.png" alt="VANTIX DIGITAL" onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:'VANTIX DIGITAL'}))"><p>Turn Digital Opportunities Into Business Growth.</p></div>
<div><h4>Navigate</h4>${NAV.map(([n,h])=>`<a href="${h}">${n}</a>`).join("")}</div>
<div><h4>Services</h4>${SERVICES.map(s=>`<a href="/services#${s.slug}">${s.title}</a>`).join("")}</div>
<div><h4>Contact</h4><a href="/contact">Send us an enquiry</a><!-- Add real email / phone / social links here once confirmed --></div></div>
<div class="wrap copy">© ${new Date().getFullYear()} VANTIX DIGITAL. All rights reserved.</div>`;
const burger=$(".burger"),nav=$("#nav");
burger.onclick=()=>{const o=nav.classList.toggle("open");burger.setAttribute("aria-expanded",o)};
nav.onclick=e=>{if(e.target.tagName==="A")nav.classList.remove("open")};
addEventListener("scroll",()=>$("#site-header").classList.toggle("solid",scrollY>20),{passive:true});
/* render helpers */
$$("[data-services-home]").forEach(el=>{el.innerHTML=SERVICES.map((s,i)=>`<a class="svc ${i===0?"lead":""}" href="/services#${s.slug}">${img("/"+s.img,s.title+" service banner")}<div><span class="num">0${i+1}</span><h3>${s.title}</h3><p>${s.short}</p><span class="more">Learn more →</span></div></a>`).join("")});
$$("[data-services-full]").forEach(el=>{el.innerHTML=SERVICES.map((s,i)=>`<section class="svc-full ${i%2?"flip":""} reveal" id="${s.slug}"><div class="wrap two">${img("/"+s.img,s.title+" service banner","wide")}<div><span class="num">0${i+1}</span><h2>${s.title}</h2><p class="lead-p">${s.long}</p><h4>Key capabilities</h4><ul class="ticks">${s.caps.map(c=>`<li>${c}</li>`).join("")}</ul><h4>Business benefit</h4><p>${s.benefits}</p><a class="btn" href="/contact?service=${encodeURIComponent(s.title)}">Start Your Project</a></div></div></section>`).join("")});
const grid=$("[data-portfolio]");
if(grid){const n=+grid.dataset.portfolio||PORTFOLIO.length;const cats=[...new Set(PORTFOLIO.map(p=>p.cat).filter(Boolean))];
 const f=$("[data-filters]");if(f&&cats.length)f.innerHTML=["All",...cats].map((c,i)=>`<button class="chip ${i?"":"on"}" data-c="${c}">${c}</button>`).join("");
 grid.innerHTML=PORTFOLIO.slice(0,n).map((p,i)=>`<figure class="pf" data-c="${p.cat||""}">${img("/assets/portfolio/"+p.file,p.alt,"",p.w,p.h)}</figure>`).join("");
 f&&f.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;$$(".chip",f).forEach(x=>x.classList.toggle("on",x===b));$$(".pf",grid).forEach(x=>x.hidden=b.dataset.c!=="All"&&x.dataset.c!==b.dataset.c)})}
/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));
/* contact form */
const form=$("#contact-form");
if(form){const sel=form.service;SERVICES.forEach(s=>sel.add(new Option(s.title,s.title)));sel.add(new Option("Not sure yet","Not sure yet"));
 const q=new URLSearchParams(location.search).get("service");if(q)sel.value=q;
 const msg=$("#form-msg"),err=(n,t)=>{const el=form[n];el.setAttribute("aria-invalid",!!t);$("#e-"+n).textContent=t||""};
 form.onsubmit=async e=>{e.preventDefault();let ok=true;
  const v=n=>form[n].value.trim();
  if(v("name").length<2){err("name","Please enter your full name.");ok=false}else err("name");
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))){err("email","Please enter a valid email address.");ok=false}else err("email");
  if(!v("service")){err("service","Please choose a service.");ok=false}else err("service");
  if(v("message").length<10){err("message","Please tell us a little about your project.");ok=false}else err("message");
  if(!ok)return;
  const btn=form.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Sending…";msg.className="";msg.textContent="";
  try{const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
   const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Something went wrong.");
   form.hidden=true;$("#form-ok").hidden=false}
  catch(x){msg.className="bad";msg.textContent=x.message+" Please try again shortly."}
  btn.disabled=false;btn.textContent="Send Enquiry"}}
