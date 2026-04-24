# ScheduleMe - Final Setup Instructions

## Overview
You now have a complete full-stack study planner with Supabase backend. All data persists across sessions including:
- User profiles and settings
- Uploaded files and AI analysis
- Parsed chapters/sections
- Generated study schedules
- User-added exams/milestones

## Setup Steps

### 1. Create Supabase Account & Project
1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details and create
4. Wait for project to initialize (may take a few minutes)

### 2. Get Your API Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy:
   - **Project URL** (under "Project URL")
   - **anon public key** (under "Project API keys" → "anon public")

### 3. Configure the Frontend
1. Open `scheduleme/script.js` in a text editor
2. Replace the placeholder values (lines 2-3):
   ```javascript
   const supabaseUrl = 'https://aipglsdqerxuphdtrhgj.supabase.co'; // REPLACE THIS
   const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcGdsc2RxZXJ4dXBoZHRyaGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTIyMTgsImV4cCI6MjA5MjUyODIxOH0.SJk-4R_7fxjApYABtrSQvNK8p6UDBU0y0TU2yju4GtY'; // REPLACE THIS
   ```
3. Save the file

### 4. Set Up the Database
1. In your Supabase project, go to the SQL Editor (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL commands

### 5. Test Your Application
1. Open `scheduleme/index.html` in your web browser
2. You should see the ScheduleMe application
3. Click "Sign In" → "Sign up" to create an account
4. Verify you receive a confirmation email (check spam folder)
5. Sign in with your credentials
6. Upload a study file (PDF, image, or text document)
7. Wait for AI analysis to complete
8. Review/customize chapters if desired
9. Set your deadline, daily study time, and preferred days in Settings
10. Add some exams/milestones in Settings
11. Click "Generate My Schedule"
12. View your personalized study schedule
13. Mark sessions as complete using checkboxes
14. Click "Download PDF" to export your schedule
15. Refresh the page - all your data should still be there!

## Troubleshooting

### Common Issues:
- **Authentication errors**: Double-check your Supabase URL and anon key
- **Database connection errors**: Ensure you ran the SQL schema correctly
- **CORS errors**: Make sure your Supabase project settings allow requests from your domain
- **AI analysis not working**: The app uses external APIs (Gemini/Anthropic) - you may need to provide API keys in browser console for full functionality

### Verification:
To verify your setup worked:
1. After signing up, go to your Supabase dashboard
2. Visit Authentication → Users to see your account
3. Visit Tables to see data in: profiles, files, chapters, sessions, exams
4. Data should appear as you use the application

## Features Working:
✅ User authentication (email/password)
✅ File upload and storage
✅ AI-powered document analysis (with external API)
✅ Chapter/section parsing and customization
✅ Personalized study schedule generation
✅ Progress tracking with checkboxes
✅ Exam/milestone management
✅ PDF export functionality
✅ Dark/light mode toggle
✅ Data persistence via Supabase
✅ Row Level Security (data privacy)

## Free Tier Limits:
Your Supabase free tier includes:
- 500 MB database storage
- 2 GB file storage  
- 500 MB bandwidth
- Suitable for personal/student use

## Support:
If you encounter issues:
1. Check your browser's developer console (F12) for error messages
2. Verify your Supabase credentials are correct
3. Ensure you ran the SQL schema without errors
4. Confirm your internet connection is working

Enjoy your personalized AI-powered study planner!