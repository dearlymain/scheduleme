# Supabase Setup for ScheduleMe

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Note your project URL and anon key from Settings > API

## 2. Configure Frontend
Edit `scheduleme/script.js` and replace:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

## 3. Set Up Database
1. In your Supabase project, go to SQL Editor
2. Copy and paste the contents of `supabase_schema.sql`
3. Click "Run" to execute the SQL

## 4. Database Schema Overview
The schema creates these tables with Row Level Security (RLS):

### profiles
- Stores user settings: deadline, daily_hours, preferred_days
- One-to-one with auth.users

### files
- Stores uploaded file metadata
- analysis: JSONB field containing AI analysis results

### chapters
- Stores parsed content sections from files
- Linked to files via file_id

### sessions
- Stores generated study schedule sessions
- One session per chapter slot per day

### exams
- Stores user-added exams/milestones

## 5. Security
Row Level Security policies ensure users can only access their own data.
All tables have policies for SELECT, INSERT, UPDATE, DELETE restricted to the owning user.

## 6. Optional: Enable Real-time
To enable real-time updates (optional):
1. Go to Database > Replication
2. Toggle replication on for the tables you want (files, chapters, sessions, exams, profiles)

## 7. Testing
After setup:
1. Run your frontend (open scheduleme/index.html in browser)
2. Sign up/login with Supabase
3. Upload a file to test the full flow
4. Check that data appears in Supabase dashboard tables

## 8. Free Tier Notes
Supabase free tier includes:
- 500 MB database
- 2 GB file storage
- 500 MB bandwidth
- Suitable for small to medium usage