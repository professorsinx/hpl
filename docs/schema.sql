-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  team_name text NOT NULL,
  hospital_name text NOT NULL,
  hospital_address text,
  captain_name text NOT NULL,
  captain_phone text NOT NULL,
  captain_email text NOT NULL,
  vice_captain_name text NOT NULL,
  vice_captain_phone text,
  registration_status text DEFAULT 'pending_verification'::text CHECK (registration_status = ANY (ARRAY['pending_verification'::text, 'verified'::text, 'rejected'::text])),
  payment_status text DEFAULT 'submitted'::text CHECK (payment_status = ANY (ARRAY['submitted'::text, 'verified'::text, 'failed'::text])),
  payment_utr text NOT NULL,
  entry_fee_amount numeric DEFAULT 10000,
  CONSTRAINT teams_pkey PRIMARY KEY (id)
);
CREATE TABLE public.players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  full_name text NOT NULL,
  gender text NOT NULL CHECK (gender = ANY (ARRAY['Male'::text, 'Female'::text, 'Other'::text])),
  designation_category text NOT NULL,
  employee_id_number text NOT NULL,
  id_card_url text,
  is_captain boolean DEFAULT false,
  is_vice_captain boolean DEFAULT false,
  is_reserve boolean DEFAULT false,
  CONSTRAINT players_pkey PRIMARY KEY (id),
  CONSTRAINT players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_number integer NOT NULL,
  stage text DEFAULT 'League'::text CHECK (stage = ANY (ARRAY['League'::text, 'Quarter Final'::text, 'Semi Final'::text, 'Final'::text])),
  team_a_id uuid NOT NULL,
  team_b_id uuid NOT NULL,
  scheduled_datetime timestamp with time zone NOT NULL,
  venue text DEFAULT 'Trichy (Ground TBA)'::text,
  toss_winner_id uuid,
  toss_decision text CHECK (toss_decision = ANY (ARRAY['Bat'::text, 'Bowl'::text])),
  status text DEFAULT 'scheduled'::text CHECK (status = ANY (ARRAY['scheduled'::text, 'live'::text, 'completed'::text, 'abandoned'::text])),
  team_a_runs integer DEFAULT 0,
  team_a_wickets integer DEFAULT 0,
  team_a_overs_faced numeric DEFAULT 0.0,
  team_b_runs integer DEFAULT 0,
  team_b_wickets integer DEFAULT 0,
  team_b_overs_faced numeric DEFAULT 0.0,
  winner_id uuid,
  super_over_played boolean DEFAULT false,
  win_description text,
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_team_a_id_fkey FOREIGN KEY (team_a_id) REFERENCES public.teams(id),
  CONSTRAINT matches_team_b_id_fkey FOREIGN KEY (team_b_id) REFERENCES public.teams(id),
  CONSTRAINT matches_toss_winner_id_fkey FOREIGN KEY (toss_winner_id) REFERENCES public.teams(id),
  CONSTRAINT matches_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.teams(id)
);