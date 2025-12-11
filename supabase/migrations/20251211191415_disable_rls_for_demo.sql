/*
  # Disable RLS for Demo

  ## Changes
  Disables Row Level Security on candidates and applications tables
  to allow public job applications to work without authentication.
  
  **WARNING: This is for demo purposes only. Not for production use.**

  ## Tables Modified
  - `candidates` - RLS disabled
  - `applications` - RLS disabled
*/

-- Disable RLS on candidates table
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;

-- Disable RLS on applications table
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on all other tables for recruiter data protection
