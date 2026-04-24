# ScheduleMe - AI Study Planner

A full-stack study planner that uses AI to analyze your study materials and generate personalized study schedules.

## Features
- AI-powered document analysis (PDF, images, text)
- Personalized study schedule generation
- Progress tracking
- Exam/milestone management
- User authentication and data persistence
- Dark/light mode
- PDF export

## Backend Setup with Supabase

This application uses Supabase as its backend. Follow these steps to set up:

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) and sign up/login
- Create a new project
- Note your project URL and anon key from Settings > API

### 2. Configure Frontend
Edit `scheduleme/script.js` and replace:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Set Up Database
1. In your Supabase project, go to SQL Editor
2. Copy and paste the contents of `supabase_schema.sql` (in project root)
3. Click "Run" to execute the SQL

### 4. Database Schema
The schema creates these tables with Row Level Security (RLS):
- **profiles**: User settings (deadline, daily_hours, preferred_days)
- **files**: Uploaded file metadata with AI analysis results
- **chapters**: Parsed content sections from files
- **sessions**: Generated study schedule sessions
- **exams**: User-added exams/milestones

### 5. Security
Row Level Security policies ensure users can only access their own data.

### 6. Free Tier
Supabase free tier includes 500 MB database, 2 GB file storage, and 500 MB bandwidth.

## Usage
1. Open `scheduleme/index.html` in your browser
2. Sign up or login
3. Upload your study materials (PDF, images, text)
4. AI analyzes the content and extracts chapters/sections
5. Customize chapters (priority, skip, custom hours)
6. Generate your personalized study schedule
7. Track progress and export to PDF

## Files
- `index.html`: Main HTML file
- `style.css`: Styling
- `script.js`: Application logic with Supabase integration
- `supabase_schema.sql`: Database schema for Supabase setup
- `SUPABASE_SETUP.md`: Detailed setup instructions

## Technologies
- Frontend: HTML, CSS, JavaScript
- Backend: Supabase (PostgreSQL + Auth)
- AI: Uses external APIs (Gemini/Anthropic) for document analysis
- PDF generation: jsPDF + jsPDF-autotable