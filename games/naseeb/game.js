function Zf(i,t,e){let n=Math.min(t/i,.98),s=1,r=2,a=1.5,o=1;for(let l=0;l<50;l++)a=(s+r)/2,o=Math.tan(Math.PI/(2*a))/e,Math.sin(a*Math.atan(o))>n?s=a:r=a;return l=>i*Math.sin(a*Math.atan(o*l))}var es=[{id:"asphalt",name:"Dry asphalt",peak:1,slide:.75,slipAtPeak:.12,hysteresis:1,give:1/0,damping:.14},{id:"concrete",name:"Concrete",peak:.9,slide:.7,slipAtPeak:.1,hysteresis:.9,give:1/0,damping:.14},{id:"wet",name:"Wet asphalt",peak:.6,slide:.45,slipAtPeak:.09,hysteresis:1.25,give:1/0,damping:.2},{id:"gravel",name:"Gravel",peak:.6,slide:.55,slipAtPeak:.3,hysteresis:1,give:6e5,damping:.45},{id:"grass",name:"Grass",peak:.5,slide:.4,slipAtPeak:.2,hysteresis:1,give:4e5,damping:.6},{id:"sand",name:"Sand",peak:.45,slide:.42,slipAtPeak:.35,hysteresis:1,give:6e4,damping:1},{id:"mud",name:"Mud",peak:.4,slide:.3,slipAtPeak:.25,hysteresis:1,give:12e4,damping:1.1},{id:"snow",name:"Packed snow",peak:.3,slide:.2,slipAtPeak:.12,hysteresis:1,give:9e4,damping:.9},{id:"ice",name:"Ice",peak:.12,slide:.07,slipAtPeak:.06,hysteresis:1,give:1/0,damping:.14},{id:"dirt",name:"Packed dirt",peak:.75,slide:.6,slipAtPeak:.15,hysteresis:1.05,give:12e5,damping:.4},{id:"rock",name:"Rock",peak:.85,slide:.7,slipAtPeak:.1,hysteresis:1,give:1/0,damping:.15},{id:"wood",name:"Logs",peak:.65,slide:.5,slipAtPeak:.1,hysteresis:1,give:1/0,damping:.2}];for(let i of es)i.grip=Zf(i.peak,i.slide,i.slipAtPeak);var yn=i=>es.find(t=>t.id===i);var Le=2.2,$f=[...["asphalt","concrete","wet","gravel","grass","sand","mud","snow","ice"].map(i=>({name:yn(i).name,left:yn(i),right:yn(i)})),{name:"Ice | asphalt",left:yn("ice"),right:yn("asphalt")}];var On=6.5,cu=i=>i<=0?0:i>=1?1:i*i*(3-2*i),iu=i=>i>=1?0:.5+.5*Math.cos(Math.PI*i),su=i=>i<=0?0:i>=1?i-.5:i*i*i-i*i*i*i/2,Ni=(i,t,e,n)=>n*(su((i-t+n/2)/n)-su((i-e+n/2)/n))/(e-t),ws=(i,t,e)=>1-cu((Math.abs(i)-t)/(e-t)),Vl=i=>cu((i+.05)/.1);function Jf(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var Kf=yn("dirt"),jf=yn("grass"),Wl=[{u:5.5,r:.1,angle:0},{u:10,r:.125,angle:0},{u:14.5,r:.15,angle:0},{u:20,r:.125,angle:.45}],Qf=2.7,ru=(i,t,e)=>{let n=Math.cos(i.angle),s=Math.sin(i.angle),r=e-i.u,a=t*n+r*s;if(Math.abs(a)>Qf)return 0;let o=Math.abs(-t*s+r*n);return o>=i.r?0:.8*i.r+Math.sqrt(i.r*i.r-o*o)},Ma=(()=>{let i=Jf(1970),t=[];for(let e=0;e<26;e++){let n=.12+i()*.22,s=Math.max(n*1.3,.25+i()*.3);t.push({x:(i()*2-1)*1.9,u:5.5+i()*16.5,h:n,rx:s,ru:s*(.75+i()*.5)})}return t.sort((e,n)=>e.u-n.u)})(),au=Math.max(...Ma.map(i=>i.ru)),ou=(i,t,e)=>{let n=(t-i.x)/i.rx,s=(e-i.u)/i.ru,r=1-n*n-s*s;return r>0?i.h*Math.sqrt(r):0},tp=3,ep=Math.tan(25*Math.PI/180),Fn=[{id:"start",look:"dirt",name:"Test ground",note:"Naseeb's proving run",length:16,height:()=>0},{id:"washboard",look:"dirt",name:"Washboard",note:"5 cm ripples, 75 cm apart",length:24,height:(i,t)=>t<4||t>19.75?0:.025*(1-Math.cos(2*Math.PI*(t-4)/.75))*ws(i,Le,Le+.6)},{id:"logs",look:"wood",name:"Log crossing",note:"20, 25 and 30 cm logs",length:26,fine:!0,logs:Wl,drawn:()=>0,height:(i,t)=>{let e=0;for(let n of Wl)e=Math.max(e,ru(n,i,t));return e},surface:(i,t)=>Wl.some(e=>ru(e,i,t)>0)?yn("wood"):null},{id:"twister",look:"dirt",name:"Axle twister",note:"40 cm mounds, left and right",length:30,height:(i,t)=>{let e=0;for(let n=0;n<5;n++){let s=n%2?.85:-.85,r=7+n*4.5;e=Math.max(e,.4*iu(Math.hypot((i-s)/1.3,(t-r)/2.2)))}return e}},{id:"steps",look:"concrete",name:"Rock steps",note:"Up 25 and 20 cm, down 45 cm",length:26,fine:!0,height:(i,t)=>(.25*Vl(t-7)+.2*Vl(t-11)-.45*Vl(t-16))*ws(i,Le+.2,Le+.3),surface:(i,t)=>t>6.9&&t<16.1&&Math.abs(i)<Le+.3?yn("concrete"):null},{id:"hill",look:"concrete",name:"Hill climb",note:"40% up, 40% down",length:40,height:(i,t)=>{let e=tp*(Ni(t,6,13.5,1.2)-Ni(t,19.5,27,1.2)),n=Math.abs(i)-(Le+.3);return n<=0?e:Math.max(0,e-n)},surface:(i,t)=>t>5.5&&t<27.5&&Math.abs(i)<Le+.3?yn("concrete"):null},{id:"sideslope",look:"dirt",name:"Side slope",note:"25\xB0 across",length:36,height:(i,t)=>{let e=Ni(t,5,10,1.5)-Ni(t,26,31,1.5);if(e<=0)return 0;let n=Le+.2,s=a=>e*ep*(a+Le);if(i<-Le)return 0;if(i<=n)return s(i);let r=s(n);return Math.max(0,r-(i-n)*.9)}},{id:"ditch",look:"dirt",name:"V-ditch",note:"55 cm deep, at an angle \xB7 low range",length:24,height:(i,t)=>-.55*iu(Math.abs(t-12-.6*i)/1.6)*ws(i,3,5)},{id:"mud",look:"mud",name:"Mud pit",note:"30 cm deep",length:26,height:(i,t)=>-.3*(Ni(t,5,8,1)-Ni(t,19,22,1))*ws(i,Le+.2,Le+1.2),surface:(i,t)=>t>5.5&&t<21.5&&Math.abs(i)<Le+.6?yn("mud"):null},{id:"rocks",look:"rock",name:"Rock garden",note:"Boulders up to 35 cm",length:28,fine:!0,rocks:Ma,drawn:()=>0,height:(i,t)=>{let e=0;for(let n of Ma){if(n.u-au>t)break;Math.abs(n.u-t)<n.ru&&(e=Math.max(e,ou(n,i,t)))}return e},surface:(i,t)=>{for(let e of Ma){if(e.u-au>t)break;if(ou(e,i,t)>.005)return yn("rock")}return null}},{id:"sand",look:"sand",name:"Sand trap",note:"Loose and soft",length:22,height:(i,t)=>-.08*(Ni(t,4,6,1)-Ni(t,16,18,1))*ws(i,Le,Le+1),surface:(i,t)=>t>4.5&&t<17.5&&Math.abs(i)<Le+.5?yn("sand"):null},{id:"whoops",look:"dirt",name:"Whoops",note:"30 cm rollers, 5 m apart",length:38,height:(i,t)=>t<6||t>26?0:.15*(1-Math.cos(2*Math.PI*(t-6)/5))*ws(i,Le+.3,Le+1.3)}],ql=0;for(let i of Fn)i.start=ql,ql+=i.length;var Es=ql,lu=0;function Xl(i){let t=(i%Es+Es)%Es,e=lu;if(t<Fn[e].start||t>=Fn[e].start+Fn[e].length){for(e=0;e<Fn.length-1&&t>=Fn[e].start+Fn[e].length;)e++;lu=e}return{section:Fn[e],index:e,u:t-Fn[e].start}}var We={sections:Fn,length:Es,locate:Xl,height(i,t){if(Math.abs(i)>=On)return 0;let{section:e,u:n}=Xl(-t);return e.height(i,n)},surface(i,t){let{section:e,u:n}=Xl(-t),s=e.surface&&e.surface(i,n);return s||(Math.abs(i)<=Le+.2?Kf:jf)},sectionNear(i,t){let e=Fn[t],n=Math.round((i-e.start)/Es);return Math.max(0,n)*Es+e.start}};var Yl=.0254,je={width:.205,rimRadius:7.5*Yl,flangeRadius:7.5*Yl+.016,radius:7.5*Yl+.205*.78,tireMass:13,rimMass:9,grip:.85},fn=je.radius,wa=je.rimRadius,pe={name:"Naseeb's jeep",wheelbase:2.285,frontTrack:1.405,rearTrack:1.4,maxSteer:29*Math.PI/180,steerRate:{slow:.3,fast:.55,after:.3,ramp:1.2,centre:.6,centreAt:5},throttleRamp:{start:.25,after:.3,ramp:1.5,release:.15},steeringRatio:20,rightHandDrive:!0,dragArea:.65*2.6},zn=pe.wheelbase/2,Be={name:"3.9 L straight six",curve:[[600,215],[1e3,250],[1500,275],[2e3,283],[2500,280],[3e3,268],[3600,247],[4e3,225]],idle:650,governor:4e3,biteFrom:1200,biteFull:2200,throttleFlow:4500,engageRpm:900,flywheel:.3,efficiency:.85},Ui=[{name:"1",label:"Low 1st",ratio:2.76*2.31},{name:"2",label:"Low 2nd",ratio:1.7*2.31},{name:"3",label:"High 1st",ratio:2.76},{name:"4",label:"Low 3rd",ratio:2.31},{name:"5",label:"High 2nd",ratio:1.7},{name:"6",label:"High 3rd",ratio:1}],np={name:"R",label:"Reverse",ratio:-3.67},Zl=4.11,ei=[3,5,6],ip=3400,sp=1300,rp=.3,ap=420,hu={front:1400,rear:1e3},pr=[{name:"frame rail",mass:42,at:[-.42,.12,-.12],size:[.06,.15,3.42]},{name:"frame rail",mass:42,at:[.42,.12,-.12],size:[.06,.15,3.42]},...[-1.7,-1.1,-.2,.6,1.5].map(i=>({name:"cross member",mass:6,at:[0,.12,i],size:[.84,.08,.06]})),{name:"front bumper",mass:15,at:[0,.12,-1.79],size:[1.6,.15,.1]},{name:"rear cross member",mass:10,at:[0,.12,1.66],size:[1.2,.12,.08]},{name:"engine",mass:260,at:[0,.3,-.75],size:[.5,.65,.95]},{name:"gearbox and transfer case",mass:95,at:[0,.12,0],size:[.35,.35,.65]},{name:"radiator",mass:28,at:[0,.45,-1.4],size:[.7,.6,.1]},{name:"fuel tank",mass:50,at:[.3,.25,.25],size:[.5,.25,.6]},{name:"battery",mass:20,at:[-.45,.45,-1.2],size:[.25,.22,.17]},{name:"exhaust, steering and the rest",mass:40,at:[0,.25,-.2],size:[.8,.3,2]},...[-1,1].flatMap(i=>[-1,1].map(t=>({name:"leaf spring",mass:7,at:[t*.42,.06,i*zn],size:[.07,.04,1.15]}))),...[-1,1].flatMap(i=>[-1,1].map(t=>({name:"leaf spring",mass:7,at:[t*.42,.03,i*zn],size:[.07,.04,1.15],axle:i<0?"front":"rear"}))),{name:"body tub",mass:145,at:[0,.5,1.05],size:[1.6,.6,1.9]},{name:"front clip",mass:95,at:[0,.62,-1.12],size:[1.66,.6,1.14]},{name:"cowl, dash and windscreen",mass:55,at:[0,.85,-.5],size:[1.5,.8,.3]},{name:"doors",mass:50,at:[0,.55,-.1],size:[1.66,.6,.85]},{name:"hardtop",mass:60,at:[0,1.4,.75],size:[1.6,.6,2.5]},{name:"seats",mass:35,at:[0,.45,.05],size:[1.2,.5,.5]},{name:"spare wheel",mass:27,at:[0,.65,2.05],size:[.2,.7,.7]},{name:"rear bumperettes",mass:10,at:[0,.12,1.96],size:[1.5,.1,.1]},{name:"front axle",mass:125,at:[0,0,-zn],size:[pe.frontTrack-.2,.1,.1],axle:"front"},{name:"rear axle",mass:105,at:[0,0,zn],size:[pe.rearTrack-.2,.09,.09],axle:"rear"}],mi={front:{rate:4e4,seat:.42,shock:.5,damping:4200,bump:.08,droop:.11,rollCentre:.47,twist:15e3},rear:{rate:48e3,seat:.42,shock:.5,damping:3800,bump:.09,droop:.12,rollCentre:.5,twist:15e3},bumpShare:.45,reboundShare:1.55,stop:4e5,leafFriction:180,frictionSpeed:.005},ni=[{name:"front left",side:-1,front:!0,at:[-pe.frontTrack/2,0,-zn]},{name:"front right",side:1,front:!0,at:[pe.frontTrack/2,0,-zn]},{name:"rear left",side:-1,front:!1,at:[-pe.rearTrack/2,0,zn]},{name:"rear right",side:1,front:!1,at:[pe.rearTrack/2,0,zn]}],op=.55*(fn-.015)**2+.45*(fn*fn+wa*wa)/2,lp=.65*(wa-.01)**2+.35*.5*(wa-.03)**2,gi={weight:je.tireMass+je.rimMass,pressure:1.8,drive:"4x4",lockers:"none",world:"earth"},Ts={earth:{name:"Earth",g:9.81,air:1.225},mars:{name:"Mars",g:3.71,air:.02},moon:{name:"Moon",g:1.62,air:0},jupiter:{name:"Jupiter",g:24.79,air:.16}};function cp(i){let t=Be.curve;if(i>Be.governor)return 0;if(i<=t[0][0])return t[0][1];for(let e=1;e<t.length;e++)if(i<=t[e][0]){let[n,s]=t[e-1],[r,a]=t[e];return s+(a-s)*(i-n)/(r-n)}return t[t.length-1][1]}var mu=i=>25+.012*i;function hp(i,t){let e=i>0?Math.min(1,i**1.3*Be.throttleFlow/Math.max(t,600)):0;return e*cp(t)-(1-e)*mu(t)}var Sa=60/(2*Math.PI),$l=1/4e3,uu=400,du=.25,up=.05,dp=8,fp=[...[-.75,0,.75].map(i=>[i,.05,-1.82]),...[-.7,.7].map(i=>[i,.07,1.98]),...[-1.4,-.5,.4,1.4].flatMap(i=>[-.42,.42].map(t=>[t,.045,i])),[0,-.06,.1]],pp=.14,Jl=.1,mp=2e6,gp=3e4,xp=.45,fu=15,ba=25,Jt=(i,t)=>[i[0]+t[0],i[1]+t[1],i[2]+t[2]],Me=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],qt=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],fe=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],we=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],Bn=i=>{let t=Math.hypot(i[0],i[1],i[2]);return t>0?qt(i,1/t):[0,0,0]},Ea=class{constructor(t=gi,e={}){this.options={rolling:!0,air:!0,...e},this.ground=this.options.ground||We,this.time=0,this.wheels=ni.map(n=>({...n,spin:0,angle:0,steer:0,contact:null})),this.modes=[],this.auto=!0,this.gear=ei[0],this.shifting=0,this.controls={throttle:0,brake:0,steer:0},this.axles=[],this.shaftAngle=0,this.engineAngle=0,this.configure(t),this.reset(4,.1)}configure(t){let e=t.weight/gi.weight,n=Ts[t.world]||Ts.earth;this.settings={...t};let s=t.weight,r=e*(je.tireMass*op+je.rimMass*lp),a=.5*r+s*je.width**2/12;this.wheelMass=s,this.wheelInertia=r;let o=pr.filter(b=>!b.axle).map(b=>({mass:b.mass,at:b.at,own:pu(b.mass,b.size)}));this.sprungMass=o.reduce((b,x)=>b+x.mass,0),this.centre=qt(o.reduce((b,x)=>Jt(b,qt(x.at,x.mass)),[0,0,0]),1/this.sprungMass),this.inertia=[0,0,0];for(let b of o){let[x,S,v]=Me(b.at,this.centre);this.inertia[0]+=b.mass*(S*S+v*v)+b.own[0],this.inertia[1]+=b.mass*(x*x+v*v)+b.own[1],this.inertia[2]+=b.mass*(x*x+S*S)+b.own[2]}let l=this.axles,[c,h,d,u]=this.wheels;this.axles=["front","rear"].map((b,x)=>{let S=x?[d,u]:[c,h],v=mi[b],A=(x?1:-1)*zn,_=[...pr.filter(N=>N.axle===b).map(N=>({mass:N.mass,at:N.at,own:pu(N.mass,N.size)})),...S.map(N=>({mass:s,at:N.at,own:[0,a,a]}))],E=_.reduce((N,H)=>N+H.mass,0),C=0;for(let N of _){C+=N.mass*(N.at[0]**2+N.at[1]**2)+N.own[2];let[H,,D]=Me(N.at,this.centre);this.inertia[1]+=N.mass*(H*H+D*D)+N.own[1]}let P=l[x]||{};return{name:b,wheels:S,track:Math.abs(S[1].at[0]-S[0].at[0]),mass:E,roll:C,attach:Me([0,0,A],this.centre),...v,y:P.y??0,vy:P.vy??0,slope:P.slope??0,vslope:P.vslope??0,travel:[0,0],load:[0,0]}});for(let b of this.wheels)b.axle=this.axles[b.front?0:1],b.offset=b.at[0];let f=this.axles.reduce((b,x)=>b+x.mass,0);this.mass=this.sprungMass+f;let g=(zn-this.centre[2])/pe.wheelbase,M=this.sprungMass*(Ts[t.world]||Ts.earth).g;this.axles[0].preload=M*g/2/this.axles[0].rate,this.axles[1].preload=M*(1-g)/2/this.axles[1].rate,this.raise=f/this.mass*this.centre[1],this.sprungShare=this.sprungMass/this.mass,this.bodyHeight=fn+this.centre[1];let p=[...pr.map(b=>({mass:b.mass,at:b.at})),...ni.map(b=>({mass:s,at:b.at}))];this.totalCentre=qt(p.reduce((b,x)=>Jt(b,qt(x.at,x.mass)),[0,0,0]),1/this.mass);let m=this.wheels.map(b=>b.spin);this.fourByFour=t.drive!=="rear",Object.assign(this.axles[0],{locked:t.lockers==="both",driven:this.fourByFour,brake:hu.front}),Object.assign(this.axles[1],{locked:t.lockers!=="none",driven:!0,brake:hu.rear}),this.modes=[];let T=(b,x)=>{let S={name:x,base:b,inertia:b,spin:0};return this.modes.push(S),S};this.driveshaft=T(0,"driveshaft");for(let b of this.axles){let[x,S]=b.wheels;if(b.driven)if(this.driveshaft.base+=2*r,b.locked)x.links=S.links=[[this.driveshaft,1]];else{let v=T(2*r,`${b.name} differential`);x.links=[[this.driveshaft,1],[v,1]],S.links=[[this.driveshaft,1],[v,-1]]}else if(b.locked){let v=T(2*r,`${b.name} axle`);x.links=S.links=[[v,1]]}else for(let v of b.wheels)v.links=[[T(r,v.name),1]]}for(let b of this.modes){let x=this.wheels.filter(S=>S.links.some(([v])=>v===b));b===this.driveshaft?b.spin=x.reduce((S,v)=>S+m[this.wheels.indexOf(v)],0)/x.length:b.name.endsWith("differential")?b.spin=(m[this.wheels.indexOf(x[0])]-m[this.wheels.indexOf(x[1])])/2:b.spin=x.reduce((S,v)=>S+m[this.wheels.indexOf(v)],0)/x.length}this.refreshSpins(),this.allSpinInertia=4*r,this.pressureBar=t.pressure,this.kTire=6e4+1e3*t.pressure*100,this.g=n.g,this.air=this.options.air?n.air:0}reset(t,e=0){let n=this.mass*this.g/4/this.kTire,s=v=>-t+v.at[2]-this.centre[2],r=ni.map(v=>this.ground.height(v.at[0],s(v))),[a,o,l,c]=r,h=0;ni.forEach((v,A)=>{let _=(v.front?a+o-l-c:l+c-a-o)/2/pe.wheelbase;for(let E of[-.3,-.15,.15,.3])h=Math.max(h,this.ground.height(v.at[0],s(v)+E)-(r[A]-E*(v.front?_:-_)))}),e+=h;let d=Math.atan(((a+o)/2-(l+c)/2)/pe.wheelbase),u=Math.atan(((o+c)/2-(a+l)/2)/pe.frontTrack),f=v=>[Math.cos(v/2),Math.sin(v/2)],[g,M]=f(d),[p,m]=f(u);this.q=[g*p,M*p,-M*m,g*m],this.v=[0,0,0],this.L=[0,0,0],this.p=[0,0,-t],this.update();let T=this.toWorld(this.centre),b=T[2]-this.centre[2],S=r.reduce((v,A)=>v+A,0)/4+Math.tan(d)*b-Math.tan(u)*T[0]+(fn-n)/Math.cos(d)/Math.cos(u)+e;this.p=[0,S+T[1],-t],this.update();for(let v of this.axles)v.y=this.p[1]+this.toWorld(v.attach)[1],v.slope=Math.tan(u),v.vy=v.vslope=0;for(let v of this.modes)v.spin=0;for(let v of this.wheels)v.steer=0;this.refreshSpins(),this.steer=0,this.steerHeld=0,this.steerWay=0,this.auto&&(this.gear=ei[0]),this.pedal=0,this.throttleHeld=0,this.shifting=0,this.rpm=Be.idle,this.clutch="open",this.acc=0,this.moved=0,this.engineTorque=0,this.wheelTorque=0,this.drag=0,this.update();for(let v of this.wheels)v.contact=this.contactOf(v)}shift(t){if(t==="auto"){this.auto=!0,ei.includes(this.gear)||this.setGear(ei[0]);return}this.auto=!1,this.setGear(t)}autoReverse(t){this.auto=!0,this.setGear(t?-1:ei[0])}setGear(t){t!==this.gear&&(this.gear=t,this.shifting=rp)}get gearRatio(){return this.gear===-1?np.ratio*Zl:this.gear===0?0:Ui[this.gear-1].ratio*Zl}get gearName(){return this.gear===-1?"R":this.gear===0?"N":Ui[this.gear-1].name}advance(t,e){e&&(this.controls=e),this.acc+=t;let n=0;for(;this.acc>=$l&&n<uu;)this.step($l),this.acc-=$l,n++;n===uu&&(this.acc=0)}update(){let[t,e,n,s]=this.q;this.ax=[1-2*(n*n+s*s),2*(e*n+t*s),2*(e*s-t*n)],this.ay=[2*(e*n-t*s),1-2*(e*e+s*s),2*(n*s+t*e)],this.az=[2*(e*s+t*n),2*(n*s-t*e),1-2*(e*e+n*n)],this.w=this.inverseInertia(this.L)}get bodySlope(){return Math.max(-2,Math.min(2,this.ax[1]/Math.hypot(this.ax[0],this.ax[2])))}get overturned(){return this.ay[1]<.34}toWorld(t){return[this.ax[0]*t[0]+this.ay[0]*t[1]+this.az[0]*t[2],this.ax[1]*t[0]+this.ay[1]*t[1]+this.az[1]*t[2],this.ax[2]*t[0]+this.ay[2]*t[1]+this.az[2]*t[2]]}inverseInertia(t){return this.toWorld([fe(this.ax,t)/this.inertia[0],fe(this.ay,t)/this.inertia[1],fe(this.az,t)/this.inertia[2]])}refreshSpins(){for(let t of this.wheels)t.spin=t.links.reduce((e,[n,s])=>e+s*n.spin,0),t.give=t.links.reduce((e,[n])=>e+1/n.inertia,0)}turnWheel(t,e){for(let[n,s]of t.links)n.spin+=s*e/n.inertia}spinAll(t){for(let e of this.modes)e.spin=e.name.endsWith("differential")?0:t;this.refreshSpins()}carrier(t){return(t.wheels[0].spin+t.wheels[1].spin)/2}get spin(){return this.driveshaft.spin}get forward(){return Bn([-this.az[0],0,-this.az[2]])}get heading(){let t=this.forward;return Math.atan2(-t[0],-t[2])}get forwardSpeed(){return fe(this.v,this.forward)}get along(){return-this.p[2]}axleFrame(t){let e=Jt(this.p,this.toWorld(t.attach)),n=Bn([this.ax[0],0,this.ax[2]]),s=Bn(Jt(n,[0,t.slope,0])),r=Bn(we(s,this.forward));return{at:e,middle:[e[0],t.y,e[2]],beam:s,up:r}}touch(t,e){let n=this.ground,s=fn*.95,r=20,a=2*s/r,o=f=>{let g=t[0]+e[0]*f,M=t[2]+e[2]*f,p=n.height(g,M),m=t[1]-p;return{s:f,x:g,z:M,h:p,up:m,d2:f*f+m*m}},l=[],c=0;for(let f=0;f<=r;f++)l.push(o(-s+f*a)),l[f].d2<l[c].d2&&(c=f);let h=l[c];if(c>0&&c<r){let[f,g,M]=[l[c-1].d2,h.d2,l[c+1].d2],p=f-2*g+M;if(p>1e-12){let m=o(h.s+.5*a*(f-M)/p);m.d2<h.d2&&(h=m)}}let d=[h.x,h.h,h.z];if(h.up<.02)return{ground:d,distance:h.up,normal:[0,1,0]};let u=Math.sqrt(h.d2);return{ground:d,distance:u,normal:[-e[0]*h.s/u,h.up/u,-e[2]*h.s/u]}}contactOf(t){let e=t.steer,n=this.axleFrame(t.axle),s=Jt(qt(n.beam,Math.cos(e)),qt(we(n.up,n.beam),Math.sin(e))),r=qt(s,-1),a=Jt(n.middle,qt(n.beam,t.offset)),o=Bn([s[2],0,-s[0]]),l=Bn([s[0],0,s[2]]),{ground:c,distance:h,normal:d}=this.touch(a,o),u=this.ground,f=je.width/2,g=u.height(c[0]+l[0]*f,c[2]+l[2]*f)-u.height(c[0]-l[0]*f,c[2]-l[2]*f),M=Math.max(-1.5,Math.min(1.5,g/(2*f))),p=Bn(Me(d,qt(l,M*d[1]))),m=(fn-h)*fe(p,d),T=u.surface(c[0],c[2]),b=T.give===1/0?this.kTire:1/(1/this.kTire+1/T.give),x=2*T.damping*Math.sqrt(b*this.mass/4),S=Jt(this.v,we(this.w,Me(a,this.p)));S[1]=t.axle.vy+t.axle.vslope*t.offset;let v=m>0?Math.max(0,b*m-x*fe(S,p)):0,A=v/this.kTire,_=fn-A/3,E=Me(a,qt(p,_)),C=fe(Me(a,E),this.ay),P=Jt(Me(E,this.p),qt(this.ay,this.raise)),N=this.sprungShare*t.axle.rollCentre+(1-this.sprungShare)*this.bodyHeight,H=Jt(Me(E,this.p),qt(this.ay,N-fn+C)),D=Bn([this.ax[0],0,this.ax[2]]),k=Me(E,a),Y=Bn(Me(o,qt(p,fe(o,p)))),q={wheel:t,surface:T,axle:s,turn:r,n:p,forward:Y,side:Bn(we(Y,p)),centre:a,point:E,ground:c,press:m,across:fe(Me(c,n.middle),n.beam),r:P,rAcross:H,rHub:Jt(Me(a,this.p),qt(this.ay,this.raise)),rAcrossHub:Jt(Me(a,this.p),qt(this.ay,N-fn)),lever:this.sprungShare*(t.axle.rollCentre-fn+C)+(1-this.sprungShare)*C,leverHub:this.sprungShare*(t.axle.rollCentre-fn),lateral:D,rho:k,normal:v,squash:A,sink:T.give===1/0?0:v/T.give,rollingRadius:_,friction:[0,0,0],impulse:[0,0,0],limit:0,slip:0,sideSlip:0,slipSpeed:0,tread:[0,0,0],crr:0,rollingMoment:0,soilDrag:0};return q.tread=this.treadVelocity(q,t.spin),q}treadVelocity(t,e){let n=we(this.w,t.r),s=we(this.w,t.rAcross),r=Jt(n,qt(t.lateral,fe(s,t.lateral)-fe(n,t.lateral))),a=qt(we(t.turn,t.rho),e),o=Jt(Jt(this.v,r),a),l=t.wheel.axle;return o[1]=l.vy+l.vslope*t.across+a[1],o}moment(t,e){let n=[e[0],0,e[2]],s=qt(t.lateral,fe(n,t.lateral)),r=Me(n,s),a=fe(we(t.rho,n),t.turn);return Me(Jt(we(t.r,r),we(t.rAcross,s)),qt(t.turn,a))}push(t,e){let n=fe(we(t.rho,e),t.turn);this.v=Jt(this.v,qt([e[0],0,e[2]],1/this.mass)),this.L=Jt(this.L,this.moment(t,e));let s=t.wheel.axle;s.vslope+=(t.lever*fe(e,t.lateral)+e[1]*t.across)/s.roll,s.vy+=e[1]/s.mass,this.turnWheel(t.wheel,n),this.refreshSpins()}shove(t,e){let n=qt(t.lateral,fe(e,t.lateral)),s=Me(e,n);this.v=Jt(this.v,qt(e,1/this.mass)),this.L=Jt(this.L,Jt(we(t.rHub,s),we(t.rAcrossHub,n)));let r=t.wheel.axle;r.vslope+=t.leverHub*fe(e,t.lateral)/r.roll}inverseMassAt(t,e){let n=fe(we(t.rho,e),t.turn),s=this.inverseInertia(this.moment(t,e)),r=[e[0],0,e[2]],a=qt(t.lateral,fe(r,t.lateral)),o=Me(r,a),l=t.wheel.axle,c=e[1]*e[1]*(1/l.mass+t.across*t.across/l.roll);return fe(r,r)/this.mass+fe(o,we(s,t.r))+fe(a,we(s,t.rAcross))+c+n*n*t.wheel.give}inverseMassAtHub(t,e){return 1/this.mass+fe(e,we(this.inverseInertia(we(t,e)),t))}scrape(t){let e=this.ground,n=.03,s=(r,a)=>{let o=e.height(r[0],r[2])-r[1];if(o<=0)return null;let l=(e.height(r[0]+n,r[2])-e.height(r[0]-n,r[2]))/(2*n),c=(e.height(r[0],r[2]+n)-e.height(r[0],r[2]-n))/(2*n),h=Bn([-l,1,-c]),d=Math.max(0,mp*o*h[1]-gp*fe(a,h)),u=Me(a,qt(h,fe(a,h))),f=Math.hypot(...u);return Jt(qt(h,d),qt(u,-xp*d/Math.max(f,.1)))};for(let r of fp){let a=this.toWorld(Me(r,this.centre)),o=s(Jt(this.p,a),Jt(this.v,we(this.w,a)));if(!o)continue;let l=qt(o,t);this.v=Jt(this.v,[l[0]/this.mass,l[1]/this.sprungMass,l[2]/this.mass]),this.L=Jt(this.L,we(a,l))}for(let r of this.axles){let a=this.axleFrame(r),o=Me(Jt(a.middle,qt(a.beam,Jl)),qt(a.up,pp)),l=Me(o,this.p),c=Jt(this.v,we(this.w,l));c[1]=r.vy+r.vslope*Jl;let h=s(o,c);if(!h)continue;let d=qt(h,t);this.v=Jt(this.v,[d[0]/this.mass,0,d[2]/this.mass]),this.L=Jt(this.L,we(Jt(l,qt(this.ay,this.raise)),[d[0],0,d[2]])),r.vy+=d[1]/r.mass,r.vslope+=d[1]*Jl/r.roll}this.w=this.inverseInertia(this.L)}drivetrain(t){let e=Math.max(0,Math.min(1,this.controls.throttle)),n=pe.throttleRamp;if(e>0){this.throttleHeld+=t;let g=n.start+(1-n.start)*Math.min(1,Math.max(0,(this.throttleHeld-n.after)/n.ramp));this.pedal=Math.min(e,Math.max(this.pedal,g))}else this.throttleHeld=0,this.pedal=Math.max(0,this.pedal-t/n.release);let s=this.pedal,r=this.driveshaft.spin,a=this.gearRatio;if(this.shifting>0&&(this.shifting=Math.max(0,this.shifting-t)),this.auto&&this.gear>=1&&this.shifting===0){let g=r*a*Sa,M=ei.indexOf(this.gear);M<0?this.setGear(ei[0]):s>0&&g>ip&&M<ei.length-1?this.setGear(ei[M+1]):g<sp&&M>0&&this.setGear(ei[M-1])}let o=this.rpm,l=hp(s,o);o<Be.idle+150&&(l=Math.max(l,mu(o)+(Be.idle+150-o)*.4));let c=0,h=0,d=r*a*Sa,u=g=>this.rpm=Math.max(0,this.rpm+g/Be.flywheel*t*Sa);if(a===0)this.clutch="open",u(l);else if(this.shifting>0)this.clutch="open",this.rpm+=(Math.max(Be.idle,d)-this.rpm)*Math.min(1,t*12);else if(this.clutch==="in"&&d>=Be.engageRpm)this.rpm=d,h=l,c=Be.flywheel*a*a;else{let g=Math.min(1,Math.max(0,(o-Be.biteFrom)/(Be.biteFull-Be.biteFrom)))**2,M=s>0?ap*g:0,p=o-Math.max(0,d);M>0&&Math.abs(p)<25&&d>=Be.engageRpm?(this.clutch="in",this.rpm=d,h=l,c=Be.flywheel*a*a):(this.clutch=M>0?"slipping":"open",h=Math.sign(p)*M,u(l-h))}this.engineTorque=l;let f=h*a*(h>0?Be.efficiency:1/Be.efficiency);return this.wheelTorque=f,this.driveshaft.inertia=this.driveshaft.base+c,this.refreshSpins(),f}step(t){let e=this.mass,{brake:n,steer:s}=this.controls,r=Math.max(-1,Math.min(1,s))*pe.maxSteer,a=Math.sign(s);this.steerHeld=a!==0&&a===this.steerWay?this.steerHeld+t:0,this.steerWay=a;let o=pe.steerRate,l=Math.min(1,Math.max(0,(this.steerHeld-o.after)/o.ramp)),c=Math.min(1,Math.abs(this.forwardSpeed)/o.centreAt),d=(a===0?o.centre*c:o.slow+(o.fast-o.slow)*l)*t;this.steer+=Math.max(-d,Math.min(d,r-this.steer));let[u,f]=this.wheels;if(Math.abs(this.steer)<1e-9)u.steer=f.steer=0;else{let I=pe.wheelbase/Math.tan(this.steer);u.steer=Math.atan(pe.wheelbase/(I-pe.frontTrack/2)),f.steer=Math.atan(pe.wheelbase/(I+pe.frontTrack/2))}let g=this.wheels.map(I=>I.contact=this.contactOf(I)),M=Math.hypot(...this.v),p=.5*this.air*pe.dragArea*M;this.drag=p*M;let m=[-p*this.v[0],-this.sprungMass*this.g-p*this.v[1],-p*this.v[2]],T=[0,0,0];for(let I of this.axles){let rt=this.axleFrame(I),lt=-I.mass*this.g,mt=0;for(let[F,G]of[[0,-1],[1,1]]){let it=(xt,Ot)=>{let Q=Jt(rt.at,qt(this.ax,xt)),at=fe(Jt(this.v,we(this.w,Me(Q,this.p))),[0,1,0]),ut=I.y+I.slope*xt-Q[1],dt=I.vy+I.vslope*xt-at;return{x:xt,onBody:Q,squash:ut,rate:dt,f:Ot(ut,dt)}},ft=it(G*I.seat,(xt,Ot)=>{let Q=I.rate*(I.preload+xt)+mi.leafFriction*Math.tanh(Ot/mi.frictionSpeed);return xt>I.bump&&(Q+=mi.stop*(xt-I.bump)),xt<-I.droop&&(Q-=mi.stop*(-I.droop-xt)),Q}),ct=it(G*I.shock,(xt,Ot)=>I.damping*Ot*(Ot>0?mi.bumpShare:mi.reboundShare));for(let{x:xt,onBody:Ot,f:Q}of[ft,ct])m=Jt(m,[0,Q,0]),T=Jt(T,we(Me(Ot,this.p),[0,Q,0])),lt-=Q,mt-=Q*xt;I.travel[F]=ft.squash,I.load[F]=ft.f}let Ct=this.bodySlope,W=I.twist*(I.slope-Ct);mt-=W,T=Jt(T,qt(this.az,W*(1+Ct*Ct)));for(let F of I.wheels){let G=F.contact;lt+=G.normal*G.n[1],mt+=G.normal*G.n[1]*G.across,G.normal>0&&(G.n[0]||G.n[2])&&this.shove(G,[G.normal*G.n[0]*t,0,G.normal*G.n[2]*t])}I.vy+=lt/I.mass*t,I.vslope+=mt/I.roll*t}this.scrape(t);let b=this.drivetrain(t);this.driveshaft.spin+=b*t/this.driveshaft.inertia,T=Jt(T,qt(this.ax,b));for(let I of this.wheels)this.turnWheel(I,-.5*this.air*up*fn**5*I.spin*Math.abs(I.spin)*t);this.refreshSpins(),this.v=Jt(this.v,[m[0]/e*t,m[1]/this.sprungMass*t,m[2]/e*t]),this.L=Jt(this.L,qt(T,t)),this.w=this.inverseInertia(this.L);let x=g.filter(I=>I.normal>0);for(let I of x){let rt=this.treadVelocity(I,I.wheel.spin),lt=Jt(this.v,we(this.w,Me(I.centre,this.p)));lt[1]=I.wheel.axle.vy+I.wheel.axle.vslope*I.across;let mt=fe(rt,I.forward),Ct=fe(rt,I.side),W=fe(lt,I.forward),F=W-mt,G=Math.max(Math.abs(W),Math.abs(F),du);I.slip=-mt/G,I.sideSlip=Ct/G,I.slipSpeed=-mt,I.tread=rt;let it=Math.hypot(mt,Ct)/G,ft=G===du&&it<I.surface.slipAtPeak;I.limit=(ft?I.surface.peak:I.surface.grip(it))*je.grip*I.normal*t}let S=Math.abs(this.forwardSpeed)*3.6;for(let I of g)I.crr=this.options.rolling?I.surface.hysteresis*(.005+(.01+.0095*(S/100)**2)/this.pressureBar):0,I.rollingMoment=I.crr*I.normal*I.rollingRadius;let A=this.wheels.map(I=>{let rt=this.axles.find(mt=>mt.wheels.includes(I)),lt=n*rt.brake;return{wheel:I,brakes:lt,limit:(lt+I.contact.rollingMoment)*t,impulse:0}}).filter(I=>I.limit>0),_=1/Math.max(1,x.length+A.length);for(let I of x){let rt=I.wheel.lastGrip;if(!rt)continue;let lt=Me(rt,qt(I.n,fe(rt,I.n))),mt=Math.hypot(...lt);mt>I.limit&&(lt=qt(lt,I.limit/mt)),I.impulse=lt,this.push(I,lt)}for(let I of A)I.impulse=Math.max(-I.limit,Math.min(I.limit,I.wheel.lastBrake||0)),this.turnWheel(I.wheel,I.impulse);this.refreshSpins(),this.w=this.inverseInertia(this.L);for(let I=0;I<dp;I++){let rt=x.map(mt=>{let Ct=this.treadVelocity(mt,mt.wheel.spin),W=Me(Ct,qt(mt.n,fe(Ct,mt.n))),F=Math.hypot(...W),G=mt.impulse;if(F>1e-12){let ft=qt(W,-1/F);G=Jt(mt.impulse,qt(ft,_*F/this.inverseMassAt(mt,ft)))}let it=Math.hypot(...G);return it>mt.limit&&(G=qt(G,mt.limit/it)),Me(G,mt.impulse)}),lt=A.map(mt=>Math.max(-mt.limit,Math.min(mt.limit,mt.impulse-_*mt.wheel.spin/mt.wheel.give))-mt.impulse);x.forEach((mt,Ct)=>{mt.impulse=Jt(mt.impulse,rt[Ct]),this.push(mt,rt[Ct])}),A.forEach((mt,Ct)=>{mt.impulse+=lt[Ct],this.turnWheel(mt.wheel,lt[Ct])}),this.refreshSpins(),this.w=this.inverseInertia(this.L)}for(let I of x)I.friction=qt(I.impulse,1/t);for(let I of this.wheels)I.lastGrip=I.contact.normal>0?I.contact.impulse:null,I.lastBrake=A.find(rt=>rt.wheel===I)?.impulse||0;let E=A.reduce((I,rt)=>I+rt.impulse*rt.brakes/(rt.limit/t||1),0);E&&(this.L=Jt(this.L,qt(this.ax,E))),this.w=this.inverseInertia(this.L);for(let I of g){if(!this.options.rolling||I.sink<=0)continue;let rt=Math.sqrt(I.sink/(2*fn));I.crr+=rt,I.soilDrag=rt*I.normal;let lt=Me(I.centre,this.p),mt=Jt(this.v,we(this.w,lt)),Ct=Math.hypot(mt[0],mt[2]);if(Ct<1e-9)continue;let W=[-mt[0]/Ct,0,-mt[2]/Ct],F=qt(W,Math.min(I.soilDrag*t,Ct/this.inverseMassAtHub(lt,W)));this.v=Jt(this.v,qt(F,1/e)),this.L=Jt(this.L,we(lt,F)),this.w=this.inverseInertia(this.L)}this.p=Jt(this.p,qt(this.v,t));let[C,P,N,H]=this.q,[D,k,Y]=this.w,q=t/2,K=[C+q*(-D*P-k*N-Y*H),P+q*(D*C+k*H-Y*N),N+q*(k*C+Y*P-D*H),H+q*(Y*C+D*N-k*P)],B=Math.hypot(...K);this.q=K.map(I=>I/B),this.update();for(let I of this.axles)I.y+=I.vy*t,I.slope+=I.vslope*t;for(let I of this.wheels)I.angle+=I.spin*t;this.shaftAngle+=this.driveshaft.spin*Zl*t,this.engineAngle+=this.rpm/Sa*t,this.time+=t,this.moved+=Math.hypot(this.v[0],this.v[2])*t;let X=Math.hypot(...this.w);X>fu&&(this.L=qt(this.L,fu/X),this.w=this.inverseInertia(this.L));for(let I of this.axles)I.vy=Math.max(-ba,Math.min(ba,I.vy)),I.vslope=Math.max(-ba,Math.min(ba,I.vslope))}get rearShare(){return(this.totalCentre[2]+zn)/pe.wheelbase}get steeringWheel(){return this.steer*pe.steeringRatio}energy(){let t=this.modes.reduce((n,s)=>n+.5*s.inertia*s.spin*s.spin,0),e=.5*this.mass*(this.v[0]**2+this.v[2]**2)+.5*this.sprungMass*this.v[1]**2;e+=.5*fe(this.w,this.L)+t+this.sprungMass*this.g*this.p[1];for(let n of this.axles){e+=.5*n.mass*n.vy**2+.5*n.roll*n.vslope**2+n.mass*this.g*n.y;let s=this.axleFrame(n);e+=.5*n.twist*(n.slope-this.bodySlope)**2;for(let r of[-1,1]){let a=r*n.seat,o=n.y+n.slope*a-Jt(s.at,qt(this.ax,a))[1];e+=.5*n.rate*(n.preload+o)**2,o>n.bump&&(e+=.5*mi.stop*(o-n.bump)**2),o<-n.droop&&(e+=.5*mi.stop*(-n.droop-o)**2)}for(let r of n.wheels){let a=this.contactOf(r),o=a.surface.give===1/0?this.kTire:1/(1/this.kTire+1/a.surface.give);a.press>0&&(e+=.5*o*a.press*a.press)}}return e}};function pu(i,[t,e,n]){return[i*(e*e+n*n)/12,i*(t*t+n*n)/12,i*(t*t+e*e)/12]}var Yu=0,Nc=1,Zu=2;var ms=1,$u=2,er=3,Yi=0,en=1,nn=2,ci=0,nr=1,Uc=2,Fc=3,Oc=4,Ju=5;var gs=100,Ku=101,ju=102,Qu=103,td=104,ed=200,nd=201,id=202,sd=203,Bc=204,zc=205,rd=206,ad=207,od=208,ld=209,cd=210,hd=211,ud=212,dd=213,fd=214,ja=0,Qa=1,to=2,Gs=3,eo=4,no=5,io=6,so=7,Uo=0,pd=1,md=2,Zn=0,kc=1,Hc=2,Gc=3,Qr=4,Vc=5,Wc=6,Xc=7;var qc=300,Zi=301,xs=302,Fo=303,Oo=304,ta=306,bi=1e3,si=1001,ro=1002,Je=1003,gd=1004;var ea=1005;var Qe=1006,Bo=1007;var $i=1008;var _n=1009,Yc=1010,Zc=1011,ir=1012,zo=1013,$n=1014,Ln=1015,Jn=1016,ko=1017,Ho=1018,sr=1020,$c=35902,Jc=35899,Kc=1021,jc=1022,Dn=1023,ri=1026,Ji=1027,Go=1028,Vo=1029,Ki=1030,Wo=1031;var Xo=1033,na=33776,ia=33777,sa=33778,ra=33779,qo=35840,Yo=35841,Zo=35842,$o=35843,Jo=36196,Ko=37492,jo=37496,Qo=37488,tl=37489,aa=37490,el=37491,nl=37808,il=37809,sl=37810,rl=37811,al=37812,ol=37813,ll=37814,cl=37815,hl=37816,ul=37817,dl=37818,fl=37819,pl=37820,ml=37821,gl=36492,xl=36494,_l=36495,vl=36283,yl=36284,oa=36285,Ml=36286;var Er=2300,ao=2301,Ja=2302,bc=2303,wc=2400,Ec=2401,Tc=2402;var xd=3200;var la=0,_d=1,Ti="",Fe="srgb",Tr="srgb-linear",Ar="linear",ye="srgb";var Ka=7680;var vd=519,yd=512,Md=513,Sd=514,Sl=515,bd=516,wd=517,bl=518,Ed=519,Td=35044,_s=35048;var Qc="300 es",Wn=2e3,Vs=2001;function _p(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function vp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ad(){let i=Rr("canvas");return i.style.display="block",i}var gu={},Ws=null;function th(...i){let t="THREE."+i.shift();Ws?Ws("log",t,...i):console.log(t,...i)}function Rd(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Wt(...i){i=Rd(i);let t="THREE."+i.shift();if(Ws)Ws("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Yt(...i){i=Rd(i);let t="THREE."+i.shift();if(Ws)Ws("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function os(...i){let t=i.join(" ");t in gu||(gu[t]=!0,Wt(...i))}function Cd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Id={[ja]:Qa,[to]:io,[eo]:so,[Gs]:no,[Qa]:ja,[io]:to,[so]:eo,[no]:Gs},ai=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Kl=Math.PI/180,oo=180/Math.PI;function rr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]+"-"+rn[t&255]+rn[t>>8&255]+"-"+rn[t>>16&15|64]+rn[t>>24&255]+"-"+rn[e&63|128]+rn[e>>8&255]+"-"+rn[e>>16&255]+rn[e>>24&255]+rn[n&255]+rn[n>>8&255]+rn[n>>16&255]+rn[n>>24&255]).toLowerCase()}function se(i,t,e){return Math.max(t,Math.min(e,i))}function yp(i,t){return(i%t+t)%t}function jl(i,t,e){return(1-e)*i+e*t}function mr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function pn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ah=class ah{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ah.prototype.isVector2=!0;var ht=ah,bn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],g=r[a+2],M=r[a+3];if(d!==M||l!==u||c!==f||h!==g){let p=l*u+c*f+h*g+d*M;p<0&&(u=-u,f=-f,g=-g,M=-M,p=-p);let m=1-o;if(p<.9995){let T=Math.acos(p),b=Math.sin(T);m=Math.sin(m*T)/b,o=Math.sin(o*T)/b,l=l*m+u*o,c=c*m+f*o,h=h*m+g*o,d=d*m+M*o}else{l=l*m+u*o,c=c*m+f*o,h=h*m+g*o,d=d*m+M*o;let T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-o*f,t[e+2]=c*g+h*f+o*u-l*d,t[e+3]=h*g-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:Wt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(se(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},oh=class oh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(xu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(xu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this.z=se(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this.z=se(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ql.copy(this).projectOnVector(t),this.sub(Ql)}reflect(t){return this.sub(Ql.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};oh.prototype.isVector3=!0;var L=oh,Ql=new L,xu=new bn,lh=class lh{constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],M=s[0],p=s[3],m=s[6],T=s[1],b=s[4],x=s[7],S=s[2],v=s[5],A=s[8];return r[0]=a*M+o*T+l*S,r[3]=a*p+o*b+l*v,r[6]=a*m+o*x+l*A,r[1]=c*M+h*T+d*S,r[4]=c*p+h*b+d*v,r[7]=c*m+h*x+d*A,r[2]=u*M+f*T+g*S,r[5]=u*p+f*b+g*v,r[8]=u*m+f*x+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/g;return t[0]=d*M,t[1]=(s*c-h*n)*M,t[2]=(o*n-s*a)*M,t[3]=u*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-o*e)*M,t[6]=f*M,t[7]=(n*l-c*e)*M,t[8]=(a*e-n*r)*M,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return os("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(tc.makeScale(t,e)),this}rotate(t){return os("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(tc.makeRotation(-t)),this}translate(t,e){return os("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(tc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};lh.prototype.isMatrix3=!0;var jt=lh,tc=new jt,_u=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),vu=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mp(){let i={enabled:!0,workingColorSpace:Tr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ye&&(s.r=Si(s.r),s.g=Si(s.g),s.b=Si(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ye&&(s.r=Hs(s.r),s.g=Hs(s.g),s.b=Hs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ti?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return os("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return os("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Tr]:{primaries:t,whitePoint:n,transfer:Ar,toXYZ:_u,fromXYZ:vu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Fe},outputColorSpaceConfig:{drawingBufferColorSpace:Fe}},[Fe]:{primaries:t,whitePoint:n,transfer:ye,toXYZ:_u,fromXYZ:vu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Fe}}}),i}var le=Mp();function Si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Hs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var As,lo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{As===void 0&&(As=Rr("canvas")),As.width=t.width,As.height=t.height;let s=As.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=As}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Rr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Si(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Si(e[n]/255)*255):e[n]=Si(e[n]);return{data:e,width:t.width,height:t.height}}else return Wt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Sp=0,Xs=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=rr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ec(s[a].image)):r.push(ec(s[a]))}else r=ec(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ec(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?lo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Wt("Texture: Unable to serialize Texture."),{})}var bp=0,nc=new L,un=class i extends ai{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=si,s=si,r=Qe,a=$i,o=Dn,l=_n,c=i.DEFAULT_ANISOTROPY,h=Ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=rr(),this.name="",this.source=new Xs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nc).x}get height(){return this.source.getSize(nc).y}get depth(){return this.source.getSize(nc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Wt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Wt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==qc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case bi:t.x=t.x-Math.floor(t.x);break;case si:t.x=t.x<0?0:1;break;case ro:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case bi:t.y=t.y-Math.floor(t.y);break;case si:t.y=t.y<0?0:1;break;case ro:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=qc;un.DEFAULT_ANISOTROPY=1;var ch=class ch{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],M=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-M)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+M)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let b=(c+1)/2,x=(f+1)/2,S=(m+1)/2,v=(h+u)/4,A=(d+M)/4,_=(g+p)/4;return b>x&&b>S?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=v/n,r=A/n):x>S?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=v/s,r=_/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=A/r,s=_/r),this.set(n,s,r,e),this}let T=Math.sqrt((p-g)*(p-g)+(d-M)*(d-M)+(u-h)*(u-h));return Math.abs(T)<.001&&(T=1),this.x=(p-g)/T,this.y=(d-M)/T,this.z=(u-h)/T,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this.z=se(this.z,t.z,e.z),this.w=se(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this.z=se(this.z,t,e),this.w=se(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ch.prototype.isVector4=!0;var De=ch,co=class extends ai{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new De(0,0,t,e),this.scissorTest=!1,this.viewport=new De(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new un(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Xs(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},mn=class extends co{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Cr=class extends un{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=si,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var ho=class extends un{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=si,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var No=class No{constructor(t,e,n,s,r,a,o,l,c,h,d,u,f,g,M,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,u,f,g,M,p)}set(t,e,n,s,r,a,o,l,c,h,d,u,f,g,M,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=M,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new No().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Rs.setFromMatrixColumn(t,0).length(),r=1/Rs.setFromMatrixColumn(t,1).length(),a=1/Rs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=a*h,f=a*d,g=o*h,M=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-M*c,e[9]=-o*l,e[2]=M-u*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,g=c*h,M=c*d;e[0]=u+M*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=M+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,g=c*h,M=c*d;e[0]=u-M*o,e[4]=-a*d,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=M-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,f=a*d,g=o*h,M=o*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+M,e[1]=l*d,e[5]=M*c+u,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,f=a*c,g=o*l,M=o*c;e[0]=l*h,e[4]=M-u*d,e[8]=g*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-M*d}else if(t.order==="XZY"){let u=a*l,f=a*c,g=o*l,M=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+M,e[5]=a*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=o*h,e[10]=M*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(wp,t,Ep)}lookAt(t,e,n){let s=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Fi.crossVectors(n,Mn),Fi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Fi.crossVectors(n,Mn)),Fi.normalize(),Ta.crossVectors(Mn,Fi),s[0]=Fi.x,s[4]=Ta.x,s[8]=Mn.x,s[1]=Fi.y,s[5]=Ta.y,s[9]=Mn.y,s[2]=Fi.z,s[6]=Ta.z,s[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],M=n[6],p=n[10],m=n[14],T=n[3],b=n[7],x=n[11],S=n[15],v=s[0],A=s[4],_=s[8],E=s[12],C=s[1],P=s[5],N=s[9],H=s[13],D=s[2],k=s[6],Y=s[10],q=s[14],K=s[3],B=s[7],X=s[11],I=s[15];return r[0]=a*v+o*C+l*D+c*K,r[4]=a*A+o*P+l*k+c*B,r[8]=a*_+o*N+l*Y+c*X,r[12]=a*E+o*H+l*q+c*I,r[1]=h*v+d*C+u*D+f*K,r[5]=h*A+d*P+u*k+f*B,r[9]=h*_+d*N+u*Y+f*X,r[13]=h*E+d*H+u*q+f*I,r[2]=g*v+M*C+p*D+m*K,r[6]=g*A+M*P+p*k+m*B,r[10]=g*_+M*N+p*Y+m*X,r[14]=g*E+M*H+p*q+m*I,r[3]=T*v+b*C+x*D+S*K,r[7]=T*A+b*P+x*k+S*B,r[11]=T*_+b*N+x*Y+S*X,r[15]=T*E+b*H+x*q+S*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],M=t[7],p=t[11],m=t[15],T=l*f-c*u,b=o*f-c*d,x=o*u-l*d,S=a*f-c*h,v=a*u-l*h,A=a*d-o*h;return e*(M*T-p*b+m*x)-n*(g*T-p*S+m*v)+s*(g*b-M*S+m*A)-r*(g*x-M*v+p*A)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],M=t[13],p=t[14],m=t[15],T=e*o-n*a,b=e*l-s*a,x=e*c-r*a,S=n*l-s*o,v=n*c-r*o,A=s*c-r*l,_=h*M-d*g,E=h*p-u*g,C=h*m-f*g,P=d*p-u*M,N=d*m-f*M,H=u*m-f*p,D=T*H-b*N+x*P+S*C-v*E+A*_;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/D;return t[0]=(o*H-l*N+c*P)*k,t[1]=(s*N-n*H-r*P)*k,t[2]=(M*A-p*v+m*S)*k,t[3]=(u*v-d*A-f*S)*k,t[4]=(l*C-a*H-c*E)*k,t[5]=(e*H-s*C+r*E)*k,t[6]=(p*x-g*A-m*b)*k,t[7]=(h*A-u*x+f*b)*k,t[8]=(a*N-o*C+c*_)*k,t[9]=(n*C-e*N-r*_)*k,t[10]=(g*v-M*x+m*T)*k,t[11]=(d*x-h*v-f*T)*k,t[12]=(o*E-a*P-l*_)*k,t[13]=(e*P-n*E+s*_)*k,t[14]=(M*b-g*S-p*T)*k,t[15]=(h*S-d*b+u*T)*k,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,g=r*d,M=a*h,p=a*d,m=o*d,T=l*c,b=l*h,x=l*d,S=n.x,v=n.y,A=n.z;return s[0]=(1-(M+m))*S,s[1]=(f+x)*S,s[2]=(g-b)*S,s[3]=0,s[4]=(f-x)*v,s[5]=(1-(u+m))*v,s[6]=(p+T)*v,s[7]=0,s[8]=(g+b)*A,s[9]=(p-T)*A,s[10]=(1-(u+M))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Rs.set(s[0],s[1],s[2]).length(),o=Rs.set(s[4],s[5],s[6]).length(),l=Rs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),kn.copy(this);let c=1/a,h=1/o,d=1/l;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=d,kn.elements[9]*=d,kn.elements[10]*=d,e.setFromRotationMatrix(kn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=Wn,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s),g,M;if(l)g=r/(a-r),M=a*r/(a-r);else if(o===Wn)g=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===Vs)g=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Wn,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s),g,M;if(l)g=1/(a-r),M=a/(a-r);else if(o===Wn)g=-2/(a-r),M=-(a+r)/(a-r);else if(o===Vs)g=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};No.prototype.isMatrix4=!0;var me=No,Rs=new L,kn=new me,wp=new L(0,0,0),Ep=new L(1,1,1),Fi=new L,Ta=new L,Mn=new L,yu=new me,Mu=new bn,wn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(se(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-se(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(se(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Wt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return yu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Mu.setFromEuler(this),this.setFromQuaternion(Mu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};wn.DEFAULT_ORDER="XYZ";var Ir=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Tp=0,Su=new L,Cs=new bn,xi=new me,Aa=new L,gr=new L,Ap=new L,Rp=new bn,bu=new L(1,0,0),wu=new L(0,1,0),Eu=new L(0,0,1),Tu={type:"added"},Cp={type:"removed"},Is={type:"childadded",child:null},ic={type:"childremoved",child:null},tn=class i extends ai{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tp++}),this.uuid=rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new L,e=new wn,n=new bn,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new jt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ir,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.premultiply(Cs),this}rotateX(t){return this.rotateOnAxis(bu,t)}rotateY(t){return this.rotateOnAxis(wu,t)}rotateZ(t){return this.rotateOnAxis(Eu,t)}translateOnAxis(t,e){return Su.copy(t).applyQuaternion(this.quaternion),this.position.add(Su.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bu,t)}translateY(t){return this.translateOnAxis(wu,t)}translateZ(t){return this.translateOnAxis(Eu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Aa.copy(t):Aa.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(gr,Aa,this.up):xi.lookAt(Aa,gr,this.up),this.quaternion.setFromRotationMatrix(xi),s&&(xi.extractRotation(s.matrixWorld),Cs.setFromRotationMatrix(xi),this.quaternion.premultiply(Cs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Yt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Tu),Is.child=t,this.dispatchEvent(Is),Is.child=null):Yt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Cp),ic.child=t,this.dispatchEvent(ic),ic.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xi.multiply(t.parent.matrixWorld)),t.applyMatrix4(xi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Tu),Is.child=t,this.dispatchEvent(Is),Is.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gr,t,Ap),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gr,Rp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};tn.DEFAULT_UP=new L(0,1,0);tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ve=class extends tn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ip={type:"move"},qs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ve,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ve,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ve,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let M of t.hand.values()){let p=e.getJointPose(M,n),m=this._getHandJoint(c,M);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ip)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new ve;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Oi={h:0,s:0,l:0},Ra={h:0,s:0,l:0};function sc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var $t=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=yp(t,1),e=se(e,0,1),n=se(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=sc(a,r,t+1/3),this.g=sc(a,r,t),this.b=sc(a,r,t-1/3)}return le.colorSpaceToWorking(this,s),this}setStyle(t,e=Fe){function n(r){r!==void 0&&parseFloat(r)<1&&Wt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Wt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Wt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fe){let n=Pd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Wt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Si(t.r),this.g=Si(t.g),this.b=Si(t.b),this}copyLinearToSRGB(t){return this.r=Hs(t.r),this.g=Hs(t.g),this.b=Hs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fe){return le.workingToColorSpace(an.copy(this),t),Math.round(se(an.r*255,0,255))*65536+Math.round(se(an.g*255,0,255))*256+Math.round(se(an.b*255,0,255))}getHexString(t=Fe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.workingToColorSpace(an.copy(this),e);let n=an.r,s=an.g,r=an.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.workingToColorSpace(an.copy(this),e),t.r=an.r,t.g=an.g,t.b=an.b,t}getStyle(t=Fe){le.workingToColorSpace(an.copy(this),t);let e=an.r,n=an.g,s=an.b;return t!==Fe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Oi),this.setHSL(Oi.h+t,Oi.s+e,Oi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Oi),t.getHSL(Ra);let n=jl(Oi.h,Ra.h,e),s=jl(Oi.s,Ra.s,e),r=jl(Oi.l,Ra.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},an=new $t;$t.NAMES=Pd;var Pr=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new $t(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ys=class extends tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wn,this.environmentIntensity=1,this.environmentRotation=new wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Hn=new L,_i=new L,rc=new L,vi=new L,Ps=new L,Ls=new L,Au=new L,ac=new L,oc=new L,lc=new L,cc=new De,hc=new De,uc=new De,Hi=class i{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Hn.subVectors(t,e),s.cross(Hn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Hn.subVectors(s,e),_i.subVectors(n,e),rc.subVectors(t,e);let a=Hn.dot(Hn),o=Hn.dot(_i),l=Hn.dot(rc),c=_i.dot(_i),h=_i.dot(rc),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vi.x),l.addScaledVector(a,vi.y),l.addScaledVector(o,vi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return cc.setScalar(0),hc.setScalar(0),uc.setScalar(0),cc.fromBufferAttribute(t,e),hc.fromBufferAttribute(t,n),uc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(cc,r.x),a.addScaledVector(hc,r.y),a.addScaledVector(uc,r.z),a}static isFrontFacing(t,e,n,s){return Hn.subVectors(n,e),_i.subVectors(t,e),Hn.cross(_i).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Hn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Hn.cross(_i).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;Ps.subVectors(s,n),Ls.subVectors(r,n),ac.subVectors(t,n);let l=Ps.dot(ac),c=Ls.dot(ac);if(l<=0&&c<=0)return e.copy(n);oc.subVectors(t,s);let h=Ps.dot(oc),d=Ls.dot(oc);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ps,a);lc.subVectors(t,r);let f=Ps.dot(lc),g=Ls.dot(lc);if(g>=0&&f<=g)return e.copy(r);let M=f*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Ls,o);let p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return Au.subVectors(r,s),o=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(Au,o);let m=1/(p+M+u);return a=M*m,o=u*m,e.copy(n).addScaledVector(Ps,a).addScaledVector(Ls,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},oi=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Gn):Gn.fromBufferAttribute(r,a),Gn.applyMatrix4(t.matrixWorld),this.expandByPoint(Gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ca.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ca.copy(n.boundingBox)),Ca.applyMatrix4(t.matrixWorld),this.union(Ca)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Gn),Gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xr),Ia.subVectors(this.max,xr),Ds.subVectors(t.a,xr),Ns.subVectors(t.b,xr),Us.subVectors(t.c,xr),Bi.subVectors(Ns,Ds),zi.subVectors(Us,Ns),ns.subVectors(Ds,Us);let e=[0,-Bi.z,Bi.y,0,-zi.z,zi.y,0,-ns.z,ns.y,Bi.z,0,-Bi.x,zi.z,0,-zi.x,ns.z,0,-ns.x,-Bi.y,Bi.x,0,-zi.y,zi.x,0,-ns.y,ns.x,0];return!dc(e,Ds,Ns,Us,Ia)||(e=[1,0,0,0,1,0,0,0,1],!dc(e,Ds,Ns,Us,Ia))?!1:(Pa.crossVectors(Bi,zi),e=[Pa.x,Pa.y,Pa.z],dc(e,Ds,Ns,Us,Ia))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(yi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},yi=[new L,new L,new L,new L,new L,new L,new L,new L],Gn=new L,Ca=new oi,Ds=new L,Ns=new L,Us=new L,Bi=new L,zi=new L,ns=new L,xr=new L,Ia=new L,Pa=new L,is=new L;function dc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){is.fromArray(i,r);let o=s.x*Math.abs(is.x)+s.y*Math.abs(is.y)+s.z*Math.abs(is.z),l=t.dot(is),c=e.dot(is),h=n.dot(is);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Ge=new L,La=new ht,Pp=0,Ae=class extends ai{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Td,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)La.fromBufferAttribute(this,e),La.applyMatrix3(t),this.setXY(e,La.x,La.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyMatrix3(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyMatrix4(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyNormalMatrix(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.transformDirection(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=mr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=pn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mr(e,this.array)),e}setX(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mr(e,this.array)),e}setY(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mr(e,this.array)),e}setW(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=pn(e,this.array),n=pn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=pn(e,this.array),n=pn(n,this.array),s=pn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=pn(e,this.array),n=pn(n,this.array),s=pn(s,this.array),r=pn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Lr=class extends Ae{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Dr=class extends Ae{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var oe=class extends Ae{constructor(t,e,n){super(new Float32Array(t),e,n)}},Lp=new oi,_r=new L,fc=new L,wi=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Lp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_r.subVectors(t,this.center);let e=_r.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(_r,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_r.copy(t.center).add(fc)),this.expandByPoint(_r.copy(t.center).sub(fc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Dp=0,Cn=new me,pc=new tn,Fs=new L,Sn=new oi,vr=new oi,$e=new L,Re=class i extends ai{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_p(t)?Dr:Lr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Cn.makeRotationFromQuaternion(t),this.applyMatrix4(Cn),this}rotateX(t){return Cn.makeRotationX(t),this.applyMatrix4(Cn),this}rotateY(t){return Cn.makeRotationY(t),this.applyMatrix4(Cn),this}rotateZ(t){return Cn.makeRotationZ(t),this.applyMatrix4(Cn),this}translate(t,e,n){return Cn.makeTranslation(t,e,n),this.applyMatrix4(Cn),this}scale(t,e,n){return Cn.makeScale(t,e,n),this.applyMatrix4(Cn),this}lookAt(t){return pc.lookAt(t),pc.updateMatrix(),this.applyMatrix4(pc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Wt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new oi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Yt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?($e.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint($e),$e.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint($e)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Yt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Yt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];vr.setFromBufferAttribute(o),this.morphTargetsRelative?($e.addVectors(Sn.min,vr.min),Sn.expandByPoint($e),$e.addVectors(Sn.max,vr.max),Sn.expandByPoint($e)):(Sn.expandByPoint(vr.min),Sn.expandByPoint(vr.max))}Sn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)$e.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared($e));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)$e.fromBufferAttribute(o,c),l&&(Fs.fromBufferAttribute(t,c),$e.add(Fs)),s=Math.max(s,n.distanceToSquared($e))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Yt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Yt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ae(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new L,l[_]=new L;let c=new L,h=new L,d=new L,u=new ht,f=new ht,g=new ht,M=new L,p=new L;function m(_,E,C){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,C),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,C),h.sub(c),d.sub(c),f.sub(u),g.sub(u);let P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(P),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(P),o[_].add(M),o[E].add(M),o[C].add(M),l[_].add(p),l[E].add(p),l[C].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let _=0,E=T.length;_<E;++_){let C=T[_],P=C.start,N=C.count;for(let H=P,D=P+N;H<D;H+=3)m(t.getX(H+0),t.getX(H+1),t.getX(H+2))}let b=new L,x=new L,S=new L,v=new L;function A(_){S.fromBufferAttribute(s,_),v.copy(S);let E=o[_];b.copy(E),b.sub(S.multiplyScalar(S.dot(E))).normalize(),x.crossVectors(v,E);let P=x.dot(l[_])<0?-1:1;a.setXYZW(_,b.x,b.y,b.z,P)}for(let _=0,E=T.length;_<E;++_){let C=T[_],P=C.start,N=C.count;for(let H=P,D=P+N;H<D;H+=3)A(t.getX(H+0)),A(t.getX(H+1)),A(t.getX(H+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ae(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,d=new L;if(t)for(let u=0,f=t.count;u<f;u+=3){let g=t.getX(u+0),M=t.getX(u+1),p=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,M),a.fromBufferAttribute(e,p),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)$e.fromBufferAttribute(t,e),$e.normalize(),t.setXYZ(e,$e.x,$e.y,$e.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),f=0,g=0;for(let M=0,p=l.length;M<p;M++){o.isInterleavedBufferAttribute?f=l[M]*o.data.stride+o.offset:f=l[M]*h;for(let m=0;m<h;m++)u[g++]=c[f++]}return new Ae(u,h,d)}if(this.index===null)return Wt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var mc=new L,Np=new L,Up=new jt,Vn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=mc.subVectors(n,e).cross(Np.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(mc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Up.getNormalMatrix(t),s=this.coplanarPoint(mc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Fp=0,li=class extends ai{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=rr(),this.name="",this.type="Material",this.blending=nr,this.side=Yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Bc,this.blendDst=zc,this.blendEquation=gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ka,this.stencilZFail=Ka,this.stencilZPass=Ka,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Wt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Wt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new $t().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Vn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ht().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ht().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Mi=new L,gc=new L,Da=new L,Na=new L,Nr=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Mi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mi.copy(this.origin).addScaledVector(this.direction,e),Mi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){gc.copy(t).add(e).multiplyScalar(.5),Da.copy(e).sub(t).normalize(),Na.copy(this.origin).sub(gc);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Da),o=Na.dot(this.direction),l=-Na.dot(Da),c=Na.lengthSq(),h=Math.abs(1-a*a),d,u,f,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let M=1/h;d*=M,u*=M,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(gc).addScaledVector(Da,u),f}intersectSphere(t,e){if(t.radius<0)return null;Mi.subVectors(t.center,this.origin);let n=Mi.dot(this.direction),s=Mi.dot(Mi)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Mi)!==null}intersectTriangle(t,e,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,g=e.x-a.x,M=e.y-a.y,p=e.z-a.z,m=n.x-a.x,T=n.y-a.y,b=n.z-a.z,x=Math.abs(l),S=Math.abs(c),v=Math.abs(h),A,_,E,C,P,N,H,D,k,Y,q,K;if(x>=S&&x>=v?(E=l,N=d,k=g,K=m,l>=0?(A=c,_=h,C=u,P=f,H=M,D=p,Y=T,q=b):(A=h,_=c,C=f,P=u,H=p,D=M,Y=b,q=T)):S>=v?(E=c,N=u,k=M,K=T,c>=0?(A=h,_=l,C=f,P=d,H=p,D=g,Y=b,q=m):(A=l,_=h,C=d,P=f,H=g,D=p,Y=m,q=b)):(E=h,N=f,k=p,K=b,h>=0?(A=l,_=c,C=d,P=u,H=g,D=M,Y=m,q=T):(A=c,_=l,C=u,P=d,H=M,D=g,Y=T,q=m)),E===0)return null;let B=A/E,X=_/E,I=1/E,rt=C-B*N,lt=P-X*N,mt=H-B*k,Ct=D-X*k,W=Y-B*K,F=q-X*K,G=W*Ct-F*mt,it=rt*F-lt*W,ft=mt*lt-Ct*rt;if(s){if(G<0||it<0||ft<0)return null}else if((G<0||it<0||ft<0)&&(G>0||it>0||ft>0))return null;let ct=G+it+ft;if(ct===0)return null;let xt=I*(G*N+it*k+ft*K);return(ct>0?xt<0:xt>0)?null:this.at(xt/ct,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Xn=class extends li{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=Uo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Ru=new me,ss=new Nr,Ua=new wi,Cu=new L,Fa=new L,Oa=new L,Ba=new L,xc=new L,za=new L,Iu=new L,ka=new L,Kt=class extends tn{constructor(t=new Re,e=new Xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){za.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(xc.fromBufferAttribute(d,t),a?za.addScaledVector(xc,h):za.addScaledVector(xc.sub(e),h))}e.add(za)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(r),ss.copy(t.ray).recast(t.near),!(Ua.containsPoint(ss.origin)===!1&&(ss.intersectSphere(Ua,Cu)===null||ss.origin.distanceToSquared(Cu)>(t.far-t.near)**2))&&(Ru.copy(r).invert(),ss.copy(t.ray).applyMatrix4(Ru),!(n.boundingBox!==null&&ss.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ss)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=u.length;g<M;g++){let p=u[g],m=a[p.materialIndex],T=Math.max(p.start,f.start),b=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let x=T,S=b;x<S;x+=3){let v=o.getX(x),A=o.getX(x+1),_=o.getX(x+2);s=Ha(this,m,t,n,c,h,d,v,A,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),M=Math.min(o.count,f.start+f.count);for(let p=g,m=M;p<m;p+=3){let T=o.getX(p),b=o.getX(p+1),x=o.getX(p+2);s=Ha(this,a,t,n,c,h,d,T,b,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,M=u.length;g<M;g++){let p=u[g],m=a[p.materialIndex],T=Math.max(p.start,f.start),b=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let x=T,S=b;x<S;x+=3){let v=x,A=x+1,_=x+2;s=Ha(this,m,t,n,c,h,d,v,A,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),M=Math.min(l.count,f.start+f.count);for(let p=g,m=M;p<m;p+=3){let T=p,b=p+1,x=p+2;s=Ha(this,a,t,n,c,h,d,T,b,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function Op(i,t,e,n,s,r,a,o){let l;if(t.side===en?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Yi,o),l===null)return null;ka.copy(o),ka.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(ka);return c<e.near||c>e.far?null:{distance:c,point:ka.clone(),object:i}}function Ha(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Fa),i.getVertexPosition(l,Oa),i.getVertexPosition(c,Ba);let h=Op(i,t,e,n,Fa,Oa,Ba,Iu);if(h){let d=new L;Hi.getBarycoord(Iu,Fa,Oa,Ba,d),s&&(h.uv=Hi.getInterpolatedAttribute(s,o,l,c,d,new ht)),r&&(h.uv1=Hi.getInterpolatedAttribute(r,o,l,c,d,new ht)),a&&(h.normal=Hi.getInterpolatedAttribute(a,o,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new L,materialIndex:0};Hi.getNormal(Fa,Oa,Ba,u.normal),h.face=u,h.barycoord=d}return h}var Ur=class extends un{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Je,h=Je,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zs=class extends Ae{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Os=new me,Pu=new me,Ga=[],Lu=new oi,Bp=new me,yr=new Kt,Mr=new wi,ls=class extends Kt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Zs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Bp)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new oi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Os),Lu.copy(t.boundingBox).applyMatrix4(Os),this.boundingBox.union(Lu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new wi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Os),Mr.copy(t.boundingSphere).applyMatrix4(Os),this.boundingSphere.union(Mr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(yr.geometry=this.geometry,yr.material=this.material,yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Mr.copy(this.boundingSphere),Mr.applyMatrix4(n),t.ray.intersectsSphere(Mr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Os),Pu.multiplyMatrices(n,Os),yr.matrixWorld=Pu,yr.raycast(t,Ga);for(let a=0,o=Ga.length;a<o;a++){let l=Ga[a];l.instanceId=r,l.object=this,e.push(l)}Ga.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Zs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ur(new Float32Array(s*this.count),s,this.count,Go,Ln));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},rs=new wi,zp=new ht(.5,.5),Va=new L,$s=class{constructor(t=new Vn,e=new Vn,n=new Vn,s=new Vn,r=new Vn,a=new Vn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Wn,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],M=r[9],p=r[10],m=r[11],T=r[12],b=r[13],x=r[14],S=r[15];if(s[0].setComponents(c-a,f-h,m-g,S-T).normalize(),s[1].setComponents(c+a,f+h,m+g,S+T).normalize(),s[2].setComponents(c+o,f+d,m+M,S+b).normalize(),s[3].setComponents(c-o,f-d,m-M,S-b).normalize(),n)s[4].setComponents(l,u,p,x).normalize(),s[5].setComponents(c-l,f-u,m-p,S-x).normalize();else if(s[4].setComponents(c-l,f-u,m-p,S-x).normalize(),e===Wn)s[5].setComponents(c+l,f+u,m+p,S+x).normalize();else if(e===Vs)s[5].setComponents(l,u,p,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),rs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),rs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(rs)}intersectsSprite(t){rs.center.set(0,0,0);let e=zp.distanceTo(t.center);return rs.radius=.7071067811865476+e,rs.applyMatrix4(t.matrixWorld),this.intersectsSphere(rs)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Va.x=s.normal.x>0?t.max.x:t.min.x,Va.y=s.normal.y>0?t.max.y:t.min.y,Va.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Va)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Js=class extends li{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Du=new me,Ac=new Nr,Wa=new wi,Xa=new L,Ks=class extends tn{constructor(t=new Re,e=new Js){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wa.copy(n.boundingSphere),Wa.applyMatrix4(s),Wa.radius+=r,t.ray.intersectsSphere(Wa)===!1)return;Du.copy(s).invert(),Ac.copy(t.ray).applyMatrix4(Du);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=u,M=f;g<M;g++){let p=c.getX(g);Xa.fromBufferAttribute(d,p),Nu(Xa,p,l,s,t,e,this)}}else{let u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,M=f;g<M;g++)Xa.fromBufferAttribute(d,g),Nu(Xa,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Nu(i,t,e,n,s,r,a){let o=Ac.distanceSqToPoint(i);if(o<e){let l=new L;Ac.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var Fr=class extends un{constructor(t=[],e=Zi,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},qn=class extends un{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Gi=class extends un{constructor(t,e,n=$n,s,r,a,o=Je,l=Je,c,h=ri,d=1){if(h!==ri&&h!==Ji)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Xs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},uo=class extends Gi{constructor(t,e=$n,n=Zi,s,r,a=Je,o=Je,l,c=ri){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Or=class extends un{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},In=class i extends Re{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(d,2));function g(M,p,m,T,b,x,S,v,A,_,E){let C=x/A,P=S/_,N=x/2,H=S/2,D=v/2,k=A+1,Y=_+1,q=0,K=0,B=new L;for(let X=0;X<Y;X++){let I=X*P-H;for(let rt=0;rt<k;rt++){let lt=rt*C-N;B[M]=lt*T,B[p]=I*b,B[m]=D,c.push(B.x,B.y,B.z),B[M]=0,B[p]=0,B[m]=v>0?1:-1,h.push(B.x,B.y,B.z),d.push(rt/A),d.push(1-X/_),q+=1}}for(let X=0;X<_;X++)for(let I=0;I<A;I++){let rt=u+I+k*X,lt=u+I+k*(X+1),mt=u+(I+1)+k*(X+1),Ct=u+(I+1)+k*X;l.push(rt,lt,Ct),l.push(lt,mt,Ct),K+=6}o.addGroup(f,K,E),f+=K,u+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var js=class i extends Re{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],c=new L,h=new ht;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){let f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(o,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},he=class i extends Re{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],g=0,M=[],p=n/2,m=0;T(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new oe(d,3)),this.setAttribute("normal",new oe(u,3)),this.setAttribute("uv",new oe(f,2));function T(){let x=new L,S=new L,v=0,A=(e-t)/n;for(let _=0;_<=r;_++){let E=[],C=_/r,P=C*(e-t)+t;for(let N=0;N<=s;N++){let H=N/s,D=H*l+o,k=Math.sin(D),Y=Math.cos(D);S.x=P*k,S.y=-C*n+p,S.z=P*Y,d.push(S.x,S.y,S.z),x.set(k,A,Y).normalize(),u.push(x.x,x.y,x.z),f.push(H,1-C),E.push(g++)}M.push(E)}for(let _=0;_<s;_++)for(let E=0;E<r;E++){let C=M[E][_],P=M[E+1][_],N=M[E+1][_+1],H=M[E][_+1];(t>0||E!==0)&&(h.push(C,P,H),v+=3),(e>0||E!==r-1)&&(h.push(P,N,H),v+=3)}c.addGroup(m,v,0),m+=v}function b(x){let S=g,v=new ht,A=new L,_=0,E=x===!0?t:e,C=x===!0?1:-1;for(let N=1;N<=s;N++)d.push(0,p*C,0),u.push(0,C,0),f.push(.5,.5),g++;let P=g;for(let N=0;N<=s;N++){let D=N/s*l+o,k=Math.cos(D),Y=Math.sin(D);A.x=E*Y,A.y=p*C,A.z=E*k,d.push(A.x,A.y,A.z),u.push(0,C,0),v.x=k*.5+.5,v.y=Y*.5*C+.5,f.push(v.x,v.y),g++}for(let N=0;N<s;N++){let H=S+N,D=P+N;x===!0?h.push(D,D+1,H):h.push(D+1,D,H),_+=3}c.addGroup(m,_,x===!0?1:2),m+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},cs=class i extends he{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var En=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Wt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ht:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,s=[],r=[],a=[],o=new L,l=new me;for(let f=0;f<=t;f++){let g=f/t;s[f]=this.getTangentAt(g,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(se(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(se(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Ei=class extends En{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ht){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},fo=class extends Ei{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function eh(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Uu=new L,Fu=new L,_c=new eh,vc=new eh,yc=new eh,hs=class extends En{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Fu.subVectors(s[0],s[1]).add(s[0]),c=Fu);let d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Uu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Uu),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),M=Math.pow(d.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(h),f);M<1e-4&&(M=1),g<1e-4&&(g=M),p<1e-4&&(p=M),_c.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,M,p),vc.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,M,p),yc.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,M,p)}else this.curveType==="catmullrom"&&(_c.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),vc.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),yc.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(_c.calc(l),vc.calc(l),yc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Ou(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function kp(i,t){let e=1-i;return e*e*t}function Hp(i,t){return 2*(1-i)*i*t}function Gp(i,t){return i*i*t}function br(i,t,e,n){return kp(i,t)+Hp(i,e)+Gp(i,n)}function Vp(i,t){let e=1-i;return e*e*e*t}function Wp(i,t){let e=1-i;return 3*e*e*i*t}function Xp(i,t){return 3*(1-i)*i*i*t}function qp(i,t){return i*i*i*t}function wr(i,t,e,n,s){return Vp(i,t)+Wp(i,e)+Xp(i,n)+qp(i,s)}var Br=class extends En{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(wr(t,s.x,r.x,a.x,o.x),wr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},po=class extends En{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(wr(t,s.x,r.x,a.x,o.x),wr(t,s.y,r.y,a.y,o.y),wr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},zr=class extends En{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},mo=class extends En{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},kr=class extends En{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(br(t,s.x,r.x,a.x),br(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},us=class extends En{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(br(t,s.x,r.x,a.x),br(t,s.y,r.y,a.y),br(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Hr=class extends En{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Ou(o,l.x,c.x,h.x,d.x),Ou(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ht().fromArray(s))}return this}},go=Object.freeze({__proto__:null,ArcCurve:fo,CatmullRomCurve3:hs,CubicBezierCurve:Br,CubicBezierCurve3:po,EllipseCurve:Ei,LineCurve:zr,LineCurve3:mo,QuadraticBezierCurve:kr,QuadraticBezierCurve3:us,SplineCurve:Hr}),xo=class extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new go[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new go[s.type]().fromJSON(s))}return this}},Gr=class extends xo{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new zr(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new kr(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new Br(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Hr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){let c=new Ei(t,e,n,s,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Yn=class extends Gr{constructor(t){super(t),this.uuid=rr(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Gr().fromJSON(s))}return this}};function Yp(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Ld(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=jp(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let h=o,d=l;for(let u=e;u<s;u+=e){let f=i[u],g=i[u+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Vr(r,a,e,o,l,c,0),a}function Ld(i,t,e,n,s){let r;if(s===cm(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Bu(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Bu(a/n|0,i[a],i[a+1],r);return r&&Qs(r,r.next)&&(Xr(r),r=r.next),r}function ds(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Qs(e,e.next)||Ne(e.prev,e,e.next)===0)){if(Xr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Vr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&im(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?$p(i,n,s,r):Zp(i)){t.push(l.i,i.i,c.i),Xr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Jp(ds(i),t),Vr(i,t,e,n,s,r,2)):a===2&&Kp(i,t,e,n,s,r):Vr(ds(i),t,e,n,s,r,1);break}}}function Zp(i){let t=i.prev,e=i,n=i.next;if(Ne(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),u=Math.max(s,r,a),f=Math.max(o,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Sr(s,o,r,l,a,c,g.x,g.y)&&Ne(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function $p(i,t,e,n){let s=i.prev,r=i,a=i.next;if(Ne(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=Math.min(o,l,c),g=Math.min(h,d,u),M=Math.max(o,l,c),p=Math.max(h,d,u),m=Rc(f,g,t,e,n),T=Rc(M,p,t,e,n),b=i.prevZ,x=i.nextZ;for(;b&&b.z>=m&&x&&x.z<=T;){if(b.x>=f&&b.x<=M&&b.y>=g&&b.y<=p&&b!==s&&b!==a&&Sr(o,h,l,d,c,u,b.x,b.y)&&Ne(b.prev,b,b.next)>=0||(b=b.prevZ,x.x>=f&&x.x<=M&&x.y>=g&&x.y<=p&&x!==s&&x!==a&&Sr(o,h,l,d,c,u,x.x,x.y)&&Ne(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;b&&b.z>=m;){if(b.x>=f&&b.x<=M&&b.y>=g&&b.y<=p&&b!==s&&b!==a&&Sr(o,h,l,d,c,u,b.x,b.y)&&Ne(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;x&&x.z<=T;){if(x.x>=f&&x.x<=M&&x.y>=g&&x.y<=p&&x!==s&&x!==a&&Sr(o,h,l,d,c,u,x.x,x.y)&&Ne(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Jp(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Qs(n,s)&&Nd(n,e,e.next,s)&&Wr(n,s)&&Wr(s,n)&&(t.push(n.i,e.i,s.i),Xr(e),Xr(e.next),e=i=s),e=e.next}while(e!==i);return ds(e)}function Kp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&am(a,o)){let l=Ud(a,o);a=ds(a,a.next),l=ds(l,l.next),Vr(a,t,e,n,s,r,0),Vr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function jp(i,t,e,n){let s=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Ld(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(rm(c))}s.sort(Qp);for(let r=0;r<s.length;r++)e=tm(s[r],e);return e}function Qp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function tm(i,t){let e=em(i,t);if(!e)return t;let n=Ud(e,i);return ds(n,n.next),ds(e,e.next)}function em(i,t){let e=t,n=i.x,s=i.y,r=-1/0,a;if(Qs(i,e))return e;do{if(Qs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Dd(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);Wr(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&nm(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function nm(i,t){return Ne(i.prev,i,t.prev)<0&&Ne(t.next,i,i.next)<0}function im(i,t,e,n){let s=i;do s.z===0&&(s.z=Rc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,sm(s)}function sm(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Rc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function rm(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Dd(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Sr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Dd(i,t,e,n,s,r,a,o)}function am(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!om(i,t)&&(Wr(i,t)&&Wr(t,i)&&lm(i,t)&&(Ne(i.prev,i,t.prev)||Ne(i,t.prev,t))||Qs(i,t)&&Ne(i.prev,i,i.next)>0&&Ne(t.prev,t,t.next)>0)}function Ne(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Qs(i,t){return i.x===t.x&&i.y===t.y}function Nd(i,t,e,n){let s=Ya(Ne(i,t,e)),r=Ya(Ne(i,t,n)),a=Ya(Ne(e,n,i)),o=Ya(Ne(e,n,t));return!!(s!==r&&a!==o||s===0&&qa(i,e,t)||r===0&&qa(i,n,t)||a===0&&qa(e,i,n)||o===0&&qa(e,t,n))}function qa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ya(i){return i>0?1:i<0?-1:0}function om(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Nd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Wr(i,t){return Ne(i.prev,i,i.next)<0?Ne(i,t,i.next)>=0&&Ne(i,i.prev,t)>=0:Ne(i,t,i.prev)<0||Ne(i,i.next,t)<0}function lm(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Ud(i,t){let e=Cc(i.i,i.x,i.y),n=Cc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Bu(i,t,e,n){let s=Cc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Xr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Cc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function cm(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Ic=class{static triangulate(t,e,n=2){return Yp(t,e,n)}},as=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];zu(t),ku(n,t);let a=t.length;e.forEach(zu);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,ku(n,e[l]);let o=Ic.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function zu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function ku(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var fs=class i extends Re{constructor(t=new Yn([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new oe(s,3)),this.setAttribute("uv",new oe(r,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,M=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:hm,b,x=!1,S,v,A,_;if(m){b=m.getSpacedPoints(h),x=!0,u=!1;let Q=m.isCatmullRomCurve3?m.closed:!1;S=m.computeFrenetFrames(h,Q),v=new L,A=new L,_=new L}u||(p=0,f=0,g=0,M=0);let E=o.extractPoints(c),C=E.shape,P=E.holes;if(!as.isClockWise(C)){C=C.reverse();for(let Q=0,at=P.length;Q<at;Q++){let ut=P[Q];as.isClockWise(ut)&&(P[Q]=ut.reverse())}}function H(Q){let ut=10000000000000001e-36,dt=Q[0];for(let vt=1;vt<=Q.length;vt++){let Gt=vt%Q.length,Ht=Q[Gt],Zt=Ht.x-dt.x,Qt=Ht.y-dt.y,U=Zt*Zt+Qt*Qt,ge=Math.max(Math.abs(Ht.x),Math.abs(Ht.y),Math.abs(dt.x),Math.abs(dt.y)),re=ut*ge*ge;if(U<=re){Q.splice(Gt,1),vt--;continue}dt=Ht}}H(C),P.forEach(H);let D=P.length,k=C;for(let Q=0;Q<D;Q++){let at=P[Q];C=C.concat(at)}function Y(Q,at,ut){return at||Yt("ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(at,ut)}let q=C.length;function K(Q,at,ut){let dt,vt,Gt,Ht=Q.x-at.x,Zt=Q.y-at.y,Qt=ut.x-Q.x,U=ut.y-Q.y,ge=Ht*Ht+Zt*Zt,re=Ht*U-Zt*Qt;if(Math.abs(re)>Number.EPSILON){let R=Math.sqrt(ge),y=Math.sqrt(Qt*Qt+U*U),V=at.x-Zt/R,J=at.y+Ht/R,tt=ut.x-U/y,pt=ut.y+Qt/y,_t=((tt-V)*U-(pt-J)*Qt)/(Ht*U-Zt*Qt);dt=V+Ht*_t-Q.x,vt=J+Zt*_t-Q.y;let et=dt*dt+vt*vt;if(et<=2)return new ht(dt,vt);Gt=Math.sqrt(et/2)}else{let R=!1;Ht>Number.EPSILON?Qt>Number.EPSILON&&(R=!0):Ht<-Number.EPSILON?Qt<-Number.EPSILON&&(R=!0):Math.sign(Zt)===Math.sign(U)&&(R=!0),R?(dt=-Zt,vt=Ht,Gt=Math.sqrt(ge)):(dt=Ht,vt=Zt,Gt=Math.sqrt(ge/2))}return new ht(dt/Gt,vt/Gt)}let B=[];for(let Q=0,at=k.length,ut=at-1,dt=Q+1;Q<at;Q++,ut++,dt++)ut===at&&(ut=0),dt===at&&(dt=0),B[Q]=K(k[Q],k[ut],k[dt]);let X=[],I,rt=B.concat();for(let Q=0,at=D;Q<at;Q++){let ut=P[Q];I=[];for(let dt=0,vt=ut.length,Gt=vt-1,Ht=dt+1;dt<vt;dt++,Gt++,Ht++)Gt===vt&&(Gt=0),Ht===vt&&(Ht=0),I[dt]=K(ut[dt],ut[Gt],ut[Ht]);X.push(I),rt=rt.concat(I)}let lt;if(p===0)lt=as.triangulateShape(k,P);else{let Q=[],at=[];for(let ut=0;ut<p;ut++){let dt=ut/p,vt=f*Math.cos(dt*Math.PI/2),Gt=g*Math.sin(dt*Math.PI/2)+M;for(let Ht=0,Zt=k.length;Ht<Zt;Ht++){let Qt=Y(k[Ht],B[Ht],Gt);it(Qt.x,Qt.y,-vt),dt===0&&Q.push(Qt)}for(let Ht=0,Zt=D;Ht<Zt;Ht++){let Qt=P[Ht];I=X[Ht];let U=[];for(let ge=0,re=Qt.length;ge<re;ge++){let R=Y(Qt[ge],I[ge],Gt);it(R.x,R.y,-vt),dt===0&&U.push(R)}dt===0&&at.push(U)}}lt=as.triangulateShape(Q,at)}let mt=lt.length,Ct=g+M;for(let Q=0;Q<q;Q++){let at=u?Y(C[Q],rt[Q],Ct):C[Q];x?(A.copy(S.normals[0]).multiplyScalar(at.x),v.copy(S.binormals[0]).multiplyScalar(at.y),_.copy(b[0]).add(A).add(v),it(_.x,_.y,_.z)):it(at.x,at.y,0)}for(let Q=1;Q<=h;Q++)for(let at=0;at<q;at++){let ut=u?Y(C[at],rt[at],Ct):C[at];x?(A.copy(S.normals[Q]).multiplyScalar(ut.x),v.copy(S.binormals[Q]).multiplyScalar(ut.y),_.copy(b[Q]).add(A).add(v),it(_.x,_.y,_.z)):it(ut.x,ut.y,d/h*Q)}for(let Q=p-1;Q>=0;Q--){let at=Q/p,ut=f*Math.cos(at*Math.PI/2),dt=g*Math.sin(at*Math.PI/2)+M;for(let vt=0,Gt=k.length;vt<Gt;vt++){let Ht=Y(k[vt],B[vt],dt);it(Ht.x,Ht.y,d+ut)}for(let vt=0,Gt=P.length;vt<Gt;vt++){let Ht=P[vt];I=X[vt];for(let Zt=0,Qt=Ht.length;Zt<Qt;Zt++){let U=Y(Ht[Zt],I[Zt],dt);x?it(U.x,U.y+b[h-1].y,b[h-1].x+ut):it(U.x,U.y,d+ut)}}}W(),F();function W(){let Q=s.length/3;if(u){let at=0,ut=q*at;for(let dt=0;dt<mt;dt++){let vt=lt[dt];ft(vt[2]+ut,vt[1]+ut,vt[0]+ut)}at=h+p*2,ut=q*at;for(let dt=0;dt<mt;dt++){let vt=lt[dt];ft(vt[0]+ut,vt[1]+ut,vt[2]+ut)}}else{for(let at=0;at<mt;at++){let ut=lt[at];ft(ut[2],ut[1],ut[0])}for(let at=0;at<mt;at++){let ut=lt[at];ft(ut[0]+q*h,ut[1]+q*h,ut[2]+q*h)}}n.addGroup(Q,s.length/3-Q,0)}function F(){let Q=s.length/3,at=0;G(k,at),at+=k.length;for(let ut=0,dt=P.length;ut<dt;ut++){let vt=P[ut];G(vt,at),at+=vt.length}n.addGroup(Q,s.length/3-Q,1)}function G(Q,at){let ut=Q.length;for(;--ut>=0;){let dt=ut,vt=ut-1;vt<0&&(vt=Q.length-1);for(let Gt=0,Ht=h+p*2;Gt<Ht;Gt++){let Zt=q*Gt,Qt=q*(Gt+1),U=at+dt+Zt,ge=at+vt+Zt,re=at+vt+Qt,R=at+dt+Qt;ct(U,ge,re,R)}}}function it(Q,at,ut){l.push(Q),l.push(at),l.push(ut)}function ft(Q,at,ut){xt(Q),xt(at),xt(ut);let dt=s.length/3,vt=T.generateTopUV(n,s,dt-3,dt-2,dt-1);Ot(vt[0]),Ot(vt[1]),Ot(vt[2])}function ct(Q,at,ut,dt){xt(Q),xt(at),xt(dt),xt(at),xt(ut),xt(dt);let vt=s.length/3,Gt=T.generateSideWallUV(n,s,vt-6,vt-3,vt-2,vt-1);Ot(Gt[0]),Ot(Gt[1]),Ot(Gt[3]),Ot(Gt[1]),Ot(Gt[2]),Ot(Gt[3])}function xt(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function Ot(Q){r.push(Q.x),r.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return um(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new go[s.type]().fromJSON(s)),new i(n,t.options)}},hm={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ht(r,a),new ht(o,l),new ht(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],g=t[s*3+2],M=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ht(a,1-l),new ht(c,1-d),new ht(u,1-g),new ht(M,1-m)]:[new ht(o,1-l),new ht(h,1-d),new ht(f,1-g),new ht(p,1-m)]}};function um(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var qr=class i extends Re{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=se(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],h=1/e,d=new L,u=new ht,f=new L,g=new L,M=new L,p=0,m=0;for(let T=0;T<=t.length-1;T++)switch(T){case 0:p=t[T+1].x-t[T].x,m=t[T+1].y-t[T].y,f.x=m*1,f.y=-p,f.z=m*0,M.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(M.x,M.y,M.z);break;default:p=t[T+1].x-t[T].x,m=t[T+1].y-t[T].y,f.x=m*1,f.y=-p,f.z=m*0,g.copy(f),f.x+=M.x,f.y+=M.y,f.z+=M.z,f.normalize(),l.push(f.x,f.y,f.z),M.copy(g)}for(let T=0;T<=e;T++){let b=n+T*h*s,x=Math.sin(b),S=Math.cos(b);for(let v=0;v<=t.length-1;v++){d.x=t[v].x*x,d.y=t[v].y,d.z=t[v].x*S,a.push(d.x,d.y,d.z),u.x=T/e,u.y=v/(t.length-1),o.push(u.x,u.y);let A=l[3*v+0]*x,_=l[3*v+1],E=l[3*v+0]*S;c.push(A,_,E)}}for(let T=0;T<e;T++)for(let b=0;b<t.length-1;b++){let x=b+T*t.length,S=x,v=x+t.length,A=x+t.length+1,_=x+1;r.push(S,v,_),r.push(A,_,v)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var gn=class i extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,u=e/l,f=[],g=[],M=[],p=[];for(let m=0;m<h;m++){let T=m*u-a;for(let b=0;b<c;b++){let x=b*d-r;g.push(x,-T,0),M.push(0,0,1),p.push(b/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let T=0;T<o;T++){let b=T+c*m,x=T+c*(m+1),S=T+1+c*(m+1),v=T+1+c*m;f.push(b,x,v),f.push(x,S,v)}this.setIndex(f),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(M,3)),this.setAttribute("uv",new oe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var xn=class i extends Re{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new L,u=new L,f=[],g=[],M=[],p=[];for(let m=0;m<=n;m++){let T=[],b=m/n,x=a+b*o,S=t*Math.cos(x),v=Math.sqrt(t*t-S*S),A=0;m===0&&a===0?A=.5/e:m===n&&l===Math.PI&&(A=-.5/e);for(let _=0;_<=e;_++){let E=_/e,C=s+E*r;d.x=-v*Math.cos(C),d.y=S,d.z=v*Math.sin(C),g.push(d.x,d.y,d.z),u.copy(d).normalize(),M.push(u.x,u.y,u.z),p.push(E+A,1-b),T.push(c++)}h.push(T)}for(let m=0;m<n;m++)for(let T=0;T<e;T++){let b=h[m][T+1],x=h[m][T],S=h[m+1][T],v=h[m+1][T+1];(m!==0||a>0)&&f.push(b,x,v),(m!==n-1||l<Math.PI)&&f.push(x,S,v)}this.setIndex(f),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(M,3)),this.setAttribute("uv",new oe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Pn=class i extends Re{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new L,f=new L,g=new L;for(let M=0;M<=n;M++){let p=a+M/n*o;for(let m=0;m<=s;m++){let T=m/s*r;f.x=(t+e*Math.cos(p))*Math.cos(T),f.y=(t+e*Math.cos(p))*Math.sin(T),f.z=e*Math.sin(p),c.push(f.x,f.y,f.z),u.x=t*Math.cos(T),u.y=t*Math.sin(T),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(m/s),d.push(M/n)}}for(let M=1;M<=n;M++)for(let p=1;p<=s;p++){let m=(s+1)*M+p-1,T=(s+1)*(M-1)+p-1,b=(s+1)*(M-1)+p,x=(s+1)*M+p;l.push(m,T,x),l.push(T,b,x)}this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Vi=class i extends Re{constructor(t=new us(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new L,l=new L,c=new ht,h=new L,d=[],u=[],f=[],g=[];M(),this.setIndex(g),this.setAttribute("position",new oe(d,3)),this.setAttribute("normal",new oe(u,3)),this.setAttribute("uv",new oe(f,2));function M(){for(let b=0;b<e;b++)p(b);p(r===!1?e:0),T(),m()}function p(b){h=t.getPointAt(b/e,h);let x=a.normals[b],S=a.binormals[b];for(let v=0;v<=s;v++){let A=v/s*Math.PI*2,_=Math.sin(A),E=-Math.cos(A);l.x=E*x.x+_*S.x,l.y=E*x.y+_*S.y,l.z=E*x.z+_*S.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function m(){for(let b=1;b<=e;b++)for(let x=1;x<=s;x++){let S=(s+1)*(b-1)+(x-1),v=(s+1)*b+(x-1),A=(s+1)*b+x,_=(s+1)*(b-1)+x;g.push(S,v,_),g.push(v,A,_)}}function T(){for(let b=0;b<=e;b++)for(let x=0;x<=s;x++)c.x=b/e,c.y=x/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new go[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function vs(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Hu(s))s.isRenderTargetTexture?(Wt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Hu(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function cn(i){let t={};for(let e=0;e<i.length;e++){let n=vs(i[e]);for(let s in n)t[s]=n[s]}return t}function Hu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function dm(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function nh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:le.workingColorSpace}var Fd={clone:vs,merge:cn},fm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ln=class extends li{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fm,this.fragmentShader=pm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=vs(t.uniforms),this.uniformsGroups=dm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new $t().setHex(s.value);break;case"v2":this.uniforms[n].value=new ht().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new De().fromArray(s.value);break;case"m3":this.uniforms[n].value=new jt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new me().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},_o=class extends ln{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Pe=class extends li{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=la,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Yr=class extends Pe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ht(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return se(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new $t(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $t(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $t(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ps=class extends li{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=la,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=Uo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},vo=class extends li{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},yo=class extends li{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Bs(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Mc(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Wi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Mo=class extends Wi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:wc,endingEnd:wc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ec:r=t,o=2*e-n;break;case Tc:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ec:a=t,l=2*n-e;break;case Tc:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),M=g*g,p=M*g,m=-u*p+2*u*M-u*g,T=(1+u)*p+(-1.5-2*u)*M+(-.5+u)*g+1,b=(-1-f)*p+(1.5+f)*M+.5*g,x=f*p-f*M;for(let S=0;S!==o;++S)r[S]=m*a[h+S]+T*a[c+S]+b*a[l+S]+x*a[d+S];return r}},So=class extends Wi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},bo=class extends Wi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},wo=class extends Wi{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-e)/(s-e),M=1-g;for(let p=0;p!==o;++p)r[p]=a[c+p]*M+a[l+p]*g;return r}let u=o*2,f=t-1;for(let g=0;g!==o;++g){let M=a[c+g],p=a[l+g],m=f*u+g*2,T=d[m],b=d[m+1],x=t*u+g*2,S=h[x],v=h[x+1],A=gm(n,e,T,S,s);r[g]=Od(A,M,b,v,p)}return r}};function Od(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function mm(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function gm(i,t,e,n,s){let r=(i-t)/(s-t);for(let a=0;a<8;a++){let o=Od(r,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;let l=mm(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Tn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Bs(e,this.TimeBufferType),this.values=Bs(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Bs(t.times,Array),values:Bs(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Mc(t.settings)&&(n.settings={inTangents:Bs(t.settings.inTangents,Array),outTangents:Bs(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new bo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new So(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Mo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new wo(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Er:e=this.InterpolantFactoryMethodDiscrete;break;case ao:e=this.InterpolantFactoryMethodLinear;break;case Ja:e=this.InterpolantFactoryMethodSmooth;break;case bc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Wt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Er;case this.InterpolantFactoryMethodLinear:return ao;case this.InterpolantFactoryMethodSmooth:return Ja;case this.InterpolantFactoryMethodBezier:return bc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Mc(this.settings)&&(Gu(this.settings.inTangents,t),Gu(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Yt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Yt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Yt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Yt("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&vp(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Yt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ja,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let d=o*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){let M=e[d+g];if(M!==e[u+g]||M!==e[f+g]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Mc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Gu(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Tn.prototype.ValueTypeName="";Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=ao;var Xi=class extends Tn{constructor(t,e,n){super(t,e,n)}};Xi.prototype.ValueTypeName="bool";Xi.prototype.ValueBufferType=Array;Xi.prototype.DefaultInterpolation=Er;Xi.prototype.InterpolantFactoryMethodLinear=void 0;Xi.prototype.InterpolantFactoryMethodSmooth=void 0;var Eo=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}};Eo.prototype.ValueTypeName="color";var To=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}};To.prototype.ValueTypeName="number";var Ao=class extends Wi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)bn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Zr=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Ao(this.times,this.values,this.getValueSize(),t)}};Zr.prototype.ValueTypeName="quaternion";Zr.prototype.InterpolantFactoryMethodSmooth=void 0;var qi=class extends Tn{constructor(t,e,n){super(t,e,n)}};qi.prototype.ValueTypeName="string";qi.prototype.ValueBufferType=Array;qi.prototype.DefaultInterpolation=Er;qi.prototype.InterpolantFactoryMethodLinear=void 0;qi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ro=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}};Ro.prototype.ValueTypeName="vector";var Co=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Bd=new Co,Io=class{constructor(t){this.manager=t!==void 0?t:Bd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Io.DEFAULT_MATERIAL_NAME="__DEFAULT";var $r=class extends tn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Jr=class extends $r{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Sc=new me,Vu=new L,Wu=new L,Po=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=_n,this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $s,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new De(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Vu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Vu),Wu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Wu),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Sc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Sc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Vs||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(Sc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Za=new L,$a=new bn,ii=new L,Kr=class extends tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=Wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Za,$a,ii),ii.x===1&&ii.y===1&&ii.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Za,$a,ii.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Za,$a,ii),ii.x===1&&ii.y===1&&ii.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Za,$a,ii.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ki=new L,Xu=new ht,qu=new ht,on=class extends Kr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=oo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Kl*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return oo*2*Math.atan(Math.tan(Kl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ki.x,ki.y).multiplyScalar(-t/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-t/ki.z)}getViewSize(t,e){return this.getViewBounds(t,Xu,qu),e.subVectors(qu,Xu)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Kl*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var tr=class extends Kr{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Pc=class extends Po{constructor(){super(new tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},jr=class extends $r{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.shadow=new Pc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var zs=-90,ks=1,Lo=class extends tn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new on(zs,ks,t,e);s.layers=this.layers,this.add(s);let r=new on(zs,ks,t,e);r.layers=this.layers,this.add(r);let a=new on(zs,ks,t,e);a.layers=this.layers,this.add(a);let o=new on(zs,ks,t,e);o.layers=this.layers,this.add(o);let l=new on(zs,ks,t,e);l.layers=this.layers,this.add(l);let c=new on(zs,ks,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Vs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Do=class extends on{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var ih="\\[\\]\\.:\\/",xm=new RegExp("["+ih+"]","g"),sh="[^"+ih+"]",_m="[^"+ih.replace("\\.","")+"]",vm=/((?:WC+[\/:])*)/.source.replace("WC",sh),ym=/(WCOD+)?/.source.replace("WCOD",_m),Mm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sh),Sm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sh),bm=new RegExp("^"+vm+ym+Mm+Sm+"$"),wm=["material","materials","bones","map"],Lc=class{constructor(t,e,n){let s=n||Ie.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ie=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(xm,"")}static parseTrackName(t){let e=bm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);wm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Wt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Yt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Yt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Yt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Yt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Yt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Yt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Yt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;Yt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Yt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Yt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ie.Composite=Lc;Ie.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ie.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ie.prototype.GetterByBindingType=[Ie.prototype._getValue_direct,Ie.prototype._getValue_array,Ie.prototype._getValue_arrayElement,Ie.prototype._getValue_toArray];Ie.prototype.SetterByBindingTypeAndVersioning=[[Ie.prototype._setValue_direct,Ie.prototype._setValue_direct_setNeedsUpdate,Ie.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_array,Ie.prototype._setValue_array_setNeedsUpdate,Ie.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_arrayElement,Ie.prototype._setValue_arrayElement_setNeedsUpdate,Ie.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_fromArray,Ie.prototype._setValue_fromArray_setNeedsUpdate,Ie.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Qv=new Float32Array(1);var hh=class hh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};hh.prototype.isMatrix2=!0;var Dc=hh;function rh(i,t,e,n){let s=Em(n);switch(e){case Kc:return i*t;case Go:return i*t/s.components*s.byteLength;case Vo:return i*t/s.components*s.byteLength;case Ki:return i*t*2/s.components*s.byteLength;case Wo:return i*t*2/s.components*s.byteLength;case jc:return i*t*3/s.components*s.byteLength;case Dn:return i*t*4/s.components*s.byteLength;case Xo:return i*t*4/s.components*s.byteLength;case na:case ia:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case sa:case ra:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yo:case $o:return Math.max(i,16)*Math.max(t,8)/4;case qo:case Zo:return Math.max(i,8)*Math.max(t,8)/2;case Jo:case Ko:case Qo:case tl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case jo:case aa:case el:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case nl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case il:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case sl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case rl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case al:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ol:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ll:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case cl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case hl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ul:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case dl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case fl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case pl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ml:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case gl:case xl:case _l:return Math.ceil(i/4)*Math.ceil(t/4)*16;case vl:case yl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case oa:case Ml:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Em(i){switch(i){case _n:case Yc:return{byteLength:1,components:1};case ir:case Zc:case Jn:return{byteLength:2,components:1};case ko:case Ho:return{byteLength:2,components:4};case $n:case zo:case Ln:return{byteLength:4,components:1};case $c:case Jc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Wt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function of(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Lm(i){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){let g=d[u],M=d[f];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++u,d[u]=M)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){let M=d[f];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Dm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Nm=`#ifdef USE_ALPHAHASH
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
#endif`,Um=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Om=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zm=`#ifdef USE_AOMAP
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
#endif`,km=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hm=`#ifdef USE_BATCHING
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
#endif`,Gm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qm=`#ifdef USE_IRIDESCENCE
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
#endif`,Ym=`#ifdef USE_BUMPMAP
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
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$m=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Km=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Qm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,t0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,e0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,n0=`#define PI 3.141592653589793
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
} // validated`,i0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,s0=`vec3 transformedNormal = objectNormal;
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
#endif`,r0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,a0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,o0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,l0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,c0="gl_FragColor = linearToOutputTexel( gl_FragColor );",h0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,u0=`#ifdef USE_ENVMAP
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
#endif`,d0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,f0=`#ifdef USE_ENVMAP
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
#endif`,p0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,m0=`#ifdef USE_ENVMAP
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
#endif`,g0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,x0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,v0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,y0=`#ifdef USE_GRADIENTMAP
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
}`,M0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,S0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,w0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,E0=`#ifdef USE_ENVMAP
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
#endif`,T0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,A0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,R0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,C0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,I0=`PhysicalMaterial material;
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
#endif`,P0=`uniform sampler2D dfgLUT;
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
}`,L0=`
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
#endif`,D0=`#if defined( RE_IndirectDiffuse )
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
#endif`,N0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,U0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,F0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,O0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,B0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,z0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,k0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,H0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,G0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,V0=`#if defined( USE_POINTS_UV )
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
#endif`,W0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,X0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,q0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Y0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Z0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$0=`#ifdef USE_MORPHTARGETS
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
#endif`,J0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,K0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,j0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Q0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ng=`#ifdef USE_NORMALMAP
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
#endif`,ig=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ag=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,og=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ug=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,pg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,_g=`float getShadowMask() {
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
}`,vg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,yg=`#ifdef USE_SKINNING
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
#endif`,Mg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sg=`#ifdef USE_SKINNING
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
#endif`,bg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Eg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ag=`#ifdef USE_TRANSMISSION
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
#endif`,Rg=`#ifdef USE_TRANSMISSION
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
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Dg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ng=`uniform sampler2D t2D;
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
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zg=`#include <common>
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
}`,kg=`#if DEPTH_PACKING == 3200
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
}`,Hg=`#define DISTANCE
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
}`,Gg=`#define DISTANCE
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
}`,Vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xg=`uniform float scale;
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
}`,qg=`uniform vec3 diffuse;
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
}`,Yg=`#include <common>
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
}`,Zg=`uniform vec3 diffuse;
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
}`,$g=`#define LAMBERT
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
}`,Jg=`#define LAMBERT
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
}`,Kg=`#define MATCAP
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
}`,jg=`#define MATCAP
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
}`,Qg=`#define NORMAL
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
}`,tx=`#define NORMAL
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
}`,ex=`#define PHONG
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
}`,nx=`#define PHONG
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
}`,ix=`#define STANDARD
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
}`,sx=`#define STANDARD
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
}`,rx=`#define TOON
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
}`,ax=`#define TOON
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
}`,ox=`uniform float size;
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
}`,lx=`uniform vec3 diffuse;
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
}`,cx=`#include <common>
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
}`,hx=`uniform vec3 color;
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
}`,ux=`uniform float rotation;
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
}`,dx=`uniform vec3 diffuse;
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
}`,ie={alphahash_fragment:Dm,alphahash_pars_fragment:Nm,alphamap_fragment:Um,alphamap_pars_fragment:Fm,alphatest_fragment:Om,alphatest_pars_fragment:Bm,aomap_fragment:zm,aomap_pars_fragment:km,batching_pars_vertex:Hm,batching_vertex:Gm,begin_vertex:Vm,beginnormal_vertex:Wm,bsdfs:Xm,iridescence_fragment:qm,bumpmap_pars_fragment:Ym,clipping_planes_fragment:Zm,clipping_planes_pars_fragment:$m,clipping_planes_pars_vertex:Jm,clipping_planes_vertex:Km,color_fragment:jm,color_pars_fragment:Qm,color_pars_vertex:t0,color_vertex:e0,common:n0,cube_uv_reflection_fragment:i0,defaultnormal_vertex:s0,displacementmap_pars_vertex:r0,displacementmap_vertex:a0,emissivemap_fragment:o0,emissivemap_pars_fragment:l0,colorspace_fragment:c0,colorspace_pars_fragment:h0,envmap_fragment:u0,envmap_common_pars_fragment:d0,envmap_pars_fragment:f0,envmap_pars_vertex:p0,envmap_physical_pars_fragment:E0,envmap_vertex:m0,fog_vertex:g0,fog_pars_vertex:x0,fog_fragment:_0,fog_pars_fragment:v0,gradientmap_pars_fragment:y0,lightmap_pars_fragment:M0,lights_lambert_fragment:S0,lights_lambert_pars_fragment:b0,lights_pars_begin:w0,lights_toon_fragment:T0,lights_toon_pars_fragment:A0,lights_phong_fragment:R0,lights_phong_pars_fragment:C0,lights_physical_fragment:I0,lights_physical_pars_fragment:P0,lights_fragment_begin:L0,lights_fragment_maps:D0,lights_fragment_end:N0,lightprobes_pars_fragment:U0,logdepthbuf_fragment:F0,logdepthbuf_pars_fragment:O0,logdepthbuf_pars_vertex:B0,logdepthbuf_vertex:z0,map_fragment:k0,map_pars_fragment:H0,map_particle_fragment:G0,map_particle_pars_fragment:V0,metalnessmap_fragment:W0,metalnessmap_pars_fragment:X0,morphinstance_vertex:q0,morphcolor_vertex:Y0,morphnormal_vertex:Z0,morphtarget_pars_vertex:$0,morphtarget_vertex:J0,normal_fragment_begin:K0,normal_fragment_maps:j0,normal_pars_fragment:Q0,normal_pars_vertex:tg,normal_vertex:eg,normalmap_pars_fragment:ng,clearcoat_normal_fragment_begin:ig,clearcoat_normal_fragment_maps:sg,clearcoat_pars_fragment:rg,iridescence_pars_fragment:ag,opaque_fragment:og,packing:lg,premultiplied_alpha_fragment:cg,project_vertex:hg,dithering_fragment:ug,dithering_pars_fragment:dg,roughnessmap_fragment:fg,roughnessmap_pars_fragment:pg,shadowmap_pars_fragment:mg,shadowmap_pars_vertex:gg,shadowmap_vertex:xg,shadowmask_pars_fragment:_g,skinbase_vertex:vg,skinning_pars_vertex:yg,skinning_vertex:Mg,skinnormal_vertex:Sg,specularmap_fragment:bg,specularmap_pars_fragment:wg,tonemapping_fragment:Eg,tonemapping_pars_fragment:Tg,transmission_fragment:Ag,transmission_pars_fragment:Rg,uv_pars_fragment:Cg,uv_pars_vertex:Ig,uv_vertex:Pg,worldpos_vertex:Lg,background_vert:Dg,background_frag:Ng,backgroundCube_vert:Ug,backgroundCube_frag:Fg,cube_vert:Og,cube_frag:Bg,depth_vert:zg,depth_frag:kg,distance_vert:Hg,distance_frag:Gg,equirect_vert:Vg,equirect_frag:Wg,linedashed_vert:Xg,linedashed_frag:qg,meshbasic_vert:Yg,meshbasic_frag:Zg,meshlambert_vert:$g,meshlambert_frag:Jg,meshmatcap_vert:Kg,meshmatcap_frag:jg,meshnormal_vert:Qg,meshnormal_frag:tx,meshphong_vert:ex,meshphong_frag:nx,meshphysical_vert:ix,meshphysical_frag:sx,meshtoon_vert:rx,meshtoon_frag:ax,points_vert:ox,points_frag:lx,shadow_vert:cx,shadow_frag:hx,sprite_vert:ux,sprite_frag:dx},Et={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},ui={basic:{uniforms:cn([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:cn([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new $t(0)},envMapIntensity:{value:1}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:cn([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:cn([Et.common,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.roughnessmap,Et.metalnessmap,Et.fog,Et.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:cn([Et.common,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.gradientmap,Et.fog,Et.lights,{emissive:{value:new $t(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:cn([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:cn([Et.points,Et.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:cn([Et.common,Et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:cn([Et.common,Et.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:cn([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:cn([Et.sprite,Et.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distance:{uniforms:cn([Et.common,Et.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distance_vert,fragmentShader:ie.distance_frag},shadow:{uniforms:cn([Et.lights,Et.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};ui.physical={uniforms:cn([ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};var wl={r:0,b:0,g:0},fx=new me,lf=new jt;lf.set(-1,0,0,0,1,0,0,0,1);function px(i,t,e,n,s,r){let a=new $t(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(T){let b=T.isScene===!0?T.background:null;if(b&&b.isTexture){let x=T.backgroundBlurriness>0;b=t.get(b,x)}return b}function g(T){let b=!1,x=f(T);x===null?p(a,o):x&&x.isColor&&(p(x,1),b=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||b)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(T,b){let x=f(b);x&&(x.isCubeTexture||x.mapping===ta)?(c===void 0&&(c=new Kt(new In(1,1,1),new ln({name:"BackgroundCubeMaterial",uniforms:vs(ui.backgroundCube.uniforms),vertexShader:ui.backgroundCube.vertexShader,fragmentShader:ui.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,v,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(fx.makeRotationFromEuler(b.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(lf),c.material.toneMapped=le.getTransfer(x.colorSpace)!==ye,(h!==x||d!==x.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Kt(new gn(2,2),new ln({name:"BackgroundMaterial",uniforms:vs(ui.background.uniforms),vertexShader:ui.background.vertexShader,fragmentShader:ui.background.fragmentShader,side:Yi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=le.getTransfer(x.colorSpace)!==ye,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||d!==x.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function p(T,b){T.getRGB(wl,nh(i)),e.buffers.color.setClear(wl.r,wl.g,wl.b,b,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(T,b=1){a.set(T),o=b,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(T){o=T,p(a,o)},render:g,addToRenderList:M,dispose:m}}function mx(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(P,N,H,D,k){let Y=!1,q=d(P,D,H,N);r!==q&&(r=q,c(r.object)),Y=f(P,D,H,k),Y&&g(P,D,H,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,x(P,N,H,D),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function d(P,N,H,D){let k=D.wireframe===!0,Y=n[N.id];Y===void 0&&(Y={},n[N.id]=Y);let q=P.isInstancedMesh===!0?P.id:0,K=Y[q];K===void 0&&(K={},Y[q]=K);let B=K[H.id];B===void 0&&(B={},K[H.id]=B);let X=B[k];return X===void 0&&(X=u(l()),B[k]=X),X}function u(P){let N=[],H=[],D=[];for(let k=0;k<e;k++)N[k]=0,H[k]=0,D[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:H,attributeDivisors:D,object:P,attributes:{},index:null}}function f(P,N,H,D){let k=r.attributes,Y=N.attributes,q=0,K=H.getAttributes();for(let B in K)if(K[B].location>=0){let I=k[B],rt=Y[B];if(rt===void 0&&(B==="instanceMatrix"&&P.instanceMatrix&&(rt=P.instanceMatrix),B==="instanceColor"&&P.instanceColor&&(rt=P.instanceColor)),I===void 0||I.attribute!==rt||rt&&I.data!==rt.data)return!0;q++}return r.attributesNum!==q||r.index!==D}function g(P,N,H,D){let k={},Y=N.attributes,q=0,K=H.getAttributes();for(let B in K)if(K[B].location>=0){let I=Y[B];I===void 0&&(B==="instanceMatrix"&&P.instanceMatrix&&(I=P.instanceMatrix),B==="instanceColor"&&P.instanceColor&&(I=P.instanceColor));let rt={};rt.attribute=I,I&&I.data&&(rt.data=I.data),k[B]=rt,q++}r.attributes=k,r.attributesNum=q,r.index=D}function M(){let P=r.newAttributes;for(let N=0,H=P.length;N<H;N++)P[N]=0}function p(P){m(P,0)}function m(P,N){let H=r.newAttributes,D=r.enabledAttributes,k=r.attributeDivisors;H[P]=1,D[P]===0&&(i.enableVertexAttribArray(P),D[P]=1),k[P]!==N&&(i.vertexAttribDivisor(P,N),k[P]=N)}function T(){let P=r.newAttributes,N=r.enabledAttributes;for(let H=0,D=N.length;H<D;H++)N[H]!==P[H]&&(i.disableVertexAttribArray(H),N[H]=0)}function b(P,N,H,D,k,Y,q){q===!0?i.vertexAttribIPointer(P,N,H,k,Y):i.vertexAttribPointer(P,N,H,D,k,Y)}function x(P,N,H,D){M();let k=D.attributes,Y=H.getAttributes(),q=N.defaultAttributeValues;for(let K in Y){let B=Y[K];if(B.location>=0){let X=k[K];if(X===void 0&&(K==="instanceMatrix"&&P.instanceMatrix&&(X=P.instanceMatrix),K==="instanceColor"&&P.instanceColor&&(X=P.instanceColor)),X!==void 0){let I=X.normalized,rt=X.itemSize,lt=t.get(X);if(lt===void 0)continue;let mt=lt.buffer,Ct=lt.type,W=lt.bytesPerElement,F=Ct===i.INT||Ct===i.UNSIGNED_INT||X.gpuType===zo;if(X.isInterleavedBufferAttribute){let G=X.data,it=G.stride,ft=X.offset;if(G.isInstancedInterleavedBuffer){for(let ct=0;ct<B.locationSize;ct++)m(B.location+ct,G.meshPerAttribute);P.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let ct=0;ct<B.locationSize;ct++)p(B.location+ct);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let ct=0;ct<B.locationSize;ct++)b(B.location+ct,rt/B.locationSize,Ct,I,it*W,(ft+rt/B.locationSize*ct)*W,F)}else{if(X.isInstancedBufferAttribute){for(let G=0;G<B.locationSize;G++)m(B.location+G,X.meshPerAttribute);P.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let G=0;G<B.locationSize;G++)p(B.location+G);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let G=0;G<B.locationSize;G++)b(B.location+G,rt/B.locationSize,Ct,I,rt*W,rt/B.locationSize*G*W,F)}}else if(q!==void 0){let I=q[K];if(I!==void 0)switch(I.length){case 2:i.vertexAttrib2fv(B.location,I);break;case 3:i.vertexAttrib3fv(B.location,I);break;case 4:i.vertexAttrib4fv(B.location,I);break;default:i.vertexAttrib1fv(B.location,I)}}}}T()}function S(){E();for(let P in n){let N=n[P];for(let H in N){let D=N[H];for(let k in D){let Y=D[k];for(let q in Y)h(Y[q].object),delete Y[q];delete D[k]}}delete n[P]}}function v(P){if(n[P.id]===void 0)return;let N=n[P.id];for(let H in N){let D=N[H];for(let k in D){let Y=D[k];for(let q in Y)h(Y[q].object),delete Y[q];delete D[k]}}delete n[P.id]}function A(P){for(let N in n){let H=n[N];for(let D in H){let k=H[D];if(k[P.id]===void 0)continue;let Y=k[P.id];for(let q in Y)h(Y[q].object),delete Y[q];delete k[P.id]}}}function _(P){for(let N in n){let H=n[N],D=P.isInstancedMesh===!0?P.id:0,k=H[D];if(k!==void 0){for(let Y in k){let q=k[Y];for(let K in q)h(q[K].object),delete q[K];delete k[Y]}delete H[D],Object.keys(H).length===0&&delete n[N]}}}function E(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:S,releaseStatesOfGeometry:v,releaseStatesOfObject:_,releaseStatesOfProgram:A,initAttributes:M,enableAttribute:p,disableUnusedAttributes:T}}function gx(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function xx(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Dn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let _=A===Jn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==_n&&A!==Ln&&!_&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Wt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Wt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),v=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:T,maxVaryings:b,maxFragmentUniforms:x,maxSamples:S,samples:v}}function _x(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Vn,o=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let g=d.clippingPlanes,M=d.clipIntersection,p=d.clipShadows,m=i.get(d);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{let T=r?0:n,b=T*4,x=m.clippingState||null;l.value=x,x=h(g,u,b,f);for(let S=0;S!==b;++S)x[S]=e[S];m.clippingState=x,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){let M=d!==null?d.length:0,p=null;if(M!==0){if(p=l.value,g!==!0||p===null){let m=f+M*4,T=u.matrixWorldInverse;o.getNormalMatrix(T),(p===null||p.length<m)&&(p=new Float32Array(m));for(let b=0,x=f;b!==M;++b,x+=4)a.copy(d[b]).applyMatrix4(T,o),a.normal.toArray(p,x),p[x+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,p}}var or=4,vx=6,yx=20,Mx=256,ca=new tr,zd=new $t,uh=null,dh=0,fh=0,ph=!1,Sx=new L,ys=new L,cr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=Sx}=r;uh=this._renderer.getRenderTarget(),dh=this._renderer.getActiveCubeFace(),fh=this._renderer.getActiveMipmapLevel(),ph=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(uh,dh,fh),this._renderer.xr.enabled=ph,t.scissorTest=!1,ar(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zi||t.mapping===xs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),uh=this._renderer.getRenderTarget(),dh=this._renderer.getActiveCubeFace(),fh=this._renderer.getActiveMipmapLevel(),ph=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Qe,minFilter:Qe,generateMipmaps:!1,type:Jn,format:Dn,colorSpace:Tr,depthBuffer:!1},s=kd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kd(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=bx(r)),this._blurMaterial=Ex(r,t,e),this._ggxMaterial=wx(r,t,e)}return s}_compileMaterial(t){let e=new Kt(new Re,t);this._renderer.compile(e,ca)}_sceneToCubeUV(t,e,n,s,r){let l=new on(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(zd),d.toneMapping=Zn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Kt(new In,new Xn({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,p=M.material,m=!1,T=t.background;T?T.isColor&&(p.color.copy(T),t.background=null,m=!0):(p.color.copy(zd),m=!0);for(let b=0;b<6;b++){let x=b%3;x===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[b],r.y,r.z)):x===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[b]));let S=this._cubeSize;ar(s,x*S,b>2?S:0,S,S),d.setRenderTarget(s),m&&d.render(M,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=T}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Zi||t.mapping===xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;ar(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,ca)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:g}=this,M=this._sizeLods[n],p=3*M*(n>g-or?n-g+or:0),m=4*(this._cubeSize-M);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,ar(r,p,m,3*M,2*M),s.setRenderTarget(r),s.render(o,ca),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,ar(t,p,m,3*M,2*M),s.setRenderTarget(t),s.render(o,ca)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-or?s-this._lodMax+or:0),u=4*(this._cubeSize-h);ar(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(l,ca)}};function bx(i){let t=[],e=[],n=i,s=i-or+1+vx;for(let r=0;r<s;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,g=new Float32Array(f*u*d),M=new Float32Array(f*u*d);for(let m=0;m<d;m++){let T=m%3*2/3-1,b=m>2?0:-1,x=[T,b,0,T+2/3,b,0,T+2/3,b+1,0,T,b,0,T+2/3,b+1,0,T,b+1,0];g.set(x,f*u*m);for(let S=0;S<u;S++){let v=h[S*2]*2-1,A=h[S*2+1]*2-1;m===0?ys.set(1,A,v):m===1?ys.set(-v,1,-A):m===2?ys.set(-v,A,1):m===3?ys.set(-1,A,-v):m===4?ys.set(-v,-1,A):ys.set(v,A,-1),ys.toArray(M,(m*u+S)*f)}}let p=new Re;p.setAttribute("position",new Ae(g,f)),p.setAttribute("outputDirection",new Ae(M,f)),e.push(new Kt(p,null)),n>or&&n--}return{lodMeshes:e,sizeLods:t}}function kd(i,t,e){let n=new mn(i,t,e);return n.texture.mapping=ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ar(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function wx(i,t,e){return new ln({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Mx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Rl(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Ex(i,t,e){return new ln({name:"SphericalGaussianBlur",defines:{SAMPLES:yx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Rl(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Hd(){return new ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Rl(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Gd(){return new ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Rl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Rl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Tl=class extends mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Fr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new In(5,5,5),r=new ln({name:"CubemapFromEquirect",uniforms:vs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:ci});r.uniforms.tEquirect.value=e;let a=new Kt(s,r),o=e.minFilter;return e.minFilter===$i&&(e.minFilter=Qe),new Lo(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function Tx(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Fo||f===Oo)if(t.has(u)){let g=t.get(u).texture;return o(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let M=new Tl(g.height);return M.fromEquirectangularTexture(i,u),t.set(u,M),u.addEventListener("dispose",c),o(M.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,g=f===Fo||f===Oo,M=f===Zi||f===xs;if(g||M){let p=e.get(u),m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new cr(i)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),p.texture;if(p!==void 0)return p.texture;{let T=u.image;return g&&T&&T.height>0||M&&T&&l(T)?(n===null&&(n=new cr(i)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,f){return f===Fo?u.mapping=Zi:f===Oo&&(u.mapping=xs),u}function l(u){let f=0,g=6;for(let M=0;M<g;M++)u[M]!==void 0&&f++;return f===g}function c(u){let f=u.target;f.removeEventListener("dispose",c);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Ax(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&os("WebGLRenderer: "+n+" extension not supported."),s}}}function Rx(i,t,e,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,g=d.attributes.position,M=0;if(g===void 0)return;if(f!==null){let T=f.array;M=f.version;for(let b=0,x=T.length;b<x;b+=3){let S=T[b+0],v=T[b+1],A=T[b+2];u.push(S,v,v,A,A,S)}}else{let T=g.array;M=g.version;for(let b=0,x=T.length/3-1;b<x;b+=3){let S=b+0,v=b+1,A=b+2;u.push(S,v,v,A,A,S)}}let p=new(g.count>=65535?Dr:Lr)(u,1);p.version=M;let m=r.get(d);m&&t.remove(m),r.set(d,p)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Cx(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let M=0;for(let p=0;p<f;p++)M+=u[p];e.update(M,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Ix(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Yt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Px(i,t,e){let n=new WeakMap,s=new De;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let E=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],T=o.morphAttributes.color||[],b=0;f===!0&&(b=1),g===!0&&(b=2),M===!0&&(b=3);let x=o.attributes.position.count*b,S=1;x>t.maxTextureSize&&(S=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);let v=new Float32Array(x*S*4*d),A=new Cr(v,x,S,d);A.type=Ln,A.needsUpdate=!0;let _=b*4;for(let C=0;C<d;C++){let P=p[C],N=m[C],H=T[C],D=x*S*4*C;for(let k=0;k<P.count;k++){let Y=k*_;f===!0&&(s.fromBufferAttribute(P,k),v[D+Y+0]=s.x,v[D+Y+1]=s.y,v[D+Y+2]=s.z,v[D+Y+3]=0),g===!0&&(s.fromBufferAttribute(N,k),v[D+Y+4]=s.x,v[D+Y+5]=s.y,v[D+Y+6]=s.z,v[D+Y+7]=0),M===!0&&(s.fromBufferAttribute(H,k),v[D+Y+8]=s.x,v[D+Y+9]=s.y,v[D+Y+10]=s.z,v[D+Y+11]=H.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new ht(x,S)},n.set(o,u),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let M=0;M<c.length;M++)f+=c[M];let g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Lx(i,t,e,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var Dx={[kc]:"LINEAR_TONE_MAPPING",[Hc]:"REINHARD_TONE_MAPPING",[Gc]:"CINEON_TONE_MAPPING",[Qr]:"ACES_FILMIC_TONE_MAPPING",[Wc]:"AGX_TONE_MAPPING",[Xc]:"NEUTRAL_TONE_MAPPING",[Vc]:"CUSTOM_TONE_MAPPING"};function Nx(i,t,e,n,s,r){let a=new mn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Re;c.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new oe([0,2,0,0,2,0],2));let h=new _o({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Kt(c,h),u=new tr(-1,1,1,-1,0,1),f=null,g=null,M=!1,p,m=null,T=[],b=!1;this.setSize=function(x,S){a.setSize(x,S),o!==null&&o.setSize(x,S),l!==null&&l.setSize(x,S);for(let v=0;v<T.length;v++){let A=T[v];A.setSize&&A.setSize(x,S)}},this.setEffects=function(x){T=x,b=T.length>0&&T[0].isRenderPass===!0;let S=a.width,v=a.height;T.length>0&&o===null&&(o=new mn(S,v,{type:Jn,depthBuffer:!1,stencilBuffer:!1}),l=new mn(S,v,{type:Jn,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<T.length;A++){let _=T[A];_.setSize&&_.setSize(S,v)}},this.begin=function(x,S){if(M||x.toneMapping===Zn&&T.length===0)return!1;if(m=S,S!==null){let v=S.width,A=S.height;(a.width!==v||a.height!==A)&&this.setSize(v,A)}return b===!1&&x.setRenderTarget(a),p=x.toneMapping,x.toneMapping=Zn,!0},this.hasRenderPass=function(){return b},this.end=function(x,S){x.toneMapping=p,M=!0;let v=a,A=o;for(let _=0;_<T.length;_++){let E=T[_];E.enabled!==!1&&(E.render(x,A,v,S),E.needsSwap!==!1&&(v=A,A=A===o?l:o))}if(f!==x.outputColorSpace||g!==x.toneMapping){f=x.outputColorSpace,g=x.toneMapping,h.defines={},le.getTransfer(f)===ye&&(h.defines.SRGB_TRANSFER="");let _=Dx[g];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=v.texture,x.setRenderTarget(m),x.render(d,u),m=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var cf=new un,xh=new Gi(1,1),hf=new Cr,uf=new ho,df=new Fr,Vd=[],Wd=[],Xd=new Float32Array(16),qd=new Float32Array(9),Yd=new Float32Array(4);function hr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Vd[s];if(r===void 0&&(r=new Float32Array(s),Vd[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Xe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function qe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Cl(i,t){let e=Wd[t];e===void 0&&(e=new Int32Array(t),Wd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ux(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Fx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Xe(e,t))return;i.uniform2fv(this.addr,t),qe(e,t)}}function Ox(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Xe(e,t))return;i.uniform3fv(this.addr,t),qe(e,t)}}function Bx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Xe(e,t))return;i.uniform4fv(this.addr,t),qe(e,t)}}function zx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Xe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),qe(e,t)}else{if(Xe(e,n))return;Yd.set(n),i.uniformMatrix2fv(this.addr,!1,Yd),qe(e,n)}}function kx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Xe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),qe(e,t)}else{if(Xe(e,n))return;qd.set(n),i.uniformMatrix3fv(this.addr,!1,qd),qe(e,n)}}function Hx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Xe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),qe(e,t)}else{if(Xe(e,n))return;Xd.set(n),i.uniformMatrix4fv(this.addr,!1,Xd),qe(e,n)}}function Gx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Vx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Xe(e,t))return;i.uniform2iv(this.addr,t),qe(e,t)}}function Wx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Xe(e,t))return;i.uniform3iv(this.addr,t),qe(e,t)}}function Xx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Xe(e,t))return;i.uniform4iv(this.addr,t),qe(e,t)}}function qx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Yx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Xe(e,t))return;i.uniform2uiv(this.addr,t),qe(e,t)}}function Zx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Xe(e,t))return;i.uniform3uiv(this.addr,t),qe(e,t)}}function $x(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Xe(e,t))return;i.uniform4uiv(this.addr,t),qe(e,t)}}function Jx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(xh.compareFunction=e.isReversedDepthBuffer()?bl:Sl,r=xh):r=cf,e.setTexture2D(t||r,s)}function Kx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||uf,s)}function jx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||df,s)}function Qx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||hf,s)}function t_(i){switch(i){case 5126:return Ux;case 35664:return Fx;case 35665:return Ox;case 35666:return Bx;case 35674:return zx;case 35675:return kx;case 35676:return Hx;case 5124:case 35670:return Gx;case 35667:case 35671:return Vx;case 35668:case 35672:return Wx;case 35669:case 35673:return Xx;case 5125:return qx;case 36294:return Yx;case 36295:return Zx;case 36296:return $x;case 35678:case 36198:case 36298:case 36306:case 35682:return Jx;case 35679:case 36299:case 36307:return Kx;case 35680:case 36300:case 36308:case 36293:return jx;case 36289:case 36303:case 36311:case 36292:return Qx}}function e_(i,t){i.uniform1fv(this.addr,t)}function n_(i,t){let e=hr(t,this.size,2);i.uniform2fv(this.addr,e)}function i_(i,t){let e=hr(t,this.size,3);i.uniform3fv(this.addr,e)}function s_(i,t){let e=hr(t,this.size,4);i.uniform4fv(this.addr,e)}function r_(i,t){let e=hr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function a_(i,t){let e=hr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function o_(i,t){let e=hr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function l_(i,t){i.uniform1iv(this.addr,t)}function c_(i,t){i.uniform2iv(this.addr,t)}function h_(i,t){i.uniform3iv(this.addr,t)}function u_(i,t){i.uniform4iv(this.addr,t)}function d_(i,t){i.uniform1uiv(this.addr,t)}function f_(i,t){i.uniform2uiv(this.addr,t)}function p_(i,t){i.uniform3uiv(this.addr,t)}function m_(i,t){i.uniform4uiv(this.addr,t)}function g_(i,t,e){let n=this.cache,s=t.length,r=Cl(e,s);Xe(n,r)||(i.uniform1iv(this.addr,r),qe(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=xh:a=cf;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function x_(i,t,e){let n=this.cache,s=t.length,r=Cl(e,s);Xe(n,r)||(i.uniform1iv(this.addr,r),qe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||uf,r[a])}function __(i,t,e){let n=this.cache,s=t.length,r=Cl(e,s);Xe(n,r)||(i.uniform1iv(this.addr,r),qe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||df,r[a])}function v_(i,t,e){let n=this.cache,s=t.length,r=Cl(e,s);Xe(n,r)||(i.uniform1iv(this.addr,r),qe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||hf,r[a])}function y_(i){switch(i){case 5126:return e_;case 35664:return n_;case 35665:return i_;case 35666:return s_;case 35674:return r_;case 35675:return a_;case 35676:return o_;case 5124:case 35670:return l_;case 35667:case 35671:return c_;case 35668:case 35672:return h_;case 35669:case 35673:return u_;case 5125:return d_;case 36294:return f_;case 36295:return p_;case 36296:return m_;case 35678:case 36198:case 36298:case 36306:case 35682:return g_;case 35679:case 36299:case 36307:return x_;case 35680:case 36300:case 36308:case 36293:return __;case 36289:case 36303:case 36311:case 36292:return v_}}var _h=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=t_(e.type)}},vh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=y_(e.type)}},yh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},mh=/(\w+)(\])?(\[|\.)?/g;function Zd(i,t){i.seq.push(t),i.map[t.id]=t}function M_(i,t,e){let n=i.name,s=n.length;for(mh.lastIndex=0;;){let r=mh.exec(n),a=mh.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Zd(e,c===void 0?new _h(o,i,t):new vh(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new yh(o),Zd(e,d)),e=d}}}var lr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);M_(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function $d(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var S_=37297,b_=0;function w_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Jd=new jt;function E_(i){le._getMatrix(Jd,le.workingColorSpace,i);let t=`mat3( ${Jd.elements.map(e=>e.toFixed(4))} )`;switch(le.getTransfer(i)){case Ar:return[t,"LinearTransferOETF"];case ye:return[t,"sRGBTransferOETF"];default:return Wt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Kd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+w_(i.getShaderSource(t),o)}else return r}function T_(i,t){let e=E_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var A_={[kc]:"Linear",[Hc]:"Reinhard",[Gc]:"Cineon",[Qr]:"ACESFilmic",[Wc]:"AgX",[Xc]:"Neutral",[Vc]:"Custom"};function R_(i,t){let e=A_[t];return e===void 0?(Wt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var El=new L;function C_(){le.getLuminanceCoefficients(El);let i=El.x.toFixed(4),t=El.y.toFixed(4),e=El.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function I_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ua).join(`
`)}function P_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function L_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ua(i){return i!==""}function jd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Qd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var D_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mh(i){return i.replace(D_,U_)}var N_=new Map;function U_(i,t){let e=ie[t];if(e===void 0){let n=N_.get(t);if(n!==void 0)e=ie[n],Wt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Mh(e)}var F_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tf(i){return i.replace(F_,O_)}function O_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ef(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}var B_={[ms]:"SHADOWMAP_TYPE_PCF",[er]:"SHADOWMAP_TYPE_VSM"};function z_(i){return B_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var k_={[Zi]:"ENVMAP_TYPE_CUBE",[xs]:"ENVMAP_TYPE_CUBE",[ta]:"ENVMAP_TYPE_CUBE_UV"};function H_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":k_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var G_={[xs]:"ENVMAP_MODE_REFRACTION"};function V_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":G_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var W_={[Uo]:"ENVMAP_BLENDING_MULTIPLY",[pd]:"ENVMAP_BLENDING_MIX",[md]:"ENVMAP_BLENDING_ADD"};function X_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":W_[i.combine]||"ENVMAP_BLENDING_NONE"}function q_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Y_(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=z_(e),c=H_(e),h=V_(e),d=X_(e),u=q_(e),f=I_(e),g=P_(r),M=s.createProgram(),p,m,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ua).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ua).join(`
`),m.length>0&&(m+=`
`)):(p=[ef(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ua).join(`
`),m=[ef(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Zn?"#define TONE_MAPPING":"",e.toneMapping!==Zn?ie.tonemapping_pars_fragment:"",e.toneMapping!==Zn?R_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,T_("linearToOutputTexel",e.outputColorSpace),C_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ua).join(`
`)),a=Mh(a),a=jd(a,e),a=Qd(a,e),o=Mh(o),o=jd(o,e),o=Qd(o,e),a=tf(a),o=tf(o),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===Qc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Qc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let b=T+p+a,x=T+m+o,S=$d(s,s.VERTEX_SHADER,b),v=$d(s,s.FRAGMENT_SHADER,x);s.attachShader(M,S),s.attachShader(M,v),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function A(P){if(i.debug.checkShaderErrors){let N=s.getProgramInfoLog(M)||"",H=s.getShaderInfoLog(S)||"",D=s.getShaderInfoLog(v)||"",k=N.trim(),Y=H.trim(),q=D.trim(),K=!0,B=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,S,v);else{let X=Kd(s,S,"vertex"),I=Kd(s,v,"fragment");Yt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+X+`
`+I)}else k!==""?Wt("WebGLProgram: Program Info Log:",k):(Y===""||q==="")&&(B=!1);B&&(P.diagnostics={runnable:K,programLog:k,vertexShader:{log:Y,prefix:p},fragmentShader:{log:q,prefix:m}})}s.deleteShader(S),s.deleteShader(v),_=new lr(s,M),E=L_(s,M)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(M,S_)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=b_++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=S,this.fragmentShader=v,this}var Z_=0,Sh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new bh(t),e.set(t,n)),n}},bh=class{constructor(t){this.id=Z_++,this.code=t,this.usedTimes=0}};function $_(i){return i===Ki||i===aa||i===oa}function J_(i,t,e,n,s,r){let a=new Ir,o=new Sh,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function M(_,E,C,P,N,H){let D=P.fog,k=N.geometry,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,K=t.get(_.envMap||Y,q),B=K&&K.mapping===ta?K.image.height:null,X=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Wt("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let I=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,rt=I!==void 0?I.length:0,lt=0;k.morphAttributes.position!==void 0&&(lt=1),k.morphAttributes.normal!==void 0&&(lt=2),k.morphAttributes.color!==void 0&&(lt=3);let mt,Ct,W,F;if(X){let Ee=ui[X];mt=Ee.vertexShader,Ct=Ee.fragmentShader}else{mt=_.vertexShader,Ct=_.fragmentShader;let Ee=o.getVertexShaderStage(_),xe=o.getFragmentShaderStage(_);o.update(_,Ee,xe),W=Ee.id,F=xe.id}let G=i.getRenderTarget(),it=i.state.buffers.depth.getReversed(),ft=N.isInstancedMesh===!0,ct=N.isBatchedMesh===!0,xt=!!_.map,Ot=!!_.matcap,Q=!!K,at=!!_.aoMap,ut=!!_.lightMap,dt=!!_.bumpMap&&_.wireframe===!1,vt=!!_.normalMap,Gt=!!_.displacementMap,Ht=!!_.emissiveMap,Zt=!!_.metalnessMap,Qt=!!_.roughnessMap,U=_.anisotropy>0,ge=_.clearcoat>0,re=_.dispersion>0,R=_.retroreflectivity>0,y=_.iridescence>0,V=_.sheen>0,J=_.transmission>0,tt=U&&!!_.anisotropyMap,pt=ge&&!!_.clearcoatMap,_t=ge&&!!_.clearcoatNormalMap,et=ge&&!!_.clearcoatRoughnessMap,st=y&&!!_.iridescenceMap,yt=y&&!!_.iridescenceThicknessMap,Bt=V&&!!_.sheenColorMap,wt=V&&!!_.sheenRoughnessMap,Mt=!!_.specularMap,zt=!!_.specularColorMap,Vt=!!_.specularIntensityMap,te=J&&!!_.transmissionMap,z=J&&!!_.thicknessMap,St=!!_.gradientMap,nt=!!_.alphaMap,bt=_.alphaTest>0,Rt=!!_.alphaHash,ot=!!_.extensions,kt=Zn;_.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(kt=i.toneMapping);let Ut={shaderID:X,shaderType:_.type,shaderName:_.name,vertexShader:mt,fragmentShader:Ct,defines:_.defines,customVertexShaderID:W,customFragmentShaderID:F,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:ct,batchingColor:ct&&N._colorsTexture!==null,instancing:ft,instancingColor:ft&&N.instanceColor!==null,instancingMorph:ft&&N.morphTexture!==null,outputColorSpace:G===null?i.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:le.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:xt,matcap:Ot,envMap:Q,envMapMode:Q&&K.mapping,envMapCubeUVHeight:B,aoMap:at,lightMap:ut,bumpMap:dt,normalMap:vt,displacementMap:Gt,emissiveMap:Ht,normalMapObjectSpace:vt&&_.normalMapType===_d,normalMapTangentSpace:vt&&_.normalMapType===la,packedNormalMap:vt&&_.normalMapType===la&&$_(_.normalMap.format),metalnessMap:Zt,roughnessMap:Qt,anisotropy:U,anisotropyMap:tt,clearcoat:ge,clearcoatMap:pt,clearcoatNormalMap:_t,clearcoatRoughnessMap:et,dispersion:re,retroreflection:R,iridescence:y,iridescenceMap:st,iridescenceThicknessMap:yt,sheen:V,sheenColorMap:Bt,sheenRoughnessMap:wt,specularMap:Mt,specularColorMap:zt,specularIntensityMap:Vt,transmission:J,transmissionMap:te,thicknessMap:z,gradientMap:St,opaque:_.transparent===!1&&_.blending===nr&&_.alphaToCoverage===!1,alphaMap:nt,alphaTest:bt,alphaHash:Rt,combine:_.combine,mapUv:xt&&g(_.map.channel),aoMapUv:at&&g(_.aoMap.channel),lightMapUv:ut&&g(_.lightMap.channel),bumpMapUv:dt&&g(_.bumpMap.channel),normalMapUv:vt&&g(_.normalMap.channel),displacementMapUv:Gt&&g(_.displacementMap.channel),emissiveMapUv:Ht&&g(_.emissiveMap.channel),metalnessMapUv:Zt&&g(_.metalnessMap.channel),roughnessMapUv:Qt&&g(_.roughnessMap.channel),anisotropyMapUv:tt&&g(_.anisotropyMap.channel),clearcoatMapUv:pt&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:_t&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:st&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:yt&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:wt&&g(_.sheenRoughnessMap.channel),specularMapUv:Mt&&g(_.specularMap.channel),specularColorMapUv:zt&&g(_.specularColorMap.channel),specularIntensityMapUv:Vt&&g(_.specularIntensityMap.channel),transmissionMapUv:te&&g(_.transmissionMap.channel),thicknessMapUv:z&&g(_.thicknessMap.channel),alphaMapUv:nt&&g(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(vt||U),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!k.attributes.uv&&(xt||nt),fog:!!D,useFog:_.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&vt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:it,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:lt,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:kt,decodeVideoTexture:xt&&_.map.isVideoTexture===!0&&le.getTransfer(_.map.colorSpace)===ye,decodeVideoTextureEmissive:Ht&&_.emissiveMap.isVideoTexture===!0&&le.getTransfer(_.emissiveMap.colorSpace)===ye,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===nn,flipSided:_.side===en,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ot&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ot&&_.extensions.multiDraw===!0||ct)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ut.vertexUv1s=l.has(1),Ut.vertexUv2s=l.has(2),Ut.vertexUv3s=l.has(3),l.clear(),Ut}function p(_){let E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(let C in _.defines)E.push(C),E.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(m(E,_),T(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function m(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numSunLights),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numSunLightShadows),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function T(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function b(_){let E=f[_.type],C;if(E){let P=ui[E];C=Fd.clone(P.uniforms)}else C=_.uniforms;return C}function x(_,E){let C=h.get(E);return C!==void 0?++C.usedTimes:(C=new Y_(i,E,_,s),c.push(C),h.set(E,C)),C}function S(_){if(--_.usedTimes===0){let E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function v(_){o.remove(_)}function A(){o.dispose()}return{getParameters:M,getProgramCacheKey:p,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:v,programs:c,dispose:A}}function K_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function j_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function nf(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function sf(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,M,p,m){let T=i[t];return T===void 0?(T={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:M,renderOrder:u.renderOrder,z:p,group:m},i[t]=T):(T.id=u.id,T.object=u,T.geometry=f,T.material=g,T.materialVariant=a(u),T.groupOrder=M,T.renderOrder=u.renderOrder,T.z=p,T.group=m),t++,T}function l(u,f,g,M,p,m,T){T.reversedDepth===!0&&(p=-p);let b=o(u,f,g,M,p,m);g.transmission>0?n.push(b):g.transparent===!0?s.push(b):e.push(b)}function c(u,f,g,M,p,m){let T=o(u,f,g,M,p,m);g.transmission>0?n.unshift(T):g.transparent===!0?s.unshift(T):e.unshift(T)}function h(u,f){e.length>1&&e.sort(u||j_),n.length>1&&n.sort(f||nf),s.length>1&&s.sort(f||nf)}function d(){for(let u=t,f=i.length;u<f;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Q_(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new sf,i.set(n,[a])):s>=r.length?(a=new sf,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function tv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new L,color:new $t};break;case"SpotLight":e={position:new L,direction:new L,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function ev(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var nv=0;function iv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function sv(i){let t=new tv,e=ev(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new me,a=new me;function o(c){let h=0,d=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let f=0,g=0,M=0,p=0,m=0,T=0,b=0,x=0,S=0,v=0,A=0,_=0,E=0,C=0;c.sort(iv);for(let N=0,H=c.length;N<H;N++){let D=c[N],k=D.color,Y=D.intensity,q=D.distance,K=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Ki?K=D.shadow.map.texture:K=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=k.r*Y,d+=k.g*Y,u+=k.b*Y;else if(D.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(D.sh.coefficients[B],Y);C++}else if(D.isSunLight){let B=t.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let X=D.shadow,I=e.get(D);I.shadowIntensity=X.intensity,I.shadowBias=X.bias,I.shadowNormalBias=X.normalBias,I.shadowRadius=X.radius,I.shadowMapSize.copy(X.mapSize).multiply(X.getFrameExtents()),n.sunShadow[g]=I,n.sunShadowMap[g]=K;let rt=X.getViewportCount();for(let lt=0;lt<rt;lt++)n.sunShadowMatrix[M+lt]=X.getMatrix(lt),n.sunShadowCascade[M+lt]=X._cascadeData[lt];M+=rt,g++}n.sun[f]=B,f++}else if(D.isDirectionalLight){let B=t.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let X=D.shadow,I=e.get(D);I.shadowIntensity=X.intensity,I.shadowBias=X.bias,I.shadowNormalBias=X.normalBias,I.shadowRadius=X.radius,I.shadowMapSize=X.mapSize,n.directionalShadow[p]=I,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=D.shadow.matrix,S++}n.directional[p]=B,p++}else if(D.isSpotLight){let B=t.get(D);B.position.setFromMatrixPosition(D.matrixWorld),B.color.copy(k).multiplyScalar(Y),B.distance=q,B.coneCos=Math.cos(D.angle),B.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),B.decay=D.decay,n.spot[T]=B;let X=D.shadow;if(D.map&&(n.spotLightMap[_]=D.map,_++,X.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[T]=X.matrix,D.castShadow){let I=e.get(D);I.shadowIntensity=X.intensity,I.shadowBias=X.bias,I.shadowNormalBias=X.normalBias,I.shadowRadius=X.radius,I.shadowMapSize=X.mapSize,n.spotShadow[T]=I,n.spotShadowMap[T]=K,A++}T++}else if(D.isRectAreaLight){let B=t.get(D);B.color.copy(k).multiplyScalar(Y),B.halfWidth.set(D.width*.5,0,0),B.halfHeight.set(0,D.height*.5,0),n.rectArea[b]=B,b++}else if(D.isPointLight){let B=t.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),B.distance=D.distance,B.decay=D.decay,D.castShadow){let X=D.shadow,I=e.get(D);I.shadowIntensity=X.intensity,I.shadowBias=X.bias,I.shadowNormalBias=X.normalBias,I.shadowRadius=X.radius,I.shadowMapSize=X.mapSize,I.shadowCameraNear=X.camera.near,I.shadowCameraFar=X.camera.far,n.pointShadow[m]=I,n.pointShadowMap[m]=K,n.pointShadowMatrix[m]=D.shadow.matrix,v++}n.point[m]=B,m++}else if(D.isHemisphereLight){let B=t.get(D);B.skyColor.copy(D.color).multiplyScalar(Y),B.groundColor.copy(D.groundColor).multiplyScalar(Y),n.hemi[x]=B,x++}}b>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Et.LTC_FLOAT_1,n.rectAreaLTC2=Et.LTC_FLOAT_2):(n.rectAreaLTC1=Et.LTC_HALF_1,n.rectAreaLTC2=Et.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let P=n.hash;(P.sunLength!==f||P.directionalLength!==p||P.pointLength!==m||P.spotLength!==T||P.rectAreaLength!==b||P.hemiLength!==x||P.numSunShadows!==g||P.numDirectionalShadows!==S||P.numPointShadows!==v||P.numSpotShadows!==A||P.numSpotMaps!==_||P.numLightProbes!==C)&&(n.sun.length=f,n.directional.length=p,n.spot.length=T,n.rectArea.length=b,n.point.length=m,n.hemi.length=x,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=v,n.pointShadowMap.length=v,n.pointShadowMatrix.length=v,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+_-E,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,P.sunLength=f,P.directionalLength=p,P.pointLength=m,P.spotLength=T,P.rectAreaLength=b,P.hemiLength=x,P.numSunShadows=g,P.numDirectionalShadows=S,P.numPointShadows=v,P.numSpotShadows=A,P.numSpotMaps=_,P.numLightProbes=C,n.version=nv++)}function l(c,h){let d=0,u=0,f=0,g=0,M=0,p=0,m=h.matrixWorldInverse;for(let T=0,b=c.length;T<b;T++){let x=c[T];if(x.isSunLight){let S=n.sun[d];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(m),d++}else if(x.isDirectionalLight){let S=n.directional[u];S.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),u++}else if(x.isSpotLight){let S=n.spot[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),g++}else if(x.isRectAreaLight){let S=n.rectArea[M];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(m),a.identity(),r.copy(x.matrixWorld),r.premultiply(m),a.extractRotation(r),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),M++}else if(x.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){let S=n.hemi[p];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(m),p++}}}return{setup:o,setupView:l,state:n}}function rf(i){let t=new sv(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function rv(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new rf(i),t.set(s,[o])):r>=a.length?(o=new rf(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var av=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ov=`uniform sampler2D shadow_pass;
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
}`,lv=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],cv=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],af=new me,ha=new L,gh=new L;function hv(i,t,e){let n=new $s,s=new ht,r=new ht,a=new De,o=new vo,l=new yo,c={},h=e.maxTextureSize,d={[Yi]:en,[en]:Yi,[nn]:nn},u=new ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:av,fragmentShader:ov}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let g=new Re;g.setAttribute("position",new Ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Kt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ms;let m=this.type;this.render=function(v,A,_){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||v.length===0)return;this.type===$u&&(Wt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ms);let E=i.getRenderTarget(),C=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),N=i.state;N.setBlending(ci),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let H=m!==this.type;H&&A.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(k=>k.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,k=v.length;D<k;D++){let Y=v[D],q=Y.shadow;if(q===void 0){Wt("WebGLShadowMap:",Y,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let K=q.getFrameExtents();s.multiply(K),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,q.mapSize.y=r.y));let B=i.state.buffers.depth.getReversed();if(q.camera._reversedDepth=B,q.map===null||H===!0){if(q.map!==null&&(q.map.depthTexture!==null&&(q.map.depthTexture.dispose(),q.map.depthTexture=null),q.map.dispose()),this.type===er){if(Y.isPointLight){Wt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}q.map=new mn(s.x,s.y,{format:Ki,type:Jn,minFilter:Qe,magFilter:Qe,generateMipmaps:!1}),q.map.texture.name=Y.name+".shadowMap",q.map.depthTexture=new Gi(s.x,s.y,Ln),q.map.depthTexture.name=Y.name+".shadowMapDepth",q.map.depthTexture.format=ri,q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Je,q.map.depthTexture.magFilter=Je}else Y.isPointLight?(q.map=new Tl(s.x),q.map.depthTexture=new uo(s.x,$n)):(q.map=new mn(s.x,s.y),q.map.depthTexture=new Gi(s.x,s.y,$n)),q.map.depthTexture.name=Y.name+".shadowMap",q.map.depthTexture.format=ri,this.type===ms?(q.map.depthTexture.compareFunction=B?bl:Sl,q.map.depthTexture.minFilter=Qe,q.map.depthTexture.magFilter=Qe):(q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Je,q.map.depthTexture.magFilter=Je);q.camera.updateProjectionMatrix()}q.map.isWebGLCubeRenderTarget!==!0&&(q.map.width!==s.x||q.map.height!==s.y)&&q.map.setSize(s.x,s.y);let X=q.map.isWebGLCubeRenderTarget?6:q.getViewportCount();Y.isPointLight!==!0&&q.updateMatrices(Y,_);for(let I=0;I<X;I++){let rt=q.getCamera(I);if(Y.isPointLight){let lt=q.camera,mt=q.matrix,Ct=Y.distance||lt.far;Ct!==lt.far&&(lt.far=Ct,lt.updateProjectionMatrix()),ha.setFromMatrixPosition(Y.matrixWorld),lt.position.copy(ha),gh.copy(lt.position),gh.add(lv[I]),lt.up.copy(cv[I]),lt.lookAt(gh),lt.updateMatrixWorld(),mt.makeTranslation(-ha.x,-ha.y,-ha.z),af.multiplyMatrices(lt.projectionMatrix,lt.matrixWorldInverse),q._frustum.setFromProjectionMatrix(af,lt.coordinateSystem,lt.reversedDepth)}if(q.map.isWebGLCubeRenderTarget)i.setRenderTarget(q.map,I),i.clear();else{I===0&&(i.setRenderTarget(q.map),i.clear());let lt=q.getViewport(I);a.set(r.x*lt.x,r.y*lt.y,r.x*lt.z,r.y*lt.w),N.viewport(a)}n=q.getFrustum(I),x(A,_,rt,Y,this.type)}q.isPointLightShadow!==!0&&this.type===er&&T(q,_),q.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(E,C,P)};function T(v,A){let _=t.update(M);u.defines.VSM_SAMPLES!==v.blurSamples&&(u.defines.VSM_SAMPLES=v.blurSamples,f.defines.VSM_SAMPLES=v.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),v.mapPass===null?v.mapPass=new mn(s.x,s.y,{format:Ki,type:Jn}):(v.mapPass.width!==v.map.width||v.mapPass.height!==v.map.height)&&v.mapPass.setSize(v.map.width,v.map.height),u.uniforms.shadow_pass.value=v.map.depthTexture,u.uniforms.resolution.value.set(v.map.width,v.map.height),u.uniforms.radius.value=v.radius,i.setRenderTarget(v.mapPass),i.clear(),i.renderBufferDirect(A,null,_,u,M,null),f.uniforms.shadow_pass.value=v.mapPass.texture,f.uniforms.resolution.value.set(v.map.width,v.map.height),f.uniforms.radius.value=v.radius,i.setRenderTarget(v.map),i.clear(),i.renderBufferDirect(A,null,_,f,M,null)}function b(v,A,_,E){let C=null,P=_.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(P!==void 0)C=P;else if(C=_.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let N=C.uuid,H=A.uuid,D=c[N];D===void 0&&(D={},c[N]=D);let k=D[H];k===void 0&&(k=C.clone(),D[H]=k,A.addEventListener("dispose",S)),C=k}if(C.visible=A.visible,C.wireframe=A.wireframe,E===er?C.side=A.shadowSide!==null?A.shadowSide:A.side:C.side=A.shadowSide!==null?A.shadowSide:d[A.side],C.alphaMap=A.alphaMap,C.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,C.map=A.map,C.clipShadows=A.clipShadows,C.clippingPlanes=A.clippingPlanes,C.clipIntersection=A.clipIntersection,C.displacementMap=A.displacementMap,C.displacementScale=A.displacementScale,C.displacementBias=A.displacementBias,C.wireframeLinewidth=A.wireframeLinewidth,C.linewidth=A.linewidth,_.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let N=i.properties.get(C);N.light=_}return C}function x(v,A,_,E,C){if(v.visible===!1)return;if(v.layers.test(A.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&C===er)&&(!v.frustumCulled||v.intersectsFrustum(n))){v.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,v.matrixWorld);let H=t.update(v),D=v.material;if(Array.isArray(D)){let k=H.groups;for(let Y=0,q=k.length;Y<q;Y++){let K=k[Y],B=D[K.materialIndex];if(B&&B.visible){let X=b(v,B,E,C);v.onBeforeShadow(i,v,A,_,H,X,K),i.renderBufferDirect(_,null,H,X,v,K),v.onAfterShadow(i,v,A,_,H,X,K)}}}else if(D.visible){let k=b(v,D,E,C);v.onBeforeShadow(i,v,A,_,H,k,null),i.renderBufferDirect(_,null,H,k,v,null),v.onAfterShadow(i,v,A,_,H,k,null)}}let N=v.children;for(let H=0,D=N.length;H<D;H++)x(N[H],A,_,E,C)}function S(v){v.target.removeEventListener("dispose",S);for(let _ in c){let E=c[_],C=v.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function uv(i,t){function e(){let z=!1,St=new De,nt=null,bt=new De(0,0,0,0);return{setMask:function(Rt){nt!==Rt&&!z&&(i.colorMask(Rt,Rt,Rt,Rt),nt=Rt)},setLocked:function(Rt){z=Rt},setClear:function(Rt,ot,kt,Ut,Ee){Ee===!0&&(Rt*=Ut,ot*=Ut,kt*=Ut),St.set(Rt,ot,kt,Ut),bt.equals(St)===!1&&(i.clearColor(Rt,ot,kt,Ut),bt.copy(St))},reset:function(){z=!1,nt=null,bt.set(-1,0,0,0)}}}function n(){let z=!1,St=!1,nt=null,bt=null,Rt=null;return{setReversed:function(ot){if(St!==ot){let kt=t.get("EXT_clip_control");ot?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT),St=ot;let Ut=Rt;Rt=null,this.setClear(Ut)}},getReversed:function(){return St},setTest:function(ot){ot?G(i.DEPTH_TEST):it(i.DEPTH_TEST)},setMask:function(ot){nt!==ot&&!z&&(i.depthMask(ot),nt=ot)},setFunc:function(ot){if(St&&(ot=Id[ot]),bt!==ot){switch(ot){case ja:i.depthFunc(i.NEVER);break;case Qa:i.depthFunc(i.ALWAYS);break;case to:i.depthFunc(i.LESS);break;case Gs:i.depthFunc(i.LEQUAL);break;case eo:i.depthFunc(i.EQUAL);break;case no:i.depthFunc(i.GEQUAL);break;case io:i.depthFunc(i.GREATER);break;case so:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}bt=ot}},setLocked:function(ot){z=ot},setClear:function(ot){Rt!==ot&&(Rt=ot,St&&(ot=1-ot),i.clearDepth(ot))},reset:function(){z=!1,nt=null,bt=null,Rt=null,St=!1}}}function s(){let z=!1,St=null,nt=null,bt=null,Rt=null,ot=null,kt=null,Ut=null,Ee=null;return{setTest:function(xe){z||(xe?G(i.STENCIL_TEST):it(i.STENCIL_TEST))},setMask:function(xe){St!==xe&&!z&&(i.stencilMask(xe),St=xe)},setFunc:function(xe,Un,Qn){(nt!==xe||bt!==Un||Rt!==Qn)&&(i.stencilFunc(xe,Un,Qn),nt=xe,bt=Un,Rt=Qn)},setOp:function(xe,Un,Qn){(ot!==xe||kt!==Un||Ut!==Qn)&&(i.stencilOp(xe,Un,Qn),ot=xe,kt=Un,Ut=Qn)},setLocked:function(xe){z=xe},setClear:function(xe){Ee!==xe&&(i.clearStencil(xe),Ee=xe)},reset:function(){z=!1,St=null,nt=null,bt=null,Rt=null,ot=null,kt=null,Ut=null,Ee=null}}}let r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,g=[],M=null,p=!1,m=null,T=null,b=null,x=null,S=null,v=null,A=null,_=new $t(0,0,0),E=0,C=!1,P=null,N=null,H=null,D=null,k=null,Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,K=0,B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(B)[1]),q=K>=1):B.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),q=K>=2);let X=null,I={},rt=i.getParameter(i.SCISSOR_BOX),lt=i.getParameter(i.VIEWPORT),mt=new De().fromArray(rt),Ct=new De().fromArray(lt);function W(z,St,nt,bt){let Rt=new Uint8Array(4),ot=i.createTexture();i.bindTexture(z,ot),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let kt=0;kt<nt;kt++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(St,0,i.RGBA,1,1,bt,0,i.RGBA,i.UNSIGNED_BYTE,Rt):i.texImage2D(St+kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Rt);return ot}let F={};F[i.TEXTURE_2D]=W(i.TEXTURE_2D,i.TEXTURE_2D,1),F[i.TEXTURE_CUBE_MAP]=W(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),F[i.TEXTURE_2D_ARRAY]=W(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),F[i.TEXTURE_3D]=W(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),G(i.DEPTH_TEST),a.setFunc(Gs),dt(!1),vt(Nc),G(i.CULL_FACE),at(ci);function G(z){h[z]!==!0&&(i.enable(z),h[z]=!0)}function it(z){h[z]!==!1&&(i.disable(z),h[z]=!1)}function ft(z,St){return u[z]!==St?(i.bindFramebuffer(z,St),u[z]=St,z===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=St),z===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=St),!0):!1}function ct(z,St){let nt=g,bt=!1;if(z){nt=f.get(St),nt===void 0&&(nt=[],f.set(St,nt));let Rt=z.textures;if(nt.length!==Rt.length||nt[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,kt=Rt.length;ot<kt;ot++)nt[ot]=i.COLOR_ATTACHMENT0+ot;nt.length=Rt.length,bt=!0}}else nt[0]!==i.BACK&&(nt[0]=i.BACK,bt=!0);bt&&i.drawBuffers(nt)}function xt(z){return M!==z?(i.useProgram(z),M=z,!0):!1}let Ot={[gs]:i.FUNC_ADD,[Ku]:i.FUNC_SUBTRACT,[ju]:i.FUNC_REVERSE_SUBTRACT};Ot[Qu]=i.MIN,Ot[td]=i.MAX;let Q={[ed]:i.ZERO,[nd]:i.ONE,[id]:i.SRC_COLOR,[Bc]:i.SRC_ALPHA,[cd]:i.SRC_ALPHA_SATURATE,[od]:i.DST_COLOR,[rd]:i.DST_ALPHA,[sd]:i.ONE_MINUS_SRC_COLOR,[zc]:i.ONE_MINUS_SRC_ALPHA,[ld]:i.ONE_MINUS_DST_COLOR,[ad]:i.ONE_MINUS_DST_ALPHA,[hd]:i.CONSTANT_COLOR,[ud]:i.ONE_MINUS_CONSTANT_COLOR,[dd]:i.CONSTANT_ALPHA,[fd]:i.ONE_MINUS_CONSTANT_ALPHA};function at(z,St,nt,bt,Rt,ot,kt,Ut,Ee,xe){if(z===ci){p===!0&&(it(i.BLEND),p=!1);return}if(p===!1&&(G(i.BLEND),p=!0),z!==Ju){if(z!==m||xe!==C){if((T!==gs||S!==gs)&&(i.blendEquation(i.FUNC_ADD),T=gs,S=gs),xe)switch(z){case nr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uc:i.blendFunc(i.ONE,i.ONE);break;case Fc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Yt("WebGLState: Invalid blending: ",z);break}else switch(z){case nr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Fc:Yt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Oc:Yt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Yt("WebGLState: Invalid blending: ",z);break}b=null,x=null,v=null,A=null,_.set(0,0,0),E=0,m=z,C=xe}return}Rt=Rt||St,ot=ot||nt,kt=kt||bt,(St!==T||Rt!==S)&&(i.blendEquationSeparate(Ot[St],Ot[Rt]),T=St,S=Rt),(nt!==b||bt!==x||ot!==v||kt!==A)&&(i.blendFuncSeparate(Q[nt],Q[bt],Q[ot],Q[kt]),b=nt,x=bt,v=ot,A=kt),(Ut.equals(_)===!1||Ee!==E)&&(i.blendColor(Ut.r,Ut.g,Ut.b,Ee),_.copy(Ut),E=Ee),m=z,C=!1}function ut(z,St){z.side===nn?it(i.CULL_FACE):G(i.CULL_FACE);let nt=z.side===en;St&&(nt=!nt),dt(nt),z.blending===nr&&z.transparent===!1?at(ci):at(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),a.setFunc(z.depthFunc),a.setTest(z.depthTest),a.setMask(z.depthWrite),r.setMask(z.colorWrite);let bt=z.stencilWrite;o.setTest(bt),bt&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ht(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?G(i.SAMPLE_ALPHA_TO_COVERAGE):it(i.SAMPLE_ALPHA_TO_COVERAGE)}function dt(z){P!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),P=z)}function vt(z){z!==Yu?(G(i.CULL_FACE),z!==N&&(z===Nc?i.cullFace(i.BACK):z===Zu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):it(i.CULL_FACE),N=z}function Gt(z){z!==H&&(q&&i.lineWidth(z),H=z)}function Ht(z,St,nt){z?(G(i.POLYGON_OFFSET_FILL),(D!==St||k!==nt)&&(D=St,k=nt,a.getReversed()&&(St=-St),i.polygonOffset(St,nt))):it(i.POLYGON_OFFSET_FILL)}function Zt(z){z?G(i.SCISSOR_TEST):it(i.SCISSOR_TEST)}function Qt(z){z===void 0&&(z=i.TEXTURE0+Y-1),X!==z&&(i.activeTexture(z),X=z)}function U(z,St,nt){nt===void 0&&(X===null?nt=i.TEXTURE0+Y-1:nt=X);let bt=I[nt];bt===void 0&&(bt={type:void 0,texture:void 0},I[nt]=bt),(bt.type!==z||bt.texture!==St)&&(X!==nt&&(i.activeTexture(nt),X=nt),i.bindTexture(z,St||F[z]),bt.type=z,bt.texture=St)}function ge(){let z=I[X];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function re(){try{i.compressedTexImage2D(...arguments)}catch(z){Yt("WebGLState:",z)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(z){Yt("WebGLState:",z)}}function y(){try{i.texSubImage2D(...arguments)}catch(z){Yt("WebGLState:",z)}}function V(){try{i.texSubImage3D(...arguments)}catch(z){Yt("WebGLState:",z)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(z){Yt("WebGLState:",z)}}function tt(){try{i.compressedTexSubImage3D(...arguments)}catch(z){Yt("WebGLState:",z)}}function pt(){try{i.texStorage2D(...arguments)}catch(z){Yt("WebGLState:",z)}}function _t(){try{i.texStorage3D(...arguments)}catch(z){Yt("WebGLState:",z)}}function et(){try{i.texImage2D(...arguments)}catch(z){Yt("WebGLState:",z)}}function st(){try{i.texImage3D(...arguments)}catch(z){Yt("WebGLState:",z)}}function yt(z){return d[z]!==void 0?d[z]:i.getParameter(z)}function Bt(z,St){d[z]!==St&&(i.pixelStorei(z,St),d[z]=St)}function wt(z){mt.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),mt.copy(z))}function Mt(z){Ct.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),Ct.copy(z))}function zt(z,St){let nt=c.get(St);nt===void 0&&(nt=new WeakMap,c.set(St,nt));let bt=nt.get(z);bt===void 0&&(bt=i.getUniformBlockIndex(St,z.name),nt.set(z,bt))}function Vt(z,St){let bt=c.get(St).get(z);l.get(St)!==bt&&(i.uniformBlockBinding(St,bt,z.__bindingPointIndex),l.set(St,bt))}function te(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},X=null,I={},u={},f=new WeakMap,g=[],M=null,p=!1,m=null,T=null,b=null,x=null,S=null,v=null,A=null,_=new $t(0,0,0),E=0,C=!1,P=null,N=null,H=null,D=null,k=null,mt.set(0,0,i.canvas.width,i.canvas.height),Ct.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:G,disable:it,bindFramebuffer:ft,drawBuffers:ct,useProgram:xt,setBlending:at,setMaterial:ut,setFlipSided:dt,setCullFace:vt,setLineWidth:Gt,setPolygonOffset:Ht,setScissorTest:Zt,activeTexture:Qt,bindTexture:U,unbindTexture:ge,compressedTexImage2D:re,compressedTexImage3D:R,texImage2D:et,texImage3D:st,pixelStorei:Bt,getParameter:yt,updateUBOMapping:zt,uniformBlockBinding:Vt,texStorage2D:pt,texStorage3D:_t,texSubImage2D:y,texSubImage3D:V,compressedTexSubImage2D:J,compressedTexSubImage3D:tt,scissor:wt,viewport:Mt,reset:te}}function dv(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,h=new WeakMap,d=new Set,u,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(R,y){return g?new OffscreenCanvas(R,y):Rr("canvas")}function p(R,y,V){let J=1,tt=re(R);if((tt.width>V||tt.height>V)&&(J=V/Math.max(tt.width,tt.height)),J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let pt=Math.floor(J*tt.width),_t=Math.floor(J*tt.height);u===void 0&&(u=M(pt,_t));let et=y?M(pt,_t):u;return et.width=pt,et.height=_t,et.getContext("2d").drawImage(R,0,0,pt,_t),Wt("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+pt+"x"+_t+")."),et}else return"data"in R&&Wt("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),R;return R}function m(R){return R.generateMipmaps}function T(R){i.generateMipmap(R)}function b(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(R,y,V,J,tt,pt=!1){if(R!==null){if(i[R]!==void 0)return i[R];Wt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let _t;J&&(_t=t.get("EXT_texture_norm16"),_t||Wt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let et=y;if(y===i.RED&&(V===i.FLOAT&&(et=i.R32F),V===i.HALF_FLOAT&&(et=i.R16F),V===i.UNSIGNED_BYTE&&(et=i.R8),V===i.UNSIGNED_SHORT&&_t&&(et=_t.R16_EXT),V===i.SHORT&&_t&&(et=_t.R16_SNORM_EXT)),y===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(et=i.R8UI),V===i.UNSIGNED_SHORT&&(et=i.R16UI),V===i.UNSIGNED_INT&&(et=i.R32UI),V===i.BYTE&&(et=i.R8I),V===i.SHORT&&(et=i.R16I),V===i.INT&&(et=i.R32I)),y===i.RG&&(V===i.FLOAT&&(et=i.RG32F),V===i.HALF_FLOAT&&(et=i.RG16F),V===i.UNSIGNED_BYTE&&(et=i.RG8),V===i.UNSIGNED_SHORT&&_t&&(et=_t.RG16_EXT),V===i.SHORT&&_t&&(et=_t.RG16_SNORM_EXT)),y===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(et=i.RG8UI),V===i.UNSIGNED_SHORT&&(et=i.RG16UI),V===i.UNSIGNED_INT&&(et=i.RG32UI),V===i.BYTE&&(et=i.RG8I),V===i.SHORT&&(et=i.RG16I),V===i.INT&&(et=i.RG32I)),y===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(et=i.RGB8UI),V===i.UNSIGNED_SHORT&&(et=i.RGB16UI),V===i.UNSIGNED_INT&&(et=i.RGB32UI),V===i.BYTE&&(et=i.RGB8I),V===i.SHORT&&(et=i.RGB16I),V===i.INT&&(et=i.RGB32I)),y===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(et=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(et=i.RGBA16UI),V===i.UNSIGNED_INT&&(et=i.RGBA32UI),V===i.BYTE&&(et=i.RGBA8I),V===i.SHORT&&(et=i.RGBA16I),V===i.INT&&(et=i.RGBA32I)),y===i.RGB&&(V===i.UNSIGNED_SHORT&&_t&&(et=_t.RGB16_EXT),V===i.SHORT&&_t&&(et=_t.RGB16_SNORM_EXT),V===i.UNSIGNED_INT_5_9_9_9_REV&&(et=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(et=i.R11F_G11F_B10F)),y===i.RGBA){let st=pt?Ar:le.getTransfer(tt);V===i.FLOAT&&(et=i.RGBA32F),V===i.HALF_FLOAT&&(et=i.RGBA16F),V===i.UNSIGNED_BYTE&&(et=st===ye?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT&&_t&&(et=_t.RGBA16_EXT),V===i.SHORT&&_t&&(et=_t.RGBA16_SNORM_EXT),V===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function S(R,y){let V;return R?y===null||y===$n||y===sr?V=i.DEPTH24_STENCIL8:y===Ln?V=i.DEPTH32F_STENCIL8:y===ir&&(V=i.DEPTH24_STENCIL8,Wt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===$n||y===sr?V=i.DEPTH_COMPONENT24:y===Ln?V=i.DEPTH_COMPONENT32F:y===ir&&(V=i.DEPTH_COMPONENT16),V}function v(R,y){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Je&&R.minFilter!==Qe?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function A(R){let y=R.target;y.removeEventListener("dispose",A),E(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&d.delete(y)}function _(R){let y=R.target;y.removeEventListener("dispose",_),P(y)}function E(R){let y=n.get(R);if(y.__webglInit===void 0)return;let V=R.source,J=f.get(V);if(J){let tt=J[y.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&C(R),Object.keys(J).length===0&&f.delete(V)}n.remove(R)}function C(R){let y=n.get(R);i.deleteTexture(y.__webglTexture);let V=R.source,J=f.get(V);delete J[y.__cacheKey],a.memory.textures--}function P(R){let y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(y.__webglFramebuffer[J]))for(let tt=0;tt<y.__webglFramebuffer[J].length;tt++)i.deleteFramebuffer(y.__webglFramebuffer[J][tt]);else i.deleteFramebuffer(y.__webglFramebuffer[J]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[J])}else{if(Array.isArray(y.__webglFramebuffer))for(let J=0;J<y.__webglFramebuffer.length;J++)i.deleteFramebuffer(y.__webglFramebuffer[J]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let J=0;J<y.__webglColorRenderbuffer.length;J++)y.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[J]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let V=R.textures;for(let J=0,tt=V.length;J<tt;J++){let pt=n.get(V[J]);pt.__webglTexture&&(i.deleteTexture(pt.__webglTexture),a.memory.textures--),n.remove(V[J])}n.remove(R)}let N=0;function H(){N=0}function D(){return N}function k(R){N=R}function Y(){let R=N;return R>=s.maxTextures&&Wt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,R}function q(R){let y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function K(R,y){let V=n.get(R);if(R.isVideoTexture&&U(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&V.__version!==R.version){let J=R.image;if(J===null)Wt("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)Wt("WebGLRenderer: Texture marked for update but image is incomplete");else{it(V,R,y);return}}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+y)}function B(R,y){let V=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){it(V,R,y);return}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+y)}function X(R,y){let V=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){it(V,R,y);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+y)}function I(R,y){let V=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&V.__version!==R.version){ft(V,R,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+y)}let rt={[bi]:i.REPEAT,[si]:i.CLAMP_TO_EDGE,[ro]:i.MIRRORED_REPEAT},lt={[Je]:i.NEAREST,[gd]:i.NEAREST_MIPMAP_NEAREST,[ea]:i.NEAREST_MIPMAP_LINEAR,[Qe]:i.LINEAR,[Bo]:i.LINEAR_MIPMAP_NEAREST,[$i]:i.LINEAR_MIPMAP_LINEAR},mt={[yd]:i.NEVER,[Ed]:i.ALWAYS,[Md]:i.LESS,[Sl]:i.LEQUAL,[Sd]:i.EQUAL,[bl]:i.GEQUAL,[bd]:i.GREATER,[wd]:i.NOTEQUAL};function Ct(R,y){if(y.type===Ln&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Qe||y.magFilter===Bo||y.magFilter===ea||y.magFilter===$i||y.minFilter===Qe||y.minFilter===Bo||y.minFilter===ea||y.minFilter===$i)&&Wt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,rt[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,rt[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,rt[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,lt[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,lt[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,mt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Je||y.minFilter!==ea&&y.minFilter!==$i||y.type===Ln&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function W(R,y){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",A));let J=y.source,tt=f.get(J);tt===void 0&&(tt={},f.set(J,tt));let pt=q(y);if(pt!==R.__cacheKey){tt[pt]===void 0&&(tt[pt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),tt[pt].usedTimes++;let _t=tt[R.__cacheKey];_t!==void 0&&(tt[R.__cacheKey].usedTimes--,_t.usedTimes===0&&C(y)),R.__cacheKey=pt,R.__webglTexture=tt[pt].texture}return V}function F(R,y,V){return Math.floor(Math.floor(R/V)/y)}function G(R,y,V,J){let pt=R.updateRanges;if(pt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,V,J,y.data);else{pt.sort((Bt,wt)=>Bt.start-wt.start);let _t=0;for(let Bt=1;Bt<pt.length;Bt++){let wt=pt[_t],Mt=pt[Bt],zt=wt.start+wt.count,Vt=F(Mt.start,y.width,4),te=F(wt.start,y.width,4);Mt.start<=zt+1&&Vt===te&&F(Mt.start+Mt.count-1,y.width,4)===Vt?wt.count=Math.max(wt.count,Mt.start+Mt.count-wt.start):(++_t,pt[_t]=Mt)}pt.length=_t+1;let et=e.getParameter(i.UNPACK_ROW_LENGTH),st=e.getParameter(i.UNPACK_SKIP_PIXELS),yt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let Bt=0,wt=pt.length;Bt<wt;Bt++){let Mt=pt[Bt],zt=Math.floor(Mt.start/4),Vt=Math.ceil(Mt.count/4),te=zt%y.width,z=Math.floor(zt/y.width),St=Vt,nt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,te),e.pixelStorei(i.UNPACK_SKIP_ROWS,z),e.texSubImage2D(i.TEXTURE_2D,0,te,z,St,nt,V,J,y.data)}R.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,et),e.pixelStorei(i.UNPACK_SKIP_PIXELS,st),e.pixelStorei(i.UNPACK_SKIP_ROWS,yt)}}function it(R,y,V){let J=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(J=i.TEXTURE_3D);let tt=W(R,y),pt=y.source;e.bindTexture(J,R.__webglTexture,i.TEXTURE0+V);let _t=n.get(pt);if(pt.version!==_t.__version||tt===!0){if(e.activeTexture(i.TEXTURE0+V),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){let nt=le.getPrimaries(le.workingColorSpace),bt=y.colorSpace===Ti?null:le.getPrimaries(y.colorSpace),Rt=y.colorSpace===Ti||nt===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt)}e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment);let st=p(y.image,!1,s.maxTextureSize);st=ge(y,st);let yt=r.convert(y.format,y.colorSpace),Bt=r.convert(y.type),wt=x(y.internalFormat,yt,Bt,y.normalized,y.colorSpace,y.isVideoTexture);Ct(J,y);let Mt,zt=y.mipmaps,Vt=y.isVideoTexture!==!0,te=_t.__version===void 0||tt===!0,z=pt.dataReady,St=v(y,st);if(y.isDepthTexture)wt=S(y.format===Ji,y.type),te&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,wt,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,wt,st.width,st.height,0,yt,Bt,null));else if(y.isDataTexture)if(zt.length>0){Vt&&te&&e.texStorage2D(i.TEXTURE_2D,St,wt,zt[0].width,zt[0].height);for(let nt=0,bt=zt.length;nt<bt;nt++)Mt=zt[nt],Vt?z&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,Mt.width,Mt.height,yt,Bt,Mt.data):e.texImage2D(i.TEXTURE_2D,nt,wt,Mt.width,Mt.height,0,yt,Bt,Mt.data);y.generateMipmaps=!1}else Vt?(te&&e.texStorage2D(i.TEXTURE_2D,St,wt,st.width,st.height),z&&G(y,st,yt,Bt)):e.texImage2D(i.TEXTURE_2D,0,wt,st.width,st.height,0,yt,Bt,st.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Vt&&te&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,wt,zt[0].width,zt[0].height,st.depth);for(let nt=0,bt=zt.length;nt<bt;nt++)if(Mt=zt[nt],y.format!==Dn)if(yt!==null)if(Vt){if(z)if(y.layerUpdates.size>0){let Rt=rh(Mt.width,Mt.height,y.format,y.type);for(let ot of y.layerUpdates){let kt=Mt.data.subarray(ot*Rt/Mt.data.BYTES_PER_ELEMENT,(ot+1)*Rt/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,ot,Mt.width,Mt.height,1,yt,kt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,0,Mt.width,Mt.height,st.depth,yt,Mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,nt,wt,Mt.width,Mt.height,st.depth,0,Mt.data,0,0);else Wt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?z&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,0,Mt.width,Mt.height,st.depth,yt,Bt,Mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,nt,wt,Mt.width,Mt.height,st.depth,0,yt,Bt,Mt.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{Vt&&te&&e.texStorage2D(i.TEXTURE_2D,St,wt,zt[0].width,zt[0].height);for(let nt=0,bt=zt.length;nt<bt;nt++)Mt=zt[nt],y.format!==Dn?yt!==null?Vt?z&&e.compressedTexSubImage2D(i.TEXTURE_2D,nt,0,0,Mt.width,Mt.height,yt,Mt.data):e.compressedTexImage2D(i.TEXTURE_2D,nt,wt,Mt.width,Mt.height,0,Mt.data):Wt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?z&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,Mt.width,Mt.height,yt,Bt,Mt.data):e.texImage2D(i.TEXTURE_2D,nt,wt,Mt.width,Mt.height,0,yt,Bt,Mt.data)}else if(y.isDataArrayTexture)if(Vt){if(te&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,wt,st.width,st.height,st.depth),z)if(y.layerUpdates.size>0){let nt=rh(st.width,st.height,y.format,y.type);for(let bt of y.layerUpdates){let Rt=st.data.subarray(bt*nt/st.data.BYTES_PER_ELEMENT,(bt+1)*nt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,bt,st.width,st.height,1,yt,Bt,Rt)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,yt,Bt,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,wt,st.width,st.height,st.depth,0,yt,Bt,st.data);else if(y.isData3DTexture)Vt?(te&&e.texStorage3D(i.TEXTURE_3D,St,wt,st.width,st.height,st.depth),z&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,yt,Bt,st.data)):e.texImage3D(i.TEXTURE_3D,0,wt,st.width,st.height,st.depth,0,yt,Bt,st.data);else if(y.isFramebufferTexture){if(te)if(Vt)e.texStorage2D(i.TEXTURE_2D,St,wt,st.width,st.height);else{let nt=st.width,bt=st.height;for(let Rt=0;Rt<St;Rt++)e.texImage2D(i.TEXTURE_2D,Rt,wt,nt,bt,0,yt,Bt,null),nt>>=1,bt>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in i){let nt=i.canvas;if(nt.hasAttribute("layoutsubtree")||nt.setAttribute("layoutsubtree","true"),st.parentNode!==nt){nt.appendChild(st),d.add(y),nt.onpaint=bt=>{let Rt=bt.changedElements;for(let ot of d)Rt.includes(ot.image)&&(ot.needsUpdate=!0)},nt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,st);else{let Rt=i.RGBA,ot=i.RGBA,kt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Rt,ot,kt,st)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(zt.length>0){if(Vt&&te){let nt=re(zt[0]);e.texStorage2D(i.TEXTURE_2D,St,wt,nt.width,nt.height)}for(let nt=0,bt=zt.length;nt<bt;nt++)Mt=zt[nt],Vt?z&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,yt,Bt,Mt):e.texImage2D(i.TEXTURE_2D,nt,wt,yt,Bt,Mt);y.generateMipmaps=!1}else if(Vt){if(te){let nt=re(st);e.texStorage2D(i.TEXTURE_2D,St,wt,nt.width,nt.height)}z&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,yt,Bt,st)}else e.texImage2D(i.TEXTURE_2D,0,wt,yt,Bt,st);m(y)&&T(J),_t.__version=pt.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function ft(R,y,V){if(y.image.length!==6)return;let J=W(R,y),tt=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+V);let pt=n.get(tt);if(tt.version!==pt.__version||J===!0){e.activeTexture(i.TEXTURE0+V);let _t=le.getPrimaries(le.workingColorSpace),et=y.colorSpace===Ti?null:le.getPrimaries(y.colorSpace),st=y.colorSpace===Ti||_t===et?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let yt=y.isCompressedTexture||y.image[0].isCompressedTexture,Bt=y.image[0]&&y.image[0].isDataTexture,wt=[];for(let ot=0;ot<6;ot++)!yt&&!Bt?wt[ot]=p(y.image[ot],!0,s.maxCubemapSize):wt[ot]=Bt?y.image[ot].image:y.image[ot],wt[ot]=ge(y,wt[ot]);let Mt=wt[0],zt=r.convert(y.format,y.colorSpace),Vt=r.convert(y.type),te=x(y.internalFormat,zt,Vt,y.normalized,y.colorSpace),z=y.isVideoTexture!==!0,St=pt.__version===void 0||J===!0,nt=tt.dataReady,bt=v(y,Mt);Ct(i.TEXTURE_CUBE_MAP,y);let Rt;if(yt){z&&St&&e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,te,Mt.width,Mt.height);for(let ot=0;ot<6;ot++){Rt=wt[ot].mipmaps;for(let kt=0;kt<Rt.length;kt++){let Ut=Rt[kt];y.format!==Dn?zt!==null?z?nt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt,0,0,Ut.width,Ut.height,zt,Ut.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt,te,Ut.width,Ut.height,0,Ut.data):Wt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt,0,0,Ut.width,Ut.height,zt,Vt,Ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt,te,Ut.width,Ut.height,0,zt,Vt,Ut.data)}}}else{if(Rt=y.mipmaps,z&&St){Rt.length>0&&bt++;let ot=re(wt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,te,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(Bt){z?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,wt[ot].width,wt[ot].height,zt,Vt,wt[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,te,wt[ot].width,wt[ot].height,0,zt,Vt,wt[ot].data);for(let kt=0;kt<Rt.length;kt++){let Ee=Rt[kt].image[ot].image;z?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt+1,0,0,Ee.width,Ee.height,zt,Vt,Ee.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt+1,te,Ee.width,Ee.height,0,zt,Vt,Ee.data)}}else{z?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,zt,Vt,wt[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,te,zt,Vt,wt[ot]);for(let kt=0;kt<Rt.length;kt++){let Ut=Rt[kt];z?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt+1,0,0,zt,Vt,Ut.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,kt+1,te,zt,Vt,Ut.image[ot])}}}m(y)&&T(i.TEXTURE_CUBE_MAP),pt.__version=tt.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function ct(R,y,V,J,tt,pt){let _t=r.convert(V.format,V.colorSpace),et=r.convert(V.type),st=x(V.internalFormat,_t,et,V.normalized,V.colorSpace),yt=n.get(y),Bt=n.get(V);if(Bt.__renderTarget=y,!yt.__hasExternalTextures){let wt=Math.max(1,y.width>>pt),Mt=Math.max(1,y.height>>pt);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,pt,st,wt,Mt,y.depth,0,_t,et,null):e.texImage2D(tt,pt,st,wt,Mt,0,_t,et,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),Qt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,tt,Bt.__webglTexture,0,Zt(y)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,tt,Bt.__webglTexture,pt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function xt(R,y,V){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){let J=y.depthTexture,tt=J&&J.isDepthTexture?J.type:null,pt=S(y.stencilBuffer,tt),_t=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Qt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Zt(y),pt,y.width,y.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,Zt(y),pt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,pt,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_t,i.RENDERBUFFER,R)}else{let J=y.textures;for(let tt=0;tt<J.length;tt++){let pt=J[tt],_t=r.convert(pt.format,pt.colorSpace),et=r.convert(pt.type),st=x(pt.internalFormat,_t,et,pt.normalized,pt.colorSpace);Qt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Zt(y),st,y.width,y.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,Zt(y),st,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,st,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ot(R,y,V){let J=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let tt=n.get(y.depthTexture);if(tt.__renderTarget=y,(!tt.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),J){if(tt.__webglInit===void 0&&(tt.__webglInit=!0,y.depthTexture.addEventListener("dispose",A)),tt.__webglTexture===void 0){tt.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),Ct(i.TEXTURE_CUBE_MAP,y.depthTexture);let yt=r.convert(y.depthTexture.format),Bt=r.convert(y.depthTexture.type),wt;y.depthTexture.format===ri?wt=i.DEPTH_COMPONENT24:y.depthTexture.format===Ji&&(wt=i.DEPTH24_STENCIL8);for(let Mt=0;Mt<6;Mt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,wt,y.width,y.height,0,yt,Bt,null)}}else K(y.depthTexture,0);let pt=tt.__webglTexture,_t=Zt(y),et=J?i.TEXTURE_CUBE_MAP_POSITIVE_X+V:i.TEXTURE_2D,st=y.depthTexture.format===Ji?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(y.depthTexture.format===ri)Qt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,et,pt,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,st,et,pt,0);else if(y.depthTexture.format===Ji)Qt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,et,pt,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,st,et,pt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Q(R){let y=n.get(R),V=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){let J=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),J){let tt=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,J.removeEventListener("dispose",tt)};J.addEventListener("dispose",tt),y.__depthDisposeCallback=tt}y.__boundDepthTexture=J}if(R.depthTexture&&!y.__autoAllocateDepthBuffer)if(V)for(let J=0;J<6;J++)Ot(y.__webglFramebuffer[J],R,J);else{let J=R.texture.mipmaps;J&&J.length>0?Ot(y.__webglFramebuffer[0],R,0):Ot(y.__webglFramebuffer,R,0)}else if(V){y.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[J]),y.__webglDepthbuffer[J]===void 0)y.__webglDepthbuffer[J]=i.createRenderbuffer(),xt(y.__webglDepthbuffer[J],R,!1);else{let tt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=y.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,pt),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,pt)}}else{let J=R.texture.mipmaps;if(J&&J.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),xt(y.__webglDepthbuffer,R,!1);else{let tt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,pt),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,pt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function at(R,y,V){let J=n.get(R);y!==void 0&&ct(J.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Q(R)}function ut(R){let y=R.texture,V=n.get(R),J=n.get(y);R.addEventListener("dispose",_);let tt=R.textures,pt=R.isWebGLCubeRenderTarget===!0,_t=tt.length>1;if(_t||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=y.version,a.memory.textures++),pt){V.__webglFramebuffer=[];for(let et=0;et<6;et++)if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer[et]=[];for(let st=0;st<y.mipmaps.length;st++)V.__webglFramebuffer[et][st]=i.createFramebuffer()}else V.__webglFramebuffer[et]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer=[];for(let et=0;et<y.mipmaps.length;et++)V.__webglFramebuffer[et]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(_t)for(let et=0,st=tt.length;et<st;et++){let yt=n.get(tt[et]);yt.__webglTexture===void 0&&(yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&Qt(R)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let et=0;et<tt.length;et++){let st=tt[et];V.__webglColorRenderbuffer[et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[et]);let yt=r.convert(st.format,st.colorSpace),Bt=r.convert(st.type),wt=x(st.internalFormat,yt,Bt,st.normalized,st.colorSpace,R.isXRRenderTarget===!0),Mt=Zt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,wt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+et,i.RENDERBUFFER,V.__webglColorRenderbuffer[et])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),xt(V.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(pt){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Ct(i.TEXTURE_CUBE_MAP,y);for(let et=0;et<6;et++)if(y.mipmaps&&y.mipmaps.length>0)for(let st=0;st<y.mipmaps.length;st++)ct(V.__webglFramebuffer[et][st],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,st);else ct(V.__webglFramebuffer[et],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);m(y)&&T(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_t){for(let et=0,st=tt.length;et<st;et++){let yt=tt[et],Bt=n.get(yt),wt=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(wt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(wt,Bt.__webglTexture),Ct(wt,yt),ct(V.__webglFramebuffer,R,yt,i.COLOR_ATTACHMENT0+et,wt,0),m(yt)&&T(wt)}e.unbindTexture()}else{let et=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(et=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(et,J.__webglTexture),Ct(et,y),y.mipmaps&&y.mipmaps.length>0)for(let st=0;st<y.mipmaps.length;st++)ct(V.__webglFramebuffer[st],R,y,i.COLOR_ATTACHMENT0,et,st);else ct(V.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,et,0);m(y)&&T(et),e.unbindTexture()}R.depthBuffer&&Q(R)}function dt(R){let y=R.textures;for(let V=0,J=y.length;V<J;V++){let tt=y[V];if(m(tt)){let pt=b(R),_t=n.get(tt).__webglTexture;e.bindTexture(pt,_t),T(pt),e.unbindTexture()}}}let vt=[],Gt=[];function Ht(R){if(R.samples>0){if(Qt(R)===!1){let y=R.textures,V=R.width,J=R.height,tt=i.COLOR_BUFFER_BIT,pt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(R),et=y.length>1;if(et)for(let yt=0;yt<y.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer);let st=R.texture.mipmaps;st&&st.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let yt=0;yt<y.length;yt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[yt]);let Bt=n.get(y[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Bt,0)}i.blitFramebuffer(0,0,V,J,0,0,V,J,tt,i.NEAREST),l===!0&&(vt.length=0,Gt.length=0,vt.push(i.COLOR_ATTACHMENT0+yt),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(vt.push(pt),Gt.push(pt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Gt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,vt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),et)for(let yt=0;yt<y.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,_t.__webglColorRenderbuffer[yt]);let Bt=n.get(y[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,Bt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function Zt(R){return Math.min(s.maxSamples,R.samples)}function Qt(R){let y=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function U(R){let y=a.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function ge(R,y){let V=R.colorSpace,J=R.format,tt=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==Tr&&V!==Ti&&(le.getTransfer(V)===ye?(J!==Dn||tt!==_n)&&Wt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Yt("WebGLTextures: Unsupported texture color space:",V)),y}function re(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=H,this.getTextureUnits=D,this.setTextureUnits=k,this.setTexture2D=K,this.setTexture2DArray=B,this.setTexture3D=X,this.setTextureCube=I,this.rebindTextures=at,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=dt,this.updateMultisampleRenderTarget=Ht,this.setupDepthRenderbuffer=Q,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=Qt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function fv(i,t){function e(n,s=Ti){let r,a=le.getTransfer(s);if(n===_n)return i.UNSIGNED_BYTE;if(n===ko)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ho)return i.UNSIGNED_SHORT_5_5_5_1;if(n===$c)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Jc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Yc)return i.BYTE;if(n===Zc)return i.SHORT;if(n===ir)return i.UNSIGNED_SHORT;if(n===zo)return i.INT;if(n===$n)return i.UNSIGNED_INT;if(n===Ln)return i.FLOAT;if(n===Jn)return i.HALF_FLOAT;if(n===Kc)return i.ALPHA;if(n===jc)return i.RGB;if(n===Dn)return i.RGBA;if(n===ri)return i.DEPTH_COMPONENT;if(n===Ji)return i.DEPTH_STENCIL;if(n===Go)return i.RED;if(n===Vo)return i.RED_INTEGER;if(n===Ki)return i.RG;if(n===Wo)return i.RG_INTEGER;if(n===Xo)return i.RGBA_INTEGER;if(n===na||n===ia||n===sa||n===ra)if(a===ye)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qo||n===Yo||n===Zo||n===$o)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Yo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$o)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Jo||n===Ko||n===jo||n===Qo||n===tl||n===aa||n===el)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Jo||n===Ko)return a===ye?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===jo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Qo)return r.COMPRESSED_R11_EAC;if(n===tl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===aa)return r.COMPRESSED_RG11_EAC;if(n===el)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===nl||n===il||n===sl||n===rl||n===al||n===ol||n===ll||n===cl||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===nl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===il)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===sl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===rl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===al)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ol)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ll)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===cl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===hl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ul)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===dl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===pl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ml)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===gl||n===xl||n===_l)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===gl)return a===ye?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===_l)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===vl||n===yl||n===oa||n===Ml)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===vl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===yl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ml)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===sr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var pv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,mv=`
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

}`,wh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Or(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new ln({vertexShader:pv,fragmentShader:mv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Kt(new gn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Eh=class extends ai{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null,M=typeof XRWebGLBinding<"u",p=new wh,m={},T=e.getContextAttributes(),b=null,x=null,S=[],v=[],A=new ht,_=null,E=null,C=new on;C.viewport=new De;let P=new on;P.viewport=new De;let N=[C,P],H=new Do,D=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(F){let G=S[F];return G===void 0&&(G=new qs,S[F]=G),G.getTargetRaySpace()},this.getControllerGrip=function(F){let G=S[F];return G===void 0&&(G=new qs,S[F]=G),G.getGripSpace()},this.getHand=function(F){let G=S[F];return G===void 0&&(G=new qs,S[F]=G),G.getHandSpace()};function Y(F){let G=v.indexOf(F.inputSource);if(G===-1)return;let it=S[G];it!==void 0&&(it.update(F.inputSource,F.frame,c||a),it.dispatchEvent({type:F.type,data:F.inputSource}))}function q(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",K);for(let F=0;F<S.length;F++){let G=v[F];G!==null&&(v[F]=null,S[F].disconnect(G))}D=null,k=null,p.reset();for(let F in m)delete m[F];if(t.setRenderTarget(b),f=null,u=null,d=null,s=null,x=null,W.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(A.width,A.height,!1),E!==null){let F=E.camera;F.fov=E.fov,F.zoom=E.zoom,F.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(F){r=F,n.isPresenting===!0&&Wt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(F){o=F,n.isPresenting===!0&&Wt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(F){c=F},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&M&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(F){if(s=F,s!==null){if(b=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",q),s.addEventListener("inputsourceschange",K),T.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(A),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,ft=null,ct=null;T.depth&&(ct=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=T.stencil?Ji:ri,ft=T.stencil?sr:$n);let xt={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(xt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new mn(u.textureWidth,u.textureHeight,{format:Dn,type:_n,depthTexture:new Gi(u.textureWidth,u.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let it={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new mn(f.framebufferWidth,f.framebufferHeight,{format:Dn,type:_n,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),W.setContext(s),W.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function K(F){for(let G=0;G<F.removed.length;G++){let it=F.removed[G],ft=v.indexOf(it);ft>=0&&(v[ft]=null,S[ft].disconnect(it))}for(let G=0;G<F.added.length;G++){let it=F.added[G],ft=v.indexOf(it);if(ft===-1){for(let xt=0;xt<S.length;xt++)if(xt>=v.length){v.push(it),ft=xt;break}else if(v[xt]===null){v[xt]=it,ft=xt;break}if(ft===-1)break}let ct=S[ft];ct&&ct.connect(it)}}let B=new L,X=new L;function I(F,G,it){B.setFromMatrixPosition(G.matrixWorld),X.setFromMatrixPosition(it.matrixWorld);let ft=B.distanceTo(X),ct=G.projectionMatrix.elements,xt=it.projectionMatrix.elements,Ot=ct[14]/(ct[10]-1),Q=ct[14]/(ct[10]+1),at=(ct[9]+1)/ct[5],ut=(ct[9]-1)/ct[5],dt=(ct[8]-1)/ct[0],vt=(xt[8]+1)/xt[0],Gt=Ot*dt,Ht=Ot*vt,Zt=ft/(-dt+vt),Qt=Zt*-dt;if(G.matrixWorld.decompose(F.position,F.quaternion,F.scale),F.translateX(Qt),F.translateZ(Zt),F.matrixWorld.compose(F.position,F.quaternion,F.scale),F.matrixWorldInverse.copy(F.matrixWorld).invert(),ct[10]===-1)F.projectionMatrix.copy(G.projectionMatrix),F.projectionMatrixInverse.copy(G.projectionMatrixInverse);else{let U=Ot+Zt,ge=Q+Zt,re=Gt-Qt,R=Ht+(ft-Qt),y=at*Q/ge*U,V=ut*Q/ge*U;F.projectionMatrix.makePerspective(re,R,y,V,U,ge),F.projectionMatrixInverse.copy(F.projectionMatrix).invert()}}function rt(F,G){G===null?F.matrixWorld.copy(F.matrix):F.matrixWorld.multiplyMatrices(G.matrixWorld,F.matrix),F.matrixWorldInverse.copy(F.matrixWorld).invert()}this.updateCamera=function(F){if(s===null)return;let G=F.near,it=F.far;p.texture!==null&&(p.depthNear>0&&(G=p.depthNear),p.depthFar>0&&(it=p.depthFar)),H.near=P.near=C.near=G,H.far=P.far=C.far=it,(D!==H.near||k!==H.far)&&(s.updateRenderState({depthNear:H.near,depthFar:H.far}),D=H.near,k=H.far),H.layers.mask=F.layers.mask|6,C.layers.mask=H.layers.mask&-5,P.layers.mask=H.layers.mask&-3;let ft=F.parent,ct=H.cameras;rt(H,ft);for(let xt=0;xt<ct.length;xt++)rt(ct[xt],ft);ct.length===2?I(H,C,P):H.projectionMatrix.copy(C.projectionMatrix),E===null&&F.isPerspectiveCamera&&(E={camera:F,fov:F.fov,zoom:F.zoom}),lt(F,H,ft)};function lt(F,G,it){it===null?F.matrix.copy(G.matrixWorld):(F.matrix.copy(it.matrixWorld),F.matrix.invert(),F.matrix.multiply(G.matrixWorld)),F.matrix.decompose(F.position,F.quaternion,F.scale),F.updateMatrixWorld(!0),F.projectionMatrix.copy(G.projectionMatrix),F.projectionMatrixInverse.copy(G.projectionMatrixInverse),F.isPerspectiveCamera&&(F.fov=oo*2*Math.atan(1/F.projectionMatrix.elements[5]),F.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(F){l=F,u!==null&&(u.fixedFoveation=F),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=F)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(H)},this.getCameraTexture=function(F){return m[F]};let mt=null;function Ct(F,G){if(h=G.getViewerPose(c||a),g=G,h!==null){let it=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let ft=!1;it.length!==H.cameras.length&&(H.cameras.length=0,ft=!0);for(let Q=0;Q<it.length;Q++){let at=it[Q],ut=null;if(f!==null)ut=f.getViewport(at);else{let vt=d.getViewSubImage(u,at);ut=vt.viewport,Q===0&&(t.setRenderTargetTextures(x,vt.colorTexture,vt.depthStencilTexture),t.setRenderTarget(x))}let dt=N[Q];dt===void 0&&(dt=new on,dt.layers.enable(Q),dt.viewport=new De,N[Q]=dt),dt.matrix.fromArray(at.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(at.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set(ut.x,ut.y,ut.width,ut.height),Q===0&&(H.matrix.copy(dt.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),ft===!0&&H.cameras.push(dt)}let ct=s.enabledFeatures;if(ct&&ct.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){d=n.getBinding();let Q=d.getDepthInformation(it[0]);Q&&Q.isValid&&Q.texture&&p.init(Q,s.renderState)}if(ct&&ct.includes("camera-access")&&M){t.state.unbindTexture(),d=n.getBinding();for(let Q=0;Q<it.length;Q++){let at=it[Q].camera;if(at){let ut=m[at];ut||(ut=new Or,m[at]=ut);let dt=d.getCameraImage(at);ut.sourceTexture=dt}}}}for(let it=0;it<S.length;it++){let ft=v[it],ct=S[it];ft!==null&&ct!==void 0&&ct.update(ft,G,c||a)}mt&&mt(F,G),G.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:G}),g=null}let W=new of;W.setAnimationLoop(Ct),this.setAnimationLoop=function(F){mt=F},this.dispose=function(){}}},gv=new me,ff=new jt;ff.set(-1,0,0,0,1,0,0,0,1);function xv(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,nh(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,T,b,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,x)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),M(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,T,b):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===en&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===en&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let T=t.get(m),b=T.envMap,x=T.envMapRotation;b&&(p.envMap.value=b,p.envMapRotation.value.setFromMatrix4(gv.makeRotationFromEuler(x)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(ff),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,T,b){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*T,p.scale.value=b*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,T){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===en&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function M(p,m){let T=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function _v(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){let v=S.program;n.uniformBlockBinding(x,v)}function c(x,S){let v=s[x.id];v===void 0&&(p(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",T));let A=S.program;n.updateUBOMapping(x,A);let _=t.render.frame;r[x.id]!==_&&(u(x),r[x.id]=_)}function h(x){let S=d();x.__bindingPointIndex=S;let v=i.createBuffer(),A=x.__size,_=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,A,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,v),v}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return Yt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){let S=s[x.id],v=x.uniforms,A=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let _=0,E=v.length;_<E;_++){let C=v[_];if(Array.isArray(C))for(let P=0,N=C.length;P<N;P++)f(C[P],_,P,A);else f(C,_,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,S,v,A){if(M(x,S,v,A)===!0){let _=x.__offset,E=x.value;if(Array.isArray(E)){let C=0;for(let P=0;P<E.length;P++){let N=E[P],H=m(N);g(N,x.__data,C),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(C+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,x.__data)}}function g(x,S,v){typeof x=="number"||typeof x=="boolean"?S[0]=x:x.isMatrix3?(S[0]=x.elements[0],S[1]=x.elements[1],S[2]=x.elements[2],S[3]=0,S[4]=x.elements[3],S[5]=x.elements[4],S[6]=x.elements[5],S[7]=0,S[8]=x.elements[6],S[9]=x.elements[7],S[10]=x.elements[8],S[11]=0):ArrayBuffer.isView(x)?S.set(new x.constructor(x.buffer,x.byteOffset,S.length)):x.toArray(S,v)}function M(x,S,v,A){let _=x.value,E=S+"_"+v;if(A[E]===void 0)return typeof _=="number"||typeof _=="boolean"?A[E]=_:ArrayBuffer.isView(_)?A[E]=_.slice():A[E]=_.clone(),!0;{let C=A[E];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return A[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(C.equals(_)===!1)return C.copy(_),!0}}return!1}function p(x){let S=x.uniforms,v=0,A=16;for(let E=0,C=S.length;E<C;E++){let P=Array.isArray(S[E])?S[E]:[S[E]];for(let N=0,H=P.length;N<H;N++){let D=P[N],k=Array.isArray(D.value)?D.value:[D.value];for(let Y=0,q=k.length;Y<q;Y++){let K=k[Y],B=m(K),X=v%A,I=X%B.boundary,rt=X+I;v+=I,rt!==0&&A-rt<B.storage&&(v+=A-rt),D.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=v,v+=B.storage}}}let _=v%A;return _>0&&(v+=A-_),x.__size=v,x.__cache={},this}function m(x){let S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?Wt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(S.boundary=16,S.storage=x.byteLength):Wt("WebGLRenderer: Unsupported uniform value type.",x),S}function T(x){let S=x.target;S.removeEventListener("dispose",T);let v=a.indexOf(S.__bindingPointIndex);a.splice(v,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function b(){for(let x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:b}}var vv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),hi=null;function yv(){return hi===null&&(hi=new Ur(vv,16,16,Ki,Jn),hi.name="DFG_LUT",hi.minFilter=Qe,hi.magFilter=Qe,hi.wrapS=si,hi.wrapT=si,hi.generateMipmaps=!1,hi.needsUpdate=!0),hi}var Al=class{constructor(t={}){let{canvas:e=Ad(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=_n}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let M=f,p=new Set([Xo,Wo,Vo]),m=new Set([_n,$n,ir,sr,ko,Ho]),T=new Uint32Array(4),b=new Int32Array(4),x=new L,S=null,v=null,A=[],_=[],E=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,P=!1,N=null,H=null,D=null,k=null;this._outputColorSpace=Fe;let Y=0,q=0,K=null,B=-1,X=null,I=new De,rt=new De,lt=null,mt=new $t(0),Ct=0,W=e.width,F=e.height,G=1,it=null,ft=null,ct=new De(0,0,W,F),xt=new De(0,0,W,F),Ot=!1,Q=new $s,at=!1,ut=!1,dt=new me,vt=new L,Gt=new De,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Zt=!1;function Qt(){return K===null?G:1}let U=n;function ge(w,O){return e.getContext(w,O)}let re,R,y,V,J,tt,pt,_t,et,st,yt,Bt,wt,Mt,zt,Vt,te,z,St,nt,bt,Rt,ot;try{let w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Ee,!1),e.addEventListener("webglcontextrestored",xe,!1),e.addEventListener("webglcontextcreationerror",Un,!1),U===null){let O="webgl2";if(U=ge(O,w),U===null)throw ge(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}kt()}catch(w){throw e.removeEventListener("webglcontextlost",Ee,!1),e.removeEventListener("webglcontextrestored",xe,!1),e.removeEventListener("webglcontextcreationerror",Un,!1),Yt("WebGLRenderer: "+w.message),w}function kt(){re=new Ax(U),re.init(),bt=new fv(U,re),R=new xx(U,re,t,bt),y=new uv(U,re),R.reversedDepthBuffer&&u&&y.buffers.depth.setReversed(!0),H=U.createFramebuffer(),D=U.createFramebuffer(),k=U.createFramebuffer(),V=new Ix(U),J=new K_,tt=new dv(U,re,y,J,R,bt,V),pt=new Tx(C),_t=new Lm(U),Rt=new mx(U,_t),et=new Rx(U,_t,V,Rt),st=new Lx(U,et,_t,Rt,V),z=new Px(U,R,tt),zt=new _x(J),yt=new J_(C,pt,re,R,Rt,zt),Bt=new xv(C,J),wt=new Q_,Mt=new rv(re),te=new px(C,pt,y,st,g,l),Vt=new hv(C,st,R),ot=new _v(U,V,R,y),St=new gx(U,re,V),nt=new Cx(U,re,V),V.programs=yt.programs,C.capabilities=R,C.extensions=re,C.properties=J,C.renderLists=wt,C.shadowMap=Vt,C.state=y,C.info=V}M!==_n&&(E=new Nx(M,e.width,e.height,o,s,r));let Ut=new Eh(C,U);this.xr=Ut,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let w=re.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=re.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(w){w!==void 0&&(G=w,this.setSize(W,F,!1))},this.getSize=function(w){return w.set(W,F)},this.setSize=function(w,O,j=!0){if(Ut.isPresenting){Wt("WebGLRenderer: Can't change size while VR device is presenting.");return}W=w,F=O,e.width=Math.floor(w*G),e.height=Math.floor(O*G),j===!0&&(e.style.width=w+"px",e.style.height=O+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(W*G,F*G).floor()},this.setDrawingBufferSize=function(w,O,j){W=w,F=O,G=j,e.width=Math.floor(w*j),e.height=Math.floor(O*j),this.setViewport(0,0,w,O)},this.setEffects=function(w){if(M===_n){Yt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let O=0;O<w.length;O++)if(w[O].isOutputPass===!0){Wt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(I)},this.getViewport=function(w){return w.copy(ct)},this.setViewport=function(w,O,j,Z){w.isVector4?ct.set(w.x,w.y,w.z,w.w):ct.set(w,O,j,Z),y.viewport(I.copy(ct).multiplyScalar(G).round())},this.getScissor=function(w){return w.copy(xt)},this.setScissor=function(w,O,j,Z){w.isVector4?xt.set(w.x,w.y,w.z,w.w):xt.set(w,O,j,Z),y.scissor(rt.copy(xt).multiplyScalar(G).round())},this.getScissorTest=function(){return Ot},this.setScissorTest=function(w){y.setScissorTest(Ot=w)},this.setOpaqueSort=function(w){it=w},this.setTransparentSort=function(w){ft=w},this.getClearColor=function(w){return w.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor(...arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha(...arguments)},this.clear=function(w=!0,O=!0,j=!0){let Z=0;if(w){let $=!1;if(K!==null){let At=K.texture.format;$=p.has(At)}if($){let At=K.texture.type,Lt=m.has(At),Tt=te.getClearColor(),Dt=te.getClearAlpha(),Ft=Tt.r,ne=Tt.g,ae=Tt.b;Lt?(T[0]=Ft,T[1]=ne,T[2]=ae,T[3]=Dt,U.clearBufferuiv(U.COLOR,0,T)):(b[0]=Ft,b[1]=ne,b[2]=ae,b[3]=Dt,U.clearBufferiv(U.COLOR,0,b))}else Z|=U.COLOR_BUFFER_BIT}O&&(Z|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),j&&(Z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z!==0&&U.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),N=w},this.dispose=function(){e.removeEventListener("webglcontextlost",Ee,!1),e.removeEventListener("webglcontextrestored",xe,!1),e.removeEventListener("webglcontextcreationerror",Un,!1),te.dispose(),wt.dispose(),Mt.dispose(),J.dispose(),pt.dispose(),st.dispose(),Rt.dispose(),ot.dispose(),yt.dispose(),Ut.dispose(),Ut.removeEventListener("sessionstart",Zh),Ut.removeEventListener("sessionend",$h),ts.stop()};function Ee(w){w.preventDefault(),th("WebGLRenderer: Context Lost."),P=!0}function xe(){th("WebGLRenderer: Context Restored."),P=!1;let w=V.autoReset,O=Vt.enabled,j=Vt.autoUpdate,Z=Vt.needsUpdate,$=Vt.type;kt(),V.autoReset=w,Vt.enabled=O,Vt.autoUpdate=j,Vt.needsUpdate=Z,Vt.type=$}function Un(w){Yt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Qn(w){let O=w.target;O.removeEventListener("dispose",Qn),Hf(O)}function Hf(w){Gf(w),J.remove(w)}function Gf(w){let O=J.get(w).programs;O!==void 0&&(O.forEach(function(j){yt.releaseProgram(j)}),w.isShaderMaterial&&yt.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,j,Z,$,At){O===null&&(O=Ht);let Lt=$.isMesh&&$.matrixWorld.determinantAffine()<0,Tt=Xf(w,O,j,Z,$);y.setMaterial(Z,Lt);let Dt=j.index,Ft=1;if(Z.wireframe===!0){if(Dt=et.getWireframeAttribute(j),Dt===void 0)return;Ft=2}let ne=j.drawRange,ae=j.attributes.position,Nt=ne.start*Ft,_e=(ne.start+ne.count)*Ft;At!==null&&(Nt=Math.max(Nt,At.start*Ft),_e=Math.min(_e,(At.start+At.count)*Ft)),Dt!==null?(Nt=Math.max(Nt,0),_e=Math.min(_e,Dt.count)):ae!=null&&(Nt=Math.max(Nt,0),_e=Math.min(_e,ae.count));let He=_e-Nt;if(He<0||He===1/0)return;Rt.setup($,Z,Tt,j,Dt);let Ce,be=St;if(Dt!==null&&(Ce=_t.get(Dt),be=nt,be.setIndex(Ce)),$.isMesh)Z.wireframe===!0?(y.setLineWidth(Z.wireframeLinewidth*Qt()),be.setMode(U.LINES)):be.setMode(U.TRIANGLES);else if($.isLine){let sn=Z.linewidth;sn===void 0&&(sn=1),y.setLineWidth(sn*Qt()),$.isLineSegments?be.setMode(U.LINES):$.isLineLoop?be.setMode(U.LINE_LOOP):be.setMode(U.LINE_STRIP)}else $.isPoints?be.setMode(U.POINTS):$.isSprite&&be.setMode(U.TRIANGLES);if($.isBatchedMesh)if(re.get("WEBGL_multi_draw"))be.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{let sn=$._multiDrawStarts,It=$._multiDrawCounts,hn=$._multiDrawCount,ue=Dt?_t.get(Dt).bytesPerElement:1,Rn=J.get(Z).currentProgram.getUniforms();for(let ti=0;ti<hn;ti++)Rn.setValue(U,"_gl_DrawID",ti),be.render(sn[ti]/ue,It[ti])}else if($.isInstancedMesh)be.renderInstances(Nt,He,$.count);else if(j.isInstancedBufferGeometry){let sn=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,It=Math.min(j.instanceCount,sn);be.renderInstances(Nt,He,It)}else be.render(Nt,He)};function Yh(w,O,j,Z){N!==null&&w.isNodeMaterial&&N.setObject(Z,w),at===!0&&zt.setState(w,j,!1),w.transparent===!0&&w.side===nn&&w.forceSinglePass===!1?(w.side=en,w.needsUpdate=!0,ya(w,O,Z),w.side=Yi,w.needsUpdate=!0,ya(w,O,Z),w.side=nn):ya(w,O,Z)}this.compile=function(w,O,j=null){j===null&&(j=w),N!==null&&N.renderStart(w,O,j),v=Mt.get(j),v.init(O),_.push(v),j.traverseVisible(function($){$.isLight&&$.layers.test(O.layers)&&(v.pushLight($),$.castShadow&&v.pushShadow($))}),w!==j&&w.traverseVisible(function($){$.isLight&&$.layers.test(O.layers)&&(v.pushLight($),$.castShadow&&v.pushShadow($))}),v.setupLights(),N!==null&&N.updateLights(v.state.lightsArray),ut=this.localClippingEnabled,at=zt.init(this.clippingPlanes,ut),at===!0&&zt.setGlobalState(this.clippingPlanes,O),N!==null&&Vt.render(v.state.shadowsArray,j,O);let Z=new Set;return w.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;let At=$.material;if(At)if(Array.isArray(At))for(let Lt=0;Lt<At.length;Lt++){let Tt=At[Lt];Yh(Tt,j,O,$),Z.add(Tt)}else Yh(At,j,O,$),Z.add(At)}),v=_.pop(),N!==null&&N.renderEnd(),Z},this.compileAsync=function(w,O,j=null){let Z=this.compile(w,O,j);return new Promise($=>{function At(){if(Z.forEach(function(Lt){let Dt=J.get(Lt).currentProgram;(Dt===void 0||Dt.isReady())&&Z.delete(Lt)}),Z.size===0){$(w);return}setTimeout(At,10)}re.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let Hl=null;function Vf(w){Hl&&Hl(w)}function Zh(){ts.stop()}function $h(){ts.start()}let ts=new of;ts.setAnimationLoop(Vf),typeof self<"u"&&ts.setContext(self),this.setAnimationLoop=function(w){Hl=w,Ut.setAnimationLoop(w),w===null?ts.stop():ts.start()},Ut.addEventListener("sessionstart",Zh),Ut.addEventListener("sessionend",$h),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){Yt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;N!==null&&N.renderStart(w,O);let j=Ut.enabled===!0&&Ut.isPresenting===!0,Z=E!==null&&(K===null||j)&&E.begin(C,K);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ut.enabled===!0&&Ut.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ut.cameraAutoUpdate===!0&&Ut.updateCamera(O),O=Ut.getCamera()),w.isScene===!0&&w.onBeforeRender(C,w,O,K),v=Mt.get(w,_.length),v.init(O),v.state.textureUnits=tt.getTextureUnits(),_.push(v),dt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Q.setFromProjectionMatrix(dt,Wn,O.reversedDepth),ut=this.localClippingEnabled,at=zt.init(this.clippingPlanes,ut),S=wt.get(w,A.length),S.init(),A.push(S),Ut.enabled===!0&&Ut.isPresenting===!0){let Lt=C.xr.getDepthSensingMesh();Lt!==null&&Gl(Lt,O,-1/0,C.sortObjects)}Gl(w,O,0,C.sortObjects),S.finish(),N!==null&&N.updateLights(v.state.lightsArray),C.sortObjects===!0&&S.sort(it,ft),Zt=Ut.enabled===!1||Ut.isPresenting===!1||Ut.hasDepthSensing()===!1,Zt&&te.addToRenderList(S,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),at===!0&&zt.beginShadows();let $=v.state.shadowsArray;if(Vt.render($,w,O),at===!0&&zt.endShadows(),(Z&&E.hasRenderPass())===!1){let Lt=S.opaque,Tt=S.transmissive;if(v.setupLights(),O.isArrayCamera){let Dt=O.cameras;if(Tt.length>0)for(let Ft=0,ne=Dt.length;Ft<ne;Ft++){let ae=Dt[Ft];Kh(Lt,Tt,w,ae)}Zt&&te.render(w);for(let Ft=0,ne=Dt.length;Ft<ne;Ft++){let ae=Dt[Ft];Jh(S,w,ae,ae.viewport)}}else Tt.length>0&&Kh(Lt,Tt,w,O),Zt&&te.render(w),Jh(S,w,O)}K!==null&&q===0&&(tt.updateMultisampleRenderTarget(K),tt.updateRenderTargetMipmap(K)),Z&&E.end(C),w.isScene===!0&&w.onAfterRender(C,w,O),Rt.resetDefaultState(),B=-1,X=null,_.pop(),_.length>0?(v=_[_.length-1],tt.setTextureUnits(v.state.textureUnits),at===!0&&zt.setGlobalState(C.clippingPlanes,v.state.camera)):v=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,N!==null&&N.renderEnd()};function Gl(w,O,j,Z){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)j=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLightProbeGrid)v.pushLightProbeGrid(w);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||w.intersectsFrustum(Q)){Z&&Gt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(dt);let Lt=st.update(w),Tt=w.material;Tt.visible&&S.push(w,Lt,Tt,j,Gt.z,null,O)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||w.intersectsFrustum(Q))){let Lt=st.update(w),Tt=w.material;if(Z&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Gt.copy(w.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),Gt.copy(Lt.boundingSphere.center)),Gt.applyMatrix4(w.matrixWorld).applyMatrix4(dt)),Array.isArray(Tt)){let Dt=Lt.groups;for(let Ft=0,ne=Dt.length;Ft<ne;Ft++){let ae=Dt[Ft],Nt=Tt[ae.materialIndex];Nt&&Nt.visible&&S.push(w,Lt,Nt,j,Gt.z,ae,O)}}else Tt.visible&&S.push(w,Lt,Tt,j,Gt.z,null,O)}}let At=w.children;for(let Lt=0,Tt=At.length;Lt<Tt;Lt++)Gl(At[Lt],O,j,Z)}function Jh(w,O,j,Z){let{opaque:$,transmissive:At,transparent:Lt}=w;v.setupLightsView(j),at===!0&&zt.setGlobalState(C.clippingPlanes,j),Z&&y.viewport(I.copy(Z)),$.length>0&&va($,O,j),At.length>0&&va(At,O,j),Lt.length>0&&va(Lt,O,j),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function Kh(w,O,j,Z){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(v.state.transmissionRenderTarget[Z.id]===void 0){let Nt=re.has("EXT_color_buffer_half_float")||re.has("EXT_color_buffer_float");v.state.transmissionRenderTarget[Z.id]=new mn(1,1,{generateMipmaps:!0,type:Nt?Jn:_n,minFilter:$i,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:le.workingColorSpace})}let At=v.state.transmissionRenderTarget[Z.id],Lt=Z.viewport||I;At.setSize(Lt.z*C.transmissionResolutionScale,Lt.w*C.transmissionResolutionScale);let Tt=C.getRenderTarget(),Dt=C.getActiveCubeFace(),Ft=C.getActiveMipmapLevel();C.setRenderTarget(At),C.getClearColor(mt),Ct=C.getClearAlpha(),Ct<1&&C.setClearColor(16777215,.5),C.clear(),Zt&&te.render(j);let ne=C.toneMapping;C.toneMapping=Zn;let ae=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),v.setupLightsView(Z),at===!0&&zt.setGlobalState(C.clippingPlanes,Z),va(w,j,Z),tt.updateMultisampleRenderTarget(At),tt.updateRenderTargetMipmap(At),re.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let _e=0,He=O.length;_e<He;_e++){let Ce=O[_e],{object:be,geometry:sn,material:It,group:hn}=Ce;if(It.side===nn&&be.layers.test(Z.layers)){let ue=It.side;It.side=en,It.needsUpdate=!0,jh(be,j,Z,sn,It,hn),It.side=ue,It.needsUpdate=!0,Nt=!0}}Nt===!0&&(tt.updateMultisampleRenderTarget(At),tt.updateRenderTargetMipmap(At))}C.setRenderTarget(Tt,Dt,Ft),C.setClearColor(mt,Ct),ae!==void 0&&(Z.viewport=ae),C.toneMapping=ne}function va(w,O,j){let Z=O.isScene===!0?O.overrideMaterial:null;for(let $=0,At=w.length;$<At;$++){let Lt=w[$],{object:Tt,geometry:Dt,group:Ft}=Lt,ne=Lt.material;ne.allowOverride===!0&&Z!==null&&(ne=Z),Tt.layers.test(j.layers)&&jh(Tt,O,j,Dt,ne,Ft)}}function jh(w,O,j,Z,$,At){N!==null&&$.isNodeMaterial&&N.setObject(w,$),w.onBeforeRender(C,O,j,Z,$,At),w.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),$.onBeforeRender(C,O,j,Z,w,At),$.transparent===!0&&$.side===nn&&$.forceSinglePass===!1?($.side=en,$.needsUpdate=!0,C.renderBufferDirect(j,O,Z,$,w,At),$.side=Yi,$.needsUpdate=!0,C.renderBufferDirect(j,O,Z,$,w,At),$.side=nn):C.renderBufferDirect(j,O,Z,$,w,At),w.onAfterRender(C,O,j,Z,$,At)}function ya(w,O,j){O.isScene!==!0&&(O=Ht);let Z=J.get(w),$=v.state.lights,At=v.state.shadowsArray,Lt=$.state.version,Tt=yt.getParameters(w,$.state,At,O,j,v.state.lightProbeGridArray),Dt=yt.getProgramCacheKey(Tt),Ft=Z.programs;Z.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?O.environment:null,Z.fog=O.fog;let ne=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;Z.envMap=pt.get(w.envMap||Z.environment,ne),Z.envMapRotation=Z.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Ft===void 0&&(w.addEventListener("dispose",Qn),Ft=new Map,Z.programs=Ft);let ae=Ft.get(Dt);if(ae!==void 0){if(Z.currentProgram===ae&&Z.lightsStateVersion===Lt)return tu(w,Tt),ae}else Tt.uniforms=yt.getUniforms(w),N!==null&&w.isNodeMaterial&&N.build(w,j,Tt),w.onBeforeCompile(Tt,C),ae=yt.acquireProgram(Tt,Dt),Ft.set(Dt,ae),Z.uniforms=Tt.uniforms;let Nt=Z.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Nt.clippingPlanes=zt.uniform),tu(w,Tt),Z.needsLights=Yf(w),Z.lightsStateVersion=Lt,Z.needsLights&&(Nt.ambientLightColor.value=$.state.ambient,Nt.lightProbe.value=$.state.probe,Nt.sunLights.value=$.state.sun,Nt.sunLightShadows.value=$.state.sunShadow,Nt.directionalLights.value=$.state.directional,Nt.directionalLightShadows.value=$.state.directionalShadow,Nt.spotLights.value=$.state.spot,Nt.spotLightShadows.value=$.state.spotShadow,Nt.rectAreaLights.value=$.state.rectArea,Nt.ltc_1.value=$.state.rectAreaLTC1,Nt.ltc_2.value=$.state.rectAreaLTC2,Nt.pointLights.value=$.state.point,Nt.pointLightShadows.value=$.state.pointShadow,Nt.hemisphereLights.value=$.state.hemi,Nt.sunShadowMatrix.value=$.state.sunShadowMatrix,Nt.sunShadowCascade.value=$.state.sunShadowCascade,Nt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Nt.spotLightMatrix.value=$.state.spotLightMatrix,Nt.spotLightMap.value=$.state.spotLightMap,Nt.pointShadowMatrix.value=$.state.pointShadowMatrix),Z.lightProbeGrid=v.state.lightProbeGridArray.length>0,Z.currentProgram=ae,Z.uniformsList=null,ae}function Qh(w){if(w.uniformsList===null){let O=w.currentProgram.getUniforms();w.uniformsList=lr.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function tu(w,O){let j=J.get(w);j.outputColorSpace=O.outputColorSpace,j.batching=O.batching,j.batchingColor=O.batchingColor,j.instancing=O.instancing,j.instancingColor=O.instancingColor,j.instancingMorph=O.instancingMorph,j.skinning=O.skinning,j.morphTargets=O.morphTargets,j.morphNormals=O.morphNormals,j.morphColors=O.morphColors,j.morphTargetsCount=O.morphTargetsCount,j.numClippingPlanes=O.numClippingPlanes,j.numIntersection=O.numClipIntersection,j.vertexAlphas=O.vertexAlphas,j.vertexTangents=O.vertexTangents,j.toneMapping=O.toneMapping}function Wf(w,O){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;x.setFromMatrixPosition(O.matrixWorld);for(let j=0,Z=w.length;j<Z;j++){let $=w[j];if($.texture!==null&&$.boundingBox.containsPoint(x))return $}return null}function Xf(w,O,j,Z,$){O.isScene!==!0&&(O=Ht),tt.resetTextureUnits();let At=O.fog,Lt=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial?O.environment:null,Tt=K===null?C.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:le.workingColorSpace,Dt=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial&&!Z.envMap||Z.isMeshPhongMaterial&&!Z.envMap,Ft=pt.get(Z.envMap||Lt,Dt),ne=Z.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,ae=!!j.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Nt=!!j.morphAttributes.position,_e=!!j.morphAttributes.normal,He=!!j.morphAttributes.color,Ce=Zn;Z.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Ce=C.toneMapping);let be=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,sn=be!==void 0?be.length:0,It=J.get(Z),hn=v.state.lights;if(at===!0&&(ut===!0||w!==X)){let Te=w===X&&Z.id===B;zt.setState(Z,w,Te)}let ue=!1;Z.version===It.__version?(It.needsLights&&It.lightsStateVersion!==hn.state.version||It.outputColorSpace!==Tt||$.isBatchedMesh&&It.batching===!1||!$.isBatchedMesh&&It.batching===!0||$.isBatchedMesh&&It.batchingColor===!0&&$._colorsTexture===null||$.isBatchedMesh&&It.batchingColor===!1&&$._colorsTexture!==null||$.isInstancedMesh&&It.instancing===!1||!$.isInstancedMesh&&It.instancing===!0||$.isSkinnedMesh&&It.skinning===!1||!$.isSkinnedMesh&&It.skinning===!0||$.isInstancedMesh&&It.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&It.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&It.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&It.instancingMorph===!1&&$.morphTexture!==null||It.envMap!==Ft||Z.fog===!0&&It.fog!==At||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==zt.numPlanes||It.numIntersection!==zt.numIntersection)||It.vertexAlphas!==ne||It.vertexTangents!==ae||It.morphTargets!==Nt||It.morphNormals!==_e||It.morphColors!==He||It.toneMapping!==Ce||It.morphTargetsCount!==sn||!!It.lightProbeGrid!=v.state.lightProbeGridArray.length>0)&&(ue=!0):(ue=!0,It.__version=Z.version);let Rn=It.currentProgram;ue===!0&&(Rn=ya(Z,O,$),N&&Z.isNodeMaterial&&N.onUpdateProgram(Z,Rn,It));let ti=!1,Pi=!1,Ss=!1,Se=Rn.getUniforms(),Oe=It.uniforms;if(y.useProgram(Rn.program)&&(ti=!0,Pi=!0,Ss=!0),Z.id!==B&&(B=Z.id,Pi=!0),It.needsLights){let Te=Wf(v.state.lightProbeGridArray,$);It.lightProbeGrid!==Te&&(It.lightProbeGrid=Te,Pi=!0)}if(ti||X!==w){y.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Se.setValue(U,"projectionMatrix",w.projectionMatrix),Se.setValue(U,"viewMatrix",w.matrixWorldInverse);let Di=Se.map.cameraPosition;Di!==void 0&&Di.setValue(U,vt.setFromMatrixPosition(w.matrixWorld)),R.logarithmicDepthBuffer&&Se.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Se.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),X!==w&&(X=w,Pi=!0,Ss=!0)}if(It.needsLights&&(hn.state.sunShadowMap.length>0&&Se.setValue(U,"sunShadowMap",hn.state.sunShadowMap,tt),hn.state.directionalShadowMap.length>0&&Se.setValue(U,"directionalShadowMap",hn.state.directionalShadowMap,tt),hn.state.spotShadowMap.length>0&&Se.setValue(U,"spotShadowMap",hn.state.spotShadowMap,tt),hn.state.pointShadowMap.length>0&&Se.setValue(U,"pointShadowMap",hn.state.pointShadowMap,tt)),$.isSkinnedMesh){Se.setOptional(U,$,"bindMatrix"),Se.setOptional(U,$,"bindMatrixInverse");let Te=$.skeleton;Te&&(Te.boneTexture===null&&Te.computeBoneTexture(),Se.setValue(U,"boneTexture",Te.boneTexture,tt))}$.isBatchedMesh&&(Se.setOptional(U,$,"batchingTexture"),Se.setValue(U,"batchingTexture",$._matricesTexture,tt),Se.setOptional(U,$,"batchingIdTexture"),Se.setValue(U,"batchingIdTexture",$._indirectTexture,tt),Se.setOptional(U,$,"batchingColorTexture"),$._colorsTexture!==null&&Se.setValue(U,"batchingColorTexture",$._colorsTexture,tt));let Li=j.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&z.update($,j,Rn),(Pi||It.receiveShadow!==$.receiveShadow)&&(It.receiveShadow=$.receiveShadow,Se.setValue(U,"receiveShadow",$.receiveShadow)),(Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial)&&Z.envMap===null&&O.environment!==null&&(Oe.envMapIntensity.value=O.environmentIntensity),Oe.dfgLUT!==void 0&&(Oe.dfgLUT.value=yv()),Pi){if(Se.setValue(U,"toneMappingExposure",C.toneMappingExposure),It.needsLights&&qf(Oe,Ss),At&&Z.fog===!0&&Bt.refreshFogUniforms(Oe,At),Bt.refreshMaterialUniforms(Oe,Z,G,F,v.state.transmissionRenderTarget[w.id]),It.needsLights&&It.lightProbeGrid){let Te=It.lightProbeGrid;Oe.probesSH.value=Te.texture,Oe.probesMin.value.copy(Te.boundingBox.min),Oe.probesMax.value.copy(Te.boundingBox.max),Oe.probesResolution.value.copy(Te.resolution)}lr.upload(U,Qh(It),Oe,tt)}if(Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(lr.upload(U,Qh(It),Oe,tt),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Se.setValue(U,"center",$.center),Se.setValue(U,"modelViewMatrix",$.modelViewMatrix),Se.setValue(U,"normalMatrix",$.normalMatrix),Se.setValue(U,"modelMatrix",$.matrixWorld),Z.uniformsGroups!==void 0){let Te=Z.uniformsGroups;for(let Di=0,bs=Te.length;Di<bs;Di++){let nu=Te[Di];ot.update(nu,Rn),ot.bind(nu,Rn)}}return Rn}function qf(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.sunLights.needsUpdate=O,w.sunLightShadows.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function Yf(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(w,O,j){let Z=J.get(w);Z.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),J.get(w.texture).__webglTexture=O,J.get(w.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:j,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,O){let j=J.get(w);j.__webglFramebuffer=O,j.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,j=0){K=w,Y=O,q=j;let Z=null,$=!1,At=!1;if(w){let Tt=J.get(w);if(Tt.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(U.FRAMEBUFFER,Tt.__webglFramebuffer),I.copy(w.viewport),rt.copy(w.scissor),lt=w.scissorTest,y.viewport(I),y.scissor(rt),y.setScissorTest(lt),B=-1;return}else if(Tt.__webglFramebuffer===void 0)tt.setupRenderTarget(w);else if(Tt.__hasExternalTextures)tt.rebindTextures(w,J.get(w.texture).__webglTexture,J.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let ne=w.depthTexture;if(Tt.__boundDepthTexture!==ne){if(ne!==null&&J.has(ne)&&(w.width!==ne.image.width||w.height!==ne.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");tt.setupDepthRenderbuffer(w)}}let Dt=w.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(At=!0);let Ft=J.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ft[O])?Z=Ft[O][j]:Z=Ft[O],$=!0):w.samples>0&&tt.useMultisampledRTT(w)===!1?Z=J.get(w).__webglMultisampledFramebuffer:Array.isArray(Ft)?Z=Ft[j]:Z=Ft,I.copy(w.viewport),rt.copy(w.scissor),lt=w.scissorTest}else I.copy(ct).multiplyScalar(G).floor(),rt.copy(xt).multiplyScalar(G).floor(),lt=Ot;if(j!==0&&(Z=H),y.bindFramebuffer(U.FRAMEBUFFER,Z)&&y.drawBuffers(w,Z),y.viewport(I),y.scissor(rt),y.setScissorTest(lt),$){let Tt=J.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,Tt.__webglTexture,j)}else if(At){let Tt=O;for(let Dt=0;Dt<w.textures.length;Dt++){let Ft=J.get(w.textures[Dt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Dt,Ft.__webglTexture,j,Tt)}}else if(w!==null&&j!==0){let Tt=J.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Tt.__webglTexture,j)}B=-1};function eu(w){let O=J.get(w);return(O.__readFormat!==w.format||O.__readType!==w.type)&&(O.__readFormat=w.format,O.__readType=w.type,O.__formatReadable=R.textureFormatReadable(w.format),O.__typeReadable=R.textureTypeReadable(w.type)),O}this.readRenderTargetPixels=function(w,O,j,Z,$,At,Lt,Tt=0){if(!(w&&w.isWebGLRenderTarget)){Yt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=J.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Lt!==void 0&&(Dt=Dt[Lt]),Dt){y.bindFramebuffer(U.FRAMEBUFFER,Dt);try{let Ft=w.textures[Tt],ne=Ft.format,ae=Ft.type;w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Tt);let Nt=eu(Ft);if(Nt.__formatReadable===!1){Yt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Nt.__typeReadable===!1){Yt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-Z&&j>=0&&j<=w.height-$&&U.readPixels(O,j,Z,$,bt.convert(ne),bt.convert(ae),At)}finally{let Ft=K!==null?J.get(K).__webglFramebuffer:null;y.bindFramebuffer(U.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=async function(w,O,j,Z,$,At,Lt,Tt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=J.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Lt!==void 0&&(Dt=Dt[Lt]),Dt)if(O>=0&&O<=w.width-Z&&j>=0&&j<=w.height-$){y.bindFramebuffer(U.FRAMEBUFFER,Dt);let Ft=w.textures[Tt],ne=Ft.format,ae=Ft.type;w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Tt);let Nt=eu(Ft);if(Nt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Nt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let _e=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,_e),U.bufferData(U.PIXEL_PACK_BUFFER,At.byteLength,U.STREAM_READ),U.readPixels(O,j,Z,$,bt.convert(ne),bt.convert(ae),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let He=K!==null?J.get(K).__webglFramebuffer:null;y.bindFramebuffer(U.FRAMEBUFFER,He);let Ce=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Cd(U,Ce,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,_e),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,At),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(_e),U.deleteSync(Ce),At}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,O=null,j=0){let Z=Math.pow(2,-j),$=Math.floor(w.image.width*Z),At=Math.floor(w.image.height*Z),Lt=O!==null?O.x:0,Tt=O!==null?O.y:0;tt.setTexture2D(w,0),U.copyTexSubImage2D(U.TEXTURE_2D,j,0,0,Lt,Tt,$,At),y.unbindTexture()},this.copyTextureToTexture=function(w,O,j=null,Z=null,$=0,At=0){let Lt,Tt,Dt,Ft,ne,ae,Nt,_e,He,Ce=w.isCompressedTexture?w.mipmaps[At]:w.image;if(j!==null)Lt=j.max.x-j.min.x,Tt=j.max.y-j.min.y,Dt=j.isBox3?j.max.z-j.min.z:1,Ft=j.min.x,ne=j.min.y,ae=j.isBox3?j.min.z:0;else{let Oe=Math.pow(2,-$);Lt=Math.floor(Ce.width*Oe),Tt=Math.floor(Ce.height*Oe),w.isDataArrayTexture?Dt=Ce.depth:w.isData3DTexture?Dt=Math.floor(Ce.depth*Oe):Dt=1,Ft=0,ne=0,ae=0}Z!==null?(Nt=Z.x,_e=Z.y,He=Z.z):(Nt=0,_e=0,He=0);let be=bt.convert(O.format),sn=bt.convert(O.type),It;O.isData3DTexture?(tt.setTexture3D(O,0),It=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(tt.setTexture2DArray(O,0),It=U.TEXTURE_2D_ARRAY):(tt.setTexture2D(O,0),It=U.TEXTURE_2D),y.activeTexture(U.TEXTURE0),y.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),y.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),y.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);let hn=y.getParameter(U.UNPACK_ROW_LENGTH),ue=y.getParameter(U.UNPACK_IMAGE_HEIGHT),Rn=y.getParameter(U.UNPACK_SKIP_PIXELS),ti=y.getParameter(U.UNPACK_SKIP_ROWS),Pi=y.getParameter(U.UNPACK_SKIP_IMAGES);y.pixelStorei(U.UNPACK_ROW_LENGTH,Ce.width),y.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ce.height),y.pixelStorei(U.UNPACK_SKIP_PIXELS,Ft),y.pixelStorei(U.UNPACK_SKIP_ROWS,ne),y.pixelStorei(U.UNPACK_SKIP_IMAGES,ae);let Ss=w.isDataArrayTexture||w.isData3DTexture,Se=O.isDataArrayTexture||O.isData3DTexture;if(w.isDepthTexture){let Oe=J.get(w),Li=J.get(O),Te=J.get(Oe.__renderTarget),Di=J.get(Li.__renderTarget);y.bindFramebuffer(U.READ_FRAMEBUFFER,Te.__webglFramebuffer),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,Di.__webglFramebuffer);for(let bs=0;bs<Dt;bs++)Ss&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(w).__webglTexture,$,ae+bs),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(O).__webglTexture,At,He+bs)),U.blitFramebuffer(Ft,ne,Lt,Tt,Nt,_e,Lt,Tt,U.DEPTH_BUFFER_BIT,U.NEAREST);y.bindFramebuffer(U.READ_FRAMEBUFFER,null),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if($!==0||w.isRenderTargetTexture||J.has(w)){let Oe=J.get(w),Li=J.get(O);y.bindFramebuffer(U.READ_FRAMEBUFFER,D),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,k);for(let Te=0;Te<Dt;Te++)Ss?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Oe.__webglTexture,$,ae+Te):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Oe.__webglTexture,$),Se?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Li.__webglTexture,At,He+Te):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Li.__webglTexture,At),$!==0?U.blitFramebuffer(Ft,ne,Lt,Tt,Nt,_e,Lt,Tt,U.COLOR_BUFFER_BIT,U.NEAREST):Se?U.copyTexSubImage3D(It,At,Nt,_e,He+Te,Ft,ne,Lt,Tt):U.copyTexSubImage2D(It,At,Nt,_e,Ft,ne,Lt,Tt);y.bindFramebuffer(U.READ_FRAMEBUFFER,null),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Se?w.isDataTexture||w.isData3DTexture?U.texSubImage3D(It,At,Nt,_e,He,Lt,Tt,Dt,be,sn,Ce.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(It,At,Nt,_e,He,Lt,Tt,Dt,be,Ce.data):U.texSubImage3D(It,At,Nt,_e,He,Lt,Tt,Dt,be,sn,Ce):w.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,At,Nt,_e,Lt,Tt,be,sn,Ce.data):w.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,At,Nt,_e,Ce.width,Ce.height,be,Ce.data):U.texSubImage2D(U.TEXTURE_2D,At,Nt,_e,Lt,Tt,be,sn,Ce);y.pixelStorei(U.UNPACK_ROW_LENGTH,hn),y.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ue),y.pixelStorei(U.UNPACK_SKIP_PIXELS,Rn),y.pixelStorei(U.UNPACK_SKIP_ROWS,ti),y.pixelStorei(U.UNPACK_SKIP_IMAGES,Pi),At===0&&O.generateMipmaps&&U.generateMipmap(It),y.unbindTexture()},this.initRenderTarget=function(w){J.get(w).__webglFramebuffer===void 0&&tt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?tt.setTextureCube(w,0):w.isData3DTexture?tt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?tt.setTexture2DArray(w,0):tt.setTexture2D(w,0),y.unbindTexture()},this.resetState=function(){Y=0,q=0,K=null,y.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=le._getDrawingBufferColorSpace(t),e.unpackColorSpace=le._getUnpackColorSpace()}};function pf(i,t=Math.PI/3){let e=i.index?i.toNonIndexed():i,n=e.attributes.position,s=n.count,r;if(n.isBufferAttribute===!0&&n.itemSize===3&&n.normalized===!1)r=n.array;else{r=new Float64Array(s*3);for(let x=0;x<s;x++)r[3*x+0]=n.getX(x),r[3*x+1]=n.getY(x),r[3*x+2]=n.getZ(x)}let a=Math.cos(t),o=(1+1e-10)*100,l=s/3,c=new Float64Array(l*3);for(let x=0;x<l;x++){let S=9*x,v=r[S+0],A=r[S+1],_=r[S+2],E=r[S+3],C=r[S+4],P=r[S+5],N=r[S+6],H=r[S+7],D=r[S+8],k=N-E,Y=H-C,q=D-P,K=v-E,B=A-C,X=_-P,I=Y*X-q*B,rt=q*K-k*X,lt=k*B-Y*K,mt=1/(Math.sqrt(I*I+rt*rt+lt*lt)||1);c[3*x+0]=I*mt,c[3*x+1]=rt*mt,c[3*x+2]=lt*mt}let h=new Int32Array(s),d=new Float64Array(s*3),u=1;for(;u<s*2;)u<<=1;let f=u-1,g=new Int32Array(u),M=0;for(let x=0;x<s;x++){let S=3*x,v=Math.trunc(r[S+0]*o),A=Math.trunc(r[S+1]*o),_=Math.trunc(r[S+2]*o),E=(Math.imul(v,73856093)^Math.imul(A,19349663)^Math.imul(_,83492791))&f;for(;;){let C=g[E];if(C===0){let N=3*M;d[N+0]=v,d[N+1]=A,d[N+2]=_,g[E]=M+1,h[x]=M++;break}let P=3*(C-1);if(d[P+0]===v&&d[P+1]===A&&d[P+2]===_){h[x]=C-1;break}E=E+1&f}}let p=new Int32Array(M+1);for(let x=0;x<s;x++)p[h[x]+1]++;for(let x=0;x<M;x++)p[x+1]+=p[x];let m=new Int32Array(s),T=p.slice(0,M);for(let x=0;x<l;x++){let S=3*x;m[T[h[S+0]]++]=x,m[T[h[S+1]]++]=x,m[T[h[S+2]]++]=x}let b=new Float32Array(s*3);for(let x=0;x<l;x++){let S=3*x,v=c[S+0],A=c[S+1],_=c[S+2];for(let E=0;E<3;E++){let C=S+E,P=h[C],N=0,H=0,D=0;for(let Y=p[P],q=p[P+1];Y<q;Y++){let K=3*m[Y],B=c[K+0],X=c[K+1],I=c[K+2];v*B+A*X+_*I>a&&(N+=B,H+=X,D+=I)}let k=1/(Math.sqrt(N*N+H*H+D*D)||1);b[3*C+0]=N*k,b[3*C+1]=H*k,b[3*C+2]=D*k}}return e.setAttribute("normal",new Ae(b,3,!1)),e}function mf({color:i,halfBase:t,arch:e,side:n,tail:s,dripRail:r}){let a=new Yr({color:i,roughness:.32,metalness:.55,clearcoat:1,clearcoatRoughness:.06});return a.onBeforeCompile=o=>{o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vBodyPos;
varying vec3 vBodyNormal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vBodyPos = position;
vBodyNormal = normal;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
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
#endif`)},a}var ur=pe.wheelbase/2,Ai=.47,ze=-1.72,ce=-.6,Ke=.35,Ue=1.92,vn=.22,ee=.86,dn=.72,Mv=.84,di=1.6,de=.8,da=.84,Nn=.5,gf=.045,Ye=.18,Ah=.12;function xf({maxAniso:i,makeWheel:t,rightHand:e=pe.rightHandDrive}){let n=new ve,s=(W,F=.4,G=.1,it={})=>new Pe({color:W,roughness:F,metalness:G,...it}),r=mf({color:5200684,halfBase:ur,arch:Ai,side:de,tail:Ue,dripRail:di-.07}),a=r,o=s(15130832,.4,.25),l=s(1579291,.7,.1),c=s(2763823,.55,.3),h=s(15922422,.12,1),d=new Pe({color:10467528,roughness:.05,metalness:.4,transparent:!0,opacity:.32,depthWrite:!1,side:nn}),u=s(16774877,.15,.2,{emissive:4209194}),f=s(15769632,.25,.1,{emissive:3809792}),g=s(12593182,.3,.1,{emissive:3147781}),M=s(2894376,.85,0),p=(W,F,G,it,ft,ct=n,xt=!0)=>{let Ot=new Kt(W,F);return Ot.position.set(G,it,ft),Ot.castShadow=xt,Ot.receiveShadow=!0,ct.add(Ot),Ot},m=(W,F,G)=>new In(W,F,G),T=W=>pf(W,Math.PI/5),b=(W,F,G,it,ft=n)=>{let ct=new fs(W,{depth:G-F,bevelEnabled:!1,curveSegments:4});return ct.rotateX(Math.PI/2),ct.translate(0,G,0),p(T(ct),it,0,0,0,ft)},x=(W,F,G=0,it=0)=>{let ft=Ye+F,ct=[];G>0&&ct.push(new ht(W*(de+F),Ue-Ye-G));for(let xt=0;xt<=12;xt++){let Ot=xt/12*(Math.PI/2);ct.push(new ht(W*(de-Ye+ft*Math.cos(Ot)),Ue-Ye+ft*Math.sin(Ot)))}return it>0&&ct.push(new ht(W*(de-Ye-it),Ue+F)),ct},S=(W,F,G,it,ft)=>new Yn([...x(W,G,it,ft),...x(W,F,it,ft).reverse()]),v=(W,F)=>{let G=Ue-Ye-F,it=x(1,W,G,de-Ye),ft=x(-1,W,G,de-Ye).reverse();return new Yn([...it,...ft.slice(1)])},A=(W,F,G)=>{let it=[],ft=[];W.forEach((xt,Ot)=>{it.push(xt.x,F,xt.y,xt.x,G,xt.y),Ot&&ft.push(2*Ot-2,2*Ot,2*Ot-1,2*Ot-1,2*Ot,2*Ot+1)});let ct=new Re;return ct.setAttribute("position",new oe(it,3)),ct.setIndex(ft),ct.computeVertexNormals(),ct},_=(W,F,G,it)=>{let ft=new fs(W,{depth:G,bevelEnabled:!1,curveSegments:24});return ft.rotateY(-Math.PI/2),p(ft,it,F>0?F:F+G,0,0)},E=(W,F,G,it,ft)=>{let ct=Math.sqrt(Ai*Ai-it*it),xt=Math.atan2(it,ct);F<G?(W.lineTo(ft-ct,it),W.absarc(ft,0,Ai,Math.PI-xt,xt,!0),W.lineTo(G,it)):(W.lineTo(ft+ct,it),W.absarc(ft,0,Ai,xt,Math.PI-xt,!1),W.lineTo(G,it))};for(let W of[-1,1]){let F=new Yn;F.moveTo(ce,vn),E(F,ce,ze+.02,vn,-ur),F.lineTo(ze+.02,dn),F.lineTo(ce,dn),F.closePath(),_(F,W*da,.025,r);let G=new Yn;G.moveTo(ce,.3),E(G,ce,ze+.02,.3,-ur),G.lineTo(ze+.02,dn),G.lineTo(ce,dn),G.closePath(),_(G,W*Nn,.015,c),p(m(da-Nn,.025,ce-ze-.02),r,W*(da+Nn)/2,dn,(ce+ze)/2+.01),p(m(.12,.05,.05),f,W*.72,dn+.03,ze+.06);let ft=new Ei(-ur,0,Ai+.03,Ai+.03,.45,Math.PI-.45,!1).getPoints(24).map(at=>new L(W*(da+.012),at.y,at.x));p(new Vi(new hs(ft),24,.022,6,!1),r,0,0,0);let ct=new Yn;ct.moveTo(Ke,vn),E(ct,Ke,Ue-Ye,vn,ur),ct.lineTo(Ue-Ye,ee),ct.lineTo(Ke,ee),ct.closePath(),_(ct,W*de,.025,r),b(S(W,-.025,0,0,0),vn,ee,r);let Ot=new Ei(ur,0,Ai+.03,Ai+.03,.42,Math.PI-.42,!1).getPoints(24).map(at=>new L(W*(de+.02),at.y,at.x));p(new Vi(new hs(Ot),24,.035,6,!1),r,0,0,0),W===(e?1:-1)&&p(new he(.045,.045,.02,20).rotateZ(Math.PI/2),h,W*(de+.02),.58,Ke+.25),p(m(.07,.16,.02),g,W*(de-Ye-.06),.62,Ue+.008),p(m(.035,ee-vn,Ke-ce-.03),r,W*(de+.005),(ee+vn)/2,(Ke+ce)/2),p(m(.05,.02,.1),h,W*(de+.03),ee-.12,Ke-.14);for(let at of[.36,.74])p(m(.04,.09,.05),l,W*(de+.03),at,ce+.03);p(m(.012,.025,Ke-ce-.1),r,W*(de+.028),.62,(Ke+ce)/2+.04),b(S(W,0,.01,Ue-Ye-Ke,0),.6075,.6325,r);let Q=di-.07;p(m(.025,Q-ee-.02,.025),l,W*(de-.005),(Q+ee)/2,ce+.32);for(let at of[ce+.12,Ke-.03])p(m(.03,Q-ee,.035),a,W*(de-.01),(Q+ee)/2,at);p(new gn(Ke-ce-.18,Q-ee-.02).rotateY(Math.PI/2),d,W*(de-.01),(Q+ee)/2,(Ke+ce)/2+.045,n,!1),p(new he(.008,.008,.16,6).rotateZ(Math.PI/2),h,W*(de+.08),ee+.04,ce+.18),p(new he(.06,.06,.025,20).rotateX(Math.PI/2),c,W*(de+.16),ee+.04,ce+.18),b(S(W,-.03,.005,Ue-Ye-Ke,de-Ye),ee,ee+.045,a),b(S(W,-.03,.005,Ue-Ye-Ke,.08),Q-.02,di-.06,a),p(m(.03,Q-ee,.06),a,W*(de-.01),(Q+ee)/2,Ke+.04),p(m(.03,Q-ee,.08),a,W*(de-.01),(Q+ee)/2,1.42),p(new gn(1.42-Ke-.13,Q-ee-.04).rotateY(Math.PI/2),d,W*(de-.012),(Q+ee)/2,(1.42+Ke)/2+.005,n,!1),p(A(x(W,-.014,Ue-Ye-1.46,.08),ee+.045,Q-.02),d,0,0,0,n,!1)}let C=.82;p(m(C,.09,.03),o,0,.75,ze-.005),p(m(C,.4,.02),l,0,.5,ze+.01);for(let W=0;W<9;W++)p(m(.012,.38,.02),h,-C/2+.06+W*(C-.12)/8,.5,ze-.005);p(m(C,.025,.03),h,0,.29,ze-.005);for(let W of[-1,1]){let F=da-C/2;p(m(F,dn-.2,.03),r,W*(C/2+F/2),(dn+.2)/2,ze),p(new he(.1,.1,.03,32).rotateX(Math.PI/2),h,W*.63,.56,ze-.02),p(new xn(.085,24,12,0,Math.PI*2,0,Math.PI/3).rotateX(-Math.PI/2),u,W*.63,.56,ze-.03,n,!1),p(new he(.035,.035,.03,16).rotateX(Math.PI/2),f,W*.63,.36,ze-.02)}let P=W=>Mv-gf*(W/Nn)**2,N=(W,F)=>{let G=Nn-W,it=[];for(let ft=0;ft<=40;ft++){let ct=G*Math.sin((ft/40*2-1)*(Math.PI/2)),xt=Math.max(0,Math.abs(ct)-(G-F))/F;it.push(new ht(ct,P(ct)-W-F*(1-Math.sqrt(Math.max(0,1-xt*xt)))))}return it},H=.02,D=new Yn([new ht(-Nn,dn),...N(0,.035),new ht(Nn,dn),new ht(Nn-H,dn),...N(H,.035-H).reverse(),new ht(-Nn+H,dn)]),k=new fs(D,{depth:ce-ze+.02,steps:24,bevelEnabled:!1}),Y=k.attributes.position;for(let W=0;W<Y.count;W++){let F=Y.getZ(W)/.12;F<1&&Y.setY(W,Y.getY(W)-.03*(1-F)**2)}p(T(k),r,0,0,ze-.02);for(let W of[-1,1]){let F=W*.16,G=p(m(.05,.012,ce-ze-.18),r,F,P(F)+.004,(ce+ze)/2+.04);G.rotation.z=Math.atan(-2*gf*F/Nn**2),p(m(.02,.05,.06),h,W*(Nn+.012),dn+.025,ze+.12)}p(m(2*de,ee-dn+.04,.12),r,0,(ee+dn)/2,ce+.04);let q=new ve;q.position.set(0,ee,ce+.06),q.rotation.x=-.12,n.add(q);let K=di-ee-.06;for(let W of[-de+.03,de-.03])p(m(.05,K,.05),r,W,K/2,0,q);p(m(2*de,.05,.05),r,0,K,0,q),p(m(2*de,.04,.05),r,0,.02,0,q),p(new gn(2*de-.1,K-.08),d,0,K/2+.01,0,q,!1);for(let W of[-.4,.35]){let F=p(m(.012,.36,.012),l,W,K-.2,-.035,q);F.rotation.z=.18}b(v(.01,ce+.045),di-.06,di,a);let B=2*(de-Ye-.08),X=di-.06;p(m(B,1-ee-.045,.03),a,0,(1+ee+.045)/2,Ue-.015),p(m(B,X-1.44,.03),a,0,(X+1.44)/2,Ue-.015);for(let W of[-1,1])p(m(Ah,.44,.03),a,W*(B/2-Ah/2),1.22,Ue-.015);p(new gn(B-2*Ah,.44),d,0,1.22,Ue-.012,n,!1);for(let W of[-1,1])b(S(W,.005,.025,Ue-Ye-ce,0),di-.08,di-.06,a);for(let W=-2;W<=2;W++)p(m(.05,.012,Ue-ce-.3),a,W*.28,di+.004,(Ue+ce)/2+.1);p(m(2*(de-Ye),ee-vn,.025),r,0,(ee+vn)/2,Ue-.0125);for(let W of[-.5,.5])p(m(.006,ee-vn-.05,.004),l,W,(ee+vn)/2,Ue+.001,n,!1);for(let W of[-.4,.4])p(m(.1,.03,.03),h,W,ee-.05,Ue+.012);if(t){let W=t();W.rotation.y=-Math.PI/2,W.position.set(.25,.6,Ue+.13),n.add(W)}b(v(-.015,ce),vn+.005,vn+.035,c),p(m(2*Nn,ee-.3,.02),c,0,(ee+.3)/2,ce-.02);let I=e?1:-1;p(m(2*de-.05,.16,.14),r,0,ee-.1,ce+.16),p(m(2*de-.05,.03,.18),l,0,ee-.01,ce+.17);for(let W of[-.1,.1])p(new he(.055,.055,.02,24).rotateX(Math.PI/2),l,I*.38+W,ee-.1,ce+.235),p(new Pn(.055,.006,6,24),h,I*.38+W,ee-.1,ce+.245);let rt=new ve;rt.position.set(I*.38,ee-.06,ce+.2),rt.rotation.x=.75,n.add(rt),p(new he(.022,.026,.42,12),c,0,.21,0,rt);let lt=new ve;lt.position.y=.42,rt.add(lt);let mt=p(new Pn(.2,.013,10,40),l,0,0,0,lt);mt.rotation.x=Math.PI/2;for(let W=0;W<3;W++){let F=p(m(.2,.01,.025),h,0,0,0,lt);F.geometry.translate(.1,0,0),F.rotation.y=Math.PI/2+W*Math.PI*2/3}p(new he(.04,.04,.03,20),h,0,.01,0,lt);for(let W of[-1,1]){let F=new ve;F.position.set(W*.4,vn+.05,.12),n.add(F),p(m(.48,.12,.48),M,0,.2,0,F);let G=p(m(.48,.55,.1),M,0,.5,.24,F);G.rotation.x=-.12}p(new Pn(.07,.008,6,16,Math.PI),h,-I*.4,ee+.02,ce+.2);for(let W of[-1,1])b(S(W,0,.08,.06,.16),.07,.17,l);for(let W of[-1,1]){let F=p(new Pn(.035,.012,8,16,Math.PI*1.3),l,W*.42,.06,ze-.08);F.rotation.y=Math.PI/2}n.updateMatrixWorld(!0);let Ct=[];n.traverse(W=>W.isMesh&&W.material===r&&Ct.push(W));for(let W of Ct)W.geometry=W.geometry.clone().applyMatrix4(W.matrixWorld),W.position.set(0,0,0),W.rotation.set(0,0,0),W.scale.set(1,1,1),n.add(W);return{group:n,steeringWheel:lt}}var An=je.radius,ke=je.rimRadius,dr=je.flangeRadius,ma=je.width/2,Pl=.012,Rh=34,db=2*Le,Sv=512,Ch=70,Ri=8,Ih={mode:"chase",yaw:0,pitch:.23,dist:10.7},bv=5,Fh=window.matchMedia("(pointer: coarse)").matches,_f=()=>Math.min(window.devicePixelRatio||1,Fh?1.5:2),Ph=14,Ll={asphalt:{base:"#3e4045",specks:["#5b5e64","#2b2c30","#73767c"],rough:.92,bump:0,mark:[.08,.08,.09],chip:"#45474c",throws:"smoke"},concrete:{base:"#bcb9b1",specks:["#a8a59d","#d3d0c8","#928f88"],rough:.88,bump:0,mark:[.16,.16,.17],chip:"#c4c1b9",throws:"smoke"},wet:{base:"#24272c",specks:["#383c43","#1b1d21","#4b5866"],rough:.18,bump:0,mark:[.05,.055,.06],chip:"#2f3b4a",throws:"spray"},gravel:{base:"#857d71",specks:["#a69e91","#6c655b","#c4bdaf","#5a544b"],rough:.95,bump:3,mark:[.27,.25,.22],chip:"#9a9285",throws:"stones"},grass:{base:"#4f8a30",specks:["#4b872c","#78b54b","#3d7225","#8ec65c"],rough:.95,bump:2,mark:[.45,.62,.3],chip:"#5c9739",throws:"grass"},sand:{base:"#dcbd87",specks:["#cfaf78","#efd7a8","#c4a26a"],rough:.95,bump:1.2,mark:[.62,.5,.32],chip:"#e0c38e",throws:"sand"},mud:{base:"#553e2c",specks:["#473225","#6e523d","#3b2a1e"],rough:.45,bump:1.5,mark:[.16,.11,.07],chip:"#6b4c36",throws:"mud"},snow:{base:"#eef3f8",specks:["#d9e3ee","#ffffff","#c9d7e6"],rough:.75,bump:1,mark:[.62,.68,.78],chip:"#e6eef6",throws:"snow"},ice:{base:"#b8dcee",specks:["#d8f0fa","#a6d2e6","#ffffff"],rough:.06,bump:0,mark:[.95,.97,1],chip:"#bfe2f1",throws:"frost"},dirt:{base:"#8a6f52",specks:["#7a6147","#9c8163","#6b5440","#a88d6c"],rough:.95,bump:1.6,mark:[.34,.25,.17],chip:"#8a6f52",throws:"dirt"},rock:{base:"#8d8a84",specks:["#7a7771","#a3a09a","#68655f","#b5b2ab"],rough:.85,bump:2,mark:[.2,.2,.2],chip:"#8d8a84",throws:"dust"},wood:{base:"#6b4a2e",specks:["#5a3d25","#7d5838","#4a311d"],rough:.9,bump:2,mark:[.25,.18,.12],chip:"#6b4a2e",throws:"dirt"}},zh=i=>Ll[i].chip,vf={earth:{top:"#4f97d6",horizon:"#d9ebf3",ground:"#6e8f52",sun:2.6,hemi:.9,fog:[30,160]},mars:{top:"#8a5c42",horizon:"#e2b48a",ground:"#9c6a4c",sun:2,hemi:.8,fog:[25,130]},moon:{top:"#000000",horizon:"#0a0c12",ground:"#4b4b50",sun:3,hemi:.25,fog:null},jupiter:{top:"#6a5040",horizon:"#e2c49a",ground:"#8b6a4c",sun:1.8,hemi:.8,fog:[20,110]}};function fa(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function pa(i,t){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function Lh(i,t){let e=Ll[i],n=Sv,s=pa(n,n),r=s.getContext("2d"),a=fa(t),o=(c,h,d,u)=>{for(let f of[0,n,-n])for(let g of[0,n,-n])c+f<-d||c+f>n+d||h+g<-d||h+g>n+d||u(c+f,h+g)},l=()=>e.specks[a()*e.specks.length|0];r.fillStyle=e.base,r.fillRect(0,0,n,n);for(let c=0;c<18;c++){let h=a()*n,d=a()*n,u=40+a()*120;r.fillStyle=a()<.5?"rgba(0,0,0,0.05)":"rgba(255,255,255,0.04)",o(h,d,u,(f,g)=>{r.beginPath(),r.arc(f,g,u,0,Math.PI*2),r.fill()})}if(i==="grass")for(let c=0;c<16e3;c++){let h=a()*n,d=a()*n,u=4+a()*9,f=a()*Math.PI*2;r.strokeStyle=l(),r.lineWidth=1+a(),o(h,d,u,(g,M)=>{r.beginPath(),r.moveTo(g,M),r.lineTo(g+Math.cos(f)*u,M+Math.sin(f)*u),r.stroke()})}else if(i==="gravel")for(let c=0;c<5200;c++){let h=a()*n,d=a()*n,u=2.5+a()*6,f=a()*Math.PI,g=l();o(h,d,u*1.4,(M,p)=>{r.fillStyle="rgba(0,0,0,0.35)",r.beginPath(),r.ellipse(M+1.2,p+1.2,u*1.3,u*.9,f,0,Math.PI*2),r.fill(),r.fillStyle=g,r.beginPath(),r.ellipse(M,p,u*1.3,u*.9,f,0,Math.PI*2),r.fill(),r.fillStyle="rgba(255,255,255,0.18)",r.beginPath(),r.ellipse(M-u*.3,p-u*.3,u*.5,u*.35,f,0,Math.PI*2),r.fill()})}else{let c=i==="snow"||i==="ice"?2500:14e3;for(let h=0;h<c;h++){let d=a()*n,u=a()*n,f=.6+a()*(i==="asphalt"||i==="wet"?2.2:1.5);r.fillStyle=l(),r.globalAlpha=.45+a()*.55,o(d,u,f,(g,M)=>{r.beginPath(),r.arc(g,M,f,0,Math.PI*2),r.fill()})}r.globalAlpha=1}if(i==="concrete")r.fillStyle="rgba(80,78,72,0.7)",r.fillRect(0,0,n,3);else if(i==="sand"){r.strokeStyle="rgba(255,240,210,0.16)",r.lineWidth=2.5;for(let c=0;c<9;c++){let h=c/9*n+a()*10,d=a()*6;r.beginPath();for(let u=0;u<=n;u+=8)r.lineTo(u,h+Math.sin(u/n*Math.PI*4+d)*9+Math.sin(u/n*Math.PI*10+c)*3);r.stroke()}}else if(i==="wet"||i==="mud"){r.fillStyle=i==="wet"?"rgba(10,14,20,0.45)":"rgba(30,20,12,0.45)";for(let c=0;c<7;c++){let h=a()*n,d=a()*n,u=30+a()*90,f=20+a()*50;o(h,d,u,(g,M)=>{r.beginPath(),r.ellipse(g,M,u,f,a()*3,0,Math.PI*2),r.fill()})}}else if(i==="ice"){r.strokeStyle="rgba(255,255,255,0.75)",r.lineWidth=1.2;for(let c=0;c<24;c++){let h=a()*n,d=a()*n;r.beginPath(),r.moveTo(h,d);for(let u=0;u<5;u++)h+=(a()-.5)*70,d+=(a()-.5)*70,r.lineTo(h,d);r.stroke()}r.fillStyle="rgba(255,255,255,0.25)";for(let c=0;c<30;c++){let h=a()*n,d=a()*n;o(h,d,80,(u,f)=>{r.beginPath(),r.ellipse(u,f,20+a()*60,2+a()*4,a()*3,0,Math.PI*2),r.fill()})}}else if(i==="snow"){r.fillStyle="rgba(160,185,220,0.18)";for(let c=0;c<40;c++){let h=a()*n,d=a()*n;o(h,d,60,(u,f)=>{r.beginPath(),r.ellipse(u,f,20+a()*50,10+a()*30,a()*3,0,Math.PI*2),r.fill()})}}return s}var fr=An-ke;function wv(){let t=pa(1024,1024),e=t.getContext("2d"),n=1024/2/An;e.translate(1024/2,1024/2),e.fillStyle="#1c1c20",e.fillRect(-1024,-1024,2*1024,2*1024);let s=e.createRadialGradient(0,0,dr*n,0,0,(An-.025)*n);s.addColorStop(0,"#2d2d32"),s.addColorStop(.55,"#26262a"),s.addColorStop(1,"#1e1e22"),e.fillStyle=s,e.beginPath(),e.arc(0,0,(An-.025)*n,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=.002*n;for(let o of[.25,.86])e.beginPath(),e.arc(0,0,(ke+o*fr)*n,0,Math.PI*2),e.stroke();let r=(o,l,c,h,d,u)=>{e.font=`800 ${h*n}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;let f=[...o],g=f.map(m=>e.measureText(m).width+u*n),M=g.reduce((m,T)=>m+T,0),p=l-M/(c*n)/2;e.fillStyle=d,e.textAlign="center",e.textBaseline="middle",f.forEach((m,T)=>{let b=g[T]/(c*n);e.save(),e.rotate(p+b/2),e.translate(0,-c*n),e.fillText(m,0,0),e.restore(),p+=b})},a=ke+.55*fr;return r("NASEEB",0,a,.034,"#e9dfcc",.006),r("NASEEB",Math.PI,a,.034,"#e9dfcc",.006),r("H78-15  LOAD RANGE C",Math.PI/2,a,.016,"#48484f",.002),r("BIAS PLY  TUBE TYPE",-Math.PI/2,a,.014,"#43434a",.002),t}function Ev(){let i=An-Pl,t=ma,e=[[ke,.066],[ke+.008,.074],[ke+.2*fr,.086],[ke+.4*fr,.097],[ke+.6*fr,t],[ke+.78*fr,t-.002],[i-.02,t-.008],[i-.008,t-.016],[i-.002,t-.026],[i,t-.034]],n=[];for(let[s,r]of e)n.push(new ht(s,-r));for(let[s,r]of e.slice().reverse())n.push(new ht(s,r));return n}function Dh(i,t){let e=new qr(i,t);return e.rotateZ(-Math.PI/2),e}function Tv(i){let t=new ve,e=new ve;t.add(e);let n=Dh(Ev(),128),s=n.attributes.position,r=n.attributes.uv;for(let B=0;B<s.count;B++){let X=s.getX(B),I=s.getY(B),rt=s.getZ(B),lt=.5+(X>=0?-rt:rt)/(2*An);r.setXY(B,lt,.5+I/(2*An))}let a=new qn(wv());a.colorSpace=Fe,a.anisotropy=i;let o=new Pe({map:a,bumpMap:a,bumpScale:1.5,roughness:.82,metalness:0,shadowSide:nn}),l=new Kt(n,o);l.name="tire",l.castShadow=!0,l.receiveShadow=!0,e.add(l);let c=Math.PI*2/Rh,h=An-Pl,d=new Pe({color:2039587,roughness:.9}),u=new me,f=new bn,g=new wn,M=[{lat:-.03,width:.05,offset:0,yaw:-.15},{lat:.03,width:.05,offset:.5,yaw:.15},{lat:-(ma-.026),width:.034,offset:.25,yaw:0},{lat:ma-.026,width:.034,offset:.75,yaw:0}],p=new In(1,Pl+.002,h*c*.62),m=new ls(p,d,Rh*M.length),T=h+Pl/2-.001,b=0;for(let B of M)for(let X=0;X<Rh;X++){let I=(X+B.offset)*c;g.set(I,B.yaw,0),f.setFromEuler(g),u.compose(new L(B.lat,T*Math.cos(I),T*Math.sin(I)),f,new L(B.width,1,1)),m.setMatrixAt(b++,u)}m.castShadow=!0,e.add(m);let x=new Pe({color:15130832,metalness:.25,roughness:.45,side:nn}),S=new Pe({color:9210500,metalness:.4,roughness:.6,side:nn}),v=new Pe({color:15922422,metalness:1,roughness:.15}),A=.07,_=[[dr,-A-.006],[dr+.002,-A-.002],[ke+.002,-A+.002],[ke-.006,-A+.016],[ke-.018,-.025],[ke-.018,.025],[ke-.006,A-.016],[ke+.002,A-.002],[dr+.002,A+.002],[dr,A+.006]].map(([B,X])=>new ht(B,X)),E=new Kt(Dh(_,96),S);E.castShadow=!0,e.add(E);for(let B of[-1,1]){let X=new Kt(new Pn(dr-.001,.004,10,96),x);X.rotation.y=Math.PI/2,X.position.x=B*(A+.004),e.add(X)}let C=[[ke-.018,.012],[ke-.04,.016],[.125,.03],[.105,.045],[.085,.048],[.062,.048],[.055,.04]].map(([B,X])=>new ht(B,X)),P=new Kt(Dh(C,96),x);P.castShadow=!0,e.add(P);let N=new Xn({color:1381914});for(let B=0;B<6;B++){let X=B*Math.PI*2/6+Math.PI/6,I=new Kt(new js(.018,20),N);I.scale.set(1,1.4,1),I.rotation.order="YXZ",I.rotation.set(-X,Math.PI/2,0);let rt=ke-.05;I.position.set(.026,Math.cos(X)*rt,Math.sin(X)*rt),e.add(I)}let H=new he(.011,.011,.016,6).rotateZ(Math.PI/2);for(let B=0;B<6;B++){let X=B*Math.PI*2/6,I=new Kt(H,v);I.position.set(.052,Math.cos(X)*.0699,Math.sin(X)*.0699),e.add(I)}let D=new Kt(new xn(.055,32,12,0,Math.PI*2,0,Math.PI/2.6),v);D.rotation.z=-Math.PI/2,D.position.x=.03,e.add(D);let k=new Kt(new he(.15,.15,.07,40).rotateZ(Math.PI/2),S);k.position.x=-.03,k.castShadow=!0,e.add(k);let Y=new Kt(new he(.004,.005,.034,10),new Pe({color:1118483,roughness:.7})),q=Math.PI/6;Y.position.set(.02,Math.cos(q)*(ke-.02),Math.sin(q)*(ke-.02)),Y.rotation.x=q,Y.rotation.z=-.5,e.add(Y);let K=new Kt(new js(ke-.02,64),new Pe({color:14209730,metalness:.3,roughness:.5,transparent:!0,opacity:0,depthWrite:!1}));return K.name="blur",K.rotation.y=Math.PI/2,K.position.x=.05,t.add(K),{wheel:t,spinner:e,tire:l,blur:K}}var Nh={smoke:{colour:[.85,.85,.87],size:[.07,.12],grow:.28,life:[1,1.6],drag:3,lift:.5,alpha:.45,soft:1,max:70},spray:{colour:[.78,.86,.95],size:[.006,.012],grow:0,life:[.5,.9],drag:.6,lift:0,alpha:.85,soft:0},stones:{colour:[.5,.47,.42],size:[.008,.02],grow:0,life:[1,1.6],drag:.05,lift:0,alpha:1,soft:0},grass:{colour:[.33,.58,.22],size:[.006,.014],grow:0,life:[.8,1.4],drag:2,lift:0,alpha:1,soft:0},sand:{colour:[.84,.72,.5],size:[.004,.009],grow:0,life:[.6,1.1],drag:.8,lift:0,alpha:1,soft:0},mud:{colour:[.27,.19,.13],size:[.01,.022],grow:0,life:[.8,1.4],drag:.2,lift:0,alpha:1,soft:0},snow:{colour:[.96,.97,.99],size:[.006,.015],grow:0,life:[.6,1.2],drag:1.2,lift:0,alpha:1,soft:0},frost:{colour:[1,1,1],size:[.004,.008],grow:0,life:[.3,.6],drag:1.5,lift:0,alpha:.9,soft:0},dust:{colour:[.78,.7,.58],size:[.06,.1],grow:.2,life:[.8,1.2],drag:3,lift:.15,alpha:.3,soft:1,max:40},dirt:{colour:[.42,.32,.22],size:[.006,.016],grow:0,life:[.8,1.4],drag:.6,lift:0,alpha:1,soft:0}},Il=900,Ms=700,Oh=class{constructor(t){let e=new Re;this.positions=new Float32Array(Ms*4*3),this.colours=new Float32Array(Ms*4*4);let n=new Uint32Array(Ms*6);for(let r=0;r<Ms;r++)n.set([r*4,r*4+2,r*4+1,r*4+1,r*4+2,r*4+3],r*6);e.setAttribute("position",new Ae(this.positions,3).setUsage(_s)),e.setAttribute("color",new Ae(this.colours,4).setUsage(_s));let s=new Float32Array(Ms*4*3);for(let r=0;r<Ms*4;r++)s[r*3+1]=1;e.setAttribute("normal",new Ae(s,3)),e.setIndex(new Ae(n,1)),e.setDrawRange(0,0),this.geo=e,this.mesh=new Kt(e,new ps({vertexColors:!0,transparent:!0,depthWrite:!1,side:nn,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,t.add(this.mesh),this.list=[],this.lastOf=[]}clear(){this.list.length=0,this.lastOf=[],this.write()}add(t,e,n,s,r,a,o,l,c){let h=this.lastOf[t];if(h&&h.rgb===a&&!h.fade==!l&&Math.abs(h.alpha-o)<.05&&Math.hypot(h.x1-e,h.z1-n)<.02&&Math.hypot(h.x1-h.x0,h.z1-h.z0)<.5){h.x1=s,h.z1=r,h.born=c;return}let d={x0:e,z0:n,x1:s,z1:r,rgb:a,alpha:o,fade:l,born:c};this.list.push(d),this.lastOf[t]=d,this.list.length>Ms&&this.list.shift()}write(t=0,e){let n=this.positions,s=this.colours,r=ma*.95,a=0;for(let o of this.list){let l=o.fade?o.alpha-(t-o.born)*o.fade:o.alpha,c=o.x1-o.x0,h=o.z1-o.z0,d=Math.hypot(c,h);if(l<=.01||d<1e-6)continue;let u=-h/d*r,f=c/d*r,g=[o.x0-u,o.z0-f,o.x0+u,o.z0+f,o.x1-u,o.z1-f,o.x1+u,o.z1+f];for(let M=0;M<4;M++){let p=g[M*2],m=g[M*2+1];n.set([p,e.height(p,m)+.006,m],a*12+M*3)}for(let M=0;M<4;M++)s.set([o.rgb[0],o.rgb[1],o.rgb[2],l],a*16+M*4);a++}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0,this.geo.setDrawRange(0,a*6)}},Bh=class{constructor(t){this.list=[],this.rand=fa(7);let e=new Re;this.positions=new Float32Array(Il*3),this.colours=new Float32Array(Il*4),this.sizes=new Float32Array(Il*2),e.setAttribute("position",new Ae(this.positions,3).setUsage(_s)),e.setAttribute("tint",new Ae(this.colours,4).setUsage(_s)),e.setAttribute("look",new Ae(this.sizes,2).setUsage(_s)),e.setDrawRange(0,0),this.geo=e,this.material=new ln({uniforms:{scale:{value:800},biggest:{value:200}},vertexShader:`
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
        varying vec4 vTint;
        varying float vSoft;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float edge = mix(1.0 - smoothstep(0.38, 0.5, r), 1.0 - smoothstep(0.0, 0.5, r), vSoft);
          if (edge <= 0.0) discard;
          gl_FragColor = vec4(vTint.rgb, vTint.a * edge);
        }`,transparent:!0,depthWrite:!1}),this.points=new Ks(e,this.material),this.points.frustumCulled=!1,this.points.renderOrder=2,t.add(this.points)}spawn(t,e,n,s){let r=e*n,a=Nh[t],o=a.max?this.list.reduce((l,c)=>l+(c.kind===t),0):0;for(;r>0&&this.list.length<Il&&(!a.max||o++<a.max)&&!(r<1&&this.rand()>r);){r--;let l=s(this.rand);l.kind=t,l.age=0,l.life=a.life[0]+this.rand()*(a.life[1]-a.life[0]),l.size=a.size[0]+this.rand()*(a.size[1]-a.size[0]),this.list.push(l)}}update(t,e,n,s){for(let a of this.list){let o=Nh[a.kind];a.age+=t;let l=o.drag*n;a.vx-=a.vx*Math.min(1,l*t),a.vy-=a.vy*Math.min(1,l*t),a.vz-=a.vz*Math.min(1,l*t),a.vy+=(o.lift?o.lift*n:-e)*t,a.x+=a.vx*t,a.y+=a.vy*t,a.z+=a.vz*t,a.size+=o.grow*t;let c=o.lift?-1/0:s.height(a.x,a.z)+.003;a.y<c&&(a.y=c,a.vx*=.3,a.vz*=.3,a.vy=0)}this.list=this.list.filter(a=>a.age<a.life);let r=0;for(let a of this.list){let o=Nh[a.kind],l=a.age/a.life,c=o.soft?o.alpha*(1-l)*Math.min(1,a.age*6):o.alpha*Math.min(1,(1-l)*3);this.positions.set([a.x,a.y,a.z],r*3),this.colours.set([o.colour[0],o.colour[1],o.colour[2],c],r*4),this.sizes.set([a.size,o.soft],r*2),r++}for(let a of["position","tint","look"])this.geo.attributes[a].needsUpdate=!0;this.geo.setDrawRange(0,r)}};function Uh(i){let t=new ve,e=new Xn({color:i,depthTest:!1,transparent:!0,opacity:.95}),n=new Kt(new he(.0055,.0055,1,10).translate(0,.5,0),e),s=new Kt(new cs(.016,.04,14).translate(0,-.02,0),e);t.add(n,s),t.renderOrder=10,n.renderOrder=10,s.renderOrder=10;let r=new L(0,1,0),a=new L;return{group:t,set(o,l){let c=l.length();t.visible=c>.004,t.visible&&(a.copy(l).divideScalar(c),t.position.copy(o),t.quaternion.setFromUnitVectors(r,a),n.scale.y=Math.max(.001,c-.035),s.position.y=c)}}}var Dl=class{constructor(t){this.canvas=t;let e=new Al({canvas:t,antialias:!0,powerPreference:"high-performance"});e.outputColorSpace=Fe,e.toneMapping=Qr,e.toneMappingExposure=1,e.shadowMap.enabled=!0,e.shadowMap.type=ms,this.renderer=e,this.maxAniso=Math.min(4,e.capabilities.getMaxAnisotropy());let n=new Ys;this.scene=n,this.camera=new on(45,1,.05,400),this.skyUniforms={top:{value:new $t},horizon:{value:new $t},ground:{value:new $t}};let s=new Kt(new xn(300,32,16),new ln({uniforms:this.skyUniforms,side:en,depthWrite:!1,fog:!1,vertexShader:`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,fragmentShader:`
          uniform vec3 top;
          uniform vec3 horizon;
          uniform vec3 ground;
          varying vec3 vDir;
          void main() {
            float h = vDir.y;
            vec3 c = h > 0.0 ? mix(horizon, top, pow(min(1.0, h * 1.6), 0.7)) : mix(horizon, ground, min(1.0, -h * 8.0));
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`}));s.renderOrder=100,this.sky=s,n.add(s);let r=[],a=fa(5);for(let K=0;K<600;K++){let B=a()*Math.PI*2,X=Math.acos(a()*.95);r.push(Math.cos(B)*Math.sin(X)*280,Math.cos(X)*280,Math.sin(B)*Math.sin(X)*280)}let o=new Re;o.setAttribute("position",new oe(r,3)),this.stars=new Ks(o,new Js({color:16777215,size:1.5,sizeAttenuation:!1,fog:!1})),this.stars.renderOrder=101,n.add(this.stars),this.hemi=new Jr(14675967,7245650,.9),n.add(this.hemi);let l=new jr(16774112,2.6);l.castShadow=!0,l.shadow.mapSize.set(Fh?1024:2048,Fh?1024:2048);let c=l.shadow.camera;c.left=-3.5,c.right=3.5,c.top=3.5,c.bottom=-3.5,c.near=.5,c.far=20,l.shadow.bias=-4e-4,l.shadow.normalBias=.01,n.add(l,l.target),this.sun=l,this.groundMaterials=es.map(()=>null),this.chunks=new Map,this.shown=new Set;let h=Lh("grass",99),d=new qn(h);d.wrapS=d.wrapT=bi,d.colorSpace=Fe,d.anisotropy=this.maxAniso,this.fieldMaterial=new ps({map:d,color:10467722});let u=d.clone();u.repeat.set(.5,.5),this.vergeMaterial=new ps({map:u,color:10467722});let f=200,g=new gn(f-On,400).rotateX(-Math.PI/2),M=g.attributes.uv,p=g.attributes.position;this.field=new ve;for(let K of[-1,1]){let B=g.clone(),X=K*(On+(f-On)/2);for(let rt=0;rt<M.count;rt++)B.attributes.uv.setXY(rt,(p.getX(rt)+X)/2,-p.getZ(rt)/2);let I=new Kt(B,this.fieldMaterial);I.position.set(X,-.004,0),I.receiveShadow=!0,this.field.add(I)}n.add(this.field);let m=pa(256,256),T=m.getContext("2d"),b=fa(31);T.fillStyle="#5e4128",T.fillRect(0,0,256,256);for(let K=0;K<260;K++){let B=b()*256;T.strokeStyle=b()<.5?"rgba(30,18,8,0.55)":"rgba(140,110,80,0.35)",T.lineWidth=1+b()*3,T.beginPath(),T.moveTo(B,0),T.bezierCurveTo(B+(b()-.5)*20,85,B+(b()-.5)*20,170,B+(b()-.5)*10,256),T.stroke()}let x=new qn(m);x.wrapS=x.wrapT=bi,x.repeat.set(2,3),x.colorSpace=Fe,x.anisotropy=this.maxAniso;let S=pa(128,128),v=S.getContext("2d");v.fillStyle="#c9a675",v.fillRect(0,0,128,128);for(let K=4;K<64;K+=5)v.strokeStyle=K>56?"#4a311d":"rgba(120,85,45,0.6)",v.lineWidth=K>56?8:1.5,v.beginPath(),v.arc(64,64,K,0,Math.PI*2),v.stroke();let A=new qn(S);A.colorSpace=Fe,this.logMaterials=[new Pe({map:x,bumpMap:x,bumpScale:2,roughness:.95}),new Pe({map:A,roughness:.8}),new Pe({map:A,roughness:.8})];let _=new qn(Lh("rock",1977));_.wrapS=_.wrapT=bi,_.colorSpace=Fe,this.rockMaterial=new Pe({map:_,roughness:.88,flatShading:!0}),this.signTextures=We.sections.map(()=>null),this.signs=[];let E=new Pe({color:8018490,roughness:.9});for(let K=0;K<6;K++){let B=new ve,X=new Kt(new he(.03,.035,1.1,10).translate(0,.55,0),E);X.castShadow=!0;let I=new Kt(new gn(1.1,.5),new Pe({roughness:.7}));I.position.set(0,1.25,.04);let rt=new Kt(new In(1.14,.54,.04),E);rt.position.set(0,1.25,0),B.add(X,rt,I),B.position.x=Le+1.4,n.add(B),this.signs.push({group:B,board:I,section:null})}this.treeBlocks=[];let C=120,P=new he(.12,.18,1.6,7).translate(0,.8,0),N=new cs(1.3,3.6,8).translate(0,3.2,0),H=new Pe({color:7031343,roughness:1}),D=new Pe({color:4157239,roughness:1,flatShading:!0});for(let K=0;K<2;K++){let B=fa(21),X=90,I=new ls(P,H,X),rt=new ls(N,D,X),lt=new me;for(let Ct=0;Ct<X;Ct++){let F=(Ct%2?1:-1)*(On+1+B()*40),G=-B()*C,it=.7+B()*.8;lt.compose(new L(F,0,G),new bn().setFromEuler(new wn(0,B()*6,0)),new L(it,it*(.8+B()*.5),it)),I.setMatrixAt(Ct,lt),rt.setMatrixAt(Ct,lt)}let mt=new ve;mt.add(I,rt),n.add(mt),this.treeBlocks.push(mt)}this.treeBlock=C,this.car=new ve,this.frame=new ve,this.car.add(this.frame),n.add(this.car),this.axleGroups=[new ve,new ve];for(let K of this.axleGroups)n.add(K);this.buildFrame();let k=Tv(this.maxAniso).wheel,Y=xf({maxAniso:this.maxAniso,makeWheel:()=>k.clone()});this.frame.add(Y.group),this.steeringWheel=Y.steeringWheel,this.wheels=ni.map((K,B)=>{let X=B?k.clone():k,I=X.getObjectByName("blur");return I.material=I.material.clone(),X.rotation.order="YXZ",X.position.set(K.at[0],0,0),this.axleGroups[K.front?0:1].add(X),{wheel:X,tire:X.getObjectByName("tire"),blur:I}}),this.marks=new Oh(n),this.particles=new Bh(n),this.lastPoints=ni.map(()=>null),this.arrows={weight:Uh(16743034),normals:ni.map(()=>Uh(6476543)),frictions:ni.map(()=>Uh(16765286))};for(let K of[...this.arrows.normals,...this.arrows.frictions])n.add(K.group);n.add(this.arrows.weight.group);let q=new Xn({color:12950527,depthTest:!1,transparent:!0});this.torqueArc=new Kt(new Pn(.11,.0055,8,48,Math.PI*1.2),q),this.torqueHead=new Kt(new cs(.017,.045,14),q),this.torqueArc.renderOrder=this.torqueHead.renderOrder=10,this.torque=new ve,this.torque.add(this.torqueArc,this.torqueHead),n.add(this.torque),this.view={...Ih},this.goal={...Ih},this.heading=0,this.lookY=An,this.fov=52,this.lastOrbit=-1/0,this.chasePosition=null,this.world=null,this.labelPoints={},this.pixelRatio=_f(),this.resize()}setPixelRatio(t){this.pixelRatio=t,this.resize()}groundMaterial(t){if(!this.groundMaterials[t]){let e=es[t].id,n=Ll[e],s=new qn(Lh(e,1e3+t*77));s.wrapS=s.wrapT=bi,s.colorSpace=Fe,s.anisotropy=this.maxAniso,this.groundMaterials[t]=new Pe({map:s,bumpMap:n.bump?s:null,bumpScale:n.bump,roughness:n.rough,metalness:0,envMapIntensity:e==="ice"||e==="wet"?1.4:1})}return this.groundMaterials[t]}signTexture(t){if(!this.signTextures[t]){let e=We.sections[t],n=pa(512,232),s=n.getContext("2d");s.fillStyle="#f4efe4",s.fillRect(0,0,512,232),s.fillStyle=zh(e.look),s.fillRect(0,0,512,26),s.fillStyle="#2a2622",s.textAlign="center",s.font='800 62px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',s.fillText(e.name,256,112,480),s.fillStyle="#6a6158",s.font='600 34px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',s.fillText(e.note,256,178,480);let r=new qn(n);r.colorSpace=Fe,r.anisotropy=this.maxAniso,this.signTextures[t]=r}return this.signTextures[t]}chunk(t){if(this.chunks.has(t))return this.chunks.get(t);let e=new ve,n=t*Ri,s=We.sections.filter(A=>A.start<n+Ri&&A.start+A.length>n),r=s.some(A=>A.fine)?.04:.1,a=Math.round(Ri/r),o=[],l=Le+.5,c=Math.ceil((On-l)/.4);for(let A=0;A<c;A++)o.push(-On+(On-l)*A/c);let h=Math.round(2*l/.1);for(let A=0;A<=h;A++)o.push(-l+2*l*A/h);for(let A=c-1;A>=0;A--)o.push(On-(On-l)*A/c);let d=o.length,u=(A,_)=>{let{section:E,u:C}=We.locate(_);return(E.drawn||E.height)(A,C)},f=[];for(let A=-1;A<=a+1;A++)f.push(o.map(_=>u(_,n+A*r)));let g=new Float32Array(d*(a+1)*3),M=new Float32Array(d*(a+1)*3),p=new Float32Array(d*(a+1)*2);for(let A=0;A<=a;A++){let _=f[A+1];for(let E=0;E<d;E++){let C=A*d+E,P=Math.max(0,E-1),N=Math.min(d-1,E+1),H=(_[N]-_[P])/(o[N]-o[P]),D=(f[A+2][E]-f[A][E])/(2*r),k=new L(-H,1,D).normalize();g.set([o[E],_[E],-A*r],C*3),M.set([k.x,k.y,k.z],C*3),p.set([o[E],n+A*r],C*2)}}let m=[],T=[];for(let A=0;A<a;A++)for(let _=0;_<d-1;_++){let E=We.surface((o[_]+o[_+1])/2,-(n+(A+.5)*r)).id;(E==="wood"||E==="rock")&&(E="dirt");let C=m.indexOf(E);C<0&&(C=m.push(E)-1,T.push([]));let P=A*d+_;T[C].push(P,P+1,P+d,P+1,P+d+1,P+d)}let b=new Re;b.setAttribute("position",new Ae(g,3)),b.setAttribute("normal",new Ae(M,3)),b.setAttribute("uv",new Ae(p,2));let x=[];T.forEach((A,_)=>{b.addGroup(x.length,A.length,_);for(let E of A)x.push(E)}),b.setIndex(x);let S=m.map(A=>A==="grass"?this.vergeMaterial:this.groundMaterial(es.findIndex(_=>_.id===A))),v=new Kt(b,S);v.receiveShadow=!0,e.add(v);for(let A of s){for(let _ of A.logs||[]){let E=A.start+_.u;if(E<n||E>=n+Ri)continue;let C=new Kt(new he(_.r,_.r,5.4,22).rotateZ(Math.PI/2),this.logMaterials);C.position.set(0,.8*_.r,-(E-n)),C.rotation.y=_.angle,C.castShadow=C.receiveShadow=!0,e.add(C)}for(let _ of A.rocks||[]){let E=A.start+_.u;if(E<n||E>=n+Ri)continue;let C=new Kt(new xn(1,9,5,0,Math.PI*2,0,Math.PI/2),this.rockMaterial);C.scale.set(_.rx,_.h,_.ru),C.position.set(_.x,0,-(E-n)),C.castShadow=C.receiveShadow=!0,e.add(C)}}return e.visible=!1,this.scene.add(e),this.chunks.set(t,e),e}setWorld(t){if(this.world===t)return;this.world=t;let e=vf[t]||vf.earth;this.skyUniforms.top.value.set(e.top),this.skyUniforms.horizon.value.set(e.horizon),this.skyUniforms.ground.value.set(e.ground),this.scene.fog=e.fog?new Pr(e.horizon,e.fog[0],e.fog[1]):null,this.stars.visible=t==="moon",this.sun.intensity=e.sun,this.hemi.intensity=e.hemi,this.hemi.color.set(e.horizon),this.hemi.groundColor.set(9077880),this.fieldMaterial.color.set(t==="earth"?10467722:e.ground),this.vergeMaterial.color.copy(this.fieldMaterial.color);for(let o of this.treeBlocks)o.visible=t==="earth";let n=new cr(this.renderer),s=new Ys;s.add(this.sky.clone());let r=new Kt(new gn(600,600).rotateX(-Math.PI/2),new Xn({color:7828331}));r.position.y=-2,s.add(r);let a=new Kt(new xn(18,16,8),new Xn({color:16777215}));a.position.set(-120,160,60),s.add(a),this.scene.environment&&this.scene.environment.dispose(),this.scene.environment=n.fromScene(s,.02).texture,n.dispose()}resize(){let t=window.innerWidth,e=window.innerHeight;this.maxPixelRatio=_f(),this.pixelRatio=Math.min(this.pixelRatio,this.maxPixelRatio),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.W=t,this.H=e,this.updatePointScale()}updatePointScale(){let t=this.H*this.renderer.getPixelRatio();this.particles.material.uniforms.scale.value=t/(2*Math.tan(this.camera.fov*Math.PI/360)),this.particles.material.uniforms.biggest.value=.2*t}orbit(t,e){this.goal.yaw-=t*.008,this.goal.pitch=Math.min(1.35,Math.max(this.goal.mode==="driver"?-.6:.04,this.goal.pitch+e*.006)),this.lastOrbit=performance.now()}zoom(t){this.goal.dist=Math.min(22,Math.max(2.5,this.goal.dist*t))}setView(t){Object.assign(this.goal,t),this.view.mode=this.goal.mode,this.chasePosition=null}clearEffects(){this.marks.clear(),this.particles.list.length=0,this.lastPoints=ni.map(()=>null)}buildFrame(){let t=(b,x,S)=>new Pe({color:b,metalness:x,roughness:S}),e=t(1908771,.5,.5),n=t(6119784,.8,.4),s=t(4869456,.6,.6),r=t(3099502,.35,.5),a=t(15264492,1,.2),o=t(14538698,.3,.45),l=t(1316119,.2,.7),c=t(3422269,.7,.5),h=(b,x,S,v,A,_=this.frame)=>{let E=new Kt(b,x);return E.position.set(S,v,A),E.castShadow=!0,_.add(E),E},d=(b,x,S)=>new In(b,x,S),u=pe.wheelbase/2,[f,g]=this.axleGroups,M=pe.rightHandDrive?1:-1;for(let b of pr){let[x,S,v]=b.at,[A,_,E]=b.size;if(b.name==="frame rail"){let C=Math.sign(x);h(d(.008,_,E),e,x-C*(A/2-.004),S,v),h(d(A,.008,E),e,x,S+_/2-.004,v),h(d(A,.008,E),e,x,S-_/2+.004,v)}else if(b.name==="cross member"||b.name==="rear cross member")h(d(A,_,E),e,x,S,v);else if(b.name==="front bumper")h(d(A,_,E),l,x,S,v);else if(b.name==="front axle"||b.name==="rear axle"){let C=b.name==="front axle",P=C?f:g;h(new he(.04,.04,A,20).rotateZ(Math.PI/2),s,0,S,0,P);let N=C?.12:0;if(h(new xn(.14,24,16),s,N,S,0,P),h(new he(.055,.07,.18,18).rotateX(Math.PI/2),s,N,S+.01,C?.15:-.15,P),C)for(let H of[-1,1])h(new xn(.085,20,14),s,H*(A/2+.02),S,0,P)}else b.name==="engine"?(h(d(.36,.38,.86),r,x,S-.06,v),h(d(.3,.12,.84),r,x+.02,S+.19,v),h(d(.2,.07,.8),a,x+.02,S+.28,v),h(d(.3,.14,.7),l,x,S-.31,v+.05),h(new he(.06,.06,.05,20).rotateX(Math.PI/2),n,x,S-.02,v-.45),this.fan=h(new he(.2,.2,.01,6).rotateX(Math.PI/2),l,x,S+.05,v-.52),h(new he(.15,.15,.09,28),l,x-.05,S+.38,v+.05),h(d(.05,.06,.7),s,x-.21,S+.03,v)):b.name==="gearbox and transfer case"?(h(new he(.15,.2,.2,24).rotateX(Math.PI/2),s,x,S+.05,v-.25),h(d(.22,.24,.32),s,x,S+.02,v+.02),h(d(.34,.26,.18),s,x+.04,S-.04,v+.24),h(new he(.008,.01,.62,8),a,x,S+.42,v-.02),h(new xn(.025,12,8),l,x,S+.73,v-.02),h(new he(.007,.008,.5,8),a,x+.08,S+.33,v+.22),h(new xn(.02,12,8),l,x+.08,S+.58,v+.22)):b.name==="radiator"?(h(d(A,_,E),l,x,S,v),h(d(A+.04,.03,E+.02),n,x,S+_/2,v),h(d(A+.04,.03,E+.02),n,x,S-_/2,v)):b.name==="fuel tank"?h(d(A,_,E),l,x,S,v):b.name==="battery"&&(h(d(A,_,E),l,x,S,v),h(new he(.012,.012,.025,10),t(12597547,.3,.5),x-.07,S+_/2+.01,v),h(new he(.012,.012,.025,10),l,x+.07,S+_/2+.01,v))}let p=new ve;for(let b=0;b<4;b++){let x=1.15-b*.2,S=new us(new L(0,.05,-x/2),new L(0,-.035,0),new L(0,.05,x/2)),v=new Kt(new Vi(S,16,.006,4,!1),c);v.scale.set(8,1,1),v.position.y=-b*.011,v.castShadow=!0,p.add(v)}for(let[b,x]of[[0,-u],[1,u]])for(let S of[-1,1]){let v=p.clone();v.position.set(S*.42,.06,0),this.axleGroups[b].add(v),h(d(.06,.05,.1),n,S*.42,.045,0,this.axleGroups[b]);for(let A of[-.56,.56])h(d(.03,.08,.03),e,S*.42,.09,x+A);h(new he(.025,.025,.3,10),l,S*.5,.15,.12*(b?-1:1),this.axleGroups[b])}let m=pe.frontTrack/2-.13;this.knuckles=[-1,1].map(b=>{let x=new ve;x.position.set(b*m,0,0);let S=new Kt(d(.03,.03,.2),n);return S.position.set(-b*.03,-.05,.1),S.castShadow=!0,x.add(S),f.add(x),x}),this.tieRod=h(new he(.014,.014,1,10).rotateZ(Math.PI/2),n,0,-.05,.2,f),h(d(.12,.12,.15),s,M*.5,.12,-u-.1);let T=(b,x)=>{let S=new ve,v=new ve;S.add(v);let A=new Kt(new he(.032,.032,1,14).rotateX(Math.PI/2).translate(0,0,.5),n);A.castShadow=!0,v.add(A);let _=[0,1].map(()=>{let E=new Kt(d(.09,.025,.05),s);return v.add(E),E});return this.scene.add(S),{group:S,spinner:v,tube:A,yokes:_,from:b,to:x}};this.shafts=[T(new L(.12,-.02,.18),[0,new L(.12,.01,.24)]),T(new L(.04,-.02,.34),[1,new L(0,.01,-.24)])]}draw(t,e,n){this.setWorld(n.world);let[s,r,a]=t.p,o=n.realDt||e;this.car.position.set(s,r,a),this.car.quaternion.set(t.q[1],t.q[2],t.q[3],t.q[0]),this.frame.position.set(-t.centre[0],-t.centre[1],-t.centre[2]),this.car.updateMatrixWorld();let l=new me;t.axles.forEach((g,M)=>{let p=t.axleFrame(g),m=new L(...p.beam),T=new L(...p.up);l.makeBasis(m,T,m.clone().cross(T));let b=this.axleGroups[M];b.position.set(...p.middle),b.quaternion.setFromRotationMatrix(l),b.updateMatrixWorld()}),t.wheels.forEach((g,M)=>{let p=this.wheels[M];p.wheel.rotation.set(g.side>0?-g.angle:g.angle,g.steer+(g.side>0?0:Math.PI),0),p.tire.scale.x=1+Math.min(.15,g.contact.squash/An*1.2),p.blur.material.opacity=Math.min(.85,Math.max(0,(Math.abs(g.spin)-18)/40))});let[c,h]=t.wheels;this.knuckles[0].rotation.y=c.steer,this.knuckles[1].rotation.y=h.steer;let d=(g,M)=>new L(-M*.03,-.05,.2).applyEuler(g.rotation).add(g.position),u=d(this.knuckles[0],-1),f=d(this.knuckles[1],1);this.tieRod.position.copy(u).add(f).multiplyScalar(.5),this.tieRod.scale.x=u.distanceTo(f),this.tieRod.rotation.y=-Math.atan2(f.z-u.z,f.x-u.x),this.steeringWheel.rotation.y=t.steeringWheel,this.fan.rotation.z=t.engineAngle;for(let g of this.shafts){let M=this.frame.localToWorld(g.from.clone()),p=this.axleGroups[g.to[0]].localToWorld(g.to[1].clone()),m=M.distanceTo(p);g.group.position.copy(M),g.group.lookAt(p),g.tube.scale.z=m,g.yokes[0].position.z=.04,g.yokes[1].position.z=m-.04,g.spinner.rotation.z=t.shaftAngle}this.updateTrack(t.along),this.updateEffects(t,e),this.updateForces(t,n.forces),this.updateCamera(t,o),this.sun.position.set(s-2.2,r+5,a-1.5),this.sun.target.position.set(s,r-.7,a),this.sky.position.copy(this.camera.position),this.stars.position.copy(this.camera.position),this.renderer.render(this.scene,this.camera)}updateCamera(t,e){let n=1-Math.exp(-e*6),s=this.goal.mode;s==="chase"&&performance.now()-this.lastOrbit>1500&&(this.goal.yaw+=(0-this.goal.yaw)*(1-Math.exp(-e*2)),this.goal.pitch+=(Ih.pitch-this.goal.pitch)*(1-Math.exp(-e*2)));for(let u of["yaw","pitch","dist"])this.view[u]+=(this.goal[u]-this.view[u])*n;let r=t.heading-this.heading;r=Math.atan2(Math.sin(r),Math.cos(r)),this.heading+=r*(1-Math.exp(-e*(s==="chase"?2.2:3)));let a=Math.abs(t.forwardSpeed),o=t.forward,[l,c,h]=t.p,d=45;if(s==="driver"){let u=this.frame.localToWorld(new L(pe.rightHandDrive?.4:-.4,1.34,.28)),f=this.frame.localToWorld(new L(0,.9,-12)).sub(u);f.applyAxisAngle(new L(0,1,0),this.view.yaw).normalize(),f.y+=-this.view.pitch*.5,this.camera.position.copy(u),this.camera.lookAt(u.clone().add(f)),d=68,this.chasePosition=null}else{let u=s==="chase",f=this.H>this.W?Math.min(1.9,(this.H/this.W)**.7):1,g=this.view.dist*f*(u?1+Math.min(.35,a*.01):1),M=this.heading+this.view.yaw,p=this.view.pitch;this.lookY+=(Math.max(An+.3,c)-this.lookY)*n;let m=u?bv:.6,T=new L(l+o[0]*m,this.lookY+(u?.1:0),h+o[2]*m),b=new L(T.x+Math.sin(M)*Math.cos(p)*g,T.y+Math.sin(p)*g,T.z+Math.cos(M)*Math.cos(p)*g);u&&this.chasePosition&&this.chasePosition.distanceTo(b)<20?this.chasePosition.lerp(b,1-Math.exp(-e*9)):this.chasePosition=b.clone();let x=u?this.chasePosition:b;x.y=Math.max(x.y,We.height(x.x,x.z)+.5),this.camera.position.copy(x),this.camera.lookAt(T),d=u?52+Math.min(16,a*.6):45}this.fov+=(d-this.fov)*(1-Math.exp(-e*3)),Math.abs(this.camera.fov-this.fov)>.01&&(this.camera.fov=this.fov,this.camera.updateProjectionMatrix(),this.updatePointScale())}updateTrack(t){let e=We.length/Ri,n=new Set;for(let l=Math.floor((t-Ph)/Ri);l<=Math.floor((t+Ch)/Ri);l++){let c=this.chunk((l%e+e)%e);c.position.z=-l*Ri,c.visible=!0,n.add(c)}for(let l of this.shown)n.has(l)||(l.visible=!1);this.shown=n,this.field.position.z=-Math.round(t/2)*2;let s=this.treeBlock,r=Math.floor(t/s);this.treeBlocks[0].position.z=-r*s,this.treeBlocks[1].position.z=-(r+1)*s;let a=We.length,o=[];for(let l=Math.floor((t-Ph)/a);l<=Math.floor((t+Ch)/a);l++)We.sections.forEach((c,h)=>{let d=l*a+c.start;d>t-Ph&&d<t+Ch&&o.push({at:d,i:h})});this.signs.forEach((l,c)=>{let h=o[c];l.group.visible=!!h,h&&(l.section!==h.i&&(l.section=h.i,l.board.material.map=this.signTexture(h.i),l.board.material.needsUpdate=!0),l.group.position.z=-h.at)})}updateEffects(t,e){let n=Math.min(1,t.air/1.225),s=this.particles,r=t.ax,a=Math.hypot(t.v[0],t.v[2]);t.wheels.forEach((o,l)=>{let c=o.contact,h=c.surface.id,d=Ll[h],u=c.normal>0,f=u?Math.hypot(c.tread[0],c.tread[2]):0,g=c.normal/(t.mass*t.g/2||1),[M,,p]=c.point,m=c.ground[1],T=this.lastPoints[l];if(u&&T&&Math.hypot(M-T[0],p-T[1])<.5&&(M!==T[0]||p!==T[1])){let v=0,A=0;h==="asphalt"||h==="concrete"?v=Math.min(.6,Math.max(0,f-1.2)*.15):h==="ice"?v=Math.min(.55,Math.max(0,f-.8)*.22):h==="wet"?(v=.45,A=.15):v=Math.min(.7,c.sink/.012*.35+Math.min(1,Math.hypot(c.slip,c.sideSlip))*.25),v>.02&&this.marks.add(l,T[0],T[1],M,p,d.mark,v,A,t.time)}if(this.lastPoints[l]=[M,p],!u||e<=0)return;let b=c.tread,x=(v,A)=>{let _=(v()-.5)*je.width;return{x:M+r[0]*_+(v()-.5)*.04,y:m+.01,z:p+r[2]*_+(v()-.5)*.04,vx:t.v[0]*.3+b[0]*(.3+v()*.6)+(v()-.5)*.4,vy:A*(.3+v()*.9)+.2,vz:t.v[2]*.3+b[2]*(.3+v()*.6)+(v()-.5)*.4}},S=d.throws;if(S==="smoke")f>2.5&&n>0&&s.spawn("smoke",(f-2.5)*16*Math.min(2,g),e,v=>({x:M+(v()-.5)*.12,y:m+.03,z:p+(v()-.5)*.12,vx:b[0]*.15,vy:.1+v()*.2,vz:b[2]*.15}));else if(S==="spray"){let v=f*140+Math.max(0,a-.4)*70;v>1&&s.spawn("spray",v,e,A=>x(A,.4+f*.3+a*.25))}else S==="frost"?f>.5&&s.spawn("frost",f*70,e,v=>x(v,.3)):f>.25&&(s.spawn(S,f*110*Math.min(2,g),e,v=>x(v,.3+f*.35)),(S==="sand"||S==="stones"||S==="dirt")&&n>0&&s.spawn("dust",f*8,e,v=>({...x(v,.2),vx:b[0]*.2,vz:b[2]*.2})))}),this.marks.write(t.time,We),s.update(e,t.g,n,We)}updateForces(t,e){let n=this.arrows;for(let u of[n.weight,...n.normals,...n.frictions])u.group.visible=e;if(this.torque.visible=e&&!!t.wheelTorque,this.labelPoints={},!e)return;let s=t.mass*t.g,r=.8*An/(s/4||1),a=2.6*An,o=u=>Math.sign(u)*Math.min(a,Math.abs(u)*r),[l,c,h]=t.p,d=-Math.min(s*r,4*a);if(n.weight.set(new L(l,c,h),new L(0,d,0)),this.labelPoints.weight=new L(l,c+d*.5,h),t.wheels.forEach((u,f)=>{let g=u.contact,M=u.side*(ma+.03),p=new L(g.ground[0]+g.axle[0]*M,g.ground[1]+g.axle[1]*M,g.ground[2]+g.axle[2]*M);if(g.normal>0){let m=o(g.normal),T=new L(...g.n).multiplyScalar(m);n.normals[f].set(p.clone().sub(T),T);let b=new L(...g.friction),x=b.length();n.frictions[f].set(p,x>0?b.multiplyScalar(Math.abs(o(x))/x):new L),this.labelPoints["tire"+f]=p.clone().addScaledVector(T,-.5)}else n.normals[f].group.visible=!1,n.frictions[f].group.visible=!1}),t.wheelTorque){let u=t.wheelTorque,f=Math.sign(u),g=Math.min(1,Math.abs(u)/6e3)*Math.PI*1.2+.4;this.torqueArc.geometry.dispose(),this.torqueArc.geometry=new Pn(.24,.008,8,48,g);let M=new L(...t.axleFrame(t.axles[1]).middle);this.torque.position.copy(M),this.torque.rotation.set(0,t.heading+Math.PI/2,0);let p=Math.PI/2-g/2;this.torqueArc.rotation.set(0,0,p);let m=f>0?p:p+g;this.torqueHead.position.set(Math.cos(m)*.24,Math.sin(m)*.24,0),this.torqueHead.rotation.set(0,0,m+(f>0?Math.PI:0)),this.labelPoints.torque=M.clone().add(new L(0,.25,0))}}project(t){let e=t.clone().project(this.camera);return e.z>1?null:{x:(e.x*.5+.5)*this.W,y:(-e.y*.5+.5)*this.H}}};var Av=`
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
    this.want = { rpm: 800, load: 0, roll: 0, hard: 0, lug: 0, squeal: 0, scrub: 0, crunch: 0, soft: 0, inside: 0 };
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
    const stoneRate = (s.crunch * 420) / sampleRate;
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
      let tires = band * s.roll * (0.18 + 0.25 * s.hard);
      this.lugAt += s.lug / sampleRate;
      this.lugAt -= Math.floor(this.lugAt);
      tires += (this.lugAt - 0.5) * s.roll * s.hard * 0.06;
      // Stones and grit cracking under the tread.
      const hit = this.noise() * 0.5 + 0.5 < stoneRate ? (0.4 + 0.6 * (this.noise() * 0.5 + 0.5)) * 3 : 0;
      tires += (this.stones[0].run(hit) + this.stones[1].run(hit * 0.6)) * 0.5;
      // Sand, grass and mud.
      tires += this.swish.run(white, toward(380)) * s.soft * 0.9;
      // Sliding: a squeal on hard ground, a scrabble on loose.
      if (s.squeal > 0.002) {
        this.wobble += (TAU * 7) / sampleRate;
        this.squealAt += (880 + 45 * Math.sin(this.wobble) + 25 * this.noise()) / sampleRate;
        this.squealAt -= Math.floor(this.squealAt);
        const grain = 0.6 + 0.4 * this.squealGrain.run(white, toward(40)) * 4;
        tires += (Math.sin(TAU * this.squealAt) + 0.35 * Math.sin(2 * TAU * this.squealAt)) * grain * s.squeal * 0.22;
      }
      tires += this.scrabble.run(white) * s.scrub * 0.6;
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
`,Rv={asphalt:"hard",concrete:"hard",wet:"slick",gravel:"stones",grass:"soft",sand:"soft",mud:"soft",snow:"soft",ice:"slick",dirt:"stones",rock:"hard",wood:"hard"},Cv=.065,Iv=283,ji=i=>Math.max(0,Math.min(1,i)),Nl=class{constructor(){this.on=!0,this.ready=!1,this.lastLoads=[0,0,0,0]}async start(){if(this.context)return;let t=window.AudioContext||window.webkitAudioContext;if(!(!t||!window.AudioWorkletNode)){this.context=new t;try{let e=URL.createObjectURL(new Blob([Av],{type:"application/javascript"}));await this.context.audioWorklet.addModule(e),URL.revokeObjectURL(e),this.node=new AudioWorkletNode(this.context,"naseeb-sound",{numberOfInputs:0,outputChannelCount:[2]}),this.volume=this.context.createGain(),this.volume.gain.value=this.on?1:0,this.node.connect(this.volume).connect(this.context.destination),this.ready=!0}catch{this.context=null}}}wake(){this.context&&this.context.state==="suspended"&&!this.paused&&this.context.resume()}setOn(t){this.on=t,this.volume&&this.volume.gain.setTargetAtTime(t?1:0,this.context.currentTime,.05)}pause(t){this.paused=t,this.context&&(t?this.context.suspend():this.context.resume())}update(t,{inside:e=!1,rate:n=1}={}){if(!this.ready)return;let s=t.mass*t.g/4,r=0,a=0,o=0,l=0,c=0,h=0;t.wheels.forEach((u,f)=>{let g=u.contact,M=g.normal/s,p=(M-this.lastLoads[f])*s;if(this.lastLoads[f]=M,p>9e3&&(h=Math.max(h,ji(p/45e3))),g.normal<=0)return;let m=Rv[g.surface.id]||"hard",T=ji((Math.hypot(...g.tread)-.6)/3)*Math.min(2,M);m==="hard"?(o+=.25,r+=T):m!=="slick"&&(a+=T),m==="stones"&&(l+=.25),m==="soft"&&(c+=.25)});let d=Math.hypot(t.v[0],t.v[2]);this.node.port.postMessage({rpm:t.rpm*n,load:ji(t.engineTorque/Iv),roll:ji(d/22),hard:o,lug:d/Cv*n,squeal:ji(r/2),scrub:ji(a/2),crunch:l*ji(d/6),soft:c*ji(d/8),inside:e?1:0,thump:h})}};var Af="naseeb-fj40-settings",Rf=pe.wheelbase/2+1.5,Vh=.1,Pv=.15,yf=.2,Mf=[{name:"Chase",mode:"chase",yaw:0,pitch:.23,dist:10.7},{name:"Driver",mode:"driver",yaw:0,pitch:0,dist:10.7},{name:"Side",mode:"orbit",yaw:Math.PI/2,pitch:.12,dist:7},{name:"High",mode:"orbit",yaw:.6,pitch:1,dist:11}],Xt=i=>document.getElementById(i),Pt={canvas:Xt("game"),speed:Xt("r-speed"),gear:Xt("r-gear"),rpm:Xt("r-rpm"),steer:Xt("r-steer"),slip:Xt("r-slip"),state:Xt("r-state"),heading:Xt("r-heading"),moved:Xt("r-moved"),surface:Xt("r-surface"),weight:Xt("r-weight"),normalFront:Xt("r-normal-front"),normalRear:Xt("r-normal-rear"),frictionFront:Xt("r-friction-front"),frictionRear:Xt("r-friction-rear"),rolling:Xt("r-rolling"),drag:Xt("r-drag"),torque:Xt("r-torque"),springsFront:Xt("r-springs-front"),springsRear:Xt("r-springs-rear"),extra:Xt("extra"),more:Xt("more"),slow:Xt("t-slow"),view:Xt("t-view"),drop:Xt("t-drop"),sound:Xt("t-sound"),settingsButton:Xt("t-settings"),settings:Xt("settings"),close:Xt("s-close"),defaults:Xt("s-defaults"),derived:Xt("s-derived"),surfaces:Xt("surfaces"),hint:Xt("hint"),labels:Xt("labels"),overlay:Xt("overlay"),start:Xt("start"),go:Xt("c-go"),brake:Xt("c-brake"),left:Xt("c-left"),right:Xt("c-right"),gears:Xt("gears"),tach:Xt("tach-bar")};function Lv(){try{let i=JSON.parse(localStorage.getItem(Af)||"{}"),t={...gi,...i};return Ts[t.world]||(t.world=gi.world),["4x4","rear"].includes(t.drive)||(t.drive=gi.drive),["none","rear","both"].includes(t.lockers)||(t.lockers=gi.lockers),t}catch{return{...gi}}}function Dv(){try{localStorage.setItem(Af,JSON.stringify(jn))}catch{}}var jn=Lv(),gt=new Ea(jn),Ze=new Dl(Pt.canvas),Ve={forces:!1,slow:!1,started:!1,preset:0},Kn={throttle:!1,back:!1,brake:!1,left:!1,right:!1},Qi={throttle:!1,back:!1,left:!1,right:!1},Ol=0,Nv=.3,ga=null;function Uv(){let i=Kn.throttle||Qi.throttle||gt.time<Ol,t=Kn.back||Qi.back,e=Kn.left||Qi.left,n=Kn.right||Qi.right,s=e===n?0:e?1:-1,r=i,a=Kn.brake||t,o=Math.abs(gt.forwardSpeed)<Nv;(gt.auto||gt.gear!==-1)&&(ga=null);let l=gt.gear===-1&&(gt.auto||ga!==null);return l?(i&&o&&!t&&(gt.auto?gt.autoReverse(!1):gt.shift(ga),ga=null),r=t,a=Kn.brake||i):t&&o&&!i&&gt.gear!==-1&&(gt.auto?gt.autoReverse(!0):(ga=gt.gear,gt.shift(-1))),{throttle:a&&!(l&&t)?0:r?1:0,brake:a?1:0,steer:s}}function Cf(){Ol=gt.time+Pv,Pt.hint.classList.add("gone")}for(let[i,t]of[[Pt.go,"throttle"],[Pt.brake,"back"],[Pt.left,"left"],[Pt.right,"right"]]){i.addEventListener("pointerdown",n=>{if(n.preventDefault(),!!Ve.started){Qi[t]=!0,i.classList.add("held"),t==="throttle"&&Cf();try{i.setPointerCapture(n.pointerId)}catch{}}});let e=()=>{Qi[t]=!1,i.classList.remove("held")};for(let n of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(n,e);i.addEventListener("contextmenu",n=>n.preventDefault())}var Fv=[["auto","Auto"],[-1,"R"],[0,"N"],...Ui.map((i,t)=>[t+1,i.name])].map(([i,t])=>{let e=document.createElement("button");return e.className="gear",e.textContent=t,e.title=i==="auto"?"Automatic (0)":i===-1?"Reverse (R)":i===0?"Neutral (N)":`${Ui[i-1].label} (${i})`,e.addEventListener("click",()=>gt.shift(i)),Pt.gears.append(e),{gear:i,b:e}}),Ii=new Map,_a=null;Pt.canvas.addEventListener("pointerdown",i=>{if(Ii.set(i.pointerId,{x:i.clientX,y:i.clientY}),Ii.size===2){let[t,e]=[...Ii.values()];_a=Math.hypot(t.x-e.x,t.y-e.y)}try{Pt.canvas.setPointerCapture(i.pointerId)}catch{}});Pt.canvas.addEventListener("pointermove",i=>{let t=Ii.get(i.pointerId);if(!t)return;let e=i.clientX-t.x,n=i.clientY-t.y;if(t.x=i.clientX,t.y=i.clientY,Ii.size===2&&_a){let[s,r]=[...Ii.values()],a=Math.hypot(s.x-r.x,s.y-r.y);a>0&&Ze.zoom(_a/a),_a=a;return}Ze.orbit(e,n)});for(let i of["pointerup","pointercancel"])Pt.canvas.addEventListener(i,t=>{Ii.delete(t.pointerId),Ii.size<2&&(_a=null)});Pt.canvas.addEventListener("wheel",i=>{i.preventDefault(),Ze.zoom(Math.exp(i.deltaY*.0012))},{passive:!1});Pt.canvas.addEventListener("contextmenu",i=>i.preventDefault());var If={ArrowUp:"throttle",KeyW:"throttle",ArrowDown:"back",KeyS:"back",Space:"brake",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"};window.addEventListener("keydown",i=>{if(i.target instanceof HTMLInputElement||i.target instanceof HTMLSelectElement)return;if(!Ve.started){(i.code==="Enter"||i.code==="Space")&&(kl(),i.preventDefault());return}let t=If[i.code],e=/^(Digit|Numpad)([0-9])$/.exec(i.code);if(t)!Kn[t]&&(t==="throttle"||t==="back")&&Cf(),Kn[t]=!0;else if(e){let n=Number(e[2]);n===0?gt.shift("auto"):n<=Ui.length&&gt.shift(n)}else if(i.code==="KeyR")gt.shift(-1);else if(i.code==="KeyN")gt.shift(0);else if(i.code==="Backspace")Bl();else if(i.code==="KeyF")Ov();else if(i.code==="KeyM")Uf();else if(i.code==="KeyK")Nf();else if(i.code==="KeyV")Wh();else if(i.code==="Equal"||i.code==="NumpadAdd")Ze.zoom(1/1.15);else if(i.code==="Minus"||i.code==="NumpadSubtract")Ze.zoom(1.15);else return;i.preventDefault()});window.addEventListener("keyup",i=>{let t=If[i.code];t&&(Kn[t]=!1)});window.addEventListener("blur",()=>{for(let i of Object.keys(Kn))Kn[i]=Qi[i]=!1;Ii.clear()});function Bl(){Ol=0,gt.reset(gt.along,Vh)}function Pf(i){i<0||i>=We.sections.length||(Ol=0,gt.reset(We.sectionNear(gt.along,i)+2,Vh))}function Ov(){Ve.forces=!Ve.forces,document.body.classList.toggle("engineer-view",Ve.forces)}var pi=new Nl,Lf="naseeb-sound";try{pi.on=localStorage.getItem(Lf)!=="off"}catch{}function Df(){Pt.sound.classList.toggle("on",pi.on),Pt.sound.setAttribute("aria-pressed",pi.on)}function Nf(){pi.setOn(!pi.on),Df();try{localStorage.setItem(Lf,pi.on?"on":"off")}catch{}}Df();Pt.sound.addEventListener("click",Nf);for(let i of["pointerdown","keydown"])window.addEventListener(i,()=>pi.wake(),!0);function Uf(){Ve.slow=!Ve.slow,Pt.slow.classList.toggle("on",Ve.slow),Pt.slow.setAttribute("aria-pressed",Ve.slow)}function Wh(){Ve.preset=(Ve.preset+1)%Mf.length;let i=Mf[Ve.preset];Ze.setView(i),Pt.view.textContent=`View: ${i.name}`}Pt.slow.addEventListener("click",Uf);Pt.view.addEventListener("click",Wh);Pt.drop.addEventListener("click",Bl);Pt.more.addEventListener("click",()=>{let i=Pt.extra.hidden;Pt.extra.hidden=!i,Pt.more.textContent=i?"Less":"More"});window.innerWidth<640&&(Pt.extra.hidden=!0,Pt.more.textContent="More");We.sections.forEach((i,t)=>{let e=document.createElement("button");e.className="surface",e.innerHTML=`<i style="background:${zh(i.look)}"></i>${i.name}`,e.title=i.note,e.addEventListener("click",()=>Pf(t)),Pt.surfaces.append(e)});var Ff={weight:{input:Xt("s-weight"),out:Xt("s-weight-out"),show:i=>`${i.toFixed(1)} kg`},pressure:{input:Xt("s-pressure"),out:Xt("s-pressure-out"),show:i=>`${i.toFixed(1)} bar (${Math.round(i*14.5)} psi)`}},Of={drive:Xt("s-drive"),lockers:Xt("s-lockers"),world:Xt("s-world")};function Xh(){for(let[e,n]of Object.entries(Ff))n.input.value=jn[e],n.out.textContent=n.show(jn[e]);for(let[e,n]of Object.entries(Of))n.value=jn[e];let i=gt.mass*gt.g/4,t=[["Kerb weight",`${gt.mass.toFixed(0)} kg`],["On the front tires",`${Math.round(100-gt.rearShare*100)}%`],["Centre of mass",`${((je.radius+gt.totalCentre[1])*100).toFixed(0)} cm up`],["On the springs",`${gt.sprungMass.toFixed(0)} kg (axles ${gt.axles.map(e=>e.mass.toFixed(0)).join(" and ")})`],["Engine",`${Be.name}`],["Peak torque","283 N\xB7m (209 lb\xB7ft) at 2,000 rpm"],["Gears 1\u20136",Ui.map(e=>e.label).join(", ")],["Tire stiffness",`${(gt.kTire/1e3).toFixed(0)} kN/m`],["Squash at rest",`${(i/gt.kTire*1e3).toFixed(0)} mm`],["Contact patch at rest",`${(i/(gt.pressureBar*1e5)*1e4).toFixed(0)} cm\xB2 each`]];Pt.derived.innerHTML=t.map(([e,n])=>`<dt>${e}</dt><dd>${n}</dd>`).join("")}function qh(){gt.configure(jn),Dv(),Xh()}for(let[i,t]of Object.entries(Ff))t.input.addEventListener("input",()=>{jn[i]=Number(t.input.value),qh()});for(let[i,t]of Object.entries(Of))t.addEventListener("change",()=>{jn[i]=t.value,qh()});Pt.defaults.addEventListener("click",()=>{jn={...gi},qh()});Pt.settingsButton.addEventListener("click",()=>{Pt.settings.hidden=!Pt.settings.hidden,Pt.settingsButton.classList.toggle("on",!Pt.settings.hidden),Pt.settings.hidden||Xh()});Pt.close.addEventListener("click",()=>{Pt.settings.hidden=!0,Pt.settingsButton.classList.remove("on")});var Sf=(i,t)=>(Math.abs(i)<.5*10**-t?0:i).toFixed(t),Fl=i=>`${Math.abs(i)<10?Math.abs(i).toFixed(1):Math.round(Math.abs(i))} N`,fi=i=>Math.abs(i)<10?Math.abs(i).toFixed(1):String(Math.round(Math.abs(i))),xa=i=>Math.hypot(i.friction[0],i.friction[2]),Bv=i=>i.rollingMoment/i.rollingRadius+i.soilDrag,bf=(i,t,e)=>{let n=i*180/Math.PI;return Math.abs(n)<.5?"straight":`${Math.abs(n).toFixed(0)}\xB0 ${n>0?t:e}`};function zv(){let t=gt.wheels.map(n=>n.contact).filter(n=>n.normal>0);return gt.overturned?"Rolled over":t.length?Math.hypot(gt.v[0],gt.v[2])<.003&&Math.abs(gt.spin)<.02&&Math.abs(gt.w[1])<.01&&!gt.wheelTorque?"At rest":t.some(n=>n.slip>n.surface.slipAtPeak)?"Wheelspin":t.some(n=>n.slip<-n.surface.slipAtPeak)?gt.controls.brake?"Locked":"Skidding":t.some(n=>Math.abs(n.sideSlip)>n.surface.slipAtPeak)?"Sliding":t.length<4?"Tire up":gt.controls.brake?"Braking":gt.wheelTorque>0?"Gripping":"Rolling":"In the air"}var wf=null,Ef=null;function kv(){let[i,t,e,n]=gt.wheels.map(d=>d.contact),s=gt.forwardSpeed,r=s>.003?" \u2191":s<-.003?" \u2193":"";Pt.speed.textContent=`${Sf(Math.abs(s)*3.6,0)} km/h${r}`;let a=gt.gear>=1?`${gt.auto?"Auto":"Manual"} ${gt.gearName} \xB7 ${Ui[gt.gear-1].label}`:gt.gear===-1?gt.auto?"Auto R \xB7 Reverse":"Reverse":"Neutral";Pt.gear.textContent=a,Pt.rpm.textContent=`${Math.round(gt.rpm/10)*10} rpm${gt.clutch==="slipping"?" \xB7 clutch slipping":""}`,Pt.tach.style.width=`${Math.min(100,gt.rpm/Be.governor*100)}%`,Pt.tach.classList.toggle("red",gt.rpm>Be.governor*.95),Pt.steer.textContent=bf(gt.steer,"left","right");let o=(d,u)=>{let f=[d,u].filter(M=>M.normal>0);if(!f.length)return"\u2013";let g=f.reduce((M,p)=>Math.abs(p.slip)>Math.abs(M)?p.slip:M,0);return`${Sf(g*100,0)}%`};Pt.slip.textContent=`${o(i,t)} \xB7 ${o(e,n)}`;let l=zv();if(Pt.state.textContent=l,Pt.state.dataset.state=l.toLowerCase().replace(/ /g,"-"),Pt.heading.textContent=bf(gt.heading,"left","right"),Pt.moved.textContent=`${gt.moved.toFixed(1)} m`,!Pt.extra.hidden){let d=[...new Set([i,t,e,n].map(M=>M.surface.name))];Pt.surface.textContent=d.join(" \xB7 "),Pt.weight.textContent=Fl(gt.mass*gt.g),Pt.normalFront.textContent=`${fi(i.normal)} \xB7 ${fi(t.normal)} N`,Pt.normalRear.textContent=`${fi(e.normal)} \xB7 ${fi(n.normal)} N`,Pt.frictionFront.textContent=`${fi(xa(i))} \xB7 ${fi(xa(t))} N`,Pt.frictionRear.textContent=`${fi(xa(e))} \xB7 ${fi(xa(n))} N`,Pt.rolling.textContent=Fl([i,t,e,n].reduce((M,p)=>M+Bv(p),0)),Pt.drag.textContent=Fl(gt.drag),Pt.torque.textContent=`${Math.round(gt.wheelTorque)} N\xB7m`;let u=M=>`${M>=0?"+":""}${Math.round(M*1e3)}`,[f,g]=gt.axles;Pt.springsFront.textContent=`${u(f.travel[0])} \xB7 ${u(f.travel[1])} mm`,Pt.springsRear.textContent=`${u(g.travel[0])} \xB7 ${u(g.travel[1])} mm`}let c=We.locate(gt.along).index;c!==wf&&(wf=c,[...Pt.surfaces.children].forEach((d,u)=>d.classList.toggle("current",u===c)));let h=`${gt.auto}${gt.gear}`;if(h!==Ef){Ef=h;for(let{gear:d,b:u}of Fv){let f=d==="auto"?gt.auto:!gt.auto&&d===gt.gear;u.classList.toggle("on",f),u.classList.toggle("engaged",d===gt.gear)}}}var zl={};for(let i of["weight","torque","tire0","tire1","tire2","tire3"]){let t=document.createElement("span");t.className="force-label",Pt.labels.append(t),zl[i]=t}zl.weight.style.color="#ff9a9a";zl.torque.style.color="#d8bcff";function Hv(){for(let[i,t]of Object.entries(zl)){let e=Ve.forces&&Ze.labelPoints[i],n=e&&Ze.project(e);if(!n){t.hidden=!0;continue}if(t.hidden=!1,i==="weight")t.textContent=`weight ${Fl(gt.mass*gt.g)}`;else if(i==="torque")t.textContent=`${Math.abs(Math.round(gt.wheelTorque))} N\xB7m at the wheels`;else{let s=gt.wheels[Number(i.slice(4))].contact;t.innerHTML=`<b style="color:#8fe0ff">${fi(s.normal)}</b> \xB7 <b style="color:#ffd98a">${fi(xa(s))}</b> N`}t.style.transform=`translate(${Math.round(n.x+10)}px, ${Math.round(n.y-9)}px)`}}var Ul=0;function Bf(i){Ul=gt.overturned?Ul+i:0,Ul>2.5&&(Ul=0,Bl());let t=Ve.slow?i*yf:i;gt.advance(t,Ve.started?Uv():{throttle:0,brake:0,steer:0}),Ze.draw(gt,t,{forces:Ve.forces,world:jn.world,realDt:i}),pi.update(gt,{inside:Ze.goal.mode==="driver",rate:Ve.slow?yf:1}),kv(),Hv()}var kh=Xt("fps"),Ci={frames:0,since:performance.now(),worst:0};function Gv(i,t){Ci.frames++,Ci.worst=Math.max(Ci.worst,t);let e=i-Ci.since;if(e<500)return;let n=Ci.frames*1e3/e,s=Ze.pixelRatio/Ze.maxPixelRatio;kh.textContent=`${Math.round(n)} fps${s<.99?` \xB7 ${Math.round(s*100)}% res`:""}`,kh.title=`Slowest frame ${Ci.worst.toFixed(1)} ms, drawing ${Ze.pixelRatio.toFixed(2)} pixels per screen point`,kh.className=`fps${n<30?" bad":n<55?" slow":""}`,Ci.frames=0,Ci.since=i,Ci.worst=0}var Hh=.85,Gh={ceiling:Ze.pixelRatio,samples:[],smooth:0,warmup:2,raised:!1};function Vv(i){let t=Gh,e=Ze.pixelRatio;if(t.ceiling=Math.min(t.ceiling,Ze.maxPixelRatio),t.warmup>0){t.warmup-=i/1e3;return}if(i>200||document.hidden){t.samples.length=0;return}if(t.samples.push(i),t.samples.length<45)return;let n=t.samples.sort((a,o)=>a-o)[22];t.samples.length=0;let s=e;n>36&&e>.6?s=Math.max(.6,e*Hh):n>18.5&&e>1&&(s=Math.max(1,e*Hh));let r=t.raised;t.raised=!1,s<e?(r&&(t.ceiling=s),t.smooth=0):n<17.5&&e<t.ceiling?++t.smooth>=8&&(s=Math.min(t.ceiling,e/Hh),t.smooth=0,t.raised=!0):t.smooth=0,s!==e&&Ze.setPixelRatio(s)}var zf=!1,Tf=performance.now();function kf(i){let t=i-Tf,e=Math.min(.05,Math.max(0,t/1e3));Tf=i,Gv(i,t),zf||(Bf(e),Vv(t)),requestAnimationFrame(kf)}function kl(){Ve.started||(Ve.started=!0,Pt.overlay.hidden=!0,pi.start(),gt.reset(Rf,Vh))}Pt.start.addEventListener("click",kl);window.addEventListener("resize",()=>Ze.resize());document.addEventListener("visibilitychange",()=>{Gh.warmup=Math.max(Gh.warmup,.5),pi.pause(document.hidden)});gt.reset(Rf,0);Xh();new URLSearchParams(location.search).has("autostart")&&kl();requestAnimationFrame(kf);location.hostname==="localhost"&&(window.naseeb={sim:gt,world:Ze,view:Ve,settings:()=>jn,start:kl,drop:Bl,jumpTo:Pf,nextView:Wh,press:(i,t=!0)=>Qi[i]=t,holdLoop:i=>zf=i,step:(i=1/60,t=1)=>{for(let e=0;e<t;e++)Bf(i)}});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
