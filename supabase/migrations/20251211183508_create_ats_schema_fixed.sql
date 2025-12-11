/*
  # Tim.ai ATS Database Schema

  ## Overview
  Complete schema for an Applicant Tracking System (ATS) with recruiter authentication,
  job management, candidate pipeline tracking, interview stages, and analytics.

  ## 1. New Tables

  ### `recruiters`
  - `id` (uuid, primary key) - Unique identifier, links to auth.users
  - `email` (text, unique) - Recruiter email address
  - `full_name` (text) - Recruiter's full name
  - `company_name` (text) - Company/organization name
  - `created_at` (timestamptz) - Account creation timestamp

  ### `jobs`
  - `id` (uuid, primary key) - Unique job identifier
  - `recruiter_id` (uuid, foreign key) - Links to recruiters table
  - `title` (text) - Job title/position name
  - `description` (text) - Detailed job description
  - `location` (text) - Job location
  - `employment_type` (text) - Full-time, Part-time, Contract, etc.
  - `salary_range` (text) - Salary information
  - `requirements` (text) - Job requirements and qualifications
  - `status` (text) - open, closed, draft
  - `public_token` (uuid) - Unique token for public job page URLs
  - `created_at` (timestamptz) - Job creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `job_stages`
  - `id` (uuid, primary key) - Unique stage identifier
  - `job_id` (uuid, foreign key) - Links to jobs table
  - `name` (text) - Stage name (e.g., "Phone Screen", "Technical Interview")
  - `order_num` (integer) - Stage order in the pipeline
  - `pass_threshold` (integer) - Minimum score to pass this stage
  - `auto_advance` (boolean) - Whether to automatically advance candidates who pass
  - `created_at` (timestamptz) - Stage creation timestamp

  ### `candidates`
  - `id` (uuid, primary key) - Unique candidate identifier
  - `email` (text) - Candidate email address
  - `full_name` (text) - Candidate's full name
  - `phone` (text) - Phone number
  - `resume_url` (text) - URL to resume/CV
  - `linkedin_url` (text) - LinkedIn profile URL
  - `created_at` (timestamptz) - Record creation timestamp

  ### `applications`
  - `id` (uuid, primary key) - Unique application identifier
  - `job_id` (uuid, foreign key) - Links to jobs table
  - `candidate_id` (uuid, foreign key) - Links to candidates table
  - `current_stage_id` (uuid, foreign key) - Links to job_stages table
  - `status` (text) - active, hired, rejected
  - `applied_at` (timestamptz) - Application submission timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `stage_scores`
  - `id` (uuid, primary key) - Unique score identifier
  - `application_id` (uuid, foreign key) - Links to applications table
  - `stage_id` (uuid, foreign key) - Links to job_stages table
  - `score` (integer) - Numeric score for this stage
  - `feedback` (text) - Detailed feedback/notes
  - `scored_by` (uuid, foreign key) - Recruiter who scored (links to recruiters)
  - `scored_at` (timestamptz) - Scoring timestamp

  ### `recruiter_notes`
  - `id` (uuid, primary key) - Unique note identifier
  - `application_id` (uuid, foreign key) - Links to applications table
  - `recruiter_id` (uuid, foreign key) - Links to recruiters table
  - `note` (text) - Note content
  - `created_at` (timestamptz) - Note creation timestamp

  ### `communication_logs`
  - `id` (uuid, primary key) - Unique log identifier
  - `application_id` (uuid, foreign key) - Links to applications table
  - `recruiter_id` (uuid, foreign key) - Links to recruiters table
  - `type` (text) - email, phone, interview, etc.
  - `subject` (text) - Communication subject/title
  - `content` (text) - Communication content/notes
  - `created_at` (timestamptz) - Log creation timestamp

  ## 2. Security

  All tables have Row Level Security (RLS) enabled with policies that:
  - Recruiters can only access their own data
  - Public job pages are accessible via public_token
  - Candidates can submit applications without authentication
  - Authenticated recruiters have full CRUD on their resources

  ## 3. Important Notes

  - Email uniqueness enforced for both recruiters and candidates
  - Cascade deletes configured to maintain referential integrity
  - Indexes added for frequently queried columns (foreign keys, status fields)
  - Default values set for timestamps, status fields, and booleans
  - Public tokens auto-generated for sharing job listings externally
*/

