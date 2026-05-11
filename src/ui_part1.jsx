
// ── TOPIC META ──────────────────────────────────────────────────
const TM = {
  all:{label:'All',color:'#00d4ff',icon:'◈'},
  oop:{label:'OOP Core',color:'#7c3aed',icon:'⬡'},
  inherit:{label:'Inheritance',color:'#00d4ff',icon:'⇡'},
  poly:{label:'Polymorphism',color:'#f59e0b',icon:'◎'},
  template:{label:'Templates',color:'#10b981',icon:'<>'},
  stl:{label:'STL',color:'#ef4444',icon:'≋'},
  exception:{label:'Exceptions',color:'#fbbf24',icon:'⚡'},
  file:{label:'File I/O',color:'#6366f1',icon:'◻'},
};

// ── SMALL HELPERS ────────────────────────────────────────────────
const Pill = ({t,active,onClick,count}) => {
  const m=TM[t]||TM.all;
  return (
    <button onClick={onClick} style={{
      padding:'5px 13px',borderRadius:99,fontSize:'0.7rem',fontWeight:700,
      textTransform:'uppercase',letterSpacing:'0.05em',cursor:'pointer',border:'1px solid',
      borderColor:active?m.color:'#1e2d4a',
      background:active?`${m.color}18`:'#0c1425',
      color:active?m.color:'#64748b',
      transition:'all .2s'
    }}>
      {m.icon} {m.label}{count!=null?<span style={{opacity:.6,marginLeft:4}}>({count})</span>:null}
    </button>
  );
};

const Tag = ({children,color,bg}) => (
  <span style={{
    fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:99,
    textTransform:'uppercase',letterSpacing:'0.06em',
    border:`1px solid ${color}40`,background:bg||`${color}15`,color
  }}>{children}</span>
);

const Btn = ({children,onClick,variant='primary',disabled,style={}}) => {
  const styles = {
    primary:{background:'linear-gradient(135deg,#7c3aed,#00d4ff)',color:'#fff',border:'none'},
    ghost:{background:'transparent',color:'#64748b',border:'1px solid #1e2d4a'},
    cyan:{background:'rgba(0,212,255,.1)',color:'#00d4ff',border:'1px solid rgba(0,212,255,.25)'},
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:'9px 20px',borderRadius:9,fontFamily:'inherit',fontSize:13,fontWeight:700,
      cursor:disabled?'not-allowed':('pointer'),display:'inline-flex',alignItems:'center',gap:6,
      opacity:disabled?.5:1,transition:'all .2s',...(styles[variant]||styles.primary),...style
    }}>{children}</button>
  );
};

