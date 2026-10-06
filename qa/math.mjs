import assert from 'node:assert/strict';
import {deltaE,rgbToLab,rank,palette,hairPalette,summarize} from '../color.js';
// Sharma, Wu & Dalal reference data, University of Rochester:
// https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/dataNprograms/ciede2000testdata.txt
const data=`50 2.6772 -79.7751 50 0 -82.7485 2.0425
50 3.1571 -77.2803 50 0 -82.7485 2.8615
50 2.8361 -74.0200 50 0 -82.7485 3.4412
50 -1.3802 -84.2814 50 0 -82.7485 1
50 -1.1848 -84.8006 50 0 -82.7485 1
50 -0.9009 -85.5211 50 0 -82.7485 1
50 0 0 50 -1 2 2.3669
50 -1 2 50 0 0 2.3669
50 2.49 -.001 50 -2.49 .0009 7.1792
50 2.49 -.001 50 -2.49 .0010 7.1792
50 2.49 -.001 50 -2.49 .0011 7.2195
50 2.49 -.001 50 -2.49 .0012 7.2195
50 -.001 2.49 50 .0009 -2.49 4.8045
50 -.001 2.49 50 .0010 -2.49 4.8045
50 -.001 2.49 50 .0011 -2.49 4.7461
50 2.5 0 50 0 -2.5 4.3065
50 2.5 0 73 25 -18 27.1492
50 2.5 0 61 -5 29 22.8977
50 2.5 0 56 -27 -3 31.9030
50 2.5 0 58 24 15 19.4535
50 2.5 0 50 3.1736 .5854 1
50 2.5 0 50 3.2972 0 1
50 2.5 0 50 1.8634 .5757 1
50 2.5 0 50 3.2592 .3350 1
60.2574 -34.0099 36.2677 60.4626 -34.1751 39.4387 1.2644
63.0109 -31.0961 -5.8663 62.8187 -29.7946 -4.0864 1.2630
61.2901 3.7196 -5.3901 61.4292 2.2480 -4.9620 1.8731
35.0831 -44.1164 3.7933 35.0232 -40.0716 1.5901 1.8645
22.7233 20.0904 -46.6940 23.0331 14.9730 -42.5619 2.0373
36.4612 47.8580 18.3852 36.2715 50.5065 21.2231 1.4146
90.8027 -2.0831 1.4410 91.1528 -1.6435 .0447 1.4441
90.9257 -.5406 -.9208 88.6381 -.8985 -.7239 1.5381
6.7747 -.2908 -2.4247 5.8714 -.0985 -2.2286 .6377
2.0776 .0795 -1.1350 .9033 -.0636 -.5514 .9082`;
for(const row of data.split('\n')){const n=row.split(/\s+/).map(Number),a=n.slice(0,3),b=n.slice(3,6);assert.ok(Math.abs(deltaE(a,b)-n[6])<.0001,`Reference: ${row}; actual ${deltaE(a,b)}`);}
let seed=42;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32;};
for(let i=0;i<10000;i++){const a=rgbToLab(Array.from({length:3},()=>Math.floor(random()*256))),b=rgbToLab(Array.from({length:3},()=>Math.floor(random()*256))),d=deltaE(a,b);assert.ok(Number.isFinite(d)&&d>=0);assert.ok(Math.abs(d-deltaE(b,a))<1e-9);assert.equal(deltaE(a,a),0);}
for(const [colors,kind] of [[palette,'skin'],[hairPalette,'hair']])for(const p of colors){const pixels=Array.from({length:400},()=>[...p.rgb.map(v=>Math.max(0,Math.min(255,v+Math.floor(random()*5)-2))),255]);pixels.push(...Array(50).fill([255,255,255,255]),...Array(50).fill([0,0,0,0]));const result=summarize(pixels,kind);assert.ok(result);assert.equal(rank(result.lab,colors)[0].id,p.id);}
for(const kind of ['skin','hair']){assert.equal(summarize([],kind),null);assert.equal(summarize(Array(15).fill([100,80,60,255]),kind),null);assert.ok(summarize(Array(16).fill([100,80,60,255]),kind));}
console.log('PASS: 34 published CIEDE2000 pairs; 10,000 deterministic color pairs; 38 noisy swatches; sample size boundaries.');
const varied=summarize([...Array(60).fill([44,45,47,255]),...Array(40).fill([189,152,112,255])],'hair');
assert.equal(rank(varied.darkLab,hairPalette)[0].name,'Black Hair 1');
assert.equal(rank(varied.lightLab,hairPalette)[0].name,'Light Brown Hair 3');
assert.ok(deltaE(varied.darkLab,varied.lightLab)>8);
console.log('PASS: tonal bands retain lighter strands excluded from the central median.');
