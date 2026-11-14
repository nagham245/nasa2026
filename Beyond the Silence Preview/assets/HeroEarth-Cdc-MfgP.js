import{r as d,j as me}from"./index-BstDlMme.js";import{W as ue,S as $,A as pe,a as he,P as ge,T as fe,G as j,b as A,M as k,c as L,d as we,B as ye,e as xe,V as W}from"./three-CpdrnePl.js";const Me=u=>new W(u==="left"?-.8:.8,.42,.55).normalize(),ee=(u,f)=>f?new W(...f).normalize():Me(u),te=`
  varying vec2 vUv; varying vec3 vN; varying vec3 vView;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`,be=`
  uniform sampler2D dayMap; uniform sampler2D nightMap; uniform vec3 sunDir; uniform float reveal;
  varying vec2 vUv; varying vec3 vN; varying vec3 vView;
  void main() {
    vec3 n = normalize(vN);
    float ndl = dot(n, sunDir);
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    // keep only the lights: the night map has a faint blue base map under them
    night *= smoothstep(0.06, 0.45, dot(night, vec3(0.30, 0.59, 0.11)));
    float lit = smoothstep(-0.12, 0.35, ndl);
    vec3 color = day * (0.02 + 1.25 * max(ndl, 0.0)) * reveal;
    // city lights only where the Sun has set
    color += night * vec3(1.0, 0.8, 0.52) * 1.8 * (1.0 - lit) * smoothstep(0.0, 1.0, reveal);
    // warm twilight band along the terminator
    color += vec3(1.0, 0.45, 0.18) * exp(-ndl * ndl * 90.0) * 0.035 * reveal;
    // ocean glint: oceans are dark and blue in the day map
    float ocean = smoothstep(0.05, 0.25, day.b - max(day.r, day.g) * 0.85) * (1.0 - smoothstep(0.35, 0.6, dot(day, vec3(0.333))));
    vec3 h = normalize(sunDir + normalize(vView));
    color += vec3(0.85, 0.92, 1.0) * pow(max(dot(n, h), 0.0), 60.0) * ocean * 0.55 * reveal;
    // inner atmospheric haze toward the limb, on the day side
    float fres = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 3.0);
    color += vec3(0.30, 0.62, 1.0) * fres * (0.04 + 0.96 * lit) * 0.55 * reveal;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,ze=`
  uniform sampler2D cloudMap; uniform vec3 sunDir; uniform float reveal;
  varying vec2 vUv; varying vec3 vN; varying vec3 vView;
  void main() {
    vec3 n = normalize(vN);
    float ndl = dot(n, sunDir);
    float a = texture2D(cloudMap, vUv).r;
    float light = 0.012 + 1.1 * max(ndl, 0.0);
    vec3 c = vec3(1.0) * light + vec3(1.0, 0.5, 0.25) * exp(-ndl * ndl * 60.0) * 0.12;
    gl_FragColor = vec4(c * reveal, a * 0.92 * smoothstep(0.0, 1.0, reveal));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,Se=`
  varying vec3 vN; varying vec3 vView;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`,Pe=`
  uniform vec3 sunDir; uniform float reveal;
  varying vec3 vN; varying vec3 vView;
  void main() {
    vec3 n = normalize(vN);
    float d = clamp(-dot(n, normalize(vView)), 0.0, 1.0);       // 0 at the outer edge → 1 at the limb
    float glow = pow(smoothstep(0.0, 0.62, d), 3.0);
    float sun = smoothstep(-0.35, 0.55, dot(n, sunDir) + 0.15); // brighter on the sunlit limb
    vec3 col = mix(vec3(0.12, 0.35, 0.85), vec3(0.45, 0.8, 1.0), sun);
    float a = glow * (0.18 + 0.82 * sun) * 0.95 * reveal;
    gl_FragColor = vec4(col * a, a);
  }`;function De({dayMap:u,nightMap:f,cloudMap:ae,frame:r,spin:G=Math.PI*2/90,tilt:ne=23.44*Math.PI/180,revealDelay:oe=.3,revealDuration:ie=2.6,sunSide:b="right",sunDirection:p=null,lens:re=28,axisPitch:se=0,onReady:z,onError:m,className:le=""}){const B=d.useRef(null),T=d.useRef(r);T.current=r;const w=d.useRef(null),S=d.useRef(null);return d.useEffect(()=>{const l=B.current;let o;try{o=new ue({antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch(e){m==null||m(e);return}const P=window.matchMedia("(prefers-reduced-motion: reduce)").matches,q=window.matchMedia("(pointer: coarse)").matches;o.setPixelRatio(Math.min(window.devicePixelRatio||1,q?1.75:1.5)),o.outputColorSpace=$,o.toneMapping=pe,o.toneMappingExposure=1.05,l.appendChild(o.domElement),o.domElement.style.width="100%",o.domElement.style.height="100%";const V=new he,v=new ge(re,1,.1,200);v.position.set(0,0,40);const h={sunDir:{value:ee(b,p)},reveal:{value:P?1:0}};S.current=h;const ce=new fe,F=(e,t)=>new Promise((i,a)=>ce.load(e,n=>{t&&(n.colorSpace=$),n.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),i(n)},void 0,a)),y=new j;y.rotation.z=ne;const s=new j,D=new j;D.rotation.x=se,D.add(y),s.add(D),V.add(s);const g=new A({uniforms:{...h,dayMap:{value:null},nightMap:{value:null}},vertexShader:te,fragmentShader:be}),x=new k(new L(1,160,120),g);y.add(x);const N=new A({uniforms:{...h,cloudMap:{value:null}},vertexShader:te,fragmentShader:ze,transparent:!0,depthWrite:!1}),R=new k(new L(1.012,160,120),N);y.add(R);const ve=new k(new L(1.085,96,72),new A({uniforms:h,vertexShader:Se,fragmentShader:Pe,side:ye,transparent:!0,blending:we,depthWrite:!1}));s.add(ve),x.rotation.y=-1.9,R.rotation.y=-1.9;let _=!1,H=!1,I=0;Promise.all([F(u,!0),F(f,!0),F(ae,!1)]).then(([e,t,i])=>{_||(g.uniforms.dayMap.value=e,g.uniforms.nightMap.value=t,N.uniforms.cloudMap.value=i,H=!0,I=performance.now()/1e3+oe,z==null||z())}).catch(e=>!_&&(m==null?void 0:m(e)));const C=()=>{const e=l.clientWidth,t=l.clientHeight;if(!e||!t)return;o.setSize(e,t,!1),v.aspect=e/t,v.updateProjectionMatrix();const i=T.current??{cx:e/2,cy:t/2,r:Math.min(e,t)*.35},a=2*v.position.z*Math.tan(xe.degToRad(v.fov/2))/t,n=i.r*a,U=v.position.z,de=n/Math.sqrt(1+(n/U)**2);s.scale.setScalar(de),s.userData.base=new W((i.cx-e/2)*a,-(i.cy-t/2)*a,0)},O=new ResizeObserver(C);O.observe(l),C(),w.current=C;const M={x:0,y:0},c={x:0,y:0},X=e=>{M.x=(e.clientX/window.innerWidth-.5)*2,M.y=(e.clientY/window.innerHeight-.5)*2};!P&&!q&&window.addEventListener("pointermove",X,{passive:!0});let E=0,Y=performance.now(),J=0,K=!0;const Q=()=>K=document.visibilityState==="visible";document.addEventListener("visibilitychange",Q);const Z=e=>{E=requestAnimationFrame(Z);const t=Math.min((e-Y)/1e3,.25),i=Math.min(t,.05);if(Y=e,!K)return;if(H&&!P){const n=(e/1e3-I)/ie,U=Math.min(Math.max(n,0),1);h.reveal.value=1-(1-U)**3,x.rotation.y+=t*G,R.rotation.y+=t*G*1.18,e-J>250&&(J=e,l.dataset.rotation=x.rotation.y.toFixed(3))}c.x+=(M.x-c.x)*Math.min(1,i*2.5),c.y+=(M.y-c.y)*Math.min(1,i*2.5);const a=s.userData.base;if(a){const n=s.scale.x*.035;s.position.set(a.x-c.x*n,a.y+c.y*n,0),s.rotation.set(c.y*.02,c.x*.03,0)}o.render(V,v)};return E=requestAnimationFrame(Z),()=>{_=!0,cancelAnimationFrame(E),O.disconnect(),window.removeEventListener("pointermove",X),document.removeEventListener("visibilitychange",Q),V.traverse(e=>{var t,i,a,n;(i=(t=e.geometry)==null?void 0:t.dispose)==null||i.call(t),(n=(a=e.material)==null?void 0:a.dispose)==null||n.call(a)}),[g.uniforms.dayMap.value,g.uniforms.nightMap.value,N.uniforms.cloudMap.value].forEach(e=>{var t;return(t=e==null?void 0:e.dispose)==null?void 0:t.call(e)}),o.dispose(),o.domElement.remove()}},[]),d.useEffect(()=>{var l;(l=w.current)==null||l.call(w)},[r==null?void 0:r.cx,r==null?void 0:r.cy,r==null?void 0:r.r]),d.useEffect(()=>{S.current&&S.current.sunDir.value.copy(ee(b,p))},[b,p==null?void 0:p.join(",")]),me.jsx("div",{ref:B,className:le})}export{De as default};
