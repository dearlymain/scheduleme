// ─── Constants & State ────────────────────────────────────────────────────────
const supabaseUrl = 'https://aipglsdqerxuphdtrhgj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcGdsc2RxZXJ4dXBoZHRyaGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTIyMTgsImV4cCI6MjA5MjUyODIxOH0.SJk-4R_7fxjApYABtrSQvNK8p6UDBU0y0TU2yju4GtY';
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

const COLORS = {
    teal: "#2a7d75", green: "#349c58", orange: "#e67146", purple: "#534664",
    caramel: "#c78539", wine: "#7a2849", moss: "#7e9432", darkTeal: "#24505f",
    brick: "#b74132", olive: "#56642e", amber: "#ebb85b", rose: "#e67a84",
};
const CHAPTER_COLORS = Object.values(COLORS);

let state = {
    dark: false,
    activeTab: "upload",
    sidebarOpen: true,
    files: [],
    analyzing: false,
    analysisProgress: 0,
    chapters: [],
    schedule: [],
    generating: false,
    error: null,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    exams: [],
    dailyHours: 2,
    preferredDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startDate: new Date().toISOString().split("T")[0],
    user: null,
    authView: 'login',
    authError: null,
    authLoading: false
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
    Upload: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>',
    Files: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    Calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    Settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    Menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    X: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    Brain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>',
    Refresh: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>'
};

// ─── Helpers ─────────────────────────────────────────────────────────────
function formatTime(hours) {
    if (hours < 0.0167) return `${Math.round(hours * 3600)}s`; // < 1 min → seconds
    if (hours < 1) return `${Math.round(hours * 60)}m`;         // < 1 hour → minutes
    if (hours % 1 === 0) return `${hours}h`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Core Logic ─────────────────────────────────────────────────────────────
function generateSchedule() {
    const { chapters, deadline, dailyHours, preferredDays, startDate, exams } = state;
    const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Ensure we start from today at the earliest if startDate is in the past
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(startDate) < today ? today : new Date(startDate);
    const end = new Date(deadline);

    const schedule = [];
    const cursor = new Date(start);
    while (cursor <= end) {
        const dateStr = cursor.toISOString().split('T')[0];
        if (preferredDays.includes(allDays[cursor.getDay()])) {
            const dayExams = exams.filter(e => e.date === dateStr);
            schedule.push({ date: new Date(cursor), sessions: [], exams: dayExams, totalHours: 0 });
        }
        cursor.setDate(cursor.getDate() + 1);
    }
    if (!schedule.length) return [];

    const PRIO = { high: 3, medium: 2, low: 1 };
    const activeChapters = chapters.filter(c => !c.skip);
    const totalWeight = activeChapters.reduce((s, c) => s + (PRIO[c.priority || "medium"] * (c.pages || 10)), 0);
    if (totalWeight === 0) return []; // Nothing to schedule

    const totalAvailableHours = schedule.length * dailyHours;

    const sessions = activeChapters.map(c => ({
        ...c,
        allocatedHours: c.customHours || Math.max(0.5, ((PRIO[c.priority || "medium"] * (c.pages || 10)) / totalWeight) * totalAvailableHours)
    })).sort((a, b) => PRIO[b.priority] - PRIO[a.priority] || a.index - b.index);

    let dayIdx = 0;
    for (const ch of sessions) {
        let remaining = ch.allocatedHours;
        while (remaining > 0.001 && dayIdx < schedule.length) {
            const day = schedule[dayIdx];
            const available = dailyHours - day.totalHours;
            if (available <= 0.001) { dayIdx++; continue; }
            const slot = Math.min(available, remaining, 2.5);
            day.sessions.push({
                chapter: ch.title,
                fileName: ch.fileName,
                hours: +slot.toFixed(3),
                priority: ch.priority,
                color: ch.color,
                completed: false
            });
            day.totalHours = +(day.totalHours + slot).toFixed(3);
            remaining -= slot;
            if (day.totalHours >= dailyHours - 0.001) dayIdx++;
        }
    }
    return schedule.filter(d => d.sessions.length > 0);
}

async function analyzeFileWithAI(file) {
    const apiKey = window.GEMINI_API_KEY || window.ANTHROPIC_API_KEY;
    if (!apiKey) return generateMockAnalysis(file);

    const ext = file.name.split(".").pop().toLowerCase();
    const isText = ["txt", "md", "csv", "json"].includes(ext);
    const mimeType = isText ? "text/plain" : (ext === 'pdf' ? "application/pdf" : "image/jpeg");

    const fileData = await new Promise(res => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result.split(",")[1]);
        reader.readAsDataURL(file);
    });

    const isGemini = !!window.GEMINI_API_KEY;
    const endpoint = isGemini
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`
        : "https://api.anthropic.com/v1/messages";

    const prompt = `You are a document structure analyzer. Analyze the uploaded file and extract ALL meaningful content entries.

INSTRUCTIONS:
1. Scan the FULL document — cover to cover — and count total pages accurately.
   - For PDFs: count ACTUAL pages in the PDF.
   - For images: 1 image = 1 page.
   - For text/md: ~500 words = 1 page.

