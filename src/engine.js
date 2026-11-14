// Authored at Junction 2026. No reference answers are available to this module.
export const VERSION = '1.0.0';
export function polygonArea(p) { return Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0))/2; }
export function perimeter(p) {return p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+Math.hypot(a[0]-b[0],a[1]-b[1])},0)}
export function inside(p, ring) {let yes=false; for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if(((a[1]>p[1])!==(b[1]>p[1]))&&(p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]))yes=!yes}return yes}
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
export function validRing(p) {
 if(p.length<3||p.some(a=>a.some(v=>!Number.isFinite(v)))||polygonArea(p)<1e-10)return false;
 for(let i=0;i<p.length;i++)for(let j=i+2;j<p.length;j++){if(i===0&&j===p.length-1)continue;const a=p[i],b=p[(i+1)%p.length],c=p[j],d=p[(j+1)%p.length];if(cross(a,b,c)*cross(a,b,d)<-1e-12&&cross(c,d,a)*cross(c,d,b)<-1e-12)return false}return true;
}
export function measureTrace(points, pixelsPerMetre) {if(!validRing(points))throw new Error('The boundary crosses itself or has no area. Retrace the room.');if(!(pixelsPerMetre>0&&Number.isFinite(pixelsPerMetre)))throw new Error('Set a known reference length first.');return {area:polygonArea(points)/pixelsPerMetre**2,perimeter:perimeter(points)/pixelsPerMetre,vertices:points.length};}
const val=(e,c,d='')=>e.find(a=>a[0]===c)?.[1]??d;
const num=(e,c,d=0)=>Number(val(e,c,d));
const norm=s=>s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').trim();
const outdoor=/balcon|balkon|loggia|terrass|terrace|patio|aussen|exterieur|outdoor|shaft|schacht|caved|void/;
function points(e){const p=[];for(const [c,v]of e){if(c===10)p.push([+v,0]);if(c===20&&p.length)p[p.length-1][1]=+v}return p}
export function parseDxf(raw, name='Uploaded drawing') {
 if(raw.length>25_000_000)throw new Error('DXF exceeds the 25 MB browser limit. Export a single floor.');
 const lines=raw.replace(/\r/g,'').split('\n');const pairs=[];for(let i=0;i<lines.length-1;i+=2){const c=Number(lines[i].trim());if(!Number.isInteger(c))throw new Error('This is not an ASCII DXF. Export as ASCII DXF.');pairs.push([c,lines[i+1].trim()])}
 const u=pairs.findIndex(a=>a[0]===9&&a[1]==='$INSUNITS');const unit=u>=0?Number(pairs[u+1][1]):0;
 const scales={1:0.0254,2:0.3048,4:0.001,5:0.01,6:1};const metres=scales[unit];
 let active=false,chunk=[],entities=[];
 for(const [c,v]of pairs){if(c===2&&v==='ENTITIES'){active=true;continue}if(!active)continue;if(c===0){if(chunk.length)entities.push(chunk);chunk=[];if(v==='ENDSEC')break}chunk.push([c,v])}
 if(!entities.length)throw new Error('No model-space entities found. Binary DXF and DWG are not supported.');
 const es=entities.map((e,i)=>({id:val(e,5,String(i)),type:val(e,0),layer:val(e,8),points:points(e),closed:!!(num(e,70)&1),bulge:e.some(a=>a[0]===42&&+a[1]!==0),text:val(e,1).replace(/\\U\+([\da-f]{4})/gi,(_,h)=>String.fromCharCode(parseInt(h,16))),at:[num(e,10),num(e,20)],height:num(e,40,0.18),radius:num(e,40),start:num(e,50),end:num(e,51)}));
 const labels=es.filter(e=>e.type==='TEXT'&&e.layer==='ROOM_TEXT');
 const polys=es.filter(e=>e.type==='LWPOLYLINE'&&e.layer==='ROOM_OUTLINE');
 const unitPolys=es.filter(e=>e.type==='LWPOLYLINE'&&e.layer==='UNIT_OUTLINE');
 const rooms=polys.map(p=>{
  const texts=labels.filter(t=>inside(t.at,p.points));const ids=texts.filter(t=>/^-?\d+\.\d{2}$/.test(t.text));
  const ident=ids.length===1?ids[0]:null;
  // Room labels form vertical stacks. Match by alignment and nearest distance to id.
  const aligned=ident?labels.filter(t=>Math.abs(t.at[0]-ident.at[0])<0.02&&Math.abs(t.at[1]-ident.at[1])<1.0):[];
  const roomNames=aligned.filter(t=>!/^[-\d.\s]+$/.test(t.text)&&!/[mM][²2]/.test(t.text)&&t.at[1]>ident.at[1]).sort((a,b)=>a.at[1]-b.at[1]);
  const printed=aligned.filter(t=>/^\d+(?:[.,]\d+)?\s*m[²2]$/.test(t.text)).sort((a,b)=>Math.abs(a.at[1]-ident.at[1])-Math.abs(b.at[1]-ident.at[1]));
  const label=roomNames[0]?.text??'';const printedArea=printed.length?parseFloat(printed[0].text.replace(',','.')):null;
  const safe=p.closed&&!p.bulge&&validRing(p.points)&&!!metres&&!!ident;
  const area=metres?polygonArea(p.points)*metres**2:null;
  const agreement=printedArea!==null&&area!==null?Math.abs(printedArea-area)<=Math.max(0.02,area*0.02):null;
  const center=ident?.at??p.points[0];const units=unitPolys.filter(up=>inside(center,up.points));
  return {...p,roomId:ident?.text??'',label,printedArea,area,perimeter:metres?perimeter(p.points)*metres:null,safe,agreement,unit:units.length===1?units[0].id:null,numbered:!!ident,outdoor:outdoor.test(norm(label)),issues:[!metres?'Missing or unsupported drawing units':null,!p.closed?'Open boundary':null,p.bulge?'Curved polyline requires arc area':null,!validRing(p.points)?'Invalid boundary':null,ids.length!==1?'Room number is missing or ambiguous':null,!label?'Room label is absent; geometry only':null,agreement===false?'Computed area differs from printed area':null].filter(Boolean)};
 });
 const annotations=es.filter(e=>e.type==='TEXT'&&e.layer==='ANNOTATION');
 const apartments=unitPolys.map((p,i)=>{const txt=[...annotations,...labels].filter(t=>inside(t.at,p.points)&&/^(?:Unit |Apartment |Wohnung |Appartement |Appartamento |App[.]? )[A-Z]$/.test(t.text));return {...p,name:txt.length===1?txt[0].text.slice(-1):null}});
 const boundsPoints=es.filter(e=>['WALL','ROOM_OUTLINE','WINDOW','UNIT_OUTLINE'].includes(e.layer)).flatMap(e=>e.points);if(!boundsPoints.length)throw new Error('No supported room geometry. Use the calibrated tracing tab for this drawing.');
 const bounds=[Math.min(...boundsPoints.map(p=>p[0])),Math.min(...boundsPoints.map(p=>p[1])),Math.max(...boundsPoints.map(p=>p[0])),Math.max(...boundsPoints.map(p=>p[1]))];
 return {name,entities:es,rooms,apartments,unit,metres,bounds,warnings:[!metres?'The file has no supported physical units. Area answers are blocked.':null,!rooms.some(r=>r.safe)?'No labelled closed ROOM_OUTLINE polygons found. Use calibrated tracing.':null].filter(Boolean)};
}
const stop=reason=>({status:'review',reason,value:null,unit:null,rooms:[],evidence:[]});
export function answerDrawing(model,question,{areaMode='polygon'}={}) {
 const q=norm(question);if(!q.trim())return stop('Ask for a room area, indoor total, room-label total or supported count.');
 // Refuse excluded/conditional requests before matching a simpler supported form.
 if(/except|excluding|exclu|esclus|ohne|sans|excepto/.test(q)&&!/outdoor|balcon|loggi|terrass|shaft|void|aussen|caved|vuoti/.test(q))return stop('This exclusion is not supported. Select the exact rooms in the drawing.');
 if(/pipe|piping|slab|reinforc|volume|thickness|cost|price|tile|baseboard|skirting|ceil|height|bathtub|washbasin|toilet bowl|wc seat|lavabi|vasche|baignoire|lavabo|lavabos|badewanne|waschbecken|wc-istuin/.test(q))return stop('This takeoff needs evidence this parser does not extract. Use calibrated tracing for area or boundary length; account for openings separately.');
 let rs=[],count=false,method='',entityIds=[];
 const countQ=/how many|wie viele|combien|quanti|quante|kuinka monta|count|number of/.test(q);
 const areaQ=/area|flache|superficie|surface|m²|m2|pinta-ala/.test(q);
 const quoted=question.match(/['«“]([^'»”]+)['»”]/)?.[1];
 const id=q.match(/(?:room|raum|locale|piece|huone)\s+(-?\d+\.\d{2})/);
 const apt=q.match(/(?:apartment|appartement|appartamento|wohnung)\s+([a-z])\b/);
 if(id&&areaQ){rs=model.rooms.filter(r=>r.roomId===id[1]);if(rs.length!==1)return stop('That room number is missing or occurs more than once.');method=`Boundary of room ${id[1]}`}
 else if(apt&&areaQ){const a=model.apartments.find(a=>a.name&&norm(a.name)===apt[1]);if(!a)return stop('That apartment boundary could not be located.');rs=model.rooms.filter(r=>r.unit===a.id&&r.numbered&&!r.outdoor);method=`Indoor numbered rooms in apartment ${a.name}`}
 else if(quoted&&(countQ||areaQ)){rs=model.rooms.filter(r=>norm(r.label)===norm(quoted));if(!rs.length)return stop('No matching room label was found. Zero cannot be verified from a missing label.');if(model.entities.filter(e=>e.type==='TEXT'&&e.layer==='ROOM_TEXT'&&norm(e.text)===norm(quoted)).length!==rs.length)return stop('Some matching labels cannot be linked to a unique boundary. A complete total needs review.');count=countQ;method=`Rooms labelled "${quoted}"`}
 else if(countQ&&/apartment|wohnung|appartement|appartament/.test(q)){if(model.apartments.some(a=>!a.name)||new Set(model.apartments.map(a=>a.name)).size!==model.apartments.length)return stop('Apartment outlines are fragmented or unlabelled. Count needs review.');if(!model.apartments.length)return stop('No apartment outlines found.');return {status:'answer',value:model.apartments.length,unit:'count',rooms:[],entityIds:model.apartments.map(a=>a.id),method:'Count explicit UNIT_OUTLINE polygons',evidence:['Apartment boundaries come from the DXF layer convention.'],reason:null}}
 else if(countQ&&/door|porte|turen|ture|portes|ovea/.test(q)){return stop('Door swing arcs can represent double leaves and duplicated symbols. Exact door counts need review.');}
 else if(countQ&&/window|fenster|finestr|fenetre|ikkuna/.test(q)){return stop('Window strokes need symbol grouping. I will not treat every line as a separate window.');}
 else if(areaQ&&/all numbered indoor|total net floor|total indoor|indoor total|tutti i locali interni|aller nummerierten|tous les locaux interieurs|toutes les pieces interieures numerotees/.test(q)){rs=model.rooms.filter(r=>r.numbered&&!r.outdoor);method='Sum of numbered indoor room boundaries'}
 else {const groups=[[/bathroom|bathrooms|bad\b|bagno|badezimmer|salle de bain|kylpyhuone/,['bad','bagno','badezimmer','salle de bain','bain','wc','toilette']], [/kitchen|kitchens|cucina|kuche|cuisine|keittio/,['kitchen','cucina','kuche','cuisine']], [/bedroom|bedrooms|schlafzimmer|chambre|camera/,['bedroom','schlafzimmer','chambre','camera']], [/balcon|balkon/,['balcone','balkon','balcon']]];const g=groups.find(([rx])=>rx.test(q));if(g&&(areaQ||countQ)&&!/(except|excluding|hors|ohne|esclus|total net floor|gesamte)/.test(q)){rs=model.rooms.filter(r=>g[1].includes(norm(r.label)));if(!rs.length)return stop('No matching room labels were found. Try the exact label shown on the plan.');count=countQ;method='Match room labels across supported languages'}else return stop('Supported questions: room 1.01 area, total indoor area, area/count of rooms labelled \'…\', apartment A area, and door count. This question needs another method.');}
 if(!rs.length)return stop('No eligible room boundaries found.');
 if(new Set(rs.map(r=>r.roomId)).size!==rs.length)return stop('Several boundaries share a room number. This may be a multipart room; review it before summing.');
 if((count||rs.length>1)&&new Set(model.rooms.filter(r=>r.numbered).map(r=>r.roomId)).size!==model.rooms.filter(r=>r.numbered).length)return stop('Room numbers are duplicated on this sheet. A complete group cannot be verified.');
 if(rs.length>1&&model.rooms.some(r=>r.numbered&&!r.label))return stop('Some numbered spaces have no room label. A complete group or indoor total cannot be verified.');
 if(rs.some(r=>!r.safe))return stop('At least one selected boundary or room label is invalid. Inspect the room issues before measuring.');
 if(!count&&rs.some(r=>r.agreement===false))return {...stop('Geometry and printed area disagree by more than 2%. Review the highlighted rooms.'),rooms:rs};
 const area=r=>areaMode==='bbox'?(Math.max(...r.points.map(p=>p[0]))-Math.min(...r.points.map(p=>p[0])))*(Math.max(...r.points.map(p=>p[1]))-Math.min(...r.points.map(p=>p[1])))*model.metres**2:r.area;
 const value=count?rs.length:rs.reduce((s,r)=>s+area(r),0);
 return {status:'answer',value,unit:count?'count':'m²',rooms:rs,entityIds:rs.map(r=>r.id),method,evidence:[count?'One matched numbered boundary per room.':'Area = ½ |Σ(xᵢyᵢ₊₁ − xᵢ₊₁yᵢ)| × metres per drawing unit².',`Units from $INSUNITS = ${model.unit}; ${model.metres} m per drawing unit.`,`${rs.filter(r=>r.agreement).length}/${rs.length} selected rooms agree with their printed area within 2%. This check shares the source geometry and is not independent validation.`],reason:null};
}
