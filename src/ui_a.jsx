
// ─── TOPIC META (no emojis to avoid encoding issues) ───────────
const TM={all:{label:'All',color:'#00d4ff',icon:'*'},oop:{label:'OOP Core',color:'#7c3aed',icon:'#'},inherit:{label:'Inheritance',color:'#00d4ff',icon:'^'},poly:{label:'Polymorphism',color:'#f59e0b',icon:'@'},template:{label:'Templates',color:'#10b981',icon:'<>'},stl:{label:'STL',color:'#ef4444',icon:'~'},exception:{label:'Exceptions',color:'#fbbf24',icon:'!'},file:{label:'File I/O',color:'#6366f1',icon:'[]'}};

// ─── SMALL COMPONENTS ───────────────────────────────────────────
const Pill=({t,active,onClick,count})=>{
  const m=TM[t]||TM.all;
  return(<button onClick={onClick} style={{padding:'5px 13px',borderRadius:99,fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',cursor:'pointer',border:'1px solid',borderColor:active?m.color:'#1e2d4a',background:active?`${m.color}18`:'#0c1425',color:active?m.color:'#64748b',transition:'all .2s'}}>{m.label}{count!=null?<span style={{opacity:.6,marginLeft:4}}>({count})</span>:null}</button>);
};

const Tag=({children,color,bg})=>(<span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.06em',border:`1px solid ${color}40`,background:bg||`${color}15`,color}}>{children}</span>);

// ─── QUESTION CARD ───────────────────────────────────────────────
function QCard({q,isOpen,onToggle,isBookmarked,onBookmark}){
  const tc=TM[q.topic]?.color||'#00d4ff';
  return(
    <div style={{background:'#0c1425',border:`1px solid ${isOpen?'rgba(0,212,255,.3)':'#1e2d4a'}`,borderRadius:12,overflow:'hidden',transition:'all .2s',boxShadow:isOpen?'0 0 24px rgba(0,212,255,.08)':'none'}}>
      <div onClick={onToggle} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'15px 18px',cursor:'pointer'}}>
        <span style={{fontFamily:'monospace',fontSize:'0.65rem',color:'#475569',minWidth:28,paddingTop:3}}>#{q.id}</span>
        <div style={{flex:1}}>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:7}}>
            <Tag color={tc}>{TM[q.topic]?.label}</Tag>
            {q.type==='output'?<Tag color='#6ee7b7' bg='rgba(16,185,129,.1)'>Output</Tag>:<Tag color='#f9a8d4' bg='rgba(236,72,153,.1)'>Theory</Tag>}
            {q.diff==='hard'?<Tag color='#f87171' bg='rgba(239,68,68,.1)'>Hard</Tag>:<Tag color='#fbbf24' bg='rgba(245,158,11,.1)'>Medium</Tag>}
          </div>
          <div style={{fontSize:'0.88rem',fontWeight:600,lineHeight:1.55,color:'#e2e8f0'}}>{q.q}</div>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();onBookmark();}} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:isBookmarked?'#f59e0b':'#334155',transition:'color .2s'}}>&#9733;</button>
          <span style={{color:'#475569',transition:'transform .3s',display:'inline-block',fontSize:11,transform:isOpen?'rotate(180deg)':'none'}}>&#9660;</span>
        </div>
      </div>
      {isOpen&&(
        <div style={{padding:'0 18px 18px 58px',borderTop:'1px solid #1e2d4a',paddingTop:16}}>
          {q.code&&<pre style={{background:'#060d1f',border:'1px solid #1e2d4a',borderRadius:9,padding:'12px 16px',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem',lineHeight:1.65,overflowX:'auto',margin:'0 0 14px',color:'#c9d5e8'}} dangerouslySetInnerHTML={{__html:q.code}}/>}
          {q.type==='output'&&(
            <div style={{background:'rgba(0,212,255,.05)',border:'1px solid rgba(0,212,255,.15)',borderRadius:9,padding:'10px 14px',marginBottom:12}}>
              <div style={{fontSize:'0.62rem',fontWeight:700,color:'#00d4ff',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:5}}>Expected Output</div>
              <span style={{fontFamily:'monospace',fontSize:'0.9rem',color:'#00d4ff'}}>{q.output}</span>
            </div>
          )}
          <div style={{background:'rgba(16,185,129,.05)',border:'1px solid rgba(16,185,129,.15)',borderRadius:9,padding:'12px 14px'}}>
            <div style={{fontSize:'0.62rem',fontWeight:700,color:'#10b981',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:7}}>Answer / Explanation</div>
            <div style={{fontSize:'0.84rem',color:'#94a3b8',lineHeight:1.8,whiteSpace:'pre-line'}}>{q.answer_text||q.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
}