2. Identify EVERY distinct content unit using the most accurate type:
   chapter, lesson, unit, section, story, poem, essay, model, lecture, exercise, lab, case_study, reading, topic

3. For each entry extract:
   - "title": EXACT title/heading AS IT APPEARS (include numbering, e.g. "Chapter 3: Thermodynamics")
   - "type": one of the types above
   - "pageStart": starting page (number, 1-indexed, use decimals for positions within a page, e.g. 3.5)
   - "pageEnd": ending page (number, inclusive, e.g. 3.8 for a short entry on page 3)
   - "pages": pageEnd - pageStart + 1 (can be <1 for short entries)
   - "priority": "high" | "medium" | "low"
   - "hasTable": true if entry contains data tables
   - "hasChart": true if entry contains charts/graphs/diagrams

4. CRITICAL — PAGE INTEGRITY RULES:
   - The sum of ALL "pages" values MUST EXACTLY equal "estimatedPages".
   - Page ranges must be CONTIGUOUS: the next entry's pageStart must equal the previous entry's pageEnd + 0 (or a tiny fraction for same-page entries).
   - Use consistent precision: decimals like 0.3 for poems on part of a page, integers for full-page entries.
   - Example: pages 1-10 (10p), 10.0-10.3 (0.3p poem), 10.3-25 (14.7p) → total = 25p.

5. Also return:
   - "title": overall document title
   - "estimatedPages": total page count (MUST match sum of all entry pages)
   - "difficulty": "beginner" | "intermediate" | "advanced"

Return ONLY valid JSON (no markdown fences):
{
  "title": "Document Title",
  "estimatedPages": 25.0,
  "difficulty": "intermediate",
  "chapters": [
    { "title": "Chapter 1: Introduction", "type": "chapter", "pageStart": 1.0, "pageEnd": 10.0, "pages": 10.0, "priority": "high", "hasTable": false, "hasChart": false },
    { "title": "Poem: The Road Not Taken", "type": "poem", "pageStart": 10.0, "pageEnd": 10.3, "pages": 0.3, "priority": "medium", "hasTable": false, "hasChart": false },
    { "title": "Chapter 2: Main Content", "type": "chapter", "pageStart": 10.3, "pageEnd": 25.0, "pages": 14.7, "priority": "high", "hasTable": true, "hasChart": true }
  ]
}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: isGemini ? JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: fileData } }]
                }]
            }) : JSON.stringify({
                model: "claude-3-5-sonnet-20240620", max_tokens: 4000, system: prompt,
                messages: [{ role: "user", content: isText ? fileData : [{ type: "document", source: { type: "base64", media_type: ext === 'pdf' ? "application/pdf" : "image/jpeg", data: fileData } }] }]
            })
        });
        const resData = await response.json();
        const rawText = isGemini ? resData.candidates[0].content.parts[0].text : resData.content[0].text;
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        // Normalize: ensure every entry has all required fields + valid page numbers
        if (parsed.chapters && Array.isArray(parsed.chapters)) {
            let runningPage = 1.0;
            let totalPages = 0;
            parsed.chapters = parsed.chapters.map((ch, i) => {
                const pageStart = Number.isFinite(ch.pageStart) ? Number(ch.pageStart) : runningPage;
                const rawPages = Number(ch.pages) || 1;
                const pages = Math.max(0.1, rawPages);
                const pageEnd = Number.isFinite(ch.pageEnd) ? Number(ch.pageEnd) : Math.round((pageStart + pages - 0.001) * 100) / 100;
                totalPages += pages;
                runningPage = Math.round((pageEnd + 0.001) * 100) / 100;
                return {
                    title: ch.title || `Entry ${i + 1}`,
                    type: ch.type || "section",
                    pageStart: Math.round(pageStart * 100) / 100,
                    pageEnd: Math.round(pageEnd * 100) / 100,
                    pages: Math.round(pages * 100) / 100,
                    priority: ["high", "medium", "low"].includes(ch.priority) ? ch.priority : "medium",
                    hasTable: !!ch.hasTable,
                    hasChart: !!ch.hasChart
                };
            });
            // Force estimatedPages to match actual sum
            parsed.estimatedPages = Math.round(totalPages * 100) / 100;
        }
        return parsed;
    } catch (e) {
        console.error("Analysis Failed:", e);
        return generateMockAnalysis(file);
    }
}

