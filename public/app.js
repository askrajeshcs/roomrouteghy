const colors={OLX:"#24724a","Housing.com":"#6d4aff",Bricklet:"#e46a3c","99acres":"#2563eb",Facebook:"#1877f2"};
const money=n=>`₹${Number(n).toLocaleString("en-IN")}`;
const safe=s=>String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const map=L.map("map",{scrollWheelZoom:true}).setView([26.155,91.78],12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
const layer=L.layerGroup().addTo(map); let all=[],filtered=[],selected=null;
const q=document.querySelector("#query"),source=document.querySelector("#source"),rent=document.querySelector("#rent");

function markerIcon(item){return L.divIcon({className:"rent-pin",html:`<span style="--pin:${colors[item.source]||"#222"}">₹</span>`,iconSize:[38,46],iconAnchor:[19,42]});}
function show(item){selected=item.id;map.flyTo([item.lat,item.lng],14,{duration:.6});document.querySelector("#details").innerHTML=`
  <div class="detail-top"><span class="pill" style="background:${colors[item.source]||"#333"}">${safe(item.source)}</span><span>${safe(item.posted)}</span></div>
  <p class="locality">⌖ ${safe(item.area)}</p><h2>${safe(item.title)}</h2><div class="price">${money(item.rent)}<small>/month</small></div>
  <div class="facts"><span><b>${safe(item.rooms)}</b>Room type</span><span><b>${safe(item.bath)}</b>Bathroom</span>${item.size?`<span><b>${safe(item.size)}</b>Area</span>`:""}</div>
  ${item.status==="unavailable"?'<div class="unavailable">Unavailable / booked</div>':""}
  <div class="contact"><span>Public contact</span>${item.phone?`<a href="tel:+91${safe(item.phone)}">+91 ${safe(item.phone)}</a>`:"<b>Not publicly displayed</b>"}</div>
  <a class="source-link" href="${safe(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">View original listing ↗</a>`;
  renderCards();
}
function renderMap(){layer.clearLayers();filtered.forEach(item=>L.marker([item.lat,item.lng],{icon:markerIcon(item)}).addTo(layer).bindPopup(`<b>${safe(item.title)}</b><br>${safe(item.area)}<br><strong>${money(item.rent)}/month</strong>`).on("click",()=>show(item)));}
function renderCards(){document.querySelector("#cards").innerHTML=filtered.map(item=>`<button class="card ${selected===item.id?"active":""}" data-id="${safe(item.id)}"><div><span class="pill" style="background:${colors[item.source]||"#333"}">${safe(item.source)}</span><span>${safe(item.area)}</span></div><h3>${safe(item.title)}</h3><p>${safe(item.rooms)} · ${safe(item.bath)}${item.size?` · ${safe(item.size)}`:""}</p><footer><strong>${money(item.rent)}</strong><span>View on map →</span></footer></button>`).join("")||'<div class="empty">No listings match these filters.</div>';
document.querySelectorAll(".card").forEach(el=>el.addEventListener("click",()=>show(filtered.find(x=>x.id===el.dataset.id))));}
function apply(){const term=q.value.toLowerCase(),max=Number(rent.value);filtered=all.filter(x=>(source.value==="All sources"||x.source===source.value)&&x.rent<=max&&`${x.title} ${x.area} ${x.rooms}`.toLowerCase().includes(term));document.querySelector("#count").textContent=filtered.length;document.querySelector("#rentValue").textContent=money(max);renderMap();renderCards();}
[q,source,rent].forEach(el=>el.addEventListener("input",apply));

try{const data=await fetch(`listings.json?v=${Date.now()}`).then(r=>{if(!r.ok)throw new Error("Data unavailable");return r.json()});all=data.listings||[];const updated=new Date(data.updatedAt);document.querySelector("#status").textContent=`Auto-updated ${updated.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"})}`;apply();if(filtered[0])show(filtered[0]);}catch(error){document.querySelector("#status").textContent="Could not load listings";document.querySelector("#cards").innerHTML=`<div class="empty">${safe(error.message)}. Try again shortly.</div>`;}
