import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Phone, ExternalLink, MessageSquare, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import CandidateDetailsModal from './CandidateDetailsModal';

interface Application {
  id: string;
  job_id: string;
  status: 'active' | 'hired' | 'rejected';
  applied_at: string;
  candidate: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    resume_url: string | null;
    linkedin_url: string | null;
  };
  job: {
    title: string;
  };
  current_stage: {
    name: string;
  } | null;
}

export default function CandidatesManagement() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hired' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('recruiter_id', user!.id);

      if (!jobs || jobs.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          status,
          applied_at,
          candidates (
            id,
            full_name,
            email,
            phone,
            resume_url,
            linkedin_url
          ),
          jobs (title),
          current_stage_id,
          job_stages!applications_current_stage_id_fkey (name)
        `)
        .in('job_id', jobs.map((j) => j.id))
        .order('applied_at', { ascending: false });

      if (error) throw error;

      const formattedApplications = data?.map((app: any) => ({
        id: app.id,
        job_id: app.job_id,
        status: app.status,
        applied_at: app.applied_at,
        candidate: app.candidates,
        job: app.jobs,
        current_stage: app.job_stages,
      })) || [];

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: 'active' | 'hired' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredApplications = applications.filter((app) =>
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Candidates</h1>
        <p className="text-slate-600">Manage applications and track candidate progress</p>
      </div>

      <div className="flex space-x-2">
        {['all', 'active', 'hired', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
              filterStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No candidates yet
          </h3>
          <p className="text-slate-600">
            {filterStatus === 'all'
              ? 'Applications will appear here once candidates apply to your jobs'
              : `No ${filterStatus} candidates at the moment`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {application.candidate.full_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === 'hired'
                          ? 'bg-green-100 text-green-700'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-3">{application.job.title}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{application.candidate.email}</span>
                    </div>
                    {application.candidate.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{application.candidate.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {application.candidate.resume_url && (
                      <a
                        href={application.candidate.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-900 hover:underline flex items-center space-x-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Resume</span>
                      </a>
                    )}
                    {application.candidate.linkedin_url && (
                      <a
                        href={application.candidate.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-900 hover:underline flex items-center space-x-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 ml-4">
                  <span className="text-sm text-slate-500">
                    Applied {formatDate(application.applied_at)}
                  </span>
                  {application.current_stage && (
                    <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {application.current_stage.name}
                    </span>
                  )}
                  <div className="flex items-center space-x-2">
                    {application.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(application.id, 'hired')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Mark as hired"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(application.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Reject candidate"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                      title="View details"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApplication && (
        <CandidateDetailsModal
          application={selectedApplication}
          onClose={() => {
            setSelectedApplication(null);
            loadApplications();
          }}
        />
      )}
    </div>
  );
}