function generateMockAnalysis(file) {
    const estPages = Math.max(5, Math.round(file.size / 3000));
    const count = Math.min(20, Math.max(5, Math.floor(estPages / 12)));
    const types = ["chapter", "lesson", "section", "unit", "story", "poem", "essay", "model", "lecture", "topic"];
    const priorities = ["high", "medium", "low"];
    const basePages = Math.max(1, Math.floor(estPages / count));
    const remainder = estPages - basePages * count;

    let runningPage = 1;
    const chapters = [];
    for (let j = 0; j < count; j++) {
        const extra = j < remainder ? 1 : 0;
        let pages = basePages + extra;
        // Short content types get decimal pages
        const t = types[j % types.length];
        if (["poem", "story", "exercise", "reading"].includes(t) && pages > 2) {
            pages = Math.round((0.3 + Math.random() * 1.5) * 10) / 10; // 0.3 to 1.8 pages
        }
        const pageStart = runningPage;
        const pageEnd = Math.round((runningPage + pages - 0.001) * 100) / 100;
        runningPage = Math.round((pageEnd + 0.001) * 100) / 100;
        chapters.push({
            title: `${t.charAt(0).toUpperCase() + t.slice(1)} ${j + 1}`,
            type: t,
            pageStart: Math.round(pageStart * 100) / 100,
            pageEnd: Math.round(pageEnd * 100) / 100,
            pages: Math.round(pages * 100) / 100,
            priority: priorities[j % 3],
            hasTable: j % 4 === 0,
            hasChart: j % 5 === 0
        });
    }
    return {
        title: file.name.split('.')[0],
        estimatedPages: estPages,
        chapters
    };
}

async function saveFileToSupabase(fileEntry) {
    if (!state.user) return;
    const { data: fileData, error: fileError } = await supabaseClient
        .from('files')
        .insert([{
            user_id: state.user.id,
            name: fileEntry.name,
            size: fileEntry.size,
            analysis: fileEntry.analysis
        }])
        .select();

    if (fileError) console.error("Error saving file:", fileError);
    return fileData?.[0]?.id;
}

async function saveChaptersToSupabase(chapters, fileId) {
    if (!state.user) return;
    const rows = chapters.map(ch => ({
        user_id: state.user.id,
        file_id: fileId,
        index: ch.index,
        title: ch.title,
        pages: ch.pages,
        page_start: ch.pageStart || null,
        page_end: ch.pageEnd || null,
        type: ch.type || 'section',
        priority: ch.priority,
        color: ch.color,
        skip: ch.skip,
        custom_hours: ch.customHours,
        has_table: ch.hasTable || false,
        has_chart: ch.hasChart || false
    }));

    const { error } = await supabaseClient.from('chapters').insert(rows);
    if (error) console.error("Error saving chapters:", error);
}

async function saveScheduleToSupabase(schedule) {
    if (!state.user) return;
    // Clear old schedule first for simplicity in this implementation
    await supabaseClient.from('sessions').delete().eq('user_id', state.user.id);

    const rows = [];
    schedule.forEach(day => {
        day.sessions.forEach(sess => {
            rows.push({
                user_id: state.user.id,
                date: day.date.toISOString().split('T')[0],
                chapter_title: sess.chapter,
                file_name: sess.fileName,
                hours: sess.hours,
                priority: sess.priority,
                color: sess.color,
                completed: sess.completed
            });
        });
    });

    const { error } = await supabaseClient.from('sessions').insert(rows);
    if (error) console.error("Error saving schedule:", error);
}

async function saveProfileToSupabase() {
    if (!state.user) return;
    const { error } = await supabaseClient.from('profiles').upsert({
        id: state.user.id,
        deadline: state.deadline,
        daily_hours: state.dailyHours,
        preferred_days: state.preferredDays
    });
    if (error) console.error("Error saving profile:", error);
}

async function saveExamsToSupabase() {
    if (!state.user) return;
    // Clear old exams first for simplicity
    await supabaseClient.from('exams').delete().eq('user_id', state.user.id);
    
    const rows = state.exams.map(exam => ({
        user_id: state.user.id,
        title: exam.title,
        date: exam.date
    }));
    
    const { error } = await supabaseClient.from('exams').insert(rows);
    if (error) console.error("Error saving exams:", error);
}

async function loadExamsFromSupabase() {
    if (!state.user) return;
    const { data: dbExams } = await supabaseClient.from('exams').select('*');
    if (dbExams) {
        updateState({ exams: dbExams.map(exam => ({
            id: exam.id,
            title: exam.title,
            date: exam.date
        })) });
    }
}

async function processFiles(fileList) {
    updateState({ analyzing: true, analysisProgress: 0 });
    const results = [];
    for (let i = 0; i < fileList.length; i++) {
        try {
            const analysis = await analyzeFileWithAI(fileList[i]);
            results.push({ id: Date.now() + i, name: fileList[i].name, size: fileList[i].size, analysis });
        } catch (err) { console.error(err); }
        updateState({ analysisProgress: Math.round(((i + 1) / fileList.length) * 100) });
    }

    for (const res of results) {
        const fileId = state.user ? await saveFileToSupabase(res) : null;
        
        let currentGlobalIndex = state.chapters.length;
        const fileChapters = (res.analysis.chapters || []).map(ch => {
            const newCh = { 
                ...ch, 
                index: currentGlobalIndex, 
                fileId, 
                fileName: res.name, 
                color: CHAPTER_COLORS[currentGlobalIndex % CHAPTER_COLORS.length], 
                skip: false, 
                customHours: null,
                type: ch.type || 'section',
                hasTable: !!ch.hasTable,
                hasChart: !!ch.hasChart
            };
            currentGlobalIndex++;
            return newCh;
        });

        updateState({ files: [...state.files, res], chapters: [...state.chapters, ...fileChapters] });

        if (state.user && fileId) {
            await saveChaptersToSupabase(fileChapters, fileId);
        }
    }
    updateState({ analyzing: false, activeTab: "chapters" });
}

