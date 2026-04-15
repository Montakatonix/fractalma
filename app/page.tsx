"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/34000000000?text=Hola%2C%20quiero%20m%C3%A1s%20info%20sobre%20FRACTALMA";

const S = `
  :root{--bg:#0c0b09;--surf:#1a1712;--bdr:rgba(212,196,158,.1);--bdr2:rgba(212,196,158,.22);--gold:#c9a96e;--gm:rgba(201,169,110,.45);--txt:#e8e0d0;--tm:#9a9080;--td:#5a5548;--wh:#f5f0e8;}
  *{box-sizing:border-box;}
  body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;font-weight:300;-webkit-font-smoothing:antialiased;overflow-x:hidden;margin:0;}
  h1,h2,h3,h4{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;line-height:1.1;}
  @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fu .9s ease forwards;}
  .d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.3s;opacity:0}.d3{animation-delay:.5s;opacity:0}.d4{animation-delay:.7s;opacity:0}.d5{animation-delay:.9s;opacity:0}
  .bp{display:inline-flex;align-items:center;gap:10px;background:var(--gold);color:#0c0b09;font-family:'DM Sans',sans-serif;font-weight:500;font-size:.8125rem;letter-spacing:.08em;text-transform:uppercase;padding:16px 32px;border:none;cursor:pointer;text-decoration:none;transition:all .25s;}
  .bp:hover{background:#d4b97a;transform:translateY(-2px);}
  .bs{display:inline-flex;align-items:center;gap:10px;background:transparent;color:var(--txt);font-family:'DM Sans',sans-serif;font-weight:400;font-size:.8125rem;letter-spacing:.06em;text-transform:uppercase;padding:15px 31px;border:1px solid var(--bdr2);cursor:pointer;text-decoration:none;transition:all .25s;}
  .bs:hover{border-color:var(--gm);color:var(--gold);transform:translateY(-2px);}
  .inp{width:100%;background:var(--surf);border:1px solid var(--bdr);color:var(--txt);font-family:'DM Sans',sans-serif;font-weight:300;font-size:.9375rem;padding:14px 18px;outline:none;transition:border-color .2s;appearance:none;border-radius:0;}
  .inp:focus{border-color:var(--gm);}
  .inp::placeholder{color:var(--td);}
  .lbl{display:block;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--tm);margin-bottom:8px;font-family:'DM Sans',sans-serif;}
  @media(max-width:768px){.rg{grid-template-columns:1fr!important;gap:40px!important;}.rg2{grid-template-columns:1fr 1fr!important;}.hide-m{display:none!important;}.fase-row{grid-template-columns:1fr!important;}.fase-num{display:none!important;}}
`;

function WaIcon(){return(
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);}

const label=(txt:string)=>(
  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",letterSpacing:".2em",textTransform:"uppercase" as const,color:"var(--gold)",marginBottom:"24px"}}>{txt}</p>
);
const h2=(txt:string|React.ReactNode,extra?:React.CSSProperties)=>(
  <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,color:"var(--wh)",lineHeight:1.15,...extra}}>{txt}</h2>
);
const muted=(txt:string,extra?:React.CSSProperties)=>(
  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,color:"var(--tm)",lineHeight:1.85,...extra}}>{txt}</p>
);
const rule=()=>(<div style={{width:"40px",height:"1px",background:"var(--gm)",marginBottom:"32px"}}/>);

