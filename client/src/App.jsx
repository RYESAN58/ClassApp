import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  FileText, 
  Upload, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  FolderPlus,
  Code2,
  Calculator,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const CLASSES = ['Algebra 2', 'Computer Science'];

export default function App() {
  const [lessons, setLessons] = useState(() => {
    const saved = localStorage.getItem('classapp_lessons');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Quadratic Formula & Complex Roots',
        course: 'Algebra 2',
        type: 'Slide Deck',
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white; text-align: center; }
                h1 { font-size: 3.5rem; margin-bottom: 0.5rem; color: #38bdf8; }
                .formula { font-size: 2.8rem; color: #facc15; font-family: monospace; margin: 2rem 0; font-weight: bold; }
                p { font-size: 1.5rem; color: #94a3b8; }
                .card { padding: 4rem; background: #1e293b; border-radius: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Algebra 2: Unit 3</h1>
                <div class="formula">x = (-b ± √(b² - 4ac)) / 2a</div>
                <p>Discriminant (b² - 4ac) determines nature of roots.</p>
              </div>
            </body>
          </html>
        `
      },
      {
        id: '2',
        title: 'Intro to Python Functions & Scope',
        course: 'Computer Science',
        type: 'Slide Deck',
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #022c22; color: white; text-align: center; }
                h1 { font-size: 3.5rem; margin-bottom: 0.5rem; color: #34d399; }
                pre { text-align: left; background: #064e3b; padding: 2rem; border-radius: 12px; font-size: 1.5rem; color: #a7f3d0; font-family: monospace; line-height: 1.6; }
                .card { padding: 4rem; background: #065f46; border-radius: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Computer Science</h1>
                <p style="font-size: 1.4rem; color: #d1fae5;">Defining Reusable Logic:</p>
                <pre>def calculate_grade(score):
    if score >= 90:
        return "A"
    return "Keep practicing!"</pre>
              </div>
            </body>
          </html>
        `
      }
    ];
  });

  const [selectedLesson, setSelectedLesson] = useState(lessons[0] || null);
  const [activeCourse, setActiveCourse] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New lesson form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('Algebra 2');
  const [newType, setNewType] = useState('Slide Deck');
  const [rawHtml, setRawHtml] = useState('');

  useEffect(() => {
    localStorage.setItem('classapp_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawHtml(event.target.result);
      if (!newTitle) {
        setNewTitle(file.name.replace('.html', ''));
      }
    };
    reader.readAsText(file);
  };

  const handleCreateLesson = (e) => {
    e.preventDefault();
    if (!newTitle || !rawHtml) return;

    const newLesson = {
      id: Date.now().toString(),
      title: newTitle,
      course: newCourse,
      type: newType,
      htmlContent: rawHtml,
    };

    const updated = [newLesson, ...lessons];
    setLessons(updated);
    setSelectedLesson(newLesson);

    setNewTitle('');
    setRawHtml('');
    setIsAdding(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = lessons.filter((l) => l.id !== id);
    setLessons(updated);
    if (selectedLesson?.id === id) {
      setSelectedLesson(updated[0] || null);
    }
  };

  const toggleFullscreen = () => {
    const previewEl = document.getElementById('smartboard-frame-container');
    if (!previewEl) return;

    if (!document.fullscreenElement) {
      previewEl.requestFullscreen().catch((err) => alert(err.message));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const filteredLessons = activeCourse === 'All' 
    ? lessons 
    : lessons.filter((l) => l.course === activeCourse);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', color: '#1e293b' }}>
      
      {/* Collapsible Sidebar: Library & Organization */}
      <div 
        style={{ 
          width: isSidebarOpen ? '340px' : '0px', 
          minWidth: isSidebarOpen ? '340px' : '0px',
          borderRight: isSidebarOpen ? '1px solid #e2e8f0' : 'none', 
          background: '#ffffff', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'width 0.2s ease, min-width 0.2s ease',
          overflow: 'hidden',
          visibility: isSidebarOpen ? 'visible' : 'hidden'
        }}
      >
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>ClassApp</h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Lesson & Smartboard Hub</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem' }}
          >
            <FolderPlus size={15} /> Add HTML
          </button>
        </div>

        {/* Course Filter Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
          {['All', ...CLASSES].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCourse(c)}
              style={{
                flex: 1,
                padding: '6px 8px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: activeCourse === c ? 600 : 500,
                background: activeCourse === c ? '#ffffff' : 'transparent',
                color: activeCourse === c ? '#2563eb' : '#64748b',
                boxShadow: activeCourse === c ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lesson List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {filteredLessons.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: '2rem' }}>No lessons found for {activeCourse}.</p>
          ) : (
            filteredLessons.map((l) => {
              const isSelected = selectedLesson?.id === l.id;
              const isAlgebra = l.course === 'Algebra 2';
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedLesson(l)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      {isAlgebra ? <Calculator size={13} color="#7c3aed" /> : <Code2 size={13} color="#059669" />}
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isAlgebra ? '#7c3aed' : '#059669' }}>
                        {l.course}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                        {l.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {l.title}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(l.id, e)}
                    title="Delete"
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Presentation View Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', minWidth: 0 }}>
        
        {/* Upload Drawer */}
        {isAdding && (
          <div style={{ background: '#ffffff', borderBottom: '2px solid #2563eb', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Add New Lesson Slide or Worksheet</h3>
            <form onSubmit={handleCreateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Lesson Title (e.g., Factoring Trinomials or For Loops)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ flex: 2, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Slide Deck">Slide Deck</option>
                  <option value="Worksheet">Worksheet</option>
                </select>
              </div>

              {/* Upload file or paste HTML */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f1f5f9', border: '1px dashed #94a3b8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <Upload size={16} /> Choose HTML File
                  <input type="file" accept=".html,.htm" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Or paste your HTML below directly:</span>
              </div>

              <textarea
                placeholder="Paste raw <html> code here..."
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
                rows={4}
                required
                style={{ width: '100%', padding: '8px 12px', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{ padding: '6px 14px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '6px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Top Control Bar */}
        <div style={{ padding: '8px 1.25rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Hide Sidebar (Collapse)" : "Show Sidebar"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#334155',
                fontSize: '0.85rem',
                fontWeight: 500
              }}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              <span>{isSidebarOpen ? 'Hide Menu' : 'Show Lessons'}</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedLesson?.course === 'Algebra 2' ? '#7c3aed' : '#059669', textTransform: 'uppercase' }}>
                  {selectedLesson?.course}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {selectedLesson?.type}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
                {selectedLesson?.title || 'Select a Lesson'}
              </h2>
            </div>
          </div>

          {selectedLesson && (
            <button
              onClick={toggleFullscreen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              {isFullscreen ? 'Exit Fullscreen' : 'Smartboard Fullscreen'}
            </button>
          )}
        </div>

        {/* Smartboard Display Window */}
        <div 
          id="smartboard-frame-container" 
          style={{ flex: 1, background: '#0f172a', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
        >
          {selectedLesson ? (
            <iframe
              title={selectedLesson.title}
              srcDoc={selectedLesson.htmlContent}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#ffffff',
              }}
              sandbox="allow-scripts allow-same-origin allow-modals"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              No lesson selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
