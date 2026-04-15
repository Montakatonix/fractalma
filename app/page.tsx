"use client";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/lib/supabase";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_URL ||
  "https://wa.me/34000000000?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20FRACTALMA";

/* ── Framer helpers ─────────────────────────────── */
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.65, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

/* ── Icons ──────────────────────────────────────── */
const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ── Styles ─────────────────────────────────────── */
const CSS = `
:root{
  --ivory:#faf8f4;--ivory-2:#f5f1ea;--sand:#ede8de;--sand-2:#e4ddd0;
  --sage:#7d9b7a;--sage-deep:#5a7557;--sage-soft:rgba(125,155,122,.12);--moss:#4a6347;
  --text:#2d2b27;--text-2:#5a5650;--text-3:#9a948c;
  --border:rgba(90,86,80,.1);--border-2:rgba(90,86,80,.18);
  --shadow-sm:0 2px 12px rgba(45,43,39,.06);--shadow-md:0 8px 32px rgba(45,43,39,.1);
}
*{box-sizing:border-box;}
body{background:var(--ivory);color:var(--text);font-family:'DM Sans',sans-serif;font-weight:300;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;margin:0;}

/* Buttons */
.btn-p{display:inline-flex;align-items:center;gap:10px;background:var(--sage);color:#fff;
  font-family:'DM Sans',sans-serif;font-weight:500;font-size:.8125rem;letter-spacing:.08em;
  text-transform:uppercase;padding:16px 32px;border:none;cursor:pointer;text-decoration:none;
  transition:background .25s,transform .2s,box-shadow .25s;border-radius:2px;
  box-shadow:0 4px 20px rgba(125,155,122,.25);}
.btn-p:hover{background:var(--sage-deep);transform:translateY(-2px);box-shadow:0 8px 28px rgba(125,155,122,.35);}
.btn-s{display:inline-flex;align-items:center;gap:10px;background:transparent;color:var(--text);
  font-family:'DM Sans',sans-serif;font-weight:400;font-size:.8125rem;letter-spacing:.06em;
  text-transform:uppercase;padding:15px 31px;border:1.5px solid var(--border-2);cursor:pointer;
  text-decoration:none;transition:all .25s;border-radius:2px;}
.btn-s:hover{border-color:var(--sage);color:var(--sage-deep);transform:translateY(-2px);}

/* Form */
.inp{width:100%;background:#fff;border:1.5px solid var(--border-2);color:var(--text);
  font-family:'DM Sans',sans-serif;font-weight:300;font-size:.9375rem;padding:14px 18px;
  outline:none;transition:border-color .2s,box-shadow .2s;border-radius:4px;}
.inp:focus{border-color:var(--sage);box-shadow:0 0 0 3px var(--sage-soft);}
.inp::placeholder{color:var(--text-3);}
.lbl{display:block;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;
  color:var(--text-2);margin-bottom:8px;font-family:'DM Sans',sans-serif;}

/* Label tag */
.tag{display:inline-block;font-family:'DM Sans',sans-serif;font-size:.6875rem;
  letter-spacing:.2em;text-transform:uppercase;color:var(--sage-deep);
  background:var(--sage-soft);padding:6px 14px;border-radius:100px;margin-bottom:24px;}

/* Divider line */
.line{width:48px;height:2px;background:var(--sage);border-radius:1px;margin-bottom:32px;}

/* Card */
.card{background:#fff;border:1px solid var(--border);border-radius:12px;
  box-shadow:var(--shadow-sm);transition:box-shadow .3s,transform .3s;}
.card:hover{box-shadow:var(--shadow-md);transform:translateY(-4px);}

/* Responsive */
@media(max-width:768px){
  .rg{grid-template-columns:1fr!important;gap:40px!important;}
  .rg3{grid-template-columns:1fr!important;gap:24px!important;}
  .hide-m{display:none!important;}
  .fase-grid{grid-template-columns:1fr!important;}
}
`;

