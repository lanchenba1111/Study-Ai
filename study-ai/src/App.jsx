import React, { useState, useEffect } from 'react';
import { 
  Brain, FileText, Sparkles, Loader2, GraduationCap, 
  Copy, Check, BookOpen, HelpCircle, Activity, Download, 
  Trash2, Layers, Clock, Star, Zap, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import html2pdf from 'html2pdf.js';
import 'katex/dist/katex.min.css';

const API_KEY = "AIzaSyBFOUdFGm94q2h6sCOmqYtMoE1m-S5n_RU"; 

export default function App() {
  const [board, setBoard] = useState('');
  const [stream, setStream] = useState(''); 
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [materialType, setMaterialType] = useState('questions');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [history, setHistory] = useState([]);

  const curriculum = {
    BOSEM: { 
      subjects: [
        'Manipuri', 'English', 'Mathematics', 'Science', 'Social Studies', 
        'HEFS (Home Science)', 'Computer Science', 'Higher Mathematics', 
        'Environmental Education', 'Physical Education'
      ] 
    },
    COHSEM: {
      streams: {
        Science: [
          'Physics', 'Chemistry', 'Biology', 'Mathematics', 
          'Manipuri', 'English', 'HEFS (Home Science)', 'Computer Science', 
          'Statistics', 'Environmental Education', 'Biotechnology'
        ],
        Arts: [
          'Political Science', 'History', 'Geography', 'Economics', 
          'Sociology', 'Education', 'English', 'Psychology', 
          'HEFS (Home Science)', 'Manipuri', 'Philosophy', 
          'Anthropology', 'Social Work', 'Environmental Education'
        ],
        Commerce: [
          'Accountancy', 'Business Studies', 'Economics', 'Mathematics', 
          'Manipuri', 'English', 'Computer Science', 
          'Entrepreneurship', 'Environmental Education'
        ]
      }
    }
  };

  const materialTypes = [
    { value: 'questions', label: 'Exam Questions', icon: <HelpCircle size={18}/>, color: 'text-orange-500' },
    { value: 'notes', label: 'Study Notes', icon: <FileText size={18}/>, color: 'text-blue-500' },
    { value: 'flashcards', label: 'Quick Recall', icon: <Zap size={18}/>, color: 'text-yellow-500' }
  ];

  const testConnection = async () => {
    setTestStatus('loading');
    setError('');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Invalid Model");
      setTestStatus('success');
      setTimeout(() => setTestStatus(null), 3000);
    } catch (err) {
      setError(err.message);
      setTestStatus('error');
    }
  };

  const generateContent = async () => {
    if (!board || !subject || !topic) {
      setError('Puran, please complete the configuration first.');
      return;
    }
    setLoading(true); setError(''); setResult('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `You are an expert academic tutor specializing in the ${board} curriculum for Manipur. 
                Generate highly accurate ${materialType} for ${board} ${stream}. 
                Subject: ${subject}. Topic: ${topic}. 

                CRITICAL INSTRUCTIONS:
                1. SCRIPT: Use Meetei Mayek script (e.g., ꯃꯤꯇꯩ ꯃꯌꯦꯛ) for ALL Manipuri language content. 
                2. STRICT RULE: Do NOT use Bengali script under any circumstances.
                3. FORMATTING: Use professional Markdown with LaTeX for math ($...$ for inline, $$...$$ for blocks).
                4. STRUCTURE: Provide a clear title, bullet points, and a summary section.` 
              }] 
            }]
          })
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Connection Error');
      
      const text = data.candidates[0].content.parts[0].text;
      setResult(text);
      setHistory(prev => [{ topic, subject, date: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('printable-content');
    const opt = {
      margin: 0.5,
      filename: `StudyAI_${topic}_${subject}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Meetei Mayek Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Meetei+Mayek:wght@400;700&display=swap');
        .meetei-text {
          font-family: 'Noto Sans Meetei Mayek', sans-serif !important;
        }
        .prose {
          font-family: 'Inter', 'Noto Sans Meetei Mayek', sans-serif;
          line-height: 1.7;
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-300 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[120px]"></div>
      </div>

      <nav className="backdrop-blur-md bg-white/70 border-b border-slate-200/50 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-xl shadow-lg shadow-indigo-200 text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              StudyAI <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Manipur</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini 3</p>
          </div>
        </div>
        
        <button 
          onClick={testConnection}
          className={`text-[11px] font-bold px-5 py-2 rounded-xl border transition-all flex items-center gap-2 ${
            testStatus === 'success' ? 'bg-green-50 text-green-600 border-green-200' :
            testStatus === 'error' ? 'bg-red-50 text-red-600 border-red-200' :
            'bg-white text-slate-600 border-slate-200 hover:shadow-md'
          }`}
        >
          <Activity size={14} className={testStatus === 'loading' ? 'animate-pulse' : ''}/>
          {testStatus === 'loading' ? 'Syncing...' : testStatus === 'success' ? 'Systems Online' : 'Check Server'}
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-10 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-black text-slate-800 flex items-center gap-3 text-sm uppercase tracking-wider">
                <Layers size={18} className="text-indigo-600"/> Setup Content
              </h2>
              <button onClick={() => {setBoard(''); setResult(''); setTopic(''); setSubject('');}} className="p-2 hover:bg-red-50 rounded-full text-slate-300 hover:text-red-500 transition-all">
                <Trash2 size={18}/>
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
                {['BOSEM', 'COHSEM'].map(b => (
                  <button 
                    key={b} 
                    onClick={() => {setBoard(b); setStream(''); setSubject('');}} 
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${board === b ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {board === 'COHSEM' && (
                <div className="grid grid-cols-3 gap-2 animate-in zoom-in-95 duration-300">
                  {Object.keys(curriculum.COHSEM.streams).map(s => (
                    <button 
                      key={s} 
                      onClick={() => setStream(s)} 
                      className={`py-2 text-[10px] rounded-lg font-black border transition-all ${stream === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-400 border-slate-100'}`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Subject</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-semibold appearance-none"
                  onChange={(e) => setSubject(e.target.value)}
                  value={subject}
                >
                  <option value="">Select Subject</option>
                  {board === 'BOSEM' ? curriculum.BOSEM.subjects.map(s => <option key={s} value={s}>{s}</option>) : board === 'COHSEM' && stream ? curriculum.COHSEM.streams[stream].map(s => <option key={s} value={s}>{s}</option>) : null}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Chapter / Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Electric Charges"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-semibold"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {materialTypes.map(m => (
                  <button 
                    key={m.value} 
                    onClick={() => setMaterialType(m.value)} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${materialType === m.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={materialType === m.value ? 'text-white' : m.color}>{m.icon}</span>
                      <span className="text-xs font-bold">{m.label}</span>
                    </div>
                    <ChevronRight size={14} className={materialType === m.value ? 'opacity-100' : 'opacity-0'}/>
                  </button>
                ))}
              </div>

              <button 
                onClick={generateContent}
                disabled={loading}
                className="w-full group bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold flex justify-center items-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 mt-4 overflow-hidden"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : (
                  <>
                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform"/>
                    <span>Start Learning</span>
                  </>
                )}
              </button>
              
              {error && <div className="text-red-500 text-[10px] bg-red-50 p-4 rounded-2xl border border-red-100 text-center font-bold">{error}</div>}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
              <Clock size={14}/> Recent Activity
            </h3>
            <div className="space-y-3">
              {history.length > 0 ? history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/50">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate">{h.topic}</p>
                    <p className="text-[10px] text-slate-400">{h.subject}</p>
                  </div>
                  <span className="text-[9px] font-bold text-indigo-400">{h.date}</span>
                </div>
              )) : <p className="text-xs text-slate-400 italic text-center py-4">Ready when you are, Puran.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col min-h-[750px] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
                <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Editor</span>
              </div>
              {result && (
                <div className="flex gap-2">
                  <button onClick={downloadPDF} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all">
                    <Download size={18}/>
                  </button>
                  <button 
                    onClick={() => {navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000)}} 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-10 lg:p-16 flex-1 overflow-y-auto" id="printable-content">
              {result ? (
                <div className="prose prose-slate prose-headings:font-black prose-indigo max-w-none animate-in fade-in duration-700 meettei-text" lang="mni">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <Brain size={100} className="text-slate-100 mb-8 animate-pulse" />
                  <h3 className="text-2xl font-black text-slate-300">Ready to Study?</h3>
                  <p className="text-slate-400 text-sm mt-2">Select a topic to generate your materials, Puran.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center opacity-40">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Education Manipur • 2026 Edition</p>
      </footer>
    </div>
  );
}