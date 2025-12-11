Tim.ai - AI-Powered Applicant Tracking System
A comprehensive HR Applicant Tracking System built for recruiters to manage job postings, track candidates, and automate interview workflows.

Architecture
Tim.ai is a full-stack ATS with separate recruiter and candidate experiences:

Recruiter Side (Authenticated): Dashboard, job management, candidate pipeline
Candidate Side (Public): Job browsing, applications, AI voice interviews
API Layer: Edge Functions for interview submissions and integrations
Features
1. Authentication
Email and password authentication via Supabase Auth
Secure recruiter accounts with profile management
Session management and protected routes
2. Job Management
Create, edit, duplicate, and delete job postings
Configure custom interview stages for each job
Set pass/fail thresholds per stage (0-100)
Draft, open, and closed job statuses
Auto-advance mode for automated candidate progression
Generate public embeddable job application links
3. Candidate Management
Track all candidates across multiple jobs
View candidate profiles with contact information
Resume/CV and LinkedIn profile links
Track candidate progress through interview stages
Add private recruiter notes
View interview scores and feedback
Communication history tracking
Manual stage progression controls
Quick actions: hire, reject, or move back to in-progress
4. Workflow Automation
Auto-advance candidates based on interview scores
Configurable pass thresholds per stage
Automatic rejection for below-threshold scores
System-generated communication logs for all actions
Real-time dashboard updates
5. Interview Integration
REST API endpoint for external voice interview systems
Automatic score recording and candidate progression
Webhook support for real-time updates
See API_DOCUMENTATION.md for integration details
6. Analytics Dashboard
Total open jobs count
Candidates in pipeline
Hires in last 7 days
Drop-off rate percentage
Visual stage funnel showing candidate distribution
Real-time data updates
7. Public Job Application
Clean, professional application pages
Mobile-responsive design
Direct candidate submission
Automatic candidate profile creation
Duplicate application prevention
8. Candidate Interview Flow
AI-powered voice interview integration
Welcome page with interview instructions
Multiple interview stages with progression
Real-time score submission and evaluation
Auto-advance between stages based on performance
Completion page with next steps
Email notifications and status updates
9. Public API Endpoints
Get candidate data endpoint
Submit interview results endpoint
N8N webhook integration for new candidates
Auto-advance logic based on stage settings
See CANDIDATE_API_DOCUMENTATION.md for details
Tech Stack
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
API: Supabase Edge Functions (Deno)
Icons: Lucide React
Database Schema
Tables
recruiters - Extends auth.users with recruiter profile data
jobs - Job postings with settings and public tokens
job_stages - Configurable workflow stages per job
candidates - Candidate profiles and contact information
applications - Links candidates to jobs, tracks status and current stage
stage_scores - Interview scores with feedback
recruiter_notes - Private notes on candidates
communication_logs - Complete communication history
All tables have Row Level Security (RLS) enabled with appropriate policies.

Getting Started
Prerequisites
Node.js 18+ installed
Supabase account and project
Installation
Clone the repository

Install dependencies:

npm install
Environment variables are already configured in .env:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

npm run dev
Build for production:

npm run build
Route Structure
Public Routes (No Authentication)
/jobs/{jobId} - Browse job details
/apply/{jobId} - Apply to job by ID
/apply/{token} - Apply to job by public token
/interview/{candidateId}/welcome - Interview welcome page
/interview/{candidateId}/{stageId} - Interview stage with voice UI
/interview/{candidateId}/complete - Interview completion
Recruiter Routes (Authentication Required)
/ - Dashboard homepage
/ with dashboard tabs - Overview, Jobs, Candidates
Usage
For Recruiters
Sign Up: Create your recruiter account
Create Jobs: Add job postings with custom interview stages
Share Links: Copy the public job link and share on your website or LinkedIn
Review Candidates: Track applicants through the pipeline
Manage Workflow: Move candidates between stages or enable auto-advance
Add Notes: Document your thoughts and feedback
Make Decisions: Hire the best candidates or reject others
For Candidates
Browse Jobs: Visit /jobs/{jobId} to view job details
Apply: Click "Apply" and fill out the application form
Start Interview: Automatically redirected to welcome page
Complete Stages: Progress through voice interview stages
Get Results: View completion page and await recruiter decision
Public Job Application
Candidates can apply through:

/jobs/{jobId} - Direct job page with Apply button
/apply/{jobId} - Application form by job ID
/apply/{token} - Application form by public token
Each job gets a unique public token for sharing on external sites.

External Integration
Voice interview systems can integrate via the API endpoint:

POST https://your-supabase-url.supabase.co/functions/v1/interview-webhook
See API_DOCUMENTATION.md for complete integration details.

Project Structure
src/
├── components/
│   ├── auth/              # Login and signup pages
│   ├── dashboard/         # Dashboard layout and overview
│   ├── jobs/              # Job management components
│   ├── candidates/        # Candidate management and details
│   └── public/            # Public job application page
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── database.types.ts  # TypeScript database types
└── App.tsx                # Main application component
Key Features Explained
Auto-Advance Mode
When enabled for a job:

Candidates automatically move to the next stage if their score meets the threshold
Candidates are automatically rejected if score is below threshold
All actions are logged in communication history
Recruiters are notified via the dashboard
When disabled:

Recruiters manually review scores
Manual decision required to advance or reject
Provides more control over hiring decisions
Stage Configuration
Each job can have custom stages:

Add or remove stages as needed
Set unique pass thresholds (0-100) per stage
Stages are ordered sequentially
Common stages: Screening, Technical, HR Interview, Final
Candidate Pipeline
Track candidates through stages:

Visual progress indicators
Score tracking per stage
Historical score data
Quick actions to move, hire, or reject
Security
Row Level Security (RLS) enabled on all tables
Recruiters can only access their own jobs and candidates
Public job pages only show open positions
Secure authentication via Supabase Auth
API endpoint accepts results from external systems
Performance
Efficient database queries with proper indexes
Real-time updates via Supabase
Optimistic UI updates for better UX
Lazy loading for large candidate lists
Browser Support
Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Contributing
This is a production-ready application built for recruiters. For feature requests or bug reports, please contact the development team.

License
Proprietary - All rights reserved
