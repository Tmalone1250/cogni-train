/*
  # Add RLS policies for users table

  1. Security Changes
    - Add policy for users to insert their own profile
    - Add policy for users to update their own profile
    - Add policy for users to read their own profile

  This migration ensures users can:
    - Create their initial profile during signup
    - Update their own profile information
    - Read their own profile data
*/

-- Enable RLS if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for inserting own profile
CREATE POLICY "Users can create their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for updating own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for reading own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);