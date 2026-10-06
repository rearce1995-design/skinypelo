// sRGB, D65/2°; CIEDE2000 with kL = kC = kH = 1.
export const HEX = ['fcecdf','f7d3bd','e9ccae','e5c2a4','dfbca0','dbaf96','dcb58e','e5af81','daa26f','c59c80','c49069','c39071','b37752','a0644a','965543','874837','79402f','733e30','6c3b2d','5c2e1f'];
export const median = a => {const b=[...a].sort((x,y)=>x-y);return b.length%2?b[(b.length-1)/2]:(b[b.length/2-1]+b[b.length/2])/2;};
export function rgbToLab(rgb){
 const [r,g,b]=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
 const xyz=[(.4124564*r+.3575761*g+.1804375*b)/.95047,.2126729*r+.7151522*g+.072175*b,(.0193339*r+.119192*g+.9503041*b)/1.08883];
 const [x,y,z]=xyz.map(v=>v>216/24389?Math.cbrt(v):(24389/27*v+16)/116);
 return [116*y-16,500*(x-y),200*(y-z)];
}
export function deltaE(a,b){
 const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
 const [l1,a1,b1]=a,[l2,a2,b2]=b,c1=Math.hypot(a1,b1),c2=Math.hypot(a2,b2),cm=(c1+c2)/2;
 const G=.5*(1-Math.sqrt(cm**7/(cm**7+25**7))),ap1=(1+G)*a1,ap2=(1+G)*a2;
 const cp1=Math.hypot(ap1,b1),cp2=Math.hypot(ap2,b2);
 const hue=(x,y)=>(deg(Math.atan2(y,x))+360)%360,h1=hue(ap1,b1),h2=hue(ap2,b2);
 const dl=l2-l1,dc=cp2-cp1;let dh=h2-h1;
 if(cp1*cp2===0)dh=0;else if(dh>180)dh-=360;else if(dh< -180)dh+=360;
 const dH=2*Math.sqrt(cp1*cp2)*Math.sin(rad(dh/2)),lm=(l1+l2)/2,cp=(cp1+cp2)/2;
 let hm=h1+h2;if(cp1*cp2!==0)hm=Math.abs(h1-h2)<=180?hm/2:hm<360?(hm+360)/2:(hm-360)/2;
 const T=1-.17*Math.cos(rad(hm-30))+.24*Math.cos(rad(2*hm))+.32*Math.cos(rad(3*hm+6))-.20*Math.cos(rad(4*hm-63));
 const sl=1+.015*(lm-50)**2/Math.sqrt(20+(lm-50)**2),sc=1+.045*cp,sh=1+.015*cp*T;
 const rt=-2*Math.sqrt(cp**7/(cp**7+25**7))*Math.sin(rad(60*Math.exp(-(((hm-275)/25)**2))));
 return Math.sqrt((dl/sl)**2+(dc/sc)**2+(dH/sh)**2+rt*(dc/sc)*(dH/sh));
}
export const palette=HEX.map((hex,i)=>{const rgb=hex.match(/../g).map(v=>parseInt(v,16));return {id:i+1,hex:'#'+hex,rgb,lab:rgbToLab(rgb)};});
export const hairPalette=[['Blonde Hair 1','eeeeee'],['Blonde Hair 2','e7dd82'],['Blonde Hair 3','f0d9ae'],['Light Brown Hair 1','dbcc8f'],['Light Brown Hair 2','dbbe92'],['Light Brown Hair 3','bd9870'],['Dark Brown Hair 1','8b7261'],['Dark Brown Hair 2','523f2f'],['Dark Brown Hair 3','33251b'],['Red Hair 1','d36023'],['Red Hair 2','c42c15'],['Red Hair 3','b1652f'],['Black Hair 1','2c2d2f'],['Black Hair 2','1f1b17'],['Black Hair 3','020306'],['Grey Hair 1','b0adae'],['Grey Hair 2','8a8889'],['Grey Hair 3','605f5f']].map(([name,hex],i)=>{const rgb=hex.match(/../g).map(v=>parseInt(v,16));return {id:i+1,name,hex:'#'+hex,rgb,lab:rgbToLab(rgb)};});
export const rank=(lab,colors=palette)=>colors.map(p=>({...p,distance:deltaE(lab,p.lab)})).sort((a,b)=>a.distance-b.distance);
export function summarize(pixels,kind='skin'){
 // Preserve very dark hair, including #020306; skin's black cutoff is unsuitable here.
 const usable=pixels.filter(p=>p[3]>240 && Math.min(...p.slice(0,3))<250 && (kind==='hair'||Math.max(...p.slice(0,3))>8)).map(p=>rgbToLab(p.slice(0,3))).sort((a,b)=>a[0]-b[0]);
 if(usable.length<16)return null;
 const trimmed=usable.slice(Math.floor(usable.length*.25),Math.ceil(usable.length*.75));
 const center=[0,1,2].map(i=>median(trimmed.map(p=>p[i]))),dist=trimmed.map(p=>deltaE(p,center)),md=median(dist),mad=median(dist.map(d=>Math.abs(d-md)));
 const kept=trimmed.filter((p,i)=>dist[i]<=md+Math.max(2,3*mad));
 if(kept.length<8)return null;
 const lab=[0,1,2].map(i=>median(kept.map(p=>p[i])));
 const band=(lo,hi)=>{const group=usable.slice(Math.floor(usable.length*lo),Math.max(Math.floor(usable.length*lo)+1,Math.ceil(usable.length*hi)));return [0,1,2].map(i=>median(group.map(p=>p[i])));};
 return {lab,count:kept.length,raw:pixels.length,clipped:1-usable.length/pixels.length,spread:median(kept.map(p=>deltaE(p,lab))),lightRange:usable[Math.floor(usable.length*.9)][0]-usable[Math.floor(usable.length*.1)][0],darkLab:band(.1,.35),lightLab:band(.65,.9)};
}

