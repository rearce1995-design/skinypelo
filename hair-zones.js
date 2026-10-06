// Geometric proposals only: user review is still required.
export function hairFrame(point){
 const top=point(10),chin=point(152),l=point(234),r=point(454),nose=point(1);
 const width=Math.hypot(r.x-l.x,r.y-l.y),height=Math.hypot(top.x-chin.x,top.y-chin.y);
 if(width<1||height<1)return null;
 const angle=Math.atan2(r.y-l.y,r.x-l.x),axis={x:Math.cos(angle),y:Math.sin(angle)},up={x:(top.x-chin.x)/height,y:(top.y-chin.y)/height},mid={x:(l.x+r.x)/2,y:(l.y+r.y)/2};
 const profile=Math.abs((nose.x-mid.x)*axis.x+(nose.y-mid.y)*axis.y)>height*.25;
 // A profile compresses face width and places the forehead at the front edge.
 // Shift the anchor toward the projected head center, not along the fringe.
 const lateral=(mid.x-top.x)*axis.x+(mid.y-top.y)*axis.y;
 const shift=profile?Math.max(-height*.65,Math.min(height*.65,lateral))*.85:0;
 return {top:{x:top.x+axis.x*shift,y:top.y+axis.y*shift},up,height,width:profile?Math.max(width,height*.85):width,angle,profile};
}
export function hairProposals(frame,offset=.32,spread=.28){
 if(!frame)return [];
 const {top,up,height,width,angle}=frame;
 return [-spread,0,spread].map((side,i)=>{const rise=offset+(i===1?.10:0);return {x:top.x+up.x*height*rise+Math.cos(angle)*width*side,y:top.y+up.y*height*rise+Math.sin(angle)*width*side,rx:Math.max(3,width*.065),ry:Math.max(3,width*.055),angle,mode:'auto',kind:'hair',pending:true,name:'Pelo '+(i+1)};});
}
