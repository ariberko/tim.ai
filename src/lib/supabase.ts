import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      recruiters: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          company_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          company_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          company_name?: string | null;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          recruiter_id: string;
          title: string;
          description: string;
          location: string | null;
          employment_type: string;
          salary_range: string | null;
          requirements: string | null;
          status: 'draft' | 'open' | 'closed';
          public_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recruiter_id: string;
          title: string;
          description: string;
          location?: string | null;
          employment_type?: string;
          salary_range?: string | null;
          requirements?: string | null;
          status?: 'draft' | 'open' | 'closed';
          public_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          recruiter_id?: string;
          title?: string;
          description?: string;
          location?: string | null;
          employment_type?: string;
          salary_range?: string | null;
          requirements?: string | null;
          status?: 'draft' | 'open' | 'closed';
          public_token?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_stages: {
        Row: {
          id: string;
          job_id: string;
          name: string;
          order_num: number;
          pass_threshold: number;
          auto_advance: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          name: string;
          order_num: number;
          pass_threshold?: number;
          auto_advance?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          name?: string;
          order_num?: number;
          pass_threshold?: number;
          auto_advance?: boolean;
          created_at?: string;
        };
      };
      candidates: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          resume_url: string | null;
          linkedin_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          resume_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          resume_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          current_stage_id: string | null;
          status: 'active' | 'hired' | 'rejected';
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          current_stage_id?: string | null;
          status?: 'active' | 'hired' | 'rejected';
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          current_stage_id?: string | null;
          status?: 'active' | 'hired' | 'rejected';
          applied_at?: string;
          updated_at?: string;
        };
      };
      stage_scores: {
        Row: {
          id: string;
          application_id: string;
          stage_id: string;
          score: number;
          feedback: string | null;
          scored_by: string | null;
          scored_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          stage_id: string;
          score: number;
          feedback?: string | null;
          scored_by?: string | null;
          scored_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          stage_id?: string;
          score?: number;
          feedback?: string | null;
          scored_by?: string | null;
          scored_at?: string;
        };
      };
      recruiter_notes: {
        Row: {
          id: string;
          application_id: string;
          recruiter_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          recruiter_id: string;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          recruiter_id?: string;
          note?: string;
          created_at?: string;
        };
      };
      communication_logs: {
        Row: {
          id: string;
          application_id: string;
          recruiter_id: string;
          type: 'email' | 'phone' | 'interview' | 'message' | 'other';
          subject: string | null;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          recruiter_id: string;
          type: 'email' | 'phone' | 'interview' | 'message' | 'other';
          subject?: string | null;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          recruiter_id?: string;
          type?: 'email' | 'phone' | 'interview' | 'message' | 'other';
          subject?: string | null;
          content?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