// ─── UI Rendering ───────────────────────────────────────────────────────────
function updateState(newState) {
    state = { ...state, ...newState };
    render();
}

function render() {
    const app = document.getElementById("app");
    if (!app) {
        console.warn("Target element #app not found. Waiting for DOM...");
        return;
    }

    document.body.className = state.dark ? "dark-mode" : "";

    app.innerHTML = `
        <div class="top-bar">
            <div style="display: flex; align-items: center; gap: 12px">
                <button onclick="updateState({sidebarOpen: !state.sidebarOpen})" style="background:none; border:none; cursor:pointer; color:var(--text-muted)">${Icons.Menu}</button>
                <div class="brand"><div class="brand-dot"></div>ScheduleMe</div>
            </div>
            <button onclick="updateState({dark: !state.dark})" class="nav-item" style="width:auto; margin:0">
                ${state.dark ? "Light Mode" : "Dark Mode"}
            </button>
            <div style="display:flex; align-items:center; gap:12px; margin-left:auto; padding-right:12px">
                ${state.user ? `<span style="font-size:12px; color:var(--text-muted)">${state.user.email}</span>` : ''}
                ${state.user ? `<button onclick="handleLogout()" class="nav-item" style="width:auto; margin:0; font-size:12px">Logout</button>` : `<button onclick="updateState({activeTab: 'account'})" class="nav-item" style="width:auto; margin:0; font-size:12px">Sign In</button>`}
            </div>
        </div>
        <div class="main-body">
            <div class="sidebar ${state.sidebarOpen ? '' : 'closed'}">
                <div class="sidebar-inner">
                    <div class="sidebar-section-label">Workspace</div>
                    ${renderNavItem("upload", "Upload", Icons.Upload)}
                    ${renderNavItem("chapters", "Sections", Icons.Brain, state.chapters.length)}
                    ${renderNavItem("schedule", "Schedule", Icons.Calendar, state.schedule.length ? state.schedule.length + 'd' : null)}
                    ${renderNavItem("settings", "Settings", Icons.Settings)}
                    ${renderNavItem("account", "Account", '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>')}
                    
                    ${state.files.length > 0 ? `
                        <div class="sidebar-section-label">Files</div>
                        ${state.files.map(f => `
                            <div class="nav-item" style="cursor: default; font-size: 12px;">
                                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${f.name}</span>
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            </div>
            <div class="content-area">
                <div class="header">
                    <h1>${getHeaderTitle().title}</h1>
                    <p>${getHeaderTitle().subtitle}</p>
                    <div class="tabs">
                        ${renderTabBtn("upload", "Upload")}
                        ${renderTabBtn("chapters", "Sections")}
                        ${renderTabBtn("schedule", "Schedule")}
                        ${renderTabBtn("settings", "Settings")}
                    </div>
                </div>
                <div class="main-content">
                    ${renderActiveTab()}
                </div>
            </div>
        </div>
    `;
}

function renderAuth() {
    if (state.user) {
        return `
            <div style="text-align:center; padding:40px;">
                <h3>You are signed in as</h3>
                <p style="color:var(--text-muted); margin-bottom:20px;">${state.user.email}</p>
                <button onclick="handleLogout()" class="btn-primary" style="max-width:200px; margin:0 auto;">Sign Out</button>
            </div>
        `;
    }
    const isLogin = state.authView === 'login';
    return `
        <div class="auth-container" style="margin: 0 auto; max-width: 400px; padding: 20px;">
            <h2 style="margin-bottom: 8px;">${isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">
                ${isLogin ? 'Enter your details to sign in' : 'Start organizing your studies today'}
            </p>
            ${state.authError ? `<div style="color: var(--danger); font-size: 13px; margin-bottom: 16px;">${state.authError}</div>` : ''}
            <form class="auth-form" onsubmit="event.preventDefault(); ${isLogin ? 'handleLogin()' : 'handleSignUp()'}">
                <input type="email" id="auth-email" class="auth-input" placeholder="Email address" required>
                <input type="password" id="auth-password" class="auth-input" placeholder="Password" required>
                ${!isLogin ? '<input type="password" id="auth-password-confirm" class="auth-input" placeholder="Confirm Password" required>' : ''}
                <button type="submit" class="btn-primary" style="margin-top: 8px;" ${state.authLoading ? 'disabled' : ''}>
                    ${state.authLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
            </form>
            <div style="margin-top: 24px; text-align: center; font-size: 14px;">
                <span style="color: var(--text-muted);">${isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button onclick="updateState({authView: '${isLogin ? 'signup' : 'login'}', authError: null})" 
                        style="background: none; border: none; color: var(--accent); font-weight: 500; cursor: pointer; margin-left: 4px;">
                    ${isLogin ? 'Sign up' : 'Sign in'}
                </button>
            </div>
        </div>
    `;
}

function renderNavItem(id, label, icon, badge) {
    return `
        <button onclick="updateState({activeTab: '${id}'})" class="nav-item ${state.activeTab === id ? 'active' : ''}">
            ${icon} <span>${label}</span>
            ${badge ? `<span class="badge-pill">${badge}</span>` : ''}
        </button>
    `;
}
function renderTabBtn(id, label) {
    return `<button onclick="updateState({activeTab: '${id}'})" class="tab-btn ${state.activeTab === id ? 'active' : ''}">${label}</button>`;
}

function getHeaderTitle() {
    const config = {
        upload: { title: "Upload Files", subtitle: "Upload PDFs, images, or documents — AI will analyze them." },
        chapters: { title: "Content Overview", subtitle: "Review and customize sections, stories, or poems." },
        schedule: { title: "Study Schedule", subtitle: "Your personalized daily study plan." },
        settings: { title: "Settings", subtitle: "Configure your study preferences." },
        account: { title: "Account", subtitle: state.user ? "Manage your profile." : "Sign up to sync your data across devices." }
    };
    return config[state.activeTab] || config.upload;
}

function renderActiveTab() {
    if (state.activeTab === "upload") return renderUpload();
    if (state.activeTab === "chapters") return renderChapters();
    if (state.activeTab === "schedule") return renderSchedule();
    if (state.activeTab === "settings") return renderSettings();
    if (state.activeTab === "account") return renderAuth();
    return '';
}

function renderUpload() {
    return `
        <div class="upload-container">
            <div class="upload-box" id="drop-zone" onclick="document.getElementById('file-input').click()">
                <div style="color:var(--text-faint); margin-bottom:16px">${Icons.Upload}</div>
                <div style="font-weight:500; margin-bottom:6px">Click or drag files here</div>
                <div style="font-size:13px; color:var(--text-muted)">PDF, JPG, PNG, DOCX</div>
                <input type="file" id="file-input" multiple style="display:none" onchange="processFiles(this.files)">
            </div>
            ${state.analyzing ? `
                <div style="margin-top:20px; padding:16px; background:var(--bg-surface); border:1px solid var(--border); border-radius:10px">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px">
                        <span>Analyzing with AI...</span>
                        <span>${state.analysisProgress}%</span>
                    </div>
                    <div style="height:4px; background:var(--bg-muted); border-radius:4px; overflow:hidden">
                        <div style="width:${state.analysisProgress}%; height:100%; background:var(--accent); transition:width 0.3s"></div>
                    </div>
                </div>
            ` : ''}
            ${state.files.length > 0 ? `
                <div style="margin-top:24px">
                    <div style="font-size:11px; font-weight:600; color:var(--text-faint); margin-bottom:12px; text-transform:uppercase">Analyzed Files</div>
                    ${state.files.map(f => `
                        <div style="display:flex; align-items:center; gap:12px; padding:12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; margin-bottom:8px">
                            <div style="color:var(--accent)">${Icons.Files}</div>
                            <div style="flex:1">
                                <div style="font-weight:500; font-size:14px">${f.name}</div>
                                <div style="font-size:12px; color:var(--text-muted)">${f.analysis.estimatedPages} pages · ${f.analysis.chapters.length} entries · ${f.analysis.difficulty || "intermediate"}</div>
                            </div>
                            <button onclick="removeFile(${f.id})" style="background:none; border:none; color:var(--text-faint); cursor:pointer">${Icons.X}</button>
                        </div>
                    `).join('')}
                    <button onclick="updateState({activeTab: 'chapters'})" class="btn-primary" style="margin-top:12px">Review ${state.chapters.length} Chapters →</button>
                </div>
            ` : ''}
        </div>
    `;
}

const TYPE_LABELS = {
    chapter: "Chapter", lesson: "Lesson", unit: "Unit", section: "Section",
    story: "Story", poem: "Poem", essay: "Essay", model: "Model",
    lecture: "Lecture", exercise: "Exercise", lab: "Lab",
    case_study: "Case Study", reading: "Reading", topic: "Topic"
};

function renderChapters() {
    if (!state.chapters.length) return `<div style="text-align:center; padding:40px; color:var(--text-muted)">No chapters found. Upload a file first.</div>`;
    
    const priorityColor = (p) => {
        if (p === 'high') return 'var(--danger)';
        if (p === 'low') return 'var(--text-faint)';
        return 'var(--accent-warm)';
    };

    const typeLabel = (t) => TYPE_LABELS[t] || t;

    return `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px">
            <div class="stat-card">
                <div style="font-size:11px; color:var(--text-faint)">TOTAL ENTRIES</div>
                <div style="font-size:20px; font-weight:600">${state.chapters.length}</div>
            </div>
            <div class="stat-card">
                <div style="font-size:11px; color:var(--text-faint)">DAILY STUDY TIME</div>
                <div style="font-size:20px; font-weight:600">${formatTime(state.dailyHours)}/day</div>
            </div>
            <div class="stat-card">
                <div style="font-size:11px; color:var(--text-faint)">TOTAL PAGES</div>
                <div style="font-size:20px; font-weight:600">${state.chapters.reduce((s,c)=>s+c.pages,0)}</div>
            </div>
        </div>
        ${state.chapters.map(ch => `
            <div class="chapter-card ${ch.skip ? 'skipped' : ''}" style="border-left:4px solid ${ch.color}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%">
                    <div style="flex:1">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px">
                            <div style="font-weight:500; font-size:14px;">${ch.title}</div>
                            <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:var(--bg-muted); color:var(--text-muted); text-transform:uppercase; font-weight:600; letter-spacing:0.02em">${typeLabel(ch.type)}</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted)">p.${ch.pageStart}–${ch.pageEnd} (${ch.pages}p) · ${ch.fileName}</div>
                        
                        <div style="display:flex; gap:8px; margin-top:10px; align-items:center; flex-wrap:wrap">
                            <div style="display:flex; gap:4px">
                                ${ch.hasTable ? '<span style="font-size:10px; color:var(--accent); font-weight:600">Table</span>' : ''}
                                ${ch.hasChart ? '<span style="font-size:10px; color:var(--accent-warm); font-weight:600">Chart</span>' : ''}
                            </div>
                            <div style="display:flex; gap:4px">
                                ${['low', 'medium', 'high'].map(p => `
                                    <button 
                                        onclick="updateChapter(${ch.index}, {priority: '${p}'})"
                                        style="padding:3px 8px; border-radius:4px; font-size:11px; cursor:pointer; 
                                        border:1px solid ${ch.priority === p ? priorityColor(p) : 'var(--border)'};
                                        background:${ch.priority === p ? priorityColor(p) : 'transparent'};
                                        color:${ch.priority === p ? 'white' : 'var(--text-faint)'}"
                                    >${p}</button>
                                `).join('')}
                            </div>
                            <div style="margin-left:auto; display:flex; align-items:center; gap:8px">
                                <input type="number" step="0.5" min="0" placeholder="h" 
                                    value="${ch.customHours || ''}" 
                                    onchange="updateChapter(${ch.index}, {customHours: Math.max(0, parseFloat(this.value)) || null})"
                                    style="width:45px; padding:2px 4px; font-size:11px; border:1px solid var(--border); border-radius:4px"
                                >
                                <button onclick="updateChapter(${ch.index}, {skip: !${ch.skip}})" 
                                    style="background:none; border:1px solid var(--border); padding:2px 6px; border-radius:4px; font-size:11px; cursor:pointer; color:var(--text-muted)">
                                    ${ch.skip ? 'Undo' : 'Skip'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
        <button onclick="generateScheduleAction()" class="btn-primary" style="margin-top:20px">
            ${state.generating ? 'Generating...' : 'Generate My Schedule'}
        </button>
    `;
}

function renderSchedule() {
    if (!state.schedule.length) return `<div style="text-align:center; padding:40px; color:var(--text-muted)">No schedule generated yet.</div>`;

    let totalSessions = 0;
    let completedSessions = 0;
    state.schedule.forEach(day => {
        day.sessions.forEach(sess => {
            totalSessions++;
            if (sess.completed) {
                completedSessions++;
            }
        });
    });
    const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return `
        <div style="margin-bottom: 20px; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 10px;">
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">Progress: ${progressPercentage}% Complete</div>
            <div style="height: 8px; background: var(--bg-muted); border-radius: 4px; overflow: hidden;">
                <div style="width: ${progressPercentage}%; height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.3s ease-in-out;"></div>
            </div>
        </div>
        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-bottom: 20px;">
            <button onclick="generateScheduleAction()" class="nav-item" style="width: auto; margin: 0; background: var(--bg-surface); border: 1px solid var(--border);">
                ${Icons.Refresh} Regenerate
            </button>
            <button onclick="downloadPDF()" class="nav-item" style="width: auto; margin: 0; background: var(--accent); color: white; border: none;">
                ${Icons.Download} Download PDF
            </button>
        </div>
        <div style="display:flex; flex-direction:column; gap:0">
            ${state.schedule.map((day, i) => ` 
                <div class="schedule-day-row">
                    <div class="schedule-date-col">
                        <div style="font-weight:600">${day.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div>${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div class="schedule-line-col">
                        <div class="dot"></div>
                        ${i < state.schedule.length - 1 ? '<div class="line"></div>' : ''}
                    </div>
                    <div style="flex:1; padding-bottom: 20px;">
                        <div style="display:flex; flex-wrap:wrap; gap:8px">
                            ${day.exams && day.exams.length > 0 ? day.exams.map(e => `
                                <div class="schedule-session-card" style="border: 2px solid var(--danger); background: var(--bg-muted);">
                                    <div class="exam-badge">Exam / Deadline</div>
                                    <div style="font-weight: 700; color: var(--danger);">${e.title}</div>
                                </div>
                            `).join('') : ''}
                            ${day.sessions.map((sess, j) => `
                                <div class="schedule-session-card" style="border-left:3px solid ${sess.color}">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <input type="checkbox" id="session-${i}-${j}" onchange="toggleSessionCompletion(${i}, ${j})" ${sess.completed ? 'checked' : ''}
                                        style="width:16px; height:16px; cursor:pointer; accent-color:var(--accent);" />
                                    <div style="display: flex; flex-direction: column;">
                                        <label for="session-${i}-${j}" style="font-size:14px; font-weight:500; cursor: pointer; ${sess.completed ? 'text-decoration:line-through; color:var(--text-faint);' : ''}">${sess.chapter}</label>
                                        <span style="font-size: 10px; color: var(--text-faint); margin-top: -2px;">${sess.fileName}</span>
                                    </div>
                                </div>
                                <div style="font-size:12px; color:var(--text-muted)">${formatTime(sess.hours)} • ${sess.priority}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
function renderSettings() {
    return `
        <div style="max-width:400px; display:flex; flex-direction:column; gap:24px">
            <div>
                <label style="display:block; margin-bottom:8px; font-weight:500">Deadline</label>
                <input type="date" value="${state.deadline}" onchange="updateState({deadline: this.value})" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border)">
            </div>
            <div>
                <label style="display:block; margin-bottom:8px; font-weight:500">Daily Study Time (${formatTime(state.dailyHours)})</label>
                <input type="range" min="0.25" max="8" step="0.25" value="${state.dailyHours}" oninput="updateState({dailyHours: parseFloat(this.value)})" style="width:100%">
                <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-faint); margin-top:4px">
                    <span>15m</span><span>1h</span><span>2h</span><span>4h</span><span>6h</span><span>8h</span>
                </div>
            </div>
            <div>
                <label style="display:block; margin-bottom:8px; font-weight:500">Preferred Days</label>
                <div style="display:flex; flex-wrap:wrap; gap:8px">
                    ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => `
                        <button onclick="toggleDay('${d}')" style="padding:6px 12px; border-radius:20px; border:1px solid ${state.preferredDays.includes(d) ? 'var(--accent)' : 'var(--border)'}; background:${state.preferredDays.includes(d) ? 'var(--accent)' : 'transparent'}; color:${state.preferredDays.includes(d) ? 'white' : 'inherit'}; cursor:pointer">
                            ${d}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div style="border-top: 1px solid var(--border); pt: 20px; mt: 10px;">
                <label style="display:block; margin-bottom:12px; font-weight:600; text-transform:uppercase; font-size:11px; color:var(--text-faint)">Upcoming Exams & Milestones</label>
                <div style="display:flex; gap:8px; margin-bottom:16px">
                    <input type="text" id="exam-title" placeholder="Exam Name (e.g. Midterm)" style="flex:1; padding:8px; border-radius:6px; border:1px solid var(--border); font-size:13px">
                    <input type="date" id="exam-date" style="padding:8px; border-radius:6px; border:1px solid var(--border); font-size:13px">
                    <button onclick="addExam()" style="padding:0 16px; background:var(--accent); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600">+</button>
                </div>
                ${state.exams.length > 0 ? `
                    <div style="display:flex; flex-direction:column; gap:8px">
                        ${state.exams.map(e => `
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px">
                                <div>
                                    <div style="font-weight:500; font-size:13px">${e.title}</div>
                                    <div style="font-size:11px; color:var(--text-faint)">${new Date(e.date).toLocaleDateString()}</div>
                                </div>
                                <button onclick="removeExam(${e.id})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:18px">×</button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<div style="font-size:12px; color:var(--text-faint); text-align:center; padding:10px">No milestones added yet.</div>'}
            </div>
            <button onclick="generateScheduleAction()" class="btn-primary" style="margin-top:10px">
                ${state.generating ? 'Regenerating...' : 'Apply & Regenerate Schedule'}
            </button>
        </div>
    `;
}

// ─── Actions ────────────────────────────────────────────────────────────────
function removeFile(id) {
    const files = state.files.filter(f => f.id !== id);
    const chapters = state.chapters.filter(ch => ch.fileId !== id);
    updateState({ files, chapters, schedule: [] });
}

function updateChapter(idx, updates) {
    const chapters = state.chapters.map(ch => ch.index === idx ? { ...ch, ...updates } : ch);
    updateState({ chapters });
}

function toggleDay(day) {
    const preferredDays = state.preferredDays.includes(day)
        ? state.preferredDays.filter(d => d !== day)
        : [...state.preferredDays, day];
    updateState({ preferredDays });
}

async function generateScheduleAction() {
    updateState({ generating: true });
    await new Promise(r => setTimeout(r, 600));
    const schedule = generateSchedule();
    if (schedule.length === 0 && state.chapters.length > 0) {
        alert("Could not generate schedule. Please check your deadline and preferred study days.");
        updateState({ generating: false });
    } else {
        updateState({ schedule, generating: false, activeTab: "schedule" });
        saveScheduleToSupabase(schedule);
        saveExamsToSupabase();
        saveProfileToSupabase();
    }
}

function addExam() {
    const title = document.getElementById('exam-title').value;
    const date = document.getElementById('exam-date').value;
    if (!title || !date) return;
    updateState({ exams: [...state.exams, { id: Date.now(), title, date }] });
}

function removeExam(id) {
    const exams = state.exams.filter(e => e.id !== id);
    updateState({ exams });
}

function toggleSessionCompletion(dayIndex, sessionIndex) {
    const newSchedule = [...state.schedule];
    const session = newSchedule[dayIndex].sessions[sessionIndex];
    session.completed = !session.completed;
    
    updateState({ schedule: newSchedule });

    // Sync completion to Supabase
    if (state.user) {
        supabaseClient.from('sessions')
        .update({ completed: session.completed })
        .match({ 
            user_id: state.user.id, 
            date: newSchedule[dayIndex].date.toISOString().split('T')[0],
            chapter_title: session.chapter 
        })
        .then(({error}) => error && console.error("Sync error:", error));
    }
}

async function handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    updateState({ authLoading: true, authError: null });
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) updateState({ authError: error.message, authLoading: false });
    else updateState({ authLoading: false });
}

async function handleSignUp() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const confirmPassword = document.getElementById('auth-password-confirm').value;

    if (password !== confirmPassword) {
        updateState({ authError: "Passwords do not match." });
        return;
    }

    updateState({ authLoading: true, authError: null });
    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) updateState({ authError: error.message, authLoading: false });
    else updateState({ authError: "Check your email for the confirmation link!", authLoading: false });
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
}

async function loadUserData() {
    if (!state.user) return;

    // Load Profile
    const { data: profile } = await supabaseClient.from('profiles').select('*').single();
    if (profile) {
        updateState({
            deadline: profile.deadline,
            dailyHours: profile.daily_hours,
            preferredDays: profile.preferred_days
        });
    }

    // Load Files
    const { data: dbFiles } = await supabaseClient.from('files').select('*');
    if (dbFiles) {
        const fileMap = {};
        dbFiles.forEach(f => { fileMap[f.id] = f.name; });
        updateState({ files: dbFiles.map(f => ({ id: f.id, name: f.name, size: f.size, analysis: f.analysis })) });

        // Update chapter fileNames after files are loaded
        if (state.chapters.length) {
            updateState({
                chapters: state.chapters.map(ch => ({
                    ...ch,
                    fileName: ch.fileId ? (fileMap[ch.fileId] || '') : ''
                }))
            });
        }
    }

    // Load Chapters
    const { data: dbChapters } = await supabaseClient.from('chapters').select('*').order('index', { ascending: true });
    if (dbChapters) {
        updateState({
            chapters: dbChapters.map(ch => ({
                index: ch.index,
                title: ch.title,
                pages: ch.pages,
                pageStart: ch.page_start || null,
                pageEnd: ch.page_end || null,
                type: ch.type || 'section',
                priority: ch.priority,
                fileId: ch.file_id,
                fileName: '', // will be filled from files below
                color: ch.color,
                skip: ch.skip,
                customHours: ch.custom_hours,
                hasTable: ch.has_table || false,
                hasChart: ch.has_chart || false
            }))
        });
    }

    // Load Schedule
    const { data: dbSessions } = await supabaseClient.from('sessions').select('*').order('date', { ascending: true });
    if (dbSessions && dbSessions.length > 0) {
        const grouped = {};
        dbSessions.forEach(s => {
            if (!grouped[s.date]) grouped[s.date] = { date: new Date(s.date), sessions: [], totalHours: 0 };
            grouped[s.date].sessions.push({
                chapter: s.chapter_title,
                fileName: s.file_name,
                hours: s.hours,
                priority: s.priority,
                color: s.color,
                completed: s.completed
            });
            grouped[s.date].totalHours += s.hours;
        });
        updateState({ schedule: Object.values(grouped) });
    }
    
    // Load Exams
    await loadExamsFromSupabase();
}

async function initAuth() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
        state.user = session.user;
        await loadUserData();
    }

    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
        updateState({ user: session?.user || null });
        if (session?.user) await loadUserData();
    });
}

async function downloadPDF() {
    if (!state.schedule.length) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("My Study Schedule", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated by ScheduleMe on ${new Date().toLocaleDateString()}`, 14, 30);

    const tableBody = [];
    state.schedule.forEach(day => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        day.sessions.forEach((sess, idx) => {
            const completionStatus = sess.completed ? "✓ Completed" : "☐ Pending";
            const ch = state.chapters.find(c => c.title === sess.chapter);
            const pageInfo = ch ? `p.${ch.pageStart}-${ch.pageEnd}` : "";
            tableBody.push([
                idx === 0 ? dateStr : "",
                sess.chapter,
                `${formatTime(sess.hours)} ${pageInfo} (${completionStatus})`,
                sess.priority.charAt(0).toUpperCase() + sess.priority.slice(1)
            ]);
        });
    });

    doc.autoTable({
        startY: 35,
        head: [['Date', 'Content / Section', 'Duration', 'Priority']],
        body: tableBody,
        theme: 'grid',
        headStyles: {
            fillColor: [42, 125, 117],
            textColor: 255,
            fontSize: 11
        },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 4 }
    });

    doc.save("study-schedule.pdf");
}

// Initialize
render();
initAuth();

// Drag and Drop Listeners
document.addEventListener('dragover', e => {
    e.preventDefault();
    const dz = document.getElementById('drop-zone');
    if (dz) dz.classList.add('dragging');
});
document.addEventListener('dragleave', e => {
    const dz = document.getElementById('drop-zone');
    if (dz) dz.classList.remove('dragging');
});
document.addEventListener('drop', e => {
    e.preventDefault();
    const dz = document.getElementById('drop-zone');
    if (dz) dz.classList.remove('dragging');
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
});