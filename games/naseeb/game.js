function q0(i,t,e){let n=Math.min(t/i,.98),s=1,r=2,o=1.5,a=1;for(let l=0;l<50;l++)o=(s+r)/2,a=Math.tan(Math.PI/(2*o))/e,Math.sin(o*Math.atan(a))>n?s=o:r=o;return l=>i*Math.sin(o*Math.atan(a*l))}var Wh=[{id:"asphalt",name:"Dry asphalt",peak:1,slide:.75,slipAtPeak:.12,hysteresis:1,give:1/0,damping:.14},{id:"concrete",name:"Concrete",peak:.9,slide:.7,slipAtPeak:.1,hysteresis:.9,give:1/0,damping:.14},{id:"wet",name:"Wet asphalt",peak:.6,slide:.45,slipAtPeak:.09,hysteresis:1.25,give:1/0,damping:.2},{id:"gravel",name:"Gravel",peak:.6,slide:.55,slipAtPeak:.3,hysteresis:1,give:6e5,damping:.45},{id:"grass",name:"Grass",peak:.5,slide:.4,slipAtPeak:.2,hysteresis:1,give:4e5,damping:.6},{id:"sand",name:"Sand",peak:.45,slide:.42,slipAtPeak:.35,hysteresis:1,give:6e4,damping:1},{id:"mud",name:"Mud",peak:.4,slide:.3,slipAtPeak:.25,hysteresis:1,give:12e4,damping:1.1},{id:"snow",name:"Packed snow",peak:.3,slide:.2,slipAtPeak:.12,hysteresis:1,give:9e4,damping:.9},{id:"ice",name:"Ice",peak:.12,slide:.07,slipAtPeak:.06,hysteresis:1,give:1/0,damping:.14},{id:"dirt",name:"Packed dirt",peak:.75,slide:.6,slipAtPeak:.15,hysteresis:1.05,give:12e5,damping:.4},{id:"rock",name:"Rock",peak:.85,slide:.7,slipAtPeak:.1,hysteresis:1,give:1/0,damping:.15},{id:"wood",name:"Logs",peak:.65,slide:.5,slipAtPeak:.1,hysteresis:1,give:1/0,damping:.2},{id:"loose",name:"Loose earth",peak:.55,slide:.48,slipAtPeak:.25,hysteresis:1.1,give:35e4,damping:.6}];for(let i of Wh)i.grip=q0(i.peak,i.slide,i.slipAtPeak);var Fn=i=>Wh.find(t=>t.id===i),Vs=Fn;var on=2.2,Y0=[...["asphalt","concrete","wet","gravel","grass","sand","mud","snow","ice"].map(i=>({name:Fn(i).name,left:Fn(i),right:Fn(i)})),{name:"Ice | asphalt",left:Fn("ice"),right:Fn("asphalt")}];var Nf=i=>i<=0?0:i>=1?1:i*i*(3-2*i),Rf=i=>i>=1?0:.5+.5*Math.cos(Math.PI*i),Cf=i=>i<=0?0:i>=1?i-.5:i*i*i-i*i*i*i/2,Ms=(i,t,e,n)=>n*(Cf((i-t+n/2)/n)-Cf((i-e+n/2)/n))/(e-t),xr=(i,t,e)=>1-Nf((Math.abs(i)-t)/(e-t)),Gh=i=>Nf((i+.05)/.1);function Z0(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var YS=Fn("dirt"),ZS=Fn("grass"),Vh=[{u:5.5,r:.1,angle:0},{u:10,r:.125,angle:0},{u:14.5,r:.15,angle:0},{u:20,r:.125,angle:.45}],$0=2.7,Pf=(i,t,e)=>{let n=Math.cos(i.angle),s=Math.sin(i.angle),r=e-i.u,o=t*n+r*s;if(Math.abs(o)>$0)return 0;let a=Math.abs(-t*s+r*n);return a>=i.r?0:.8*i.r+Math.sqrt(i.r*i.r-a*a)},tl=(()=>{let i=Z0(1970),t=[];for(let e=0;e<26;e++){let n=.12+i()*.22,s=Math.max(n*1.3,.25+i()*.3);t.push({x:(i()*2-1)*1.9,u:5.5+i()*16.5,h:n,rx:s,ru:s*(.75+i()*.5)})}return t.sort((e,n)=>e.u-n.u)})(),If=Math.max(...tl.map(i=>i.ru)),Df=(i,t,e)=>{let n=(t-i.x)/i.rx,s=(e-i.u)/i.ru,r=1-n*n-s*s;return r>0?i.h*Math.sqrt(r):0},J0=3,K0=Math.tan(25*Math.PI/180),j0=[{id:"start",look:"dirt",name:"Test ground",note:"Naseeb's proving run",length:16,height:()=>0},{id:"washboard",look:"dirt",name:"Washboard",note:"5 cm ripples, 75 cm apart",length:24,height:(i,t)=>t<4||t>19.75?0:.025*(1-Math.cos(2*Math.PI*(t-4)/.75))*xr(i,on,on+.6)},{id:"logs",look:"wood",name:"Log crossing",note:"20, 25 and 30 cm logs",length:26,fine:!0,logs:Vh,drawn:()=>0,height:(i,t)=>{let e=0;for(let n of Vh)e=Math.max(e,Pf(n,i,t));return e},surface:(i,t)=>Vh.some(e=>Pf(e,i,t)>0)?Fn("wood"):null},{id:"twister",look:"dirt",name:"Axle twister",note:"40 cm mounds, left and right",length:30,height:(i,t)=>{let e=0;for(let n=0;n<5;n++){let s=n%2?.85:-.85,r=7+n*4.5;e=Math.max(e,.4*Rf(Math.hypot((i-s)/1.3,(t-r)/2.2)))}return e}},{id:"steps",look:"concrete",name:"Rock steps",note:"Up 25 and 20 cm, down 45 cm",length:26,fine:!0,height:(i,t)=>(.25*Gh(t-7)+.2*Gh(t-11)-.45*Gh(t-16))*xr(i,on+.2,on+.3),surface:(i,t)=>t>6.9&&t<16.1&&Math.abs(i)<on+.3?Fn("concrete"):null},{id:"hill",look:"concrete",name:"Hill climb",note:"40% up, 40% down",length:40,height:(i,t)=>{let e=J0*(Ms(t,6,13.5,1.2)-Ms(t,19.5,27,1.2)),n=Math.abs(i)-(on+.3);return n<=0?e:Math.max(0,e-n)},surface:(i,t)=>t>5.5&&t<27.5&&Math.abs(i)<on+.3?Fn("concrete"):null},{id:"sideslope",look:"dirt",name:"Side slope",note:"25\xB0 across",length:36,height:(i,t)=>{let e=Ms(t,5,10,1.5)-Ms(t,26,31,1.5);if(e<=0)return 0;let n=on+.2,s=o=>e*K0*(o+on);if(i<-on)return 0;if(i<=n)return s(i);let r=s(n);return Math.max(0,r-(i-n)*.9)}},{id:"ditch",look:"dirt",name:"V-ditch",note:"55 cm deep, at an angle \xB7 low range",length:24,height:(i,t)=>-.55*Rf(Math.abs(t-12-.6*i)/1.6)*xr(i,3,5)},{id:"mud",look:"mud",name:"Mud pit",note:"30 cm deep",length:26,height:(i,t)=>-.3*(Ms(t,5,8,1)-Ms(t,19,22,1))*xr(i,on+.2,on+1.2),surface:(i,t)=>t>5.5&&t<21.5&&Math.abs(i)<on+.6?Fn("mud"):null},{id:"rocks",look:"rock",name:"Rock garden",note:"Boulders up to 35 cm",length:28,fine:!0,rocks:tl,drawn:()=>0,height:(i,t)=>{let e=0;for(let n of tl){if(n.u-If>t)break;Math.abs(n.u-t)<n.ru&&(e=Math.max(e,Df(n,i,t)))}return e},surface:(i,t)=>{for(let e of tl){if(e.u-If>t)break;if(Df(e,i,t)>.005)return Fn("rock")}return null}},{id:"sand",look:"sand",name:"Sand trap",note:"Loose and soft",length:22,height:(i,t)=>-.08*(Ms(t,4,6,1)-Ms(t,16,18,1))*xr(i,on,on+1),surface:(i,t)=>t>4.5&&t<17.5&&Math.abs(i)<on+.5?Fn("sand"):null},{id:"whoops",look:"dirt",name:"Whoops",note:"30 cm rollers, 5 m apart",length:38,height:(i,t)=>t<6||t>26?0:.15*(1-Math.cos(2*Math.PI*(t-6)/5))*xr(i,on+.3,on+1.3)}],Lf=0;for(let i of j0)i.start=Lf,Lf+=i.length;var Ce=.5,pi=1.5,Xh=2.2,qh=1.5,Yh=.3,Zh=.25,Q0=.35,Uf=16,me=.5,tg=.23,eg=.14,On=i=>i<=0?0:i>=1?1:i*i*(3-2*i),$h=i=>i<=0?0:i>=1?i-.5:i*i*i-i*i*i*i/2,el=i=>i>=1?0:.5+.5*Math.cos(Math.PI*i),ii=(i,t)=>Math.sqrt(i*i+t*t);function nl(i,t){let e=Math.imul(i,374761393)+Math.imul(t,668265263)|0;return e=Math.imul(e^e>>>13,1274126177),e^=e>>>16,(e>>>0)/4294967296}function qn(i,t){let e=Math.floor(i),n=Math.floor(t),s=i-e,r=t-n,o=s*s*(3-2*s),a=r*r*(3-2*r),l=nl(e,n),c=nl(e+1,n),h=nl(e,n+1),d=nl(e+1,n+1);return(l+(c-l)*o+(h-l)*a+(l-c-h+d)*o*a)*2-1}function sl(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var qf=[];function es(i,t){let e=Yf(i,t);for(let n of qf){let s=i-n.x,r=t-n.z,o=ii(s,r);if(o>=n.reach)continue;let a=1-On((o-n.flat)/(n.reach-n.flat));e+=(n.h+.28*(s*n.ux+r*n.uz)-e)*a}return e}function Yf(i,t){let e=-t,n=.73*45*$h((e+15)/45)-.72*55*$h((e-175)/55)-.6*60*$h((e-300)/60);n*=1-.65*On((Math.abs(i)-100)/140),n+=.05*e;let s=7*Math.sin(2*Math.PI*(i+14*Math.sin(e/41))/72)*On((e-5)/35)*(1-On((e-190)/40));return n+s+6*qn(i/80+11.3,e/80+4.1)+3*qn(i/35+7.7,e/35+3.2)}var Zf=(i,t)=>.9*qn(i/11,t/11)+.35*qn(i/4.3+5.1,t/4.3+1.7)+.12*qn(i/1.7+2.3,t/1.7+9.1),ru=(i,t)=>es(i,t)+Zf(i,t);function qs(i,t){let n=(es(i+1,t)-es(i-1,t))/2,s=(es(i,t+1)-es(i,t-1))/2;return[n,s]}var Ff=[{way:-1,turnAt:-58,grade:.1,hairpin:3},{way:1,turnAt:56,grade:.12,hairpin:5.9},{way:-1,turnAt:-64,grade:.13,hairpin:3},{way:1,turnAt:60,grade:.11,hairpin:6},{way:-1,turnAt:-56,grade:.14,hairpin:3.2},{way:1,turnAt:52,grade:.12,hairpin:6.1},{way:-1,turnAt:-60,grade:.13,hairpin:3},{way:1,turnAt:54,grade:.12,hairpin:5.2},{way:-1,turnAt:-40,grade:.11,hairpin:0}],Of=7,ng=150,Jh=([i,t],e)=>[i*Math.cos(e)-t*Math.sin(e),i*Math.sin(e)+t*Math.cos(e)],il=(i,t)=>i[0]*t[1]-i[1]*t[0],Qh=(i,t)=>i[0]*t[0]+i[1]*t[1];function Bf(i,t,e){let n=qs(i[0],i[1]),s=ii(n[0],n[1]);if(s<=e)return[t,0];let r=[n[0]/s,n[1]/s],o=[-r[1],r[0]];o[0]*t<0&&(o=[-o[0],-o[1]]);let a=e/s,l=Math.sqrt(1-a*a);return[o[0]*l+r[0]*a,o[1]*l+r[1]*a]}function ig(){let i=[],t=[],e=[],n=[],s=[0,38],r=[0,-1],o=h=>{i.push(s[0]),t.push(s[1]),e.push(h)},a=(h=pi)=>{s=[s[0]+r[0]*Ce,s[1]+r[1]*Ce],o(h)};o(pi);for(let h=0;h<400;h++){let d=qs(s[0],s[1]);if(ii(d[0],d[1])>.42)break;a()}for(let[h,d]of Ff.entries()){let u=!1;for(let m=0;m<2e3&&!(d.way*(d.turnAt-s[0])<=0||(u=es(s[0],s[1])>ng));m++){let b=Bf(s,d.way,d.grade),M=Math.max(-Ce/Of,Math.min(Ce/Of,Math.atan2(il(r,b),Qh(r,b))));r=Jh(r,M),a()}if(u||!d.hairpin)break;let f=Math.sign(il(r,qs(s[0],s[1])))||1,g=Ff[h+1],v=d.hairpin<4?2.2:2.05,p=Ce/d.hairpin;n.push({at:i.length,radius:d.hairpin,tight:d.hairpin<4});for(let m=0;m<Math.PI*1.2;m+=p){let b=Bf(s,g.way,g.grade),M=Math.atan2(il(r,b),Qh(r,b));if(m>Math.PI/2&&Math.abs(M)<p){r=Jh(r,M);break}r=Jh(r,f*p),a(v)}for(let m=0;m<4;m++)a(v)}for(let h=0;h<30;h++)a();let l=i.length,c=Float32Array.from(e);for(let h of n){let d=h.at+Math.round(Math.PI*h.radius/Ce)+4;for(let u=Math.max(0,h.at-12);u<Math.min(l,d+12);u++){let f=u<h.at?1-(h.at-u)/12:u>d?1-(u-d)/12:1;c[u]=Math.max(c[u],pi+(e[h.at]-pi)*On(f))}}for(let h=l-14;h<l;h++)c[h]=pi+(7-pi)*On((h-(l-14))/13);return{x:Float32Array.from(i),z:Float32Array.from(t),half:c,hairpins:n}}function sg(i){let t=i.x.length,e=new Float64Array(t);for(let h=0;h<t;h++)e[h]=es(i.x[h],i.z[h]);let n=(h,d)=>{let u=new Float64Array(t);for(let f=0;f<t;f++){let g=0,v=0;for(let p=Math.max(0,f-d);p<=Math.min(t-1,f+d);p++)g+=h[p],v++;u[f]=g/v}return u},s=n(e,18).map(h=>h-Q0),r=new Float64Array(t).fill(tg*Ce);for(let h of i.hairpins){let d=h.at+Math.round(Math.PI*h.radius/Ce);for(let u=Math.max(0,h.at-4);u<Math.min(t,d+4);u++)r[u]=eg*Ce}let o=new Float64Array(t);o[0]=s[0];for(let h=1;h<t;h++)o[h]=Math.min(o[h-1]+r[h],Math.max(o[h-1],s[h]));let a=new Float64Array(t);a[t-1]=o[t-1];for(let h=t-2;h>=0;h--)a[h]=Math.max(a[h+1]-r[h+1],Math.min(a[h+1],s[h]));let l=new Float64Array(t);for(let h=0;h<t;h++)l[h]=(o[h]+a[h])/2;let c=n(l,6);for(let h=t-14;h<t;h++)c[h]=c[t-14];return Float32Array.from(c)}var et=ig();for(let i of et.hairpins){let t=i.at+Math.round(Math.PI*i.radius/Ce),e=(et.x[i.at]+et.x[t])/2,n=(et.z[i.at]+et.z[t])/2,s=qs(e,n),r=ii(s[0],s[1])||1;qf.push({x:e,z:n,h:Yf(e,n),ux:s[0]/r,uz:s[1]/r,flat:i.radius+4,reach:i.radius+16})}et.e=sg(et);et.count=et.x.length;et.length=(et.count-1)*Ce;et.hx=new Float32Array(et.count);et.hz=new Float32Array(et.count);et.upSide=new Int8Array(et.count);et.bend=new Float32Array(et.count);et.tilt=new Float32Array(et.count);for(let i=0;i<et.count;i++){let t=Math.max(0,i-1),e=Math.min(et.count-1,i+1),n=et.x[e]-et.x[t],s=et.z[e]-et.z[t],r=ii(n,s);et.hx[i]=n/r,et.hz[i]=s/r}for(let i=0;i<et.count;i++){let t=qs(et.x[i],et.z[i]),e=(-et.hz[i]*t[0]+et.hx[i]*t[1])/Math.max(1e-6,ii(t[0],t[1]));et.upSide[i]=e>0?1:-1,et.tilt[i]=e;let n=Math.max(0,i-4),s=Math.min(et.count-1,i+4),r=Math.abs(Math.atan2(il([et.hx[n],et.hz[n]],[et.hx[s],et.hz[s]]),Qh([et.hx[n],et.hz[n]],[et.hx[s],et.hz[s]])));et.bend[i]=r>1e-4?(s-n)*Ce/r:1e4}var Yn=sl(4242),$f=[],Jf=[],Kf=[],yo=i=>et.hairpins.some(t=>i>t.at-40&&i<t.at+Math.round(Math.PI*t.radius/Ce)+40);for(let i=10;i<et.length-20;i+=5+Yn()*9){let t=Math.round(i/Ce),e=et.half[t];$f.push({s:i,lateral:(Yn()*2-1)*(e-.3),r:.3+Yn()*.45,depth:.06+Yn()*.11})}for(let i=40;i<et.length-30;i+=45+Yn()*50)yo(Math.round(i/Ce))||Jf.push({s:i,height:.12+Yn()*.08,long:.7+Yn()*.5,skew:(Yn()*2-1)*.35});function ou(i,t,e){let n=[];for(let s=40+Yn()*20;s<et.length-40-t&&n.length<i;s+=6){if(n.length&&s-n[n.length-1]<e)continue;let r=!0;for(let o=s;o<=s+t;o+=2)yo(Math.round(o/Ce))&&(r=!1);r&&Yn()<.35&&n.push(s)}return n}for(let i of ou(3,40,160))Kf.push({from:i,to:i+26+Yn()*14});for(let i=0;i<et.count;i++){if(yo(i))continue;let t=qs(et.x[i],et.z[i]),e=1-On((ii(t[0],t[1])-.2)/.35);et.half[i]=Math.max(et.half[i],pi+.22*qn(i*Ce/37+4.4,1.9)+.75*e)}for(let i of ou(5,20,90)){let t=Math.round(i/Ce),e=t+Math.round((8+Yn()*6)/Ce);for(let n=t-8;n<=e+8;n++){let s=Math.min(1,(n-(t-8))/8,(e+8-n)/8);et.half[n]=Math.max(et.half[n],pi+(2.6-pi)*On(s))}}for(let i of ou(4,35,120)){let t=Math.round(i/Ce),e=t+Math.round((20+Yn()*15)/Ce);for(let n=t-10;n<=e+10;n++){let s=Math.min(1,(n-(t-10))/10,(e+10-n)/10);et.half[n]=Math.min(et.half[n],pi-(pi-1.3)*On(s))}}var rg=i=>Kf.find(t=>i>t.from-3&&i<t.to+3),xo=[];for(let i of $f)for(let t=Math.floor(i.s-i.r-1);t<=Math.ceil(i.s+i.r+1);t++)(xo[t]=xo[t]||[]).push(i);for(let i of Jf)for(let t=Math.floor(i.s-i.long-2);t<=Math.ceil(i.s+i.long+2);t++)(xo[t]=xo[t]||[]).push(i);function vo(i,t){let e=Math.max(0,Math.min(et.count-1.001,i)),n=Math.floor(e),s=e-n,r=et.e[n]+(et.e[n+1]-et.e[n])*s,o=e*Ce,a=et.tilt[n]+(et.tilt[n+1]-et.tilt[n])*s,l=On((et.bend[n]-8)/20),c=rg(o),d=(c?.11*On(Math.min(o-c.from+3,c.to+3-o)/4):l*.035)*(el(Math.abs(t-.72)/.26)+el(Math.abs(t+.72)/.26)),u=r-.03*t*a-d;u+=.07*qn(o/3.4,t/2.5+40)+.035*qn(o/1.2+9,t/1.2+20)+.012*qn(o/.37+5,t/.37+60);for(let f of xo[Math.floor(o)]||og)f.depth?u-=f.depth*el(ii(o-f.s,t-f.lateral)/f.r):u+=f.height*el(Math.abs(o-f.s-t*f.skew)/f.long);return u}var og=[],tu=1/0,eu=-1/0,nu=1/0,iu=-1/0;for(let i=0;i<et.count;i++)tu=Math.min(tu,et.x[i]),eu=Math.max(eu,et.x[i]),nu=Math.min(nu,et.z[i]),iu=Math.max(iu,et.z[i]);var ol=70,an=Math.floor((tu-ol)/32)*32,ln=Math.floor((nu-ol)/32)*32,te=Math.ceil((eu+ol-an)/32)*64+1,Ue=Math.ceil((iu+ol-ln)/32)*64+1,gn=new Float32Array(te*Ue),zf=new Float32Array(te*Ue),su=new Int32Array(te*Ue).fill(-1),kf=new Float32Array(te*Ue).fill(1e9),mi=new Uint8Array(te*Ue),xe={GRASS:0,ROCK:1,ROAD:2,LOOSE:3,FOREST:4},Ws=(i,t,e)=>i<e?t*i*i/(2*e):t*(i-e/2);{let i=new Float32Array(te*Ue).fill(1/0),t=new Float32Array(te*Ue).fill(-1/0),e=new Float32Array(te*Ue).fill(1/0),n=new Float32Array(te*Ue),s=new Float32Array(te*Ue),r=new Float32Array(te*Ue),o=new Float64Array(te*Ue),a=new Float64Array(te*Ue),l=new Float32Array(et.count),c=new Float32Array(et.count),h=new Float32Array(et.count),d=new Float32Array(et.count);for(let g=0;g<et.count;g++){let v=qs(et.x[g],et.z[g]);l[g]=Math.min(1,ii(v[0],v[1])),c[g]=On((l[g]-.25)/.45),h[g]=Math.max(.05,(1.1+2.4*(.5+.5*qn(g*Ce/23+3.3,7.7)))*c[g]),d[g]=Math.max(.05,(1.4+2.6*(.5+.5*qn(g*Ce/19+8.1,2.2)))*c[g])}let u=(g,v,p)=>{let m=p?h[g]:d[g],b=p?Xh:qh,M=l[g],x=p?Yh:Zh,y=Math.max(.02,Math.min(.8,m/b*.8)),_=m/b-y/2,E;if(v<_)E=Ws(v,b,x);else if(v<_+y){let S=v-_;E=Ws(_,b,x)+b*S-(b-M)*S*S/(2*y)}else E=Ws(_,b,x)+b*y-(b-M)*y/2+M*(v-_-y);return p?E:-E},f=Math.ceil(Uf/me);for(let g=0;g<et.count;g++){let v=Math.round((et.x[g]-an)/me),p=Math.round((et.z[g]-ln)/me),m=et.e[g],b=et.half[g];for(let M=Math.max(0,p-f);M<=Math.min(Ue-1,p+f);M++){let x=ln+M*me-et.z[g];for(let y=Math.max(0,v-f);y<=Math.min(te-1,v+f);y++){let _=an+y*me-et.x[g],E=Math.sqrt(_*_+x*x);if(E>Uf)continue;let S=M*te+y,T=Math.max(0,E-b),A=m+Ws(T,Xh,Yh),C=m-Ws(T,qh,Zh);A<i[S]&&(i[S]=A),C>t[S]&&(t[S]=C);{let L=-_*et.hz[g]+x*et.hx[g],U=Math.max(0,Math.abs(L)-b),N=Math.sign(L)*et.tilt[g],F=Math.abs(et.tilt[g])>.45?N>0:es(an+y*me,ln+M*me)>m,H=m+u(g,U,F),G=1/(E+.5)**4;o[S]+=H*G,a[S]+=G}if(E-b<e[S]){e[S]=E-b,n[S]=m,s[S]=c[g];let L=-_*et.hz[g]+x*et.hx[g];r[S]=Math.sign(L)*et.tilt[g]}E<b+1.5&&E<kf[S]&&(kf[S]=E,su[S]=g)}}}for(let g=0;g<Ue;g++)for(let v=0;v<te;v++){let p=g*te+v,m=an+v*me,b=ln+g*me,M=.2+.8*On((e[p]-2)/10),x=es(m,b);a[p]>0&&(x+=(o[p]/a[p]-x)*(1-On((e[p]-5)/11)));let y=x+Zf(m,b)*M;zf[p]=y;let _=Math.min(y,i[p]);t[p]>_&&(_=t[p]),r[p]>.45&&e[p]<3&&(_=Math.max(_,n[p]+.9*Ws(Math.max(0,e[p]),Xh*s[p],Yh))),r[p]<-.45&&e[p]<2.5&&(_=Math.min(_,n[p]-.9*Ws(Math.max(0,e[p]),qh*s[p],Zh))),gn[p]=_}for(let g=0;g<2;g++){let v=gn.slice();for(let p=1;p<Ue-1;p++)for(let m=1;m<te-1;m++){let b=p*te+m;if(e[b]<.6)continue;let M=v[b-1]+v[b+1]+v[b-te]+v[b+te],x=v[b-te-1]+v[b-te+1]+v[b+te-1]+v[b+te+1];gn[b]=(4*v[b]+2*M+x)/16}}for(let g=0;g<Ue;g++)for(let v=0;v<te;v++){let p=g*te+v,m=an+v*me,b=ln+g*me,M=vr(m,b,su[p]);M?(gn[p]=vo(M.i,M.lateral),mi[p]=xe.ROAD):Math.abs(gn[p]-zf[p])>.12&&(mi[p]=xe.LOOSE)}for(let g=1;g<Ue-1;g++)for(let v=1;v<te-1;v++){let p=g*te+v;if(mi[p])continue;let m=(gn[p+1]-gn[p-1])/(2*me),b=(gn[p+te]-gn[p-te])/(2*me),M=ii(m,b),x=an+v*me,y=ln+g*me;M>1.05+.15*qn(x/6,y/6)?mi[p]=xe.ROCK:qn(x/23+3,y/23+8)>-.1&&(mi[p]=xe.FOREST)}}function vr(i,t,e){if(e<0)return null;let n=null;for(let r=Math.max(0,e-2);r<Math.min(et.count-1,e+2);r++){let o=et.x[r],a=et.z[r],l=et.x[r+1]-o,c=et.z[r+1]-a,h=Math.max(0,Math.min(1,((i-o)*l+(t-a)*c)/(l*l+c*c))),d=i-o-l*h,u=t-a-c*h,f=ii(d,u);(!n||f<n.d)&&(n={d:f,i:r+h,lateral:(d*-c+u*l)/ii(l,c)})}let s=et.half[Math.round(n.i)];return n.d<=s?n:null}var Li=8,Xs=[],au=[];{let i=sl(1970),t=(o,a)=>{let l=Math.round((o-an)/me),c=Math.round((a-ln)/me);return l<0||c<0||l>=te||c>=Ue?-1:c*te+l},e=(o,a,l)=>{let c=Math.round((o-an)/me),h=Math.round((a-ln)/me);for(let d=h-l;d<=h+l;d++)for(let u=c-l;u<=c+l;u++){if(u<0||d<0||u>=te||d>=Ue)continue;let f=mi[d*te+u];if(f===xe.ROAD||f===xe.LOOSE)return!1}return!0};for(let o=ln+4;o<ln+(Ue-1)*me-4;o+=7)for(let a=an+4;a<an+(te-1)*me-4;a+=7){let l=a+(i()-.5)*6,c=o+(i()-.5)*6,h=t(l,c);if(h<0)continue;let d=mi[h]===xe.ROCK;if(i()>(d?.75:.22))continue;let u=.35+Math.pow(i(),2.2)*1.6;e(l,c,Math.ceil((u+.6)/me))&&Xs.push({x:l,z:c,rx:u,rz:u*(.7+i()*.6),h:u*(.45+i()*.4),turn:i()*Math.PI})}let n=(o,a,l)=>Xs.push({x:et.x[o]-et.hz[o]*a,z:et.z[o]+et.hx[o]*a,rx:l,rz:l*(.75+i()*.5),h:l*(.55+i()*.3),turn:i()*Math.PI});for(let o=30;o<et.count-40;o+=16+Math.floor(i()*34)){let a=et.half[o];if(n(o,(i()*2-1)*(a-.25),.14+Math.pow(i(),1.5)*.24),i()<.22)for(let l=0;l<3+i()*4;l++)n(Math.min(et.count-1,o+Math.floor(i()*8)),(i()*2-1)*(a-.2),.1+i()*.22)}for(let o of Xs){let a=t(o.x,o.z);o.base=(a>=0?gn[a]:ru(o.x,o.z))-.2*o.h,o.cos=Math.cos(o.turn),o.sin=Math.sin(o.turn)}for(let o=ln+2;o<ln+(Ue-1)*me-2;o+=3.6)for(let a=an+2;a<an+(te-1)*me-2;a+=3.6){let l=a+(i()-.5)*3.2,c=o+(i()-.5)*3.2,h=t(l,c);if(h<0)continue;let d=mi[h];if(d===xe.ROCK||d===xe.ROAD||d===xe.LOOSE||i()>(d===xe.FOREST?.62:.1)||!e(l,c,5))continue;let u=7+i()*13;au.push({x:l,z:c,r:.12+u*.016,height:u,base:gn[h],shade:i()})}let s=sl(2468),r=(o,a,l)=>{let c=Math.round((o-an)/me),h=Math.round((a-ln)/me);for(let d=h-l;d<=h+l;d++)for(let u=c-l;u<=c+l;u++)if(u>=0&&d>=0&&u<te&&d<Ue&&mi[d*te+u]===xe.ROAD)return!1;return!0};for(let o=20;o<et.count-20;o+=3+Math.floor(s()*6))if(!yo(o))for(let a of[-1,1]){if(s()<.2)continue;let l=.14+Math.pow(s(),2)*.36,c=a*(et.half[o]+.45+l+Math.pow(s(),1.6)*3.5),h=et.x[o]-et.hz[o]*c,d=et.z[o]+et.hx[o]*c,u=t(h,d);if(u<0||vr(h,d,_o(h,d))||!r(h,d,Math.ceil(l/me)))continue;let f=l*(.45+s()*.35),g=s()*Math.PI;Xs.push({x:h,z:d,rx:l,rz:l*(.7+s()*.6),h:f,turn:g,base:gn[u]-.2*f,cos:Math.cos(g),sin:Math.sin(g)})}}var rl=[];{let i=sl(1971),t=(e,n,s,r,o,a)=>{let l=et.x[e]-et.hz[e]*n,c=et.z[e]+et.hx[e]*n,h=Math.atan2(et.hz[e],et.hx[e])+Math.PI/2+s,d=Math.cos(h),u=Math.sin(h),f=m=>{let b=l+d*m,M=c+u*m,x=vr(b,M,_o(b,M));return x?vo(x.i,x.lateral):null},g=null,v=null;for(let m=-Math.min(r,1.6);m<=0;m+=.1)g===null&&(g=f(m)!==null?[m,f(m)]:null);for(let m=Math.min(r,1.6);m>=0;m-=.1)v===null&&(v=f(m)!==null?[m,f(m)]:null);if(!g||!v||v[0]-g[0]<.2)return;let p=(v[1]-g[1])/(v[0]-g[0]);rl.push({x:l,z:c,ax:d,az:u,reach:r,r:o,kind:a,base:g[1]-g[0]*p-.2*o,grade:p,i:e,lateral:n,angle:s})};for(let e=160;e<et.length-40;e+=38+i()*45){let n=Math.round(e/Ce);yo(n)||t(n,(i()*2-1)*.4,(i()*2-1)*.55,3+i()*1.5,.1+i()*.08,"log")}for(let e of rl){if(e.kind!=="log")continue;let n=e.i,s=Math.cos(e.angle),r=Math.tan(e.angle);for(let o of[-.72,.72]){let a=-(o-e.lateral)*r;for(let l of[-1,1]){let c=e.r*(.85+i()*.25),h=a+l*(e.r/s+c*.9),d=et.x[n]+et.hx[n]*h-et.hz[n]*o,u=et.z[n]+et.hz[n]*h+et.hx[n]*o,f=vr(d,u,_o(d,u));if(!f)continue;let g=i()*Math.PI;Xs.push({x:d,z:u,rx:c*1.7,rz:c*(1.3+i()*.4),h:c,turn:g,base:vo(f.i,f.lateral)-.15*c,cos:Math.cos(g),sin:Math.sin(g)})}}}for(let e=20;e<et.length-20;e+=10+i()*22){let n=Math.round(e/Ce);t(n,(i()*2-1)*(et.half[n]-.4),i()*Math.PI,.5+i()*.7,.03+i()*.035,"branch")}}function Hf(i,t,e){let n=t-i.x,s=e-i.z,r=n*i.ax+s*i.az;if(r<-i.reach||r>i.reach)return-1/0;let o=Math.abs(-n*i.az+s*i.ax);return o>=i.r?-1/0:i.base+i.grade*r+.8*i.r+Math.sqrt(i.r*i.r-o*o)}function lu(i,t){let e=Math.floor(an/Li)-2,n=Math.floor(ln/Li)-2,s=Math.ceil(te*me/Li)+5,r=Math.ceil(Ue*me/Li)+5,o=new Array(s*r).fill(Kh);for(let a of i){let l=t(a);for(let c=Math.floor((a.z-l)/Li);c<=Math.floor((a.z+l)/Li);c++)for(let h=Math.floor((a.x-l)/Li);h<=Math.floor((a.x+l)/Li);h++){let d=h-e,u=c-n;if(d<0||u<0||d>=s||u>=r)continue;let f=d*r+u;o[f]===Kh&&(o[f]=[]),o[f].push(a)}}return(a,l)=>{let c=Math.floor(a/Li)-e,h=Math.floor(l/Li)-n;return c<0||h<0||c>=s||h>=r?Kh:o[c*r+h]}}var Kh=[],Gf=lu(Xs,i=>Math.max(i.rx,i.rz)),Vf=lu(rl,i=>i.reach+i.r),ag=lu(au,i=>i.r+2.5);function Wf(i,t,e){let n=t-i.x,s=e-i.z,r=(n*i.cos+s*i.sin)/i.rx,o=(-n*i.sin+s*i.cos)/i.rz,a=1-r*r-o*o;return a>0?i.base+i.h*Math.sqrt(a):-1/0}function Xf(i,t){let e=(i-an)/me,n=(t-ln)/me,s=Math.floor(e),r=Math.floor(n);if(s<0||r<0||s>=te-1||r>=Ue-1)return ru(i,t);let o=e-s,a=n-r,l=r*te+s,c=gn[l],h=gn[l+1],d=gn[l+te],u=gn[l+te+1];return c+(h-c)*o+(d-c)*a+(c-h-d+u)*o*a}function _o(i,t){let e=Math.round((i-an)/me),n=Math.round((t-ln)/me);return e<0||n<0||e>=te||n>=Ue?-1:su[n*te+e]}var jh={[xe.GRASS]:Vs("grass"),[xe.FOREST]:Vs("grass"),[xe.ROCK]:Vs("rock"),[xe.ROAD]:Vs("dirt"),[xe.LOOSE]:Vs("loose")},lg=Vs("wood"),ve={road:et,boulders:Xs,logs:rl,trees:au,grid:{x0:an,z0:ln,nx:te,nz:Ue,cell:me,heights:gn,kinds:mi},natural:ru,roadSurface:vo,height(i,t){let e=vr(i,t,_o(i,t)),n=e?vo(e.i,e.lateral):Xf(i,t);for(let s of Gf(i,t)){let r=Wf(s,i,t);r>n&&(n=r)}for(let s of Vf(i,t)){let r=Hf(s,i,t);r>n&&(n=r)}return n},surface(i,t){let e=Xf(i,t);for(let r of Vf(i,t))if(Hf(r,i,t)>e)return lg;for(let r of Gf(i,t))if(Wf(r,i,t)>e)return jh[xe.ROCK];let n=Math.round((i-an)/me),s=Math.round((t-ln)/me);return n<0||s<0||n>=te||s>=Ue?jh[xe.GRASS]:jh[mi[s*te+n]]},treesNear:ag,onRoad(i,t){let e=vr(i,t,_o(i,t));return e&&{along:e.i*Ce,lateral:e.lateral}},roadAt(i){let t=Math.max(0,Math.min(et.count-1,Math.round(i/Ce)));return{x:et.x[t],z:et.z[t],e:et.e[t],heading:Math.atan2(-et.hx[t],-et.hz[t])}},stops:[{name:"Bottom",along:6},...et.hairpins.map((i,t)=>({name:`Hairpin ${t+1}`,along:Math.max(6,i.at*Ce-22),tight:i.tight})),{name:"Top",along:et.length-12}]};var cu=.0254,Cn={width:.205,rimRadius:7.5*cu,flangeRadius:7.5*cu+.016,radius:7.5*cu+.205*.78,tireMass:13,rimMass:9,grip:.85},Bn=Cn.radius,hl=Cn.rimRadius,Ie={name:"Naseeb's jeep",wheelbase:2.285,frontTrack:1.405,rearTrack:1.4,maxSteer:29*Math.PI/180,steerRate:{slow:.3,fast:.55,after:.3,ramp:1.2,centre:.6,centreAt:5},throttleRamp:{start:.25,after:.3,ramp:1.5,release:.7},steeringRatio:20,rightHandDrive:!0,dragArea:.65*2.6},xi=Ie.wheelbase/2,sn={name:"3.9 L straight six",curve:[[600,215],[1e3,250],[1500,275],[2e3,283],[2500,280],[3e3,268],[3600,247],[4e3,225]],idle:650,governor:4e3,biteFrom:1200,biteFull:2200,throttleFlow:4500,engageRpm:900,flywheel:.3,efficiency:.85},Ys=[{name:"1",label:"Low 1st",ratio:2.76*2.31},{name:"2",label:"Low 2nd",ratio:1.7*2.31},{name:"3",label:"High 1st",ratio:2.76},{name:"4",label:"Low 3rd",ratio:2.31},{name:"5",label:"High 2nd",ratio:1.7},{name:"6",label:"High 3rd",ratio:1}],cg={name:"R",label:"Reverse",ratio:-3.67},hu=4.11,Ni=[3,5,6],hg=3400,ug=1300,dg=.3,fg=420,jf={front:1400,rear:1e3},Mo=[{name:"frame rail",mass:42,at:[-.42,.12,-.12],size:[.06,.15,3.42]},{name:"frame rail",mass:42,at:[.42,.12,-.12],size:[.06,.15,3.42]},...[-1.7,-1.1,-.2,.6,1.5].map(i=>({name:"cross member",mass:6,at:[0,.12,i],size:[.84,.08,.06]})),{name:"front bumper",mass:15,at:[0,.12,-1.79],size:[1.6,.15,.1]},{name:"rear cross member",mass:10,at:[0,.12,1.66],size:[1.2,.12,.08]},{name:"engine",mass:260,at:[0,.3,-.75],size:[.5,.65,.95]},{name:"gearbox and transfer case",mass:95,at:[0,.12,0],size:[.35,.35,.65]},{name:"radiator",mass:28,at:[0,.45,-1.4],size:[.7,.6,.1]},{name:"fuel tank",mass:50,at:[.3,.25,.25],size:[.5,.25,.6]},{name:"battery",mass:20,at:[-.45,.45,-1.2],size:[.25,.22,.17]},{name:"exhaust, steering and the rest",mass:40,at:[0,.25,-.2],size:[.8,.3,2]},...[-1,1].flatMap(i=>[-1,1].map(t=>({name:"leaf spring",mass:7,at:[t*.42,.06,i*xi],size:[.07,.04,1.15]}))),...[-1,1].flatMap(i=>[-1,1].map(t=>({name:"leaf spring",mass:7,at:[t*.42,.03,i*xi],size:[.07,.04,1.15],axle:i<0?"front":"rear"}))),{name:"body tub",mass:145,at:[0,.5,1.05],size:[1.6,.6,1.9]},{name:"front clip",mass:95,at:[0,.62,-1.12],size:[1.66,.6,1.14]},{name:"cowl, dash and windscreen",mass:55,at:[0,.85,-.5],size:[1.5,.8,.3]},{name:"doors",mass:50,at:[0,.55,-.1],size:[1.66,.6,.85]},{name:"hardtop",mass:60,at:[0,1.4,.75],size:[1.6,.6,2.5]},{name:"seats",mass:35,at:[0,.45,.05],size:[1.2,.5,.5]},{name:"spare wheel",mass:27,at:[0,.65,2.05],size:[.2,.7,.7]},{name:"rear bumperettes",mass:10,at:[0,.12,1.96],size:[1.5,.1,.1]},{name:"front axle",mass:125,at:[0,0,-xi],size:[Ie.frontTrack-.2,.1,.1],axle:"front"},{name:"rear axle",mass:105,at:[0,0,xi],size:[Ie.rearTrack-.2,.09,.09],axle:"rear"}],ns={front:{rate:4e4,seat:.42,shock:.5,damping:4200,bump:.08,droop:.11,rollCentre:.47,twist:15e3},rear:{rate:48e3,seat:.42,shock:.5,damping:3800,bump:.09,droop:.12,rollCentre:.5,twist:15e3},bumpShare:.45,reboundShare:1.55,stop:4e5,leafFriction:180,frictionSpeed:.005},Ui=[{name:"front left",side:-1,front:!0,at:[-Ie.frontTrack/2,0,-xi]},{name:"front right",side:1,front:!0,at:[Ie.frontTrack/2,0,-xi]},{name:"rear left",side:-1,front:!1,at:[-Ie.rearTrack/2,0,xi]},{name:"rear right",side:1,front:!1,at:[Ie.rearTrack/2,0,xi]}],pg=.55*(Bn-.015)**2+.45*(Bn*Bn+hl*hl)/2,mg=.65*(hl-.01)**2+.35*.5*(hl-.03)**2,bs={weight:Cn.tireMass+Cn.rimMass,pressure:1.8,drive:"4x4",lockers:"none",world:"earth"},al={earth:{name:"Earth",g:9.81,air:1.225},mars:{name:"Mars",g:3.71,air:.02},moon:{name:"Moon",g:1.62,air:0},jupiter:{name:"Jupiter",g:24.79,air:.16}};function gg(i){let t=sn.curve;if(i>sn.governor)return 0;if(i<=t[0][0])return t[0][1];for(let e=1;e<t.length;e++)if(i<=t[e][0]){let[n,s]=t[e-1],[r,o]=t[e];return s+(o-s)*(i-n)/(r-n)}return t[t.length-1][1]}var ip=i=>25+.012*i;function xg(i,t){let e=i>0?Math.min(1,i**1.3*sn.throttleFlow/Math.max(t,600)):0;return e*gg(t)-(1-e)*ip(t)}var ll=60/(2*Math.PI),uu=1/4e3,Qf=400,tp=.25,vg=.05,_g=8,yg=[...[-.75,0,.75].map(i=>[i,.05,-1.82]),...[-.7,.7].map(i=>[i,.07,1.98]),...[-1.4,-.5,.4,1.4].flatMap(i=>[-.42,.42].map(t=>[t,.045,i])),[0,-.06,.1],...[-.84,.84].flatMap(i=>[[i,.72,-1.68],[i,.86,.3],[i,.86,1.9],[i,1.6,-.55],[i,1.6,1.85]]),[0,.84,-1.7]],Mg=[[[-.82,.12,-1.84],[.82,.12,-1.84]],[[-.84,.6,-1.8],[-.84,.6,1.96]],[[.84,.6,-1.8],[.84,.6,1.96]],[[-.8,.5,1.98],[.8,.5,1.98]]],Sg=15e5,bg=3e4,wg=.4,Eg=.14,du=.1,Tg=2e6,Ag=3e4,Rg=.45,ep=15,cl=25,_r=(i,t)=>Math.sqrt(i*i+t*t),Cg=(i,t,e)=>Math.sqrt(i*i+t*t+e*e),Ss=i=>{let t=0;for(let e=0;e<i.length;e++)t+=i[e]*i[e];return Math.sqrt(t)},Kt=(i,t)=>[i[0]+t[0],i[1]+t[1],i[2]+t[2]],we=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],qt=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],Me=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],Pe=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],gi=i=>{let t=Cg(i[0],i[1],i[2]);return t>0?qt(i,1/t):[0,0,0]},ul=class{constructor(t=bs,e={}){this.options={rolling:!0,air:!0,...e},this.ground=this.options.ground||ve,this.time=0,this.wheels=Ui.map(n=>({...n,spin:0,angle:0,steer:0,contact:null})),this.modes=[],this.auto=!0,this.gear=Ni[0],this.shifting=0,this.controls={throttle:0,brake:0,steer:0},this.axles=[],this.shaftAngle=0,this.engineAngle=0,this.configure(t),this.reset(4,.1)}configure(t){let e=t.weight/bs.weight,n=al[t.world]||al.earth;this.settings={...t};let s=t.weight,r=e*(Cn.tireMass*pg+Cn.rimMass*mg),o=.5*r+s*Cn.width**2/12;this.wheelMass=s,this.wheelInertia=r;let a=Mo.filter(M=>!M.axle).map(M=>({mass:M.mass,at:M.at,own:np(M.mass,M.size)}));this.sprungMass=a.reduce((M,x)=>M+x.mass,0),this.centre=qt(a.reduce((M,x)=>Kt(M,qt(x.at,x.mass)),[0,0,0]),1/this.sprungMass),this.inertia=[0,0,0];for(let M of a){let[x,y,_]=we(M.at,this.centre);this.inertia[0]+=M.mass*(y*y+_*_)+M.own[0],this.inertia[1]+=M.mass*(x*x+_*_)+M.own[1],this.inertia[2]+=M.mass*(x*x+y*y)+M.own[2]}let l=this.axles,[c,h,d,u]=this.wheels;this.axles=["front","rear"].map((M,x)=>{let y=x?[d,u]:[c,h],_=ns[M],E=(x?1:-1)*xi,S=[...Mo.filter(L=>L.axle===M).map(L=>({mass:L.mass,at:L.at,own:np(L.mass,L.size)})),...y.map(L=>({mass:s,at:L.at,own:[0,o,o]}))],T=S.reduce((L,U)=>L+U.mass,0),A=0;for(let L of S){A+=L.mass*(L.at[0]**2+L.at[1]**2)+L.own[2];let[U,,N]=we(L.at,this.centre);this.inertia[1]+=L.mass*(U*U+N*N)+L.own[1]}let C=l[x]||{};return{name:M,wheels:y,track:Math.abs(y[1].at[0]-y[0].at[0]),mass:T,roll:A,attach:we([0,0,E],this.centre),..._,y:C.y??0,vy:C.vy??0,slope:C.slope??0,vslope:C.vslope??0,travel:[0,0],load:[0,0]}});for(let M of this.wheels)M.axle=this.axles[M.front?0:1],M.offset=M.at[0];let f=this.axles.reduce((M,x)=>M+x.mass,0);this.mass=this.sprungMass+f;let g=(xi-this.centre[2])/Ie.wheelbase,v=this.sprungMass*(al[t.world]||al.earth).g;this.axles[0].preload=v*g/2/this.axles[0].rate,this.axles[1].preload=v*(1-g)/2/this.axles[1].rate,this.raise=f/this.mass*this.centre[1],this.sprungShare=this.sprungMass/this.mass,this.bodyHeight=Bn+this.centre[1];let p=[...Mo.map(M=>({mass:M.mass,at:M.at})),...Ui.map(M=>({mass:s,at:M.at}))];this.totalCentre=qt(p.reduce((M,x)=>Kt(M,qt(x.at,x.mass)),[0,0,0]),1/this.mass);let m=this.wheels.map(M=>M.spin);this.fourByFour=t.drive!=="rear",Object.assign(this.axles[0],{locked:t.lockers==="both",driven:this.fourByFour,brake:jf.front}),Object.assign(this.axles[1],{locked:t.lockers!=="none",driven:!0,brake:jf.rear}),this.modes=[];let b=(M,x)=>{let y={name:x,base:M,inertia:M,spin:0};return this.modes.push(y),y};this.driveshaft=b(0,"driveshaft");for(let M of this.axles){let[x,y]=M.wheels;if(M.driven)if(this.driveshaft.base+=2*r,M.locked)x.links=y.links=[[this.driveshaft,1]];else{let _=b(2*r,`${M.name} differential`);x.links=[[this.driveshaft,1],[_,1]],y.links=[[this.driveshaft,1],[_,-1]]}else if(M.locked){let _=b(2*r,`${M.name} axle`);x.links=y.links=[[_,1]]}else for(let _ of M.wheels)_.links=[[b(r,_.name),1]]}for(let M of this.modes){let x=this.wheels.filter(y=>y.links.some(([_])=>_===M));M===this.driveshaft?M.spin=x.reduce((y,_)=>y+m[this.wheels.indexOf(_)],0)/x.length:M.name.endsWith("differential")?M.spin=(m[this.wheels.indexOf(x[0])]-m[this.wheels.indexOf(x[1])])/2:M.spin=x.reduce((y,_)=>y+m[this.wheels.indexOf(_)],0)/x.length}this.refreshSpins(),this.allSpinInertia=4*r,this.pressureBar=t.pressure,this.kTire=6e4+1e3*t.pressure*100,this.g=n.g,this.air=this.options.air?n.air:0}reset(t,e=0){this.place(0,-t,0,e)}place(t,e,n=0,s=0){let r=this.mass*this.g/4/this.kTire,o=Math.cos(n),a=Math.sin(n),l=(V,I)=>[t+V*o+I*a,e-V*a+I*o],c=(V,I=0)=>l(V.at[0]-this.centre[0],V.at[2]-this.centre[2]-I),h=Ui.map(V=>this.ground.height(...c(V))),[d,u,f,g]=h,v=(d+u-f-g)/2/Ie.wheelbase,p=0;Ui.forEach((V,I)=>{for(let ot of[-.3,-.15,.15,.3])p=Math.max(p,this.ground.height(...c(V,ot))-(h[I]+ot*v))}),s+=p;let m=Math.atan(v),b=Math.atan(((u+g)/2-(d+f)/2)/Ie.frontTrack),M=V=>[Math.cos(V/2),Math.sin(V/2)],[x,y]=M(m),[_,E]=M(b),[S,T]=M(n),[A,C,L,U]=[x*_,y*_,-y*E,x*E];this.q=[S*A-T*L,S*C+T*U,S*L+T*A,S*U-T*C],this.v=[0,0,0],this.L=[0,0,0],this.p=[t,0,e],this.update();let N=this.toWorld(this.centre),F=l(-this.centre[0],-this.centre[2]),H=t-N[0]-F[0],G=e-N[2]-F[1],z=(d+u+f+g)/4+Math.tan(m)*(-H*a-G*o)+Math.tan(b)*(H*o-G*a)+(Bn-r)/Math.cos(m)/Math.cos(b)+s;this.p=[t,z+N[1],e],this.update();for(let V of this.axles)V.y=this.p[1]+this.toWorld(V.attach)[1],V.slope=Math.tan(b),V.vy=V.vslope=0;for(let V of this.modes)V.spin=0;for(let V of this.wheels)V.steer=0;this.refreshSpins(),this.steer=0,this.steerHeld=0,this.steerWay=0,this.auto&&(this.gear=Ni[0]),this.pedal=0,this.throttleHeld=0,this.shifting=0,this.rpm=sn.idle,this.clutch="open",this.acc=0,this.moved=0,this.engineTorque=0,this.wheelTorque=0,this.drag=0,this.update();for(let V of this.wheels)V.contact=this.contactOf(V)}shift(t){if(t==="auto"){this.auto=!0,Ni.includes(this.gear)||this.setGear(Ni[0]);return}this.auto=!1,this.setGear(t)}autoReverse(t){this.auto=!0,this.setGear(t?-1:Ni[0])}setGear(t){t!==this.gear&&(this.gear=t,this.shifting=dg)}get gearRatio(){return this.gear===-1?cg.ratio*hu:this.gear===0?0:Ys[this.gear-1].ratio*hu}get gearName(){return this.gear===-1?"R":this.gear===0?"N":Ys[this.gear-1].name}advance(t,e){e&&(this.controls=e),this.acc+=t;let n=0;for(;this.acc>=uu&&n<Qf;)this.step(uu),this.acc-=uu,n++;n===Qf&&(this.acc=0)}update(){let[t,e,n,s]=this.q;this.ax=[1-2*(n*n+s*s),2*(e*n+t*s),2*(e*s-t*n)],this.ay=[2*(e*n-t*s),1-2*(e*e+s*s),2*(n*s+t*e)],this.az=[2*(e*s+t*n),2*(n*s-t*e),1-2*(e*e+n*n)],this.w=this.inverseInertia(this.L)}get bodySlope(){return Math.max(-2,Math.min(2,this.ax[1]/_r(this.ax[0],this.ax[2])))}get overturned(){return this.ay[1]<.34}toWorld(t){return[this.ax[0]*t[0]+this.ay[0]*t[1]+this.az[0]*t[2],this.ax[1]*t[0]+this.ay[1]*t[1]+this.az[1]*t[2],this.ax[2]*t[0]+this.ay[2]*t[1]+this.az[2]*t[2]]}inverseInertia(t){return this.toWorld([Me(this.ax,t)/this.inertia[0],Me(this.ay,t)/this.inertia[1],Me(this.az,t)/this.inertia[2]])}refreshSpins(){for(let t of this.wheels)t.spin=t.links.reduce((e,[n,s])=>e+s*n.spin,0),t.give=t.links.reduce((e,[n])=>e+1/n.inertia,0)}turnWheel(t,e){for(let[n,s]of t.links)n.spin+=s*e/n.inertia}spinAll(t){for(let e of this.modes)e.spin=e.name.endsWith("differential")?0:t;this.refreshSpins()}carrier(t){return(t.wheels[0].spin+t.wheels[1].spin)/2}get spin(){return this.driveshaft.spin}get forward(){return gi([-this.az[0],0,-this.az[2]])}get heading(){let t=this.forward;return Math.atan2(-t[0],-t[2])}get forwardSpeed(){return Me(this.v,this.forward)}get along(){return-this.p[2]}axleFrame(t){let e=Kt(this.p,this.toWorld(t.attach)),n=gi([this.ax[0],0,this.ax[2]]),s=gi(Kt(n,[0,t.slope,0])),r=gi(Pe(s,this.forward));return{at:e,middle:[e[0],t.y,e[2]],beam:s,up:r}}touch(t,e){let n=this.ground,s=Bn*.95,r=20,o=2*s/r,a=f=>{let g=t[0]+e[0]*f,v=t[2]+e[2]*f,p=n.height(g,v),m=t[1]-p;return{s:f,x:g,z:v,h:p,up:m,d2:f*f+m*m}},l=[],c=0;for(let f=0;f<=r;f++)l.push(a(-s+f*o)),l[f].d2<l[c].d2&&(c=f);let h=l[c];if(c>0&&c<r){let[f,g,v]=[l[c-1].d2,h.d2,l[c+1].d2],p=f-2*g+v;if(p>1e-12){let m=a(h.s+.5*o*(f-v)/p);m.d2<h.d2&&(h=m)}}let d=[h.x,h.h,h.z];if(h.up<.02)return{ground:d,distance:h.up,normal:[0,1,0]};let u=Math.sqrt(h.d2);return{ground:d,distance:u,normal:[-e[0]*h.s/u,h.up/u,-e[2]*h.s/u]}}contactOf(t){let e=t.steer,n=this.axleFrame(t.axle),s=Kt(qt(n.beam,Math.cos(e)),qt(Pe(n.up,n.beam),Math.sin(e))),r=qt(s,-1),o=Kt(n.middle,qt(n.beam,t.offset)),a=gi([s[2],0,-s[0]]),l=gi([s[0],0,s[2]]),{ground:c,distance:h,normal:d}=this.touch(o,a),u=this.ground,f=Cn.width/2,g=u.height(c[0]+l[0]*f,c[2]+l[2]*f)-u.height(c[0]-l[0]*f,c[2]-l[2]*f),v=Math.max(-1.5,Math.min(1.5,g/(2*f))),p=gi(we(d,qt(l,v*d[1]))),m=(Bn-h)*Me(p,d),b=u.surface(c[0],c[2]),M=b.give===1/0?this.kTire:1/(1/this.kTire+1/b.give),x=2*b.damping*Math.sqrt(M*this.mass/4),y=Kt(this.v,Pe(this.w,we(o,this.p)));y[1]=t.axle.vy+t.axle.vslope*t.offset;let _=m>0?Math.max(0,M*m-x*Me(y,p)):0,E=_/this.kTire,S=Bn-E/3,T=we(o,qt(p,S)),A=Me(we(o,T),this.ay),C=Kt(we(T,this.p),qt(this.ay,this.raise)),L=this.sprungShare*t.axle.rollCentre+(1-this.sprungShare)*this.bodyHeight,U=Kt(we(T,this.p),qt(this.ay,L-Bn+A)),N=gi([this.ax[0],0,this.ax[2]]),F=we(T,o),H=gi(we(a,qt(p,Me(a,p)))),G={wheel:t,surface:b,axle:s,turn:r,n:p,forward:H,side:gi(Pe(H,p)),centre:o,point:T,ground:c,press:m,across:Me(we(c,n.middle),n.beam),r:C,rAcross:U,rHub:Kt(we(o,this.p),qt(this.ay,this.raise)),rAcrossHub:Kt(we(o,this.p),qt(this.ay,L-Bn)),lever:this.sprungShare*(t.axle.rollCentre-Bn+A)+(1-this.sprungShare)*A,leverHub:this.sprungShare*(t.axle.rollCentre-Bn),lateral:N,rho:F,normal:_,squash:E,sink:b.give===1/0?0:_/b.give,rollingRadius:S,friction:[0,0,0],impulse:[0,0,0],limit:0,slip:0,sideSlip:0,slipSpeed:0,tread:[0,0,0],crr:0,rollingMoment:0,soilDrag:0};return G.tread=this.treadVelocity(G,t.spin),G}treadVelocity(t,e){let n=Pe(this.w,t.r),s=Pe(this.w,t.rAcross),r=Kt(n,qt(t.lateral,Me(s,t.lateral)-Me(n,t.lateral))),o=qt(Pe(t.turn,t.rho),e),a=Kt(Kt(this.v,r),o),l=t.wheel.axle;return a[1]=l.vy+l.vslope*t.across+o[1],a}moment(t,e){let n=[e[0],0,e[2]],s=qt(t.lateral,Me(n,t.lateral)),r=we(n,s),o=Me(Pe(t.rho,n),t.turn);return we(Kt(Pe(t.r,r),Pe(t.rAcross,s)),qt(t.turn,o))}push(t,e){let n=Me(Pe(t.rho,e),t.turn);this.v=Kt(this.v,qt([e[0],0,e[2]],1/this.mass)),this.L=Kt(this.L,this.moment(t,e));let s=t.wheel.axle;s.vslope+=(t.lever*Me(e,t.lateral)+e[1]*t.across)/s.roll,s.vy+=e[1]/s.mass,this.turnWheel(t.wheel,n),this.refreshSpins()}shove(t,e){let n=qt(t.lateral,Me(e,t.lateral)),s=we(e,n);this.v=Kt(this.v,qt(e,1/this.mass)),this.L=Kt(this.L,Kt(Pe(t.rHub,s),Pe(t.rAcrossHub,n)));let r=t.wheel.axle;r.vslope+=t.leverHub*Me(e,t.lateral)/r.roll}inverseMassAt(t,e){let n=Me(Pe(t.rho,e),t.turn),s=this.inverseInertia(this.moment(t,e)),r=[e[0],0,e[2]],o=qt(t.lateral,Me(r,t.lateral)),a=we(r,o),l=t.wheel.axle,c=e[1]*e[1]*(1/l.mass+t.across*t.across/l.roll);return Me(r,r)/this.mass+Me(a,Pe(s,t.r))+Me(o,Pe(s,t.rAcross))+c+n*n*t.wheel.give}inverseMassAtHub(t,e){return 1/this.mass+Me(e,Pe(this.inverseInertia(Pe(t,e)),t))}scrape(t){let e=this.ground,n=.03,s=(o,a)=>{let l=e.height(o[0],o[2])-o[1];if(l<=0)return null;let c=(e.height(o[0]+n,o[2])-e.height(o[0]-n,o[2]))/(2*n),h=(e.height(o[0],o[2]+n)-e.height(o[0],o[2]-n))/(2*n),d=gi([-c,1,-h]),u=Math.max(0,Tg*l*d[1]-Ag*Me(a,d)),f=we(a,qt(d,Me(a,d))),g=Ss(f);return Kt(qt(d,u),qt(f,-Rg*u/Math.max(g,.1)))};for(let o of yg){let a=this.toWorld(we(o,this.centre)),l=s(Kt(this.p,a),Kt(this.v,Pe(this.w,a)));if(!l)continue;let c=qt(l,t);this.v=Kt(this.v,[c[0]/this.mass,c[1]/this.sprungMass,c[2]/this.mass]),this.L=Kt(this.L,Pe(a,c))}let r=e.treesNear?e.treesNear(this.p[0],this.p[2]):[];if(r.length){let o=Mg.map(([a,l])=>[this.toWorld(we(a,this.centre)),this.toWorld(we(l,this.centre))]);for(let a of r)if(!(_r(a.x-this.p[0],a.z-this.p[2])>2.6+a.r))for(let[l,c]of o){let h=this.p[0]+l[0],d=this.p[2]+l[2],u=c[0]-l[0],f=c[2]-l[2],g=Math.max(0,Math.min(1,((a.x-h)*u+(a.z-d)*f)/(u*u+f*f))),v=Kt(l,qt(we(c,l),g)),p=this.p[0]+v[0]-a.x,m=this.p[2]+v[2]-a.z,b=_r(p,m),M=this.p[1]+v[1];if(b>=a.r||b<1e-6||M<a.base-.3||M>a.base+a.height)continue;let x=[p/b,0,m/b],y=Kt(this.v,Pe(this.w,v)),_=Math.max(0,Sg*(a.r-b)-bg*Me(y,x)),E=we(y,qt(x,Me(y,x))),S=qt(Kt(qt(x,_),qt(E,-wg*_/Math.max(Ss(E),.1))),t);this.v=Kt(this.v,[S[0]/this.mass,S[1]/this.sprungMass,S[2]/this.mass]),this.L=Kt(this.L,Pe(v,S))}}for(let o of this.axles){let a=this.axleFrame(o),l=we(Kt(a.middle,qt(a.beam,du)),qt(a.up,Eg)),c=we(l,this.p),h=Kt(this.v,Pe(this.w,c));h[1]=o.vy+o.vslope*du;let d=s(l,h);if(!d)continue;let u=qt(d,t);this.v=Kt(this.v,[u[0]/this.mass,0,u[2]/this.mass]),this.L=Kt(this.L,Pe(Kt(c,qt(this.ay,this.raise)),[u[0],0,u[2]])),o.vy+=u[1]/o.mass,o.vslope+=u[1]*du/o.roll}this.w=this.inverseInertia(this.L)}drivetrain(t){let e=Math.max(0,Math.min(1,this.controls.throttle)),n=Ie.throttleRamp;if(e>0){this.throttleHeld+=t;let g=n.start+(1-n.start)*Math.min(1,Math.max(0,(this.throttleHeld-n.after)/n.ramp));this.pedal=Math.min(e,Math.max(this.pedal,g))}else this.throttleHeld=0,this.pedal=Math.max(0,this.pedal-t/n.release);let s=this.pedal,r=this.driveshaft.spin,o=this.gearRatio;if(this.shifting>0&&(this.shifting=Math.max(0,this.shifting-t)),this.auto&&this.gear>=1&&this.shifting===0){let g=r*o*ll,v=Ni.indexOf(this.gear);v<0?this.setGear(Ni[0]):s>0&&g>hg&&v<Ni.length-1?this.setGear(Ni[v+1]):g<ug&&v>0&&this.setGear(Ni[v-1])}let a=this.rpm,l=xg(s,a);a<sn.idle+150&&(l=Math.max(l,ip(a)+(sn.idle+150-a)*.4));let c=0,h=0,d=r*o*ll,u=g=>this.rpm=Math.max(0,this.rpm+g/sn.flywheel*t*ll);if(o===0)this.clutch="open",u(l);else if(this.shifting>0)this.clutch="open",this.rpm+=(Math.max(sn.idle,d)-this.rpm)*Math.min(1,t*12);else if(this.clutch==="in"&&d>=sn.engageRpm)this.rpm=d,h=l,c=sn.flywheel*o*o;else{let g=Math.min(1,Math.max(0,(a-sn.biteFrom)/(sn.biteFull-sn.biteFrom)))**2,v=s>0?fg*g:0,p=a-Math.max(0,d);v>0&&Math.abs(p)<25&&d>=sn.engageRpm?(this.clutch="in",this.rpm=d,h=l,c=sn.flywheel*o*o):(this.clutch=v>0?"slipping":"open",h=Math.sign(p)*v,u(l-h))}this.engineTorque=l;let f=h*o*(h>0?sn.efficiency:1/sn.efficiency);return this.wheelTorque=f,this.driveshaft.inertia=this.driveshaft.base+c,this.refreshSpins(),f}step(t){let e=this.mass,{brake:n,steer:s}=this.controls,r=Math.max(-1,Math.min(1,s))*Ie.maxSteer,o=Math.sign(s);this.steerHeld=o!==0&&o===this.steerWay?this.steerHeld+t:0,this.steerWay=o;let a=Ie.steerRate,l=Math.min(1,Math.max(0,(this.steerHeld-a.after)/a.ramp)),c=Math.min(1,Math.abs(this.forwardSpeed)/a.centreAt),d=(o===0?a.centre*c:a.slow+(a.fast-a.slow)*l)*t;this.steer+=Math.max(-d,Math.min(d,r-this.steer));let[u,f]=this.wheels;if(Math.abs(this.steer)<1e-9)u.steer=f.steer=0;else{let I=Ie.wheelbase/Math.tan(this.steer);u.steer=Math.atan(Ie.wheelbase/(I-Ie.frontTrack/2)),f.steer=Math.atan(Ie.wheelbase/(I+Ie.frontTrack/2))}let g=this.wheels.map(I=>I.contact=this.contactOf(I)),v=Ss(this.v),p=.5*this.air*Ie.dragArea*v;this.drag=p*v;let m=[-p*this.v[0],-this.sprungMass*this.g-p*this.v[1],-p*this.v[2]],b=[0,0,0];for(let I of this.axles){let ot=this.axleFrame(I),ct=-I.mass*this.g,gt=0;for(let[B,X]of[[0,-1],[1,1]]){let st=(xt,Bt)=>{let j=Kt(ot.at,qt(this.ax,xt)),lt=Me(Kt(this.v,Pe(this.w,we(j,this.p))),[0,1,0]),dt=I.y+I.slope*xt-j[1],ft=I.vy+I.vslope*xt-lt;return{x:xt,onBody:j,squash:dt,rate:ft,f:Bt(dt,ft)}},pt=st(X*I.seat,(xt,Bt)=>{let j=I.rate*(I.preload+xt)+ns.leafFriction*Math.tanh(Bt/ns.frictionSpeed);return xt>I.bump&&(j+=ns.stop*(xt-I.bump)),xt<-I.droop&&(j-=ns.stop*(-I.droop-xt)),j}),ht=st(X*I.shock,(xt,Bt)=>I.damping*Bt*(Bt>0?ns.bumpShare:ns.reboundShare));for(let{x:xt,onBody:Bt,f:j}of[pt,ht])m=Kt(m,[0,j,0]),b=Kt(b,Pe(we(Bt,this.p),[0,j,0])),ct-=j,gt-=j*xt;I.travel[B]=pt.squash,I.load[B]=pt.f}let It=this.bodySlope,Y=I.twist*(I.slope-It);gt-=Y,b=Kt(b,qt(this.az,Y*(1+It*It)));for(let B of I.wheels){let X=B.contact;ct+=X.normal*X.n[1],gt+=X.normal*X.n[1]*X.across,X.normal>0&&(X.n[0]||X.n[2])&&this.shove(X,[X.normal*X.n[0]*t,0,X.normal*X.n[2]*t])}I.vy+=ct/I.mass*t,I.vslope+=gt/I.roll*t}this.scrape(t);let M=this.drivetrain(t);this.driveshaft.spin+=M*t/this.driveshaft.inertia,b=Kt(b,qt(this.ax,M));for(let I of this.wheels)this.turnWheel(I,-.5*this.air*vg*Bn**5*I.spin*Math.abs(I.spin)*t);this.refreshSpins(),this.v=Kt(this.v,[m[0]/e*t,m[1]/this.sprungMass*t,m[2]/e*t]),this.L=Kt(this.L,qt(b,t)),this.w=this.inverseInertia(this.L);let x=g.filter(I=>I.normal>0);for(let I of x){let ot=this.treadVelocity(I,I.wheel.spin),ct=Kt(this.v,Pe(this.w,we(I.centre,this.p)));ct[1]=I.wheel.axle.vy+I.wheel.axle.vslope*I.across;let gt=Me(ot,I.forward),It=Me(ot,I.side),Y=Me(ct,I.forward),B=Y-gt,X=Math.max(Math.abs(Y),Math.abs(B),tp);I.slip=-gt/X,I.sideSlip=It/X,I.slipSpeed=-gt,I.tread=ot;let st=_r(gt,It)/X,pt=X===tp&&st<I.surface.slipAtPeak;I.limit=(pt?I.surface.peak:I.surface.grip(st))*Cn.grip*I.normal*t}let y=Math.abs(this.forwardSpeed)*3.6;for(let I of g)I.crr=this.options.rolling?I.surface.hysteresis*(.005+(.01+.0095*(y/100)**2)/this.pressureBar):0,I.rollingMoment=I.crr*I.normal*I.rollingRadius;let E=this.wheels.map(I=>{let ot=this.axles.find(gt=>gt.wheels.includes(I)),ct=n*ot.brake;return{wheel:I,brakes:ct,limit:(ct+I.contact.rollingMoment)*t,impulse:0}}).filter(I=>I.limit>0),S=1/Math.max(1,x.length+E.length);for(let I of x){let ot=I.wheel.lastGrip;if(!ot)continue;let ct=we(ot,qt(I.n,Me(ot,I.n))),gt=Ss(ct);gt>I.limit&&(ct=qt(ct,I.limit/gt)),I.impulse=ct,this.push(I,ct)}for(let I of E)I.impulse=Math.max(-I.limit,Math.min(I.limit,I.wheel.lastBrake||0)),this.turnWheel(I.wheel,I.impulse);this.refreshSpins(),this.w=this.inverseInertia(this.L);for(let I=0;I<_g;I++){let ot=x.map(gt=>{let It=this.treadVelocity(gt,gt.wheel.spin),Y=we(It,qt(gt.n,Me(It,gt.n))),B=Ss(Y),X=gt.impulse;if(B>1e-12){let pt=qt(Y,-1/B);X=Kt(gt.impulse,qt(pt,S*B/this.inverseMassAt(gt,pt)))}let st=Ss(X);return st>gt.limit&&(X=qt(X,gt.limit/st)),we(X,gt.impulse)}),ct=E.map(gt=>Math.max(-gt.limit,Math.min(gt.limit,gt.impulse-S*gt.wheel.spin/gt.wheel.give))-gt.impulse);x.forEach((gt,It)=>{gt.impulse=Kt(gt.impulse,ot[It]),this.push(gt,ot[It])}),E.forEach((gt,It)=>{gt.impulse+=ct[It],this.turnWheel(gt.wheel,ct[It])}),this.refreshSpins(),this.w=this.inverseInertia(this.L)}for(let I of x)I.friction=qt(I.impulse,1/t);for(let I of this.wheels)I.lastGrip=I.contact.normal>0?I.contact.impulse:null,I.lastBrake=E.find(ot=>ot.wheel===I)?.impulse||0;let T=E.reduce((I,ot)=>I+ot.impulse*ot.brakes/(ot.limit/t||1),0);T&&(this.L=Kt(this.L,qt(this.ax,T))),this.w=this.inverseInertia(this.L);for(let I of g){if(!this.options.rolling||I.sink<=0)continue;let ot=Math.sqrt(I.sink/(2*Bn));I.crr+=ot,I.soilDrag=ot*I.normal;let ct=we(I.centre,this.p),gt=Kt(this.v,Pe(this.w,ct)),It=_r(gt[0],gt[2]);if(It<1e-9)continue;let Y=[-gt[0]/It,0,-gt[2]/It],B=qt(Y,Math.min(I.soilDrag*t,It/this.inverseMassAtHub(ct,Y)));this.v=Kt(this.v,qt(B,1/e)),this.L=Kt(this.L,Pe(ct,B)),this.w=this.inverseInertia(this.L)}this.p=Kt(this.p,qt(this.v,t));let[A,C,L,U]=this.q,[N,F,H]=this.w,G=t/2,K=[A+G*(-N*C-F*L-H*U),C+G*(N*A+F*U-H*L),L+G*(F*A+H*C-N*U),U+G*(H*A+N*L-F*C)],z=Ss(K);this.q=K.map(I=>I/z),this.update();for(let I of this.axles)I.y+=I.vy*t,I.slope+=I.vslope*t;for(let I of this.wheels)I.angle+=I.spin*t;this.shaftAngle+=this.driveshaft.spin*hu*t,this.engineAngle+=this.rpm/ll*t,this.time+=t,this.moved+=_r(this.v[0],this.v[2])*t;let V=Ss(this.w);V>ep&&(this.L=qt(this.L,ep/V),this.w=this.inverseInertia(this.L));for(let I of this.axles)I.vy=Math.max(-cl,Math.min(cl,I.vy)),I.vslope=Math.max(-cl,Math.min(cl,I.vslope))}get rearShare(){return(this.totalCentre[2]+xi)/Ie.wheelbase}get steeringWheel(){return this.steer*Ie.steeringRatio}energy(){let t=this.modes.reduce((n,s)=>n+.5*s.inertia*s.spin*s.spin,0),e=.5*this.mass*(this.v[0]**2+this.v[2]**2)+.5*this.sprungMass*this.v[1]**2;e+=.5*Me(this.w,this.L)+t+this.sprungMass*this.g*this.p[1];for(let n of this.axles){e+=.5*n.mass*n.vy**2+.5*n.roll*n.vslope**2+n.mass*this.g*n.y;let s=this.axleFrame(n);e+=.5*n.twist*(n.slope-this.bodySlope)**2;for(let r of[-1,1]){let o=r*n.seat,a=n.y+n.slope*o-Kt(s.at,qt(this.ax,o))[1];e+=.5*n.rate*(n.preload+a)**2,a>n.bump&&(e+=.5*ns.stop*(a-n.bump)**2),a<-n.droop&&(e+=.5*ns.stop*(-n.droop-a)**2)}for(let r of n.wheels){let o=this.contactOf(r),a=o.surface.give===1/0?this.kTire:1/(1/this.kTire+1/o.surface.give);o.press>0&&(e+=.5*a*o.press*o.press)}}return e}};function np(i,[t,e,n]){return[i*(e*e+n*n)/12,i*(t*t+n*n)/12,i*(t*t+e*e)/12]}var Up=0,Ju=1,Fp=2;var aa=1,Mc=2,Xr=3,Fs=0,vn=1,$e=2,Qe=0,qr=1,la=2,Ku=3,ju=4,Sc=5;var li=100,Op=101,Bp=102,zp=103,kp=104,or=200,Hp=201,Gp=202,Vp=203,Qu=204,td=205,ca=206,Wp=207,ha=208,Xp=209,qp=210,Yp=211,Zp=212,$p=213,Jp=214,Bl=0,zl=1,kl=2,cs=3,Hl=4,Gl=5,Vl=6,Wl=7,bc=0,Kp=1,jp=2,Ti=0,ua=1,da=2,fa=3,pa=4,ar=5,ma=6,ga=7;var ed=300,Os=301,lr=302,wc=303,Ec=304,xa=306,Jn=1e3,Oi=1001,Xl=1002,je=1003,Qp=1004;var va=1005;var Ze=1006,Tc=1007;var ci=1008;var wn=1009,nd=1010,id=1011,Yr=1012,Ac=1013,Ai=1014,hi=1015,Xe=1016,Rc=1017,Cc=1018,Bs=1020,sd=35902,rd=35899,od=1021,ad=1022,Gn=1023,Bi=1026,Vi=1027,Wi=1028,Pc=1029,zs=1030,Ic=1031;var Dc=1033,_a=33776,ya=33777,Ma=33778,Sa=33779,Lc=35840,Nc=35841,Uc=35842,Fc=35843,Oc=36196,Bc=37492,zc=37496,kc=37488,Hc=37489,ba=37490,Gc=37491,Vc=37808,Wc=37809,Xc=37810,qc=37811,Yc=37812,Zc=37813,$c=37814,Jc=37815,Kc=37816,jc=37817,Qc=37818,th=37819,eh=37820,nh=37821,ih=36492,sh=36494,rh=36495,oh=36283,ah=36284,wa=36285,lh=36286;var Do=2300,ql=2301,Fl=2302,zu=2303,ku=2400,Hu=2401,Gu=2402;var tm=3200;var Zr=0,em=1,Ri="",Ke="srgb",Lo="srgb-linear",No="linear",Te="srgb";var Ol=7680;var nm=519,im=512,sm=513,rm=514,ch=515,om=516,am=517,hh=518,lm=519,cm=35044,cr=35048;var ld="300 es",Si=2e3,Ur=2001;function Pg(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ig(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Uo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function hm(){let i=Uo("canvas");return i.style.display="block",i}var sp={},Fr=null;function cd(...i){let t="THREE."+i.shift();Fr?Fr("log",t,...i):console.log(t,...i)}function um(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Qt(...i){i=um(i);let t="THREE."+i.shift();if(Fr)Fr("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function ee(...i){i=um(i);let t="THREE."+i.shift();if(Fr)Fr("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Qs(...i){let t=i.join(" ");t in sp||(sp[t]=!0,Qt(...i))}function dm(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var fm={[Bl]:zl,[kl]:Vl,[Hl]:Wl,[cs]:Gl,[zl]:Bl,[Vl]:kl,[Wl]:Hl,[Gl]:cs},zi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var fu=Math.PI/180,Yl=180/Math.PI;function $r(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]+"-"+Mn[t&255]+Mn[t>>8&255]+"-"+Mn[t>>16&15|64]+Mn[t>>24&255]+"-"+Mn[e&63|128]+Mn[e>>8&255]+"-"+Mn[e>>16&255]+Mn[e>>24&255]+Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]).toLowerCase()}function ue(i,t,e){return Math.max(t,Math.min(e,i))}function Dg(i,t){return(i%t+t)%t}function pu(i,t,e){return(1-e)*i+e*t}function So(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function zn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var md=class md{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ue(this.x,t.x,e.x),this.y=ue(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ue(this.x,t,e),this.y=ue(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ue(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};md.prototype.isVector2=!0;var it=md,cn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(d!==v||l!==u||c!==f||h!==g){let p=l*u+c*f+h*g+d*v;p<0&&(u=-u,f=-f,g=-g,v=-v,p=-p);let m=1-a;if(p<.9995){let b=Math.acos(p),M=Math.sin(b);m=Math.sin(m*b)/M,a=Math.sin(a*b)/M,l=l*m+u*a,c=c*m+f*a,h=h*m+g*a,d=d*m+v*a}else{l=l*m+u*a,c=c*m+f*a,h=h*m+g*a,d=d*m+v*a;let b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-a*f,t[e+2]=c*g+h*f+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:Qt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ue(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},gd=class gd{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rp.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rp.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ue(this.x,t.x,e.x),this.y=ue(this.y,t.y,e.y),this.z=ue(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ue(this.x,t,e),this.y=ue(this.y,t,e),this.z=ue(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ue(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return mu.copy(this).projectOnVector(t),this.sub(mu)}reflect(t){return this.sub(mu.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};gd.prototype.isVector3=!0;var P=gd,mu=new P,rp=new cn,xd=class xd{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],v=s[0],p=s[3],m=s[6],b=s[1],M=s[4],x=s[7],y=s[2],_=s[5],E=s[8];return r[0]=o*v+a*b+l*y,r[3]=o*p+a*M+l*_,r[6]=o*m+a*x+l*E,r[1]=c*v+h*b+d*y,r[4]=c*p+h*M+d*_,r[7]=c*m+h*x+d*E,r[2]=u*v+f*b+g*y,r[5]=u*p+f*M+g*_,r[8]=u*m+f*x+g*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return t[0]=d*v,t[1]=(s*c-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=u*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Qs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(gu.makeScale(t,e)),this}rotate(t){return Qs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(gu.makeRotation(-t)),this}translate(t,e){return Qs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(gu.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};xd.prototype.isMatrix3=!0;var oe=xd,gu=new oe,op=new oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ap=new oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lg(){let i={enabled:!0,workingColorSpace:Lo,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Te&&(s.r=ls(s.r),s.g=ls(s.g),s.b=ls(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Te&&(s.r=Nr(s.r),s.g=Nr(s.g),s.b=Nr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ri?No:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Qs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Qs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Lo]:{primaries:t,whitePoint:n,transfer:No,toXYZ:op,fromXYZ:ap,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ke},outputColorSpaceConfig:{drawingBufferColorSpace:Ke}},[Ke]:{primaries:t,whitePoint:n,transfer:Te,toXYZ:op,fromXYZ:ap,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ke}}}),i}var de=Lg();function ls(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Nr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var yr,Zl=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{yr===void 0&&(yr=Uo("canvas")),yr.width=t.width,yr.height=t.height;let s=yr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=yr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Uo("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ls(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ls(e[n]/255)*255):e[n]=ls(e[n]);return{data:e,width:t.width,height:t.height}}else return Qt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ng=0,Or=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ng++}),this.uuid=$r(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(xu(s[o].image)):r.push(xu(s[o]))}else r=xu(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function xu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Zl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Qt("Texture: Unable to serialize Texture."),{})}var Ug=0,vu=new P,Pn=class i extends zi{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Oi,s=Oi,r=Ze,o=ci,a=Gn,l=wn,c=i.DEFAULT_ANISOTROPY,h=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=$r(),this.name="",this.source=new Or(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(vu).x}get height(){return this.source.getSize(vu).y}get depth(){return this.source.getSize(vu).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Qt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Qt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ed)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Jn:t.x=t.x-Math.floor(t.x);break;case Oi:t.x=t.x<0?0:1;break;case Xl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Jn:t.y=t.y-Math.floor(t.y);break;case Oi:t.y=t.y<0?0:1;break;case Xl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=ed;Pn.DEFAULT_ANISOTROPY=1;var vd=class vd{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(c+1)/2,x=(f+1)/2,y=(m+1)/2,_=(h+u)/4,E=(d+v)/4,S=(g+p)/4;return M>x&&M>y?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=_/n,r=E/n):x>y?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=_/s,r=S/s):y<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(y),n=E/r,s=S/r),this.set(n,s,r,e),this}let b=Math.sqrt((p-g)*(p-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(d-v)/b,this.z=(u-h)/b,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ue(this.x,t.x,e.x),this.y=ue(this.y,t.y,e.y),this.z=ue(this.z,t.z,e.z),this.w=ue(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ue(this.x,t,e),this.y=ue(this.y,t,e),this.z=ue(this.z,t,e),this.w=ue(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ue(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};vd.prototype.isVector4=!0;var Be=vd,$l=class extends zi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Be(0,0,t,e),this.scissorTest=!1,this.viewport=new Be(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new Pn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Or(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fe=class extends $l{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Fo=class extends Pn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Jl=class extends Pn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var yc=class yc{constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,g,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,v,p)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,v,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yc().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Mr.setFromMatrixColumn(t,0).length(),r=1/Mr.setFromMatrixColumn(t,1).length(),o=1/Mr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,f=o*d,g=a*h,v=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u+v*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u-v*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,f=o*d,g=a*h,v=a*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=v-u*d,e[8]=g*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-v*d}else if(t.order==="XZY"){let u=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=o*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fg,t,Og)}lookAt(t,e,n){let s=this.elements;return Zn.subVectors(t,e),Zn.lengthSq()===0&&(Zn.z=1),Zn.normalize(),ws.crossVectors(n,Zn),ws.lengthSq()===0&&(Math.abs(n.z)===1?Zn.x+=1e-4:Zn.z+=1e-4,Zn.normalize(),ws.crossVectors(n,Zn)),ws.normalize(),dl.crossVectors(Zn,ws),s[0]=ws.x,s[4]=dl.x,s[8]=Zn.x,s[1]=ws.y,s[5]=dl.y,s[9]=Zn.y,s[2]=ws.z,s[6]=dl.z,s[10]=Zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],b=n[3],M=n[7],x=n[11],y=n[15],_=s[0],E=s[4],S=s[8],T=s[12],A=s[1],C=s[5],L=s[9],U=s[13],N=s[2],F=s[6],H=s[10],G=s[14],K=s[3],z=s[7],V=s[11],I=s[15];return r[0]=o*_+a*A+l*N+c*K,r[4]=o*E+a*C+l*F+c*z,r[8]=o*S+a*L+l*H+c*V,r[12]=o*T+a*U+l*G+c*I,r[1]=h*_+d*A+u*N+f*K,r[5]=h*E+d*C+u*F+f*z,r[9]=h*S+d*L+u*H+f*V,r[13]=h*T+d*U+u*G+f*I,r[2]=g*_+v*A+p*N+m*K,r[6]=g*E+v*C+p*F+m*z,r[10]=g*S+v*L+p*H+m*V,r[14]=g*T+v*U+p*G+m*I,r[3]=b*_+M*A+x*N+y*K,r[7]=b*E+M*C+x*F+y*z,r[11]=b*S+M*L+x*H+y*V,r[15]=b*T+M*U+x*G+y*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],v=t[7],p=t[11],m=t[15],b=l*f-c*u,M=a*f-c*d,x=a*u-l*d,y=o*f-c*h,_=o*u-l*h,E=o*d-a*h;return e*(v*b-p*M+m*x)-n*(g*b-p*y+m*_)+s*(g*M-v*y+m*E)-r*(g*x-v*_+p*E)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],v=t[13],p=t[14],m=t[15],b=e*a-n*o,M=e*l-s*o,x=e*c-r*o,y=n*l-s*a,_=n*c-r*a,E=s*c-r*l,S=h*v-d*g,T=h*p-u*g,A=h*m-f*g,C=d*p-u*v,L=d*m-f*v,U=u*m-f*p,N=b*U-M*L+x*C+y*A-_*T+E*S;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/N;return t[0]=(a*U-l*L+c*C)*F,t[1]=(s*L-n*U-r*C)*F,t[2]=(v*E-p*_+m*y)*F,t[3]=(u*_-d*E-f*y)*F,t[4]=(l*A-o*U-c*T)*F,t[5]=(e*U-s*A+r*T)*F,t[6]=(p*x-g*E-m*M)*F,t[7]=(h*E-u*x+f*M)*F,t[8]=(o*L-a*A+c*S)*F,t[9]=(n*A-e*L-r*S)*F,t[10]=(g*_-v*x+m*b)*F,t[11]=(d*x-h*_-f*b)*F,t[12]=(a*T-o*C-l*S)*F,t[13]=(e*C-n*T+s*S)*F,t[14]=(v*M-g*y-p*b)*F,t[15]=(h*y-d*M+u*b)*F,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,v=o*h,p=o*d,m=a*d,b=l*c,M=l*h,x=l*d,y=n.x,_=n.y,E=n.z;return s[0]=(1-(v+m))*y,s[1]=(f+x)*y,s[2]=(g-M)*y,s[3]=0,s[4]=(f-x)*_,s[5]=(1-(u+m))*_,s[6]=(p+b)*_,s[7]=0,s[8]=(g+M)*E,s[9]=(p-b)*E,s[10]=(1-(u+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Mr.set(s[0],s[1],s[2]).length(),a=Mr.set(s[4],s[5],s[6]).length(),l=Mr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),vi.copy(this);let c=1/o,h=1/a,d=1/l;return vi.elements[0]*=c,vi.elements[1]*=c,vi.elements[2]*=c,vi.elements[4]*=h,vi.elements[5]*=h,vi.elements[6]*=h,vi.elements[8]*=d,vi.elements[9]*=d,vi.elements[10]*=d,e.setFromRotationMatrix(vi),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=Si,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s),g,v;if(l)g=r/(o-r),v=o*r/(o-r);else if(a===Si)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Ur)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Si,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s),g,v;if(l)g=1/(o-r),v=o/(o-r);else if(a===Si)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Ur)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};yc.prototype.isMatrix4=!0;var se=yc,Mr=new P,vi=new se,Fg=new P(0,0,0),Og=new P(1,1,1),ws=new P,dl=new P,Zn=new P,lp=new se,cp=new cn,kn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ue(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ue(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ue(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ue(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ue(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ue(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Qt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return lp.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lp,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return cp.setFromEuler(this),this.setFromQuaternion(cp,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};kn.DEFAULT_ORDER="XYZ";var Oo=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Bg=0,hp=new P,Sr=new cn,is=new se,fl=new P,bo=new P,zg=new P,kg=new cn,up=new P(1,0,0),dp=new P(0,1,0),fp=new P(0,0,1),pp={type:"added"},Hg={type:"removed"},br={type:"childadded",child:null},_u={type:"childremoved",child:null},xn=class i extends zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bg++}),this.uuid=$r(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new P,e=new kn,n=new cn,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new oe}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Sr.setFromAxisAngle(t,e),this.quaternion.multiply(Sr),this}rotateOnWorldAxis(t,e){return Sr.setFromAxisAngle(t,e),this.quaternion.premultiply(Sr),this}rotateX(t){return this.rotateOnAxis(up,t)}rotateY(t){return this.rotateOnAxis(dp,t)}rotateZ(t){return this.rotateOnAxis(fp,t)}translateOnAxis(t,e){return hp.copy(t).applyQuaternion(this.quaternion),this.position.add(hp.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(up,t)}translateY(t){return this.translateOnAxis(dp,t)}translateZ(t){return this.translateOnAxis(fp,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(is.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?fl.copy(t):fl.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),bo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?is.lookAt(bo,fl,this.up):is.lookAt(fl,bo,this.up),this.quaternion.setFromRotationMatrix(is),s&&(is.extractRotation(s.matrixWorld),Sr.setFromRotationMatrix(is),this.quaternion.premultiply(Sr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(ee("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(pp),br.child=t,this.dispatchEvent(br),br.child=null):ee("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Hg),_u.child=t,this.dispatchEvent(_u),_u.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),is.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),is.multiply(t.parent.matrixWorld)),t.applyMatrix4(is),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(pp),br.child=t,this.dispatchEvent(br),br.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bo,t,zg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bo,kg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};xn.DEFAULT_UP=new P(0,1,0);xn.DEFAULT_MATRIX_AUTO_UPDATE=!0;xn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ge=class extends xn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gg={type:"move"},Br=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Gg)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ge;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},pm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Es={h:0,s:0,l:0},pl={h:0,s:0,l:0};function yu(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Nt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=Dg(t,1),e=ue(e,0,1),n=ue(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=yu(o,r,t+1/3),this.g=yu(o,r,t),this.b=yu(o,r,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=Ke){function n(r){r!==void 0&&parseFloat(r)<1&&Qt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Qt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Qt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){let n=pm[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Qt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ls(t.r),this.g=ls(t.g),this.b=ls(t.b),this}copyLinearToSRGB(t){return this.r=Nr(t.r),this.g=Nr(t.g),this.b=Nr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return de.workingToColorSpace(Sn.copy(this),t),Math.round(ue(Sn.r*255,0,255))*65536+Math.round(ue(Sn.g*255,0,255))*256+Math.round(ue(Sn.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(Sn.copy(this),e);let n=Sn.r,s=Sn.g,r=Sn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(Sn.copy(this),e),t.r=Sn.r,t.g=Sn.g,t.b=Sn.b,t}getStyle(t=Ke){de.workingToColorSpace(Sn.copy(this),t);let e=Sn.r,n=Sn.g,s=Sn.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Es),this.setHSL(Es.h+t,Es.s+e,Es.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Es),t.getHSL(pl);let n=pu(Es.h,pl.h,e),s=pu(Es.s,pl.s,e),r=pu(Es.l,pl.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Sn=new Nt;Nt.NAMES=pm;var Bo=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Nt(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ps=class extends xn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},_i=new P,ss=new P,Mu=new P,rs=new P,wr=new P,Er=new P,mp=new P,Su=new P,bu=new P,wu=new P,Eu=new Be,Tu=new Be,Au=new Be,Cs=class i{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),_i.subVectors(t,e),s.cross(_i);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){_i.subVectors(s,e),ss.subVectors(n,e),Mu.subVectors(t,e);let o=_i.dot(_i),a=_i.dot(ss),l=_i.dot(Mu),c=ss.dot(ss),h=ss.dot(Mu),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,rs)===null?!1:rs.x>=0&&rs.y>=0&&rs.x+rs.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,rs)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,rs.x),l.addScaledVector(o,rs.y),l.addScaledVector(a,rs.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Eu.setScalar(0),Tu.setScalar(0),Au.setScalar(0),Eu.fromBufferAttribute(t,e),Tu.fromBufferAttribute(t,n),Au.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Eu,r.x),o.addScaledVector(Tu,r.y),o.addScaledVector(Au,r.z),o}static isFrontFacing(t,e,n,s){return _i.subVectors(n,e),ss.subVectors(t,e),_i.cross(ss).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _i.subVectors(this.c,this.b),ss.subVectors(this.a,this.b),_i.cross(ss).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;wr.subVectors(s,n),Er.subVectors(r,n),Su.subVectors(t,n);let l=wr.dot(Su),c=Er.dot(Su);if(l<=0&&c<=0)return e.copy(n);bu.subVectors(t,s);let h=wr.dot(bu),d=Er.dot(bu);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(wr,o);wu.subVectors(t,r);let f=wr.dot(wu),g=Er.dot(wu);if(g>=0&&f<=g)return e.copy(r);let v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Er,a);let p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return mp.subVectors(r,s),a=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(mp,a);let m=1/(p+v+u);return o=v*m,a=u*m,e.copy(n).addScaledVector(wr,o).addScaledVector(Er,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ki=class{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(yi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(yi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=yi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,yi):yi.fromBufferAttribute(r,o),yi.applyMatrix4(t.matrixWorld),this.expandByPoint(yi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ml.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ml.copy(n.boundingBox)),ml.applyMatrix4(t.matrixWorld),this.union(ml)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,yi),yi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(wo),gl.subVectors(this.max,wo),Tr.subVectors(t.a,wo),Ar.subVectors(t.b,wo),Rr.subVectors(t.c,wo),Ts.subVectors(Ar,Tr),As.subVectors(Rr,Ar),Zs.subVectors(Tr,Rr);let e=[0,-Ts.z,Ts.y,0,-As.z,As.y,0,-Zs.z,Zs.y,Ts.z,0,-Ts.x,As.z,0,-As.x,Zs.z,0,-Zs.x,-Ts.y,Ts.x,0,-As.y,As.x,0,-Zs.y,Zs.x,0];return!Ru(e,Tr,Ar,Rr,gl)||(e=[1,0,0,0,1,0,0,0,1],!Ru(e,Tr,Ar,Rr,gl))?!1:(xl.crossVectors(Ts,As),e=[xl.x,xl.y,xl.z],Ru(e,Tr,Ar,Rr,gl))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,yi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(yi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(os[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),os[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),os[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),os[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),os[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),os[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),os[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),os[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(os),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},os=[new P,new P,new P,new P,new P,new P,new P,new P],yi=new P,ml=new ki,Tr=new P,Ar=new P,Rr=new P,Ts=new P,As=new P,Zs=new P,wo=new P,gl=new P,xl=new P,$s=new P;function Ru(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){$s.fromArray(i,r);let a=s.x*Math.abs($s.x)+s.y*Math.abs($s.y)+s.z*Math.abs($s.z),l=t.dot($s),c=e.dot($s),h=n.dot($s);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var rn=new P,vl=new it,Vg=0,re=class extends zi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vg++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=cm,this.updateRanges=[],this.gpuType=hi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)vl.fromBufferAttribute(this,e),vl.applyMatrix3(t),this.setXY(e,vl.x,vl.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyMatrix3(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyMatrix4(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyNormalMatrix(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.transformDirection(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=So(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=zn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=So(e,this.array)),e}setX(t,e){return this.normalized&&(e=zn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=So(e,this.array)),e}setY(t,e){return this.normalized&&(e=zn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=So(e,this.array)),e}setZ(t,e){return this.normalized&&(e=zn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=So(e,this.array)),e}setW(t,e){return this.normalized&&(e=zn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=zn(e,this.array),n=zn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=zn(e,this.array),n=zn(n,this.array),s=zn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=zn(e,this.array),n=zn(n,this.array),s=zn(s,this.array),r=zn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var zo=class extends re{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ko=class extends re{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Yt=class extends re{constructor(t,e,n){super(new Float32Array(t),e,n)}},Wg=new ki,Eo=new P,Cu=new P,hs=class{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Wg.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Eo.subVectors(t,this.center);let e=Eo.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Eo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Cu.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Eo.copy(t.center).add(Cu)),this.expandByPoint(Eo.copy(t.center).sub(Cu))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Xg=0,si=new se,Pu=new xn,Cr=new P,$n=new ki,To=new ki,pn=new P,he=class i extends zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xg++}),this.uuid=$r(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Pg(t)?ko:zo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new oe().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return si.makeRotationFromQuaternion(t),this.applyMatrix4(si),this}rotateX(t){return si.makeRotationX(t),this.applyMatrix4(si),this}rotateY(t){return si.makeRotationY(t),this.applyMatrix4(si),this}rotateZ(t){return si.makeRotationZ(t),this.applyMatrix4(si),this}translate(t,e,n){return si.makeTranslation(t,e,n),this.applyMatrix4(si),this}scale(t,e,n){return si.makeScale(t,e,n),this.applyMatrix4(si),this}lookAt(t){return Pu.lookAt(t),Pu.updateMatrix(),this.applyMatrix4(Pu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cr).negate(),this.translate(Cr.x,Cr.y,Cr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Yt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Qt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ki);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ee("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];$n.setFromBufferAttribute(r),this.morphTargetsRelative?(pn.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(pn),pn.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(pn)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ee('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hs);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ee("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){let n=this.boundingSphere.center;if($n.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];To.setFromBufferAttribute(a),this.morphTargetsRelative?(pn.addVectors($n.min,To.min),$n.expandByPoint(pn),pn.addVectors($n.max,To.max),$n.expandByPoint(pn)):($n.expandByPoint(To.min),$n.expandByPoint(To.max))}$n.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)pn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(pn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)pn.fromBufferAttribute(a,c),l&&(Cr.fromBufferAttribute(t,c),pn.add(Cr)),s=Math.max(s,n.distanceToSquared(pn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ee('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){ee("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new re(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let S=0;S<n.count;S++)a[S]=new P,l[S]=new P;let c=new P,h=new P,d=new P,u=new it,f=new it,g=new it,v=new P,p=new P;function m(S,T,A){c.fromBufferAttribute(n,S),h.fromBufferAttribute(n,T),d.fromBufferAttribute(n,A),u.fromBufferAttribute(r,S),f.fromBufferAttribute(r,T),g.fromBufferAttribute(r,A),h.sub(c),d.sub(c),f.sub(u),g.sub(u);let C=1/(f.x*g.y-g.x*f.y);isFinite(C)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(C),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(C),a[S].add(v),a[T].add(v),a[A].add(v),l[S].add(p),l[T].add(p),l[A].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let S=0,T=b.length;S<T;++S){let A=b[S],C=A.start,L=A.count;for(let U=C,N=C+L;U<N;U+=3)m(t.getX(U+0),t.getX(U+1),t.getX(U+2))}let M=new P,x=new P,y=new P,_=new P;function E(S){y.fromBufferAttribute(s,S),_.copy(y);let T=a[S];M.copy(T),M.sub(y.multiplyScalar(y.dot(T))).normalize(),x.crossVectors(_,T);let C=x.dot(l[S])<0?-1:1;o.setXYZW(S,M.x,M.y,M.z,C)}for(let S=0,T=b.length;S<T;++S){let A=b[S],C=A.start,L=A.count;for(let U=C,N=C+L;U<N;U+=3)E(t.getX(U+0)),E(t.getX(U+1)),E(t.getX(U+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new re(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,d=new P;if(t)for(let u=0,f=t.count;u<f;u+=3){let g=t.getX(u+0),v=t.getX(u+1),p=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)pn.fromBufferAttribute(t,e),pn.normalize(),t.setXYZ(e,pn.x,pn.y,pn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,g=0;for(let v=0,p=l.length;v<p;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let m=0;m<h;m++)u[g++]=c[f++]}return new re(u,h,d)}if(this.index===null)return Qt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Iu=new P,qg=new P,Yg=new oe,Mi=class{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Iu.subVectors(n,e).cross(qg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Iu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Yg.getNormalMatrix(t),s=this.coplanarPoint(Iu).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Zg=0,bi=class extends zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zg++}),this.uuid=$r(),this.name="",this.type="Material",this.blending=qr,this.side=Fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qu,this.blendDst=td,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ol,this.stencilZFail=Ol,this.stencilZPass=Ol,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Qt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Qt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Nt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Mi().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new it().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new it().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var as=new P,Du=new P,_l=new P,yl=new P,Ho=class{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,as)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=as.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(as.copy(this.origin).addScaledVector(this.direction,e),as.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Du.copy(t).add(e).multiplyScalar(.5),_l.copy(e).sub(t).normalize(),yl.copy(this.origin).sub(Du);let r=t.distanceTo(e)*.5,o=-this.direction.dot(_l),a=yl.dot(this.direction),l=-yl.dot(_l),c=yl.lengthSq(),h=Math.abs(1-o*o),d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let v=1/h;d*=v,u*=v,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Du).addScaledVector(_l,u),f}intersectSphere(t,e){if(t.radius<0)return null;as.subVectors(t.center,this.origin);let n=as.dot(this.direction),s=as.dot(as)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,as)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,g=e.x-o.x,v=e.y-o.y,p=e.z-o.z,m=n.x-o.x,b=n.y-o.y,M=n.z-o.z,x=Math.abs(l),y=Math.abs(c),_=Math.abs(h),E,S,T,A,C,L,U,N,F,H,G,K;if(x>=y&&x>=_?(T=l,L=d,F=g,K=m,l>=0?(E=c,S=h,A=u,C=f,U=v,N=p,H=b,G=M):(E=h,S=c,A=f,C=u,U=p,N=v,H=M,G=b)):y>=_?(T=c,L=u,F=v,K=b,c>=0?(E=h,S=l,A=f,C=d,U=p,N=g,H=M,G=m):(E=l,S=h,A=d,C=f,U=g,N=p,H=m,G=M)):(T=h,L=f,F=p,K=M,h>=0?(E=l,S=c,A=d,C=u,U=g,N=v,H=m,G=b):(E=c,S=l,A=u,C=d,U=v,N=g,H=b,G=m)),T===0)return null;let z=E/T,V=S/T,I=1/T,ot=A-z*L,ct=C-V*L,gt=U-z*F,It=N-V*F,Y=H-z*K,B=G-V*K,X=Y*It-B*gt,st=ot*B-ct*Y,pt=gt*ct-It*ot;if(s){if(X<0||st<0||pt<0)return null}else if((X<0||st<0||pt<0)&&(X>0||st>0||pt>0))return null;let ht=X+st+pt;if(ht===0)return null;let xt=I*(X*L+st*F+pt*K);return(ht>0?xt<0:xt>0)?null:this.at(xt/ht,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Kn=class extends bi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=bc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},gp=new se,Js=new Ho,Ml=new hs,xp=new P,Sl=new P,bl=new P,wl=new P,Lu=new P,El=new P,vp=new P,Tl=new P,Zt=class extends xn{constructor(t=new he,e=new Kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){El.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(Lu.fromBufferAttribute(d,t),o?El.addScaledVector(Lu,h):El.addScaledVector(Lu.sub(e),h))}e.add(El)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ml.copy(n.boundingSphere),Ml.applyMatrix4(r),Js.copy(t.ray).recast(t.near),!(Ml.containsPoint(Js.origin)===!1&&(Js.intersectSphere(Ml,xp)===null||Js.origin.distanceToSquared(xp)>(t.far-t.near)**2))&&(gp.copy(r).invert(),Js.copy(t.ray).applyMatrix4(gp),!(n.boundingBox!==null&&Js.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Js)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){let p=u[g],m=o[p.materialIndex],b=Math.max(p.start,f.start),M=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let x=b,y=M;x<y;x+=3){let _=a.getX(x),E=a.getX(x+1),S=a.getX(x+2);s=Al(this,m,t,n,c,h,d,_,E,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){let b=a.getX(p),M=a.getX(p+1),x=a.getX(p+2);s=Al(this,o,t,n,c,h,d,b,M,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){let p=u[g],m=o[p.materialIndex],b=Math.max(p.start,f.start),M=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let x=b,y=M;x<y;x+=3){let _=x,E=x+1,S=x+2;s=Al(this,m,t,n,c,h,d,_,E,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){let b=p,M=p+1,x=p+2;s=Al(this,o,t,n,c,h,d,b,M,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function $g(i,t,e,n,s,r,o,a){let l;if(t.side===vn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Fs,a),l===null)return null;Tl.copy(a),Tl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Tl);return c<e.near||c>e.far?null:{distance:c,point:Tl.clone(),object:i}}function Al(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Sl),i.getVertexPosition(l,bl),i.getVertexPosition(c,wl);let h=$g(i,t,e,n,Sl,bl,wl,vp);if(h){let d=new P;Cs.getBarycoord(vp,Sl,bl,wl,d),s&&(h.uv=Cs.getInterpolatedAttribute(s,a,l,c,d,new it)),r&&(h.uv1=Cs.getInterpolatedAttribute(r,a,l,c,d,new it)),o&&(h.normal=Cs.getInterpolatedAttribute(o,a,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new P,materialIndex:0};Cs.getNormal(Sl,bl,wl,u.normal),h.face=u,h.barycoord=d}return h}var In=class extends Pn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=je,h=je,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Is=class extends re{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Pr=new se,_p=new se,Rl=[],yp=new ki,Jg=new se,Ao=new Zt,Ro=new hs,ri=class extends Zt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Is(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Jg)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ki),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Pr),yp.copy(t.boundingBox).applyMatrix4(Pr),this.boundingBox.union(yp)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new hs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Pr),Ro.copy(t.boundingSphere).applyMatrix4(Pr),this.boundingSphere.union(Ro)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Ao.geometry=this.geometry,Ao.material=this.material,Ao.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ro.copy(this.boundingSphere),Ro.applyMatrix4(n),t.ray.intersectsSphere(Ro)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Pr),_p.multiplyMatrices(n,Pr),Ao.matrixWorld=_p,Ao.raycast(t,Rl);for(let o=0,a=Rl.length;o<a;o++){let l=Rl[o];l.instanceId=r,l.object=this,e.push(l)}Rl.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Is(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new In(new Float32Array(s*this.count),s,this.count,Wi,hi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ks=new hs,Kg=new it(.5,.5),Cl=new P,zr=class{constructor(t=new Mi,e=new Mi,n=new Mi,s=new Mi,r=new Mi,o=new Mi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Si,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],v=r[9],p=r[10],m=r[11],b=r[12],M=r[13],x=r[14],y=r[15];if(s[0].setComponents(c-o,f-h,m-g,y-b).normalize(),s[1].setComponents(c+o,f+h,m+g,y+b).normalize(),s[2].setComponents(c+a,f+d,m+v,y+M).normalize(),s[3].setComponents(c-a,f-d,m-v,y-M).normalize(),n)s[4].setComponents(l,u,p,x).normalize(),s[5].setComponents(c-l,f-u,m-p,y-x).normalize();else if(s[4].setComponents(c-l,f-u,m-p,y-x).normalize(),e===Si)s[5].setComponents(c+l,f+u,m+p,y+x).normalize();else if(e===Ur)s[5].setComponents(l,u,p,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ks.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ks.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ks)}intersectsSprite(t){Ks.center.set(0,0,0);let e=Kg.distanceTo(t.center);return Ks.radius=.7071067811865476+e,Ks.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ks)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Cl.x=s.normal.x>0?t.max.x:t.min.x,Cl.y=s.normal.y>0?t.max.y:t.min.y,Cl.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Cl)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Kl=class extends bi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Mp=new se,Vu=new Ho,Pl=new hs,Il=new P,Go=class extends xn{constructor(t=new he,e=new Kl){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pl.copy(n.boundingSphere),Pl.applyMatrix4(s),Pl.radius+=r,t.ray.intersectsSphere(Pl)===!1)return;Mp.copy(s).invert(),Vu.copy(t.ray).applyMatrix4(Mp);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=u,v=f;g<v;g++){let p=c.getX(g);Il.fromBufferAttribute(d,p),Sp(Il,p,l,s,t,e,this)}}else{let u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=u,v=f;g<v;g++)Il.fromBufferAttribute(d,g),Sp(Il,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Sp(i,t,e,n,s,r,o){let a=Vu.distanceSqToPoint(i);if(a<e){let l=new P;Vu.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Vo=class extends Pn{constructor(t=[],e=Os,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Hi=class extends Pn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var oi=class extends Pn{constructor(t,e,n=Ai,s,r,o,a=je,l=je,c,h=Bi,d=1){if(h!==Bi&&h!==Vi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Or(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},jl=class extends oi{constructor(t,e=Ai,n=Os,s,r,o=je,a=je,l,c=Bi){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Wo=class extends Pn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},wi=class i extends he{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(d,2));function g(v,p,m,b,M,x,y,_,E,S,T){let A=x/E,C=y/S,L=x/2,U=y/2,N=_/2,F=E+1,H=S+1,G=0,K=0,z=new P;for(let V=0;V<H;V++){let I=V*C-U;for(let ot=0;ot<F;ot++){let ct=ot*A-L;z[v]=ct*b,z[p]=I*M,z[m]=N,c.push(z.x,z.y,z.z),z[v]=0,z[p]=0,z[m]=_>0?1:-1,h.push(z.x,z.y,z.z),d.push(ot/E),d.push(1-V/S),G+=1}}for(let V=0;V<S;V++)for(let I=0;I<E;I++){let ot=u+I+F*V,ct=u+I+F*(V+1),gt=u+(I+1)+F*(V+1),It=u+(I+1)+F*V;l.push(ot,ct,It),l.push(ct,gt,It),K+=6}a.addGroup(f,K,T),f+=K,u+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var kr=class i extends he{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new P,h=new it;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){let f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Yt(o,3)),this.setAttribute("normal",new Yt(a,3)),this.setAttribute("uv",new Yt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},_e=class i extends he{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],g=0,v=[],p=n/2,m=0;b(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Yt(d,3)),this.setAttribute("normal",new Yt(u,3)),this.setAttribute("uv",new Yt(f,2));function b(){let x=new P,y=new P,_=0,E=(e-t)/n;for(let S=0;S<=r;S++){let T=[],A=S/r,C=A*(e-t)+t;for(let L=0;L<=s;L++){let U=L/s,N=U*l+a,F=Math.sin(N),H=Math.cos(N);y.x=C*F,y.y=-A*n+p,y.z=C*H,d.push(y.x,y.y,y.z),x.set(F,E,H).normalize(),u.push(x.x,x.y,x.z),f.push(U,1-A),T.push(g++)}v.push(T)}for(let S=0;S<s;S++)for(let T=0;T<r;T++){let A=v[T][S],C=v[T+1][S],L=v[T+1][S+1],U=v[T][S+1];(t>0||T!==0)&&(h.push(A,C,U),_+=3),(e>0||T!==r-1)&&(h.push(C,L,U),_+=3)}c.addGroup(m,_,0),m+=_}function M(x){let y=g,_=new it,E=new P,S=0,T=x===!0?t:e,A=x===!0?1:-1;for(let L=1;L<=s;L++)d.push(0,p*A,0),u.push(0,A,0),f.push(.5,.5),g++;let C=g;for(let L=0;L<=s;L++){let N=L/s*l+a,F=Math.cos(N),H=Math.sin(N);E.x=T*H,E.y=p*A,E.z=T*F,d.push(E.x,E.y,E.z),u.push(0,A,0),_.x=F*.5+.5,_.y=H*.5*A+.5,f.push(_.x,_.y),g++}for(let L=0;L<s;L++){let U=y+L,N=C+L;x===!0?h.push(N,N+1,U):h.push(N+1,N,U),S+=3}c.addGroup(m,S,x===!0?1:2),m+=S}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Hr=class i extends _e{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ql=class i extends he{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Yt(r,3)),this.setAttribute("normal",new Yt(r.slice(),3)),this.setAttribute("uv",new Yt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let M=new P,x=new P,y=new P;for(let _=0;_<e.length;_+=3)f(e[_+0],M),f(e[_+1],x),f(e[_+2],y),l(M,x,y,b)}function l(b,M,x,y){let _=y+1,E=[];for(let S=0;S<=_;S++){E[S]=[];let T=b.clone().lerp(x,S/_),A=M.clone().lerp(x,S/_),C=_-S;for(let L=0;L<=C;L++)L===0&&S===_?E[S][L]=T:E[S][L]=T.clone().lerp(A,L/C)}for(let S=0;S<_;S++)for(let T=0;T<2*(_-S)-1;T++){let A=Math.floor(T/2);T%2===0?(u(E[S][A+1]),u(E[S+1][A]),u(E[S][A])):(u(E[S][A+1]),u(E[S+1][A+1]),u(E[S+1][A]))}}function c(b){let M=new P;for(let x=0;x<r.length;x+=3)M.x=r[x+0],M.y=r[x+1],M.z=r[x+2],M.normalize().multiplyScalar(b),r[x+0]=M.x,r[x+1]=M.y,r[x+2]=M.z}function h(){let b=new P;for(let M=0;M<r.length;M+=3){b.x=r[M+0],b.y=r[M+1],b.z=r[M+2];let x=p(b)/2/Math.PI+.5,y=m(b)/Math.PI+.5;o.push(x,1-y)}g(),d()}function d(){for(let b=0;b<o.length;b+=6){let M=o[b+0],x=o[b+2],y=o[b+4],_=Math.max(M,x,y),E=Math.min(M,x,y);_>.9&&E<.1&&(M<.2&&(o[b+0]+=1),x<.2&&(o[b+2]+=1),y<.2&&(o[b+4]+=1))}}function u(b){r.push(b.x,b.y,b.z)}function f(b,M){let x=b*3;M.x=t[x+0],M.y=t[x+1],M.z=t[x+2]}function g(){let b=new P,M=new P,x=new P,y=new P,_=new it,E=new it,S=new it;for(let T=0,A=0;T<r.length;T+=9,A+=6){b.set(r[T+0],r[T+1],r[T+2]),M.set(r[T+3],r[T+4],r[T+5]),x.set(r[T+6],r[T+7],r[T+8]),_.set(o[A+0],o[A+1]),E.set(o[A+2],o[A+3]),S.set(o[A+4],o[A+5]),y.copy(b).add(M).add(x).divideScalar(3);let C=p(y);v(_,A+0,b,C),v(E,A+2,M,C),v(S,A+4,x,C)}}function v(b,M,x,y){y<0&&b.x===1&&(o[M]=b.x-1),x.x===0&&x.z===0&&(o[M]=y/2/Math.PI+.5)}function p(b){return Math.atan2(b.z,-b.x)}function m(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.detail)}};var jn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Qt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new it:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new P,s=[],r=[],o=[],a=new P,l=new se;for(let f=0;f<=t;f++){let g=f/t;s[f]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ue(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(ue(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},us=class extends jn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new it){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},tc=class extends us{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function hd(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var bp=new P,wp=new P,Nu=new hd,Uu=new hd,Fu=new hd,tr=class extends jn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(wp.subVectors(s[0],s[1]).add(s[0]),c=wp);let d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(bp.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=bp),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),Nu.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,v,p),Uu.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,v,p),Fu.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,v,p)}else this.curveType==="catmullrom"&&(Nu.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Uu.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Fu.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Nu.calc(l),Uu.calc(l),Fu.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Ep(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function jg(i,t){let e=1-i;return e*e*t}function Qg(i,t){return 2*(1-i)*i*t}function tx(i,t){return i*i*t}function Po(i,t,e,n){return jg(i,t)+Qg(i,e)+tx(i,n)}function ex(i,t){let e=1-i;return e*e*e*t}function nx(i,t){let e=1-i;return 3*e*e*i*t}function ix(i,t){return 3*(1-i)*i*i*t}function sx(i,t){return i*i*i*t}function Io(i,t,e,n,s){return ex(i,t)+nx(i,e)+ix(i,n)+sx(i,s)}var Xo=class extends jn{constructor(t=new it,e=new it,n=new it,s=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new it){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Io(t,s.x,r.x,o.x,a.x),Io(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ec=class extends jn{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Io(t,s.x,r.x,o.x,a.x),Io(t,s.y,r.y,o.y,a.y),Io(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},qo=class extends jn{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},nc=class extends jn{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Yo=class extends jn{constructor(t=new it,e=new it,n=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new it){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Po(t,s.x,r.x,o.x),Po(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},er=class extends jn{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Po(t,s.x,r.x,o.x),Po(t,s.y,r.y,o.y),Po(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Zo=class extends jn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(Ep(a,l.x,c.x,h.x,d.x),Ep(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new it().fromArray(s))}return this}},ic=Object.freeze({__proto__:null,ArcCurve:tc,CatmullRomCurve3:tr,CubicBezierCurve:Xo,CubicBezierCurve3:ec,EllipseCurve:us,LineCurve:qo,LineCurve3:nc,QuadraticBezierCurve:Yo,QuadraticBezierCurve3:er,SplineCurve:Zo}),sc=class extends jn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ic[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new ic[s.type]().fromJSON(s))}return this}},$o=class extends sc{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new qo(this.currentPoint.clone(),new it(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Yo(this.currentPoint.clone(),new it(t,e),new it(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Xo(this.currentPoint.clone(),new it(t,e),new it(n,s),new it(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Zo(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new us(t,e,n,s,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Ei=class extends $o{constructor(t){super(t),this.uuid=$r(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new $o().fromJSON(s))}return this}};function rx(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=mm(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=hx(i,t,r,e)),i.length>80*e){a=i[0],l=i[1];let h=a,d=l;for(let u=e;u<s;u+=e){let f=i[u],g=i[u+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return Jo(r,o,e,a,l,c,0),o}function mm(i,t,e,n,s){let r;if(s===Mx(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=Tp(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Tp(o/n|0,i[o],i[o+1],r);return r&&Gr(r,r.next)&&(jo(r),r=r.next),r}function nr(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Gr(e,e.next)||qe(e.prev,e,e.next)===0)){if(jo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Jo(i,t,e,n,s,r,o){if(!i)return;!o&&r&&mx(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?ax(i,n,s,r):ox(i)){t.push(l.i,i.i,c.i),jo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=lx(nr(i),t),Jo(i,t,e,n,s,r,2)):o===2&&cx(i,t,e,n,s,r):Jo(nr(i),t,e,n,s,r,1);break}}}function ox(i){let t=i.prev,e=i,n=i.next;if(qe(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),d=Math.min(a,l,c),u=Math.max(s,r,o),f=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Co(s,a,r,l,o,c,g.x,g.y)&&qe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ax(i,t,e,n){let s=i.prev,r=i,o=i.next;if(qe(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,f=Math.min(a,l,c),g=Math.min(h,d,u),v=Math.max(a,l,c),p=Math.max(h,d,u),m=Wu(f,g,t,e,n),b=Wu(v,p,t,e,n),M=i.prevZ,x=i.nextZ;for(;M&&M.z>=m&&x&&x.z<=b;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=p&&M!==s&&M!==o&&Co(a,h,l,d,c,u,M.x,M.y)&&qe(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=f&&x.x<=v&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&Co(a,h,l,d,c,u,x.x,x.y)&&qe(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=p&&M!==s&&M!==o&&Co(a,h,l,d,c,u,M.x,M.y)&&qe(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=b;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&Co(a,h,l,d,c,u,x.x,x.y)&&qe(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function lx(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Gr(n,s)&&xm(n,e,e.next,s)&&Ko(n,s)&&Ko(s,n)&&(t.push(n.i,e.i,s.i),jo(e),jo(e.next),e=i=s),e=e.next}while(e!==i);return nr(e)}function cx(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&vx(o,a)){let l=vm(o,a);o=nr(o,o.next),l=nr(l,l.next),Jo(o,t,e,n,s,r,0),Jo(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function hx(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=mm(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(xx(c))}s.sort(ux);for(let r=0;r<s.length;r++)e=dx(s[r],e);return e}function ux(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function dx(i,t){let e=fx(i,t);if(!e)return t;let n=vm(e,i);return nr(n,n.next),nr(e,e.next)}function fx(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(Gr(i,e))return e;do{if(Gr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&gm(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);Ko(e,i)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&px(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function px(i,t){return qe(i.prev,i,t.prev)<0&&qe(t.next,i,i.next)<0}function mx(i,t,e,n){let s=i;do s.z===0&&(s.z=Wu(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,gx(s)}function gx(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function Wu(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function xx(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function gm(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Co(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&gm(i,t,e,n,s,r,o,a)}function vx(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!_x(i,t)&&(Ko(i,t)&&Ko(t,i)&&yx(i,t)&&(qe(i.prev,i,t.prev)||qe(i,t.prev,t))||Gr(i,t)&&qe(i.prev,i,i.next)>0&&qe(t.prev,t,t.next)>0)}function qe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Gr(i,t){return i.x===t.x&&i.y===t.y}function xm(i,t,e,n){let s=Ll(qe(i,t,e)),r=Ll(qe(i,t,n)),o=Ll(qe(e,n,i)),a=Ll(qe(e,n,t));return!!(s!==r&&o!==a||s===0&&Dl(i,e,t)||r===0&&Dl(i,n,t)||o===0&&Dl(e,i,n)||a===0&&Dl(e,t,n))}function Dl(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ll(i){return i>0?1:i<0?-1:0}function _x(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&xm(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ko(i,t){return qe(i.prev,i,i.next)<0?qe(i,t,i.next)>=0&&qe(i,i.prev,t)>=0:qe(i,t,i.prev)<0||qe(i,i.next,t)<0}function yx(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function vm(i,t){let e=Xu(i.i,i.x,i.y),n=Xu(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Tp(i,t,e,n){let s=Xu(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function jo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Xu(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mx(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var qu=class{static triangulate(t,e,n=2){return rx(t,e,n)}},js=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Ap(t),Rp(n,t);let o=t.length;e.forEach(Ap);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Rp(n,e[l]);let a=qu.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Ap(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Rp(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var ir=class i extends he{constructor(t=new Ei([new it(.5,.5),new it(-.5,.5),new it(-.5,-.5),new it(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new Yt(s,3)),this.setAttribute("uv",new Yt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:Sx,M,x=!1,y,_,E,S;if(m){M=m.getSpacedPoints(h),x=!0,u=!1;let j=m.isCatmullRomCurve3?m.closed:!1;y=m.computeFrenetFrames(h,j),_=new P,E=new P,S=new P}u||(p=0,f=0,g=0,v=0);let T=a.extractPoints(c),A=T.shape,C=T.holes;if(!js.isClockWise(A)){A=A.reverse();for(let j=0,lt=C.length;j<lt;j++){let dt=C[j];js.isClockWise(dt)&&(C[j]=dt.reverse())}}function U(j){let dt=10000000000000001e-36,ft=j[0];for(let vt=1;vt<=j.length;vt++){let Xt=vt%j.length,Gt=j[Xt],Jt=Gt.x-ft.x,ne=Gt.y-ft.y,O=Jt*Jt+ne*ne,ye=Math.max(Math.abs(Gt.x),Math.abs(Gt.y),Math.abs(ft.x),Math.abs(ft.y)),le=dt*ye*ye;if(O<=le){j.splice(Xt,1),vt--;continue}ft=Gt}}U(A),C.forEach(U);let N=C.length,F=A;for(let j=0;j<N;j++){let lt=C[j];A=A.concat(lt)}function H(j,lt,dt){return lt||ee("ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(lt,dt)}let G=A.length;function K(j,lt,dt){let ft,vt,Xt,Gt=j.x-lt.x,Jt=j.y-lt.y,ne=dt.x-j.x,O=dt.y-j.y,ye=Gt*Gt+Jt*Jt,le=Gt*O-Jt*ne;if(Math.abs(le)>Number.EPSILON){let D=Math.sqrt(ye),w=Math.sqrt(ne*ne+O*O),q=lt.x-Jt/D,Z=lt.y+Gt/D,tt=dt.x-O/w,mt=dt.y+ne/w,_t=((tt-q)*O-(mt-Z)*ne)/(Gt*O-Jt*ne);ft=q+Gt*_t-j.x,vt=Z+Jt*_t-j.y;let nt=ft*ft+vt*vt;if(nt<=2)return new it(ft,vt);Xt=Math.sqrt(nt/2)}else{let D=!1;Gt>Number.EPSILON?ne>Number.EPSILON&&(D=!0):Gt<-Number.EPSILON?ne<-Number.EPSILON&&(D=!0):Math.sign(Jt)===Math.sign(O)&&(D=!0),D?(ft=-Jt,vt=Gt,Xt=Math.sqrt(ye)):(ft=Gt,vt=Jt,Xt=Math.sqrt(ye/2))}return new it(ft/Xt,vt/Xt)}let z=[];for(let j=0,lt=F.length,dt=lt-1,ft=j+1;j<lt;j++,dt++,ft++)dt===lt&&(dt=0),ft===lt&&(ft=0),z[j]=K(F[j],F[dt],F[ft]);let V=[],I,ot=z.concat();for(let j=0,lt=N;j<lt;j++){let dt=C[j];I=[];for(let ft=0,vt=dt.length,Xt=vt-1,Gt=ft+1;ft<vt;ft++,Xt++,Gt++)Xt===vt&&(Xt=0),Gt===vt&&(Gt=0),I[ft]=K(dt[ft],dt[Xt],dt[Gt]);V.push(I),ot=ot.concat(I)}let ct;if(p===0)ct=js.triangulateShape(F,C);else{let j=[],lt=[];for(let dt=0;dt<p;dt++){let ft=dt/p,vt=f*Math.cos(ft*Math.PI/2),Xt=g*Math.sin(ft*Math.PI/2)+v;for(let Gt=0,Jt=F.length;Gt<Jt;Gt++){let ne=H(F[Gt],z[Gt],Xt);st(ne.x,ne.y,-vt),ft===0&&j.push(ne)}for(let Gt=0,Jt=N;Gt<Jt;Gt++){let ne=C[Gt];I=V[Gt];let O=[];for(let ye=0,le=ne.length;ye<le;ye++){let D=H(ne[ye],I[ye],Xt);st(D.x,D.y,-vt),ft===0&&O.push(D)}ft===0&&lt.push(O)}}ct=js.triangulateShape(j,lt)}let gt=ct.length,It=g+v;for(let j=0;j<G;j++){let lt=u?H(A[j],ot[j],It):A[j];x?(E.copy(y.normals[0]).multiplyScalar(lt.x),_.copy(y.binormals[0]).multiplyScalar(lt.y),S.copy(M[0]).add(E).add(_),st(S.x,S.y,S.z)):st(lt.x,lt.y,0)}for(let j=1;j<=h;j++)for(let lt=0;lt<G;lt++){let dt=u?H(A[lt],ot[lt],It):A[lt];x?(E.copy(y.normals[j]).multiplyScalar(dt.x),_.copy(y.binormals[j]).multiplyScalar(dt.y),S.copy(M[j]).add(E).add(_),st(S.x,S.y,S.z)):st(dt.x,dt.y,d/h*j)}for(let j=p-1;j>=0;j--){let lt=j/p,dt=f*Math.cos(lt*Math.PI/2),ft=g*Math.sin(lt*Math.PI/2)+v;for(let vt=0,Xt=F.length;vt<Xt;vt++){let Gt=H(F[vt],z[vt],ft);st(Gt.x,Gt.y,d+dt)}for(let vt=0,Xt=C.length;vt<Xt;vt++){let Gt=C[vt];I=V[vt];for(let Jt=0,ne=Gt.length;Jt<ne;Jt++){let O=H(Gt[Jt],I[Jt],ft);x?st(O.x,O.y+M[h-1].y,M[h-1].x+dt):st(O.x,O.y,d+dt)}}}Y(),B();function Y(){let j=s.length/3;if(u){let lt=0,dt=G*lt;for(let ft=0;ft<gt;ft++){let vt=ct[ft];pt(vt[2]+dt,vt[1]+dt,vt[0]+dt)}lt=h+p*2,dt=G*lt;for(let ft=0;ft<gt;ft++){let vt=ct[ft];pt(vt[0]+dt,vt[1]+dt,vt[2]+dt)}}else{for(let lt=0;lt<gt;lt++){let dt=ct[lt];pt(dt[2],dt[1],dt[0])}for(let lt=0;lt<gt;lt++){let dt=ct[lt];pt(dt[0]+G*h,dt[1]+G*h,dt[2]+G*h)}}n.addGroup(j,s.length/3-j,0)}function B(){let j=s.length/3,lt=0;X(F,lt),lt+=F.length;for(let dt=0,ft=C.length;dt<ft;dt++){let vt=C[dt];X(vt,lt),lt+=vt.length}n.addGroup(j,s.length/3-j,1)}function X(j,lt){let dt=j.length;for(;--dt>=0;){let ft=dt,vt=dt-1;vt<0&&(vt=j.length-1);for(let Xt=0,Gt=h+p*2;Xt<Gt;Xt++){let Jt=G*Xt,ne=G*(Xt+1),O=lt+ft+Jt,ye=lt+vt+Jt,le=lt+vt+ne,D=lt+ft+ne;ht(O,ye,le,D)}}}function st(j,lt,dt){l.push(j),l.push(lt),l.push(dt)}function pt(j,lt,dt){xt(j),xt(lt),xt(dt);let ft=s.length/3,vt=b.generateTopUV(n,s,ft-3,ft-2,ft-1);Bt(vt[0]),Bt(vt[1]),Bt(vt[2])}function ht(j,lt,dt,ft){xt(j),xt(lt),xt(ft),xt(lt),xt(dt),xt(ft);let vt=s.length/3,Xt=b.generateSideWallUV(n,s,vt-6,vt-3,vt-2,vt-1);Bt(Xt[0]),Bt(Xt[1]),Bt(Xt[3]),Bt(Xt[1]),Bt(Xt[2]),Bt(Xt[3])}function xt(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function Bt(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return bx(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new ic[s.type]().fromJSON(s)),new i(n,t.options)}},Sx={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new it(r,o),new it(a,l),new it(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],g=t[s*3+2],v=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new it(o,1-l),new it(c,1-d),new it(u,1-g),new it(v,1-m)]:[new it(a,1-l),new it(h,1-d),new it(f,1-g),new it(p,1-m)]}};function bx(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Vr=class i extends Ql{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}},Qo=class i extends he{constructor(t=[new it(0,-.5),new it(.5,0),new it(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ue(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,d=new P,u=new it,f=new P,g=new P,v=new P,p=0,m=0;for(let b=0;b<=t.length-1;b++)switch(b){case 0:p=t[b+1].x-t[b].x,m=t[b+1].y-t[b].y,f.x=m*1,f.y=-p,f.z=m*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:p=t[b+1].x-t[b].x,m=t[b+1].y-t[b].y,f.x=m*1,f.y=-p,f.z=m*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(g)}for(let b=0;b<=e;b++){let M=n+b*h*s,x=Math.sin(M),y=Math.cos(M);for(let _=0;_<=t.length-1;_++){d.x=t[_].x*x,d.y=t[_].y,d.z=t[_].x*y,o.push(d.x,d.y,d.z),u.x=b/e,u.y=_/(t.length-1),a.push(u.x,u.y);let E=l[3*_+0]*x,S=l[3*_+1],T=l[3*_+0]*y;c.push(E,S,T)}}for(let b=0;b<e;b++)for(let M=0;M<t.length-1;M++){let x=M+b*t.length,y=x,_=x+t.length,E=x+t.length+1,S=x+1;r.push(y,_,S),r.push(E,S,_)}this.setIndex(r),this.setAttribute("position",new Yt(o,3)),this.setAttribute("uv",new Yt(a,2)),this.setAttribute("normal",new Yt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var Dn=class i extends he{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],g=[],v=[],p=[];for(let m=0;m<h;m++){let b=m*u-o;for(let M=0;M<c;M++){let x=M*d-r;g.push(x,-b,0),v.push(0,0,1),p.push(M/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<a;b++){let M=b+c*m,x=b+c*(m+1),y=b+1+c*(m+1),_=b+1+c*m;f.push(M,x,_),f.push(x,y,_)}this.setIndex(f),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(v,3)),this.setAttribute("uv",new Yt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Hn=class i extends he{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new P,u=new P,f=[],g=[],v=[],p=[];for(let m=0;m<=n;m++){let b=[],M=m/n,x=o+M*a,y=t*Math.cos(x),_=Math.sqrt(t*t-y*y),E=0;m===0&&o===0?E=.5/e:m===n&&l===Math.PI&&(E=-.5/e);for(let S=0;S<=e;S++){let T=S/e,A=s+T*r;d.x=-_*Math.cos(A),d.y=y,d.z=_*Math.sin(A),g.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),p.push(T+E,1-M),b.push(c++)}h.push(b)}for(let m=0;m<n;m++)for(let b=0;b<e;b++){let M=h[m][b+1],x=h[m][b],y=h[m+1][b],_=h[m+1][b+1];(m!==0||o>0)&&f.push(M,x,_),(m!==n-1||l<Math.PI)&&f.push(x,y,_)}this.setIndex(f),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(v,3)),this.setAttribute("uv",new Yt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ai=class i extends he{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new P,f=new P,g=new P;for(let v=0;v<=n;v++){let p=o+v/n*a;for(let m=0;m<=s;m++){let b=m/s*r;f.x=(t+e*Math.cos(p))*Math.cos(b),f.y=(t+e*Math.cos(p))*Math.sin(b),f.z=e*Math.sin(p),c.push(f.x,f.y,f.z),u.x=t*Math.cos(b),u.y=t*Math.sin(b),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(m/s),d.push(v/n)}}for(let v=1;v<=n;v++)for(let p=1;p<=s;p++){let m=(s+1)*v+p-1,b=(s+1)*(v-1)+p-1,M=(s+1)*(v-1)+p,x=(s+1)*v+p;l.push(m,b,x),l.push(b,M,x)}this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Ds=class i extends he{constructor(t=new er(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new P,l=new P,c=new it,h=new P,d=[],u=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Yt(d,3)),this.setAttribute("normal",new Yt(u,3)),this.setAttribute("uv",new Yt(f,2));function v(){for(let M=0;M<e;M++)p(M);p(r===!1?e:0),b(),m()}function p(M){h=t.getPointAt(M/e,h);let x=o.normals[M],y=o.binormals[M];for(let _=0;_<=s;_++){let E=_/s*Math.PI*2,S=Math.sin(E),T=-Math.cos(E);l.x=T*x.x+S*y.x,l.y=T*x.y+S*y.y,l.z=T*x.z+S*y.z,l.normalize(),u.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,d.push(a.x,a.y,a.z)}}function m(){for(let M=1;M<=e;M++)for(let x=1;x<=s;x++){let y=(s+1)*(M-1)+(x-1),_=(s+1)*M+(x-1),E=(s+1)*M+x,S=(s+1)*(M-1)+x;g.push(y,_,S),g.push(_,E,S)}}function b(){for(let M=0;M<=e;M++)for(let x=0;x<=s;x++)c.x=M/e,c.y=x/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new ic[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function hr(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Cp(s))s.isRenderTargetTexture?(Qt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Cp(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function En(i){let t={};for(let e=0;e<i.length;e++){let n=hr(i[e]);for(let s in n)t[s]=n[s]}return t}function Cp(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function wx(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ud(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}var _n={clone:hr,merge:En},Ex=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,pe=class extends bi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ex,this.fragmentShader=Tx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=hr(t.uniforms),this.uniformsGroups=wx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Nt().setHex(s.value);break;case"v2":this.uniforms[n].value=new it().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Be().fromArray(s.value);break;case"m3":this.uniforms[n].value=new oe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new se().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Wr=class extends pe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},De=class extends bi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zr,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ta=class extends De{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new it(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ue(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Nt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Nt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Nt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ea=class extends bi{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zr,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},na=class extends bi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zr,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=bc,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},rc=class extends bi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=tm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},oc=class extends bi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ir(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Ou(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ls=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ac=class extends Ls{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ku,endingEnd:ku}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Hu:r=t,a=2*e-n;break;case Gu:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Hu:o=t,l=2*n-e;break;case Gu:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),v=g*g,p=v*g,m=-u*p+2*u*v-u*g,b=(1+u)*p+(-1.5-2*u)*v+(-.5+u)*g+1,M=(-1-f)*p+(1.5+f)*v+.5*g,x=f*p-f*v;for(let y=0;y!==a;++y)r[y]=m*o[h+y]+b*o[c+y]+M*o[l+y]+x*o[d+y];return r}},lc=class extends Ls{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},cc=class extends Ls{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},hc=class extends Ls{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-e)/(s-e),v=1-g;for(let p=0;p!==a;++p)r[p]=o[c+p]*v+o[l+p]*g;return r}let u=a*2,f=t-1;for(let g=0;g!==a;++g){let v=o[c+g],p=o[l+g],m=f*u+g*2,b=d[m],M=d[m+1],x=t*u+g*2,y=h[x],_=h[x+1],E=Rx(n,e,b,y,s);r[g]=_m(E,v,M,_,p)}return r}};function _m(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function Ax(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function Rx(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=_m(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=Ax(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Qn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ir(e,this.TimeBufferType),this.values=Ir(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ir(t.times,Array),values:Ir(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Ou(t.settings)&&(n.settings={inTangents:Ir(t.settings.inTangents,Array),outTangents:Ir(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new cc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new lc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ac(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new hc(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Do:e=this.InterpolantFactoryMethodDiscrete;break;case ql:e=this.InterpolantFactoryMethodLinear;break;case Fl:e=this.InterpolantFactoryMethodSmooth;break;case zu:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Qt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Do;case this.InterpolantFactoryMethodLinear:return ql;case this.InterpolantFactoryMethodSmooth:return Fl;case this.InterpolantFactoryMethodBezier:return zu}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Ou(this.settings)&&(Pp(this.settings.inTangents,t),Pp(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(ee("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(ee("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){ee("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){ee("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Ig(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){ee("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Fl,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){let v=e[d+g];if(v!==e[u+g]||v!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Ou(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Pp(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Qn.prototype.ValueTypeName="";Qn.prototype.TimeBufferType=Float32Array;Qn.prototype.ValueBufferType=Float32Array;Qn.prototype.DefaultInterpolation=ql;var Ns=class extends Qn{constructor(t,e,n){super(t,e,n)}};Ns.prototype.ValueTypeName="bool";Ns.prototype.ValueBufferType=Array;Ns.prototype.DefaultInterpolation=Do;Ns.prototype.InterpolantFactoryMethodLinear=void 0;Ns.prototype.InterpolantFactoryMethodSmooth=void 0;var uc=class extends Qn{constructor(t,e,n,s){super(t,e,n,s)}};uc.prototype.ValueTypeName="color";var dc=class extends Qn{constructor(t,e,n,s){super(t,e,n,s)}};dc.prototype.ValueTypeName="number";var fc=class extends Ls{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)cn.slerpFlat(r,0,o,c-a,o,c,l);return r}},ia=class extends Qn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new fc(this.times,this.values,this.getValueSize(),t)}};ia.prototype.ValueTypeName="quaternion";ia.prototype.InterpolantFactoryMethodSmooth=void 0;var Us=class extends Qn{constructor(t,e,n){super(t,e,n)}};Us.prototype.ValueTypeName="string";Us.prototype.ValueBufferType=Array;Us.prototype.DefaultInterpolation=Do;Us.prototype.InterpolantFactoryMethodLinear=void 0;Us.prototype.InterpolantFactoryMethodSmooth=void 0;var pc=class extends Qn{constructor(t,e,n,s){super(t,e,n,s)}};pc.prototype.ValueTypeName="vector";var mc=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ym=new mc,gc=class{constructor(t){this.manager=t!==void 0?t:ym,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};gc.DEFAULT_MATERIAL_NAME="__DEFAULT";var sa=class extends xn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},sr=class extends sa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Nt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Bu=new se,Ip=new P,Dp=new P,xc=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zr,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new Be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Ip.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ip),Dp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Dp),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Bu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Bu,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Ur||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Bu)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Nl=new P,Ul=new cn,Fi=new P,ra=class extends xn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Nl,Ul,Fi),Fi.x===1&&Fi.y===1&&Fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Nl,Ul,Fi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Nl,Ul,Fi),Fi.x===1&&Fi.y===1&&Fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Nl,Ul,Fi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Rs=new P,Lp=new it,Np=new it,bn=class extends ra{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Yl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(fu*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Yl*2*Math.atan(Math.tan(fu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Rs.x,Rs.y).multiplyScalar(-t/Rs.z),Rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Rs.x,Rs.y).multiplyScalar(-t/Rs.z)}getViewSize(t,e){return this.getViewBounds(t,Lp,Np),e.subVectors(Np,Lp)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(fu*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Gi=class extends ra{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Yu=class extends xc{constructor(){super(new Gi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},rr=class extends sa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xn.DEFAULT_UP),this.updateMatrix(),this.target=new xn,this.shadow=new Yu}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Dr=-90,Lr=1,vc=class extends xn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new bn(Dr,Lr,t,e);s.layers=this.layers,this.add(s);let r=new bn(Dr,Lr,t,e);r.layers=this.layers,this.add(r);let o=new bn(Dr,Lr,t,e);o.layers=this.layers,this.add(o);let a=new bn(Dr,Lr,t,e);a.layers=this.layers,this.add(a);let l=new bn(Dr,Lr,t,e);l.layers=this.layers,this.add(l);let c=new bn(Dr,Lr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},_c=class extends bn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},oa=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Cx.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Cx(){this._document.hidden===!1&&this.reset()}var dd="\\[\\]\\.:\\/",Px=new RegExp("["+dd+"]","g"),fd="[^"+dd+"]",Ix="[^"+dd.replace("\\.","")+"]",Dx=/((?:WC+[\/:])*)/.source.replace("WC",fd),Lx=/(WCOD+)?/.source.replace("WCOD",Ix),Nx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",fd),Ux=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",fd),Fx=new RegExp("^"+Dx+Lx+Nx+Ux+"$"),Ox=["material","materials","bones","map"],Zu=class{constructor(t,e,n){let s=n||We.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},We=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Px,"")}static parseTrackName(t){let e=Fx.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ox.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Qt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){ee("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){ee("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){ee("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){ee("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){ee("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){ee("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){ee("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;ee("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){ee("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){ee("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};We.Composite=Zu;We.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};We.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};We.prototype.GetterByBindingType=[We.prototype._getValue_direct,We.prototype._getValue_array,We.prototype._getValue_arrayElement,We.prototype._getValue_toArray];We.prototype.SetterByBindingTypeAndVersioning=[[We.prototype._setValue_direct,We.prototype._setValue_direct_setNeedsUpdate,We.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[We.prototype._setValue_array,We.prototype._setValue_array_setNeedsUpdate,We.prototype._setValue_array_setMatrixWorldNeedsUpdate],[We.prototype._setValue_arrayElement,We.prototype._setValue_arrayElement_setNeedsUpdate,We.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[We.prototype._setValue_fromArray,We.prototype._setValue_fromArray_setNeedsUpdate,We.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ab=new Float32Array(1);var _d=class _d{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};_d.prototype.isMatrix2=!0;var $u=_d;function pd(i,t,e,n){let s=Bx(n);switch(e){case od:return i*t;case Wi:return i*t/s.components*s.byteLength;case Pc:return i*t/s.components*s.byteLength;case zs:return i*t*2/s.components*s.byteLength;case Ic:return i*t*2/s.components*s.byteLength;case ad:return i*t*3/s.components*s.byteLength;case Gn:return i*t*4/s.components*s.byteLength;case Dc:return i*t*4/s.components*s.byteLength;case _a:case ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ma:case Sa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Nc:case Fc:return Math.max(i,16)*Math.max(t,8)/4;case Lc:case Uc:return Math.max(i,8)*Math.max(t,8)/2;case Oc:case Bc:case kc:case Hc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case zc:case ba:case Gc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Wc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Xc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case qc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Yc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Zc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case $c:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Jc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Kc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case jc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Qc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case th:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case eh:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case nh:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ih:case sh:case rh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case oh:case ah:return Math.ceil(i/4)*Math.ceil(t/4)*8;case wa:case lh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Bx(i){switch(i){case wn:case nd:return{byteLength:1,components:1};case Yr:case id:case Xe:return{byteLength:2,components:1};case Rc:case Cc:return{byteLength:2,components:4};case Ai:case Ac:case hi:return{byteLength:4,components:1};case sd:case rd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Qt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Gm(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Xx(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){let g=d[u],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){let v=d[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var qx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Zx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$x=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Kx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ev=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,nv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,iv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ov=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,av=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,uv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,dv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,fv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,pv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,mv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,vv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_v=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sv="gl_FragColor = linearToOutputTexel( gl_FragColor );",bv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Ev=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Tv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Av=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Iv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Nv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Uv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ov=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Bv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,zv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wv=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yv=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zv=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,$v=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,t_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,e_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,n_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,i_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,s_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,r_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,o_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,a_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l_=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,c_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,u_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,d_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,m_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,g_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,x_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,v_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,__=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,y_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,M_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,S_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,b_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,w_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,E_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,T_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,A_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,R_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,C_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,P_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,I_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,D_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,L_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,N_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,F_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,O_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,B_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,z_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,k_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,H_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,G_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,V_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,W_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,X_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,q_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Y_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,K_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,j_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Q_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ty=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ey=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ny=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,iy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ry=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,oy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ay=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ly=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,uy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,py=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,my=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,xy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_y=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,My=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,by=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ey=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jt={alphahash_fragment:qx,alphahash_pars_fragment:Yx,alphamap_fragment:Zx,alphamap_pars_fragment:$x,alphatest_fragment:Jx,alphatest_pars_fragment:Kx,aomap_fragment:jx,aomap_pars_fragment:Qx,batching_pars_vertex:tv,batching_vertex:ev,begin_vertex:nv,beginnormal_vertex:iv,bsdfs:sv,iridescence_fragment:rv,bumpmap_pars_fragment:ov,clipping_planes_fragment:av,clipping_planes_pars_fragment:lv,clipping_planes_pars_vertex:cv,clipping_planes_vertex:hv,color_fragment:uv,color_pars_fragment:dv,color_pars_vertex:fv,color_vertex:pv,common:mv,cube_uv_reflection_fragment:gv,defaultnormal_vertex:xv,displacementmap_pars_vertex:vv,displacementmap_vertex:_v,emissivemap_fragment:yv,emissivemap_pars_fragment:Mv,colorspace_fragment:Sv,colorspace_pars_fragment:bv,envmap_fragment:wv,envmap_common_pars_fragment:Ev,envmap_pars_fragment:Tv,envmap_pars_vertex:Av,envmap_physical_pars_fragment:Bv,envmap_vertex:Rv,fog_vertex:Cv,fog_pars_vertex:Pv,fog_fragment:Iv,fog_pars_fragment:Dv,gradientmap_pars_fragment:Lv,lightmap_pars_fragment:Nv,lights_lambert_fragment:Uv,lights_lambert_pars_fragment:Fv,lights_pars_begin:Ov,lights_toon_fragment:zv,lights_toon_pars_fragment:kv,lights_phong_fragment:Hv,lights_phong_pars_fragment:Gv,lights_physical_fragment:Vv,lights_physical_pars_fragment:Wv,lights_fragment_begin:Xv,lights_fragment_maps:qv,lights_fragment_end:Yv,lightprobes_pars_fragment:Zv,logdepthbuf_fragment:$v,logdepthbuf_pars_fragment:Jv,logdepthbuf_pars_vertex:Kv,logdepthbuf_vertex:jv,map_fragment:Qv,map_pars_fragment:t_,map_particle_fragment:e_,map_particle_pars_fragment:n_,metalnessmap_fragment:i_,metalnessmap_pars_fragment:s_,morphinstance_vertex:r_,morphcolor_vertex:o_,morphnormal_vertex:a_,morphtarget_pars_vertex:l_,morphtarget_vertex:c_,normal_fragment_begin:h_,normal_fragment_maps:u_,normal_pars_fragment:d_,normal_pars_vertex:f_,normal_vertex:p_,normalmap_pars_fragment:m_,clearcoat_normal_fragment_begin:g_,clearcoat_normal_fragment_maps:x_,clearcoat_pars_fragment:v_,iridescence_pars_fragment:__,opaque_fragment:y_,packing:M_,premultiplied_alpha_fragment:S_,project_vertex:b_,dithering_fragment:w_,dithering_pars_fragment:E_,roughnessmap_fragment:T_,roughnessmap_pars_fragment:A_,shadowmap_pars_fragment:R_,shadowmap_pars_vertex:C_,shadowmap_vertex:P_,shadowmask_pars_fragment:I_,skinbase_vertex:D_,skinning_pars_vertex:L_,skinning_vertex:N_,skinnormal_vertex:U_,specularmap_fragment:F_,specularmap_pars_fragment:O_,tonemapping_fragment:B_,tonemapping_pars_fragment:z_,transmission_fragment:k_,transmission_pars_fragment:H_,uv_pars_fragment:G_,uv_pars_vertex:V_,uv_vertex:W_,worldpos_vertex:X_,background_vert:q_,background_frag:Y_,backgroundCube_vert:Z_,backgroundCube_frag:$_,cube_vert:J_,cube_frag:K_,depth_vert:j_,depth_frag:Q_,distance_vert:ty,distance_frag:ey,equirect_vert:ny,equirect_frag:iy,linedashed_vert:sy,linedashed_frag:ry,meshbasic_vert:oy,meshbasic_frag:ay,meshlambert_vert:ly,meshlambert_frag:cy,meshmatcap_vert:hy,meshmatcap_frag:uy,meshnormal_vert:dy,meshnormal_frag:fy,meshphong_vert:py,meshphong_frag:my,meshphysical_vert:gy,meshphysical_frag:xy,meshtoon_vert:vy,meshtoon_frag:_y,points_vert:yy,points_frag:My,shadow_vert:Sy,shadow_frag:by,sprite_vert:wy,sprite_frag:Ey},Tt={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new oe},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new oe}},envmap:{envMap:{value:null},envMapRotation:{value:new oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new oe},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0},uvTransform:{value:new oe}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new oe},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0}}},qi={basic:{uniforms:En([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:En([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Nt(0)},envMapIntensity:{value:1}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:En([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:En([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:En([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Nt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:En([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:En([Tt.points,Tt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:En([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:En([Tt.common,Tt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:En([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:En([Tt.sprite,Tt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new oe}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distance:{uniforms:En([Tt.common,Tt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distance_vert,fragmentShader:jt.distance_frag},shadow:{uniforms:En([Tt.lights,Tt.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};qi.physical={uniforms:En([qi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new oe},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new oe},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new oe},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new oe},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new oe},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new oe}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var uh={r:0,b:0,g:0},Ty=new se,Vm=new oe;Vm.set(-1,0,0,0,1,0,0,0,1);function Ay(i,t,e,n,s,r){let o=new Nt(0),a=s===!0?0:1,l,c,h=null,d=0,u=null;function f(b){let M=b.isScene===!0?b.background:null;if(M&&M.isTexture){let x=b.backgroundBlurriness>0;M=t.get(M,x)}return M}function g(b){let M=!1,x=f(b);x===null?p(o,a):x&&x.isColor&&(p(x,1),M=!0);let y=i.xr.getEnvironmentBlendMode();y==="additive"?e.buffers.color.setClear(0,0,0,1,r):y==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(b,M){let x=f(M);x&&(x.isCubeTexture||x.mapping===xa)?(c===void 0&&(c=new Zt(new wi(1,1,1),new pe({name:"BackgroundCubeMaterial",uniforms:hr(qi.backgroundCube.uniforms),vertexShader:qi.backgroundCube.vertexShader,fragmentShader:qi.backgroundCube.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,_,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Ty.makeRotationFromEuler(M.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Vm),c.material.toneMapped=de.getTransfer(x.colorSpace)!==Te,(h!==x||d!==x.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Zt(new Dn(2,2),new pe({name:"BackgroundMaterial",uniforms:hr(qi.background.uniforms),vertexShader:qi.background.vertexShader,fragmentShader:qi.background.fragmentShader,side:Fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=de.getTransfer(x.colorSpace)!==Te,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||d!==x.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,M){b.getRGB(uh,ud(i)),e.buffers.color.setClear(uh.r,uh.g,uh.b,M,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,M=1){o.set(b),a=M,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,p(o,a)},render:g,addToRenderList:v,dispose:m}}function Ry(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(C,L,U,N,F){let H=!1,G=d(C,N,U,L);r!==G&&(r=G,c(r.object)),H=f(C,N,U,F),H&&g(C,N,U,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,x(C,L,U,N),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function h(C){return i.deleteVertexArray(C)}function d(C,L,U,N){let F=N.wireframe===!0,H=n[L.id];H===void 0&&(H={},n[L.id]=H);let G=C.isInstancedMesh===!0?C.id:0,K=H[G];K===void 0&&(K={},H[G]=K);let z=K[U.id];z===void 0&&(z={},K[U.id]=z);let V=z[F];return V===void 0&&(V=u(l()),z[F]=V),V}function u(C){let L=[],U=[],N=[];for(let F=0;F<e;F++)L[F]=0,U[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:N,object:C,attributes:{},index:null}}function f(C,L,U,N){let F=r.attributes,H=L.attributes,G=0,K=U.getAttributes();for(let z in K)if(K[z].location>=0){let I=F[z],ot=H[z];if(ot===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(ot=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(ot=C.instanceColor)),I===void 0||I.attribute!==ot||ot&&I.data!==ot.data)return!0;G++}return r.attributesNum!==G||r.index!==N}function g(C,L,U,N){let F={},H=L.attributes,G=0,K=U.getAttributes();for(let z in K)if(K[z].location>=0){let I=H[z];I===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(I=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(I=C.instanceColor));let ot={};ot.attribute=I,I&&I.data&&(ot.data=I.data),F[z]=ot,G++}r.attributes=F,r.attributesNum=G,r.index=N}function v(){let C=r.newAttributes;for(let L=0,U=C.length;L<U;L++)C[L]=0}function p(C){m(C,0)}function m(C,L){let U=r.newAttributes,N=r.enabledAttributes,F=r.attributeDivisors;U[C]=1,N[C]===0&&(i.enableVertexAttribArray(C),N[C]=1),F[C]!==L&&(i.vertexAttribDivisor(C,L),F[C]=L)}function b(){let C=r.newAttributes,L=r.enabledAttributes;for(let U=0,N=L.length;U<N;U++)L[U]!==C[U]&&(i.disableVertexAttribArray(U),L[U]=0)}function M(C,L,U,N,F,H,G){G===!0?i.vertexAttribIPointer(C,L,U,F,H):i.vertexAttribPointer(C,L,U,N,F,H)}function x(C,L,U,N){v();let F=N.attributes,H=U.getAttributes(),G=L.defaultAttributeValues;for(let K in H){let z=H[K];if(z.location>=0){let V=F[K];if(V===void 0&&(K==="instanceMatrix"&&C.instanceMatrix&&(V=C.instanceMatrix),K==="instanceColor"&&C.instanceColor&&(V=C.instanceColor)),V!==void 0){let I=V.normalized,ot=V.itemSize,ct=t.get(V);if(ct===void 0)continue;let gt=ct.buffer,It=ct.type,Y=ct.bytesPerElement,B=It===i.INT||It===i.UNSIGNED_INT||V.gpuType===Ac;if(V.isInterleavedBufferAttribute){let X=V.data,st=X.stride,pt=V.offset;if(X.isInstancedInterleavedBuffer){for(let ht=0;ht<z.locationSize;ht++)m(z.location+ht,X.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let ht=0;ht<z.locationSize;ht++)p(z.location+ht);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let ht=0;ht<z.locationSize;ht++)M(z.location+ht,ot/z.locationSize,It,I,st*Y,(pt+ot/z.locationSize*ht)*Y,B)}else{if(V.isInstancedBufferAttribute){for(let X=0;X<z.locationSize;X++)m(z.location+X,V.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let X=0;X<z.locationSize;X++)p(z.location+X);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let X=0;X<z.locationSize;X++)M(z.location+X,ot/z.locationSize,It,I,ot*Y,ot/z.locationSize*X*Y,B)}}else if(G!==void 0){let I=G[K];if(I!==void 0)switch(I.length){case 2:i.vertexAttrib2fv(z.location,I);break;case 3:i.vertexAttrib3fv(z.location,I);break;case 4:i.vertexAttrib4fv(z.location,I);break;default:i.vertexAttrib1fv(z.location,I)}}}}b()}function y(){T();for(let C in n){let L=n[C];for(let U in L){let N=L[U];for(let F in N){let H=N[F];for(let G in H)h(H[G].object),delete H[G];delete N[F]}}delete n[C]}}function _(C){if(n[C.id]===void 0)return;let L=n[C.id];for(let U in L){let N=L[U];for(let F in N){let H=N[F];for(let G in H)h(H[G].object),delete H[G];delete N[F]}}delete n[C.id]}function E(C){for(let L in n){let U=n[L];for(let N in U){let F=U[N];if(F[C.id]===void 0)continue;let H=F[C.id];for(let G in H)h(H[G].object),delete H[G];delete F[C.id]}}}function S(C){for(let L in n){let U=n[L],N=C.isInstancedMesh===!0?C.id:0,F=U[N];if(F!==void 0){for(let H in F){let G=F[H];for(let K in G)h(G[K].object),delete G[K];delete F[H]}delete U[N],Object.keys(U).length===0&&delete n[L]}}}function T(){A(),o=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:A,dispose:y,releaseStatesOfGeometry:_,releaseStatesOfObject:S,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:p,disableUnusedAttributes:b}}function Cy(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Py(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==Gn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let S=E===Xe&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==wn&&E!==hi&&!S&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Qt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Qt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),y=i.getParameter(i.MAX_SAMPLES),_=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:x,maxSamples:y,samples:_}}function Iy(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Mi,a=new oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let g=d.clippingPlanes,v=d.clipIntersection,p=d.clipShadows,m=i.get(d);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{let b=r?0:n,M=b*4,x=m.clippingState||null;l.value=x,x=h(g,u,M,f);for(let y=0;y!==M;++y)x[y]=e[y];m.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){let v=d!==null?d.length:0,p=null;if(v!==0){if(p=l.value,g!==!0||p===null){let m=f+v*4,b=u.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<m)&&(p=new Float32Array(m));for(let M=0,x=f;M!==v;++M,x+=4)o.copy(d[M]).applyMatrix4(b,a),o.normal.toArray(p,x),p[x+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}var Kr=4,Dy=6,Ly=20,Ny=256,Ea=new Gi,Mm=new Nt,yd=null,Md=0,Sd=0,bd=!1,Uy=new P,ur=new P,Qr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=Uy}=r;yd=this._renderer.getRenderTarget(),Md=this._renderer.getActiveCubeFace(),Sd=this._renderer.getActiveMipmapLevel(),bd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(yd,Md,Sd),this._renderer.xr.enabled=bd,t.scissorTest=!1,Jr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Os||t.mapping===lr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),yd=this._renderer.getRenderTarget(),Md=this._renderer.getActiveCubeFace(),Sd=this._renderer.getActiveMipmapLevel(),bd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Xe,format:Gn,colorSpace:Lo,depthBuffer:!1},s=Sm(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sm(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Fy(r)),this._blurMaterial=By(r,t,e),this._ggxMaterial=Oy(r,t,e)}return s}_compileMaterial(t){let e=new Zt(new he,t);this._renderer.compile(e,Ea)}_sceneToCubeUV(t,e,n,s,r){let l=new bn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Mm),d.toneMapping=Ti,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Zt(new wi,new Kn({name:"PMREM.Background",side:vn,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,p=v.material,m=!1,b=t.background;b?b.isColor&&(p.color.copy(b),t.background=null,m=!0):(p.color.copy(Mm),m=!0);for(let M=0;M<6;M++){let x=M%3;x===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):x===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));let y=this._cubeSize;Jr(s,x*y,M>2?y:0,y,y),d.setRenderTarget(s),m&&d.render(v,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=b}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Os||t.mapping===lr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wm()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bm());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Jr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Ea)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:g}=this,v=this._sizeLods[n],p=3*v*(n>g-Kr?n-g+Kr:0),m=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,Jr(r,p,m,3*v,2*v),s.setRenderTarget(r),s.render(a,Ea),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Jr(t,p,m,3*v,2*v),s.setRenderTarget(t),s.render(a,Ea)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Kr?s-this._lodMax+Kr:0),u=4*(this._cubeSize-h);Jr(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Ea)}};function Fy(i){let t=[],e=[],n=i,s=i-Kr+1+Dy;for(let r=0;r<s;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,g=new Float32Array(f*u*d),v=new Float32Array(f*u*d);for(let m=0;m<d;m++){let b=m%3*2/3-1,M=m>2?0:-1,x=[b,M,0,b+2/3,M,0,b+2/3,M+1,0,b,M,0,b+2/3,M+1,0,b,M+1,0];g.set(x,f*u*m);for(let y=0;y<u;y++){let _=h[y*2]*2-1,E=h[y*2+1]*2-1;m===0?ur.set(1,E,_):m===1?ur.set(-_,1,-E):m===2?ur.set(-_,E,1):m===3?ur.set(-1,E,-_):m===4?ur.set(-_,-1,E):ur.set(_,E,-1),ur.toArray(v,(m*u+y)*f)}}let p=new he;p.setAttribute("position",new re(g,f)),p.setAttribute("outputDirection",new re(v,f)),e.push(new Zt(p,null)),n>Kr&&n--}return{lodMeshes:e,sizeLods:t}}function Sm(i,t,e){let n=new Fe(i,t,e);return n.texture.mapping=xa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Jr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Oy(i,t,e){return new pe({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ny,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:mh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Qe,depthTest:!1,depthWrite:!1})}function By(i,t,e){return new pe({name:"SphericalGaussianBlur",defines:{SAMPLES:Ly,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:mh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Qe,depthTest:!1,depthWrite:!1})}function bm(){return new pe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qe,depthTest:!1,depthWrite:!1})}function wm(){return new pe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qe,depthTest:!1,depthWrite:!1})}function mh(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var fh=class extends Fe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Vo(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new wi(5,5,5),r=new pe({name:"CubemapFromEquirect",uniforms:hr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:vn,blending:Qe});r.uniforms.tEquirect.value=e;let o=new Zt(s,r),a=e.minFilter;return e.minFilter===ci&&(e.minFilter=Ze),new vc(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function zy(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===wc||f===Ec)if(t.has(u)){let g=t.get(u).texture;return a(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let v=new fh(g.height);return v.fromEquirectangularTexture(i,u),t.set(u,v),u.addEventListener("dispose",c),a(v.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let f=u.mapping,g=f===wc||f===Ec,v=f===Os||f===lr;if(g||v){let p=e.get(u),m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new Qr(i)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),p.texture;if(p!==void 0)return p.texture;{let b=u.image;return g&&b&&b.height>0||v&&b&&l(b)?(n===null&&(n=new Qr(i)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function a(u,f){return f===wc?u.mapping=Os:f===Ec&&(u.mapping=lr),u}function l(u){let f=0,g=6;for(let v=0;v<g;v++)u[v]!==void 0&&f++;return f===g}function c(u){let f=u.target;f.removeEventListener("dispose",c);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function ky(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Qs("WebGLRenderer: "+n+" extension not supported."),s}}}function Hy(i,t,e,n){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,g=d.attributes.position,v=0;if(g===void 0)return;if(f!==null){let b=f.array;v=f.version;for(let M=0,x=b.length;M<x;M+=3){let y=b[M+0],_=b[M+1],E=b[M+2];u.push(y,_,_,E,E,y)}}else{let b=g.array;v=g.version;for(let M=0,x=b.length/3-1;M<x;M+=3){let y=M+0,_=M+1,E=M+2;u.push(y,_,_,E,E,y)}}let p=new(g.count>=65535?ko:zo)(u,1);p.version=v;let m=r.get(d);m&&t.remove(m),r.set(d,p)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Gy(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*o,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let p=0;p<f;p++)v+=u[p];e.update(v,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Vy(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:ee("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Wy(i,t,e){let n=new WeakMap,s=new Be;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let T=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],M=0;f===!0&&(M=1),g===!0&&(M=2),v===!0&&(M=3);let x=a.attributes.position.count*M,y=1;x>t.maxTextureSize&&(y=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);let _=new Float32Array(x*y*4*d),E=new Fo(_,x,y,d);E.type=hi,E.needsUpdate=!0;let S=M*4;for(let A=0;A<d;A++){let C=p[A],L=m[A],U=b[A],N=x*y*4*A;for(let F=0;F<C.count;F++){let H=F*S;f===!0&&(s.fromBufferAttribute(C,F),_[N+H+0]=s.x,_[N+H+1]=s.y,_[N+H+2]=s.z,_[N+H+3]=0),g===!0&&(s.fromBufferAttribute(L,F),_[N+H+4]=s.x,_[N+H+5]=s.y,_[N+H+6]=s.z,_[N+H+7]=0),v===!0&&(s.fromBufferAttribute(U,F),_[N+H+8]=s.x,_[N+H+9]=s.y,_[N+H+10]=s.z,_[N+H+11]=U.itemSize===4?s.w:1)}}u={count:d,texture:E,size:new it(x,y)},n.set(a,u),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Xy(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var qy={[ua]:"LINEAR_TONE_MAPPING",[da]:"REINHARD_TONE_MAPPING",[fa]:"CINEON_TONE_MAPPING",[pa]:"ACES_FILMIC_TONE_MAPPING",[ma]:"AGX_TONE_MAPPING",[ga]:"NEUTRAL_TONE_MAPPING",[ar]:"CUSTOM_TONE_MAPPING"};function Yy(i,t,e,n,s,r){let o=new Fe(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new he;c.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Yt([0,2,0,0,2,0],2));let h=new Wr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Zt(c,h),u=new Gi(-1,1,1,-1,0,1),f=null,g=null,v=!1,p,m=null,b=[],M=!1;this.setSize=function(x,y){o.setSize(x,y),a!==null&&a.setSize(x,y),l!==null&&l.setSize(x,y);for(let _=0;_<b.length;_++){let E=b[_];E.setSize&&E.setSize(x,y)}},this.setEffects=function(x){b=x,M=b.length>0&&b[0].isRenderPass===!0;let y=o.width,_=o.height;b.length>0&&a===null&&(a=new Fe(y,_,{type:Xe,depthBuffer:!1,stencilBuffer:!1}),l=new Fe(y,_,{type:Xe,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<b.length;E++){let S=b[E];S.setSize&&S.setSize(y,_)}},this.begin=function(x,y){if(v||x.toneMapping===Ti&&b.length===0)return!1;if(m=y,y!==null){let _=y.width,E=y.height;(o.width!==_||o.height!==E)&&this.setSize(_,E)}return M===!1&&x.setRenderTarget(o),p=x.toneMapping,x.toneMapping=Ti,!0},this.hasRenderPass=function(){return M},this.end=function(x,y){x.toneMapping=p,v=!0;let _=o,E=a;for(let S=0;S<b.length;S++){let T=b[S];T.enabled!==!1&&(T.render(x,E,_,y),T.needsSwap!==!1&&(_=E,E=E===a?l:a))}if(f!==x.outputColorSpace||g!==x.toneMapping){f=x.outputColorSpace,g=x.toneMapping,h.defines={},de.getTransfer(f)===Te&&(h.defines.SRGB_TRANSFER="");let S=qy[g];S&&(h.defines[S]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=_.texture,x.setRenderTarget(m),x.render(d,u),m=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Wm=new Pn,Td=new oi(1,1),Xm=new Fo,qm=new Jl,Ym=new Vo,Em=[],Tm=[],Am=new Float32Array(16),Rm=new Float32Array(9),Cm=new Float32Array(4);function to(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Em[s];if(r===void 0&&(r=new Float32Array(s),Em[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function hn(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function un(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function gh(i,t){let e=Tm[t];e===void 0&&(e=new Int32Array(t),Tm[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Zy(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function $y(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;i.uniform2fv(this.addr,t),un(e,t)}}function Jy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(hn(e,t))return;i.uniform3fv(this.addr,t),un(e,t)}}function Ky(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;i.uniform4fv(this.addr,t),un(e,t)}}function jy(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),un(e,t)}else{if(hn(e,n))return;Cm.set(n),i.uniformMatrix2fv(this.addr,!1,Cm),un(e,n)}}function Qy(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),un(e,t)}else{if(hn(e,n))return;Rm.set(n),i.uniformMatrix3fv(this.addr,!1,Rm),un(e,n)}}function tM(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),un(e,t)}else{if(hn(e,n))return;Am.set(n),i.uniformMatrix4fv(this.addr,!1,Am),un(e,n)}}function eM(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function nM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;i.uniform2iv(this.addr,t),un(e,t)}}function iM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(hn(e,t))return;i.uniform3iv(this.addr,t),un(e,t)}}function sM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;i.uniform4iv(this.addr,t),un(e,t)}}function rM(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function oM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;i.uniform2uiv(this.addr,t),un(e,t)}}function aM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(hn(e,t))return;i.uniform3uiv(this.addr,t),un(e,t)}}function lM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;i.uniform4uiv(this.addr,t),un(e,t)}}function cM(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Td.compareFunction=e.isReversedDepthBuffer()?hh:ch,r=Td):r=Wm,e.setTexture2D(t||r,s)}function hM(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||qm,s)}function uM(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ym,s)}function dM(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Xm,s)}function fM(i){switch(i){case 5126:return Zy;case 35664:return $y;case 35665:return Jy;case 35666:return Ky;case 35674:return jy;case 35675:return Qy;case 35676:return tM;case 5124:case 35670:return eM;case 35667:case 35671:return nM;case 35668:case 35672:return iM;case 35669:case 35673:return sM;case 5125:return rM;case 36294:return oM;case 36295:return aM;case 36296:return lM;case 35678:case 36198:case 36298:case 36306:case 35682:return cM;case 35679:case 36299:case 36307:return hM;case 35680:case 36300:case 36308:case 36293:return uM;case 36289:case 36303:case 36311:case 36292:return dM}}function pM(i,t){i.uniform1fv(this.addr,t)}function mM(i,t){let e=to(t,this.size,2);i.uniform2fv(this.addr,e)}function gM(i,t){let e=to(t,this.size,3);i.uniform3fv(this.addr,e)}function xM(i,t){let e=to(t,this.size,4);i.uniform4fv(this.addr,e)}function vM(i,t){let e=to(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function _M(i,t){let e=to(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function yM(i,t){let e=to(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function MM(i,t){i.uniform1iv(this.addr,t)}function SM(i,t){i.uniform2iv(this.addr,t)}function bM(i,t){i.uniform3iv(this.addr,t)}function wM(i,t){i.uniform4iv(this.addr,t)}function EM(i,t){i.uniform1uiv(this.addr,t)}function TM(i,t){i.uniform2uiv(this.addr,t)}function AM(i,t){i.uniform3uiv(this.addr,t)}function RM(i,t){i.uniform4uiv(this.addr,t)}function CM(i,t,e){let n=this.cache,s=t.length,r=gh(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Td:o=Wm;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function PM(i,t,e){let n=this.cache,s=t.length,r=gh(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||qm,r[o])}function IM(i,t,e){let n=this.cache,s=t.length,r=gh(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ym,r[o])}function DM(i,t,e){let n=this.cache,s=t.length,r=gh(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Xm,r[o])}function LM(i){switch(i){case 5126:return pM;case 35664:return mM;case 35665:return gM;case 35666:return xM;case 35674:return vM;case 35675:return _M;case 35676:return yM;case 5124:case 35670:return MM;case 35667:case 35671:return SM;case 35668:case 35672:return bM;case 35669:case 35673:return wM;case 5125:return EM;case 36294:return TM;case 36295:return AM;case 36296:return RM;case 35678:case 36198:case 36298:case 36306:case 35682:return CM;case 35679:case 36299:case 36307:return PM;case 35680:case 36300:case 36308:case 36293:return IM;case 36289:case 36303:case 36311:case 36292:return DM}}var Ad=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=fM(e.type)}},Rd=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=LM(e.type)}},Cd=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},wd=/(\w+)(\])?(\[|\.)?/g;function Pm(i,t){i.seq.push(t),i.map[t.id]=t}function NM(i,t,e){let n=i.name,s=n.length;for(wd.lastIndex=0;;){let r=wd.exec(n),o=wd.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Pm(e,c===void 0?new Ad(a,i,t):new Rd(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Cd(a),Pm(e,d)),e=d}}}var jr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);NM(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Im(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var UM=37297,FM=0;function OM(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Dm=new oe;function BM(i){de._getMatrix(Dm,de.workingColorSpace,i);let t=`mat3( ${Dm.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(i)){case No:return[t,"LinearTransferOETF"];case Te:return[t,"sRGBTransferOETF"];default:return Qt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Lm(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+OM(i.getShaderSource(t),a)}else return r}function zM(i,t){let e=BM(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var kM={[ua]:"Linear",[da]:"Reinhard",[fa]:"Cineon",[pa]:"ACESFilmic",[ma]:"AgX",[ga]:"Neutral",[ar]:"Custom"};function HM(i,t){let e=kM[t];return e===void 0?(Qt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var dh=new P;function GM(){de.getLuminanceCoefficients(dh);let i=dh.x.toFixed(4),t=dh.y.toFixed(4),e=dh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function VM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Aa).join(`
`)}function WM(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function XM(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Aa(i){return i!==""}function Nm(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Um(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var qM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pd(i){return i.replace(qM,ZM)}var YM=new Map;function ZM(i,t){let e=jt[t];if(e===void 0){let n=YM.get(t);if(n!==void 0)e=jt[n],Qt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Pd(e)}var $M=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fm(i){return i.replace($M,JM)}function JM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Om(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var KM={[aa]:"SHADOWMAP_TYPE_PCF",[Xr]:"SHADOWMAP_TYPE_VSM"};function jM(i){return KM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var QM={[Os]:"ENVMAP_TYPE_CUBE",[lr]:"ENVMAP_TYPE_CUBE",[xa]:"ENVMAP_TYPE_CUBE_UV"};function t1(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":QM[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var e1={[lr]:"ENVMAP_MODE_REFRACTION"};function n1(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":e1[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var i1={[bc]:"ENVMAP_BLENDING_MULTIPLY",[Kp]:"ENVMAP_BLENDING_MIX",[jp]:"ENVMAP_BLENDING_ADD"};function s1(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":i1[i.combine]||"ENVMAP_BLENDING_NONE"}function r1(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function o1(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=jM(e),c=t1(e),h=n1(e),d=s1(e),u=r1(e),f=VM(e),g=WM(r),v=s.createProgram(),p,m,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Aa).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Aa).join(`
`),m.length>0&&(m+=`
`)):(p=[Om(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Aa).join(`
`),m=[Om(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ti?"#define TONE_MAPPING":"",e.toneMapping!==Ti?jt.tonemapping_pars_fragment:"",e.toneMapping!==Ti?HM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,zM("linearToOutputTexel",e.outputColorSpace),GM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Aa).join(`
`)),o=Pd(o),o=Nm(o,e),o=Um(o,e),a=Pd(a),a=Nm(a,e),a=Um(a,e),o=Fm(o),a=Fm(a),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===ld?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ld?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let M=b+p+o,x=b+m+a,y=Im(s,s.VERTEX_SHADER,M),_=Im(s,s.FRAGMENT_SHADER,x);s.attachShader(v,y),s.attachShader(v,_),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function E(C){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(v)||"",U=s.getShaderInfoLog(y)||"",N=s.getShaderInfoLog(_)||"",F=L.trim(),H=U.trim(),G=N.trim(),K=!0,z=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,y,_);else{let V=Lm(s,y,"vertex"),I=Lm(s,_,"fragment");ee("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+F+`
`+V+`
`+I)}else F!==""?Qt("WebGLProgram: Program Info Log:",F):(H===""||G==="")&&(z=!1);z&&(C.diagnostics={runnable:K,programLog:F,vertexShader:{log:H,prefix:p},fragmentShader:{log:G,prefix:m}})}s.deleteShader(y),s.deleteShader(_),S=new jr(s,v),T=XM(s,v)}let S;this.getUniforms=function(){return S===void 0&&E(this),S};let T;this.getAttributes=function(){return T===void 0&&E(this),T};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(v,UM)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=FM++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=y,this.fragmentShader=_,this}var a1=0,Id=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Dd(t),e.set(t,n)),n}},Dd=class{constructor(t){this.id=a1++,this.code=t,this.usedTimes=0}};function l1(i){return i===zs||i===ba||i===wa}function c1(i,t,e,n,s,r){let o=new Oo,a=new Id,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function v(S,T,A,C,L,U){let N=C.fog,F=L.geometry,H=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?C.environment:null,G=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,K=t.get(S.envMap||H,G),z=K&&K.mapping===xa?K.image.height:null,V=f[S.type];S.precision!==null&&(u=n.getMaxPrecision(S.precision),u!==S.precision&&Qt("WebGLProgram.getParameters:",S.precision,"not supported, using",u,"instead."));let I=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ot=I!==void 0?I.length:0,ct=0;F.morphAttributes.position!==void 0&&(ct=1),F.morphAttributes.normal!==void 0&&(ct=2),F.morphAttributes.color!==void 0&&(ct=3);let gt,It,Y,B;if(V){let ke=qi[V];gt=ke.vertexShader,It=ke.fragmentShader}else{gt=S.vertexShader,It=S.fragmentShader;let ke=a.getVertexShaderStage(S),Ae=a.getFragmentShaderStage(S);a.update(S,ke,Ae),Y=ke.id,B=Ae.id}let X=i.getRenderTarget(),st=i.state.buffers.depth.getReversed(),pt=L.isInstancedMesh===!0,ht=L.isBatchedMesh===!0,xt=!!S.map,Bt=!!S.matcap,j=!!K,lt=!!S.aoMap,dt=!!S.lightMap,ft=!!S.bumpMap&&S.wireframe===!1,vt=!!S.normalMap,Xt=!!S.displacementMap,Gt=!!S.emissiveMap,Jt=!!S.metalnessMap,ne=!!S.roughnessMap,O=S.anisotropy>0,ye=S.clearcoat>0,le=S.dispersion>0,D=S.retroreflectivity>0,w=S.iridescence>0,q=S.sheen>0,Z=S.transmission>0,tt=O&&!!S.anisotropyMap,mt=ye&&!!S.clearcoatMap,_t=ye&&!!S.clearcoatNormalMap,nt=ye&&!!S.clearcoatRoughnessMap,at=w&&!!S.iridescenceMap,St=w&&!!S.iridescenceThicknessMap,kt=q&&!!S.sheenColorMap,Mt=q&&!!S.sheenRoughnessMap,yt=!!S.specularMap,Ut=!!S.specularColorMap,Vt=!!S.specularIntensityMap,ie=Z&&!!S.transmissionMap,W=Z&&!!S.thicknessMap,wt=!!S.gradientMap,rt=!!S.alphaMap,Et=S.alphaTest>0,Pt=!!S.alphaHash,ut=!!S.extensions,Wt=Ti;S.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Wt=i.toneMapping);let zt={shaderID:V,shaderType:S.type,shaderName:S.name,vertexShader:gt,fragmentShader:It,defines:S.defines,customVertexShaderID:Y,customFragmentShaderID:B,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:u,batching:ht,batchingColor:ht&&L._colorsTexture!==null,instancing:pt,instancingColor:pt&&L.instanceColor!==null,instancingMorph:pt&&L.morphTexture!==null,outputColorSpace:X===null?i.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:de.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:xt,matcap:Bt,envMap:j,envMapMode:j&&K.mapping,envMapCubeUVHeight:z,aoMap:lt,lightMap:dt,bumpMap:ft,normalMap:vt,displacementMap:Xt,emissiveMap:Gt,normalMapObjectSpace:vt&&S.normalMapType===em,normalMapTangentSpace:vt&&S.normalMapType===Zr,packedNormalMap:vt&&S.normalMapType===Zr&&l1(S.normalMap.format),metalnessMap:Jt,roughnessMap:ne,anisotropy:O,anisotropyMap:tt,clearcoat:ye,clearcoatMap:mt,clearcoatNormalMap:_t,clearcoatRoughnessMap:nt,dispersion:le,retroreflection:D,iridescence:w,iridescenceMap:at,iridescenceThicknessMap:St,sheen:q,sheenColorMap:kt,sheenRoughnessMap:Mt,specularMap:yt,specularColorMap:Ut,specularIntensityMap:Vt,transmission:Z,transmissionMap:ie,thicknessMap:W,gradientMap:wt,opaque:S.transparent===!1&&S.blending===qr&&S.alphaToCoverage===!1,alphaMap:rt,alphaTest:Et,alphaHash:Pt,combine:S.combine,mapUv:xt&&g(S.map.channel),aoMapUv:lt&&g(S.aoMap.channel),lightMapUv:dt&&g(S.lightMap.channel),bumpMapUv:ft&&g(S.bumpMap.channel),normalMapUv:vt&&g(S.normalMap.channel),displacementMapUv:Xt&&g(S.displacementMap.channel),emissiveMapUv:Gt&&g(S.emissiveMap.channel),metalnessMapUv:Jt&&g(S.metalnessMap.channel),roughnessMapUv:ne&&g(S.roughnessMap.channel),anisotropyMapUv:tt&&g(S.anisotropyMap.channel),clearcoatMapUv:mt&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:_t&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:St&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:kt&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&g(S.sheenRoughnessMap.channel),specularMapUv:yt&&g(S.specularMap.channel),specularColorMapUv:Ut&&g(S.specularColorMap.channel),specularIntensityMapUv:Vt&&g(S.specularIntensityMap.channel),transmissionMapUv:ie&&g(S.transmissionMap.channel),thicknessMapUv:W&&g(S.thicknessMap.channel),alphaMapUv:rt&&g(S.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(vt||O),vertexNormals:!!F.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!F.attributes.uv&&(xt||rt),fog:!!N,useFog:S.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||F.attributes.normal===void 0&&vt===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:st,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:ct,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:U.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Wt,decodeVideoTexture:xt&&S.map.isVideoTexture===!0&&de.getTransfer(S.map.colorSpace)===Te,decodeVideoTextureEmissive:Gt&&S.emissiveMap.isVideoTexture===!0&&de.getTransfer(S.emissiveMap.colorSpace)===Te,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===$e,flipSided:S.side===vn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ut&&S.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ut&&S.extensions.multiDraw===!0||ht)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return zt.vertexUv1s=l.has(1),zt.vertexUv2s=l.has(2),zt.vertexUv3s=l.has(3),l.clear(),zt}function p(S){let T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(let A in S.defines)T.push(A),T.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(m(T,S),b(T,S),T.push(i.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function m(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numSunLights),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numSunLightShadows),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function b(S,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),S.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),S.push(o.mask)}function M(S){let T=f[S.type],A;if(T){let C=qi[T];A=_n.clone(C.uniforms)}else A=S.uniforms;return A}function x(S,T){let A=h.get(T);return A!==void 0?++A.usedTimes:(A=new o1(i,T,S,s),c.push(A),h.set(T,A)),A}function y(S){if(--S.usedTimes===0){let T=c.indexOf(S);c[T]=c[c.length-1],c.pop(),h.delete(S.cacheKey),S.destroy()}}function _(S){a.remove(S)}function E(){a.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:M,acquireProgram:x,releaseProgram:y,releaseShaderCache:_,programs:c,dispose:E}}function h1(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function u1(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Bm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zm(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,g,v,p,m){let b=i[t];return b===void 0?(b={id:u.id,object:u,geometry:f,material:g,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:p,group:m},i[t]=b):(b.id=u.id,b.object=u,b.geometry=f,b.material=g,b.materialVariant=o(u),b.groupOrder=v,b.renderOrder=u.renderOrder,b.z=p,b.group=m),t++,b}function l(u,f,g,v,p,m,b){b.reversedDepth===!0&&(p=-p);let M=a(u,f,g,v,p,m);g.transmission>0?n.push(M):g.transparent===!0?s.push(M):e.push(M)}function c(u,f,g,v,p,m){let b=a(u,f,g,v,p,m);g.transmission>0?n.unshift(b):g.transparent===!0?s.unshift(b):e.unshift(b)}function h(u,f){e.length>1&&e.sort(u||u1),n.length>1&&n.sort(f||Bm),s.length>1&&s.sort(f||Bm)}function d(){for(let u=t,f=i.length;u<f;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function d1(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new zm,i.set(n,[o])):s>=r.length?(o=new zm,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function f1(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new P,color:new Nt};break;case"SpotLight":e={position:new P,direction:new P,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function p1(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var m1=0;function g1(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function x1(i){let t=new f1,e=p1(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new se,o=new se;function a(c){let h=0,d=0,u=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,b=0,M=0,x=0,y=0,_=0,E=0,S=0,T=0,A=0;c.sort(g1);for(let L=0,U=c.length;L<U;L++){let N=c[L],F=N.color,H=N.intensity,G=N.distance,K=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===zs?K=N.shadow.map.texture:K=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=F.r*H,d+=F.g*H,u+=F.b*H;else if(N.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(N.sh.coefficients[z],H);A++}else if(N.isSunLight){let z=t.get(N);if(z.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let V=N.shadow,I=e.get(N);I.shadowIntensity=V.intensity,I.shadowBias=V.bias,I.shadowNormalBias=V.normalBias,I.shadowRadius=V.radius,I.shadowMapSize.copy(V.mapSize).multiply(V.getFrameExtents()),n.sunShadow[g]=I,n.sunShadowMap[g]=K;let ot=V.getViewportCount();for(let ct=0;ct<ot;ct++)n.sunShadowMatrix[v+ct]=V.getMatrix(ct),n.sunShadowCascade[v+ct]=V._cascadeData[ct];v+=ot,g++}n.sun[f]=z,f++}else if(N.isDirectionalLight){let z=t.get(N);if(z.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let V=N.shadow,I=e.get(N);I.shadowIntensity=V.intensity,I.shadowBias=V.bias,I.shadowNormalBias=V.normalBias,I.shadowRadius=V.radius,I.shadowMapSize=V.mapSize,n.directionalShadow[p]=I,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=N.shadow.matrix,y++}n.directional[p]=z,p++}else if(N.isSpotLight){let z=t.get(N);z.position.setFromMatrixPosition(N.matrixWorld),z.color.copy(F).multiplyScalar(H),z.distance=G,z.coneCos=Math.cos(N.angle),z.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),z.decay=N.decay,n.spot[b]=z;let V=N.shadow;if(N.map&&(n.spotLightMap[S]=N.map,S++,V.updateMatrices(N),N.castShadow&&T++),n.spotLightMatrix[b]=V.matrix,N.castShadow){let I=e.get(N);I.shadowIntensity=V.intensity,I.shadowBias=V.bias,I.shadowNormalBias=V.normalBias,I.shadowRadius=V.radius,I.shadowMapSize=V.mapSize,n.spotShadow[b]=I,n.spotShadowMap[b]=K,E++}b++}else if(N.isRectAreaLight){let z=t.get(N);z.color.copy(F).multiplyScalar(H),z.halfWidth.set(N.width*.5,0,0),z.halfHeight.set(0,N.height*.5,0),n.rectArea[M]=z,M++}else if(N.isPointLight){let z=t.get(N);if(z.color.copy(N.color).multiplyScalar(N.intensity),z.distance=N.distance,z.decay=N.decay,N.castShadow){let V=N.shadow,I=e.get(N);I.shadowIntensity=V.intensity,I.shadowBias=V.bias,I.shadowNormalBias=V.normalBias,I.shadowRadius=V.radius,I.shadowMapSize=V.mapSize,I.shadowCameraNear=V.camera.near,I.shadowCameraFar=V.camera.far,n.pointShadow[m]=I,n.pointShadowMap[m]=K,n.pointShadowMatrix[m]=N.shadow.matrix,_++}n.point[m]=z,m++}else if(N.isHemisphereLight){let z=t.get(N);z.skyColor.copy(N.color).multiplyScalar(H),z.groundColor.copy(N.groundColor).multiplyScalar(H),n.hemi[x]=z,x++}}M>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let C=n.hash;(C.sunLength!==f||C.directionalLength!==p||C.pointLength!==m||C.spotLength!==b||C.rectAreaLength!==M||C.hemiLength!==x||C.numSunShadows!==g||C.numDirectionalShadows!==y||C.numPointShadows!==_||C.numSpotShadows!==E||C.numSpotMaps!==S||C.numLightProbes!==A)&&(n.sun.length=f,n.directional.length=p,n.spot.length=b,n.rectArea.length=M,n.point.length=m,n.hemi.length=x,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.directionalShadowMatrix.length=y,n.pointShadow.length=_,n.pointShadowMap.length=_,n.pointShadowMatrix.length=_,n.spotShadow.length=E,n.spotShadowMap.length=E,n.spotLightMatrix.length=E+S-T,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,C.sunLength=f,C.directionalLength=p,C.pointLength=m,C.spotLength=b,C.rectAreaLength=M,C.hemiLength=x,C.numSunShadows=g,C.numDirectionalShadows=y,C.numPointShadows=_,C.numSpotShadows=E,C.numSpotMaps=S,C.numLightProbes=A,n.version=m1++)}function l(c,h){let d=0,u=0,f=0,g=0,v=0,p=0,m=h.matrixWorldInverse;for(let b=0,M=c.length;b<M;b++){let x=c[b];if(x.isSunLight){let y=n.sun[d];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),d++}else if(x.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(x.isSpotLight){let y=n.spot[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),g++}else if(x.isRectAreaLight){let y=n.rectArea[v];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),v++}else if(x.isPointLight){let y=n.point[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){let y=n.hemi[p];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),p++}}}return{setup:a,setupView:l,state:n}}function km(i){let t=new x1(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function v1(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new km(i),t.set(s,[a])):r>=o.length?(a=new km(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var _1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,y1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,M1=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],S1=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Hm=new se,Ta=new P,Ed=new P;function b1(i,t,e){let n=new zr,s=new it,r=new it,o=new Be,a=new rc,l=new oc,c={},h=e.maxTextureSize,d={[Fs]:vn,[vn]:Fs,[$e]:$e},u=new pe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:_1,fragmentShader:y1}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let g=new he;g.setAttribute("position",new re(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Zt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=aa;let m=this.type;this.render=function(_,E,S){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||_.length===0)return;this.type===Mc&&(Qt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=aa);let T=i.getRenderTarget(),A=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Qe),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let U=m!==this.type;U&&E.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(F=>F.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,F=_.length;N<F;N++){let H=_[N],G=H.shadow;if(G===void 0){Qt("WebGLShadowMap:",H,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let K=G.getFrameExtents();s.multiply(K),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,G.mapSize.y=r.y));let z=i.state.buffers.depth.getReversed();if(G.camera._reversedDepth=z,G.map===null||U===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===Xr){if(H.isPointLight){Qt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new Fe(s.x,s.y,{format:zs,type:Xe,minFilter:Ze,magFilter:Ze,generateMipmaps:!1}),G.map.texture.name=H.name+".shadowMap",G.map.depthTexture=new oi(s.x,s.y,hi),G.map.depthTexture.name=H.name+".shadowMapDepth",G.map.depthTexture.format=Bi,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=je,G.map.depthTexture.magFilter=je}else H.isPointLight?(G.map=new fh(s.x),G.map.depthTexture=new jl(s.x,Ai)):(G.map=new Fe(s.x,s.y),G.map.depthTexture=new oi(s.x,s.y,Ai)),G.map.depthTexture.name=H.name+".shadowMap",G.map.depthTexture.format=Bi,this.type===aa?(G.map.depthTexture.compareFunction=z?hh:ch,G.map.depthTexture.minFilter=Ze,G.map.depthTexture.magFilter=Ze):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=je,G.map.depthTexture.magFilter=je);G.camera.updateProjectionMatrix()}G.map.isWebGLCubeRenderTarget!==!0&&(G.map.width!==s.x||G.map.height!==s.y)&&G.map.setSize(s.x,s.y);let V=G.map.isWebGLCubeRenderTarget?6:G.getViewportCount();H.isPointLight!==!0&&G.updateMatrices(H,S);for(let I=0;I<V;I++){let ot=G.getCamera(I);if(H.isPointLight){let ct=G.camera,gt=G.matrix,It=H.distance||ct.far;It!==ct.far&&(ct.far=It,ct.updateProjectionMatrix()),Ta.setFromMatrixPosition(H.matrixWorld),ct.position.copy(Ta),Ed.copy(ct.position),Ed.add(M1[I]),ct.up.copy(S1[I]),ct.lookAt(Ed),ct.updateMatrixWorld(),gt.makeTranslation(-Ta.x,-Ta.y,-Ta.z),Hm.multiplyMatrices(ct.projectionMatrix,ct.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Hm,ct.coordinateSystem,ct.reversedDepth)}if(G.map.isWebGLCubeRenderTarget)i.setRenderTarget(G.map,I),i.clear();else{I===0&&(i.setRenderTarget(G.map),i.clear());let ct=G.getViewport(I);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),L.viewport(o)}n=G.getFrustum(I),x(E,S,ot,H,this.type)}G.isPointLightShadow!==!0&&this.type===Xr&&b(G,S),G.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(T,A,C)};function b(_,E){let S=t.update(v);u.defines.VSM_SAMPLES!==_.blurSamples&&(u.defines.VSM_SAMPLES=_.blurSamples,f.defines.VSM_SAMPLES=_.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),_.mapPass===null?_.mapPass=new Fe(s.x,s.y,{format:zs,type:Xe}):(_.mapPass.width!==_.map.width||_.mapPass.height!==_.map.height)&&_.mapPass.setSize(_.map.width,_.map.height),u.uniforms.shadow_pass.value=_.map.depthTexture,u.uniforms.resolution.value.set(_.map.width,_.map.height),u.uniforms.radius.value=_.radius,i.setRenderTarget(_.mapPass),i.clear(),i.renderBufferDirect(E,null,S,u,v,null),f.uniforms.shadow_pass.value=_.mapPass.texture,f.uniforms.resolution.value.set(_.map.width,_.map.height),f.uniforms.radius.value=_.radius,i.setRenderTarget(_.map),i.clear(),i.renderBufferDirect(E,null,S,f,v,null)}function M(_,E,S,T){let A=null,C=S.isPointLight===!0?_.customDistanceMaterial:_.customDepthMaterial;if(C!==void 0)A=C;else if(A=S.isPointLight===!0?l:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let L=A.uuid,U=E.uuid,N=c[L];N===void 0&&(N={},c[L]=N);let F=N[U];F===void 0&&(F=A.clone(),N[U]=F,E.addEventListener("dispose",y)),A=F}if(A.visible=E.visible,A.wireframe=E.wireframe,T===Xr?A.side=E.shadowSide!==null?E.shadowSide:E.side:A.side=E.shadowSide!==null?E.shadowSide:d[E.side],A.alphaMap=E.alphaMap,A.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,A.map=E.map,A.clipShadows=E.clipShadows,A.clippingPlanes=E.clippingPlanes,A.clipIntersection=E.clipIntersection,A.displacementMap=E.displacementMap,A.displacementScale=E.displacementScale,A.displacementBias=E.displacementBias,A.wireframeLinewidth=E.wireframeLinewidth,A.linewidth=E.linewidth,S.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let L=i.properties.get(A);L.light=S}return A}function x(_,E,S,T,A){if(_.visible===!1)return;if(_.layers.test(E.layers)&&(_.isMesh||_.isLine||_.isPoints)&&(_.castShadow||_.receiveShadow&&A===Xr)&&(!_.frustumCulled||_.intersectsFrustum(n))){_.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,_.matrixWorld);let U=t.update(_),N=_.material;if(Array.isArray(N)){let F=U.groups;for(let H=0,G=F.length;H<G;H++){let K=F[H],z=N[K.materialIndex];if(z&&z.visible){let V=M(_,z,T,A);_.onBeforeShadow(i,_,E,S,U,V,K),i.renderBufferDirect(S,null,U,V,_,K),_.onAfterShadow(i,_,E,S,U,V,K)}}}else if(N.visible){let F=M(_,N,T,A);_.onBeforeShadow(i,_,E,S,U,F,null),i.renderBufferDirect(S,null,U,F,_,null),_.onAfterShadow(i,_,E,S,U,F,null)}}let L=_.children;for(let U=0,N=L.length;U<N;U++)x(L[U],E,S,T,A)}function y(_){_.target.removeEventListener("dispose",y);for(let S in c){let T=c[S],A=_.target.uuid;A in T&&(T[A].dispose(),delete T[A])}}}function w1(i,t){function e(){let W=!1,wt=new Be,rt=null,Et=new Be(0,0,0,0);return{setMask:function(Pt){rt!==Pt&&!W&&(i.colorMask(Pt,Pt,Pt,Pt),rt=Pt)},setLocked:function(Pt){W=Pt},setClear:function(Pt,ut,Wt,zt,ke){ke===!0&&(Pt*=zt,ut*=zt,Wt*=zt),wt.set(Pt,ut,Wt,zt),Et.equals(wt)===!1&&(i.clearColor(Pt,ut,Wt,zt),Et.copy(wt))},reset:function(){W=!1,rt=null,Et.set(-1,0,0,0)}}}function n(){let W=!1,wt=!1,rt=null,Et=null,Pt=null;return{setReversed:function(ut){if(wt!==ut){let Wt=t.get("EXT_clip_control");ut?Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.ZERO_TO_ONE_EXT):Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.NEGATIVE_ONE_TO_ONE_EXT),wt=ut;let zt=Pt;Pt=null,this.setClear(zt)}},getReversed:function(){return wt},setTest:function(ut){ut?X(i.DEPTH_TEST):st(i.DEPTH_TEST)},setMask:function(ut){rt!==ut&&!W&&(i.depthMask(ut),rt=ut)},setFunc:function(ut){if(wt&&(ut=fm[ut]),Et!==ut){switch(ut){case Bl:i.depthFunc(i.NEVER);break;case zl:i.depthFunc(i.ALWAYS);break;case kl:i.depthFunc(i.LESS);break;case cs:i.depthFunc(i.LEQUAL);break;case Hl:i.depthFunc(i.EQUAL);break;case Gl:i.depthFunc(i.GEQUAL);break;case Vl:i.depthFunc(i.GREATER);break;case Wl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Et=ut}},setLocked:function(ut){W=ut},setClear:function(ut){Pt!==ut&&(Pt=ut,wt&&(ut=1-ut),i.clearDepth(ut))},reset:function(){W=!1,rt=null,Et=null,Pt=null,wt=!1}}}function s(){let W=!1,wt=null,rt=null,Et=null,Pt=null,ut=null,Wt=null,zt=null,ke=null;return{setTest:function(Ae){W||(Ae?X(i.STENCIL_TEST):st(i.STENCIL_TEST))},setMask:function(Ae){wt!==Ae&&!W&&(i.stencilMask(Ae),wt=Ae)},setFunc:function(Ae,fi,Ii){(rt!==Ae||Et!==fi||Pt!==Ii)&&(i.stencilFunc(Ae,fi,Ii),rt=Ae,Et=fi,Pt=Ii)},setOp:function(Ae,fi,Ii){(ut!==Ae||Wt!==fi||zt!==Ii)&&(i.stencilOp(Ae,fi,Ii),ut=Ae,Wt=fi,zt=Ii)},setLocked:function(Ae){W=Ae},setClear:function(Ae){ke!==Ae&&(i.clearStencil(Ae),ke=Ae)},reset:function(){W=!1,wt=null,rt=null,Et=null,Pt=null,ut=null,Wt=null,zt=null,ke=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,g=[],v=null,p=!1,m=null,b=null,M=null,x=null,y=null,_=null,E=null,S=new Nt(0,0,0),T=0,A=!1,C=null,L=null,U=null,N=null,F=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,K=0,z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(z)[1]),G=K>=1):z.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),G=K>=2);let V=null,I={},ot=i.getParameter(i.SCISSOR_BOX),ct=i.getParameter(i.VIEWPORT),gt=new Be().fromArray(ot),It=new Be().fromArray(ct);function Y(W,wt,rt,Et){let Pt=new Uint8Array(4),ut=i.createTexture();i.bindTexture(W,ut),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Wt=0;Wt<rt;Wt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(wt,0,i.RGBA,1,1,Et,0,i.RGBA,i.UNSIGNED_BYTE,Pt):i.texImage2D(wt+Wt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Pt);return ut}let B={};B[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),B[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),B[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),X(i.DEPTH_TEST),o.setFunc(cs),ft(!1),vt(Ju),X(i.CULL_FACE),lt(Qe);function X(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function st(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function pt(W,wt){return u[W]!==wt?(i.bindFramebuffer(W,wt),u[W]=wt,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=wt),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=wt),!0):!1}function ht(W,wt){let rt=g,Et=!1;if(W){rt=f.get(wt),rt===void 0&&(rt=[],f.set(wt,rt));let Pt=W.textures;if(rt.length!==Pt.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let ut=0,Wt=Pt.length;ut<Wt;ut++)rt[ut]=i.COLOR_ATTACHMENT0+ut;rt.length=Pt.length,Et=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,Et=!0);Et&&i.drawBuffers(rt)}function xt(W){return v!==W?(i.useProgram(W),v=W,!0):!1}let Bt={[li]:i.FUNC_ADD,[Op]:i.FUNC_SUBTRACT,[Bp]:i.FUNC_REVERSE_SUBTRACT};Bt[zp]=i.MIN,Bt[kp]=i.MAX;let j={[or]:i.ZERO,[Hp]:i.ONE,[Gp]:i.SRC_COLOR,[Qu]:i.SRC_ALPHA,[qp]:i.SRC_ALPHA_SATURATE,[ha]:i.DST_COLOR,[ca]:i.DST_ALPHA,[Vp]:i.ONE_MINUS_SRC_COLOR,[td]:i.ONE_MINUS_SRC_ALPHA,[Xp]:i.ONE_MINUS_DST_COLOR,[Wp]:i.ONE_MINUS_DST_ALPHA,[Yp]:i.CONSTANT_COLOR,[Zp]:i.ONE_MINUS_CONSTANT_COLOR,[$p]:i.CONSTANT_ALPHA,[Jp]:i.ONE_MINUS_CONSTANT_ALPHA};function lt(W,wt,rt,Et,Pt,ut,Wt,zt,ke,Ae){if(W===Qe){p===!0&&(st(i.BLEND),p=!1);return}if(p===!1&&(X(i.BLEND),p=!0),W!==Sc){if(W!==m||Ae!==A){if((b!==li||y!==li)&&(i.blendEquation(i.FUNC_ADD),b=li,y=li),Ae)switch(W){case qr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case la:i.blendFunc(i.ONE,i.ONE);break;case Ku:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ju:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ee("WebGLState: Invalid blending: ",W);break}else switch(W){case qr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case la:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ku:ee("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ju:ee("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ee("WebGLState: Invalid blending: ",W);break}M=null,x=null,_=null,E=null,S.set(0,0,0),T=0,m=W,A=Ae}return}Pt=Pt||wt,ut=ut||rt,Wt=Wt||Et,(wt!==b||Pt!==y)&&(i.blendEquationSeparate(Bt[wt],Bt[Pt]),b=wt,y=Pt),(rt!==M||Et!==x||ut!==_||Wt!==E)&&(i.blendFuncSeparate(j[rt],j[Et],j[ut],j[Wt]),M=rt,x=Et,_=ut,E=Wt),(zt.equals(S)===!1||ke!==T)&&(i.blendColor(zt.r,zt.g,zt.b,ke),S.copy(zt),T=ke),m=W,A=!1}function dt(W,wt){W.side===$e?st(i.CULL_FACE):X(i.CULL_FACE);let rt=W.side===vn;wt&&(rt=!rt),ft(rt),W.blending===qr&&W.transparent===!1?lt(Qe):lt(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),r.setMask(W.colorWrite);let Et=W.stencilWrite;a.setTest(Et),Et&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Gt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?X(i.SAMPLE_ALPHA_TO_COVERAGE):st(i.SAMPLE_ALPHA_TO_COVERAGE)}function ft(W){C!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),C=W)}function vt(W){W!==Up?(X(i.CULL_FACE),W!==L&&(W===Ju?i.cullFace(i.BACK):W===Fp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):st(i.CULL_FACE),L=W}function Xt(W){W!==U&&(G&&i.lineWidth(W),U=W)}function Gt(W,wt,rt){W?(X(i.POLYGON_OFFSET_FILL),(N!==wt||F!==rt)&&(N=wt,F=rt,o.getReversed()&&(wt=-wt),i.polygonOffset(wt,rt))):st(i.POLYGON_OFFSET_FILL)}function Jt(W){W?X(i.SCISSOR_TEST):st(i.SCISSOR_TEST)}function ne(W){W===void 0&&(W=i.TEXTURE0+H-1),V!==W&&(i.activeTexture(W),V=W)}function O(W,wt,rt){rt===void 0&&(V===null?rt=i.TEXTURE0+H-1:rt=V);let Et=I[rt];Et===void 0&&(Et={type:void 0,texture:void 0},I[rt]=Et),(Et.type!==W||Et.texture!==wt)&&(V!==rt&&(i.activeTexture(rt),V=rt),i.bindTexture(W,wt||B[W]),Et.type=W,Et.texture=wt)}function ye(){let W=I[V];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function le(){try{i.compressedTexImage2D(...arguments)}catch(W){ee("WebGLState:",W)}}function D(){try{i.compressedTexImage3D(...arguments)}catch(W){ee("WebGLState:",W)}}function w(){try{i.texSubImage2D(...arguments)}catch(W){ee("WebGLState:",W)}}function q(){try{i.texSubImage3D(...arguments)}catch(W){ee("WebGLState:",W)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(W){ee("WebGLState:",W)}}function tt(){try{i.compressedTexSubImage3D(...arguments)}catch(W){ee("WebGLState:",W)}}function mt(){try{i.texStorage2D(...arguments)}catch(W){ee("WebGLState:",W)}}function _t(){try{i.texStorage3D(...arguments)}catch(W){ee("WebGLState:",W)}}function nt(){try{i.texImage2D(...arguments)}catch(W){ee("WebGLState:",W)}}function at(){try{i.texImage3D(...arguments)}catch(W){ee("WebGLState:",W)}}function St(W){return d[W]!==void 0?d[W]:i.getParameter(W)}function kt(W,wt){d[W]!==wt&&(i.pixelStorei(W,wt),d[W]=wt)}function Mt(W){gt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),gt.copy(W))}function yt(W){It.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),It.copy(W))}function Ut(W,wt){let rt=c.get(wt);rt===void 0&&(rt=new WeakMap,c.set(wt,rt));let Et=rt.get(W);Et===void 0&&(Et=i.getUniformBlockIndex(wt,W.name),rt.set(W,Et))}function Vt(W,wt){let Et=c.get(wt).get(W);l.get(wt)!==Et&&(i.uniformBlockBinding(wt,Et,W.__bindingPointIndex),l.set(wt,Et))}function ie(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},V=null,I={},u={},f=new WeakMap,g=[],v=null,p=!1,m=null,b=null,M=null,x=null,y=null,_=null,E=null,S=new Nt(0,0,0),T=0,A=!1,C=null,L=null,U=null,N=null,F=null,gt.set(0,0,i.canvas.width,i.canvas.height),It.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:X,disable:st,bindFramebuffer:pt,drawBuffers:ht,useProgram:xt,setBlending:lt,setMaterial:dt,setFlipSided:ft,setCullFace:vt,setLineWidth:Xt,setPolygonOffset:Gt,setScissorTest:Jt,activeTexture:ne,bindTexture:O,unbindTexture:ye,compressedTexImage2D:le,compressedTexImage3D:D,texImage2D:nt,texImage3D:at,pixelStorei:kt,getParameter:St,updateUBOMapping:Ut,uniformBlockBinding:Vt,texStorage2D:mt,texStorage3D:_t,texSubImage2D:w,texSubImage3D:q,compressedTexSubImage2D:Z,compressedTexSubImage3D:tt,scissor:Mt,viewport:yt,reset:ie}}function E1(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,h=new WeakMap,d=new Set,u,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(D,w){return g?new OffscreenCanvas(D,w):Uo("canvas")}function p(D,w,q){let Z=1,tt=le(D);if((tt.width>q||tt.height>q)&&(Z=q/Math.max(tt.width,tt.height)),Z<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){let mt=Math.floor(Z*tt.width),_t=Math.floor(Z*tt.height);u===void 0&&(u=v(mt,_t));let nt=w?v(mt,_t):u;return nt.width=mt,nt.height=_t,nt.getContext("2d").drawImage(D,0,0,mt,_t),Qt("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+mt+"x"+_t+")."),nt}else return"data"in D&&Qt("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),D;return D}function m(D){return D.generateMipmaps}function b(D){i.generateMipmap(D)}function M(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(D,w,q,Z,tt,mt=!1){if(D!==null){if(i[D]!==void 0)return i[D];Qt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let _t;Z&&(_t=t.get("EXT_texture_norm16"),_t||Qt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let nt=w;if(w===i.RED&&(q===i.FLOAT&&(nt=i.R32F),q===i.HALF_FLOAT&&(nt=i.R16F),q===i.UNSIGNED_BYTE&&(nt=i.R8),q===i.UNSIGNED_SHORT&&_t&&(nt=_t.R16_EXT),q===i.SHORT&&_t&&(nt=_t.R16_SNORM_EXT)),w===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(nt=i.R8UI),q===i.UNSIGNED_SHORT&&(nt=i.R16UI),q===i.UNSIGNED_INT&&(nt=i.R32UI),q===i.BYTE&&(nt=i.R8I),q===i.SHORT&&(nt=i.R16I),q===i.INT&&(nt=i.R32I)),w===i.RG&&(q===i.FLOAT&&(nt=i.RG32F),q===i.HALF_FLOAT&&(nt=i.RG16F),q===i.UNSIGNED_BYTE&&(nt=i.RG8),q===i.UNSIGNED_SHORT&&_t&&(nt=_t.RG16_EXT),q===i.SHORT&&_t&&(nt=_t.RG16_SNORM_EXT)),w===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(nt=i.RG8UI),q===i.UNSIGNED_SHORT&&(nt=i.RG16UI),q===i.UNSIGNED_INT&&(nt=i.RG32UI),q===i.BYTE&&(nt=i.RG8I),q===i.SHORT&&(nt=i.RG16I),q===i.INT&&(nt=i.RG32I)),w===i.RGB_INTEGER&&(q===i.UNSIGNED_BYTE&&(nt=i.RGB8UI),q===i.UNSIGNED_SHORT&&(nt=i.RGB16UI),q===i.UNSIGNED_INT&&(nt=i.RGB32UI),q===i.BYTE&&(nt=i.RGB8I),q===i.SHORT&&(nt=i.RGB16I),q===i.INT&&(nt=i.RGB32I)),w===i.RGBA_INTEGER&&(q===i.UNSIGNED_BYTE&&(nt=i.RGBA8UI),q===i.UNSIGNED_SHORT&&(nt=i.RGBA16UI),q===i.UNSIGNED_INT&&(nt=i.RGBA32UI),q===i.BYTE&&(nt=i.RGBA8I),q===i.SHORT&&(nt=i.RGBA16I),q===i.INT&&(nt=i.RGBA32I)),w===i.RGB&&(q===i.UNSIGNED_SHORT&&_t&&(nt=_t.RGB16_EXT),q===i.SHORT&&_t&&(nt=_t.RGB16_SNORM_EXT),q===i.UNSIGNED_INT_5_9_9_9_REV&&(nt=i.RGB9_E5),q===i.UNSIGNED_INT_10F_11F_11F_REV&&(nt=i.R11F_G11F_B10F)),w===i.RGBA){let at=mt?No:de.getTransfer(tt);q===i.FLOAT&&(nt=i.RGBA32F),q===i.HALF_FLOAT&&(nt=i.RGBA16F),q===i.UNSIGNED_BYTE&&(nt=at===Te?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT&&_t&&(nt=_t.RGBA16_EXT),q===i.SHORT&&_t&&(nt=_t.RGBA16_SNORM_EXT),q===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function y(D,w){let q;return D?w===null||w===Ai||w===Bs?q=i.DEPTH24_STENCIL8:w===hi?q=i.DEPTH32F_STENCIL8:w===Yr&&(q=i.DEPTH24_STENCIL8,Qt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ai||w===Bs?q=i.DEPTH_COMPONENT24:w===hi?q=i.DEPTH_COMPONENT32F:w===Yr&&(q=i.DEPTH_COMPONENT16),q}function _(D,w){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==je&&D.minFilter!==Ze?Math.log2(Math.max(w.width,w.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?w.mipmaps.length:1}function E(D){let w=D.target;w.removeEventListener("dispose",E),T(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&d.delete(w)}function S(D){let w=D.target;w.removeEventListener("dispose",S),C(w)}function T(D){let w=n.get(D);if(w.__webglInit===void 0)return;let q=D.source,Z=f.get(q);if(Z){let tt=Z[w.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&A(D),Object.keys(Z).length===0&&f.delete(q)}n.remove(D)}function A(D){let w=n.get(D);i.deleteTexture(w.__webglTexture);let q=D.source,Z=f.get(q);delete Z[w.__cacheKey],o.memory.textures--}function C(D){let w=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(w.__webglFramebuffer[Z]))for(let tt=0;tt<w.__webglFramebuffer[Z].length;tt++)i.deleteFramebuffer(w.__webglFramebuffer[Z][tt]);else i.deleteFramebuffer(w.__webglFramebuffer[Z]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[Z])}else{if(Array.isArray(w.__webglFramebuffer))for(let Z=0;Z<w.__webglFramebuffer.length;Z++)i.deleteFramebuffer(w.__webglFramebuffer[Z]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Z=0;Z<w.__webglColorRenderbuffer.length;Z++)w.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[Z]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let q=D.textures;for(let Z=0,tt=q.length;Z<tt;Z++){let mt=n.get(q[Z]);mt.__webglTexture&&(i.deleteTexture(mt.__webglTexture),o.memory.textures--),n.remove(q[Z])}n.remove(D)}let L=0;function U(){L=0}function N(){return L}function F(D){L=D}function H(){let D=L;return D>=s.maxTextures&&Qt("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function G(D){let w=[];return w.push(D.wrapS),w.push(D.wrapT),w.push(D.wrapR||0),w.push(D.magFilter),w.push(D.minFilter),w.push(D.anisotropy),w.push(D.internalFormat),w.push(D.format),w.push(D.type),w.push(D.generateMipmaps),w.push(D.premultiplyAlpha),w.push(D.flipY),w.push(D.unpackAlignment),w.push(D.colorSpace),w.join()}function K(D,w){let q=n.get(D);if(D.isVideoTexture&&O(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&q.__version!==D.version){let Z=D.image;if(Z===null)Qt("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Qt("WebGLRenderer: Texture marked for update but image is incomplete");else{st(q,D,w);return}}else D.isExternalTexture&&(q.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+w)}function z(D,w){let q=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&q.__version!==D.version){st(q,D,w);return}else D.isExternalTexture&&(q.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+w)}function V(D,w){let q=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&q.__version!==D.version){st(q,D,w);return}e.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+w)}function I(D,w){let q=n.get(D);if(D.isCubeDepthTexture!==!0&&D.version>0&&q.__version!==D.version){pt(q,D,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+w)}let ot={[Jn]:i.REPEAT,[Oi]:i.CLAMP_TO_EDGE,[Xl]:i.MIRRORED_REPEAT},ct={[je]:i.NEAREST,[Qp]:i.NEAREST_MIPMAP_NEAREST,[va]:i.NEAREST_MIPMAP_LINEAR,[Ze]:i.LINEAR,[Tc]:i.LINEAR_MIPMAP_NEAREST,[ci]:i.LINEAR_MIPMAP_LINEAR},gt={[im]:i.NEVER,[lm]:i.ALWAYS,[sm]:i.LESS,[ch]:i.LEQUAL,[rm]:i.EQUAL,[hh]:i.GEQUAL,[om]:i.GREATER,[am]:i.NOTEQUAL};function It(D,w){if(w.type===hi&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Ze||w.magFilter===Tc||w.magFilter===va||w.magFilter===ci||w.minFilter===Ze||w.minFilter===Tc||w.minFilter===va||w.minFilter===ci)&&Qt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,ot[w.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,ot[w.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,ot[w.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,ct[w.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,ct[w.minFilter]),w.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,gt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===je||w.minFilter!==va&&w.minFilter!==ci||w.type===hi&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let q=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Y(D,w){let q=!1;D.__webglInit===void 0&&(D.__webglInit=!0,w.addEventListener("dispose",E));let Z=w.source,tt=f.get(Z);tt===void 0&&(tt={},f.set(Z,tt));let mt=G(w);if(mt!==D.__cacheKey){tt[mt]===void 0&&(tt[mt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),tt[mt].usedTimes++;let _t=tt[D.__cacheKey];_t!==void 0&&(tt[D.__cacheKey].usedTimes--,_t.usedTimes===0&&A(w)),D.__cacheKey=mt,D.__webglTexture=tt[mt].texture}return q}function B(D,w,q){return Math.floor(Math.floor(D/q)/w)}function X(D,w,q,Z){let mt=D.updateRanges;if(mt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,q,Z,w.data);else{mt.sort((kt,Mt)=>kt.start-Mt.start);let _t=0;for(let kt=1;kt<mt.length;kt++){let Mt=mt[_t],yt=mt[kt],Ut=Mt.start+Mt.count,Vt=B(yt.start,w.width,4),ie=B(Mt.start,w.width,4);yt.start<=Ut+1&&Vt===ie&&B(yt.start+yt.count-1,w.width,4)===Vt?Mt.count=Math.max(Mt.count,yt.start+yt.count-Mt.start):(++_t,mt[_t]=yt)}mt.length=_t+1;let nt=e.getParameter(i.UNPACK_ROW_LENGTH),at=e.getParameter(i.UNPACK_SKIP_PIXELS),St=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let kt=0,Mt=mt.length;kt<Mt;kt++){let yt=mt[kt],Ut=Math.floor(yt.start/4),Vt=Math.ceil(yt.count/4),ie=Ut%w.width,W=Math.floor(Ut/w.width),wt=Vt,rt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),e.pixelStorei(i.UNPACK_SKIP_ROWS,W),e.texSubImage2D(i.TEXTURE_2D,0,ie,W,wt,rt,q,Z,w.data)}D.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,nt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,at),e.pixelStorei(i.UNPACK_SKIP_ROWS,St)}}function st(D,w,q){let Z=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Z=i.TEXTURE_3D);let tt=Y(D,w),mt=w.source;e.bindTexture(Z,D.__webglTexture,i.TEXTURE0+q);let _t=n.get(mt);if(mt.version!==_t.__version||tt===!0){if(e.activeTexture(i.TEXTURE0+q),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){let rt=de.getPrimaries(de.workingColorSpace),Et=w.colorSpace===Ri?null:de.getPrimaries(w.colorSpace),Pt=w.colorSpace===Ri||rt===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt)}e.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment);let at=p(w.image,!1,s.maxTextureSize);at=ye(w,at);let St=r.convert(w.format,w.colorSpace),kt=r.convert(w.type),Mt=x(w.internalFormat,St,kt,w.normalized,w.colorSpace,w.isVideoTexture);It(Z,w);let yt,Ut=w.mipmaps,Vt=w.isVideoTexture!==!0,ie=_t.__version===void 0||tt===!0,W=mt.dataReady,wt=_(w,at);if(w.isDepthTexture)Mt=y(w.format===Vi,w.type),ie&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Mt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Mt,at.width,at.height,0,St,kt,null));else if(w.isDataTexture)if(Ut.length>0){Vt&&ie&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Ut[0].width,Ut[0].height);for(let rt=0,Et=Ut.length;rt<Et;rt++)yt=Ut[rt],Vt?W&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,yt.width,yt.height,St,kt,yt.data):e.texImage2D(i.TEXTURE_2D,rt,Mt,yt.width,yt.height,0,St,kt,yt.data);w.generateMipmaps=!1}else Vt?(ie&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,at.width,at.height),W&&X(w,at,St,kt)):e.texImage2D(i.TEXTURE_2D,0,Mt,at.width,at.height,0,St,kt,at.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Vt&&ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Mt,Ut[0].width,Ut[0].height,at.depth);for(let rt=0,Et=Ut.length;rt<Et;rt++)if(yt=Ut[rt],w.format!==Gn)if(St!==null)if(Vt){if(W)if(w.layerUpdates.size>0){let Pt=pd(yt.width,yt.height,w.format,w.type);for(let ut of w.layerUpdates){let Wt=yt.data.subarray(ut*Pt/yt.data.BYTES_PER_ELEMENT,(ut+1)*Pt/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,ut,yt.width,yt.height,1,St,Wt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,yt.width,yt.height,at.depth,St,yt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,rt,Mt,yt.width,yt.height,at.depth,0,yt.data,0,0);else Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?W&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,yt.width,yt.height,at.depth,St,kt,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,rt,Mt,yt.width,yt.height,at.depth,0,St,kt,yt.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{Vt&&ie&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Ut[0].width,Ut[0].height);for(let rt=0,Et=Ut.length;rt<Et;rt++)yt=Ut[rt],w.format!==Gn?St!==null?Vt?W&&e.compressedTexSubImage2D(i.TEXTURE_2D,rt,0,0,yt.width,yt.height,St,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,rt,Mt,yt.width,yt.height,0,yt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?W&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,yt.width,yt.height,St,kt,yt.data):e.texImage2D(i.TEXTURE_2D,rt,Mt,yt.width,yt.height,0,St,kt,yt.data)}else if(w.isDataArrayTexture)if(Vt){if(ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Mt,at.width,at.height,at.depth),W)if(w.layerUpdates.size>0){let rt=pd(at.width,at.height,w.format,w.type);for(let Et of w.layerUpdates){let Pt=at.data.subarray(Et*rt/at.data.BYTES_PER_ELEMENT,(Et+1)*rt/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Et,at.width,at.height,1,St,kt,Pt)}w.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,St,kt,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Mt,at.width,at.height,at.depth,0,St,kt,at.data);else if(w.isData3DTexture)Vt?(ie&&e.texStorage3D(i.TEXTURE_3D,wt,Mt,at.width,at.height,at.depth),W&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,St,kt,at.data)):e.texImage3D(i.TEXTURE_3D,0,Mt,at.width,at.height,at.depth,0,St,kt,at.data);else if(w.isFramebufferTexture){if(ie)if(Vt)e.texStorage2D(i.TEXTURE_2D,wt,Mt,at.width,at.height);else{let rt=at.width,Et=at.height;for(let Pt=0;Pt<wt;Pt++)e.texImage2D(i.TEXTURE_2D,Pt,Mt,rt,Et,0,St,kt,null),rt>>=1,Et>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in i){let rt=i.canvas;if(rt.hasAttribute("layoutsubtree")||rt.setAttribute("layoutsubtree","true"),at.parentNode!==rt){rt.appendChild(at),d.add(w),rt.onpaint=Et=>{let Pt=Et.changedElements;for(let ut of d)Pt.includes(ut.image)&&(ut.needsUpdate=!0)},rt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,at);else{let Pt=i.RGBA,ut=i.RGBA,Wt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Pt,ut,Wt,at)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ut.length>0){if(Vt&&ie){let rt=le(Ut[0]);e.texStorage2D(i.TEXTURE_2D,wt,Mt,rt.width,rt.height)}for(let rt=0,Et=Ut.length;rt<Et;rt++)yt=Ut[rt],Vt?W&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,St,kt,yt):e.texImage2D(i.TEXTURE_2D,rt,Mt,St,kt,yt);w.generateMipmaps=!1}else if(Vt){if(ie){let rt=le(at);e.texStorage2D(i.TEXTURE_2D,wt,Mt,rt.width,rt.height)}W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,St,kt,at)}else e.texImage2D(i.TEXTURE_2D,0,Mt,St,kt,at);m(w)&&b(Z),_t.__version=mt.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function pt(D,w,q){if(w.image.length!==6)return;let Z=Y(D,w),tt=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+q);let mt=n.get(tt);if(tt.version!==mt.__version||Z===!0){e.activeTexture(i.TEXTURE0+q);let _t=de.getPrimaries(de.workingColorSpace),nt=w.colorSpace===Ri?null:de.getPrimaries(w.colorSpace),at=w.colorSpace===Ri||_t===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,at);let St=w.isCompressedTexture||w.image[0].isCompressedTexture,kt=w.image[0]&&w.image[0].isDataTexture,Mt=[];for(let ut=0;ut<6;ut++)!St&&!kt?Mt[ut]=p(w.image[ut],!0,s.maxCubemapSize):Mt[ut]=kt?w.image[ut].image:w.image[ut],Mt[ut]=ye(w,Mt[ut]);let yt=Mt[0],Ut=r.convert(w.format,w.colorSpace),Vt=r.convert(w.type),ie=x(w.internalFormat,Ut,Vt,w.normalized,w.colorSpace),W=w.isVideoTexture!==!0,wt=mt.__version===void 0||Z===!0,rt=tt.dataReady,Et=_(w,yt);It(i.TEXTURE_CUBE_MAP,w);let Pt;if(St){W&&wt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,ie,yt.width,yt.height);for(let ut=0;ut<6;ut++){Pt=Mt[ut].mipmaps;for(let Wt=0;Wt<Pt.length;Wt++){let zt=Pt[Wt];w.format!==Gn?Ut!==null?W?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt,0,0,zt.width,zt.height,Ut,zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt,ie,zt.width,zt.height,0,zt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt,0,0,zt.width,zt.height,Ut,Vt,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt,ie,zt.width,zt.height,0,Ut,Vt,zt.data)}}}else{if(Pt=w.mipmaps,W&&wt){Pt.length>0&&Et++;let ut=le(Mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,ie,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(kt){W?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Mt[ut].width,Mt[ut].height,Ut,Vt,Mt[ut].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,ie,Mt[ut].width,Mt[ut].height,0,Ut,Vt,Mt[ut].data);for(let Wt=0;Wt<Pt.length;Wt++){let ke=Pt[Wt].image[ut].image;W?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt+1,0,0,ke.width,ke.height,Ut,Vt,ke.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt+1,ie,ke.width,ke.height,0,Ut,Vt,ke.data)}}else{W?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Ut,Vt,Mt[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,ie,Ut,Vt,Mt[ut]);for(let Wt=0;Wt<Pt.length;Wt++){let zt=Pt[Wt];W?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt+1,0,0,Ut,Vt,zt.image[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Wt+1,ie,Ut,Vt,zt.image[ut])}}}m(w)&&b(i.TEXTURE_CUBE_MAP),mt.__version=tt.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function ht(D,w,q,Z,tt,mt){let _t=r.convert(q.format,q.colorSpace),nt=r.convert(q.type),at=x(q.internalFormat,_t,nt,q.normalized,q.colorSpace),St=n.get(w),kt=n.get(q);if(kt.__renderTarget=w,!St.__hasExternalTextures){let Mt=Math.max(1,w.width>>mt),yt=Math.max(1,w.height>>mt);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,mt,at,Mt,yt,w.depth,0,_t,nt,null):e.texImage2D(tt,mt,at,Mt,yt,0,_t,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),ne(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,tt,kt.__webglTexture,0,Jt(w)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,tt,kt.__webglTexture,mt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function xt(D,w,q){if(i.bindRenderbuffer(i.RENDERBUFFER,D),w.depthBuffer){let Z=w.depthTexture,tt=Z&&Z.isDepthTexture?Z.type:null,mt=y(w.stencilBuffer,tt),_t=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ne(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Jt(w),mt,w.width,w.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Jt(w),mt,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,mt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_t,i.RENDERBUFFER,D)}else{let Z=w.textures;for(let tt=0;tt<Z.length;tt++){let mt=Z[tt],_t=r.convert(mt.format,mt.colorSpace),nt=r.convert(mt.type),at=x(mt.internalFormat,_t,nt,mt.normalized,mt.colorSpace);ne(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Jt(w),at,w.width,w.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Jt(w),at,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,at,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Bt(D,w,q){let Z=w.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let tt=n.get(w.depthTexture);if(tt.__renderTarget=w,(!tt.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),Z){if(tt.__webglInit===void 0&&(tt.__webglInit=!0,w.depthTexture.addEventListener("dispose",E)),tt.__webglTexture===void 0){tt.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),It(i.TEXTURE_CUBE_MAP,w.depthTexture);let St=r.convert(w.depthTexture.format),kt=r.convert(w.depthTexture.type),Mt;w.depthTexture.format===Bi?Mt=i.DEPTH_COMPONENT24:w.depthTexture.format===Vi&&(Mt=i.DEPTH24_STENCIL8);for(let yt=0;yt<6;yt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,Mt,w.width,w.height,0,St,kt,null)}}else K(w.depthTexture,0);let mt=tt.__webglTexture,_t=Jt(w),nt=Z?i.TEXTURE_CUBE_MAP_POSITIVE_X+q:i.TEXTURE_2D,at=w.depthTexture.format===Vi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(w.depthTexture.format===Bi)ne(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,nt,mt,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,at,nt,mt,0);else if(w.depthTexture.format===Vi)ne(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,nt,mt,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,at,nt,mt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function j(D){let w=n.get(D),q=D.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==D.depthTexture){let Z=D.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Z){let tt=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Z.removeEventListener("dispose",tt)};Z.addEventListener("dispose",tt),w.__depthDisposeCallback=tt}w.__boundDepthTexture=Z}if(D.depthTexture&&!w.__autoAllocateDepthBuffer)if(q)for(let Z=0;Z<6;Z++)Bt(w.__webglFramebuffer[Z],D,Z);else{let Z=D.texture.mipmaps;Z&&Z.length>0?Bt(w.__webglFramebuffer[0],D,0):Bt(w.__webglFramebuffer,D,0)}else if(q){w.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[Z]),w.__webglDepthbuffer[Z]===void 0)w.__webglDepthbuffer[Z]=i.createRenderbuffer(),xt(w.__webglDepthbuffer[Z],D,!1);else{let tt=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=w.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,mt),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,mt)}}else{let Z=D.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),xt(w.__webglDepthbuffer,D,!1);else{let tt=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,mt),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,mt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function lt(D,w,q){let Z=n.get(D);w!==void 0&&ht(Z.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&j(D)}function dt(D){let w=D.texture,q=n.get(D),Z=n.get(w);D.addEventListener("dispose",S);let tt=D.textures,mt=D.isWebGLCubeRenderTarget===!0,_t=tt.length>1;if(_t||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=w.version,o.memory.textures++),mt){q.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(w.mipmaps&&w.mipmaps.length>0){q.__webglFramebuffer[nt]=[];for(let at=0;at<w.mipmaps.length;at++)q.__webglFramebuffer[nt][at]=i.createFramebuffer()}else q.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){q.__webglFramebuffer=[];for(let nt=0;nt<w.mipmaps.length;nt++)q.__webglFramebuffer[nt]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(_t)for(let nt=0,at=tt.length;nt<at;nt++){let St=n.get(tt[nt]);St.__webglTexture===void 0&&(St.__webglTexture=i.createTexture(),o.memory.textures++)}if(D.samples>0&&ne(D)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let nt=0;nt<tt.length;nt++){let at=tt[nt];q.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[nt]);let St=r.convert(at.format,at.colorSpace),kt=r.convert(at.type),Mt=x(at.internalFormat,St,kt,at.normalized,at.colorSpace,D.isXRRenderTarget===!0),yt=Jt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,yt,Mt,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,q.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),xt(q.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(mt){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),It(i.TEXTURE_CUBE_MAP,w);for(let nt=0;nt<6;nt++)if(w.mipmaps&&w.mipmaps.length>0)for(let at=0;at<w.mipmaps.length;at++)ht(q.__webglFramebuffer[nt][at],D,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,at);else ht(q.__webglFramebuffer[nt],D,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(w)&&b(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_t){for(let nt=0,at=tt.length;nt<at;nt++){let St=tt[nt],kt=n.get(St),Mt=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Mt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Mt,kt.__webglTexture),It(Mt,St),ht(q.__webglFramebuffer,D,St,i.COLOR_ATTACHMENT0+nt,Mt,0),m(St)&&b(Mt)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(nt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,Z.__webglTexture),It(nt,w),w.mipmaps&&w.mipmaps.length>0)for(let at=0;at<w.mipmaps.length;at++)ht(q.__webglFramebuffer[at],D,w,i.COLOR_ATTACHMENT0,nt,at);else ht(q.__webglFramebuffer,D,w,i.COLOR_ATTACHMENT0,nt,0);m(w)&&b(nt),e.unbindTexture()}D.depthBuffer&&j(D)}function ft(D){let w=D.textures;for(let q=0,Z=w.length;q<Z;q++){let tt=w[q];if(m(tt)){let mt=M(D),_t=n.get(tt).__webglTexture;e.bindTexture(mt,_t),b(mt),e.unbindTexture()}}}let vt=[],Xt=[];function Gt(D){if(D.samples>0){if(ne(D)===!1){let w=D.textures,q=D.width,Z=D.height,tt=i.COLOR_BUFFER_BIT,mt=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(D),nt=w.length>1;if(nt)for(let St=0;St<w.length;St++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer);let at=D.texture.mipmaps;at&&at.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let St=0;St<w.length;St++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[St]);let kt=n.get(w[St]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,kt,0)}i.blitFramebuffer(0,0,q,Z,0,0,q,Z,tt,i.NEAREST),l===!0&&(vt.length=0,Xt.length=0,vt.push(i.COLOR_ATTACHMENT0+St),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&(vt.push(mt),Xt.push(mt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Xt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,vt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let St=0;St<w.length;St++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.RENDERBUFFER,_t.__webglColorRenderbuffer[St]);let kt=n.get(w[St]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.TEXTURE_2D,kt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){let w=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Jt(D){return Math.min(s.maxSamples,D.samples)}function ne(D){let w=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function O(D){let w=o.render.frame;h.get(D)!==w&&(h.set(D,w),D.update())}function ye(D,w){let q=D.colorSpace,Z=D.format,tt=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||q!==Lo&&q!==Ri&&(de.getTransfer(q)===Te?(Z!==Gn||tt!==wn)&&Qt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ee("WebGLTextures: Unsupported texture color space:",q)),w}function le(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=U,this.getTextureUnits=N,this.setTextureUnits=F,this.setTexture2D=K,this.setTexture2DArray=z,this.setTexture3D=V,this.setTextureCube=I,this.rebindTextures=lt,this.setupRenderTarget=dt,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=Gt,this.setupDepthRenderbuffer=j,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=ne,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function T1(i,t){function e(n,s=Ri){let r,o=de.getTransfer(s);if(n===wn)return i.UNSIGNED_BYTE;if(n===Rc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Cc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===sd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===rd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===nd)return i.BYTE;if(n===id)return i.SHORT;if(n===Yr)return i.UNSIGNED_SHORT;if(n===Ac)return i.INT;if(n===Ai)return i.UNSIGNED_INT;if(n===hi)return i.FLOAT;if(n===Xe)return i.HALF_FLOAT;if(n===od)return i.ALPHA;if(n===ad)return i.RGB;if(n===Gn)return i.RGBA;if(n===Bi)return i.DEPTH_COMPONENT;if(n===Vi)return i.DEPTH_STENCIL;if(n===Wi)return i.RED;if(n===Pc)return i.RED_INTEGER;if(n===zs)return i.RG;if(n===Ic)return i.RG_INTEGER;if(n===Dc)return i.RGBA_INTEGER;if(n===_a||n===ya||n===Ma||n===Sa)if(o===Te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_a)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_a)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ma)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Sa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Lc||n===Nc||n===Uc||n===Fc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Lc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Nc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Uc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Oc||n===Bc||n===zc||n===kc||n===Hc||n===ba||n===Gc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Oc||n===Bc)return o===Te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===zc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===kc)return r.COMPRESSED_R11_EAC;if(n===Hc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ba)return r.COMPRESSED_RG11_EAC;if(n===Gc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Vc||n===Wc||n===Xc||n===qc||n===Yc||n===Zc||n===$c||n===Jc||n===Kc||n===jc||n===Qc||n===th||n===eh||n===nh)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Vc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===qc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Yc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Zc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$c)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Jc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Kc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===jc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qc)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===th)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===eh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ih||n===sh||n===rh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ih)return o===Te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===sh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===rh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===oh||n===ah||n===wa||n===lh)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===oh)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ah)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===wa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===lh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var A1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,R1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ld=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Wo(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new pe({vertexShader:A1,fragmentShader:R1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Zt(new Dn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nd=class extends zi{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null,v=typeof XRWebGLBinding<"u",p=new Ld,m={},b=e.getContextAttributes(),M=null,x=null,y=[],_=[],E=new it,S=null,T=null,A=new bn;A.viewport=new Be;let C=new bn;C.viewport=new Be;let L=[A,C],U=new _c,N=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let X=y[B];return X===void 0&&(X=new Br,y[B]=X),X.getTargetRaySpace()},this.getControllerGrip=function(B){let X=y[B];return X===void 0&&(X=new Br,y[B]=X),X.getGripSpace()},this.getHand=function(B){let X=y[B];return X===void 0&&(X=new Br,y[B]=X),X.getHandSpace()};function H(B){let X=_.indexOf(B.inputSource);if(X===-1)return;let st=y[X];st!==void 0&&(st.update(B.inputSource,B.frame,c||o),st.dispatchEvent({type:B.type,data:B.inputSource}))}function G(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",K);for(let B=0;B<y.length;B++){let X=_[B];X!==null&&(_[B]=null,y[B].disconnect(X))}N=null,F=null,p.reset();for(let B in m)delete m[B];if(t.setRenderTarget(M),f=null,u=null,d=null,s=null,x=null,Y.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(E.width,E.height,!1),T!==null){let B=T.camera;B.fov=T.fov,B.zoom=T.zoom,B.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&Qt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&Qt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",G),s.addEventListener("inputsourceschange",K),b.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(E),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let st=null,pt=null,ht=null;b.depth&&(ht=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=b.stencil?Vi:Bi,pt=b.stencil?Bs:Ai);let xt={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(xt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new Fe(u.textureWidth,u.textureHeight,{format:Gn,type:wn,depthTexture:new oi(u.textureWidth,u.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let st={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,st),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Fe(f.framebufferWidth,f.framebufferHeight,{format:Gn,type:wn,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Y.setContext(s),Y.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function K(B){for(let X=0;X<B.removed.length;X++){let st=B.removed[X],pt=_.indexOf(st);pt>=0&&(_[pt]=null,y[pt].disconnect(st))}for(let X=0;X<B.added.length;X++){let st=B.added[X],pt=_.indexOf(st);if(pt===-1){for(let xt=0;xt<y.length;xt++)if(xt>=_.length){_.push(st),pt=xt;break}else if(_[xt]===null){_[xt]=st,pt=xt;break}if(pt===-1)break}let ht=y[pt];ht&&ht.connect(st)}}let z=new P,V=new P;function I(B,X,st){z.setFromMatrixPosition(X.matrixWorld),V.setFromMatrixPosition(st.matrixWorld);let pt=z.distanceTo(V),ht=X.projectionMatrix.elements,xt=st.projectionMatrix.elements,Bt=ht[14]/(ht[10]-1),j=ht[14]/(ht[10]+1),lt=(ht[9]+1)/ht[5],dt=(ht[9]-1)/ht[5],ft=(ht[8]-1)/ht[0],vt=(xt[8]+1)/xt[0],Xt=Bt*ft,Gt=Bt*vt,Jt=pt/(-ft+vt),ne=Jt*-ft;if(X.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(ne),B.translateZ(Jt),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),ht[10]===-1)B.projectionMatrix.copy(X.projectionMatrix),B.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{let O=Bt+Jt,ye=j+Jt,le=Xt-ne,D=Gt+(pt-ne),w=lt*j/ye*O,q=dt*j/ye*O;B.projectionMatrix.makePerspective(le,D,w,q,O,ye),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function ot(B,X){X===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(X.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;let X=B.near,st=B.far;p.texture!==null&&(p.depthNear>0&&(X=p.depthNear),p.depthFar>0&&(st=p.depthFar)),U.near=C.near=A.near=X,U.far=C.far=A.far=st,(N!==U.near||F!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),N=U.near,F=U.far),U.layers.mask=B.layers.mask|6,A.layers.mask=U.layers.mask&-5,C.layers.mask=U.layers.mask&-3;let pt=B.parent,ht=U.cameras;ot(U,pt);for(let xt=0;xt<ht.length;xt++)ot(ht[xt],pt);ht.length===2?I(U,A,C):U.projectionMatrix.copy(A.projectionMatrix),T===null&&B.isPerspectiveCamera&&(T={camera:B,fov:B.fov,zoom:B.zoom}),ct(B,U,pt)};function ct(B,X,st){st===null?B.matrix.copy(X.matrixWorld):(B.matrix.copy(st.matrixWorld),B.matrix.invert(),B.matrix.multiply(X.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(X.projectionMatrix),B.projectionMatrixInverse.copy(X.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Yl*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(B){l=B,u!==null&&(u.fixedFoveation=B),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=B)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(U)},this.getCameraTexture=function(B){return m[B]};let gt=null;function It(B,X){if(h=X.getViewerPose(c||o),g=X,h!==null){let st=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let pt=!1;st.length!==U.cameras.length&&(U.cameras.length=0,pt=!0);for(let j=0;j<st.length;j++){let lt=st[j],dt=null;if(f!==null)dt=f.getViewport(lt);else{let vt=d.getViewSubImage(u,lt);dt=vt.viewport,j===0&&(t.setRenderTargetTextures(x,vt.colorTexture,vt.depthStencilTexture),t.setRenderTarget(x))}let ft=L[j];ft===void 0&&(ft=new bn,ft.layers.enable(j),ft.viewport=new Be,L[j]=ft),ft.matrix.fromArray(lt.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(lt.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(dt.x,dt.y,dt.width,dt.height),j===0&&(U.matrix.copy(ft.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),pt===!0&&U.cameras.push(ft)}let ht=s.enabledFeatures;if(ht&&ht.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let j=d.getDepthInformation(st[0]);j&&j.isValid&&j.texture&&p.init(j,s.renderState)}if(ht&&ht.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let j=0;j<st.length;j++){let lt=st[j].camera;if(lt){let dt=m[lt];dt||(dt=new Wo,m[lt]=dt);let ft=d.getCameraImage(lt);dt.sourceTexture=ft}}}}for(let st=0;st<y.length;st++){let pt=_[st],ht=y[st];pt!==null&&ht!==void 0&&ht.update(pt,X,c||o)}gt&&gt(B,X),X.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:X}),g=null}let Y=new Gm;Y.setAnimationLoop(It),this.setAnimationLoop=function(B){gt=B},this.dispose=function(){}}},C1=new se,Zm=new oe;Zm.set(-1,0,0,0,1,0,0,0,1);function P1(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,ud(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,b,M,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,x)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,b,M):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===vn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===vn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let b=t.get(m),M=b.envMap,x=b.envMapRotation;M&&(p.envMap.value=M,p.envMapRotation.value.setFromMatrix4(C1.makeRotationFromEuler(x)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Zm),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,b,M){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*b,p.scale.value=M*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,b){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===vn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){let b=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function I1(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){let _=y.program;n.uniformBlockBinding(x,_)}function c(x,y){let _=s[x.id];_===void 0&&(p(x),_=h(x),s[x.id]=_,x.addEventListener("dispose",b));let E=y.program;n.updateUBOMapping(x,E);let S=t.render.frame;r[x.id]!==S&&(u(x),r[x.id]=S)}function h(x){let y=d();x.__bindingPointIndex=y;let _=i.createBuffer(),E=x.__size,S=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,E,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return ee("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){let y=s[x.id],_=x.uniforms,E=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let S=0,T=_.length;S<T;S++){let A=_[S];if(Array.isArray(A))for(let C=0,L=A.length;C<L;C++)f(A[C],S,C,E);else f(A,S,0,E)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,y,_,E){if(v(x,y,_,E)===!0){let S=x.__offset,T=x.value;if(Array.isArray(T)){let A=0;for(let C=0;C<T.length;C++){let L=T[C],U=m(L);g(L,x.__data,A),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(A+=U.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,S,x.__data)}}function g(x,y,_){typeof x=="number"||typeof x=="boolean"?y[0]=x:x.isMatrix3?(y[0]=x.elements[0],y[1]=x.elements[1],y[2]=x.elements[2],y[3]=0,y[4]=x.elements[3],y[5]=x.elements[4],y[6]=x.elements[5],y[7]=0,y[8]=x.elements[6],y[9]=x.elements[7],y[10]=x.elements[8],y[11]=0):ArrayBuffer.isView(x)?y.set(new x.constructor(x.buffer,x.byteOffset,y.length)):x.toArray(y,_)}function v(x,y,_,E){let S=x.value,T=y+"_"+_;if(E[T]===void 0)return typeof S=="number"||typeof S=="boolean"?E[T]=S:ArrayBuffer.isView(S)?E[T]=S.slice():E[T]=S.clone(),!0;{let A=E[T];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return E[T]=S,!0}else{if(ArrayBuffer.isView(S))return!0;if(A.equals(S)===!1)return A.copy(S),!0}}return!1}function p(x){let y=x.uniforms,_=0,E=16;for(let T=0,A=y.length;T<A;T++){let C=Array.isArray(y[T])?y[T]:[y[T]];for(let L=0,U=C.length;L<U;L++){let N=C[L],F=Array.isArray(N.value)?N.value:[N.value];for(let H=0,G=F.length;H<G;H++){let K=F[H],z=m(K),V=_%E,I=V%z.boundary,ot=V+I;_+=I,ot!==0&&E-ot<z.storage&&(_+=E-ot),N.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=_,_+=z.storage}}}let S=_%E;return S>0&&(_+=E-S),x.__size=_,x.__cache={},this}function m(x){let y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?Qt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(y.boundary=16,y.storage=x.byteLength):Qt("WebGLRenderer: Unsupported uniform value type.",x),y}function b(x){let y=x.target;y.removeEventListener("dispose",b);let _=o.indexOf(y.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function M(){for(let x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:l,update:c,dispose:M}}var D1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Xi=null;function L1(){return Xi===null&&(Xi=new In(D1,16,16,zs,Xe),Xi.name="DFG_LUT",Xi.minFilter=Ze,Xi.magFilter=Ze,Xi.wrapS=Oi,Xi.wrapT=Oi,Xi.generateMipmaps=!1,Xi.needsUpdate=!0),Xi}var ph=class{constructor(t={}){let{canvas:e=hm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=wn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let v=f,p=new Set([Dc,Ic,Pc]),m=new Set([wn,Ai,Yr,Bs,Rc,Cc]),b=new Uint32Array(4),M=new Int32Array(4),x=new P,y=null,_=null,E=[],S=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ti,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,C=!1,L=null,U=null,N=null,F=null;this._outputColorSpace=Ke;let H=0,G=0,K=null,z=-1,V=null,I=new Be,ot=new Be,ct=null,gt=new Nt(0),It=0,Y=e.width,B=e.height,X=1,st=null,pt=null,ht=new Be(0,0,Y,B),xt=new Be(0,0,Y,B),Bt=!1,j=new zr,lt=!1,dt=!1,ft=new se,vt=new P,Xt=new Be,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Jt=!1;function ne(){return K===null?X:1}let O=n;function ye(R,k){return e.getContext(R,k)}let le,D,w,q,Z,tt,mt,_t,nt,at,St,kt,Mt,yt,Ut,Vt,ie,W,wt,rt,Et,Pt,ut;try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ke,!1),e.addEventListener("webglcontextrestored",Ae,!1),e.addEventListener("webglcontextcreationerror",fi,!1),O===null){let k="webgl2";if(O=ye(k,R),O===null)throw ye(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Wt()}catch(R){throw e.removeEventListener("webglcontextlost",ke,!1),e.removeEventListener("webglcontextrestored",Ae,!1),e.removeEventListener("webglcontextcreationerror",fi,!1),ee("WebGLRenderer: "+R.message),R}function Wt(){le=new ky(O),le.init(),Et=new T1(O,le),D=new Py(O,le,t,Et),w=new w1(O,le),D.reversedDepthBuffer&&u&&w.buffers.depth.setReversed(!0),U=O.createFramebuffer(),N=O.createFramebuffer(),F=O.createFramebuffer(),q=new Vy(O),Z=new h1,tt=new E1(O,le,w,Z,D,Et,q),mt=new zy(A),_t=new Xx(O),Pt=new Ry(O,_t),nt=new Hy(O,_t,q,Pt),at=new Xy(O,nt,_t,Pt,q),W=new Wy(O,D,tt),Ut=new Iy(Z),St=new c1(A,mt,le,D,Pt,Ut),kt=new P1(A,Z),Mt=new d1,yt=new v1(le),ie=new Ay(A,mt,w,at,g,l),Vt=new b1(A,at,D),ut=new I1(O,q,D,w),wt=new Cy(O,le,q),rt=new Gy(O,le,q),q.programs=St.programs,A.capabilities=D,A.extensions=le,A.properties=Z,A.renderLists=Mt,A.shadowMap=Vt,A.state=w,A.info=q}v!==wn&&(T=new Yy(v,e.width,e.height,a,s,r));let zt=new Nd(A,O);this.xr=zt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let R=le.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=le.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(R){R!==void 0&&(X=R,this.setSize(Y,B,!1))},this.getSize=function(R){return R.set(Y,B)},this.setSize=function(R,k,Q=!0){if(zt.isPresenting){Qt("WebGLRenderer: Can't change size while VR device is presenting.");return}Y=R,B=k,e.width=Math.floor(R*X),e.height=Math.floor(k*X),Q===!0&&(e.style.width=R+"px",e.style.height=k+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,R,k)},this.getDrawingBufferSize=function(R){return R.set(Y*X,B*X).floor()},this.setDrawingBufferSize=function(R,k,Q){Y=R,B=k,X=Q,e.width=Math.floor(R*Q),e.height=Math.floor(k*Q),this.setViewport(0,0,R,k)},this.setEffects=function(R){if(v===wn){ee("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let k=0;k<R.length;k++)if(R[k].isOutputPass===!0){Qt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(I)},this.getViewport=function(R){return R.copy(ht)},this.setViewport=function(R,k,Q,$){R.isVector4?ht.set(R.x,R.y,R.z,R.w):ht.set(R,k,Q,$),w.viewport(I.copy(ht).multiplyScalar(X).round())},this.getScissor=function(R){return R.copy(xt)},this.setScissor=function(R,k,Q,$){R.isVector4?xt.set(R.x,R.y,R.z,R.w):xt.set(R,k,Q,$),w.scissor(ot.copy(xt).multiplyScalar(X).round())},this.getScissorTest=function(){return Bt},this.setScissorTest=function(R){w.setScissorTest(Bt=R)},this.setOpaqueSort=function(R){st=R},this.setTransparentSort=function(R){pt=R},this.getClearColor=function(R){return R.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(R=!0,k=!0,Q=!0){let $=0;if(R){let J=!1;if(K!==null){let Rt=K.texture.format;J=p.has(Rt)}if(J){let Rt=K.texture.type,Lt=m.has(Rt),At=ie.getClearColor(),Ft=ie.getClearAlpha(),Ht=At.r,ce=At.g,fe=At.b;Lt?(b[0]=Ht,b[1]=ce,b[2]=fe,b[3]=Ft,O.clearBufferuiv(O.COLOR,0,b)):(M[0]=Ht,M[1]=ce,M[2]=fe,M[3]=Ft,O.clearBufferiv(O.COLOR,0,M))}else $|=O.COLOR_BUFFER_BIT}k&&($|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&($|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&O.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),L=R},this.dispose=function(){e.removeEventListener("webglcontextlost",ke,!1),e.removeEventListener("webglcontextrestored",Ae,!1),e.removeEventListener("webglcontextcreationerror",fi,!1),ie.dispose(),Mt.dispose(),yt.dispose(),Z.dispose(),mt.dispose(),at.dispose(),Pt.dispose(),ut.dispose(),St.dispose(),zt.dispose(),zt.removeEventListener("sessionstart",_f),zt.removeEventListener("sessionend",yf),Gs.stop()};function ke(R){R.preventDefault(),cd("WebGLRenderer: Context Lost."),C=!0}function Ae(){cd("WebGLRenderer: Context Restored."),C=!1;let R=q.autoReset,k=Vt.enabled,Q=Vt.autoUpdate,$=Vt.needsUpdate,J=Vt.type;Wt(),q.autoReset=R,Vt.enabled=k,Vt.autoUpdate=Q,Vt.needsUpdate=$,Vt.type=J}function fi(R){ee("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Ii(R){let k=R.target;k.removeEventListener("dispose",Ii),z0(k)}function z0(R){k0(R),Z.remove(R)}function k0(R){let k=Z.get(R).programs;k!==void 0&&(k.forEach(function(Q){St.releaseProgram(Q)}),R.isShaderMaterial&&St.releaseShaderCache(R))}this.renderBufferDirect=function(R,k,Q,$,J,Rt){k===null&&(k=Gt);let Lt=J.isMesh&&J.matrixWorld.determinantAffine()<0,At=V0(R,k,Q,$,J);w.setMaterial($,Lt);let Ft=Q.index,Ht=1;if($.wireframe===!0){if(Ft=nt.getWireframeAttribute(Q),Ft===void 0)return;Ht=2}let ce=Q.drawRange,fe=Q.attributes.position,Ot=ce.start*Ht,Re=(ce.start+ce.count)*Ht;Rt!==null&&(Ot=Math.max(Ot,Rt.start*Ht),Re=Math.min(Re,(Rt.start+Rt.count)*Ht)),Ft!==null?(Ot=Math.max(Ot,0),Re=Math.min(Re,Ft.count)):fe!=null&&(Ot=Math.max(Ot,0),Re=Math.min(Re,fe.count));let nn=Re-Ot;if(nn<0||nn===1/0)return;Pt.setup(J,$,At,Q,Ft);let Ve,Oe=wt;if(Ft!==null&&(Ve=_t.get(Ft),Oe=rt,Oe.setIndex(Ve)),J.isMesh)$.wireframe===!0?(w.setLineWidth($.wireframeLinewidth*ne()),Oe.setMode(O.LINES)):Oe.setMode(O.TRIANGLES);else if(J.isLine){let yn=$.linewidth;yn===void 0&&(yn=1),w.setLineWidth(yn*ne()),J.isLineSegments?Oe.setMode(O.LINES):J.isLineLoop?Oe.setMode(O.LINE_LOOP):Oe.setMode(O.LINE_STRIP)}else J.isPoints?Oe.setMode(O.POINTS):J.isSprite&&Oe.setMode(O.TRIANGLES);if(J.isBatchedMesh)if(le.get("WEBGL_multi_draw"))Oe.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{let yn=J._multiDrawStarts,Dt=J._multiDrawCounts,Rn=J._multiDrawCount,be=Ft?_t.get(Ft).bytesPerElement:1,ni=Z.get($).currentProgram.getUniforms();for(let Di=0;Di<Rn;Di++)ni.setValue(O,"_gl_DrawID",Di),Oe.render(yn[Di]/be,Dt[Di])}else if(J.isInstancedMesh)Oe.renderInstances(Ot,nn,J.count);else if(Q.isInstancedBufferGeometry){let yn=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Dt=Math.min(Q.instanceCount,yn);Oe.renderInstances(Ot,nn,Dt)}else Oe.render(Ot,nn)};function vf(R,k,Q,$){L!==null&&R.isNodeMaterial&&L.setObject($,R),lt===!0&&Ut.setState(R,Q,!1),R.transparent===!0&&R.side===$e&&R.forceSinglePass===!1?(R.side=vn,R.needsUpdate=!0,Qa(R,k,$),R.side=Fs,R.needsUpdate=!0,Qa(R,k,$),R.side=$e):Qa(R,k,$)}this.compile=function(R,k,Q=null){Q===null&&(Q=R),L!==null&&L.renderStart(R,k,Q),_=yt.get(Q),_.init(k),S.push(_),Q.traverseVisible(function(J){J.isLight&&J.layers.test(k.layers)&&(_.pushLight(J),J.castShadow&&_.pushShadow(J))}),R!==Q&&R.traverseVisible(function(J){J.isLight&&J.layers.test(k.layers)&&(_.pushLight(J),J.castShadow&&_.pushShadow(J))}),_.setupLights(),L!==null&&L.updateLights(_.state.lightsArray),dt=this.localClippingEnabled,lt=Ut.init(this.clippingPlanes,dt),lt===!0&&Ut.setGlobalState(this.clippingPlanes,k),L!==null&&Vt.render(_.state.shadowsArray,Q,k);let $=new Set;return R.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;let Rt=J.material;if(Rt)if(Array.isArray(Rt))for(let Lt=0;Lt<Rt.length;Lt++){let At=Rt[Lt];vf(At,Q,k,J),$.add(At)}else vf(Rt,Q,k,J),$.add(Rt)}),_=S.pop(),L!==null&&L.renderEnd(),$},this.compileAsync=function(R,k,Q=null){let $=this.compile(R,k,Q);return new Promise(J=>{function Rt(){if($.forEach(function(Lt){let Ft=Z.get(Lt).currentProgram;(Ft===void 0||Ft.isReady())&&$.delete(Lt)}),$.size===0){J(R);return}setTimeout(Rt,10)}le.get("KHR_parallel_shader_compile")!==null?Rt():setTimeout(Rt,10)})};let kh=null;function H0(R){kh&&kh(R)}function _f(){Gs.stop()}function yf(){Gs.start()}let Gs=new Gm;Gs.setAnimationLoop(H0),typeof self<"u"&&Gs.setContext(self),this.setAnimationLoop=function(R){kh=R,zt.setAnimationLoop(R),R===null?Gs.stop():Gs.start()},zt.addEventListener("sessionstart",_f),zt.addEventListener("sessionend",yf),this.render=function(R,k){if(k!==void 0&&k.isCamera!==!0){ee("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;L!==null&&L.renderStart(R,k);let Q=zt.enabled===!0&&zt.isPresenting===!0,$=T!==null&&(K===null||Q)&&T.begin(A,K);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),zt.enabled===!0&&zt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(zt.cameraAutoUpdate===!0&&zt.updateCamera(k),k=zt.getCamera()),R.isScene===!0&&R.onBeforeRender(A,R,k,K),_=yt.get(R,S.length),_.init(k),_.state.textureUnits=tt.getTextureUnits(),S.push(_),ft.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),j.setFromProjectionMatrix(ft,Si,k.reversedDepth),dt=this.localClippingEnabled,lt=Ut.init(this.clippingPlanes,dt),y=Mt.get(R,E.length),y.init(),E.push(y),zt.enabled===!0&&zt.isPresenting===!0){let Lt=A.xr.getDepthSensingMesh();Lt!==null&&Hh(Lt,k,-1/0,A.sortObjects)}Hh(R,k,0,A.sortObjects),y.finish(),L!==null&&L.updateLights(_.state.lightsArray),A.sortObjects===!0&&y.sort(st,pt),Jt=zt.enabled===!1||zt.isPresenting===!1||zt.hasDepthSensing()===!1,Jt&&ie.addToRenderList(y,R),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),lt===!0&&Ut.beginShadows();let J=_.state.shadowsArray;if(Vt.render(J,R,k),lt===!0&&Ut.endShadows(),($&&T.hasRenderPass())===!1){let Lt=y.opaque,At=y.transmissive;if(_.setupLights(),k.isArrayCamera){let Ft=k.cameras;if(At.length>0)for(let Ht=0,ce=Ft.length;Ht<ce;Ht++){let fe=Ft[Ht];Sf(Lt,At,R,fe)}Jt&&ie.render(R);for(let Ht=0,ce=Ft.length;Ht<ce;Ht++){let fe=Ft[Ht];Mf(y,R,fe,fe.viewport)}}else At.length>0&&Sf(Lt,At,R,k),Jt&&ie.render(R),Mf(y,R,k)}K!==null&&G===0&&(tt.updateMultisampleRenderTarget(K),tt.updateRenderTargetMipmap(K)),$&&T.end(A),R.isScene===!0&&R.onAfterRender(A,R,k),Pt.resetDefaultState(),z=-1,V=null,S.pop(),S.length>0?(_=S[S.length-1],tt.setTextureUnits(_.state.textureUnits),lt===!0&&Ut.setGlobalState(A.clippingPlanes,_.state.camera)):_=null,E.pop(),E.length>0?y=E[E.length-1]:y=null,L!==null&&L.renderEnd()};function Hh(R,k,Q,$){if(R.visible===!1)return;if(R.layers.test(k.layers)){if(R.isGroup)Q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(k);else if(R.isLightProbeGrid)_.pushLightProbeGrid(R);else if(R.isLight)_.pushLight(R),R.castShadow&&_.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||R.intersectsFrustum(j)){$&&Xt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ft);let Lt=at.update(R),At=R.material;At.visible&&y.push(R,Lt,At,Q,Xt.z,null,k)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||R.intersectsFrustum(j))){let Lt=at.update(R),At=R.material;if($&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Xt.copy(R.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),Xt.copy(Lt.boundingSphere.center)),Xt.applyMatrix4(R.matrixWorld).applyMatrix4(ft)),Array.isArray(At)){let Ft=Lt.groups;for(let Ht=0,ce=Ft.length;Ht<ce;Ht++){let fe=Ft[Ht],Ot=At[fe.materialIndex];Ot&&Ot.visible&&y.push(R,Lt,Ot,Q,Xt.z,fe,k)}}else At.visible&&y.push(R,Lt,At,Q,Xt.z,null,k)}}let Rt=R.children;for(let Lt=0,At=Rt.length;Lt<At;Lt++)Hh(Rt[Lt],k,Q,$)}function Mf(R,k,Q,$){let{opaque:J,transmissive:Rt,transparent:Lt}=R;_.setupLightsView(Q),lt===!0&&Ut.setGlobalState(A.clippingPlanes,Q),$&&w.viewport(I.copy($)),J.length>0&&ja(J,k,Q),Rt.length>0&&ja(Rt,k,Q),Lt.length>0&&ja(Lt,k,Q),w.buffers.depth.setTest(!0),w.buffers.depth.setMask(!0),w.buffers.color.setMask(!0),w.setPolygonOffset(!1)}function Sf(R,k,Q,$){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(_.state.transmissionRenderTarget[$.id]===void 0){let Ot=le.has("EXT_color_buffer_half_float")||le.has("EXT_color_buffer_float");_.state.transmissionRenderTarget[$.id]=new Fe(1,1,{generateMipmaps:!0,type:Ot?Xe:wn,minFilter:ci,samples:Math.max(4,D.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:de.workingColorSpace})}let Rt=_.state.transmissionRenderTarget[$.id],Lt=$.viewport||I;Rt.setSize(Lt.z*A.transmissionResolutionScale,Lt.w*A.transmissionResolutionScale);let At=A.getRenderTarget(),Ft=A.getActiveCubeFace(),Ht=A.getActiveMipmapLevel();A.setRenderTarget(Rt),A.getClearColor(gt),It=A.getClearAlpha(),It<1&&A.setClearColor(16777215,.5),A.clear(),Jt&&ie.render(Q);let ce=A.toneMapping;A.toneMapping=Ti;let fe=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),_.setupLightsView($),lt===!0&&Ut.setGlobalState(A.clippingPlanes,$),ja(R,Q,$),tt.updateMultisampleRenderTarget(Rt),tt.updateRenderTargetMipmap(Rt),le.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let Re=0,nn=k.length;Re<nn;Re++){let Ve=k[Re],{object:Oe,geometry:yn,material:Dt,group:Rn}=Ve;if(Dt.side===$e&&Oe.layers.test($.layers)){let be=Dt.side;Dt.side=vn,Dt.needsUpdate=!0,bf(Oe,Q,$,yn,Dt,Rn),Dt.side=be,Dt.needsUpdate=!0,Ot=!0}}Ot===!0&&(tt.updateMultisampleRenderTarget(Rt),tt.updateRenderTargetMipmap(Rt))}A.setRenderTarget(At,Ft,Ht),A.setClearColor(gt,It),fe!==void 0&&($.viewport=fe),A.toneMapping=ce}function ja(R,k,Q){let $=k.isScene===!0?k.overrideMaterial:null;for(let J=0,Rt=R.length;J<Rt;J++){let Lt=R[J],{object:At,geometry:Ft,group:Ht}=Lt,ce=Lt.material;ce.allowOverride===!0&&$!==null&&(ce=$),At.layers.test(Q.layers)&&bf(At,k,Q,Ft,ce,Ht)}}function bf(R,k,Q,$,J,Rt){L!==null&&J.isNodeMaterial&&L.setObject(R,J),R.onBeforeRender(A,k,Q,$,J,Rt),R.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),J.onBeforeRender(A,k,Q,$,R,Rt),J.transparent===!0&&J.side===$e&&J.forceSinglePass===!1?(J.side=vn,J.needsUpdate=!0,A.renderBufferDirect(Q,k,$,J,R,Rt),J.side=Fs,J.needsUpdate=!0,A.renderBufferDirect(Q,k,$,J,R,Rt),J.side=$e):A.renderBufferDirect(Q,k,$,J,R,Rt),R.onAfterRender(A,k,Q,$,J,Rt)}function Qa(R,k,Q){k.isScene!==!0&&(k=Gt);let $=Z.get(R),J=_.state.lights,Rt=_.state.shadowsArray,Lt=J.state.version,At=St.getParameters(R,J.state,Rt,k,Q,_.state.lightProbeGridArray),Ft=St.getProgramCacheKey(At),Ht=$.programs;$.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?k.environment:null,$.fog=k.fog;let ce=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;$.envMap=mt.get(R.envMap||$.environment,ce),$.envMapRotation=$.environment!==null&&R.envMap===null?k.environmentRotation:R.envMapRotation,Ht===void 0&&(R.addEventListener("dispose",Ii),Ht=new Map,$.programs=Ht);let fe=Ht.get(Ft);if(fe!==void 0){if($.currentProgram===fe&&$.lightsStateVersion===Lt)return Ef(R,At),fe}else At.uniforms=St.getUniforms(R),L!==null&&R.isNodeMaterial&&L.build(R,Q,At),R.onBeforeCompile(At,A),fe=St.acquireProgram(At,Ft),Ht.set(Ft,fe),$.uniforms=At.uniforms;let Ot=$.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ot.clippingPlanes=Ut.uniform),Ef(R,At),$.needsLights=X0(R),$.lightsStateVersion=Lt,$.needsLights&&(Ot.ambientLightColor.value=J.state.ambient,Ot.lightProbe.value=J.state.probe,Ot.sunLights.value=J.state.sun,Ot.sunLightShadows.value=J.state.sunShadow,Ot.directionalLights.value=J.state.directional,Ot.directionalLightShadows.value=J.state.directionalShadow,Ot.spotLights.value=J.state.spot,Ot.spotLightShadows.value=J.state.spotShadow,Ot.rectAreaLights.value=J.state.rectArea,Ot.ltc_1.value=J.state.rectAreaLTC1,Ot.ltc_2.value=J.state.rectAreaLTC2,Ot.pointLights.value=J.state.point,Ot.pointLightShadows.value=J.state.pointShadow,Ot.hemisphereLights.value=J.state.hemi,Ot.sunShadowMatrix.value=J.state.sunShadowMatrix,Ot.sunShadowCascade.value=J.state.sunShadowCascade,Ot.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Ot.spotLightMatrix.value=J.state.spotLightMatrix,Ot.spotLightMap.value=J.state.spotLightMap,Ot.pointShadowMatrix.value=J.state.pointShadowMatrix),$.lightProbeGrid=_.state.lightProbeGridArray.length>0,$.currentProgram=fe,$.uniformsList=null,fe}function wf(R){if(R.uniformsList===null){let k=R.currentProgram.getUniforms();R.uniformsList=jr.seqWithValue(k.seq,R.uniforms)}return R.uniformsList}function Ef(R,k){let Q=Z.get(R);Q.outputColorSpace=k.outputColorSpace,Q.batching=k.batching,Q.batchingColor=k.batchingColor,Q.instancing=k.instancing,Q.instancingColor=k.instancingColor,Q.instancingMorph=k.instancingMorph,Q.skinning=k.skinning,Q.morphTargets=k.morphTargets,Q.morphNormals=k.morphNormals,Q.morphColors=k.morphColors,Q.morphTargetsCount=k.morphTargetsCount,Q.numClippingPlanes=k.numClippingPlanes,Q.numIntersection=k.numClipIntersection,Q.vertexAlphas=k.vertexAlphas,Q.vertexTangents=k.vertexTangents,Q.toneMapping=k.toneMapping}function G0(R,k){if(R.length===0)return null;if(R.length===1)return R[0].texture!==null?R[0]:null;x.setFromMatrixPosition(k.matrixWorld);for(let Q=0,$=R.length;Q<$;Q++){let J=R[Q];if(J.texture!==null&&J.boundingBox.containsPoint(x))return J}return null}function V0(R,k,Q,$,J){k.isScene!==!0&&(k=Gt),tt.resetTextureUnits();let Rt=k.fog,Lt=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?k.environment:null,At=K===null?A.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:de.workingColorSpace,Ft=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Ht=mt.get($.envMap||Lt,Ft),ce=$.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,fe=!!Q.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ot=!!Q.morphAttributes.position,Re=!!Q.morphAttributes.normal,nn=!!Q.morphAttributes.color,Ve=Ti;$.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Ve=A.toneMapping);let Oe=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,yn=Oe!==void 0?Oe.length:0,Dt=Z.get($),Rn=_.state.lights;if(lt===!0&&(dt===!0||R!==V)){let He=R===V&&$.id===z;Ut.setState($,R,He)}let be=!1;$.version===Dt.__version?(Dt.needsLights&&Dt.lightsStateVersion!==Rn.state.version||Dt.outputColorSpace!==At||J.isBatchedMesh&&Dt.batching===!1||!J.isBatchedMesh&&Dt.batching===!0||J.isBatchedMesh&&Dt.batchingColor===!0&&J._colorsTexture===null||J.isBatchedMesh&&Dt.batchingColor===!1&&J._colorsTexture!==null||J.isInstancedMesh&&Dt.instancing===!1||!J.isInstancedMesh&&Dt.instancing===!0||J.isSkinnedMesh&&Dt.skinning===!1||!J.isSkinnedMesh&&Dt.skinning===!0||J.isInstancedMesh&&Dt.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Dt.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&Dt.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&Dt.instancingMorph===!1&&J.morphTexture!==null||Dt.envMap!==Ht||$.fog===!0&&Dt.fog!==Rt||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==Ut.numPlanes||Dt.numIntersection!==Ut.numIntersection)||Dt.vertexAlphas!==ce||Dt.vertexTangents!==fe||Dt.morphTargets!==Ot||Dt.morphNormals!==Re||Dt.morphColors!==nn||Dt.toneMapping!==Ve||Dt.morphTargetsCount!==yn||!!Dt.lightProbeGrid!=_.state.lightProbeGridArray.length>0)&&(be=!0):(be=!0,Dt.__version=$.version);let ni=Dt.currentProgram;be===!0&&(ni=Qa($,k,J),L&&$.isNodeMaterial&&L.onUpdateProgram($,ni,Dt));let Di=!1,vs=!1,mr=!1,Ne=ni.getUniforms(),Je=Dt.uniforms;if(w.useProgram(ni.program)&&(Di=!0,vs=!0,mr=!0),$.id!==z&&(z=$.id,vs=!0),Dt.needsLights){let He=G0(_.state.lightProbeGridArray,J);Dt.lightProbeGrid!==He&&(Dt.lightProbeGrid=He,vs=!0)}if(Di||V!==R){w.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ne.setValue(O,"projectionMatrix",R.projectionMatrix),Ne.setValue(O,"viewMatrix",R.matrixWorldInverse);let ys=Ne.map.cameraPosition;ys!==void 0&&ys.setValue(O,vt.setFromMatrixPosition(R.matrixWorld)),D.logarithmicDepthBuffer&&Ne.setValue(O,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Ne.setValue(O,"isOrthographic",R.isOrthographicCamera===!0),V!==R&&(V=R,vs=!0,mr=!0)}if(Dt.needsLights&&(Rn.state.sunShadowMap.length>0&&Ne.setValue(O,"sunShadowMap",Rn.state.sunShadowMap,tt),Rn.state.directionalShadowMap.length>0&&Ne.setValue(O,"directionalShadowMap",Rn.state.directionalShadowMap,tt),Rn.state.spotShadowMap.length>0&&Ne.setValue(O,"spotShadowMap",Rn.state.spotShadowMap,tt),Rn.state.pointShadowMap.length>0&&Ne.setValue(O,"pointShadowMap",Rn.state.pointShadowMap,tt)),J.isSkinnedMesh){Ne.setOptional(O,J,"bindMatrix"),Ne.setOptional(O,J,"bindMatrixInverse");let He=J.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),Ne.setValue(O,"boneTexture",He.boneTexture,tt))}J.isBatchedMesh&&(Ne.setOptional(O,J,"batchingTexture"),Ne.setValue(O,"batchingTexture",J._matricesTexture,tt),Ne.setOptional(O,J,"batchingIdTexture"),Ne.setValue(O,"batchingIdTexture",J._indirectTexture,tt),Ne.setOptional(O,J,"batchingColorTexture"),J._colorsTexture!==null&&Ne.setValue(O,"batchingColorTexture",J._colorsTexture,tt));let _s=Q.morphAttributes;if((_s.position!==void 0||_s.normal!==void 0||_s.color!==void 0)&&W.update(J,Q,ni),(vs||Dt.receiveShadow!==J.receiveShadow)&&(Dt.receiveShadow=J.receiveShadow,Ne.setValue(O,"receiveShadow",J.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&k.environment!==null&&(Je.envMapIntensity.value=k.environmentIntensity),Je.dfgLUT!==void 0&&(Je.dfgLUT.value=L1()),vs){if(Ne.setValue(O,"toneMappingExposure",A.toneMappingExposure),Dt.needsLights&&W0(Je,mr),Rt&&$.fog===!0&&kt.refreshFogUniforms(Je,Rt),kt.refreshMaterialUniforms(Je,$,X,B,_.state.transmissionRenderTarget[R.id]),Dt.needsLights&&Dt.lightProbeGrid){let He=Dt.lightProbeGrid;Je.probesSH.value=He.texture,Je.probesMin.value.copy(He.boundingBox.min),Je.probesMax.value.copy(He.boundingBox.max),Je.probesResolution.value.copy(He.resolution)}jr.upload(O,wf(Dt),Je,tt)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(jr.upload(O,wf(Dt),Je,tt),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Ne.setValue(O,"center",J.center),Ne.setValue(O,"modelViewMatrix",J.modelViewMatrix),Ne.setValue(O,"normalMatrix",J.normalMatrix),Ne.setValue(O,"modelMatrix",J.matrixWorld),$.uniformsGroups!==void 0){let He=$.uniformsGroups;for(let ys=0,gr=He.length;ys<gr;ys++){let Af=He[ys];ut.update(Af,ni),ut.bind(Af,ni)}}return ni}function W0(R,k){R.ambientLightColor.needsUpdate=k,R.lightProbe.needsUpdate=k,R.sunLights.needsUpdate=k,R.sunLightShadows.needsUpdate=k,R.directionalLights.needsUpdate=k,R.directionalLightShadows.needsUpdate=k,R.pointLights.needsUpdate=k,R.pointLightShadows.needsUpdate=k,R.spotLights.needsUpdate=k,R.spotLightShadows.needsUpdate=k,R.rectAreaLights.needsUpdate=k,R.hemisphereLights.needsUpdate=k}function X0(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(R,k,Q){let $=Z.get(R);$.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),Z.get(R.texture).__webglTexture=k,Z.get(R.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:Q,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,k){let Q=Z.get(R);Q.__webglFramebuffer=k,Q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(R,k=0,Q=0){K=R,H=k,G=Q;let $=null,J=!1,Rt=!1;if(R){let At=Z.get(R);if(At.__useDefaultFramebuffer!==void 0){w.bindFramebuffer(O.FRAMEBUFFER,At.__webglFramebuffer),I.copy(R.viewport),ot.copy(R.scissor),ct=R.scissorTest,w.viewport(I),w.scissor(ot),w.setScissorTest(ct),z=-1;return}else if(At.__webglFramebuffer===void 0)tt.setupRenderTarget(R);else if(At.__hasExternalTextures)tt.rebindTextures(R,Z.get(R.texture).__webglTexture,Z.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let ce=R.depthTexture;if(At.__boundDepthTexture!==ce){if(ce!==null&&Z.has(ce)&&(R.width!==ce.image.width||R.height!==ce.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");tt.setupDepthRenderbuffer(R)}}let Ft=R.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(Rt=!0);let Ht=Z.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Ht[k])?$=Ht[k][Q]:$=Ht[k],J=!0):R.samples>0&&tt.useMultisampledRTT(R)===!1?$=Z.get(R).__webglMultisampledFramebuffer:Array.isArray(Ht)?$=Ht[Q]:$=Ht,I.copy(R.viewport),ot.copy(R.scissor),ct=R.scissorTest}else I.copy(ht).multiplyScalar(X).floor(),ot.copy(xt).multiplyScalar(X).floor(),ct=Bt;if(Q!==0&&($=U),w.bindFramebuffer(O.FRAMEBUFFER,$)&&w.drawBuffers(R,$),w.viewport(I),w.scissor(ot),w.setScissorTest(ct),J){let At=Z.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+k,At.__webglTexture,Q)}else if(Rt){let At=k;for(let Ft=0;Ft<R.textures.length;Ft++){let Ht=Z.get(R.textures[Ft]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ft,Ht.__webglTexture,Q,At)}}else if(R!==null&&Q!==0){let At=Z.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,At.__webglTexture,Q)}z=-1};function Tf(R){let k=Z.get(R);return(k.__readFormat!==R.format||k.__readType!==R.type)&&(k.__readFormat=R.format,k.__readType=R.type,k.__formatReadable=D.textureFormatReadable(R.format),k.__typeReadable=D.textureTypeReadable(R.type)),k}this.readRenderTargetPixels=function(R,k,Q,$,J,Rt,Lt,At=0){if(!(R&&R.isWebGLRenderTarget)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=Z.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Lt!==void 0&&(Ft=Ft[Lt]),Ft){w.bindFramebuffer(O.FRAMEBUFFER,Ft);try{let Ht=R.textures[At],ce=Ht.format,fe=Ht.type;R.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+At);let Ot=Tf(Ht);if(Ot.__formatReadable===!1){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ot.__typeReadable===!1){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=R.width-$&&Q>=0&&Q<=R.height-J&&O.readPixels(k,Q,$,J,Et.convert(ce),Et.convert(fe),Rt)}finally{let Ht=K!==null?Z.get(K).__webglFramebuffer:null;w.bindFramebuffer(O.FRAMEBUFFER,Ht)}}},this.readRenderTargetPixelsAsync=async function(R,k,Q,$,J,Rt,Lt,At=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ft=Z.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Lt!==void 0&&(Ft=Ft[Lt]),Ft)if(k>=0&&k<=R.width-$&&Q>=0&&Q<=R.height-J){w.bindFramebuffer(O.FRAMEBUFFER,Ft);let Ht=R.textures[At],ce=Ht.format,fe=Ht.type;R.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+At);let Ot=Tf(Ht);if(Ot.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ot.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Re=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Re),O.bufferData(O.PIXEL_PACK_BUFFER,Rt.byteLength,O.STREAM_READ),O.readPixels(k,Q,$,J,Et.convert(ce),Et.convert(fe),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let nn=K!==null?Z.get(K).__webglFramebuffer:null;w.bindFramebuffer(O.FRAMEBUFFER,nn);let Ve=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await dm(O,Ve,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Re),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Rt),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(Re),O.deleteSync(Ve),Rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,k=null,Q=0){let $=Math.pow(2,-Q),J=Math.floor(R.image.width*$),Rt=Math.floor(R.image.height*$),Lt=k!==null?k.x:0,At=k!==null?k.y:0;tt.setTexture2D(R,0),O.copyTexSubImage2D(O.TEXTURE_2D,Q,0,0,Lt,At,J,Rt),w.unbindTexture()},this.copyTextureToTexture=function(R,k,Q=null,$=null,J=0,Rt=0){let Lt,At,Ft,Ht,ce,fe,Ot,Re,nn,Ve=R.isCompressedTexture?R.mipmaps[Rt]:R.image;if(Q!==null)Lt=Q.max.x-Q.min.x,At=Q.max.y-Q.min.y,Ft=Q.isBox3?Q.max.z-Q.min.z:1,Ht=Q.min.x,ce=Q.min.y,fe=Q.isBox3?Q.min.z:0;else{let Je=Math.pow(2,-J);Lt=Math.floor(Ve.width*Je),At=Math.floor(Ve.height*Je),R.isDataArrayTexture?Ft=Ve.depth:R.isData3DTexture?Ft=Math.floor(Ve.depth*Je):Ft=1,Ht=0,ce=0,fe=0}$!==null?(Ot=$.x,Re=$.y,nn=$.z):(Ot=0,Re=0,nn=0);let Oe=Et.convert(k.format),yn=Et.convert(k.type),Dt;k.isData3DTexture?(tt.setTexture3D(k,0),Dt=O.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(tt.setTexture2DArray(k,0),Dt=O.TEXTURE_2D_ARRAY):(tt.setTexture2D(k,0),Dt=O.TEXTURE_2D),w.activeTexture(O.TEXTURE0),w.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),w.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),w.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment);let Rn=w.getParameter(O.UNPACK_ROW_LENGTH),be=w.getParameter(O.UNPACK_IMAGE_HEIGHT),ni=w.getParameter(O.UNPACK_SKIP_PIXELS),Di=w.getParameter(O.UNPACK_SKIP_ROWS),vs=w.getParameter(O.UNPACK_SKIP_IMAGES);w.pixelStorei(O.UNPACK_ROW_LENGTH,Ve.width),w.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ve.height),w.pixelStorei(O.UNPACK_SKIP_PIXELS,Ht),w.pixelStorei(O.UNPACK_SKIP_ROWS,ce),w.pixelStorei(O.UNPACK_SKIP_IMAGES,fe);let mr=R.isDataArrayTexture||R.isData3DTexture,Ne=k.isDataArrayTexture||k.isData3DTexture;if(R.isDepthTexture){let Je=Z.get(R),_s=Z.get(k),He=Z.get(Je.__renderTarget),ys=Z.get(_s.__renderTarget);w.bindFramebuffer(O.READ_FRAMEBUFFER,He.__webglFramebuffer),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,ys.__webglFramebuffer);for(let gr=0;gr<Ft;gr++)mr&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Z.get(R).__webglTexture,J,fe+gr),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Z.get(k).__webglTexture,Rt,nn+gr)),O.blitFramebuffer(Ht,ce,Lt,At,Ot,Re,Lt,At,O.DEPTH_BUFFER_BIT,O.NEAREST);w.bindFramebuffer(O.READ_FRAMEBUFFER,null),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(J!==0||R.isRenderTargetTexture||Z.has(R)){let Je=Z.get(R),_s=Z.get(k);w.bindFramebuffer(O.READ_FRAMEBUFFER,N),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,F);for(let He=0;He<Ft;He++)mr?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Je.__webglTexture,J,fe+He):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Je.__webglTexture,J),Ne?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,_s.__webglTexture,Rt,nn+He):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,_s.__webglTexture,Rt),J!==0?O.blitFramebuffer(Ht,ce,Lt,At,Ot,Re,Lt,At,O.COLOR_BUFFER_BIT,O.NEAREST):Ne?O.copyTexSubImage3D(Dt,Rt,Ot,Re,nn+He,Ht,ce,Lt,At):O.copyTexSubImage2D(Dt,Rt,Ot,Re,Ht,ce,Lt,At);w.bindFramebuffer(O.READ_FRAMEBUFFER,null),w.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Ne?R.isDataTexture||R.isData3DTexture?O.texSubImage3D(Dt,Rt,Ot,Re,nn,Lt,At,Ft,Oe,yn,Ve.data):k.isCompressedArrayTexture?O.compressedTexSubImage3D(Dt,Rt,Ot,Re,nn,Lt,At,Ft,Oe,Ve.data):O.texSubImage3D(Dt,Rt,Ot,Re,nn,Lt,At,Ft,Oe,yn,Ve):R.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Rt,Ot,Re,Lt,At,Oe,yn,Ve.data):R.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Rt,Ot,Re,Ve.width,Ve.height,Oe,Ve.data):O.texSubImage2D(O.TEXTURE_2D,Rt,Ot,Re,Lt,At,Oe,yn,Ve);w.pixelStorei(O.UNPACK_ROW_LENGTH,Rn),w.pixelStorei(O.UNPACK_IMAGE_HEIGHT,be),w.pixelStorei(O.UNPACK_SKIP_PIXELS,ni),w.pixelStorei(O.UNPACK_SKIP_ROWS,Di),w.pixelStorei(O.UNPACK_SKIP_IMAGES,vs),Rt===0&&k.generateMipmaps&&O.generateMipmap(Dt),w.unbindTexture()},this.initRenderTarget=function(R){Z.get(R).__webglFramebuffer===void 0&&tt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?tt.setTextureCube(R,0):R.isData3DTexture?tt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?tt.setTexture2DArray(R,0):tt.setTexture2D(R,0),w.unbindTexture()},this.resetState=function(){H=0,G=0,K=null,w.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}};var xh={morning:{name:"Morning",azimuth:1.15,elevation:.3,sun:"#ffe6c8",intensity:2.9,zenith:"#3f7fcf",horizon:"#dce6ec",haze:"#ccd9e3",density:3e-4,thin:300,hemiSky:"#bdd2ea",hemiGround:"#6a6347",hemi:.75,clouds:.54},afternoon:{name:"Afternoon",azimuth:-.95,elevation:.48,sun:"#ffe2bc",intensity:3.1,zenith:"#3474c4",horizon:"#bfd3e6",haze:"#bccfe0",density:26e-5,thin:430,hemiSky:"#b9cee6",hemiGround:"#6b6446",hemi:.7,clouds:.5},evening:{name:"Evening",azimuth:-1.42,elevation:.13,sun:"#ffb46e",intensity:2.8,zenith:"#30599a",horizon:"#eec4a2",haze:"#b7b3c2",density:22e-5,thin:420,hemiSky:"#a6b6d6",hemiGround:"#5f4e3b",hemi:.62,clouds:.52}},Jm=Object.keys(xh),vh=2600,N1=new it(9,4),U1=i=>new P(Math.cos(i.elevation)*Math.sin(i.azimuth),Math.sin(i.elevation),Math.cos(i.elevation)*Math.cos(i.azimuth)),$m=()=>{let i=new In(new Uint8Array([255]),1,1,Wi);return i.needsUpdate=!0,i},Se={cloudMap:{value:null},cloudShift:{value:new it},cloudCover:{value:.56},sunNear:{value:$m()},sunNearBox:{value:new Be(0,0,1,1)},sunFar:{value:$m()},sunFarBox:{value:new Be(0,0,1,1)},sunTo:{value:new P(0,1,0)},sunColour:{value:new Nt},hazeColour:{value:new Nt},hazeDensity:{value:.001},hazeThin:{value:400}},eo=`
uniform sampler2D cloudMap;
uniform vec2 cloudShift;
uniform float cloudCover;
float cloudsAt(vec2 p) {
  p += cloudShift;
  float d = texture2D(cloudMap, p * (1.0 / 5600.0)).r * 0.58 + texture2D(cloudMap, p * (1.0 / 1900.0) + 0.37).r * 0.29 + texture2D(cloudMap, p * (1.0 / 610.0) + 0.71).r * 0.13;
  return smoothstep(cloudCover, cloudCover + 0.2, d);
}
`,Ud=`
uniform sampler2D sunNear;
uniform vec4 sunNearBox;
uniform sampler2D sunFar;
uniform vec4 sunFarBox;
uniform vec3 sunTo;
float sunlightAt(vec3 p) {
  vec2 n = (p.xz - sunNearBox.xy) * sunNearBox.zw;
  float s = n.x > 0.0 && n.y > 0.0 && n.x < 1.0 && n.y < 1.0 ? texture2D(sunNear, n).r : texture2D(sunFar, (p.xz - sunFarBox.xy) * sunFarBox.zw).r;
  vec2 c = p.xz + sunTo.xz * ((${vh.toFixed(1)} - p.y) / max(sunTo.y, 0.06));
  c += cloudShift;
  float d = texture2D(cloudMap, c * (1.0 / 5600.0)).r * 0.58 + texture2D(cloudMap, c * (1.0 / 1900.0) + 0.37).r * 0.29 + 0.065;
  return s * (1.0 - 0.72 * smoothstep(cloudCover, cloudCover + 0.2, d));
}
`,Ra=`
float hazeOf(float dist, float camY, float rise, float density, float thin) {
  float r = rise / thin;
  float along = abs(r) > 0.01 ? (1.0 - exp(-r)) / r : 1.0 - 0.5 * r;
  return 1.0 - exp(-density * dist * exp(-camY / thin) * along);
}
`;jt.fog_pars_vertex=`
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec3 vFogView;
#endif
`;jt.fog_vertex=`
#ifdef USE_FOG
  vFogDepth = - mvPosition.z;
  vFogView = mvPosition.xyz;
#endif
`;jt.fog_pars_fragment=`
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec3 vFogView;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
  ${Ra}
#endif
`;jt.fog_fragment=`
#if defined( USE_FOG ) && defined( FOG_EXP2 )
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth ) );
#endif
`;jt.tonemapping_fragment=`
#if defined( USE_FOG ) && ! defined( FOG_EXP2 )
  vec3 fogTint = linearToOutputTexel( vec4( 0.5 ) ).r > 0.6 ? sRGBTransferEOTF( vec4( fogColor, 1.0 ) ).rgb : fogColor;
  #if defined( OUTDOOR_LIGHTS ) && NUM_DIR_LIGHTS > 0
    float fogMu = max( dot( normalize( vFogView ), directionalLights[ 0 ].direction ), 0.0 );
    fogTint += directionalLights[ 0 ].color * ( 0.025 * pow( fogMu, 5.0 ) + 0.05 * pow( fogMu, 24.0 ) );
  #endif
  float fogRise = dot( viewMatrix[ 1 ].xyz, vFogView );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogTint, hazeOf( length( vFogView ), cameraPosition.y, fogRise, fogNear, fogFar ) );
#endif
`+jt.tonemapping_fragment;jt.lights_pars_begin=`#define OUTDOOR_LIGHTS
`+jt.lights_pars_begin;jt.tonemapping_pars_fragment=jt.tonemapping_pars_fragment.replace("vec3 CustomToneMapping( vec3 color ) { return color; }",`vec3 CustomToneMapping( vec3 color ) {
  color = ACESFilmicToneMapping( color );
  vec3 g = pow( max( color, 0.0 ), vec3( 1.0 / 2.2 ) );
  g = mix( g, g * g * ( 3.0 - 2.0 * g ), 0.12 );
  float l = dot( g, vec3( 0.2126, 0.7152, 0.0722 ) );
  g = mix( vec3( l ), g, 1.05 );
  g += vec3( 0.018, 0.006, -0.016 ) * smoothstep( 0.35, 0.9, l ) + vec3( -0.008, -0.002, 0.012 ) * ( 1.0 - smoothstep( 0.0, 0.35, l ) );
  return pow( saturate( g ), vec3( 2.2 ) );
}`);var F1="varying vec3 vOutdoor;",O1=`varying vec3 vOutdoor;
`+eo+Ud;function B1(i){Object.assign(i.uniforms,Se),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
`+F1).replace("#include <project_vertex>",`#include <project_vertex>
vOutdoor = cameraPosition + ( vec4( mvPosition.xyz, 0.0 ) * viewMatrix ).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
`+O1).replace("#include <aomap_fragment>",`float outdoorSun = sunlightAt( vOutdoor );
reflectedLight.directDiffuse *= outdoorSun;
reflectedLight.directSpecular *= outdoorSun;
#include <aomap_fragment>`)}function Km(i){i.traverse(t=>{for(let e of Array.isArray(t.material)?t.material:t.material?[t.material]:[]){if(e.outdoors||!(e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial))continue;e.outdoors=!0;let n=e.onBeforeCompile,s=e.customProgramCacheKey();e.onBeforeCompile=(r,o)=>{n.call(e,r,o),B1(r)},e.customProgramCacheKey=()=>s+"|outdoors",e.needsUpdate=!0}})}function jm(i){Se.cloudShift.value.addScaledVector(N1,i)}function Qm(i){Se.sunTo.value.copy(U1(i)),Se.sunColour.value.set(i.sun).multiplyScalar(i.intensity),Se.hazeColour.value.set(i.haze),Se.hazeDensity.value=i.density,Se.hazeThin.value=i.thin,Se.cloudCover.value=i.clouds}function Ca(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function z1(i){let t=new Uint8Array(512),e=Ca(i);for(let r=0;r<256;r++)t[r]=r;for(let r=255;r>0;r--){let o=Math.floor(e()*(r+1));[t[r],t[o]]=[t[o],t[r]]}for(let r=0;r<256;r++)t[r+256]=t[r];let n=new Float32Array(256);for(let r=0;r<256;r++)n[r]=e();let s=(r,o,a)=>n[t[t[(r%a+a)%a]+(o%a+a)%a&255]];return(r,o,a)=>{let l=Math.floor(r),c=Math.floor(o),h=r-l,d=o-c,u=h*h*(3-2*h),f=d*d*(3-2*d),g=s(l,c,a),v=s(l+1,c,a),p=s(l,c+1,a),m=s(l+1,c+1,a);return g+(v-g)*u+(p-g)*f+(g-v-p+m)*u*f}}var fs=class{constructor(t,e){this.size=t,this.height=new Float32Array(t*t),this.rgb=new Float32Array(t*t*3),this.rand=Ca(e),this.noise=z1(e)}fbm(t,e,n,s=5){let r=0,o=.5,a=n,l=0;for(let c=0;c<s;c++)r+=o*this.noise(t/this.size*a,e/this.size*a,a),l+=o,o*=.5,a*=2;return r/l}fill(t){let e=this.size;for(let n=0;n<e;n++)for(let s=0;s<e;s++){let r=n*e+s,[o,a,l,c]=t(s,n);this.rgb[r*3]=o,this.rgb[r*3+1]=a,this.rgb[r*3+2]=l,this.height[r]=c}}dab(t,e,n,s,r,o,a,l){let c=this.size,h=Math.cos(r),d=Math.sin(r),u=Math.ceil(Math.max(n,s))+1;for(let f=-u;f<=u;f++)for(let g=-u;g<=u;g++){let v=(g*h+f*d)/n,p=(-g*d+f*h)/s,m=v*v+p*p;if(m>=1)continue;let b=((Math.round(t)+g)%c+c)%c,x=((Math.round(e)+f)%c+c)%c*c+b,y=a*(1-m*m);this.rgb[x*3]+=(o[0]-this.rgb[x*3])*y,this.rgb[x*3+1]+=(o[1]-this.rgb[x*3+1])*y,this.rgb[x*3+2]+=(o[2]-this.rgb[x*3+2])*y,this.height[x]=Math.max(this.height[x],this.height[x]*(1-y)+l*Math.sqrt(1-m))}}stroke(t,e,n,s,r,o,a,l){let c=Math.ceil(s);for(let h=0;h<=c;h++){let d=h/c;this.dab(t+Math.cos(n)*s*d,e+Math.sin(n)*s*d,r,r,0,o,a*(1-d*.5),l*(1-d*.4))}}textures(t,e){let n=this.size,s=document.createElement("canvas");s.width=s.height=n;let r=s.getContext("2d"),o=r.createImageData(n,n),a=document.createElement("canvas");a.width=a.height=n;let l=a.getContext("2d"),c=l.createImageData(n,n),h=this.height;for(let u=0;u<n;u++)for(let f=0;f<n;f++){let g=u*n+f;o.data[g*4]=Math.max(0,Math.min(255,this.rgb[g*3]*255)),o.data[g*4+1]=Math.max(0,Math.min(255,this.rgb[g*3+1]*255)),o.data[g*4+2]=Math.max(0,Math.min(255,this.rgb[g*3+2]*255)),o.data[g*4+3]=255;let v=h[u*n+(f-1+n)%n],p=h[u*n+(f+1)%n],m=h[(u-1+n)%n*n+f],b=h[(u+1)%n*n+f],M=(v-p)*t,x=(m-b)*t,y=Math.hypot(M,x,1);c.data[g*4]=M/y*127.5+127.5,c.data[g*4+1]=-x/y*127.5+127.5,c.data[g*4+2]=1/y*127.5+127.5,c.data[g*4+3]=255}r.putImageData(o,0,0),l.putImageData(c,0,0);let d=(u,f)=>{let g=new Hi(u);return g.wrapS=g.wrapT=Jn,g.anisotropy=e,f&&(g.colorSpace=Ke),g};return{map:d(s,!0),normal:d(a,!1),canvas:s}}},Yi=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e],dn=i=>[parseInt(i.slice(1,3),16)/255,parseInt(i.slice(3,5),16)/255,parseInt(i.slice(5,7),16)/255];function k1(i,t){let e=new fs(i,11),n=dn("#33441f"),s=dn("#58693a"),r=dn("#8e8752");e.fill((a,l)=>{let c=e.fbm(a,l,4),h=e.fbm(a,l,32,3);return[...Yi(Yi(n,s,h),r,Math.max(0,c-.55)*1.6),h*.4]});let o=["#5f7a3a","#6f8a44","#46602c","#8a9a58","#a09a62","#3d5426"].map(dn);for(let a=0;a<i*i*.035;a++){let l=e.rand()*i,c=e.rand()*i,h=o[e.rand()*o.length|0];e.stroke(l,c,e.rand()*Math.PI*2,3+e.rand()*7,.7,h,.75,.6+e.rand()*.4)}return e.textures(2.5,t)}function H1(i,t){let e=new fs(i,23),n=dn("#4b3e31"),s=dn("#8a7a67");e.fill((o,a)=>{let l=e.fbm(o,a,6),c=e.fbm(o,a,64,2);return[...Yi(n,s,l*.8+c*.25),l*.5+c*.2]});let r=["#7f766a","#6a6156","#8f8576","#5f574d","#776a5b"].map(dn);for(let o=0;o<i*i*.0035;o++){let a=.8+Math.pow(e.rand(),3)*4;e.dab(e.rand()*i,e.rand()*i,a*(.8+e.rand()*.6),a,e.rand()*3,r[e.rand()*r.length|0],.55,.5+a*.04)}return e.textures(3,t)}function G1(i,t){let e=new fs(i,37),n=dn("#4c4a47"),s=dn("#9b968c"),r=dn("#8a7a66");e.fill((a,l)=>{let c=Math.sin(l/i*Math.PI*2*5+e.fbm(a,l,4)*6)*.5+.5,h=e.fbm(a,l,8),d=Yi(Yi(n,s,h),r,c*.35),u=Math.max(0,1-Math.abs(e.fbm(a+300,l+100,9,4)-.5)/.004)*(.4+.6*e.fbm(a+50,l+70,3,2)),f=e.fbm(a,l,48,2);return[d[0]*(1-u*.22)*(.9+f*.2),d[1]*(1-u*.22)*(.9+f*.2),d[2]*(1-u*.22)*(.9+f*.2),h*.6+c*.25+f*.15-u*.15]});let o=["#9a9a52","#7f8a4a","#c2b878","#6d6f63"].map(dn);for(let a=0;a<i*i*5e-4;a++){let l=1.5+e.rand()*5;e.dab(e.rand()*i,e.rand()*i,l,l*(.6+e.rand()*.5),e.rand()*3,o[e.rand()*o.length|0],.3,0)}return e.textures(4,t)}function V1(i,t){let e=new fs(i,41),n=dn("#3a2c1d"),s=dn("#3f5426");e.fill((o,a)=>{let l=e.fbm(o,a,5);return[...Yi(n,s,Math.max(0,l-.45)*2),l*.3]});let r=["#7a5531","#8f6a3e","#5e4126","#a37a48","#6b6a3a"].map(dn);for(let o=0;o<i*i*.03;o++)e.stroke(e.rand()*i,e.rand()*i,e.rand()*Math.PI*2,4+e.rand()*8,.55,r[e.rand()*r.length|0],.85,.5);for(let o=0;o<i*i*2e-4;o++)e.dab(e.rand()*i,e.rand()*i,4,6,e.rand()*3,dn("#5a3a20"),.95,1);return e.textures(2.5,t)}function W1(i,t){let e=new fs(i,53),n=e.size,s=[.5-.72/3,.5+.72/3],r=[.5,.5,.5],o=[.37,.365,.36],a=[.56,.55,.54];e.fill((h,d)=>{let u=h/n,f=e.fbm(h,d,16,3),g=e.fbm(h,d,3),v=0;for(let b of s)v=Math.max(v,Math.max(0,1-Math.abs(u-b)/.075));v=v*v*(3-2*v);let p=Yi(r,a,Math.max(0,f-.4)*1.2+(1-v)*.25);p=Yi(p,o,v*.55*(.7+g*.6));let m=v>.4&&Math.sin(d/n*Math.PI*2*90+Math.sin(u*40)*.4)>.55?.08:0;return[p[0]*(1-m),p[1]*(1-m),p[2]*(1-m),.55-v*.35+f*.15-m]});let l=[[.6,.6,.6],[.5,.5,.51],[.66,.65,.63],[.42,.42,.42],[.56,.55,.53]];for(let h=0;h<n*n*.0035;h++){let d=e.rand()*n,u=d/n;if(s.some(v=>Math.abs(u-v)<.06)&&e.rand()<.85)continue;let g=1+Math.pow(e.rand(),2.5)*6;e.dab(d,e.rand()*n,g*1.2,g,e.rand()*3,l[e.rand()*l.length|0],.8,.7+g*.03)}let c=e.textures(3.5,t);return c.map.colorSpace=Ri,c}function X1(i,t){let e=new fs(i,67),n=dn("#2e2219"),s=dn("#6b5442"),r=dn("#7d746a");e.fill((o,a)=>{let l=1-Math.abs(e.fbm(o*4,a*.5,6,3)*2-1),c=e.fbm(o,a,8,3);return[...Yi(Yi(n,s,l),r,Math.max(0,c-.55)*1.5),l*.8+c*.2]});for(let o=0;o<i*i*8e-4;o++)e.dab(e.rand()*i,e.rand()*i,5+e.rand()*8,3+e.rand()*5,e.rand()*3,dn("#4a5a2a"),.6,0);return e.textures(4,t)}function q1(i,t){let e=document.createElement("canvas");e.width=i,e.height=i;let n=e.getContext("2d"),s=Ca(61),r=["#2c4a24","#36592b","#24401f","#40662f","#1e351a"],o=(l,c,h,d,u)=>{n.strokeStyle="#4a3624",n.lineWidth=i*.012,n.beginPath(),n.moveTo(l,c),n.lineTo(h,d),n.stroke();let f=40;for(let g=0;g<f;g++){let v=g/f,p=l+(h-l)*v,m=c+(d-c)*v,b=Math.atan2(d-c,h-l);for(let M of[-1,1]){let x=b+M*(.9+s()*.4)-.2,y=u*(.5+.5*Math.sin(v*Math.PI))*(.7+s()*.5);n.strokeStyle=r[s()*r.length|0],n.lineWidth=i*.006,n.beginPath(),n.moveTo(p,m),n.lineTo(p+Math.cos(x)*y,m+Math.sin(x)*y),n.stroke()}}};o(i*.5,i*.98,i*.5,i*.04,i*.12);for(let l=0;l<7;l++){let c=i*(.25+l*.1),h=l%2?1:-1;o(i*.5,c,i*(.5+h*.32),c-i*.12,i*.07)}let a=new Hi(e);return a.colorSpace=Ke,a.anisotropy=t,a}function Y1(i,t){let e=document.createElement("canvas");e.width=i,e.height=i;let n=e.getContext("2d"),s=Ca(71),r=["#56702f","#66803a","#425a26","#7d9150","#93935c","#5a7032"];for(let a=0;a<90;a++){let l=i*(.15+s()*.7),c=(s()-.5)*i*.5,h=i*(.05+s()*.55);n.strokeStyle=r[s()*r.length|0],n.lineWidth=i*(.008+s()*.01),n.beginPath(),n.moveTo(l,i),n.quadraticCurveTo(l+c*.3,i*.6,l+c,h),n.stroke()}let o=new Hi(e);return o.colorSpace=Ke,o.anisotropy=t,o}function Fd(i,t,e,n){let s=document.createElement("canvas");s.width=s.height=i;let r=s.getContext("2d");n(r,i,Ca(t));let o=new Hi(s);return o.colorSpace=Ke,o.anisotropy=e,o}function Z1(i,t){return Fd(i,83,t,(e,n,s)=>{e.strokeStyle="#4a3a26";for(let o=0;o<14;o++){e.lineWidth=n*(.006+s()*.006),e.beginPath();let a=n*(.4+s()*.2);e.moveTo(a,n),e.quadraticCurveTo(a+(s()-.5)*n*.3,n*.7,n*(.1+s()*.8),n*(.2+s()*.5)),e.stroke()}let r=["#2f4a22","#3b5a28","#466a2f","#55783a","#2a3f1e","#647f3f"];for(let o=0;o<1400;o++){let a=s()*Math.PI,l=Math.sqrt(s()),c=n*(.5+Math.cos(a)*l*.46),h=n*(.98-Math.sin(a)*l*.86),d=1-h/n;e.fillStyle=r[Math.min(r.length-1,Math.floor(s()*3+d*3.2))],e.save(),e.translate(c,h),e.rotate(s()*Math.PI),e.beginPath(),e.ellipse(0,0,n*.016,n*.008,0,0,Math.PI*2),e.fill(),e.restore()}})}function $1(i,t){return Fd(i,89,t,(e,n,s)=>{let r=["#3e6328","#4b7330","#58803a","#36561f"],o=a=>[n*(.5+.28*a*a),n*(1-.92*a+.25*a*a)];e.strokeStyle="#4b5e2a",e.lineWidth=n*.008,e.beginPath();for(let a=0;a<=1;a+=.02){let[l,c]=o(a);a===0?e.moveTo(l,c):e.lineTo(l,c)}e.stroke();for(let a=.12;a<.98;a+=.035){let[l,c]=o(a),h=n*.2*Math.sin(Math.PI*Math.min(1,(a-.05)*1.05))*(1.1-a*.5);for(let d of[-1,1])e.strokeStyle=r[Math.floor(s()*r.length)],e.lineWidth=n*(.018-a*.01),e.beginPath(),e.moveTo(l,c),e.quadraticCurveTo(l+d*h*.6,c-h*.1,l+d*h,c+h*.15),e.stroke()}})}function J1(i,t){return Fd(i,97,t,(e,n,s)=>{let r=["#5d7a34","#6e8a3e","#4d6a2c","#8a9452","#9c9a5a"];for(let a=0;a<70;a++){let l=n*(.1+s()*.8),c=(s()-.5)*n*.35,h=n*(.05+s()*.5);e.strokeStyle=r[Math.floor(s()*r.length)],e.lineWidth=n*(.006+s()*.007),e.beginPath(),e.moveTo(l,n),e.quadraticCurveTo(l+c*.3,n*.6,l+c,h),e.stroke()}let o=["#e8c840","#f2efe0","#a080c8","#e8c840","#d9a23a","#f2efe0"];for(let a=0;a<26;a++){let l=n*(.12+s()*.76),c=n*(.08+s()*.45);e.strokeStyle="#5b7432",e.lineWidth=n*.005,e.beginPath(),e.moveTo(l+(s()-.5)*n*.08,n),e.lineTo(l,c),e.stroke(),e.fillStyle=o[Math.floor(s()*o.length)];for(let h=0;h<6;h++)e.beginPath(),e.arc(l+(s()-.5)*n*.025,c+(s()-.5)*n*.025,n*(.008+s()*.008),0,Math.PI*2),e.fill()}})}function t0(i=256){let t=new fs(i,97),e=new Uint8Array(i*i);for(let s=0;s<i;s++)for(let r=0;r<i;r++){let o=t.fbm(r,s,4,6);e[s*i+r]=Math.max(0,Math.min(255,(o*1.15-.06)*255))}let n=new In(e,i,i,Wi);return n.wrapS=n.wrapT=Jn,n.magFilter=Ze,n.minFilter=ci,n.generateMipmaps=!0,n.unpackAlignment=1,n.needsUpdate=!0,n}function e0(i){return{grass:k1(512,i),earth:H1(512,i),rock:G1(512,i),forest:V1(512,i),track:W1(512,i),bark:X1(256,i),twig:q1(256,i),tuft:Y1(256,i),shrub:Z1(256,i),fern:$1(256,i),flowers:J1(256,i)}}var ui=32,Od=190,Pa=900,Zi=48,n0=95,K1=260,dr={block:64,seen:100},Ia={count:5e3,size:52},_h=1300,Ci=8,yh=8,so=96,Mh=256,Bd=.31,i0=so/Mh,{x0:$i,z0:Ji,nx:Wn,nz:ro,cell:Vn,heights:ps,kinds:j1}=ve.grid,Gd=$i+(Wn-1)*Vn,Vd=Ji+(ro-1)*Vn,zd=($i+Gd)/2,kd=(Ji+Vd)/2,La={[xe.GRASS]:[1,0,0,0],[xe.ROAD]:[0,1,0,0],[xe.LOOSE]:[0,1,0,0],[xe.ROCK]:[0,0,1,0],[xe.FOREST]:[0,0,0,1]};function Hd(i,t,e){return e>1.05?La[xe.ROCK]:Math.sin(i/37+Math.sin(t/53)*2)*Math.sin(t/41+Math.cos(i/61)*2)>-.2?La[xe.FOREST]:La[xe.GRASS]}var Wd=`#include <normal_fragment_begin>
normal = normalize( vNormal );
nonPerturbedNormal = normal;`;function s0(i,t){return i.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <normal_fragment_begin>",Wd)},i.customProgramCacheKey=()=>t,i}var Da=(i,t)=>{let e=Math.round((i-$i)/Vn),n=Math.round((t-Ji)/Vn);return e>=0&&n>=0&&e<Wn&&n<ro?j1[n*Wn+e]:-1},no=(i,t)=>{let e=(i-$i)/Vn,n=(t-Ji)/Vn;if(e<0||n<0||e>=Wn-1||n>=ro-1)return ve.natural(i,t);let s=e|0,r=n|0,o=e-s,a=n-r,l=r*Wn+s;return(ps[l]*(1-o)+ps[l+1]*o)*(1-a)+(ps[l+Wn]*(1-o)+ps[l+Wn+1]*o)*a},io=(i,t)=>{let e=Math.round((i-$i)/Vn),n=Math.round((t-Ji)/Vn);return e>=0&&n>=0&&e<Wn&&n<ro?ps[n*Wn+e]:ve.natural(i,t)},r0=`
uniform sampler2D tileNoise;
vec3 worldDx;
vec3 worldDy;
void patches(vec2 uv, out vec2 a, out vec2 b, out float t) {
  float l = textureLod(tileNoise, uv * 0.04, 0.0).r * 9.0;
  float i = floor(l);
  t = smoothstep(0.3, 0.7, l - i);
  a = uv + sin(vec2(3.0, 7.0) * i) * 4.3;
  b = uv + sin(vec2(3.0, 7.0) * (i + 1.0)) * 4.3;
}
vec4 untiled(sampler2D m, vec2 uv, vec2 dx, vec2 dy) {
  vec2 a;
  vec2 b;
  float t;
  patches(uv, a, b, t);
  return mix(textureGrad(m, a, dx, dy), textureGrad(m, b, dx, dy), t);
}
vec3 macro(vec2 p) {
  float m = texture2D(tileNoise, p / 70.0).r * 0.65 + texture2D(tileNoise, p / 17.0 + 0.3).r * 0.35;
  return (0.45 + 1.1 * m) * mix(vec3(1.05, 1.0, 0.9), vec3(0.95, 1.0, 1.05), texture2D(tileNoise, p / 43.0 + 0.7).r);
}
`,Q1=`
uniform sampler2D grassMap;
uniform sampler2D grassNormal;
uniform sampler2D earthMap;
uniform sampler2D earthNormal;
uniform sampler2D rockMap;
uniform sampler2D rockNormal;
uniform sampler2D forestMap;
uniform sampler2D forestNormal;
uniform vec3 viewFrom;
varying vec4 vSplat;
varying float vShade;
varying vec3 vWorld;
varying vec3 vWorldNormal;
${r0}
// Earth or rock wrapped round from the three sides it can be seen from (so cliffs and cut banks
// aren't smeared), each side untiled: its colour; and, near, how its bumps bend the light, looked
// at in the same patches so they line up with the colour.
vec3 wrapBend;
vec3 wrapped(sampler2D m, sampler2D nm, float k, vec3 w, bool bumps) {
  vec3 c = vec3(0.0);
  vec2 a;
  vec2 b;
  float t;
  wrapBend = vec3(0.0);
  if (w.x > 0.02) {
    vec2 dx = worldDx.zy * k, dy = worldDy.zy * k;
    patches(vWorld.zy * k, a, b, t);
    c += mix(textureGrad(m, a, dx, dy).rgb, textureGrad(m, b, dx, dy).rgb, t) * w.x;
    if (bumps) {
      vec2 n = mix(textureGrad(nm, a, dx, dy).xy, textureGrad(nm, b, dx, dy).xy, t) * 2.0 - 1.0;
      wrapBend += vec3(0.0, n.y, n.x) * w.x;
    }
  }
  if (w.y > 0.02) {
    vec2 dx = worldDx.xz * k, dy = worldDy.xz * k;
    patches(vWorld.xz * k, a, b, t);
    c += mix(textureGrad(m, a, dx, dy).rgb, textureGrad(m, b, dx, dy).rgb, t) * w.y;
    if (bumps) {
      vec2 n = mix(textureGrad(nm, a, dx, dy).xy, textureGrad(nm, b, dx, dy).xy, t) * 2.0 - 1.0;
      wrapBend += vec3(n.x, 0.0, n.y) * w.y;
    }
  }
  if (w.z > 0.02) {
    vec2 dx = worldDx.xy * k, dy = worldDy.xy * k;
    patches(vWorld.xy * k, a, b, t);
    c += mix(textureGrad(m, a, dx, dy).rgb, textureGrad(m, b, dx, dy).rgb, t) * w.z;
    if (bumps) {
      vec2 n = mix(textureGrad(nm, a, dx, dy).xy, textureGrad(nm, b, dx, dy).xy, t) * 2.0 - 1.0;
      wrapBend += vec3(n.x, n.y, 0.0) * w.z;
    }
  }
  return c;
}
`,Sh=class{constructor(t,{maxAniso:e}){this.scene=t,this.tex=e0(e),this.time=0,this.uniforms=[],this.ground=this.groundMaterial(!1),this.distant=this.groundMaterial(!0),this.tiles=new Map,this.shown=new Set,this.buildFar(),this.buildRoad(),this.buildTrees(),this.buildBoulders(),this.buildGrass(),this.buildVerges()}lightUp(){let t=Se.sunTo.value,e=Math.hypot(t.x,t.z),n=e>.001?t.x/e:0,s=e>.001?t.z/e:0,r=e>.001?t.y/e:1e3,o=Math.round(2*_h/Ci)+1,a=zd-_h,l=kd-_h;if(!this.farHeights){this.farHeights=new Float32Array(o*o);for(let p=0;p<o;p++)for(let m=0;m<o;m++)this.farHeights[p*o+m]=io(a+m*Ci,l+p*Ci)}let c=this.farHeights,h=(p,m)=>{let b=Math.max(0,Math.min(o-1.001,(p-a)/Ci)),M=Math.max(0,Math.min(o-1.001,(m-l)/Ci)),x=b|0,y=M|0,_=b-x,E=M-y,S=y*o+x;return(c[S]*(1-_)+c[S+1]*_)*(1-E)+(c[S+o]*(1-_)+c[S+o+1]*_)*E},d=(p,m)=>{let b=(p-$i)/Vn,M=(m-Ji)/Vn;if(b<0||M<0||b>=Wn-1||M>=ro-1)return h(p,m);let x=b|0,y=M|0,_=b-x,E=M-y,S=y*Wn+x;return(ps[S]*(1-_)+ps[S+1]*_)*(1-E)+(ps[S+Wn]*(1-_)+ps[S+Wn+1]*_)*E},u=(p,m,b,M,x)=>{let y=-1e3;for(let E=M;E<_h*1.2;E*=x){let S=(d(p+n*E,m+s*E)-b)/E;S>y&&(y=S)}let _=(r-y)/.06+.5;return _<=0?0:_>=1?255:Math.round(255*_*_*(3-2*_))},f=(p,m,b,M,x,y,_)=>{let E=new Uint8Array(p*m);for(let A=0;A<m;A++)for(let C=0;C<p;C++){let L=b+C*x,U=M+A*x;E[A*p+C]=u(L,U,d(L,U)+.12,y,_)}let S=new Uint8Array(p*m);for(let A=0;A<2;A++){let C=A?S:E,L=A?E:S;for(let U=0;U<m;U++)for(let N=0;N<p;N++){let F=0;for(let H=-2;H<=2;H++){let G=A?N:Math.min(p-1,Math.max(0,N+H)),K=A?Math.min(m-1,Math.max(0,U+H)):U;F+=C[K*p+G]*[1,4,6,4,1][H+2]}L[U*p+N]=F/16}}let T=new In(E,p,m,Wi);return T.magFilter=T.minFilter=Ze,T.unpackAlignment=1,T.needsUpdate=!0,T},g=(Wn-1)/2+1,v=(ro-1)/2+1;for(let p of["sunNear","sunFar"])Se[p].value.dispose();Se.sunNear.value=f(g,v,$i,Ji,1,.6,1.2),Se.sunNearBox.value.set($i-.5,Ji-.5,1/g,1/v),Se.sunFar.value=f(o,o,a,l,Ci,Ci,1.18),Se.sunFarBox.value.set(a-Ci/2,l-Ci/2,1/(o*Ci),1/(o*Ci))}groundMaterial(t){let e=new De({roughness:.96,metalness:0}),n=this.tex;return e.onBeforeCompile=s=>{Object.assign(s.uniforms,{grassMap:{value:n.grass.map},grassNormal:{value:n.grass.normal},earthMap:{value:n.earth.map},earthNormal:{value:n.earth.normal},rockMap:{value:n.rock.map},rockNormal:{value:n.rock.normal},forestMap:{value:n.forest.map},forestNormal:{value:n.forest.normal},viewFrom:{value:new P},tileNoise:Se.cloudMap}),this.uniforms.push(s.uniforms),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 splat;
attribute float shade;
varying vec4 vSplat;
varying float vShade;
varying vec3 vWorld;
varying vec3 vWorldNormal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vSplat = splat;
vShade = shade;
vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
vWorldNormal = normalize(mat3(modelMatrix) * objectNormal);`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
`+Q1).replace("#include <map_fragment>",`${t?"if (distance(vWorld.xz, viewFrom.xz) < "+(Od-25).toFixed(1)+") discard;":""}
vec4 share = vSplat / max(1e-3, vSplat.x + vSplat.y + vSplat.z + vSplat.w);
vec3 side = pow(abs(normalize(vWorldNormal)), vec3(4.0));
side /= side.x + side.y + side.z;
vec2 top = vWorld.xz;
float far = distance(vWorld.xz, viewFrom.xz);
worldDx = dFdx(vWorld);
worldDy = dFdy(vWorld);
bool bumps = far < 60.0;
vec3 grassColour = untiled(grassMap, top * 0.5, worldDx.xz * 0.5, worldDy.xz * 0.5).rgb;
if (far < 90.0) grassColour = mix(grassColour, texture2D(grassMap, mat2(0.8, 0.6, -0.6, 0.8) * top * 0.17).rgb, 0.4);
vec3 ground = grassColour * share.x;
vec3 earthBend = vec3(0.0);
vec3 rockBend = vec3(0.0);
if (share.y > 0.01) {
  ground += wrapped(earthMap, earthNormal, 0.7, side, bumps) * share.y;
  earthBend = wrapBend;
}
if (share.z > 0.01) {
  ground += wrapped(rockMap, rockNormal, 0.32, side, bumps) * share.z;
  rockBend = wrapBend;
}
// Forest seen from afar is its canopy, not its floor.
ground += mix(untiled(forestMap, top * 0.4, worldDx.xz * 0.4, worldDy.xz * 0.4).rgb, vec3(0.05, 0.075, 0.035) * (0.8 + 0.5 * texture2D(grassMap, top * 0.05).g), smoothstep(70.0, 260.0, far)) * share.w;
ground *= macro(top) * vShade;
diffuseColor.rgb *= ground * 1.3;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
if (far < 60.0) {
  vec3 bend = vec3(texture2D(grassNormal, top * 0.5).x * 2.0 - 1.0, 0.0, texture2D(grassNormal, top * 0.5).y * 2.0 - 1.0) * share.x;
  bend += earthBend * share.y + rockBend * share.z * 1.3;
  vec2 needles = texture2D(forestNormal, top * 0.4).xy * 2.0 - 1.0;
  bend += vec3(needles.x, 0.0, needles.y) * share.w;
  vec3 world = normalize(normalize(vWorldNormal) + bend * 0.9);
  normal = normalize((viewMatrix * vec4(world, 0.0)).xyz);
}`)},e.customProgramCacheKey=()=>t?"landscape-far":"landscape",e}shadeAt(t,e,n){let s=0;for(let r=0;r<8;r++){let o=Math.cos(r/8*Math.PI*2),a=Math.sin(r/8*Math.PI*2),l=0;for(let c of[1.2,3,7])l=Math.max(l,(io(t+o*c,e+a*c)-n)/c);s+=Math.max(0,Math.sin(Math.atan(l)))}return 1-.55*(s/8)}tile(t,e,n){let s=`${t}:${e}:${n}`;if(this.tiles.has(s))return this.tiles.get(s);let r=[1,2,4,8][t]*Vn,o=Math.round(ui/r),a=e*ui,l=n*ui,c=(o+1)*(o+1)+4*(o+1),h=new Float32Array(c*3),d=new Float32Array(c*3),u=new Float32Array(c*4),f=new Float32Array(c);for(let x=0;x<=o;x++)for(let y=0;y<=o;y++){let _=x*(o+1)+y,E=a+y*r,S=l+x*r,T=io(E,S)-(Da(E,S)===xe.ROAD?.18:0),A=Math.max(r,1),C=(K,z)=>io(E+K,S+z),L=(C(A,-A)-C(-A,-A)+2*(C(A,0)-C(-A,0))+C(A,A)-C(-A,A))/(8*A),U=(C(-A,A)-C(-A,-A)+2*(C(0,A)-C(0,-A))+C(A,A)-C(A,-A))/(8*A),N=new P(-L,1,-U).normalize();h.set([E,T,S],_*3),d.set([N.x,N.y,N.z],_*3);let F=[0,0,0,0],H=Math.max(1,r/Vn/2),G=Math.hypot(L,U);for(let[K,z]of[[0,0],[-H,0],[H,0],[0,-H],[0,H]]){let V=Da(E+K*Vn,S+z*Vn),I=V>=0?La[V]:Hd(E,S,G);V===xe.LOOSE&&G>1.1&&(I=G>1.6?[0,.25,.75,0]:[0,.6,.4,0]);for(let ot=0;ot<4;ot++)F[ot]+=I[ot]}u.set(F.map(K=>K/5),_*4),f[_]=t<3?this.shadeAt(E,S,T):.85}let g=[],v=x=>h[x*3+1];for(let x=0;x<o;x++)for(let y=0;y<o;y++){let _=x*(o+1)+y;Math.abs(v(_)-v(_+o+2))<=Math.abs(v(_+1)-v(_+o+1))?g.push(_,_+o+2,_+1,_,_+o+1,_+o+2):g.push(_,_+o+1,_+1,_+1,_+o+1,_+o+2)}let p=[x=>x,x=>o*(o+1)+x,x=>x*(o+1),x=>x*(o+1)+o],m=(o+1)*(o+1);for(let x of p){let y=m;for(let _=0;_<=o;_++){let E=x(_);h.set([h[E*3],h[E*3+1]-1.5,h[E*3+2]],m*3),d.set(d.subarray(E*3,E*3+3),m*3),u.set(u.subarray(E*4,E*4+4),m*4),f[m]=f[E],_&&g.push(x(_-1),x(_),y+_-1,x(_),y+_,y+_-1,x(_-1),y+_-1,x(_),x(_),y+_-1,y+_),m++}}let b=new he;b.setAttribute("position",new re(h,3)),b.setAttribute("normal",new re(d,3)),b.setAttribute("splat",new re(u,4)),b.setAttribute("shade",new re(f,1)),b.setIndex(g),b.computeBoundingSphere();let M=new Zt(b,this.ground);return M.receiveShadow=!0,M.visible=!1,this.scene.add(M),this.tiles.set(s,M),M}buildFar(){let e=Math.round(2*Pa/8),n=zd-Pa,s=kd-Pa,r=new Float32Array((e+1)*(e+1)*3),o=new Float32Array((e+1)*(e+1)*4),a=new Float32Array((e+1)*(e+1)).fill(.85);for(let d=0;d<=e;d++)for(let u=0;u<=e;u++){let f=n+u*8,g=s+d*8,v=d*(e+1)+u;r.set([f,io(f,g)-.6,g],v*3);let p=(ve.natural(f+4,g)-ve.natural(f-4,g))/8,m=(ve.natural(f,g+4)-ve.natural(f,g-4))/8;o.set(Hd(f,g,Math.hypot(p,m)),v*4)}let l=[];for(let d=0;d<e;d++)for(let u=0;u<e;u++){let f=d*(e+1)+u;l.push(f,f+e+1,f+1,f+1,f+e+1,f+e+2)}let c=new he;c.setAttribute("position",new re(r,3)),c.setAttribute("splat",new re(o,4)),c.setAttribute("shade",new re(a,1)),c.setIndex(l),c.computeVertexNormals();let h=new Zt(c,this.distant);h.receiveShadow=!0,this.scene.add(h)}buildRoad(){let t=ve.road,e=.3,n=17,s=(t.count-1)*2+1,r=new Float32Array(s*n*3),o=new Float32Array(s*n*2),a=new Float32Array(s*n*4),l=new Float32Array(s*n),c=new Float32Array(s*n);for(let v=0;v<s;v++){let p=v/2,m=Math.floor(p),b=p-m,M=Math.min(t.count-1,m+1),x=t.x[m]+(t.x[M]-t.x[m])*b,y=t.z[m]+(t.z[M]-t.z[m])*b,_=t.hx[m]+(t.hx[M]-t.hx[m])*b,E=t.hz[m]+(t.hz[M]-t.hz[m])*b,S=t.half[m]+(t.half[M]-t.half[m])*b;for(let T=0;T<n;T++){let A=T/(n-1)*2-1,C=T===0||T===n-1,L=C?Math.sign(A)*(S+e):A*S*(n-1)/(n-3),U=Math.max(-S,Math.min(S,L)),N=x-E*L,F=y+_*L,H=v*n+T,G=C?ve.height(N,F)+.03:ve.roadSurface(p,U)+.012;r.set([N,G,F],H*3),o.set([L/3+.5,p*.5/3],H*2),a.set([1,1,1,C?0:1],H*4),l[H]=L/S,c[H]=this.shadeAt(N,F,G)}}let h=[];for(let v=0;v<s-1;v++)for(let p=0;p<n-1;p++){let m=v*n+p;h.push(m,m+1,m+n,m+1,m+n+1,m+n)}let d=new he;d.setAttribute("position",new re(r,3)),d.setAttribute("uv",new re(o,2)),d.setAttribute("color",new re(a,4)),d.setAttribute("side",new re(l,1)),d.setAttribute("shade",new re(c,1)),d.setIndex(h),d.computeVertexNormals();let u=new De({map:this.tex.track.map,normalMap:this.tex.track.normal,normalScale:new it(.9,.9),roughness:.94,vertexColors:!0,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),f=this.tex;u.onBeforeCompile=v=>{Object.assign(v.uniforms,{earthMap:{value:f.earth.map},grassMap:{value:f.grass.map},tileNoise:Se.cloudMap}),v.vertexShader=v.vertexShader.replace("#include <common>",`#include <common>
attribute float side;
attribute float shade;
varying float vSide;
varying float vRoadShade;
varying vec3 vRoadWorld;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vSide = side;
vRoadShade = shade;
vRoadWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),v.fragmentShader=v.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D earthMap;
uniform sampler2D grassMap;
${r0}
varying float vSide;
varying float vRoadShade;
varying vec3 vRoadWorld;`).replace("#include <map_fragment>",`vec2 top = vRoadWorld.xz;
worldDx = dFdx(vRoadWorld);
worldDy = dFdy(vRoadWorld);
vec3 worn = texture2D(map, vMapUv).rgb * 2.0;
vec3 earth = untiled(earthMap, top * 0.7, worldDx.xz * 0.7, worldDy.xz * 0.7).rgb;
vec3 grass = untiled(grassMap, top * 0.5, worldDx.xz * 0.5, worldDy.xz * 0.5).rgb;
float patchy = texture2D(tileNoise, top / 7.0).r - 0.5;
float along = texture2D(tileNoise, vec2(vMapUv.y * 3.0 / 160.0, 0.5)).r;
float verge = smoothstep(0.7, 1.05, abs(vSide) + patchy * 0.55);
float hump = (1.0 - smoothstep(0.1, 0.24, abs(vSide) + patchy * 0.2)) * smoothstep(0.52, 0.62, along + patchy * 0.25);
vec3 ground = mix(earth * worn * 1.06, grass, max(verge, hump) * 0.85);
ground *= macro(top) * vRoadShade;
diffuseColor.rgb *= ground * 1.3;
diffuseColor.a *= 1.0 - smoothstep(0.86, 1.12, abs(vSide) + patchy * 0.3);`)},u.customProgramCacheKey=()=>"road";let g=new Zt(d,u);g.receiveShadow=!0,g.renderOrder=1,this.scene.add(g),this.buildLogs()}buildLogs(){let t=new De({map:this.tex.bark.map,normalMap:this.tex.bark.normal,roughness:.95}),e=new De({color:13215349,roughness:.85}),n=[],s=[],r=(a,l,c)=>a.applyMatrix4(new se().compose(l,c,new P(1,1,1)));for(let a of ve.logs){let l=a.reach*2,c=new cn().setFromUnitVectors(new P(0,1,0),new P(a.ax,a.grade,a.az).normalize()),h=new P(a.x,a.base+.8*a.r,a.z),d=new _e(a.r,a.r*1.05,l,a.kind==="log"?14:6,1,a.kind!=="log");if(a.kind==="log"){let u=d.toNonIndexed(),f=d.groups,g=v=>{let p=new he;for(let m of["position","normal","uv"]){let b=u.attributes[m];p.setAttribute(m,new re(b.array.slice(v.start*b.itemSize,(v.start+v.count)*b.itemSize),b.itemSize))}return p};n.push(r(g(f[0]),h,c));for(let v of f.slice(1))s.push(r(g(v),h,c))}else{n.push(r(d.toNonIndexed(),h,c));for(let u of[-.3,.25]){let f=new _e(a.r*.35,a.r*.5,.35+a.r*4,5,1,!0).toNonIndexed(),g=new cn().setFromEuler(new kn(.9*Math.sign(u),Math.atan2(a.ax,a.az),.6));n.push(r(f,new P(a.x+a.ax*u*l,h.y+a.grade*u*l,a.z+a.az*u*l),g))}}}let o=a=>{let l=new he;for(let c of["position","normal","uv"]){let h=a[0].attributes[c].itemSize,d=new Float32Array(a.reduce((f,g)=>f+g.attributes[c].array.length,0)),u=0;for(let f of a)d.set(f.attributes[c].array,u),u+=f.attributes[c].array.length;l.setAttribute(c,new re(d,h))}return l};for(let[a,l]of[[n,t],[s,e]]){if(!a.length)continue;let c=new Zt(o(a),l);c.castShadow=c.receiveShadow=!0,this.scene.add(c)}}buildTrees(){let t=new _e(.7,1,1,7).translate(0,.5,0),e=new Dn(1,1).translate(0,.5,0),n=(()=>{let M=[],x=[],y=[],_=(T,A,C,L)=>{for(let[U,N,F]of[[T,0,0],[A,1,0],[C,0,1],[A,1,0],[L,1,1],[C,0,1]]){M.push(...U),x.push(N,F);let H=new P(U[0],U[1]-.5,U[2]).normalize();y.push(H.x,H.y*.6+.4,H.z)}};for(let T=0;T<8;T++){let A=T/7,C=.16+A*.74,L=.38*(1-A)+.07,U=.07+.07*(1-A),N=8;for(let F=0;F<N;F++){let H=F/N*Math.PI*2+T*2.4,G=Math.cos(H),K=Math.sin(H),z=L*1.05,V=[G*L,C-U,K*L];for(let I of[-.7,.7]){let ot=-K*Math.cos(I)*(z/2),ct=Math.sin(I)*(z/2),gt=G*Math.cos(I)*(z/2);_([ot*.3,C+ct*.3,gt*.3],[-ot*.3,C-ct*.3,-gt*.3],[V[0]+ot,V[1]+ct,V[2]+gt],[V[0]-ot,V[1]-ct,V[2]-gt])}}}for(let T of[0,Math.PI/2]){let A=Math.cos(T)*.05,C=Math.sin(T)*.05;_([A,.82,C],[-A,.82,-C],[A,1,C],[-A,1,-C])}let S=new he;return S.setAttribute("position",new Yt(M,3)),S.setAttribute("uv",new Yt(x,2)),S.setAttribute("normal",new Yt(y,3)),S})(),s=new De({color:5061162,roughness:1,map:this.tex.rock.map}),r=s0(new De({map:this.tex.twig,alphaTest:.42,side:$e,roughness:.9}),"needles");this.pine={trunkGeo:t,branchGeo:n,trunkMat:s,needleMat:r},this.pictures={ambient:{value:null},sun:{value:null},detail:{value:n0},...Se};let o=yh.toFixed(1),a=new pe({uniforms:this.pictures,vertexShader:`
#include <common>
varying vec2 vUv0;
varying vec2 vUv1;
varying float vBlend;
varying vec3 vTint;
varying vec3 vWorld;
attribute vec2 block;
uniform float detail;
void main() {
  vec3 base = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  // A pine in a block near enough to be drawn branch by branch isn't drawn as a picture: its
  // corners all go to one point, so there's nothing to draw.
  if (distance(cameraPosition.xz, block) < detail) {
    vWorld = base;
    gl_Position = projectionMatrix * viewMatrix * vec4(base, 1.0);
    return;
  }
  float wide = length(instanceMatrix[0].xyz);
  float tall = length(instanceMatrix[1].xyz);
  vec2 toCamera = normalize(cameraPosition.xz - base.xz);
  float f = mod(atan(toCamera.x, toCamera.y) / (2.0 * PI) * ${o} + ${o}, ${o});
  float k0 = floor(f);
  float k1 = mod(k0 + 1.0, ${o});
  vBlend = f - k0;
  float u = position.x + 0.5;
  vUv0 = vec2((k0 + u) / ${o}, position.y);
  vUv1 = vec2((k1 + u) / ${o}, position.y);
  vec3 right = vec3(toCamera.y, 0.0, -toCamera.x);
  vWorld = base + right * position.x * ${(i0*1.04).toFixed(4)} * wide / ${Bd.toFixed(3)} + vec3(0.0, (position.y * 1.04 - 0.02) * tall, 0.0);
  vTint = vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
    vTint = instanceColor;
  #endif
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}`,fragmentShader:`
#include <common>
uniform sampler2D ambient;
uniform sampler2D sun;
uniform vec3 sunColour;
uniform vec3 hazeColour;
uniform float hazeDensity;
uniform float hazeThin;
varying vec2 vUv0;
varying vec2 vUv1;
varying float vBlend;
varying vec3 vTint;
varying vec3 vWorld;
${eo}
${Ud}
${Ra}
void main() {
  vec4 a = mix(texture2D(ambient, vUv0), texture2D(ambient, vUv1), vBlend);
  if (a.a < 0.5) discard;
  vec3 s = mix(texture2D(sun, vUv0), texture2D(sun, vUv1), vBlend).rgb;
  vec3 colour = (a.rgb + s * sunlightAt(vWorld)) / a.a * vTint;
  vec3 ray = vWorld - cameraPosition;
  float dist = length(ray);
  float mu = max(dot(ray / dist, sunTo), 0.0);
  vec3 tint = hazeColour + sunColour * (0.025 * pow(mu, 5.0) + 0.05 * pow(mu, 24.0));
  colour = mix(colour, tint, hazeOf(dist, cameraPosition.y, ray.y, hazeDensity, hazeThin));
  gl_FragColor = vec4(colour, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`}),l=ve.trees.slice(),c=99,h=()=>(c=c*1664525+1013904223>>>0)/4294967296;for(let M=0;M<11e3;M++){let x=zd+(h()*2-1)*Pa*.85,y=kd+(h()*2-1)*Pa*.85;if(x>$i-4&&x<Gd+4&&y>Ji-4&&y<Vd+4)continue;let _=(ve.natural(x+3,y)-ve.natural(x-3,y))/6,E=(ve.natural(x,y+3)-ve.natural(x,y-3))/6;if(Hd(x,y,Math.hypot(_,E))!==La[xe.FOREST]&&h()>.15)continue;let S=7+h()*13;l.push({x,z:y,r:.12+S*.016,height:S,base:ve.natural(x,y),shade:h()})}let d=new Map;for(let M of l){let x=`${Math.floor(M.x/Zi)}:${Math.floor(M.z/Zi)}`;d.has(x)||d.set(x,{x:(Math.floor(M.x/Zi)+.5)*Zi,z:(Math.floor(M.z/Zi)+.5)*Zi,list:[]}),d.get(x).list.push(M)}this.treeBlocks=[];let u=new ri(e,a,l.length),f=new Float32Array(l.length*2),g=0,v=new se,p=new cn,m=new Nt,b=new P(0,1,0);for(let M of d.values()){let{list:x}=M,y=new ri(t,s,x.length),_=new ri(n,r,x.length);x.forEach((E,S)=>{p.setFromAxisAngle(b,E.shade*6.28),v.compose(new P(E.x,E.base-.3,E.z),p,new P(E.r,E.height*.75,E.r)),y.setMatrixAt(S,v);let T=E.height*(.27+E.shade*.08);v.compose(new P(E.x,E.base,E.z),p,new P(T,E.height,T)),u.setMatrixAt(g,v),_.setMatrixAt(S,v),m.setHSL(.25+E.shade*.06,.25,.75+E.shade*.25),u.setColorAt(g,m),_.setColorAt(S,m),f.set([M.x,M.z],g*2),g++});for(let E of[y,_])E.castShadow=!0,E.receiveShadow=!0;for(let E of[y,_])E.computeBoundingSphere(),this.scene.add(E);_.visible=y.visible=!1,this.treeBlocks.push({x:M.x,z:M.z,near:_,trunks:y})}e.setAttribute("block",new Is(f,2)),u.frustumCulled=!1,this.scene.add(u),this.cards=u}buildBoulders(){let t=new Vr(1,3),e=t.attributes.position;for(let a=0;a<e.count;a++){let l=new P().fromBufferAttribute(e,a),c=1+.06*Math.sin(l.x*5.1+l.z*3.3)*Math.cos(l.y*4.7-l.x*2.1)+.03*Math.sin(l.x*13+l.y*11);e.setXYZ(a,l.x*c,l.y<-.3?-.3-(l.y+.3)*.2:l.y*c*(l.y>.6?.92:1),l.z*c)}t.computeVertexNormals();let n=new De({map:this.tex.rock.map,normalMap:this.tex.rock.normal,roughness:.88,color:12893876}),s=new Map;for(let a of ve.boulders){let l=`${Math.floor(a.x/Zi)}:${Math.floor(a.z/Zi)}`;s.has(l)||s.set(l,[]),s.get(l).push(a)}let r=new se,o=new cn;this.boulderBlocks=[];for(let[a,l]of s){let[c,h]=a.split(":").map(Number),d=new ri(t,n,l.length);this.boulderBlocks.push({mesh:d,x:(c+.5)*Zi,z:(h+.5)*Zi}),l.forEach((u,f)=>{o.setFromAxisAngle(new P(0,1,0),-u.turn),r.compose(new P(u.x,u.base,u.z),o,new P(u.rx,u.h,u.rz)),d.setMatrixAt(f,r)}),d.castShadow=!0,d.receiveShadow=!0,d.computeBoundingSphere(),this.scene.add(d)}}buildVerges(){let t=(p,m=0)=>{let b=[],M=[],x=[];for(let _=0;_<p;_++){let E=_/p*Math.PI,S=Math.cos(E)*.5,T=Math.sin(E)*.5,A=_%2?m:-m,C=[[-S,0,-T,0,0],[S,0,T,1,0],[-S-T*A,1,-T+S*A,0,1],[S-T*A,1,T+S*A,1,1]];for(let L of[0,1,2,1,3,2]){let[U,N,F,H,G]=C[L];b.push(U,N,F),M.push(H,G);let K=new P(U,.45+N*.6,F).normalize();x.push(K.x,K.y,K.z)}}let y=new he;return y.setAttribute("position",new Yt(b,3)),y.setAttribute("uv",new Yt(M,2)),y.setAttribute("normal",new Yt(x,3)),y},e=p=>{let m=[],b=[],M=[];for(let y=0;y<p;y++){let _=y/p*Math.PI*2+y%2*.4,E=[Math.cos(_),Math.sin(_)],S=[-E[1],E[0]],T=.7+y%3*.12,A=[[-S[0]*.08,0,-S[1]*.08,0,0],[S[0]*.08,0,S[1]*.08,1,0],[E[0]*T-S[0]*.28,.55,E[1]*T-S[1]*.28,0,1],[E[0]*T+S[0]*.28,.55,E[1]*T+S[1]*.28,1,1]];for(let C of[0,1,2,1,3,2]){let[L,U,N,F,H]=A[C];m.push(L,U,N),b.push(F,H);let G=new P(E[0]*.5,1,E[1]*.5).normalize();M.push(G.x,G.y,G.z)}}let x=new he;return x.setAttribute("position",new Yt(m,3)),x.setAttribute("uv",new Yt(b,2)),x.setAttribute("normal",new Yt(M,3)),x},n=new Vr(1,1);{let p=n.attributes.position;for(let m=0;m<p.count;m++){let b=new P().fromBufferAttribute(p,m),M=1+.12*Math.sin(b.x*4.1+b.z*2.3)*Math.cos(b.y*3.7);p.setXYZ(m,b.x*M,Math.max(-.25,b.y)*M,b.z*M)}n.computeVertexNormals()}let s=this.wind,r=(p,m,b)=>{let M=new De({map:p,alphaTest:.42,side:$e,roughness:.9});return M.onBeforeCompile=x=>{x.uniforms.wind=s,x.vertexShader=x.vertexShader.replace("#include <common>",`#include <common>
uniform float wind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
float sway = sin(wind * 1.3 + instanceMatrix[3].x * 0.6 + instanceMatrix[3].z * 0.4) + 0.4 * sin(wind * 2.9 + instanceMatrix[3].z * 1.7);
transformed.x += sway * ${b.toFixed(3)} * uv.y * uv.y;
transformed.z += sway * ${(b*.6).toFixed(3)} * uv.y * uv.y;`),x.fragmentShader=x.fragmentShader.replace("#include <normal_fragment_begin>",Wd)},M.customProgramCacheKey=()=>m,M},o=[{name:"bush",geo:t(4,.15),material:r(this.tex.shrub,"verge-bush",.03),shadow:!0},{name:"fern",geo:e(7),material:r(this.tex.fern,"verge-fern",.06),shadow:!1},{name:"flowers",geo:t(3,.1),material:r(this.tex.flowers,"verge-flowers",.08),shadow:!1},{name:"pebble",geo:n,material:new De({map:this.tex.rock.map,normalMap:this.tex.rock.normal,roughness:.9,color:12104102}),shadow:!1}],a=ve.road,l=31,c=()=>(l=l*1664525+1013904223>>>0)/4294967296,h=new Map,d=(p,m,b,M,x)=>{let y=`${Math.floor(m/dr.block)}:${Math.floor(b/dr.block)}`;h.has(y)||h.set(y,{x:(Math.floor(m/dr.block)+.5)*dr.block,z:(Math.floor(b/dr.block)+.5)*dr.block,lists:o.map(()=>[])}),h.get(y).lists[p].push({matrix:M.clone(),colour:x.clone()})},u=new se,f=new cn,g=new P(0,1,0),v=new Nt;for(let p=0;p<a.count;p+=1+Math.floor(c()*2))for(let m of[-1,1])for(let b=0;b<5;b++){let M=m*(a.half[p]+.12+Math.pow(c(),1.9)*7),x=(c()-.5)*.5,y=a.x[p]-a.hz[p]*M+a.hx[p]*x,_=a.z[p]+a.hx[p]*M+a.hz[p]*x;if(Da(y,_)===xe.ROAD||ve.onRoad(y,_))continue;let E=no(y,_),S=Math.hypot(no(y+.5,_)-no(y-.5,_),no(y,_+.5)-no(y,_-.5)),T=c();if(!(S>1.4&&(T<.28||c()<.85)))if(f.setFromAxisAngle(g,c()*Math.PI*2),T<.28){let A=.7+c()*.9;u.compose(new P(y,E-.06,_),f,new P(A,A*(.7+c()*.35),A)),v.setHSL(.24+c()*.07,.25+c()*.2,.72+c()*.28),d(0,y,_,u,v)}else if(T<.52){let A=.4+c()*.45;u.compose(new P(y,E-.03,_),f,new P(A,A,A)),v.setHSL(.22+c()*.06,.3,.75+c()*.25),d(1,y,_,u,v)}else if(T<.86){let A=.4+c()*.45;u.compose(new P(y,E-.03,_),f,new P(A*1.2,A,A*1.2)),v.setHSL(.15+c()*.1,.25,.8+c()*.2),d(2,y,_,u,v)}else for(let A=0;A<3+c()*5;A++){let C=y+(c()-.5)*1.2,L=_+(c()-.5)*1.2;if(Da(C,L)===xe.ROAD)continue;let U=.03+Math.pow(c(),2)*.1;f.setFromAxisAngle(g,c()*Math.PI*2),u.compose(new P(C,no(C,L)-U*.25,L),f,new P(U*(1+c()*.5),U*(.45+c()*.3),U)),v.setScalar(.75+c()*.35),d(3,C,L,u,v)}}this.vergeBlocks=[];for(let p of h.values()){let m=[];p.lists.forEach((b,M)=>{if(!b.length)return;let x=o[M],y=new ri(x.geo,x.material,b.length);b.forEach((_,E)=>{y.setMatrixAt(E,_.matrix),y.setColorAt(E,_.colour)}),y.castShadow=x.shadow,y.receiveShadow=!0,y.computeBoundingSphere(),y.visible=!1,this.scene.add(y),m.push(y)}),this.vergeBlocks.push({x:p.x,z:p.z,meshes:m})}}buildGrass(){let t=new Dn(.6,.42).translate(0,.21,0),e=new he,n=[t,t.clone().rotateY(Math.PI/2),t.clone().rotateY(Math.PI/4)],s=[],r=[];for(let h of n){let d=h.toNonIndexed();s.push(...d.attributes.position.array),r.push(...d.attributes.uv.array)}e.setAttribute("position",new Yt(s,3)),e.setAttribute("uv",new Yt(r,2)),e.setAttribute("normal",new Yt(s.map((h,d)=>d%3===1?1:0),3));let o=new De({map:this.tex.tuft,alphaTest:.45,side:$e,roughness:1,color:9870468}),a={value:0};o.onBeforeCompile=h=>{h.uniforms.wind=a,h.vertexShader=h.vertexShader.replace("#include <common>",`#include <common>
uniform float wind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
float sway = sin(wind * 1.7 + instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.5) + 0.5 * sin(wind * 3.1 + instanceMatrix[3].x * 1.9);
transformed.x += sway * 0.05 * uv.y;
transformed.z += sway * 0.03 * uv.y;`),h.fragmentShader=h.fragmentShader.replace("#include <normal_fragment_begin>",Wd)},this.wind=a,this.grass=new ri(e,o,Ia.count),this.grass.receiveShadow=!0,this.grass.frustumCulled=!1,this.scene.add(this.grass);let l=5,c=()=>(l=l*1664525+1013904223>>>0)/4294967296;this.scatter=Array.from({length:Ia.count},()=>({x:c()*Ia.size,z:c()*Ia.size,s:.7+c()*.7,a:c()*6.28,keep:c()})),this.grassAt=null}placeGrass(t){let e=Ia.size,n=new se,s=new cn,r=new se().makeScale(0,0,0);this.scatter.forEach((o,a)=>{let l=t.x-e/2+((o.x-(t.x-e/2))%e+e)%e,c=t.z-e/2+((o.z-(t.z-e/2))%e+e)%e,h=Da(l,c);if(!(h===xe.GRASS&&o.keep<.7||h===xe.FOREST&&o.keep<.12||h<0&&o.keep<.4)){this.grass.setMatrixAt(a,r);return}s.setFromAxisAngle(new P(0,1,0),o.a),n.compose(new P(l,io(l,c)-.03,c),s,new P(o.s,o.s,o.s)),this.grass.setMatrixAt(a,n)}),this.grass.instanceMatrix.needsUpdate=!0}bakeTrees(t,{hemi:e,sun:n,environment:s}){let r=so*yh;this.baked||(this.baked=[0,1].map(()=>new Fe(r,Mh,{type:Xe,minFilter:ci,magFilter:Ze,generateMipmaps:!0})),this.pictures.ambient.value=this.baked[0].texture,this.pictures.sun.value=this.baked[1].texture);let{trunkGeo:o,branchGeo:a,trunkMat:l,needleMat:c}=this.pine,h=new Ps,d=new Zt(a,s0(new De({map:c.map,alphaTest:c.alphaTest,side:$e,roughness:c.roughness}),"needles-bake"));d.scale.set(Bd,1,Bd);let u=new Zt(o,new De({color:l.color,roughness:1,map:l.map}));u.scale.set(.025,.75,.025),u.position.y=-.02;for(let M of[d,u])M.castShadow=M.receiveShadow=!0;let f=new sr(e.color,e.groundColor,e.intensity),g=new rr(n.color,n.intensity);g.position.copy(Se.sunTo.value).multiplyScalar(3).add(new P(0,.5,0)),g.target.position.set(0,.5,0),g.castShadow=!0,Object.assign(g.shadow.camera,{left:-.7,right:.7,top:.7,bottom:-.7,near:.5,far:6}),g.shadow.mapSize.set(512,512),g.shadow.bias=-.002,h.add(d,u,f,g,g.target);let v=i0*1.04/2,p=new Gi(-v,v,.52,-.52,.1,10),m=t.getClearColor(new Nt),b=t.getClearAlpha();t.setClearColor(0,0),this.baked.forEach((M,x)=>{f.visible=x===0,h.environment=x===0?s:null,g.intensity=x===1?n.intensity:0,t.setRenderTarget(M),M.scissorTest=!1,t.clear(),M.scissorTest=!0;for(let y=0;y<yh;y++){let _=y/yh*Math.PI*2;p.position.set(Math.sin(_)*5,.5,Math.cos(_)*5),p.lookAt(0,.5,0),M.viewport.set(y*so,0,so,Mh),M.scissor.set(y*so,0,so,Mh),t.render(h,p)}M.scissorTest=!1}),t.setRenderTarget(null),t.setClearColor(m,b),g.shadow.dispose();for(let M of[d.material,u.material])M.dispose()}update(t,e=1/60){this.time+=e,this.wind.value=this.time;for(let a of this.uniforms)a.viewFrom.value.copy(t);let n=new Set,s=Math.ceil(Od/ui),r=Math.floor(t.x/ui),o=Math.floor(t.z/ui);for(let a=o-s;a<=o+s;a++)for(let l=r-s;l<=r+s;l++){let c=Math.hypot((l+.5)*ui-t.x,(a+.5)*ui-t.z);if(c>Od)continue;let d=l*ui>=$i&&(l+1)*ui<=Gd&&a*ui>=Ji&&(a+1)*ui<=Vd?c<60?0:c<120?1:2:3,u=this.tile(d,l,a);u.visible=!0,n.add(u)}for(let a of this.shown)n.has(a)||(a.visible=!1);this.shown=n;for(let a of this.treeBlocks){let l=Math.hypot(a.x-t.x,a.z-t.z)<n0;a.near.visible=l,a.trunks.visible=l}for(let a of this.vergeBlocks){let l=Math.hypot(a.x-t.x,a.z-t.z)<dr.seen;for(let c of a.meshes)c.visible=l}for(let a of this.boulderBlocks)a.mesh.visible=Math.hypot(a.x-t.x,a.z-t.z)<K1;(!this.grassAt||Math.hypot(t.x-this.grassAt.x,t.z-this.grassAt.z)>2)&&(this.grassAt=t.clone(),this.placeGrass(t))}};var{x0:tS,z0:eS,nx:nS,nz:iS,cell:l0}=ve.grid,ao=tS+(nS-1)*l0/2,lo=eS+(iS-1)*l0/2,o0=700,c0=7500,ks=768,oo=128,sS=2e4,Xd=i=>i<=0?0:i>=1?1:i*i*(3-2*i),qd=new Uint8Array(512);{let i=1234567,t=Array.from({length:256},(e,n)=>n);for(let e=255;e>0;e--){i=Math.imul(i,1103515245)+12345>>>0;let n=i%(e+1);[t[e],t[n]]=[t[n],t[e]]}for(let e=0;e<512;e++)qd[e]=t[e&255]}var rS=Array.from({length:16},(i,t)=>[Math.cos(t/16*Math.PI*2),Math.sin(t/16*Math.PI*2)]);function h0(i,t){let e=Math.floor(i),n=Math.floor(t),s=i-e,r=t-n,o=(d,u,f,g)=>{let v=rS[qd[qd[e+d&255]+n+u&255]&15];return v[0]*f+v[1]*g},a=s*s*s*(s*(s*6-15)+10),l=r*r*r*(r*(r*6-15)+10),c=o(0,0,s,r)+(o(1,0,s-1,r)-o(0,0,s,r))*a,h=o(0,1,s,r-1)+(o(1,1,s-1,r-1)-o(0,1,s,r-1))*a;return(c+(h-c)*l)*1.4}function a0(i,t){let e=0,n=1,s=1,r=0;for(let o=0;o<8;o++){let a=1-Math.abs(h0(i,t));a*=a,e+=a*n*s,r+=n,s=Math.min(1,a*1.7);let l=i*1.6-t*1.2+3.1;t=i*1.2+t*1.6+7.7,i=l,n*=.47}return e/r}var oS=[{x:ao+2700,z:lo+2900,h:1750,r:900},{x:ao-3400,z:lo-2500,h:1350,r:800}];function u0(i,t){let e=i-ao,n=t-lo,s=Math.sqrt(e*e+n*n),r=-70+35*h0(i/1100+3.3,t/1100+8.1),o=r;if(s<1600){let c=Xd((s-1e3)/600),h=ve.natural(i,t);o=h*(1-c)+Math.max(-260,Math.min(20,h))*c*.4+r*c*.6}let a=Math.atan2(n,e),l=Xd((s-1350)/1900);if(l>0){let c=820+380*Math.sin(a*3+1.1)+220*Math.sin(a*7+.4);o+=l*c*Math.max(0,a0(i/1700,t/1700)-.12)*1.6}for(let c of oS){let h=((i-c.x)**2+(t-c.z)**2)/(c.r*c.r);h<9&&(o+=c.h*Math.exp(-h*.9)*(.55+.75*a0(i/900+11,t/900+5)))}return o}var Fa=c0+600,co=50,Ki=Math.round(2*Fa/co)+1,Na=null;function aS(){if(Na)return Na;Na=new Float32Array(Ki*Ki);for(let i=0;i<Ki;i++)for(let t=0;t<Ki;t++)Na[i*Ki+t]=u0(ao-Fa+t*co,lo-Fa+i*co);return Na}function Ua(i,t){let e=aS(),n=Math.max(0,Math.min(Ki-1.001,(i-ao+Fa)/co)),s=Math.max(0,Math.min(Ki-1.001,(t-lo+Fa)/co)),r=Math.floor(n),o=Math.floor(s),a=n-r,l=s-o,c=o*Ki+r;return(e[c]*(1-a)+e[c+1]*a)*(1-l)+(e[c+Ki]*(1-a)+e[c+Ki+1]*a)*l}var lS=`
uniform vec3 zenith;
uniform vec3 horizon;
uniform vec3 sunColour;
uniform vec3 hazeColour;
varying vec3 vDir;
${eo}
uniform vec3 sunTo;
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  float mu = max(dot(d, sunTo), 0.0);
  // The sky: deep overhead, paling to the horizon, brighter round the sun.
  vec3 sky = mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), 0.42));
  sky += sunColour * (0.02 * pow(mu, 4.0) + 0.06 * pow(mu, 40.0));
  // Low down, the haze over the far distance, as the ground's haze fades into (see atmosphere.js).
  vec3 tint = hazeColour + sunColour * (0.025 * pow(mu, 5.0) + 0.05 * pow(mu, 24.0));
  sky = mix(sky, tint, exp(-max(h, 0.0) * 11.0));
  // The sun.
  sky += sunColour * smoothstep(0.99986, 0.99994, mu) * 9.0;
  // Clouds on their layer, lit from the sun's side, shaded where they're thick toward it.
  if (h > 0.004) {
    float t = (${vh.toFixed(1)} - cameraPosition.y) / h;
    vec2 p = cameraPosition.xz + d.xz * t;
    float c = cloudsAt(p);
    if (c > 0.0) {
      vec2 toSun = sunTo.xz / max(length(sunTo.xz), 0.01);
      float toward = cloudsAt(p + toSun * 420.0);
      float lit = clamp(1.0 - toward * 0.8 + (1.0 - c) * 0.35, 0.12, 1.0);
      vec3 shade = mix(zenith, hazeColour, 0.6) * 0.62;
      vec3 bright = sunColour * 0.3 + hazeColour * 0.7;
      vec3 cloud = mix(shade, bright, lit);
      cloud += sunColour * 0.12 * pow(mu, 10.0) * (1.0 - c);
      cloud = mix(cloud, tint, 1.0 - exp(-t / 42000.0));
      sky = mix(sky, cloud, c * smoothstep(0.004, 0.06, h));
    }
  }
  gl_FragColor = vec4(sky, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,cS=`
attribute float sun;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSun;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normal;
  vSun = sun;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  gl_Position.z = gl_Position.w; // at the far end of the depth
}`,hS=`
#include <common>
uniform vec3 sunTo;
uniform vec3 sunColour;
uniform vec3 hazeColour;
uniform float hazeDensity;
uniform float hazeThin;
uniform vec3 hemiSky;
uniform vec3 hemiGround;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSun;
${eo}
${Ra}
void main() {
  // The surface's own facets, a little, so the crags read.
  vec3 face = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (face.y < 0.0) face = -face;
  vec3 n = normalize(mix(normalize(vNormal), face, 0.4));
  float y = vWorld.y;
  float steep = 1.0 - n.y;
  float wander = texture2D(cloudMap, vWorld.xz / 1300.0 + 0.21).r - 0.5;
  float fine = texture2D(cloudMap, vWorld.xz / 140.0 + 0.53).r;
  // Forest low down where it isn't too steep; meadow and scree up to the rock; snow high up, where
  // it can lie, more of it on the shaded northern slopes and in the gullies.
  float treeLine = 430.0 + wander * 260.0;
  float forest = (1.0 - smoothstep(treeLine - 50.0, treeLine + 50.0, y)) * (1.0 - smoothstep(0.32, 0.5, steep));
  float green = (1.0 - smoothstep(treeLine + 30.0, treeLine + 260.0, y)) * (1.0 - smoothstep(0.25, 0.45, steep));
  float snowLine = 760.0 + wander * 380.0 + n.z * 150.0;
  float snow = smoothstep(snowLine - 30.0, snowLine + 50.0, y) * (1.0 - smoothstep(0.5, 0.72, steep + (fine - 0.5) * 0.4));
  float grain = texture2D(cloudMap, vWorld.xz / 37.0 + vec2(0.0, y / 90.0)).r;
  vec3 rock = mix(vec3(0.12, 0.11, 0.1), vec3(0.28, 0.25, 0.22), fine * 0.6 + grain * 0.4);
  vec3 albedo = mix(rock, vec3(0.13, 0.135, 0.07) * (0.8 + 0.4 * fine), green);
  albedo = mix(albedo, vec3(0.03, 0.05, 0.028) * (0.75 + 0.5 * fine), forest);
  albedo = mix(albedo, vec3(0.8, 0.83, 0.88), snow);
  // Lit by the sun where the ridges and clouds let it through, and by the sky.
  float through = vSun * (1.0 - 0.72 * cloudsAt(vWorld.xz + sunTo.xz * ((${vh.toFixed(1)} - y) / max(sunTo.y, 0.06))));
  vec3 light = sunColour * max(dot(n, sunTo), 0.0) * through + mix(hemiGround, hemiSky, n.y * 0.5 + 0.5) * 3.0;
  vec3 colour = albedo * RECIPROCAL_PI * light;
  // The haze, as on the near ground.
  vec3 ray = vWorld - cameraPosition;
  float dist = length(ray);
  float mu = max(dot(ray / dist, sunTo), 0.0);
  vec3 tint = hazeColour + sunColour * (0.025 * pow(mu, 5.0) + 0.05 * pow(mu, 24.0));
  colour = mix(colour, tint, hazeOf(dist, cameraPosition.y, ray.y, hazeDensity, hazeThin));
  gl_FragColor = vec4(colour, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,bh=class{constructor(t){this.scene=t,this.skyUniforms={zenith:{value:new Nt},horizon:{value:new Nt},cloudMap:Se.cloudMap,cloudShift:Se.cloudShift,cloudCover:Se.cloudCover,sunTo:Se.sunTo,sunColour:Se.sunColour,hazeColour:Se.hazeColour},this.sky=new Zt(new Hn(sS,48,24),new pe({uniforms:this.skyUniforms,side:vn,depthWrite:!1,depthFunc:cs,vertexShader:`varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position.z = gl_Position.w; // at the far end of the depth
}`,fragmentShader:lS})),this.sky.renderOrder=1e3,this.sky.frustumCulled=!1,this.scene.add(this.sky),this.hemi={sky:{value:new Nt},ground:{value:new Nt}},this.buildRange()}buildRange(){let t=(ks+1)*oo,e=new Float32Array(t*3),n=new Float32Array(t*3);this.rangeSun=new Float32Array(t).fill(1);let s=Math.pow(c0/o0,1/(oo-1));for(let l=0;l<oo;l++){let c=o0*Math.pow(s,l);for(let h=0;h<=ks;h++){let d=h/ks*Math.PI*2,u=ao+Math.cos(d)*c,f=lo+Math.sin(d)*c,g=l*(ks+1)+h,v=l===oo-1?-600:u0(u,f);e.set([u,v,f],g*3);let p=co,m=Ua(u-p,f)-Ua(u+p,f),b=Ua(u,f-p)-Ua(u,f+p),M=Math.hypot(m,2*p,b);n.set([m/M,2*p/M,b/M],g*3)}}let r=new Uint32Array(ks*(oo-1)*6),o=0;for(let l=oo-2;l>=0;l--)for(let c=0;c<ks;c++){let h=l*(ks+1)+c,d=h+ks+1;r.set([h,h+1,d,h+1,d+1,d],o),o+=6}let a=new he;a.setAttribute("position",new re(e,3)),a.setAttribute("normal",new re(n,3)),a.setAttribute("sun",new re(this.rangeSun,1)),a.setIndex(new re(r,1)),a.computeBoundingSphere(),this.range=new Zt(a,new pe({uniforms:{...Se,hemiSky:this.hemi.sky,hemiGround:this.hemi.ground},vertexShader:cS,fragmentShader:hS,depthWrite:!1,depthFunc:cs})),this.range.frustumCulled=!1,this.range.renderOrder=1001,this.scene.add(this.range)}shadeRange(){let t=Se.sunTo.value,e=Math.hypot(t.x,t.z),n=this.range.geometry.attributes.position.array,s=this.rangeSun;if(e<.001)s.fill(1);else{let r=t.x/e,o=t.z/e,a=t.y/e;for(let l=0;l<s.length;l++){let c=n[l*3],h=n[l*3+1]+4,d=n[l*3+2],u=-1;for(let f=40;f<9e3;f*=1.14)u=Math.max(u,(Ua(c+r*f,d+o*f)-h)/f);s[l]=Xd((a-u)/.05+.5)}}this.range.geometry.attributes.sun.needsUpdate=!0}setTime(t,e){this.skyUniforms.zenith.value.set(t.zenith),this.skyUniforms.horizon.value.set(t.horizon),this.hemi.sky.value.copy(e.color).multiplyScalar(e.intensity),this.hemi.ground.value.copy(e.groundColor).multiplyScalar(e.intensity),this.shadeRange()}update(t){this.sky.position.copy(t.position)}};var Ln={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Tn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},uS=new Gi(-1,1,1,-1,0,1),Yd=class extends he{constructor(){super(),this.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Yt([0,2,0,0,2,0],2))}},dS=new Yd,ti=class{constructor(t){this._mesh=new Zt(dS,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,uS)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var wh=class extends Tn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof pe?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=_n.clone(t.uniforms),this.material=new pe({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new ti(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Oa=class extends Tn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Eh=class extends Tn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var Th=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new it);this._width=n.width,this._height=n.height,e=new Fe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Xe}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wh(Ln),this.copyPass.material.blending=Qe,this.timer=new oa}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Oa!==void 0&&(o instanceof Oa?n=!0:o instanceof Eh&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new it);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ba={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new it},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new se},cameraProjectionMatrixInverse:{value:new se},cameraWorldMatrix:{value:new se},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new P(-1,-1,-1)},sceneBoxMax:{value:new P(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},za={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Ah={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function d0(i=5){let t=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),e=fS(t),n=e.length,s=new Uint8Array(n*4);for(let o=0;o<n;++o){let a=e[o],l=2*Math.PI*a/n,c=new P(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new In(s,t,t);return r.wrapS=Jn,r.wrapT=Jn,r.needsUpdate=!0,r}function fS(i){let t=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),e=t*t,n=Array(e).fill(0),s=Math.floor(t/2),r=t-1;for(let o=1;o<=e;){if(s===-1&&r===t?(r=t-2,s=0):(r===t&&(r=0),s<0&&(s=t-1)),n[s*t+r]!==0){r-=2,s++;continue}else n[s*t+r]=o++;r++,s--}return n}var ka={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Zd(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new it},cameraProjectionMatrixInverse:{value:new se},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Zd(i,t,e){let n=pS(i,t,e),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let o=n[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<i-1?",":")"}`}return s}function pS(i,t,e){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*t*s/i,o=Math.pow(s/(i-1),e);n.push(new P(Math.cos(r),Math.sin(r),o))}return n}var Rh=class{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r,o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,d=(l+c)*h,u=l-d,f=c-d,g=t-u,v=e-f,p,m;g>v?(p=1,m=0):(p=0,m=1);let b=g-p+h,M=v-m+h,x=g-1+2*h,y=v-1+2*h,_=l&255,E=c&255,S=this.perm[_+this.perm[E]]%12,T=this.perm[_+p+this.perm[E+m]]%12,A=this.perm[_+1+this.perm[E+1]]%12,C=.5-g*g-v*v;C<0?n=0:(C*=C,n=C*C*this._dot(this.grad3[S],g,v));let L=.5-b*b-M*M;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[T],b,M));let U=.5-x*x-y*y;return U<0?r=0:(U*=U,r=U*U*this._dot(this.grad3[A],x,y)),70*(n+s+r)}noise3d(t,e,n){let s,r,o,a,c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),d=Math.floor(e+c),u=Math.floor(n+c),f=1/6,g=(h+d+u)*f,v=h-g,p=d-g,m=u-g,b=t-v,M=e-p,x=n-m,y,_,E,S,T,A;b>=M?M>=x?(y=1,_=0,E=0,S=1,T=1,A=0):b>=x?(y=1,_=0,E=0,S=1,T=0,A=1):(y=0,_=0,E=1,S=1,T=0,A=1):M<x?(y=0,_=0,E=1,S=0,T=1,A=1):b<x?(y=0,_=1,E=0,S=0,T=1,A=1):(y=0,_=1,E=0,S=1,T=1,A=0);let C=b-y+f,L=M-_+f,U=x-E+f,N=b-S+2*f,F=M-T+2*f,H=x-A+2*f,G=b-1+3*f,K=M-1+3*f,z=x-1+3*f,V=h&255,I=d&255,ot=u&255,ct=this.perm[V+this.perm[I+this.perm[ot]]]%12,gt=this.perm[V+y+this.perm[I+_+this.perm[ot+E]]]%12,It=this.perm[V+S+this.perm[I+T+this.perm[ot+A]]]%12,Y=this.perm[V+1+this.perm[I+1+this.perm[ot+1]]]%12,B=.6-b*b-M*M-x*x;B<0?s=0:(B*=B,s=B*B*this._dot3(this.grad3[ct],b,M,x));let X=.6-C*C-L*L-U*U;X<0?r=0:(X*=X,r=X*X*this._dot3(this.grad3[gt],C,L,U));let st=.6-N*N-F*F-H*H;st<0?o=0:(st*=st,o=st*st*this._dot3(this.grad3[It],N,F,H));let pt=.6-G*G-K*K-z*z;return pt<0?a=0:(pt*=pt,a=pt*pt*this._dot3(this.grad3[Y],G,K,z)),32*(s+r+o+a)}noise4d(t,e,n,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,d,u,f,g,v=(t+e+n+s)*l,p=Math.floor(t+v),m=Math.floor(e+v),b=Math.floor(n+v),M=Math.floor(s+v),x=(p+m+b+M)*c,y=p-x,_=m-x,E=b-x,S=M-x,T=t-y,A=e-_,C=n-E,L=s-S,U=T>A?32:0,N=T>C?16:0,F=A>C?8:0,H=T>L?4:0,G=A>L?2:0,K=C>L?1:0,z=U+N+F+H+G+K,V=o[z][0]>=3?1:0,I=o[z][1]>=3?1:0,ot=o[z][2]>=3?1:0,ct=o[z][3]>=3?1:0,gt=o[z][0]>=2?1:0,It=o[z][1]>=2?1:0,Y=o[z][2]>=2?1:0,B=o[z][3]>=2?1:0,X=o[z][0]>=1?1:0,st=o[z][1]>=1?1:0,pt=o[z][2]>=1?1:0,ht=o[z][3]>=1?1:0,xt=T-V+c,Bt=A-I+c,j=C-ot+c,lt=L-ct+c,dt=T-gt+2*c,ft=A-It+2*c,vt=C-Y+2*c,Xt=L-B+2*c,Gt=T-X+3*c,Jt=A-st+3*c,ne=C-pt+3*c,O=L-ht+3*c,ye=T-1+4*c,le=A-1+4*c,D=C-1+4*c,w=L-1+4*c,q=p&255,Z=m&255,tt=b&255,mt=M&255,_t=a[q+a[Z+a[tt+a[mt]]]]%32,nt=a[q+V+a[Z+I+a[tt+ot+a[mt+ct]]]]%32,at=a[q+gt+a[Z+It+a[tt+Y+a[mt+B]]]]%32,St=a[q+X+a[Z+st+a[tt+pt+a[mt+ht]]]]%32,kt=a[q+1+a[Z+1+a[tt+1+a[mt+1]]]]%32,Mt=.6-T*T-A*A-C*C-L*L;Mt<0?h=0:(Mt*=Mt,h=Mt*Mt*this._dot4(r[_t],T,A,C,L));let yt=.6-xt*xt-Bt*Bt-j*j-lt*lt;yt<0?d=0:(yt*=yt,d=yt*yt*this._dot4(r[nt],xt,Bt,j,lt));let Ut=.6-dt*dt-ft*ft-vt*vt-Xt*Xt;Ut<0?u=0:(Ut*=Ut,u=Ut*Ut*this._dot4(r[at],dt,ft,vt,Xt));let Vt=.6-Gt*Gt-Jt*Jt-ne*ne-O*O;Vt<0?f=0:(Vt*=Vt,f=Vt*Vt*this._dot4(r[St],Gt,Jt,ne,O));let ie=.6-ye*ye-le*le-D*D-w*w;return ie<0?g=0:(ie*=ie,g=ie*ie*this._dot4(r[kt],ye,le,D,w)),27*(h+d+u+f+g)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}};var ho=class i extends Tn{constructor(t,e,n=512,s=512,r,o,a){super(),this.width=n,this.height=s,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=d0(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Fe(this.width,this.height,{type:Xe,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new pe({defines:Object.assign({},Ba.defines),uniforms:_n.clone(Ba.uniforms),vertexShader:Ba.vertexShader,fragmentShader:Ba.fragmentShader,blending:Qe,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new ea,this.normalMaterial.blending=Qe,this.pdMaterial=new pe({defines:Object.assign({},ka.defines),uniforms:_n.clone(ka.uniforms),vertexShader:ka.vertexShader,fragmentShader:ka.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new pe({defines:Object.assign({},za.defines),uniforms:_n.clone(za.uniforms),vertexShader:za.vertexShader,fragmentShader:za.fragmentShader,blending:Qe}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new pe({uniforms:_n.clone(Ln.uniforms),vertexShader:Ln.vertexShader,fragmentShader:Ln.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:ha,blendDst:or,blendEquation:li,blendSrcAlpha:ca,blendDstAlpha:or,blendEquationAlpha:li}),this.blendMaterial=new pe({uniforms:_n.clone(Ah.uniforms),vertexShader:Ah.vertexShader,fragmentShader:Ah.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Sc,blendSrc:ha,blendDst:or,blendEquation:li,blendSrcAlpha:ca,blendDstAlpha:or,blendEquationAlpha:li}),this._fsQuad=new ti(null),this._originalClearColor=new Nt,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new oi,this.depthTexture.format=Vi,this.depthTexture.type=Bs,this.normalRenderTarget=new Fe(this.width,this.height,{minFilter:je,magFilter:je,type:Xe,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Zd(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Qe,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Qe,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Qe,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Qe,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Qe,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){let t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){let t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}_generateNoise(t=64){let e=new Rh,n=t*t*4,s=new Uint8Array(n);for(let o=0;o<t;o++)for(let a=0;a<t;a++){let l=o,c=a;s[(o*t+a)*4]=(e.noise(l,c)*.5+.5)*255,s[(o*t+a)*4+1]=(e.noise(l+t,c)*.5+.5)*255,s[(o*t+a)*4+2]=(e.noise(l,c+t)*.5+.5)*255,s[(o*t+a)*4+3]=(e.noise(l+t,c+t)*.5+.5)*255}let r=new In(s,t,t,Gn,wn);return r.wrapS=Jn,r.wrapT=Jn,r.needsUpdate=!0,r}};ho.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var f0={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Nt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var uo=class i extends Tn{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new it(t.x,t.y):new it(256,256),this.clearColor=new Nt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Fe(r,o,{type:Xe,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Fe(r,o,{type:Xe,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Fe(r,o,{type:Xe,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=f0;this.highPassUniforms=_n.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new pe({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new it(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=_n.clone(Ln.uniforms),this.blendMaterial=new pe({uniforms:this.copyUniforms,vertexShader:Ln.vertexShader,fragmentShader:Ln.fragmentShader,premultipliedAlpha:!0,blending:la,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Nt,this._oldClearAlpha=1,this._basic=new Kn,this._fsQuad=new ti(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new it(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let o=0;o<t;o++)e.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<t;o+=2){let a=e[o],l=o+1<t?e[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new pe({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new it(.5,.5)},direction:{value:new it(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new pe({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};uo.BlurDirectionX=new it(1,0);uo.BlurDirectionY=new it(0,1);var Ha={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Ch=class extends Tn{constructor(){super(),this.isOutputPass=!0,this.uniforms=_n.clone(Ha.uniforms),this.material=new Wr({name:Ha.name,uniforms:this.uniforms,vertexShader:Ha.vertexShader,fragmentShader:Ha.fragmentShader}),this._fsQuad=new ti(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},de.getTransfer(this._outputColorSpace)===Te&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ua?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===da?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===fa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===pa?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ma?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ga?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ar&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var mS=30,gS=70,$d=class extends Tn{constructor(t){super(),this.draw=t,this.target=new Fe(1,1,{type:Xe,samples:4,depthTexture:new oi(1,1)}),this.copy=new ti(new pe({uniforms:_n.clone(Ln.uniforms),vertexShader:Ln.vertexShader,fragmentShader:Ln.fragmentShader})),this.copy.material.uniforms.tDiffuse.value=this.target.texture}setSize(t,e){this.target.setSize(t,e)}render(t,e){t.setRenderTarget(this.target),this.draw(t),t.setRenderTarget(this.renderToScreen?null:e),this.copy.render(t)}dispose(){this.target.dispose(),this.copy.dispose()}},Jd=class extends Tn{constructor(t,e,n){super(),this.camera=n,this.quad=new ti(new pe({uniforms:{tDiffuse:{value:null},tAO:{value:t},tDepth:{value:e},near:{value:.1},far:{value:1e3}},vertexShader:Ln.vertexShader,fragmentShader:`
#include <packing>
uniform sampler2D tDiffuse;
uniform sampler2D tAO;
uniform sampler2D tDepth;
uniform float near;
uniform float far;
varying vec2 vUv;
void main() {
  vec4 colour = texture2D(tDiffuse, vUv);
  float d = texture2D(tDepth, vUv).x;
  float distance = -perspectiveDepthToViewZ(d, near, far);
  float ao = texture2D(tAO, vUv).r;
  colour.rgb *= mix(1.0, ao, 0.9 * (1.0 - smoothstep(${mS.toFixed(1)}, ${gS.toFixed(1)}, distance)));
  gl_FragColor = colour;
}`}))}render(t,e,n){let s=this.quad.material.uniforms;s.tDiffuse.value=n.texture,s.near.value=this.camera.near,s.far.value=this.camera.far,t.setRenderTarget(this.renderToScreen?null:e),this.quad.render(t)}},Ph=class{constructor(t,e,n,s){this.renderer=t,this.composer=new Th(t,new Fe(1,1,{type:Xe})),this.world=new $d(s),this.composer.addPass(this.world);let r=new ho(e,n,1,1);r.setGBuffer(this.world.target.depthTexture),r.updateGtaoMaterial({radius:.9,distanceExponent:1.4,thickness:1.2,scale:1.1,samples:8,distanceFallOff:1,screenSpaceRadius:!1}),r.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:8}),r.output=ho.OUTPUT.Off,r.needsSwap=!1;let o=r.setSize.bind(r);r.setSize=(a,l)=>o(Math.max(1,Math.round(a/2)),Math.max(1,Math.round(l/2))),this.ao=r,this.composer.addPass(r),this.composer.addPass(new Jd(r.pdRenderTarget.texture,this.world.target.depthTexture,n)),this.composer.addPass(new uo(new it(256,256),.22,.55,2.2)),this.composer.addPass(new Ch)}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e)}render(){this.composer.render()}};function m0(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new he,c=0;for(let h=0;h<i.length;++h){let d=i[h],u=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(t){let f;if(e)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,d=[];for(let u=0;u<i.length;++u){let f=i[u].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=p0(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][u]);let g=p0(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function p0(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new re(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let d=l/e;for(let u=0,f=h.count;u<f;u++)for(let g=0;g<e;g++){let v=h.getComponent(u,g);a.setComponent(u+d,g,v)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function g0(i,t=Math.PI/3){let e=i.index?i.toNonIndexed():i,n=e.attributes.position,s=n.count,r;if(n.isBufferAttribute===!0&&n.itemSize===3&&n.normalized===!1)r=n.array;else{r=new Float64Array(s*3);for(let x=0;x<s;x++)r[3*x+0]=n.getX(x),r[3*x+1]=n.getY(x),r[3*x+2]=n.getZ(x)}let o=Math.cos(t),a=(1+1e-10)*100,l=s/3,c=new Float64Array(l*3);for(let x=0;x<l;x++){let y=9*x,_=r[y+0],E=r[y+1],S=r[y+2],T=r[y+3],A=r[y+4],C=r[y+5],L=r[y+6],U=r[y+7],N=r[y+8],F=L-T,H=U-A,G=N-C,K=_-T,z=E-A,V=S-C,I=H*V-G*z,ot=G*K-F*V,ct=F*z-H*K,gt=1/(Math.sqrt(I*I+ot*ot+ct*ct)||1);c[3*x+0]=I*gt,c[3*x+1]=ot*gt,c[3*x+2]=ct*gt}let h=new Int32Array(s),d=new Float64Array(s*3),u=1;for(;u<s*2;)u<<=1;let f=u-1,g=new Int32Array(u),v=0;for(let x=0;x<s;x++){let y=3*x,_=Math.trunc(r[y+0]*a),E=Math.trunc(r[y+1]*a),S=Math.trunc(r[y+2]*a),T=(Math.imul(_,73856093)^Math.imul(E,19349663)^Math.imul(S,83492791))&f;for(;;){let A=g[T];if(A===0){let L=3*v;d[L+0]=_,d[L+1]=E,d[L+2]=S,g[T]=v+1,h[x]=v++;break}let C=3*(A-1);if(d[C+0]===_&&d[C+1]===E&&d[C+2]===S){h[x]=A-1;break}T=T+1&f}}let p=new Int32Array(v+1);for(let x=0;x<s;x++)p[h[x]+1]++;for(let x=0;x<v;x++)p[x+1]+=p[x];let m=new Int32Array(s),b=p.slice(0,v);for(let x=0;x<l;x++){let y=3*x;m[b[h[y+0]]++]=x,m[b[h[y+1]]++]=x,m[b[h[y+2]]++]=x}let M=new Float32Array(s*3);for(let x=0;x<l;x++){let y=3*x,_=c[y+0],E=c[y+1],S=c[y+2];for(let T=0;T<3;T++){let A=y+T,C=h[A],L=0,U=0,N=0;for(let H=p[C],G=p[C+1];H<G;H++){let K=3*m[H],z=c[K+0],V=c[K+1],I=c[K+2];_*z+E*V+S*I>o&&(L+=z,U+=V,N+=I)}let F=1/(Math.sqrt(L*L+U*U+N*N)||1);M[3*A+0]=L*F,M[3*A+1]=U*F,M[3*A+2]=N*F}}return e.setAttribute("normal",new re(M,3,!1)),e}function x0({color:i,halfBase:t,arch:e,side:n,tail:s,dripRail:r}){let o=new ta({color:i,roughness:.32,metalness:.55,clearcoat:1,clearcoatRoughness:.06});return o.onBeforeCompile=a=>{a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vBodyPos;
varying vec3 vBodyNormal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vBodyPos = position;
vBodyNormal = normal;`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vBodyPos;
varying vec3 vBodyNormal;
float wearHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float wearNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wearHash(i), wearHash(i + vec3(1.0, 0.0, 0.0)), f.x),
                 mix(wearHash(i + vec3(0.0, 1.0, 0.0)), wearHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(wearHash(i + vec3(0.0, 0.0, 1.0)), wearHash(i + vec3(1.0, 0.0, 1.0)), f.x),
                 mix(wearHash(i + vec3(0.0, 1.0, 1.0)), wearHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float wearFbm(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * wearNoise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return s / 0.9375;
}`).replace("#include <color_fragment>",`#include <color_fragment>
vec3 bp = vBodyPos;
vec3 bn = normalize(vBodyNormal);
// Where rust starts: low on the body, round the wheel arches, along the drip rails.
float low = 1.0 - smoothstep(0.22, 0.5, bp.y);
float archGap = min(abs(length(vec2(bp.z - ${t.toFixed(4)}, bp.y)) - ${e.toFixed(3)}),
                    abs(length(vec2(bp.z + ${t.toFixed(4)}, bp.y)) - ${e.toFixed(3)}));
float nearArch = (1.0 - smoothstep(0.0, 0.11, archGap)) * step(${(n-.12).toFixed(3)}, abs(bp.x));
float drip = (1.0 - smoothstep(0.0, 0.04, abs(bp.y - ${r.toFixed(3)}))) * step(${(n-.04).toFixed(3)}, abs(bp.x));
float rustField = wearFbm(bp * 6.0) + 0.45 * clamp(low + nearArch * 0.8 + drip * 0.7, 0.0, 1.0);
float rust = smoothstep(0.8, 0.85, rustField);
// Chips, anywhere, small.
rust = max(rust, smoothstep(0.86, 0.9, wearFbm(bp * 15.0 + 5.3)));
// Round each patch, the paint is blistered and faded.
float blister = smoothstep(0.73, 0.8, rustField) * (1.0 - rust);
// Dirt: thick low down, sprayed up behind each wheel and across the back, streaked where it ran
// down, and dust on whatever faces up.
float spray = 0.0;
for (int k = -1; k <= 1; k += 2) {
  float behind = bp.z - float(k) * ${t.toFixed(4)};
  spray += smoothstep(0.1, 0.45, behind) * (1.0 - smoothstep(0.5, 1.2, behind)) * (1.0 - smoothstep(0.35, 0.95, bp.y));
}
float back = smoothstep(${(s-.35).toFixed(3)}, ${s.toFixed(3)}, bp.z) * (1.0 - smoothstep(0.3, 1.25, bp.y));
float lowDirt = 1.0 - smoothstep(0.12, 0.7, bp.y);
float streaks = wearNoise(bp * vec3(28.0, 1.6, 28.0));
float dust = smoothstep(0.55, 0.95, bn.y);
float dirtField = (lowDirt * 0.75 + spray * 0.6 + back * 0.55) * (0.55 + 0.7 * wearFbm(bp * vec3(7.0, 2.5, 7.0)))
  + (1.0 - smoothstep(0.2, 0.86, bp.y)) * streaks * 0.35;
float dirt = smoothstep(0.38, 0.85, dirtField);
dirt = max(dirt, dust * 0.25 * smoothstep(0.3, 0.8, wearFbm(bp * 3.0 + 2.0)));
vec3 rustColour = mix(vec3(0.075, 0.022, 0.009), vec3(0.3, 0.078, 0.018), wearNoise(bp * 26.0));
vec3 dirtColour = mix(vec3(0.1, 0.066, 0.036), vec3(0.27, 0.2, 0.12), smoothstep(0.2, 0.75, wearFbm(bp * 4.0 + 9.0)));
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.85, 0.78, 0.6), blister * 0.6);
diffuseColor.rgb = mix(diffuseColor.rgb, rustColour, rust);
diffuseColor.rgb = mix(diffuseColor.rgb, dirtColour, dirt * 0.85);
float glossy = (1.0 - rust) * (1.0 - dirt * 0.9) * (1.0 - blister * 0.5);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor + 0.05 * (wearNoise(bp * 90.0) - 0.5), 0.6, blister);
roughnessFactor = mix(roughnessFactor, 0.92, max(rust, dirt));`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor *= (1.0 - rust) * (1.0 - dirt);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{
  // Rust pits and dirt grain as a height, in metres, bending the normal as a bump map would; faded
  // out with distance, where they'd only shimmer.
  float h = rust * 0.003 * wearFbm(bp * 40.0) + blister * 0.0015 * wearNoise(bp * 34.0) + dirt * 0.0012 * wearNoise(bp * 70.0);
  h *= 1.0 - smoothstep(4.0, 14.0, length(vViewPosition));
  vec3 sx = dFdx(-vViewPosition);
  vec3 sy = dFdy(-vViewPosition);
  vec3 r1 = cross(sy, normal);
  vec3 r2 = cross(normal, sx);
  float det = dot(sx, r1) * faceDirection;
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  normal = normalize(abs(det) * normal - grad);
}`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat *= glossy;
#endif`)},o}var fo=Ie.wheelbase/2,ms=.47,tn=-1.72,ge=-.6,mn=.35,Ye=1.92,Xn=.22,ae=.86,Nn=.72,xS=.84,ji=1.6,Ee=.8,Ga=.84,di=.5,v0=.045,fn=.18,Kd=.12;function _0({maxAniso:i,makeWheel:t,rightHand:e=Ie.rightHandDrive}){let n=new Ge,s=(Y,B=.4,X=.1,st={})=>new De({color:Y,roughness:B,metalness:X,...st}),r=x0({color:5200684,halfBase:fo,arch:ms,side:Ee,tail:Ye,dripRail:ji-.07}),o=r,a=s(15130832,.4,.25),l=s(1579291,.7,.1),c=s(2763823,.55,.3),h=s(15922422,.12,1),d=new De({color:10467528,roughness:.05,metalness:.4,transparent:!0,opacity:.32,depthWrite:!1,side:$e}),u=s(16774877,.15,.2,{emissive:4209194}),f=s(15769632,.25,.1,{emissive:3809792}),g=s(12593182,.3,.1,{emissive:3147781}),v=s(2894376,.85,0),p=(Y,B,X,st,pt,ht=n,xt=!0)=>{let Bt=new Zt(Y,B);return Bt.position.set(X,st,pt),Bt.castShadow=xt,Bt.receiveShadow=!0,ht.add(Bt),Bt},m=(Y,B,X)=>new wi(Y,B,X),b=Y=>g0(Y,Math.PI/5),M=(Y,B,X,st,pt=n)=>{let ht=new ir(Y,{depth:X-B,bevelEnabled:!1,curveSegments:4});return ht.rotateX(Math.PI/2),ht.translate(0,X,0),p(b(ht),st,0,0,0,pt)},x=(Y,B,X=0,st=0)=>{let pt=fn+B,ht=[];X>0&&ht.push(new it(Y*(Ee+B),Ye-fn-X));for(let xt=0;xt<=12;xt++){let Bt=xt/12*(Math.PI/2);ht.push(new it(Y*(Ee-fn+pt*Math.cos(Bt)),Ye-fn+pt*Math.sin(Bt)))}return st>0&&ht.push(new it(Y*(Ee-fn-st),Ye+B)),ht},y=(Y,B,X,st,pt)=>new Ei([...x(Y,X,st,pt),...x(Y,B,st,pt).reverse()]),_=(Y,B)=>{let X=Ye-fn-B,st=x(1,Y,X,Ee-fn),pt=x(-1,Y,X,Ee-fn).reverse();return new Ei([...st,...pt.slice(1)])},E=(Y,B,X)=>{let st=[],pt=[];Y.forEach((xt,Bt)=>{st.push(xt.x,B,xt.y,xt.x,X,xt.y),Bt&&pt.push(2*Bt-2,2*Bt,2*Bt-1,2*Bt-1,2*Bt,2*Bt+1)});let ht=new he;return ht.setAttribute("position",new Yt(st,3)),ht.setIndex(pt),ht.computeVertexNormals(),ht},S=(Y,B,X,st)=>{let pt=new ir(Y,{depth:X,bevelEnabled:!1,curveSegments:24});return pt.rotateY(-Math.PI/2),p(pt,st,B>0?B:B+X,0,0)},T=(Y,B,X,st,pt)=>{let ht=Math.sqrt(ms*ms-st*st),xt=Math.atan2(st,ht);B<X?(Y.lineTo(pt-ht,st),Y.absarc(pt,0,ms,Math.PI-xt,xt,!0),Y.lineTo(X,st)):(Y.lineTo(pt+ht,st),Y.absarc(pt,0,ms,xt,Math.PI-xt,!1),Y.lineTo(X,st))};for(let Y of[-1,1]){let B=new Ei;B.moveTo(ge,Xn),T(B,ge,tn+.02,Xn,-fo),B.lineTo(tn+.02,Nn),B.lineTo(ge,Nn),B.closePath(),S(B,Y*Ga,.025,r);let X=new Ei;X.moveTo(ge,.3),T(X,ge,tn+.02,.3,-fo),X.lineTo(tn+.02,Nn),X.lineTo(ge,Nn),X.closePath(),S(X,Y*di,.015,c),p(m(Ga-di,.025,ge-tn-.02),r,Y*(Ga+di)/2,Nn,(ge+tn)/2+.01),p(m(.12,.05,.05),f,Y*.72,Nn+.03,tn+.06);let pt=new us(-fo,0,ms+.03,ms+.03,.45,Math.PI-.45,!1).getPoints(24).map(lt=>new P(Y*(Ga+.012),lt.y,lt.x));p(new Ds(new tr(pt),24,.022,6,!1),r,0,0,0);let ht=new Ei;ht.moveTo(mn,Xn),T(ht,mn,Ye-fn,Xn,fo),ht.lineTo(Ye-fn,ae),ht.lineTo(mn,ae),ht.closePath(),S(ht,Y*Ee,.025,r),M(y(Y,-.025,0,0,0),Xn,ae,r);let Bt=new us(fo,0,ms+.03,ms+.03,.42,Math.PI-.42,!1).getPoints(24).map(lt=>new P(Y*(Ee+.02),lt.y,lt.x));p(new Ds(new tr(Bt),24,.035,6,!1),r,0,0,0),Y===(e?1:-1)&&p(new _e(.045,.045,.02,20).rotateZ(Math.PI/2),h,Y*(Ee+.02),.58,mn+.25),p(m(.07,.16,.02),g,Y*(Ee-fn-.06),.62,Ye+.008),p(m(.035,ae-Xn,mn-ge-.03),r,Y*(Ee+.005),(ae+Xn)/2,(mn+ge)/2),p(m(.05,.02,.1),h,Y*(Ee+.03),ae-.12,mn-.14);for(let lt of[.36,.74])p(m(.04,.09,.05),l,Y*(Ee+.03),lt,ge+.03);p(m(.012,.025,mn-ge-.1),r,Y*(Ee+.028),.62,(mn+ge)/2+.04),M(y(Y,0,.01,Ye-fn-mn,0),.6075,.6325,r);let j=ji-.07;p(m(.025,j-ae-.02,.025),l,Y*(Ee-.005),(j+ae)/2,ge+.32);for(let lt of[ge+.12,mn-.03])p(m(.03,j-ae,.035),o,Y*(Ee-.01),(j+ae)/2,lt);p(new Dn(mn-ge-.18,j-ae-.02).rotateY(Math.PI/2),d,Y*(Ee-.01),(j+ae)/2,(mn+ge)/2+.045,n,!1),p(new _e(.008,.008,.16,6).rotateZ(Math.PI/2),h,Y*(Ee+.08),ae+.04,ge+.18),p(new _e(.06,.06,.025,20).rotateX(Math.PI/2),c,Y*(Ee+.16),ae+.04,ge+.18),M(y(Y,-.03,.005,Ye-fn-mn,Ee-fn),ae,ae+.045,o),M(y(Y,-.03,.005,Ye-fn-mn,.08),j-.02,ji-.06,o),p(m(.03,j-ae,.06),o,Y*(Ee-.01),(j+ae)/2,mn+.04),p(m(.03,j-ae,.08),o,Y*(Ee-.01),(j+ae)/2,1.42),p(new Dn(1.42-mn-.13,j-ae-.04).rotateY(Math.PI/2),d,Y*(Ee-.012),(j+ae)/2,(1.42+mn)/2+.005,n,!1),p(E(x(Y,-.014,Ye-fn-1.46,.08),ae+.045,j-.02),d,0,0,0,n,!1)}let A=.82;p(m(A,.09,.03),a,0,.75,tn-.005),p(m(A,.4,.02),l,0,.5,tn+.01);for(let Y=0;Y<9;Y++)p(m(.012,.38,.02),h,-A/2+.06+Y*(A-.12)/8,.5,tn-.005);p(m(A,.025,.03),h,0,.29,tn-.005);for(let Y of[-1,1]){let B=Ga-A/2;p(m(B,Nn-.2,.03),r,Y*(A/2+B/2),(Nn+.2)/2,tn),p(new _e(.1,.1,.03,32).rotateX(Math.PI/2),h,Y*.63,.56,tn-.02),p(new Hn(.085,24,12,0,Math.PI*2,0,Math.PI/3).rotateX(-Math.PI/2),u,Y*.63,.56,tn-.03,n,!1),p(new _e(.035,.035,.03,16).rotateX(Math.PI/2),f,Y*.63,.36,tn-.02)}let C=Y=>xS-v0*(Y/di)**2,L=(Y,B)=>{let X=di-Y,st=[];for(let pt=0;pt<=40;pt++){let ht=X*Math.sin((pt/40*2-1)*(Math.PI/2)),xt=Math.max(0,Math.abs(ht)-(X-B))/B;st.push(new it(ht,C(ht)-Y-B*(1-Math.sqrt(Math.max(0,1-xt*xt)))))}return st},U=.02,N=new Ei([new it(-di,Nn),...L(0,.035),new it(di,Nn),new it(di-U,Nn),...L(U,.035-U).reverse(),new it(-di+U,Nn)]),F=new ir(N,{depth:ge-tn+.02,steps:24,bevelEnabled:!1}),H=F.attributes.position;for(let Y=0;Y<H.count;Y++){let B=H.getZ(Y)/.12;B<1&&H.setY(Y,H.getY(Y)-.03*(1-B)**2)}p(b(F),r,0,0,tn-.02);for(let Y of[-1,1]){let B=Y*.16,X=p(m(.05,.012,ge-tn-.18),r,B,C(B)+.004,(ge+tn)/2+.04);X.rotation.z=Math.atan(-2*v0*B/di**2),p(m(.02,.05,.06),h,Y*(di+.012),Nn+.025,tn+.12)}p(m(2*Ee,ae-Nn+.04,.12),r,0,(ae+Nn)/2,ge+.04);let G=new Ge;G.position.set(0,ae,ge+.06),G.rotation.x=-.12,n.add(G);let K=ji-ae-.06;for(let Y of[-Ee+.03,Ee-.03])p(m(.05,K,.05),r,Y,K/2,0,G);p(m(2*Ee,.05,.05),r,0,K,0,G),p(m(2*Ee,.04,.05),r,0,.02,0,G),p(new Dn(2*Ee-.1,K-.08),d,0,K/2+.01,0,G,!1);for(let Y of[-.4,.35]){let B=p(m(.012,.36,.012),l,Y,K-.2,-.035,G);B.rotation.z=.18}M(_(.01,ge+.045),ji-.06,ji,o);let z=2*(Ee-fn-.08),V=ji-.06;p(m(z,1-ae-.045,.03),o,0,(1+ae+.045)/2,Ye-.015),p(m(z,V-1.44,.03),o,0,(V+1.44)/2,Ye-.015);for(let Y of[-1,1])p(m(Kd,.44,.03),o,Y*(z/2-Kd/2),1.22,Ye-.015);p(new Dn(z-2*Kd,.44),d,0,1.22,Ye-.012,n,!1);for(let Y of[-1,1])M(y(Y,.005,.025,Ye-fn-ge,0),ji-.08,ji-.06,o);for(let Y=-2;Y<=2;Y++)p(m(.05,.012,Ye-ge-.3),o,Y*.28,ji+.004,(Ye+ge)/2+.1);p(m(2*(Ee-fn),ae-Xn,.025),r,0,(ae+Xn)/2,Ye-.0125);for(let Y of[-.5,.5])p(m(.006,ae-Xn-.05,.004),l,Y,(ae+Xn)/2,Ye+.001,n,!1);for(let Y of[-.4,.4])p(m(.1,.03,.03),h,Y,ae-.05,Ye+.012);if(t){let Y=t();Y.rotation.y=-Math.PI/2,Y.position.set(.25,.6,Ye+.13),n.add(Y)}M(_(-.015,ge),Xn+.005,Xn+.035,c),p(m(2*di,ae-.3,.02),c,0,(ae+.3)/2,ge-.02);let I=e?1:-1;p(m(2*Ee-.05,.16,.14),r,0,ae-.1,ge+.16),p(m(2*Ee-.05,.03,.18),l,0,ae-.01,ge+.17);for(let Y of[-.1,.1])p(new _e(.055,.055,.02,24).rotateX(Math.PI/2),l,I*.38+Y,ae-.1,ge+.235),p(new ai(.055,.006,6,24),h,I*.38+Y,ae-.1,ge+.245);let ot=new Ge;ot.position.set(I*.38,ae-.06,ge+.2),ot.rotation.x=.75,n.add(ot),p(new _e(.022,.026,.42,12),c,0,.21,0,ot);let ct=new Ge;ct.position.y=.42,ot.add(ct);let gt=p(new ai(.2,.013,10,40),l,0,0,0,ct);gt.rotation.x=Math.PI/2;for(let Y=0;Y<3;Y++){let B=p(m(.2,.01,.025),h,0,0,0,ct);B.geometry.translate(.1,0,0),B.rotation.y=Math.PI/2+Y*Math.PI*2/3}p(new _e(.04,.04,.03,20),h,0,.01,0,ct);for(let Y of[-1,1]){let B=new Ge;B.position.set(Y*.4,Xn+.05,.12),n.add(B),p(m(.48,.12,.48),v,0,.2,0,B);let X=p(m(.48,.55,.1),v,0,.5,.24,B);X.rotation.x=-.12}p(new ai(.07,.008,6,16,Math.PI),h,-I*.4,ae+.02,ge+.2);for(let Y of[-1,1])M(y(Y,0,.08,.06,.16),.07,.17,l);for(let Y of[-1,1]){let B=p(new ai(.035,.012,8,16,Math.PI*1.3),l,Y*.42,.06,tn-.08);B.rotation.y=Math.PI/2}n.updateMatrixWorld(!0);let It=[];n.traverse(Y=>Y.isMesh&&Y.material===r&&It.push(Y));for(let Y of It)Y.geometry=Y.geometry.clone().applyMatrix4(Y.matrixWorld),Y.position.set(0,0,0),Y.rotation.set(0,0,0),Y.scale.set(1,1,1),n.add(Y);return{group:n,steeringWheel:ct}}function Va(i,t=new Set){i.updateMatrixWorld(!0);let e=new se().copy(i.matrixWorld).invert(),n=new Map,s=r=>{if(t.has(r))return;for(let a of r.children)s(a);if(r===i||!r.isMesh||r.isInstancedMesh||Array.isArray(r.material)||r.children.length)return;let o=[r.material.uuid,r.castShadow,r.receiveShadow,r.renderOrder,r.visible,r.name].join("|");n.has(o)||n.set(o,[]),n.get(o).push(r)};s(i);for(let r of n.values()){if(r.length<2)continue;let o=r.map(c=>{let h=new se().multiplyMatrices(e,c.matrixWorld),d=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();for(let u of Object.keys(d.attributes))["position","normal","uv"].includes(u)||d.deleteAttribute(u);if(d.attributes.normal||d.computeVertexNormals(),d.attributes.uv||d.setAttribute("uv",new re(new Float32Array(d.attributes.position.count*2),2)),d.morphAttributes={},d.clearGroups(),d.applyMatrix4(h),h.determinant()<0)for(let u of Object.values(d.attributes))for(let f=0;f<u.count;f+=3)for(let g=0;g<u.itemSize;g++){let v=u.getComponent(f+1,g);u.setComponent(f+1,g,u.getComponent(f+2,g)),u.setComponent(f+2,g,v)}return d}),a=r[0],l=new Zt(m0(o),a.material);l.castShadow=a.castShadow,l.receiveShadow=a.receiveShadow,l.renderOrder=a.renderOrder,l.name=a.name;for(let c of r)c.removeFromParent();i.add(l)}}var ei=Cn.radius,en=Cn.rimRadius,po=Cn.flangeRadius,Wa=Cn.width/2,Dh=.012,jd=34,Qd={mode:"chase",yaw:0,pitch:.23,dist:10.7},vS=5,Lh=window.matchMedia("(pointer: coarse)").matches,y0=()=>Math.min(window.devicePixelRatio||1,Lh?1.5:2),_S={asphalt:{base:"#3e4045",specks:["#5b5e64","#2b2c30","#73767c"],rough:.92,bump:0,mark:[.08,.08,.09],chip:"#45474c",throws:"smoke"},concrete:{base:"#bcb9b1",specks:["#a8a59d","#d3d0c8","#928f88"],rough:.88,bump:0,mark:[.16,.16,.17],chip:"#c4c1b9",throws:"smoke"},wet:{base:"#24272c",specks:["#383c43","#1b1d21","#4b5866"],rough:.18,bump:0,mark:[.05,.055,.06],chip:"#2f3b4a",throws:"spray"},gravel:{base:"#857d71",specks:["#a69e91","#6c655b","#c4bdaf","#5a544b"],rough:.95,bump:3,mark:[.27,.25,.22],chip:"#9a9285",throws:"stones"},grass:{base:"#4f8a30",specks:["#4b872c","#78b54b","#3d7225","#8ec65c"],rough:.95,bump:2,mark:[.45,.62,.3],chip:"#5c9739",throws:"grass"},sand:{base:"#dcbd87",specks:["#cfaf78","#efd7a8","#c4a26a"],rough:.95,bump:1.2,mark:[.62,.5,.32],chip:"#e0c38e",throws:"sand"},mud:{base:"#553e2c",specks:["#473225","#6e523d","#3b2a1e"],rough:.45,bump:1.5,mark:[.16,.11,.07],chip:"#6b4c36",throws:"mud"},snow:{base:"#eef3f8",specks:["#d9e3ee","#ffffff","#c9d7e6"],rough:.75,bump:1,mark:[.62,.68,.78],chip:"#e6eef6",throws:"snow"},ice:{base:"#b8dcee",specks:["#d8f0fa","#a6d2e6","#ffffff"],rough:.06,bump:0,mark:[.95,.97,1],chip:"#bfe2f1",throws:"frost"},dirt:{base:"#8a6f52",specks:["#7a6147","#9c8163","#6b5440","#a88d6c"],rough:.95,bump:1.6,mark:[.34,.25,.17],chip:"#8a6f52",throws:"dirt"},rock:{base:"#8d8a84",specks:["#7a7771","#a3a09a","#68655f","#b5b2ab"],rough:.85,bump:2,mark:[.2,.2,.2],chip:"#8d8a84",throws:"dust"},wood:{base:"#6b4a2e",specks:["#5a3d25","#7d5838","#4a311d"],rough:.9,bump:2,mark:[.25,.18,.12],chip:"#6b4a2e",throws:"dirt"},loose:{base:"#7d6a55",specks:["#6c5a47","#8f7c66","#5b4a3a","#a3917b"],rough:.95,bump:2,mark:[.3,.23,.16],chip:"#7d6a55",throws:"stones"},forest:{base:"#3d4a26",specks:["#4a3a22","#56632f","#33401f","#6b5534","#2c361a"],rough:1,bump:1.5,mark:[.3,.3,.2],chip:"#3d4a26",throws:"grass"}};function yS(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function MS(i,t){let e=document.createElement("canvas");return e.width=i,e.height=t,e}var mo=ei-en;function SS(){let t=MS(1024,1024),e=t.getContext("2d"),n=1024/2/ei;e.translate(1024/2,1024/2),e.fillStyle="#1c1c20",e.fillRect(-1024,-1024,2*1024,2*1024);let s=e.createRadialGradient(0,0,po*n,0,0,(ei-.025)*n);s.addColorStop(0,"#2d2d32"),s.addColorStop(.55,"#26262a"),s.addColorStop(1,"#1e1e22"),e.fillStyle=s,e.beginPath(),e.arc(0,0,(ei-.025)*n,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=.002*n;for(let a of[.25,.86])e.beginPath(),e.arc(0,0,(en+a*mo)*n,0,Math.PI*2),e.stroke();let r=(a,l,c,h,d,u)=>{e.font=`800 ${h*n}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;let f=[...a],g=f.map(m=>e.measureText(m).width+u*n),v=g.reduce((m,b)=>m+b,0),p=l-v/(c*n)/2;e.fillStyle=d,e.textAlign="center",e.textBaseline="middle",f.forEach((m,b)=>{let M=g[b]/(c*n);e.save(),e.rotate(p+M/2),e.translate(0,-c*n),e.fillText(m,0,0),e.restore(),p+=M})},o=en+.55*mo;return r("NASEEB",0,o,.034,"#e9dfcc",.006),r("NASEEB",Math.PI,o,.034,"#e9dfcc",.006),r("H78-15  LOAD RANGE C",Math.PI/2,o,.016,"#48484f",.002),r("BIAS PLY  TUBE TYPE",-Math.PI/2,o,.014,"#43434a",.002),t}function bS(){let i=ei-Dh,t=Wa,e=[[en,.066],[en+.008,.074],[en+.2*mo,.086],[en+.4*mo,.097],[en+.6*mo,t],[en+.78*mo,t-.002],[i-.02,t-.008],[i-.008,t-.016],[i-.002,t-.026],[i,t-.034]],n=[];for(let[s,r]of e)n.push(new it(s,-r));for(let[s,r]of e.slice().reverse())n.push(new it(s,r));return n}function tf(i,t){let e=new Qo(i,t);return e.rotateZ(-Math.PI/2),e}function wS(i){let t=new Ge,e=new Ge;t.add(e);let n=tf(bS(),128),s=n.attributes.position,r=n.attributes.uv;for(let z=0;z<s.count;z++){let V=s.getX(z),I=s.getY(z),ot=s.getZ(z),ct=.5+(V>=0?-ot:ot)/(2*ei);r.setXY(z,ct,.5+I/(2*ei))}let o=new Hi(SS());o.colorSpace=Ke,o.anisotropy=i;let a=new De({map:o,bumpMap:o,bumpScale:1.5,roughness:.82,metalness:0,shadowSide:$e}),l=new Zt(n,a);l.name="tire",l.castShadow=!0,l.receiveShadow=!0,e.add(l);let c=Math.PI*2/jd,h=ei-Dh,d=new De({color:2039587,roughness:.9}),u=new se,f=new cn,g=new kn,v=[{lat:-.03,width:.05,offset:0,yaw:-.15},{lat:.03,width:.05,offset:.5,yaw:.15},{lat:-(Wa-.026),width:.034,offset:.25,yaw:0},{lat:Wa-.026,width:.034,offset:.75,yaw:0}],p=new wi(1,Dh+.002,h*c*.62),m=new ri(p,d,jd*v.length),b=h+Dh/2-.001,M=0;for(let z of v)for(let V=0;V<jd;V++){let I=(V+z.offset)*c;g.set(I,z.yaw,0),f.setFromEuler(g),u.compose(new P(z.lat,b*Math.cos(I),b*Math.sin(I)),f,new P(z.width,1,1)),m.setMatrixAt(M++,u)}m.castShadow=!0,e.add(m);let x=new De({color:15130832,metalness:.25,roughness:.45,side:$e}),y=new De({color:9210500,metalness:.4,roughness:.6,side:$e}),_=new De({color:15922422,metalness:1,roughness:.15}),E=.07,S=[[po,-E-.006],[po+.002,-E-.002],[en+.002,-E+.002],[en-.006,-E+.016],[en-.018,-.025],[en-.018,.025],[en-.006,E-.016],[en+.002,E-.002],[po+.002,E+.002],[po,E+.006]].map(([z,V])=>new it(z,V)),T=new Zt(tf(S,96),y);T.castShadow=!0,e.add(T);for(let z of[-1,1]){let V=new Zt(new ai(po-.001,.004,10,96),x);V.rotation.y=Math.PI/2,V.position.x=z*(E+.004),e.add(V)}let A=[[en-.018,.012],[en-.04,.016],[.125,.03],[.105,.045],[.085,.048],[.062,.048],[.055,.04]].map(([z,V])=>new it(z,V)),C=new Zt(tf(A,96),x);C.castShadow=!0,e.add(C);let L=new Kn({color:1381914});for(let z=0;z<6;z++){let V=z*Math.PI*2/6+Math.PI/6,I=new Zt(new kr(.018,20),L);I.scale.set(1,1.4,1),I.rotation.order="YXZ",I.rotation.set(-V,Math.PI/2,0);let ot=en-.05;I.position.set(.026,Math.cos(V)*ot,Math.sin(V)*ot),e.add(I)}let U=new _e(.011,.011,.016,6).rotateZ(Math.PI/2);for(let z=0;z<6;z++){let V=z*Math.PI*2/6,I=new Zt(U,_);I.position.set(.052,Math.cos(V)*.0699,Math.sin(V)*.0699),e.add(I)}let N=new Zt(new Hn(.055,32,12,0,Math.PI*2,0,Math.PI/2.6),_);N.rotation.z=-Math.PI/2,N.position.x=.03,e.add(N);let F=new Zt(new _e(.15,.15,.07,40).rotateZ(Math.PI/2),y);F.position.x=-.03,F.castShadow=!0,e.add(F);let H=new Zt(new _e(.004,.005,.034,10),new De({color:1118483,roughness:.7})),G=Math.PI/6;H.position.set(.02,Math.cos(G)*(en-.02),Math.sin(G)*(en-.02)),H.rotation.x=G,H.rotation.z=-.5,e.add(H);let K=new Zt(new kr(en-.02,64),new De({color:14209730,metalness:.3,roughness:.5,transparent:!0,opacity:0,depthWrite:!1}));return K.name="blur",K.rotation.y=Math.PI/2,K.position.x=.05,t.add(K),Va(e,new Set([l])),{wheel:t,spinner:e,tire:l,blur:K}}var ef={smoke:{colour:[.85,.85,.87],size:[.07,.12],grow:.28,life:[1,1.6],drag:3,lift:.5,alpha:.45,soft:1,max:70},spray:{colour:[.78,.86,.95],size:[.006,.012],grow:0,life:[.5,.9],drag:.6,lift:0,alpha:.85,soft:0},stones:{colour:[.5,.47,.42],size:[.008,.02],grow:0,life:[1,1.6],drag:.05,lift:0,alpha:1,soft:0},grass:{colour:[.33,.58,.22],size:[.006,.014],grow:0,life:[.8,1.4],drag:2,lift:0,alpha:1,soft:0},sand:{colour:[.84,.72,.5],size:[.004,.009],grow:0,life:[.6,1.1],drag:.8,lift:0,alpha:1,soft:0},mud:{colour:[.27,.19,.13],size:[.01,.022],grow:0,life:[.8,1.4],drag:.2,lift:0,alpha:1,soft:0},snow:{colour:[.96,.97,.99],size:[.006,.015],grow:0,life:[.6,1.2],drag:1.2,lift:0,alpha:1,soft:0},frost:{colour:[1,1,1],size:[.004,.008],grow:0,life:[.3,.6],drag:1.5,lift:0,alpha:.9,soft:0},dust:{colour:[.78,.7,.58],size:[.06,.1],grow:.2,life:[.8,1.2],drag:3,lift:.15,alpha:.3,soft:1,max:40},trail:{colour:[.68,.62,.54],size:[.45,.75],grow:.85,life:[2.4,4],drag:1.6,lift:.22,alpha:.16,soft:1,max:140},dirt:{colour:[.42,.32,.22],size:[.006,.016],grow:0,life:[.8,1.4],drag:.6,lift:0,alpha:1,soft:0}},Ih=900,fr=700,sf=class{constructor(t){let e=new he;this.positions=new Float32Array(fr*4*3),this.colours=new Float32Array(fr*4*4);let n=new Uint32Array(fr*6);for(let r=0;r<fr;r++)n.set([r*4,r*4+2,r*4+1,r*4+1,r*4+2,r*4+3],r*6);e.setAttribute("position",new re(this.positions,3).setUsage(cr)),e.setAttribute("color",new re(this.colours,4).setUsage(cr));let s=new Float32Array(fr*4*3);for(let r=0;r<fr*4;r++)s[r*3+1]=1;e.setAttribute("normal",new re(s,3)),e.setIndex(new re(n,1)),e.setDrawRange(0,0),this.geo=e,this.mesh=new Zt(e,new na({vertexColors:!0,transparent:!0,depthWrite:!1,side:$e,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,t.add(this.mesh),this.list=[],this.lastOf=[]}clear(){this.list.length=0,this.lastOf=[],this.write()}add(t,e,n,s,r,o,a,l,c){let h=this.lastOf[t];if(h&&h.rgb===o&&!h.fade==!l&&Math.abs(h.alpha-a)<.05&&Math.hypot(h.x1-e,h.z1-n)<.02&&Math.hypot(h.x1-h.x0,h.z1-h.z0)<.5){h.x1=s,h.z1=r,h.born=c,h.ys=null;return}let d={x0:e,z0:n,x1:s,z1:r,rgb:o,alpha:a,fade:l,born:c,ys:null};this.list.push(d),this.lastOf[t]=d,this.list.length>fr&&this.list.shift()}write(t=0,e){let n=this.positions,s=this.colours,r=Wa*.95,o=0;for(let a of this.list){let l=a.fade?a.alpha-(t-a.born)*a.fade:a.alpha,c=a.x1-a.x0,h=a.z1-a.z0,d=Math.hypot(c,h);if(l<=.01||d<1e-6)continue;let u=-h/d*r,f=c/d*r,g=[a.x0-u,a.z0-f,a.x0+u,a.z0+f,a.x1-u,a.z1-f,a.x1+u,a.z1+f];a.ys||(a.ys=[0,1,2,3].map(v=>e.height(g[v*2],g[v*2+1])+.006));for(let v=0;v<4;v++)n.set([g[v*2],a.ys[v],g[v*2+1]],o*12+v*3);for(let v=0;v<4;v++)s.set([a.rgb[0],a.rgb[1],a.rgb[2],l],o*16+v*4);o++}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0,this.geo.setDrawRange(0,o*6)}},rf=class{constructor(t){this.list=[],this.rand=yS(7);let e=new he;this.positions=new Float32Array(Ih*3),this.colours=new Float32Array(Ih*4),this.sizes=new Float32Array(Ih*2),e.setAttribute("position",new re(this.positions,3).setUsage(cr)),e.setAttribute("tint",new re(this.colours,4).setUsage(cr)),e.setAttribute("look",new re(this.sizes,2).setUsage(cr)),e.setDrawRange(0,0),this.geo=e,this.material=new pe({uniforms:{scale:{value:800},biggest:{value:200},light:{value:new Nt(1,1,1)}},vertexShader:`
        attribute vec4 tint;
        attribute vec2 look; // size in metres, softness
        uniform float scale;
        uniform float biggest;
        varying vec4 vTint;
        varying float vSoft;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(look.x * scale / -mv.z, 1.5, biggest);
          vTint = tint;
          vSoft = look.y;
        }`,fragmentShader:`
        uniform vec3 light;
        varying vec4 vTint;
        varying float vSoft;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float edge = mix(1.0 - smoothstep(0.38, 0.5, r), 1.0 - smoothstep(0.0, 0.5, r), vSoft);
          if (edge <= 0.0) discard;
          gl_FragColor = vec4(pow(vTint.rgb, vec3(2.2)) * light, vTint.a * edge);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,transparent:!0,depthWrite:!1}),this.points=new Go(e,this.material),this.points.frustumCulled=!1,this.points.renderOrder=2,t.add(this.points)}spawn(t,e,n,s){let r=e*n,o=ef[t],a=o.max?this.list.reduce((l,c)=>l+(c.kind===t),0):0;for(;r>0&&this.list.length<Ih&&(!o.max||a++<o.max)&&!(r<1&&this.rand()>r);){r--;let l=s(this.rand);l.kind=t,l.age=0,l.life=o.life[0]+this.rand()*(o.life[1]-o.life[0]),l.size=o.size[0]+this.rand()*(o.size[1]-o.size[0]),this.list.push(l)}}update(t,e,n,s){for(let o of this.list){let a=ef[o.kind];o.age+=t;let l=a.drag*n;o.vx-=o.vx*Math.min(1,l*t),o.vy-=o.vy*Math.min(1,l*t),o.vz-=o.vz*Math.min(1,l*t),o.vy+=(a.lift?a.lift*n:-e)*t,o.x+=o.vx*t,o.y+=o.vy*t,o.z+=o.vz*t,o.size+=a.grow*t,!a.lift&&(o.floor===void 0||(o.check=(o.check||0)+1)%6===0)&&(o.floor=s.height(o.x,o.z)+.003);let c=a.lift?-1/0:o.floor;o.y<c&&(o.y=c,o.vx*=.3,o.vz*=.3,o.vy=0)}this.list=this.list.filter(o=>o.age<o.life);let r=0;for(let o of this.list){let a=ef[o.kind],l=o.age/o.life,c=a.soft?a.alpha*(1-l)*Math.min(1,o.age*6):a.alpha*Math.min(1,(1-l)*3);this.positions.set([o.x,o.y,o.z],r*3),this.colours.set([a.colour[0],a.colour[1],a.colour[2],c],r*4),this.sizes.set([o.size,a.soft],r*2),r++}for(let o of["position","tint","look"])this.geo.attributes[o].needsUpdate=!0;this.geo.setDrawRange(0,r)}};function nf(i){let t=new Ge,e=new Kn({color:i,depthTest:!1,transparent:!0,opacity:.95}),n=new Zt(new _e(.0055,.0055,1,10).translate(0,.5,0),e),s=new Zt(new Hr(.016,.04,14).translate(0,-.02,0),e);t.add(n,s),t.renderOrder=10,n.renderOrder=10,s.renderOrder=10;let r=new P(0,1,0),o=new P;return{group:t,set(a,l){let c=l.length();t.visible=c>.004,t.visible&&(o.copy(l).divideScalar(c),t.position.copy(a),t.quaternion.setFromUnitVectors(r,o),n.scale.y=Math.max(.001,c-.035),s.position.y=c)}}}var Nh=class{constructor(t){this.canvas=t;let e=new ph({canvas:t,antialias:!0,powerPreference:"high-performance"});e.outputColorSpace=Ke,e.toneMapping=ar,e.toneMappingExposure=1,e.shadowMap.enabled=!0,e.shadowMap.type=Mc,this.renderer=e,this.maxAniso=Math.min(4,e.capabilities.getMaxAnisotropy());let n=new Ps;this.scene=n,this.camera=new bn(45,1,.05,2200),Se.cloudMap.value=t0(),this.background=new bh(n),this.sunOffset=new P(-30,26,18),this.hemi=new sr(14675967,7245650,.9),n.add(this.hemi);let s=new rr(16773078,2.9);s.castShadow=!0,s.shadow.mapSize.set(Lh?1024:2048,Lh?1024:2048);let r=s.shadow.camera;r.left=-12,r.right=12,r.top=12,r.bottom=-12,r.near=.5,r.far=120,s.shadow.bias=-3e-4,s.shadow.normalBias=.02,s.shadow.radius=3,n.add(s,s.target),this.sun=s,this.landscape=new Sh(n,{maxAniso:this.maxAniso}),this.car=new Ge,this.frame=new Ge,this.car.add(this.frame),n.add(this.car),this.axleGroups=[new Ge,new Ge];for(let c of this.axleGroups)n.add(c);this.buildFrame();let o=wS(this.maxAniso).wheel,a=_0({maxAniso:this.maxAniso,makeWheel:()=>o.clone()});this.frame.add(a.group),this.steeringWheel=a.steeringWheel,this.wheels=Ui.map((c,h)=>{let d=h?o.clone():o,u=d.getObjectByName("blur");return u.material=u.material.clone(),d.rotation.order="YXZ",d.position.set(c.at[0],0,0),this.axleGroups[c.front?0:1].add(d),{wheel:d,tire:d.getObjectByName("tire"),blur:u}}),a.steeringWheel.traverse(c=>{c.isMesh&&c.material.metalness>.5&&(c.material=c.material.clone(),c.material.color.set(3948096),c.material.metalness=.25,c.material.roughness=.55)}),Va(a.group,new Set([a.steeringWheel])),Va(this.frame,new Set([this.fan,a.group])),this.axleGroups.forEach((c,h)=>Va(c,new Set([...h?[]:[...this.knuckles,this.tieRod],...this.wheels.map(d=>d.wheel)]))),this.marks=new sf(n),this.particles=new rf(n),this.lastPoints=Ui.map(()=>null),this.arrows={weight:nf(16743034),normals:Ui.map(()=>nf(6476543)),frictions:Ui.map(()=>nf(16765286))};for(let c of[...this.arrows.normals,...this.arrows.frictions])n.add(c.group);n.add(this.arrows.weight.group);let l=new Kn({color:12950527,depthTest:!1,transparent:!0});this.torqueArc=new Zt(new ai(.11,.0055,8,48,Math.PI*1.2),l),this.torqueHead=new Zt(new Hr(.017,.045,14),l),this.torqueArc.renderOrder=this.torqueHead.renderOrder=10,this.torque=new Ge,this.torque.add(this.torqueArc,this.torqueHead),n.add(this.torque),this.view={...Qd},this.goal={...Qd},this.heading=0,this.lookY=ei,this.fov=52,this.lastOrbit=-1/0,this.chasePosition=null,this.time=null,this.high=!1,this.labelPoints={},this.pixelRatio=y0(),Km(n),this.resize()}setPixelRatio(t){this.pixelRatio=t,this.resize()}setTime(t){let e=xh[t]||xh.afternoon;if(this.time===e)return;this.time=e,Qm(e),this.sunOffset.copy(Se.sunTo.value).multiplyScalar(45),this.sun.color.set(e.sun),this.sun.intensity=e.intensity,this.hemi.color.set(e.hemiSky),this.hemi.groundColor.set(e.hemiGround),this.hemi.intensity=e.hemi,this.scene.fog=new Bo(e.haze,e.density,e.thin),this.background.setTime(e,this.hemi),this.landscape.lightUp();let n=new Qr(this.renderer),s=new Ps;s.add(this.background.sky.clone());let r=new Zt(new Dn(6e4,6e4).rotateX(-Math.PI/2),new Kn({color:5196864}));r.position.y=-2,s.add(r);let o=new Zt(new Hn(18,16,8),new Kn({color:Se.sunColour.value.clone().multiplyScalar(.4)}));o.position.copy(Se.sunTo.value).multiplyScalar(270),s.add(o),this.scene.environment&&this.scene.environment.dispose(),this.scene.environment=n.fromScene(s,.02,.1,3e4).texture,this.scene.environmentIntensity=.55,n.dispose(),this.landscape.bakeTrees(this.renderer,{hemi:this.hemi,sun:this.sun,environment:this.scene.environment}),this.particles.material.uniforms.light.value.copy(this.hemi.color).multiplyScalar(e.hemi*1.1).add(Se.sunColour.value.clone().multiplyScalar(.2))}setQuality(t){this.auto=t==="auto",this.high=t==="high"||this.auto&&!Lh,this.high&&!this.post&&(this.post=new Ph(this.renderer,this.scene,this.camera,e=>this.drawWorld(e)),this.post.setSize(this.W,this.H,this.renderer.getPixelRatio()))}drawWorld(t){t.render(this.scene,this.camera)}resize(){let t=window.innerWidth,e=window.innerHeight;this.maxPixelRatio=y0(),this.pixelRatio=Math.min(this.pixelRatio,this.maxPixelRatio),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.W=t,this.H=e,this.post&&this.post.setSize(t,e,this.pixelRatio),this.updatePointScale()}updatePointScale(){let t=this.H*this.renderer.getPixelRatio();this.particles.material.uniforms.scale.value=t/(2*Math.tan(this.camera.fov*Math.PI/360)),this.particles.material.uniforms.biggest.value=.2*t}orbit(t,e){this.goal.yaw-=t*.008,this.goal.pitch=Math.min(1.35,Math.max(this.goal.mode==="driver"?-.6:.04,this.goal.pitch+e*.006)),this.lastOrbit=performance.now()}zoom(t){this.goal.dist=Math.min(22,Math.max(2.5,this.goal.dist*t))}setView(t){Object.assign(this.goal,t),this.view.mode=this.goal.mode,this.chasePosition=null}clearEffects(){this.marks.clear(),this.particles.list.length=0,this.lastPoints=Ui.map(()=>null)}buildFrame(){let t=(M,x,y)=>new De({color:M,metalness:x,roughness:y}),e=t(1908771,.5,.5),n=t(6119784,.8,.4),s=t(4869456,.6,.6),r=t(3099502,.35,.5),o=t(15264492,1,.2),a=t(14538698,.3,.45),l=t(1316119,.2,.7),c=t(3422269,.7,.5),h=(M,x,y,_,E,S=this.frame)=>{let T=new Zt(M,x);return T.position.set(y,_,E),T.castShadow=!0,S.add(T),T},d=(M,x,y)=>new wi(M,x,y),u=Ie.wheelbase/2,[f,g]=this.axleGroups,v=Ie.rightHandDrive?1:-1;for(let M of Mo){let[x,y,_]=M.at,[E,S,T]=M.size;if(M.name==="frame rail"){let A=Math.sign(x);h(d(.008,S,T),e,x-A*(E/2-.004),y,_),h(d(E,.008,T),e,x,y+S/2-.004,_),h(d(E,.008,T),e,x,y-S/2+.004,_)}else if(M.name==="cross member"||M.name==="rear cross member")h(d(E,S,T),e,x,y,_);else if(M.name==="front bumper")h(d(E,S,T),l,x,y,_);else if(M.name==="front axle"||M.name==="rear axle"){let A=M.name==="front axle",C=A?f:g;h(new _e(.04,.04,E,20).rotateZ(Math.PI/2),s,0,y,0,C);let L=A?.12:0;if(h(new Hn(.14,24,16),s,L,y,0,C),h(new _e(.055,.07,.18,18).rotateX(Math.PI/2),s,L,y+.01,A?.15:-.15,C),A)for(let U of[-1,1])h(new Hn(.085,20,14),s,U*(E/2+.02),y,0,C)}else M.name==="engine"?(h(d(.36,.38,.86),r,x,y-.06,_),h(d(.3,.12,.84),r,x+.02,y+.19,_),h(d(.2,.07,.8),o,x+.02,y+.28,_),h(d(.3,.14,.7),l,x,y-.31,_+.05),h(new _e(.06,.06,.05,20).rotateX(Math.PI/2),n,x,y-.02,_-.45),this.fan=h(new _e(.2,.2,.01,6).rotateX(Math.PI/2),l,x,y+.05,_-.52),h(new _e(.15,.15,.09,28),l,x-.05,y+.38,_+.05),h(d(.05,.06,.7),s,x-.21,y+.03,_)):M.name==="gearbox and transfer case"?(h(new _e(.15,.2,.2,24).rotateX(Math.PI/2),s,x,y+.05,_-.25),h(d(.22,.24,.32),s,x,y+.02,_+.02),h(d(.34,.26,.18),s,x+.04,y-.04,_+.24),h(new _e(.008,.01,.62,8),o,x,y+.42,_-.02),h(new Hn(.025,12,8),l,x,y+.73,_-.02),h(new _e(.007,.008,.5,8),o,x+.08,y+.33,_+.22),h(new Hn(.02,12,8),l,x+.08,y+.58,_+.22)):M.name==="radiator"?(h(d(E,S,T),l,x,y,_),h(d(E+.04,.03,T+.02),n,x,y+S/2,_),h(d(E+.04,.03,T+.02),n,x,y-S/2,_)):M.name==="fuel tank"?h(d(E,S,T),l,x,y,_):M.name==="battery"&&(h(d(E,S,T),l,x,y,_),h(new _e(.012,.012,.025,10),t(12597547,.3,.5),x-.07,y+S/2+.01,_),h(new _e(.012,.012,.025,10),l,x+.07,y+S/2+.01,_))}let p=new Ge;for(let M=0;M<4;M++){let x=1.15-M*.2,y=new er(new P(0,.05,-x/2),new P(0,-.035,0),new P(0,.05,x/2)),_=new Zt(new Ds(y,16,.006,4,!1),c);_.scale.set(8,1,1),_.position.y=-M*.011,_.castShadow=!0,p.add(_)}for(let[M,x]of[[0,-u],[1,u]])for(let y of[-1,1]){let _=p.clone();_.position.set(y*.42,.06,0),this.axleGroups[M].add(_),h(d(.06,.05,.1),n,y*.42,.045,0,this.axleGroups[M]);for(let E of[-.56,.56])h(d(.03,.08,.03),e,y*.42,.09,x+E);h(new _e(.025,.025,.3,10),l,y*.5,.15,.12*(M?-1:1),this.axleGroups[M])}let m=Ie.frontTrack/2-.13;this.knuckles=[-1,1].map(M=>{let x=new Ge;x.position.set(M*m,0,0);let y=new Zt(d(.03,.03,.2),n);return y.position.set(-M*.03,-.05,.1),y.castShadow=!0,x.add(y),f.add(x),x}),this.tieRod=h(new _e(.014,.014,1,10).rotateZ(Math.PI/2),n,0,-.05,.2,f),h(d(.12,.12,.15),s,v*.5,.12,-u-.1);let b=(M,x)=>{let y=new Ge,_=new Ge;y.add(_);let E=new Zt(new _e(.032,.032,1,14).rotateX(Math.PI/2).translate(0,0,.5),n);E.castShadow=!0,_.add(E);let S=[0,1].map(()=>{let T=new Zt(d(.09,.025,.05),s);return _.add(T),T});return this.scene.add(y),{group:y,spinner:_,tube:E,yokes:S,from:M,to:x}};this.shafts=[b(new P(.12,-.02,.18),[0,new P(.12,.01,.24)]),b(new P(.04,-.02,.34),[1,new P(0,.01,-.24)])]}draw(t,e,n){this.time||this.setTime("afternoon");let[s,r,o]=t.p,a=n.realDt||e;this.car.position.set(s,r,o),this.car.quaternion.set(t.q[1],t.q[2],t.q[3],t.q[0]),this.frame.position.set(-t.centre[0],-t.centre[1],-t.centre[2]),this.car.updateMatrixWorld();let l=new se;t.axles.forEach((g,v)=>{let p=t.axleFrame(g),m=new P(...p.beam),b=new P(...p.up);l.makeBasis(m,b,m.clone().cross(b));let M=this.axleGroups[v];M.position.set(...p.middle),M.quaternion.setFromRotationMatrix(l),M.updateMatrixWorld()}),t.wheels.forEach((g,v)=>{let p=this.wheels[v];p.wheel.rotation.set(g.side>0?-g.angle:g.angle,g.steer+(g.side>0?0:Math.PI),0),p.tire.scale.x=1+Math.min(.15,g.contact.squash/ei*1.2),p.blur.material.opacity=Math.min(.85,Math.max(0,(Math.abs(g.spin)-18)/40))});let[c,h]=t.wheels;this.knuckles[0].rotation.y=c.steer,this.knuckles[1].rotation.y=h.steer;let d=(g,v)=>new P(-v*.03,-.05,.2).applyEuler(g.rotation).add(g.position),u=d(this.knuckles[0],-1),f=d(this.knuckles[1],1);this.tieRod.position.copy(u).add(f).multiplyScalar(.5),this.tieRod.scale.x=u.distanceTo(f),this.tieRod.rotation.y=-Math.atan2(f.z-u.z,f.x-u.x),this.steeringWheel.rotation.y=t.steeringWheel,this.fan.rotation.z=t.engineAngle;for(let g of this.shafts){let v=this.frame.localToWorld(g.from.clone()),p=this.axleGroups[g.to[0]].localToWorld(g.to[1].clone()),m=v.distanceTo(p);g.group.position.copy(v),g.group.lookAt(p),g.tube.scale.z=m,g.yokes[0].position.z=.04,g.yokes[1].position.z=m-.04,g.spinner.rotation.z=t.shaftAngle}this.updateEffects(t,e),this.updateForces(t,n.forces),this.updateCamera(t,a),this.landscape.update(this.camera.position,a),jm(a),this.sun.position.set(s+this.sunOffset.x,r+this.sunOffset.y,o+this.sunOffset.z),this.sun.target.position.set(s,r-.7,o),this.background.update(this.camera),this.high?this.post.render():(this.renderer.setRenderTarget(null),this.drawWorld(this.renderer))}updateCamera(t,e){let n=1-Math.exp(-e*6),s=this.goal.mode;s==="chase"&&performance.now()-this.lastOrbit>1500&&(this.goal.yaw+=(0-this.goal.yaw)*(1-Math.exp(-e*2)),this.goal.pitch+=(Qd.pitch-this.goal.pitch)*(1-Math.exp(-e*2)));for(let u of["yaw","pitch","dist"])this.view[u]+=(this.goal[u]-this.view[u])*n;let r=t.heading-this.heading;r=Math.atan2(Math.sin(r),Math.cos(r)),this.heading+=r*(1-Math.exp(-e*(s==="chase"?2.2:3)));let o=Math.abs(t.forwardSpeed),a=t.forward,[l,c,h]=t.p,d=45;if(s==="driver"){let u=this.frame.localToWorld(new P(Ie.rightHandDrive?.4:-.4,1.34,.28)),f=this.frame.localToWorld(new P(0,.9,-12)).sub(u);f.applyAxisAngle(new P(0,1,0),this.view.yaw).normalize(),f.y+=-this.view.pitch*.5,this.camera.position.copy(u),this.camera.lookAt(u.clone().add(f)),d=68,this.chasePosition=null}else{let u=s==="chase",f=this.H>this.W?Math.min(1.9,(this.H/this.W)**.7):1,g=this.view.dist*f*(u?1+Math.min(.35,o*.01):1),v=this.heading+this.view.yaw,p=this.view.pitch;this.lookY+=(Math.max(ei+.3,c)-this.lookY)*n;let m=u?vS:.6,b=new P(l+a[0]*m,this.lookY+(u?.1:0),h+a[2]*m),M=new P(b.x+Math.sin(v)*Math.cos(p)*g,b.y+Math.sin(p)*g,b.z+Math.cos(v)*Math.cos(p)*g);u&&this.chasePosition&&this.chasePosition.distanceTo(M)<20?this.chasePosition.lerp(M,1-Math.exp(-e*9)):this.chasePosition=M.clone();let x=u?this.chasePosition:M;x.y=Math.max(x.y,ve.height(x.x,x.z)+.6),this.camera.position.copy(x),this.camera.lookAt(b),d=u?52+Math.min(16,o*.6):45}this.fov+=(d-this.fov)*(1-Math.exp(-e*3)),Math.abs(this.camera.fov-this.fov)>.01&&(this.camera.fov=this.fov,this.camera.updateProjectionMatrix(),this.updatePointScale())}updateEffects(t,e){let n=Math.min(1,t.air/1.225),s=this.particles,r=t.ax,o=Math.hypot(t.v[0],t.v[2]);t.wheels.forEach((a,l)=>{let c=a.contact,h=c.surface.id,d=_S[h],u=c.normal>0,f=u?Math.hypot(c.tread[0],c.tread[2]):0,g=c.normal/(t.mass*t.g/2||1),[v,,p]=c.point,m=c.ground[1],b=this.lastPoints[l];if(u&&b&&Math.hypot(v-b[0],p-b[1])<.5&&(v!==b[0]||p!==b[1])){let _=0,E=0;h==="asphalt"||h==="concrete"?_=Math.min(.6,Math.max(0,f-1.2)*.15):h==="ice"?_=Math.min(.55,Math.max(0,f-.8)*.22):h==="wet"?(_=.45,E=.15):_=Math.min(.7,c.sink/.012*.35+Math.min(1,Math.hypot(c.slip,c.sideSlip))*.25),_>.02&&this.marks.add(l,b[0],b[1],v,p,d.mark,_,E,t.time)}if(this.lastPoints[l]=[v,p],!u||e<=0)return;l>=2&&(h==="dirt"||h==="loose")&&n>0&&o>1.2&&s.spawn("trail",(o-1.2)*4.5,e,_=>({x:v-t.v[0]*.04+(_()-.5)*.3,y:m+.2+_()*.15,z:p-t.v[2]*.04+(_()-.5)*.3,vx:t.v[0]*.3+(_()-.5)*.9,vy:.15+_()*.35,vz:t.v[2]*.3+(_()-.5)*.9}));let M=c.tread,x=(_,E)=>{let S=(_()-.5)*Cn.width;return{x:v+r[0]*S+(_()-.5)*.04,y:m+.01,z:p+r[2]*S+(_()-.5)*.04,vx:t.v[0]*.3+M[0]*(.3+_()*.6)+(_()-.5)*.4,vy:E*(.3+_()*.9)+.2,vz:t.v[2]*.3+M[2]*(.3+_()*.6)+(_()-.5)*.4}},y=d.throws;if(y==="smoke")f>2.5&&n>0&&s.spawn("smoke",(f-2.5)*16*Math.min(2,g),e,_=>({x:v+(_()-.5)*.12,y:m+.03,z:p+(_()-.5)*.12,vx:M[0]*.15,vy:.1+_()*.2,vz:M[2]*.15}));else if(y==="spray"){let _=f*140+Math.max(0,o-.4)*70;_>1&&s.spawn("spray",_,e,E=>x(E,.4+f*.3+o*.25))}else y==="frost"?f>.5&&s.spawn("frost",f*70,e,_=>x(_,.3)):f>.25&&(s.spawn(y,f*110*Math.min(2,g),e,_=>x(_,.3+f*.35)),(y==="sand"||y==="stones"||y==="dirt")&&n>0&&s.spawn("dust",f*8,e,_=>({...x(_,.2),vx:M[0]*.2,vz:M[2]*.2})))}),this.marks.write(t.time,ve),s.update(e,t.g,n,ve)}updateForces(t,e){let n=this.arrows;for(let u of[n.weight,...n.normals,...n.frictions])u.group.visible=e;if(this.torque.visible=e&&!!t.wheelTorque,this.labelPoints={},!e)return;let s=t.mass*t.g,r=.8*ei/(s/4||1),o=2.6*ei,a=u=>Math.sign(u)*Math.min(o,Math.abs(u)*r),[l,c,h]=t.p,d=-Math.min(s*r,4*o);if(n.weight.set(new P(l,c,h),new P(0,d,0)),this.labelPoints.weight=new P(l,c+d*.5,h),t.wheels.forEach((u,f)=>{let g=u.contact,v=u.side*(Wa+.03),p=new P(g.ground[0]+g.axle[0]*v,g.ground[1]+g.axle[1]*v,g.ground[2]+g.axle[2]*v);if(g.normal>0){let m=a(g.normal),b=new P(...g.n).multiplyScalar(m);n.normals[f].set(p.clone().sub(b),b);let M=new P(...g.friction),x=M.length();n.frictions[f].set(p,x>0?M.multiplyScalar(Math.abs(a(x))/x):new P),this.labelPoints["tire"+f]=p.clone().addScaledVector(b,-.5)}else n.normals[f].group.visible=!1,n.frictions[f].group.visible=!1}),t.wheelTorque){let u=t.wheelTorque,f=Math.sign(u),g=Math.min(1,Math.abs(u)/6e3)*Math.PI*1.2+.4;this.torqueArc.geometry.dispose(),this.torqueArc.geometry=new ai(.24,.008,8,48,g);let v=new P(...t.axleFrame(t.axles[1]).middle);this.torque.position.copy(v),this.torque.rotation.set(0,t.heading+Math.PI/2,0);let p=Math.PI/2-g/2;this.torqueArc.rotation.set(0,0,p);let m=f>0?p:p+g;this.torqueHead.position.set(Math.cos(m)*.24,Math.sin(m)*.24,0),this.torqueHead.rotation.set(0,0,m+(f>0?Math.PI:0)),this.labelPoints.torque=v.clone().add(new P(0,.25,0))}}project(t){let e=t.clone().project(this.camera);return e.z>1?null:{x:(e.x*.5+.5)*this.W,y:(-e.y*.5+.5)*this.H}}};var ES=`
const TAU = Math.PI * 2;
// Rings at f, its bandwidth set by q, like a pipe or a panel struck; at f it passes its input
// through at about the same strength, whatever f is.
class Ring {
  constructor(f, q) {
    const w = (TAU * f) / sampleRate;
    const r = Math.exp(-w / (2 * q));
    this.a1 = 2 * r * Math.cos(w);
    this.a2 = -r * r;
    this.g = (1 - r) * 2 * Math.sin(w);
    this.y1 = this.y2 = 0;
  }
  run(x) {
    const y = this.a1 * this.y1 + this.a2 * this.y2 + this.g * x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}
// Smooths: follows its input at a rate set by k (0 to 1 a sample).
class Smooth {
  constructor() {
    this.y = 0;
  }
  run(x, k) {
    this.y += (x - this.y) * k;
    return this.y;
  }
}
const toward = (hz) => 1 - Math.exp((-TAU * hz) / sampleRate);

class NaseebSound extends AudioWorkletProcessor {
  constructor() {
    super();
    this.want = { rpm: 800, load: 0, roll: 0, hard: 0, dirt: 0, lug: 0, squeal: 0, scrub: 0, crunch: 0, soft: 0, inside: 0 };
    this.is = { ...this.want };
    this.thump = 0;
    this.port.onmessage = (e) => {
      const { thump, ...rest } = e.data;
      Object.assign(this.want, rest);
      if (thump) this.thump = Math.max(this.thump, thump);
    };
    this.seed = 12345;
    // The engine: where it is in its four strokes (0 to 1), which cylinder fires next, and how
    // each one differs.
    this.cycle = 0;
    this.next = 0;
    this.early = [0, 0.012, -0.008, 0.01, -0.014, 0.006];
    this.strength = [1, 0.92, 1.05, 0.96, 1.03, 0.9];
    this.kick = 0;
    this.puff = [new Smooth(), new Smooth()];
    this.pipes = [new Ring(82, 3), new Ring(165, 4), new Ring(420, 2.5), new Ring(1150, 2)];
    this.bright = [new Smooth(), new Smooth()];
    this.dc = new Smooth();
    this.intake = new Smooth();
    // The tires.
    this.hissLow = new Smooth();
    this.hissHigh = new Smooth();
    this.swish = new Smooth();
    this.rumble = [new Smooth(), new Smooth()];
    this.stones = [new Ring(2300, 1.6), new Ring(3600, 2.2)];
    this.squealAt = 0;
    this.wobble = 0;
    this.squealGrain = new Smooth();
    this.scrabble = new Ring(1300, 1.2);
    this.lugAt = 0;
    this.thudAt = 0;
    this.thudTone = 0;
    this.thudGrit = 0;
  }
  noise() {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 2147483648 - 1;
  }
  process(inputs, outputs) {
    const left = outputs[0][0];
    const right = outputs[0][1] || left;
    const n = left.length;
    // Follow what the game says over about 40 ms, a block at a time.
    const ease = 1 - Math.exp(-n / (sampleRate * 0.04));
    for (const k in this.want) this.is[k] += (this.want[k] - this.is[k]) * ease;
    const s = this.is;
    const rpm = Math.max(250, s.rpm);
    const load = Math.max(0, Math.min(1, s.load));
    const puffK = 1 / (sampleRate * (0.0016 - 0.0007 * (rpm / 4000))); // a shorter puff when it's revving
    const brightK = toward(260 + rpm * 0.28 + load * 1900 - s.inside * 250);
    const engineLevel = (0.32 + 0.4 * load) * (1 + 0.3 * s.inside);
    if (this.thump) {
      this.thudTone = Math.max(this.thudTone, this.thump);
      this.thudGrit = Math.max(this.thudGrit, this.thump);
      this.thump = 0;
    }
    const toneFade = Math.exp(-1 / (sampleRate * 0.12));
    const gritFade = Math.exp(-1 / (sampleRate * 0.018));
    // Stones: a steady crackle on loose ground, the odd one on a dirt road.
    const stoneRate = (s.crunch * 150 + s.dirt * s.roll * 22) / sampleRate;
    for (let i = 0; i < n; i++) {
      // The engine.
      this.cycle += rpm / 120 / sampleRate;
      if (this.cycle >= (this.next + this.early[this.next]) / 6) {
        this.kick += (0.3 + 0.7 * load) * this.strength[this.next] * (0.93 + 0.14 * (this.noise() * 0.5 + 0.5));
        this.next++;
        if (this.next === 6) {
          this.next = 0;
          this.cycle -= 1;
        }
      }
      const puff = this.puff[1].run(this.puff[0].run(this.kick * 40, puffK), puffK);
      this.kick = 0;
      let engine = puff;
      engine += this.pipes[0].run(puff) * 2.2 + this.pipes[1].run(puff) * 1.4 + this.pipes[2].run(puff) * 0.9 + this.pipes[3].run(puff) * 0.35;
      engine += this.intake.run(this.noise(), 0.3) * (0.03 + 0.12 * load * (rpm / 4000));
      engine = this.bright[1].run(this.bright[0].run(engine, brightK), brightK);
      engine -= this.dc.run(engine, toward(20)); // no steady push on the speaker
      engine = Math.tanh(engine * 7) * engineLevel;

      // The tires: hiss and tread hum with speed.
      const white = this.noise();
      const band = this.hissHigh.run(white, toward(1100)) - this.hissLow.run(white, toward(220));
      let tires = band * s.roll * (0.03 + 0.22 * s.hard);
      // A dirt road: a low rumble through the tires.
      tires += this.rumble[1].run(this.rumble[0].run(white, toward(150)), toward(150)) * s.roll * s.dirt * 1.4;
      this.lugAt += s.lug / sampleRate;
      this.lugAt -= Math.floor(this.lugAt);
      tires += (this.lugAt - 0.5) * s.roll * s.hard * 0.06;
      // Stones and grit cracking under the tread.
      const hit = this.noise() * 0.5 + 0.5 < stoneRate ? (0.4 + 0.6 * (this.noise() * 0.5 + 0.5)) * 3 : 0;
      tires += (this.stones[0].run(hit) + this.stones[1].run(hit * 0.6)) * 0.22;
      // Sand, grass and mud.
      tires += this.swish.run(white, toward(300)) * s.soft * s.roll * 0.35;
      // Sliding: a squeal on hard ground, a scrabble on loose.
      if (s.squeal > 0.002) {
        this.wobble += (TAU * 7) / sampleRate;
        this.squealAt += (880 + 45 * Math.sin(this.wobble) + 25 * this.noise()) / sampleRate;
        this.squealAt -= Math.floor(this.squealAt);
        const grain = 0.6 + 0.4 * this.squealGrain.run(white, toward(40)) * 4;
        tires += (Math.sin(TAU * this.squealAt) + 0.35 * Math.sin(2 * TAU * this.squealAt)) * grain * s.squeal * 0.22;
      }
      tires += this.scrabble.run(white) * s.scrub * 0.35;
      // A tire landing hard: a boom from the axle and the body's panels, and a crack of grit.
      this.thudAt += 55 / sampleRate;
      this.thudAt -= Math.floor(this.thudAt);
      const thud = Math.sin(TAU * this.thudAt) * this.thudTone * 0.9 + white * this.thudGrit * 0.3;
      this.thudTone *= toneFade;
      this.thudGrit *= gritFade;

      const out = Math.tanh((engine + tires * 1.6 + thud * 0.8) * 0.9) * 0.8;
      left[i] = out;
      right[i] = out;
    }
    return true;
  }
}
registerProcessor("naseeb-sound", NaseebSound);
`,TS={asphalt:"hard",concrete:"hard",wet:"slick",gravel:"stones",grass:"soft",sand:"soft",mud:"soft",snow:"soft",ice:"slick",dirt:"dirt",loose:"stones",rock:"hard",wood:"hard"},AS=.065,RS=283,pr=i=>Math.max(0,Math.min(1,i)),Uh=class{constructor(){this.on=!0,this.ready=!1,this.lastLoads=[0,0,0,0]}async start(){if(this.context)return;let t=window.AudioContext||window.webkitAudioContext;if(!(!t||!window.AudioWorkletNode)){this.context=new t;try{let e=URL.createObjectURL(new Blob([ES],{type:"application/javascript"}));await this.context.audioWorklet.addModule(e),URL.revokeObjectURL(e),this.node=new AudioWorkletNode(this.context,"naseeb-sound",{numberOfInputs:0,outputChannelCount:[2]}),this.volume=this.context.createGain(),this.volume.gain.value=this.on?1:0,this.node.connect(this.volume).connect(this.context.destination),this.ready=!0}catch{this.context=null}}}wake(){this.context&&this.context.state==="suspended"&&!this.paused&&this.context.resume()}setOn(t){this.on=t,this.volume&&this.volume.gain.setTargetAtTime(t?1:0,this.context.currentTime,.05)}pause(t){this.paused=t,this.context&&(t?this.context.suspend():this.context.resume())}update(t,{inside:e=!1,rate:n=1}={}){if(!this.ready)return;let s=t.mass*t.g/4,r=0,o=0,a=0,l=0,c=0,h=0,d=0;t.wheels.forEach((f,g)=>{let v=f.contact,p=v.normal/s,m=(p-this.lastLoads[g])*s;if(this.lastLoads[g]=p,m>9e3&&(d=Math.max(d,pr(m/45e3))),v.normal<=0)return;let b=TS[v.surface.id]||"hard",M=pr((Math.hypot(...v.tread)-.6)/3)*Math.min(2,p);b==="hard"?(a+=.25,r+=M):b!=="slick"&&(o+=M),b==="stones"&&(l+=.25),b==="dirt"&&(c+=.25),b==="soft"&&(h+=.25)});let u=Math.hypot(t.v[0],t.v[2]);this.node.port.postMessage({rpm:t.rpm*n,load:pr(t.engineTorque/RS),roll:pr(u/22),hard:a,dirt:c,lug:u/AS*n,squeal:pr(r/2),scrub:pr(o/2),crunch:l*pr(u/6),soft:h,inside:e?1:0,thump:d})}};var T0="naseeb-fj40-settings",Ja=6,CS=.1,PS=.15,A0="naseeb-mountain-best",IS=3700,hf=[{name:"Driver",mode:"driver",yaw:0,pitch:0,dist:10.7},{name:"Chase",mode:"chase",yaw:0,pitch:.23,dist:10.7},{name:"Side",mode:"orbit",yaw:Math.PI/2,pitch:.12,dist:7},{name:"High",mode:"orbit",yaw:.6,pitch:1,dist:11}],$t=i=>document.getElementById(i),bt={canvas:$t("game"),speed:$t("r-speed"),gear:$t("r-gear"),rpm:$t("r-rpm"),steer:$t("r-steer"),slip:$t("r-slip"),state:$t("r-state"),heading:$t("r-heading"),moved:$t("r-moved"),surface:$t("r-surface"),weight:$t("r-weight"),normalFront:$t("r-normal-front"),normalRear:$t("r-normal-rear"),frictionFront:$t("r-friction-front"),frictionRear:$t("r-friction-rear"),rolling:$t("r-rolling"),drag:$t("r-drag"),torque:$t("r-torque"),springsFront:$t("r-springs-front"),springsRear:$t("r-springs-rear"),extra:$t("extra"),more:$t("more"),sound:$t("t-sound"),settingsButton:$t("t-settings"),settings:$t("settings"),close:$t("s-close"),defaults:$t("s-defaults"),climb:$t("r-climb"),time:$t("r-time"),lockers:$t("r-lockers"),lockersLabel:$t("r-lockers-label"),banner:$t("banner"),backOnRoad:$t("back-on-road"),finish:$t("finish"),finishTime:$t("f-time"),finishBest:$t("f-best"),down:$t("f-down"),again:$t("f-again"),hint:$t("hint"),labels:$t("labels"),overlay:$t("overlay"),start:$t("start"),go:$t("c-go"),brake:$t("c-brake"),left:$t("c-left"),right:$t("c-right"),gears:$t("gears"),tach:$t("tach-bar")},qa={time:"afternoon",quality:"auto"};function DS(){try{let i=JSON.parse(localStorage.getItem(T0)||"{}"),t={...bs,...qa,drive:i.drive,lockers:i.lockers,time:i.time,quality:i.quality};return["4x4","rear"].includes(t.drive)||(t.drive=bs.drive),["none","rear","both"].includes(t.lockers)||(t.lockers=bs.lockers),Jm.includes(t.time)||(t.time=qa.time),["auto","high","standard"].includes(t.quality)||(t.quality=qa.quality),t}catch{return{...bs,...qa}}}function LS(){try{localStorage.setItem(T0,JSON.stringify(An))}catch{}}var An=DS(),Ct=new ul(An),ze=new Nh(bt.canvas);ze.setTime(An.time);ze.setQuality(An.quality);var Un={forces:!1,started:!1,preset:0};ze.setView(hf[0]);var Pi={throttle:!1,back:!1,brake:!1,left:!1,right:!1},Hs={throttle:!1,back:!1,left:!1,right:!1},pf=0,NS=.3,Xa=null;function US(){let i=Pi.throttle||Hs.throttle||Ct.time<pf,t=Pi.back||Hs.back,e=Pi.left||Hs.left,n=Pi.right||Hs.right,s=e===n?0:e?1:-1,r=i,o=Pi.brake||t,a=Math.abs(Ct.forwardSpeed)<NS;(Ct.auto||Ct.gear!==-1)&&(Xa=null);let l=Ct.gear===-1&&(Ct.auto||Xa!==null);l?(i&&a&&!t&&(Ct.auto?Ct.autoReverse(!1):Ct.shift(Xa),Xa=null),r=t,o=Pi.brake||i):t&&a&&!i&&Ct.gear!==-1&&(Ct.auto?Ct.autoReverse(!0):(Xa=Ct.gear,Ct.shift(-1)));let c=Ct.auto?1:Math.max(0,Math.min(1,(IS-Ct.rpm)/250));return{throttle:o&&!(l&&t)?0:r?c:0,brake:o?1:0,steer:s}}function R0(){pf=Ct.time+PS,bt.hint.classList.add("gone")}for(let[i,t]of[[bt.go,"throttle"],[bt.brake,"back"],[bt.left,"left"],[bt.right,"right"]]){i.addEventListener("pointerdown",n=>{if(n.preventDefault(),!!Un.started){Hs[t]=!0,i.classList.add("held"),t==="throttle"&&R0();try{i.setPointerCapture(n.pointerId)}catch{}}});let e=()=>{Hs[t]=!1,i.classList.remove("held")};for(let n of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(n,e);i.addEventListener("contextmenu",n=>n.preventDefault())}var FS=[["auto","Auto"],[-1,"R"],[0,"N"],...Ys.map((i,t)=>[t+1,i.name])].map(([i,t])=>{let e=document.createElement("button");return e.className="gear",e.textContent=t,e.title=i==="auto"?"Automatic (0)":i===-1?"Reverse (R)":i===0?"Neutral (N)":`${Ys[i-1].label} (${i})`,e.addEventListener("click",()=>Ct.shift(i)),bt.gears.append(e),{gear:i,b:e}}),xs=new Map,Za=null;bt.canvas.addEventListener("pointerdown",i=>{if(xs.set(i.pointerId,{x:i.clientX,y:i.clientY}),xs.size===2){let[t,e]=[...xs.values()];Za=Math.hypot(t.x-e.x,t.y-e.y)}try{bt.canvas.setPointerCapture(i.pointerId)}catch{}});bt.canvas.addEventListener("pointermove",i=>{let t=xs.get(i.pointerId);if(!t)return;let e=i.clientX-t.x,n=i.clientY-t.y;if(t.x=i.clientX,t.y=i.clientY,xs.size===2&&Za){let[s,r]=[...xs.values()],o=Math.hypot(s.x-r.x,s.y-r.y);o>0&&ze.zoom(Za/o),Za=o;return}ze.orbit(e,n)});for(let i of["pointerup","pointercancel"])bt.canvas.addEventListener(i,t=>{xs.delete(t.pointerId),xs.size<2&&(Za=null)});bt.canvas.addEventListener("wheel",i=>{i.preventDefault(),ze.zoom(Math.exp(i.deltaY*.0012))},{passive:!1});bt.canvas.addEventListener("contextmenu",i=>i.preventDefault());var C0={ArrowUp:"throttle",KeyW:"throttle",ArrowDown:"back",KeyS:"back",Space:"brake",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"};window.addEventListener("keydown",i=>{if(i.target instanceof HTMLInputElement||i.target instanceof HTMLSelectElement)return;if(!Un.started){(i.code==="Enter"||i.code==="Space")&&(zh(),i.preventDefault());return}let t=C0[i.code],e=/^(Digit|Numpad)([0-9])$/.exec(i.code);if(t)!Pi[t]&&(t==="throttle"||t==="back")&&R0(),Pi[t]=!0;else if(e){let n=Number(e[2]);n===0?Ct.shift("auto"):n<=Ys.length&&Ct.shift(n)}else if(i.code==="KeyR")Ct.shift(-1);else if(i.code==="KeyN")Ct.shift(0);else if(i.code==="Backspace")mf();else if(i.code==="KeyL")zS();else if(i.code==="KeyF")kS();else if(i.code==="KeyK")N0();else if(i.code==="KeyV")U0();else if(i.code==="Equal"||i.code==="NumpadAdd")ze.zoom(1/1.15);else if(i.code==="Minus"||i.code==="NumpadSubtract")ze.zoom(1.15);else return;i.preventDefault()});window.addEventListener("keyup",i=>{let t=C0[i.code];t&&(Pi[t]=!1)});window.addEventListener("blur",()=>{for(let i of Object.keys(Pi))Pi[i]=Hs[i]=!1;xs.clear()});var $a=ve.road,Le={along:Ja,since:null,time:0,done:!1,off:0,over:0},go=null;try{go=Number(localStorage.getItem(A0))||null}catch{}function Ka(i){pf=0;let t=ve.roadAt(i);Ct.place(t.x,t.z,t.heading,CS)}function mf(){Ka(Math.max(Ja,Le.along-3))}function OS(i){let t=ve.stops[i];t&&(Le.along=t.along,Ka(t.along))}function P0(){Le.along=Ja,Le.since=null,Le.time=0,Le.done=!1,bt.finish.hidden=!0,Ka(Ja)}var Fh=0;function I0(i,t=2.5){bt.banner.textContent=i,bt.banner.hidden=!1,Fh=performance.now()+t*1e3}var uf=i=>`${Math.floor(i/60)}:${String(Math.floor(i%60)).padStart(2,"0")}`,M0=i=>$a.e[Math.min($a.count-1,Math.round(i/.5))]-$a.e[0];function BS(i){if(!Un.started)return;let t=ve.onRoad(Ct.p[0],Ct.p[2]);t&&Math.abs(t.along-Le.along)<30&&(Le.along=t.along),Le.since===null&&Math.abs(Ct.forwardSpeed)>.3&&(Le.since=0),Le.since!==null&&!Le.done&&(Le.time+=i),Le.off=t?0:Le.off+i,Le.over=Ct.overturned?Le.over+i:0;let e=Le.over>1||Le.off>1.2;if(bt.backOnRoad.hidden===e&&(bt.backOnRoad.hidden=!e,bt.backOnRoad.textContent=Le.over>1?"Rolled. Back on the road":"Back on the road"),!Le.done&&t&&t.along>$a.length-14){Le.done=!0;let n=go===null||Le.time<go;if(n){go=Le.time;try{localStorage.setItem(A0,String(go))}catch{}}bt.finishTime.textContent=`You made it up in ${uf(Le.time)}.`,bt.finishBest.textContent=n?"Your best yet.":`Your best: ${uf(go)}.`,bt.finish.hidden=!1}Fh&&performance.now()>Fh&&(bt.banner.hidden=!0,Fh=0)}bt.down.addEventListener("click",()=>bt.finish.hidden=!0);bt.backOnRoad.addEventListener("click",()=>{Le.over=Le.off=0,bt.backOnRoad.hidden=!0,mf()});bt.again.addEventListener("click",P0);function zS(){let i=["none","rear","both"];An.lockers=i[(i.indexOf(An.lockers)+1)%i.length],xf(),I0({none:"Diff locks off",rear:"Rear diff locked",both:"Front and rear diffs locked"}[An.lockers],1.6)}function kS(){Un.forces=!Un.forces,document.body.classList.toggle("engineer-view",Un.forces)}var ts=new Uh,D0="naseeb-sound";try{ts.on=localStorage.getItem(D0)!=="off"}catch{}function L0(){bt.sound.classList.toggle("on",ts.on),bt.sound.setAttribute("aria-pressed",ts.on)}function N0(){ts.setOn(!ts.on),L0();try{localStorage.setItem(D0,ts.on?"on":"off")}catch{}}L0();bt.sound.addEventListener("click",N0);for(let i of["pointerdown","keydown"])window.addEventListener(i,()=>ts.wake(),!0);function U0(){Un.preset=(Un.preset+1)%hf.length;let i=hf[Un.preset];ze.setView(i),I0(`${i.name} view`,1.2)}bt.more.addEventListener("click",()=>{let i=bt.extra.hidden;bt.extra.hidden=!i,bt.more.textContent=i?"Less":"More"});window.innerWidth<640&&(bt.extra.hidden=!0,bt.more.textContent="More");var F0={drive:$t("s-drive"),lockers:$t("s-lockers"),time:$t("s-time"),quality:$t("s-quality")};function gf(){for(let[t,e]of Object.entries(F0))e.value=An[t];let i=An.lockers!=="none";bt.lockers.hidden=bt.lockersLabel.hidden=!i,bt.lockers.textContent=An.lockers==="both"?"Front and rear":"Rear"}function xf(){Ct.configure(An),ze.setTime(An.time),ze.setQuality(An.quality),LS(),gf()}for(let[i,t]of Object.entries(F0))t.addEventListener("change",()=>{An[i]=t.value,xf()});bt.defaults.addEventListener("click",()=>{An={...bs,...qa},xf()});bt.settingsButton.addEventListener("click",()=>{bt.settings.hidden=!bt.settings.hidden,bt.settingsButton.classList.toggle("on",!bt.settings.hidden),bt.settings.hidden||gf()});bt.close.addEventListener("click",()=>{bt.settings.hidden=!0,bt.settingsButton.classList.remove("on")});var S0=(i,t)=>(Math.abs(i)<.5*10**-t?0:i).toFixed(t),Oh=i=>`${Math.abs(i)<10?Math.abs(i).toFixed(1):Math.round(Math.abs(i))} N`,Qi=i=>Math.abs(i)<10?Math.abs(i).toFixed(1):String(Math.round(Math.abs(i))),Ya=i=>Math.hypot(i.friction[0],i.friction[2]),HS=i=>i.rollingMoment/i.rollingRadius+i.soilDrag,b0=(i,t,e)=>{let n=i*180/Math.PI;return Math.abs(n)<.5?"straight":`${Math.abs(n).toFixed(0)}\xB0 ${n>0?t:e}`};function GS(){let t=Ct.wheels.map(n=>n.contact).filter(n=>n.normal>0);return Ct.overturned?"Rolled over":t.length?Math.hypot(Ct.v[0],Ct.v[2])<.003&&Math.abs(Ct.spin)<.02&&Math.abs(Ct.w[1])<.01&&!Ct.wheelTorque?"At rest":t.some(n=>n.slip>n.surface.slipAtPeak)?"Wheelspin":t.some(n=>n.slip<-n.surface.slipAtPeak)?Ct.controls.brake?"Locked":"Skidding":t.some(n=>Math.abs(n.sideSlip)>n.surface.slipAtPeak)?"Sliding":t.length<4?"Tire up":Ct.controls.brake?"Braking":Ct.wheelTorque>0?"Gripping":"Rolling":"In the air"}var w0=null;function VS(){let[i,t,e,n]=Ct.wheels.map(h=>h.contact),s=Ct.forwardSpeed,r=s>.003?" \u2191":s<-.003?" \u2193":"";bt.speed.textContent=`${S0(Math.abs(s)*3.6,0)} km/h${r}`;let o=Ct.gear>=1?`${Ct.auto?"Auto":"Manual"} ${Ct.gearName} \xB7 ${Ys[Ct.gear-1].label}`:Ct.gear===-1?Ct.auto?"Auto R \xB7 Reverse":"Reverse":"Neutral";bt.gear.textContent=o,bt.rpm.textContent=`${Math.round(Ct.rpm/10)*10} rpm${Ct.clutch==="slipping"?" \xB7 clutch slipping":""}`,bt.tach.style.width=`${Math.min(100,Ct.rpm/sn.governor*100)}%`,bt.tach.classList.toggle("red",Ct.rpm>sn.governor*.95),bt.steer.textContent=b0(Ct.steer,"left","right");let a=(h,d)=>{let u=[h,d].filter(g=>g.normal>0);if(!u.length)return"\u2013";let f=u.reduce((g,v)=>Math.abs(v.slip)>Math.abs(g)?v.slip:g,0);return`${S0(f*100,0)}%`};bt.slip.textContent=`${a(i,t)} \xB7 ${a(e,n)}`;let l=GS();if(bt.state.textContent=l,bt.state.dataset.state=l.toLowerCase().replace(/ /g,"-"),bt.heading.textContent=b0(Ct.heading,"left","right"),bt.moved.textContent=`${Ct.moved.toFixed(1)} m`,!bt.extra.hidden){let h=[...new Set([i,t,e,n].map(g=>g.surface.name))];bt.surface.textContent=h.join(" \xB7 "),bt.weight.textContent=Oh(Ct.mass*Ct.g),bt.normalFront.textContent=`${Qi(i.normal)} \xB7 ${Qi(t.normal)} N`,bt.normalRear.textContent=`${Qi(e.normal)} \xB7 ${Qi(n.normal)} N`,bt.frictionFront.textContent=`${Qi(Ya(i))} \xB7 ${Qi(Ya(t))} N`,bt.frictionRear.textContent=`${Qi(Ya(e))} \xB7 ${Qi(Ya(n))} N`,bt.rolling.textContent=Oh([i,t,e,n].reduce((g,v)=>g+HS(v),0)),bt.drag.textContent=Oh(Ct.drag),bt.torque.textContent=`${Math.round(Ct.wheelTorque)} N\xB7m`;let d=g=>`${g>=0?"+":""}${Math.round(g*1e3)}`,[u,f]=Ct.axles;bt.springsFront.textContent=`${d(u.travel[0])} \xB7 ${d(u.travel[1])} mm`,bt.springsRear.textContent=`${d(f.travel[0])} \xB7 ${d(f.travel[1])} mm`}bt.climb.textContent=`${Math.max(0,Math.round(M0(Le.along)))} of ${Math.round(M0($a.length))} m`,bt.time.textContent=uf(Le.time);let c=`${Ct.auto}${Ct.gear}`;if(c!==w0){w0=c;for(let{gear:h,b:d}of FS){let u=h==="auto"?Ct.auto:!Ct.auto&&h===Ct.gear;d.classList.toggle("on",u),d.classList.toggle("engaged",h===Ct.gear)}}}var Bh={};for(let i of["weight","torque","tire0","tire1","tire2","tire3"]){let t=document.createElement("span");t.className="force-label",bt.labels.append(t),Bh[i]=t}Bh.weight.style.color="#ff9a9a";Bh.torque.style.color="#d8bcff";function WS(){for(let[i,t]of Object.entries(Bh)){let e=Un.forces&&ze.labelPoints[i],n=e&&ze.project(e);if(!n){t.hidden=!0;continue}if(t.hidden=!1,i==="weight")t.textContent=`weight ${Oh(Ct.mass*Ct.g)}`;else if(i==="torque")t.textContent=`${Math.abs(Math.round(Ct.wheelTorque))} N\xB7m at the wheels`;else{let s=Ct.wheels[Number(i.slice(4))].contact;t.innerHTML=`<b style="color:#8fe0ff">${Qi(s.normal)}</b> \xB7 <b style="color:#ffd98a">${Qi(Ya(s))}</b> N`}t.style.transform=`translate(${Math.round(n.x+10)}px, ${Math.round(n.y-9)}px)`}}function O0(i){Ct.advance(i,Un.started?US():{throttle:0,brake:0,steer:0}),BS(i),ze.draw(Ct,i,{forces:Un.forces,world:"earth",realDt:i}),ts.update(Ct,{inside:ze.goal.mode==="driver"}),VS(),WS()}var of=$t("fps"),gs={frames:0,since:performance.now(),worst:0};function XS(i,t){gs.frames++,gs.worst=Math.max(gs.worst,t);let e=i-gs.since;if(e<500)return;let n=gs.frames*1e3/e,s=ze.pixelRatio/ze.maxPixelRatio;of.textContent=`${Math.round(n)} fps${s<.99?` \xB7 ${Math.round(s*100)}% res`:""}`,of.title=`Slowest frame ${gs.worst.toFixed(1)} ms, drawing ${ze.pixelRatio.toFixed(2)} pixels per screen point`,of.className=`fps${n<30?" bad":n<55?" slow":""}`,gs.frames=0,gs.since=i,gs.worst=0}var af=.85,df={ceiling:ze.pixelRatio,samples:[],smooth:0,warmup:2,raised:!1};function qS(i){let t=df,e=ze.pixelRatio;if(t.ceiling=Math.min(t.ceiling,ze.maxPixelRatio),t.warmup>0){t.warmup-=i/1e3;return}if(i>200||document.hidden){t.samples.length=0;return}if(t.samples.push(i),t.samples.length<45)return;let n=t.samples.sort((o,a)=>o-a)[22];if(t.samples.length=0,ze.auto&&ze.high&&n>20){ze.high=!1,t.warmup=1;return}let s=e;n>36&&e>.6?s=Math.max(.6,e*af):n>18.5&&e>1&&(s=Math.max(1,e*af));let r=t.raised;t.raised=!1,s<e?(r&&(t.ceiling=s),t.smooth=0):n<17.5&&e<t.ceiling?++t.smooth>=8&&(s=Math.min(t.ceiling,e/af),t.smooth=0,t.raised=!0):t.smooth=0,s!==e&&ze.setPixelRatio(s)}var lf=1e3/60,cf=0,B0=!1,E0=performance.now();function ff(i){if(i<cf-lf*.3){requestAnimationFrame(ff);return}cf=Math.max(cf+lf,i+lf*.5);let t=i-E0,e=Math.min(.05,Math.max(0,t/1e3));E0=i,XS(i,t),B0||(O0(e),qS(t)),requestAnimationFrame(ff)}function zh(){Un.started||(Un.started=!0,bt.overlay.hidden=!0,ts.start(),P0())}bt.start.addEventListener("click",zh);window.addEventListener("resize",()=>ze.resize());document.addEventListener("visibilitychange",()=>{df.warmup=Math.max(df.warmup,.5),ts.pause(document.hidden)});Ka(Ja);gf();new URLSearchParams(location.search).has("autostart")&&zh();requestAnimationFrame(ff);location.hostname==="localhost"&&(window.naseeb={sim:Ct,world:ze,view:Un,settings:()=>An,start:zh,drop:mf,jumpTo:OS,putOnRoad:Ka,nextView:U0,press:(i,t=!0)=>Hs[i]=t,holdLoop:i=>B0=i,step:(i=1/60,t=1)=>{for(let e=0;e<t;e++)O0(i)}});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
