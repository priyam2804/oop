
// ─── QUIZ SECTION ───────────────────────────────────────────────
function QuizSection({questions}){
  const [phase,setPhase]=useState('setup');
  const [qs,setQs]=useState([]);
  const [cur,setCur]=useState(0);
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [log,setLog]=useState([]);
  const [timeLeft,setTimeLeft]=useState(90);
  const [numQ,setNumQ]=useState(15);
  const [timed,setTimed]=useState(true);
  const timerRef=useRef(null);

  const start=()=>{const s=[...questions].sort(()=>Math.random()-.5).slice(0,numQ);setQs(s);setCur(0);setSel(null);setAnswered(false);setScore(0);setLog([]);setTimeLeft(90);setPhase('quiz');};
  useEffect(()=>{if(phase!=='quiz'||answered||!timed)return;clearInterval(timerRef.current);timerRef.current=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);handleAns(-1);return 0;}return t-1;}),1000);return()=>clearInterval(timerRef.current);},[phase,cur,answered]);
  const handleAns=(i)=>{clearInterval(timerRef.current);if(answered)return;setSel(i);setAnswered(true);const ok=i===qs[cur].ans;if(ok)setScore(s=>s+1);setLog(l=>[...l,{q:qs[cur],sel:i,ok}]);};
  const next=()=>{if(cur+1>=qs.length){setPhase('result');return;}setCur(c=>c+1);setSel(null);setAnswered(false);setTimeLeft(90);};

  const card={background:'#0c1425',border:'1px solid #1e2d4a',borderRadius:14,padding:28};

  if(phase==='setup') return(
    <div style={{maxWidth:560,margin:'0 auto'}}>
      <div style={{fontSize:'1.6rem',fontWeight:800,letterSpacing:'-.02em',marginBottom:22}}>C++ OOP Test Series</div>
      <div style={{...card,marginBottom:16}}>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:'#64748b',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Number of Questions</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {[10,15,20,30].map(n=><button key={n} onClick={()=>setNumQ(n)} style={{padding:'8px 20px',borderRadius:8,fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer',background:numQ===n?'rgba(0,212,255,.12)':'transparent',color:numQ===n?'#00d4ff':'#64748b',border:`1px solid ${numQ===n?'#00d4ff':'#1e2d4a'}`}}>{n}</button>)}
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,color:'#64748b',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Timer Mode</div>
          <div style={{display:'flex',gap:8}}>
            {[[true,'Timed (90s)'],[false,'Untimed']].map(([v,l])=><button key={l} onClick={()=>setTimed(v)} style={{padding:'8px 18px',borderRadius:8,fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer',background:timed===v?'rgba(0,212,255,.12)':'transparent',color:timed===v?'#00d4ff':'#64748b',border:`1px solid ${timed===v?'#00d4ff':'#1e2d4a'}`}}>{l}</button>)}
          </div>
        </div>
        <button onClick={start} style={{width:'100%',padding:14,borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#00d4ff)',color:'#fff',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:'0.95rem',fontWeight:700}}>Start Test &rarr;</button>
      </div>
      <div style={{...card,padding:18}}>
        <div style={{fontSize:'0.72rem',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Topics Covered</div>
        {['OOP Core — constructors, RAII, operators','Inheritance — virtual, LSP, diamond problem','Polymorphism — vtable, CRTP, dispatch','Templates — SFINAE, variadic, concepts','STL — containers, algorithms, lambdas','Exception Handling — safety guarantees'].map((t,i)=><div key={i} style={{fontSize:13,color:'#7da8c4',padding:'5px 0',borderBottom:'1px solid rgba(0,212,255,.04)'}}>&bull; {t}</div>)}
      </div>
    </div>
  );

  if(phase==='result'){
    const pct=Math.round(score/qs.length*100);
    const rc=pct>=85?'#10b981':pct>=65?'#f59e0b':'#ef4444';
    return(
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <div style={{...card,textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:'1.35rem',fontWeight:800,letterSpacing:'-.02em',marginBottom:6}}>{pct>=85?'Outstanding!':pct>=65?'Great Job!':'Keep Practicing'}</div>
          <div style={{width:110,height:110,borderRadius:'50%',border:`5px solid ${rc}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'16px auto 20px',boxShadow:`0 0 28px ${rc}40`}}>
            <span style={{fontFamily:'monospace',fontSize:'1.9rem',fontWeight:800,color:rc}}>{pct}%</span>
            <span style={{fontSize:10,color:'#64748b'}}>score</span>
          </div>
          <div style={{display:'flex',gap:28,justifyContent:'center',marginBottom:24}}>
            {[[score,'Correct','#10b981'],[qs.length-score,'Wrong','#ef4444'],[qs.length,'Total','#00d4ff']].map(([v,l,c])=><div key={l} style={{textAlign:'center'}}><div style={{fontFamily:'monospace',fontSize:'1.5rem',fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:'#64748b',textTransform:'uppercase',letterSpacing:'.06em'}}>{l}</div></div>)}
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={start} style={{padding:'11px 24px',borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#00d4ff)',color:'#fff',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:700}}>Try Again</button>
            <button onClick={()=>setPhase('setup')} style={{padding:'11px 24px',borderRadius:9,background:'transparent',color:'#00d4ff',border:'1px solid rgba(0,212,255,.3)',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:700}}>&larr; Setup</button>
          </div>
        </div>
        <div style={{fontSize:'0.72rem',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Answer Review</div>
        {log.map((item,i)=>(
          <div key={i} style={{background:'#0c1425',border:`1px solid ${item.ok?'rgba(16,185,129,.2)':'rgba(239,68,68,.15)'}`,borderRadius:10,padding:'14px 16px',marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{item.ok?'✓':'✗'} Q{i+1}: {item.q.q}</div>
            {!item.ok&&<div style={{fontSize:12,color:'#10b981',marginBottom:4}}>Correct: {item.q.opts[item.q.ans]}</div>}
            <div style={{fontSize:12,color:'#64748b',lineHeight:1.65}}>{item.q.exp}</div>
          </div>
        ))}
      </div>
    );
  }

  const q=qs[cur];const prog=Math.round(cur/qs.length*100);
  return(
    <div style={{maxWidth:640,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,gap:10,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,color:'#64748b',marginBottom:5}}><span>Question {cur+1} / {qs.length}</span><span>{prog}%</span></div>
          <div style={{height:4,borderRadius:99,background:'#1e2d4a',overflow:'hidden'}}><div style={{height:'100%',width:`${prog}%`,background:'linear-gradient(90deg,#7c3aed,#00d4ff)',borderRadius:99,transition:'width .4s ease'}}/></div>
        </div>
        {timed&&<div style={{fontFamily:'monospace',fontSize:'1.1rem',fontWeight:600,padding:'7px 16px',borderRadius:8,border:`1px solid ${timeLeft<=20?'rgba(239,68,68,.35)':'rgba(245,158,11,.25)'}`,background:timeLeft<=20?'rgba(239,68,68,.08)':'rgba(245,158,11,.07)',color:timeLeft<=20?'#ef4444':'#f59e0b',animation:timeLeft<=10?'glow 1s infinite':'none'}}>0:{String(timeLeft).padStart(2,'0')}</div>}
      </div>
      <div style={{background:'#0c1425',border:'1px solid #1e2d4a',borderRadius:12,padding:24,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:'0.95rem',lineHeight:1.6,marginBottom:20,color:'#e2e8f0'}}>Q{cur+1}. {q.q}</div>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {q.opts.map((opt,i)=>{
            let bc='#1e2d4a',bg='rgba(0,212,255,.02)',col='#e2e8f0';
            if(answered){if(i===q.ans){bc='#10b981';bg='rgba(16,185,129,.08)';col='#6ee7b7';}else if(i===sel){bc='#ef4444';bg='rgba(239,68,68,.07)';col='#f87171';}}else if(sel===i){bc='#00d4ff';bg='rgba(0,212,255,.07)';col='#00d4ff';}
            return(<div key={i} onClick={()=>!answered&&handleAns(i)} style={{padding:'12px 16px',borderRadius:9,border:`1px solid ${bc}`,background:bg,color:col,cursor:answered?'default':'pointer',display:'flex',alignItems:'center',gap:12,fontSize:14,transition:'all .15s'}}>
              <span style={{width:24,height:24,borderRadius:5,background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:10,fontWeight:700,color:'#00d4ff',flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}
            </div>);
          })}
        </div>
        {answered&&<div style={{marginTop:14,padding:'12px 14px',borderRadius:8,background:sel===q.ans?'rgba(16,185,129,.06)':'rgba(239,68,68,.06)',border:`1px solid ${sel===q.ans?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)'}`}}><span style={{fontWeight:700,color:sel===q.ans?'#10b981':'#ef4444'}}>{sel===q.ans?'Correct!':'Wrong'}</span><p style={{fontSize:13,color:'#64748b',marginTop:5,lineHeight:1.6}}>{q.exp}</p></div>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <button onClick={()=>setPhase('setup')} style={{padding:'9px 18px',borderRadius:8,background:'transparent',color:'#64748b',border:'1px solid #1e2d4a',cursor:'pointer',fontFamily:'inherit',fontSize:13}}>End Test</button>
        {answered&&<button onClick={next} style={{padding:'9px 22px',borderRadius:8,background:'linear-gradient(135deg,#7c3aed,#00d4ff)',color:'#fff',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:700}}>{cur+1>=qs.length?'See Results':'Next'} &rarr;</button>}
      </div>
    </div>
  );
}

// ─── AI TUTOR ───────────────────────────────────────────────────
function AITutor(){
  const [messages,setMessages]=useState([{role:'assistant',content:"Hi! I'm your C++ OOP AI Tutor. Ask me anything about C++!\n\nTry: \"Explain vtable with example\" or \"What is CRTP?\""}]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const SUGG=['Explain vtable and vptr','What is CRTP and when to use it?','Difference: move vs copy semantics','How does shared_ptr work internally?','What is SFINAE? Show enable_if example','Explain the 4 exception safety levels','What is Rule of Five?','Show diamond problem and virtual inheritance fix'];
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
  const send=async(msg)=>{
    if(!msg.trim()||loading)return;
    const um={role:'user',content:msg};
    setMessages(m=>[...m,um]);setInput('');setLoading(true);
    try{
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:'You are an expert C++ OOP tutor. Be precise. Use code examples in ```cpp blocks. Keep answers under 350 words. Explain WHY step by step.',messages:[...messages.map(m=>({role:m.role,content:m.content})),um]})});
      const d=await r.json();
      setMessages(m=>[...m,{role:'assistant',content:d.content?.[0]?.text||'No response.'}]);
    }catch{setMessages(m=>[...m,{role:'assistant',content:'Connection error. Please try again.'}]);}
    setLoading(false);
  };
  const fmt=(text)=>{
    const pts=text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
    return pts.map((p,i)=>{
      if(p.startsWith('```')&&p.endsWith('```')){const code=p.slice(p.indexOf('\n')+1,-3);return<pre key={i} style={{background:'#060d1f',border:'1px solid #1e2d4a',borderRadius:8,padding:'12px 14px',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.74rem',lineHeight:1.65,overflowX:'auto',margin:'8px 0',color:'#c9d5e8'}}>{code}</pre>;}
      if(p.startsWith('`')&&p.endsWith('`'))return<code key={i} style={{fontFamily:'monospace',background:'rgba(0,212,255,.1)',color:'#00d4ff',padding:'1px 5px',borderRadius:3,fontSize:'.85em'}}>{p.slice(1,-1)}</code>;
      if(p.startsWith('**')&&p.endsWith('**'))return<strong key={i} style={{color:'#00d4ff'}}>{p.slice(2,-2)}</strong>;
      return<span key={i}>{p.split('\n').map((l,j,a)=><span key={j}>{l}{j<a.length-1&&<br/>}</span>)}</span>;
    });
  };
  return(
    <div style={{maxWidth:780,margin:'0 auto'}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:'1.5rem',fontWeight:800,letterSpacing:'-.02em',marginBottom:5}}>C++ OOP AI Tutor</div>
        <div style={{fontSize:13,color:'#64748b'}}>Powered by Claude &middot; Ask anything about C++, OOP, templates, STL, design patterns</div>
      </div>
      {messages.length<=1&&(
        <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:16}}>
          {SUGG.map((s,i)=><button key={i} onClick={()=>send(s)} style={{padding:'7px 13px',borderRadius:20,background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.15)',color:'#7da8c4',fontFamily:'inherit',fontSize:12,cursor:'pointer',transition:'all .18s'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,212,255,.12)';e.currentTarget.style.color='#00d4ff';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,212,255,.06)';e.currentTarget.style.color='#7da8c4';}}>{s}</button>)}
        </div>
      )}
      <div style={{background:'#0a0e1a',border:'1px solid #1e2d4a',borderRadius:14,overflow:'hidden'}}>
        <div style={{height:460,overflowY:'auto',padding:'20px 20px 8px'}}>
          {messages.map((m,i)=>(
            <div key={i} style={{marginBottom:18,display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{maxWidth:'85%',padding:'12px 16px',fontSize:'0.87rem',lineHeight:1.7,color:'#e2e8f0',borderRadius:m.role==='user'?'12px 12px 2px 12px':'2px 12px 12px 12px',background:m.role==='user'?'linear-gradient(135deg,rgba(124,58,237,.25),rgba(0,212,255,.15))':'rgba(15,22,41,.95)',border:m.role==='user'?'1px solid rgba(124,58,237,.3)':'1px solid #1e2d4a'}}>
                {m.role==='assistant'&&<div style={{fontSize:'0.62rem',color:'#00d4ff',fontWeight:700,letterSpacing:'.1em',marginBottom:6,textTransform:'uppercase'}}>AI Tutor</div>}
                {fmt(m.content)}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:'flex',gap:5,padding:'8px 0'}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:'#00d4ff',animation:`bounce 1.2s ${i*.2}s infinite`}}/>)}</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:'12px 16px',borderTop:'1px solid #1e2d4a',display:'flex',gap:10}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send(input)} placeholder="Ask about C++ OOP... (Enter to send)" style={{flex:1,background:'rgba(0,212,255,.04)',border:'1px solid #1e2d4a',borderRadius:9,padding:'10px 14px',color:'#e2e8f0',fontFamily:'inherit',fontSize:14,outline:'none'}}/>
          <button onClick={()=>send(input)} disabled={loading||!input.trim()} style={{padding:'10px 20px',borderRadius:9,border:'none',cursor:loading||!input.trim()?'not-allowed':'pointer',background:loading||!input.trim()?'#1e2d4a':'linear-gradient(135deg,#7c3aed,#00d4ff)',color:'#fff',fontFamily:'inherit',fontSize:13,fontWeight:700,transition:'all .2s',opacity:loading||!input.trim()?.6:1}}>{loading?'...':'Send'}</button>
        </div>
      </div>
    </div>
  );
}