// ── QUESTION CARD ────────────────────────────────────────────────
function QCard({q,isOpen,onToggle,isBookmarked,onBookmark}) {
  const tc = TM[q.topic]?.color||'#00d4ff';
  return (
    <div style={{
      background:'#0c1425',border:`1px solid ${isOpen?'rgba(0,212,255,.3)':'#1e2d4a'}`,
      borderRadius:12,overflow:'hidden',transition:'all .2s',
      boxShadow:isOpen?'0 0 24px rgba(0,212,255,.08)':'none'
    }}>
      <div onClick={onToggle} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'15px 18px',cursor:'pointer'}}>
        <span style={{fontFamily:'monospace',fontSize:'0.65rem',color:'#475569',minWidth:28,paddingTop:3}}>#{q.id}</span>
        <div style={{flex:1}}>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:7}}>
            <Tag color={tc}>{TM[q.topic]?.icon} {TM[q.topic]?.label}</Tag>
            {q.type==='output'
              ?<Tag color='#6ee7b7' bg='rgba(16,185,129,.1)'>▶ Output</Tag>
              :<Tag color='#f9a8d4' bg='rgba(236,72,153,.1)'>📖 Theory</Tag>}
            {q.diff==='hard'
              ?<Tag color='#f87171' bg='rgba(239,68,68,.1)'>🔥 Hard</Tag>
              :<Tag color='#fbbf24' bg='rgba(245,158,11,.1)'>⚡ Medium</Tag>}
          </div>
          <div style={{fontSize:'0.88rem',fontWeight:600,lineHeight:1.55,color:'#e2e8f0'}}>{q.q}</div>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();onBookmark();}} style={{
            background:'none',border:'none',cursor:'pointer',fontSize:16,
            color:isBookmarked?'#f59e0b':'#334155',transition:'color .2s'
          }}>★</button>
          <span style={{color:'#475569',transition:'transform .3s',display:'inline-block',fontSize:11,
            transform:isOpen?'rotate(180deg)':'none'}}>▼</span>
        </div>
      </div>
      {isOpen && (
        <div style={{padding:'0 18px 18px 58px',borderTop:'1px solid #1e2d4a',paddingTop:16,animation:'fadeIn .25s ease'}}>
          {q.code && <pre style={{background:'#060d1f',border:'1px solid #1e2d4a',borderRadius:9,padding:'12px 16px',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem',lineHeight:1.65,overflowX:'auto',margin:'0 0 14px',color:'#c9d5e8'}} dangerouslySetInnerHTML={{__html:q.code}}/>}
          {q.type==='output' && (
            <div style={{background:'rgba(0,212,255,.05)',border:'1px solid rgba(0,212,255,.15)',borderRadius:9,padding:'10px 14px',marginBottom:12}}>
              <div style={{fontSize:'0.62rem',fontWeight:700,color:'#00d4ff',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:5}}>Expected Output</div>
              <code style={{fontFamily:'monospace',fontSize:'0.9rem',color:'#00d4ff',background:'none'}}>{q.output}</code>
            </div>
          )}
          <div style={{background:'rgba(16,185,129,.05)',border:'1px solid rgba(16,185,129,.15)',borderRadius:9,padding:'12px 14px'}}>
            <div style={{fontSize:'0.62rem',fontWeight:700,color:'#10b981',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:7}}>✓ Answer / Explanation</div>
            <div style={{fontSize:'0.84rem',color:'#94a3b8',lineHeight:1.8,whiteSpace:'pre-line'}}>{q.answer_text||q.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('practice');
  const [filter, setFilter] = useState('all');
  const [openQ, setOpenQ] = useState(null);
  const [summaryTopic, setSummaryTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState(()=>{
    try{return new Set(JSON.parse(localStorage.getItem('cpp_bm')||'[]'));}catch{return new Set();}
  });
  const [diffFilter, setDiffFilter] = useState('all');

  const toggleBm = useCallback((id)=>{
    setBookmarks(b=>{
      const n=new Set(b);
      n.has(id)?n.delete(id):n.add(id);
      localStorage.setItem('cpp_bm',JSON.stringify([...n]));
      return n;
    });
  },[]);

  const filtered = QUESTIONS.filter(q=>{
    if(filter!=='all'&&q.topic!==filter) return false;
    if(diffFilter!=='all'&&q.diff!==diffFilter) return false;
    if(searchTerm&&!q.q.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const tabs=[['practice','📖 Practice'],['summaries','📚 Summaries'],['test','🏆 Test'],['ai','🤖 AI Tutor']];

  const topicCounts = Object.keys(TM).reduce((acc,k)=>{
    acc[k]=k==='all'?QUESTIONS.length:QUESTIONS.filter(q=>q.topic===k).length;
    return acc;
  },{});

  return (
    <div style={{minHeight:'100vh',background:'#060b18',color:'#e2e8f0',fontFamily:"'Inter',system-ui,sans-serif"}}>
      {/* fixed bg */}
      <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse 80% 50% at 20% 10%,rgba(124,58,237,.07),transparent 60%),radial-gradient(ellipse 60% 40% at 80% 90%,rgba(0,212,255,.05),transparent 60%)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,212,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.018) 1px,transparent 1px)',backgroundSize:'44px 44px',pointerEvents:'none',zIndex:0}}/>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,height:58,background:'rgba(6,11,24,.93)',backdropFilter:'blur(20px)',borderBottom:'1px solid #1e2d4a',display:'flex',alignItems:'center',padding:'0 20px',gap:2}}>
        <div style={{fontWeight:800,fontSize:'1.05rem',color:'#00d4ff',marginRight:20,letterSpacing:'-.02em',whiteSpace:'nowrap'}}>
          C++ <span style={{color:'#e2e8f0'}}>OOP</span>
        </div>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            height:'100%',padding:'0 14px',background:'none',border:'none',
            borderBottom:`2px solid ${tab===id?'#00d4ff':'transparent'}`,
            color:tab===id?'#00d4ff':'#64748b',fontFamily:'inherit',
            fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',
            letterSpacing:'0.06em',cursor:'pointer',transition:'all .2s',whiteSpace:'nowrap'
          }}>{label}</button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:11,color:'#475569',fontFamily:'monospace'}}>{QUESTIONS.length} questions</span>
          {bookmarks.size>0&&<span style={{fontSize:11,color:'#f59e0b',fontFamily:'monospace'}}>★ {bookmarks.size}</span>}
        </div>
      </nav>

      <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'28px 20px'}}>

        {/* STATS BAR - practice tab */}
        {tab==='practice'&&(
          <div style={{display:'flex',gap:16,flexWrap:'wrap',padding:'14px 20px',background:'linear-gradient(135deg,rgba(124,58,237,.07),rgba(0,212,255,.04))',border:'1px solid #1e2d4a',borderRadius:12,marginBottom:22,alignItems:'center'}}>
            {[
              [QUESTIONS.length,'Questions'],
              [QUESTIONS.filter(q=>q.diff==='hard').length,'Hard'],
              [QUESTIONS.filter(q=>q.type==='output').length,'Output Qs'],
              [bookmarks.size,'Bookmarked'],
              [Object.keys(TM).length-1,'Topics'],
            ].map(([n,l])=>(
              <div key={l} style={{textAlign:'center',minWidth:56}}>
                <div style={{fontSize:'1.25rem',fontWeight:800,fontFamily:'monospace',background:'linear-gradient(135deg,#00d4ff,#7c3aed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{n}</div>
                <div style={{fontSize:10,color:'#475569',textTransform:'uppercase',letterSpacing:'.06em',marginTop:1}}>{l}</div>
              </div>
            ))}
            <div style={{marginLeft:'auto',display:'flex',gap:6}}>
              {['all','medium','hard'].map(d=>(
                <button key={d} onClick={()=>setDiffFilter(d)} style={{
                  padding:'4px 11px',borderRadius:99,fontSize:'0.67rem',fontWeight:700,
                  textTransform:'uppercase',cursor:'pointer',border:'1px solid',
                  borderColor:diffFilter===d?'#00d4ff':'#1e2d4a',
                  background:diffFilter===d?'rgba(0,212,255,.1)':'transparent',
                  color:diffFilter===d?'#00d4ff':'#64748b'
                }}>{d}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── PRACTICE TAB ── */}
        {tab==='practice'&&(
          <>
            {/* Search + filters */}
            <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
              <div style={{position:'relative',flex:1,minWidth:200}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#475569',fontSize:14}}>🔍</span>
                <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search questions..."
                  style={{width:'100%',padding:'9px 14px 9px 36px',background:'rgba(0,212,255,.03)',border:'1px solid #1e2d4a',borderRadius:9,color:'#e2e8f0',fontFamily:'inherit',fontSize:13.5,outline:'none'}}/>
              </div>
              <span style={{fontSize:11.5,color:'#475569',fontFamily:'monospace',whiteSpace:'nowrap'}}>{filtered.length} shown</span>
            </div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:22}}>
              {Object.keys(TM).map(t=>(
                <Pill key={t} t={t} active={filter===t} count={t!=='all'?topicCounts[t]:null} onClick={()=>setFilter(t)}/>
              ))}
            </div>
            {/* Bookmark filter */}
            {bookmarks.size>0&&(
              <div style={{marginBottom:12}}>
                <button onClick={()=>setFilter(filter==='__bm__'?'all':'__bm__')} style={{
                  padding:'5px 13px',borderRadius:99,fontSize:'0.7rem',fontWeight:700,cursor:'pointer',
                  border:`1px solid ${filter==='__bm__'?'#f59e0b':'#1e2d4a'}`,
                  background:filter==='__bm__'?'rgba(245,158,11,.1)':'transparent',
                  color:filter==='__bm__'?'#f59e0b':'#64748b'
                }}>★ Bookmarks ({bookmarks.size})</button>
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {(filter==='__bm__'?QUESTIONS.filter(q=>bookmarks.has(q.id)):filtered).map(q=>(
                <QCard key={q.id} q={q} isOpen={openQ===q.id}
                  onToggle={()=>setOpenQ(openQ===q.id?null:q.id)}
                  isBookmarked={bookmarks.has(q.id)}
                  onBookmark={()=>toggleBm(q.id)}/>
              ))}
            </div>
          </>
        )}

        {/* ── SUMMARIES TAB ── */}
        {tab==='summaries'&&(
          <>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:'1.5rem',fontWeight:800,letterSpacing:'-.02em',marginBottom:6}}>📚 Topic Summaries</div>
              <div style={{color:'#64748b',fontSize:13}}>Key revision points for each topic — click to expand.</div>
            </div>
            {!summaryTopic?(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
                {Object.entries(SUMMARIES).map(([key,s])=>(
                  <button key={key} onClick={()=>setSummaryTopic(key)} style={{
                    padding:22,borderRadius:14,background:'#0c1425',border:'1px solid #1e2d4a',
                    cursor:'pointer',textAlign:'left',fontFamily:'inherit',color:'#e2e8f0',
                    transition:'all .25s'
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 28px ${s.color}18`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e2d4a';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                    <div style={{fontSize:'1.5rem',marginBottom:10}}>{['⬡','⇡','◎','<>','≋','⚡','◻'][Object.keys(SUMMARIES).indexOf(key)]}</div>
                    <div style={{fontWeight:700,fontSize:'1rem',color:s.color,marginBottom:5}}>{s.title}</div>
                    <div style={{fontSize:12,color:'#64748b',marginBottom:8}}>{s.points.length} key points</div>
                    <div style={{fontSize:11,color:s.color,opacity:.7}}>View → </div>
                  </button>
                ))}
              </div>
            ):(
              <div>
                <Btn variant='cyan' onClick={()=>setSummaryTopic(null)} style={{marginBottom:20}}>← Back</Btn>
                <div style={{background:'#0c1425',border:`1px solid ${SUMMARIES[summaryTopic].color}30`,borderRadius:14,padding:28}}>
                  <div style={{fontSize:'1.4rem',fontWeight:800,color:SUMMARIES[summaryTopic].color,marginBottom:20,letterSpacing:'-.02em'}}>{SUMMARIES[summaryTopic].title}</div>
                  {SUMMARIES[summaryTopic].points.map((pt,i)=>(
                    <div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'11px 14px',borderRadius:9,background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.04)'}}>
                      <span style={{fontFamily:'monospace',fontSize:10,color:SUMMARIES[summaryTopic].color,minWidth:22,paddingTop:3,fontWeight:700}}>{String(i+1).padStart(2,'0')}</span>
                      <span style={{fontSize:'0.86rem',color:'#94a3b8',lineHeight:1.75}}>{pt}</span>
                    </div>
                  ))}
                  <div style={{marginTop:22,paddingTop:18,borderTop:'1px solid #1e2d4a'}}>
                    <div style={{fontSize:'0.72rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Related Practice Questions</div>
                    {QUESTIONS.filter(q=>q.topic===summaryTopic).slice(0,4).map(q=>(
                      <div key={q.id} onClick={()=>{setSummaryTopic(null);setTab('practice');setFilter(summaryTopic);setOpenQ(q.id);}}
                        style={{padding:'9px 14px',borderRadius:8,background:'rgba(0,0,0,.3)',border:'1px solid #1e2d4a',marginBottom:7,fontSize:'0.82rem',color:'#7da8c4',cursor:'pointer',transition:'color .2s'}}
                        onMouseEnter={e=>e.currentTarget.style.color='#00d4ff'}
                        onMouseLeave={e=>e.currentTarget.style.color='#7da8c4'}>
                        #{q.id}: {q.q.slice(0,72)}…
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TEST TAB ── */}
        {tab==='test'&&<QuizSection questions={QUIZ_QS}/>}

        {/* ── AI TAB ── */}
        {tab==='ai'&&<AITutor/>}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:99px;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(239,68,68,.4)}50%{box-shadow:0 0 24px rgba(239,68,68,.7)}}
        input::placeholder{color:#475569;}
        input{transition:border-color .2s;}
        input:focus{border-color:rgba(0,212,255,.3)!important;outline:none;}
      `}</style>
    </div>
  );
}
