/* ===== تحسينات الرسوميات والواجهة ===== */
(function(){
const SPR_SKIP_WORLD=new Set(['Windmill','Wind Turbine','Wind Pump','Farm Tractor','Sales Truck']);
const fileOf=n=>({'Farm Tractor':'tractor'}[n]||n.toLowerCase().replace(/[^a-z]/g,''));
const SPR={};
const ver='v1';
ITEMS.forEach((d,i)=>{if(!['F','O','V','Q'].includes(d[3])){const im=new Image();im.onload=()=>{SPR[i]=im;WS[i]=undefined;delete WS[i];ICO[i]=undefined;delete ICO[i]};im.src='sprites/'+fileOf(d[2])+'.png?'+ver}});

/* --- المباني: صور مرسومة بدلاً من المجسمات --- */
const _wicon=wicon;
wicon=function(i){if(WS[i])return WS[i];const im=SPR[i],d=ITEMS[i];
 if(!im||SPR_SKIP_WORLD.has(d[2]))return _wicon(i);
 const S=4,c=document.createElement('canvas');c.width=120*S;c.height=90*S;const g=c.getContext('2d');g.scale(S,S);g.imageSmoothingQuality='high';
 const sc=Math.min(100/im.width,92/im.height),w=im.width*sc,h=im.height*sc;
 g.drawImage(im,60-w/2,89-h,w,h);return WS[i]=c};
const _icon=icon;
icon=function(i){const im=SPR[i];if(im)return im.src;return _icon(i)};

/* --- الأرض: عشب ناعم متدرج بدون نقشة الشطرنج --- */
const nz=(x,y)=>.5+.22*Math.sin(x*.31+y*.17)+.16*Math.sin(x*.11-y*.29+1.7)+.12*Math.sin((x+y)*.53+3.1);
const grassCol=(x,y)=>{const n=nz(x,y),m=hs(x,y,8);return `rgb(${(108+n*34+m*6)|0},${(178+n*30+m*6)|0},${(62+n*18)|0})`};
const _tile=tile;
tile=function(x,y,t){const v=T[x][y];
 if(v==2){const sq=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]],[cx,cy]=P(x+.5,y+.5);
  const g=ctx.createLinearGradient(cx-32,cy-16,cx+32,cy+16);g.addColorStop(0,'#3fb6e6');g.addColorStop(1,'#1d86c4');poly(sq,g);
  const sh=(a,b,s)=>{if(!isW(a,b)){poly(s,'#e9d9a6');}};
  sh(x,y-1,[[x,y],[x+1,y],[x+1,y+.12],[x,y+.12]]);sh(x+1,y,[[x+1,y],[x+1,y+1],[x+.88,y+1],[x+.88,y]]);
  sh(x,y+1,[[x,y+1],[x+1,y+1],[x+1,y+.88],[x,y+.88]]);sh(x-1,y,[[x,y],[x,y+1],[x+.12,y+1],[x+.12,y]]);
  const k=Math.sin(t/900+x*1.3+y*.7);ctx.globalAlpha=.35+.25*k;ctx.strokeStyle='#e8fbff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx-8+k*3,cy);ctx.quadraticCurveTo(cx+k*3,cy-3,cx+8+k*3,cy);ctx.stroke();ctx.globalAlpha=1;
  if(hs(x,y,4)>.8){ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.ellipse(cx+(hs(x,y,2)-.5)*20,cy+(hs(x,y,7)-.5)*8,2.2,1,0,0,7);ctx.fill()}
  return}
 if(v!=0&&v!=4&&v!=5&&v!=3){return _tile(x,y,t)}
 const sq=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]],[cx,cy]=P(x+.5,y+.5);
 ctx.fillStyle=grassCol(x+.5,y+.5);ctx.beginPath();const a=P(x,y),b=P(x+1,y),c=P(x+1,y+1),d=P(x,y+1);
 ctx.moveTo(a[0],a[1]-.6);ctx.lineTo(b[0]+.6,b[1]);ctx.lineTo(c[0],c[1]+.6);ctx.lineTo(d[0]-.6,d[1]);ctx.closePath();ctx.fill();
 const h=hs(x,y);
 if(h>.55){ctx.strokeStyle='rgba(60,120,40,.55)';ctx.lineWidth=1;ctx.beginPath();for(let i=-1;i<2;i++){const ox=cx+(hs(x,y,i+3)-.5)*30,oy=cy+(hs(x,y,i+5)-.5)*12;ctx.moveTo(ox,oy);ctx.quadraticCurveTo(ox+1,oy-3,ox+i*1.5,oy-5)}ctx.stroke()}
 if(hs(x,y,5)>.94){const fx=cx+(hs(x,y,9)-.5)*24,fy=cy+(hs(x,y,10)-.5)*10,col=['#fff6d6','#ffd23f','#ff8fb1','#b9a6ff'][(hs(x,y,6)*4)|0];
  for(let i=0;i<5;i++){ctx.fillStyle=col;ctx.beginPath();ctx.arc(fx+Math.cos(i*1.26)*1.6,fy+Math.sin(i*1.26)*.9,1.1,0,7);ctx.fill()}ctx.fillStyle='#f0a020';ctx.beginPath();ctx.arc(fx,fy,.8,0,7);ctx.fill()}
};