/* ════════════════════════════════════════════════════
   NAV
════════════════════════════════════════════════════ */
function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",
        background:"rgba(250,248,244,.88)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)",
      }}
    >
      <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.125rem",
        letterSpacing:".2em",color:"var(--moss)",fontWeight:500}}>FRACTALMA</span>
      <div style={{display:"flex",gap:"32px",alignItems:"center"}}>
        <a href="#cuestionario" style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
          letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",
          textDecoration:"none",transition:"color .2s"}}
          onMouseEnter={e=>(e.currentTarget.style.color="var(--sage-deep)")}
          onMouseLeave={e=>(e.currentTarget.style.color="var(--text-2)")}>
          Cuestionario
        </a>
        <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-p"
          style={{padding:"10px 22px"}}>Contacto</a>
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const y = useTransform(scrollYProgress, [0,1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0,.7], [1, 0]);

  return (
    <section ref={ref} style={{
      minHeight:"100vh",display:"flex",flexDirection:"column",
      justifyContent:"center",alignItems:"center",textAlign:"center",
      padding:"120px 32px 80px",position:"relative",overflow:"hidden",
      background:"linear-gradient(160deg, var(--ivory) 0%, var(--ivory-2) 50%, #eee9df 100%)",
    }}>
      {/* Organic bg shapes */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{
          position:"absolute",top:"10%",right:"8%",width:"420px",height:"420px",
          background:"radial-gradient(circle, rgba(125,155,122,.13) 0%, transparent 70%)",
          borderRadius:"60% 40% 70% 30% / 50% 60% 40% 50%",
        }}/>
        <div style={{
          position:"absolute",bottom:"15%",left:"5%",width:"320px",height:"320px",
          background:"radial-gradient(circle, rgba(125,155,122,.08) 0%, transparent 70%)",
          borderRadius:"40% 60% 30% 70% / 60% 40% 60% 40%",
        }}/>
        <div style={{
          position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
          width:"600px",height:"600px",
          background:"radial-gradient(circle, rgba(237,232,222,.6) 0%, transparent 65%)",
        }}/>
      </div>

      <motion.div style={{ y, opacity, position:"relative" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut", delay: 0 }}>
          <span className="tag">Despertar · Liberar · Reconectar</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
          style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(2.8rem,7vw,5.75rem)",fontWeight:300,
            lineHeight:1.08,color:"var(--text)",marginBottom:"32px",
            letterSpacing:"-.02em",maxWidth:"860px",margin:"0 auto 32px"}}>
          No es tu vida la que se repite.
          <br/>
          <em style={{color:"var(--sage-deep)",fontStyle:"italic"}}>
            Es el patrón desde el que
          </em>
          <br/>
          <em style={{color:"var(--sage-deep)",fontStyle:"italic"}}>la estás viviendo.</em>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.34 }}
          style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1.0625rem",fontWeight:300,
            color:"var(--text-2)",maxWidth:"520px",lineHeight:1.85,
            margin:"0 auto 52px"}}>
          Un proceso de acompañamiento profundo para comprender el origen
          de lo que se repite y transformarlo desde dentro.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.5 }}
          style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-p">
            <WaIcon/>Escribir por WhatsApp
          </a>
          <a href="#cuestionario" className="btn-s">Completar cuestionario</a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
        style={{position:"absolute",bottom:"40px",left:"50%",transform:"translateX(-50%)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:".6875rem",
          letterSpacing:".2em",textTransform:"uppercase",color:"var(--text-3)"}}>Descubrir</span>
        <motion.div
          animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.8,ease:"easeInOut"}}
          style={{width:"1px",height:"40px",
            background:"linear-gradient(to bottom, var(--sage), transparent)"}}>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   SI ESTO TE RESUENA