export default function Page(){
  const [faqOpen,setFaqOpen]=useState<number|null>(null);
  const [qStep,setQStep]=useState(0);
  const [qLoading,setQLoading]=useState(false);
  const [qSuccess,setQSuccess]=useState(false);
  const [qError,setQError]=useState("");
  const [form,setForm]=useState({full_name:"",email:"",phone:"",current_situation:"",repeated_patterns:"",what_have_they_tried:"",what_do_they_want:"",readiness_level:5,extra_notes:""});
  const upd=(k:string,v:string|number)=>setForm(f=>({...f,[k]:v}));

  const faqs=[
    {q:"¿En qué se diferencia de una terapia convencional?",a:"Este proceso no es terapia clínica. La diferencia es que no se trabaja solo desde la comprensión intelectual. Se trabaja para entrar en el patrón, sentirlo, atravesarlo corporalmente y comprender su origen. El énfasis está en la transformación real, no en la gestión de síntomas."},
    {q:"¿Qué voy a experimentar durante el proceso?",a:"Depende de cada persona y su momento. Puede haber claridad repentina, emoción que aflora, tensión que se suelta o silencio profundo. No hay un camino único. Lo que sí hay es un acompañamiento que te sostiene mientras atraviesas lo que necesita ser atravesado."},
    {q:"¿Hasta qué punto voy a entrar en mí?",a:"Tan profundo como elijas ir. El proceso no fuerza ni precipita. Hay un ritmo que respeta el estado de cada persona. La profundidad es una consecuencia natural cuando existe seguridad y disposición real, no un objetivo en sí misma."},
    {q:"¿Es para mí si ya he hecho mucho trabajo personal?",a:"Es especialmente para personas que tienen comprensión de sí mismas pero sienten que no se ha traducido en un cambio sostenido. Si has ganado herramientas pero los patrones siguen ahí, este proceso puede trabajar en lo que todavía no se ha movido."},
    {q:"¿Cuánto dura el proceso?",a:"Desde sesiones puntuales hasta procesos más profundos, según el momento y las necesidades de cada persona. No existe un formato único ni una duración fija."},
  ];

  const handleSubmit=async()=>{
    setQLoading(true);setQError("");
    try{
      const{error:e}=await supabase.from("questionnaire_submissions").insert([{full_name:form.full_name,email:form.email,phone:form.phone||null,current_situation:form.current_situation||null,repeated_patterns:form.repeated_patterns||null,what_have_they_tried:form.what_have_they_tried||null,what_do_they_want:form.what_do_they_want||null,readiness_level:form.readiness_level,extra_notes:form.extra_notes||null}]);
      if(e)throw e;
      await supabase.from("leads").insert([{full_name:form.full_name,email:form.email,phone:form.phone||null,source:"questionnaire",status:"new"}]);
      setQSuccess(true);
    }catch(err){console.error(err);setQError("Algo ha fallado. Por favor, inténtalo de nuevo.");}
    finally{setQLoading(false);}
  };

  const sec=(bg:string,id?:string)=>({padding:"120px 0",background:bg,borderTop:"1px solid var(--bdr)",...(id?{id}:{})});
  const wrap={maxWidth:"1100px",margin:"0 auto",padding:"0 32px"};
  const narrow={maxWidth:"760px",margin:"0 auto",padding:"0 32px"};

  return(
  <>
    <style>{S}</style>

    {/* NAV */}
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(12,11,9,.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--bdr)"}}>
      <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.125rem",letterSpacing:".2em",color:"var(--gold)"}}>FRACTALMA</span>
      <div style={{display:"flex",gap:"32px",alignItems:"center"}}>
        <a href="#cuestionario" style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",letterSpacing:".1em",textTransform:"uppercase",color:"var(--tm)",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>(e.currentTarget.style.color="var(--gold)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--tm)")}>Cuestionario</a>
        <a href={WA} target="_blank" rel="noopener noreferrer" className="bp" style={{padding:"12px 24px"}}>Contacto</a>
      </div>
    </nav>

    {/* HERO */}
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"120px 32px 80px",position:"relative",overflow:"hidden",background:"var(--bg)"}}>
      <div style={{position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",width:"700px",height:"700px",background:"radial-gradient(circle,rgba(201,169,110,.055) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <p className="fu d1" style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",letterSpacing:".25em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"40px"}}>Despertar &nbsp;·&nbsp; Liberar &nbsp;·&nbsp; Reconectar</p>
      <h1 className="fu d2" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:300,lineHeight:1.08,color:"var(--wh)",marginBottom:"40px",letterSpacing:"-.02em",maxWidth:"900px"}}>
        No es tu vida la que se repite.<br/>
        <em style={{color:"var(--gold)",fontStyle:"italic"}}>Es el patrón desde el que la estás viviendo.</em>
      </h1>
      <p className="fu d3" style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1.0625rem",fontWeight:300,color:"var(--tm)",maxWidth:"540px",lineHeight:1.85,marginBottom:"56px"}}>
        Un proceso de acompañamiento profundo para comprender el origen de lo que se repite y transformarlo desde dentro.
      </p>
      <div className="fu d4" style={{display:"flex",gap:"16px",flexWrap:"wrap",justifyContent:"center"}}>
        <a href={WA} target="_blank" rel="noopener noreferrer" className="bp"><WaIcon/>Escribir por WhatsApp</a>
        <a href="#cuestionario" className="bs">Completar cuestionario</a>
      </div>
      <div className="fu d5" style={{position:"absolute",bottom:"40px",left:"50%",transform:"translateX(-50%)"}}>
        <div style={{width:"1px",height:"48px",background:"linear-gradient(to bottom,transparent,var(--gm))"}}/>
      </div>
    </section>

    {/* SI ESTO TE RESUENA */}
    <section style={sec("#111009")}>
      <div style={{...narrow}}>
        {label("Reconócete")}
        {h2(<>Si esto te resuena,<br/><span style={{color:"var(--gold)"}}>estás en el lugar correcto.</span></>,{marginBottom:"64px"})}
        {[
          "Sientes que siempre terminas en el mismo lugar, aunque hayas cambiado el contexto.",
          "Has hecho terapia, cursos o trabajo personal — y has ganado comprensión, pero no un cambio real y sostenido.",
          "Hay emociones que sabes nombrar, pero que no puedes soltar.",
          "Te preguntas por qué se repiten las mismas situaciones, relaciones o decisiones.",
          "Algo dentro de ti sabe que la respuesta no está en cambiar lo de fuera.",
          "Sientes desgaste. No de cansancio ordinario, sino de repetir sin encontrar la salida.",
        ].map((item,i)=>(
          <div key={i} style={{padding:"28px 0",borderBottom:"1px solid var(--bdr)",display:"flex",gap:"24px",alignItems:"flex-start"}}>
            <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:".875rem",color:"var(--gold)",minWidth:"24px",paddingTop:"2px",opacity:.5}}>{String(i+1).padStart(2,"0")}</span>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1rem",fontWeight:300,color:"var(--txt)",lineHeight:1.75}}>{item}</p>
          </div>
        ))}
      </div>
    </section>

    {/* EL PROBLEMA REAL */}
    <section style={sec("var(--bg)")}>
      <div style={{...wrap}}>
        <div className="rg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center"}}>
          <div>
            {label("El origen")}
            {h2(<>El problema<br/>no está fuera.</>,{marginBottom:"32px"})}
            {rule()}
            {muted("Cambias de trabajo, de relación, de ciudad. Pruebas nuevas herramientas, lees, comprendes. Y sin embargo, algo vuelve.",{marginBottom:"24px"})}
            {muted("No porque estés roto. Sino porque la estructura desde la que percibes y decides no ha cambiado. Mientras eso no cambia, la experiencia se repite.")}
          </div>
          <div>
            <blockquote style={{borderLeft:"2px solid var(--gm)",paddingLeft:"32px",marginBottom:"40px"}}>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.5rem",fontStyle:"italic",fontWeight:300,color:"var(--wh)",lineHeight:1.5,marginBottom:"16px"}}>
                &ldquo;La vida no repite patrones para castigarte. Los repite para revelarte aquello que necesitas comprender.&rdquo;
              </p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--td)"}}>— Esencia del método FRACTALMA</p>
            </blockquote>
            {muted("Cuando un patrón se comprende profundamente — no solo se nombra, sino que se atraviesa — deja de repetirse.")}
          </div>
        </div>
      </div>
    </section>

    {/* QUÉ ES FRACTALMA */}
    <section style={{...sec("var(--surf)"),textAlign:"center"}}>
      <div style={{...narrow,textAlign:"center"}}>
        {label("El método")}
        <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:300,color:"var(--wh)",marginBottom:"16px",letterSpacing:".05em"}}>FRACTALMA</h2>
        <div style={{width:"40px",height:"1px",background:"var(--gm)",margin:"0 auto 48px"}}/>
        <div className="rg2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"48px",textAlign:"left"}}>
          {[{t:"Fractal",b:"Los patrones que se repiten en tu vida son reflejos de procesos internos. Lo que ocurre fuera tiene su origen dentro."},{t:"Alma",b:"La esencia más profunda del ser. El núcleo que busca reconocerse más allá de los condicionamientos aprendidos."}].map((c,i)=>(
            <div key={i} style={{padding:"28px",background:"var(--bg)",border:"1px solid var(--bdr)"}}>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.25rem",color:"var(--gold)",marginBottom:"12px"}}>{c.t}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",fontWeight:300,color:"var(--tm)",lineHeight:1.75}}>{c.b}</p>
            </div>
          ))}
        </div>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1rem",fontWeight:300,color:"var(--tm)",lineHeight:1.85,marginBottom:"48px",maxWidth:"640px",margin:"0 auto 48px"}}>
          FRACTALMA integra reprogramación consciente, breathwork, activación corporal e integración emocional. No trabaja para que gestiones lo que sientes. Trabaja para que puedas sentirlo, atravesarlo y comprender qué lo origina.
        </p>
        <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.375rem",fontStyle:"italic",color:"var(--wh)",letterSpacing:".1em"}}>Despertar &nbsp;—&nbsp; Liberar &nbsp;—&nbsp; Reconectar</p>
      </div>
    </section>

    {/* LAS 3 FASES */}
    <section style={sec("var(--bg)")}>
      <div style={{...wrap}}>
        {label("El proceso")}
        {h2("Las tres fases",{marginBottom:"80px"})}
        {[
          {n:"01",t:"Despertar",s:"De la inconsciencia a la claridad",b:"Observar los patrones que han estado dirigiendo tu vida de forma automática. Se exploran creencias limitantes, condicionamientos aprendidos y percepciones distorsionadas del pasado. El primer paso es reconocer, sin juicio, desde dónde estás mirando.",d:"Observar · Reconocer · Comprender el origen"},
          {n:"02",t:"Liberar",s:"De la repetición a la transformación",b:"Entrar en contacto con emociones, memorias o tensiones que han quedado bloqueadas en el cuerpo y el inconsciente. Aquí se integra el breathwork y el trabajo somático. No se trata de hablar del dolor, sino de atravesarlo.",d:"Integrar · Soltar · Transformar lo bloqueado"},
          {n:"03",t:"Reconectar",s:"De la fragmentación a la coherencia interior",b:"Dejar de identificarte con tu historia y tus condicionamientos. Surge una relación más profunda con lo que realmente eres: mayor claridad, conexión con el propósito y coherencia entre mente, emoción y cuerpo.",d:"Presencia · Autenticidad · Coherencia interior"},
        ].map((f,i)=>(
          <div key={i} className="fase-row" style={{display:"grid",gridTemplateColumns:"80px 1fr 260px",gap:"40px",padding:"56px 0",borderBottom:"1px solid var(--bdr)",alignItems:"start"}}>
            <span className="fase-num" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2.5rem",fontWeight:300,color:"var(--td)",lineHeight:1}}>{f.n}</span>
            <div>
              <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2rem",fontWeight:400,color:"var(--wh)",marginBottom:"8px"}}>{f.t}</h3>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".8125rem",letterSpacing:".1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"24px"}}>{f.s}</p>
              {muted(f.b)}
            </div>
            <div style={{padding:"24px",background:"var(--surf)",border:"1px solid var(--bdr)"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".8125rem",fontWeight:300,color:"var(--tm)",lineHeight:1.7}}>{f.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CÓMO ES EL ACOMPAÑAMIENTO */}
    <section style={sec("var(--surf)")}>
      <div style={{...wrap}}>
        <div className="rg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"start"}}>
          <div>
            {label("El acompañamiento")}
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,color:"var(--wh)",lineHeight:1.2,marginBottom:"40px"}}>Un espacio donde<br/>entras en ello,<br/><em style={{color:"var(--gold)",fontStyle:"italic"}}>no solo lo hablas.</em></h2>
            {muted("El eje del proceso es el acompañamiento individual. La persona no solo describe lo que le ocurre: entra en ello, lo observa, lo siente y lo atraviesa.",{marginBottom:"24px"})}
            {muted("Se parte de lo que la persona está viviendo ahora. Se identifican los patrones repetitivos, se entra en ellos, se atraviesan emociones y bloqueos, y se comprende el origen. Cuando eso sucede, el patrón deja de sostenerse igual.",{marginBottom:"24px"})}
            {muted("La duración va desde sesiones puntuales hasta procesos más profundos, según el momento de cada persona.")}
          </div>
          <div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",letterSpacing:".2em",textTransform:"uppercase",color:"var(--td)",marginBottom:"32px"}}>Herramientas que se integran</p>
            {["Acompañamiento individual profundo","Breathwork — respiración consciente","Activación de consciencia corporal","Integración emocional guiada","Exploración del inconsciente","Reprogramación consciente"].map((h,i)=>(
              <div key={i} style={{padding:"20px 0",borderBottom:"1px solid var(--bdr)",display:"flex",alignItems:"center",gap:"20px"}}>
                <span style={{width:"4px",height:"4px",borderRadius:"50%",background:"var(--gm)",flexShrink:0}}/>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:300,color:"var(--txt)"}}>{h}</p>
              </div>
            ))}
            <div style={{marginTop:"32px",padding:"24px",background:"var(--bg)",border:"1px solid var(--bdr)"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",fontWeight:300,color:"var(--tm)",lineHeight:1.75,fontStyle:"italic"}}>Las herramientas se integran cuando son necesarias, según el momento de cada persona. No existe un protocolo fijo.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* DIFERENCIAL */}
    <section style={sec("var(--bg)")}>
      <div style={{...wrap}}>
        <div className="rg" style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"80px",alignItems:"start"}}>
          <div>
            {label("Por qué es diferente")}
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,color:"var(--wh)",lineHeight:1.2}}>El cambio sucede cuando<br/><em style={{color:"var(--gold)",fontStyle:"italic"}}>se atraviesa</em><br/>lo que está en el fondo.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"var(--bdr)"}}>
            {[
              {l:"No solo mental",t:"El proceso no se queda en comprender intelectualmente. Integra cuerpo, emoción y energía."},
              {l:"No solo experiencial",t:"No es solo sentir. Es comprender qué origina lo que sientes y transformarlo desde ahí."},
              {l:"Sin gestión superficial",t:"No se trabaja para que aprendas a manejar lo que sientes. Se trabaja para que lo atravieses."},
              {l:"Sin soluciones rápidas",t:"No hay atajos. Hay un proceso honesto, profundo y a la medida de cada momento."},
            ].map((p,i)=>(
              <div key={i} style={{background:"var(--bg)",padding:"36px 32px"}}>
                <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.125rem",color:"var(--wh)",marginBottom:"12px",fontWeight:500}}>{p.l}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",fontWeight:300,color:"var(--tm)",lineHeight:1.7}}>{p.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIOS placeholder */}
    <section style={{...sec("var(--surf)"),textAlign:"center"}}>
      <div style={{...narrow,textAlign:"center"}}>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",letterSpacing:".2em",textTransform:"uppercase",color:"var(--td)",marginBottom:"24px"}}>Experiencias</p>
        <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.5rem",fontStyle:"italic",fontWeight:300,color:"var(--td)",lineHeight:1.6}}>
          Próximamente, testimonios de personas que han atravesado el proceso.
          {/* Loaded from Supabase: optional_testimonials where is_published = true */}
        </p>
      </div>
    </section>

    {/* FAQ */}
    <section style={sec("var(--bg)")}>
      <div style={{...narrow}}>
        {label("Preguntas frecuentes")}
        {h2(<>Lo que quizás<br/>te estás preguntando.</>,{marginBottom:"64px"})}
        {faqs.map((f,i)=>(
          <div key={i} style={{borderBottom:"1px solid var(--bdr)"}}>
            <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"28px 0",textAlign:"left",gap:"24px"}}>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:".9375rem",fontWeight:400,color:faqOpen===i?"var(--wh)":"var(--txt)",lineHeight:1.5,transition:"color .2s"}}>{f.q}</span>
              <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.5rem",color:"var(--gold)",flexShrink:0,lineHeight:1,transition:"transform .3s",transform:faqOpen===i?"rotate(45deg)":"rotate(0)"}}>+</span>
            </button>
            {faqOpen===i&&<div style={{paddingBottom:"28px"}}>{muted(f.a)}</div>}
          </div>
        ))}
      </div>
    </section>

    {/* CUESTIONARIO */}
    <section id="cuestionario" style={sec("var(--surf)")}>
      <div style={{maxWidth:"640px",margin:"0 auto",padding:"0 32px"}}>
        {label("Antes de empezar")}
        {h2("Cuestionario previo",{marginBottom:"16px"})}
        {muted("Completarlo me ayuda a entender tu momento y preparar el espacio antes de que nos encontremos.",{marginBottom:"56px"})}
        {qSuccess?(
          <div style={{padding:"48px",background:"var(--bg)",border:"1px solid var(--bdr2)",textAlign:"center"}}>
            <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2rem",color:"var(--gold)",marginBottom:"16px"}}>Recibido.</p>
            {muted("Gracias por compartir esto. Me pondré en contacto contigo en breve.",{marginBottom:"32px",textAlign:"center"})}
            <a href={WA} target="_blank" rel="noopener noreferrer" className="bp"><WaIcon/>También puedes escribir por WhatsApp</a>
          </div>
        ):(
          <div style={{background:"var(--bg)",border:"1px solid var(--bdr)",padding:"48px"}}>
            <div style={{display:"flex",gap:"4px",marginBottom:"40px"}}>
              {[0,1,2].map(i=>(<div key={i} style={{flex:1,height:"2px",background:i<=qStep?"var(--gold)":"var(--bdr2)",transition:"background .3s"}}/>))}
            </div>
            <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.5rem",fontWeight:400,color:"var(--wh)",marginBottom:"32px"}}>
              {["¿Quién eres?","¿Qué estás viviendo?","Tu camino hasta aquí"][qStep]}
            </h3>
            {qStep===0&&(
              <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div><label className="lbl">Nombre completo *</label><input className="inp" value={form.full_name} onChange={e=>upd("full_name",e.target.value)} placeholder="Tu nombre"/></div>
                <div><label className="lbl">Email *</label><input className="inp" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="tu@email.com"/></div>
                <div><label className="lbl">Teléfono (opcional)</label><input className="inp" value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+34 600 000 000"/></div>
              </div>
            )}
            {qStep===1&&(
              <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div><label className="lbl">¿Qué está pasando en tu vida ahora mismo?</label><textarea className="inp" value={form.current_situation} onChange={e=>upd("current_situation",e.target.value)} placeholder="Describe brevemente tu situación actual..." style={{minHeight:"110px"}}/></div>
                <div><label className="lbl">¿Qué patrones o situaciones sientes que se repiten?</label><textarea className="inp" value={form.repeated_patterns} onChange={e=>upd("repeated_patterns",e.target.value)} placeholder="Relaciones, decisiones, emociones que vuelven..." style={{minHeight:"110px"}}/></div>
              </div>
            )}
            {qStep===2&&(
              <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div><label className="lbl">¿Qué has intentado antes para cambiar esto?</label><textarea className="inp" value={form.what_have_they_tried} onChange={e=>upd("what_have_they_tried",e.target.value)} placeholder="Terapia, cursos, lecturas, herramientas..." style={{minHeight:"100px"}}/></div>
                <div><label className="lbl">¿Qué quieres que cambie realmente?</label><textarea className="inp" value={form.what_do_they_want} onChange={e=>upd("what_do_they_want",e.target.value)} placeholder="Lo que sueñas que sea diferente..." style={{minHeight:"100px"}}/></div>
                <div>
                  <label className="lbl">¿Cuánto estás dispuesto/a a mirarte de verdad? (1–10)</label>
                  <div style={{display:"flex",alignItems:"center",gap:"16px",marginTop:"8px"}}>
                    <input type="range" min={1} max={10} value={form.readiness_level} onChange={e=>upd("readiness_level",parseInt(e.target.value))} style={{flex:1,accentColor:"var(--gold)"}}/>
                    <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1.5rem",color:"var(--gold)",minWidth:"28px"}}>{form.readiness_level}</span>
                  </div>
                </div>
              </div>
            )}
            {qError&&<p style={{marginTop:"16px",color:"#c0604a",fontFamily:"'DM Sans',sans-serif",fontSize:".875rem"}}>{qError}</p>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"40px"}}>
              {qStep>0?<button onClick={()=>setQStep(s=>s-1)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".875rem",color:"var(--tm)",padding:0}}>← Anterior</button>:<div/>}
              {qStep===2?(
                <button onClick={handleSubmit} disabled={qLoading} className="bp" style={{opacity:qLoading?.6:1}}>{qLoading?"Enviando...":"Enviar cuestionario"}</button>
              ):(
                <button onClick={()=>{if(qStep===0&&(!form.full_name.trim()||!form.email.trim()))return;setQStep(s=>s+1);}} className="bp">Siguiente →</button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>

    {/* CTA FINAL */}
    <section style={{...sec("var(--bg)"),textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"500px",height:"500px",background:"radial-gradient(circle,rgba(201,169,110,.04) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:"700px",margin:"0 auto",padding:"0 32px",position:"relative"}}>
        {label("El primer paso")}
        <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:300,color:"var(--wh)",lineHeight:1.1,marginBottom:"32px",letterSpacing:"-.01em"}}>
          Si se repite,<br/>no es casualidad.<br/><em style={{color:"var(--gold)",fontStyle:"italic"}}>Es información.</em>
        </h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1rem",fontWeight:300,color:"var(--tm)",lineHeight:1.85,marginBottom:"56px",maxWidth:"480px",margin:"0 auto 56px"}}>Si algo de lo que has leído aquí te ha movido, ese movimiento también es información. Escríbeme.</p>
        <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="bp"><WaIcon/>Escribir por WhatsApp</a>
          <a href="#cuestionario" className="bs">Completar cuestionario</a>
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer style={{padding:"48px 32px",borderTop:"1px solid var(--bdr)",background:"var(--bg)"}}>
      <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"24px"}}>
        <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"1rem",letterSpacing:".2em",color:"var(--gold)"}}>FRACTALMA</span>
        <div style={{display:"flex",gap:"32px",flexWrap:"wrap"}}>
          {["Política de privacidad","Aviso legal","Cookies"].map(l=>(
            <a key={l} href="#" style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",color:"var(--td)",textDecoration:"none",letterSpacing:".04em",transition:"color .2s"}} onMouseEnter={e=>(e.currentTarget.style.color="var(--tm)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--td)")}>{l}</a>
          ))}
        </div>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",color:"var(--td)",letterSpacing:".04em"}}>© {new Date().getFullYear()} FRACTALMA</p>
      </div>
    </footer>
  </>
  );
}