-- Create recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  company_name text,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  employment_type text DEFAULT 'Full-time',
  salary_range text,
  requirements text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  public_token uuid UNIQUE DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_stages table
CREATE TABLE IF NOT EXISTS job_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_num integer NOT NULL,
  pass_threshold integer DEFAULT 70,
  auto_advance boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  resume_url text,
  linkedin_url text,
  created_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  current_stage_id uuid REFERENCES job_stages(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'hired', 'rejected')),
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create stage_scores table
CREATE TABLE IF NOT EXISTS stage_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES job_stages(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback text,
  scored_by uuid REFERENCES recruiters(id) ON DELETE SET NULL,
  scored_at timestamptz DEFAULT now(),
  UNIQUE(application_id, stage_id)
);

-- Create recruiter_notes table
CREATE TABLE IF NOT EXISTS recruiter_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  recruiter_id uuid NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create communication_logs table
CREATE TABLE IF NOT EXISTS communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  recruiter_id uuid NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('email', 'phone', 'interview', 'message', 'other')),
  subject text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

-- Recruiters policies
CREATE POLICY "Recruiters can view own profile"
  ON recruiters FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Recruiters can update own profile"
  ON recruiters FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON recruiters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Recruiters can view own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can insert own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = recruiter_id)
  WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = recruiter_id);

CREATE POLICY "Public can view open jobs"
  ON jobs FOR SELECT
  TO anon
  USING (status = 'open');

-- Job stages policies
CREATE POLICY "Recruiters can view stages for own jobs"
  ON job_stages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_stages.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can insert stages for own jobs"
  ON job_stages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_stages.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update stages for own jobs"
  ON job_stages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_stages.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_stages.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can delete stages for own jobs"
  ON job_stages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_stages.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Public can view stages for open jobs"
  ON job_stages FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_stages.job_id
      AND jobs.status = 'open'
    )
  );

-- Candidates policies
CREATE POLICY "Anyone can insert candidates"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Recruiters can view candidates for own jobs"
  ON candidates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.candidate_id = candidates.id
      AND jobs.recruiter_id = auth.uid()
    )
  );

-- Applications policies
CREATE POLICY "Anyone can insert applications"
  ON applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Recruiters can view applications for own jobs"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update applications for own jobs"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can delete applications for own jobs"
  ON applications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

-- Stage scores policies
CREATE POLICY "Recruiters can view scores for own jobs"
  ON stage_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = stage_scores.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can insert scores for own jobs"
  ON stage_scores FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = stage_scores.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update scores for own jobs"
  ON stage_scores FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = stage_scores.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = stage_scores.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

-- Recruiter notes policies
CREATE POLICY "Recruiters can view notes for own jobs"
  ON recruiter_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = recruiter_notes.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can insert notes for own jobs"
  ON recruiter_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = recruiter_id AND
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = recruiter_notes.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can delete own notes"
  ON recruiter_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = recruiter_id);

-- Communication logs policies
CREATE POLICY "Recruiters can view logs for own jobs"
  ON communication_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = communication_logs.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can insert logs for own jobs"
  ON communication_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = recruiter_id AND
    EXISTS (
      SELECT 1 FROM applications
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = communication_logs.application_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_public_token ON jobs(public_token);
CREATE INDEX IF NOT EXISTS idx_job_stages_job ON job_stages(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_stage_scores_application ON stage_scores(application_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_notes_application ON recruiter_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_application ON communication_logs(application_id);