/* --- الأشجار: تاج كثيف بإضاءة ناعمة --- */
const blob=(x,y,r,c1,c2)=>{const g=ctx.createRadialGradient(x-r*.4,y-r*.5,r*.1,x,y,r);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()};
DRAW.tree=function(o,t){const [sx,sy]=P(o.x,o.y),s=o.s,sw=Math.sin(t/1100+o.x*1.7+o.y)*1.2*s+(o.shake?Math.sin(t/70)*3.5*s:0);
 ctx.fillStyle='rgba(20,50,10,.22)';ctx.beginPath();ctx.ellipse(sx+5*s,sy+1,16*s,6*s,0,0,7);ctx.fill();
 const tg=ctx.createLinearGradient(sx-3*s,0,sx+3*s,0);tg.addColorStop(0,'#8a5a34');tg.addColorStop(1,'#4e311b');ctx.fillStyle=tg;
 ctx.beginPath();ctx.moveTo(sx-3.2*s,sy);ctx.lineTo(sx-2*s,sy-16*s);ctx.lineTo(sx+2*s,sy-16*s);ctx.lineTo(sx+3.2*s,sy);ctx.closePath();ctx.fill();
 if(o.pine){for(let i=0;i<4;i++){const w=(19-i*4)*s,by=sy-(9+i*10)*s,ty=by-18*s,tx=sx+sw*(i+1)/4;
   const g=ctx.createLinearGradient(sx-w,by,sx+w,by);g.addColorStop(0,'#4fae68');g.addColorStop(.5,'#2f8a4e');g.addColorStop(1,'#1d5e36');
   ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sx-w,by);ctx.quadraticCurveTo(tx-w*.3,by-8*s,tx,ty);ctx.quadraticCurveTo(tx+w*.3,by-8*s,sx+w,by);ctx.quadraticCurveTo(sx,by+5*s,sx-w,by);ctx.fill()}}
 else{const autumn=o.v>.85,L=autumn?['#ffd66b','#d8892c']:o.v>.6?['#b6dd6a','#5f9e34']:['#8fd36c','#2f8a3e'],D=autumn?['#e0a040','#a2561c']:['#6cbf58','#226b30'];
  const cx=sx+sw,cy=sy-32*s;
  blob(cx+9*s,cy+5*s,11*s,D[0],D[1]);blob(cx-10*s,cy+4*s,11*s,D[0],D[1]);blob(cx,cy+6*s,13*s,D[0],D[1]);
  blob(cx-6*s,cy-6*s,12*s,L[0],L[1]);blob(cx+7*s,cy-5*s,11*s,L[0],L[1]);blob(cx,cy-13*s,10*s,L[0],L[1]);
  ctx.fillStyle='rgba(255,255,230,.18)';ctx.beginPath();ctx.ellipse(cx-6*s,cy-15*s,5*s,3*s,-.5,0,7);ctx.fill();
  if(o.v>.4&&o.v<.5){ctx.fillStyle='#e8453a';[[-6,0],[5,3],[1,-8]].forEach(([a,b])=>{ctx.beginPath();ctx.arc(cx+a*s,cy+b*s,1.8*s,0,7);ctx.fill()})}}
};

/* --- الصخور: تظليل ناعم --- */
DRAW.rock=function(o){const [sx,sy]=P(o.x,o.y),s=o.s;
 ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(sx+3*s,sy+2*s,17*s,6*s,0,0,7);ctx.fill();
 const st=(x,y,w,h,c1,c2)=>{const g=ctx.createLinearGradient(x-w,y-h,x+w,y);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*1.05,y-h*.8,x-w*.3,y-h);ctx.quadraticCurveTo(x+w*.5,y-h*1.08,x+w,y-h*.35);ctx.quadraticCurveTo(x+w*1.05,y,x+w*.6,y+h*.12);ctx.closePath();ctx.fill()};
 st(sx-4*s,sy+1*s,11*s,15*s,'#d9dce2','#7d828c');st(sx+7*s,sy+3*s,7*s,9*s,'#cfd3da','#6f747e');
 ctx.fillStyle='rgba(110,160,70,.6)';ctx.beginPath();ctx.ellipse(sx-8*s,sy-9*s,4*s,1.6*s,-.3,0,7);ctx.fill()};

/* --- صقل التصيير --- */
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
})();

/* ===== الاقتصاد: مواءمة مع سلاسل Town Star ===== */
(function(){
 /* إخفاء المنشآت التي لا تدخل في أي سلسلة إنتاج */
 ['Salt Field','Pumpkin Patch','Strawberry Field','Blueberry Field','Lettuce Field','Tomato Farm','Vanilla Bean Field','Apple Tree','Bamboo Farm','Soybean Field','Duck House'].forEach(n=>HIDE.add(n));
 /* وصفات مستوحاة من Town Star */
 RC['Candy Shop']={...RC['Candy Shop'],in:{sugar:1,mint:1},out:'candy',ic:{sugar:10,mint:10}};
 RC['Chocolate Shop']={...RC['Chocolate Shop'],in:{cocoa:1,sugar:1,milk:1},out:'choco',ic:{cocoa:10,sugar:10,milk:10}};
})();