════════════════════════════════════════════════════ */
function SiEstoTeResuena() {
  const items = [
    "Sientes que siempre terminas en el mismo lugar, aunque hayas cambiado el contexto.",
    "Has hecho terapia, cursos o trabajo personal — y has ganado comprensión, pero no un cambio real y sostenido.",
    "Hay emociones que sabes nombrar, pero que no puedes soltar.",
    "Te preguntas por qué se repiten las mismas situaciones, relaciones o decisiones.",
    "Algo dentro de ti sabe que la respuesta no está en cambiar lo de fuera.",
    "Sientes desgaste. No de cansancio ordinario, sino de repetir sin encontrar la salida.",
  ];
  return (
    <section style={{padding:"120px 0",background:"var(--ivory-2)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"780px",margin:"0 auto",padding:"0 32px"}}>
        <Reveal><span className="tag">Reconócete</span></Reveal>
        <Reveal delay={.1}>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:300,
            lineHeight:1.15,marginBottom:"64px"}}>
            Si esto te resuena,<br/>
            <span style={{color:"var(--sage-deep)"}}>estás en el lugar correcto.</span>
          </h2>
        </Reveal>
        {items.map((item,i)=>(
          <Reveal key={i} delay={i*.06}>
            <div style={{padding:"28px 0",borderBottom:"1px solid var(--border)",
              display:"flex",gap:"24px",alignItems:"flex-start"}}>
              <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:".875rem",color:"var(--sage)",minWidth:"28px",
                paddingTop:"3px",fontWeight:400,opacity:.7}}>
                {String(i+1).padStart(2,"0")}
              </span>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1rem",
                fontWeight:300,color:"var(--text)",lineHeight:1.8}}>{item}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   EL PROBLEMA
════════════════════════════════════════════════════ */
function ElProblema() {
  return (
    <section style={{padding:"120px 0",background:"var(--sand)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"0 32px"}}>
        <div className="rg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center"}}>
          <div>
            <Reveal><span className="tag">El origen</span></Reveal>
            <Reveal delay={.1}>
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"clamp(2rem,4vw,3.25rem)",fontWeight:300,
                lineHeight:1.18,marginBottom:"32px"}}>
                El problema<br/>no está fuera.
              </h2>
            </Reveal>
            <Reveal delay={.18}><div className="line"/></Reveal>
            <Reveal delay={.24}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",
                fontWeight:300,color:"var(--text-2)",lineHeight:1.85,marginBottom:"20px"}}>
                Cambias de trabajo, de relación, de ciudad. Pruebas nuevas herramientas,
                lees, comprendes. Y sin embargo, algo vuelve.
              </p>
            </Reveal>
            <Reveal delay={.3}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",
                fontWeight:300,color:"var(--text-2)",lineHeight:1.85}}>
                No porque estés roto. Sino porque la estructura desde la que percibes
                y decides no ha cambiado. Mientras eso no cambia, la experiencia se repite.
              </p>
            </Reveal>
          </div>
          <Reveal delay={.2}>
            <div style={{background:"var(--ivory)",borderRadius:"16px",padding:"48px",
              boxShadow:"var(--shadow-md)",border:"1px solid var(--border)"}}>
              <div style={{width:"48px",height:"3px",background:"var(--sage)",
                borderRadius:"2px",marginBottom:"32px"}}/>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"1.625rem",fontStyle:"italic",fontWeight:300,
                color:"var(--text)",lineHeight:1.55,marginBottom:"24px"}}>
                &ldquo;La vida no repite patrones para castigarte. Los repite para revelarte
                aquello que necesitas comprender.&rdquo;
              </p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
                letterSpacing:".12em",textTransform:"uppercase",color:"var(--text-3)"}}>
                — Esencia del método FRACTALMA
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   QUÉ ES FRACTALMA
════════════════════════════════════════════════════ */
function QuEsFractalma() {
  return (
    <section style={{padding:"140px 0",background:"var(--ivory)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"820px",margin:"0 auto",padding:"0 32px",textAlign:"center"}}>
        <Reveal><span className="tag">El método</span></Reveal>
        <Reveal delay={.1}>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(3rem,7vw,5.5rem)",fontWeight:300,
            letterSpacing:".04em",marginBottom:"12px",
            background:"linear-gradient(135deg, var(--moss) 0%, var(--sage) 60%, #a8c4a5 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            backgroundClip:"text"}}>
            FRACTALMA
          </h2>
        </Reveal>
        <Reveal delay={.18}>
          <div style={{width:"40px",height:"2px",background:"var(--sage)",
            borderRadius:"1px",margin:"0 auto 48px"}}/>
        </Reveal>
        <Reveal delay={.24}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"56px",textAlign:"left"}}
               className="rg">
            {[
              {t:"Fractal",b:"Los patrones que se repiten en tu vida son reflejos de procesos internos. Lo que ocurre fuera tiene su origen dentro."},
              {t:"Alma",b:"La esencia más profunda del ser. El núcleo que busca reconocerse más allá de los condicionamientos aprendidos."},
            ].map((c,i)=>(
              <div key={i} className="card" style={{padding:"32px"}}>
                <div style={{width:"32px",height:"2px",background:"var(--sage)",
                  borderRadius:"1px",marginBottom:"20px"}}/>
                <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:"1.375rem",color:"var(--moss)",marginBottom:"12px",fontWeight:400}}>
                  {c.t}
                </p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",
                  fontWeight:300,color:"var(--text-2)",lineHeight:1.78}}>{c.b}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={.3}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1rem",fontWeight:300,
            color:"var(--text-2)",lineHeight:1.9,marginBottom:"48px",maxWidth:"600px",margin:"0 auto 48px"}}>
            FRACTALMA integra reprogramación consciente, breathwork, activación
            corporal e integración emocional. No trabaja para que gestiones lo que
            sientes. Trabaja para que puedas sentirlo, atravesarlo y comprender qué
            lo origina.
          </p>
        </Reveal>
        <Reveal delay={.38}>
          <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"1.5rem",fontStyle:"italic",color:"var(--moss)",letterSpacing:".08em"}}>
            Despertar &nbsp;—&nbsp; Liberar &nbsp;—&nbsp; Reconectar
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   LAS 3 FASES
════════════════════════════════════════════════════ */
function LasFases() {
  const fases = [
    {
      n:"01", t:"Despertar", s:"De la inconsciencia a la claridad",
      body:"Observas los patrones que han estado dirigiendo tu vida de forma automática. Se exploran creencias limitantes, condicionamientos aprendidos y percepciones distorsionadas. El primer paso es reconocer, sin juicio, desde dónde estás mirando.",
      icon:"◎",
      color:"rgba(125,155,122,.1)",
      accent:"var(--sage)",
    },
    {
      n:"02", t:"Liberar", s:"De la repetición a la transformación",
      body:"Entras en contacto con emociones, memorias y tensiones que han quedado bloqueadas en el cuerpo y el inconsciente. Aquí se integra el breathwork y el trabajo somático. No se trata de hablar del dolor, sino de atravesarlo.",
      icon:"◑",
      color:"rgba(90,117,87,.1)",
      accent:"var(--sage-deep)",
    },
    {
      n:"03", t:"Reconectar", s:"De la fragmentación a la coherencia",
      body:"Comienzas a dejar de identificarte con tu historia y tus condicionamientos. Surge una relación más profunda con lo que realmente eres: mayor claridad, conexión con el propósito y coherencia entre mente, emoción y cuerpo.",
      icon:"●",
      color:"rgba(74,99,71,.1)",
      accent:"var(--moss)",
    },
  ];
  return (
    <section style={{padding:"120px 0",background:"var(--ivory-2)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"0 32px"}}>
        <Reveal><span className="tag">El proceso</span></Reveal>
        <Reveal delay={.1}>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,marginBottom:"80px"}}>
            Las tres fases
          </h2>
        </Reveal>
        {/* Timeline */}
        <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
          {fases.map((f,i)=>(
            <Reveal key={i} delay={i*.12}>
              <div className="fase-grid" style={{
                display:"grid",gridTemplateColumns:"56px 1fr",
                gap:"0",marginBottom:"0",position:"relative",
              }}>
                {/* Vertical line */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{
                    width:"48px",height:"48px",borderRadius:"50%",
                    background:f.color,border:`2px solid ${f.accent}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:"1.25rem",color:f.accent,flexShrink:0,
                    boxShadow:`0 4px 16px ${f.color}`,
                    marginTop:"4px",
                  }}>
                    {f.icon}
                  </div>
                  {i < fases.length-1 && (
                    <div style={{width:"1px",flex:1,minHeight:"40px",
                      background:"linear-gradient(to bottom, var(--border-2), transparent)",
                      margin:"8px 0"}}/>
                  )}
                </div>
                {/* Content */}
                <div style={{
                  marginLeft:"32px",padding:"0 0 64px 0",
                }}>
                  <div style={{display:"flex",alignItems:"baseline",gap:"16px",marginBottom:"8px"}}>
                    <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                      fontSize:"2rem",fontWeight:400,color:"var(--text)"}}>
                      {f.t}
                    </h3>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
                      letterSpacing:".12em",textTransform:"uppercase",color:f.accent}}>
                      {f.s}
                    </span>
                  </div>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",
                    fontWeight:300,color:"var(--text-2)",lineHeight:1.85,
                    maxWidth:"620px"}}>
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   ACOMPAÑAMIENTO
════════════════════════════════════════════════════ */
function Acompanamiento() {
  const herramientas = [
    "Acompañamiento individual profundo",
    "Breathwork — respiración consciente",
    "Activación de consciencia corporal",
    "Integración emocional guiada",
    "Exploración del inconsciente",
    "Reprogramación consciente",
  ];
  return (
    <section style={{padding:"120px 0",background:"var(--sand)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"0 32px"}}>
        <div className="rg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"start"}}>
          <div>
            <Reveal><span className="tag">El acompañamiento</span></Reveal>
            <Reveal delay={.1}>
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,
                lineHeight:1.2,marginBottom:"40px"}}>
                Un espacio donde<br/>entras en ello,<br/>
                <em style={{color:"var(--sage-deep)",fontStyle:"italic"}}>no solo lo hablas.</em>
              </h2>
            </Reveal>
            <Reveal delay={.18}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,
                color:"var(--text-2)",lineHeight:1.85,marginBottom:"20px"}}>
                El eje del proceso es el acompañamiento individual. La persona no solo
                describe lo que le ocurre: entra en ello, lo observa, lo siente y lo atraviesa.
              </p>
            </Reveal>
            <Reveal delay={.24}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,
                color:"var(--text-2)",lineHeight:1.85,marginBottom:"24px"}}>
                Se parte de lo que la persona está viviendo ahora. Se identifican los
                patrones repetitivos, se entra en ellos, se atraviesan emociones y bloqueos,
                y se comprende el origen.
              </p>
            </Reveal>
            <Reveal delay={.3}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,
                color:"var(--text-2)",lineHeight:1.85}}>
                La duración va desde sesiones puntuales hasta procesos más profundos,
                según el momento de cada persona.
              </p>
            </Reveal>
          </div>
          <Reveal delay={.2}>
            <div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
                letterSpacing:".18em",textTransform:"uppercase",
                color:"var(--text-3)",marginBottom:"28px"}}>
                Herramientas integradas
              </p>
              <div style={{background:"var(--ivory)",borderRadius:"12px",overflow:"hidden",
                border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
                {herramientas.map((h,i)=>(
                  <div key={i} style={{
                    padding:"18px 24px",borderBottom: i < herramientas.length-1 ? "1px solid var(--border)" : "none",
                    display:"flex",alignItems:"center",gap:"16px",
                    transition:"background .2s",
                  }}
                    onMouseEnter={e=>(e.currentTarget.style.background="var(--sage-soft)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <span style={{width:"6px",height:"6px",borderRadius:"50%",
                      background:"var(--sage)",flexShrink:0}}/>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",
                      fontWeight:300,color:"var(--text)"}}>{h}</p>
                  </div>
                ))}
              </div>
              <div style={{marginTop:"20px",padding:"20px 24px",background:"var(--ivory)",
                borderRadius:"8px",border:"1px solid var(--border)"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",
                  fontWeight:300,color:"var(--text-3)",lineHeight:1.75,fontStyle:"italic"}}>
                  Las herramientas se integran cuando son necesarias, según el momento
                  de cada persona. No existe un protocolo fijo.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   DIFERENCIAL
════════════════════════════════════════════════════ */
function Diferencial() {
  const puntos = [
    {l:"No solo mental", t:"El proceso integra cuerpo, emoción y energía. No se queda en la comprensión intelectual."},
    {l:"No solo experiencial", t:"No es solo sentir. Es comprender qué origina lo que sientes y transformarlo desde ahí."},
    {l:"Sin gestión superficial", t:"No se trabaja para que aprendas a manejar lo que sientes. Se trabaja para que lo atravieses."},
    {l:"Sin soluciones rápidas", t:"No hay atajos. Hay un proceso honesto, profundo y a la medida de cada momento."},
  ];
  return (
    <section style={{padding:"120px 0",background:"var(--ivory)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"0 32px"}}>
        <div className="rg" style={{display:"grid",gridTemplateColumns:"1fr 1.8fr",gap:"80px",alignItems:"start"}}>
          <div>
            <Reveal><span className="tag">Por qué es diferente</span></Reveal>
            <Reveal delay={.1}>
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,lineHeight:1.2}}>
                El cambio sucede cuando
                <em style={{display:"block",color:"var(--sage-deep)",fontStyle:"italic",marginTop:"4px"}}>
                  se atraviesa
                </em>
                lo que está en el fondo.
              </h2>
            </Reveal>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}} className="rg3">
            {puntos.map((p,i)=>(
              <Reveal key={i} delay={i*.08}>
                <div className="card" style={{padding:"32px"}}>
                  <div style={{width:"28px",height:"2px",background:"var(--sage)",
                    borderRadius:"1px",marginBottom:"20px"}}/>
                  <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:"1.125rem",color:"var(--text)",marginBottom:"10px",fontWeight:500}}>
                    {p.l}
                  </p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",
                    fontWeight:300,color:"var(--text-2)",lineHeight:1.75}}>{p.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   TESTIMONIOS placeholder
════════════════════════════════════════════════════ */
function Testimonios() {
  return (
    <section style={{padding:"100px 0",background:"var(--sand)",
      borderTop:"1px solid var(--border)",textAlign:"center"}}>
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"0 32px"}}>
        <Reveal>
          <span className="tag">Experiencias</span>
        </Reveal>
        <Reveal delay={.1}>
          <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"1.625rem",fontStyle:"italic",fontWeight:300,
            color:"var(--text-3)",lineHeight:1.6}}>
            Próximamente, testimonios de personas que han atravesado el proceso.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FAQ
════════════════════════════════════════════════════ */
function FAQ() {
  const [open,setOpen] = useState<number|null>(null);
  const faqs = [
    {q:"¿En qué se diferencia de una terapia convencional?",
     a:"Este proceso no es terapia clínica. La diferencia es que no se trabaja solo desde la comprensión intelectual. Se trabaja para entrar en el patrón, sentirlo, atravesarlo corporalmente y comprender su origen. El énfasis está en la transformación real, no en la gestión de síntomas."},
    {q:"¿Qué voy a experimentar durante el proceso?",
     a:"Depende de cada persona y su momento. Puede haber claridad repentina, emoción que aflora, tensión que se suelta o silencio profundo. No hay un camino único. Lo que sí hay es un acompañamiento que te sostiene mientras atraviesas lo que necesita ser atravesado."},
    {q:"¿Hasta qué punto voy a entrar en mí?",
     a:"Tan profundo como elijas ir. El proceso no fuerza ni precipita. Hay un ritmo que respeta el estado de cada persona. La profundidad es una consecuencia natural cuando existe seguridad y disposición real, no un objetivo en sí misma."},
    {q:"¿Es para mí si ya he hecho mucho trabajo personal?",
     a:"Es especialmente para personas que tienen comprensión de sí mismas pero sienten que no se ha traducido en un cambio sostenido. Si has ganado herramientas pero los patrones siguen ahí, este proceso puede trabajar en lo que todavía no se ha movido."},
    {q:"¿Cuánto dura el proceso?",
     a:"Desde sesiones puntuales hasta procesos más profundos, según el momento y las necesidades de cada persona. No existe un formato único ni una duración fija."},
  ];
  return (
    <section style={{padding:"120px 0",background:"var(--ivory-2)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"760px",margin:"0 auto",padding:"0 32px"}}>
        <Reveal><span className="tag">Preguntas frecuentes</span></Reveal>
        <Reveal delay={.1}>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,lineHeight:1.2,marginBottom:"64px"}}>
            Lo que quizás<br/>te estás preguntando.
          </h2>
        </Reveal>
        {faqs.map((f,i)=>(
          <Reveal key={i} delay={i*.06}>
            <div style={{borderBottom:"1px solid var(--border)"}}>
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{width:"100%",background:"none",border:"none",cursor:"pointer",
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"26px 0",textAlign:"left",gap:"24px"}}>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",
                  fontWeight:400,color:open===i?"var(--moss)":"var(--text)",
                  lineHeight:1.5,transition:"color .2s"}}>{f.q}</span>
                <motion.span
                  animate={{rotate: open===i ? 45 : 0}}
                  transition={{duration:.25}}
                  style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:"1.5rem",color:"var(--sage)",flexShrink:0,
                    lineHeight:1,display:"block"}}>+</motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{height: open===i ? "auto" : 0, opacity: open===i ? 1 : 0}}
                transition={{duration:.3,ease:"easeInOut"}}
                style={{overflow:"hidden"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",
                  fontWeight:300,color:"var(--text-2)",lineHeight:1.85,paddingBottom:"28px"}}>
                  {f.a}
                </p>
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   CUESTIONARIO
════════════════════════════════════════════════════ */
function Cuestionario() {
  const [step,setStep]=useState(0);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({
    full_name:"",email:"",phone:"",current_situation:"",
    repeated_patterns:"",what_have_they_tried:"",
    what_do_they_want:"",readiness_level:5,extra_notes:"",
  });
  const upd=(k:string,v:string|number)=>setForm(f=>({...f,[k]:v}));

  const handleSubmit=async()=>{
    setLoading(true);setError("");
    try{
      const{error:e}=await supabase.from("questionnaire_submissions").insert([{
        full_name:form.full_name,email:form.email,phone:form.phone||null,
        current_situation:form.current_situation||null,
        repeated_patterns:form.repeated_patterns||null,
        what_have_they_tried:form.what_have_they_tried||null,
        what_do_they_want:form.what_do_they_want||null,
        readiness_level:form.readiness_level,
      }]);
      if(e)throw e;
      await supabase.from("leads").insert([{
        full_name:form.full_name,email:form.email,
        phone:form.phone||null,source:"questionnaire",status:"new",
      }]);
      setSuccess(true);
    }catch(err){
      console.error(err);
      setError("Algo ha fallado. Por favor, inténtalo de nuevo.");
    }finally{setLoading(false);}
  };

  return (
    <section id="cuestionario" style={{padding:"120px 0",
      background:"var(--sand)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:"620px",margin:"0 auto",padding:"0 32px"}}>
        <Reveal><span className="tag">Antes de empezar</span></Reveal>
        <Reveal delay={.1}>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,lineHeight:1.2,marginBottom:"16px"}}>
            Cuestionario previo
          </h2>
        </Reveal>
        <Reveal delay={.18}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,
            color:"var(--text-2)",lineHeight:1.75,marginBottom:"48px"}}>
            Completarlo me ayuda a entender tu momento y preparar el espacio
            antes de que nos encontremos.
          </p>
        </Reveal>
        <Reveal delay={.22}>
          {success ? (
            <div style={{padding:"48px",background:"var(--ivory)",borderRadius:"16px",
              border:"1px solid var(--border)",textAlign:"center",boxShadow:"var(--shadow-md)"}}>
              <div style={{width:"48px",height:"48px",borderRadius:"50%",
                background:"var(--sage-soft)",border:"2px solid var(--sage)",
                display:"flex",alignItems:"center",justifyContent:"center",
                margin:"0 auto 24px",fontSize:"1.25rem",color:"var(--sage-deep)"}}>✓</div>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"2rem",color:"var(--moss)",marginBottom:"12px"}}>Recibido.</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,
                color:"var(--text-2)",lineHeight:1.75,marginBottom:"32px"}}>
                Gracias por compartir esto. Me pondré en contacto contigo en breve.
              </p>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-p">
                <WaIcon/>También puedes escribir por WhatsApp
              </a>
            </div>
          ) : (
            <div style={{background:"var(--ivory)",borderRadius:"16px",
              border:"1px solid var(--border)",padding:"48px",boxShadow:"var(--shadow-sm)"}}>
              {/* Progress */}
              <div style={{display:"flex",gap:"6px",marginBottom:"40px"}}>
                {[0,1,2].map(i=>(
                  <motion.div key={i}
                    animate={{background: i<=step ? "var(--sage)" : "var(--sand-2)"}}
                    style={{flex:1,height:"3px",borderRadius:"2px",transition:"background .3s"}}/>
                ))}
              </div>
              <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"1.625rem",fontWeight:400,color:"var(--text)",marginBottom:"32px"}}>
                {["¿Quién eres?","¿Qué estás viviendo?","Tu camino hasta aquí"][step]}
              </h3>
              {step===0&&(
                <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                  <div><label className="lbl">Nombre completo *</label>
                    <input className="inp" value={form.full_name}
                      onChange={e=>upd("full_name",e.target.value)} placeholder="Tu nombre"/></div>
                  <div><label className="lbl">Email *</label>
                    <input className="inp" type="email" value={form.email}
                      onChange={e=>upd("email",e.target.value)} placeholder="tu@email.com"/></div>
                  <div><label className="lbl">Teléfono (opcional)</label>
                    <input className="inp" value={form.phone}
                      onChange={e=>upd("phone",e.target.value)} placeholder="+34 600 000 000"/></div>
                </div>
              )}
              {step===1&&(
                <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                  <div><label className="lbl">¿Qué está pasando en tu vida ahora mismo?</label>
                    <textarea className="inp" value={form.current_situation}
                      onChange={e=>upd("current_situation",e.target.value)}
                      placeholder="Describe brevemente tu situación actual..."
                      style={{minHeight:"110px",resize:"vertical"}}/></div>
                  <div><label className="lbl">¿Qué patrones sientes que se repiten?</label>
                    <textarea className="inp" value={form.repeated_patterns}
                      onChange={e=>upd("repeated_patterns",e.target.value)}
                      placeholder="Relaciones, decisiones, emociones que vuelven..."
                      style={{minHeight:"110px",resize:"vertical"}}/></div>
                </div>
              )}
              {step===2&&(
                <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                  <div><label className="lbl">¿Qué has intentado antes?</label>
                    <textarea className="inp" value={form.what_have_they_tried}
                      onChange={e=>upd("what_have_they_tried",e.target.value)}
                      placeholder="Terapia, cursos, lecturas, herramientas..."
                      style={{minHeight:"90px",resize:"vertical"}}/></div>
                  <div><label className="lbl">¿Qué quieres que cambie realmente?</label>
                    <textarea className="inp" value={form.what_do_they_want}
                      onChange={e=>upd("what_do_they_want",e.target.value)}
                      placeholder="Lo que sueñas que sea diferente..."
                      style={{minHeight:"90px",resize:"vertical"}}/></div>
                  <div>
                    <label className="lbl">¿Cuánto estás dispuesto/a a mirarte de verdad? (1–10)</label>
                    <div style={{display:"flex",alignItems:"center",gap:"16px",marginTop:"10px"}}>
                      <input type="range" min={1} max={10} value={form.readiness_level}
                        onChange={e=>upd("readiness_level",parseInt(e.target.value))}
                        style={{flex:1,accentColor:"var(--sage)",cursor:"pointer"}}/>
                      <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                        fontSize:"1.5rem",color:"var(--sage-deep)",minWidth:"28px",
                        fontWeight:400}}>{form.readiness_level}</span>
                    </div>
                  </div>
                </div>
              )}
              {error&&<p style={{marginTop:"16px",color:"#b05a45",fontFamily:"'DM Sans',sans-serif",
                fontSize:".875rem"}}>{error}</p>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"40px"}}>
                {step>0
                  ? <button onClick={()=>setStep(s=>s-1)}
                      style={{background:"none",border:"none",cursor:"pointer",
                        fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",
                        color:"var(--text-2)",padding:0,transition:"color .2s"}}
                      onMouseEnter={e=>(e.currentTarget.style.color="var(--moss)")}
                      onMouseLeave={e=>(e.currentTarget.style.color="var(--text-2)")}>
                      ← Anterior
                    </button>
                  : <div/>
                }
                {step===2
                  ? <button onClick={handleSubmit} disabled={loading} className="btn-p"
                      style={{opacity:loading?.65:1}}>
                      {loading ? "Enviando…" : "Enviar cuestionario"}
                    </button>
                  : <button onClick={()=>{
                        if(step===0&&(!form.full_name.trim()||!form.email.trim()))return;
                        setStep(s=>s+1);
                      }} className="btn-p">
                      Siguiente →
                    </button>
                }
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   CTA FINAL
════════════════════════════════════════════════════ */
function CTAFinal() {
  return (
    <section style={{
      padding:"160px 0",
      background:"linear-gradient(160deg, var(--moss) 0%, var(--sage-deep) 50%, #6b9168 100%)",
      borderTop:"1px solid var(--border)",textAlign:"center",
      position:"relative",overflow:"hidden",
    }}>
      {/* Organic shapes */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"15%",right:"10%",width:"350px",height:"350px",
          background:"rgba(255,255,255,.05)",
          borderRadius:"60% 40% 70% 30% / 50% 60% 40% 50%"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"8%",width:"280px",height:"280px",
          background:"rgba(255,255,255,.04)",
          borderRadius:"40% 60% 30% 70% / 60% 40% 60% 40%"}}/>
      </div>

      <div style={{maxWidth:"700px",margin:"0 auto",padding:"0 32px",position:"relative"}}>
        <Reveal>
          <span style={{display:"inline-block",fontFamily:"'DM Sans',sans-serif",
            fontSize:".6875rem",letterSpacing:".2em",textTransform:"uppercase",
            color:"rgba(255,255,255,.6)",background:"rgba(255,255,255,.1)",
            padding:"6px 14px",borderRadius:"100px",marginBottom:"32px"}}>
            El primer paso
          </span>
        </Reveal>
        <Reveal delay={.1}>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(2.5rem,6vw,4.75rem)",fontWeight:300,
            color:"#fff",lineHeight:1.1,marginBottom:"28px",letterSpacing:"-.01em"}}>
            Si se repite,<br/>no es casualidad.<br/>
            <em style={{fontStyle:"italic",opacity:.85}}>Es información.</em>
          </h2>
        </Reveal>
        <Reveal delay={.2}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1.0625rem",fontWeight:300,
            color:"rgba(255,255,255,.75)",lineHeight:1.85,
            marginBottom:"56px",maxWidth:"460px",margin:"0 auto 56px"}}>
            Si algo de lo que has leído aquí te ha movido, ese movimiento
            también es información. Escríbeme.
          </p>
        </Reveal>
        <Reveal delay={.3}>
          <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:"10px",
                background:"#fff",color:"var(--moss)",
                fontFamily:"'DM Sans',sans-serif",fontWeight:500,
                fontSize:".8125rem",letterSpacing:".08em",textTransform:"uppercase",
                padding:"16px 32px",borderRadius:"2px",textDecoration:"none",
                transition:"all .25s",boxShadow:"0 4px 24px rgba(0,0,0,.15)"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,.15)";}}>
              <WaIcon/>Escribir por WhatsApp
            </a>
            <a href="#cuestionario"
              style={{display:"inline-flex",alignItems:"center",gap:"10px",
                background:"transparent",color:"#fff",
                fontFamily:"'DM Sans',sans-serif",fontWeight:400,
                fontSize:".8125rem",letterSpacing:".06em",textTransform:"uppercase",
                padding:"15px 31px",border:"1.5px solid rgba(255,255,255,.4)",
                borderRadius:"2px",textDecoration:"none",transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.8)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.4)";e.currentTarget.style.transform="translateY(0)";}}>
              Completar cuestionario
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{padding:"48px 40px",borderTop:"1px solid var(--border)",background:"var(--ivory)"}}>
      <div style={{maxWidth:"1060px",margin:"0 auto",
        display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"24px"}}>
        <div>
          <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1rem",
            letterSpacing:".2em",color:"var(--moss)",fontWeight:500}}>FRACTALMA</span>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
            color:"var(--text-3)",marginTop:"4px",letterSpacing:".04em"}}>
            Despertar · Liberar · Reconectar
          </p>
        </div>
        <div style={{display:"flex",gap:"32px",flexWrap:"wrap"}}>
          {["Política de privacidad","Aviso legal","Cookies"].map(l=>(
            <a key={l} href="#" style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
              color:"var(--text-3)",textDecoration:"none",letterSpacing:".04em",transition:"color .2s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="var(--moss)")}
              onMouseLeave={e=>(e.currentTarget.style.color="var(--text-3)")}>{l}</a>
          ))}
        </div>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",
          color:"var(--text-3)",letterSpacing:".04em"}}>
          © {new Date().getFullYear()} FRACTALMA
        </p>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <>
      <style>{CSS}</style>
      <Nav/>
      <main>
        <Hero/>
        <SiEstoTeResuena/>
        <ElProblema/>
        <QuEsFractalma/>
        <LasFases/>
        <Acompanamiento/>
        <Diferencial/>
        <Testimonios/>
        <FAQ/>
        <Cuestionario/>
        <CTAFinal/>
        <Footer/>
      </main>
    </>
  );
}
