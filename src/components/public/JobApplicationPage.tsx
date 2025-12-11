import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import HRInterviewPage from './HRInterviewPage';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  employment_type: string;
  salary_range: string | null;
  requirements: string | null;
  recruiter: {
    company_name: string | null;
  };
}

interface JobApplicationPageProps {
  token: string;
}

export default function JobApplicationPage({ token }: JobApplicationPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume_url: '',
    linkedin_url: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadJob();
  }, [token]);

  const loadJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          location,
          employment_type,
          salary_range,
          requirements,
          recruiters (company_name)
        `)
        .eq('public_token', token)
        .eq('status', 'open')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setJob({
          ...data,
          recruiter: data.recruiters,
        });
      }
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let candidateId: string;

      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingCandidate) {
        candidateId = existingCandidate.id;
      } else {
        const { data: newCandidate, error: candidateError } = await supabase
          .from('candidates')
          .insert({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || null,
            resume_url: formData.resume_url || null,
            linkedin_url: formData.linkedin_url || null,
          })
          .select()
          .single();

        if (candidateError) throw candidateError;
        candidateId = newCandidate.id;
      }

      const { data: stages } = await supabase
        .from('job_stages')
        .select('id')
        .eq('job_id', job!.id)
        .order('order_num')
        .limit(1);

      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job!.id,
          candidate_id: candidateId,
          current_stage_id: stages && stages.length > 0 ? stages[0].id : null,
          status: 'active',
        });

      if (applicationError) {
        if (applicationError.code === '23505') {
          setError('You have already applied to this position.');
          return;
        }
        throw applicationError;
      }

      setSubmitted(true);
      setTimeout(() => {
        setShowInterview(true);
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setError(error.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Job Not Found
          </h1>
          <p className="text-slate-600">
            This job posting is no longer available.
          </p>
        </div>
      </div>
    );
  }

  if (showInterview) {
    return (
      <HRInterviewPage
        candidateName={formData.full_name}
        jobTitle={job?.title || 'this position'}
      />
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-slate-600 mb-4">
            Redirecting you to the HR interview...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-slate-900 text-white p-8">
            <div className="mb-4">
              {job.recruiter.company_name && (
                <p className="text-slate-300 text-sm mb-2">
                  {job.recruiter.company_name}
                </p>
              )}
              <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-slate-200">
                {job.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{job.employment_type}</span>
                </div>
                {job.salary_range && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                About the Role
              </h2>
              <p className="text-slate-700 whitespace-pre-wrap">
                {job.description}
              </p>

              {job.requirements && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                    Requirements
                  </h2>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </>
              )}
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-slate-900 text-white py-4 px-6 rounded-lg hover:bg-slate-800 transition font-medium text-lg"
              >
                Apply Now
              </button>
            ) : (
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Submit Your Application
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Resume URL
                    </label>
                    <input
                      type="url"
                      name="resume_url"
                      value={formData.resume_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-slate-900 text-white py-3 px-6 rounded-lg hover:bg-slate-800 transition font-medium"
                    >
                      Submit Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
