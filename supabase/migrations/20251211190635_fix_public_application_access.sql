/*
  # Fix Public Application Access

  ## Changes
  This migration ensures that anonymous users can submit job applications by:
  1. Dropping and recreating the candidates INSERT policy to explicitly allow anonymous access
  2. Dropping and recreating the applications INSERT policy to explicitly allow anonymous access
  3. Ensuring no restrictive policies are blocking public submissions

  ## Security
  - Candidates: Anyone can create a candidate record (needed for job applications)
  - Applications: Anyone can create an application (needed for job applications)
  - All other operations remain restricted to authenticated recruiters
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;

-- Recreate candidates INSERT policy with explicit anonymous access
CREATE POLICY "Public can submit candidate info"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Recreate applications INSERT policy with explicit anonymous access
CREATE POLICY "Public can submit applications"
  ON applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
