import assert from 'node:assert/strict';
import {rgbToLab,deltaE,palette,hairPalette,rank,summarize} from './color.js';
const close=(a,b,t=.0001)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
[[[50,2.6772,-79.7751],[50,0,-82.7485],2.0425],[[50,3.1571,-77.2803],[50,0,-82.7485],2.8615],[[50,2.8361,-74.02],[50,0,-82.7485],3.4412],[[50,0,0],[50,-1,2],2.3669],[[50,2.49,-.001],[50,-2.49,.001],7.1792]].forEach(([a,b,d])=>{close(deltaE(a,b),d);close(deltaE(a,b),deltaE(b,a));});
rgbToLab([255,255,255]).forEach((v,i)=>close(v,[100,0,0][i],.001));rgbToLab([0,0,0]).forEach(v=>close(v,0));
for(const p of palette){assert.equal(rank(p.lab)[0].id,p.id);close(deltaE(p.lab,p.lab),0);const sample=summarize([...Array(100).fill([...p.rgb,255]),...Array(20).fill([255,255,255,255]),...Array(20).fill([0,0,0,255])]);assert.equal(rank(sample.lab)[0].id,p.id);}
assert.equal(summarize(Array(100).fill([255,255,255,255])),null);assert.equal(summarize(Array(100).fill([150,100,80,0])),null);
console.log('PASS: CIEDE2000 reference pairs, D65 endpoints, all 20 palette matches, robust filtering and invalid pixels.');
assert.equal(hairPalette.length,18);
for(const p of hairPalette){assert.equal(rank(p.lab,hairPalette)[0].id,p.id);const result=summarize(Array(100).fill([...p.rgb,255]),'hair');assert.ok(result);assert.equal(rank(result.lab,hairPalette)[0].id,p.id);}
assert.equal(rank(summarize(Array(100).fill([2,3,6,255]),'hair').lab,hairPalette)[0].name,'Black Hair 3');
assert.equal(summarize(Array(100).fill([2,3,6,255])),null);
assert.deepEqual(hairPalette[17].rgb,[96,95,95]);
console.log('PASS: all 18 hair colors, near-black preservation, independent skin filter and Grey Hair 3 hex.');
