
// ─── MAIN APP ───────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState('practice');
  const [filter,setFilter]=useState('all');
  const [openQ,setOpenQ]=useState(null);
  const [summaryTopic,setSummaryTopic]=useState(null);
  const [searchTerm,setSearchTerm]=useState('');
  const [diffFilter,setDiffFilter]=useState('all');
  const [bookmarks,setBookmarks]=useState(()=>{try{return new Set(JSON.parse(localStorage.getItem('cpp_bm')||'[]'));}catch{return new Set();}});

  const toggleBm=useCallback((id)=>{setBookmarks(b=>{const n=new Set(b);n.has(id)?n.delete(id):n.add(id);localStorage.setItem('cpp_bm',JSON.stringify([...n]));return n;});},[]);

  const filtered=QUESTIONS.filter(q=>{
    if(filter!=='all'&&filter!=='__bm__'&&q.topic!==filter)return false;
    if(filter==='__bm__'&&!bookmarks.has(q.id))return false;
    if(diffFilter!=='all'&&q.diff!==diffFilter)return false;
    if(searchTerm&&!q.q.toLowerCase().includes(searchTerm.toLowerCase()))return false;
    return true;
  });

  const NAV=[['practice','Practice'],['summaries','Summaries'],['test','Test'],['ai','AI Tutor']];
  const topicCounts=Object.keys(TM).reduce((a,k)=>{a[k]=k==='all'?QUESTIONS.length:QUESTIONS.filter(q=>q.topic===k).length;return a;},{});

  const S={
    page:{minHeight:'100vh',background:'#060b18',color:'#e2e8f0',fontFamily:"'Inter',system-ui,sans-serif"},
    bg1:{position:'fixed',inset:0,background:'radial-gradient(ellipse 80% 50% at 20% 10%,rgba(124,58,237,.07),transparent 60%),radial-gradient(ellipse 60% 40% at 80% 90%,rgba(0,212,255,.05),transparent 60%)',pointerEvents:'none',zIndex:0},
    bg2:{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,212,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.018) 1px,transparent 1px)',backgroundSize:'44px 44px',pointerEvents:'none',zIndex:0},
    nav:{position:'sticky',top:0,zIndex:100,height:58,background:'rgba(6,11,24,.94)',backdropFilter:'blur(20px)',borderBottom:'1px solid #1e2d4a',display:'flex',alignItems:'center',padding:'0 20px',gap:2},
    brand:{fontWeight:800,fontSize:'1.05rem',color:'#00d4ff',marginRight:20,letterSpacing:'-.02em'},
    content:{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'28px 20px'},
  };

  return(
    <div style={S.page}>
      <div style={S.bg1}/><div style={S.bg2}/>
      <nav style={S.nav}>
        <div style={S.brand}>C++ <span style={{color:'#e2e8f0'}}>OOP</span></div>
        {NAV.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{height:'100%',padding:'0 14px',background:'none',border:'none',borderBottom:`2px solid ${tab===id?'#00d4ff':'transparent'}`,color:tab===id?'#00d4ff':'#64748b',fontFamily:'inherit',fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',cursor:'pointer',transition:'all .2s'}}>{label}</button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',gap:14,alignItems:'center'}}>
          <span style={{fontSize:11,color:'#475569',fontFamily:'monospace'}}>{QUESTIONS.length} questions</span>
          {bookmarks.size>0&&<span style={{fontSize:11,color:'#f59e0b',fontFamily:'monospace'}}>&#9733; {bookmarks.size}</span>}
        </div>
      </nav>

      <div style={S.content}>

        {/* PRACTICE */}
        {tab==='practice'&&(
          <>
            {/* Stats bar */}
            <div style={{display:'flex',gap:16,flexWrap:'wrap',padding:'14px 20px',background:'linear-gradient(135deg,rgba(124,58,237,.07),rgba(0,212,255,.04))',border:'1px solid #1e2d4a',borderRadius:12,marginBottom:22,alignItems:'center'}}>
              {[[QUESTIONS.length,'Questions'],[QUESTIONS.filter(q=>q.diff==='hard').length,'Hard'],[QUESTIONS.filter(q=>q.type==='output').length,'Output Qs'],[bookmarks.size,'Saved'],[Object.keys(TM).length-1,'Topics']].map(([n,l])=>(
                <div key={l} style={{textAlign:'center',minWidth:56}}>
                  <div style={{fontSize:'1.25rem',fontWeight:800,fontFamily:'monospace',background:'linear-gradient(135deg,#00d4ff,#7c3aed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{n}</div>
                  <div style={{fontSize:10,color:'#475569',textTransform:'uppercase',letterSpacing:'.06em',marginTop:1}}>{l}</div>
                </div>
              ))}
              <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                {['all','medium','hard'].map(d=>(
                  <button key={d} onClick={()=>setDiffFilter(d)} style={{padding:'4px 12px',borderRadius:99,fontSize:'0.67rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',border:'1px solid',borderColor:diffFilter===d?'#00d4ff':'#1e2d4a',background:diffFilter===d?'rgba(0,212,255,.1)':'transparent',color:diffFilter===d?'#00d4ff':'#64748b'}}>{d}</button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
              <div style={{position:'relative',flex:1,minWidth:200}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#475569',fontSize:13}}>&#128269;</span>
                <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search questions..."
                  style={{width:'100%',padding:'9px 14px 9px 36px',background:'rgba(0,212,255,.03)',border:'1px solid #1e2d4a',borderRadius:9,color:'#e2e8f0',fontFamily:'inherit',fontSize:13.5,outline:'none'}}/>
              </div>
              <span style={{fontSize:11.5,color:'#475569',fontFamily:'monospace'}}>{filtered.length} shown</span>
            </div>

            {/* Topic pills */}
            <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:12}}>
              {Object.keys(TM).map(t=><Pill key={t} t={t} active={filter===t} count={t!=='all'?topicCounts[t]:null} onClick={()=>setFilter(t)}/>)}
            </div>
            {bookmarks.size>0&&(
              <div style={{marginBottom:14}}>
                <button onClick={()=>setFilter(filter==='__bm__'?'all':'__bm__')} style={{padding:'5px 13px',borderRadius:99,fontSize:'0.7rem',fontWeight:700,cursor:'pointer',border:`1px solid ${filter==='__bm__'?'#f59e0b':'#1e2d4a'}`,background:filter==='__bm__'?'rgba(245,158,11,.1)':'transparent',color:filter==='__bm__'?'#f59e0b':'#64748b'}}>&#9733; Bookmarks ({bookmarks.size})</button>
              </div>
            )}

            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {filtered.map(q=><QCard key={q.id} q={q} isOpen={openQ===q.id} onToggle={()=>setOpenQ(openQ===q.id?null:q.id)} isBookmarked={bookmarks.has(q.id)} onBookmark={()=>toggleBm(q.id)}/>)}
            </div>
          </>
        )}

        {/* SUMMARIES */}
        {tab==='summaries'&&(
          <>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:'1.5rem',fontWeight:800,letterSpacing:'-.02em',marginBottom:6}}>Topic Summaries</div>
              <div style={{color:'#64748b',fontSize:13}}>Key revision points for each topic.</div>
            </div>
            {!summaryTopic?(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
                {Object.entries(SUMMARIES).map(([key,s])=>(
                  <button key={key} onClick={()=>setSummaryTopic(key)} style={{padding:22,borderRadius:14,background:'#0c1425',border:'1px solid #1e2d4a',cursor:'pointer',textAlign:'left',fontFamily:'inherit',color:'#e2e8f0',transition:'all .25s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 28px ${s.color}18`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e2d4a';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                    <div style={{fontWeight:700,fontSize:'1rem',color:s.color,marginBottom:5}}>{s.title}</div>
                    <div style={{fontSize:12,color:'#64748b',marginBottom:8}}>{s.points.length} key points</div>
                    <div style={{fontSize:11,color:s.color,opacity:.7}}>View &rarr;</div>
                  </button>
                ))}
              </div>
            ):(
              <div>
                <button onClick={()=>setSummaryTopic(null)} style={{marginBottom:20,padding:'7px 14px',borderRadius:8,background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',color:'#00d4ff',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:600}}>&larr; Back</button>
                <div style={{background:'#0c1425',border:`1px solid ${SUMMARIES[summaryTopic].color}30`,borderRadius:14,padding:28}}>
                  <div style={{fontSize:'1.4rem',fontWeight:800,color:SUMMARIES[summaryTopic].color,marginBottom:20}}>{SUMMARIES[summaryTopic].title}</div>
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
                        style={{padding:'9px 14px',borderRadius:8,background:'rgba(0,0,0,.3)',border:'1px solid #1e2d4a',marginBottom:7,fontSize:'0.82rem',color:'#7da8c4',cursor:'pointer'}}
                        onMouseEnter={e=>e.currentTarget.style.color='#00d4ff'}
                        onMouseLeave={e=>e.currentTarget.style.color='#7da8c4'}>
                        #{q.id}: {q.q.slice(0,72)}&hellip;
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab==='test'&&<QuizSection questions={QUIZ_QS}/>}
        {tab==='ai'&&<AITutor/>}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}html,body{height:100%;}
        ::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:99px;}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(239,68,68,.4)}50%{box-shadow:0 0 24px rgba(239,68,68,.7)}}
        input::placeholder{color:#475569;}input:focus{border-color:rgba(0,212,255,.3)!important;outline:none;}
      `}</style>
    </div>
  );
}
